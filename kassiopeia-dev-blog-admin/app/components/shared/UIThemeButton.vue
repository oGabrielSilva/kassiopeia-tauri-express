<script setup lang="ts">
import { useTheme } from '@app/stores/useTheme'
import { onMounted, watch } from 'vue'

const theme = useTheme()

onMounted(() => {
  propagateChange()
})

watch(theme, () => {
  propagateChange()
})

function propagateChange() {
  document.documentElement.dataset.theme = theme.getCurrent()
}

function toNextTheme() {
  theme.toNext()
}
</script>

<template>
  <button type="button" @click="toNextTheme">
    <font-awesome-icon v-if="!theme.isDark()" icon="moon" class="light" />
    <font-awesome-icon v-else icon="sun" class="dark" />
  </button>
</template>

<style scoped>
.dark {
  color: var(--bulma-warning);
}

.light {
  color: var(--bulma-link);
}

button {
  width: 20px;
  height: 20px;
}
</style>
