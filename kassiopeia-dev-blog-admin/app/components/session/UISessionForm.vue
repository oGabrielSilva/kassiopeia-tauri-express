<template>
  <form @submit="methods.sessionUp">
    <div ref="emailInputContainer">
      <UIFieldInput
        :has-icon-left="true"
        :helper="{
          text: strings.session.emailHelper,
          isVisible: Boolean(email.value && !email.isValid),
        }"
        input-id="email"
        :label="strings.email"
        :placeholder="strings.session.emailPlaceholder"
        type="email"
        @on:input="methods.onEmailImputed"
      >
        <template #icon>
          <span class="icon is-small is-left">
            <font-awesome-icon :icon="['fas', 'envelope']" />
          </span>
        </template>
      </UIFieldInput>
    </div>

    <div ref="passwordInputContainer" class="pt-3">
      <UIFieldInput
        :has-icon-left="true"
        :helper="{
          text: strings.session.passwordHelper,
          isVisible: Boolean(password.value && !password.isValid),
        }"
        input-id="password"
        :label="strings.password"
        placeholder=""
        type="password"
        @on:input="methods.onPasswordImputed"
      >
        <template #icon>
          <span class="icon is-small is-left">
            <font-awesome-icon :icon="['fas', 'key']" />
          </span>
        </template>
      </UIFieldInput>
    </div>

    <div class="has-text-right">
      <RouterLink to="/forgot-password">
        {{ strings.forgotPassword }}
      </RouterLink>
    </div>

    <div class="is-flex g-1 pt-5 is-justify-content-end">
      <button type="button" @click="methods.signUp" class="button">
        {{ strings.signUp }}
      </button>
      <button type="submit" class="button is-primary is-outlined">
        {{ strings.signIn }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import * as kassiopeia from '@lib/kassiopeia-tools'
import { onMounted, reactive, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from '@app/stores/useI18n'
import UIFieldInput from '@app/components/shared/UIFieldInput.vue'
import { JsonAPI } from '@app/utilities/JsonAPI'
import { useAuth } from '@app/stores/useAuth'
import type { ISessionResponse } from '@app/auth/types'
import { User } from '@app/auth/models/User'

const auth = useAuth()
const strings = useI18n()
const router = useRouter()

const email = reactive({ isValid: false, value: '' })
const emailInputContainer = ref<HTMLElement>()
const password = reactive({ isValid: false, value: '' })
const passwordInputContainer = ref<HTMLElement>()

const methods = reactive({
  onEmailImputed(_: string) {},
  onPasswordImputed(_: string) {},
  sessionUp: async (_: Event) => {},
  signUp: async () => {},
})

onMounted(async () => {
  const validation = await kassiopeia.requireKassiopeiaValidation()
  const toaster = await kassiopeia.requireKassiopeiaToaster()
  const animation = await kassiopeia.requireKassiopeiaAnimation()
  const locker = await kassiopeia.requireKassiopeiaScreenLocker()

  methods.onEmailImputed = (newEmail: string) => {
    email.value = newEmail
    email.isValid = validation.isEmailValid(newEmail)
  }

  methods.onPasswordImputed = (newPassword: string) => {
    password.value = newPassword
    password.isValid = validation.isPasswordValid(newPassword)
  }

  methods.sessionUp = async (e: Event) => {
    e.preventDefault()

    if (isUserDataValid()) submit('/session')
  }

  methods.signUp = async () => {
    if (isUserDataValid()) submit('/user')
  }

  function isUserDataValid() {
    const emailContainer = emailInputContainer.value
    const passwordContainer = passwordInputContainer.value
    if (!emailContainer || !passwordContainer) {
      toaster.info(strings.tryAgain)
      return false
    }

    if (!email.isValid) {
      toaster.warn(strings.session.emailWarn)
      animation.shakeX(emailContainer, false, 700)
      emailContainer.querySelector('input')?.focus()
      return false
    }

    if (!password.isValid) {
      toaster.warn(strings.session.passwordWarn)
      animation.shakeX(passwordContainer, false, 700)
      passwordContainer.querySelector('input')?.focus()
      return false
    }

    return true
  }

  async function submit(path: string) {
    locker.lock()
    try {
      const result = await JsonAPI.request.POST<ISessionResponse>(path, {
        body: { password: password.value, email: email.value },
      })
      if (result.error) {
        toaster.danger(result.error.message)
        return
      }
      if (!result.response.ok) {
        toaster.danger()
        return
      }

      if (result.body && result.body.token && result.body.user) {
        const { token, user } = result.body
        auth.update(User.from(user), token)
      }
    } catch (error) {
      console.log(error)
      toaster.danger()
    } finally {
      locker.unlock()
    }
  }
})

if (auth.isLoggedIn) {
  router.push('/')
}

watch(auth, () => {
  if (auth.isLoggedIn) router.push('/')
})
</script>

<style scoped></style>
