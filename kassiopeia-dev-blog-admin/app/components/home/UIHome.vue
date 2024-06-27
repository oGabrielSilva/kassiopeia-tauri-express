<template>
  <div>
    <section class="container" v-if="view === 'STACKS'">
      <UIStacksHomeView />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHome } from '@app/stores/useHome'
import UIStacksHomeView from '@app/components/home/views/UIStacksHomeView.vue'
import { computed } from 'vue'

const home = useHome()

const view = computed(() => home.sideMenuOptionSelected)
</script>

<style scoped>
.container {
  padding: 3rem;
}
</style>
