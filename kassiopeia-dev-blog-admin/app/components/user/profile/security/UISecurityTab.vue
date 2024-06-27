<template>
  <div>
    <h1 class="pt-3 pb-5 title is-5">
      {{ strings.securityTabTitle }}
    </h1>

    <div v-if="auth.user && !auth.user.isEmailChecked" class="px-5 py-3">
      <UISecurityTabEmailVerificationPart />
    </div>

    <div class="px-5 py-3">
      <UISecurityTabEmailPart />
    </div>
    <div class="px-5 py-3">
      <UISecurityTabPasswordPart />
    </div>
  </div>

  <div class="px-5 py-3">
    <UISecurityTabForgotPasswordPart />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@app/stores/useI18n'
import UISecurityTabEmailPart from '@app/components/user/profile/security/UISecurityTabEmailPart.vue'
import UISecurityTabPasswordPart from '@app/components/user/profile/security/UISecurityTabPasswordPart.vue'
import UISecurityTabForgotPasswordPart from '@app/components/user/profile/security/UISecurityTabForgotPasswordPart.vue'
import UISecurityTabEmailVerificationPart from '@app/components/user/profile/security/UISecurityTabEmailVerificationPart.vue'
import { useAuth } from '@app/stores/useAuth'

const strings = useI18n()

const auth = useAuth()
</script>

<style setup></style>
