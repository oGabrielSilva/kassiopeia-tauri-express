<template>
  <div>
    <form @submit="updatePassword">
      <label :class="['label', theme.isDark() ? 'has-text-grey-light' : '']">
        {{ strings.changePassword }}
      </label>
      <div class="field has-addons new-password-field">
        <div class="control has-icons-left" style="width: 100%">
          <input
            type="password"
            :class="[
              'input',
              ...(passwordImputed && !isPasswordValid ? ['is-danger'] : []),
              { 'is-clickable': isPasswordInputReadonly },
            ]"
            :value="passwordImputed"
            :readonly="isPasswordInputReadonly"
            :placeholder="strings.password"
            @click="onPasswordClick"
            @input="
              (e) =>
                onPasswordImputed((e.currentTarget as HTMLInputElement).value)
            "
            id="new-password-input"
          />
          <span class="icon is-small is-left">
            <font-awesome-icon icon="key" />
          </span>
          <p v-if="passwordImputed && !isPasswordValid" class="help is-danger">
            {{ strings.passwordHelper }}
          </p>
        </div>

        <div v-if="!isPasswordInputReadonly" class="control">
          <button
            type="submit"
            class="button"
            :class="{
              'is-danger': passwordImputed.length > 0 && !isPasswordValid,
              'is-primary': isPasswordValid,
            }"
          >
            {{ strings.update }}
          </button>
        </div>
      </div>
    </form>

    <UISecurityModalConfirmPassword
      @hide="() => (isPasswordEditModalVisible = false)"
      @on:successful="onConfirmPassword"
      v-if="isPasswordEditModalVisible"
    />
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@app/stores/useTheme'
import UISecurityModalConfirmPassword from '@app/components/user/UISecurityModalConfirmPassword.vue'
import { JsonAPI } from '@app/utilities/JsonAPI'
import { isForbidden } from '@app/utilities/isForbidden'
import { forbidden } from '@app/utilities/forbidden'
import { useRouter } from 'vue-router'
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
const strings = useI18n()
const router = useRouter()

const isPasswordValid = ref(false)
const isPasswordInputReadonly = ref(true)
const passwordImputed = ref('')
const isPasswordEditModalVisible = ref(false)

function onPasswordImputed(password: string) {
  passwordImputed.value = password

  isPasswordValid.value = validation.isPasswordValid(password)
}

function onPasswordClick() {
  if (isPasswordInputReadonly.value) {
    isPasswordEditModalVisible.value = true
  }
}

function onConfirmPassword() {
  isPasswordInputReadonly.value = false
  isPasswordEditModalVisible.value = false

  document.getElementById('new-password-input')?.focus()

  anim.shakeX(document.querySelector('.new-password-field')!, false, 300)
  toaster.success(strings.passwordWarn)
}

async function updatePassword(e: Event) {
  e.preventDefault()

  if (!isPasswordValid.value) {
    toaster.warn(strings.passwordHelper)
    document.getElementById('new-password-input')?.focus()

    anim.shakeX(document.querySelector('.new-password-field')!, false, 800)
    return
  }

  const body = { password: passwordImputed.value }
  locker.lock()

  try {
    const result = await JsonAPI.request.PATCH('/user/credentials', { body })
    if (isForbidden(result.response)) return forbidden()

    if (result.error) {
      toaster.danger(result.error.message)
      return
    }

    if (result.response.ok) {
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
