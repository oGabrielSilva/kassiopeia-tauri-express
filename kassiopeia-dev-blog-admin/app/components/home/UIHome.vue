<template>
  <div>
    <section class="container" v-if="view === 'STACKS'">
      <UIStacksHomeView />
    </section>

    <section class="container" v-if="view === 'WRITE'">
      <UIWritePostView />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHome } from '@app/stores/useHome'
import UIStacksHomeView from '@app/components/home/views/UIStacksHomeView.vue'
import { computed } from 'vue'
import UIWritePostView from '@app/components/home/views/UIWritePostView.vue'

const home = useHome()

const view = computed(() => home.sideMenuOptionSelected)
</script>

<style scoped>
.container {
  padding: 3rem;
}
</style>
