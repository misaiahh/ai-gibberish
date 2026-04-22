/**
 * @typedef {Object} TodoListComponent
 * @property {HTMLUListElement} list
 */

/**
 * Returns the subset of todos matching the given filter.
 * @param {'all' | 'active' | 'completed'} filter
 * @param {Array} todos
 * @returns {Array}
 */
function filterTodos(filter, todos) {
  switch (filter) {
    case 'active':
      return todos.filter((t) => !t.completed)
    case 'completed':
      return todos.filter((t) => t.completed)
    default:
      return todos
  }
}

export class TodoList extends HTMLElement {
  #places = []
  #selectedIds = new Set()

  constructor() {
    super()
    this.#attachShadow()
    this.addEventListener('select', (e) => {
      e.stopPropagation()
      const { id, selected } = e.detail
      if (selected) {
        this.#selectedIds.add(id)
      } else {
        this.#selectedIds.delete(id)
      }
      this.#updateSelectedAttributes()
      this.dispatchEvent(
        new CustomEvent('selection-change', {
          detail: { selectedIds: Array.from(this.#selectedIds) },
          bubbles: true,
          composed: true,
        })
      )
    })
    this.addEventListener('place-change', (e) => {
      e.stopPropagation()
    })
  }

  connectedCallback() {
    this.#render()
  }

  static get observedAttributes() {
    return ['filter', 'places', 'todos']
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
    const filter = this.getAttribute('filter') || 'all'
    const todos = JSON.parse(this.getAttribute('todos') || '[]')
    const places = JSON.parse(this.getAttribute('places') || '[]')
    this.#places = places

    const filtered = filterTodos(filter, todos)

    this.shadowRoot.innerHTML = `
      <style>
        .todoList {
          list-style: none;
          margin: 0;
          padding: 0;
        }
      </style>
      <ul class="todoList" data-id="list"></ul>
    `

    this.list = this.shadowRoot.querySelector('[data-id="list"]')

    for (const todo of filtered) {
      const item = document.createElement('todo-item')
      item.setAttribute('id', String(todo.id))
      item.setAttribute('title', todo.title)
      item.setAttribute('description', todo.description || '')
      item.setAttribute('completed', String(todo.completed))
      item.setAttribute('place-ids', JSON.stringify(todo.placeIds || []))
      item.setAttribute('places', JSON.stringify(places))
      item.setAttribute('selected', this.#selectedIds.has(todo.id) ? 'true' : 'false')

      this.list.appendChild(item)
    }
  }

  #updateSelectedAttributes() {
    const items = this.shadowRoot.querySelectorAll('todo-item')
    for (const item of items) {
      const id = item.getAttribute('id')
      item.setAttribute('selected', this.#selectedIds.has(id) ? 'true' : 'false')
    }
  }

  /**
   * Updates todos and re-renders.
   * @param {Array<{id: string, title: string, completed: boolean, placeIds: string[]}>} todos
   */
  update(todos) {
    this.setAttribute('todos', JSON.stringify(todos))
    this.#render()
  }

  /**
   * Updates places and re-renders.
   * @param {Array<{id: string, name: string}>} places
   */
  updatePlaces(places) {
    this.#places = places
    this.#render()
  }

  /**
   * Returns the current set of selected todo IDs.
   * @returns {string[]}
   */
  getSelectedIds() {
    return Array.from(this.#selectedIds)
  }
}

customElements.define('todo-list', TodoList)
