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
        .todo-input {
          display: flex;
          gap: 8px;
        }
        .todo-input input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .todo-input input:focus {
          border-color: #4a90d9;
        }
        .todo-input button {
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
        .todo-input button:hover {
          background: #357abd;
        }
      </style>
      <div class="todo-input">
        <input type="text" placeholder="${placeholder}" />
        <button>Add</button>
      </div>
    `

    this.input = this.shadowRoot.querySelector('input')
    this.button = this.shadowRoot.querySelector('button')

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.input.value.trim()) {
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
    const text = this.input.value.trim()
    if (!text) return

    this.#text = text
    this.dispatchEvent(
      new CustomEvent('add', {
        detail: { text },
        bubbles: true,
        composed: true,
      })
    )
    this.input.value = ''
    this.input.focus()
  }
}

customElements.define('todo-input', TodoInput)
