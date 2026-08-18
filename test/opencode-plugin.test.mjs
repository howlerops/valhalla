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

console.log("OpenCode plugin tests passed")
