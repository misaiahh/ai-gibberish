import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { todoFactory } from '../../src/factory/todoFactory.js'

const uuid = () => crypto.randomUUID()

const makeTodo = (overrides = {}) => ({
  id: uuid(),
  title: overrides.title ?? 'test todo',
  completed: overrides.completed ?? false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

// Per-method mocks
const createMock = vi.fn()
const getAllMock = vi.fn(() => [])
const updateMock = vi.fn()
const removeMock = vi.fn()

// Global fetch mock - apiService calls fetch internally
const originalFetch = globalThis.fetch
globalThis.fetch = vi.fn(async (url, init) => {
  const path = url.replace('/api', '')

  if (path === '/todos') {
    if (init?.method === 'POST') {
      const body = JSON.parse(init.body)
      const todo = createMock(body.title)
      return { ok: true, json: () => Promise.resolve(todo) }
    }
    if (init?.method === 'GET') {
      return { ok: true, json: () => Promise.resolve(getAllMock()) }
    }
  }

  if (path.startsWith('/todos/')) {
    const id = path.replace('/todos/', '')
    if (init?.method === 'PATCH') {
      const body = JSON.parse(init.body)
      const todo = updateMock(id, body)
      return { ok: true, json: () => Promise.resolve(todo) }
    }
    if (init?.method === 'DELETE') {
      removeMock(id)
      return { ok: true }
    }
  }

  return { ok: true, json: () => Promise.resolve([]) }
})

describe('todoFactory', () => {
  let store

  beforeEach(() => {
    store = todoFactory()
    vi.clearAllMocks()
    createMock.mockImplementation((title) => makeTodo({ title }))
    updateMock.mockImplementation((id, patch) => makeTodo({ id, completed: patch.completed }))
    getAllMock.mockReturnValue([])
    removeMock.mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('create', () => {
    it('creates a todo with the given title', async () => {
      const todo = await store.create('Buy milk')
      expect(todo.title).toBe('Buy milk')
      expect(todo.completed).toBe(false)
      expect(typeof todo.id).toBe('string')
      expect(todo.createdAt).toBeDefined()
      expect(todo.updatedAt).toBeDefined()
    })

    it('trims whitespace from title', async () => {
      const todo = await store.create('  Buy milk  ')
      expect(todo.title).toBe('Buy milk')
    })

    it('assigns string IDs (UUIDs)', async () => {
      const a = await store.create('A')
      const b = await store.create('B')
      expect(typeof a.id).toBe('string')
      expect(typeof b.id).toBe('string')
      expect(a.id).not.toBe(b.id)
    })
  })

  describe('getAll', () => {
    it('returns an empty array initially', async () => {
      expect(await store.getAll()).toEqual([])
    })

    it('returns all created todos', async () => {
      await store.create('A')
      await store.create('B')
      const all = await store.getAll()
      expect(all).toHaveLength(2)
      expect(all[0].title).toBe('A')
      expect(all[1].title).toBe('B')
    })
  })

  describe('delete', () => {
    it('removes a todo by ID', async () => {
      const a = await store.create('A')
      await store.create('B')
      await store.delete(a.id)
      const all = await store.getAll()
      expect(all).toHaveLength(1)
      expect(all[0].title).toBe('B')
    })

    it('does nothing when ID does not exist', async () => {
      await store.create('A')
      await store.delete('nonexistent')
      expect((await store.getAll()).length).toBe(1)
    })
  })

  describe('toggle', () => {
    it('toggles completed from false to true', async () => {
      const todo = await store.create('A')
      await store.toggle(todo.id)
      expect(todo.completed).toBe(true)
    })

    it('toggles completed from true to false', async () => {
      const todo = await store.create('A')
      await store.toggle(todo.id)
      await store.toggle(todo.id)
      expect(todo.completed).toBe(false)
    })

    it('does not affect other todos', async () => {
      const a = await store.create('A')
      const b = await store.create('B')
      await store.toggle(a.id)
      expect(a.completed).toBe(true)
      expect(b.completed).toBe(false)
    })

    it('does nothing when ID does not exist', async () => {
      await store.create('A')
      await store.toggle('nonexistent')
      expect(store.getActiveCount()).toBe(1)
    })
  })

  describe('clearCompleted', () => {
    it('removes all completed todos', async () => {
      const a = await store.create('A')
      await store.create('B')
      await store.toggle(a.id)
      await store.clearCompleted()
      const all = await store.getAll()
      expect(all).toHaveLength(1)
      expect(all[0].title).toBe('B')
    })

    it('does nothing when no todos are completed', async () => {
      await store.create('A')
      await store.create('B')
      await store.clearCompleted()
      expect((await store.getAll()).length).toBe(2)
    })
  })

  describe('getActiveCount', () => {
    it('returns 0 for empty store', () => {
      expect(store.getActiveCount()).toBe(0)
    })

    it('returns correct count of active todos', async () => {
      const a = await store.create('A')
      await store.create('B')
      await store.create('C')
      await store.toggle(a.id)
      expect(store.getActiveCount()).toBe(2)
    })
  })

  describe('getCompletedCount', () => {
    it('returns 0 for empty store', () => {
      expect(store.getCompletedCount()).toBe(0)
    })

    it('returns correct count of completed todos', async () => {
      const a = await store.create('A')
      await store.create('B')
      await store.toggle(a.id)
      expect(store.getCompletedCount()).toBe(1)
    })
  })

  describe('reset', () => {
    it('clears all todos', async () => {
      await store.create('A')
      await store.reset()
      expect(await store.getAll()).toEqual([])
    })
  })
})
