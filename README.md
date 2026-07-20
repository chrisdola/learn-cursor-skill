# learn-cursor-skill

Installer for the **`learn-cursor`** [Cursor](https://cursor.com) skill — an interactive, hands-on guided tour of Cursor. Running the CLI copies the skill into a Cursor skills directory so the agent can teach you Cursor step by step.

This skill is Cursor-only, so the installer only writes to a `.cursor/skills` directory — either your **user** account or the current **project**.

## What does it do?

Check out the Skill's [README](./skill/learn-cursor/README.md) for more information on exactly how it works!


## Install

Install the package first, then run the installer:

```bash
npm install learn-cursor-skill
npx learn-cursor-skill
```

When run interactively, you'll be asked whether to install for your user account or this project. After it's installed, open Cursor and ask the agent to **"learn Cursor"** to start the guided tour.

## Usage

### Interactive (default)

Running `npx learn-cursor-skill` in a terminal prompts for the install scope:

```
Where should the "learn-cursor" skill be installed?

  1. This project   (<cwd>/.cursor/skills)
  2. Your user account (~/.cursor/skills)
```

### Choosing a scope directly

Pass the scope as a flag to skip the prompt:

```bash
npx learn-cursor-skill --user      # ~/.cursor/skills/learn-cursor (all projects)
npx learn-cursor-skill --project   # ./.cursor/skills/learn-cursor (this project)
```

| Flag | Aliases | Installs to |
|------|---------|-------------|
| `--user` | `--global`, `-g` | `~/.cursor/skills/learn-cursor` |
| `--project` | `--local` | `./.cursor/skills/learn-cursor` |

Other options:

- `-f, --force` — overwrite an existing `learn-cursor` skill
- `--dry-run` — show what would happen without writing files
- `-v, --version`, `-h, --help`

### Non-interactive (CI / scripts)

When there's no TTY, pass a scope flag or set `LEARN_CURSOR_SCOPE`:

```bash
LEARN_CURSOR_SCOPE=user npx learn-cursor-skill      # ~/.cursor/skills
LEARN_CURSOR_SCOPE=project npx learn-cursor-skill   # ./.cursor/skills
```

Without a scope in a non-interactive shell, the installer exits with an error explaining how to set one.

## What gets installed

The skill is copied to `<.cursor/skills>/learn-cursor/`:

- `README.md` — what the skill does, how the guided tour works, and the canvas
- `SKILL.md` — the orchestrator: flow, rules, and the master lesson table
- `discovery.md`, `learning-map.md`, `teaching.md` — per-phase instructions (progressive disclosure)
- `reference.md` — the reference material the tutor pulls from
- `learning-map.canvas.tsx` — the interactive learning-map canvas

## Uninstall

Delete the installed folder, e.g.:

```bash
rm -rf ./.cursor/skills/learn-cursor      # project install
rm -rf ~/.cursor/skills/learn-cursor      # user install
```

## Development

The CLI is a small, dependency-free TypeScript script:

- Source: `bin/skill-installer.mts`
- Build: `npm run build` (compiles to `dist/bin/skill-installer.mjs` via `tsc`)
- Type-check: `npm test`

`npm install` runs the build automatically (via the `prepare` script). The published package ships the compiled `dist/` and the `skill/` files.

## License

MIT
