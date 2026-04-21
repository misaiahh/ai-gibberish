export class Dropdown extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'open']
  }

  _items = []
  _selectedValue = null
  _isOpen = false
  _closeHandler = null

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._render()
  }

  get value() {
    return this._selectedValue
  }

  set value(val) {
    this._selectedValue = val
    this._updateTriggerLabel()
  }

  get items() {
    return this._items
  }

  set items(items) {
    this._items = items
    if (this.shadowRoot) {
      this._renderOptions()
    }
  }

  connectedCallback() {
    this._processSlottedOptions()
    this._bindCloseOutside()
    this._bindTrigger()
    if (this.hasAttribute('open')) {
      this._isOpen = true
      const list = this.shadowRoot?.querySelector('[data-id="list"]')
      if (list) {
        list.classList.add('open')
      }
    }
  }

  disconnectedCallback() {
    this._unbindCloseOutside()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'open') {
      this._isOpen = newVal !== null
      const list = this.shadowRoot?.querySelector('[data-id="list"]')
      if (list) {
        list.classList.toggle('open', this._isOpen)
      }
    }
    if (name === 'label') {
      const labelSlot = this.shadowRoot?.querySelector('[name="label"]')
      if (labelSlot) {
        labelSlot.textContent = newVal || 'Select'
      }
    }
  }

  get open() {
    return this._isOpen
  }

  set open(val) {
    this._isOpen = val
    const list = this.shadowRoot?.querySelector('[data-id="list"]')
    if (list) {
      list.classList.toggle('open', val)
    }
    if (val) {
      this.setAttribute('open', '')
    } else {
      this.removeAttribute('open')
    }
  }

  toggle() {
    this._isOpen = !this._isOpen
    const list = this.shadowRoot?.querySelector('[data-id="list"]')
    if (list) {
      list.classList.toggle('open', this._isOpen)
    }
    if (this._isOpen) {
      this.setAttribute('open', '')
    } else {
      this.removeAttribute('open')
    }
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
        }
        .trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 32px 8px 12px;
          border: 1px solid var(--border-input, #ddd);
          border-radius: 6px;
          font-size: 13px;
          outline: none;
          background: var(--bg-app, #f5f5f5);
          color: var(--text-secondary, #555);
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .trigger:focus {
          border-color: var(--accent-primary, #4a90d9);
        }
        .trigger::after {
          content: '';
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-top: 5px solid var(--text-secondary, #555);
          pointer-events: none;
        }
        .list {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: var(--bg-card, #fff);
          border: 1px solid var(--border-input, #ddd);
          border-radius: 6px;
          max-height: 200px;
          overflow-y: auto;
          z-index: 100;
          display: none;
        }
        .list.open {
          display: block;
        }
        .option {
          padding: 8px 12px;
          font-size: 13px;
          cursor: pointer;
          color: var(--text-secondary, #555);
        }
        .option:hover {
          background: var(--bg-app, #f5f5f5);
        }
      </style>
      <div class="trigger" data-id="trigger" tabindex="0" part="trigger">
        <slot name="label">${this.getAttribute('label') || 'Select'}</slot>
      </div>
      <div class="list" data-id="list">
        <slot name="options"></slot>
      </div>
    `
  }

  _processSlottedOptions() {
    const slottedOptions = this.querySelectorAll('option')
    if (slottedOptions.length > 0) {
      this._items = Array.from(slottedOptions).map(opt => ({
        value: opt.getAttribute('value') || opt.textContent,
        label: opt.textContent,
      }))
      this._renderOptions()
    }
  }

  _renderOptions() {
    const list = this.shadowRoot.querySelector('[data-id="list"]')
    if (!list) return
    list.innerHTML = ''
    for (const item of this._items) {
      const div = document.createElement('div')
      div.className = 'option'
      div.setAttribute('data-id', 'option')
      div.setAttribute('data-value', item.value)
      div.textContent = item.label
      div.addEventListener('click', (e) => {
        e.stopPropagation()
        this._selectedValue = item.value
        this._isOpen = false
        this.removeAttribute('open')
        const listEl = this.shadowRoot?.querySelector('[data-id="list"]')
        if (listEl) {
          listEl.classList.remove('open')
        }
        this._updateTriggerLabel()
        this.dispatchEvent(
          new CustomEvent('select', {
            detail: { value: item.value, label: item.label },
            bubbles: true,
            composed: true,
          })
        )
      })
      list.appendChild(div)
    }
  }

  _updateTriggerLabel() {
    const trigger = this.shadowRoot.querySelector('[data-id="trigger"]')
    if (!trigger) return
    const labelSlot = trigger.querySelector('[name="label"]')
    if (!labelSlot) {
      trigger.textContent = this._selectedValue || (this.getAttribute('label') || 'Select')
      return
    }
    if (this._selectedValue) {
      const item = this._items.find(i => i.value === this._selectedValue)
      labelSlot.textContent = item ? item.label : this._selectedValue
    } else {
      labelSlot.textContent = this.getAttribute('label') || 'Select'
    }
  }

  _bindTrigger() {
    const trigger = this.shadowRoot.querySelector('[data-id="trigger"]')
    if (!trigger) return

    trigger.addEventListener('click', (e) => {
      e.stopPropagation()
      this._isOpen = !this._isOpen
      const list = this.shadowRoot?.querySelector('[data-id="list"]')
      if (list) {
        list.classList.toggle('open', this._isOpen)
      }
      if (this._isOpen) {
        this.setAttribute('open', '')
      } else {
        this.removeAttribute('open')
      }
    })

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        this._isOpen = !this._isOpen
        const list = this.shadowRoot?.querySelector('[data-id="list"]')
        if (list) {
          list.classList.toggle('open', this._isOpen)
        }
        if (this._isOpen) {
          this.setAttribute('open', '')
        } else {
          this.removeAttribute('open')
        }
      }
    })
  }

  _bindCloseOutside() {
    this._closeHandler = (e) => {
      if (!this.contains(e.target)) {
        this._isOpen = false
        const list = this.shadowRoot?.querySelector('[data-id="list"]')
        if (list) {
          list.classList.remove('open')
        }
        this.removeAttribute('open')
      }
    }
    document.addEventListener('click', this._closeHandler)
  }

  _unbindCloseOutside() {
    if (this._closeHandler) {
      document.removeEventListener('click', this._closeHandler)
      this._closeHandler = null
    }
  }
}

customElements.define('app-dropdown', Dropdown)
