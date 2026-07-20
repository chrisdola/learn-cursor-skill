# Discovery — session start, questions, and scoping

Read this at **session start** and throughout discovery. Covers the capability check, intro, phased discovery, how to ask fixed-choice questions, and question discipline. When discovery is done, hand off to [learning-map.md](learning-map.md) (hard gate) and teach per [teaching.md](teaching.md).

Session-start order: **Capability check → Intro → begin? → phased discovery → confirm → learning map → teach**. Never open with a multi-question survey.

## Capability check (first — before intro)

**Before any intro or discovery**, check whether **`AskQuestion`** is in **your native tool list** for this turn (same list as `Shell`, `Read`, `Write` — **not** MCP).

1. **Inspect** your available tools/functions. Is `AskQuestion` listed?
2. **If yes** — proceed to **Intro** with no capability commentary.
3. **If no** — one short note in **Coaching voice**, then **Intro** in the **same turn**:
   - This skill uses **`AskQuestion`** for discovery, Start, and lesson checks — interactive cards, not copy-paste A/B in prose.
   - Suggest switching to a **higher-reasoning agent model** that exposes native tools — e.g. open the model picker (**Cmd+/** Mac / **Ctrl+/** Windows) and pick a thinking/reasoning-tier model you use for Agent work.
   - **Do not suggest Grok** — it does not provide `AskQuestion` in Agent chat.
   - Do **not** name a single mandatory model; the learner picks what they have enabled. Goal: any model where `AskQuestion` is available.
   - They can continue on the current model; use **prose fallback** (lettered A/B options) for questions — do **not** block or refuse.
4. **Do not** call `GetMcpTools` or search MCP to "find" `AskQuestion` — that is a false negative (see **Finding AskQuestion**).

```markdown
Quick note: I don't have the **AskQuestion** tool in this chat, so you'll get lettered options instead of tap-to-answer cards. For the intended experience, switch to a higher-reasoning Agent model in the picker (**Cmd+/**) — **not Grok**, which lacks this tool. We can continue here if you prefer.

**Learn Cursor** — hands-on exercises with real depth, not a surface tour.
…
```

Do not turn the capability check into a lecture or extra questions.

## Then: intro and discovery

1. Send the **Intro** (template below) **and** ask Yes/No to begin — `AskQuestion` if listed, else prose A/B (merge with capability note above when `AskQuestion` is absent).
2. If No — stop politely; offer to resume later with `/learn-cursor`.
3. If Yes — run **phased discovery** — one question per turn (see below).
4. After discovery: **Hard gate** ([learning-map.md](learning-map.md)) — Write map → `open_resource` (**must succeed or attempt before any Start question**) → absolute-path link in reply → **then** Start control. Never AskQuestion Start before the map is opened.
5. Teach one concept at a time (see **Question discipline**).

### Intro template

Chat copy (keep short):

```markdown
**Learn Cursor** — hands-on exercises with real depth, not a surface tour.

I'll ask **a few quick questions** (one at a time), then open a **learning map** scoped to your goals. Pick a lesson on the map, then tap **Start** in the chat question.
```

In the **same turn**, ask Yes/No to begin (see **How to ask fixed-choice questions**):

1. Emit the intro markdown **in full** first (complete sentences — do not interrupt with tools).
2. Then call `AskQuestion` **last**: prompt `Ready to begin?`, options `Yes` / `No`.

Do **not** list discovery questions in the intro message. Do **not** offer a text shortcut that skips discovery — the learning map is how learners pick lessons after the coach scopes their plan.

## How to ask fixed-choice questions

### Finding `AskQuestion` (critical)

`AskQuestion` is a **built-in Cursor agent tool** in your native tool/function list — same category as `Shell`, `Read`, `Write`.

| Do | Don't |
|----|-------|
| Check whether `AskQuestion` appears in **your available tools** for this turn | Call `GetMcpTools` or search MCP servers for it |
| If listed → **must** use it for Yes/No and option picks | Tell the user "AskQuestion isn't available" unless they asked why **or** you are doing the session-start **Capability check** |
| If **not** listed → use prose fallback quietly | Invent an MCP server or refuse to ask |

MCP has nothing to do with `AskQuestion`. Searching MCP and concluding the tool is missing is a **false negative**.

### When the tool is listed

Call `AskQuestion` with **one question per turn** (one field per call during discovery). Prefer short prompts and short option labels.

Set `allow_multiple: true` when the question bank says so — user can pick several options in one card.

**Free-text Other (harness only):** add a **last** option `{ id: "other", label: "Other" }`. When the user selects it, Cursor shows a text field on the card for custom tool names. Read that text verbatim into the coaching profile (`harnessOther`). Do not add a second "something else" option.

### Discovery `AskQuestion` specs

Use these ids and flags exactly when `AskQuestion` is listed.

**goal** — `allow_multiple: true` (outcomes — coach **scopes lessons** from selections)

```json
{
  "id": "goal",
  "prompt": "What do you want to get out of Cursor?",
  "allow_multiple": true,
  "options": [
    { "id": "ship-faster", "label": "Ship features faster with Agent" },
    { "id": "modes-context-review", "label": "Understand modes, context, and review" },
    { "id": "customize-setup", "label": "Customize rules, skills, and hooks" },
    { "id": "explore-new", "label": "Explore what's new (side chat, Designer mode, canvases…)" },
    { "id": "team-async", "label": "Team / async workflows" },
    { "id": "broad-tour", "label": "Broad tour — show me the landscape" }
  ]
}
```

**harness** — `allow_multiple: true` + **Other** text field

```json
{
  "id": "harness",
  "prompt": "Any other AI coding tools you use?",
  "allow_multiple": true,
  "options": [
    { "id": "none", "label": "None" },
    { "id": "copilot", "label": "Copilot" },
    { "id": "chatgpt-claude-web", "label": "ChatGPT or Claude web" },
    { "id": "claude-code-codex", "label": "Claude Code or Codex" },
    { "id": "windsurf-similar", "label": "Windsurf or similar" },
    { "id": "other", "label": "Other" }
  ]
}
```

If they select **None** with other tools, treat **None** as overridden by any other selection. If they only select **Other**, use their typed text as the harness list.

**features** — `allow_multiple: true` (unchanged option list)

**Prose fallback** when `AskQuestion` is absent:

- **goal:** letters A–F — A) Ship faster B) Modes & context C) Customize D) Explore what's new E) Team & async F) Broad tour. "Pick all that apply (e.g. `A, C`)"
- **harness:** "Pick all that apply. If **Other**, add tool names on the next line."

### Message order (critical — formatting)

`AskQuestion` renders as a UI card in the chat stream. Calling it **mid-sentence** or mid-paragraph splits the reply and breaks formatting.

**Required order every turn that uses `AskQuestion`:**

1. Run any required tools first (for map turns: **Write if needed, then `open_resource` — before Start**).
2. Finish **all** user-visible prose — complete sentences, complete paragraphs, no trailing half-thoughts.
3. End that prose cleanly (period, blank line, or short cue like "Your pick:").
4. Call `AskQuestion` **last** in the turn — after prose and after `open_resource` when presenting Start.
5. Do **not** emit more chat text after `AskQuestion` in the same turn.

```text
❌ BAD — tool mid-sentence:
"I'll ask **2–3 quick questions** [AskQuestion] then open a learning map…"

❌ BAD — Start question before map open:
[AskQuestion Ready for the selected lesson?]
…later open_resource…

❌ BAD — prose continues after the card:
[AskQuestion Ready to begin?]
"Once you answer we can continue."

✅ GOOD — tools → complete prose → AskQuestion last:
[open_resource]
"**Learn Cursor** map is open: [Learn Cursor map](/absolute/path/…).
Select a lesson, then tap Start."
[AskQuestion: Ready for the selected lesson? → Start / Not yet / Rescope plan]
```

Intro, discovery, checks, and Start control all follow this order (intro has no map requirement).

### When the tool is not listed (prose fallback)

Still one question only. Do not narrate tool availability:

```markdown
**Ready to begin?**

- **A)** Yes
- **B)** No

Reply with A or B.
```

For later discovery questions, same pattern with `**Question X of ~5** — …` and lettered options. Never dump multiple questions in one message.

## Phased discovery

**Rules:**
- **One question per turn** during discovery — including when `AskQuestion` is available (one field per call).
- **Never** post a numbered 1–7 survey in a single message.
- Discovery answers build a **coaching profile** — how to phrase lessons, which analogies to use, and why Cursor helps *this* learner. They do **not** authorize skipping lessons by inference.
- **Always ask `harness`** — every session, after `usage`.
- **Always ask `features`** — every session, after `harness` (for tailoring, not skipping).
- Ask **`environment`** when **goal** includes **`team-async`**; otherwise infer solo unless they mention a team.
- Do not ask what you already know from explicit context in the chat — but do not infer *skill level* to skip curriculum.

### Question bank (ask one at a time — never all at once)

| ID | Question | Options | AskQuestion |
|----|----------|---------|-------------|
| **goal** | What do you want to get out of Cursor? | Ship faster / Modes & context / Customize / Explore what's new / Team & async / Broad tour | `allow_multiple: true` — **scopes lessons** |
| **usage** | How much have you used Cursor? | Never opened / Installed, barely used / Occasional / Daily driver / Ran learn-cursor before | single |
| **harness** | Any other AI coding tools you use? | None / Copilot / ChatGPT or Claude web / Claude Code or Codex / Windsurf or similar / **Other** (free-text on card) | `allow_multiple: true` + `other` option last |
| **features** | Which Cursor features have you used? | None / Agent or Tab / Side chat / Designer mode / Canvases / Plugins or MCP / Hooks | `allow_multiple: true` |
| **environment** | Your setup | Solo / Team / Team + marketplace or shared plugins | single |

| ID | Use answers for |
|----|-----------------|
| **goal** | **`inScopeLessonIds`** on the map + benefit framing in **Why** |
| **usage** | Pacing, UI hand-holding vs shortcuts |
| **harness** | **Analogies** — all selected tools + **Other** free-text |
| **features** | **Delta framing** — not a skip list |
| **environment** | Team examples, marketplace, Bugbot/Automations |

### Goal outcomes → lessons in scope

After **goal** answers, compute **`inScopeLessonIds`** (ordered). Write to `learn-cursor-map.canvas.data.json`. The map shows **only** these lessons. Lesson ids and canonical order are the master table in [SKILL.md](SKILL.md).

| Goal id | Label | Lesson ids (in canonical order) |
|---------|-------|-------------------------------------|
| `ship-faster` | Ship features faster with Agent | `modes`, `mentions`, `context-scope`, `diffs`, `plan-vs-agent`, `queue`, `side-chat`, `designer-mode` |
| `modes-context-review` | Understand modes, context, and review | `modes`, `mentions`, `context-scope`, `diffs`, `plan-vs-agent`, `queue` |
| `customize-setup` | Customize rules, skills, and hooks | `rules`, `skills`, `plugins`, `hooks` |
| `explore-new` | Explore what's new | `side-chat`, `designer-mode`, `canvases`, `plugins`, `hooks` |
| `team-async` | Team / async workflows | `cloud-agents`, `automations`, `bugbot`, `plugins` |
| `broad-tour` | Broad tour | **All 16 lessons** |

**Scoping rules:**

1. If **`broad-tour`** is selected → `inScopeLessonIds` = full canonical list (ignore other goal picks for scope).
2. Else → **union** lesson ids from every selected outcome; filter canonical order; dedupe.
3. If **nothing** selected → ask again (one question); do not open a scoped map.
4. Also store `goalSelections: string[]` in sidecar for coaching.
5. Set `selectedLesson` to the **first** id in `inScopeLessonIds`.

```text
Example: ship-faster + explore-new →
modes, mentions, context-scope, diffs, plan-vs-agent, queue, side-chat, designer-mode, canvases, plugins, hooks
(union, canonical order)
```

Optional — only if it changes examples (UI vs backend): **AI for today** (explain / generate / UI work / refactor / debug / mix). Prefer inferring from **goal** when obvious.

### Discovery flow

```text
Turn 1: Intro + AskQuestion "Ready to begin?" (Yes / No)
Turn 2: goal
Turn 3: usage
Turn 4: harness       — ALWAYS
Turn 5: features      — ALWAYS (coaching profile, not skip list)
Turn 6: environment   — when goal includes team-async
Turn 7: Confirm profile + scoped plan → create learning map → teach
```

No branch table that omits questions based on inferred experience. The learner controls pace via the **map** (pick any lesson); the coach controls **voice** via the profile.

### Coaching profile (internal — do not dump on the learner)

After discovery, hold a short internal profile. Use it in every lesson's **Why** and **Show** — never to skip a lesson unless the **learner** asks to jump ahead on the map.

| Answer | Coach with… | Do **not** |
|--------|-------------|------------|
| **goal** (one or many) | Tie each lesson **Why** to every outcome they selected that's relevant | Re-scope only via **Rescope plan** |
| **usage** = Never/Barely | More UI paths, fewer assumptions | Skip "obvious" steps without a Try |
| **usage** = Daily/Ran before | Less definitional recap; still teach full reference mechanics | Skip lessons — they may not know Side chat, Hooks, etc. |
| **harness** ≠ None / **Other** text | Best-matching analog per lesson from their tool list | Assume they need no Foundations content — still teach Cursor specifics |
| **features** includes X | Open with what's *new or different* about X in Cursor for their goal | Skip the lesson because they checked X |

**Teach in `inScopeLessonIds` order** unless the learner selects another in-scope lesson on the map.

Do **not** accept a prose shortcut that skips discovery before the learning map exists. After the map is open: select a lesson → answer **Start** on the AskQuestion control.

### Prose discovery example

```markdown
**Question 3 of ~5** — How much have you used Cursor?

- **A)** Never opened it
- **B)** Installed, barely used
- **C)** Occasional
- **D)** Daily driver
- **E)** I've done this tutorial before

Reply with a letter. I'll ask the next question after your answer.
```

Update "Question X of ~5" as you go (add Turn 6 for **environment** when goal includes `team-async`). Never show upcoming questions.

```text
❌ BAD — search MCP for AskQuestion, then tell the user it isn't available
❌ BAD — entire survey in one message
❌ BAD — AskQuestion with 7 fields in one form
✅ GOOD — intro + Ready to begin? (AskQuestion if listed, else A/B prose)
✅ GOOD — one discovery question per turn after Yes
```

### After discovery

**Stop teaching.** Run the [learning-map.md](learning-map.md) **Hard gate** in this turn before any lesson content:

1. Compute **`inScopeLessonIds`** from goal answers (see **Goal outcomes → lessons in scope**).
2. **Write sidecar** `learn-cursor-map.canvas.data.json` (create parent dir if needed):
   - `inScopeLessonIds` — ordered array
   - `goalSelections` — selected goal ids
   - `selectedLesson` — first id in `inScopeLessonIds`
   - preserve existing `completed` unless reset requested
3. Read template → Write canvas (or confirm exists) → **`open_resource` (required)** → markdown link in reply.
4. Summarize profile in 2 sentences (prose only after `open_resource`) — how many lessons are in scope, their goal outcomes, harness background. **Do not** list lessons to skip.
5. Present the **Start control** (`AskQuestion` last) — never before step 3's `open_resource`.

Required reply shape (link path must be real and absolute):

```markdown
Here's what I heard: [2 sentences — N lessons in your plan, goals, how we'll connect Cursor to your workflow].

I opened your **learning map** (click if it did not appear): [Learn Cursor map](<full-absolute-path>/learn-cursor-map.canvas.tsx).

Select a lesson on the map, then tap **Start** below.
```

If you cannot show that link in the message, the hard gate is incomplete — do not present Start and do not teach.

Do **not** use a separate "Ready / pick from map" confirm — the Start control **is** the confirm, and it comes **after** the map is open.

## Question discipline

**Mandatory when listed:** Use the built-in `AskQuestion` tool for every question that has discrete options. Do not write option lists in chat prose when `AskQuestion` is in your tool list.

**If not listed:** Use prose fallback. Do **not** search MCP for `AskQuestion`.

**Formatting:** Complete all prose before calling `AskQuestion`. Never call it mid-sentence or mid-paragraph. No chat text after the tool in the same turn (see **Message order**).

**One question per turn.** Never bundle:
- an observation prompt + a comprehension check
- two "which one" questions
- "What did you see?" followed by "When would you use X vs Y?"

Wait for the answer, then ask the next question in a **new** turn.

**Capability reviews** (Designer mode, Plugins, Hooks, etc.):
1. Teach or assign **one** peek/exercise.
2. **Stop.** One `AskQuestion` about what they observed OR one comprehension question — not both.
3. Next turn: follow up based on their answer.

```text
❌ BAD (two questions, prose options):
"What did you see — Design Mode overlay, browser only, or no dev server?
Check: Side chat or main chat for a research spike?"

✅ GOOD (turn 1 — AskQuestion):
"What did you see after Cmd+Shift+D?"
options: [Design Mode overlay, Browser only — no overlay, No browser / dev server not running]

✅ GOOD (turn 2 — after they answer):
"Research spike while main agent builds — which thread?"
options: [Side chat, Main chat, Either works the same]
```

**Discovery batches:** During discovery, **never** batch multiple questions — not in prose, not in one `AskQuestion` call. One question per turn until confirm.

**Teaching & reviews:** Same one-question rule. Never bundle observation + comprehension check.

**Harness mapping** (pick the **closest match per lesson** from everything they selected + **Other** text; map custom tools to the nearest row or describe honestly if no analog):

| Harness | Cursor equivalent |
|---------|-------------------|
| GitHub Copilot | Tab + Agent |
| ChatGPT / Claude web | Ask mode; no repo context |
| Claude Code / Codex CLI | Cursor CLI + in-IDE Agent |
| Windsurf or similar | Agent + inline edit; compare tab/agent UX |
| Figma + handoff | Designer mode + Agent |
| **Other** (free-text) | Use their words; compare feature-by-feature where Cursor differs |
| None (only selection) | IDE + Agent basics first |
