# Todo App — Project Context

## Tech Stack

- **Pure vanilla JavaScript** — no frameworks
- **Web Components** — Custom Elements + Shadow DOM for all UI
- **Vite** (v7.1.0) — build tool and dev server
- **Vitest** (v3.2.0) — test runner with Playwright browser environment
- **Istanbul** — code coverage
- **Custom SPA router** — History API–based routing

## Directory Structure

```
todo-app/
  index.html                    # Entry point — <app-shell> + module script
  package.json                  # Scripts: dev, build, test, test:watch, test:coverage
  vite.config.js                # Proxies /api → http://localhost:3000
  vitest.config.js              # Playwright browser tests, globals: true
  src/
    main.js                     # App bootstrap, routing, theme init, preferences load
    config.js                   # Storage type, key, disabled flag, server storage flag
    styles.css                  # Global styles: box-sizing, body, app-shell grid
    components/
      AppShell.js               # Layout shell: header, sidebar, content, footer
      NavLink.js                # Nav link — intercepts clicks for client-side routing
      TodoInput.js              # Text input + place selector dropdown
      TodoItem.js               # Single todo row: checkbox, text, place name, delete
      TodoList.js               # Filtered list of todo-item components
    factory/
      todoFactory.js            # Todo store: CRUD, localStorage persistence, API sync
    pages/
      todo/PageTodo.js          # Home page: todo CRUD, filters, offline indicator
      places/PagePlaces.js      # Places management: create, tree view, delete
      about/PageAbout.js        # About page with tech stack info
      settings/PageSettings.js  # Settings: storage toggles, theme, disable storage
    service/
      apiService.js             # HTTP calls for /api/todos and /api/places
      preferencesService.js     # HTTP calls for /api/preferences
      storageService.js         # localStorage/sessionStorage wrapper
      themeManager.js           # Light/dark theme management with localStorage persistence
    utils/
      router.js                 # Custom History API router
      todoUtils.js              # Pure utility functions (ID gen, CRUD, filtering)
  tests/                        # Mirrors src/ structure
    __screenshots__/            # Visual regression screenshots
```

## Layout — AppShell CSS Grid

The entire app uses a **3-row, 2-column CSS Grid** layout defined in `AppShell.js`:

```
grid-template-columns: 220px 1fr;
grid-template-rows: 56px 1fr auto;
grid-template-areas:
  "header header"
  "sidebar content"
  "footer footer";
```

**When sidebar is collapsed** (`sidebar-collapsed` class on host):
```
grid-template-columns: 0px 1fr;
```

### Layout Regions (in DOM order)

1. **`<header class="header">`** — full width, 56px tall
   - Left side: collapse button (`«`/`»`), "Todo App" title (clickable → home)
   - Right side: theme toggle (sun/moon icon), user menu button (opens Settings dropdown)
   - User dropdown: positioned absolutely within `.headerActions` (has `position: relative`)

2. **`<nav class="sidebar">`** — 220px wide, below header
   - Contains `nav-link` elements for Home (`/`) and Places (`/places`)
   - Active link styling via `::part(link).active`
   - Collapses to 0px with transition when `sidebar-collapsed` class is present

3. **`<div class="content">`** — fills remaining space
   - Contains `.pageContent` (flex: 1) which wraps `<slot name="page-content">`
   - Page components are appended as children of `app-shell` with `slot="page-content"`

4. **`<footer>`** — full width at bottom
   - Contains copyright text and About link (client-side routed to `/about`)

## Routes

| Route | Page Component | Purpose |
|-------|---------------|---------|
| `/` | `page-todo` | Home — todo list, input, filters |
| `/places` | `page-places` | Places management — create, tree view, delete |
| `/about` | `page-about` | About info |
| `/settings` | `page-settings` | Settings — storage, theme, disable |
| `*` (wildcard) | → `/` | Redirect to home |

## Components

