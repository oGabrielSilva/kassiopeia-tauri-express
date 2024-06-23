<template>
  <div>
    <div class="is-flex is-align-items-start is-justify-content-space-between">
      <h1 class="pt-3 pb-5 title is-5">
        {{ strings.profilePage.socialTabTitle }}
      </h1>
      <button
        @click="() => (isModalLinkVisible = true)"
        type="button"
        class="button is-primary"
      >
        Adicionar
      </button>
    </div>

    <div v-if="links.length < 1">
      <h2>{{ strings.profilePage.linksEmpty }}</h2>
    </div>

    <UIModal
      v-if="isModalLinkVisible"
      @hide="() => (isModalLinkVisible = false)"
      :title="strings.modalAddLinkTitle"
      :cancel-button="{ text: strings.cancel }"
      :success-button="{ text: strings.save }"
    />
  </div>
</template>

<script setup lang="ts">
import UIModal from '@app/components/shared/UIModal.vue'
import { useAuth } from '@app/stores/useAuth'
import { useI18n } from '@app/stores/useI18n'
import { computed, ref } from 'vue'

const strings = useI18n()
const auth = useAuth()

const isModalLinkVisible = ref(false)

const links = computed(() => auth.user?.social ?? [])
</script>

<style scoped></style>
