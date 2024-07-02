<template>
  <div>
    <img
      :title="
        strings.avatarTitle.replace(
          '-',
          props.user ? props.user.name : auth.user?.name ?? '',
        )
      "
      :width="props.width ? props.width : '32px'"
      :height="props.height ? props.height : '32px'"
      data-avatar
      :src="props.user ? props.user.avatarURL : auth.avatarURL"
      class="is-skeleton"
      @load="
        (e) => (e.currentTarget as HTMLElement).classList.remove('is-skeleton')
      "
      @error="
        (e) => ((e.currentTarget as HTMLImageElement).src = avatarPlaceholder)
      "
    />
  </div>
</template>

<script setup lang="ts">
import type { User } from '@app/auth/models/User'
import { useAuth } from '@app/stores/useAuth'
import { useI18n } from '@app/stores/useI18n'
import avatarPlaceholder from '@resources/svg/user.svg'
import { defineProps } from 'vue'

interface IProps {
  width?: number
  height?: number
  user?: User
}

const props = defineProps<IProps>()

const auth = useAuth()
const strings = useI18n()
</script>

<style scoped>
img {
  cursor: pointer;
  object-fit: cover;
  width: 32px;
  height: 32px;
  border-radius: 100%;
}

div {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