### NavLink
- **Attribute:** `href` (string) — observed
- **Shadow DOM:** `<span class="link" part="link"><slot></slot></span>`
- **Event:** dispatches `route-change` with `{ path }` on click
- **Styling:** parent can style via `::part(link)`

### TodoInput
- **Attributes:** `placeholder` (string), `places` (JSON array string)
- **Shadow DOM:** Flex column with input row (text input + "Add" button) and place select
- **Events:** dispatches `add` event with `{ title, placeId }`
- **Properties:** `value` (getter/setter for input text)

### TodoItem
- **Attributes:** `title`, `completed` ("true"/"false"), `id`, `place-name`
- **Shadow DOM:** Label wrapping checkbox, content div (text + optional place name), delete button
- **Events:** `toggle` with `{ id }`, `delete` with `{ id }`

### TodoList
- **Attributes:** `filter` ("all"/"active"/"completed"), `places` (JSON array string), `todos` (JSON array string)
- **Methods:** `update(todos)`, `updatePlaces(places)`
- **Shadow DOM:** `<ul class="todoList" data-id="list">` dynamically populated with `todo-item` children

### PageTodo
- **Store:** uses `todoFactory()` instance
- **Events:** listens for `add`, `toggle`, `delete` on itself; `click` on shadow root for filters
- **Shadow DOM:** Card with h1, todo-input, filter bar (All/Active/Completed), todo-list, footer (item count, offline status, clear completed)
- **Incremental updates:** uses `#updateList()` instead of full `#render()` to preserve focus

### PagePlaces
- **Store:** loads places via `placesService.getAll()` on init
- **Events:** `click` for delete, `submit` for create form
- **Shadow DOM:** Card with h1, create form (name + parent select), tree list or empty state
- **Tree rendering:** recursive `#renderPlaceTree()` with indentation based on depth

### PageSettings
- **Events:** listens for `click` (disable/confirm/cancel), `change` (toggles)
- **Events dispatched:** `storage:disable` (bubbles, not composed)
- **Shadow DOM:** Card with setting rows and two confirmation modals

### PageAbout
- Simple card with h2 and list of technologies

## Data Flow

### Boot Sequence (main.js)
1. Imports all custom elements
2. Initializes `themeManager` (reads `localStorage.theme`)
3. Calls `initPreferences()` — fetches `/api/preferences`
4. Registers known routes with router
5. Starts router (listens for `popstate`)

### Todo Creation Flow
1. User types in `todo-input`, presses Enter
2. `todo-input` dispatches `add` event with `{ title, placeId }`
3. `PageTodo` calls `store.create(title, placeId)`
4. `todoFactory` creates local todo, saves to memory + localStorage
5. If online and server storage enabled, syncs with API
6. `PageTodo.#updateList()` refreshes only the list and footer

### API Endpoints

| Method | Endpoint | Body | Returns |
|--------|----------|------|---------|
| GET | `/api/todos` | — | `Todo[]` |
| POST | `/api/todos` | `{ title, placeId? }` | `Todo` |
| PATCH | `/api/todos/:id` | `{ title?, completed?, placeId? }` | `Todo` |
| DELETE | `/api/todos/:id` | — | — |
| GET | `/api/places` | — | `Place[]` |
| POST | `/api/places` | `{ name, parentId? }` | `Place` |
| DELETE | `/api/places/:id` | — | `Place` (cascades children) |
| GET | `/api/preferences` | — | `{ clientStorageEnabled, serverStorageEnabled }` |
| PATCH | `/api/preferences` | partial prefs | updated prefs |

**Base URL:** `/api` (proxied by Vite to `http://localhost:3000`)
**API service:** sibling `todo-app-api` directory

## Todo Model

```js
{
  id: string,          // UUID via crypto.randomUUID()
  title: string,
  completed: boolean,
  placeId: string|null, // optional place reference
  createdAt: string,    // ISO timestamp
  updatedAt: string     // ISO timestamp
}
```

