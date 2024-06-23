import { useAuth } from '@app/stores/useAuth'
import { useI18n } from '@app/stores/useI18n'
import { JsonAPI } from '@app/utilities/JsonAPI'
import { requireKassiopeiaToaster } from '@lib/kassiopeia-tools'
import {
  ImageKassiopeiaProcessingTool,
  ToasterKassiopeiaTool,
} from 'kassiopeia-tools'

export const AVATAR_MAX_WIDTH = 3145728

export async function useNextAvatar(
  file: File,
  toaster?: ToasterKassiopeiaTool,
) {
  if (!toaster) toaster = await requireKassiopeiaToaster()

  const strings = useI18n()
  if (!file.type.startsWith('image/')) {
    toaster.info(strings.profilePage.avatarNeedsToBeImage)
    return null
  }

  const imageTool = ImageKassiopeiaProcessingTool.get()
  const blob = await imageTool.convertFileToWebpBlobWithoutClipping(file, 0.8)

  if (!blob) {
    toaster.warn(strings.profilePage.errorProcessingSelectedImage)
    return null
  }

  if (blob.size > AVATAR_MAX_WIDTH) {
    toaster.warn(strings.profilePage.avatarTooLarge)
    return null
  }

  const auth = useAuth()
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
    return url
  }

  const { message } = await response.json()
  toaster.danger(message)
  return null
}
