<template>
  <div class="modal is-active p-3">
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <h1 class="modal-card-title">{{ props.title }}</h1>
        <button
          type="button"
          @click="() => emits('hide')"
          class="delete"
          aria-label="close"
        />
      </header>
      <section v-if="$slots.default" class="modal-card-body">
        <slot />
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button
            @click="
              (e) => {
                if (
                  typeof props.successButton!.hideModal !== 'boolean' ||
                  props.successButton!.hideModal
                ) {
                  emits('hide')
                }

                if (props.successButton && props.successButton.click) {
                  props.successButton.click(
                    e,
                    e.currentTarget as HTMLButtonElement,
                  )
                }
              }
            "
            v-if="!!props.successButton"
            :type="props.successButton?.type ?? 'button'"
            :class="[
              'button',
              ...(props.successButton.bulmaStyle
                ? [props.successButton.bulmaStyle]
                : ['is-primary']),
              ...(props.successButton.isOutlined ? ['is-outlined'] : []),
            ]"
          >
            {{ props.successButton.text }}
          </button>
          <button
            v-if="!!props.cancelButton"
            @click="
              (e) => {
                if (
                  typeof props.cancelButton!.hideModal !== 'boolean' ||
                  props.cancelButton!.hideModal
                ) {
                  emits('hide')
                }

                if (props.cancelButton && props.cancelButton.click) {
                  props.cancelButton.click(
                    e,
                    e.currentTarget as HTMLButtonElement,
                  )
                }
              }
            "
            :type="props.cancelButton?.type ?? 'button'"
            :class="[
              'button',
              ...(props.cancelButton.bulmaStyle
                ? [props.cancelButton.bulmaStyle]
                : []),
              ...(props.cancelButton.isOutlined ? ['is-outlined'] : []),
            ]"
          >
            {{ props.cancelButton.text }}
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

type TButtonClick = (e: Event, button: HTMLButtonElement) => void

type TStyleButton =
  | 'is-danger'
  | 'is-success'
  | 'is-primary'
  | 'is-link'
  | 'is-warning'

interface IModalButtonProps {
  click?: TButtonClick
  text: string
  hideModal?: boolean
  type?: 'submit' | 'reset' | 'button'
  bulmaStyle?: TStyleButton
  isOutlined?: boolean
}

interface IModalProps {
  title: string
  successButton?: IModalButtonProps
  cancelButton?: IModalButtonProps
}

const props = defineProps<IModalProps>()
const emits = defineEmits<{ hide: [] }>()

function onEsc(e: KeyboardEvent) {
  if (e.key.toLocaleLowerCase() === 'escape') emits('hide')
}

onMounted(() => {
  window.addEventListener('keydown', onEsc)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onEsc)
})
</script>

<style scoped>
.modal-card {
  max-width: 560px;
  max-height: 80%;
}
</style>
