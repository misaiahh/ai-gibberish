import { config } from '../config.js'

const STORAGE_MAP = {
  local: localStorage,
  session: sessionStorage,
}

const storage = STORAGE_MAP[config.storageType]

if (!storage) {
  throw new Error(`Unknown storage type: ${config.storageType}`)
}

/**
 * Retrieves todos from storage.
 * @returns {Array<{id: number, text: string, completed: boolean}>}
 */
export function loadTodos() {
  try {
    const data = storage.getItem(config.storageKey)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * Saves todos to storage.
 * @param {Array<{id: number, text: string, completed: boolean}>} todos
 */
export function saveTodos(todos) {
  storage.setItem(config.storageKey, JSON.stringify(todos))
}

/**
 * Clears all todos from storage.
 */
export function clearTodos() {
  storage.removeItem(config.storageKey)
}
