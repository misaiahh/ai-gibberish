import { config } from '../../config.js'
import { preferencesService } from '../../service/preferencesService.js'
import { storageService } from '../../service/storageService.js'
import { themeManager } from '../../service/themeManager.js'

export class PageSettings extends HTMLElement {
  #preferences = null

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.#bindEvents()
    this.#preferences = config.preferences
    this.#render()
  }

  #bindEvents() {
    this.shadowRoot.addEventListener('click', (e) => {
      const disableBtn = e.target.closest('[data-id="disableBtn"]')
      if (disableBtn) {
        this.shadowRoot.querySelector('[data-id="modal"]').classList.remove('hidden')
        return
      }

      const modal = this.shadowRoot.querySelector('[data-id="modal"]')
      const cancelBtn = e.target.closest('[data-id="cancelBtn"]')
      if (cancelBtn) {
        modal.classList.add('hidden')
        return
      }

      const confirmBtn = e.target.closest('[data-id="confirmBtn"]')
      if (confirmBtn) {
        modal.classList.add('hidden')
        this.dispatchEvent(new CustomEvent('storage:disable', { bubbles: true }))
      }
    })

    this.shadowRoot.addEventListener('change', async (e) => {
      const toggle = e.target.closest('[data-id="toggle"]')
      if (!toggle) return

      const pref = toggle.dataset.pref
      const value = toggle.checked

      // Theme toggle
      if (pref === 'theme') {
        themeManager.setTheme(value ? 'dark' : 'light')
        this.shadowRoot.querySelector('[data-id="themeValue"]').textContent = themeManager.getTheme()
        return
      }

      if (!this.#preferences) return

      // Warn when turning off client storage
      if (pref === 'clientStorageEnabled' && !value) {
        toggle.checked = true
        this.shadowRoot.querySelector('[data-id="confirmModal"]').classList.remove('hidden')
        return
      }

      try {
        const updated = await preferencesService.updatePreferences({
          [pref]: value,
        })

        // Update local references so re-navigation reflects the new value
        if (pref === 'clientStorageEnabled') {
          this.#preferences.clientStorageEnabled = value
          config.preferences.clientStorageEnabled = value
          config.storageDisabled = !value
        }
        if (pref === 'serverStorageEnabled') {
          this.#preferences.serverStorageEnabled = value
          config.preferences.serverStorageEnabled = value
          config.serverStorageEnabled = value
        }
        toggle.closest('.settingRow').querySelector('[data-id="toggleValue"]').textContent = value
      } catch {
        toggle.checked = !value
      }
    })

    this.shadowRoot.addEventListener('click', (e) => {
      const confirmModal = this.shadowRoot.querySelector('[data-id="confirmModal"]')
      const cancelBtn = e.target.closest('[data-id="confirmCancel"]')
      if (cancelBtn) {
        confirmModal.classList.add('hidden')
        return
      }

      const confirmBtn = e.target.closest('[data-id="confirmOk"]')
      if (confirmBtn) {
        confirmModal.classList.add('hidden')
        storageService.wipe()
        config.storageDisabled = true
        this.#preferences.clientStorageEnabled = false
        this.shadowRoot.querySelector('[data-id="toggle"][data-pref="clientStorageEnabled"]').checked = false
        this.shadowRoot.querySelector('[data-id="toggleValue"][data-pref="clientStorageEnabled"]').textContent = 'false'
      }
    })
  }

  #render() {
    const clientEnabled = this.#preferences?.clientStorageEnabled ?? !config.storageDisabled
    const serverEnabled = this.#preferences?.serverStorageEnabled ?? config.serverStorageEnabled

    this.shadowRoot.innerHTML = `
      <style>
        .settings {
          max-width: 500px;
          margin: 0 auto;
        }
        .settings h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--text-primary, #333);
        }
        .settings p {
          font-size: 14px;
          color: var(--text-secondary, #555);
          margin-bottom: 16px;
        }
        .settingRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color, #f0f0f0);
        }
        .settingRow label {
          font-size: 14px;
          color: var(--text-primary, #333);
        }
        .settingRow span {
          font-size: 14px;
          color: var(--text-secondary, #555);
          font-family: monospace;
        }
        .toggle {
          position: relative;
          width: 44px;
          height: 24px;
          cursor: pointer;
        }
        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
          position: absolute;
        }
        .toggle .slider {
          position: absolute;
          inset: 0;
          background: var(--bg-btn-toggle-off, #ccc);
          border-radius: 24px;
          transition: background 0.2s;
        }
        .toggle .slider::before {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          left: 3px;
          top: 3px;
          background: var(--bg-card, #fff);
          border-radius: 50%;
          transition: transform 0.2s;
        }
        .toggle input:checked + .slider {
          background: var(--accent-primary, #4a90d9);
        }
        .toggle input:checked + .slider::before {
          transform: translateX(20px);
        }
        .toggle input:focus + .slider {
          box-shadow: 0 0 0 2px rgba(74, 144, 217, 0.3);
        }
        .dangerBtn {
          padding: 8px 16px;
          background: var(--bg-btn-danger, #e74c3c);
          color: var(--text-header, #fff);
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }
        .dangerBtn:hover {
          background: var(--bg-btn-danger-hover, #c0392b);
        }
        .modal {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-modal-overlay, rgba(0,0,0,0.4));
          z-index: 1000;
        }
        .modal.hidden {
          display: none;
        }
        .modalContent {
          background: var(--bg-modal-content, #fff);
          border-radius: 8px;
          padding: 24px;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 4px 20px var(--shadow-modal, rgba(0,0,0,0.3));
        }
        .modalContent h3 {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary, #333);
          margin-bottom: 12px;
        }
        .modalContent p {
          font-size: 14px;
          color: var(--text-secondary, #555);
          margin-bottom: 20px;
        }
        .modalActions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
        .modalActions button {
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          border: 1px solid var(--border-input, #ddd);
          background: var(--bg-card, #fff);
          color: var(--text-primary, #333);
        }
        .modalActions button:hover {
          background: var(--bg-footer, #f5f5f5);
        }
        .modalActions button.danger {
          background: var(--bg-btn-danger, #e74c3c);
          color: var(--text-header, #fff);
          border-color: var(--bg-btn-danger, #e74c3c);
        }
        .modalActions button.danger:hover {
          background: var(--bg-btn-danger-hover, #c0392b);
        }
      </style>
      <div class="settings">
        <h2>Settings</h2>
        <p>Current application configuration.</p>
        <div class="settingRow">
          <label>Storage Backend</label>
          <span data-id="storageType">${config.storageType}</span>
        </div>
        <div class="settingRow">
          <label>Storage Key</label>
          <span data-id="storageKey">${config.storageKey}</span>
        </div>
        <div class="settingRow">
          <label>Client Storage</label>
          <div style="display:flex;align-items:center;gap:8px;">
            <span data-id="toggleValue">${clientEnabled}</span>
            <label class="toggle">
              <input type="checkbox" data-id="toggle" data-pref="clientStorageEnabled" ${clientEnabled ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="settingRow">
          <label>Server Storage</label>
          <div style="display:flex;align-items:center;gap:8px;">
            <span data-id="toggleValue">${serverEnabled}</span>
            <label class="toggle">
              <input type="checkbox" data-id="toggle" data-pref="serverStorageEnabled" ${serverEnabled ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="settingRow">
          <label>Theme</label>
          <div style="display:flex;align-items:center;gap:8px;">
            <span data-id="themeValue">${themeManager.getTheme()}</span>
            <label class="toggle">
              <input type="checkbox" data-id="toggle" data-pref="theme">
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="settingRow">
          <label>Disable Storage</label>
          <button class="dangerBtn" data-id="disableBtn">Disable</button>
        </div>
      </div>
      <div class="modal hidden" data-id="confirmModal">
        <div class="modalContent">
          <h3>Disable Client Storage?</h3>
          <p>All todos stored in your browser will be permanently erased. This action cannot be undone.</p>
          <div class="modalActions">
            <button data-id="confirmCancel">Cancel</button>
            <button class="danger" data-id="confirmOk">Disable</button>
          </div>
        </div>
      </div>
      <div class="modal hidden" data-id="modal">
        <div class="modalContent">
          <h3>Disable Local Storage?</h3>
          <p>All your todos will be lost. This action cannot be undone.</p>
          <div class="modalActions">
            <button data-id="cancelBtn">Cancel</button>
            <button class="danger" data-id="confirmBtn">Confirm</button>
          </div>
        </div>
      </div>
    `
  }
}

customElements.define('page-settings', PageSettings)
