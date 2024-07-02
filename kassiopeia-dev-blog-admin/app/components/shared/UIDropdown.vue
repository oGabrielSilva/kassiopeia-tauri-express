<template>
  <div data-drop-container>
    <!-- eslint-disable vue/html-indent -->
    <div ref="dropdown" class="dropdown is-up">
      <div class="dropdown-trigger">
        <button
          type="button"
          class="button is-justify-content-space-between"
          aria-haspopup="true"
          aria-controls="dropdown-menu3-font"
          @click="dropdown?.classList.toggle('is-active')"
        >
          <span
            :style="{
              ...(props.isAFontSelector
                ? { fontFamily: selected.display as string }
                : {}),
            }"
          >
            {{ (selected.display as string).replace(/"/g, '') }}
          </span>
          <span class="icon is-small">
            <font-awesome-icon :icon="['fas', 'angle-up']" />
          </span>
        </button>
      </div>
      <div id="dropdown-menu3-font" class="dropdown-menu" role="menu">
        <div
          class="dropdown-content"
          :style="{
            ...(props.grid
              ? {
                  display: 'grid',
                  gridTemplateColumns: Array.from(Array(props.grid))
                    .map(() => '1fr')
                    .join(' '),
                }
              : {}),
          }"
        >
          <a
            v-for="(opt, index) in options"
            :key="index"
            role="button"
            class="dropdown-item"
            :style="generateFontFamily(opt)"
            @click="select(opt)"
          >
            {{ opt.display }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue'

type TOption = Record<
  string,
  | string
  | number
  | boolean
  | { [key: string]: [value: string | number | boolean] }
>

interface IProps {
  options: Array<TOption>
  grid?: number
  isAFontSelector?: boolean
}

const props = defineProps<IProps>()

const emits = defineEmits<{
  changed: [value: TOption]
}>()

const dropdown = ref<HTMLElement>()
const selected = ref(props.options[0])

function select(opt: TOption) {
  dropdown.value?.classList.remove('is-active')

  selected.value = opt

  emits('changed', opt)
}

function generateFontFamily(opt: TOption) {
  const font = {
    ...(props.isAFontSelector
      ? {
          fontFamily: '"' + (opt.face as string) + '"' + ', ' + opt.generic,
        }
      : {}),
  }

  return font
}
</script>

<style scoped>
[data-drop-container],
[data-drop-container] .dropdown,
[data-drop-container] .dropdown .dropdown-trigger,
[data-drop-container] .dropdown .dropdown-trigger button {
  width: 100%;
}
</style>
