/**
 * An instance of Craft.
 */
declare const Craft: {
  createElementSelectorModal: (elementType: string, settings: object) => GarnishModal
  t: (category: string, message: string, params?: object) => string
}
