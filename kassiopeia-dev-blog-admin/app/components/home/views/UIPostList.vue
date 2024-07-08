<template>
  <div>
    <div v-if="pendingFirstPostLoad" data-pending>
      <p>
        {{ strings.await }}
      </p>

      <UIRoundedProgressBar :size="24" />
    </div>

    <div v-else>
      <div v-if="post.userPosts.length < 1">
        <p>{{ strings.noPostRegistered }}</p>
      </div>

      <div v-for="(postItem, index) in post.userPosts" :key="index" class="p-3">
        <UIPostItem :post="postItem" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UIPostItem from '@app/components/post/UIPostItem.vue'
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

<style scoped>
[data-pending] {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: fixed;
  bottom: 5vh;
  right: 5vw;
}

img {
  object-fit: cover;
}

time {
  text-decoration: underline;
}
</style>
