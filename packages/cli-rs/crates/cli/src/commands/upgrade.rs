//! `upgrade` prints installation-specific update instructions and exits with status 1.

use std::path::Path;

use xccode_util::error;

use super::Context;
use crate::args::UpgradeArgs;
use crate::help::VERSION;

pub fn run(_context: &Context, _args: &UpgradeArgs) -> error::Result<()> {
    eprint!("{}", message(VERSION, xccode_util::bundle::server().as_deref()));
    Err(crate::output::Exit(1).into())
}

/// What `upgrade` says in a build of `version`, with `bundled` the `xccode` installed beside it.
fn message(version: &str, bundled: Option<&Path>) -> String {
    const SEPARATE: &str = "`xccode upgrade` updates a separate TypeScript install, not this one.\n";
    if version.starts_with("0.0.0-native-") {
        return format!(
            "This is an Xccode native CLI preview build; re-run the install script to update it and its bundled \
             server.\n{SEPARATE}"
        );
    }
    if let Some(bundled) = bundled {
        return format!(
            "This xccode-native is updated with the xccode installed beside it ({}): run `xccode upgrade`.\n",
            bundled.display()
        );
    }
    if version == "local" {
        return format!("This xccode-native is a source build; rebuild it to update it.\n{SEPARATE}");
    }
    format!("This xccode-native has no updater; update it the way you installed it.\n{SEPARATE}")
}

#[cfg(test)]
mod tests {
    use super::*;

    // Expected (native-upgrade): `upgrade` upgrades nothing and says, for the install it detects, how this binary is
    // updated. A preview build is sent to its install script, bundled or not; a bundled `xccode` beside any other
    // build is the one to upgrade; a source build without one is rebuilt; anything else has no updater. An `xccode`
    // on `PATH` or in `XCCODE_TS_BIN` is not an input.
    #[test]
    fn upgrade_says_how_this_install_is_updated() {
        const SEPARATE: &str = "`xccode upgrade` updates a separate TypeScript install, not this one.\n";
        let preview = format!(
            "This is an Xccode native CLI preview build; re-run the install script to update it and its bundled \
             server.\n{SEPARATE}"
        );
        let bundled = Path::new("/opt/xccode/xccode");
        let beside = "This xccode-native is updated with the xccode installed beside it (/opt/xccode/xccode): \
                      run `xccode upgrade`.\n";
        let source = format!("This xccode-native is a source build; rebuild it to update it.\n{SEPARATE}");
        let none = format!("This xccode-native has no updater; update it the way you installed it.\n{SEPARATE}");
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
