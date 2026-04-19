import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { get, set, remove } from '../../src/service/storageService.js'
import { config } from '../../src/config.js'

describe('storageService', () => {
  beforeEach(() => {
    localStorage.removeItem(config.storageKey)
  })

  afterEach(() => {
    localStorage.removeItem(config.storageKey)
  })

  describe('set', () => {
    it('stores data as JSON', () => {
      set({ id: 1, text: 'A', completed: false })
      expect(localStorage.getItem(config.storageKey)).toBe(
        JSON.stringify({ id: 1, text: 'A', completed: false })
      )
    })
  })

  describe('get', () => {
    it('loads stored data', () => {
      const data = { id: 1, text: 'A', completed: false }
      localStorage.setItem(config.storageKey, JSON.stringify(data))

      expect(get()).toEqual(data)
    })

    it('returns null when nothing stored', () => {
      expect(get()).toBeNull()
    })

    it('returns null on invalid JSON', () => {
      localStorage.setItem(config.storageKey, 'not valid json')
      expect(get()).toBeNull()
    })
  })

  describe('remove', () => {
    it('removes data from storage', () => {
      set({ id: 1, text: 'A', completed: false })
      remove()

      expect(localStorage.getItem(config.storageKey)).toBeNull()
    })
  })
})
