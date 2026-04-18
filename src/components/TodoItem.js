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
        .todo-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 8px;
          border-bottom: 1px solid #f0f0f0;
        }
        .todo-item:last-child {
          border-bottom: none;
        }
        .todo-item input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #4a90d9;
        }
        .todo-item .todo-text {
          flex: 1;
          font-size: 14px;
          color: #333;
        }
        .todo-item .todo-text.completed {
          text-decoration: line-through;
          color: #aaa;
        }
        .todo-item .delete-btn {
          background: none;
          border: none;
          color: #e74c3c;
          font-size: 18px;
          cursor: pointer;
          padding: 0 4px;
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        .todo-item .delete-btn:hover {
          opacity: 1;
        }
      </style>
      <label class="todo-item">
        <input type="checkbox" ${completed ? 'checked' : ''} />
        <span class="todo-text ${completed ? 'completed' : ''}">${text}</span>
        <button class="delete-btn" title="Delete">&times;</button>
      </label>
    `

    this.checkbox = this.shadowRoot.querySelector('input[type="checkbox"]')
    this.textSpan = this.shadowRoot.querySelector('.todo-text')
    this.deleteBtn = this.shadowRoot.querySelector('.delete-btn')

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
