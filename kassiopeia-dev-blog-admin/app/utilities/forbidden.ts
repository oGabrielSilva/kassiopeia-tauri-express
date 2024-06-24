import { generateWinw } from './generateWinw'

export function forbidden() {
  // generatePopup('/session?forbidden=true', 680, 420)
  generateWinw('/session?forbidden=true')
}
