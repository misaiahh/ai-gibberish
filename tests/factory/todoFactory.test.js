import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { todoFactory } from '../../src/factory/todoFactory.js'
import { remove } from '../../src/service/storageService.js'
import { config } from '../../src/config.js'

describe('todoFactory', () => {
  let store

  beforeEach(() => {
    store = todoFactory()
  })

  afterEach(() => {
    store.reset()
    remove()
  })

  describe('create', () => {
    it('creates a todo with the given text', () => {
      const todo = store.create('Buy milk')

      expect(todo.text).toBe('Buy milk')
      expect(todo.completed).toBe(false)
    })

    it('trims whitespace from text', () => {
      const todo = store.create('  Buy milk  ')
      expect(todo.text).toBe('Buy milk')
    })

    it('assigns incrementing IDs', () => {
      const a = store.create('A')
      const b = store.create('B')

      expect(a.id).toBe(1)
      expect(b.id).toBe(2)
    })
  })

  describe('getAll', () => {
    it('returns an empty array initially', () => {
      expect(store.getAll()).toEqual([])
    })

    it('returns all created todos', () => {
      store.create('A')
      store.create('B')

      expect(store.getAll()).toHaveLength(2)
      expect(store.getAll()[0].text).toBe('A')
      expect(store.getAll()[1].text).toBe('B')
    })
  })

  describe('delete', () => {
    it('removes a todo by ID', () => {
      store.create('A')
      store.create('B')
      store.delete(1)

      expect(store.getAll()).toHaveLength(1)
      expect(store.getAll()[0].text).toBe('B')
    })

    it('does nothing when ID does not exist', () => {
      store.create('A')
      store.delete(99)

      expect(store.getAll()).toHaveLength(1)
    })
  })

  describe('toggle', () => {
    it('toggles completed from false to true', () => {
      const todo = store.create('A')
      store.toggle(todo.id)

      expect(todo.completed).toBe(true)
    })

    it('toggles completed from true to false', () => {
      const todo = store.create('A')
      store.toggle(todo.id)
      store.toggle(todo.id)

      expect(todo.completed).toBe(false)
    })

    it('does not affect other todos', () => {
      const a = store.create('A')
      const b = store.create('B')
      store.toggle(a.id)

      expect(a.completed).toBe(true)
      expect(b.completed).toBe(false)
    })

    it('does nothing when ID does not exist', () => {
      store.create('A')
      store.toggle(99)
      expect(store.getActiveCount()).toBe(1)
    })
  })

  describe('clearCompleted', () => {
    it('removes all completed todos', () => {
      const a = store.create('A')
      store.create('B')
      store.toggle(a.id)
      store.clearCompleted()

      expect(store.getAll()).toHaveLength(1)
      expect(store.getAll()[0].text).toBe('B')
    })

    it('does nothing when no todos are completed', () => {
      store.create('A')
      store.create('B')
      store.clearCompleted()

      expect(store.getAll()).toHaveLength(2)
    })
  })

  describe('getActiveCount', () => {
    it('returns 0 for empty store', () => {
      expect(store.getActiveCount()).toBe(0)
    })

    it('returns correct count of active todos', () => {
      const a = store.create('A')
      store.create('B')
      store.create('C')
      store.toggle(a.id)

      expect(store.getActiveCount()).toBe(2)
    })
  })

  describe('getCompletedCount', () => {
    it('returns 0 for empty store', () => {
      expect(store.getCompletedCount()).toBe(0)
    })

    it('returns correct count of completed todos', () => {
      const a = store.create('A')
      store.create('B')
      store.toggle(a.id)

      expect(store.getCompletedCount()).toBe(1)
    })
  })

  describe('reset', () => {
    it('clears all todos and resets ID counter', () => {
      store.create('A')
      store.reset()

      expect(store.getAll()).toEqual([])

      const todo = store.create('A')
      expect(todo.id).toBe(1)
    })
  })

  describe('persistence', () => {
    it('persists todos on create', () => {
      store.create('Buy milk')
      const stored = JSON.parse(localStorage.getItem(config.storageKey))
      expect(stored).toHaveLength(1)
      expect(stored[0].text).toBe('Buy milk')
    })

    it('persists todos on delete', () => {
      store.create('A')
      store.create('B')
      store.delete(1)

      const stored = JSON.parse(localStorage.getItem(config.storageKey))
      expect(stored).toHaveLength(1)
      expect(stored[0].text).toBe('B')
    })

    it('persists todos on toggle', () => {
      const todo = store.create('A')
      store.toggle(todo.id)

      const stored = JSON.parse(localStorage.getItem(config.storageKey))
      expect(stored[0].completed).toBe(true)
    })

    it('persists todos on clearCompleted', () => {
      const a = store.create('A')
      store.create('B')
      store.toggle(a.id)
      store.clearCompleted()

      const stored = JSON.parse(localStorage.getItem(config.storageKey))
      expect(stored).toHaveLength(1)
      expect(stored[0].text).toBe('B')
    })

    it('persists todos on reset', () => {
      store.create('A')
      store.reset()

      expect(localStorage.getItem(config.storageKey)).toBeNull()
    })

    it('loads existing todos from storage on init', () => {
      store.reset()
      localStorage.setItem(config.storageKey, JSON.stringify([
        { id: 1, text: 'Load me', completed: false },
      ]))

      const newStore = todoFactory()
      expect(newStore.getAll()).toHaveLength(1)
      expect(newStore.getAll()[0].text).toBe('Load me')
    })

    it('resumes ID counter from stored todos', () => {
      store.reset()
      localStorage.setItem(config.storageKey, JSON.stringify([
        { id: 5, text: 'Old todo', completed: false },
      ]))

      const newStore = todoFactory()
      const todo = newStore.create('New todo')
      expect(todo.id).toBe(6)
    })
  })
})
