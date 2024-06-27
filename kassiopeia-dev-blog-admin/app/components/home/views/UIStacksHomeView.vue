<template>
  <div>
    <UIViewHeader
      :title="strings.stacksTitle"
      @click:add="stackMetadata.isModalCreateVisible = true"
    />

    <form @submit="onSubmitNewStack" v-if="stackMetadata.isModalCreateVisible">
      <UIModal
        @hide="stackMetadata.isModalCreateVisible = false"
        :title="strings.addStack"
        :success-button="{
          text: strings.save,
          type: 'submit',
          hideModal: false,
        }"
        :cancel-button="{ text: strings.cancel }"
      >
        <UIFieldInput
          @on:input="(value) => (stackMetadata.nameImputed = value)"
          type="text"
          input-id="stack-name"
          :label="strings.name"
          :helper="{
            text: strings.nameHelper,
            isVisible:
              !!stackMetadata.nameImputed &&
              !validation.isNameValid(stackMetadata.nameImputed),
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
          @on:input="(value) => (stackMetadata.descriptionImputed = value)"
          input-id="stack-desc"
          :rows="5"
          :label="strings.description"
        />

        <UIFieldTextArea
          @on:input="(value) => (stackMetadata.metaDescriptionImputed = value)"
          input-id="stack-meta-desc"
          :rows="3"
          :label="strings.metaDescriptionLabel"
          has-icon-left
          :helper="{
            isVisible:
              !!stackMetadata.metaDescriptionImputed &&
              (stackMetadata.metaDescriptionImputed.length > 160 ||
                stackMetadata.metaDescriptionImputed.length < 50),
            text: strings.metaDescriptionHelper,
          }"
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
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@app/stores/useI18n'
import UIViewHeader from '@app/components/home/UIViewHeader.vue'
import UIModal from '@app/components/shared/UIModal.vue'
import { onMounted, reactive } from 'vue'
import UIFieldInput from '@app/components/shared/UIFieldInput.vue'
import UIFieldTextArea from '@app/components/shared/UIFieldTextArea.vue'
import {
  type ToasterKassiopeiaTool,
  ValidationKassiopeiaTool,
  ScreenLockerKassiopeiaTool,
} from 'kassiopeia-tools'
import { requireKassiopeiaToaster } from '@lib/kassiopeia-tools'
import { JsonAPI } from '@app/utilities/JsonAPI'
import { isForbidden } from '@app/utilities/isForbidden'
import { forbidden } from '@app/utilities/forbidden'

const validation = ValidationKassiopeiaTool.get()
let toaster: ToasterKassiopeiaTool
const locker = ScreenLockerKassiopeiaTool.get()

const strings = useI18n()

const stackMetadata = reactive({
  isModalCreateVisible: false,
  nameImputed: '',
  descriptionImputed: '',
  metaDescriptionImputed: '',
})

async function onSubmitNewStack(e: Event) {
  e.preventDefault()

  if (!validation.isNameValid(stackMetadata.nameImputed)) {
    toaster.warn(strings.nameHelper)

    const inp = document.getElementById('stack-name')
    toaster.animationTool
      .shakeX(inp?.parentElement!, false, 800)
      .addEventOnCompletion(() => {
        inp?.focus()
      })
    return
  }

  if (stackMetadata.metaDescriptionImputed.length < 50) {
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
    const result = await JsonAPI.request.POST('/stack', {
      body: {
        name: stackMetadata.nameImputed,
        description: stackMetadata.descriptionImputed,
        metaDescription: stackMetadata.metaDescriptionImputed,
      },
    })

    if (isForbidden(result)) return forbidden()
    if (result.error) return toaster.danger(result.error.message)
    if (result.response.ok) {
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

function resetNewStackModal() {
  stackMetadata.isModalCreateVisible = false
  stackMetadata.descriptionImputed = ''
  stackMetadata.metaDescriptionImputed = ''
  stackMetadata.nameImputed = ''
}

onMounted(async () => {
  toaster = await requireKassiopeiaToaster()
})
</script>

<style scoped></style>
