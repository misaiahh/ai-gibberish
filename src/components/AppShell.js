import '../components/NavLink.js'
import '../service/themeManager.js'

import { themeManager } from '../service/themeManager.js'

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
        :host {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: var(--bg-app, #f5f5f5);
        }
        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 56px;
          padding: 0 24px;
          background: var(--bg-header, #4a90d9);
          position: relative;
        }
        .headerActions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .appTitle {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-header, #fff);
          letter-spacing: -0.3px;
          cursor: pointer;
        }
        .themeToggle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .themeToggle:hover {
          background: rgba(255,255,255,0.35);
        }
        .themeToggle svg {
          width: 18px;
          height: 18px;
          fill: var(--text-header, #fff);
        }
        .userBtn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          position: relative;
        }
        .userBtn:hover {
          background: rgba(255,255,255,0.35);
        }
        .userBtn svg {
          width: 20px;
          height: 20px;
          fill: var(--text-header, #fff);
        }
        .userDropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 24px;
          background: var(--bg-modal-content, #fff);
          border-radius: 8px;
          box-shadow: 0 4px 20px var(--shadow-dropdown, rgba(0,0,0,0.15));
          padding: 4px 0;
          min-width: 180px;
          z-index: 100;
        }
        .userDropdown.hidden {
          display: none;
        }
        .userDropdown nav-link {
          display: block;
          width: 100%;
        }
        .userDropdown nav-link::part(link) {
          color: var(--text-primary, #333);
          border-radius: 0;
          padding: 10px 16px;
          font-size: 14px;
          display: block;
        }
        .userDropdown nav-link::part(link):hover {
          background: var(--bg-footer, #f5f5f5);
        }
        main {
          flex: 1;
          padding: 32px 24px;
          display: flex;
          justify-content: center;
        }
        main ::slotted(*) {
          max-width: 900px;
          width: 100%;
        }
        footer {
          padding: 16px 24px;
          text-align: center;
          font-size: 12px;
          color: var(--text-very-muted, #999);
          background: var(--bg-footer, #f5f5f5);
        }
        footer a {
          color: var(--text-link, #4a90d9);
          text-decoration: none;
        }
        footer a:hover {
          text-decoration: underline;
        }
      </style>
      <header>
        <span class="appTitle" data-id="appTitle">Todo App</span>
        <div class="headerActions">
          <button class="themeToggle" data-id="themeToggle" aria-label="Toggle theme">
            <svg class="sunIcon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg class="moonIcon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="display:none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="userBtn" data-id="userBtn" aria-label="User menu">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4"/>
              <path d="M12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/>
            </svg>
          </button>
        </div>
        <div class="userDropdown hidden" data-id="userDropdown">
          <nav-link href="/settings">Settings</nav-link>
        </div>
      </header>
      <main>
        <slot name="page-content"></slot>
      </main>
      <footer>
        <span>Todo App &copy; 2025 &middot; <a data-id="aboutLink" href="/about">About</a></span>
      </footer>
    `

    this.slotEl = this.shadowRoot.querySelector('slot[name="page-content"]')
    this.userBtn = this.shadowRoot.querySelector('[data-id="userBtn"]')
    this.userDropdown = this.shadowRoot.querySelector('[data-id="userDropdown"]')
    this.appTitle = this.shadowRoot.querySelector('[data-id="appTitle"]')
    this.themeToggle = this.shadowRoot.querySelector('[data-id="themeToggle"]')
    this.sunIcon = this.shadowRoot.querySelector('.sunIcon')
    this.moonIcon = this.shadowRoot.querySelector('.moonIcon')
    this.#updateThemeIcon(themeManager.getTheme())
  }

  #updateThemeIcon(theme) {
    if (theme === 'dark') {
      this.sunIcon.style.display = 'none'
      this.moonIcon.style.display = 'block'
    } else {
      this.sunIcon.style.display = 'block'
      this.moonIcon.style.display = 'none'
    }
  }

  #bindEvents() {
    window.addEventListener('route-change', (e) => {
      this.#onRouteChange(e.detail.path)
    })

    document.addEventListener('storage:disable', () => {
      this.#disableStorage()
    })

    // Theme toggle
    this.themeToggle.addEventListener('click', () => {
      themeManager.toggle()
      this.#updateThemeIcon(themeManager.getTheme())
    })

    // Subscribe to theme changes from other sources (e.g. settings page)
    document.addEventListener('theme-change', () => {
      this.#updateThemeIcon(themeManager.getTheme())
    })

    // Toggle user dropdown
    this.userBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      this.userDropdown.classList.toggle('hidden')
    })

    // Close dropdown on outside click
    document.addEventListener('click', () => {
      this.userDropdown.classList.add('hidden')
    })

    // Navigate to home on title click
    this.appTitle.addEventListener('click', () => {
      this.navigate('/')
    })

    // Intercept footer about link for client-side routing
    this.shadowRoot.querySelector('[data-id="aboutLink"]').addEventListener('click', (e) => {
      e.preventDefault()
      history.pushState({}, '', '/about')
      window.dispatchEvent(new CustomEvent('route-change', { detail: { path: '/about' } }))
    })
  }

  async #disableStorage() {
    try {
      await import('../service/preferencesService.js').then(({ preferencesService }) =>
        preferencesService.updatePreferences({ clientStorageEnabled: false }),
      )
    } catch {
      // Preferences server unavailable — proceed anyway
    }

    import('../service/storageService.js').then(({ storageService }) => {
      import('../config.js').then(({ config }) => {
        storageService.wipe()
        config.storageDisabled = true
        if (this.#currentPage) {
          this.#currentPage.remove()
          this.#currentPage = null
        }
        const path = location.pathname
        this.#onRouteChange(path)
      })
    })
  }

  #onRouteChange(path) {
    this.#renderPage(path)
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
    const current = location.pathname
    history.pushState({}, '', path)
    if (current !== path) {
      window.dispatchEvent(new CustomEvent('route-change', { detail: { path } }))
    }
  }
}

customElements.define('app-shell', AppShell)
