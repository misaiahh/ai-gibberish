import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { TodoItem } from '../../src/components/TodoItem.js'

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
    el.setAttribute('id', 'abc123')
    el.setAttribute('title', 'Buy milk')
    el.setAttribute('completed', 'false')
    container.appendChild(el)

    expect(el).toBeInstanceOf(TodoItem)
    expect(el.shadowRoot).toBeTruthy()
  })

  it('shows the todo title', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('title', 'Buy milk')
    container.appendChild(el)

    const textSpan = el.shadowRoot.querySelector('[data-id="todoText"]')
    expect(textSpan.textContent).toBe('Buy milk')
  })

  it('applies completed class when completed', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('title', 'Buy milk')
    el.setAttribute('completed', 'true')
    container.appendChild(el)

    const textSpan = el.shadowRoot.querySelector('[data-id="todoText"]')
    expect(textSpan.classList.contains('completed')).toBe(true)
  })

  it('does not apply completed class when not completed', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('title', 'Buy milk')
    el.setAttribute('completed', 'false')
    container.appendChild(el)

    const textSpan = el.shadowRoot.querySelector('[data-id="todoText"]')
    expect(textSpan.classList.contains('completed')).toBe(false)
  })

  it('checks checkbox when completed', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('title', 'Buy milk')
    el.setAttribute('completed', 'true')
    container.appendChild(el)

    const checkbox = el.shadowRoot.querySelector('input[type="checkbox"]')
    expect(checkbox.checked).toBe(true)
  })

  it('has a delete button', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('title', 'Buy milk')
    container.appendChild(el)

    const deleteBtn = el.shadowRoot.querySelector('[data-id="deleteBtn"]')
    expect(deleteBtn).toBeTruthy()
    expect(deleteBtn.textContent).toBe('\u00d7')
  })

  it('dispatches toggle event on checkbox change', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('id', 'abc123')
    el.setAttribute('title', 'Buy milk')
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('toggle', handler)

    const checkbox = el.shadowRoot.querySelector('input[type="checkbox"]')
    checkbox.click()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.id).toBe('abc123')
  })

  it('dispatches delete event on delete button click', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('id', 'abc123')
    el.setAttribute('title', 'Buy milk')
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('delete', handler)

    el.deleteBtn.click()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.id).toBe('abc123')
  })

  it('updates when attributes change', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('title', 'Buy milk')
    el.setAttribute('completed', 'false')
    container.appendChild(el)

     let textSpan = el.shadowRoot.querySelector('[data-id="todoText"]')
    expect(textSpan.textContent).toBe('Buy milk')
    expect(textSpan.classList.contains('completed')).toBe(false)

    el.setAttribute('title', 'Walk dog')
    el.setAttribute('completed', 'true')

    textSpan = el.shadowRoot.querySelector('[data-id="todoText"]')
    expect(textSpan.textContent).toBe('Walk dog')
    expect(textSpan.classList.contains('completed')).toBe(true)
  })

  it('matches shadow DOM snapshot', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('id', 'abc123')
    el.setAttribute('title', 'Buy milk')
    el.setAttribute('completed', 'false')
    container.appendChild(el)

    expect(el.shadowRoot.innerHTML).toMatchInlineSnapshot(`
      "
            <style>
              .todoItem {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 8px;
                border-bottom: 1px solid #f0f0f0;
              }
              .todoItem:last-child {
                border-bottom: none;
              }
              .todoItem input[type="checkbox"] {
                width: 18px;
                height: 18px;
                cursor: pointer;
                accent-color: #4a90d9;
              }
              .todoText {
                flex: 1;
                font-size: 14px;
                color: #333;
              }
              .todoText.completed {
                text-decoration: line-through;
                color: #aaa;
              }
              .deleteBtn {
                background: none;
                border: none;
                color: #e74c3c;
                font-size: 18px;
                cursor: pointer;
                padding: 0 4px;
                opacity: 0.5;
                transition: opacity 0.2s;
              }
              .deleteBtn:hover {
                opacity: 1;
              }
            </style>
            <label class="todoItem">
              <input type="checkbox" data-id="checkbox">
              <span class="todoText " data-id="todoText">Buy milk</span>
              <button class="deleteBtn" data-id="deleteBtn" title="Delete">×</button>
            </label>
          "
    `)
  })
})
