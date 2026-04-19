import '../../src/components/PageAbout.js'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('PageAbout', () => {
  let page

  beforeEach(() => {
    page = document.createElement('page-about')
    document.body.appendChild(page)
  })

  afterEach(() => {
    document.body.removeChild(page)
    page = null
  })

  it('renders an h2 heading', () => {
    const h2 = page.shadowRoot.querySelector('h2')
    expect(h2).toBeDefined()
    expect(h2.textContent.trim()).toBe('About This App')
  })

  it('renders a paragraph about the app', () => {
    const paragraphs = page.shadowRoot.querySelectorAll('p')
    expect(paragraphs.length).toBeGreaterThanOrEqual(1)
    expect(paragraphs[0].textContent).toContain('Web Components')
  })

  it('renders a list of technologies', () => {
    const ul = page.shadowRoot.querySelector('ul')
    expect(ul).toBeDefined()
    const items = ul.querySelectorAll('li')
    expect(items.length).toBeGreaterThanOrEqual(3)
  })

  it('snapshot matches shadow DOM structure', () => {
    expect(page.shadowRoot.innerHTML).toMatchSnapshot()
  })
})
