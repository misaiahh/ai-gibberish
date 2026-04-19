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
 * Retrieves data from storage by key.
 * @returns {unknown}
 */
export function get() {
  try {
    const data = storage.getItem(config.storageKey)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

/**
 * Saves data to storage.
 * @param {unknown} data
 */
export function set(data) {
  storage.setItem(config.storageKey, JSON.stringify(data))
}

/**
 * Clears data from storage.
 */
export function remove() {
  storage.removeItem(config.storageKey)
}
