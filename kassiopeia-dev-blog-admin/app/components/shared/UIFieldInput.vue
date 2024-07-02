<template>
  <div class="field">
    <label class="label" :for="props.inputId">{{ props.label }}</label>
    <div
      :class="{ 'has-icons-left': props.hasIconLeft ?? false, control: true }"
    >
      <!-- eslint-disable-next-line vue/html-self-closing -->
      <input
        :id="props.inputId"
        ref="input"
        :class="{
          input: true,
          'is-danger': props.helper?.isVisible && !!input?.value.length,
          'is-clickable': props.readonly,
        }"
        :name="props.name"
        :type="props.type"
        :placeholder="props.placeholder"
        :readonly="props.readonly"
        :disabled="props.disabled"
        @input="() => emits('on:input', input?.value ?? '')"
      />
      <slot name="icon" />
    </div>
    <p
      v-if="
        !!(
          props.helper &&
          props.helper.isVisible &&
          props.helper.text &&
          !!input?.value.length
        )
      "
      :id="props.inputId + '-helper'"
      class="help is-danger"
    >
      {{ props.helper.text }}
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  defineEmits,
  defineProps,
  onMounted,
  ref,
  type InputTypeHTMLAttribute,
} from 'vue'

interface IFieldInputProps {
  label: string
  initialValue?: string
  inputId?: string
  hasIconLeft?: boolean
  name?: string
  type: InputTypeHTMLAttribute
  placeholder?: string
  helper?: { isVisible: boolean; text?: string }
  readonly?: boolean
  disabled?: boolean
}

const input = ref<HTMLInputElement>()
const emits = defineEmits<{ 'on:input': [value: string] }>()
const props = defineProps<IFieldInputProps>()

onMounted(() => {
  if (input.value) {
    input.value.value = props.initialValue ?? ''
    emits('on:input', input?.value.value ?? '')
  }
})
</script>

<style scoped></style>
