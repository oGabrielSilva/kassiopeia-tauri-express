import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

type TTheme = 'light' | 'dark'

const STORAGE_KEY = '@key__theme'

const recoveryKey = (): TTheme | null => {
  return localStorage.getItem(STORAGE_KEY) as TTheme
}

const update = (t: TTheme) => {
  localStorage.setItem(STORAGE_KEY, t)
}

const recoveryTheme = (): TTheme => {
  const key = recoveryKey()

  if (!key) {
    update('light')
    return 'light'
  }

  return ['light', 'dark'].includes(key) ? key : 'light'
}

export const useTheme = defineStore('Theme', () => {
  const currentRef = ref(recoveryTheme())

  const current = computed(() => currentRef.value)

  function whatNext(): TTheme {
    return currentRef.value === 'dark' ? 'light' : 'dark'
  }

  function toNext() {
    const next = whatNext()
    update(next)
    currentRef.value = next
  }

  function getCurrent() {
    return currentRef.value
  }

  function isDark() {
    return currentRef.value === 'dark'
  }

  return { current, toNext, whatNext, getCurrent, isDark }
})
