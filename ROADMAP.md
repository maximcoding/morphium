# Morphium Roadmap

> A focused plan to move Morphium from promising prototype to credible open-source package.

## Why this roadmap exists

Morphium already has a strong idea: a TypeScript library for formatting, masking, and protecting phone numbers in Node.js applications. The README positions it around privacy, usability, and operational access, with use cases like admin tools, support dashboards, CRMs, onboarding flows, and fraud systems. The repo also already exposes advanced areas like encryption, geolocation-aware masking, anomaly detection, and fraud detection.  
What is missing right now is not ambition — it is **product clarity, packaging polish, and proof of reliability**.

This roadmap is designed to help Morphium become:
- easier to trust
- easier to install
- easier to evaluate
- easier to post on Reddit without overclaiming
- stronger as a portfolio project

---

## Current status

### What looks strong already
- Clear problem space: privacy-aware phone number handling
- Better-than-average product positioning in the README
- A differentiated angle vs generic formatting libraries
- Strong potential use cases in internal tools and compliance-heavy workflows

### What needs work before broader promotion
- Core package boundaries are still blurry
- Advanced features are presented too close to “production-ready”
- Packaging and release flow need tightening
- The install story is not fully confidence-inspiring yet
- The repo needs stronger examples and tests

---

## Release philosophy

The next release should optimize for:

1. **Credibility over breadth**  
   A smaller, trustworthy package is better than a wider package people do not believe.

2. **Stable core over experimental extras**  
   Masking, formatting, and role-based visibility should feel rock solid before AI/fraud/geolocation become headline features.

3. **Proof over promises**  
   Add examples, tests, and a tagged release before pushing harder on promotion.

---

# Phase 1 — Release blockers

## 1. Mark advanced features as experimental

### Goal
Reduce overclaiming and make the repo feel more honest.

### Why this matters
The README currently presents advanced capabilities such as geolocation-aware masking, anomaly signals, and fraud detection alongside the core features. At the same time, the package is still early and the AI-related service loads models from an S3 bucket and uses threshold-based outputs for anomaly/fraud decisions. The README also says the package includes server-only features such as encryption, geolocation, and AI integrations. :contentReference[oaicite:0]{index=0}

### Actions
- Add `Experimental` labels beside:
  - AI-based sensitivity prediction
  - anomaly detection
  - fraud detection
  - geolocation-aware masking
- Add a short note in the README:
  - “Core masking and formatting are the stable focus of the package.”
  - “AI, geolocation, and fraud-related features are experimental and may change.”
- Split README features into:
  - **Stable core**
  - **Experimental extensions**
- Add the same disclaimer to inline code comments and docs

### Done when
- A new reader can tell within 10 seconds which features are safe to adopt today
- Reddit feedback will focus on the core API, not whether the advanced claims are too ambitious

---

## 2. Fix packaging and npm entrypoint

### Goal
Make installation actually feel publishable.

### Why this matters
The README says `npm install morphium`, but it also notes that the package entrypoint is not finalized yet. In `package.json`, `main` points to `dist/morphium.ts`, which is not a normal compiled JS package entrypoint. :contentReference[oaicite:1]{index=1}

### Actions
- Update `main` to compiled JavaScript output, for example:
  - `dist/index.js`
- Add `exports` field
- Confirm `types` points to emitted declaration files
- Ensure build output matches published package structure
- Add `files` array so only required build assets are published
- Add `prepublishOnly` script to validate build before publish
- Verify package works with:
  - CommonJS import
  - ESM import
  - TypeScript import
- Run a local smoke test using `npm pack`

### Done when
- A consumer can install the package and import it without path hacks
- The README no longer needs the “entrypoint is being finalized” warning

---

## 3. Fix branch / CI alignment

### Goal
Make CI feel dependable and current.

### Why this matters
The default branch is currently `master`. The release flow should align with the actual default branch and make it obvious that every push and PR is validated. :contentReference[oaicite:2]{index=2}

### Actions
- Align GitHub Actions triggers with the active default branch
- Decide whether to keep `master` or rename to `main`
- Ensure CI runs on:
  - push
  - pull_request
- Add a status badge in README
- Make CI run:
  - install
  - typecheck
  - build
  - tests
- Add branch protection once CI is green

### Done when
- Every contributor can see whether the package currently builds and passes tests
- The repo no longer feels like a draft

---

## 4. Tighten crypto positioning

### Goal
Avoid giving a misleading sense of production-grade security.

### Why this matters
The encryption service currently creates the AES key and IV using `crypto.randomBytes(...)` directly in the service instance. That is okay for a prototype, but it should not be presented like a finalized secure storage design. :contentReference[oaicite:3]{index=3}

### Actions
- Mark current encryption support as prototype-level
- Move key management out of the service and into explicit configuration
- Document what Morphium does vs does not handle
- Add examples that show:
  - caller-provided secret management
  - separation between masking and encryption concerns
- Avoid language that implies full security architecture coverage

### Done when
- The package is honest about its security scope
- Security-minded readers do not immediately distrust the rest of the repo

---

# Phase 2 — Make the core library believable

## 5. Narrow the core product surface

### Goal
Make the first stable release feel focused.

### Recommended stable core
- mask phone numbers
- preserve formatting
- region-aware formatting
- configurable reveal rules
- role-based visibility
- composable masking options

### Move out of the stable core
- AI predictions
- anomaly detection
- fraud detection
- geolocation-aware rules
- anything depending on remote models or external services

