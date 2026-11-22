# C41: `pair --remote` when the client and TS channels differ

TypeScript: `xccode pair --remote` turns remote access on and then reads the route from the service config
of its own build channel, so it always finds the route it just wrote.

Rust: `xccode-native pair --remote` turns remote access on by running the TS `xccode service set remote true`
(`xccode_service::delegate::enable_remote`). The TS binary writes the route into its own build channel's
config. The Rust client then reads the config of its own channel (`XCCODE_CHANNEL`, else `latest`). When the
two channels differ, that config has no route, and the command polls until it fails after 3 minutes:

```
Timed out waiting for the remote tunnel; run `xccode pair --remote` again to retry.
```

With a release `xccode` and the default channel, both read and write `service.json`, and the command works.
To use a TS build of another channel, set `XCCODE_CHANNEL` to that channel (for example
`XCCODE_CHANNEL=oc-opentui-next`).

Reason: the route belongs to the TS binary's config, and the Rust client has no reliable way to learn which
channel a TS binary was built for, and this difference is accepted. No P-CLI case covers it,
since the cases run both clients on the same channel.
