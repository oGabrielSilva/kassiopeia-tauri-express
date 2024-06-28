import { IJsonAPIResult } from './JsonAPI'

export function isForbidden(
  input: Response | IJsonAPIResult<unknown> | number,
) {
  if (input instanceof Response) return input.status === 403
  return input === 403
}
