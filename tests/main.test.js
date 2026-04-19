import '../src/main.js'
import { describe, it, expect } from 'vitest'

describe('main.js', () => {
  it('registers all custom elements', () => {
    expect(customElements.get('nav-link')).toBeDefined()
    expect(customElements.get('app-shell')).toBeDefined()
    expect(customElements.get('page-todo')).toBeDefined()
    expect(customElements.get('page-about')).toBeDefined()
    expect(customElements.get('page-settings')).toBeDefined()
    expect(customElements.get('todo-input')).toBeDefined()
    expect(customElements.get('todo-item')).toBeDefined()
    expect(customElements.get('todo-list')).toBeDefined()
  })

  it('creates an app-shell element without errors', () => {
    const el = document.createElement('app-shell')
    expect(el).toBeDefined()
    expect(el.shadowRoot).toBeTruthy()
  })
})
