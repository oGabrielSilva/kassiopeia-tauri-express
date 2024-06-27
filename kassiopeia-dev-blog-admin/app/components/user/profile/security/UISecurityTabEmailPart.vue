<template>
  <div>
    <form @submit="updateEmail">
      <label :class="['label', theme.isDark() ? 'has-text-grey-light' : '']">
        {{ auth.user?.email ?? strings.email }}
      </label>
      <div class="field has-addons new-email-field">
        <div class="control has-icons-left" style="width: 100%">
          <input
            type="email"
            :class="[
              'input',
              ...(emailImputed && !isEmailValid ? ['is-danger'] : []),
              { 'is-clickable': isEmailInputReadonly },
            ]"
            :value="emailImputed"
            :readonly="isEmailInputReadonly"
            :placeholder="auth.user?.email ?? strings.emailPlaceholder"
            @click="onEmailClick"
            @input="
              (e) => onEmailImputed((e.currentTarget as HTMLInputElement).value)
            "
            id="new-email-input"
          />
          <span class="icon is-small is-left">
            <font-awesome-icon icon="envelope" />
          </span>
          <p v-if="emailImputed && !isEmailValid" class="help is-danger">
            {{ strings.emailHelper }}
          </p>
        </div>

        <div v-if="!isEmailInputReadonly" class="control">
          <button
            type="submit"
            class="button"
            :class="{
              'is-danger': emailImputed.length > 0 && !isEmailValid,
              'is-primary': isEmailValid,
            }"
          >
            {{ strings.update }}
          </button>
        </div>
      </div>
    </form>

    <UISecurityModalConfirmPassword
      @hide="() => (isEmailEditModalVisible = false)"
      @on:successful="onConfirmPassword"
      v-if="isEmailEditModalVisible"
    />
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@app/stores/useTheme'
import UISecurityModalConfirmPassword from '@app/components/user/UISecurityModalConfirmPassword.vue'
import { JsonAPI } from '@app/utilities/JsonAPI'
import { isForbidden } from '@app/utilities/isForbidden'
import { forbidden } from '@app/utilities/forbidden'
import { IUser } from '@app/auth/types'
import { useRouter } from 'vue-router'
import { useAuth } from '@app/stores/useAuth'
import { requireKassiopeiaToaster } from '@lib/kassiopeia-tools'
import { onMounted, ref } from 'vue'
import {
  AnimationKassiopeiaTool,
  type ToasterKassiopeiaTool,
  ValidationKassiopeiaTool,
  ScreenLockerKassiopeiaTool,
} from 'kassiopeia-tools'
import { useI18n } from '@app/stores/useI18n'

const validation = ValidationKassiopeiaTool.get()
const anim = AnimationKassiopeiaTool.get()
const locker = ScreenLockerKassiopeiaTool.get()
let toaster: ToasterKassiopeiaTool

const theme = useTheme()
const auth = useAuth()
const strings = useI18n()
const router = useRouter()

const isEmailValid = ref(false)
const isEmailInputReadonly = ref(true)
const emailImputed = ref('')
const isEmailEditModalVisible = ref(false)

function onEmailImputed(email: string) {
  emailImputed.value = email

  isEmailValid.value = validation.isEmailValid(email)
}

function onEmailClick() {
  if (isEmailInputReadonly.value) {
    isEmailEditModalVisible.value = true
  }
}

function onConfirmPassword() {
  isEmailInputReadonly.value = false
  isEmailEditModalVisible.value = false

  document.getElementById('new-email-input')?.focus()

  anim.shakeX(document.querySelector('.new-email-field')!, false, 300)
  toaster.success(strings.emailWarn)
}

async function updateEmail(e: Event) {
  e.preventDefault()

  if (!isEmailValid.value) {
    toaster.warn(strings.emailHelper)
    document.getElementById('new-email-input')?.focus()

    anim.shakeX(document.querySelector('.new-email-field')!, false, 800)
    return
  }

  const body = { email: emailImputed.value }
  locker.lock()

  try {
    const result = await JsonAPI.request.PATCH('/user/credentials', { body })
    if (isForbidden(result.response)) return forbidden()

    if (result.error) {
      toaster.danger(result.error.message)
      return
    }

    if (result.response.ok) {
      auth.update(
        { ...auth.user, email: emailImputed.value } as IUser,
        auth.token ?? '',
      )

      toaster.success(strings.actionSuccess)
      router.back()
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
