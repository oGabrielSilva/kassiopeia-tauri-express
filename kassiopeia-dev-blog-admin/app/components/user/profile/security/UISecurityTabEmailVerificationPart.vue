<template>
  <div>
    <p
      class="has-background-danger px-3 py-1 is-size-7 is-flex is-align-items-center g-05"
    >
      <span class="icon is-small">
        <font-awesome-icon class="has-text-light" icon="radiation" />
      </span>
      <span class="has-text-light">{{ strings.emailNotVerified }}</span>
      <button
        type="button"
        class="button p-0 is-ghost is-size-7 has-text-link-dark"
        @click="verifyStart"
      >
        {{ strings.clickToVerifyEmail }}
      </button>
    </p>

    <UIModal
      v-if="isModalVisible"
      :title="strings.verifyEmail"
      :cancel-button="{ text: strings.cancel }"
      :success-button="{
        bulmaStyle: 'is-primary',
        hideModal: false,
        type: 'submit',
        text: strings.confirm,
        click: verify,
      }"
    >
      <div ref="inputContainer">
        <UIFieldInput
          has-icon-left
          input-id="email-token"
          :initial-value="tokenImputed"
          :label="strings.verifyEmailTokenLabel"
          :type="'text'"
          @on:input="(value) => (tokenImputed = value)"
        >
          <template #icon>
            <span class="icon is-small is-left">
              <font-awesome-icon icon="barcode" />
            </span>
          </template>
        </UIFieldInput>
      </div>
    </UIModal>
  </div>
</template>

<script setup lang="ts">
import { User } from '@app/auth/models/User'
import UIFieldInput from '@app/components/shared/UIFieldInput.vue'
import UIModal from '@app/components/shared/UIModal.vue'
import { useAuth } from '@app/stores/useAuth'
import { useI18n } from '@app/stores/useI18n'
import { JsonAPI } from '@app/utilities/JsonAPI'
import { forbidden } from '@app/utilities/forbidden'
import { isForbidden } from '@app/utilities/isForbidden'
import { requireKassiopeiaToaster } from '@lib/kassiopeia-tools'
import {
  ScreenLockerKassiopeiaTool,
  type AnimationKassiopeiaTool,
  type ToasterKassiopeiaTool,
} from 'kassiopeia-tools'
import { onMounted, ref } from 'vue'

const strings = useI18n()
const auth = useAuth()

const locker = ScreenLockerKassiopeiaTool.get()
let toaster: ToasterKassiopeiaTool
let anim: AnimationKassiopeiaTool

const inputContainer = ref<HTMLElement>()
const isModalVisible = ref(false)

const tokenImputed = ref('')

async function verifyStart() {
  locker.lock()

  try {
    const result = await JsonAPI.request.POST('/user/check-email')

    if (isForbidden(result.response)) {
      return forbidden()
    }
    if (result.error) {
      toaster.danger(result.error.message)
      return
    } else {
      isModalVisible.value = true
    }
  } catch (error) {
    console.log(error)
    toaster.danger()
  } finally {
    locker.unlock()
  }
}

async function verify() {
  const token = tokenImputed.value
  if (!token || token.length <= 1) {
    anim.shakeX(inputContainer.value!, false).addEventOnCompletion(() => {
      document.getElementById('email-token')?.focus()
    })
    return
  }

  locker.lock()

  try {
    const result = await JsonAPI.request.PATCH('/user/check-email', {
      body: { token },
    })

    if (isForbidden(result.response)) {
      return forbidden()
    }

    if (result.error) {
      toaster.danger(result.error.message)
      return
    }

    if (result.response.ok) {
      const user = User.from(auth.user)
      user.isEmailChecked = true

      toaster.success(strings.emailVerificationSuccessfull)
      auth.update(user, auth.token!)
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

<style scoped>
p {
  border-radius: 8px;
}
</style>
