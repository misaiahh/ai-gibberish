import '../../src/pages/todo/PageTodo.js'
import '../../src/components/TodoInput.js'
import '../../src/components/TodoItem.js'
import '../../src/components/TodoList.js'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('PageTodo', () => {
  let page

  beforeEach(() => {
    page = document.createElement('page-todo')
    document.body.appendChild(page)
  })

  afterEach(() => {
    document.body.removeChild(page)
    page = null
  })

  it('renders a todo-input component', () => {
    const input = page.shadowRoot.querySelector('todo-input')
    expect(input).toBeDefined()
  })

  it('renders a todo-list component', () => {
    const list = page.shadowRoot.querySelector('todo-list')
    expect(list).toBeDefined()
  })

  it('renders filter buttons', () => {
    const filterBtns = page.shadowRoot.querySelectorAll('[data-filter]')
    expect(filterBtns).toHaveLength(3)
    expect(filterBtns[0].textContent.trim()).toBe('All')
    expect(filterBtns[1].textContent.trim()).toBe('Active')
    expect(filterBtns[2].textContent.trim()).toBe('Completed')
  })

  it('renders an item count footer', () => {
    const countEl = page.shadowRoot.querySelector('[data-id="itemCount"]')
    expect(countEl).toBeDefined()
    expect(countEl.textContent).toContain('item')
  })

  it('snapshot matches shadow DOM structure', () => {
    expect(page.shadowRoot.innerHTML).toMatchSnapshot()
  })
})
