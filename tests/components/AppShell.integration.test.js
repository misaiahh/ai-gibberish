import { createRouter } from '../../src/utils/router.js'
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

  it('should only call GET /api/todos once during initial page load', async () => {
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

    expect(callCount).toBe(1)
    expect(urls).toEqual(['/api/todos'])
  })

  it('should only call GET /api/todos once per navigation to home', async () => {
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

    expect(window.fetch).toHaveBeenCalledTimes(1)

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

    // Should be exactly 2: one on initial load, one on returning to home
    expect(callCount).toBe(2)
  })
})
