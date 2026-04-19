import { config } from '../../config.js'

export class PageSettings extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.#render()
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
      </div>
    `
  }
}

customElements.define('page-settings', PageSettings)
