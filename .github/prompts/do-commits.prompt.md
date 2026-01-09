Great! Now let's commit these changes incrementally. Each commit creates a **checkpoint** that I can resume from, so commit early and often.

## Core Philosophy (from 12-Factor Agents)

**Commits are checkpoints** - Each commit persists state so work can be paused, resumed, or forked at any point. Don't batch too many changes together.

**Small, focused units** - Just like agents work best with 3-10 steps max, each commit should address ONE logical change. If you can describe a commit with "and" in the message, it's probably too big.

**Pause for review at natural boundaries** - Commit after completing each logical unit of work, before moving to the next. This enables human review and safer rollbacks.

---

## Commit Message Convention

Use the format: `type(scope): message`

**Types:**

- `feat`: New feature or component
- `fix`: Bug fix
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `build`: Changes to build system or dependencies (package.json, tsconfig, etc.)
- `chore`: Maintenance tasks (lockfile updates, etc.)
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `perf`: Performance improvements
- `style`: Code style changes (formatting, semicolons, etc.)

**Scope Examples:**

- Apps: `main`, `main/api`, `main/ui`, `main/routes`
- Features: `auth`, `workspace`, `collections`, `schema`, `onboarding`
- Libs: `auth`, `utils`
- Tools: `eslint-config`, `tsconfig`, `dep-version-map`
- Config: `deps`, `repo`, `ci`

**Message Guidelines:**

- Use imperative mood ("add" not "added", "migrate" not "migrated")
- Keep under 72 characters
- Be specific but concise
- No period at the end

---

## Incremental Commit Workflow

### Step 1: Assess the current state
```bash
git status --porcelain
```

### Step 2: Group changes by logical unit
Identify the smallest set of related changes that:
- Are self-contained and make sense together
- Don't break the build if applied in isolation
- Can be described in a single commit message without "and"

### Step 3: Stage and commit one group at a time
```bash
git add <files-for-this-commit>
git commit -m "type(scope): message"
```

### Step 4: Repeat until all changes are committed
After each commit, reassess remaining changes. Don't try to plan all commits upfront—adapt as you go.

---

## Grouping Strategy (Priority Order)

1. **Infrastructure first** - Build/config changes that other changes depend on
2. **Feature additions** - New components/files created (one feature per commit)
3. **Refactors/Updates** - Exports, imports, structural changes
4. **Fixes** - Bug fixes, test fixes
5. **Lockfile** - Always separate commit for pnpm-lock.yaml
6. **Documentation** - README, migration docs, comments

---

## Anti-Patterns to Avoid

❌ **Mega-commits** - "refactor everything and add new feature and fix tests"
❌ **Waiting until done** - Batching all work into one final commit
❌ **Mixed concerns** - Combining unrelated changes because they happened at the same time
❌ **Broken intermediate states** - Each commit should leave the repo in a working state

---

## Examples

```
feat(auth): add password validation utility
feat(auth): implement login form component
feat(auth): connect login form to API
refactor(main/api): extract user service from controller
refactor(main/routes): move auth routes to dedicated folder
fix(tests): wrap WorkspaceNavigation in SidebarProvider
build(tsconfig): enable strict mode
chore(deps): update pnpm lockfile
docs: add protected routes implementation guide
```

---

## Remember

The git history is your execution log. Make it tell a clear story of how the codebase evolved, one logical step at a time. Future you (and your teammates) will thank you.
