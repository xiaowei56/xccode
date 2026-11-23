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
  pname = "xiaochuan";
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
  env.XIAOCHUAN_DISABLE_MODELS_FETCH = true;
  env.XIAOCHUAN_VERSION = finalAttrs.version;
  env.XIAOCHUAN_CHANNEL = "prod";
  env.NODE_OPTIONS = "--max-old-space-size=4096";

  buildPhase = ''
    runHook preBuild

    cd ./packages/cli
    bun --bun ./script/build.ts --single --skip-install

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    install -Dm755 dist/cli-*/bin/xiaochuan $out/bin/xiaochuan

    # OpenTUI dlopens Wayland for clipboard images.
    wrapProgram $out/bin/xiaochuan \
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

    ln -s xiaochuan $out/bin/xiaochuan2

    runHook postInstall
  '';

  postInstall = lib.optionalString (stdenvNoCC.buildPlatform.canExecute stdenvNoCC.hostPlatform) ''
    # v2 dropped the `completion` subcommand; --completions is the global flag.
    # --completions also accepts sh, which emits the same script as bash.
    # staged to files, substitute below rejects anything that is not a regular file
    $out/bin/xiaochuan --completions bash > xiaochuan.bash
    $out/bin/xiaochuan --completions zsh > _xiaochuan
    $out/bin/xiaochuan --completions fish > xiaochuan.fish

    installShellCompletion --cmd xiaochuan \
      --bash xiaochuan.bash \
      --fish xiaochuan.fish \
      --zsh _xiaochuan

    # XIAOCHUAN_CLI_NAME is a build-time define, so the xiaochuan2 copies are
    # renamed rather than regenerated. --replace-fail is a global literal
    # substitution, so any lowercase xiaochuan that later appears in a
    # description or help text ships as xiaochuan2 in the xiaochuan2 copy.
    substitute xiaochuan.bash xiaochuan2.bash --replace-fail xiaochuan xiaochuan2
    substitute _xiaochuan _xiaochuan2 --replace-fail xiaochuan xiaochuan2
    substitute xiaochuan.fish xiaochuan2.fish --replace-fail xiaochuan xiaochuan2

    installShellCompletion --cmd xiaochuan2 \
      --bash xiaochuan2.bash \
      --fish xiaochuan2.fish \
      --zsh _xiaochuan2
  '';

  nativeInstallCheckInputs = [
    versionCheckHook
    writableTmpDirAsHomeHook
  ];
  doInstallCheck = true;
  versionCheckKeepEnvironment = [ "HOME" "XIAOCHUAN_DISABLE_MODELS_FETCH" ];
  versionCheckProgramArg = "--version";

  passthru = {
    env = finalAttrs.env;
  };

  meta = {
    description = "The open source coding agent";
    homepage = "https://xiaochuan.ai";
    license = lib.licenses.mit;
    mainProgram = "xiaochuan";
    inherit (node_modules.meta) platforms;
  };
})
