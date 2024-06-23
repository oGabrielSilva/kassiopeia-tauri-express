<template>
  <button
    class="navbar-burger"
    :class="{ 'is-active': isActive }"
    role="button"
    aria-label="menu"
    aria-expanded="false"
    @click="onClick"
    data-ui-burger-button
  >
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isActive = ref(false)

const emit = defineEmits<{ 'state:changed': [state: boolean] }>()

function onClick() {
  isActive.value = !isActive.value
  emit('state:changed', isActive.value)
}
</script>

<style scoped>
button {
  width: 32px;
  height: 32px;
}
</style>
