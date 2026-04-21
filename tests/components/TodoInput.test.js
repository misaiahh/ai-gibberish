import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { TodoInput } from '../../src/components/TodoInput.js'

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

    const input = el.shadowRoot.querySelector('[data-id="input"]')
    const button = el.shadowRoot.querySelector('[data-id="button"]')

    expect(input).toBeTruthy()
    expect(button).toBeTruthy()
    expect(button.textContent).toBe('Add')
  })

  it('shows custom placeholder', () => {
    const el = document.createElement('todo-input')
    el.setAttribute('placeholder', 'Add a task')
    container.appendChild(el)

    const input = el.shadowRoot.querySelector('[data-id="input"]')
    expect(input.placeholder).toBe('Add a task')
  })

  it('dispatches add event on button click', () => {
    const el = document.createElement('todo-input')
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('add', handler)

    const input = el.shadowRoot.querySelector('[data-id="input"]')
    input.value = 'Buy milk'
    el.button.click()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.title).toBe('Buy milk')
  })

  it('dispatches add event on Enter key', () => {
    const el = document.createElement('todo-input')
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('add', handler)

    const input = el.shadowRoot.querySelector('[data-id="input"]')
    input.value = 'Buy milk'

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.title).toBe('Buy milk')
  })

  it('does not dispatch event for empty input', () => {
    const el = document.createElement('todo-input')
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('add', handler)

    el.button.click()
    expect(handler).not.toHaveBeenCalled()

    const input = el.shadowRoot.querySelector('[data-id="input"]')
    input.value = '   '
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(handler).not.toHaveBeenCalled()
  })

  it('clears input after dispatching add', () => {
    const el = document.createElement('todo-input')
    container.appendChild(el)

    const input = el.shadowRoot.querySelector('[data-id="input"]')
    input.value = 'Buy milk'
    el.button.click()

    expect(input.value).toBe('')
  })

  it('has a value property', () => {
    const el = document.createElement('todo-input')
    container.appendChild(el)

    el.value = 'Hello'
    expect(el.value).toBe('Hello')

    const input = el.shadowRoot.querySelector('[data-id="input"]')
    expect(input.value).toBe('Hello')
  })

  it('renders a place dropdown trigger', () => {
    const el = document.createElement('todo-input')
    el.setAttribute('places', '[{"id":"1","name":"Home"}]')
    container.appendChild(el)

    const trigger = el.shadowRoot.querySelector('[data-id="ddTrigger"]')
    expect(trigger).toBeTruthy()
  })

  it('renders a place dropdown list', () => {
    const el = document.createElement('todo-input')
    el.setAttribute('places', '[{"id":"1","name":"Home"}]')
    container.appendChild(el)

    const list = el.shadowRoot.querySelector('[data-id="ddList"]')
    expect(list).toBeTruthy()
  })

  it('renders options in the dropdown', () => {
    const el = document.createElement('todo-input')
    el.setAttribute('places', '[{"id":"1","name":"Home"},{"id":"2","name":"Work"}]')
    container.appendChild(el)

    const options = el.shadowRoot.querySelectorAll('[data-id="dd-option"]')
    expect(options).toHaveLength(3)
    expect(options[0].textContent).toBe('Select place')
    expect(options[0].getAttribute('data-value')).toBe('')
    expect(options[1].textContent).toBe('Home')
    expect(options[1].getAttribute('data-value')).toBe('1')
    expect(options[2].textContent).toBe('Work')
    expect(options[2].getAttribute('data-value')).toBe('2')
  })

  it('renders a go to places button', () => {
    const el = document.createElement('todo-input')
    container.appendChild(el)

    const placesBtn = el.shadowRoot.querySelector('[data-id="placesBtn"]')
    expect(placesBtn).toBeTruthy()
    expect(placesBtn.textContent).toBe('Go to Places')
  })

  it('dispatches route-change when go to places is clicked', () => {
    const el = document.createElement('todo-input')
    container.appendChild(el)

    const handler = vi.fn()
    window.addEventListener('route-change', handler)

    el.placesBtn.click()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.path).toBe('/places')

    window.removeEventListener('route-change', handler)
  })

  it('opens dropdown when trigger is clicked', () => {
    const el = document.createElement('todo-input')
    el.setAttribute('places', '[{"id":"1","name":"Home"}]')
    container.appendChild(el)

    const trigger = el.shadowRoot.querySelector('[data-id="ddTrigger"]')
    const list = el.shadowRoot.querySelector('[data-id="ddList"]')

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(list.classList.contains('open')).toBe(true)
  })

  it('closes dropdown when clicking outside', () => {
    const el = document.createElement('todo-input')
    el.setAttribute('places', '[{"id":"1","name":"Home"}]')
    container.appendChild(el)

    const trigger = el.shadowRoot.querySelector('[data-id="ddTrigger"]')
    const list = el.shadowRoot.querySelector('[data-id="ddList"]')

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(list.classList.contains('open')).toBe(true)

    const outside = document.createElement('div')
    document.body.appendChild(outside)
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.body.removeChild(outside)

    expect(list.classList.contains('open')).toBe(false)
  })

  it('selects a place when option is clicked', () => {
    const el = document.createElement('todo-input')
    el.setAttribute('places', '[{"id":"1","name":"Home"}]')
    container.appendChild(el)

    const option = el.shadowRoot.querySelector('[data-value="1"]')

    option.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    const trigger = el.shadowRoot.querySelector('[data-id="ddTrigger"]')
    expect(trigger.textContent).toBe('Home')
  })

  it('dispatches add with selected place id', () => {
    const el = document.createElement('todo-input')
    el.setAttribute('places', '[{"id":"1","name":"Home"}]')
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('add', handler)

    const trigger = el.shadowRoot.querySelector('[data-id="ddTrigger"]')
    const option = el.shadowRoot.querySelector('[data-value="1"]')
    option.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    const input = el.shadowRoot.querySelector('[data-id="input"]')
    input.value = 'Buy milk'
    el.button.click()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.placeId).toBe('1')
  })

  it('matches shadow DOM snapshot', () => {
    const el = document.createElement('todo-input')
    container.appendChild(el)

    expect(el.shadowRoot.innerHTML).toMatchSnapshot()
  })
})
