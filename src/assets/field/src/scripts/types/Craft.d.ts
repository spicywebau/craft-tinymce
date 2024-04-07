/**
 * @copyright Copyright (c) 2022-2024 Spicy Web
 * @license GPL-3.0-or-later
 */

/**
 * An instance of Craft.
 */
declare const Craft: {
  cp: Cp
  createElementSelectorModal: (elementType: string, settings: object) => GarnishModal
  ElementEditorSlideout: GarnishComponent
  LivePreview: GarnishComponent
  Preview: GarnishComponent
  sendActionRequest: (method: string, action: string, options?: object) => Promise<CraftTransformResponse>
  t: (category: string, message: string, params?: object) => string
}

/**
 * An interface for Craft control panel functionality.
 */
interface Cp {
  displayError: (message: string) => void
}

/**
 * A response from Craft's image transform generation.
 */
declare interface CraftTransformResponse {
  data: {
    url: string
  }
}

declare interface CraftSlideoutEvent extends Event {
  target: any
}
