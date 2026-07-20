#!/usr/bin/env node

import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { fileURLToPath } from "node:url";

const SKILL_NAME = "learn-cursor";

// This file is compiled to `dist/bin/skill-installer.mjs`, so the bundled skill
// and package.json live two levels up. Resolve relative to the compiled file
// (not process.cwd()) so `npx` works from anywhere.
const here = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.resolve(here, "..", "..", "skill", SKILL_NAME);
const PKG_VERSION: string = JSON.parse(
  fs.readFileSync(path.resolve(here, "..", "..", "package.json"), "utf8"),
).version;

type Scope = "user" | "project";

interface Options {
  scope: Scope | null;
  force: boolean;
  dryRun: boolean;
  help: boolean;
  version: boolean;
}

function parseArgs(argv: string[]): Options {
  const opts: Options = {
    scope: null,
    force: false,
    dryRun: false,
    help: false,
    version: false,
  };
  for (const arg of argv) {
    switch (arg) {
      case "-h":
      case "--help":
        opts.help = true;
        break;
      case "-v":
      case "--version":
        opts.version = true;
        break;
      case "-f":
      case "--force":
        opts.force = true;
        break;
      case "--dry-run":
        opts.dryRun = true;
        break;
      case "--user":
      case "--global":
      case "-g":
        opts.scope = "user";
        break;
      case "--project":
      case "--local":
        opts.scope = "project";
        break;
      default:
        throw new Error(`Unknown option: ${arg} (see --help)`);
    }
  }
  return opts;
}

function printHelp(): void {
  console.log(`
learn-cursor-skill v${PKG_VERSION}

Installs the "${SKILL_NAME}" skill into a Cursor skills directory.

Usage:
  npx learn-cursor-skill [options]

Scope (where to install):
  --user, --global, -g   Install for your user account (~/.cursor/skills),
                         available in every project.
  --project, --local     Install into the current project (./.cursor/skills).

Other options:
  -f, --force            Overwrite an existing "${SKILL_NAME}" skill.
  --dry-run              Show what would happen without writing files.
  -v, --version         Print version.
  -h, --help            Show this help.

If no scope is given and the terminal is interactive, you'll be prompted.
In a non-interactive shell, pass --user or --project (or set
LEARN_CURSOR_SCOPE=user|project).

Examples:
  npx learn-cursor-skill --user        # ~/.cursor/skills/${SKILL_NAME}
  npx learn-cursor-skill --project     # ./.cursor/skills/${SKILL_NAME}
  npx learn-cursor-skill --project -f  # reinstall / update in this project
`);
}

function skillsDirForScope(scope: Scope): string {
  return scope === "user"
    ? path.join(os.homedir(), ".cursor", "skills")
    : path.resolve(process.cwd(), ".cursor", "skills");
}

async function promptScope(): Promise<Scope> {
  const projectDir = skillsDirForScope("project");
  const userDir = skillsDirForScope("user");
  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    console.log(`\nWhere should the "${SKILL_NAME}" skill be installed?\n`);
    console.log(`  1. This project   (${projectDir})`);
    console.log(`  2. Your user account (${userDir})\n`);
    while (true) {
      const answer = (await rl.question("Enter 1 or 2: ")).trim();
      if (answer === "1" || answer.toLowerCase() === "project") return "project";
      if (answer === "2" || answer.toLowerCase() === "user") return "user";
      console.log("Please enter 1 or 2.");
    }
  } finally {
    rl.close();
  }
}

function resolveEnvScope(): Scope | null {
  const raw = process.env.LEARN_CURSOR_SCOPE?.trim().toLowerCase();
  if (!raw) return null;
  if (raw === "user" || raw === "global") return "user";
  if (raw === "project" || raw === "local") return "project";
  throw new Error(
    `Invalid LEARN_CURSOR_SCOPE="${process.env.LEARN_CURSOR_SCOPE}" (use "user" or "project").`,
  );
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) return printHelp();
  if (opts.version) {
    console.log(PKG_VERSION);
    return;
  }

  if (!fs.existsSync(SOURCE_DIR)) {
    throw new Error(`Bundled skill not found at ${SOURCE_DIR}`);
  }

  let scope = opts.scope ?? resolveEnvScope();
  if (!scope) {
    if (stdin.isTTY) {
      scope = await promptScope();
    } else {
      throw new Error(
        "No install scope given and the shell is non-interactive.\n\n" +
          "Pass a scope explicitly:\n" +
          "  npx learn-cursor-skill --user      # ~/.cursor/skills\n" +
          "  npx learn-cursor-skill --project   # ./.cursor/skills\n" +
          "Or set LEARN_CURSOR_SCOPE=user|project.",
      );
    }
  }

  const target = path.join(skillsDirForScope(scope), SKILL_NAME);
  console.log(`\nInstalling "${SKILL_NAME}" skill → ${target}`);

  if (fs.existsSync(target)) {
    if (!opts.force) {
      throw new Error(
        `A "${SKILL_NAME}" skill already exists at:\n  ${target}\n\n` +
          "Re-run with --force to overwrite it.",
      );
    }
    console.log(`  ${opts.dryRun ? "would overwrite" : "overwriting"} existing skill`);
    if (!opts.dryRun) await fsp.rm(target, { recursive: true, force: true });
  }

  if (opts.dryRun) {
    const entries = await fsp.readdir(SOURCE_DIR);
    for (const entry of entries) console.log(`  would copy: ${entry}`);
    console.log("\nDry run complete — no files written.");
    return;
  }

  await fsp.mkdir(path.dirname(target), { recursive: true });
  await fsp.cp(SOURCE_DIR, target, { recursive: true });

  console.log(
    `\n\u2713 Installed. Open Cursor and ask to "learn Cursor" to start the guided tour.`,
  );
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`\nInstall failed: ${message}`);
  process.exit(1);
});
