import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import path from "node:path"

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname)
const pi = path.join(repoRoot, "node_modules", "@earendil-works", "pi-coding-agent", "dist", "cli.js")
const prompts = [
  ["hugin", "Create a Hugin anchor plan"],
  ["tyr", "baro-inspired workflow in Pi"],
  ["munin", "Pi-native autoresearch loop"],
  ["eitri", "Pi-native AutoAgent-style workflow"],
  ["vidar", "Run this task in Vidar mode in Pi"],
  ["skuld", "Run a Skuld review"],
  ["polaris", "Run this task in Polaris mode"],
]

const requests = []
const server = createServer(async (request, response) => {
  let body = ""
  for await (const chunk of request) body += chunk
  requests.push(JSON.parse(body))
  response.writeHead(200, { "content-type": "text/event-stream" })
  response.end('data: {"id":"test","choices":[{"delta":{"content":"ok"},"finish_reason":"stop"}]}' + "\n\ndata: [DONE]\n\n")
})

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
const temp = await mkdtemp(path.join(tmpdir(), "valhalla-pi-test-"))
const project = path.join(temp, "project")

function runPi(args, cwd = project) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [pi, ...args], {
      cwd,
      env: { ...process.env, PI_CODING_AGENT_DIR: temp, PI_TELEMETRY: "0" },
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
  const port = server.address().port
  await mkdir(project, { recursive: true })
  await writeFile(path.join(temp, "models.json"), JSON.stringify({
    providers: {
      test: {
        baseUrl: `http://127.0.0.1:${port}/v1`,
        api: "openai-completions",
        apiKey: "test",
        compat: { supportsDeveloperRole: false, supportsUsageInStreaming: false },
        models: [{ id: "test", contextWindow: 8192, maxTokens: 256 }],
      },
    },
  }))
  await runPi(["install", "-l", repoRoot])

  for (const [name, marker] of prompts) {
    requests.length = 0
    await runPi(["--approve", "--model", "test/test", "--no-tools", "--no-session", "-p", `/${name} sentinel-${name}`])
    assert.equal(requests.length, 1, `${name} should make one Pi provider request`)
    const content = JSON.stringify(requests[0].messages)
    assert.match(content, new RegExp(marker))
    assert.match(content, new RegExp(`sentinel-${name}`))
  }

  requests.length = 0
  await runPi(["--approve", "--model", "test/test", "--no-tools", "--no-session", "-p", "/skill:vegvisir sentinel-vegvisir"])
  assert.equal(requests.length, 1, "vegvisir should make one Pi provider request")
  const content = JSON.stringify(requests[0].messages)
  assert.match(content, /Vegvisir is planning only/)
  assert.match(content, /sentinel-vegvisir/)
} finally {
  await new Promise((resolve) => server.close(resolve))
  await rm(temp, { recursive: true, force: true })
}

console.log("Pi harness tests passed")
