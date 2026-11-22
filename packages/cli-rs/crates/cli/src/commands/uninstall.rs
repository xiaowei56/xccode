use xccode_service::delegate;
use xccode_util::error;

use super::Context;
use crate::args::UninstallArgs;

pub fn run(_context: &Context, _args: &UninstallArgs) -> error::Result<()> {
    // The TypeScript binary replaces this process, so this process's queued records go first.
    crate::telemetry::flush();
    Err(delegate::forward().into())
}
