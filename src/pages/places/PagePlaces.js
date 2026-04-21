import { placesService } from '../../service/apiService.js'

export class PagePlaces extends HTMLElement {
  #places = []
  #initialized = false

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.#bindEvents()
  }

  connectedCallback() {
    if (this.#initialized) return
    this.#initialized = true
    this.#init()
  }

  async #init() {
    try {
      this.#places = await placesService.getAll()
    } catch {
      this.#places = []
    }
    this.#render()
  }

  #bindEvents() {
    this.shadowRoot.addEventListener('click', async (e) => {
      const deleteBtn = e.target.closest('[data-action="delete-place"]')
      if (deleteBtn) {
        const placeId = deleteBtn.dataset.placeId
        await this.#deletePlace(placeId)
      }
    })

    this.shadowRoot.addEventListener('submit', async (e) => {
      e.preventDefault()
      const form = e.target
      const nameInput = form.querySelector('[data-id="placeName"]')
      const parentSelect = form.querySelector('[data-id="parentSelect"]')
      const name = nameInput.value.trim()
      if (!name) return
      const parentId = parentSelect.value || null
      await this.#createPlace(name, parentId)
      nameInput.value = ''
      parentSelect.value = ''
    })
  }

  async #createPlace(name, parentId) {
    try {
      await placesService.create(name, parentId)
    } catch {
      return
    }
    try {
      this.#places = await placesService.getAll()
    } catch {
      this.#places = []
    }
    this.#render()
  }

  async #deletePlace(id) {
    try {
      await placesService.remove(id)
    } catch {
      return
    }
    try {
      this.#places = await placesService.getAll()
    } catch {
      this.#places = []
    }
    this.#render()
  }

  #getRootPlaces() {
    return this.#places.filter((p) => !p.parentId)
  }

  #getChildren(parentId) {
    return this.#places.filter((p) => p.parentId === parentId)
  }

  #renderPlaceTree(places, depth = 0) {
    const rootPlaces = this.#getRootPlaces()
    let html = ''
    for (const place of rootPlaces) {
      html += this.#renderPlace(place, depth)
      const children = this.#getChildren(place.id)
      if (children.length > 0) {
        html += this.#renderPlaceTree(children, depth + 1)
      }
    }
    return html
  }

  #renderPlace(place, depth) {
    const indent = depth * 24
    const childCount = this.#getChildren(place.id).length
    return `
      <div class="placeRow" style="padding-left: ${indent}px;">
        <span class="placeName">${place.name}</span>
        ${childCount > 0 ? `<span class="childCount">(${childCount} sub-place${childCount !== 1 ? 'ces' : ''})</span>` : ''}
        <button class="deleteBtn" data-action="delete-place" data-place-id="${place.id}" title="Delete place">&times;</button>
      </div>
    `
  }

  #render() {
    const parentOptions = this.#places
      .filter((p) => !p.parentId)
      .map((p) => `<option value="${p.id}">${p.name}</option>`)
      .join('')

    const placeTree = this.#renderPlaceTree(this.#places)

    this.shadowRoot.innerHTML = `
      <style>
        .placesApp {
          background: var(--bg-card, #fff);
          border-radius: 8px;
          box-shadow: var(--shadow-card, 0 2px 12px rgba(0, 0, 0, 0.1));
          padding: 32px;
          max-width: 900px;
          width: 100%;
        }
        .placesApp h1 {
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 24px;
          color: var(--text-primary, #333);
        }
        .createForm {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-color, #f0f0f0);
        }
        .formRow {
          display: flex;
          gap: 8px;
        }
        .formRow input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid var(--border-input, #ddd);
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .formRow input:focus {
          border-color: var(--accent-primary, #4a90d9);
        }
        .formRow select {
          padding: 10px 12px;
          border: 1px solid var(--border-input, #ddd);
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          background: var(--bg-app, #f5f5f5);
          color: var(--text-secondary, #555);
          cursor: pointer;
          min-width: 160px;
        }
        .formRow select:focus {
          border-color: var(--accent-primary, #4a90d9);
        }
        .createBtn {
          padding: 10px 18px;
          background: var(--bg-btn-primary, #4a90d9);
          color: var(--text-header, #fff);
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          align-self: flex-start;
        }
        .createBtn:hover {
          background: var(--bg-btn-primary-hover, #357abd);
        }
        .placesList {
          list-style: none;
        }
        .placeRow {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-bottom: 1px solid var(--border-color, #f0f0f0);
        }
        .placeRow:last-child {
          border-bottom: none;
        }
        .placeName {
          flex: 1;
          font-size: 14px;
          color: var(--text-primary, #333);
        }
        .childCount {
          font-size: 12px;
          color: var(--text-muted, #888);
        }
        .deleteBtn {
          background: none;
          border: none;
          color: var(--bg-btn-danger, #e74c3c);
          font-size: 18px;
          cursor: pointer;
          padding: 0 4px;
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        .deleteBtn:hover {
          opacity: 1;
        }
        .emptyState {
          text-align: center;
          padding: 32px;
          color: var(--text-muted, #888);
          font-size: 14px;
        }
      </style>
      <div class="placesApp">
        <h1>Places</h1>
        <form class="createForm" data-id="createForm">
          <div class="formRow">
            <input type="text" placeholder="Place name" data-id="placeName" required />
            <select data-id="parentSelect">
              <option value="">No parent (root place)</option>
              ${parentOptions}
            </select>
          </div>
          <button type="submit" class="createBtn">Add Place</button>
        </form>
        ${placeTree
          ? `<ul class="placesList" data-id="placesList">${this.#renderPlaceTree(this.#places).replace(/^<div/g, '<li').replace(/<\/div>$/g, '</li>')}</ul>`
          : '<div class="emptyState">No places yet. Create one above.</div>'}
      </div>
    `
  }
}

customElements.define('page-places', PagePlaces)
