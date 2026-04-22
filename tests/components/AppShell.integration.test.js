import { createRouter } from '../../src/utils/router.js'
import { resetSessionState } from '../../src/service/apiService.js'
import '../../src/components/NavLink.js'
import '../../src/components/AppShell.js'
import '../../src/pages/todo/PageTodo.js'
import '../../src/components/TodoInput.js'
import '../../src/components/TodoItem.js'
import '../../src/components/TodoList.js'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('AppShell + router fetch count on initial load', () => {
  let container
  let router

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)

    history.replaceState({}, '', '/')

    // Create a fresh router to avoid singleton state bleeding
    router = createRouter()

    resetSessionState()
    window.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    )
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
    vi.restoreAllMocks()
  })

  it('should call GET /api/session, /api/todos and /api/places once during initial page load', async () => {
    // Simulate the full init sequence from main.js

    // Step 1: <app-shell> is in index.html
    const shell = document.createElement('app-shell')
    container.appendChild(shell)

    // Step 2: Register routes (from main.js)
    router.get('/', () => shell.navigate('/'))
    router.get('/about', () => shell.navigate('/about'))
    router.get('/settings', () => shell.navigate('/settings'))
    router.get('*', () => {
      history.replaceState({}, '', '/')
      shell.navigate('/')
    })

    // Step 3: Start router
    router.start()

    // Step 4: Wait for async fetch
    await new Promise((resolve) => setTimeout(resolve, 200))

    const callCount = window.fetch.mock.calls.length
    const urls = window.fetch.mock.calls.map((c) => c[0])
    console.log('fetch call count:', callCount)
    console.log('fetch URLs:', urls)

    expect(callCount).toBe(3)
    expect(urls).toContain('/api/session')
    expect(urls).toContain('/api/todos')
    expect(urls).toContain('/api/places')
  })

  it('should call GET /api/session, /api/todos and /api/places once per navigation to home', async () => {
    const shell = document.createElement('app-shell')
    container.appendChild(shell)

    router.get('/', () => shell.navigate('/'))
    router.get('/about', () => shell.navigate('/about'))
    router.get('/settings', () => shell.navigate('/settings'))
    router.get('*', () => {
      history.replaceState({}, '', '/')
      shell.navigate('/')
    })

    router.start()
    await new Promise((resolve) => setTimeout(resolve, 200))

    expect(window.fetch).toHaveBeenCalledTimes(3)

    // Navigate to about
    router.navigate('/about')
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Navigate back to home
    router.navigate('/')
    await new Promise((resolve) => setTimeout(resolve, 200))

    const callCount = window.fetch.mock.calls.length
    const urls = window.fetch.mock.calls.map((c) => c[0])
    console.log('fetch call count after / -> /about -> /:', callCount)
    console.log('fetch URLs:', urls)

    // First load: 3 calls (session + todos + places)
    // Second load: 2 calls (no session, already initialized + todos + places)
    // Total: 5
    expect(callCount).toBe(5)
  })
})
