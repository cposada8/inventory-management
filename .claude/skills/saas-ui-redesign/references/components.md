# Component Patterns

Recipes for the surfaces a SaaS dashboard is made of. All values come from
tokens — if a recipe here needs a number the token file doesn't have, add the
token rather than inlining the literal.

These belong in the **global** stylesheet, not in scoped blocks. A `.card` that
looks different on three pages is the problem this skill exists to fix.

## Rhythm rules

Consistency comes from a small vocabulary, applied everywhere:

| Relationship | Gap | Token |
|---|---|---|
| Label → its value | 4–8px | `--space-1` / `--space-2` |
| Items inside a group | 12px | `--space-3` |
| Card padding | 20px | `--space-5` |
| Between cards / grid gap | 20–24px | `--space-5` / `--space-6` |
| Between page sections | 32px | `--space-8` |
| Page top / bottom padding | 24px / 48px | `--space-6` / `--space-12` |

Two rules that carry most of the polish:

- **Related things are closer than unrelated things.** A stat label 4px from its
  number and 20px from the next card reads instantly. Equal gaps read as mush.
- **Pick one border radius per size class** — `--radius` for controls,
  `--radius-lg` for containers. Mixed radii on adjacent elements look accidental.

## Page header

```css
.page-header { margin-bottom: var(--space-6); }
.page-header h2 {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--ink);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--space-1);
}
.page-header p { color: var(--ink-muted); font-size: var(--text-md); }
```

With a topbar, the page title can move up into it and this block reduces to the
description alone. Decide once and apply to every view — half the pages carrying
an inline `<h2>` while the rest use the topbar is exactly the inconsistency to
eliminate.

## Card / panel

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  margin-bottom: var(--space-5);
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--border);
}
.card-title {
  font-size: var(--text-lg);
  font-weight: var(--weight-semi);
  color: var(--ink);
  letter-spacing: var(--tracking-tight);
}
```

Cards are containers, not buttons — no shadow at rest, no hover lift. Reserve
`--shadow-md` for genuinely floating surfaces (dropdowns, popovers).

## Stat tile

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-5);
  margin-bottom: var(--space-6);
}
.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}
.stat-label {
  font-size: var(--text-xs);
  font-weight: var(--weight-semi);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--ink-muted);
  margin-bottom: var(--space-2);
}
.stat-value {
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  color: var(--ink);
  letter-spacing: var(--tracking-tight);
  font-variant-numeric: tabular-nums;
}
.stat-card.is-warning .stat-value { color: var(--warning); }
.stat-card.is-danger  .stat-value { color: var(--danger); }
.stat-card.is-success .stat-value { color: var(--success); }
```

`tabular-nums` on every figure that updates live — without it, digits change
width and the number visibly jitters when a filter changes.

## Data table

```css
.table-container {
  overflow-x: auto;
  border-radius: var(--radius-lg);
}
table { width: 100%; border-collapse: collapse; }
thead th {
  position: sticky;              /* keeps headers visible on long tables */
  top: 0;
  background: var(--surface-sunken);
  text-align: left;
  padding: var(--space-3);
  font-size: var(--text-xs);
  font-weight: var(--weight-semi);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--ink-muted);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
tbody td {
  padding: var(--space-3);
  font-size: var(--text-base);
  color: var(--ink-body);
  border-bottom: 1px solid var(--surface-hover);
}
tbody tr:last-child td { border-bottom: 0; }
tbody tr { transition: background var(--duration-fast) var(--ease); }
tbody tr:hover { background: var(--surface-sunken); }

/* Numeric columns right-align and share one width per digit. */
td.is-numeric, th.is-numeric { text-align: right; font-variant-numeric: tabular-nums; }
```

Row padding of `--space-3` (12px) is the dashboard default: dense enough to scan,
loose enough to click. Anything under 8px reads as a spreadsheet.

