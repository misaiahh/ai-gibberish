import '../../src/pages/settings/PageSettings.js'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('PageSettings', () => {
  let page

  beforeEach(() => {
    page = document.createElement('page-settings')
    document.body.appendChild(page)
  })

  afterEach(() => {
    document.body.removeChild(page)
    page = null
  })

  it('renders an h2 heading', () => {
    const h2 = page.shadowRoot.querySelector('h2')
    expect(h2).toBeDefined()
    expect(h2.textContent.trim()).toBe('Settings')
  })

  it('displays the current storage type', () => {
    const storageType = page.shadowRoot.querySelector('[data-id="storageType"]')
    expect(storageType).toBeDefined()
    expect(storageType.textContent).toBeTruthy()
  })

  it('displays the current storage key', () => {
    const storageKey = page.shadowRoot.querySelector('[data-id="storageKey"]')
    expect(storageKey).toBeDefined()
    expect(storageKey.textContent).toBeTruthy()
  })

  it('snapshot matches shadow DOM structure', () => {
    expect(page.shadowRoot.innerHTML).toMatchSnapshot()
  })

  it('renders a disable storage button', () => {
    const btn = page.shadowRoot.querySelector('[data-id="disableBtn"]')
    expect(btn).toBeDefined()
    expect(btn.textContent.trim()).toBe('Disable')
  })

  it('renders a confirmation modal with cancel and confirm buttons', () => {
    const modal = page.shadowRoot.querySelector('[data-id="modal"]')
    expect(modal).toBeDefined()
    expect(modal.classList.contains('hidden')).toBe(true)
    const cancelBtn = page.shadowRoot.querySelector('[data-id="cancelBtn"]')
    expect(cancelBtn).toBeDefined()
    expect(cancelBtn.textContent.trim()).toBe('Cancel')
    const confirmBtn = page.shadowRoot.querySelector('[data-id="confirmBtn"]')
    expect(confirmBtn).toBeDefined()
    expect(confirmBtn.textContent.trim()).toBe('Confirm')
  })

  it('shows the modal when disable button is clicked', () => {
    const modal = page.shadowRoot.querySelector('[data-id="modal"]')
    const btn = page.shadowRoot.querySelector('[data-id="disableBtn"]')
    btn.click()
    expect(modal.classList.contains('hidden')).toBe(false)
  })

  it('hides the modal when cancel is clicked', () => {
    const modal = page.shadowRoot.querySelector('[data-id="modal"]')
    const btn = page.shadowRoot.querySelector('[data-id="disableBtn"]')
    btn.click()
    const cancelBtn = page.shadowRoot.querySelector('[data-id="cancelBtn"]')
    cancelBtn.click()
    expect(modal.classList.contains('hidden')).toBe(true)
  })

  it('dispatches storage:disable when confirm is clicked', () => {
    const modal = page.shadowRoot.querySelector('[data-id="modal"]')
    const btn = page.shadowRoot.querySelector('[data-id="disableBtn"]')
    const confirmBtn = page.shadowRoot.querySelector('[data-id="confirmBtn"]')
    let fired = false
    page.addEventListener('storage:disable', () => { fired = true })
    btn.click()
    expect(modal.classList.contains('hidden')).toBe(false)
    confirmBtn.click()
    expect(modal.classList.contains('hidden')).toBe(true)
    expect(fired).toBe(true)
  })
})
