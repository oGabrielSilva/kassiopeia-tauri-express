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

    <div v-else class="table-container">
      <table class="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>{{ strings.name }}</th>
            <th>{{ strings.url }}</th>
            <th data-action>{{ strings.actions }}</th>
          </tr>
        </thead>
        <tbody>
          <UITableSocialLinkItem
            v-for="(link, index) in auth.user?.social ?? []"
            :link="link"
            :key="index"
          />
        </tbody>
      </table>
    </div>

    <UIFormSocial
      :hide-modal-link-visible="hideModalLinkVisible"
      :is-modal-link-visible="isModalLinkVisible"
    />
  </div>
</template>

<script setup lang="ts">
import UIFormSocial from '@app/components/user/profile/UIFormSocial.vue'
import { useAuth } from '@app/stores/useAuth'
import { useI18n } from '@app/stores/useI18n'
import { computed, ref } from 'vue'
import UITableSocialLinkItem from './UITableSocialLinkItem.vue'

const auth = useAuth()
const strings = useI18n()

const links = computed(() => auth.user?.social ?? [])

const isModalLinkVisible = ref(false)

function hideModalLinkVisible() {
  isModalLinkVisible.value = false
}
</script>

<style scoped>
[data-action] {
  text-align: end !important;
}
</style>
