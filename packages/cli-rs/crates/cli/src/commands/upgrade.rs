//! `upgrade` prints installation-specific update instructions and exits with status 1.

use std::path::Path;

use xiaochuan_util::error;

use super::Context;
use crate::args::UpgradeArgs;
use crate::help::VERSION;

pub fn run(_context: &Context, _args: &UpgradeArgs) -> error::Result<()> {
    eprint!("{}", message(VERSION, xiaochuan_util::bundle::server().as_deref()));
    Err(crate::output::Exit(1).into())
}

/// What `upgrade` says in a build of `version`, with `bundled` the `xiaochuan` installed beside it.
fn message(version: &str, bundled: Option<&Path>) -> String {
    const SEPARATE: &str = "`xiaochuan upgrade` updates a separate TypeScript install, not this one.\n";
    if version.starts_with("0.0.0-native-") {
        return format!(
            "This is an Xiaochuan native CLI preview build; re-run the install script to update it and its bundled \
             server.\n{SEPARATE}"
        );
    }
    if let Some(bundled) = bundled {
        return format!(
            "This xiaochuan-native is updated with the xiaochuan installed beside it ({}): run `xiaochuan upgrade`.\n",
            bundled.display()
        );
    }
    if version == "local" {
        return format!("This xiaochuan-native is a source build; rebuild it to update it.\n{SEPARATE}");
    }
    format!("This xiaochuan-native has no updater; update it the way you installed it.\n{SEPARATE}")
}

#[cfg(test)]
mod tests {
    use super::*;

    // Expected (native-upgrade): `upgrade` upgrades nothing and says, for the install it detects, how this binary is
    // updated. A preview build is sent to its install script, bundled or not; a bundled `xiaochuan` beside any other
    // build is the one to upgrade; a source build without one is rebuilt; anything else has no updater. An `xiaochuan`
    // on `PATH` or in `XIAOCHUAN_TS_BIN` is not an input.
    #[test]
    fn upgrade_says_how_this_install_is_updated() {
        const SEPARATE: &str = "`xiaochuan upgrade` updates a separate TypeScript install, not this one.\n";
        let preview = format!(
            "This is an Xiaochuan native CLI preview build; re-run the install script to update it and its bundled \
             server.\n{SEPARATE}"
        );
        let bundled = Path::new("/opt/xiaochuan/xiaochuan");
        let beside = "This xiaochuan-native is updated with the xiaochuan installed beside it (/opt/xiaochuan/xiaochuan): \
                      run `xiaochuan upgrade`.\n";
        let source = format!("This xiaochuan-native is a source build; rebuild it to update it.\n{SEPARATE}");
        let none = format!("This xiaochuan-native has no updater; update it the way you installed it.\n{SEPARATE}");
        let rows: &[(&str, Option<&Path>, &str)] = &[
            ("0.0.0-native-12", Some(bundled), &preview),
            ("0.0.0-native-12", None, &preview),
            ("2.4.0", Some(bundled), beside),
            ("local", Some(bundled), beside),
            ("local", None, &source),
            ("2.4.0", None, &none),
            ("0.0.0-native", None, &none),
        ];
        for (version, bundled, expected) in rows {
            assert_eq!(message(version, *bundled), *expected, "{version} {bundled:?}");
        }
    }
}
