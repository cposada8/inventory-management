---
name: saas-ui-redesign
description: Redesign a Vue 3 application's UI into a modern SaaS-style interface — a vertical navigation sidebar on the left replacing a top nav bar, a shared design-token layer for consistent spacing and color, and polished component patterns. Use when asked to modernize, restyle, or redesign a Vue app's look and feel, move navigation into a sidebar, unify inconsistent spacing, or make an interface feel like a professional SaaS product.
---

# SaaS UI Redesign

Convert a Vue 3 app with a top nav bar and ad-hoc per-component styling into a
sidebar-shell SaaS interface with one coherent design system.

The work is **presentation only**. Component logic, props, emits, computed
properties, API calls, and routes stay exactly as they are. If a redesign forces
a logic change, that is a signal you have gone too far — stop and flag it.

## Reference files

Read these when you reach the phase that needs them, not before:

| File | Read it at |
|---|---|
| `references/tokens.css` | Phase 2 — the drop-in token layer |
| `references/app-shell.md` | Phase 3 — sidebar component, grid shell, responsive, a11y |
| `references/components.md` | Phase 4 — card, table, badge, button, form, empty-state recipes |

## Ground rules

- **Delegate every `.vue` edit to the `vue-expert` subagent.** This project's
  CLAUDE.md makes it mandatory for creating or significantly modifying a `.vue`
  file. Give the subagent the specific file, the token names to use, and the
  recipe — not "make it look better".
- **No emojis in the UI.** Icons are inline SVG with `fill="currentColor"`.
- **Verify in a browser with Playwright MCP** (`mcp__playwright__*`) against
  `http://localhost:3000`. A redesign you have not looked at is not finished.
- **One phase, one commit.** A single commit spanning shell + sweep + polish is
  unreviewable and unrevertable.

## Phase 1 — Audit before touching anything

Build a factual picture of the current UI. Skipping this is how redesigns break
layouts nobody remembered existed.

Quote every `--include` glob. Unquoted `--include=*.vue` is expanded by zsh
before grep sees it and the command dies with `no matches found`.

```bash
# Where do styles live? Largest scoped blocks are the biggest sweep targets.
find client/src -name '*.vue' | while read -r f; do
  echo "$(sed -n '/<style/,$p' "$f" | wc -l)  $f"
done | sort -rn

# Every hardcoded colour — this is the evidence for a token layer
grep -rEoh '#[0-9a-fA-F]{3,8}' client/src --include='*.vue' | sort | uniq -c | sort -rn
grep -rEoh '#[0-9a-fA-F]{3,8}' client/src --include='*.vue' | sort -u | wc -l

# Sticky offsets coupled to the current nav height
grep -rn -A3 'position: *sticky' client/src --include='*.vue'

# Layout assumptions: width caps, centering, ad-hoc stacking
grep -rn 'max-width\|margin: 0 auto\|z-index' client/src --include='*.vue'

# Do route entries and nav links agree?
grep -n "path:" client/src/main.js
grep -n "router-link" client/src/App.vue
```

Record and report:

- Which selectors are **global** (unscoped in `App.vue`) — those are the existing
  shared design system, and changing one reaches every view at once.
- The colour histogram. A long tail of near-duplicate greys is the concrete
  evidence for a token layer.
- Every `position: sticky` with a magic-number `top`.
- Nav links with no matching route, and routes with no nav link. The sidebar
  rebuild is the moment to resolve them — ask the user, do not silently drop
  or add navigation.

State findings to the user before proceeding.

## Phase 2 — Introduce the token layer

Add `client/src/styles/tokens.css` from `references/tokens.css` and import it
first in `main.js`, before `App.vue` mounts:

```js
import './styles/tokens.css'
```

Calibrate the tokens to the app's existing palette rather than imposing a new
one. The audit histogram tells you the real values in use; map the dominant ones
onto semantic names. A redesign that also silently changes brand colour is two
changes wearing one coat.

