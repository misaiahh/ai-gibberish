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
          display: grid;
          grid-template-columns: 220px 1fr;
          grid-template-rows: auto 1fr auto;
          grid-template-areas:
            "header header"
            "sidebar content"
            "footer footer";
          grid-template-rows: 56px 1fr auto;
          min-height: 100vh;
          background: var(--bg-app, #f5f5f5);
        }
        :host(.sidebar-collapsed) {
          grid-template-columns: 0px 1fr;
        }
        .header {
          grid-area: header;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          background: var(--bg-header, #4a90d9);
        }
        .headerLeft {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .collapseBtn {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          border: none;
          background: rgba(255,255,255,0.2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          color: var(--text-header, #fff);
          font-size: 18px;
        }
        .collapseBtn:hover {
          background: rgba(255,255,255,0.35);
        }
        .headerTitle {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-header, #fff);
          letter-spacing: -0.3px;
          cursor: pointer;
        }
        .headerActions {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
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
          right: 0;
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
        }
        .userDropdown nav-link::part(link):hover {
          background: var(--bg-footer, #f5f5f5);
        }
        .sidebar {
          grid-area: sidebar;
          background: var(--bg-sidebar, #2c3e50);
          padding: 24px 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow: hidden;
          transition: width 0.2s ease;
        }
        :host(.sidebar-collapsed) .sidebar {
          width: 0px;
          padding: 0;
        }
        .sidebarNav {
          display: flex;
          flex-direction: column;
        }
        .sidebarNav nav-link {
          display: block;
        }
        .sidebarNav nav-link::part(link) {
          color: var(--text-sidebar, #bdc3c7);
          padding: 10px 20px;
          font-size: 14px;
          border-radius: 0;
          white-space: nowrap;
        }
        .sidebarNav nav-link::part(link):hover {
          background: var(--bg-sidebar-hover, rgba(255,255,255,0.1));
          color: var(--text-header, #fff);
        }
        .sidebarNav nav-link::part(link).active {
          background: var(--bg-nav-active, rgba(255,255,255,0.2));
          color: var(--text-header, #fff);
        }
        .content {
          grid-area: content;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .pageContent {
          flex: 1;
          padding: 32px 24px;
          display: flex;
          justify-content: center;
        }
        .pageContent ::slotted(*) {
          max-width: 900px;
          width: 100%;
        }
        footer {
          grid-area: footer;
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
    <header class="header">
         <div class="headerLeft">
           <button class="collapseBtn" data-id="collapseBtn" aria-label="Toggle sidebar">&laquo;</button>
           <span class="headerTitle" data-id="appTitle">Todo App</span>
         </div>
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
           <div class="userDropdown hidden" data-id="userDropdown">
             <nav-link href="/settings">Settings</nav-link>
           </div>
         </div>
       </header>
      <nav class="sidebar">
        <div class="sidebarNav">
          <nav-link href="/">Home</nav-link>
          <nav-link href="/places">Places</nav-link>
        </div>
      </nav>
      <div class="content">
        <div class="pageContent">
          <slot name="page-content"></slot>
        </div>
      </div>
      <footer>
        <span>Todo App &copy; 2025 &middot; <a data-id="aboutLink" href="/about">About</a></span>
      </footer>
    `

    this.slotEl = this.shadowRoot.querySelector('slot[name="page-content"]')
    this.appTitle = this.shadowRoot.querySelector('[data-id="appTitle"]')
    this.aboutLink = this.shadowRoot.querySelector('[data-id="aboutLink"]')
    this.collapseBtn = this.shadowRoot.querySelector('[data-id="collapseBtn"]')
    this.themeToggle = this.shadowRoot.querySelector('[data-id="themeToggle"]')
    this.userBtn = this.shadowRoot.querySelector('[data-id="userBtn"]')
    this.userDropdown = this.shadowRoot.querySelector('[data-id="userDropdown"]')
    this.sunIcon = this.shadowRoot.querySelector('.sunIcon')
    this.moonIcon = this.shadowRoot.querySelector('.moonIcon')
    this.isSidebarCollapsed = false
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

    // Sidebar collapse toggle
    this.collapseBtn.addEventListener('click', () => {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
      this.classList.toggle('sidebar-collapsed', this.isSidebarCollapsed)
      this.collapseBtn.textContent = this.isSidebarCollapsed ? '»' : '«'
    })

    // Navigate to home on title click
    this.appTitle.addEventListener('click', () => {
      this.navigate('/')
    })

    // Intercept footer about link for client-side routing
    this.aboutLink.addEventListener('click', (e) => {
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
      case '/places':
        component = document.createElement('page-places')
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