### Actions
- Create a “Core API” section in README
- Explicitly define “out of scope for v1”
- Reframe Morphium as:
  - “A phone-number masking and formatting library with privacy-first defaults”
  - not “an all-in-one AI/fraud/privacy platform”

### Done when
- The package value proposition fits in one sentence
- The stable API feels smaller and stronger

---

## 6. Add a concrete real-world example

### Goal
Help people instantly understand where this belongs.

### Why this matters
The README mentions admin tools and support dashboards, which is the right direction. Now it needs one concrete example that feels real and usable. :contentReference[oaicite:4]{index=4}

### Add one end-to-end example
Create a section called:

## Example: Customer Support Admin Dashboard

Show:
- support agent opens customer record
- phone number displays masked by default
- admin sees last 4 digits only
- supervisor can reveal more digits
- formatting remains readable
- raw value is never casually shown in the UI

### Deliverables
- one code example in README
- one screenshot or terminal example
- one example app folder or snippet under `/examples`
- one “before / after masking” table

### Done when
- A Reddit reader can immediately say “I know where I would use this”

---

## 7. Add tests around the real value

### Goal
Prove the core logic works.

### Why this matters
The repo already includes Jest config and a test script, but what matters now is demonstrating confidence around the package’s core masking behavior. :contentReference[oaicite:5]{index=5}

### Highest-priority tests
- reveals last N digits correctly
- preserves formatting when enabled
- strips formatting when disabled
- handles empty / invalid / partial input safely
- region formatting works for expected cases
- role-based visibility changes output correctly
- masking is deterministic for the same config
- custom mask characters behave correctly

### Nice-to-have tests
- snapshot tests for multiple formatting styles
- edge cases for country code handling
- configuration validation failures
- regression tests for previously reported bugs

### Done when
- The core package has a test suite that maps directly to the README promises

---

# Phase 3 — Polish for public distribution

## 8. Publish a small tagged release

### Goal
Create a believable first public milestone.

### Actions
- Pick a version like `v0.1.0`
- Keep release scope intentionally small
- Publish only once:
  - build works
  - tests pass
  - install works
  - README examples are verified
- Add release notes with:
  - stable core features
  - experimental features disclaimer
  - known limitations

### Suggested first release message
“Initial public release focused on phone-number masking, formatting, and privacy-oriented visibility controls. Advanced AI/geolocation capabilities remain experimental.”

### Done when
- The repo has a release someone can actually evaluate
- You can post it without apologizing for the basics

---

## 9. Improve README structure

### Goal
Make the repo easier to scan and trust.

### Recommended README structure
1. What Morphium is
2. Why it exists
3. Stable core features
4. Experimental features
5. Installation
6. Quick start
7. Real-world example
8. API overview
9. Security notes
10. Roadmap
11. Contributing

### Specific edits
- tighten the opening sentence
- reduce “big promise” language
- add status badges
- add package maturity note
- add compatibility note:
  - Node version
  - module support
- add “who this is for / not for”

### Done when
- A developer can decide in under a minute whether Morphium is relevant

---

## 10. Add contribution and maintenance signals

### Goal
Make the repo feel maintained, not abandoned.

### Actions
- add `CONTRIBUTING.md`
- add issue templates
- add pull request template
- add labels for:
  - bug
  - enhancement
  - documentation
  - good first issue
- add `SECURITY.md`
- add changelog discipline for each release

### Done when
- External contributors know how to engage
- The project looks maintained even at small scale

---

# Recommended backlog

## Product / API
- split stable core into its own package if needed
- explore plugin-style extensions for experimental features
- simplify options API
- add better type-level constraints for masking config

## Documentation
- migration notes for future breaking changes
- FAQ
- comparison with `libphonenumber-js`
- cookbook examples:
  - CRM
  - support dashboard
  - internal admin console

## Quality
- coverage reporting
- linting / formatting checks
- type-only CI step
- performance checks for batch masking

## Community
- create first three good issues
- invite feedback specifically on API design
- publish one demo post only after release + example + tests are ready

---

# Definition of “ready to promote on Reddit”

Morphium is ready for a broader Reddit post when all of the below are true:

- package installs cleanly
- README quick start works as written
- stable vs experimental is clearly labeled
- one real-world example exists
- core masking behavior is covered by tests
- CI is green and visible
- at least one tagged release exists

Until then, position it as:
- “Looking for feedback”
- not “new production-ready library”

---

# Immediate next 10 tasks

1. Add `Experimental` labels to AI, fraud, and geolocation sections
2. Fix `package.json` entrypoint and publishable build output
3. Align CI with the active default branch
4. Add build + test + typecheck to CI
5. Write one support-dashboard example
6. Add core masking tests
7. Add role-based visibility tests
8. Add formatting-preservation tests
9. Cut `v0.1.0`
10. Update README to reflect stable vs experimental scope

---

# Suggested milestone sequence

## Milestone A — Trust the install
- fix package entrypoint
- fix build output
- verify `npm pack`
- remove entrypoint warning from README

## Milestone B — Trust the core
- add tests for masking / formatting / visibility
- simplify public API
- reduce claims around advanced features

## Milestone C — Trust the story
- add admin dashboard example
- improve README structure
- clarify positioning

## Milestone D — Trust the project
- green CI
- tagged release
- contribution docs
- first feedback post

---

# One-line positioning after cleanup

**Morphium is a TypeScript library for masking and formatting phone numbers with privacy-first defaults for internal tools and operational workflows.**
