<template>
  <aside
    ref="menu"
    class="aside menu px-3 pb-3"
    :style="{
      paddingTop: `calc(${safeArea.uiAppBarHeight + 'px'} + 1rem)`,
      left: home.isNavbarHidden ? '-100%' : '0',
    }"
  >
    <p class="menu-label">
      {{ strings.geral }}
    </p>
    <ul class="menu-list">
      <li v-if="auth.user?.isEditor()">
        <a
          class="my-1"
          :class="{ 'is-active': home.sideMenuOptionSelected === 'DASHBOARD' }"
          @click="updateMenuOptionSelectedTo('DASHBOARD')"
        >
          <span class="icon is-small">
            <font-awesome-icon icon="chart-pie" />
          </span>
          {{ strings.dashboard }}
        </a>
      </li>
      <li>
        <a
          class="my-1"
          :class="{ 'is-active': home.sideMenuOptionSelected === 'ALL_POSTS' }"
          @click="updateMenuOptionSelectedTo('ALL_POSTS')"
        >
          <span class="icon is-small">
            <font-awesome-icon icon="border-all" />
          </span>

          {{ strings.allPosts }}
        </a>
      </li>
    </ul>

    <p class="menu-label">
      {{ strings.edition }}
    </p>
    <ul class="menu-list">
      <li v-if="auth.user?.isEditor()">
        <a
          class="my-1"
          :class="{ 'is-active': home.sideMenuOptionSelected === 'WRITE' }"
          @click="updateMenuOptionSelectedTo('WRITE')"
        >
          <span class="icon is-small">
            <font-awesome-icon icon="feather-pointed" />
          </span>
          {{ strings.write }}
        </a>
      </li>
      <li v-if="auth.user?.isEditor()">
        <a
          class="my-1"
          :class="{ 'is-active': home.sideMenuOptionSelected === 'MY_POSTS' }"
          @click="updateMenuOptionSelectedTo('MY_POSTS')"
        >
          <span class="icon is-small">
            <font-awesome-icon icon="newspaper" />
          </span>
          {{ strings.myPosts }}
        </a>
      </li>
      <li v-if="auth.user?.isEditor()">
        <a
          class="my-1"
          :class="{ 'is-active': home.sideMenuOptionSelected === 'STACKS' }"
          @click="updateMenuOptionSelectedTo('STACKS')"
        >
          <span class="icon is-small">
            <font-awesome-icon icon="cubes" />
          </span>
          {{ strings.stacks }}
        </a>
      </li>
    </ul>

    <p class="menu-label">
      {{ strings.admin }}
    </p>
    <ul class="menu-list" />

    <p class="menu-label">
      {{ strings.profile }}
    </p>
    <ul class="menu-list">
      <li>
        <RouterLink to="/user">
          <span class="icon is-small">
            <font-awesome-icon icon="user-astronaut" />
          </span>
          {{ strings.yourProfile }}
        </RouterLink>
      </li>

      <li>
        <a data-sign-out class="has-text-danger" @click="signOut">
          <span class="icon is-small">
            <font-awesome-icon icon="power-off" />
          </span>
          {{ strings.signOut }}
        </a>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { useAuth } from '@app/stores/useAuth'
import { useHome } from '@app/stores/useHome'
import { useI18n } from '@app/stores/useI18n'
import { useSafeArea } from '@app/stores/useSafeArea'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const home = useHome()
const safeArea = useSafeArea()
const strings = useI18n()
const auth = useAuth()
const router = useRouter()

const menu = ref<HTMLElement>()

function updateMenuOptionSelectedTo(
  option: typeof home.sideMenuOptionSelected,
) {
  home.updateSideMenuOptionSelected(option)
  home.updateNavbarState()
}

function signOut() {
  auth.signOut()
  router.push('/session')
}
</script>

<style scoped>
a,
.menu-label {
  user-select: none;
}

a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.aside {
  height: 100vh;
  width: 40vw;
  min-width: 260px;
  max-width: 420px;
  position: fixed;
  top: 0;
  left: 0;
  border-right: 2px solid var(--bulma-background);
  transition: all 400ms ease-in-out;
  z-index: 10;
  background: var(--bulma-body-background-color);
}
</style>
