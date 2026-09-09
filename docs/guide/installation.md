# Installation

HowlerOps Valhalla supports OpenCode and Pi. Both runtimes ship Hugin, Tyr, Munin, Eitri, Vidar, Skuld, Polaris, and the Vegvisir planning skill. Bifrost and Heimdall are not included.

## Prerequisite

Install [Pi](https://pi.dev) with Node.js 22.19.0 or newer:

```bash
pi --version
node --version
```

## Install Pi

Install from GitHub:

```bash
pi install git:github.com/howlerops/valhalla
```

Install a local checkout while developing:

```bash
pi install /absolute/path/to/valhalla
```

Use `pi install npm:@howlerops/valhalla` after the package is published to npm.

## Install Prime Agent

Prime Agent (PrimeIntellect) is a fork of pi-mono and reads the same `pi` key in
`package.json`, so this package installs unchanged. Only the CLI name and the
install verb differ:

```bash
prime-agent package install git:github.com/howlerops/valhalla
```

Install a local checkout while developing:

```bash
prime-agent package install /absolute/path/to/valhalla
```

Verify with `prime-agent package list`, then run `prime-agent -p "/hugin Plan a small refactor"`.

Two differences from Pi are worth knowing:

- The config directory is `PRIME_AGENT_CODING_AGENT_DIR` (default `~/.prime/agent`), not `PI_CODING_AGENT_DIR`.
- Prime Agent has no `--approve` flag; it does not need one to load this package.

All seven agents and `/skill:vegvisir` were verified against Prime Agent 0.9.4.

## Install OpenCode

```bash
npm install --prefix "$HOME/.config/opencode" github:howlerops/valhalla
node "$HOME/.config/opencode/node_modules/@howlerops/valhalla/scripts/install-opencode.mjs"
```

Restart OpenCode after installation. The installer is idempotent: it registers the plugin, writes native command files for all seven agents plus `/vegvisir`, and installs the Vegvisir skill for OpenCode.

## Verify

Confirm that Pi has registered the package, then execute a harmless planning request:

```bash
pi list
pi -p "/hugin Plan a small refactor"
```

In an interactive Pi session, type `/` to confirm these templates are available:

```text
/hugin
/tyr
/munin
/eitri
/vidar
/skuld
/polaris
/vegvisir
```

Verify the planning skill in Pi:

```text
/skill:vegvisir Define the destination for a multi-session migration
```

`/vegvisir` plans only. It creates a map of decisions and hands off to specification work; it does not implement the destination.

Verify OpenCode by restarting it and entering:

```text
/vegvisir Define the destination for a multi-session migration
```

The `/vegvisir` command loads and applies the Vegvisir skill that the installer placed in OpenCode's global skills directory.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `pi` is not found | Install Pi from [pi.dev](https://pi.dev), then reopen the shell. |
| The package or commands are missing | Run `pi list`, reinstall with `pi install git:github.com/howlerops/valhalla`, and restart Pi. |
| Project-local resources are not loaded | Review the package and approve the project when Pi prompts for trust. |
| Vegvisir is missing | Reinstall the package, then use `/skill:vegvisir ...` in Pi or `/vegvisir ...` in OpenCode. |
| OpenCode commands are missing | Rerun the OpenCode installer, then restart OpenCode. |

## Remove

```bash
pi remove git:github.com/howlerops/valhalla
```

For local Pi installs, remove the same path passed to `pi install`. For OpenCode, remove the package entry from `~/.config/opencode/opencode.json`, the generated command files under `~/.config/opencode/command/`, and the Vegvisir skill under `~/.config/opencode/skills/vegvisir/`.
