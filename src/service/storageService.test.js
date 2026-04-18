import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { loadTodos, saveTodos, clearTodos } from './storageService.js'
import { config } from '../config.js'

describe('storageService', () => {
  beforeEach(() => {
    localStorage.removeItem(config.storageKey)
  })

  afterEach(() => {
    localStorage.removeItem(config.storageKey)
  })

  describe('saveTodos', () => {
    it('stores todos as JSON', () => {
      saveTodos([{ id: 1, text: 'A', completed: false }])
      expect(localStorage.getItem(config.storageKey)).toBe(
        JSON.stringify([{ id: 1, text: 'A', completed: false }])
      )
    })
  })

  describe('loadTodos', () => {
    it('loads stored todos', () => {
      const data = [{ id: 1, text: 'A', completed: false }]
      localStorage.setItem(config.storageKey, JSON.stringify(data))

      expect(loadTodos()).toEqual(data)
    })

    it('returns empty array when nothing stored', () => {
      expect(loadTodos()).toEqual([])
    })

    it('returns empty array on invalid JSON', () => {
      localStorage.setItem(config.storageKey, 'not valid json')
      expect(loadTodos()).toEqual([])
    })
  })

  describe('clearTodos', () => {
    it('removes todos from storage', () => {
      saveTodos([{ id: 1, text: 'A', completed: false }])
      clearTodos()

      expect(localStorage.getItem(config.storageKey)).toBeNull()
    })
  })
})
