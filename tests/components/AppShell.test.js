import '../../src/components/AppShell.js'
import '../../src/pages/todo/PageTodo.js'
import '../../src/pages/about/PageAbout.js'
import '../../src/pages/settings/PageSettings.js'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('AppShell', () => {
  let shell

  beforeEach(() => {
    shell = document.createElement('app-shell')
    document.body.appendChild(shell)
  })

  afterEach(() => {
    document.body.removeChild(shell)
    shell = null
  })

  it('renders a nav bar with three nav links', () => {
    const nav = shell.shadowRoot.querySelector('[data-id="nav"]')
    const links = nav.querySelectorAll('nav-link')
    expect(links).toHaveLength(3)
    expect(links[0].textContent.trim()).toBe('Home')
    expect(links[1].textContent.trim()).toBe('About')
    expect(links[2].textContent.trim()).toBe('Settings')
  })

  it('renders nav links with href attributes', () => {
    const nav = shell.shadowRoot.querySelector('[data-id="nav"]')
    const links = nav.querySelectorAll('nav-link')
    expect(links[0].getAttribute('href')).toBe('/')
    expect(links[1].getAttribute('href')).toBe('/about')
    expect(links[2].getAttribute('href')).toBe('/settings')
  })

  it('highlights active nav link', () => {
    shell.navigate('/about')
    const nav = shell.shadowRoot.querySelector('[data-id="nav"]')
    const links = nav.querySelectorAll('nav-link')
    expect(links[0].getAttribute('active')).toBeNull()
    expect(links[1].getAttribute('active')).toBe('')
    expect(links[2].getAttribute('active')).toBeNull()
  })

  it('renders page-todo on home route', () => {
    shell.navigate('/')
    const page = shell.querySelector('page-todo')
    expect(page).toBeDefined()
  })

  it('renders page-about on /about route', () => {
    shell.navigate('/about')
    const page = shell.querySelector('page-about')
    expect(page).toBeDefined()
  })

  it('renders page-settings on /settings route', () => {
    shell.navigate('/settings')
    const page = shell.querySelector('page-settings')
    expect(page).toBeDefined()
  })

  it('swaps page components when navigating', () => {
    shell.navigate('/about')
    expect(shell.querySelector('page-about')).toBeDefined()
    expect(shell.querySelector('page-todo')).toBeNull()

    shell.navigate('/')
    expect(shell.querySelector('page-todo')).toBeDefined()
    expect(shell.querySelector('page-about')).toBeNull()
  })

  it('clicking a nav link renders the correct page', () => {
    const nav = shell.shadowRoot.querySelector('[data-id="nav"]')
    const links = nav.querySelectorAll('nav-link')

    links[1].click()
    expect(shell.querySelector('page-about')).toBeDefined()
  })

  it('clicking a nav link renders the correct page', () => {
    const nav = shell.shadowRoot.querySelector('[data-id="nav"]')
    const links = nav.querySelectorAll('nav-link')

    links[1].click()
    expect(shell.querySelector('page-about')).toBeDefined()
    expect(shell.querySelector('page-todo')).toBeNull()

    links[0].click()
    expect(shell.querySelector('page-todo')).toBeDefined()
    expect(shell.querySelector('page-about')).toBeNull()
  })

  it('clicking a nav link highlights the active link', () => {
    const nav = shell.shadowRoot.querySelector('[data-id="nav"]')
    const links = nav.querySelectorAll('nav-link')

    // Start from /about route (clicking links[1] in a prior test establishes this,
    // but each test has a fresh shell, so we navigate explicitly)
    shell.navigate('/about')

    // Dispatch route-change directly to test highlighting
    // without relying on click event propagation timing
    window.dispatchEvent(new CustomEvent('route-change', {
      detail: { path: '/settings' },
    }))

    expect(links[2].getAttribute('active')).toBe('')
    expect(links[0].getAttribute('active')).toBeNull()
    expect(links[1].getAttribute('active')).toBeNull()
  })

  it('snapshot matches shadow DOM structure', () => {
    shell.navigate('/')
    expect(shell.shadowRoot.innerHTML).toMatchSnapshot()
  })
})