## Place Model

```js
{
  id: string,          // UUID
  name: string,
  parentId: string|null, // null for root, references parent place id
  createdAt: string,
  updatedAt: string
}
```

## Store — todoFactory

Returns an isolated store with:
- `create(title, placeId?)` — optimistic create
- `getAll()` — loads from localStorage, syncs with API
- `get()` — returns cached todos
- `delete(id)` — optimistic delete
- `toggle(id)` — optimistic toggle
- `updatePlace(id, placeId)` — update place association
- `clearCompleted()` — remove all completed
- `getActiveCount()`, `getCompletedCount()`
- `onStatusChange(fn)` — subscribe to online/offline
- `sync()` — sync when coming back online
- `reset()` — test cleanup

**Offline-first:** mutations applied immediately to memory + localStorage. API calls happen in parallel. If API fails, `online = false` and "Working offline" message shown.

## Theme

Two themes managed by `themeManager.js`: **light** and **dark**.

### CSS Custom Properties

**Backgrounds:**
- `--bg-app`: `#f5f5f5` (light) / `#1a1a2e` (dark)
- `--bg-card`: `#ffffff` / `#252540`
- `--bg-header`: `#4a90d9` (same both)
- `--bg-footer`: `#f5f5f5` / `#1a1a2e`
- `--bg-sidebar`: `#2c3e50` (hardcoded in AppShell)
- `--bg-btn-primary`: `#4a90d9` (same both)
- `--bg-btn-danger`: `#e74c3c` (same both)
- `--bg-filter-active`: `#4a90d9` (same both)
- `--bg-nav-active`: `rgba(255,255,255,0.25)` / `rgba(255,255,255,0.15)`
- `--bg-modal-overlay`, `--bg-modal-content`, `--bg-input`, `--bg-input-border`, `--bg-btn-toggle-off`, `--bg-sidebar-hover` all have light/dark variants

**Text:**
- `--text-primary`, `--text-secondary`, `--text-muted`, `--text-very-muted`, `--text-completed`, `--text-header`, `--text-link`, `--text-sidebar`, `--text-warning`

**Borders & Shadows:**
- `--border-color`, `--border-input`, `--shadow-card`, `--shadow-modal`, `--shadow-dropdown`

**Other:**
- `--accent-primary`: `#4a90d9` (same both)

Theme toggles sun/moon icons in header, persists to `localStorage.theme`, emits `theme-change` event.

## Config (`src/config.js`)

```js
{
  storageType: 'local',       // 'local' or 'session'
  storageKey: 'todos',
  storageDisabled: false,     // in-memory-only mode
  serverStorageEnabled: true, // sync with API
  preferences: null           // loaded from API at boot
}
```

## Testing Conventions

- **Shadow DOM queries:** use `data-id` attributes
- **Event mocking:** `vi.fn()` for mocks, `vi.restoreAllMocks()` in `afterEach`
- **Snapshot tests:** verify shadow DOM structure
- **Fetch mocking:** global `fetch` replaced with `vi.fn()`
- **Focus handling:** tracked via host element (not `document.activeElement`)
- **Idempotent init:** re-attaching components does not duplicate API calls
- **Test files:** mirror `src/` structure, run in Playwright Chromium

## Key Patterns

1. **Shadow DOM encapsulation** — all styles inline in `<style>` tags within templates
2. **Event delegation** — `shadowRoot.addEventListener('click', ...)` with `e.target.closest()`
3. **Incremental updates** — `#updateList()` updates only the list, not full render
4. **Optimistic updates** — store mutations applied immediately, API syncs in background
5. **Web Component composition** — `part`/`slot` for parent-to-child styling (NavLink)
6. **Custom events** — `bubbles: true, composed: true` for cross-shadow-DOM communication
7. **Idempotent connectedCallback** — `#initialized` flag prevents duplicate API calls
