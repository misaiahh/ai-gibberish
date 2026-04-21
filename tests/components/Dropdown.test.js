import '../../src/components/Dropdown.js'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('Dropdown', () => {
  let dropdown

  beforeEach(() => {
    dropdown = document.createElement('app-dropdown')
    dropdown.setAttribute('label', 'Choose')
  })

  afterEach(() => {
    if (dropdown && dropdown.parentNode) {
      dropdown.parentNode.removeChild(dropdown)
    }
    dropdown = null
  })

  it('renders a shadow DOM', () => {
    const el = document.createElement('app-dropdown')
    el.setAttribute('label', 'Choose')
    document.body.appendChild(el)
    expect(el.shadowRoot).toBeTruthy()
    document.body.removeChild(el)
  })

  it('displays the label on the trigger', () => {
    document.body.appendChild(dropdown)
    const trigger = dropdown.shadowRoot.querySelector('[data-id="trigger"]')
    expect(trigger.textContent.trim()).toBe('Choose')
  })

  it('has a trigger element with tabindex', () => {
    document.body.appendChild(dropdown)
    const trigger = dropdown.shadowRoot.querySelector('[data-id="trigger"]')
    expect(trigger).toBeTruthy()
    expect(trigger.getAttribute('tabindex')).toBe('0')
  })

  it('has a list element that is initially hidden', () => {
    document.body.appendChild(dropdown)
    const list = dropdown.shadowRoot.querySelector('[data-id="list"]')
    expect(list).toBeTruthy()
    expect(list.classList.contains('open')).toBe(false)
  })

  it('opens the list when trigger is clicked', () => {
    document.body.appendChild(dropdown)
    const trigger = dropdown.shadowRoot.querySelector('[data-id="trigger"]')
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    const list = dropdown.shadowRoot.querySelector('[data-id="list"]')
    expect(list.classList.contains('open')).toBe(true)
  })

  it('closes the list when toggled again', () => {
    document.body.appendChild(dropdown)
    const trigger = dropdown.shadowRoot.querySelector('[data-id="trigger"]')
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    const list = dropdown.shadowRoot.querySelector('[data-id="list"]')
    expect(list.classList.contains('open')).toBe(false)
  })

  it('closes the list when clicking outside', () => {
    document.body.appendChild(dropdown)
    const trigger = dropdown.shadowRoot.querySelector('[data-id="trigger"]')
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    const list = dropdown.shadowRoot.querySelector('[data-id="list"]')
    expect(list.classList.contains('open')).toBe(true)

    const outside = document.createElement('div')
    document.body.appendChild(outside)
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.body.removeChild(outside)

    expect(list.classList.contains('open')).toBe(false)
  })

  it('closes the list when open attribute is removed', () => {
    document.body.appendChild(dropdown)
    dropdown.setAttribute('open', '')
    dropdown.removeAttribute('open')
    const list = dropdown.shadowRoot.querySelector('[data-id="list"]')
    expect(list.classList.contains('open')).toBe(false)
  })

  it('renders options from slotted option elements', () => {
    const opt1 = document.createElement('option')
    opt1.setAttribute('value', 'opt1')
    opt1.textContent = 'Option One'
    dropdown.appendChild(opt1)

    const opt2 = document.createElement('option')
    opt2.setAttribute('value', 'opt2')
    opt2.textContent = 'Option Two'
    dropdown.appendChild(opt2)

    document.body.appendChild(dropdown)

    const options = dropdown.shadowRoot.querySelectorAll('[data-id="option"]')
    expect(options).toHaveLength(2)
    expect(options[0].textContent).toBe('Option One')
    expect(options[0].getAttribute('data-value')).toBe('opt1')
    expect(options[1].textContent).toBe('Option Two')
    expect(options[1].getAttribute('data-value')).toBe('opt2')
  })

  it('dispatches select event when option is clicked', () => {
    const opt1 = document.createElement('option')
    opt1.setAttribute('value', 'opt1')
    opt1.textContent = 'Option One'
    dropdown.appendChild(opt1)

    document.body.appendChild(dropdown)

    const handler = vi.fn()
    dropdown.addEventListener('select', handler)

    const option = dropdown.shadowRoot.querySelector('[data-id="option"]')
    option.click()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.value).toBe('opt1')
    expect(handler.mock.calls[0][0].detail.label).toBe('Option One')
  })

  it('updates label text after selection', () => {
    const opt1 = document.createElement('option')
    opt1.setAttribute('value', 'opt1')
    opt1.textContent = 'Option One'
    dropdown.appendChild(opt1)

    document.body.appendChild(dropdown)

    const option = dropdown.shadowRoot.querySelector('[data-id="option"]')
    option.click()

    const trigger = dropdown.shadowRoot.querySelector('[data-id="trigger"]')
    expect(trigger.textContent.trim()).toBe('Option One')
  })

  it('updates label text when label attribute changes', () => {
    document.body.appendChild(dropdown)
    dropdown.setAttribute('label', 'New Label')
    const trigger = dropdown.shadowRoot.querySelector('[data-id="trigger"]')
    expect(trigger.textContent.trim()).toBe('New Label')
  })

  it('does not close when clicking inside the dropdown', () => {
    document.body.appendChild(dropdown)
    const trigger = dropdown.shadowRoot.querySelector('[data-id="trigger"]')
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    const list = dropdown.shadowRoot.querySelector('[data-id="list"]')
    expect(list.classList.contains('open')).toBe(true)

    list.click()
    expect(list.classList.contains('open')).toBe(true)
  })

  it('toggles via the toggle() method', () => {
    document.body.appendChild(dropdown)
    dropdown.toggle()
    const list = dropdown.shadowRoot.querySelector('[data-id="list"]')
    expect(list.classList.contains('open')).toBe(true)

    dropdown.toggle()
    expect(list.classList.contains('open')).toBe(false)
  })

  it('renders options via the items setter', () => {
    document.body.appendChild(dropdown)
    dropdown.items = [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta' },
    ]

    const options = dropdown.shadowRoot.querySelectorAll('[data-id="option"]')
    expect(options).toHaveLength(2)
    expect(options[0].textContent).toBe('Alpha')
    expect(options[0].getAttribute('data-value')).toBe('a')
    expect(options[1].textContent).toBe('Beta')
    expect(options[1].getAttribute('data-value')).toBe('b')
  })

  it('matches shadow DOM snapshot', () => {
    document.body.appendChild(dropdown)
    expect(dropdown.shadowRoot.innerHTML).toMatchSnapshot()
  })
})
