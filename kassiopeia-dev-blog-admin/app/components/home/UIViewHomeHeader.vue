<template>
  <header
    class="is-flex is-align-items-center is-justify-content-space-between"
  >
    <h1 class="title m-0">
      {{ props.title }}
    </h1>
    <button type="button" class="button is-link" @click="emits('click:add')">
      <span class="icon is-small">
        <font-awesome-icon :icon="['fas', 'plus']" />
      </span>
      <span>{{ strings.add }}</span>
    </button>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from '@app/stores/useI18n'
import { defineEmits, defineProps } from 'vue'

interface IProps {
  title: string
}

const props = defineProps<IProps>()
const emits = defineEmits<{
  'click:add': []
}>()

const strings = useI18n()
</script>

<style scoped></style>
