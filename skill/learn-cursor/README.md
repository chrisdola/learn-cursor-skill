# Learn Cursor — skill

An interactive, hands-on skill that teaches you how to use [Cursor](https://cursor.com). Instead of a passive walkthrough, the agent acts as a coach: it discovers your goals, builds a personalized plan, opens a visual **learning map**, and teaches one lesson at a time with real exercises in your own repo.

## What this skill does

- **Coaches, not lectures.** The agent teaches mechanics before concepts and always includes a concrete "Try" step — exact UI paths, keyboard shortcuts, file locations, and official doc links.
- **Scopes to your goals.** A short discovery interview turns your goals into a focused curriculum drawn from 16 possible lessons.
- **Tracks progress visually.** A live canvas shows your plan and lets you pick lessons, mark them complete, rescope, or reset — all persisted between sessions.



### Lessons covered

Agent / Ask / Plan / Debug modes, `@` mentions, diff review, Plan vs Agent, context scope, message queue, side chat, Designer mode, canvases, plugins, hooks, rules, skills, Cloud Agents, Automations, and Bugbot.


## Before You Begin

This skill uses interactive question cards for discovery and lesson selection. For the full tap-to-answer experience, use an Agent model with access to the AskQuestion tool. 

Some models don't have access to the tool. The agent will check before starting and recommend a different model use. 

If no other model is available, the Agent will still work and simply fall back providing the options to the user and have them reply back with their answers via the chat. 


## How to start

Open Cursor and ask the agent to **"learn Cursor"** (or run `/learn-cursor`). 


## How the guided tour works

1. **Discovery** — The agent asks a few quick questions, one at a time (your goals, how much you've used Cursor, other AI tools you use, features you know, and whether you work solo or on a team). Your answers shape both the lesson plan and the coaching voice — they are never used to skip lessons.
2. **Plan + map** — The agent computes your in-scope lessons, writes the learning-map canvas, and opens it beside the chat. You get a two-sentence recap and a link to the map.
3. **Pick a lesson** — Select a lesson on the map, then tap **Start** in the chat.
4. **Teach** — Each lesson runs as one or more beats of **Why → Show → Try → Check**: why it matters for your goal, how it works with paths and shortcuts, a hands-on step in your repo, then a single comprehension check. Richer topics span several turns.
5. **Progress** — After a lesson, you're prompted to mark it complete on the map, then pick the next one.
6. **Wrap up** — At the end you get a recap, a short personal cheat sheet with doc links, and a suggested next lesson.

Lessons continue in the **same** chat thread — the skill never spawns a new chat.

## The learning-map canvas

`learning-map.canvas.tsx` is a live React canvas (see [Cursor canvases](https://cursor.com/docs)) that acts as your map and progress board. It opens beside the chat and, on first open, is copied into your workspace's canvas folder:

```
~/.cursor/projects/<workspace>/canvases/learn-cursor-map.canvas.tsx
```

Progress and selection are stored in a sidecar data file next to it (`learn-cursor-map.canvas.data.json`), so your plan and completed lessons survive across sessions.

From the canvas you can:


| Action                     | How                                                                 |
| -------------------------- | ------------------------------------------------------------------- |
| Select a lesson            | Click a row in **Your plan**, then tap **Start** in chat            |
| Mark complete / incomplete | Button on the lesson detail panel                                   |
| See every lesson           | **Show full catalog** (all 16, beyond your scoped plan)             |
| Rescope your plan          | **Rescope plan** in chat — re-asks your goals and rebuilds the plan |
| Reset                      | **Reset all progress**                                              |


The chat and the canvas don't auto-sync: the **chat teaches**, and the **canvas stores your plan and progress**. The agent re-opens the map each time you start a lesson so it stays visible.

## Files

- `SKILL.md` — the skill definition and full teaching flow
- `reference.md` — feature-by-feature depth and doc links the coach pulls from
- `learning-map.canvas.tsx` — the interactive learning-map / progress canvas

