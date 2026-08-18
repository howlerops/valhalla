import { addTextOutput, firstTextPart, parseSlash, replaceArguments } from "./shared.mjs"

const DEFAULT_OPTIONS = {
  commandName: "vegvisir",
  agent: "plan",
}

function normalizeOptions(options = {}) {
  return { ...DEFAULT_OPTIONS, ...options }
}

function vegvisirTemplate(options) {
  return `Load the vegvisir skill now by calling the skill tool with name "vegvisir", then follow it end to end. This skill plans only: chart the multi-session effort as a map of decision tickets and hand off to specification work. Do not implement the destination.

Destination:
$ARGUMENTS`
}

export async function VegvisirPlugin(_input, options) {
  const config = normalizeOptions(options)
  const template = vegvisirTemplate(config)
  const commandNames = [config.commandName]

  return {
    config(opencodeConfig) {
      opencodeConfig.command ||= {}
      opencodeConfig.command[config.commandName] = {
        description: "Chart a multi-session, uncertain effort as a map of decisions without implementing it.",
        agent: config.agent,
        template,
      }
    },
    "chat.message": async (_input, output) => {
      const part = firstTextPart(output.parts, commandNames)
      if (!part) return
      const match = parseSlash(part.text, commandNames)
      if (!match) return
      part.text = replaceArguments(template, match[1] || "")
    },
    "command.execute.before": async (input, output) => {
      if (input.command !== config.commandName) return
      addTextOutput(output, replaceArguments(template, input.arguments || ""))
    },
  }
}

export default VegvisirPlugin
