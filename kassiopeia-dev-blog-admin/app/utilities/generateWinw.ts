import { WebviewWindow } from '@tauri-apps/api/window'

interface IWinProps {
  center?: boolean
  height?: number
  width?: number
  focus?: boolean
  hiddenTitle?: boolean
  decorations?: boolean
  transparent?: boolean
}

export function generateWinw(url: string, props?: IWinProps) {
  const win = new WebviewWindow('Session', {
    center: props?.center ?? true,
    height: props?.height ?? 480,
    width: props?.width ?? 620,
    focus: props?.focus ?? true,
    hiddenTitle: props?.hiddenTitle ?? true,
    decorations: props?.decorations ?? false,
    transparent: props?.transparent ?? true,
    url,
  })

  win.once('tauri://error', function (e) {
    console.log(e)
  })

  return win
}
