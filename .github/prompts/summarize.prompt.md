# Context Window Summarization Prompt

> **When to use**: Invoke this prompt when your Copilot session reaches approximately 40% of its context window capacity. This helps maintain focus and prevents context degradation.

## Instructions for the Agent

You are being asked to summarize the current session to optimize the context window. Follow these principles from [12-factor-agents](https://github.com/humanlayer/12-factor-agents):

### 1. Own Your Context Window

The context window is your primary interface. Structure and present information in the most token-efficient way possible:

- **Information Density**: Maximize understanding per token
- **Remove Noise**: Strip out resolved errors, superseded decisions, and completed exploratory work
- **Preserve Signal**: Keep critical decisions, current state, and active goals

### 2. Create a Compact State Summary

Generate a structured summary using this format:

```markdown
## Session State Summary

### Current Objective
[One clear sentence describing what we're trying to accomplish]

### Completed Work
- [Bullet list of completed tasks with file paths where relevant]

### Active Context
- **Working Files**: [List of files currently being modified]
- **Key Decisions Made**: [Important architectural or implementation decisions]
- **Current Approach**: [Brief description of the strategy being used]

### Remaining Tasks
1. [Numbered list of what still needs to be done]

### Critical Context to Preserve
- [Any domain-specific knowledge discovered]
- [Important constraints or requirements]
- [Error patterns to avoid / lessons learned]

### Discarded Approaches
- [Brief note of what was tried and didn't work, to avoid repeating]
```

### 3. Compact Errors Intelligently

Per Factor 9 - once an error is resolved:
- Remove the full stack trace from context
- Keep only a brief note: "Resolved: [error type] by [solution]"
- This prevents the LLM from getting distracted by old problems

### 4. Apply Small, Focused Agent Principles

Per Factor 10 - keep the summarized context focused:
- If the session has drifted across multiple concerns, identify the PRIMARY goal
- Suggest breaking remaining work into focused sub-tasks
- Recommend which context can be safely dropped vs. must be retained

### 5. Token Efficiency Guidelines

Transform verbose content into compact representations:

| Instead of... | Use... |
|---------------|--------|
| Full file contents | File path + relevant line ranges |
| Complete error traces | Error type + root cause + fix applied |
| Exploration history | Final decision + brief rationale |
| Repeated tool outputs | Summary of findings |

### 6. Pre-fetch Guidance

Per Factor 13 - identify what context the next phase will need:
- List files that should be read at session resumption
- Note any external resources or documentation referenced
- Capture environment state if relevant (test status, build state)

---

## Output Format

When invoked, produce:

1. **Session State Summary** (using the template above)
2. **Recommended Context Trim** - What can be safely forgotten
3. **Continuation Prompt** - A prompt that could restart this session with minimal context loss

---

## Example Continuation Prompt

```markdown
Continue work on [PROJECT] with this context:

**Objective**: [Clear goal]

**Current State**:
- [Key file] has been modified to [change]
- [Feature] is partially implemented
- Tests are [passing/failing with specific issue]

**Next Steps**:
1. [Immediate next action]
2. [Following action]

**Key Constraints**:
- [Important requirement or limitation]

**Files to Reference**:
- [path/to/file1.ts] - [why it's relevant]
- [path/to/file2.ts] - [why it's relevant]
```

---

## When NOT to Summarize

- If the session is simple and linear, summarization may add overhead
- If you're about to complete the final task, finish first
- If critical debugging context would be lost that cannot be reconstructed

---

*Based on principles from [12-factor-agents](https://github.com/humanlayer/12-factor-agents), particularly Factor 3 (Own Your Context Window), Factor 9 (Compact Errors), Factor 10 (Small Focused Agents), and Factor 13 (Pre-fetch Context).*
