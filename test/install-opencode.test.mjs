import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { access, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname)
const temp = await mkdtemp(path.join(tmpdir(), "valhalla-opencode-install-"))
const commands = ["eitri", "hugin", "munin", "polaris", "skuld", "tyr", "vegvisir", "vidar"]

function runInstaller() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(repoRoot, "scripts", "install-opencode.mjs")], {
      cwd: repoRoot,
      env: {
        ...process.env,
        OPENCODE_CONFIG_DIR: temp,
        OPENCODE_CONFIG_PATH: path.join(temp, "opencode.json"),
        OPENCODE_COMMAND_DIR: path.join(temp, "command"),
        OPENCODE_SKILL_DIR: path.join(temp, "skills", "vegvisir"),
      },
      stdio: ["ignore", "pipe", "pipe"],
    })
    let output = ""
    child.stdout.on("data", (chunk) => { output += chunk })
    child.stderr.on("data", (chunk) => { output += chunk })
    child.on("error", reject)
    child.on("close", (code) => code === 0 ? resolve(output) : reject(new Error(output)))
  })
}

try {
  await writeFile(path.join(temp, "package.json"), `${JSON.stringify({ dependencies: {} })}\n`)
  await mkdir(path.join(temp, "command"), { recursive: true })
  await writeFile(path.join(temp, "command", "bifrost.md"), "legacy command\n")
  const output = await runInstaller()
  assert.match(output, /Installed 8 OpenCode agentic commands/)

  const config = JSON.parse(await readFile(path.join(temp, "opencode.json"), "utf8"))
  assert.ok(config.plugin.some((entry) => Array.isArray(entry) && entry[0] === "@howlerops/valhalla"))

  for (const name of commands) {
    const command = await readFile(path.join(temp, "command", `${name}.md`), "utf8")
    assert.match(command, /^---\n/)
    assert.match(command, /\$ARGUMENTS/)
  }
  await assert.rejects(access(path.join(temp, "command", "bifrost.md")))

  const skill = await readFile(path.join(temp, "skills", "vegvisir", "SKILL.md"), "utf8")
  assert.match(skill, /^---\nname: vegvisir/m)
} finally {
  await rm(temp, { recursive: true, force: true })
}

console.log("OpenCode installer tests passed")
