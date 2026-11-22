# tr Glossary

## Sources

- PR #15835: https://github.com/xiaowei56/xccode/pull/15835

## Do Not Translate (Locale Additions)

- `Xccode` (preserve casing in prose, docs, and UI copy)
- Keep lowercase `xccode` in commands, package names, paths, URLs, and other exact identifiers
- `<TAB>` stays the literal key token in code blocks; use `Tab` for the nearby explanatory label in prose
- Commands, flags, file paths, and code literals (keep exactly as written)

## Preferred Terms

These are PR-backed wording preferences and may evolve.

| English / Context         | Preferred                               | Notes                                                         |
| ------------------------- | --------------------------------------- | ------------------------------------------------------------- |
| available in beta         | `beta olarak mevcut`                    | Prefer this over `beta olarak kullanılabilir`                 |
| privacy-first             | `Gizlilik öncelikli tasarlandı`         | Prefer this over `Önce gizlilik için tasarlandı`              |
| connect your local models | `yerel modellerinizi bağlayabilirsiniz` | Use the fuller, more direct action phrase                     |
| `<TAB>` key label         | `Tab`                                   | Use `Tab` in prose; keep `<TAB>` in literal UI or code blocks |
| cross-platform            | `cross-platform (tüm platformlarda)`    | Keep the English term, add a short clarification when helpful |

## Guidance

- Prefer natural Turkish phrasing over literal translation
- Merge broken sentence fragments into one clear sentence when the source is a single thought
- Keep product naming consistent: `Xccode` in prose, `xccode` only for exact technical identifiers
- When an English technical term is intentionally kept, add a short Turkish clarification only if it improves readability

## Avoid

- Avoid `beta olarak kullanılabilir` when `beta olarak mevcut` fits
- Avoid `Önce gizlilik için tasarlandı`; use the more natural reviewed wording instead
- Avoid `Sekme` for the translated key label in prose when referring to `<TAB>`
- Avoid changing `xccode` to `Xccode` inside commands, URLs, package names, or code literals
