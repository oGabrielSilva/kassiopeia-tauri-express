import type { TLayouts } from '@app/stores/useLayout'
import { useLayout as useLay } from '@app/stores/useLayout'

export function useLayout(toLayout: TLayouts) {
  const layout = useLay()

  layout.updateTo(toLayout)
}
