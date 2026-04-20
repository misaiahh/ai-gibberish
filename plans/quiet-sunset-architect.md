# Plan: Fetch User Preferences from API on App Load

## Context
The API provides `/api/preferences` (GET/PATCH). The app must fetch these on load and use them to control API calls and localStorage syncing. This replaces static `config.storageDisabled` with server-driven preferences.

**API Schema:**
- `GET /api/preferences` → `{ clientStorageEnabled, serverStorageEnabled, createdAt, updatedAt }`
- `PATCH /api/preferences` → body `{ clientStorageEnabled?, serverStorageEnabled? }` → returns updated `Preferences`

## Files to Modify

### 1. **NEW** `src/service/preferencesService.js`
- `getPreferences()` → `GET /api/preferences`
- `updatePreferences(partial)` → `PATCH /api/preferences`
- Both throw on non-OK responses

### 2. **MODIFY** `src/config.js`
- Add `serverStorageEnabled: true` (fallback default)

### 3. **MODIFY** `src/factory/todoFactory.js`
- Check `config.serverStorageEnabled` before API calls in `create()`, `delete()`, `toggle()`, `clearCompleted()`, `getAll()`, `syncWithAPI()`
- When false: work fully offline (localStorage only, no API calls)
- When true: use both API + localStorage (current behavior)

### 4. **MODIFY** `src/pages/settings/PageSettings.js`
- Fetch preferences on connect via `preferencesService.getPreferences()`
- Display both `clientStorageEnabled` and `serverStorageEnabled` as toggle switches
- On toggle change: PATCH server, update local config, re-render row
- Keep existing "Disable Storage" button — dispatches `storage:disable` event (AppShell handles it)

### 5. **MODIFY** `src/components/AppShell.js`
- `#disableStorage()` now also PATCHes server to set `clientStorageEnabled: false` before wiping storage
- Add loading state shown while preferences are being fetched

### 6. **MODIFY** `src/main.js`
- Fetch preferences before setting up routes
- Map to config: `config.storageDisabled = !preferences.clientStorageEnabled`, `config.serverStorageEnabled = preferences.serverStorageEnabled`
- If fetch fails, use defaults (both enabled)

## Design Decisions
- **Inverted mapping**: API `clientStorageEnabled: true` → `config.storageDisabled: false`
- **Graceful degradation**: If preferences fetch fails, defaults to everything enabled
- **Settings page owns preference display**: toggles call PATCH directly
- **"Disable Storage" button**: quick action that also PATCHes server

## Verification
1. `npm test` — all tests pass
2. Manual: load app, verify preferences fetched and applied
3. Manual: toggle preferences in settings, verify PATCH and config update
4. Manual: set `serverStorageEnabled: false`, verify no API calls
5. Manual: "Disable Storage" button still works + patches server
