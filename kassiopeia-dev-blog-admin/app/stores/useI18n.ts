import ptBR from '@i18n/pt-BR'
import { defineStore } from 'pinia'

const STORAGE_KEY = '@key__i18n'

const recoveryKey = () => {
  return localStorage.getItem(STORAGE_KEY)
}

const recoveryI18n = () => {
  const key = recoveryKey()

  switch (key) {
    case 'pt-BR':
      return ptBR
    default:
      return ptBR
  }
}

export const useI18n = defineStore('I18N', {
  state: () => ({
    ...recoveryI18n(),
  }),
  actions: {
    changeTo() {
      console.log(this)
    },
  },
})
