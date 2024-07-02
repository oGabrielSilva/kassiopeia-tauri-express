export function isMetaDescriptionValid(desc: string | null | undefined) {
  return typeof desc === 'string' && desc.length >= 50 && desc.length <= 160
}
