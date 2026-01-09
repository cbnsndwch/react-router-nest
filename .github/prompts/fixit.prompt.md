# Fix Lint Issues and Test Failures

> **Agent Scope**: This is a focused, single-purpose task following [12-factor-agents](https://github.com/humanlayer/12-factor-agents) principles. Fix one category of issues at a time, commit after each fix, and iterate.

## Context

This monorepo uses:
- **Turbo** for orchestrating builds, linting, and tests across packages
- **ESLint** with TypeScript for linting
- **Vitest** for unit and component testing
- **pnpm** as the package manager

### Key Commands

| Command | Scope | Description |
|---------|-------|-------------|
| `pnpm lint` | Monorepo | Run ESLint across all packages |
| `pnpm test` | Monorepo | Run all tests via Turbo |
| `pnpm build` | Monorepo | Build all packages |
| `pnpm lint:fix` | Monorepo | Auto-fix lint issues where possible |

### Package-Specific Commands (apps/main)

| Command | Description |
|---------|-------------|
| `pnpm --filter @cbnsndwch/struktura-main lint` | Lint main app only |
| `pnpm --filter @cbnsndwch/struktura-main test` | Test main app only |
| `pnpm --filter @cbnsndwch/struktura-main test:unit` | Unit tests only |
| `pnpm --filter @cbnsndwch/struktura-main test:components` | Component tests only |

---

## Step-by-Step Process

### 1. Discover Issues

First, run a full lint check to identify all issues:

```bash
pnpm lint 2>&1
```

Then run tests to find failures:

```bash
pnpm test 2>&1
```

Report findings in a structured format:

```
<issues_found>
  category: "lint"
  count: 5
  breakdown:
    - rule: "@typescript-eslint/no-unused-vars"
      count: 3
      files: ["src/foo.ts", "src/bar.ts"]
    - rule: "import/order"
      count: 2
      files: ["src/baz.ts"]
</issues_found>
```

### 2. Categorize and Prioritize

Group issues by type for atomic fixes:

**Lint Issue Categories (in order of priority):**
1. **Build-breaking**: Type errors, missing imports, syntax errors
2. **Auto-fixable**: Issues that `pnpm lint:fix` can resolve
3. **Manual fixes**: Unused variables, missing types, logic issues
4. **Warnings**: Non-critical style or deprecation warnings

**Test Failure Categories:**
1. **Missing dependencies**: Tests failing due to missing mocks/providers
2. **API changes**: Tests failing due to changed function signatures
3. **Assertion failures**: Actual logic/expectation mismatches
4. **Flaky tests**: Intermittent failures (timing, race conditions)

### 3. Fix One Category at a Time

Follow this cycle for EACH category:

#### A. Attempt Auto-Fix First (for lint)

```bash
pnpm lint:fix
```

#### B. Review Remaining Issues

```bash
pnpm lint 2>&1 | head -100
```

#### C. Apply Manual Fixes

For each issue:
1. Read the affected file
2. Understand the context (3-5 lines before/after)
3. Apply the minimal fix that resolves the issue
4. Verify the fix doesn't break anything else

#### D. Validate

```bash
pnpm build && pnpm lint && pnpm test
```

#### E. Commit the Fix

```bash
git add -A
git commit -m "fix(scope): resolve [issue type] in [file/area]"
```

### 4. Handle Errors and Edge Cases

If a fix introduces new issues:

```
<error_context>
  original_issue: "unused variable 'foo'"
  attempted_fix: "removed variable declaration"
  new_error: "ReferenceError: foo is not defined"
  root_cause: "variable was used in a different scope"
  resolution: "keep variable, add eslint-disable comment with explanation"
</error_context>
```

**Escape hatches (use sparingly):**
- `// eslint-disable-next-line <rule>` - Disable for one line with reason
- `// @ts-expect-error <reason>` - Suppress type error with explanation
- Skip the issue and document for manual review

---

## Compact Error Handling (Factor 9)

When encountering errors:
1. Capture the essential error (type + message + location)
2. Discard full stack traces after understanding the issue
3. Focus on root cause, not symptoms

Example transformation:
```
# Before (verbose)
Error: Cannot find module '@/lib/utils'
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:1048:15)
    at Function.Module._load (node:internal/modules/cjs/loader:901:27)
    ... 20 more lines

# After (compact)
Issue: Missing module alias '@/lib/utils' in src/components/Button.tsx:3
Fix: Update import path or add path alias to tsconfig.json
```

---

## Small, Focused Fixes (Factor 10)

Each commit should address ONE logical issue:

✅ **Good commits:**
- `fix(main): remove unused imports in auth module`
- `fix(tests): add SidebarProvider wrapper to navigation tests`
- `fix(lint): resolve no-unused-vars in workspace components`

❌ **Bad commits:**
- `fix: resolve all lint issues` (too broad)
- `fix: lint and tests and add new feature` (mixed concerns)

---

## Progress Tracking

After each fix cycle, update progress:

```
<fix_progress>
  phase: "lint"
  completed:
    - "@typescript-eslint/no-unused-vars" (3 issues)
  in_progress:
    - "import/order" (2 remaining)
  remaining:
    - Test failures (7 total)
  commits_made: 2
</fix_progress>
```

---

## Completion Criteria

The task is complete when:

1. `pnpm lint` exits with code 0 (no errors)
2. `pnpm test` exits with code 0 (all tests pass)
3. `pnpm build` completes successfully
4. Each fix has been committed with a descriptive message

---

## Resumption Context

If pausing this task, capture:

```markdown
## Fix Session State

**Last successful command**: `pnpm lint` (0 errors)
**Current phase**: Fixing test failures
**Next file to fix**: `apps/main/app/components/__tests__/Sidebar.test.tsx`
**Remaining issues**: 4 test failures in component tests
**Commits made**: 3
```
