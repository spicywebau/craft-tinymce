import * as $ from 'jquery'
import { Editor, EditorEvent, RawEditorOptions, TinyMCE } from 'tinymce'

declare const tinymce: TinyMCE

interface Option {
  elementType: string
  optionTitle: string
  sources: string[]
}

interface FieldSettings {
  direction: string
  id: string
  language: string
  linkOptions: Option[]
  locale: string
  mediaOptions: Option[]
  transforms: string[]
}

interface ElementEditor {
  isFullPage: boolean
}

interface Element {
  id: string
  label: string
  url: string
}

const showModalFactory: (elementType: string, settings: object) => Function = (elementType, settings = {}) => {
  let modal: GarnishModal|undefined

  return () => {
    if (typeof modal === 'undefined') {
      modal = Craft.createElementSelectorModal(elementType, Object.assign({
        resizable: true,
        multiSelect: false,
        disableOnSelect: true
      }, settings))
    } else {
      modal.show()
    }
  }
}

class TinyMCEField {
  constructor (
    private readonly _settings: FieldSettings,
    editorConfig: RawEditorOptions = {}
  ) {
    console.log(this._settings)
    const init = this._init.bind(this)
    const setup = this._setup.bind(this)

    const options = Object.assign(
      {
        plugins: 'autoresize lists link image code',
        content_css: false,

        // Toolbars
        menubar: false,
        statusbar: false,
        toolbar: 'undo redo | blocks | bold italic strikethrough | bullist numlist | link craftElementsEntryLink craftElementsAssetLink | image craftElementsAssetMedia | hr | code',

        // Formatting
        allow_conditional_comments: false,
        element_format: 'html',
        fix_list_elements: true,

        // Links
        relative_urls: false,
        remove_script_host: false,
        anchor_top: false,
        anchor_bottom: false,

        // Auto-resize
        autoresize_bottom_margin: 0
      },
      editorConfig,
      {
        selector: `#${this._settings.id}`,
        language: this._settings.language,
        directionality: this._settings.direction,

        setup,

        init_instance_callback (editor: Editor) {
          init(editor)

          const configInit = editorConfig.init_instance_callback
          if (typeof configInit === 'function') {
            configInit.apply(this, arguments)
          }
        }
      }
    )

    tinymce.init(options).then(() => {}, () => {})
  }

  private _commandHandleFromElementType (elementType: string): string {
    return elementType.split('\\')
      .map((segment, i) => (i === 0 ? segment[0] : segment[0].toUpperCase()) + segment.slice(1).toLowerCase())
      .join('')
  }

  private _setup (editor: Editor): void {
    for (const { elementType, optionTitle, sources } of this._settings.linkOptions) {
      const elementTypeHandle = this._commandHandleFromElementType(elementType)
      const command = `${elementTypeHandle}Link`

      const showModal = showModalFactory(elementType, {
        sources,
        criteria: { locale: this._settings.locale },
        onSelect ([element]: [Element]) {
          const selectedContent = editor.selection.getContent()

          const url = `${element.url}#${elementTypeHandle}:${element.id}`
          const title = element.label
          const label = (selectedContent ?? element.label)
          const command = selectedContent.length > 0 ? 'mceReplaceContent' : 'mceInsertContent'

          editor.execCommand(command, false, `<a href="${url}" title="${title}">${label}</a>`)
        }
      })

      editor.ui.registry.addButton(command, {
        icon: 'link',
        tooltip: optionTitle,
        onAction: () => showModal()
      })
    }

    for (const { elementType, optionTitle, sources } of this._settings.mediaOptions) {
      const elementTypeHandle = this._commandHandleFromElementType(elementType)
      const command = `${elementTypeHandle}Media`

      const showModal = showModalFactory(elementType, {
        sources,
        transforms: this._settings.transforms,
        storageKey: 'RichTextFieldType.ChooseImage',
        criteria: {
          locale: this._settings.locale,
          kind: 'image'
        },
        onSelect: ([element]: [Element], transform: string|null = null) => {
          const selectedContent = editor.selection.getContent()

          const url = `${element.url}#${elementTypeHandle}:${element.id}` + (transform !== null ? `:${transform}` : '')
          const title = element.label
          const width = ''
          const height = ''
          const command = selectedContent.length > 0 ? 'mceReplaceContent' : 'mceInsertContent'

          editor.execCommand(command, false, `<img src="${url}" alt="${title}" width="${width}" height="${height}">`)
        }
      })

      editor.ui.registry.addButton(command, {
        icon: 'image',
        tooltip: optionTitle,
        onAction: () => showModal()
      })
    }
  }

  private _init (editor: Editor): void {
    const $element = $(editor.container)
    const $form = $(editor.formElement)

    editor.on('focus', (_: EditorEvent<any>) => $element.addClass('mce-focused'))
    editor.on('blur', (_: EditorEvent<any>) => $element.removeClass('mce-focused'))

    const elementEditor: ElementEditor = $form.data('elementEditor')
    const contentObserver = new window.MutationObserver(() => {
      $(editor.targetElm).val(editor.getContent())
      const $target = elementEditor.isFullPage ? Garnish.$bod : $form
      $target.trigger('change')
    })
    contentObserver.observe(editor.getBody(), {
      characterData: true,
      childList: true,
      subtree: true
    })
  }
}

export { FieldSettings, TinyMCEField }
