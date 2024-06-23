<template>
  <div ref="container">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useSafeArea } from '@app/stores/useSafeArea'
import { ref, watch } from 'vue'

const container = ref<HTMLDivElement>()
const safeArea = useSafeArea()

watch(container, () => {
  container.value?.style.setProperty(
    'margin-top',
    safeArea.uiAppBarHeight + 'px',
  )
})
</script>

<style scoped></style>
