export const meta = {
  name: 'upgrade-deps',
  description: 'Upgrade frontend deps to latest: safe batch + isolated, changelog-researched majors, verified',
  whenToUse: 'When you want to bump all dependencies to their latest versions with isolation and verification.',
  phases: [
    { title: 'Discover', detail: 'pnpm outdated → classify patch/minor vs major, drop pinned deps' },
    { title: 'Baseline', detail: 'confirm typecheck/lint/test/build are green before touching anything' },
    { title: 'Upgrade', detail: 'safe batch in main tree + each major isolated in its own worktree' },
    { title: 'Integrate', detail: 'apply green set, run full mise check, report' },
  ],
}

// ── Config ────────────────────────────────────────────────────────────────
// @types/node is pinned to the Node major (currently 24) — bumping to 25 would
// drift the types ahead of the runtime. Override via args.pinned if needed.
const PINNED = (args && args.pinned) || ['@types/node']
const INCLUDE_MAJORS = !args || args.includeMajors !== false

// Fast attribution gate used per-upgrade. The heavy `mise run check` (e2e,
// storybook, coverage, audit, knip, depcruise, steiger, spell) is the FINAL gate.
const VALIDATE =
  'mise run typecheck && mise run lint:check && mise run test:unit && mise run build'

const RUN_RULES =
  'Use `mise run <task>` and `mise x -- <cmd>` (never bare pnpm/npx). Never `git -C`. ' +
  'Do NOT commit or push — leave changes in the working tree for review.'

// ── Schemas ───────────────────────────────────────────────────────────────
const DEP = {
  type: 'object',
  required: ['name', 'current', 'latest', 'dev'],
  properties: {
    name: { type: 'string' },
    current: { type: 'string' },
    latest: { type: 'string' },
    dev: { type: 'boolean' },
  },
}
const DISCOVERY_SCHEMA = {
  type: 'object',
  required: ['safe', 'majors', 'excluded'],
  properties: {
    safe: { type: 'array', items: DEP },
    majors: { type: 'array', items: DEP },
    excluded: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'reason'],
        properties: { name: { type: 'string' }, reason: { type: 'string' } },
      },
    },
  },
}
const BASELINE_SCHEMA = {
  type: 'object',
  required: ['green', 'preExistingFailures', 'summary'],
  properties: {
    green: { type: 'boolean' },
    preExistingFailures: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string' },
  },
}
const SAFE_SCHEMA = {
  type: 'object',
  required: ['green', 'applied', 'reverted', 'notes'],
  properties: {
    green: { type: 'boolean' },
    applied: { type: 'array', items: { type: 'string' } },
    reverted: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'reason'],
        properties: { name: { type: 'string' }, reason: { type: 'string' } },
      },
    },
    notes: { type: 'string' },
  },
}
const MAJOR_SCHEMA = {
  type: 'object',
  required: ['name', 'version', 'passed', 'breakingChanges', 'dxHighlights', 'fixesApplied', 'blockers'],
  properties: {
    name: { type: 'string' },
    version: { type: 'string' },
    passed: { type: 'boolean' },
    breakingChanges: { type: 'array', items: { type: 'string' } },
    dxHighlights: { type: 'array', items: { type: 'string' } },
    fixesApplied: { type: 'array', items: { type: 'string' } },
    blockers: { type: 'array', items: { type: 'string' } },
  },
}
const INTEGRATE_SCHEMA = {
  type: 'object',
  required: ['finalGreen', 'appliedMajors', 'checkFailures', 'report'],
  properties: {
    finalGreen: { type: 'boolean' },
    appliedMajors: { type: 'array', items: { type: 'string' } },
    checkFailures: { type: 'array', items: { type: 'string' } },
    report: { type: 'string' },
  },
}

// ── 1. Discover ─────────────────────────────────────────────────────────────
phase('Discover')
const pinnedList = JSON.stringify(PINNED)
const discovery = await agent(
  `Find outdated dependencies in this single-package pnpm repo and classify them.

Run \`mise x -- pnpm outdated --format json\`. For each entry compare current vs latest (strip ^/~):
- MAJOR = major version differs.
- safe   = minor or patch bump (major unchanged).
Mark dev=true if dependencyType is devDependencies.

EXCLUDE entirely (put in "excluded" with a reason) any dep whose name is in this pinned list: ${pinnedList} — these track an external constraint and must not move.

Return safe[], majors[] (excluding pinned), and excluded[]. Do not modify any files. ${RUN_RULES}`,
  { phase: 'Discover', schema: DISCOVERY_SCHEMA, label: 'discover-outdated' },
)
log(`Discovered ${discovery.safe.length} safe + ${discovery.majors.length} major bumps (${discovery.excluded.length} pinned/excluded)`)

const majors = INCLUDE_MAJORS ? discovery.majors : []

// ── 2. Baseline ───────────────────────────────────────────────────────────────
phase('Baseline')
const baseline = await agent(
  `Establish the pre-upgrade baseline so regressions can be attributed. Touch NO dependency.

Run: ${VALIDATE}
Report green=true only if all pass. List any pre-existing failures verbatim (short) so later phases can tell new breakage from old. ${RUN_RULES}`,
  { phase: 'Baseline', schema: BASELINE_SCHEMA, label: 'baseline' },
)
if (!baseline.green) {
  log(`⚠ Baseline is RED before any upgrade: ${baseline.preExistingFailures.join('; ')} — later results judged against this.`)
}

