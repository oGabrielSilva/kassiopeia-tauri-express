<template>
  <footer class="p-3">
    <div class="columns">
      <div class="column is-two-thirds">
        <h3>
          <strong>{{ strings.appName }}</strong>
        </h3>
        <p class="is-size-7">
          {{ strings.appDescription }}
        </p>
      </div>
      <div class="column has-text-right">
        <h3><strong>Links</strong></h3>
        <ul>
          <li>
            <a target="_blank" class="is-size-7" href="/">
              {{ strings.appPublicName }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div
      class="content is-flex is-align-items-center is-justify-content-space-between footer-footer"
    >
      <div class="is-flex is-align-items-center lk">
        <a class="is-size-7" href="/report" rel="noopener noreferrer">
          {{ strings.findAProblem }}
        </a>
        <a class="is-size-7" href="/terms" rel="noopener noreferrer">
          {{ strings.terms }}
        </a>
      </div>
      <div>
        <p class="is-size-7 has-text-right">
          &copy; 2024
          <a href="/gabriel-henrique-da-silva" rel="noopener noreferrer">
            Gabriel Henrique da Silva
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from '@app/stores/useI18n'

const strings = useI18n()
</script>

<style scoped>
.lk {
  gap: 1rem;
}
</style>
