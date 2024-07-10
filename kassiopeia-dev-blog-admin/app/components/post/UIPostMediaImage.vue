<template>
  <img
    role="button"
    class="image is-3by1"
    :class="{ 'is-clickable': props.clickable }"
    :src="src"
    :alt="strings.postImgAlt"
    @click="emits('on:click')"
  />
</template>

<script setup lang="ts">
import { useI18n } from '@app/stores/useI18n'
import imgPlaceholder from '@resources/png/1280x960.png'
import { computed, defineEmits, defineProps } from 'vue'

const props = defineProps<{ src: string | null; clickable?: boolean }>()
const emits = defineEmits<{ 'on:click': [] }>()

const src = computed(() => (props.src ? props.src : imgPlaceholder))

const strings = useI18n()
</script>

<style scoped>
img {
  object-fit: cover;
  width: 100%;
}
</style>
