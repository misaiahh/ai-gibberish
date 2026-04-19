import { get, set, remove } from '../service/storageService.js'

/**
 * @typedef {{id: number, text: string, completed: boolean}} Todo
 */

/**
 * Creates a new todo store with isolated state and persistence.
 * @returns {{
 *   create: (text: string) => Todo,
 *   getAll: () => Todo[],
 *   delete: (id: number) => void,
 *   toggle: (id: number) => void,
 *   clearCompleted: () => void,
 *   getActiveCount: () => number,
 *   getCompletedCount: () => number,
 *   reset: () => void
 * }}
 */
export function todoFactory() {
  /** @type {Todo[]} */
  const todos = /** @type {Todo[]} */ (get() || [])

  /** @type {number} */
  let nextId = 1
  for (const todo of todos) {
    if (todo.id >= nextId) nextId = todo.id + 1
  }

  /**
   * Persists todos to storage.
   */
  function persist() {
    set(todos)
  }

  return {
    /**
     * Creates a new todo.
     * @param {string} text
     * @returns {Todo}
     */
    create(text) {
      const todo = {
        id: nextId++,
        text: text.trim(),
        completed: false,
      }
      todos.push(todo)
      persist()
      return todo
    },

    /**
     * Returns all todos.
     * @returns {Todo[]}
     */
    getAll() {
      return todos
    },

    /**
     * Deletes a todo by ID.
     * @param {number} id
     */
    delete(id) {
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
          todos.splice(i, 1)
          persist()
          return
        }
      }
    },

    /**
     * Toggles the completed status of a todo by ID.
     * @param {number} id
     */
    toggle(id) {
      for (const todo of todos) {
        if (todo.id === id) {
          todo.completed = !todo.completed
          persist()
          return
        }
      }
    },

    /**
     * Removes all completed todos.
     */
    clearCompleted() {
      for (let i = todos.length - 1; i >= 0; i--) {
        if (todos[i].completed) {
          todos.splice(i, 1)
          persist()
        }
      }
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
    reset() {
      todos.length = 0
      nextId = 1
      remove()
    },
  }
}
