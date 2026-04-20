import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import '../../src/pages/todo/PageTodo.js'
import '../../src/components/TodoInput.js'
import '../../src/components/TodoItem.js'
import '../../src/components/TodoList.js'

describe('PageTodo', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)

    window.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    )
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
    vi.restoreAllMocks()
  })

  it('renders a todo-input component', async () => {
    const page = document.createElement('page-todo')
    container.appendChild(page)
    await new Promise((resolve) => setTimeout(resolve, 50))

    const input = page.shadowRoot.querySelector('todo-input')
    expect(input).toBeDefined()
  })

  it('renders a todo-list component', async () => {
    const page = document.createElement('page-todo')
    container.appendChild(page)
    await new Promise((resolve) => setTimeout(resolve, 50))

    const list = page.shadowRoot.querySelector('todo-list')
    expect(list).toBeDefined()
  })

  it('renders filter buttons', async () => {
    const page = document.createElement('page-todo')
    container.appendChild(page)
    await new Promise((resolve) => setTimeout(resolve, 50))

    const filterBtns = page.shadowRoot.querySelectorAll('[data-filter]')
    expect(filterBtns).toHaveLength(3)
    expect(filterBtns[0].textContent.trim()).toBe('All')
    expect(filterBtns[1].textContent.trim()).toBe('Active')
    expect(filterBtns[2].textContent.trim()).toBe('Completed')
  })

  it('renders an item count footer', async () => {
    const page = document.createElement('page-todo')
    container.appendChild(page)
    await new Promise((resolve) => setTimeout(resolve, 50))

    const countEl = page.shadowRoot.querySelector('[data-id="itemCount"]')
    expect(countEl).toBeDefined()
    expect(countEl.textContent).toContain('item')
  })

  it('snapshot matches shadow DOM structure', async () => {
    const page = document.createElement('page-todo')
    container.appendChild(page)
    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(page.shadowRoot.innerHTML).toMatchSnapshot()
  })
})
