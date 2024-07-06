<template>
  <div>
    <div v-if="pendingFirstPostLoad">
      <h1 class="title">
        {{ strings.await }}
      </h1>

      <UIRoundedProgressBar />
    </div>
    <div v-else>div</div>
  </div>
</template>

<script setup lang="ts">
import UIRoundedProgressBar from '@app/components/shared/UIRoundedProgressBar.vue'
import { useI18n } from '@app/stores/useI18n'
import { usePost } from '@app/stores/usePost'
import { onMounted, ref } from 'vue'

const pendingFirstPostLoad = ref(true)

const post = usePost()
const strings = useI18n()

onMounted(async () => {
  await post.recoveryUserPostsIfFirstTime()
  pendingFirstPostLoad.value = false
})
</script>

<style scoped></style>
