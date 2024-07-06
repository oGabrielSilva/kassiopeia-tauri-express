<template>
  <section
    class="container p-3 is-flex is-flex-direction-column is-align-items-center is-justify-content-center"
  >
    <div class="has-text-centered">
      <h1 class="title mb-0">
        {{ strings.sessionTitle }}
      </h1>
      <p>{{ strings.titleHelper }}</p>
    </div>
    <div style="width: 50%" class="pt-5 pb-3">
      <UISessionForm />
    </div>
  </section>
</template>

<script setup lang="ts">
import UISessionForm from '@app/components/session/UISessionForm.vue'
import { useLayout } from '@app/composables/useLayout'
import { useI18n } from '@app/stores/useI18n'

const strings = useI18n()

useLayout('SESSION')
</script>

<style scoped>
section {
  flex: 1;
}
</style>
