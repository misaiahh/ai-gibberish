const API_BASE = '/api'

/**
 * Ensures a valid session exists before making API calls.
 */
async function ensureSession() {
  try {
    await fetch(`${API_BASE}/session`, { method: 'GET', credentials: 'include' })
  } catch {
    // Session unavailable — API calls will fail anyway
  }
}

let sessionInitialized = false

export function resetSessionState() {
  sessionInitialized = false
}

/**
 * HTTP service layer for communicating with the todo API.
 */
export const apiService = {
  /**
   * Fetch all todos.
   * @returns {Promise<Array<{id: string, title: string, description: string, completed: boolean, placeIds: string[], places: Array<{id: string, name: string, parentId: string|null, createdAt: string, updatedAt: string}>, createdAt: string, updatedAt: string}>>}
   */
  async getAll() {
    if (!sessionInitialized) {
      await ensureSession()
      sessionInitialized = true
    }
    const res = await fetch(`${API_BASE}/todos`, { credentials: 'include' })
    if (!res.ok) throw new Error(`Failed to fetch todos: ${res.status}`)
    return res.json()
  },

  /**
   * Create a new todo.
   * @param {string} title
   * @param {string} [description]
   * @param {string[]} [placeIds]
   * @returns {Promise<{id: string, title: string, description: string, completed: boolean, placeIds: string[], places: Array<{id: string, name: string, parentId: string|null, createdAt: string, updatedAt: string}>, createdAt: string, updatedAt: string}>}
   */
  async create(title, description = '', placeIds = []) {
    if (!sessionInitialized) {
      await ensureSession()
      sessionInitialized = true
    }
    const body = { title: title.trim(), description }
    if (placeIds.length > 0) {
      body.placeIds = placeIds
    }
    const res = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Failed to create todo: ${res.status}`)
    return res.json()
  },

  /**
   * Update a todo (partial).
   * @param {string} id
   * @param {Partial<{title: string, description: string, completed: boolean, placeIds: string[]}>} patch
   * @returns {Promise<{id: string, title: string, description: string, completed: boolean, placeIds: string[], places: Array<{id: string, name: string, parentId: string|null, createdAt: string, updatedAt: string}>, createdAt: string, updatedAt: string}>}
   */
  async update(id, patch) {
    if (!sessionInitialized) {
      await ensureSession()
      sessionInitialized = true
    }
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PATCH',
      credentials: 'include',
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
    if (!sessionInitialized) {
      await ensureSession()
      sessionInitialized = true
    }
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE',
      credentials: 'include',
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
    if (!sessionInitialized) {
      await ensureSession()
      sessionInitialized = true
    }
    const res = await fetch(`${API_BASE}/places`, { credentials: 'include' })
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
    if (!sessionInitialized) {
      await ensureSession()
      sessionInitialized = true
    }
    const body = { name: name.trim() }
    if (parentId !== null) {
      body.parentId = parentId
    }
    const res = await fetch(`${API_BASE}/places`, {
      method: 'POST',
      credentials: 'include',
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
    if (!sessionInitialized) {
      await ensureSession()
      sessionInitialized = true
    }
    const res = await fetch(`${API_BASE}/places/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) throw new Error(`Failed to delete place: ${res.status}`)
    return res.json()
  },
}
