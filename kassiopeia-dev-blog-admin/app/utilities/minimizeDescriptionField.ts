export function minimizeDescriptionField(desc: string | null) {
  if (!desc) return ''
  if (desc.length > 100) return desc.slice(0, 100) + '...'
  return desc
}
