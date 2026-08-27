import { ref, watch } from 'vue'

// Shared sidebar state (singleton pattern, matching useFilters.js)
const STORAGE_KEY = 'sidebar-collapsed'

// Storage can throw in private windows or when site data is blocked,
// so every read and write is guarded.
const readCollapsed = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch (err) {
    return false
  }
}

const collapsed = ref(readCollapsed())

watch(collapsed, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, String(value))
  } catch (err) {
    // Non-fatal: the sidebar still works, it just won't remember.
  }
})

// Drawer state for viewports below 1024px. Deliberately NOT persisted --
// a drawer that reopens itself on reload is a bug, not a feature.
const mobileOpen = ref(false)

export function useSidebar() {
  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value
  }

  const openMobile = () => {
    mobileOpen.value = true
  }

  const closeMobile = () => {
    mobileOpen.value = false
  }

  return {
    // State
    collapsed,
    mobileOpen,

    // Methods
    toggleCollapsed,
    openMobile,
    closeMobile
  }
}
