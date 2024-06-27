import { User } from '@app/auth/models/User'
import type { IUser } from '@app/auth/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import avatarPlaceholder from '@resources/svg/user.svg'

export const useAuth = defineStore('Auth', () => {
  const userRef = ref<User | null>(null)
  const tokenRef = ref<string | null>(null)

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
      return
    }

    userRef.value = User.from(user)
    tokenRef.value = token
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
