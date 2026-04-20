import { router } from './utils/router.js'
import { config } from './config.js'

import './components/NavLink.js'
import './components/AppShell.js'
import './pages/todo/PageTodo.js'
import './pages/about/PageAbout.js'
import './pages/settings/PageSettings.js'
import './components/TodoInput.js'
import './components/TodoItem.js'
import './components/TodoList.js'

async function initPreferences() {
  try {
    const { preferencesService } = await import('./service/preferencesService.js')
    const prefs = await preferencesService.getPreferences()
    config.preferences = prefs
    config.storageDisabled = !prefs.clientStorageEnabled
    config.serverStorageEnabled = prefs.serverStorageEnabled
  } catch {
    // Preferences server unavailable — use defaults (both enabled)
  }
}

function init() {
  const shell = document.querySelector('app-shell')

  if (!shell) return

  initPreferences().then(() => {
    // Register known routes so the router doesn't redirect them
    router.get('/', () => shell.navigate('/'))
    router.get('/about', () => shell.navigate('/about'))
    router.get('/settings', () => shell.navigate('/settings'))

    // Only handle truly unknown paths
    router.get('*', () => {
      history.replaceState({}, '', '/')
      shell.navigate('/')
    })

    router.start()
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
