# Dark/Light Mode via CSS Custom Properties (Theme Context)

## Context
The app has 8 Web Components with Shadow DOM, all using hardcoded hex colors. There is no theming system. CSS custom properties cascade into Shadow DOM when defined on `:host`, making them the natural "context provider" pattern for custom elements.

## Approach: CSS Custom Properties + ThemeManager

### Theme Manager (the "provider")
- Create `src/service/themeManager.js` — a singleton with:
  - `getTheme()` / `setTheme(theme)` — light or dark
  - `subscribe(fn)` — observer pattern for theme changes
  - Persists preference to `localStorage` (key: `theme`)
  - On init, reads `localStorage` or falls back to `light`
  - Emits a `theme-change` custom event on `window` when theme changes

### Theme Manager applies to body
- `ThemeManager.setTheme()` applies `document.body.setAttribute('data-theme', theme)` and sets all CSS vars on `document.body.style`
- No separate `ThemeProvider` component needed — ThemeManager handles everything

### Design Token Palettes
Define two palettes (light/dark) as CSS variable sets applied to `body`:

**Light palette:**
```
--bg-app: #f5f5f5
--bg-card: #ffffff
--bg-header: #4a90d9
--bg-footer: #f5f5f5
--bg-input: #ffffff
--bg-input-border: #ddd
--bg-btn-primary: #4a90d9
--bg-btn-primary-hover: #357abd
--bg-btn-danger: #e74c3c
--bg-btn-danger-hover: #c0392b
--bg-btn-toggle-off: #ccc
--bg-modal-overlay: rgba(0,0,0,0.4)
--bg-modal-content: #ffffff
--bg-filter-active: #4a90d9
--bg-nav-active: rgba(255,255,255,0.25)
--text-primary: #333333
--text-secondary: #555555
--text-muted: #888888
--text-very-muted: #999999
--text-completed: #aaaaaa
--text-header: #ffffff
--text-link: #4a90d9
--border-color: #f0f0f0
--border-input: #ddd
--shadow-card: rgba(0,0,0,0.1)
--shadow-modal: rgba(0,0,0,0.3)
--shadow-dropdown: rgba(0,0,0,0.15)
--accent-primary: #4a90d9
```

**Dark palette:**
```
--bg-app: #1a1a2e
--bg-card: #252540
--bg-header: #16213e
--bg-footer: #1a1a2e
--bg-input: #252540
--bg-input-border: #3a3a5c
--bg-btn-primary: #4a90d9
--bg-btn-primary-hover: #357abd
--bg-btn-danger: #e74c3c
--bg-btn-danger-hover: #c0392b
--bg-btn-toggle-off: #3a3a5c
--bg-modal-overlay: rgba(0,0,0,0.6)
--bg-modal-content: #252540
--bg-filter-active: #4a90d9
--bg-nav-active: rgba(255,255,255,0.15)
--text-primary: #e2e2e2
--text-secondary: #b0b0b0
--text-muted: #888888
--text-very-muted: #666666
--text-completed: #777777
--text-header: #ffffff
--text-link: #6db3f8
--border-color: #3a3a5c
--border-input: #3a3a5c
--shadow-card: rgba(0,0,0,0.3)
--shadow-modal: rgba(0,0,0,0.5)
--shadow-dropdown: rgba(0,0,0,0.4)
--accent-primary: #4a90d9
```

### Component Updates (replace hardcoded colors with CSS vars)

Every component's `:host` block will define the CSS variables with `var(--var-name, fallback)` so they read from `body` but have sensible defaults:

| Component | Colors to replace |
|-----------|------------------|
| `AppShell.js` | `#f5f5f5` (bg), `#4a90d9` (header), `#fff` (title text), `#f5f5f5` (footer bg), `#999` (footer text), `#4a90d9` (footer link) |
| `NavLink.js` | `#fff` (nav link text), `rgba(255,255,255,0.25)` (active bg) |
| `TodoInput.js` | `#ddd` (input border), `#4a90d9` (focus border), `#4a90d9` (btn bg), `#357abd` (btn hover), `#fff` (btn text) |
| `TodoItem.js` | `#f0f0f0` (border), `#4a90d9` (checkbox accent), `#333` (text), `#aaa` (completed text), `#e74c3c` (delete) |
| `PageTodo.js` | `#fff` (card bg), `#333` (title), `#ddd` (filter border), `#4a90d9` (filter active), `#888` (footer text), `#f0f0f0` (divider), `#e74c3c` (clear) |
| `PageAbout.js` | `#333` (heading), `#555` (paragraphs) |
| `PageSettings.js` | `#333` (headings/labels), `#555` (values), `#f0f0f0` (borders), `#ccc` (toggle off), `#4a90d9` (toggle on), `#e74c3c` (danger btn), `#fff` (modal bg), etc. |

### Theme Toggle in Header
- Add a sun/moon toggle button in `AppShell.js` header next to the user dropdown.
- The button calls `themeManager.setTheme()` to switch.
- Also add a "Theme" row in `PageSettings.js` for discoverability.

### Files to create
1. `src/service/themeManager.js` — singleton theme manager (applies CSS vars to body, persists to localStorage)

### Files to modify
1. `src/components/AppShell.js` — replace hardcoded colors with CSS vars + add sun/moon theme toggle button in header
2. `src/components/NavLink.js` — replace hardcoded colors with CSS vars
3. `src/components/TodoInput.js` — replace hardcoded colors with CSS vars
4. `src/components/TodoItem.js` — replace hardcoded colors with CSS vars
5. `src/pages/todo/PageTodo.js` — replace hardcoded colors with CSS vars
6. `src/pages/about/PageAbout.js` — replace hardcoded colors with CSS vars
7. `src/pages/settings/PageSettings.js` — replace hardcoded colors + add theme toggle row
8. `src/main.js` — import and initialize ThemeManager

### Tests to update
- All snapshot tests will change (CSS var references instead of hex values)
- Screenshot tests should visually pass (same appearance in light mode)

## Verification
1. Run `npm test` — fix snapshot diffs (expected, all components now use CSS vars)
2. Manually verify: light mode looks identical to current app, toggling to dark mode changes all colors coherently
3. Verify theme persists across page reloads
4. Verify settings page toggle works
