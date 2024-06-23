<template>
  <div>
    <img
      :title="strings.avatarTitle.replace('-', auth.user?.name ?? '')"
      width="32px"
      height="32px"
      data-avatar
      :src="auth.avatarURL"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@app/stores/useAuth'
import { useI18n } from '@app/stores/useI18n'

const auth = useAuth()
const strings = useI18n()

// const src = computed(() => {
//   if (auth.user && auth.user.avatarURL) {
//     return auth.user.avatarURL
//   }
//   return userPlaceholder
// })
</script>

<style scoped>
img {
  cursor: pointer;
  object-fit: cover;
  width: 32px;
  height: 32px;
  border-radius: 100%;
}

div {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
