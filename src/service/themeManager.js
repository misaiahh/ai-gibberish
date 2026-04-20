const THEMES = {
  light: {
    '--bg-app': '#f5f5f5',
    '--bg-card': '#ffffff',
    '--bg-header': '#4a90d9',
    '--bg-footer': '#f5f5f5',
    '--bg-input': '#ffffff',
    '--bg-input-border': '#ddd',
    '--bg-btn-primary': '#4a90d9',
    '--bg-btn-primary-hover': '#357abd',
    '--bg-btn-danger': '#e74c3c',
    '--bg-btn-danger-hover': '#c0392b',
    '--bg-btn-toggle-off': '#ccc',
    '--bg-modal-overlay': 'rgba(0,0,0,0.4)',
    '--bg-modal-content': '#ffffff',
    '--bg-filter-active': '#4a90d9',
    '--bg-nav-active': 'rgba(255,255,255,0.25)',
    '--text-primary': '#333333',
    '--text-secondary': '#555555',
    '--text-muted': '#888888',
    '--text-very-muted': '#999999',
    '--text-completed': '#aaaaaa',
    '--text-header': '#ffffff',
    '--text-link': '#4a90d9',
    '--border-color': '#f0f0f0',
    '--border-input': '#ddd',
    '--shadow-card': 'rgba(0,0,0,0.1)',
    '--shadow-modal': 'rgba(0,0,0,0.3)',
    '--shadow-dropdown': 'rgba(0,0,0,0.15)',
    '--accent-primary': '#4a90d9',
  },
  dark: {
    '--bg-app': '#1a1a2e',
    '--bg-card': '#252540',
    '--bg-header': '#16213e',
    '--bg-footer': '#1a1a2e',
    '--bg-input': '#252540',
    '--bg-input-border': '#3a3a5c',
    '--bg-btn-primary': '#4a90d9',
    '--bg-btn-primary-hover': '#357abd',
    '--bg-btn-danger': '#e74c3c',
    '--bg-btn-danger-hover': '#c0392b',
    '--bg-btn-toggle-off': '#3a3a5c',
    '--bg-modal-overlay': 'rgba(0,0,0,0.6)',
    '--bg-modal-content': '#252540',
    '--bg-filter-active': '#4a90d9',
    '--bg-nav-active': 'rgba(255,255,255,0.15)',
    '--text-primary': '#e2e2e2',
    '--text-secondary': '#b0b0b0',
    '--text-muted': '#888888',
    '--text-very-muted': '#666666',
    '--text-completed': '#777777',
    '--text-header': '#ffffff',
    '--text-link': '#6db3f8',
    '--border-color': '#3a3a5c',
    '--border-input': '#3a3a5c',
    '--shadow-card': 'rgba(0,0,0,0.3)',
    '--shadow-modal': 'rgba(0,0,0,0.5)',
    '--shadow-dropdown': 'rgba(0,0,0,0.4)',
    '--accent-primary': '#4a90d9',
  },
}

const STORAGE_KEY = 'theme'

let currentTheme = 'light'

function applyTheme(theme) {
  currentTheme = theme
  document.body.setAttribute('data-theme', theme)
  const vars = THEMES[theme]
  const bodyStyle = document.body.style
  for (const [prop, value] of Object.entries(vars)) {
    bodyStyle.setProperty(prop, value)
  }
  document.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }))
}

export const themeManager = {
  getTheme() {
    return currentTheme
  },

  setTheme(theme) {
    if (!THEMES[theme]) return
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  },

  toggle() {
    this.setTheme(currentTheme === 'light' ? 'dark' : 'light')
  },

  init() {
    const saved = localStorage.getItem(STORAGE_KEY)
    applyTheme(saved && THEMES[saved] ? saved : 'light')
  },
}
