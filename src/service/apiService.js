const API_BASE = '/api'

/**
 * HTTP service layer for communicating with the todo API.
 */
export const apiService = {
  /**
   * Fetch all todos.
   * @returns {Promise<Array<{id: string, title: string, completed: boolean, createdAt: string, updatedAt: string}>>}
   */
  async getAll() {
    const res = await fetch(`${API_BASE}/todos`)
    if (!res.ok) throw new Error(`Failed to fetch todos: ${res.status}`)
    return res.json()
  },

  /**
   * Create a new todo.
   * @param {string} title
   * @returns {Promise<{id: string, title: string, completed: boolean, createdAt: string, updatedAt: string}>}
   */
  async create(title) {
    const res = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim() }),
    })
    if (!res.ok) throw new Error(`Failed to create todo: ${res.status}`)
    return res.json()
  },

  /**
   * Update a todo (partial).
   * @param {string} id
   * @param {Partial<{title: string, completed: boolean}>} patch
   * @returns {Promise<{id: string, title: string, completed: boolean, createdAt: string, updatedAt: string}>}
   */
  async update(id, patch) {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (!res.ok) throw new Error(`Failed to update todo: ${res.status}`)
    return res.json()
  },

  /**
   * Delete a todo.
   * @param {string} id
   */
  async remove(id) {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error(`Failed to delete todo: ${res.status}`)
  },
}
