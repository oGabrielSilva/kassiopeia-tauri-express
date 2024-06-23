import { User } from '@app/auth/models/User'
import app from '@resources/config/app.json'
import avatarPlaceholder from '@resources/svg/user.svg'

/**
 *
 * @deprecated
 */
export function useAvatarURL(input: User | string | null | undefined) {
  if (!input) return avatarPlaceholder

  const base = input instanceof User ? input.avatarURL : input

  return String(app.api.endsWith('/') ? app.api : app.api + '/').concat(
    base.startsWith('/') ? base.slice(1) : base,
  )
}
