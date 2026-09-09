import assert from "node:assert/strict"
import AgenticCommandsPlugin from "../src/index.mjs"

const commands = ["eitri", "hugin", "munin", "polaris", "skuld", "tyr", "vegvisir", "vidar"]
const hooks = await AgenticCommandsPlugin({}, {})
const config = { command: {} }
await hooks.config(config)

assert.deepEqual(Object.keys(config.command).sort(), commands)
assert.equal(hooks.tool, undefined)

for (const name of commands) {
  const command = config.command[name]
  assert.equal(typeof command.description, "string")
  assert.equal(typeof command.template, "string")
  assert.match(command.template, /\$ARGUMENTS/)

  const output = { parts: [] }
  await hooks["command.execute.before"]({ command: name, arguments: `sentinel-${name}` }, output)
  assert.equal(output.parts.length, 1)
  assert.match(output.parts[0].text, new RegExp(`sentinel-${name}`))
  assert.doesNotMatch(output.parts[0].text, /\$ARGUMENTS/)
}

// Tyr emits a baro delegation command into its prompt. baro exits 2 on any unknown
// flag, so these must stay in step with the baro CLI (verified against baro-ai 0.109.0).
const tyr = config.command.tyr.template
assert.match(tyr, /baro --llm opencode --model /)
assert.doesNotMatch(tyr, /\bbaro .*? -m\b/)
for (const flag of ["--story-llm", "--tier-map", "--openai-endpoint", "--parallel", "--no-memory"]) {
  assert.ok(tyr.includes(flag), `tyr template should reference baro flag ${flag}`)
}
for (const gone of ["--openai-base-url", "--dry-run"]) {
  assert.ok(!tyr.includes(gone), `tyr template must not reference removed baro flag ${gone}`)
}

console.log("OpenCode plugin tests passed")
