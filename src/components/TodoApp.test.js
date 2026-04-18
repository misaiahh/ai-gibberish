import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import './TodoInput.js'
import './TodoItem.js'
import './TodoList.js'
import { TodoApp } from './TodoApp.js'

describe('TodoApp', () => {
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
    const el = document.createElement('todo-app')
    container.appendChild(el)

    expect(el).toBeInstanceOf(TodoApp)
    expect(el.shadowRoot).toBeTruthy()
  })

  it('renders a heading', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    const h1 = el.shadowRoot.querySelector('h1')
    expect(h1.textContent).toBe('Todo App')
  })

  it('renders a todo-input component', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    const input = el.shadowRoot.querySelector('todo-input')
    expect(input).toBeTruthy()
  })

  it('renders filter buttons', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    const buttons = el.shadowRoot.querySelectorAll('.todo-filters button')
    expect(buttons).toHaveLength(3)
    expect(buttons[0].textContent.trim()).toBe('All')
    expect(buttons[1].textContent.trim()).toBe('Active')
    expect(buttons[2].textContent.trim()).toBe('Completed')
  })

  it('marks the active filter button', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    const allBtn = el.shadowRoot.querySelector('[data-filter="all"]')
    const activeBtn = el.shadowRoot.querySelector('[data-filter="active"]')
    const completedBtn = el.shadowRoot.querySelector('[data-filter="completed"]')

    expect(allBtn.classList.contains('active')).toBe(true)
    expect(activeBtn.classList.contains('active')).toBe(false)
    expect(completedBtn.classList.contains('active')).toBe(false)
  })

  it('renders a todo-list component', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    const list = el.shadowRoot.querySelector('todo-list')
    expect(list).toBeTruthy()
  })

  it('renders a footer', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    const footer = el.shadowRoot.querySelector('.todo-footer')
    expect(footer).toBeTruthy()
  })

  it('shows item count in footer', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    const count = el.shadowRoot.querySelector('.item-count')
    expect(count.textContent).toContain('item')
    expect(count.textContent).toContain('left')
  })

  it('dispatches add event from nested todo-input', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    // Simulate adding a todo
    el.dispatchEvent(
      new CustomEvent('add', {
        detail: { text: 'Buy milk' },
        bubbles: false,
      })
    )

    const list = el.shadowRoot.querySelector('todo-list')
    const todos = JSON.parse(list.getAttribute('todos'))
    expect(todos).toHaveLength(1)
    expect(todos[0].text).toBe('Buy milk')
    expect(todos[0].completed).toBe(false)
  })

  it('dispatches toggle event from nested todo-list', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    // Add a todo first
    el.dispatchEvent(
      new CustomEvent('add', {
        detail: { text: 'Buy milk' },
        bubbles: false,
      })
    )

    // Toggle the first todo (id=1 from Date.now() on first add)
    const firstId = JSON.parse(
      el.shadowRoot.querySelector('todo-list').getAttribute('todos')
    )[0].id

    el.dispatchEvent(
      new CustomEvent('toggle', {
        detail: { id: firstId },
        bubbles: false,
      })
    )

    const todos = JSON.parse(
      el.shadowRoot.querySelector('todo-list').getAttribute('todos')
    )
    expect(todos[0].completed).toBe(true)
  })

  it('dispatches delete event from nested todo-list', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    // Add a todo first
    el.dispatchEvent(
      new CustomEvent('add', {
        detail: { text: 'Buy milk' },
        bubbles: false,
      })
    )

    const firstId = JSON.parse(
      el.shadowRoot.querySelector('todo-list').getAttribute('todos')
    )[0].id

    el.dispatchEvent(
      new CustomEvent('delete', {
        detail: { id: firstId },
        bubbles: false,
      })
    )

    const list = el.shadowRoot.querySelector('todo-list')
    const todos = JSON.parse(list.getAttribute('todos'))
    expect(todos).toHaveLength(0)
  })

  it('switches filter when filter button is clicked', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    // Add some todos
    el.dispatchEvent(
      new CustomEvent('add', {
        detail: { text: 'Buy milk' },
        bubbles: false,
      })
    )
    el.dispatchEvent(
      new CustomEvent('add', {
        detail: { text: 'Walk dog' },
        bubbles: false,
      })
    )

    const activeBtn = el.shadowRoot.querySelector('[data-filter="active"]')
    activeBtn.click()

    const list = el.shadowRoot.querySelector('todo-list')
    expect(list.getAttribute('filter')).toBe('active')
  })

  it('clears completed todos when clear-completed button is clicked', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    // Add two todos and mark one as completed
    el.dispatchEvent(
      new CustomEvent('add', {
        detail: { text: 'Buy milk' },
        bubbles: false,
      })
    )
    el.dispatchEvent(
      new CustomEvent('add', {
        detail: { text: 'Walk dog' },
        bubbles: false,
      })
    )

    const firstId = JSON.parse(
      el.shadowRoot.querySelector('todo-list').getAttribute('todos')
    )[0].id

    el.dispatchEvent(
      new CustomEvent('toggle', {
        detail: { id: firstId },
        bubbles: false,
      })
    )

    // Verify both todos exist, one completed
    let todos = JSON.parse(
      el.shadowRoot.querySelector('todo-list').getAttribute('todos')
    )
    expect(todos).toHaveLength(2)
    expect(todos[0].completed).toBe(true)
    expect(todos[1].completed).toBe(false)

    // Click the clear-completed button via the shadow root (event delegation)
    const clearBtn = el.shadowRoot.querySelector('.clear-completed')
    expect(clearBtn.style.display).not.toBe('none')
    clearBtn.click()

    // Only the uncompleted todo should remain
    todos = JSON.parse(
      el.shadowRoot.querySelector('todo-list').getAttribute('todos')
    )
    expect(todos).toHaveLength(1)
    expect(todos[0].completed).toBe(false)
  })

  it('updates item count when todos are added', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    const count = el.shadowRoot.querySelector('.item-count')
    expect(count.textContent).toContain('0 items left')

    // Dispatch add event and verify state changes
    el.dispatchEvent(
      new CustomEvent('add', {
        detail: { text: 'Buy milk' },
        bubbles: true,
      })
    )

    // Re-query count after DOM update
    const countAfterFirst = el.shadowRoot.querySelector('.item-count')
    expect(countAfterFirst.textContent).toContain('1 item left')

    el.dispatchEvent(
      new CustomEvent('add', {
        detail: { text: 'Walk dog' },
        bubbles: true,
      })
    )

    const countAfterSecond = el.shadowRoot.querySelector('.item-count')
    expect(countAfterSecond.textContent).toContain('2 items left')
  })

