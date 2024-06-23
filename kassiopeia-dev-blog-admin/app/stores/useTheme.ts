import { defineStore } from 'pinia'
import { ref } from 'vue'

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
  const current = ref(recoveryTheme())

  function whatNext(): TTheme {
    return current.value === 'dark' ? 'light' : 'dark'
  }

  function toNext() {
    const next = whatNext()
    update(next)
    current.value = next
  }

  function getCurrent() {
    return current.value
  }

  function isDark() {
    return current.value === 'dark'
  }

  return { current, toNext, whatNext, getCurrent, isDark }
})
