import '../components/NavLink.js'

export class AppShell extends HTMLElement {
  #currentPage = null

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.#render()
    this.#bindEvents()
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <style>
        .navBar {
          display: flex;
          gap: 4px;
          padding: 8px 16px;
          background: #4a90d9;
          border-radius: 8px 8px 0 0;
        }
        .navBar nav-link {
          --nav-color: #fff;
        }
        .navBar nav-link::part(link) {
          color: var(--nav-color);
          background: transparent;
        }
        .navBar nav-link::part(link):hover {
          background: rgba(255,255,255,0.15);
        }
        .navBar nav-link::part(link).active {
          background: rgba(255,255,255,0.25);
        }
        .pageContent {
          background: #fff;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
          padding: 24px;
          min-height: 200px;
        }
      </style>
      <nav class="navBar" data-id="nav">
        <nav-link href="/">Home</nav-link>
        <nav-link href="/about">About</nav-link>
        <nav-link href="/settings">Settings</nav-link>
      </nav>
      <div class="pageContent">
        <slot name="page-content"></slot>
      </div>
    `

    this.navEl = this.shadowRoot.querySelector('[data-id="nav"]')
    this.slotEl = this.shadowRoot.querySelector('slot[name="page-content"]')
  }

  #bindEvents() {
    // Listen for router's custom navigation event
    window.addEventListener('route-change', (e) => {
      this.#onRouteChange(e.detail.path)
    })

    // Listen for storage disable event from page components
    document.addEventListener('storage:disable', () => {
      this.#disableStorage()
    })
  }

  #disableStorage() {
    import('../service/storageService.js').then(({ storageService }) => {
      import('../config.js').then(({ config }) => {
        storageService.wipe()
        config.storageDisabled = true
        if (this.#currentPage) {
          this.#currentPage.remove()
          this.#currentPage = null
        }
        // Re-render the current page to reflect updated state
        const path = location.pathname
        this.#onRouteChange(path)
      })
    })
  }

  #onRouteChange(path) {
    this.#highlightNav(path)
    this.#renderPage(path)
  }

  #highlightNav(path) {
    this.navEl.querySelectorAll('nav-link').forEach((link) => {
      const active = link.getAttribute('href') === path
      if (active) {
        link.setAttribute('active', '')
      } else {
        link.removeAttribute('active')
      }
    })
  }

  #renderPage(path) {
    if (this.#currentPage) {
      this.#currentPage.remove()
      this.#currentPage = null
    }

    let component = null
    switch (path) {
      case '/':
        component = document.createElement('page-todo')
        break
      case '/about':
        component = document.createElement('page-about')
        break
      case '/settings':
        component = document.createElement('page-settings')
        break
    }

    if (component) {
      component.setAttribute('slot', 'page-content')
      this.appendChild(component)
      this.#currentPage = component
    }
  }

  navigate(path) {
    history.pushState({}, '', path)
  }
}

customElements.define('app-shell', AppShell)
