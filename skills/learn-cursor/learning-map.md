# Learning map — hard gate, canvas, and the Start control

The interactive canvas is the **map + progress board**; the chat is the **tutor**. They do not auto-sync. Run the **Hard gate** below after discovery ([discovery.md](discovery.md)) and before any lesson, then drive lessons with the **Start control**. Lesson ids/titles are the master table in [SKILL.md](SKILL.md); teach per [teaching.md](teaching.md).

## Hard gate (non-negotiable)

After discovery answers are in, you **must** materialize and open the learning map **in the same turn** as the summary — **before** any first lesson.

Narrating "setting up the map" or jumping into teaching **without** the tool sequence below is a skill failure.

**Required tool sequence (same turn, in order):**

1. **Read** this skill's [learning-map.canvas.tsx](learning-map.canvas.tsx) (full file).
2. **Write** that content with the Write tool to:
   `/Users/<user>/.cursor/projects/<workspace>/canvases/learn-cursor-map.canvas.tsx`
   - Do **not** only paste `.tsx` into a chat code block.
   - If the file already exists and is current, you may skip rewrite — but you still must do steps 3–5.
3. **Open it for the user** with MCP `cursor-app-control` → `open_resource`:
   - First call `GetMcpTools` for server `cursor-app-control` / tool `open_resource` if you have not already this session.
   - Then `CallMcpTool`: server `cursor-app-control`, toolName `open_resource`, arguments:
     `{ "uri": "file:///Users/<user>/.cursor/projects/<workspace>/canvases/learn-cursor-map.canvas.tsx" }`
   - Use a real `file://` URI (three slashes + absolute path). Encode spaces if any.
   - If `open_resource` is missing or fails: continue anyway — do **not** stop the hard gate.
4. In the **user-visible reply**, include a markdown link with the **full absolute path** (always — even when open_resource succeeded):
   `[Learn Cursor map](/Users/<user>/.cursor/projects/<workspace>/canvases/learn-cursor-map.canvas.tsx)`
5. One short line: the map should be open (or click the link if not); select a lesson, then use **Start** below.
6. Present the **Start control** (`AskQuestion` last) — **only after** step 3 `open_resource` has returned.

**You may not present the Start `AskQuestion` until steps 1–4 have run** (Write or confirm-exists + **`open_resource` attempted** + link text in the reply).

**Resolve `<workspace>`:** use paths already in this session (terminals, recently viewed files, workspace root). Typical form: `Users-<name>-Documents-<repo>` under `~/.cursor/projects/`. If unsure, list `~/.cursor/projects/` and pick the folder matching the open workspace — do not guess a wrong canvases path.

**If the file already exists:** still run `open_resource` + include the link. Do not wipe progress / rewrite unless the template is outdated or the user asks to reset.

```text
❌ BAD: Summarize plan and start teaching with no Write, no open_resource, no link
❌ BAD: "Setting up your learning map…" with zero tool calls
❌ BAD: Dump .tsx in a fenced code block instead of Write
❌ BAD: open_resource only — no markdown link in the reply
❌ BAD: Markdown link only — skip open_resource when cursor-app-control is available
❌ BAD: AskQuestion Start before open_resource in this turn
✅ GOOD: Read template → Write → open_resource → absolute-path link in reply → Start control
```

### Create / refresh checklist

Target file:

```text
/Users/<user>/.cursor/projects/<workspace>/canvases/learn-cursor-map.canvas.tsx
```

| Step | Action |
|------|--------|
| 1 | Read skill `learning-map.canvas.tsx` |
| 2 | Write to canvases path (or confirm exists) |
| 3 | `CallMcpTool` `cursor-app-control` / `open_resource` with `file://…` URI |
| 4 | Absolute-path markdown link in chat (mandatory) |
| 5 | Start control (`AskQuestion`: Start / Not yet / Rescope plan) |

### Canvas capabilities (what the learner can do)

