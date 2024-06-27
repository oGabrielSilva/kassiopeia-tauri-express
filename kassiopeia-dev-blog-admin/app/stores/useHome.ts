import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

type TMenuOptions = 'DASHBOARD' | 'ALL_POSTS' | 'WRITE' | 'MY_POSTS' | 'STACKS'

export const useHome = defineStore('Home', () => {
  const isNavbarHiddenRef = ref(true)
  const sideMenuOptionSelectedRef = ref<TMenuOptions>('ALL_POSTS')

  const isNavbarHidden = computed(() => isNavbarHiddenRef.value)
  const sideMenuOptionSelected = computed(() => sideMenuOptionSelectedRef.value)

  function updateSideMenuOptionSelected(option: TMenuOptions) {
    sideMenuOptionSelectedRef.value = option
  }

  function updateNavbarState() {
    isNavbarHiddenRef.value = !isNavbarHiddenRef.value
  }

  return {
    isNavbarHidden,
    updateNavbarState,
    updateSideMenuOptionSelected,
    sideMenuOptionSelected,
  }
})