// ── 3. Upgrade: safe batch (main tree) ‖ majors (isolated worktrees) ──────────
phase('Upgrade')
const safeNames = discovery.safe.map((d) => d.name)

const safeThunk = () =>
  agent(
    `Apply all SAFE (minor/patch) dependency bumps together in the main working tree, then verify.

Deps to bump to their latest (names): ${JSON.stringify(safeNames)}

Steps:
1. For each, set its package.json range to the latest (preserve the ^ caret style already used).
2. \`mise x -- pnpm install\`.
3. Validate: ${VALIDATE}
4. If validation FAILS: bisect. Identify the offending dep(s) by selectively reverting suspects (re-install + re-validate) until green. Revert only what's necessary; record each reverted dep with the reason. Keep everything that passes.

Baseline pre-existing failures (NOT your regressions, ignore these): ${JSON.stringify(baseline.preExistingFailures)}

Return the final applied[] and reverted[] and whether the tree is green. ${RUN_RULES}`,
    { phase: 'Upgrade', schema: SAFE_SCHEMA, label: 'safe-batch' },
  )

const majorThunk = (dep) => () =>
  agent(
    `You are upgrading ONE major dependency in an isolated git worktree: ${dep.name} ${dep.current} → ${dep.latest} (${dep.dev ? 'devDependency' : 'dependency'}).

RESEARCH FIRST — before changing code, read the changelog / release notes / migration guide for ${dep.name} across the ${dep.current.split('.')[0]}.x → ${dep.latest.split('.')[0]}.x range. Use the context7 MCP tools (resolve-library-id then query-docs) and/or WebSearch+WebFetch (GitHub releases, CHANGELOG.md). Capture:
  • breakingChanges[] — every breaking change and what it means for THIS codebase.
  • dxHighlights[] — new features, ergonomics, perf, or DX wins worth adopting (the user explicitly wants the "good DX stuff" mined, not just breakage).

Then:
1. Bump ONLY ${dep.name} to ${dep.latest} in package.json (keep caret style).
2. \`mise x -- pnpm install\`.
3. Apply any fixes the breaking changes require. For Oxlint or lint-plugin majors, run \`mise run lint\` (autofix) and resolve newly-surfaced rule violations in our code or oxlint.config.ts; record what you changed in fixesApplied[].
4. Validate: ${VALIDATE}
5. passed=true only if validation is green (ignoring these pre-existing baseline failures: ${JSON.stringify(baseline.preExistingFailures)}). If it cannot be made green without large/ambiguous changes, set passed=false and list blockers[].

You are in a throwaway worktree — your file edits will NOT be merged automatically; only your structured verdict is used. So describe fixesApplied[] precisely enough to reproduce in the main tree. ${RUN_RULES}`,
    { phase: 'Upgrade', schema: MAJOR_SCHEMA, isolation: 'worktree', label: `major:${dep.name}` },
  )

const [safe, ...majorResults] = await parallel([
  safeThunk,
  ...majors.map(majorThunk),
])
const majorVerdicts = majorResults.filter(Boolean)
const greenMajors = majorVerdicts.filter((m) => m && m.passed)
log(`Safe batch: ${safe ? safe.applied.length : 0} applied, ${safe ? safe.reverted.length : 0} reverted. Majors green: ${greenMajors.map((m) => m.name).join(', ') || 'none'}`)

// ── 4. Integrate + full verification ──────────────────────────────────────────
phase('Integrate')
const integration = await agent(
  `Finalize the dependency upgrade in the MAIN working tree, then run the full verification suite.

State so far: the safe (minor/patch) batch has already been applied to the main tree by a prior step.
Safe batch result: ${JSON.stringify(safe)}

Now apply these GREEN major upgrades on top, reproducing the fixes each one needed:
${greenMajors.length ? greenMajors.map((m) => `• ${m.name} → ${m.version}\n  fixes to reproduce: ${JSON.stringify(m.fixesApplied)}\n  breaking changes: ${JSON.stringify(m.breakingChanges)}`).join('\n') : '(none passed isolated testing)'}

Majors that FAILED isolated testing — do NOT apply; just note them in the report with their blockers:
${majorVerdicts.filter((m) => !m.passed).map((m) => `• ${m.name}: ${JSON.stringify(m.blockers)}`).join('\n') || '(none)'}

Steps:
1. Edit package.json for each green major, \`mise x -- pnpm install\`, reproduce the listed fixes.
2. Run the FULL gate: \`mise run check\`.
3. Distinguish failures: upgrade-caused vs pre-existing-baseline (${JSON.stringify(baseline.preExistingFailures)}) vs environmental/flaky (e.g. e2e needing a browser/server that's unavailable in this runner). Report each in checkFailures with that label. finalGreen=true only if no upgrade-caused failures remain.

Produce a concise markdown "report" for the user containing: counts upgraded (safe/major), the DX highlights worth knowing from the majors (${JSON.stringify(greenMajors.flatMap((m) => m.dxHighlights))}), anything reverted/skipped and why, and the verification verdict. Note that committing is left to the user (suggest a \`chore(deps)\` commit; do NOT commit yourself). ${RUN_RULES}`,
  { phase: 'Integrate', schema: INTEGRATE_SCHEMA, label: 'integrate-verify' },
)

return {
  excluded: discovery.excluded,
  baseline,
  safe,
  majors: majorVerdicts,
  integration,
}