## Badge

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius);
  font-size: var(--text-xs);
  font-weight: var(--weight-semi);
  line-height: var(--leading-tight);
  white-space: nowrap;
}
.badge.success { background: var(--success-soft); color: var(--success-ink); }
.badge.warning { background: var(--warning-soft); color: var(--warning-ink); }
.badge.danger  { background: var(--danger-soft);  color: var(--danger-ink);  }
.badge.info    { background: var(--info-soft);    color: var(--info-ink);    }
.badge.neutral { background: var(--neutral-soft); color: var(--neutral-ink); }
```

Map every domain status onto these five semantic classes rather than adding a
class per status. Nine bespoke badge colours is a palette; five semantic ones
is a system.

## Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: 1px solid transparent;
  border-radius: var(--radius);
  font-size: var(--text-base);
  font-weight: var(--weight-semi);
  font-family: inherit;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease),
              border-color var(--duration-fast) var(--ease);
}
.btn:focus-visible { outline: none; box-shadow: var(--ring); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-primary   { background: var(--brand); color: var(--ink-inverse); }
.btn-primary:hover:not(:disabled) { background: var(--brand-hover); }

.btn-secondary { background: var(--surface); color: var(--ink-body); border-color: var(--border-strong); }
.btn-secondary:hover:not(:disabled) { background: var(--surface-hover); }

.btn-ghost     { background: transparent; color: var(--ink-muted); }
.btn-ghost:hover:not(:disabled) { background: var(--surface-hover); color: var(--ink); }

.btn-icon { padding: var(--space-2); width: 34px; height: 34px; }
```

One primary button per view. If two things compete for it, one of them is secondary.

## Form controls

```css
.field { display: flex; flex-direction: column; gap: var(--space-2); }
.field label {
  font-size: var(--text-xs);
  font-weight: var(--weight-semi);
  color: var(--ink-muted);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}
.input, .select {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--ink);
  font-size: var(--text-base);
  font-family: inherit;
  transition: border-color var(--duration-fast) var(--ease);
}
.input:hover, .select:hover { border-color: var(--ink-subtle); }
.input:focus, .select:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: var(--ring);
}
.input::placeholder { color: var(--ink-subtle); }
```

Every control in a toolbar row must share one height — mismatched select and
button heights are the single most common source of "it looks slightly off".
Set it explicitly (`height: 34px`) rather than hoping padding lands the same.

## Empty and loading states

An unstyled "Loading..." is the fastest way to make a polished app feel cheap.

```css
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-12) var(--space-6);
  text-align: center;
  color: var(--ink-muted);
}
.state-title { font-size: var(--text-lg); font-weight: var(--weight-semi); color: var(--ink); }
.state-body  { font-size: var(--text-base); max-width: 42ch; }

.skeleton {
  background: linear-gradient(90deg,
    var(--surface-hover) 25%, var(--border) 37%, var(--surface-hover) 63%);
  background-size: 400% 100%;
  border-radius: var(--radius);
  animation: skeleton 1.4s ease infinite;
}
@keyframes skeleton { 0% { background-position: 100% 50% } 100% { background-position: 0 50% } }
```

Skeletons should occupy the same footprint as the loaded content, otherwise the
page jumps when data arrives.

Empty states need three things: what's absent, why, and the action that fixes it.
Distinguish "no data at all" from "no data *matching these filters*" — the second
should offer a reset, and it is by far the more common case in a filtered
dashboard.

## Modal

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: grid;
  place-items: center;
  padding: var(--space-6);
  z-index: var(--z-modal);
}
.modal {
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: min(640px, 100%);
  max-height: min(85vh, 900px);
  display: flex;
  flex-direction: column;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-5);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.modal-body { padding: var(--space-5); overflow-y: auto; }
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}
```

Header and footer are `flex-shrink: 0` so only the body scrolls. Close on
`Escape` and on overlay click; move focus into the dialog on open and restore it
on close; add `role="dialog"` and `aria-modal="true"`.

## Charts

For hand-rolled SVG charts, drive every colour from tokens via `currentColor` or
CSS variables rather than hardcoded fills, so a palette change reaches the charts
too:

```vue
<rect :fill="`var(--${item.tone})`" />   <!-- tone: 'success' | 'danger' | ... -->
```

Axis labels use `--text-xs` / `--ink-muted`; gridlines use `--border`. Charts
should never introduce a colour that isn't already in the token file.
