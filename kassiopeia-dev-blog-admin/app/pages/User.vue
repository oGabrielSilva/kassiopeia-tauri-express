<template>
  <UITopAppBarSafeArea>
    <section data-origin class="py-3 px-5">
      <div class="tabs is-boxed is-small is-right">
        <ul>
          <li :class="{ 'is-active': tab === 'YOU' }">
            <a role="button" @click="() => (tab = 'YOU')">
              <span class="icon is-small">
                <font-awesome-icon icon="user-doctor" />
              </span>
              <span>{{ strings.profilePage.profile }}</span>
            </a>
          </li>

          <li :class="{ 'is-active': tab === 'SOCIAL' }">
            <a role="button" @click="() => (tab = 'SOCIAL')">
              <span class="icon is-small">
                <font-awesome-icon icon="share-nodes" />
              </span>
              <span>{{ strings.profilePage.social }}</span>
            </a>
          </li>

          <li :class="{ 'is-active': tab === 'SECURITY' }">
            <a role="button" @click="() => (tab = 'SECURITY')">
              <span class="icon is-small">
                <font-awesome-icon icon="shield-halved" />
              </span>
              <span>{{ strings.profilePage.security }}</span>
            </a>
          </li>
        </ul>
      </div>

      <UIFormUserInfo v-show="tab === 'YOU'" />
      <UIFormSocial v-show="tab === 'SOCIAL'" />
    </section>
  </UITopAppBarSafeArea>
</template>

<script setup lang="ts">
import UITopAppBarSafeArea from '@app/components/shared/UITopAppBarSafeArea.vue'
import UIFormUserInfo from '@app/components/user/profile/UIFormUserInfo.vue'
import UIFormSocial from '@app/components/user/profile/UIFormSocial.vue'
import { useLayout } from '@app/composables/useLayout'
import { useI18n } from '@app/stores/useI18n'
import { ref } from 'vue'

const strings = useI18n()
const tab = ref<'YOU' | 'SOCIAL' | 'SECURITY'>('YOU')

useLayout('USER_PAGE')
</script>

<style scoped></style>
