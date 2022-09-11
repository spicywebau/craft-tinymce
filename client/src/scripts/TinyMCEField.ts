import * as $ from 'jquery'
import { Editor, EditorEvent, RawEditorOptions, TinyMCE } from 'tinymce'

declare const tinymce: TinyMCE

interface Option {
  elementType: string
  optionTitle: string
  sources: string[]
}

interface FieldSettings {
  allSites: Array<{
    value: string
    text: string
  }>
  defaultTransform: string
  direction: string
  editorConfig: RawEditorOptions
  elementSiteId: string
  id: string
  language: string
  linkOptions: Option[]
  locale: string
  transforms: Array<{
    value: string
    text: string
  }>
  volumes: string[]
}

interface ElementEditor {
  isFullPage: boolean
}

interface Element {
  id: string
  label: string
  url: string
}

interface LinkDialogData {
  url: string
  text: string
  newTab: boolean
  site: string
}

interface AssetDialogData {
  title: string
  caption: string
  link: string
  newTab: boolean
  transform: string
}

type ShowModalFactoryType = (elementType: string, settings: object) => Function
type DialogConfigFunction = (title: string, items: object[], initialData: object, onChange: Function, onSubmit: Function) => any

const showModalFactory: ShowModalFactoryType = (elementType, settings = {}) => {
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

const dialogConfig: DialogConfigFunction = (title, items, initialData, onChange, onSubmit) => {
  return {
    title: Craft.t('tinymce', title),
    body: {
      type: 'panel',
      items
    },
    buttons: [
      {
        type: 'cancel',
        name: 'cancel',
        text: Craft.t('tinymce', 'Cancel')
      },
      {
        type: 'submit',
        name: 'submit',
        text: Craft.t('tinymce', 'Save'),
        buttonType: 'primary'
      }
    ],
    initialData,
    onChange,
    onSubmit
  }
}

class TinyMCEField {
  constructor (private readonly _settings: FieldSettings) {
    console.log(this._settings)
    const init = this._init.bind(this)
    const setup = this._setup.bind(this)
    const settings = this._settings

    const options = Object.assign(
      {
        skin: 'craft',
        plugins: 'autoresize lists link image code',
        content_css: false,

        // Toolbars
        menubar: false,
        statusbar: false,
        toolbar: 'undo redo | blocks | bold italic strikethrough | bullist numlist | insertLink insertImage | hr | code',

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
      this._settings.editorConfig,
      {
        selector: `#${this._settings.id}`,
        language: this._settings.language,
        directionality: this._settings.direction,

        setup,

        init_instance_callback (editor: Editor) {
          init(editor)

          const configInit = settings.editorConfig.init_instance_callback
          if (typeof configInit === 'function') {
            configInit.apply(this, arguments)
          }
        }
      }
    )

    tinymce.init(options).then(() => {}, () => {})
  }

  private _commandHandleFromElementType (elementType: string): string {
    return elementType.split('\\').pop()?.toLowerCase() as string
  }

  private _setup (editor: Editor): void {
    const linkOptions: object[] = [{
      type: 'menuitem',
      text: Craft.t('tinymce', 'Insert/edit link'),
      onAction: () => editor.execCommand('mceLink')
    }]

    for (const { elementType, optionTitle, sources } of this._settings.linkOptions) {
      const elementTypeHandle = this._commandHandleFromElementType(elementType)

      const showModal = showModalFactory(elementType, {
        sources,
        criteria: { locale: this._settings.locale },
        onSelect: ([element]: [Element]) => {
          const selectedContent = editor.selection.getContent()
          editor.windowManager.open(dialogConfig(
            optionTitle,
            [
              {
                type: 'input',
                name: 'url',
                label: Craft.t('tinymce', 'URL'),
                enabled: false
              },
              {
                type: 'input',
                name: 'text',
                label: Craft.t('tinymce', 'Text')
              },
              {
                type: 'checkbox',
                name: 'newTab',
                label: Craft.t('tinymce', 'Open in new tab?')
              },
              {
                type: 'selectbox',
                name: 'site',
                label: Craft.t('tinymce', 'Site'),
                items: this._settings.allSites
              }
            ],
            {
              url: `${element.url}#${elementTypeHandle}:${element.id}@${this._settings.elementSiteId}`,
              // Doing `String(element.label)` in case the element title was a number
              text: selectedContent.length > 0 ? selectedContent : String(element.label),
              site: this._settings.elementSiteId
            },
            (api: any) => {
              const data = api.getData() as LinkDialogData
              api.setData({
                url: data.url.replace(/@[0-9]+$/, `@${data.site}`)
              })
            },
            (api: any) => {
              const data = api.getData() as LinkDialogData
              const command = selectedContent.length > 0 ? 'mceReplaceContent' : 'mceInsertContent'
              const newContent = `<a href="${data.url}" title="${data.text}"${data.newTab ? ' target="_blank"' : ''}>${data.text}</a>`

              editor.execCommand(command, false, newContent)
              api.close()
            }
          ))
        }
      })

      linkOptions.push({
        type: 'menuitem',
        text: optionTitle,
        onAction: () => showModal()
      })
    }

    editor.ui.registry.addMenuButton('insertLink', {
      icon: 'link',
      tooltip: Craft.t('tinymce', 'Link'),
      fetch: (callback) => callback(linkOptions)
    })

    // Image button
    const imageButtonTitle = Craft.t('tinymce', 'Insert an image')
    editor.ui.registry.addButton('insertImage', {
      icon: 'image',
      tooltip: imageButtonTitle,
      onAction: () => showModalFactory('craft\\elements\\Asset', {
        sources: this._settings.volumes,
        transforms: this._settings.transforms.map((transform) => {
          return {
            handle: transform.value,
            name: transform.text
          }
        }),
        storageKey: 'RichTextFieldType.ChooseImage',
        criteria: {
          locale: this._settings.locale,
          kind: 'image'
        },
        onSelect: ([element]: [Element], transform: string|null = null) => {
          const selectedContent = editor.selection.getContent()
          const transforms = [{
            value: '',
            text: Craft.t('tinymce', 'No transform')
          }]
          transforms.push(...this._settings.transforms)

          editor.windowManager.open(dialogConfig(
            imageButtonTitle,
            [
              {
                type: 'input',
                name: 'title',
                label: Craft.t('tinymce', 'Title')
              },
              {
                type: 'input',
                name: 'caption',
                label: Craft.t('tinymce', 'Caption')
              },
              {
                type: 'input',
                name: 'link',
                label: Craft.t('tinymce', 'Link')
              },
              {
                type: 'checkbox',
                name: 'newTab',
                label: Craft.t('tinymce', 'Open in new tab?')
              },
              {
                type: 'selectbox',
                name: 'transform',
                label: Craft.t('tinymce', 'Transform'),
                items: transforms
              }
            ],
            {
              transform: transform ?? this._settings.defaultTransform
            },
            () => {},
            (api: any) => {
              const data = api.getData() as AssetDialogData
              const command = selectedContent.length > 0 ? 'mceReplaceContent' : 'mceInsertContent'
              const hasTitle = data.title.length > 0
              const hasCaption = data.caption.length > 0
              const hasLink = data.link.length > 0
              const hasTransform = data.transform !== ''

              const url = [
                hasTransform ? element.url.replace(/\/([^/]+)$/, `/_${data.transform}/$1`) : element.url,
                `#asset:${element.id}`,
                hasTransform ? `:transform:${data.transform}` : ''
              ].join('')
              const content = [
                '<figure>',
                hasLink ? `<a href="${data.link}"${data.newTab ? ' target="_blank"' : ''}>` : '',
                `<img src="${url}"${hasTitle ? `alt="${data.title}"` : ''}>`,
                hasLink ? '</a>' : '',
                hasCaption ? `<figcaption>${data.caption}</figcaption>` : ''
              ].join('')

              editor.execCommand(command, false, content)
              api.close()
            }
          ))
        }
      })()
    })
  }

  private _init (editor: Editor): void {
    const $element = $(editor.container)
    const $form = $(editor.formElement)

    editor.on('focus', (_: EditorEvent<any>) => $element.addClass('mce-focused'))
    editor.on('blur', (_: EditorEvent<any>) => $element.removeClass('mce-focused'))

    // Update the form value on any content change, and trigger a change event so drafts can autosave
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

    // Allow use of Craft element save shortcuts
    editor.addShortcut(
      'meta+s',
      '',
      () => Garnish.uiLayerManager.triggerShortcut(new KeyboardEvent('keydown', {
        shiftKey: false,
        metaKey: true,
        ctrlKey: true,
        altKey: false,
        keyCode: Garnish.S_KEY
      }))
    )
    editor.addShortcut(
      'shift+meta+s',
      '',
      () => Garnish.uiLayerManager.triggerShortcut(new KeyboardEvent('keydown', {
        shiftKey: true,
        metaKey: true,
        ctrlKey: true,
        altKey: false,
        keyCode: Garnish.S_KEY
      }))
    )
  }
}

export { FieldSettings, TinyMCEField }
