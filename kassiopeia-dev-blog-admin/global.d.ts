export {}

declare global {
  interface IFont {
    face: string
    size: number
    generic: string
  }
  interface ILang {
    code: string
    label: string
  }
}
