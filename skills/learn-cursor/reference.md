# Cursor product reference

Pull one section per map lesson. Teach **mechanics first** (where to click, shortcut, file path), then concept — **cover the full section** across multiple chat beats, not a single overview paragraph.

When you introduce a feature, **always share** that section's **Docs (share with learner)** links in chat. Prefer official `cursor.com/docs` URLs; use changelog only when there is no dedicated docs page yet.

## Designer mode (Design Mode)

Visual UI editing inside the **browser in the Agents Window**. Point at the running app instead of describing elements in text.

### Prerequisites

- App running locally (dev server)
- Agents Window browser open to the local URL

### Open & toggle

- Open browser from Agents Window
- Toggle Design Mode: **Cmd+Shift+D** (same to exit)

### Targeting methods (teach one per lesson)

| Method | Action | Agent gets |
|--------|--------|------------|
| **Click element** | Click in Design Mode | XPath/component, attributes, computed styles, fiber props, screenshot |
| **Multi-select** | Click multiple elements | Same for each + visual relationships between them |
| **Draw region** | Shift+drag to box an area | Annotated region on frozen viewport frame |
| **Voice** | Mic in Design Mode overlay | Transcript; mic stays on while agent runs (queue next edit) |

### Inject into chat

| Action | Shortcut |
|--------|----------|
| Add element to chat | Cmd+L |
| Add element to input | Option+click |

### Workflow pattern

1. Toggle Design Mode → click/draw/select target(s)
2. Describe change (type or voice)
3. Send while agent works; queue more targets
4. Hot reload shows result in browser

### When to use vs plain Agent

- **Design Mode**: "this button", "this spacing", visual/layout tweaks on running UI
- **Agent without browser**: backend, refactors, files with no running preview

### Pairing note

Fast iteration pairs well with capable Agent models — slow models turn queued Design Mode edits into a backlog. At session start the coach checks for native **`AskQuestion`** (see SKILL.md **Capability check**).

