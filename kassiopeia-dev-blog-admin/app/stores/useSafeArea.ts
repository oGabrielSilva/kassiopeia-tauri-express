import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSafeArea = defineStore('SafeArea', () => {
  const uiAppBarHeight = ref(0)

  function updateUIAppBarHeight(h: number) {
    uiAppBarHeight.value = h
  }

  return { uiAppBarHeight, updateUIAppBarHeight }
})
