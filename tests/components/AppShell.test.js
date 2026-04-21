import '../../src/components/AppShell.js'
import '../../src/pages/todo/PageTodo.js'
import '../../src/pages/about/PageAbout.js'
import '../../src/pages/settings/PageSettings.js'
import '../../src/pages/places/PagePlaces.js'
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

  it('renders a sidebar with Home and Places links', () => {
    const sidebar = shell.shadowRoot.querySelector('.sidebar')
    expect(sidebar).toBeDefined()
    const links = sidebar.querySelectorAll('nav-link')
    expect(links).toHaveLength(2)
    expect(links[0].getAttribute('href')).toBe('/')
    expect(links[1].getAttribute('href')).toBe('/places')
  })

  it('renders a header with title and action buttons', () => {
    const header = shell.shadowRoot.querySelector('header.header')
    expect(header).toBeDefined()
    const title = header.querySelector('[data-id="appTitle"]')
    expect(title).toBeDefined()
    expect(title.textContent).toBe('Todo App')
    const themeToggle = header.querySelector('[data-id="themeToggle"]')
    expect(themeToggle).toBeDefined()
    const userBtn = header.querySelector('[data-id="userBtn"]')
    expect(userBtn).toBeDefined()
    const dropdown = header.querySelector('[data-id="userDropdown"]')
    expect(dropdown).toBeDefined()
  })

  it('renders a content area with slot', () => {
    const content = shell.shadowRoot.querySelector('.content')
    expect(content).toBeDefined()
    const pageContent = content.querySelector('.pageContent')
    expect(pageContent).toBeDefined()
    const slot = pageContent.querySelector('slot')
    expect(slot).toBeDefined()
  })

  it('renders a footer with about link', () => {
    const footer = shell.shadowRoot.querySelector('footer')
    expect(footer).toBeDefined()
    const aboutLink = footer.querySelector('[data-id="aboutLink"]')
    expect(aboutLink).toBeDefined()
    expect(aboutLink.textContent.trim()).toBe('About')
    expect(aboutLink.getAttribute('href')).toBe('/about')
  })

  it('renders page-todo on home route', () => {
    shell.navigate('/')
    const page = shell.querySelector('page-todo')
    expect(page).toBeDefined()
  })

  it('renders page-places on /places route', () => {
    shell.navigate('/places')
    const page = shell.querySelector('page-places')
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

  it('toggles sidebar collapse state', () => {
    const collapseBtn = shell.shadowRoot.querySelector('[data-id="collapseBtn"]')
    expect(collapseBtn.textContent).toBe('«')
    expect(shell.classList.contains('sidebar-collapsed')).toBe(false)

    collapseBtn.click()
    expect(shell.classList.contains('sidebar-collapsed')).toBe(true)
    expect(collapseBtn.textContent).toBe('»')

    collapseBtn.click()
    expect(shell.classList.contains('sidebar-collapsed')).toBe(false)
    expect(collapseBtn.textContent).toBe('«')
  })

  it('has all four layout regions in shadow DOM', () => {
    const header = shell.shadowRoot.querySelector('header.header')
    const sidebar = shell.shadowRoot.querySelector('.sidebar')
    const content = shell.shadowRoot.querySelector('.content')
    const footer = shell.shadowRoot.querySelector('footer')
    expect(header).toBeDefined()
    expect(sidebar).toBeDefined()
    expect(content).toBeDefined()
    expect(footer).toBeDefined()
  })

  it('shadow DOM structure is correct order', () => {
    const html = shell.shadowRoot.innerHTML
    const headerIdx = html.indexOf('<header class="header">')
    const sidebarIdx = html.indexOf('<nav class="sidebar">')
    const contentIdx = html.indexOf('<div class="content">')
    const footerIdx = html.indexOf('<footer>')
    expect(headerIdx).toBeLessThan(sidebarIdx)
    expect(sidebarIdx).toBeLessThan(contentIdx)
    expect(contentIdx).toBeLessThan(footerIdx)
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
