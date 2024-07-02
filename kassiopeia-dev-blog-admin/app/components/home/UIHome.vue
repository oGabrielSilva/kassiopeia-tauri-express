<template>
  <div>
    <section v-if="view === 'STACKS'" class="container">
      <UIStacksHomeView />
    </section>

    <section v-if="view === 'WRITE'" class="container">
      <UIWritePostView />
    </section>
  </div>
</template>

<script setup lang="ts">
import UIStacksHomeView from '@app/components/home/views/UIStacksHomeView.vue';
import UIWritePostView from '@app/components/home/views/UIWritePostView.vue';
import { useHome } from '@app/stores/useHome';
import { computed } from 'vue';

const home = useHome()

const view = computed(() => home.sideMenuOptionSelected)
</script>

<style scoped>
.container {
  padding: 3rem;
}
</style>
