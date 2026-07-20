#!/usr/bin/env node

import { install } from "@funstack/skill-installer";
import path from "node:path";
import { fileURLToPath } from "node:url";

// This file is compiled to `dist/bin/skill-installer.mjs`, so the bundled
// skill lives two levels up at `<package-root>/skill/learn-cursor`. Resolving
// relative to the compiled file (not process.cwd()) makes `npx` work no matter
// where the user runs it from.
const here = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(here, "../../skill/learn-cursor");

console.log("Installing the learn-cursor skill from:", skillDir);

// Interactive (TTY): prompts to pick an agent (Cursor -> ./.cursor/skills).
// Non-interactive: set SKILL_INSTALL_PATH, e.g. SKILL_INSTALL_PATH=./.cursor/skills
await install(skillDir);
