<template>
  <div>
    <header
      class="is-flex is-align-items-center is-justify-content-space-between"
    >
      <h1 class="title m-0">{{ strings.viewWriteTitle }}</h1>
    </header>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@app/stores/useI18n'

const strings = useI18n()
</script>

<style scoped></style>
