<template>
  <div ref="dropdown" data-drop-container class="dropdown">
    <div class="dropdown-trigger">
      <button
        type="button"
        class="button is-justify-content-space-between"
        aria-haspopup="true"
        aria-controls="dropdown-menu3-stacks"
        @click="show"
      >
        <span>{{ strings.addStack }}</span>
        <span class="icon is-small">
          <font-awesome-icon :icon="['fas', 'angle-down']" />
        </span>
      </button>
    </div>
    <div id="dropdown-menu3-stacks" class="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <template v-if="!fetchPending">
          <a
            v-for="(stack, index) in stacks"
            :key="index"
            role="button"
            class="dropdown-item"
            @click="
              () => {
                hide()
                emits('selected', stack)
              }
            "
          >
            <span>{{ stack.name }}</span>
          </a>

          <a
            v-if="stacks.length <= 0"
            role="button"
            class="dropdown-item has-text-danger"
            @click="hide"
          >
            {{ strings.emptyStacks }}
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
import UIRoundedProgressBar from '@app/components/shared/UIRoundedProgressBar.vue'
import { IStack, type Stack } from '@app/models/Stack'
import { useHome } from '@app/stores/useHome'
import { useI18n } from '@app/stores/useI18n'
import { JsonAPI } from '@app/utilities/JsonAPI'
import { forbidden } from '@app/utilities/forbidden'
import { isForbidden } from '@app/utilities/isForbidden'
import { computed, defineEmits, defineProps, ref } from 'vue'

interface IProps {
  exclude: Stack[]
}

const props = defineProps<IProps>()

const dropdown = ref<HTMLButtonElement>()
const fetchPending = ref(false)

const strings = useI18n()
const home = useHome()

const emits = defineEmits<{ selected: [value: Stack] }>()

const stacks = computed(() =>
  home.stacks.stacks.filter(
    (st) => !st.isLocked && !props.exclude.find((s) => s.name === st.name),
  ),
)

function hide() {
  dropdown.value?.classList.remove('is-active')
}

function show() {
  if (!home.stacks.hadFirstFetch) {
    reload()
  }
  dropdown.value?.classList.toggle('is-active')
}

async function reload() {
  fetchPending.value = true

  const result = await JsonAPI.request.GET<IStack[]>('/stack?size=100')
  if (isForbidden(result)) return forbidden()

  if (result.error) return
  home.updateStacks(result?.body ?? [])
  fetchPending.value = false
}
</script>

<style scoped>
#dropdown-menu3-stacks,
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
