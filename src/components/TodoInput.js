/**
 * @typedef {Object} TodoInput
 * @property {HTMLInputElement} input - The text input element
 * @property {HTMLButtonElement} button - The add button
 */

export class TodoInput extends HTMLElement {
  static get observedAttributes() {
    return ['placeholder', 'places']
  }

  /** @type {string} */
  #text = ''
  /** @type {Array} */
  #places = []

  get value() {
    return this.#text
  }

  set value(val) {
    this.#text = val
    if (this.input) {
      this.input.value = val
    }
  }

  constructor() {
    super()
    this.#attachShadow()
  }

  connectedCallback() {
    this.#render()
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.#render()
    }
  }

  #attachShadow() {
    this.attachShadow({ mode: 'open' })
  }

  #render() {
    const placeholder = this.getAttribute('placeholder') || 'What needs to be done?'
    const places = JSON.parse(this.getAttribute('places') || '[]')
    this.#places = places

    const placeOptions = places.map((p) => `<option value="${p.id}">${p.name}</option>`).join('')

    this.shadowRoot.innerHTML = `
      <style>
        .inputContainer {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .inputRow {
          display: flex;
          gap: 8px;
        }
        .inputRow input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid var(--border-input, #ddd);
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .inputRow input:focus {
          border-color: var(--accent-primary, #4a90d9);
        }
        .addBtn {
          padding: 10px 18px;
          background: var(--bg-btn-primary, #4a90d9);
          color: var(--text-header, #fff);
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .addBtn:hover {
          background: var(--bg-btn-primary-hover, #357abd);
        }
        .placeSelect {
          padding: 8px 12px;
          border: 1px solid var(--border-input, #ddd);
          border-radius: 6px;
          font-size: 13px;
          outline: none;
          background: var(--bg-app, #f5f5f5);
          color: var(--text-secondary, #555);
          cursor: pointer;
        }
        .placeSelect:focus {
          border-color: var(--accent-primary, #4a90d9);
        }
      </style>
      <div class="inputContainer">
        <div class="inputRow">
          <input type="text" placeholder="${placeholder}" data-id="input" />
          <button class="addBtn" data-id="button">Add</button>
        </div>
        <select class="placeSelect" data-id="placeSelect">
          <option value="">No place</option>
          ${placeOptions}
        </select>
      </div>
    `

    this.input = this.shadowRoot.querySelector('[data-id="input"]')
    this.button = this.shadowRoot.querySelector('[data-id="button"]')
    this.placeSelect = this.shadowRoot.querySelector('[data-id="placeSelect"]')

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.input.value.trim()) {
        e.preventDefault()
        this.#dispatchAdd()
      }
    })

    this.button.addEventListener('click', () => {
      if (this.input.value.trim()) {
        this.#dispatchAdd()
      }
    })
  }

  #dispatchAdd() {
    const title = this.input.value.trim()
    if (!title) return

    this.#text = title
    this.input.value = ''
    const placeId = this.placeSelect.value || null
    this.dispatchEvent(
      new CustomEvent('add', {
        detail: { title, placeId },
        bubbles: true,
        composed: true,
      })
    )
  }
}

customElements.define('todo-input', TodoInput)
