import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type TLayouts = 'DEFAULT' | 'SESSION' | 'USER_PAGE'

export const useLayout = defineStore('Layout', () => {
  const layoutRef = ref<TLayouts>('DEFAULT')
  const current = computed(() => layoutRef.value)

  function updateTo(layout: TLayouts) {
    layoutRef.value = layout
  }

  return { current, updateTo }
})
