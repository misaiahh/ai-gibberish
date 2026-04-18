/**
 * @typedef {Object} TodoItemComponent
 * @property {HTMLInputElement} checkbox
 * @property {HTMLSpanElement} textSpan
 * @property {HTMLButtonElement} deleteBtn
 */

export class TodoItem extends HTMLElement {
  constructor() {
    super()
    this.#attachShadow()
  }

  connectedCallback() {
    this.#render()
  }

  static get observedAttributes() {
    return ['text', 'completed', 'id']
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
    const text = this.getAttribute('text') || ''
    const completed = this.getAttribute('completed') === 'true'
    const id = this.getAttribute('id') || ''

    this.shadowRoot.innerHTML = `
      <style>
        .todoItem {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 8px;
          border-bottom: 1px solid #f0f0f0;
        }
        .todoItem:last-child {
          border-bottom: none;
        }
        .todoItem input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #4a90d9;
        }
        .todoText {
          flex: 1;
          font-size: 14px;
          color: #333;
        }
        .todoText.completed {
          text-decoration: line-through;
          color: #aaa;
        }
        .deleteBtn {
          background: none;
          border: none;
          color: #e74c3c;
          font-size: 18px;
          cursor: pointer;
          padding: 0 4px;
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        .deleteBtn:hover {
          opacity: 1;
        }
      </style>
      <label class="todoItem">
        <input type="checkbox" data-id="checkbox" ${completed ? 'checked' : ''} />
        <span class="todoText ${completed ? 'completed' : ''}" data-id="todoText">${text}</span>
        <button class="deleteBtn" data-id="deleteBtn" title="Delete">&times;</button>
      </label>
    `

    this.checkbox = this.shadowRoot.querySelector('[data-id="checkbox"]')
    this.textSpan = this.shadowRoot.querySelector('[data-id="todoText"]')
    this.deleteBtn = this.shadowRoot.querySelector('[data-id="deleteBtn"]')

    this.checkbox.addEventListener('change', () => {
      this.dispatchEvent(
        new CustomEvent('toggle', {
          detail: { id: Number(id) },
          bubbles: true,
          composed: true,
        })
      )
    })

    this.deleteBtn.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('delete', {
          detail: { id: Number(id) },
          bubbles: true,
          composed: true,
        })
      )
    })
  }
}

customElements.define('todo-item', TodoItem)
