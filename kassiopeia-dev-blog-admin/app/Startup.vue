<template>
  <template v-if="layout.current === 'DEFAULT'">
    <section data-global-section class="global-section">
      <UIAppBar />
      <RouterView />
    </section>
    <UIFooter />
  </template>

  <template v-if="layout.current === 'SESSION'">
    <section data-global-section class="global-section">
      <UITopAppBar />
      <RouterView />
    </section>
    <UIFooter />
  </template>

  <template v-if="layout.current === 'USER_PAGE'">
    <section data-global-section class="global-section">
      <UIUserPageAppBar />
      <RouterView />
    </section>
    <UIFooter />
  </template>
</template>

<script setup lang="ts">
import UITopAppBar from '@app/components/shared/UITopAppBar.vue'
import UIAppBar from '@app/components/home/UIAppBar.vue'
import UIFooter from '@app/components/shared/UIFooter.vue'
import { useLayout } from './stores/useLayout'
import UIUserPageAppBar from '@app/components/user/UIUserPageAppBar.vue'

const layout = useLayout()
</script>

<style scoped>
.global-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
