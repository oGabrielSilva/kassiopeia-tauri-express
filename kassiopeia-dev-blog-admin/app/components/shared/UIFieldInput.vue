<template>
  <div class="field">
    <label class="label" :for="props.inputId">{{ props.label }}</label>
    <div
      :class="{ 'has-icons-left': props.hasIconLeft ?? false, control: true }"
    >
      <input
        ref="input"
        :class="{ input: true, 'is-danger': props.helper?.isVisible }"
        :name="props.name"
        :type="props.type"
        :id="props.inputId"
        :placeholder="props.placeholder"
        @input="() => emits('on:input', input?.value ?? '')"
      />
      <slot name="icon" />
    </div>
    <p
      v-if="props.helper && props.helper.isVisible"
      :id="props.inputId + '-helper'"
      class="help is-danger"
    >
      {{ props.helper.text }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type InputTypeHTMLAttribute } from 'vue'

interface IFieldInputProps {
  label: string
  initialValue?: string
  inputId?: string
  hasIconLeft?: boolean
  name?: string
  type: InputTypeHTMLAttribute
  placeholder?: string
  helper?: { isVisible: boolean; text: string }
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
