<template>
  <form @submit="onSubmit">
    <UIModal
      @hide="emits('hide')"
      :title="!!props.editStack ? strings.editStack : strings.addStack"
      :success-button="{
        text: strings.save,
        type: 'submit',
        hideModal: false,
      }"
      :cancel-button="{ text: strings.cancel }"
    >
      <UIFieldInput
        @on:input="(value) => (createStackFormMetadata.nameImputed = value)"
        type="text"
        input-id="stack-name"
        :initial-value="props.editStack ? props.editStack.name : ''"
        :label="strings.name"
        :helper="{
          text: strings.nameHelper,
          isVisible:
            !!createStackFormMetadata.nameImputed &&
            !validation.isNameValid(createStackFormMetadata.nameImputed),
        }"
        has-icon-left
      >
        <template #icon>
          <span class="icon is-small is-left">
            <font-awesome-icon :icon="['far', 'chess-bishop']" />
          </span>
        </template>
      </UIFieldInput>

      <UIFieldTextArea
        @on:input="
          (value) => (createStackFormMetadata.descriptionImputed = value)
        "
        input-id="stack-desc"
        :rows="5"
        :label="strings.description"
        :initial-value="
          props.editStack ? props.editStack.description ?? '' : ''
        "
      />

      <UIFieldTextArea
        @on:input="
          (value) => (createStackFormMetadata.metaDescriptionImputed = value)
        "
        input-id="stack-meta-desc"
        :rows="3"
        :initial-value="props.editStack ? props.editStack.metaDescription : ''"
        :label="strings.metaDescriptionLabel"
        :helper="{
          isVisible:
            !!createStackFormMetadata.metaDescriptionImputed &&
            (createStackFormMetadata.metaDescriptionImputed.length > 160 ||
              createStackFormMetadata.metaDescriptionImputed.length < 50),
          text: strings.metaDescriptionHelper,
        }"
        has-icon-left
      >
        <template #icon>
          <span class="icon is-small is-left">
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
          </span>
        </template>
      </UIFieldTextArea>
      <small class="is-size-7">
        {{ strings.metaDescriptionInfo }}
      </small>
    </UIModal>
  </form>
</template>

<script setup lang="ts">
import UIModal from '@app/components/shared/UIModal.vue'
import UIFieldInput from '@app/components/shared/UIFieldInput.vue'
import UIFieldTextArea from '@app/components/shared/UIFieldTextArea.vue'
import {
  type ToasterKassiopeiaTool,
  ValidationKassiopeiaTool,
  ScreenLockerKassiopeiaTool,
} from 'kassiopeia-tools'
import { onMounted, reactive, defineEmits } from 'vue'
import { requireKassiopeiaToaster } from '@lib/kassiopeia-tools'
import { JsonAPI } from '@app/utilities/JsonAPI'
import { isForbidden } from '@app/utilities/isForbidden'
import { forbidden } from '@app/utilities/forbidden'
import { useI18n } from '@app/stores/useI18n'
import type { IStack, Stack } from '@app/models/Stack'
import { useHome } from '@app/stores/useHome'

interface IStackFormProps {
  editStack?: Stack
}

const props = defineProps<IStackFormProps>()

const emits = defineEmits<{ hide: [] }>()

const strings = useI18n()
const home = useHome()

let toaster: ToasterKassiopeiaTool
const locker = ScreenLockerKassiopeiaTool.get()
const validation = ValidationKassiopeiaTool.get()

const createStackFormMetadata = reactive({
  nameImputed: '',
  descriptionImputed: '',
  metaDescriptionImputed: '',
})

function resetNewStackModal() {
  emits('hide')

  createStackFormMetadata.descriptionImputed = ''
  createStackFormMetadata.metaDescriptionImputed = ''
  createStackFormMetadata.nameImputed = ''
}

async function onSubmit(e: Event) {
  e.preventDefault()

  if (!!props.editStack) {
    submitEdit()
    return
  }

  if (!validation.isNameValid(createStackFormMetadata.nameImputed)) {
    toaster.warn(strings.nameHelper)

    const inp = document.getElementById('stack-name')
    toaster.animationTool
      .shakeX(inp?.parentElement!, false, 800)
      .addEventOnCompletion(() => {
        inp?.focus()
      })
    return
  }

  if (createStackFormMetadata.metaDescriptionImputed.length < 50) {
    toaster.warn(strings.metaDescriptionIsRequired)

    const inp = document.getElementById('stack-meta-desc')
    toaster.animationTool
      .shakeX(inp?.parentElement!, false, 800)
      .addEventOnCompletion(() => {
        inp?.focus()
      })
    return
  }

  locker.lock()

  try {
    const result = await JsonAPI.request.POST<IStack>('/stack', {
      body: {
        name: createStackFormMetadata.nameImputed,
        description: createStackFormMetadata.descriptionImputed,
        metaDescription: createStackFormMetadata.metaDescriptionImputed,
      },
    })

    if (isForbidden(result)) return forbidden()
    if (result.error) return toaster.danger(result.error.message)
    if (result.response.ok) {
      home.addStack(result.body)
      toaster.success(strings.actionSuccess)
      resetNewStackModal()
    }
  } catch (error) {
    console.log(error)
    toaster.danger()
  } finally {
    locker.unlock()
  }
}

async function submitEdit() {
  locker.lock()
  if (!validation.isNameValid(createStackFormMetadata.nameImputed)) {
    toaster.warn(strings.nameHelper)

    const inp = document.getElementById('stack-name')
    toaster.animationTool
      .shakeX(inp?.parentElement!, false, 800)
      .addEventOnCompletion(() => {
        inp?.focus()
      })
    return
  }

  if (createStackFormMetadata.metaDescriptionImputed.length < 50) {
    toaster.warn(strings.metaDescriptionIsRequired)

    const inp = document.getElementById('stack-meta-desc')
    toaster.animationTool
      .shakeX(inp?.parentElement!, false, 800)
      .addEventOnCompletion(() => {
        inp?.focus()
      })
    return
  }
  const stack = props.editStack!

  const payload = {
    ...(createStackFormMetadata.nameImputed !== stack.name
      ? { name: createStackFormMetadata.nameImputed }
      : {}),
    ...(createStackFormMetadata.descriptionImputed !== stack.description
      ? { description: createStackFormMetadata.descriptionImputed }
      : {}),
    ...(createStackFormMetadata.metaDescriptionImputed !== stack.metaDescription
      ? { metaDescription: createStackFormMetadata.metaDescriptionImputed }
      : {}),
  }

  if (Object.keys(payload).length <= 0) return

  try {
    const result = await JsonAPI.request.PATCH<IStack>('/stack/' + stack.name, {
      body: payload,
    })

    if (isForbidden(result)) return forbidden()
    if (result.error) return toaster.danger(result.error.message)
    if (result.response.ok) {
      const stacks = home.stacks.stacks.map((stack) => {
        if (stack.name !== props.editStack?.name) return stack

        stack.name = payload.name ? payload.name : stack.name
        stack.description = payload.description
          ? payload.description
          : stack.description
        stack.metaDescription = payload.metaDescription
          ? payload.metaDescription
          : stack.metaDescription
        return stack
      })

      home.updateStacks(stacks)

      toaster.success(strings.actionSuccess)
      resetNewStackModal()
    }
  } catch (error) {
    console.log(error)
    toaster.danger()
  } finally {
    locker.unlock()
  }
}

onMounted(async () => {
  toaster = await requireKassiopeiaToaster()
})
</script>

<style scoped></style>
