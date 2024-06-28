import { User } from '@app/auth/models/User'
import type { IUser } from '@app/auth/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import avatarPlaceholder from '@resources/svg/user.svg'

const STORAGE_KEY_TOKEN = '@key__auth__token'
const STORAGE_KEY_USER = '@key__auth__user'

const storage = {
  recoveryTokenStorage() {
    return localStorage.getItem(STORAGE_KEY_TOKEN) ?? null
  },

  recoveryUserStorage() {
    const user = localStorage.getItem(STORAGE_KEY_USER)
    return user ? User.from(JSON.parse(user)) : null
  },

  saveAll(user: User, token: string) {
    localStorage.setItem(STORAGE_KEY_TOKEN, token)
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user))
  },

  saveUser(user: User) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user))
  },

  saveToken(token: string) {
    localStorage.setItem(STORAGE_KEY_TOKEN, token)
  },

  resetAll() {
    localStorage.removeItem(STORAGE_KEY_TOKEN)
    localStorage.removeItem(STORAGE_KEY_USER)
  },

  resetUser() {
    localStorage.removeItem(STORAGE_KEY_USER)
  },

  resetToken() {
    localStorage.removeItem(STORAGE_KEY_TOKEN)
  },
}

export const useAuth = defineStore('Auth', () => {
  const userRef = ref<User | null>(storage.recoveryUserStorage())
  const tokenRef = ref<string | null>(storage.recoveryTokenStorage())

  const isLoggedIn = computed(
    () =>
      userRef && userRef.value !== null && tokenRef && tokenRef.value !== null,
  )

  const user = computed(() => {
    if (isLoggedIn.value) return userRef.value
    return null
  })

  const token = computed(() => {
    if (isLoggedIn.value) return tokenRef.value
    return null
  })

  const avatarURL = computed(() => {
    if (userRef.value && userRef.value.avatarURL) return userRef.value.avatarURL
    return avatarPlaceholder
  })

  function update(user?: User | IUser, token?: string) {
    if (!user || !token) {
      userRef.value = null
      tokenRef.value = null
      storage.resetAll()
      return
    }

    const setUser = User.from(user)
    userRef.value = setUser
    tokenRef.value = token
    storage.saveAll(setUser, token)
  }

  function updateAvatarURL(url?: string | null) {
    if (url && url !== avatarURL.value) {
      update(
        User.from({ ...userRef.value, avatarURL: url }),
        tokenRef.value ?? '',
      )
    }
  }

  function deleteSocialLink(id: number) {
    if (userRef.value && userRef.value.social) {
      userRef.value = User.from({
        ...userRef.value,
        social: userRef.value.social.filter((item) => item.id !== id),
      })
    }
  }

  function signOut() {
    update(void 0, void 0)
  }

  return {
    userRef,
    isLoggedIn,
    tokenRef,
    user,
    token,
    update,
    avatarURL,
    updateAvatarURL,
    deleteSocialLink,
    signOut,
  }
})
