<template>
  <div class="modal is-active p-3">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <h1 class="modal-card-title">{{ props.title }}</h1>
        <button
          type="button"
          @click="() => emits('hide')"
          class="delete"
          aria-label="close"
        ></button>
      </header>
      <section class="modal-card-body">
        <slot />
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button
            @click="
              (e) => {
                if (props.successButton?.click)
                  props.successButton?.click(
                    e,
                    e.currentTarget as HTMLButtonElement,
                  )

                emits('hide')
              }
            "
            v-if="!!props.successButton"
            type="button"
            class="button is-primary"
          >
            {{ props.successButton.text }}
          </button>
          <button
            @click="
              (e) => {
                if (props.cancelButton?.click)
                  props.cancelButton?.click(
                    e,
                    e.currentTarget as HTMLButtonElement,
                  )

                emits('hide')
              }
            "
            v-if="!!props.cancelButton"
            type="button"
            :class="[
              'button',
              ...(props.cancelButton.isDanger
                ? ['is-danger', 'is-outlined']
                : []),
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
import { onMounted } from 'vue'

type TButtonClick = (e: Event, button: HTMLButtonElement) => void

interface IModalProps {
  title: string
  successButton?: {
    click?: TButtonClick
    text: string
  }
  cancelButton?: {
    isDanger?: boolean
    click?: TButtonClick
    text: string
  }
}

const props = defineProps<IModalProps>()
const emits = defineEmits<{ hide: [] }>()

function onEsc(e: KeyboardEvent) {
  if (e.key.toLocaleLowerCase() === 'escape') emits('hide')
}

onMounted(() => {
  window.addEventListener('keydown', onEsc)
})
</script>

<style scoped>
.modal-card {
  max-width: 560px;
}
</style>
