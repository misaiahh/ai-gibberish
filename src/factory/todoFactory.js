import { apiService } from '../service/apiService.js'
import { storageService } from '../service/storageService.js'
import { config } from '../config.js'

/**
 * @typedef {{id: string, title: string, completed: boolean, createdAt: string, updatedAt: string}} Todo
 */

/**
 * Creates a new todo store backed by the remote API with localStorage persistence for offline access.
 * @returns {{
 *   create: (title: string) => Promise<Todo>,
 *   getAll: () => Promise<Todo[]>,
 *   get: () => Todo[],
 *   delete: (id: string) => Promise<void>,
 *   toggle: (id: string) => Promise<Todo>,
 *   clearCompleted: () => Promise<void>,
 *   getActiveCount: () => number,
 *   getCompletedCount: () => number,
 *   onStatusChange: (fn: (isOnline: boolean) => void) => () => void,
 *   sync: () => Promise<void>,
 *   reset: () => Promise<void>
 * }}
 */
export function todoFactory() {
  /** @type {Todo[]} */
  let todos = []
  /** @type {boolean} */
  let online = true
  /** @type {Set<Function>} */
  const listeners = new Set()

  function isStorageEnabled() {
    return config.storageDisabled === false
  }

  function notifyStatus() {
    for (const fn of listeners) {
      fn(online)
    }
  }

  /**
   * Loads todos from localStorage into memory.
   */
  function loadFromStorage() {
    if (!isStorageEnabled()) return
    try {
      const data = storageService.get()
      if (Array.isArray(data) && data.length) {
        todos = data
      }
    } catch {
      // Corrupted storage — ignore, start fresh
    }
  }

  /**
   * Persists todos to localStorage.
   */
  function saveToStorage() {
    if (!isStorageEnabled()) return
    storageService.set(todos)
  }

  /**
   * Fetches all todos from API and reconciles with local state.
   * Server data wins for items that exist on both sides.
   * Local-only items are pushed to the API on next sync.
   */
  async function syncWithAPI() {
    if (!config.serverStorageEnabled) return

    try {
      const serverTodos = await apiService.getAll()
      const serverIds = new Set(serverTodos.map((t) => t.id))

      // Remove local items that were deleted on server
      todos = todos.filter((t) => serverIds.has(t.id))

      // Update existing items with server data
      const serverMap = new Map(serverTodos.map((t) => [t.id, t]))
      for (const todo of todos) {
        if (serverMap.has(todo.id)) {
          Object.assign(todo, serverMap.get(todo.id))
        }
      }

      // Push local-only items to API (offline creations)
      const localOnly = todos.filter((t) => !serverIds.has(t.id))
      for (const localTodo of localOnly) {
        try {
          const serverTodo = await apiService.create(localTodo.title)
          Object.assign(localTodo, serverTodo)
        } catch {
          // Keep local version if API fails during sync
        }
      }

      saveToStorage()
    } catch {
      // Network unreachable — stay offline
      online = false
    }
  }

  /**
   * Refreshes todos from the API (used for initial load).
   */
  async function refresh() {
    const data = await apiService.getAll()
    if (data.length) todos = data
  }

  function markOnline() {
    online = true
    notifyStatus()
    syncWithAPI()
  }

  function initOnlineListener() {
    if ('navigator' in globalThis && typeof navigator.onLine === 'boolean') {
      window.addEventListener('online', markOnline)
      window.addEventListener('offline', () => {
        online = false
        notifyStatus()
      })
    }
  }

  initOnlineListener()

  return {
    /**
     * Creates a new todo. Optimistic: applies immediately to memory + storage.
     * @param {string} title
     * @returns {Promise<Todo>}
     */
    async create(title) {
      const todo = {
        id: crypto.randomUUID(),
        title: title.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      todos.push(todo)
      saveToStorage()

      if (config.serverStorageEnabled && online) {
        try {
          const serverTodo = await apiService.create(title)
          Object.assign(todo, serverTodo)
          saveToStorage()
        } catch {
          online = false
        }
      }
      return todo
    },

    /**
     * Fetches and returns all todos from API.
     * Loads from localStorage first for instant display, then syncs with API.
     * @returns {Promise<Todo[]>}
     */
    async getAll() {
      loadFromStorage()

      if (config.serverStorageEnabled && online) {
        try {
          await refresh()
          saveToStorage()
        } catch {
          online = false
          // Fall back to localStorage data already loaded
        }
      }
      return todos
    },

    /**
     * Returns cached todos without fetching.
     * @returns {Todo[]}
     */
    get() {
      return todos
    },

    /**
     * Deletes a todo by ID.
     * @param {string} id
     */
    async delete(id) {
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
          todos.splice(i, 1)
          saveToStorage()
          break
        }
      }

      if (config.serverStorageEnabled && online) {
        try {
          await apiService.remove(id)
        } catch {
          online = false
        }
      }
    },

    /**
     * Toggles the completed status of a todo by ID.
     * @param {string} id
     * @returns {Promise<Todo>}
     */
    async toggle(id) {
      const todo = todos.find((t) => t.id === id)
      if (!todo) return
      todo.completed = !todo.completed
      todo.updatedAt = new Date().toISOString()
      saveToStorage()

      if (config.serverStorageEnabled && online) {
        try {
          const updated = await apiService.update(id, { completed: todo.completed })
          Object.assign(todo, updated)
          saveToStorage()
        } catch {
          online = false
        }
      }
      return todo
    },

    /**
     * Removes all completed todos.
     */
    async clearCompleted() {
      const completed = todos.filter((t) => t.completed)
      if (config.serverStorageEnabled && online) {
        for (const todo of completed) {
          try {
            await apiService.remove(todo.id)
          } catch {
            online = false
            // Continue removing remaining items from local state
          }
        }
      }
      todos = todos.filter((t) => !t.completed)
      saveToStorage()
    },

    /**
     * Returns the number of active (non-completed) todos.
     * @returns {number}
     */
    getActiveCount() {
      let count = 0
      for (const todo of todos) {
        if (!todo.completed) count++
      }
      return count
    },

    /**
     * Returns the number of completed todos.
     * @returns {number}
     */
    getCompletedCount() {
      let count = 0
      for (const todo of todos) {
        if (todo.completed) count++
      }
      return count
    },

    /**
     * Syncs local state with the API (used when coming back online).
     */
    async sync() {
      if (!online) {
        await syncWithAPI()
      }
    },

    /**
     * Subscribes to online/offline status changes.
     * @param {(isOnline: boolean) => void} fn
     * @returns {() => void} Unsubscribe function
     */
    onStatusChange(fn) {
      listeners.add(fn)
      return () => { listeners.delete(fn) }
    },

    /**
     * Resets the store (useful for tests).
     */
    async reset() {
      await this.clearCompleted()
      todos.length = 0
      saveToStorage()
    },
  }
}