it('matches shadow DOM snapshot', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    expect(el.shadowRoot.innerHTML).toMatchInlineSnapshot(`
      "
            <style>
              .todo-app {
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
                padding: 24px;
              }
              .todo-app h1 {
                font-size: 24px;
                font-weight: 700;
                text-align: center;
                margin-bottom: 20px;
                color: #333;
              }
              .todo-filters {
                display: flex;
                gap: 6px;
                margin-bottom: 12px;
                justify-content: center;
              }
              .todo-filters button {
                padding: 6px 14px;
                border: 1px solid #ddd;
                background: #fff;
                border-radius: 4px;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
              }
              .todo-filters button.active {
                background: #4a90d9;
                color: #fff;
                border-color: #4a90d9;
              }
              .todo-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 8px 0;
                font-size: 13px;
                color: #888;
                border-top: 1px solid #f0f0f0;
                margin-top: 4px;
              }
            </style>
            <h1>Todo App</h1>
            <todo-input></todo-input>
            <div class="todo-filters">
              <button data-filter="all" class="active">All</button>
              <button data-filter="active" class="">Active</button>
              <button data-filter="completed" class="">Completed</button>
            </div>
            <todo-list filter="all" todos="[]"></todo-list>
            <div class="todo-footer">
              <span class="item-count">0 items left</span>
              <button class="clear-completed" style="background:none;border:none;color:#e74c3c;font-size:13px;cursor:pointer;display:none;">Clear Completed</button>
            </div>
          "
    `)
  })
})
