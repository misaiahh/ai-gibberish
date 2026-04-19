import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import '../../src/components/TodoInput.js'
import '../../src/components/TodoItem.js'
import '../../src/components/TodoList.js'
import { TodoApp } from '../../src/components/TodoApp.js'
import { remove } from '../../src/service/storageService.js'
import { config } from '../../src/config.js'

describe('TodoApp', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    remove()
    localStorage.removeItem(config.storageKey)
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
    remove()
    localStorage.removeItem(config.storageKey)
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

    const buttons = el.shadowRoot.querySelectorAll('[data-id="filters"] button')
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

    const footer = el.shadowRoot.querySelector('[data-id="footer"]')
    expect(footer).toBeTruthy()
  })

  it('shows item count in footer', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    const count = el.shadowRoot.querySelector('[data-id="itemCount"]')
    expect(count.textContent).toContain('item')
    expect(count.textContent).toContain('left')
  })

  it('dispatches add event from nested todo-input', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

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

    let todos = JSON.parse(
      el.shadowRoot.querySelector('todo-list').getAttribute('todos')
    )
    expect(todos).toHaveLength(2)
    expect(todos[0].completed).toBe(true)
    expect(todos[1].completed).toBe(false)

    const clearBtn = el.shadowRoot.querySelector('[data-id="clearBtn"]')
    expect(clearBtn.style.display).not.toBe('none')
    clearBtn.click()

    todos = JSON.parse(
      el.shadowRoot.querySelector('todo-list').getAttribute('todos')
    )
    expect(todos).toHaveLength(1)
    expect(todos[0].completed).toBe(false)
  })

  it('keeps focus on input after pressing Enter', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    const todoInput = el.shadowRoot.querySelector('todo-input')
    const input = todoInput.shadowRoot.querySelector('[data-id="input"]')
    input.value = 'Buy milk'

    input.focus()
    expect(input.matches(':focus')).toBe(true)

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

    // The input should still be focused and cleared since parent doesn't destroy it
    const inputAfter = el.shadowRoot.querySelector('todo-input')
      .shadowRoot.querySelector('[data-id="input"]')
    expect(inputAfter.value).toBe('')
    expect(inputAfter.matches(':focus')).toBe(true)
  })

  it('updates item count when todos are added', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    const count = el.shadowRoot.querySelector('[data-id="itemCount"]')
    expect(count.textContent).toContain('0 items left')

    el.dispatchEvent(
      new CustomEvent('add', {
        detail: { text: 'Buy milk' },
        bubbles: true,
      })
    )

    const countAfterFirst = el.shadowRoot.querySelector('[data-id="itemCount"]')
    expect(countAfterFirst.textContent).toContain('1 item left')

    el.dispatchEvent(
      new CustomEvent('add', {
        detail: { text: 'Walk dog' },
        bubbles: true,
      })
    )

    const countAfterSecond = el.shadowRoot.querySelector('[data-id="itemCount"]')
    expect(countAfterSecond.textContent).toContain('2 items left')
  })

  it('matches shadow DOM snapshot', () => {
    const el = document.createElement('todo-app')
    container.appendChild(el)

    expect(el.shadowRoot.innerHTML).toMatchInlineSnapshot(`
      "
            <style>
              .todoApp {
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
                padding: 24px;
              }
              .todoApp h1 {
                font-size: 24px;
                font-weight: 700;
                text-align: center;
                margin-bottom: 20px;
                color: #333;
              }
              .filterContainer {
                display: flex;
                gap: 6px;
                margin-bottom: 12px;
                justify-content: center;
              }
              .filterContainer button {
                padding: 6px 14px;
                border: 1px solid #ddd;
                background: #fff;
                border-radius: 4px;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
              }
              .filterContainer button.active {
                background: #4a90d9;
                color: #fff;
                border-color: #4a90d9;
              }
              .footer {
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
            <div class="todoApp">
              <h1>Todo App</h1>
              <todo-input></todo-input>
              <div class="filterContainer" data-id="filters">
                <button data-filter="all" class="active">All</button>
                <button data-filter="active" class="">Active</button>
                <button data-filter="completed" class="">Completed</button>
              </div>
              <todo-list filter="all" todos="[]"></todo-list>
              <div class="footer" data-id="footer">
                <span class="item-count" data-id="itemCount">0 items left</span>
                <button class="clear-completed" data-id="clearBtn" style="background:none;border:none;color:#e74c3c;font-size:13px;cursor:pointer;display:none;">Clear Completed</button>
              </div>
            </div>
          "
    `)
  })
})
