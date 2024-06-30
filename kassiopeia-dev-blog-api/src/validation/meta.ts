export function isMetaDescriptionValid(meta: string | null | undefined) {
  return typeof meta === 'string' && meta.length >= 50 && meta.length <= 160;
}
