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

  it('checks checkbox when selected', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('title', 'Buy milk')
    el.setAttribute('completed', 'false')
    el.setAttribute('selected', 'true')
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

  it('dispatches select event on checkbox change', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('id', 'abc123')
    el.setAttribute('title', 'Buy milk')
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('select', handler)

    const checkbox = el.shadowRoot.querySelector('input[type="checkbox"]')
    checkbox.click()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.id).toBe('abc123')
    expect(handler.mock.calls[0][0].detail.selected).toBe(true)
  })

  it('dispatches select event with selected=false when unchecked', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('id', 'abc123')
    el.setAttribute('title', 'Buy milk')
    el.setAttribute('selected', 'true')
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('select', handler)

    const checkbox = el.shadowRoot.querySelector('input[type="checkbox"]')
    checkbox.click()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.selected).toBe(false)
  })

  it('dispatches toggle event on double-click', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('id', 'abc123')
    el.setAttribute('title', 'Buy milk')
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('toggle', handler)

    const textSpan = el.shadowRoot.querySelector('[data-id="todoText"]')
    textSpan.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))

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

  it('shows place names when places are assigned', () => {
    const places = [{ id: 'p1', name: 'Home' }, { id: 'p2', name: 'Office' }]
    const el = document.createElement('todo-item')
    el.setAttribute('id', 'abc123')
    el.setAttribute('title', 'Buy milk')
    el.setAttribute('completed', 'false')
    el.setAttribute('place-ids', JSON.stringify(['p1', 'p2']))
    el.setAttribute('places', JSON.stringify(places))
    container.appendChild(el)

    const placeNames = el.shadowRoot.querySelectorAll('[data-id="placeNames"] .placeName')
    expect(placeNames).toHaveLength(2)
    expect(placeNames[0].textContent).toBe('Home')
    expect(placeNames[1].textContent).toBe('Office')
  })

  it('does not show place names when no places assigned', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('id', 'abc123')
    el.setAttribute('title', 'Buy milk')
    el.setAttribute('completed', 'false')
    el.setAttribute('place-ids', '[]')
    container.appendChild(el)

    const placeNames = el.shadowRoot.querySelector('[data-id="placeNames"]')
    expect(placeNames.textContent.trim()).toBe('')
  })

  it('shows description when provided', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('id', 'abc123')
    el.setAttribute('title', 'Buy milk')
    el.setAttribute('completed', 'false')
    el.setAttribute('description', 'Need to buy organic milk')
    container.appendChild(el)

    const descContent = el.shadowRoot.querySelector('[data-id="descriptionContent"]')
    expect(descContent).toBeTruthy()
    expect(descContent.textContent).toBe('Need to buy organic milk')
  })

  it('hides description section when no description', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('id', 'abc123')
    el.setAttribute('title', 'Buy milk')
    el.setAttribute('completed', 'false')
    container.appendChild(el)

    const descSection = el.shadowRoot.querySelector('[data-id="descriptionSection"]')
    expect(descSection).toBeFalsy()
  })

  it('toggles description visibility on toggle button click', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('id', 'abc123')
    el.setAttribute('title', 'Buy milk')
    el.setAttribute('completed', 'false')
    el.setAttribute('description', 'Need to buy organic milk')
    container.appendChild(el)

    const descContent = el.shadowRoot.querySelector('[data-id="descriptionContent"]')
    const descToggle = el.shadowRoot.querySelector('[data-id="descriptionToggle"]')
    expect(descContent.style.display).toBe('none')

    descToggle.click()
    expect(descContent.style.display).toBe('block')
    expect(descToggle.textContent).toBe('▶')

    descToggle.click()
    expect(descContent.style.display).toBe('none')
    expect(descToggle.textContent).toBe('▼')
  })

  it('dispatches place-change with placeIds array when toggling a place', () => {
    const places = [{ id: 'p1', name: 'Home' }, { id: 'p2', name: 'Office' }]
    const el = document.createElement('todo-item')
    el.setAttribute('id', 'abc123')
    el.setAttribute('title', 'Buy milk')
    el.setAttribute('completed', 'false')
    el.setAttribute('place-ids', JSON.stringify(['p1']))
    el.setAttribute('places', JSON.stringify(places))
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('place-change', handler)

    el.placeBtn.click()
    const option = el.shadowRoot.querySelector('[data-id="place-p2"]')
    option.click()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.id).toBe('abc123')
    expect(handler.mock.calls[0][0].detail.placeIds).toEqual(['p1', 'p2'])
  })

  it('removes place from placeIds when toggling off', () => {
    const places = [{ id: 'p1', name: 'Home' }, { id: 'p2', name: 'Office' }]
    const el = document.createElement('todo-item')
    el.setAttribute('id', 'abc123')
    el.setAttribute('title', 'Buy milk')
    el.setAttribute('completed', 'false')
    el.setAttribute('place-ids', JSON.stringify(['p1', 'p2']))
    el.setAttribute('places', JSON.stringify(places))
    container.appendChild(el)

    const handler = vi.fn()
    el.addEventListener('place-change', handler)

    el.placeBtn.click()
    const option = el.shadowRoot.querySelector('[data-id="place-p1"]')
    option.click()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.placeIds).toEqual(['p2'])
  })

  it('applies selected class when selected', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('id', 'abc123')
    el.setAttribute('title', 'Buy milk')
    el.setAttribute('completed', 'false')
    el.setAttribute('selected', 'true')
    container.appendChild(el)

    const label = el.shadowRoot.querySelector('.todoItem')
    expect(label.classList.contains('selected')).toBe(true)
  })

  it('does not apply selected class when not selected', () => {
    const el = document.createElement('todo-item')
    el.setAttribute('id', 'abc123')
    el.setAttribute('title', 'Buy milk')
    el.setAttribute('completed', 'false')
    el.setAttribute('selected', 'false')
    container.appendChild(el)

    const label = el.shadowRoot.querySelector('.todoItem')
    expect(label.classList.contains('selected')).toBe(false)
  })
})
