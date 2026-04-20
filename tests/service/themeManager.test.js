import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { themeManager } from '../../src/service/themeManager.js'

describe('themeManager', () => {
  beforeEach(() => {
    themeManager.setTheme('light')
    localStorage.removeItem('theme')
    document.body.removeAttribute('data-theme')
  })

  afterEach(() => {
    themeManager.setTheme('light')
    localStorage.removeItem('theme')
    document.body.removeAttribute('data-theme')
  })

  describe('init', () => {
    it('defaults to light when no saved theme', () => {
      themeManager.init()
      expect(themeManager.getTheme()).toBe('light')
      expect(document.body.getAttribute('data-theme')).toBe('light')
    })

    it('restores saved theme from localStorage', () => {
      localStorage.setItem('theme', 'dark')
      themeManager.init()
      expect(themeManager.getTheme()).toBe('dark')
      expect(document.body.getAttribute('data-theme')).toBe('dark')
    })

    it('defaults to light when saved theme is invalid', () => {
      localStorage.setItem('theme', 'sepia')
      themeManager.init()
      expect(themeManager.getTheme()).toBe('light')
    })

    it('applies CSS custom properties to body style', () => {
      themeManager.init()
      expect(document.body.style.getPropertyValue('--bg-app')).toBe('#f5f5f5')
    })
  })

  describe('setTheme', () => {
    it('sets light theme', () => {
      themeManager.setTheme('light')
      expect(themeManager.getTheme()).toBe('light')
      expect(document.body.getAttribute('data-theme')).toBe('light')
    })

    it('sets dark theme', () => {
      themeManager.setTheme('dark')
      expect(themeManager.getTheme()).toBe('dark')
      expect(document.body.getAttribute('data-theme')).toBe('dark')
    })

    it('ignores invalid theme values', () => {
      themeManager.setTheme('dark')
      themeManager.setTheme('sepia')
      expect(themeManager.getTheme()).toBe('dark')
    })

    it('persists theme to localStorage', () => {
      themeManager.setTheme('dark')
      expect(localStorage.getItem('theme')).toBe('dark')
    })

    it('applies light palette CSS variables', () => {
      themeManager.setTheme('light')
      expect(document.body.style.getPropertyValue('--bg-app')).toBe('#f5f5f5')
      expect(document.body.style.getPropertyValue('--text-primary')).toBe('#333333')
    })

    it('applies dark palette CSS variables', () => {
      themeManager.setTheme('dark')
      expect(document.body.style.getPropertyValue('--bg-app')).toBe('#1a1a2e')
      expect(document.body.style.getPropertyValue('--text-primary')).toBe('#e2e2e2')
      expect(document.body.style.getPropertyValue('--bg-card')).toBe('#252540')
    })
  })

  describe('toggle', () => {
    it('switches from light to dark', () => {
      themeManager.setTheme('light')
      themeManager.toggle()
      expect(themeManager.getTheme()).toBe('dark')
    })

    it('switches from dark to light', () => {
      themeManager.setTheme('dark')
      themeManager.toggle()
      expect(themeManager.getTheme()).toBe('light')
    })

    it('toggles in localStorage', () => {
      themeManager.setTheme('light')
      themeManager.toggle()
      expect(localStorage.getItem('theme')).toBe('dark')
    })
  })

  describe('getTheme', () => {
    it('returns current theme', () => {
      expect(themeManager.getTheme()).toBe('light')
      themeManager.setTheme('dark')
      expect(themeManager.getTheme()).toBe('dark')
    })
  })

  describe('theme-change event', () => {
    it('dispatches theme-change event on setTheme', () => {
      const handler = vi.fn()
      document.addEventListener('theme-change', handler)
      themeManager.setTheme('dark')
      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail.theme).toBe('dark')
    })

    it('dispatches theme-change event on toggle', () => {
      const handler = vi.fn()
      document.addEventListener('theme-change', handler)
      themeManager.toggle()
      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail.theme).toBe('dark')
    })

    it('multiple listeners all receive the event', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      document.addEventListener('theme-change', handler1)
      document.addEventListener('theme-change', handler2)
      themeManager.setTheme('dark')
      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).toHaveBeenCalledTimes(1)
    })

    it('listeners can remove themselves', () => {
      const handler = vi.fn()
      document.addEventListener('theme-change', handler)
      document.removeEventListener('theme-change', handler)
      themeManager.setTheme('dark')
      expect(handler).not.toHaveBeenCalled()
    })
  })
})
