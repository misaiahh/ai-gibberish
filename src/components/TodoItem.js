/**
 * @typedef {Object} TodoItemComponent
 * @property {HTMLInputElement} checkbox
 * @property {HTMLSpanElement} textSpan
 * @property {HTMLElement} descriptionSection
 * @property {HTMLButtonElement} descriptionToggle
 * @property {HTMLElement} placeNames
 * @property {HTMLButtonElement} deleteBtn
 * @property {HTMLButtonElement} placeBtn
 * @property {HTMLElement} placeDropdown
 */

export class TodoItem extends HTMLElement {
  constructor() {
    super()
    this.#attachShadow()
  }

  connectedCallback() {
    this.#render()
  }

  static get observedAttributes() {
    return ['title', 'description', 'completed', 'id', 'place-ids', 'places', 'selected']
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
    const title = this.getAttribute('title') || ''
    const description = this.getAttribute('description') || ''
    const completed = this.getAttribute('completed') === 'true'
    const id = this.getAttribute('id') || ''
    const placeIds = JSON.parse(this.getAttribute('place-ids') || '[]')
    const places = JSON.parse(this.getAttribute('places') || '[]')
    const selected = this.getAttribute('selected') === 'true'
    const hasDescription = description.length > 0

    const placeNames = placeIds.map((pid) => {
      const place = places.find((p) => p.id === pid)
      return place ? place.name : null
    }).filter(Boolean)

    const descriptionHtml = hasDescription ? `
        <div class="descriptionSection" data-id="descriptionSection">
          <button class="descriptionToggle" data-id="descriptionToggle" title="Toggle description">▼</button>
          <div class="descriptionContent" data-id="descriptionContent" style="display:none;">${this.#escapeHtml(description)}</div>
        </div>
      ` : ''

    this.shadowRoot.innerHTML = `
      <style>
        .todoItem {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 8px;
          border-bottom: 1px solid var(--border-color, #f0f0f0);
          transition: background-color 0.15s ease;
        }
        .todoItem.selected {
          background-color: rgba(74, 144, 217, 0.08);
        }
        .todoItem:last-child {
          border-bottom: none;
        }
        .todoItem input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: var(--accent-primary, #4a90d9);
          flex-shrink: 0;
        }
        .todoContent {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }
        .todoRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .todoText {
          font-size: 14px;
          color: var(--text-primary, #333);
          cursor: default;
          user-select: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .todoText.completed {
          text-decoration: line-through;
          color: var(--text-completed, #aaa);
        }
        .descriptionSection {
          display: flex;
          align-items: center;
          gap: 4px;
          padding-left: 28px;
        }
        .descriptionToggle {
          background: none;
          border: none;
          font-size: 10px;
          cursor: pointer;
          color: var(--text-muted, #888);
          padding: 2px;
          line-height: 1;
        }
        .descriptionContent {
          font-size: 13px;
          color: var(--text-secondary, #555);
          white-space: pre-wrap;
          word-break: break-word;
          padding: 4px 0;
          line-height: 1.4;
        }
        .descriptionContent a {
          color: var(--accent-primary, #4a90d9);
          text-decoration: none;
        }
        .descriptionContent a:hover {
          text-decoration: underline;
        }
        .placeNames {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: 12px;
          flex-shrink: 0;
        }
        .placeName {
          font-size: 12px;
          color: var(--text-muted, #888);
          white-space: nowrap;
        }
        .placeBtn {
          background: none;
          border: none;
          font-size: 12px;
          cursor: pointer;
          padding: 2px 4px;
          opacity: 0.4;
          transition: opacity 0.2s;
          line-height: 1;
        }
        .placeBtn:hover {
          opacity: 0.8;
        }
        .placeDropdown {
          position: absolute;
          right: 60px;
          background: var(--bg-card, #fff);
          border: 1px solid var(--border-color, #ddd);
          border-radius: 6px;
          box-shadow: var(--shadow-card, 0 2px 12px rgba(0, 0, 0, 0.1));
          padding: 4px 0;
          min-width: 160px;
          z-index: 100;
          display: none;
        }
        .placeDropdown.open {
          display: block;
        }
        .placeOption {
          padding: 8px 12px;
          font-size: 13px;
          cursor: pointer;
          color: var(--text-primary, #333);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .placeOption:hover {
          background: var(--bg-app, #f5f5f5);
        }
        .placeOption.selected::before {
          content: '\\2713';
          color: var(--accent-primary, #4a90d9);
          font-size: 12px;
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
          flex-shrink: 0;
        }
        .deleteBtn:hover {
          opacity: 1;
        }
      </style>
      <label class="todoItem ${selected ? 'selected' : ''}">
        <input type="checkbox" data-id="checkbox" ${selected ? 'checked' : ''} />
        <div class="todoContent">
          <div class="todoRow">
            <span class="todoText ${completed ? 'completed' : ''}" data-id="todoText">${title}</span>
            <div class="placeNames" data-id="placeNames">
              ${placeNames.map(name => `<span class="placeName">${name}</span>`).join('')}
              ${places.length > 0 ? '<button class="placeBtn" data-id="placeBtn" title="Edit places">+</button>' : ''}
            </div>
          </div>
          ${descriptionHtml}
        </div>
        <button class="deleteBtn" data-id="deleteBtn" title="Delete">&times;</button>
      </label>
      <div class="placeDropdown" data-id="placeDropdown">
        ${places.map(p =>
          `<div class="placeOption ${placeIds.includes(p.id) ? 'selected' : ''}" data-id="place-${p.id}" data-place-id="${p.id}">${p.name}</div>`
        ).join('')}
      </div>
    `

    this.checkbox = this.shadowRoot.querySelector('[data-id="checkbox"]')
    this.textSpan = this.shadowRoot.querySelector('[data-id="todoText"]')
    this.descriptionSection = this.shadowRoot.querySelector('[data-id="descriptionSection"]')
    this.descriptionToggle = this.shadowRoot.querySelector('[data-id="descriptionToggle"]')
    this.descriptionContent = this.shadowRoot.querySelector('[data-id="descriptionContent"]')
    this.placeNames = this.shadowRoot.querySelector('[data-id="placeNames"]')
    this.deleteBtn = this.shadowRoot.querySelector('[data-id="deleteBtn"]')
    this.placeBtn = this.shadowRoot.querySelector('[data-id="placeBtn"]')
    this.placeDropdown = this.shadowRoot.querySelector('[data-id="placeDropdown"]')

    this.checkbox.addEventListener('change', () => {
      this.dispatchEvent(
        new CustomEvent('select', {
          detail: { id, selected: this.checkbox.checked },
          bubbles: true,
          composed: true,
        })
      )
    })

    this.deleteBtn.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('delete', {
          detail: { id },
          bubbles: true,
          composed: true,
        })
      )
    })

    this.textSpan.addEventListener('dblclick', () => {
      this.dispatchEvent(
        new CustomEvent('toggle', {
          detail: { id },
          bubbles: true,
          composed: true,
        })
      )
    })

    if (this.placeBtn) {
      this.placeBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        const isOpen = this.placeDropdown?.classList.contains('open')
        if (this.placeDropdown) {
          this.placeDropdown.classList.toggle('open', !isOpen)
        }
      })

      this.placeDropdown.addEventListener('click', (e) => {
        const option = e.target.closest('[data-place-id]')
        if (!option) return
        e.stopPropagation()
        const placeId = option.dataset.placeId
        const wasSelected = option.classList.contains('selected')
        const newPlaceIds = wasSelected
          ? placeIds.filter((pid) => pid !== placeId)
          : [...placeIds, placeId]
        this.dispatchEvent(
          new CustomEvent('place-change', {
            detail: { id, placeIds: newPlaceIds },
            bubbles: true,
            composed: true,
          })
        )
      })

      this.shadowRoot.addEventListener('click', (e) => {
        if (!this.placeDropdown?.contains(e.target) && e.target !== this.placeBtn) {
          this.placeDropdown?.classList.remove('open')
        }
      })
    }

    if (this.descriptionToggle) {
      this.descriptionToggle.addEventListener('click', (e) => {
        e.stopPropagation()
        const isVisible = this.descriptionContent?.style.display !== 'none'
        if (this.descriptionContent) {
          this.descriptionContent.style.display = isVisible ? 'none' : 'block'
          this.descriptionToggle.textContent = isVisible ? '▼' : '▶'
        }
      })
    }
  }

  #escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}

customElements.define('todo-item', TodoItem)
