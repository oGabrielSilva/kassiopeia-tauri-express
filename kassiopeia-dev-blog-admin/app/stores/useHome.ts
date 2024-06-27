import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useHome = defineStore('Home', () => {
  const isNavbarHiddenRef = ref(true)

  const isNavbarHidden = computed(() => isNavbarHiddenRef.value)

  function updateNavbarState(isHidden: boolean) {
    isNavbarHiddenRef.value = isHidden
  }

  return { isNavbarHidden, updateNavbarState }
})
