<template>
  <div>
    <form
      @submit="
        (e) => {
          e.preventDefault()
          submitLink()
        }
      "
      v-if="props.isModalLinkVisible"
    >
      <UIModal
        @hide="() => props.hideModalLinkVisible()"
        :title="strings.modalAddLinkTitle"
        :cancel-button="{ text: strings.cancel }"
        :success-button="{
          text: strings.save,
          hideModal: false,
          type: 'submit',
        }"
      >
        <div ref="linkNameRef">
          <UIFieldInput
            :has-icon-left="false"
            :type="'text'"
            :placeholder="strings.linkNamePlaceholder"
            :label="strings.linkNameLabel"
            :helper="{ isVisible: Boolean(!!linkName && !isLinkNameValid) }"
            :initial-value="linkName"
            @on:input="onLinkNameImputed"
          />
        </div>

        <div ref="urlRef">
          <UIFieldInput
            :has-icon-left="true"
            :type="'url'"
            :placeholder="strings.linkURLPlaceholder"
            :label="''"
            :helper="{ isVisible: Boolean(!!url && !isURLValid) }"
            :initial-value="url"
            @on:input="onURLImputed"
          >
            <template #icon>
              <span class="icon is-small is-left">
                <font-awesome-icon :icon="['fas', 'diagram-project']" />
              </span>
            </template>
          </UIFieldInput>
        </div>
      </UIModal>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ISessionResponse } from '@app/auth/types'
import UIFieldInput from '@app/components/shared/UIFieldInput.vue'
import UIModal from '@app/components/shared/UIModal.vue'
import { useAuth } from '@app/stores/useAuth'
import { useI18n } from '@app/stores/useI18n'
import { JsonAPI } from '@app/utilities/JsonAPI'
import { forbidden } from '@app/utilities/forbidden'
import { isForbidden } from '@app/utilities/isForbidden'
import { requireKassiopeiaToaster } from '@lib/kassiopeia-tools'
import {
  AnimationKassiopeiaTool,
  ScreenLockerKassiopeiaTool,
  ValidationKassiopeiaTool,
} from 'kassiopeia-tools'
import type { ToasterKassiopeiaTool } from 'kassiopeia-tools'
import { onMounted, ref } from 'vue'

interface IUIFormSocialProps {
  isModalLinkVisible: boolean
  hideModalLinkVisible: () => void
}

const props = defineProps<IUIFormSocialProps>()

const strings = useI18n()
const auth = useAuth()

const validation = ValidationKassiopeiaTool.get()
let toaster: ToasterKassiopeiaTool
const anim = AnimationKassiopeiaTool.get()
const locker = ScreenLockerKassiopeiaTool.get()

const linkName = ref('')
const isLinkNameValid = ref(false)
const url = ref('')
const isURLValid = ref(false)

const linkNameRef = ref<HTMLElement>()
const urlRef = ref<HTMLElement>()

function onLinkNameImputed(name: string) {
  linkName.value = name

  isLinkNameValid.value = validation.isNameValid(name)
}

function onURLImputed(URL: string) {
  url.value = URL

  isURLValid.value = validation.isURLValid(URL)
}

async function submitLink() {
  if (!isLinkNameValid.value) {
    toaster.warn(strings.genericFieldInvalid)
    anim
      .shakeX(linkNameRef.value!, false, 800)
      .addEventOnCompletion(() =>
        linkNameRef.value?.querySelector('input')?.focus(),
      )
    return
  }

  if (!isURLValid.value) {
    toaster.warn(strings.urlInvalid)
    anim
      .shakeX(urlRef.value!, false, 800)
      .addEventOnCompletion(() => urlRef.value?.querySelector('input')?.focus())
    return
  }

  const name = linkName.value
  const URL = url.value
  const id =
    (auth.user?.social ?? []).length > 0
      ? auth.user!.social.length +
        auth.user!.social[auth.user!.social.length].id
      : 1

  locker.lock()

  const payload = { name, uri: URL, id: id + Date.now() }
  const result = await JsonAPI.request.PATCH<ISessionResponse>('/user', {
    body: { social: payload },
  })

  try {
    if (isForbidden(result.response)) {
      forbidden()
      return
    }

    if (result.error) {
      toaster.danger(result.error.message)
      return
    }

    auth.update(result.body?.user, result.body?.token)

    linkNameRef.value!.querySelector('input')!.value = ''
    urlRef.value!.querySelector('input')!.value = ''
    props.hideModalLinkVisible()
  } catch (error) {
    console.log(error)
    toaster.danger()
  } finally {
    locker.unlock()
  }
}

onMounted(() => {
  requireKassiopeiaToaster().then((t) => (toaster = t))
})
</script>

<style scoped></style>
