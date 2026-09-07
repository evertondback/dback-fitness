# DBACK Fitness Canonical Architecture

## Objective
One production application, one app shell, one state model, one API contract per domain, and one verified deployment path.

## Canonical layers
- **App:** unified shell, routing, responsive layout.
- **Domain:** users, profiles, exercises, workouts, sets, metrics, equipment, videos.
- **Engine:** planning, readiness, progression, substitutions, recovery.
- **Workout:** warm-up, main training, mobility/flexibility, timers, tracking, video.
- **API:** auth, users, plans, workouts, metrics, media.
- **Data:** migrations and repositories. UI state is never the source of truth.

## Compatibility policy
Historical `vXX-*` modules are compatibility layers only. New behavior belongs in the canonical app/domain/engine layers. Each compatibility module must ultimately be classified **Keep / Merge / Replace / Retire**.

## Feature flags
`src/operating-contract.js` controls migration boundaries. Legacy compatibility stays enabled until equivalent native behavior is proven by behavioral tests.

## Evidence rule
A user-visible completion is valid only when an authoritative record exists: workout session/set record, exact production build, or other domain evidence.
