<template>
  <div
    ref="container"
    data-tauri-drag-region
    class="bar-container px-3 py-2 is-flex is-justify-content-space-between is-align-items-center"
  >
    <div
      data-ui-left
      class="is-flex is-justify-content-center g-1 is-align-items-center"
      data-tauri-drag-region
    >
      <UIBurgerButton
        :is-active="!home.isNavbarHidden"
        @state:changed="() => home.updateNavbarState()"
      />
      <h1
        data-tauri-drag-region
        class="title-user-select title is-7 is-family-monospace mb-0"
      >
        {{ strings.appName }}
      </h1>
    </div>

    <div class="is-flex is-align-items-center g-1">
      <div class="r-options">
        <div>
          <RouterLink to="/user">
            <UIAvatar />
          </RouterLink>
        </div>
        <div data-ui-theme>
          <UIThemeButton />
        </div>
      </div>
      <button class="hide" type="button" @click="onClickHide" />
      <button class="close-app" type="button" @click="onClickCloseApp" />
    </div>
  </div>
</template>

<script setup lang="ts">
import UIBurgerButton from '@app/components/shared/UIBurgerButton.vue'
import UIThemeButton from '@app/components/shared/UIThemeButton.vue'
import UIAvatar from '@app/components/user/UIAvatar.vue'
import { useHome } from '@app/stores/useHome'
import { useI18n } from '@app/stores/useI18n'
import { useSafeArea } from '@app/stores/useSafeArea'
import { appWindow } from '@tauri-apps/api/window'
import { onMounted, onUpdated, ref } from 'vue'

const strings = useI18n()
const safeArea = useSafeArea()
const home = useHome()

const container = ref<HTMLElement>()

function onClickHide() {
  appWindow.minimize()
}

function onClickCloseApp() {
  appWindow.close()
}

function updateSafeArea() {
  const size = container.value?.clientHeight

  if (size && size !== safeArea.uiAppBarHeight) {
    safeArea.updateUIAppBarHeight(size)
    document
      .querySelector<HTMLElement>('[data-global-section]')
      ?.style.setProperty('padding-top', size + 'px')
  }
}

onMounted(() => {
  updateSafeArea()
})

onUpdated(() => updateSafeArea())
</script>

<style scoped>
.bar-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  background: var(--bulma-body-background-color);
}

.title-user-select {
  user-select: none;
  -webkit-app-region: drag;
}

.hide,
.close-app {
  background: var(--bulma-danger-55);
  height: 14px;
  width: 14px;
  border-radius: 100%;
}

.close-app:hover {
  background: var(--bulma-danger-70);
}

.hide {
  background: var(--bulma-warning-55);
}

.hide:hover {
  background: var(--bulma-warning-70);
}

.r-options {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-right: 1rem;
}

[data-ui-theme],
[data-ui-theme] * {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
