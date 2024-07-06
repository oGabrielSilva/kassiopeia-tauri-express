import { STORAGE_KEY_TOKEN, STORAGE_KEY_USER } from '@resources/config/app.json'
import { generateWinw } from './generateWinw'

export function forbidden() {
  localStorage.removeItem(STORAGE_KEY_TOKEN)
  localStorage.removeItem(STORAGE_KEY_USER)

  // generatePopup('/session?forbidden=true', 680, 420)
  const wind = generateWinw('/session?forbidden=true')
  wind.setFocus()
}
