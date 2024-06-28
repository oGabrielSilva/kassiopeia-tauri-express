import { ValidationKassiopeiaTool } from 'kassiopeia-tools'

export function faIconByLink(uri: string) {
  if (ValidationKassiopeiaTool.get().isEmailValid(uri)) return 'envelope'

  const { host } = new URL(uri)

  return host.includes('x')
    ? 'x-twitter'
    : host.includes('twitter')
      ? 'x-twitter'
      : host.includes('youtube') || host.includes('youtu.be')
        ? 'youtube'
        : host.includes('instagram')
          ? 'instagram'
          : host.includes('linkedin')
            ? 'linkedin'
            : host.includes('github')
              ? 'github'
              : host.includes('reddit')
                ? 'reddit'
                : 'wifi'
}
