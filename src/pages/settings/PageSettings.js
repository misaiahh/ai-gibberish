import { config } from '../../config.js'

export class PageSettings extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.#bindEvents()
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
  }

  #render() {
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
          color: #333;
        }
        .settings p {
          font-size: 14px;
          color: #555;
          margin-bottom: 16px;
        }
        .settingRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .settingRow label {
          font-size: 14px;
          color: #333;
        }
        .settingRow span {
          font-size: 14px;
          color: #555;
          font-family: monospace;
        }
        .dangerBtn {
          padding: 8px 16px;
          background: #e74c3c;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }
        .dangerBtn:hover {
          background: #c0392b;
        }
        .modal {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.4);
          z-index: 1000;
        }
        .modal.hidden {
          display: none;
        }
        .modalContent {
          background: #fff;
          border-radius: 8px;
          padding: 24px;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .modalContent h3 {
          font-size: 18px;
          font-weight: 700;
          color: #333;
          margin-bottom: 12px;
        }
        .modalContent p {
          font-size: 14px;
          color: #555;
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
          border: 1px solid #ddd;
          background: #fff;
          color: #333;
        }
        .modalActions button:hover {
          background: #f5f5f5;
        }
        .modalActions button.danger {
          background: #e74c3c;
          color: #fff;
          border-color: #e74c3c;
        }
        .modalActions button.danger:hover {
          background: #c0392b;
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
          <label>Disable Storage</label>
          <button class="dangerBtn" data-id="disableBtn">Disable</button>
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
