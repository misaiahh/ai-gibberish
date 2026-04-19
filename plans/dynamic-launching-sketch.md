# SPA Routing Implementation Plan

## Context

The todo app is currently a single-view app rendered inside one `<todo-app>` custom element. The goal is to convert it into a multi-page SPA with client-side routing so users can navigate between Home (todos), About, and Settings pages.

## Approach

- Install `page` (~3KB) as the client-side router
- Create an `AppShell` root component with a persistent nav bar and a dynamic content area
- Create page components: `PageTodo`, `PageAbout`, `PageSettings`
- Remove the old `TodoApp.js` (its logic moves to `PageTodo`)
- Keep `TodoInput`, `TodoItem`, `TodoList` as shared presentational components

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/AppShell.js` | Root component: nav bar + slot for page content |
| `src/components/PageTodo.js` | Todo list page (logic from TodoApp) |
| `src/components/PageAbout.js` | About page with project info |
| `src/components/PageSettings.js` | Settings page showing current config |
| `tests/components/AppShell.test.js` | Shell nav, page rendering, active link tests |
| `tests/components/PageTodo.test.js` | Todo page functionality tests |
| `tests/components/PageAbout.test.js` | About page render test |
| `tests/components/PageSettings.test.js` | Settings page render test |

## Files to Modify

| File | Change |
|------|--------|
| `src/main.js` | Rewrite: register new components, init page.js router |
| `src/styles.css` | Replace `todo-app` selector with `app-shell` |
| `index.html` | Replace `<todo-app>` with `<app-shell>` |
| `tests/main.test.js` | Check new component registrations |
| `tests/components/TodoApp.test.js` | Remove (replaced by PageTodo tests) |
| `README.md` | Document SPA routing, new pages |

## Files to Remove

| File | Reason |
|------|--------|
| `src/components/TodoApp.js` | Replaced by PageTodo |

## Detailed Design

### AppShell (`src/components/AppShell.js`)
- Shadow DOM renders nav bar (Home, About, Settings links) and a content `<div>`
- Page components are inserted as light DOM children with `slot="page-content"`
- Listens to `popstate` events to detect route changes
- `#renderPage(path)` creates the appropriate `<page-*>` element and appends it
- `navigate(path)` public method: calls `history.pushState()` + re-renders
- Nav links are `<a>` tags with `href` set to route paths (page.js handles the rest)

### PageTodo (`src/components/PageTodo.js`)
- Direct port of TodoApp logic: `todoFactory` store, filter state, event handling
- Stripped of any assumption it's the root element
- Uses same child components (`todo-input`, `todo-list`)

### PageAbout (`src/components/PageAbout.js`)
- Renders heading + paragraph about the app + tech stack list

### PageSettings (`src/components/PageSettings.js`)
- Displays current `config.storageType` and `config.storageKey`
- Read-only display — no runtime config changes

### main.js (rewrite)
- Imports `page` from `'page'`
- Imports all new component files (triggers `customElements.define`)
- Defines routes: `/` → Home, `/about`, `/settings`
- Falls back `*` → `/`
- Calls `page.start()` then `shell.navigate('/')`

### AppShell Navigation
- When user clicks a nav link (`<a href="/about">`), the browser navigates
- `page.js` intercepts via `pushState` (not full page reload)
- `popstate` fires → AppShell detects new path → swaps page component
- This is the cleanest integration: `page.js` handles browser history, AppShell handles component rendering

## Execution Order

1. Install `page` via npm
2. Create `AppShell.js`
3. Create `PageTodo.js` (copy from TodoApp)
4. Create `PageAbout.js`
5. Create `PageSettings.js`
6. Rewrite `main.js`
7. Update `index.html` and `styles.css`
8. Remove `TodoApp.js`
9. Write new tests + update existing tests
10. Update README

## Verification

- `npm run test` — all 100+ tests pass
- `npm run dev` — app loads with nav bar
- Clicking nav links changes page without reload
- Todo functionality works on Home page
- About page shows project info
- Settings page shows current config
