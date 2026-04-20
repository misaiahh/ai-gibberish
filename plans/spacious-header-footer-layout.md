# Plan: Desktop Header/Footer Layout Redesign

## Context
Current layout is a narrow (500px) centered card with a nav bar inside AppShell. The user wants a desktop-first layout that uses full screen width with a header, footer, and user icon dropdown in the header for Settings access.

## Design
- **Header**: Full-width bar, ~56px tall. App title on the left, user icon on the right with a dropdown containing Settings link.
- **Main content**: Takes full width, centered with a max-width (1200px or similar). Todo app list uses more horizontal space.
- **Footer**: Full-width bar at bottom with simple copyright/branding.
- **User icon dropdown**: Appears on click, positioned below the icon, contains a Settings link. Closes when clicking outside.

## Files to Modify

### 1. `src/components/AppShell.js`
- Replace nav bar with:
  - Header: `<header>` with app title `<span data-id="appTitle">` on left, user icon button on right
  - User icon: A `<button>` with a simple SVG circle/dot icon, `data-id="userBtn"`
  - Dropdown: A `<div data-id="userDropdown" class="hidden">` with a `<nav-link href="/settings">Settings</nav-link>` inside
  - Main content: `<main>` wrapping the page slot
  - Footer: `<footer>` with branding text
- Click handler on user icon toggles dropdown visibility
- Close dropdown when clicking outside (event listener on `main` or `document`)

### 2. `src/styles.css`
- Remove `max-width: 500px` from `app-shell`
- `body`: Remove flex centering, use `display: block`
- `app-shell`: Use `display: flex`, `flex-direction: column`, `min-height: 100vh`
- Add styles for header, footer, dropdown
- Increase page content max-width (e.g., 900px for todo list)

### 3. `src/pages/todo/PageTodo.js`
- Increase todo app max-width to use more horizontal space (e.g., 900px instead of current inline styles)

## Implementation Details

**AppShell structure:**
```html
<header>
  <span data-id="appTitle">Todo App</span>
  <button data-id="userBtn">👤</button>
  <div data-id="userDropdown" class="hidden">
    <nav-link href="/settings">Settings</nav-link>
  </div>
</header>
<main>
  <slot name="page-content"></slot>
</main>
<footer>
  <span>Todo App © 2025</span>
</footer>
```

**User icon**: Simple SVG or unicode character (circle with a person silhouette)

**Dropdown behavior**:
- Toggle `hidden` class on click
- Close on outside click

## Verification
1. `npm test` — all tests pass (AppShell snapshot will need updating)
2. Manual: Check desktop layout fills screen width appropriately
3. Manual: Verify user dropdown appears and Settings link navigates
