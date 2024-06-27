<template>
  <tr>
    <td>{{ props.link.name }}</td>
    <td>
      <a
        class="button is-ghost p-0"
        :href="props.link.uri"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ props.link.uri }}
      </a>
    </td>
    <td>
      <div class="buttons are-small">
        <button type="button" class="button">
          <span class="icon is-small">
            <font-awesome-icon icon="pen-to-square" />
          </span>
        </button>
        <button
          @click="() => (isModalDeleteVisible = true)"
          type="button"
          class="button is-danger is-outlined"
        >
          <span class="icon is-small">
            <font-awesome-icon icon="trash-can" />
          </span>
        </button>
      </div>

      <UIModal
        v-if="isModalDeleteVisible"
        :title="strings.modalRemoveSocialLinkTitle"
        @hide="hideDeleteModal"
        :cancel-button="{ text: strings['no-cancel'] }"
        :success-button="{
          text: strings['yes-remove'],
          click: onDeleteSocialLink,
          bulmaStyle: 'is-warning',
          hideModal: false,
        }"
      >
        <div>
          <p>
            {{ strings.removeSocialURLModalBody }}
            <code>{{ props.link.name }}</code>
          </p>

          <a
            class="button is-ghost p-0"
            :href="props.link.uri"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ props.link.uri }}
          </a>
        </div>
      </UIModal>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { type ISocial } from '@app/auth/types'
import UIModal from '@app/components/shared/UIModal.vue'
import { useAuth } from '@app/stores/useAuth'
import { useI18n } from '@app/stores/useI18n'
import { JsonAPI } from '@app/utilities/JsonAPI'
import { forbidden } from '@app/utilities/forbidden'
import { isForbidden } from '@app/utilities/isForbidden'
import { requireKassiopeiaToaster } from '@lib/kassiopeia-tools'
import {
  ScreenLockerKassiopeiaTool,
  type ToasterKassiopeiaTool,
} from 'kassiopeia-tools'
import { onMounted, ref } from 'vue'

interface IUITableSocialLinkItemProps {
  link: ISocial
}

const props = defineProps<IUITableSocialLinkItemProps>()

const locker = ScreenLockerKassiopeiaTool.get()
let toaster: ToasterKassiopeiaTool

const strings = useI18n()
const auth = useAuth()

const isModalDeleteVisible = ref(false)

function hideDeleteModal() {
  isModalDeleteVisible.value = false
}

async function onDeleteSocialLink() {
  locker.lock()

  try {
    const result = await JsonAPI.request.DELETE('/user/social/' + props.link.id)

    if (isForbidden(result.response)) return forbidden()

    if (result.error) {
      toaster.danger(result.error.message)
      return
    }

    if (result.response.ok) auth.deleteSocialLink(props.link.id)
    toaster.info(strings.actionSuccess)
    hideDeleteModal()
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

<style scoped>
.buttons {
  justify-content: flex-end;
}
</style>
