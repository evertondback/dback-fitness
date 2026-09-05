# DBACK AI Coach

Private ChatGPT workout coach app running on Cloudflare Workers with D1 persistence.

## ChatGPT App

MCP endpoint: `/mcp`

Tools:
- `open_coach`
- `get_today_workout`
- `start_workout`
- `log_set`
- `complete_workout`
- `get_history`
- `get_progress`
- `get_exercise`

The embedded MCP app widget provides workout cards, set logging, prior performance, next-load progression, session controls, and curated professional YouTube instruction links.

## Persistence

Cloudflare D1 database: `dback-fitness-coach` bound as `DB`.

Tables: `workout_sessions`, `set_logs`, `exercise_state`.

## Deploy

```sh
npm install
npm run deploy
```
