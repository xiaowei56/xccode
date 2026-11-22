# Provider marks

Monochrome marks (`fill="currentColor"`) for model providers Xccode works with, from models.dev
(`https://models.dev/logos/<provider-id>.svg`, the same marks models.dev and Xccode's model
picker use), downloaded on 2026-11-03. Every file name is a provider ID in Xccode's bundled
models.dev catalog (`packages/core/src/models-dev/snapshot.txt`), except `ollama.svg`, the mark of
models.dev's `ollama-cloud`, used for local Ollama (`packages/core/src/plugin/provider/ollama.ts`).
The site draws them as CSS masks, so they take the text colour. Marks belong to their owners.

The live xccode.ai shows the model makers of Xccode Models and Go (/console/models, /console/go, the home page):
Anthropic, OpenAI, Google, xAI, DeepSeek, Moonshot AI, Alibaba, Z.ai, MiniMax, Mistral, Xiaomi and
Meta. All twelve are already here from models.dev, so none of the live site's own files (its
`go-hero-*`, `home-models-*` SVGs and the old models page's PNGs) were added.
