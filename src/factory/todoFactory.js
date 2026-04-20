import { apiService } from '../service/apiService.js'

/**
 * @typedef {{id: string, title: string, completed: boolean, createdAt: string, updatedAt: string}} Todo
 */

/**
 * Creates a new todo store backed by the remote API.
 * @returns {{
 *   create: (title: string) => Promise<Todo>,
 *   getAll: () => Promise<Todo[]>,
 *   get: () => Todo[],
 *   delete: (id: string) => Promise<void>,
 *   toggle: (id: string) => Promise<Todo>,
 *   clearCompleted: () => Promise<void>,
 *   getActiveCount: () => number,
 *   getCompletedCount: () => number,
 *   reset: () => Promise<void>
 * }}
 */
export function todoFactory() {
  /** @type {Todo[]} */
  let todos = []

  async function refresh() {
    const data = await apiService.getAll()
    if (data.length) todos = data
  }

  return {
    /**
     * Creates a new todo.
     * @param {string} title
     * @returns {Promise<Todo>}
     */
    async create(title) {
      const todo = await apiService.create(title)
      todos.push(todo)
      return todo
    },

    /**
     * Fetches and returns all todos from API.
     * @returns {Promise<Todo[]>}
     */
    async getAll() {
      await refresh()
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
      await apiService.remove(id)
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
          todos.splice(i, 1)
          return
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
      const updated = await apiService.update(id, { completed: !todo.completed })
      todo.completed = updated.completed
      todo.title = updated.title
      todo.updatedAt = updated.updatedAt
      return todo
    },

    /**
     * Removes all completed todos.
     */
    async clearCompleted() {
      const completed = todos.filter((t) => t.completed)
      for (const todo of completed) {
        await apiService.remove(todo.id)
      }
      todos = todos.filter((t) => !t.completed)
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
     * Resets the store (useful for tests).
     */
    async reset() {
      await this.clearCompleted()
      todos.length = 0
    },
  }
}
