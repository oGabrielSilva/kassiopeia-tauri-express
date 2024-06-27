<template>
  <button
    class="navbar-burger"
    :class="{ 'is-active': props.isActive }"
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
