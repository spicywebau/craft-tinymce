/**
 * An instance of Garnish.
 */
declare const Garnish: {
  $bod: JQuery
  S_KEY: number
  uiLayerManager: {
    triggerShortcut: (ev: KeyboardEvent) => void
  }
}

/**
 * An interface representing a Garnish component.
 */
declare interface GarnishModal {
  show: () => void
}
