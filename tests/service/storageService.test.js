import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { storageService } from '../../src/service/storageService.js'
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
      storageService.set({ id: 1, text: 'A', completed: false })
      expect(localStorage.getItem(config.storageKey)).toBe(
        JSON.stringify({ id: 1, text: 'A', completed: false })
      )
    })
  })

  describe('get', () => {
    it('loads stored data', () => {
      const data = { id: 1, text: 'A', completed: false }
      localStorage.setItem(config.storageKey, JSON.stringify(data))

      expect(storageService.get()).toEqual(data)
    })

    it('returns null when nothing stored', () => {
      expect(storageService.get()).toBeNull()
    })

    it('returns null on invalid JSON', () => {
      localStorage.setItem(config.storageKey, 'not valid json')
      expect(storageService.get()).toBeNull()
    })
  })

  describe('remove', () => {
    it('removes data from storage', () => {
      storageService.set({ id: 1, text: 'A', completed: false })
      storageService.remove()

      expect(localStorage.getItem(config.storageKey)).toBeNull()
    })
  })

  describe('wipe', () => {
    it('removes data from storage even when disabled', () => {
      const data = { id: 1, text: 'A', completed: false }
      localStorage.setItem(config.storageKey, JSON.stringify(data))
      config.storageDisabled = true

      storageService.wipe()
      config.storageDisabled = false

      expect(localStorage.getItem(config.storageKey)).toBeNull()
    })
  })

  describe('storageDisabled', () => {
    beforeEach(() => {
      config.storageDisabled = false
    })

    afterEach(() => {
      config.storageDisabled = false
    })

    it('get returns null when storage is disabled', () => {
      const data = { id: 1, text: 'A', completed: false }
      localStorage.setItem(config.storageKey, JSON.stringify(data))
      config.storageDisabled = true

      expect(storageService.get()).toBeNull()
    })

    it('set does not write when storage is disabled', () => {
      config.storageDisabled = true
      storageService.set({ id: 1, text: 'A', completed: false })

      expect(localStorage.getItem(config.storageKey)).toBeNull()
    })
  })
})
