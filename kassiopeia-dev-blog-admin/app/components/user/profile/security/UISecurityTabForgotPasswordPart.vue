<template>
  <div>
    <button @click="forgotPassword" type="button" class="button is-ghost px-0">
      {{ strings.forgotPassword }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@app/stores/useI18n'

const strings = useI18n()

async function forgotPassword() {}
</script>

<style scoped></style>
