# Todo App

A vanilla JavaScript Todo application built with Web Components and Shadow DOM.

## Tech Stack

- **Web Components** (custom elements, Shadow DOM)
- **Vite** (build tool + dev server)
- **Vitest** (testing, with Playwright browser environment)

## Configuration

Edit `src/config.js` to choose storage backend:

```js
export const config = {
  storageType: 'local',  // 'local' or 'session'
  storageKey: 'todos',
}
```

## Components

| Component | Description |
|-----------|-------------|
| `todo-app` | Root component. Routes events, manages filter state, delegates data operations to `todoFactory`. |
| `todo-input` | Input field and Add button. Dispatches `add` events. |
| `todo-item` | Single todo row. Dispatches `toggle` and `delete` events. |
| `todo-list` | Renders a filtered list of `todo-item` components. |

## Custom Events

| Event | Detail | Bubbles | Composed |
|-------|--------|---------|----------|
| `add` | `{ text: string }` | Yes | Yes |
| `toggle` | `{ id: number }` | Yes | Yes |
| `delete` | `{ id: number }` | Yes | Yes |

## Persistence

`todoFactory` creates isolated stores that persist every mutation to `localStorage` or `sessionStorage` (configurable in `config.js`). On init, the store loads existing todos from storage and resumes the ID counter from the highest stored ID.

## Running

```bash
npm run dev      # Start dev server
npm run test     # Run all tests once
npm run test:watch   # Watch mode
```

## Summary of Changes

### Initial Bug: Mark Complete Checkbox Not Working

The "mark complete" checkbox was non-functional. The root cause was a double-toggle bug in `TodoList`: it was re-dispatching `toggle` and `delete` events that already bubbled via `composed: true` from `TodoItem`. This meant events reached `TodoApp` twice — toggling complete then immediately back to false.

**Fix:** Removed the re-dispatch logic from `TodoList`. The `toggle`/`delete` events from `TodoItem` already bubble through the shadow DOM boundary and are handled directly by `TodoApp`.

### Event Delegation Fix in TodoApp

The click handler in `TodoApp` used `closest('label')` and `closest('.delete-btn')` to find parent elements, but these selectors cannot cross shadow DOM boundaries.

**Fix:** Replaced with `e.composedPath().findIndex(el => el.tagName === 'LABEL')` to traverse across nested shadow DOMs.

### Test Environment: checkbox.click() Doesn't Fire change

In the Vitest/Playwright environment, calling `checkbox.click()` does not trigger the `change` event listener.

**Fix:** Manually set `checkbox.checked = true` and dispatch `new Event('change', { bubbles: true })` in tests.

### CSS Module Conversion Attempt

The initial approach was to convert all component styles to CSS modules (`.module.css`). However, Vite injects CSS module styles into the document `<head>`, which **cannot** penetrate shadow DOM boundaries. Document-level styles cannot style shadow DOM content.

**Resolution:** Each component uses inline `<style>` tags in its shadow DOM template with plain class names. The global `styles.css` file handles document-level layout (body, host element). No CSS modules are used.

### Focus Retention After Enter Key

When the user pressed Enter in the input field, the `add` event caused `TodoApp` to call `#render()`, which replaced the entire shadow DOM and destroyed the focused input element. Focus was lost because the new input element could not inherit focus from the old one.

**Fix:** Split `TodoApp.#render()` into two methods:
- `#render()` — replaces the full shadow DOM (initial mount only)
- `#updateList()` — updates only the `todo-list` component and footer via `list.update(todos)`, leaving `todo-input` untouched

Event handlers now call `#updateList()` instead of `#render()`, preserving the input element and its focus state.

### Testing Conventions

- Tests use `data-id` attributes for querying elements inside shadow DOMs
- Tests use `vi.fn()` for event handler mocks
- Snapshot tests verify shadow DOM structure
- Focus is tracked via the host element (`todo-input`) rather than `document.activeElement`, since focus on shadow DOM inputs propagates to the host

### State Management and Persistence

Todo data was extracted from `TodoApp` into `todoFactory` — an isolated store that owns the todos array, generates IDs, and handles all data operations (create, delete, toggle, clear completed). `TodoApp` delegates to this store instead of managing state directly.

Every mutation automatically persists to `localStorage` or `sessionStorage` (configurable via `src/config.js`). When the app loads, existing todos are restored from storage and the ID counter resumes from the last stored value. A dedicated `storageService` module provides `loadTodos()`, `saveTodos()`, and `clearTodos()` for the persistence layer.

### Test Organization

Test files were restructured to mirror the `src/` directory layout. Component tests live in `tests/components/`, factory tests in `tests/factory/`, service tests in `tests/service/`, and utility tests in `tests/utils/`. This makes it easy to locate tests and keeps the project structure consistent between source and test directories.
