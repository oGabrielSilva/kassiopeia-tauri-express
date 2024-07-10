<template>
  <UITopAppBarSafeArea>
    <section class="container p-6">
      <div>
        <UIPostForm />
      </div>
    </section>
  </UITopAppBarSafeArea>
</template>

<script setup lang="ts">
import UIPostForm from '@app/components/post/UIPostForm.vue'
import UITopAppBarSafeArea from '@app/components/shared/UITopAppBarSafeArea.vue'
import { useLayout } from '@app/composables/useLayout'
import { useAuth } from '@app/stores/useAuth'
import { usePost } from '@app/stores/usePost'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const auth = useAuth()
const post = usePost()
const router = useRouter()

useLayout('POST_PAGE')

onMounted(() => {
  if (!auth.isLoggedIn) router.push('/session')
  else if (post.selectedPost === null) router.push('/home')
})
</script>

<style scoped></style>
