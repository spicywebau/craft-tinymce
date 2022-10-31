/**
 * An instance of Garnish.
 */
declare const Garnish: {
  $bod: JQuery
  on: (target: GarnishComponent, events: string|string[], data: object|Function, handler?: Function) => void
  S_KEY: number
  uiLayerManager: {
    triggerShortcut: (ev: KeyboardEvent) => void
  }
}

/**
 * An interface representing a Garnish component.
 */
declare interface GarnishComponent {
  on: (events: string, handler: Function) => void
}

/**
 * An interface representing a Garnish modal.
 */
declare interface GarnishModal {
  show: () => void
}
