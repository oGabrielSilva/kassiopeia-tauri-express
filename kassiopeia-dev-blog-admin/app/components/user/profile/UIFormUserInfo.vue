<template>
  <div>
    <h1 class="pt-3 pb-5 title is-5">
      {{ strings.userInfoTabTitle }}
    </h1>
    <form @submit="onSubmit">
      <div class="is-flex g-1">
        <div>
          <img
            class="avatar"
            :src="auth.avatarURL"
            :style="{
              border:
                auth.user && auth.user.avatarURL
                  ? ''
                  : '2px solid var(--bulma-primary)',
            }"
            width="82px"
            height="82px"
            title="Seu avatar. Clique para alterar"
            @click="() => avatarInputRef?.click()"
          />
          <input
            ref="avatarInputRef"
            accept="image/jpeg, image/png, image/webp"
            type="file"
            v-show="false"
            @input="onAvatarChanged"
          />
        </div>
        <div ref="nameInputContainer" data-name style="flex: 1">
          <UIFieldInput
            :has-icon-left="true"
            :helper="{
              isVisible: !isNameValid,
              text: strings.nameHelper,
            }"
            input-id="name-input"
            :label="strings.name"
            :placeholder="strings.namePlaceholder"
            type="text"
            :initial-value="auth.user?.name ?? ''"
            @on:input="onNameImputed"
          >
            <template #icon>
              <span class="icon is-small is-left">
                <font-awesome-icon :icon="['fas', 'signature']" />
              </span>
            </template>
          </UIFieldInput>
        </div>
      </div>

      <div ref="bioInputContainer" data-bio class="py-2">
        <UIFieldTextArea
          :rows="8"
          :has-icon-left="true"
          :initial-value="auth.user?.bio ?? ''"
          input-id="bio"
          :placeholder="strings.bioPlaceholder"
          :label="strings.bio"
          @on:input="(newValue) => (bioImputed = newValue)"
        >
          <template #icon>
            <span class="icon is-small is-left">
              <font-awesome-icon :icon="['fas', 'square-pen']" />
            </span>
          </template>
        </UIFieldTextArea>
        <p class="help">{{ strings.bioHelper }}</p>
      </div>

      <div class="py-3 is-flex is-align-items-end is-flex-direction-column">
        <button type="submit" class="button is-primary">
          {{ strings.saveChanges }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import app from '@resources/config/app.json'
import { useAuth } from '@app/stores/useAuth'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import UIFieldInput from '@app/components/shared/UIFieldInput.vue'
import { useI18n } from '@app/stores/useI18n'
import {
  AnimationKassiopeiaTool,
  ImageKassiopeiaProcessingTool,
  ScreenLockerKassiopeiaTool,
  ToasterKassiopeiaTool,
  ValidationKassiopeiaTool,
} from 'kassiopeia-tools'
import UIFieldTextArea from '@app/components/shared/UIFieldTextArea.vue'
import { requireKassiopeiaToaster } from '@lib/kassiopeia-tools'
import { JsonAPI } from '@app/utilities/JsonAPI'
import type { ISessionResponse } from '@app/auth/types'
import { isForbidden } from '@app/utilities/isForbidden'
import { forbidden } from '@app/utilities/forbidden'

const strings = useI18n()
const router = useRouter()
const auth = useAuth()

const isNameValid = ref(false)

const avatarInputRef = ref<HTMLInputElement>()
const nameInputContainer = ref<HTMLInputElement>()
const bioInputContainer = ref<HTMLInputElement>()

const validation = ValidationKassiopeiaTool.get()
const anim = AnimationKassiopeiaTool.get()
const screenLocker = ScreenLockerKassiopeiaTool.get()
const imageTool = ImageKassiopeiaProcessingTool.get()
let toaster: ToasterKassiopeiaTool

const nameImputed = ref('')
const bioImputed = ref('')

function onNameImputed(newName: string) {
  isNameValid.value = validation.isNameValid(newName)
  nameImputed.value = newName
}

async function onSubmit(e: Event) {
  e.preventDefault()
  if (!nameInputContainer.value || !bioInputContainer.value) return
  if (!isNameValid.value) {
    anim
      .shakeX(nameInputContainer.value, false, 500)
      .addEventOnCompletion(() =>
        nameInputContainer.value?.querySelector('input')?.focus(),
      )
    toaster.warn(strings.nameHelper)
    return
  }

  const name = nameImputed.value
  const bio = bioImputed.value
  const payload = {
    name: name !== auth.user?.name ? name : void 0,
    bio: bio !== auth.user?.bio ? bio : void 0,
  }

  if (!payload.name && !payload.bio) return
  if (!payload.name) delete payload.name
  if (!payload.bio) delete payload.bio

  screenLocker.lock()

  try {
    const response = await JsonAPI.request.PATCH<ISessionResponse>('/user', {
      body: payload,
    })
    if (isForbidden(response.response)) {
      forbidden()
      return
    }

    if (response.error) {
      return toaster.danger(response.error.message)
    }

    toaster.success(strings.profileUpdatedSuccessfully)
    auth.update(response.body?.user, response.body?.token)
  } catch (error) {
    console.log(error)
    toaster.danger()
  } finally {
    screenLocker.unlock()
  }
}

async function onAvatarChanged() {
  screenLocker.lock()
  try {
    if (!avatarInputRef.value || !avatarInputRef.value.files) return
    const file = avatarInputRef.value.files[0]

    if (!file.type.startsWith('image/')) {
      toaster.info(strings.avatarNeedsToBeImage)
      return null
    }

    const blob = await imageTool.convertFileToWebpBlobWithoutClipping(
      file,
      0.75,
    )

    if (!blob) {
      toaster.warn(strings.errorProcessingSelectedImage)
      return null
    }

    if (blob.size > app.AVATAR_MAX_WIDTH) {
      toaster.warn(strings.avatarTooLarge)
      return null
    }

    if (!auth.token) return null

    const data = new FormData()

    data.set('avatar', blob)

    const response = await fetch(JsonAPI.resolvePath('/user/avatar'), {
      body: data,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      const url = data.url as string
      auth.updateAvatarURL(url)
      return
    }

    const { message } = await response.json()
    toaster.danger(message)
  } catch (error) {
    console.log(error)
    toaster.danger()
  } finally {
    screenLocker.unlock()
  }
}

onMounted(async () => {
  if (!toaster) toaster = await requireKassiopeiaToaster()

  if (!auth.user) {
    router.push('/session')
  }
})
</script>

<style scoped>
.avatar {
  object-fit: cover;
  width: 82px;
  height: 82px;
  border-radius: 2.1rem;
  cursor: pointer;
}
</style>
