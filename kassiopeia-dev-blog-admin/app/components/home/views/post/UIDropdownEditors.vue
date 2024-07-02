<template>
  <div ref="dropdown" data-drop-container class="dropdown">
    <div class="dropdown-trigger">
      <button
        type="button"
        class="button is-justify-content-space-between"
        aria-haspopup="true"
        aria-controls="dropdown-menu3-editors"
        @click="show"
      >
        <span>{{ strings.selectEditor }}</span>
        <span class="icon is-small">
          <font-awesome-icon :icon="['fas', 'angle-down']" />
        </span>
      </button>
    </div>
    <div id="dropdown-menu3-editors" class="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <template v-if="!fetchPending">
          <a
            v-for="(editor, index) in editors"
            :key="index"
            role="button"
            class="dropdown-item"
            @click="
              () => {
                hide()
                emits('selected', editor)
              }
            "
          >
            <div class="is-flex is-align-items-center g-1">
              <UIAvatar :height="32" :width="32" :user="editor" />
              <div class="is-flex is-flex-direction-column">
                <span>{{ editor.name }}</span>
                <span>{{ editor.email }}</span>
              </div>
            </div>
          </a>

          <a
            v-if="editors.length <= 0"
            role="button"
            class="dropdown-item has-text-danger"
            @click="hide"
          >
            {{ strings.editorsEmpty }}
          </a>
          <hr class="dropdown-divider" />
          <a role="button" class="dropdown-item" @click="reload">
            <div class="is-flex is-align-items-start g-1">
              <span class="icon">
                <font-awesome-icon :icon="['fas', 'repeat']" />
              </span>
              <span>{{ strings.reloadList }}</span>
            </div>
          </a>
        </template>
        <a v-else data-pending role="button" class="dropdown-item">
          <div class="is-flex is-align-items-start g-1">
            <UIRoundedProgressBar :size="24" />
            <span>{{ strings.await }}</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@app/auth/models/User'
import UIRoundedProgressBar from '@app/components/shared/UIRoundedProgressBar.vue'
import UIAvatar from '@app/components/user/UIAvatar.vue'
import { useAuth } from '@app/stores/useAuth'
import { useHome } from '@app/stores/useHome'
import { useI18n } from '@app/stores/useI18n'
import { computed, defineEmits, defineProps, ref } from 'vue'

interface IProps {
  exclude: User[]
}

const props = defineProps<IProps>()

const dropdown = ref<HTMLButtonElement>()
const fetchPending = ref(false)

const strings = useI18n()
const home = useHome()
const auth = useAuth()

const emits = defineEmits<{ selected: [value: User] }>()

const editors = computed(() =>
  home.editors.arr.filter(
    (edt) =>
      edt.email !== auth.user?.email &&
      !props.exclude.find((e) => e.email === edt.email),
  ),
)

function hide() {
  dropdown.value?.classList.remove('is-active')
}

function show() {
  if (!home.editors.hadFirstFetch) {
    fetchPending.value = true
    home.loadEditors().then(() => (fetchPending.value = false))
  }
  dropdown.value?.classList.toggle('is-active')
}

function reload() {
  fetchPending.value = true
  home.loadEditors().then(() => (fetchPending.value = false))
}
</script>

<style scoped>
#dropdown-menu3-editors,
.dropdown-content,
[data-drop-container],
[data-drop-container] .dropdown-trigger,
[data-drop-container] .dropdown-trigger button {
  width: 100%;
}

[data-pending] {
  cursor: progress;
}
</style>
