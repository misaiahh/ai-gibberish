let nextId = 1

/**
 * Generates a unique numeric ID.
 * @returns {number}
 */
export function generateId() {
  return nextId++
}

/**
 * Resets the ID counter (useful for tests).
 */
export function resetIdCounter() {
  nextId = 1
}

/**
 * Adds a new todo item to the list.
 * @param {string} text
 * @param {Array<{id: number, text: string, completed: boolean}>} todos
 * @returns {{id: number, text: string, completed: boolean}}
 */
export function addTodo(text, todos) {
  return {
    id: generateId(),
    text: text.trim(),
    completed: false,
  }
}

/**
 * Toggles the completed status of a todo by ID.
 * @param {number} id
 * @param {Array<{id: number, text: string, completed: boolean}>} todos
 * @returns {Array<{id: number, text: string, completed: boolean}>}
 */
export function toggleTodo(id, todos) {
  return todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  )
}

/**
 * Removes a todo by ID.
 * @param {number} id
 * @param {Array<{id: number, text: string, completed: boolean}>} todos
 * @returns {Array<{id: number, text: string, completed: boolean}>}
 */
export function deleteTodo(id, todos) {
  return todos.filter((todo) => todo.id !== id)
}

/**
 * Returns the subset of todos matching the given filter.
 * @param {'all' | 'active' | 'completed'} filter
 * @param {Array<{id: number, text: string, completed: boolean}>} todos
 * @returns {Array<{id: number, text: string, completed: boolean}>}
 */
export function filterTodos(filter, todos) {
  switch (filter) {
    case 'active':
      return todos.filter((t) => !t.completed)
    case 'completed':
      return todos.filter((t) => t.completed)
    default:
      return todos
  }
}

/**
 * Returns the number of completed todos.
 * @param {Array<{id: number, text: string, completed: boolean}>} todos
 * @returns {number}
 */
export function getCompletedCount(todos) {
  return todos.filter((t) => t.completed).length
}
