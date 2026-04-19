import { config } from '../config.js'

const STORAGE_MAP = {
  local: localStorage,
  session: sessionStorage,
}

const storage = STORAGE_MAP[config.storageType]

if (!storage) {
  throw new Error(`Unknown storage type: ${config.storageType}`)
}

export class StorageService {
  #storage = storage
  #key = config.storageKey

  /**
   * Retrieves data from storage.
   * @returns {unknown}
   */
  get() {
    if (config.storageDisabled) return null
    try {
      const data = this.#storage.getItem(this.#key)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }

  /**
   * Saves data to storage.
   * @param {unknown} data
   */
  set(data) {
    if (config.storageDisabled) return
    this.#storage.setItem(this.#key, JSON.stringify(data))
  }

  /**
   * Clears data from storage.
   */
  remove() {
    if (config.storageDisabled) return
    this.#storage.removeItem(this.#key)
  }

  /**
   * Wipes all app data from storage.
   */
  wipe() {
    this.#storage.removeItem(this.#key)
  }
}

export const storageService = new StorageService()
