/**
 * A minimal client-side router using the History API.
 * Supports route matching with wildcards for 404 fallback.
 */
export function createRouter() {
  /** @type {Map<string, Function>} */
  const routes = new Map()
  let currentPath = ''
  let started = false

  /**
   * Define a route.
   * @param {string} path
   * @param {Function} callback
   */
  function get(path, callback) {
    routes.set(path, callback)
  }

  /**
   * Start listening for navigation events.
   */
  function start() {
    if (started) return
    started = true
    window.addEventListener('popstate', () => handlePath(location.pathname))
    handlePath(location.pathname)
  }

  /**
   * Navigate to a path programmatically.
   * @param {string} path
   */
  function navigate(path) {
    history.pushState({}, '', path)
    handlePath(path)
  }

  /**
   * Handle a path change — find matching route and run callback.
   * @param {string} path
   */
  function handlePath(path) {
    if (path === currentPath) return
    currentPath = path

    let matched = routes.get(path)

    if (!matched && path !== '*') {
      for (const routePath of routes.keys()) {
        if (routePath === '*') {
          matched = routes.get(routePath)
          break
        }
      }
    }

    if (matched) {
      matched()
      window.dispatchEvent(new CustomEvent('route-change', {
        detail: { path },
      }))
    } else if (path !== '*') {
      history.replaceState({}, '', '/')
      navigate('/')
    }
  }

  /**
   * Go back to the previous page.
   */
  function back() {
    history.back()
  }

  return { get, start, navigate, back }
}

/**
 * Singleton router instance — shared across all components.
 */
const router = createRouter()
export { router }
