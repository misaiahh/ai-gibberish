# CLAUDE.md

## Always update README.md

When implementing any feature, bug fix, or significant change, always update the "Summary of Changes" section at the bottom of README.md. Describe what changed and why in plain language. Do this before committing.

## API Context

This todo-app will communicate with a separate API service located in the sibling `todo-app-api` directory. The API provides all data operations for the app (CRUD for todos, and potentially user auth in the future). The app should treat the API as its sole data source via HTTP calls — never mock or stub data locally. Check `todo-app-api/CLAUDE.md` for API conventions, base URL patterns, and endpoint documentation.
