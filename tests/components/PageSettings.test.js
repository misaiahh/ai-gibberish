import '../../src/pages/settings/PageSettings.js'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('PageSettings', () => {
  let page

  beforeEach(() => {
    page = document.createElement('page-settings')
    document.body.appendChild(page)
  })

  afterEach(() => {
    document.body.removeChild(page)
    page = null
  })

  it('renders an h2 heading', () => {
    const h2 = page.shadowRoot.querySelector('h2')
    expect(h2).toBeDefined()
    expect(h2.textContent.trim()).toBe('Settings')
  })

  it('displays the current storage type', () => {
    const storageType = page.shadowRoot.querySelector('[data-id="storageType"]')
    expect(storageType).toBeDefined()
    expect(storageType.textContent).toBeTruthy()
  })

  it('displays the current storage key', () => {
    const storageKey = page.shadowRoot.querySelector('[data-id="storageKey"]')
    expect(storageKey).toBeDefined()
    expect(storageKey.textContent).toBeTruthy()
  })

  it('snapshot matches shadow DOM structure', () => {
    expect(page.shadowRoot.innerHTML).toMatchSnapshot()
  })
})
