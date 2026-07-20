# learn-cursor-skill

Installer for the **`learn-cursor`** [Cursor](https://cursor.com) skill — an interactive, hands-on guided tour of Cursor. Running the CLI copies the skill into your AI agent's skills directory so the agent can teach you Cursor step by step.

The installer is powered by [`@funstack/skill-installer`](https://github.com/uhyo/funstack-skill-installer), so it works with any supported agent (Cursor, Claude Code, Codex, Copilot, and more) — not just Cursor.

## Install

```bash
npx learn-cursor-skill
```

When run interactively, you'll get a menu to pick your agent. Choose **Cursor** to install into `./.cursor/skills`, then open Cursor and ask the agent to **"learn Cursor"** to start the guided tour.

## Usage

### Interactive (default)

Running `npx learn-cursor-skill` in a terminal shows an agent picker:

```
Select AI Agent (↑↓ to move, Enter to confirm)
❯ 1. Claude Code (./.claude/skills)
  2. Codex (./.codex/skills)
  3. GitHub Copilot (./.github/skills)
  4. Cursor (./.cursor/skills)
  5. Gemini CLI (./.gemini/skills)
  6. Windsurf (./.windsurf/skills)
  7. OpenCode (./.opencode/skills)
  8. Antigravity 2 (./.agents/skills)
  9. Other (custom path)
```

- Arrow keys (↑↓) to move, number keys (1–9) to jump, **Enter** to confirm.
- The listed paths are **relative to your current directory**, so this installs the skill into the current project (e.g. `./.cursor/skills/learn-cursor`).
- Pick **Other** to type a custom destination — e.g. your global Cursor skills directory `~/.cursor/skills`.

### Non-interactive (CI / scripts)

When there's no TTY, set `SKILL_INSTALL_PATH` to the target skills directory:

```bash
# Install into the current project's Cursor skills dir
SKILL_INSTALL_PATH=./.cursor/skills npx learn-cursor-skill

# Install globally for Cursor (all projects)
SKILL_INSTALL_PATH="$HOME/.cursor/skills" npx learn-cursor-skill
```

The skill is copied to `<SKILL_INSTALL_PATH>/learn-cursor`. Without `SKILL_INSTALL_PATH` in a non-interactive shell, the installer exits with an error explaining how to set it.

## What gets installed

The skill is copied to `<skills-dir>/learn-cursor/`:

- `README.md` — what the skill does, how the guided tour works, and the canvas
- `SKILL.md` — the skill definition and teaching flow
- `reference.md` — the reference material the tutor pulls from
- `learning-map.canvas.tsx` — the interactive learning-map canvas

## Uninstall

Delete the installed folder, e.g.:

```bash
rm -rf ./.cursor/skills/learn-cursor      # project install
rm -rf ~/.cursor/skills/learn-cursor      # global install
```

## Development

The CLI is a small TypeScript wrapper around `@funstack/skill-installer`:

- Source: `bin/skill-installer.mts`
- Build: `npm run build` (compiles to `dist/bin/skill-installer.mjs` via `tsc`)
- Type-check: `npm test`

`npm install` runs the build automatically (via the `prepare` script). The published package ships the compiled `dist/` and the `skill/` files.

## License

MIT
