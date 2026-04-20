import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
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

  it('should only call fetch once when page-todo is appended to DOM', async () => {
    // Step 1: Create element — fetch should NOT be called yet
    const page = document.createElement('page-todo')
    expect(window.fetch).toHaveBeenCalledTimes(0)

    // Step 2: Append to DOM — this triggers connectedCallback -> fetch
    container.appendChild(page)
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Step 3: Verify fetch was called exactly once
    const callCount = window.fetch.mock.calls.length
    console.log('fetch call count:', callCount)
    console.log('fetch calls:', window.fetch.mock.calls)

    expect(callCount).toBe(1)
  })

  it('should only call fetch once when page-todo is removed and re-appended', async () => {
    const page = document.createElement('page-todo')
    container.appendChild(page)
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(window.fetch).toHaveBeenCalledTimes(1)

    // Remove and re-append — connectedCallback fires again
    container.removeChild(page)
    container.appendChild(page)
    await new Promise((resolve) => setTimeout(resolve, 100))

    const callCount = window.fetch.mock.calls.length
    console.log('fetch call count after re-append:', callCount)

    // Should still be 1 because of #initialized guard
    expect(callCount).toBe(1)
  })

  it('should only call fetch once when multiple page-todo elements are created and appended', async () => {
    // Simulate what AppShell does: remove old, create new
    const page1 = document.createElement('page-todo')
    container.appendChild(page1)
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(window.fetch).toHaveBeenCalledTimes(1)

    // Simulate AppShell removing old and creating new
    page1.remove()

    const page2 = document.createElement('page-todo')
    container.appendChild(page2)
    await new Promise((resolve) => setTimeout(resolve, 100))

    const callCount = window.fetch.mock.calls.length
    console.log('fetch call count after remove+create:', callCount)

    // This should be 2 (one per element instance), not more
    expect(callCount).toBe(2)
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

    expect(window.fetch).toHaveBeenCalledTimes(1)

    // The other one still hasn't been connected
    const beforeConnect = window.fetch.mock.calls.length
    expect(beforeConnect).toBe(1)

    // Now connect it
    container.appendChild(another)
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(window.fetch).toHaveBeenCalledTimes(2)
  })
})
