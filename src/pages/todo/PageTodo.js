import { todoFactory } from '../../factory/todoFactory.js'
import { placesService } from '../../service/apiService.js'
import '../../components/TodoInput.js'

export class PageTodo extends HTMLElement {
  #filter = 'all'
  #store = todoFactory()
  #places = []
  #initialized = false

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.#bindEvents()
    this.#bindStatusListener()
  }

  connectedCallback() {
    if (this.#initialized) return
    this.#initialized = true
    this.#init()
  }

  async #init() {
    await this.#store.getAll()
    try {
      this.#places = await placesService.getAll()
    } catch {
      this.#places = []
    }
    this.#render()
  }

  #bindStatusListener() {
    this.#store.onStatusChange((isOnline) => {
      const statusEl = this.shadowRoot.querySelector('[data-id="statusMsg"]')
      if (statusEl) {
        if (!isOnline) {
          statusEl.textContent = 'Working offline — changes saved locally'
          statusEl.style.display = 'inline'
        } else {
          statusEl.style.display = 'none'
        }
      }
    })
  }

  #bindEvents() {
    this.addEventListener('add', async (e) => {
      e.stopPropagation()
      await this.#store.create(e.detail.title, e.detail.placeId)
      await this.#updateList()
    })

    this.addEventListener('toggle', async (e) => {
      e.stopPropagation()
      await this.#store.toggle(e.detail.id)
      await this.#updateList()
    })

    this.addEventListener('delete', async (e) => {
      e.stopPropagation()
      await this.#store.delete(e.detail.id)
      await this.#updateList()
    })

    this.shadowRoot.addEventListener('click', async (e) => {
      const realTarget = e.target

      const filterBtn = realTarget.closest('[data-filter]')
      if (filterBtn) {
        this.#filter = filterBtn.dataset.filter
        this.#render()
        return
      }

      const clearBtn = realTarget.closest('.clear-completed')
      if (clearBtn) {
        await this.#store.clearCompleted()
        await this.#updateList()
      }
    })
  }

  #render() {
    const todos = this.#store.get()

    this.shadowRoot.innerHTML = `
      <style>
        .todoApp {
          background: var(--bg-card, #fff);
          border-radius: 8px;
          box-shadow: var(--shadow-card, 0 2px 12px rgba(0, 0, 0, 0.1));
          padding: 32px;
          max-width: 900px;
          width: 100%;
          text-align: center;
        }
        .todoApp h1 {
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 20px;
          color: var(--text-primary, #333);
        }
    .filterContainer {
          display: inline-flex;
          gap: 4px;
          margin: 12px auto 16px;
          border: 1px solid var(--border-input, #ddd);
          border-radius: 24px;
          padding: 4px 6px;
          background: var(--bg-app, #f5f5f5);
        }
        .filterContainer button {
          padding: 8px 18px;
          border: none;
          background: transparent;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-secondary, #555);
        }
        .filterContainer button:hover {
          color: var(--text-primary, #333);
        }
        .filterContainer button.active {
          background: var(--bg-filter-active, #4a90d9);
          color: var(--text-header, #fff);
          box-shadow: 0 1px 4px rgba(74, 144, 217, 0.3);
        }
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 8px 0;
          font-size: 13px;
          color: var(--text-muted, #888);
          border-top: 1px solid var(--border-color, #f0f0f0);
          margin-top: 4px;
        }
        .status-msg {
          font-size: 12px;
          color: var(--text-warning, #e67e22);
          font-style: italic;
        }
      </style>
      <div class="todoApp">
        <h1>Todo App</h1>
        <todo-input places='${JSON.stringify(this.#places)}'></todo-input>
        <div class="filterContainer" data-id="filters">
          <button data-filter="all" class="${this.#filter === 'all' ? 'active' : ''}">All</button>
          <button data-filter="active" class="${this.#filter === 'active' ? 'active' : ''}">Active</button>
          <button data-filter="completed" class="${this.#filter === 'completed' ? 'active' : ''}">Completed</button>
        </div>
        <todo-list filter="${this.#filter}" todos='${JSON.stringify(todos)}' places='${JSON.stringify(this.#places)}'></todo-list>
        <div class="footer" data-id="footer">
          <span class="item-count" data-id="itemCount"></span>
          <span class="status-msg" data-id="statusMsg" style="display:none;"></span>
          <button class="clear-completed" data-id="clearBtn" style="background:none;border:none;color:var(--bg-btn-danger,#e74c3c);font-size:13px;cursor:pointer;display:none;">Clear Completed</button>
        </div>
      </div>
    `

    this.#populateFooter()
  }

  async #updateList() {
    const todos = this.#store.get()
    const list = this.shadowRoot.querySelector('todo-list')
    if (list) {
      list.update(todos)
      list.updatePlaces(this.#places)
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

customElements.define('page-todo', PageTodo)
