<template>
  <template v-if="layout.current === 'DEFAULT'">
    <section data-global-section class="global-section">
      <UIAppBar />
      <RouterView />
    </section>
    <UIFooter />
  </template>

  <template v-if="layout.current === 'SESSION'">
    <section data-global-section class="global-section">
      <UITopAppBar />
      <RouterView />
    </section>
    <UIFooter />
  </template>

  <template v-if="layout.current === 'USER_PAGE'">
    <section data-global-section class="global-section">
      <UIUserPageAppBar />
      <RouterView />
    </section>
    <UIFooter />
  </template>

  <template v-if="layout.current === 'POST_PAGE'">
    <section data-global-section class="global-section">
      <UIPostPageAppBar />
      <RouterView />
    </section>
    <UIFooter />
  </template>
</template>

<script setup lang="ts">
import type { ISessionResponse } from '@app/auth/types'
import UIAppBar from '@app/components/home/UIAppBar.vue'
import UIPostPageAppBar from '@app/components/post/UIPostPageAppBar.vue'
import UIFooter from '@app/components/shared/UIFooter.vue'
import UITopAppBar from '@app/components/shared/UITopAppBar.vue'
import UIUserPageAppBar from '@app/components/user/UIUserPageAppBar.vue'
import { useAuth } from '@app/stores/useAuth'
import { useLayout } from '@app/stores/useLayout'
import { requireKassiopeiaToaster } from '@lib/kassiopeia-tools'
import app from '@resources/config/app.json'
import { listen } from '@tauri-apps/api/event'
import { useI18n } from './stores/useI18n'

const layout = useLayout()

listen(app.sessionEventAnotherWindowKey, async (e) => {
  const { user, token } = e.payload as ISessionResponse

  if (typeof token === 'string' && typeof user === 'object') {
    const auth = useAuth()
    const strings = useI18n()

    const toaster = await requireKassiopeiaToaster()
    auth.update(user, token)

    toaster.success(strings.sessionInSuccessfully)
  }
})
</script>

<style scoped>
.global-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
