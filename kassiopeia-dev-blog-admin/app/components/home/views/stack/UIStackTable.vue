<template>
  <div class="table-container py-5">
    <table class="table is-fullwidth is-hoverable">
      <thead>
        <tr>
          <th><abbr :title="strings.position">#</abbr></th>
          <th>{{ strings.name }}</th>
          <th>{{ strings.description }}</th>
          <th>
            <abbr :title="strings.metaDescriptionLabel">
              {{ strings.metaAbbr }}
            </abbr>
          </th>
          <th>{{ strings.actions }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="home.stacks.stacks.length < 1">
          <td colspan="5">
            {{ strings.emptyStacks }}
          </td>
        </tr>
        <tr v-for="(stack, index) in home.stacks.stacks" :key="index">
          <th @click="showStack(stack)">
            {{ index }}
          </th>
          <td @click="showStack(stack)">
            {{ stack.name }}
          </td>
          <td @click="showStack(stack)">
            {{ minimizeDescriptionField(stack.description) }}
          </td>
          <td @click="showStack(stack)">
            {{ minimizeDescriptionField(stack.metaDescription) }}
          </td>
          <td>
            <div class="buttons are-small">
              <button
                class="button"
                type="button"
                @click="stackForEditRef = stack"
              >
                <span class="icon is-small">
                  <font-awesome-icon icon="pen-to-square" />
                </span>
              </button>

              <button
                class="button is-danger is-outlined"
                @click="stackForDeleteRef = stack"
              >
                <span class="icon is-small">
                  <font-awesome-icon icon="trash-can" />
                </span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="py-3 is-flex is-justify-content-right">
      <button
        class="button is-ghost p-0 m-0"
        type="button"
        @click="updateStacks"
      >
        {{ strings.update }}
      </button>
    </div>

    <UIStackForm
      v-if="!!stackForEditRef"
      :edit-stack="stackForEditRef"
      @hide="stackForEditRef = void 0"
    />

    <UIModal
      v-if="!!stackForDeleteRef"
      :title="
        strings.disableStackModalTitle.replace('#', stackForDeleteRef.name)
      "
      :cancel-button="{ text: strings.cancel }"
      :success-button="{ text: strings['yes-disable'] }"
      @hide="disableStack"
    />

    <UIModal
      v-if="!modalProperties.isModalHidden"
      :title="modalProperties.label"
      :cancel-button="{ text: strings.ok }"
      @hide="modalProperties.isModalHidden = true"
    >
      <div>
        <p class="p-3">
          <strong>
            <code>{{ strings.description }}:</code>
          </strong>
          <span>{{ modalProperties.description }}</span>
        </p>

        <p class="p-3">
          <strong>
            <code>{{ strings.metaDescriptionLabel }}:</code>
          </strong>
          <span>{{ modalProperties.metaDescription }}</span>
        </p>
      </div>
    </UIModal>
  </div>
</template>

<script setup lang="ts">
import UIStackForm from '@app/components/home/views/stack/UIStackForm.vue'
import UIModal from '@app/components/shared/UIModal.vue'
import type { Stack } from '@app/models/Stack'
import { useHome } from '@app/stores/useHome'
import { useI18n } from '@app/stores/useI18n'
import { JsonAPI } from '@app/utilities/JsonAPI'
import { forbidden } from '@app/utilities/forbidden'
import { isForbidden } from '@app/utilities/isForbidden'
import { minimizeDescriptionField } from '@app/utilities/minimizeDescriptionField'
import {
  requireKassiopeiaScreenLocker,
  requireKassiopeiaToaster,
} from '@lib/kassiopeia-tools'
import { defineEmits, reactive, ref } from 'vue'

const modalProperties = reactive({
  label: '',
  description: '',
  metaDescription: '',

  isModalHidden: true,
})

const stackForEditRef = ref<Stack>()
const stackForDeleteRef = ref<Stack>()

const strings = useI18n()
const home = useHome()

const emits = defineEmits<{ updateStacks: [] }>()

function showStack(stack: Stack) {
  modalProperties.isModalHidden = false

  modalProperties.label = stack.name
  modalProperties.description = stack.description ?? ''
  modalProperties.metaDescription = stack.metaDescription
}

async function disableStack() {
  const toaster = await requireKassiopeiaToaster()
  const locker = await requireKassiopeiaScreenLocker()

  const stack = stackForDeleteRef.value
  stackForDeleteRef.value = void 0
  locker.lock()

  try {
    const result = await JsonAPI.request.DELETE('/stack/' + stack?.name)

    if (isForbidden(result)) return forbidden()

    if (result.error) {
      toaster.danger(result.error.message)
      return
    }

    home.updateStacks(
      home.stacks.stacks.filter((st) => st.name !== (stack?.name ?? '')),
    )
    toaster.success(strings.actionSuccess)
  } catch (error) {
    console.log(error)
    toaster.danger()
  } finally {
    locker.unlock()
  }
}

function updateStacks() {
  emits('updateStacks')
}
</script>

<style scoped>
tr {
  cursor: pointer;
}
</style>
