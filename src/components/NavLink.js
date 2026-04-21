export class NavLink extends HTMLElement {
  #href = ''

  static get observedAttributes() {
    return ['href']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.#render()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'href' && oldVal !== newVal) {
      this.#href = newVal || ''
      this.#render()
    }
  }

  connectedCallback() {
    this.#href = this.getAttribute('href') || this.#href
    this.#render()
    this.#syncActive()
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          cursor: pointer;
          text-decoration: none;
        }
        .link {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          color: inherit;
          transition: background 0.2s;
        }
        .link.active {
          background: var(--bg-nav-active, rgba(255,255,255,0.25));
        }
      </style>
      <span class="link" data-id="link" part="link"><slot></slot></span>
    `

    this.shadowRoot.querySelector('[data-id="link"]').addEventListener(
      'click',
      (e) => {
        e.preventDefault()
        history.pushState({}, '', this.#href)
        window.dispatchEvent(new CustomEvent('route-change', {
          detail: { path: this.#href },
        }))
      }
    )
  }

  #syncActive() {
    const link = this.shadowRoot.querySelector('[data-id="link"]')
    if (link) {
      link.classList.toggle('active', this.#href === location.pathname)
    }
  }

  syncActive() {
    this.#syncActive()
  }
}

customElements.define('nav-link', NavLink)
