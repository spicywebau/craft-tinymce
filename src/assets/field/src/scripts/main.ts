/**
 * @copyright Copyright (c) 2022-2024 Spicy Web
 * @license GPL-3.0-or-later
 */

import { FieldSettings, TinyMCEField } from './TinyMCEField'

declare global {
  interface Window {
    TinyMCE: {
      init: (settings: FieldSettings) => void
      fields: () => TinyMCEField[]
    }
  }
}

const fields: TinyMCEField[] = []

window.TinyMCE = {
  init: (settings) => {
    fields.push(new TinyMCEField(settings))
  },

  fields: () => Array.from(fields)
}
