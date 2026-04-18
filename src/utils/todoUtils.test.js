import { describe, it, expect, beforeEach } from 'vitest'
import {
  generateId,
  resetIdCounter,
  addTodo,
  toggleTodo,
  deleteTodo,
  filterTodos,
  getCompletedCount,
} from '../utils/todoUtils.js'

describe('generateId', () => {
  beforeEach(() => {
    resetIdCounter()
  })

  it('returns 1 on first call', () => {
    expect(generateId()).toBe(1)
  })

  it('returns incrementing values', () => {
    const id1 = generateId()
    const id2 = generateId()
    const id3 = generateId()

    expect(id1).toBe(1)
    expect(id2).toBe(2)
    expect(id3).toBe(3)
  })

  it('returns unique values', () => {
    const ids = new Set()
    for (let i = 0; i < 100; i++) {
      ids.add(generateId())
    }
    expect(ids.size).toBe(100)
  })
})

describe('resetIdCounter', () => {
  it('resets next ID to 1', () => {
    generateId()
    generateId()
    resetIdCounter()
    expect(generateId()).toBe(1)
  })
})

describe('addTodo', () => {
  it('creates a todo with given text', () => {
    const todo = addTodo('Buy milk', [])
    expect(todo).toEqual({
      id: expect.any(Number),
      text: 'Buy milk',
      completed: false,
    })
  })

  it('trims whitespace from text', () => {
    const todo = addTodo('  Buy milk  ', [])
    expect(todo.text).toBe('Buy milk')
  })

  it('assigns an auto-incremented ID', () => {
    resetIdCounter()
    const todo = addTodo('Test', [])
    expect(todo.id).toBe(1)
  })

  it('sets completed to false by default', () => {
    const todo = addTodo('Test', [])
    expect(todo.completed).toBe(false)
  })
})

describe('toggleTodo', () => {
  it('toggles completed from false to true', () => {
    const todos = [{ id: 1, text: 'Test', completed: false }]
    const result = toggleTodo(1, todos)
    expect(result[0].completed).toBe(true)
  })

  it('toggles completed from true to false', () => {
    const todos = [{ id: 1, text: 'Test', completed: true }]
    const result = toggleTodo(1, todos)
    expect(result[0].completed).toBe(false)
  })

  it('does not affect other todos', () => {
    const todos = [
      { id: 1, text: 'First', completed: false },
      { id: 2, text: 'Second', completed: true },
      { id: 3, text: 'Third', completed: false },
    ]
    const result = toggleTodo(2, todos)
    expect(result[0].completed).toBe(false)
    expect(result[1].completed).toBe(false)
    expect(result[2].completed).toBe(false)
  })

  it('does not mutate the original array', () => {
    const todos = [{ id: 1, text: 'Test', completed: false }]
    toggleTodo(1, todos)
    expect(todos[0].completed).toBe(false)
  })
})

describe('deleteTodo', () => {
  it('removes the todo with matching id', () => {
    const todos = [
      { id: 1, text: 'First', completed: false },
      { id: 2, text: 'Second', completed: true },
      { id: 3, text: 'Third', completed: false },
    ]
    const result = deleteTodo(2, todos)
    expect(result).toHaveLength(2)
    expect(result.find((t) => t.id === 2)).toBeUndefined()
  })

  it('returns all todos when id not found', () => {
    const todos = [{ id: 1, text: 'Test', completed: false }]
    const result = deleteTodo(99, todos)
    expect(result).toEqual(todos)
  })

  it('does not mutate the original array', () => {
    const todos = [{ id: 1, text: 'Test', completed: false }]
    deleteTodo(1, todos)
    expect(todos).toHaveLength(1)
  })
})

describe('filterTodos', () => {
  const todos = [
    { id: 1, text: 'First', completed: false },
    { id: 2, text: 'Second', completed: true },
    { id: 3, text: 'Third', completed: false },
  ]

  it('returns all todos for "all" filter', () => {
    expect(filterTodos('all', todos)).toHaveLength(3)
  })

  it('returns only active todos for "active" filter', () => {
    const result = filterTodos('active', todos)
    expect(result).toHaveLength(2)
    expect(result.every((t) => !t.completed)).toBe(true)
  })

  it('returns only completed todos for "completed" filter', () => {
    const result = filterTodos('completed', todos)
    expect(result).toHaveLength(1)
    expect(result[0].completed).toBe(true)
  })

  it('defaults to "all" for unknown filter', () => {
    expect(filterTodos('unknown', todos)).toHaveLength(3)
  })
})

describe('getCompletedCount', () => {
  it('returns 0 for empty list', () => {
    expect(getCompletedCount([])).toBe(0)
  })

  it('returns total when all completed', () => {
    const todos = [
      { id: 1, text: 'A', completed: true },
      { id: 2, text: 'B', completed: true },
    ]
    expect(getCompletedCount(todos)).toBe(2)
  })

  it('returns correct count for partial completion', () => {
    const todos = [
      { id: 1, text: 'A', completed: true },
      { id: 2, text: 'B', completed: false },
      { id: 3, text: 'C', completed: true },
      { id: 4, text: 'D', completed: false },
    ]
    expect(getCompletedCount(todos)).toBe(2)
  })
})
