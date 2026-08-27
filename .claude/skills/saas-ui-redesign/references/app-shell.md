# App Shell — Sidebar Layout

The shell is the whole redesign in miniature: get it right and every view
inherits correct gutters, a stable scroll container, and one place where
navigation lives.

## Target structure

```
┌────────────┬──────────────────────────────────────┐
│            │  Topbar  (page title · actions)      │  ← sticky
│  Sidebar   ├──────────────────────────────────────┤
│  (fixed)   │  Filter / toolbar row                │  ← sticky under topbar
│            ├──────────────────────────────────────┤
│  brand     │                                      │
│  nav       │  <router-view />                     │  ← the only scroll area
│  ────      │                                      │
│  footer    │                                      │
└────────────┴──────────────────────────────────────┘
```

Two columns via CSS Grid. The sidebar is a grid track, **not** `position: fixed`
— a fixed sidebar forces you to hand-maintain a `margin-left` on the content
that drifts out of sync the moment the width changes.

## Layout CSS (App.vue, unscoped)

```css
.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-w) minmax(0, 1fr);
  min-height: 100vh;
  background: var(--surface-sunken);
  transition: grid-template-columns var(--duration) var(--ease);
}

.app-shell.is-collapsed {
  grid-template-columns: var(--sidebar-w-collapsed) minmax(0, 1fr);
}

/* minmax(0, 1fr) is load-bearing: without it, a wide table inside the
   content column blows the grid out and the page scrolls sideways. */

.app-main {
  display: flex;
  flex-direction: column;
  min-width: 0;              /* same overflow guard, flex edition */
}

.app-topbar {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  height: var(--topbar-h);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: 0 var(--gutter);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.app-content {
  flex: 1;
  width: 100%;
  max-width: var(--content-max);
  margin: 0 auto;
  padding: var(--space-6) var(--gutter) var(--space-12);
}
```

### The sticky-offset trap

Any secondary sticky bar must offset by the topbar height **through the token**,
never a literal:

```css
/* ✗ breaks silently when the topbar height changes */
.filters-bar { position: sticky; top: 70px; }

/* ✓ follows the shell */
.filters-bar { position: sticky; top: var(--topbar-h); z-index: var(--z-sticky); }
```

Grep for `top:` on every `position: sticky` rule before you declare the shell done.

## Sidebar component

Create `components/AppSidebar.vue`. Keep it presentational — routes in, events
out. It should not fetch data.

```vue
<template>
  <aside
    class="sidebar"
    :class="{ 'is-collapsed': collapsed, 'is-open': mobileOpen }"
  >
    <div class="sidebar-brand">
      <router-link to="/" class="brand-link">
        <span class="brand-mark" aria-hidden="true">CC</span>
        <span v-show="!collapsed" class="brand-text">
          <span class="brand-name">{{ t('nav.companyName') }}</span>
          <span class="brand-sub">{{ t('nav.subtitle') }}</span>
        </span>
      </router-link>
    </div>

    <nav class="sidebar-nav" :aria-label="t('nav.primary')">
      <ul>
        <li v-for="item in items" :key="item.to">
          <router-link
            :to="item.to"
            class="nav-item"
            :aria-current="isActive(item.to) ? 'page' : undefined"
            :title="collapsed ? item.label : undefined"
          >
            <span class="nav-icon" aria-hidden="true" v-html="item.icon" />
            <span v-show="!collapsed" class="nav-label">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <button
        class="collapse-toggle"
        :aria-expanded="!collapsed"
        :aria-label="collapsed ? t('nav.expand') : t('nav.collapse')"
        @click="$emit('toggle-collapse')"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M12.7 5.3a1 1 0 010 1.4L9.42 10l3.3 3.3a1 1 0 01-1.42 1.4l-4-4a1 1 0 010-1.4l4-4a1 1 0 011.42 0z" />
        </svg>
      </button>
      <slot name="footer" />
    </div>
  </aside>
</template>
```

Exact-match the root route, prefix-match the rest, so `/orders/42` keeps
`/orders` highlighted:

```js
const isActive = (to) =>
  to === '/' ? route.path === '/' : route.path.startsWith(to)
```

### Sidebar CSS

