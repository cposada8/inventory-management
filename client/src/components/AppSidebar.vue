<template>
  <aside class="app-sidebar" :class="{ 'is-collapsed': collapsed, 'is-open': mobileOpen }">
    <div class="sidebar-brand">
      <div class="brand-mark" aria-hidden="true">CC</div>
      <div class="brand-text">
        <h1 v-show="!collapsed" class="brand-name">{{ t('nav.companyName') }}</h1>
        <span v-show="!collapsed" class="brand-subtitle">{{ t('nav.subtitle') }}</span>
      </div>
    </div>

    <nav class="sidebar-nav" :aria-label="t('nav.primary')">
      <ul class="nav-list">
        <li v-for="item in navItems" :key="item.to">
          <router-link
            :to="item.to"
            class="nav-link"
            :class="{ 'is-active': isActive(item.to) }"
            :aria-current="isActive(item.to) ? 'page' : undefined"
            :title="collapsed ? item.label : undefined"
          >
            <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path v-for="(d, i) in item.paths" :key="i" :fill-rule="d.fillRule" :clip-rule="d.clipRule" :d="d.d" />
            </svg>
            <span v-show="!collapsed" class="nav-label">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <button
        type="button"
        class="collapse-toggle"
        :aria-expanded="!collapsed"
        :aria-label="collapsed ? t('nav.expand') : t('nav.collapse')"
        @click="toggleCollapsed"
      >
        <svg class="toggle-icon" :class="{ 'is-collapsed': collapsed }" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.707 4.293a1 1 0 010 1.414L9.414 9H16a1 1 0 110 2H9.414l3.293 3.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0zM4 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1z" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '../composables/useI18n'
import { useSidebar } from '../composables/useSidebar'

const route = useRoute()
const { t } = useI18n()
const { collapsed, mobileOpen, toggleCollapsed } = useSidebar()

const isActive = (to) => (to === '/' ? route.path === '/' : route.path.startsWith(to))

const navItems = computed(() => [
  {
    to: '/',
    label: t('nav.overview'),
    paths: [
      { d: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' }
    ]
  },
  {
    to: '/inventory',
    label: t('nav.inventory'),
    paths: [
      { d: 'M4 3a2 2 0 100 4h12a2 2 0 100-4H4z' },
      { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z' }
    ]
  },
  {
    to: '/orders',
    label: t('nav.orders'),
    paths: [
      { d: 'M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' },
      { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z' }
    ]
  },
  {
    to: '/spending',
    label: t('nav.finance'),
    paths: [
      { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z' }
    ]
  },
  {
    to: '/demand',
    label: t('nav.demandForecast'),
    paths: [
      { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z' }
    ]
  },
  {
    to: '/reports',
    label: t('nav.reports'),
    paths: [
      { d: 'M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z' }
    ]
  },
  {
    to: '/backlog',
    label: t('nav.backlog'),
    paths: [
      { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' }
    ]
  }
])
</script>

<style scoped>
.app-sidebar {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  overflow: hidden;
  z-index: var(--z-sidebar);
}

.sidebar-brand {
  height: var(--topbar-h);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-1);
  padding: 0 var(--space-4);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.brand-mark {
  display: none;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: var(--brand);
  color: var(--ink-inverse);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-tight);
}

.app-sidebar.is-collapsed .brand-mark {
  display: flex;
  margin: 0 auto;
}

.brand-text {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.brand-name {
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
  color: var(--ink);
  letter-spacing: var(--tracking-tight);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brand-subtitle {
  font-size: var(--text-xs);
  color: var(--ink-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-3) var(--space-2);
}

.nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius);
  color: var(--ink-muted);
  text-decoration: none;
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  transition: background-color var(--duration-fast) var(--ease), color var(--duration-fast) var(--ease);
}

.nav-link:hover {
  background: var(--surface-hover);
  color: var(--ink);
}

.nav-link:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}

.nav-link.is-active {
  background: var(--surface-active);
  color: var(--brand);
  font-weight: var(--weight-semi);
}

.nav-link.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--brand);
  border-radius: var(--radius-sm);
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-sidebar.is-collapsed .nav-link {
  justify-content: center;
}

.sidebar-footer {
  flex-shrink: 0;
  border-top: 1px solid var(--border);
  padding: var(--space-2);
}

.collapse-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: var(--space-2);
  background: transparent;
  border: none;
  border-radius: var(--radius);
  color: var(--ink-muted);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease), color var(--duration-fast) var(--ease);
}

.collapse-toggle:hover {
  background: var(--surface-hover);
  color: var(--ink);
}

.collapse-toggle:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}

.toggle-icon {
  width: 18px;
  height: 18px;
  transition: transform var(--duration) var(--ease);
}

.toggle-icon.is-collapsed {
  transform: rotate(180deg);
}

@media (max-width: 1024px) {
  .app-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: var(--sidebar-w);
    transform: translateX(-100%);
    transition: transform var(--duration) var(--ease);
    /* Sit above the scrim (var(--z-overlay)) while the drawer is open. */
    z-index: var(--z-sidebar);
  }

  .app-sidebar.is-open {
    transform: translateX(0);
  }
}
</style>