**Docs (share with learner):**
- [Design Mode](https://cursor.com/docs/agent/design-mode)
- [Browser (agent tool)](https://cursor.com/docs/agent/browser)

---

## Canvases

Live React artifacts beside chat — `.canvas.tsx` files the IDE compiles and opens next to the conversation.

### Learning map (learn-cursor)

`learn-cursor-map.canvas.tsx` is the skill's progress board:

- Tracks + lessons via Select + TodoList
- `useCanvasState` for completed lessons (persists in `.canvas.data.json`)
- Select lesson on map → answer AskQuestion **Start** in the same chat (tutor reads `selectedLesson` from `.canvas.data.json`, re-opens map; never `newComposerChat`)
- On complete, agent updates `completed` in the sidecar, re-opens the map, presents Start again
- Does **not** auto-advance the tutor — chat still teaches

Template in the skill: `learning-map.canvas.tsx`. Copy into the workspace canvases dir when starting a session.

### What they are

- Standalone **visual deliverables**: tables, charts, timelines, architecture reviews, MCP query results
- **Not** for: code fixes, draft messages, work inside an existing repo file, or building in an external tool (Datadog dashboard ≠ canvas)

### Location (critical)

```
~/.cursor/projects/<workspace>/canvases/<name>.canvas.tsx
```

IDE only detects files in that exact directory (no subfolders). Agent must **write the file** — don't only show code in chat.

### Rules

- One file per canvas; default export; import only from `cursor/canvas`
- Embed data inline — no `fetch()`, no network
- Omit empty sections; never placeholder "TODO" blocks

### User actions

- Open via link/path in chat (click the `.canvas.tsx` path)
- View beside chat while continuing the conversation
- Ask agent to edit the canvas file for iterations

### When to teach

After Side chat or when learner explores data/analysis output. Demo by having agent create a small canvas (e.g. mode comparison table) during the lesson.

Skill detail: `~/.cursor/skills-cursor/canvas/SKILL.md` (agent-internal; summarize for learner, don't dump)

**Docs (share with learner):**
- [Canvases](https://cursor.com/docs/agent/tools/canvas)

---

## Side chat

Parallel agent threads alongside the main conversation — full agent capabilities, separate transcript.

### Create

| Method | How |
|--------|-----|
| Slash | `/side` or `/btw` in main chat |
| UI | **+** button at top of chat panel |

### Behavior

- Inherits **context from main chat** at creation time
- Runs independently — won't derail main thread
- Full agent: read files, terminal, edits (watch for conflicting edits on same files)
- Searchable later via conversation search (Cmd+K in Agents Window)

### When to use

| Side chat | Main chat |
|-----------|-----------|
| "What does this error mean?" while agent implements | Feature implementation |
| Spike / research tangent | Coherent multi-step build |
| Compare two approaches | Single approved plan |

### Exercise pattern

1. Start a task in main chat
2. `/side` — ask a one-off question
3. Return to main; confirm side thread didn't interrupt queue

**Docs (share with learner):**
- [Side chats (3.11 changelog)](https://cursor.com/changelog/side-chat) — official announcement; no dedicated docs page yet
- [Agent overview](https://cursor.com/docs/agent/overview) — parallel work, queue, checkpoints
- [Prompting & @ mentions](https://cursor.com/docs/agent/prompting) — pull side-chat context back via `@Past Chats`

---

## Plugins

Packaged customization bundles on the **Customize** page — not the same as wiring a single MCP server yourself.

### Customize page (unified surface)

**Customize** sidebar manages, at user / team / workspace level:

- Plugins
- Skills
- MCP servers
- Subagents
- Rules
- Commands
- Hooks

Teach Customize as the **home base** for extending Cursor.

### Plugins vs MCP vs skills

| | Plugins | MCP | Skills |
|---|---------|-----|--------|
| **What** | Packaged bundle (often MCP + skills + rules) | One external tool server | Markdown workflow |
| **Install** | Customize → Plugins / Team marketplace | Customize → MCP → Add | `.cursor/skills/` or `/create-skill` |
| **Best for** | Official/team integrations (Linear, Sentry, …) | Custom or BYO server | Repeatable internal workflows |

Learners who say "plugins" may mean MCP — clarify once, then use Cursor vocabulary.

### Install flow (teach concretely)

1. Open **Customize** in sidebar
2. **Plugins** tab → browse or search
3. Install → authenticate if prompted
4. Verify MCP/tools appear in agent tool list
5. Run one task that uses the plugin (e.g. "list my open Linear issues")

Team plans: org marketplace, shared plugin configs.

**Docs (share with learner):**
- [Customize (overview)](https://cursor.com/docs/customize-cursor)
- [Plugins](https://cursor.com/docs/plugins)
- [MCP](https://cursor.com/docs/context/mcp)
- [Skills](https://cursor.com/help/customization/skills)
- [Subagents](https://cursor.com/docs/subagents)
- [Hooks](https://cursor.com/docs/hooks)

---

## Hooks

Scripts or prompt checks that run on **agent lifecycle events**. JSON on stdin/stdout; can allow, deny, rewrite, or inject context.

### Locations

| Scope | Config | Scripts |
|-------|--------|---------|
| Project | `.cursor/hooks.json` | `.cursor/hooks/*` |
| User | `~/.cursor/hooks.json` | `~/.cursor/hooks/*` |

Path style differs: project hooks use `.cursor/hooks/script.sh`; user hooks use `./hooks/script.sh` relative to `~/.cursor/`.

### Common events (teach by use case)

| Goal | Event |
|------|-------|
| Block/approve shell commands | `beforeShellExecution` |
| Audit terminal output | `afterShellExecution` |
| Gate MCP calls | `beforeMCPExecution` |
| Format after agent edits | `afterFileEdit` |
| Block/rewrite tool calls | `preToolUse` |
| Inject context after tool success | `postToolUse` |
| Validate prompts (secrets/policy) | `beforeSubmitPrompt` |
| Observe agent completion | `stop`, `afterAgentResponse`, `afterAgentThought` |
| Control subagents | `subagentStart`, `subagentStop` |

Hooks fire for **local and cloud** agent sessions (including side chats).

### Hook types

- **Command**: script receives JSON stdin, returns JSON stdout; exit 2 = block
- **Prompt**: lightweight policy via `type: "prompt"`

### Minimal example (project)

`.cursor/hooks.json`:

```json
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [{ "command": ".cursor/hooks/format.sh" }]
  }
}
```

### Debug

- Cursor reloads `hooks.json` on save; restart if needed
- **Hooks** tab in settings + **Hooks** output channel

Create workflow: `/create-hook` or follow `~/.cursor/skills-cursor/create-hook/SKILL.md`.

**Docs (share with learner):**
- [Hooks](https://cursor.com/docs/hooks)

---

## Foundations & additional surfaces

Pull one section per lesson. These support **Foundations**, **Agent craft**, **Customize**, **Integrate**, **Scale**, and **CLI & beyond** tracks — not the default **Product depth** curriculum unless discovery or the learner asks.

Teach **mechanics first**, then concept. One **beat** per chat turn; a full lesson spans many turns until the section is covered.

---

### Tab completion

Inline ghost-text suggestions as you type — Copilot-class completion, separate from Agent chat.

#### Mechanics

| Action | How |
|--------|-----|
| Accept suggestion | **Tab** |
| Accept word-by-word | **Cmd+→** (partial accept) |
| Dismiss | **Esc** or keep typing |

- Works in the editor only — no multi-file refactors, no terminal, no repo-wide reasoning
- Complements Agent: Tab for the next line; Agent for the next feature

#### When to use vs Agent

| Tab | Agent |
|-----|-------|
| Boilerplate, imports, obvious next line | Multi-file changes, tests, refactors |
| Stay in flow without context switch | Needs `@` context or tool use |
| Fast, local, low latency | Planning, review, side effects |

#### Exercise pattern

1. Open a file with an obvious pattern (repeated struct fields, similar functions)
2. Type the start of the next line — observe ghost text
3. Tab once; compare to asking Agent for the same line in chat

**Docs (share with learner):**
- [Tab completion](https://cursor.com/docs/tab/overview)

---

### Agent modes (Agent / Ask / Plan / Debug)

Four chat modes in the Agents Window — same conversation history can switch modes between messages.

#### Switch

- Mode picker at top of chat input (or slash — varies by version)
- **Agent** is default for implementation work

#### Decision guide

| Mode | Best for | Edits files? | Tools / terminal? |
|------|----------|--------------|-------------------|
| **Agent** | Build, refactor, fix, run tests | Yes | Yes |
| **Ask** | Understand code, explore safely | No | Read-only |
| **Plan** | Multi-step work — approve approach before edits | After you approve | Plan first, then implement |
| **Debug** | Hard bugs needing runtime evidence | Yes | Yes, with debug-oriented flow |

#### When to teach

- **Foundations** — start with Ask vs Agent (safe read vs edits)
- **Agent craft** — Plan vs Agent for larger tasks
- **Debug** — only when learner hits a real bug; don't front-load

#### Exercise pattern

1. **Ask**: `@file` — "what does this module export?" (no edits)
2. **Agent**: one-line change in a named file
3. **Plan**: "plan only" for a small feature — approve, then let Agent implement

**Docs (share with learner):**
- [Agent modes](https://cursor.com/docs/agent/modes)
- [Plan Mode](https://cursor.com/docs/agent/plan-mode)
- [Debug Mode](https://cursor.com/docs/agent/debug-mode)
- [Agent overview](https://cursor.com/docs/agent/overview)

---

### @ mentions & context scope

Attach scoped context to a message instead of pasting whole files.

#### Common mentions (teach 2–3 per lesson, not all at once)

| Mention | What it adds | When to use |
|---------|--------------|-------------|
| `@file` | One file | Surgical question or edit |
| `@folder` | Directory tree | Module boundary, package context |
| `@codebase` | Semantic search over repo | "Where is X handled?" |
| `@docs` | Indexed documentation | Framework/API lookups |
| `@web` | Live web search | External APIs, recent releases |
| `@rule` | A specific rule file | "Follow this convention" |
| `@skill` | A skill workflow | Repeatable internal process |
| `@git` | Diff / branch context | Review what changed |

Type `@` in the composer → pick from list or search.

#### Context scope tradeoffs (Agent craft)

| Too little | Too much |
|------------|----------|
| Agent guesses wrong file | Noise drowns signal; slower, costlier |
| Fix: add `@file` or `@folder` | Fix: narrow to one folder or file |

**Rule of thumb:** start with `@file`; escalate to `@folder` when the answer spans siblings; `@codebase` when you don't know the path.

#### Exercise pattern

1. Ask mode + `@file` — explain one function
2. Same question with `@folder` — note what extra context appeared
3. One AskQuestion: which they'd pick for a bug in a sibling file

**Docs (share with learner):**
- [@ mentions](https://cursor.com/docs/context/mentions)
- [Prompting agents](https://cursor.com/docs/agent/prompting) — files, folders, docs, git diffs, browser
- [Semantic search](https://cursor.com/docs/agent/tools/search) — how Agent finds code when you skip `@`

---

### Diff review

How you accept or reject Agent edits before they land in the repo.

#### Mechanics

- Agent proposes edits → **diff view** (inline or panel depending on layout)
| Action | Meaning |
|--------|---------|
| Accept hunk / file | Apply that change |
| Reject hunk | Discard that change |
| Accept all | Apply entire proposal (use carefully) |

- Review **before** accepting large multi-file diffs
- Pair with **Ask** first when unsure what changed

#### When to use

| Accept quickly | Pause and review |
|----------------|------------------|
| One-line comment, obvious fix | Auth, payments, migrations |
| Learner asked for exact change | Agent touched files you didn't mention |

#### Exercise pattern

1. Agent: add a comment to a named file
2. Accept one hunk, reject a second (agent adds two comments)
3. Ask: "what would you check before Accept all?"

**Docs (share with learner):**
- [Agent Review](https://cursor.com/docs/agent/agent-review) — dedicated review on local changes
- [Keyboard shortcuts](https://cursor.com/docs/reference/keyboard-shortcuts) — accept/reject all changes (Cmd+Return / Cmd+Backspace)
- [Checkpoints](https://cursor.com/docs/agent/overview#checkpoints) — restore codebase snapshots mid-session

---

### Plan vs Agent

**Plan** mode produces an approach for approval; **Agent** mode implements directly.

#### When to Plan first

| Plan first | Agent directly |
|------------|----------------|
| Multi-file feature, unclear seams | Single-file, obvious change |
| Learner wants to learn the approach | Spike or "just fix it" |
| Team norms require review before edits | Tight loop with Design Mode |

#### Workflow

1. Switch to **Plan** (or ask "plan only" in Agent if learner is on Agent track)
2. Read plan → approve or revise
3. Implement in **Agent** (or approve plan-driven implementation)

#### Exercise pattern

Plan-only for: "add an environment variable read in config and use it in one component" — then one AskQuestion: what would you change in the plan before implementing?

**Docs (share with learner):**
- [Plan Mode](https://cursor.com/docs/agent/plan-mode)
- [Agent modes](https://cursor.com/docs/agent/modes)

---

### Message queue

Send follow-up instructions **while Agent is still running** — messages queue instead of interrupting mid-tool.

#### Mechanics

- Type and send while the agent works → message joins the **queue**
- Agent finishes current step, then processes queued messages in order
- Useful for refinements, not for emergency stop (use stop/cancel for that)

#### When to use

| Queue | Wait |
|-------|------|
| "Also add a test" while agent edits | Agent is about to run a destructive command |
| "Use lodash instead" mid-implementation | You haven't read the diff yet |
| Design Mode: queue next target while agent runs | Switching to a different feature entirely |

#### Exercise pattern

1. Start Agent on a small multi-step task (rename + update imports)
2. While running, queue: "add a one-line doc comment too"
3. Confirm both landed without starting a new chat

**Docs (share with learner):**
- [Queued messages](https://cursor.com/docs/agent/overview#queued-messages) — Enter to queue, Cmd+Enter to send immediately

---

### Rules

Persistent instructions injected into Agent context — project conventions, style, safety.

#### Locations

| Scope | Where | Applies |
|-------|-------|---------|
| **User** | Customize → Rules (user) | All your projects |
| **Project** | `.cursor/rules/` or `AGENTS.md` | This repo only |
| **Team** | Team dashboard | Org-wide (team plans) |

Project rules often use **globs** (`src/**/*.tsx`) so only relevant files trigger them.

#### Rules vs skills

| Rules | Skills |
|-------|--------|
| Always-on or glob-triggered constraints | Invoked workflows (`/skill-name` or agent loads when relevant) |
| "Use semicolons", "never commit secrets" | "How to implement a plan", "how to review a PR" |

#### Exercise pattern

1. Customize → Rules → add one user rule (e.g. "prefer complete sentences in comments")
2. Ask Agent to edit a file — observe whether behavior shifted
3. Optional: add a project rule with a glob for one directory

**Docs (share with learner):**
- [Rules](https://cursor.com/docs/rules)
- [Customizing agents](https://cursor.com/learn/customizing-agents)

---

### Skills

Markdown workflows in `.cursor/skills/<name>/SKILL.md` — teach the agent *how* to do repeatable tasks.

#### Locations

| Scope | Path |
|-------|------|
| Project | `.cursor/skills/` |
| User | `~/.cursor/skills/` |

#### Mechanics

- Agent reads skill when relevant or when user invokes `/skill-name` (if supported)
- Skills can reference other files in the skill folder
- Create via `/create-skill` or hand-author `SKILL.md`

#### vs rules, plugins, hooks

| Skills | Rules | Plugins | Hooks |
|--------|-------|---------|-------|
| Workflow steps for agent | Persistent constraints | Bundled integrations | Lifecycle scripts |

#### Exercise pattern

1. `/create-skill` or inspect an existing skill in `.cursor/skills/`
2. Invoke it for one real task in the learner's repo
3. Ask: when would a rule be better than a skill?

**Docs (share with learner):**
- [Skills](https://cursor.com/help/customization/skills)
- [Customize (overview)](https://cursor.com/docs/customize-cursor)

---

### MCP (standalone)

**Model Context Protocol** — connect external tools (APIs, databases, issue trackers) to the agent.

#### When standalone MCP vs Plugin

| Standalone MCP | Plugin bundle |
|----------------|---------------|
| Custom server, BYO integration | Official/team packaged install |
| Customize → MCP → Add | Customize → Plugins → Install |
| You maintain the server | Vendor maintains bundle |

See **Plugins** section for Customize page context. Teach Plugins first on Product depth; standalone MCP on **Integrate** track.

#### Install flow

1. Customize → **MCP** → Add server (stdio, SSE, or command)
2. Configure `mcp.json` / server entry per docs
3. Restart or reload if tools don't appear
4. Verify: agent tool list shows MCP tools (`GetMcpTools` is agent-internal — learner checks by asking agent to use the tool)

#### Exercise pattern

Add one MCP server the learner cares about (or a minimal stdio example) → one task that requires a tool call ("list issues", "query db").

**Docs (share with learner):**
- [MCP](https://cursor.com/docs/context/mcp)
- [MCP install deeplinks](https://cursor.com/docs/mcp/install-links)
- [Customize (overview)](https://cursor.com/docs/customize-cursor)

---

### Agent browser (non–Design Mode)

Agent drives a browser for **verification and interaction** — distinct from **Design Mode** (visual edit overlay).

#### Design Mode vs agent browser

| Design Mode | Agent browser |
|-------------|---------------|
| You point at elements; visual UI edits | Agent navigates, clicks, types |
| Cmd+Shift+D overlay | Agent tool / integrated browser |
| Best for layout/CSS/component tweaks | Best for "does login work?", E2E checks |

#### Mechanics

- Open integrated browser: **View → Browser** or Command Palette → **Browser: Open**
- Local apps: run dev server → `http://localhost:...` (prefer localhost over `file://` in Cursor)
- Agent can snapshot page, click, fill forms — learner observes in browser panel

#### Exercise pattern

1. Dev server running → open localhost in integrated browser
2. Ask Agent: "click Sign in and tell me what breaks" (or snapshot + describe)
3. Contrast with Design Mode lesson: when they'd pick which

**Docs (share with learner):**
- [Browser (agent tool)](https://cursor.com/docs/agent/browser)
- [Design Mode](https://cursor.com/docs/agent/design-mode)
- [Integrated browser (VS Code)](https://code.visualstudio.com/docs/debugtest/integrated-browser) — opening localhost in-editor

---

### Cloud Agents

Run agent work **in the cloud** — async, longer tasks, sometimes while you're away.

#### vs local Agent

| Cloud | Local |
|-------|-------|
| Background / async jobs | Immediate, full IDE access |
| Good for larger scoped tasks | Good for tight edit-run loop |
| May have different tool/env constraints | Terminal, local browser, Design Mode |

#### When to teach

**Scale** track only, or when learner explicitly asks about background work. One scenario — don't compare every feature.

#### Exercise pattern

Kick off one cloud-eligible task (scoped PR-sized change) → observe where progress appears → one AskQuestion: when would you keep it local instead?

**Docs (share with learner):**
- [Cloud Agents](https://cursor.com/docs/cloud-agent)
- [Agents Window](https://cursor.com/docs/agent/agents-window) — local ↔ cloud handoff

---

### Automations

Scheduled or event-driven **agent runs** outside a manual chat session — team/ops scale.

#### vs Hooks

| Automations | Hooks |
|-------------|-------|
| Product feature for recurring agent jobs | Your scripts on agent lifecycle events |
| "Every Monday, summarize open PRs" | "Before every shell command, audit log" |
| Configure in Automations UI / docs flow | `.cursor/hooks.json` |

#### When to teach

**Scale** track — observation question only unless learner runs automations at work.

#### Exercise pattern

Walk Customize or Automations entry point → identify one job they'd automate vs one they'd handle with a Hook.

**Docs (share with learner):**
- [Automations](https://cursor.com/docs/cloud-agent/automations)
- [Hooks](https://cursor.com/docs/hooks)

---

### Bugbot

Automated **PR / code review** agent — catches issues in pull requests, complementary to local Agent review skills.

#### vs in-IDE review

| Bugbot | Agent + `/review` or review skill |
|--------|-----------------------------------|
| Runs on PRs in GitHub (etc.) | Runs on your machine or branch diff |
| Team CI gate | Ad-hoc before push |
| Async on PR events | Interactive, you steer |

#### When to teach

**Scale** track or teams using GitHub PRs. One scenario: "would Bugbot or a local review catch this first?"

**Docs (share with learner):**
- [Bugbot](https://cursor.com/docs/bugbot)
- [Agent Review](https://cursor.com/docs/agent/agent-review)

---

### CLI & SDK

**Cursor Agent in the terminal** and **programmatic** control for scripts, CI, and headless workflows.

#### CLI

- Install Cursor CLI per official docs
- Run agent prompts from terminal — useful for migrations, batch refactors, CI-adjacent tasks
- Different UX from IDE: no Design Mode, no click-to-element

#### SDK

- `@cursor/sdk` (TypeScript) / Python SDK for spawning agents from your own apps
- Use when building internal tools, bots, or pipeline integrations

#### When to teach

**CLI & beyond** track only — learner said terminal/CI is primary. Map from their old tool once (Claude Code, Codex CLI), then one hands-on CLI task.

#### Exercise pattern

One CLI prompt that touches a file in the repo → compare to doing the same in IDE Agent.

**Docs (share with learner):**
- [CLI](https://cursor.com/docs/cli)
- [Using Agent in CLI](https://cursor.com/docs/cli/using)
- [SDK](https://cursor.com/docs/sdk)

---

## Platform limits (learn-cursor)

Confirmed behaviors worth teaching so learners don't fight the product:

| Approach | Same chat? | Notes |
|----------|------------|-------|
| AskQuestion **Start** + map sidecar | Yes | Current learn-cursor lesson handoff |
| Canvas `newComposerChat` | No | New chat; wrong model risk |
| Prompt deeplink (`cursor://…/prompt`) | No | Prefills **new** chat; user must Send |
| `open_resource` on map | N/A | Opens in editor; doesn't inject into composer |

HTML lesson pages cannot replace same-chat Start — site is appendix only, not docs mirror.

**Docs (share with learner):**
- [Deeplinks](https://cursor.com/docs/reference/deeplinks) — prefills a **new** chat; never auto-executes

---

## Official links (index)

Quick index — each feature section above has the links tutors should share. Prefer section links during lessons; use this list for cheat sheets.

### Agent & chat
- [Agent overview](https://cursor.com/docs/agent/overview) — tools, queue, checkpoints
- [Agent modes](https://cursor.com/docs/agent/modes)
- [Plan Mode](https://cursor.com/docs/agent/plan-mode)
- [Debug Mode](https://cursor.com/docs/agent/debug-mode)
- [Prompting agents](https://cursor.com/docs/agent/prompting)
- [Agent Review](https://cursor.com/docs/agent/agent-review)
- [Agents Window](https://cursor.com/docs/agent/agents-window)
- [Side chats (changelog)](https://cursor.com/changelog/side-chat)

### Visual & artifacts
- [Design Mode](https://cursor.com/docs/agent/design-mode)
- [Browser (agent tool)](https://cursor.com/docs/agent/browser)
- [Canvases](https://cursor.com/docs/agent/tools/canvas)

### Context & search
- [@ mentions](https://cursor.com/docs/context/mentions)
- [Semantic search](https://cursor.com/docs/agent/tools/search)

### Customize & extend
- [Customize (overview)](https://cursor.com/docs/customize-cursor)
- [Plugins](https://cursor.com/docs/plugins)
- [Rules](https://cursor.com/docs/rules)
- [Skills](https://cursor.com/help/customization/skills)
- [Hooks](https://cursor.com/docs/hooks)
- [MCP](https://cursor.com/docs/context/mcp)
- [MCP install deeplinks](https://cursor.com/docs/mcp/install-links)
- [Subagents](https://cursor.com/docs/subagents)
- [Customizing agents](https://cursor.com/learn/customizing-agents)

### Editor
- [Tab completion](https://cursor.com/docs/tab/overview)
- [Keyboard shortcuts](https://cursor.com/docs/reference/keyboard-shortcuts)

### Scale & automation
- [Cloud Agents](https://cursor.com/docs/cloud-agent)
- [Automations](https://cursor.com/docs/cloud-agent/automations)
- [Bugbot](https://cursor.com/docs/bugbot)

### CLI & references
- [CLI](https://cursor.com/docs/cli)
- [Using Agent in CLI](https://cursor.com/docs/cli/using)
- [SDK](https://cursor.com/docs/sdk)
- [Deeplinks](https://cursor.com/docs/reference/deeplinks)
- [Run modes (security)](https://cursor.com/docs/agent/security/run-modes)

### Meta
- [Changelog](https://cursor.com/changelog)
