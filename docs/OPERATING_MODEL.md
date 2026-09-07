# DBACK Fitness Operating Model

## User modes
1. **User:** Today-first workout flow: start, movement, video, instructions, timer, weight/reps, complete, next.
2. **Advanced:** plan, metrics, history, substitutions, equipment.
3. **Admin:** users, exercise/video library management, configuration, diagnostics.

## Canonical statuses
`NOT_STARTED → READY → IN_PROGRESS → WAITING/BLOCKED → READY_TO_VERIFY → VERIFIED → CLOSED` with `CANCELLED` as an explicit terminal state.

## Source-of-truth rules
- GitHub: source code.
- Cloudflare: production runtime.
- D1: fitness user/workout/metric state.
- Media library/R2: owned or managed media.
- Google/Procore/EVA remain external domain owners/orchestrator as documented in `src/operating-contract.js`.

## Testing hierarchy
Unit → API contract → integration → UI component → end-to-end user journey → exact-production smoke test.
Feature tests must verify behavior, not hard-code release numbers. Release metadata is tested separately.

## Release path
Development/PR validation → staging-equivalent browser validation → promote exact tested artifact → production version attestation and smoke test. Until a distinct staging deployment exists, production promotion must remain version-attested and reversible.
