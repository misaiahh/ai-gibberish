/**
 * @typedef {Object} TodoInput
 * @property {HTMLInputElement} input - The text input element
 * @property {HTMLButtonElement} button - The add button
 */

export class TodoInput extends HTMLElement {
  static get observedAttributes() {
    return ['placeholder']
  }

  /** @type {string} */
  #text = ''

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

  #attachShadow() {
    this.attachShadow({ mode: 'open' })
  }

  #render() {
    const placeholder = this.getAttribute('placeholder') || 'What needs to be done?'

    this.shadowRoot.innerHTML = `
      <style>
        .inputContainer {
          display: flex;
          gap: 8px;
        }
        .inputContainer input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .inputContainer input:focus {
          border-color: #4a90d9;
        }
        .addBtn {
          padding: 10px 18px;
          background: #4a90d9;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .addBtn:hover {
          background: #357abd;
        }
      </style>
      <div class="inputContainer">
        <input type="text" placeholder="${placeholder}" data-id="input" />
        <button class="addBtn" data-id="button">Add</button>
      </div>
    `

    this.input = this.shadowRoot.querySelector('[data-id="input"]')
    this.button = this.shadowRoot.querySelector('[data-id="button"]')

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
    this.dispatchEvent(
      new CustomEvent('add', {
        detail: { title },
        bubbles: true,
        composed: true,
      })
    )
  }
}

customElements.define('todo-input', TodoInput)
