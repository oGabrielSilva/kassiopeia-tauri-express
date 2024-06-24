export function isForbidden(input: Response | number) {
  if (input instanceof Response) return input.status === 403
  return input === 403
}