```css
.sidebar {
  position: sticky;
  top: 0;
  align-self: start;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border-right: 1px solid var(--border);
  overflow: hidden;
  z-index: var(--z-sidebar);
}

.sidebar-brand {
  height: var(--topbar-h);
  display: flex;
  align-items: center;
  padding: 0 var(--space-4);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
/* Matching --topbar-h makes the brand block and topbar share one baseline.
   Without it the seam between the two columns is visibly crooked. */

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4) var(--space-3);
}
.sidebar-nav ul { list-style: none; margin: 0; padding: 0; }
.sidebar-nav li + li { margin-top: var(--space-1); }

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius);
  color: var(--ink-muted);
  font-size: var(--text-md);
  font-weight: var(--weight-medium);
  text-decoration: none;
  white-space: nowrap;
  transition: background var(--duration-fast) var(--ease),
              color var(--duration-fast) var(--ease);
}

.nav-item:hover { background: var(--surface-hover); color: var(--ink); }

.nav-item[aria-current='page'] {
  background: var(--surface-active);
  color: var(--brand);
  font-weight: var(--weight-semi);
}

/* Accent rail — the sidebar equivalent of the old underline tab */
.nav-item[aria-current='page']::before {
  content: '';
  position: absolute;
  left: calc(var(--space-3) * -1);
  top: 20%;
  bottom: 20%;
  width: 3px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background: var(--brand);
}

.nav-item:focus-visible { outline: none; box-shadow: var(--ring); }

.nav-icon { flex-shrink: 0; width: 20px; height: 20px; }
.nav-icon :deep(svg) { width: 100%; height: 100%; display: block; }

.sidebar.is-collapsed .nav-item { justify-content: center; padding: var(--space-3) 0; }
.sidebar.is-collapsed .nav-item[aria-current='page']::before { left: 0; }

.sidebar-footer {
  flex-shrink: 0;
  padding: var(--space-3);
  border-top: 1px solid var(--border);
}
```

## Collapse state

Own it in the parent (`App.vue`), persist it, pass it down:

```js
const collapsed = ref(localStorage.getItem('sidebar-collapsed') === 'true')
watch(collapsed, v => localStorage.setItem('sidebar-collapsed', String(v)))
```

Wrap the read in `try/catch` if the app must survive storage being blocked.

## Responsive

Three bands. Below `1024px` the sidebar leaves the grid entirely and becomes an
off-canvas drawer — collapsing to 68px on a phone still costs a fifth of the
viewport.

```css
@media (max-width: 1280px) { :root { --gutter: var(--space-6); } }

@media (max-width: 1024px) {
  .app-shell,
  .app-shell.is-collapsed { grid-template-columns: minmax(0, 1fr); }

  .sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: var(--sidebar-w);
    transform: translateX(-100%);
    transition: transform var(--duration-slow) var(--ease);
    box-shadow: var(--shadow-lg);
  }
  .sidebar.is-open { transform: translateX(0); }

  .sidebar-scrim {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    z-index: var(--z-overlay);
  }
}

@media (max-width: 640px) { :root { --gutter: var(--space-4); } }
```

The drawer needs a hamburger in the topbar (`aria-controls` pointing at the
sidebar id), close on route change, close on `Escape`, and `overflow: hidden` on
`body` while open.

## Accessibility floor

Non-negotiable, and cheap to build in from the start:

- `<nav aria-label="...">` around the list; `aria-current="page"` on the active link.
- A skip link as the first focusable element: `<a href="#main" class="skip-link">`.
- `:focus-visible { box-shadow: var(--ring) }` on every link, button, and input.
- Collapsed mode: labels are hidden with `v-show`, so add `:title` — never rely on the icon alone.
- Icons are decorative: `aria-hidden="true"`, with the text label carrying the meaning.
- Colour is never the only signal — the active item has fill + rail + weight, not just hue.

## Migrating from a top nav

1. Move the `<router-link>` list out of the header into `AppSidebar.vue` **verbatim** first — same `to` paths, same labels, same i18n keys. Confirm every route still resolves before restyling anything.
2. Split the old header: brand → sidebar top, profile/locale controls → sidebar footer or topbar right, page title → topbar left.
3. Delete `.nav-tabs`, `.nav-container`, and `.top-nav` only after the sidebar renders on all routes.
4. Reconcile the two `max-width` centering rules — old apps often centre both the nav container and the content. With a sidebar, only `.app-content` should cap width.
5. Icons: a sidebar without them looks unfinished, but a collapsed sidebar without them is unusable. Inline 20px SVG paths with `fill="currentColor"` — no icon package needed.
6. Every new label needs a key in **all** locale files. Check the longest translation against `--sidebar-w`; German and Japanese labels routinely overflow a width that fits English.
