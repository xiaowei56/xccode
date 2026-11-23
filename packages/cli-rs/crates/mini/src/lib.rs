//! Mini owns a footer on the terminal's main screen. The session transcript goes to scrollback above it.

use std::path::PathBuf;
use std::time::Instant;

use xiaochuan_api::client::Client;
use xiaochuan_local::cli_config::Info;
use xiaochuan_store::target::TargetInput;
use xiaochuan_util::error;

pub mod footers;
mod prelude;
pub mod prompt;
pub mod replay;
pub mod scrollback;
pub mod settings;
pub mod shell;
pub mod signals;
pub mod splash;
pub mod stderr;
pub mod stdin;
pub mod subagents;
pub mod theme;
pub mod tools;
pub mod variants;

/// What `xiaochuan mini` runs with (`MiniCommandInput` after the handler resolved it).
pub struct Input {
    pub client: Client,
    /// The logical working directory.
    pub directory: String,
    /// The home directory, shown as `~` in the entry header.
    pub home: PathBuf,
    /// Directories custom themes are read from.
    pub theme_directories: Vec<PathBuf>,
    /// The session to open: `--continue`, `--session`, `--fork`, `--model`, `--agent`.
    pub target: TargetInput,
    /// Piped stdin and `--prompt`, sent as the first prompt.
    pub initial_input: Option<String>,
    /// `--replay`, else `mini.replay`, else true.
    pub replay: bool,
    /// `--replay-limit`, else `mini.replay_limit`.
    pub replay_limit: Option<u32>,
    pub config: Info,
    /// The global paths: `cli.json` for `/settings` and `model.json` for saved variants.
    pub paths: xiaochuan_local::paths::Paths,
    pub version: String,
    pub trace: Option<signals::Trace>,
    /// When the command started, for `XIAOCHUAN_SHOW_TTFD`.
    pub start: Instant,
}

/// A failure mini reports as `Error: <message>` and exit code 1 (`MiniInputError`).
#[derive(Debug)]
pub struct InputError(pub String);

impl std::fmt::Display for InputError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.0)
    }
}

impl std::error::Error for InputError {}

/// Runs mini until the user leaves.
pub fn run(input: Input) -> error::Result<()> {
    shell::run(input)
}
