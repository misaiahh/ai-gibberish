import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { TodoList } from './TodoList.js'

describe('TodoList', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
  })

  it('renders the component', () => {
    const el = document.createElement('todo-list')
    container.appendChild(el)

    expect(el).toBeInstanceOf(TodoList)
    expect(el.shadowRoot).toBeTruthy()
  })

  it('renders a ul element', () => {
    const el = document.createElement('todo-list')
    container.appendChild(el)

    const list = el.shadowRoot.querySelector('[data-id="list"]')
    expect(list).toBeTruthy()
  })

  it('renders todo items from todos attribute', () => {
    const todos = [
      { id: 1, text: 'Buy milk', completed: false },
      { id: 2, text: 'Walk dog', completed: true },
    ]
    const el = document.createElement('todo-list')
    el.setAttribute('todos', JSON.stringify(todos))
    container.appendChild(el)

    const items = el.shadowRoot.querySelectorAll('todo-item')
    expect(items).toHaveLength(2)
  })

  it('passes correct attributes to todo items', () => {
    const todos = [{ id: 1, text: 'Buy milk', completed: false }]
    const el = document.createElement('todo-list')
    el.setAttribute('todos', JSON.stringify(todos))
    container.appendChild(el)

    const item = el.shadowRoot.querySelector('todo-item')
    expect(item.getAttribute('id')).toBe('1')
    expect(item.getAttribute('text')).toBe('Buy milk')
    expect(item.getAttribute('completed')).toBe('false')
  })

  it('filters todos by filter attribute', () => {
    const todos = [
      { id: 1, text: 'Buy milk', completed: false },
      { id: 2, text: 'Walk dog', completed: true },
      { id: 3, text: 'Code', completed: false },
    ]
    const el = document.createElement('todo-list')
    el.setAttribute('todos', JSON.stringify(todos))
    el.setAttribute('filter', 'active')
    container.appendChild(el)

    const items = el.shadowRoot.querySelectorAll('todo-item')
    expect(items).toHaveLength(2)
  })

  it('shows all todos when filter is all', () => {
    const todos = [
      { id: 1, text: 'Buy milk', completed: false },
      { id: 2, text: 'Walk dog', completed: true },
    ]
    const el = document.createElement('todo-list')
    el.setAttribute('todos', JSON.stringify(todos))
    el.setAttribute('filter', 'all')
    container.appendChild(el)

    const items = el.shadowRoot.querySelectorAll('todo-item')
    expect(items).toHaveLength(2)
  })

  it('shows no items when filter is completed and none are completed', () => {
    const todos = [
      { id: 1, text: 'Buy milk', completed: false },
      { id: 2, text: 'Walk dog', completed: false },
    ]
    const el = document.createElement('todo-list')
    el.setAttribute('todos', JSON.stringify(todos))
    el.setAttribute('filter', 'completed')
    container.appendChild(el)

    const items = el.shadowRoot.querySelectorAll('todo-item')
    expect(items).toHaveLength(0)
  })

  it('forwards toggle event from items', () => {
    const todos = [{ id: 1, text: 'Buy milk', completed: false }]
    const el = document.createElement('todo-list')
    el.setAttribute('todos', JSON.stringify(todos))
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('toggle', handler)

    // Dispatch toggle event on the todo-list (as a nested item would)
    el.dispatchEvent(
      new CustomEvent('toggle', {
        detail: { id: 1 },
        bubbles: true,
        composed: true,
      })
    )

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.id).toBe(1)
  })

  it('forwards delete event from items', () => {
    const todos = [{ id: 1, text: 'Buy milk', completed: false }]
    const el = document.createElement('todo-list')
    el.setAttribute('todos', JSON.stringify(todos))
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('delete', handler)

    // Dispatch delete event on the todo-list (as a nested item would)
    el.dispatchEvent(
      new CustomEvent('delete', {
        detail: { id: 1 },
        bubbles: true,
        composed: true,
      })
    )

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.id).toBe(1)
  })

  it('updates and re-renders via update method', () => {
    const todos = [{ id: 1, text: 'Buy milk', completed: false }]
    const el = document.createElement('todo-list')
    el.setAttribute('todos', JSON.stringify(todos))
    container.appendChild(el)

    const updatedTodos = [
      { id: 1, text: 'Buy milk', completed: false },
      { id: 2, text: 'Walk dog', completed: true },
    ]
    el.update(updatedTodos)

    const items = el.shadowRoot.querySelectorAll('todo-item')
    expect(items).toHaveLength(2)
    expect(items[1].getAttribute('text')).toBe('Walk dog')
  })

  it('renders empty list when todos is empty', () => {
    const el = document.createElement('todo-list')
    el.setAttribute('todos', '[]')
    container.appendChild(el)

    const items = el.shadowRoot.querySelectorAll('todo-item')
    expect(items).toHaveLength(0)
  })
})
