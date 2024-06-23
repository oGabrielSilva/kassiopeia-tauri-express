<template>
  <div
    :style="{
      ...(props.size
        ? { width: props.size + 'px', height: props.size + 'px' }
        : {}),
    }"
    class="rounded-progress-bar"
  />
</template>

<script setup lang="ts">
interface IRoundedProgressBarProps {
  size?: number
}

const props = defineProps<IRoundedProgressBarProps>()
</script>

<style scoped>
.rounded-progress-bar {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--bulma-text-strong);
  border-left-color: transparent;
  border-right-color: transparent;
  border-radius: 100%;
  animation: anim-rounded-progress-bar 1000ms linear infinite;
}

@keyframes anim-rounded-progress-bar {
  to {
    transform: rotateZ(360deg);
  }
}
</style>
