<template>
  <div>
    <h1 class="pt-3 pb-5 title is-5">
      {{ strings.profilePage.userInfoTabTitle }}
    </h1>
    <form @submit="onSubmit">
      <div class="is-flex g-1">
        <div>
          <img
            class="avatar"
            :src="auth.avatarURL"
            :style="{
              border: !user.avatarURL ? '2px solid var(--bulma-primary)' : '',
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
              text: strings.profilePage.nameHelper,
            }"
            input-id="name-input"
            :label="strings.name"
            :placeholder="strings.profilePage.namePlaceholder"
            type="text"
            :initial-value="user.name"
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
          :initial-value="user.bio"
          input-id="bio"
          :placeholder="strings.profilePage.bioPlaceholder"
          :label="strings.bio"
          @on:input="(newValue) => (bioImputed = newValue)"
        >
          <template #icon>
            <span class="icon is-small is-left">
              <font-awesome-icon :icon="['fas', 'square-pen']" />
            </span>
          </template>
        </UIFieldTextArea>
        <p class="help">{{ strings.profilePage.bioHelper }}</p>
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
import { useAuth } from '@app/stores/useAuth'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import UIFieldInput from '@app/components/shared/UIFieldInput.vue'
import { useI18n } from '@app/stores/useI18n'
import {
  AnimationKassiopeiaTool,
  ScreenLockerKassiopeiaTool,
  ToasterKassiopeiaTool,
  ValidationKassiopeiaTool,
} from 'kassiopeia-tools'
import UIFieldTextArea from '@app/components/shared/UIFieldTextArea.vue'
import { requireKassiopeiaToaster } from '@lib/kassiopeia-tools'
import { JsonAPI } from '@app/utilities/JsonAPI'
import type { ISessionResponse } from '@app/auth/types'
import { useNextAvatar } from '@app/composables/useNextAvatar'

const strings = useI18n()

const auth = useAuth()
const user = computed(() => auth.user!)

const isNameValid = ref(false)

if (user === null) {
  const router = useRouter()
  router.push('/session')
}

const avatarInputRef = ref<HTMLInputElement>()
const nameInputContainer = ref<HTMLInputElement>()
const bioInputContainer = ref<HTMLInputElement>()

const validation = ValidationKassiopeiaTool.get()
const anim = AnimationKassiopeiaTool.get()
let toaster: ToasterKassiopeiaTool
const screenLocker = ScreenLockerKassiopeiaTool.get()

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
    toaster.warn(strings.profilePage.nameHelper)
    return
  }

  const name = nameImputed.value
  const bio = bioImputed.value
  const payload = {
    name: name !== user.value.name ? name : void 0,
    bio: bio !== user.value.bio ? bio : void 0,
  }

  if (!payload.name && !payload.bio) return
  if (!payload.name) delete payload.name
  if (!payload.bio) delete payload.bio

  screenLocker.lock()

  try {
    const response = await JsonAPI.request.PATCH<ISessionResponse>('/user', {
      body: payload,
    })
    if (response.error) {
      return toaster.danger(response.error.message)
    }

    toaster.success(strings.profilePage.profileUpdatedSuccessfully)
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
    if (avatarInputRef.value && avatarInputRef.value.files) {
      await useNextAvatar(avatarInputRef.value.files[0], toaster)
    }
  } catch (error) {
    console.log(error)
    toaster.danger()
  } finally {
    screenLocker.unlock()
  }
}

onMounted(async () => {
  if (!toaster) toaster = await requireKassiopeiaToaster()
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
