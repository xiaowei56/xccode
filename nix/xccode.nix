{
  lib,
  stdenvNoCC,
  callPackage,
  bun,
  nodejs,
  sysctl,
  makeBinaryWrapper,
  models-dev,
  ripgrep,
  wayland,
  installShellFiles,
  versionCheckHook,
  writableTmpDirAsHomeHook,
  node_modules ? callPackage ./node_modules.nix { },
}:
stdenvNoCC.mkDerivation (finalAttrs: {
  pname = "xccode";
  inherit (node_modules) version src;
  inherit node_modules;

  nativeBuildInputs = [
    bun
    nodejs # for patchShebangs node_modules
    installShellFiles
    makeBinaryWrapper
    models-dev
    writableTmpDirAsHomeHook
  ];

  postPatch = ''
    # NOTE: Relax Bun version check to be a warning instead of an error
    substituteInPlace packages/script/src/index.ts \
      --replace-fail 'throw new Error(`This script requires bun@''${expectedBunVersionRange}' \
                     'console.warn(`Warning: This script requires bun@''${expectedBunVersionRange}'
  '';

  configurePhase = ''
    runHook preConfigure

    cp -R ${finalAttrs.node_modules}/. .
    patchShebangs node_modules
    patchShebangs packages/*/node_modules

    runHook postConfigure
  '';

  env.MODELS_DEV_API_JSON = "${models-dev}/dist/_api.json";
  env.XCCODE_DISABLE_MODELS_FETCH = true;
  env.XCCODE_VERSION = finalAttrs.version;
  env.XCCODE_CHANNEL = "prod";
  env.NODE_OPTIONS = "--max-old-space-size=4096";

  buildPhase = ''
    runHook preBuild

    cd ./packages/cli
    bun --bun ./script/build.ts --single --skip-install

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    install -Dm755 dist/cli-*/bin/xccode $out/bin/xccode

    # OpenTUI dlopens Wayland for clipboard images.
    wrapProgram $out/bin/xccode \
      --prefix PATH : ${
        lib.makeBinPath (
          [
            ripgrep
          ]
          # bun runs sysctl to detect if running on rosetta2
          ++ lib.optional stdenvNoCC.hostPlatform.isDarwin sysctl
        )
      } ${lib.optionalString stdenvNoCC.hostPlatform.isLinux ''
        --prefix LD_LIBRARY_PATH : ${lib.makeLibraryPath [ wayland ]}
      ''}

    ln -s xccode $out/bin/xccode2

    runHook postInstall
  '';

  postInstall = lib.optionalString (stdenvNoCC.buildPlatform.canExecute stdenvNoCC.hostPlatform) ''
    # v2 dropped the `completion` subcommand; --completions is the global flag.
    # --completions also accepts sh, which emits the same script as bash.
    # staged to files, substitute below rejects anything that is not a regular file
    $out/bin/xccode --completions bash > xccode.bash
    $out/bin/xccode --completions zsh > _xccode
    $out/bin/xccode --completions fish > xccode.fish

    installShellCompletion --cmd xccode \
      --bash xccode.bash \
      --fish xccode.fish \
      --zsh _xccode

    # XCCODE_CLI_NAME is a build-time define, so the xccode2 copies are
    # renamed rather than regenerated. --replace-fail is a global literal
    # substitution, so any lowercase xccode that later appears in a
    # description or help text ships as xccode2 in the xccode2 copy.
    substitute xccode.bash xccode2.bash --replace-fail xccode xccode2
    substitute _xccode _xccode2 --replace-fail xccode xccode2
    substitute xccode.fish xccode2.fish --replace-fail xccode xccode2

    installShellCompletion --cmd xccode2 \
      --bash xccode2.bash \
      --fish xccode2.fish \
      --zsh _xccode2
  '';

  nativeInstallCheckInputs = [
    versionCheckHook
    writableTmpDirAsHomeHook
  ];
  doInstallCheck = true;
  versionCheckKeepEnvironment = [ "HOME" "XCCODE_DISABLE_MODELS_FETCH" ];
  versionCheckProgramArg = "--version";

  passthru = {
    env = finalAttrs.env;
  };

  meta = {
    description = "The open source coding agent";
    homepage = "https://xccode.ai";
    license = lib.licenses.mit;
    mainProgram = "xccode";
    inherit (node_modules.meta) platforms;
  };
})
