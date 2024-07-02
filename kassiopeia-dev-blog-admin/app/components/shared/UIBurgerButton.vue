<template>
  <button
    class="navbar-burger"
    :class="{ 'is-active': props.isActive }"
    role="button"
    aria-label="menu"
    aria-expanded="false"
    data-ui-burger-button
    @click="onClick"
  >
    <span aria-hidden="true" />
    <span aria-hidden="true" />
    <span aria-hidden="true" />
    <span aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

interface IUIBurgerProps {
  isActive: boolean
}

const props = defineProps<IUIBurgerProps>()

const emit = defineEmits<{ 'state:changed': [] }>()

function onClick() {
  emit('state:changed')
}
</script>

<style scoped>
button {
  width: 32px;
  height: 32px;
}
</style>
