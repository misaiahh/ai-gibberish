# Plan: Offline-First Todo Sync with Local Storage

## Context
Todos are currently API-only with an in-memory cache. There's a `StorageService` class and `config.storageDisabled` flag already in place, but they're not wired into the todo data flow. The user wants offline access: todos should persist to localStorage and sync with the API when online. The "disable storage" feature must continue working.

## Approach
Layer offline sync into `todoFactory` using the existing `storageService` and `config` infrastructure. The store will:
1. On `getAll()`: load from localStorage first (if storage enabled), then fetch from API in parallel and overwrite with live data
2. On every mutation: update in-memory state + persist to localStorage
3. On `online` event: re-fetch from API and reconcile any pending offline changes

## Files to Modify

### 1. `src/factory/todoFactory.js` — Core sync logic
- Import `storageService` and `config`
- Add `#loadFromStorage()` — deserialize from localStorage into `todos` array
- Add `#saveToStorage()` — serialize `todos` to localStorage (no-op when `storageDisabled`)
- Modify `getAll()`: if storage enabled, load from storage first, then fetch from API (parallel with `Promise.all`), overwrite with API data
- Modify `create()`: push to memory, save to storage, then await API call. If API succeeds, update with server response. If API fails, keep local version for offline retry
- Modify `toggle()`: update memory, save to storage, call API. If API fails, keep local state
- Modify `delete()`: splice from memory, save to storage, call API
- Modify `clearCompleted()`: filter memory, save to storage, call API for each
- Add `#syncWithAPI()` — re-fetch from API and reconcile with local state (merge by ID, keep local changes for IDs not in server response, remove server items deleted locally)
- Add offline retry: when `navigator.onLine` becomes true, auto-sync

### 2. `src/pages/todo/PageTodo.js` — Wire up online/offline events
- In `#init()`, after loading todos, add `window.addEventListener('online', ...)` to trigger a store refresh
- Optionally add visual indicator for offline state (deferred — not in scope)

### 3. `config.js` — No changes needed
- `storageDisabled: false` already defaults to enabled
- The existing "Disable Storage" button in Settings calls `storageService.wipe()` which still works

## Key Design Decisions
- **Storage-first loading**: localStorage data shows immediately, then API syncs in background. This gives instant offline access.
- **Mutations optimistic**: Changes apply to memory + storage immediately. API failures don't block the UI.
- **Simple reconciliation on sync**: Server data wins for items that exist on both sides (server `updatedAt` is newer). Items only in local storage are pushed to API on next sync when online.
- **`storageDisabled` respected**: All storage reads/writes check the flag via `storageService` (it already returns null/no-op when disabled).

## Verification
1. Run existing tests: `npm test` — ensure all pass
2. Manual test: Load app, create todos, disconnect network, verify todos persist and new ones queue
3. Manual test: Reconnect network, verify sync happens
4. Manual test: Click "Disable Storage" in settings, verify storage is wiped and `storageDisabled` flag prevents future writes
5. Verify `config.storageDisabled = true` makes all storage operations no-ops
