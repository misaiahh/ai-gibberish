import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { TodoItem } from './TodoItem.js'

describe('TodoItem', () => {
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
    const el = document.createElement('todo-item')
    el.setAttribute('id', '1')
    el.setAttribute('text', 'Buy milk')
    el.setAttribute('completed', 'false')
    container.appendChild(el)

    expect(el).toBeInstanceOf(TodoItem)
    expect(el.shadowRoot).toBeTruthy()
  })

  it('shows the todo text', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('text', 'Buy milk')
    container.appendChild(el)

    const textSpan = el.shadowRoot.querySelector('.todo-text')
    expect(textSpan.textContent).toBe('Buy milk')
  })

  it('applies completed class when completed', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('text', 'Buy milk')
    el.setAttribute('completed', 'true')
    container.appendChild(el)

    const textSpan = el.shadowRoot.querySelector('.todo-text')
    expect(textSpan.classList.contains('completed')).toBe(true)
  })

  it('does not apply completed class when not completed', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('text', 'Buy milk')
    el.setAttribute('completed', 'false')
    container.appendChild(el)

    const textSpan = el.shadowRoot.querySelector('.todo-text')
    expect(textSpan.classList.contains('completed')).toBe(false)
  })

  it('checks checkbox when completed', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('text', 'Buy milk')
    el.setAttribute('completed', 'true')
    container.appendChild(el)

    const checkbox = el.shadowRoot.querySelector('input[type="checkbox"]')
    expect(checkbox.checked).toBe(true)
  })

  it('has a delete button', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('text', 'Buy milk')
    container.appendChild(el)

    const deleteBtn = el.shadowRoot.querySelector('.delete-btn')
    expect(deleteBtn).toBeTruthy()
    expect(deleteBtn.textContent).toBe('\u00d7')
  })

  it('dispatches toggle event on checkbox change', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('id', '42')
    el.setAttribute('text', 'Buy milk')
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('toggle', handler)

    const checkbox = el.shadowRoot.querySelector('input[type="checkbox"]')
    checkbox.click()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.id).toBe(42)
  })

  it('dispatches delete event on delete button click', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('id', '42')
    el.setAttribute('text', 'Buy milk')
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('delete', handler)

    el.deleteBtn.click()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.id).toBe(42)
  })

  it('updates when attributes change', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('text', 'Buy milk')
    el.setAttribute('completed', 'false')
    container.appendChild(el)

    let textSpan = el.shadowRoot.querySelector('.todo-text')
    expect(textSpan.textContent).toBe('Buy milk')
    expect(textSpan.classList.contains('completed')).toBe(false)

    el.setAttribute('text', 'Walk dog')
    el.setAttribute('completed', 'true')

    textSpan = el.shadowRoot.querySelector('.todo-text')
    expect(textSpan.textContent).toBe('Walk dog')
    expect(textSpan.classList.contains('completed')).toBe(true)
  })

  it('matches shadow DOM snapshot', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('id', '1')
    el.setAttribute('text', 'Buy milk')
    el.setAttribute('completed', 'false')
    container.appendChild(el)

    expect(el.shadowRoot.innerHTML).toMatchInlineSnapshot(`
      "
            <style>
              .todo-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 8px;
                border-bottom: 1px solid #f0f0f0;
              }
              .todo-item:last-child {
                border-bottom: none;
              }
              .todo-item input[type="checkbox"] {
                width: 18px;
                height: 18px;
                cursor: pointer;
                accent-color: #4a90d9;
              }
              .todo-item .todo-text {
                flex: 1;
                font-size: 14px;
                color: #333;
              }
              .todo-item .todo-text.completed {
                text-decoration: line-through;
                color: #aaa;
              }
              .todo-item .delete-btn {
                background: none;
                border: none;
                color: #e74c3c;
                font-size: 18px;
                cursor: pointer;
                padding: 0 4px;
                opacity: 0.5;
                transition: opacity 0.2s;
              }
              .todo-item .delete-btn:hover {
                opacity: 1;
              }
            </style>
            <label class="todo-item">
              <input type="checkbox">
              <span class="todo-text ">Buy milk</span>
              <button class="delete-btn" title="Delete">×</button>
            </label>
          "
    `)
  })
})
