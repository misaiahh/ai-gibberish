import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { resetSessionState } from '../../src/service/apiService.js'
import '../../src/pages/todo/PageTodo.js'
import '../../src/components/TodoInput.js'
import '../../src/components/TodoItem.js'
import '../../src/components/TodoList.js'
import '../../src/components/AppShell.js'

describe('PageTodo fetch count on page load', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)

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

  it('should call fetch three times when page-todo is appended to DOM', async () => {
    // Step 1: Create element — fetch should NOT be called yet
    const page = document.createElement('page-todo')
    expect(window.fetch).toHaveBeenCalledTimes(0)

    // Step 2: Append to DOM — this triggers connectedCallback -> fetch
    container.appendChild(page)
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Step 3: Verify fetch was called exactly three times (session + todos + places)
    const callCount = window.fetch.mock.calls.length
    console.log('fetch call count:', callCount)
    console.log('fetch calls:', window.fetch.mock.calls)

    expect(callCount).toBe(3)
  })

  it('should call fetch three times when page-todo is removed and re-appended', async () => {
    const page = document.createElement('page-todo')
    container.appendChild(page)
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(window.fetch).toHaveBeenCalledTimes(3)

    // Remove and re-append — connectedCallback fires again
    container.removeChild(page)
    container.appendChild(page)
    await new Promise((resolve) => setTimeout(resolve, 100))

    const callCount = window.fetch.mock.calls.length
    console.log('fetch call count after re-append:', callCount)

    // Should still be 3 because of #initialized guard
    expect(callCount).toBe(3)
  })

  it('should call fetch three times when multiple page-todo elements are created and appended', async () => {
    // Simulate what AppShell does: remove old, create new
    const page1 = document.createElement('page-todo')
    container.appendChild(page1)
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(window.fetch).toHaveBeenCalledTimes(3)

    // Simulate AppShell removing old and creating new
    page1.remove()

    const page2 = document.createElement('page-todo')
    container.appendChild(page2)
    await new Promise((resolve) => setTimeout(resolve, 100))

    const callCount = window.fetch.mock.calls.length
    console.log('fetch call count after remove+create:', callCount)

    // First element: 3 calls (session + todos + places)
    // Second element: 2 calls (no session, already initialized + todos + places)
    // Total: 5
    expect(callCount).toBe(5)
  })

  it('should NOT call fetch in constructor — even with element sitting in DOM without being connected', async () => {
    // Create and keep disconnected
    const disconnected = document.createElement('page-todo')

    // Another one
    const another = document.createElement('page-todo')

    // Still none should have called fetch
    expect(window.fetch).toHaveBeenCalledTimes(0)

    // Only connect one
    container.appendChild(disconnected)
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(window.fetch).toHaveBeenCalledTimes(3)

    // The other one still hasn't been connected
    const beforeConnect = window.fetch.mock.calls.length
    expect(beforeConnect).toBe(3)

    // Now connect it
    container.appendChild(another)
    await new Promise((resolve) => setTimeout(resolve, 100))

    // First element: 3 calls (session + todos + places)
    // Second element: 2 calls (no session, already initialized + todos + places)
    // Total: 5
    expect(window.fetch).toHaveBeenCalledTimes(5)
  })
})
