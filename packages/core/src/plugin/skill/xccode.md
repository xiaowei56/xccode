# Xccode

Use this guide as the starting point for work involving Xccode itself. It
covers the core concepts needed to configure and customize Xccode, extend it
with plugins, and build integrations with the Xccode SDK, clients, and API.

Full documentation is available at <https://xccode.ai/docs/>. This overview is
only an index of core concepts. Before answering a question about a topic below,
fetch the URL named in that section and use the full page as the source of
truth. Follow links from that page when the question needs more detail. Fetch
<https://xccode.ai/docs/> first when you need to discover the relevant
documentation page.

A machine-readable documentation index is available at
<https://xccode.ai/docs/llms.txt>.

## Version policy

Always answer for Xccode V2 unless the user explicitly asks about V1,
legacy Xccode, or migrating from V1.

Use only <https://xccode.ai/docs/> documentation as the source of truth for V2.
Do not use <https://xccode.ai/docs/>, which documents V1, and do not use
general web search to resolve a V2 documentation question when the V2 docs or
linked pages cover it. The schema served from
<https://xccode.ai/config.json> accepts both V2 fields and deprecated V1
fields. Never recommend a field it marks deprecated. If V2 documentation is
missing or contradictory, state the uncertainty or ask for clarification instead of falling back to V1.

V1 documentation and syntax may be consulted only when the user explicitly
asks about V1 or when needed as migration input. Outputs and recommendations
must still use V2 unless the user specifically requests a V1 result.

## [CLI](https://xccode.ai/docs/cli)