Commit here. Nothing renders differently yet — tokens are declared but unused,
so this commit is provably safe.

## Phase 3 — Build the shell

Read `references/app-shell.md`.

1. Create `AppSidebar.vue` and move the nav links across **verbatim** — same
   paths, same labels, same i18n keys.
2. Restructure `App.vue` into the two-column grid, with a topbar in the content
   column.
3. Repoint every sticky offset at `var(--topbar-h)`.
4. Resolve duplicate width-capping: with a sidebar, only the content column caps
   width. A nav container that also centred at some max-width is now dead.
5. Delete the old top-nav markup and CSS **only after** the sidebar renders on
   every route.

Verify all routes render, then commit.

### i18n

If the app is localized, every new label needs a key in **every** locale file,
not just the default. Check the longest translation against `--sidebar-w` —
Japanese and German nav labels routinely overflow a width that fits English.

## Phase 4 — Sweep components onto tokens

Read `references/components.md`.

Work **file by file**, largest style block first — that ordering front-loads the
risk while you still have budget to back out. For each file:

1. Replace hardcoded colours with semantic tokens.
2. Snap padding, margin, and gap onto the spacing scale.
3. Delete scoped rules that now duplicate a global pattern. A view redefining
   `.card` locally is the inconsistency, not a customization worth keeping.
4. Leave the template structure alone unless the markup itself blocks the layout.

This is a mechanical sweep, not a rewrite. If a component starts needing new
props or restructured markup, note it and move on.

Commit per group of files, not per file.

## Phase 5 — Polish pass

The difference between "restyled" and "professional" lives here:

- **Interactive states on everything.** Hover, `:focus-visible` (using `--ring`),
  active, and disabled on every link, button, row, and input.
- **Alignment.** Controls in a row share one height. Numeric table columns are
  right-aligned and `tabular-nums`.
- **Optical rhythm.** Related elements sit closer than unrelated ones. Equal gaps
  everywhere reads as undesigned.
- **Real empty and loading states.** Replace bare "Loading..." text with skeletons
  that match the loaded footprint. Distinguish "no data" from "no data matching
  these filters" and offer a reset for the latter.
- **Restraint.** No shadow on resting cards, no hover lift on non-interactive
  surfaces, one primary button per view, one radius per size class.

## Phase 6 — Verify

With both servers running, drive Playwright MCP across **every** route:

- Each route at 1440px, 1024px, and 768px.
- No horizontal page scroll at any width. Wide tables scroll inside their own
  container, never the body.
- Sidebar collapse persists across reload; the drawer opens, closes on route
  change, and closes on Escape.
- Active nav highlighting is correct on every route, including nested paths.
- Tab through each page — focus is always visible and never trapped.
- Existing behaviour still works: filters, search, sorting, modals.

Screenshot each route and report what changed.

## Definition of done

- One token file; no raw hex codes or arbitrary pixel spacing left in scoped blocks.
- Every route reachable from the sidebar, with correct active state.
- No horizontal scroll at any of the three widths.
- Every interactive element has hover and visible focus states.
- No component's props, emits, or data flow changed.
- All pre-existing tests still pass.

## Common failure modes

| Symptom | Cause |
|---|---|
| Page scrolls sideways after the shell lands | Grid column is `1fr` instead of `minmax(0, 1fr)` — a wide table blows out the track |
| Filter bar floats over or under content | Sticky `top` still holds the old nav height literal |
| Content column drifts off-centre | Two `max-width` + `margin: 0 auto` rules still competing |
| Collapsed sidebar shows unlabelled icons | Missing `:title` fallback when labels are `v-show`-hidden |
| Numbers jitter when filters change | Missing `font-variant-numeric: tabular-nums` |
| Nav item stays inactive on a detail route | Exact path match instead of prefix match for non-root routes |
| A view looks different from the rest | Scoped CSS still overriding the global pattern — finish the sweep for that file |
