import { createRouter } from '../../src/utils/router.js'
import { describe, it, expect, beforeEach } from 'vitest'

describe('createRouter', () => {
  let router

  beforeEach(() => {
    history.replaceState({}, '', '/')
    router = createRouter()
  })

  it('calls the matching route callback', () => {
    const calls = []
    router.get('/', () => calls.push('home'))
    router.get('/about', () => calls.push('about'))

    router.start()
    expect(calls).toEqual(['home'])

    router.navigate('/about')
    expect(calls).toEqual(['home', 'about'])
  })

  it('calls the wildcard route on unmatched paths', () => {
    const calls = []
    router.get('*', () => calls.push('fallback'))

    router.start()
    expect(calls).toEqual(['fallback'])

    router.navigate('/nonexistent')
    expect(calls).toContain('fallback')
  })

  it('does not re-call the same route', () => {
    const calls = []
    router.get('/', () => calls.push('home'))

    router.start()
    router.navigate('/')

    expect(calls).toEqual(['home'])
  })

  it('replaces history state on 404', () => {
    const calls = []
    router.get('*', () => {
      history.replaceState({}, '', '/')
      calls.push('replaced')
    })

    router.start()
    router.navigate('/unknown')
    expect(calls).toContain('replaced')
    expect(location.pathname).toBe('/')
  })

  it('does not call callback if route has not changed', () => {
    const calls = []
    router.get('/', () => calls.push('home'))

    router.start()
    router.navigate('/')

    expect(calls).toEqual(['home'])
  })

  it('handles multiple defined routes', () => {
    const calls = []
    router.get('/', () => calls.push('home'))
    router.get('/about', () => calls.push('about'))
    router.get('/settings', () => calls.push('settings'))

    router.start()
    expect(calls).toEqual(['home'])

    router.navigate('/settings')
    expect(calls).toEqual(['home', 'settings'])

    router.navigate('/about')
    expect(calls).toEqual(['home', 'settings', 'about'])
  })

  it('handles popstate events from browser navigation', () => {
    const calls = []
    router.get('/', () => calls.push('home'))
    router.get('/about', () => calls.push('about'))

    router.start()
    expect(calls).toEqual(['home'])

    router.navigate('/about')
    expect(calls).toEqual(['home', 'about'])

    // Simulate browser back navigation
    history.pushState({}, '', '/')
    window.dispatchEvent(new PopStateEvent('popstate'))
    expect(calls).toEqual(['home', 'about', 'home'])
  })

  it('wildcard catches all unmatched paths', () => {
    const calls = []
    router.get('/about', () => calls.push('about'))
    router.get('*', () => calls.push('fallback'))

    router.start()
    expect(calls).toEqual(['fallback'])

    router.navigate('/unknown')
    expect(calls).toEqual(['fallback', 'fallback'])

    router.navigate('/about')
    expect(calls).toEqual(['fallback', 'fallback', 'about'])
  })
})