For questions about the terminal interface, command-line invocation, `run`,
`mini`, terminal providers, or other CLI behavior, fetch the
[CLI guide](https://xccode.ai/docs/cli) and the relevant page linked from
that section.

CLI and TUI preferences are separate from Xccode's server and project
configuration. They live in the global `~/.config/xccode/cli.json`, or
`$XDG_CONFIG_HOME/xccode/cli.json` when `XDG_CONFIG_HOME` is set. There is no
project-local CLI configuration. Set `XCCODE_CLI_CONFIG_CONTENT` to merge
inline JSON over the global settings. Most preferences can also be changed from
the TUI by pressing `Ctrl+P` and selecting **Open settings**.

### [Settings](https://xccode.ai/docs/cli/config)

Fetch the full [CLI settings reference](https://xccode.ai/docs/cli/config)
before editing `cli.json`. It documents every terminal-only setting, accepted
values, and examples, including themes, input, sessions, tabs, diffs, alerts,
Mini, keybindings, terminal plugins, and debugging. Do not put these settings
in `xccode.json(c)`.

### [Keybinds](https://xccode.ai/docs/cli/keybinds)

Configure keybindings under `keybinds` in `cli.json`. The leader key is the
`keybinds.leader` entry; leader timing is configured separately under
`leader.timeout`. Bindings can use a string, an array of strings, or an object
when event behavior such as `preventDefault` is required. Disable a binding
with `"none"` or `false`.

Never guess a command ID, default binding, or accepted key syntax. Fetch the
full [keybind reference](https://xccode.ai/docs/cli/keybinds), which lists
the current IDs and defaults, before answering or editing a binding.

## [Xccode configuration](https://xccode.ai/docs/config)

Xccode's server and project configuration uses JSON or JSONC. Include the
published schema so the user's editor can validate fields and provide
autocomplete:

```jsonc
{
  "$schema": "https://xccode.ai/config.json",
}
```

Global configuration lives at `~/.config/xccode/xccode.json(c)` and applies
to every project for that user. Project configuration can live in any directory
as `xccode.json(c)` or `.xccode/xccode.json(c)`, including nested packages
in a monorepo.

During ordinary project discovery, Xccode searches the current Location
directory and every ancestor through the filesystem root, including directories
above the detected project or repository root. It merges direct
`xccode.json(c)` files from the farthest ancestor to the current directory,
then does the same for `.xccode/xccode.json(c)` files. This means every
discovered `.xccode` config overrides every discovered direct config. Global
filesystem configuration has lower precedence than these discovered documents.

Common configuration fields include `model`, `default_agent`, `permissions`,
`agents`, `commands`, `plugins`, `providers`, `mcp`, `skills`, `instructions`,
`references`, `formatter`, and `lsp`.

This configuration is distinct from `cli.json`. Use the
[CLI settings reference](https://xccode.ai/docs/cli/config) for terminal
preferences, especially themes and keybindings.

Config changes apply without a restart. Xccode watches config files and
reloads agents, commands, skills, MCP servers, and plugins after a save. The TUI
does the same for `cli.json`. To force a full reload, use `/reload`. Don't tell
the user to restart Xccode after editing config.

Do not guess field names or shapes. Fetch the V2 configuration guide and its
linked topic guide as the source of truth, and preserve unrelated settings when
editing an existing file. Keep the published `$schema` URL in configuration
examples, but do not fetch it to determine the V2 configuration shape.

See the [full configuration guide](https://xccode.ai/docs/config) for
every field, examples, config locations, and links to dedicated feature guides.

## [MCP servers](https://xccode.ai/docs/mcp-servers)

Configure MCP servers under `mcp.servers`. Prefer the CLI because it preserves
unrelated configuration. Use `--global` when the user asks to set up a service
for themselves without limiting it to the current project; omit it when they
explicitly want project-local configuration.

```sh
xccode mcp add <name> --global --url <remote-url>
xccode mcp list
```

Remote servers use OAuth by default. If `mcp list` reports that a server needs
authentication, tell the user to run `/mcps`, select the server, and sign in.
Do not run `xccode mcp auth` through the shell tool: it starts an interactive
flow whose authorization link can be hidden in background process output.
Use the user-facing MCP interface instead.

Report the server as configured but awaiting sign-in until its connection
status confirms it is connected.

OAuth credentials are stored outside the Xccode configuration. Do not ask for or
store an API key when the server supports OAuth. Use header-based credentials
only when OAuth is unavailable or the user explicitly requires them, and use an
environment substitution such as `{env:MCP_API_KEY}` instead of writing a
secret into configuration.

## [V1 to V2 migration](https://xccode.ai/docs/migrate-v1)

For any request to migrate Xccode configuration, agents, commands, skills,
plugins, integrations, or other behavior from V1 to V2, read the full
[migration guide](https://xccode.ai/docs/migrate-v1) before acting. In
the repository, its source is `services/site/src/docs/content/migrate-v1.mdx`.

V1 config files and `.xccode/` definitions are intended to remain compatible.
The only intentional breaking changes are the server API and plugin API. Native
V2 config uses more ergonomic shapes, but conversion is optional. When the user
requests conversion, inspect the complete configuration, preserve behavior and
unrelated settings, and apply only the relevant migrations from the guide. For
plugin migrations, fetch and follow both the migration guide and the full
[plugins guide](https://xccode.ai/docs/build/plugins). If non-API V1
functionality fails in V2, use the `report` skill to file it as a compatibility
bug.

## [Plugins](https://xccode.ai/docs/build/plugins)

For questions about creating, configuring, loading, publishing, or migrating
plugins, fetch the full [plugins guide](https://xccode.ai/docs/build/plugins)
before answering. Refer to this guide when the user wants to build a plugin. It
covers hooks, transforms, tools, plugin context capabilities, and package
entrypoints. Plugins can also extend the TUI; for those, fetch the
[CLI plugin guide](https://xccode.ai/docs/build/plugins/cli).
For custom methods and events shared with other plugins or clients, fetch the
[RPC guide](https://xccode.ai/docs/build/plugins/rpc).

## [Service](https://xccode.ai/docs/troubleshooting#check-the-background-service)

Xccode uses a client-server architecture. Interfaces such as the TUI connect
to a background Xccode service, which owns sessions, configuration, plugins,
permissions, and tool execution.

Xccode normally discovers or starts the shared background service
automatically. Restart it only if it is stuck or unhealthy, not to apply
configuration changes:

```sh
xccode service restart
```

Check its status after restarting:

```sh
xccode service status
```

## [API](https://xccode.ai/docs/api)

Xccode exposes an HTTP API from its server. The API is described by an
OpenAPI document available from the running server at `/openapi.json`.

In Code Mode, use the built-in `xccode` tool namespace first, called inside
`execute` as `tools.xccode.*`. These tools skip the shell round-trip and
handle discovery and authentication; find its tools with Code Mode's `search`,
for example `search({ namespace: "xccode" })`. For anything they do not cover,
use the `xccode api` command. It uses the same discovery and authentication
flow as the TUI and may start the background service when no compatible healthy
service is available. It accepts either an HTTP method and path or an OpenAPI
operation ID.

Call an endpoint with an HTTP method and path:

```sh
xccode api get /api/info
```

Pass a request body with `--data` or `-d`, and additional headers with
`--header` or `-H`:

```sh
xccode api post /api/example --data '{"key":"value"}'
xccode api get /api/example --header 'X-Example:value'
```

Request bodies default to `Content-Type: application/json`. When Xccode is
connected to an explicit server instead of its managed background service, use
the same configured server and authentication context rather than constructing
an unauthenticated request separately.

See the [full API reference](https://xccode.ai/docs/api) for available
endpoints, parameters, request bodies, and response schemas. The
raw [OpenAPI specification](https://xccode.ai/docs/openapi.json) is also
available for code generation and other tooling.

## [Client](https://xccode.ai/docs/build/client)

For questions about connecting an application to Xccode over the network,
fetch the full [client guide](https://xccode.ai/docs/build/client) before
answering.

`@xccode/client` is the generated TypeScript client for the Xccode HTTP
API. Its methods and types come from the same contract as the API reference.
The default entrypoint exposes Promise-based resource clients and async
iterables for streaming endpoints. The `@xccode/client/effect` entrypoint
exposes typed Effects, Streams, and decoded Xccode schema values. Its
`Service` API can discover, start, stop, and authenticate with the local
background service from a Node application.

## [SDK](https://xccode.ai/docs/build/sdk)

For questions about embedding Xccode directly in an application, fetch the
full [SDK guide](https://xccode.ai/docs/build/sdk) before answering. The SDK
hosts Xccode in the application without opening an HTTP listener.

Use the [Effect SDK guide](https://xccode.ai/docs/build/sdk/effect) for
Effect applications. For Cloudflare Durable Objects, use the
[Cloudflare SDK guide](https://xccode.ai/docs/build/sdk/cloudflare).

## [Troubleshooting](https://xccode.ai/docs/troubleshooting)

Xccode runs a client and a background server. Start by determining whether a
problem belongs to the client, the shared server, or one project.

- Check the service with `xccode service status` and verify the API with
  `xccode api get /api/info`.
- Compare with `xccode --standalone`, which runs the TUI with a private
  server, to isolate shared-service issues.
- Inspect `~/.local/share/xccode/log/xccode.log`. Filter `role=cli` for
  client startup and `role=server` for sessions, providers, plugins,
  permissions, and tools.
- Run one reproduction with `XCCODE_LOG_LEVEL=DEBUG` when normal logs are not
  sufficient.
- Do not delete or edit the database, service registration, or service config
  while diagnosing a problem. Back up persistent data before inspecting it
  with external tools.
- Redact API keys, authorization headers, prompts, file contents, and other
  sensitive data before sharing diagnostics.

See the [full troubleshooting guide](https://xccode.ai/docs/troubleshooting)
for service lifecycle commands, API inspection, log locations, explicit server
connections, issue-reporting details, and local development paths.
