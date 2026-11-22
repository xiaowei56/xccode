//! Prints the paths, channel, and service registration this environment resolves to, read-only,
//! with the password redacted: `cargo run -p xccode-local --example registration`.

use xccode_local::channel::{self, Channels};
use xccode_local::paths::Paths;
use xccode_local::registration::Files;

fn main() -> std::io::Result<()> {
    let paths = Paths::from_env()?;
    let channels = Channels::from_env();
    let files = Files::new(&paths, &channels.channel);
    println!("config:       {}", paths.config.display());
    println!("state:        {}", paths.state.display());
    println!("channel:      {} (storage {})", channels.channel, channels.storage);
    println!("default port: {}", channel::default_port(&channels.channel, cfg!(windows)));
    println!("registration: {}", files.file.display());
    match files.read() {
        Some(info) => println!("service:      {info:?}"),
        None => println!("service:      none registered"),
    }
    Ok(())
}
