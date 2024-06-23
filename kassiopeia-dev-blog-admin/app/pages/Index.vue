<template>
  <div class="h1 is-flex is-align-items-centered g-1">
    <UIRoundedProgressBar :size="24" />
    <h1 class="title is-6">{{ strings.await }}</h1>
  </div>
  <div class="h2">
    <h2 class="title is-4">{{ strings.appName }}</h2>
    <p>{{ strings.mainDescription }}</p>
  </div>
</template>

<script setup lang="ts">
import UIRoundedProgressBar from '@app/components/shared/UIRoundedProgressBar.vue'
import { useLayout } from '@app/composables/useLayout'
import { useAuth } from '@app/stores/useAuth'
import { useI18n } from '@app/stores/useI18n'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuth()
const strings = useI18n()

onMounted(() => {
  if (!auth.isLoggedIn) router.push('/session')
  else router.push('/home')
})

useLayout('SESSION')
</script>

<style scoped>
* {
  user-select: none;
}

.h1 {
  position: fixed;
  bottom: 5%;
  right: 5%;
}

.h2 {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
