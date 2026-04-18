/**
 * @typedef {Object} TodoListComponent
 * @property {HTMLUListElement} list
 */

import { filterTodos } from '../utils/todoUtils.js'

export class TodoList extends HTMLElement {
  constructor() {
    super()
    this.#attachShadow()
  }

  connectedCallback() {
    this.#render()
  }

  static get observedAttributes() {
    return ['filter']
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

    const filtered = filterTodos(filter, todos)

    this.shadowRoot.innerHTML = `
      <style>
        .todo-list {
          list-style: none;
        }
      </style>
      <ul class="todo-list"></ul>
    `

    this.list = this.shadowRoot.querySelector('.todo-list')

    for (const todo of filtered) {
      const item = document.createElement('todo-item')
      item.setAttribute('id', String(todo.id))
      item.setAttribute('text', todo.text)
      item.setAttribute('completed', String(todo.completed))

      item.addEventListener('toggle', () => {})
      item.addEventListener('delete', () => {})

      this.list.appendChild(item)
    }
  }

  /**
   * Updates todos and re-renders.
   * @param {Array<{id: number, text: string, completed: boolean}>} todos
   */
  update(todos) {
    this.setAttribute('todos', JSON.stringify(todos))
    this.#render()
  }
}

customElements.define('todo-list', TodoList)
