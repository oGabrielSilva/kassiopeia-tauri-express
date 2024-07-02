<template>
  <div>
    <form @submit="onSubmit">
      <UIModal
        :title="strings.confirmPassword"
        :success-button="{
          text: strings.confirm,
          bulmaStyle: 'is-primary',
          hideModal: false,
          type: 'submit',
        }"
        :cancel-button="{ text: strings.cancel }"
        @hide="emits('hide')"
      >
        <div>
          <UIFieldInput
            type="email"
            :label="strings.email"
            :initial-value="auth.user?.email ?? ''"
            has-icon-left
            readonly
            disabled
          >
            <template #icon>
              <span class="icon is-small is-left">
                <font-awesome-icon icon="envelope" />
              </span>
            </template>
          </UIFieldInput>
        </div>

        <div ref="passwordInputRef">
          <UIFieldInput
            type="password"
            :initial-value="password"
            :label="strings.password"
            :helper="{
              isVisible: password.length > 0 && !isPasswordValid,
              text: strings.passwordHelper,
            }"
            has-icon-left
            @on:input="onPasswordImputed"
          >
            <template #icon>
              <span class="icon is-small is-left">
                <font-awesome-icon
                  v-if="password.length > 0 && !isPasswordValid"
                  icon="lock"
                  class="has-text-danger"
                />
                <font-awesome-icon v-else icon="unlock-keyhole" />
              </span>
            </template>
          </UIFieldInput>
        </div>
      </UIModal>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { ISessionResponse } from '@app/auth/types'
import UIFieldInput from '@app/components/shared/UIFieldInput.vue'
import UIModal from '@app/components/shared/UIModal.vue'
import { useAuth } from '@app/stores/useAuth'
import { useI18n } from '@app/stores/useI18n'
import { JsonAPI } from '@app/utilities/JsonAPI'
import { requireKassiopeiaToaster } from '@lib/kassiopeia-tools'
import {
  ScreenLockerKassiopeiaTool,
  ValidationKassiopeiaTool,
  type AnimationKassiopeiaTool,
  type ToasterKassiopeiaTool,
} from 'kassiopeia-tools'
import { defineEmits, onMounted, ref } from 'vue'

const strings = useI18n()
const auth = useAuth()

const password = ref('')
const isPasswordValid = ref(false)
const passwordInputRef = ref<HTMLElement>()

const locker = ScreenLockerKassiopeiaTool.get()
const validation = ValidationKassiopeiaTool.get()
let anim: AnimationKassiopeiaTool
let toaster: ToasterKassiopeiaTool

const emits = defineEmits<{ hide: []; 'on:successful': [] }>()

function onPasswordImputed(newPassword: string) {
  password.value = newPassword

  isPasswordValid.value = validation.isPasswordValid(newPassword)
}

function onSubmit(e: Event) {
  e.preventDefault()

  if (!isPasswordValid.value) {
    anim
      .shakeX(passwordInputRef.value!, false, 800)
      .addEventOnCompletion(() => {
        passwordInputRef.value?.querySelector('input')?.focus()
      })
    toaster.warn(strings.confirmPassword)
    return
  }

  submit()
}

async function submit() {
  const body = { password: password.value ?? '', email: auth.user?.email ?? '' }
  locker.lock()

  try {
    const result = await JsonAPI.request.POST<ISessionResponse>('/session', {
      body,
    })

    if (result.error) {
      toaster.danger(result.error.message)

      return
    }

    if (result.body && result.body.token && result.body.user) {
      auth.update(result.body.user, result.body.token)
      emits('on:successful')
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
  anim = toaster.animationTool
})
</script>

<style scoped></style>
