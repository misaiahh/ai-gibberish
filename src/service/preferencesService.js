const API_BASE = '/api'

/**
 * Service layer for user preferences API.
 */
export const preferencesService = {
  /**
   * Fetch user preferences.
   * @returns {Promise<{clientStorageEnabled: boolean, serverStorageEnabled: boolean, createdAt: string, updatedAt: string}>}
   */
  async getPreferences() {
    const res = await fetch(`${API_BASE}/preferences`)
    if (!res.ok) throw new Error(`Failed to fetch preferences: ${res.status}`)
    return res.json()
  },

  /**
   * Update user preferences (partial).
   * @param {{clientStorageEnabled?: boolean, serverStorageEnabled?: boolean}} partial
   * @returns {Promise<{clientStorageEnabled: boolean, serverStorageEnabled: boolean, createdAt: string, updatedAt: string}>}
   */
  async updatePreferences(partial) {
    const res = await fetch(`${API_BASE}/preferences`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partial),
    })
    if (!res.ok) throw new Error(`Failed to update preferences: ${res.status}`)
    return res.json()
  },
}
