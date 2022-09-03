import { FieldSettings, TinyMCEField } from './TinyMCEField'

declare global {
  interface Window {
    initTinyMCE: (settings: FieldSettings) => void
  }
}

window.initTinyMCE = (settings) => new TinyMCEField(settings)
