export class TodoApp extends HTMLElement {
  /** @type {Array<{id: number, text: string, completed: boolean}>} */
  #todos = []

  /** @type {'all' | 'active' | 'completed'} */
  #filter = 'all'

  #nextId = 1

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
      const newTodo = {
        id: this.#nextId++,
        text: e.detail.text,
        completed: false,
      }
      this.#todos.push(newTodo)
      this.#render()
    })

    this.addEventListener('toggle', (e) => {
      e.stopPropagation()
      this.#todos = this.#todos.map((todo) =>
        todo.id === e.detail.id ? { ...todo, completed: !todo.completed } : todo
      )
      this.#render()
    })

    this.addEventListener('delete', (e) => {
      e.stopPropagation()
      this.#todos = this.#todos.filter((todo) => todo.id !== e.detail.id)
      this.#render()
    })

    // Event delegation for shadow DOM interactions
    this.shadowRoot.addEventListener('click', (e) => {
      const path = e.composedPath()
      const realTarget = path[0]

      // Handle checkbox toggles directly in the click handler
      const checkbox = realTarget.closest('input[type="checkbox"]')
      if (checkbox) {
        // Use composedPath to cross shadow DOM boundaries and find the label
        const labelIndex = path.findIndex(el => el.tagName === 'LABEL')
        if (labelIndex !== -1) {
          const label = path[labelIndex]
          const siblings = Array.from(label.parentNode.children)
          const itemIndex = siblings.indexOf(label)
          const list = this.shadowRoot.querySelector('todo-list')
          const todos = JSON.parse(list.getAttribute('todos') || '[]')
          if (todos[itemIndex]) {
            todos[itemIndex] = {
              ...todos[itemIndex],
              completed: checkbox.checked,
            }
            this.#todos = todos
            this.#render()
          }
        }
        return
      }

      // Handle delete button clicks directly in the click handler
      const deleteBtn = realTarget.closest('.delete-btn')
      if (deleteBtn) {
        const labelIndex = path.findIndex(el => el.tagName === 'LABEL')
        if (labelIndex !== -1) {
          const label = path[labelIndex]
          const siblings = Array.from(label.parentNode.children)
          const itemIndex = siblings.indexOf(label)
          const list = this.shadowRoot.querySelector('todo-list')
          const todos = JSON.parse(list.getAttribute('todos') || '[]')
          if (todos[itemIndex]) {
            this.#todos = this.#todos.filter(
              (t) => t.id !== todos[itemIndex].id
            )
            this.#render()
          }
        }
        return
      }

      // Handle filter buttons
      const filterBtn = realTarget.closest('[data-filter]')
      if (filterBtn) {
        this.#filter = filterBtn.dataset.filter
        this.#render()
        return
      }

      // Handle clear-completed button
      const clearBtn = realTarget.closest('.clear-completed')
      if (clearBtn) {
        this.#todos = this.#todos.filter((t) => !t.completed)
        this.#render()
      }
    })
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <style>
        .todo-app {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }
        .todo-app h1 {
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }
        .todo-filters {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
          justify-content: center;
        }
        .todo-filters button {
          padding: 6px 14px;
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .todo-filters button.active {
          background: #4a90d9;
          color: #fff;
          border-color: #4a90d9;
        }
        .todo-footer {
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
      <h1>Todo App</h1>
      <todo-input></todo-input>
      <div class="todo-filters">
        <button data-filter="all" class="${this.#filter === 'all' ? 'active' : ''}">All</button>
        <button data-filter="active" class="${this.#filter === 'active' ? 'active' : ''}">Active</button>
        <button data-filter="completed" class="${this.#filter === 'completed' ? 'active' : ''}">Completed</button>
      </div>
      <todo-list filter="${this.#filter}" todos='${JSON.stringify(this.#todos)}'></todo-list>
      <div class="todo-footer">
        <span class="item-count"></span>
        <button class="clear-completed" style="background:none;border:none;color:#e74c3c;font-size:13px;cursor:pointer;display:none;">Clear Completed</button>
      </div>
    `

    this.#populateFooter()
  }

  #populateFooter() {
    const countEl = this.shadowRoot.querySelector('.item-count')
    const clearBtn = this.shadowRoot.querySelector('.clear-completed')

    const activeCount = this.#todos.filter((t) => !t.completed).length
    countEl.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`

    const completedCount = this.#todos.filter((t) => t.completed).length
    clearBtn.style.display = completedCount > 0 ? 'inline' : 'none'
  }
}

customElements.define('todo-app', TodoApp)
