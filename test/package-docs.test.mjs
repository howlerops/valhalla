import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import { readFile } from "node:fs/promises"
import { promisify } from "node:util"

const root = new URL("..", import.meta.url)
const read = (file) => readFile(new URL(file, root), "utf8")
const pkg = JSON.parse(await read("package.json"))
const readme = await read("README.md")
const guide = await read("docs/guide/installation.md")
const page = await read("docs/index.html")
const execFileAsync = promisify(execFile)

assert.deepEqual(pkg.pi.prompts, ["./pi/prompts"])
assert.deepEqual(pkg.pi.skills, ["./pi/skills"])
assert.equal(pkg.pi.extensions, undefined)
assert.equal(pkg.engines.node, ">=22.19.0")
assert.ok(pkg.keywords.includes("pi-package"))
assert.ok(!JSON.stringify(pkg).toLowerCase().includes("bifrost"))
assert.ok(!JSON.stringify(pkg).toLowerCase().includes("heimdall"))

for (const name of ["hugin", "tyr", "munin", "eitri", "vidar", "skuld", "polaris"]) {
  const prompt = await read(`pi/prompts/${name}.md`)
  assert.match(prompt, /^---\n/)
  assert.match(prompt, /\$ARGUMENTS/)
}

const skill = await read("pi/skills/vegvisir/SKILL.md")
assert.match(skill, /^---\nname: vegvisir/m)
assert.match(skill, /disable-model-invocation: true/)
assert.match(skill, /charts and resolves decisions; it never implements product work/)

for (const document of [readme, guide, page]) {
  assert.match(document, /pi install/)
  assert.doesNotMatch(document, /\/bifrost/)
  assert.match(document, /OpenCode/)
}

const { stdout } = await execFileAsync(process.execPath, [process.env.npm_execpath, "pack", "--json", "--dry-run"], { cwd: new URL("..", import.meta.url).pathname })
const packedFiles = JSON.parse(stdout)[0].files.map((file) => file.path)
assert.ok(!packedFiles.some((file) => /bifrost|heimdall/i.test(file)))
assert.ok(packedFiles.includes("src/index.mjs"))
assert.ok(packedFiles.includes("scripts/install-opencode.mjs"))
for (const name of ["eitri", "hugin", "munin", "polaris", "skuld", "tyr", "vidar"]) {
  assert.ok(packedFiles.includes(`pi/prompts/${name}.md`))
  assert.ok(packedFiles.includes(`src/${name}.mjs`))
}
assert.ok(packedFiles.includes("src/vegvisir.mjs"))
assert.ok(packedFiles.includes("pi/skills/vegvisir/SKILL.md"))

console.log("package and documentation tests passed")