| Action | How |
|--------|-----|
| Rescope plan | AskQuestion **Rescope plan** in chat — coach re-asks goal outcomes and rewrites `inScopeLessonIds` |
| Expand to full catalog | **Show full catalog** on map (all 16 lessons; does not change coach profile) |
| Select a lesson | Click row in **Your plan** list |
| Mark complete / incomplete | Button on detail panel (persists in `.canvas.data.json`) |
| Start lesson | Click lesson on map → answer AskQuestion **Start** (reads `selectedLesson` from sidecar; re-opens map; never `newComposerChat`) |
| Reset | **Reset all progress** |

### Agent duties with the map

- After finishing a lesson check question successfully, ask **one** question: mark that lesson complete on the map? (yes → remind them to click Mark complete).
- Prefer the Mark complete button for progress; live state is in the sidecar, not the source defaults.
- Never claim the map auto-advanced the curriculum.
- Never claim the map is ready unless you ran `open_resource` (or attempted it) **and** the absolute-path link is in the message you just sent.
- **Never** use or recommend canvas `newComposerChat` for lessons.
- On every **Start**, call `open_resource` again so the map stays visible.
- On lesson complete, update `learn-cursor-map.canvas.data.json` `completed`, re-open the map, and present the Start control again.
- Do not ask the learner to type `go` or copy long prompts — use the Start `AskQuestion`.

### Quick test path

User says "open the learning map" → Hard gate → present Start control → on Start, read sidecar and teach.

## Lesson-start handoff (Start control)

Lessons continue in the **existing** Learn Cursor conversation. Never open a new chat. Never use canvas `newComposerChat`.

**Learner flow:** select a lesson on the map → answer the chat **Start** control (`AskQuestion`).

### Present the Start control

**Prerequisite:** the learning map must already be opened in this turn (or the immediately prior tool block) via `open_resource`. Never call the Start `AskQuestion` before `open_resource` has been invoked.

Order for a "map is ready / pick a lesson" turn:

1. Write / confirm canvas file exists
2. `CallMcpTool` → `open_resource` (wait for tool result)
3. User-visible prose + absolute-path markdown link
4. `AskQuestion` Start control **last**

After the map is open (hard gate), and again whenever waiting for the next lesson, finish all prose then call `AskQuestion` **last**:

- Prompt: `Ready for the selected lesson?`
- Options:
  - `Start` — begin the lesson currently selected on the map
  - `Not yet` — wait; learner will change selection or come back
  - `Rescope plan` — re-ask goal outcomes and rebuild lesson scope

If `AskQuestion` is not listed, prose fallback:

```markdown
**Ready for the selected lesson?**

- **A)** Start
- **B)** Not yet
- **C)** Rescope plan
```

Do **not** ask them to type `go` or paste long prompts.

```text
❌ BAD: AskQuestion Start, then open_resource later (or never)
❌ BAD: Prose "select a lesson then Start" with AskQuestion but no open_resource this turn
✅ GOOD: open_resource → prose + link → AskQuestion Start
```

### When they choose Start

1. **Read** the map sidecar:
   `/Users/<user>/.cursor/projects/<workspace>/canvases/learn-cursor-map.canvas.data.json`
2. Resolve `selectedLesson` (string id) and optional `inScopeLessonIds`. If missing, ask **one** question which lesson — do not invent. If they used **Show full catalog**, teach any selected lesson even if outside the original scope.
3. Map id → lesson using the master table in [SKILL.md](SKILL.md); load [reference.md](reference.md) for that topic.
4. Do **not** re-run discovery or intro Yes/No.
5. Re-open the map: `open_resource` + absolute-path markdown link (Write canvas only if missing).
6. Begin the teaching loop for that lesson immediately (see [teaching.md](teaching.md)).

**When they choose Not yet:** acknowledge; remind them to select a lesson on the map; call `open_resource` again if the map may have closed; then present the Start control again.

**When they choose Rescope plan** (or legacy **Different track**): re-ask **goal** outcomes (one `AskQuestion`, `allow_multiple`); recompute `inScopeLessonIds`; Write sidecar; **`open_resource` first**; present Start control again.

**After a lesson check succeeds:** update sidecar `completed` — Read JSON → `completed[<id>] = true` → Write JSON → **`open_resource` (required before next Start question)** → present the Start control again.

Also accept legacy triggers `go` / `next` / `start` as aliases for **Start** (same sidecar read path).
