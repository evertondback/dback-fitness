# DBACK AI Coach — Production v31

DBACK Fitness is a Cloudflare Workers workout-coach application with a ChatGPT MCP interface, persistent D1 workout tracking, a complete seven-day training plan, progress/history tools, equipment/video libraries, and an interactive realistic anatomy lab.

## Production application

- Worker: `dback-fitness`
- Production entrypoint: `src/worker-production.js`
- Core production orchestration: `src/worker-v10.js`
- Canonical seven-day program: `src/v31-program-core.js`
- Workout tracking API: `src/v31-api.js`
- Workout + Full Plan UI: `src/v31-completion-ui.js`
- Realistic anatomy UI: `src/v30-anatomy-realistic.js`
- D1 binding: `DB`
- R2 media binding: `MEDIA`

### Program contract

The canonical program contains:

- 7 standalone training days
- 60-minute target per day
- 16-movement complete head-to-toe warm-up
- 55 prescribed exercises across the week
- Sets, reps/time, rest, RIR, load type, tempo, category and instructional video for each exercise
- Heavy strength, hypertrophy, unilateral/balance, recovery/mobility, power and conditioning exposures distributed across the week

Read-only program endpoints:

- `GET /api/v31/health`
- `GET /api/v31/program`
- `GET /api/v31/history`
- `GET /api/v31/progress?exercise_id=<id>`

Tracked session endpoints:

- `POST /api/v31/session/start`
- `POST /api/v31/session/log`
- `POST /api/v31/session/complete`

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

The embedded MCP app widget provides workout cards, set logging, prior performance, next-load progression, session controls and curated professional instructional video links.

## Persistence

Cloudflare D1 database: `dback-fitness-coach`.

Authoritative workout tables:

- `workout_sessions`
- `set_logs`
- `exercise_state`

The production v31 API uses the existing schema and does not perform runtime DDL.

## Anatomy Lab

The production anatomy implementation is `v30-anatomy-realistic.js`. It provides one unified anatomy experience with realistic front/back muscular-system artwork, muscle selection, Front / Back / Both views, exercise recommendations, responsive behavior and cleanup of competing legacy anatomy markup.

## Automated validation

Run:

```sh
npm install
npm test
```

The test suite validates:

- all seven program days
- 60-minute daily targets
- exercise ID uniqueness
- video URL presence
- complete warm-up coverage
- production anatomy wiring
- v31 program UI/API wiring
- absence of runtime D1 schema creation
- production build/version/cache behavior

GitHub Actions runs the validation suite on every push to `main` and on pull requests.

## Deploy

```sh
npm install
npm run deploy
```

Production responses disable caching for the app shell and expose `x-dback-build: 31.0.0` for release verification.
