import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { TodoInput } from './TodoInput.js'

describe('TodoInput', () => {
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
    const el = document.createElement('todo-input')
    container.appendChild(el)

    expect(el).toBeInstanceOf(TodoInput)
    expect(el.shadowRoot).toBeTruthy()
  })

  it('has an input and button in shadow DOM', () => {
    const el = document.createElement('todo-input')
    container.appendChild(el)

    const input = el.shadowRoot.querySelector('input')
    const button = el.shadowRoot.querySelector('button')

    expect(input).toBeTruthy()
    expect(button).toBeTruthy()
    expect(button.textContent).toBe('Add')
  })

  it('shows custom placeholder', () => {
    const el = document.createElement('todo-input')
    el.setAttribute('placeholder', 'Add a task')
    container.appendChild(el)

    const input = el.shadowRoot.querySelector('input')
    expect(input.placeholder).toBe('Add a task')
  })

  it('dispatches add event on button click', () => {
    const el = document.createElement('todo-input')
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('add', handler)

    const input = el.shadowRoot.querySelector('input')
    input.value = 'Buy milk'
    el.button.click()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.text).toBe('Buy milk')
  })

  it('dispatches add event on Enter key', () => {
    const el = document.createElement('todo-input')
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('add', handler)

    const input = el.shadowRoot.querySelector('input')
    input.value = 'Buy milk'

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.text).toBe('Buy milk')
  })

  it('does not dispatch event for empty input', () => {
    const el = document.createElement('todo-input')
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('add', handler)

    el.button.click()
    expect(handler).not.toHaveBeenCalled()

    const input = el.shadowRoot.querySelector('input')
    input.value = '   '
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(handler).not.toHaveBeenCalled()
  })

  it('clears input after dispatching add', () => {
    const el = document.createElement('todo-input')
    container.appendChild(el)

    const input = el.shadowRoot.querySelector('input')
    input.value = 'Buy milk'
    el.button.click()

    expect(input.value).toBe('')
  })

  it('has a value property', () => {
    const el = document.createElement('todo-input')
    container.appendChild(el)

    el.value = 'Hello'
    expect(el.value).toBe('Hello')

    const input = el.shadowRoot.querySelector('input')
    expect(input.value).toBe('Hello')
  })

  it('matches shadow DOM snapshot', () => {
    const el = document.createElement('todo-input')
    container.appendChild(el)

    expect(el.shadowRoot.innerHTML).toMatchInlineSnapshot(`
      "
            <style>
              .todo-input {
                display: flex;
                gap: 8px;
              }
              .todo-input input {
                flex: 1;
                padding: 10px 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s;
              }
              .todo-input input:focus {
                border-color: #4a90d9;
              }
              .todo-input button {
                padding: 10px 18px;
                background: #4a90d9;
                color: #fff;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
              }
              .todo-input button:hover {
                background: #357abd;
              }
            </style>
            <div class="todo-input">
              <input type="text" placeholder="What needs to be done?">
              <button>Add</button>
            </div>
          "
    `)
  })
})
