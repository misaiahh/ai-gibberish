/**
 * @typedef {Object} TodoInput
 * @property {HTMLInputElement} input - The text input element
 * @property {HTMLTextAreaElement} descriptionInput - The description textarea element
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
  /** @type {string|null} */
  #selectedPlaceId = null
  /** @type {boolean} */
  #dropdownOpen = false

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
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.#render()
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.#render()
    }
  }

  #render() {
    const placeholder = this.getAttribute('placeholder') || 'What needs to be done?'
    const places = JSON.parse(this.getAttribute('places') || '[]')
    this.#places = places

    const optionsHTML = places.map(p =>
      `<div class="dd-option" data-id="dd-option" data-value="${p.id}">${p.name}</div>`
    ).join('')

    const selectedPlace = this.#selectedPlaceId
      ? places.find(p => p.id === this.#selectedPlaceId)
      : null
    const triggerText = selectedPlace ? selectedPlace.name : 'Select place'

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
        .descriptionRow {
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }
        .descriptionRow textarea {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid var(--border-input, #ddd);
          border-radius: 6px;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          resize: vertical;
          min-height: 60px;
          max-height: 200px;
          transition: border-color 0.2s;
        }
        .descriptionRow textarea:focus {
          border-color: var(--accent-primary, #4a90d9);
        }
        .placeRow {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .ddWrapper {
          flex: 1;
          position: relative;
        }
        .ddTrigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 32px 8px 12px;
          border: 1px solid var(--border-input, #ddd);
          border-radius: 6px;
          font-size: 13px;
          outline: none;
          background: var(--bg-app, #f5f5f5);
          color: var(--text-secondary, #555);
          cursor: pointer;
          text-align: left;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .ddTrigger:focus {
          border-color: var(--accent-primary, #4a90d9);
        }
        .ddTrigger::after {
          content: '';
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-top: 5px solid var(--text-secondary, #555);
          pointer-events: none;
        }
        .ddList {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: var(--bg-card, #fff);
          border: 1px solid var(--border-input, #ddd);
          border-radius: 6px;
          max-height: 200px;
          overflow-y: auto;
          z-index: 100;
          display: none;
        }
        .ddList.open {
          display: block;
        }
        .dd-option {
          padding: 8px 12px;
          font-size: 13px;
          cursor: pointer;
          color: var(--text-secondary, #555);
        }
        .dd-option:hover {
          background: var(--bg-app, #f5f5f5);
        }
        .placesBtn {
          padding: 8px 12px;
          background: var(--bg-btn-primary, #4a90d9);
          color: var(--text-header, #fff);
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .placesBtn:hover {
          background: var(--bg-btn-primary-hover, #357abd);
        }
      </style>
      <div class="inputContainer">
        <div class="inputRow">
          <input type="text" placeholder="${placeholder}" data-id="input" />
          <button class="addBtn" data-id="button">Add</button>
        </div>
        <div class="descriptionRow">
          <textarea placeholder="Description (optional)" data-id="descriptionInput"></textarea>
        </div>
        <div class="placeRow">
          <div class="ddWrapper" data-id="ddWrapper">
            <div class="ddTrigger" data-id="ddTrigger">${triggerText}</div>
            <div class="ddList" data-id="ddList">
              <div class="dd-option" data-id="dd-option" data-value="">Select place</div>
              ${optionsHTML}
            </div>
          </div>
          <button class="placesBtn" data-id="placesBtn">Go to Places</button>
        </div>
      </div>
    `

    this.input = this.shadowRoot.querySelector('[data-id="input"]')
    this.descriptionInput = this.shadowRoot.querySelector('[data-id="descriptionInput"]')
    this.button = this.shadowRoot.querySelector('[data-id="button"]')
    this.ddWrapper = this.shadowRoot.querySelector('[data-id="ddWrapper"]')
    this.ddTrigger = this.shadowRoot.querySelector('[data-id="ddTrigger"]')
    this.ddList = this.shadowRoot.querySelector('[data-id="ddList"]')
    this.placesBtn = this.shadowRoot.querySelector('[data-id="placesBtn"]')

    this.#bindEvents()
  }

  #bindEvents() {
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

    this.ddTrigger.addEventListener('click', (e) => {
      e.stopPropagation()
      this.#dropdownOpen = !this.#dropdownOpen
      this.ddList.classList.toggle('open', this.#dropdownOpen)
    })

    this.ddList.addEventListener('click', (e) => {
      const option = e.target.closest('.dd-option')
      if (!option) return
      e.stopPropagation()
      this.#selectedPlaceId = option.dataset.value || null
      this.#render()
    })

    this.placesBtn.addEventListener('click', () => {
      history.pushState({}, '', '/places')
      window.dispatchEvent(new CustomEvent('route-change', {
        detail: { path: '/places' },
      }))
    })

    document.addEventListener('click', (e) => {
      if (this.#dropdownOpen && !this.ddWrapper.contains(e.target)) {
        this.#dropdownOpen = false
        this.ddList.classList.remove('open')
      }
    })
  }

  #dispatchAdd() {
    const title = this.input.value.trim()
    if (!title) return

    this.#text = title
    this.input.value = ''
    const description = this.descriptionInput?.value || ''
    const placeId = this.#selectedPlaceId
    this.dispatchEvent(
      new CustomEvent('add', {
        detail: { title, description, placeId },
        bubbles: true,
        composed: true,
      })
    )
  }
}

customElements.define('todo-input', TodoInput)
