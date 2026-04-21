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

  constructor() {
    super()
    this.#attachShadow()
  }

  connectedCallback() {
    this.#render()
  }

  static get observedAttributes() {
    return ['filter', 'places']
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.#render()
    }
  }

  #attachShadow() {
    this.attachShadow({ mode: 'open' })
  }

  #getPlaceName(placeId) {
    if (!placeId) return ''
    const place = this.#places.find((p) => p.id === placeId)
    return place ? place.name : ''
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
      item.setAttribute('completed', String(todo.completed))
      item.setAttribute('place-name', this.#getPlaceName(todo.placeId))

      this.list.appendChild(item)
    }
  }

  /**
   * Updates todos and re-renders.
   * @param {Array<{id: string, title: string, completed: boolean}>} todos
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
}

customElements.define('todo-list', TodoList)
