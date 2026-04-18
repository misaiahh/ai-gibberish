import { todoFactory } from '../factory/todoFactory.js'

export class TodoApp extends HTMLElement {
  /** @type {'all' | 'active' | 'completed'} */
  #filter = 'all'

  #store = todoFactory()

  constructor() {
    super()
    this.#attachShadow()
    this.#bindEvents()
    this.#render()
  }

  #attachShadow() {
    this.attachShadow({ mode: 'open' })
  }

  #bindEvents() {
    this.addEventListener('add', (e) => {
      e.stopPropagation()
      this.#store.create(e.detail.text)
      this.#updateList()
    })

    this.addEventListener('toggle', (e) => {
      e.stopPropagation()
      this.#store.toggle(e.detail.id)
      this.#updateList()
    })

    this.addEventListener('delete', (e) => {
      e.stopPropagation()
      this.#store.delete(e.detail.id)
      this.#updateList()
    })

    this.shadowRoot.addEventListener('click', (e) => {
      const realTarget = e.target

      const filterBtn = realTarget.closest('[data-filter]')
      if (filterBtn) {
        this.#filter = filterBtn.dataset.filter
        this.#render()
        return
      }

      const clearBtn = realTarget.closest('.clear-completed')
      if (clearBtn) {
        this.#store.clearCompleted()
        this.#updateList()
      }
    })
  }

  #render() {
    const todos = this.#store.getAll()

    this.shadowRoot.innerHTML = `
      <style>
        .todoApp {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }
        .todoApp h1 {
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }
        .filterContainer {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
          justify-content: center;
        }
        .filterContainer button {
          padding: 6px 14px;
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filterContainer button.active {
          background: #4a90d9;
          color: #fff;
          border-color: #4a90d9;
        }
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 8px 0;
          font-size: 13px;
          color: #888;
          border-top: 1px solid #f0f0f0;
          margin-top: 4px;
        }
      </style>
      <div class="todoApp">
        <h1>Todo App</h1>
        <todo-input></todo-input>
        <div class="filterContainer" data-id="filters">
          <button data-filter="all" class="${this.#filter === 'all' ? 'active' : ''}">All</button>
          <button data-filter="active" class="${this.#filter === 'active' ? 'active' : ''}">Active</button>
          <button data-filter="completed" class="${this.#filter === 'completed' ? 'active' : ''}">Completed</button>
        </div>
        <todo-list filter="${this.#filter}" todos='${JSON.stringify(todos)}'></todo-list>
        <div class="footer" data-id="footer">
          <span class="item-count" data-id="itemCount"></span>
          <button class="clear-completed" data-id="clearBtn" style="background:none;border:none;color:#e74c3c;font-size:13px;cursor:pointer;display:none;">Clear Completed</button>
        </div>
      </div>
    `

    this.#populateFooter()
  }

  #updateList() {
    const todos = this.#store.getAll()
    const list = this.shadowRoot.querySelector('todo-list')
    if (list) {
      list.update(todos)
    }
    this.#populateFooter()
  }

  #populateFooter() {
    const countEl = this.shadowRoot.querySelector('[data-id="itemCount"]')
    const clearBtn = this.shadowRoot.querySelector('[data-id="clearBtn"]')

    const activeCount = this.#store.getActiveCount()
    countEl.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`

    const completedCount = this.#store.getCompletedCount()
    clearBtn.style.display = completedCount > 0 ? 'inline' : 'none'
  }
}

customElements.define('todo-app', TodoApp)
