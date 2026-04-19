import '../../src/components/NavLink.js'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('NavLink', () => {
  let link

  beforeEach(() => {
    // Reset location to home before each test
    history.replaceState({}, '', '/')
    link = document.createElement('nav-link')
    link.setAttribute('href', '/about')
    link.textContent = 'About'
    document.body.appendChild(link)
  })

  afterEach(() => {
    document.body.removeChild(link)
    link = null
    history.replaceState({}, '', '/')
  })

  it('renders a shadow DOM with a slot', () => {
    expect(link.shadowRoot).toBeTruthy()
    expect(link.shadowRoot.querySelector('slot')).toBeTruthy()
  })

  it('displays the slotted text content', () => {
    expect(link.textContent.trim()).toBe('About')
  })

  it('reads href from attribute', () => {
    expect(link.getAttribute('href')).toBe('/about')
  })

  it('navigates when clicked', () => {
    const shell = document.createElement('app-shell')
    document.body.appendChild(shell)

    link.click()
    expect(shell.querySelector('page-about')).toBeDefined()

    document.body.removeChild(shell)
  })

  it('updates active class when href matches current path', () => {
    history.replaceState({}, '', '/about')
    const link2 = document.createElement('nav-link')
    link2.setAttribute('href', '/about')
    link2.textContent = 'About'
    document.body.appendChild(link2)

    expect(
      link2.shadowRoot.querySelector('[part="link"]').classList.contains('active')
    ).toBe(true)
    document.body.removeChild(link2)
  })

  it('does not highlight when href differs from current path', () => {
    const link2 = document.createElement('nav-link')
    link2.setAttribute('href', '/settings')
    link2.textContent = 'Settings'
    document.body.appendChild(link2)

    expect(
      link2.shadowRoot.querySelector('[part="link"]').classList.contains('active')
    ).toBe(false)
    document.body.removeChild(link2)
  })

  it('renders with a part attribute for CSS styling', () => {
    const inner = link.shadowRoot.querySelector('[part="link"]')
    expect(inner).toBeTruthy()
  })
})
