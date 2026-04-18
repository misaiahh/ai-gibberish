import '../src/main.js'
import { describe, it, expect } from 'vitest'

describe('main.js', () => {
  it('registers all custom elements', () => {
    expect(customElements.get('todo-input')).toBeDefined()
    expect(customElements.get('todo-item')).toBeDefined()
    expect(customElements.get('todo-list')).toBeDefined()
    expect(customElements.get('todo-app')).toBeDefined()
  })

  it('creates a todo-app element without errors', () => {
    const el = document.createElement('todo-app')
    expect(el).toBeDefined()
    expect(el.shadowRoot).toBeTruthy()
  })
})
