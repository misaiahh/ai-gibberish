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
   * @param {string|null} [placeId]
   * @returns {Promise<{id: string, title: string, completed: boolean, placeId: string|null, createdAt: string, updatedAt: string}>}
   */
  async create(title, placeId = null) {
    const res = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), ...(placeId !== null && { placeId }) }),
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

/**
 * HTTP service layer for communicating with the places API.
 */
export const placesService = {
  /**
   * Fetch all places.
   * @returns {Promise<Array<{id: string, name: string, parentId: string|null, createdAt: string, updatedAt: string}>>}
   */
  async getAll() {
    const res = await fetch(`${API_BASE}/places`)
    if (!res.ok) throw new Error(`Failed to fetch places: ${res.status}`)
    return res.json()
  },

  /**
   * Create a new place.
   * @param {string} name
   * @param {string|null} [parentId]
   * @returns {Promise<{id: string, name: string, parentId: string|null, createdAt: string, updatedAt: string}>}
   */
  async create(name, parentId = null) {
    const body = { name: name.trim() }
    if (parentId !== null) {
      body.parentId = parentId
    }
    const res = await fetch(`${API_BASE}/places`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Failed to create place: ${res.status}`)
    return res.json()
  },

  /**
   * Delete a place and all its children.
   * @param {string} id
   */
  async remove(id) {
    const res = await fetch(`${API_BASE}/places/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error(`Failed to delete place: ${res.status}`)
    return res.json()
  },
}
