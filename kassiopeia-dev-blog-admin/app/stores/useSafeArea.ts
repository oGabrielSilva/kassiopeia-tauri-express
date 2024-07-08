import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSafeArea = defineStore('SafeArea', () => {
  const uiAppBarHeightRef = ref(0)

  const uiAppBarHeight = computed(() => uiAppBarHeightRef.value)

  function updateUIAppBarHeight(h: number) {
    uiAppBarHeightRef.value = h + 5
  }

  return { uiAppBarHeight, updateUIAppBarHeight }
})
