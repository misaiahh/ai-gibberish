import '../../src/components/AppShell.js'
import '../../src/pages/todo/PageTodo.js'
import '../../src/pages/about/PageAbout.js'
import '../../src/pages/settings/PageSettings.js'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('AppShell', () => {
  let shell

  beforeEach(() => {
    shell = document.createElement('app-shell')
    document.body.appendChild(shell)
  })

  afterEach(() => {
    document.body.removeChild(shell)
    shell = null
    vi.restoreAllMocks()
  })

  it('renders a header with app title and user button', () => {
    const header = shell.shadowRoot.querySelector('header')
    expect(header).toBeDefined()
    const title = shell.shadowRoot.querySelector('[data-id="appTitle"]')
    expect(title).toBeDefined()
    expect(title.textContent.trim()).toBe('Todo App')
    const userBtn = shell.shadowRoot.querySelector('[data-id="userBtn"]')
    expect(userBtn).toBeDefined()
  })

  it('renders a user dropdown with Settings link', () => {
    const dropdown = shell.shadowRoot.querySelector('[data-id="userDropdown"]')
    expect(dropdown).toBeDefined()
    expect(dropdown.classList.contains('hidden')).toBe(true)
    const settingsLink = dropdown.querySelector('nav-link')
    expect(settingsLink).toBeDefined()
    expect(settingsLink.getAttribute('href')).toBe('/settings')
  })

  it('toggles user dropdown on user button click', () => {
    const dropdown = shell.shadowRoot.querySelector('[data-id="userDropdown"]')
    const userBtn = shell.shadowRoot.querySelector('[data-id="userBtn"]')
    userBtn.click()
    expect(dropdown.classList.contains('hidden')).toBe(false)
    userBtn.click()
    expect(dropdown.classList.contains('hidden')).toBe(true)
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

  it('clicking a nav link in dropdown renders the correct page', () => {
    const dropdown = shell.shadowRoot.querySelector('[data-id="userDropdown"]')
    const settingsLink = dropdown.querySelector('nav-link')
    settingsLink.click()
    expect(shell.querySelector('page-settings')).toBeDefined()
  })

  it('clicking outside the dropdown closes it', () => {
    const dropdown = shell.shadowRoot.querySelector('[data-id="userDropdown"]')
    const userBtn = shell.shadowRoot.querySelector('[data-id="userBtn"]')
    userBtn.click()
    expect(dropdown.classList.contains('hidden')).toBe(false)
    document.body.click()
    expect(dropdown.classList.contains('hidden')).toBe(true)
  })

  it('renders a footer with an about link', () => {
    const footer = shell.shadowRoot.querySelector('footer')
    expect(footer).toBeDefined()
    const aboutLink = footer.querySelector('[data-id="aboutLink"]')
    expect(aboutLink).toBeDefined()
    expect(aboutLink.textContent.trim()).toBe('About')
    expect(aboutLink.getAttribute('href')).toBe('/about')
  })

  it('navigates to home when title is clicked', () => {
    shell.navigate('/about')
    window.dispatchEvent(new CustomEvent('route-change', {
      detail: { path: '/about' },
    }))
    const title = shell.shadowRoot.querySelector('[data-id="appTitle"]')
    title.click()
    expect(location.pathname).toBe('/')
  })

  it('navigates to about when footer about link is clicked', () => {
    const aboutLink = shell.shadowRoot.querySelector('[data-id="aboutLink"]')
    aboutLink.click()
    expect(location.pathname).toBe('/about')
  })

  it('snapshot matches shadow DOM structure', async () => {
    shell.navigate('/')
    window.dispatchEvent(new CustomEvent('route-change', {
      detail: { path: '/' },
    }))
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(shell.shadowRoot.innerHTML).toMatchSnapshot()
  })
})
