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
              <span>{{ strings.profile }}</span>
            </a>
          </li>

          <li :class="{ 'is-active': tab === 'SOCIAL' }">
            <a role="button" @click="() => (tab = 'SOCIAL')">
              <span class="icon is-small">
                <font-awesome-icon icon="share-nodes" />
              </span>
              <span>{{ strings.social }}</span>
            </a>
          </li>

          <li :class="{ 'is-active': tab === 'SECURITY' }">
            <a role="button" @click="() => (tab = 'SECURITY')">
              <span class="icon is-small">
                <font-awesome-icon icon="shield-halved" />
              </span>
              <span>{{ strings.security }}</span>
            </a>
          </li>
        </ul>
      </div>

      <section v-show="tab === 'YOU'">
        <UIFormUserInfo />
      </section>
      <section v-show="tab === 'SOCIAL'">
        <UISocialTab />
      </section>

      <section v-show="tab === 'SECURITY'">
        <UISecurityTab />
      </section>
    </section>
  </UITopAppBarSafeArea>
</template>

<script setup lang="ts">
import UITopAppBarSafeArea from '@app/components/shared/UITopAppBarSafeArea.vue'
import UIFormUserInfo from '@app/components/user/profile/UIFormUserInfo.vue'
import UISocialTab from '@app/components/user/profile/UISocialTab.vue'
import UISecurityTab from '@app/components/user/profile/security/UISecurityTab.vue'
import { useLayout } from '@app/composables/useLayout'
import { useI18n } from '@app/stores/useI18n'
import { ref } from 'vue'

const strings = useI18n()
const tab = ref<'YOU' | 'SOCIAL' | 'SECURITY'>('YOU')

useLayout('USER_PAGE')
</script>

<style scoped></style>
