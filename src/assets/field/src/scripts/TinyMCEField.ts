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
  translations: Record<string, string>
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
    title,
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

const backdropObserver = new window.MutationObserver(() => {
  $('.tox-dialog-wrap__backdrop')
    .off('click.field')
    .on('click.field', () => tinymce.activeEditor.windowManager.close())
})
backdropObserver.observe(document.body, {
  childList: true,
  subtree: true
})

class TinyMCEField {
  public editor: Editor

  constructor (private readonly _settings: FieldSettings) {
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

        // Context menu (the default setting, except replacing the inbuilt link/image options with our own)
        contextmenu: 'craftLink linkchecker craftImage table spellchecker configurepermanentpen',

        // Formatting
        allow_conditional_comments: false,
        element_format: 'xhtml',
        entity_encoding: 'raw',
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

        setup: (editor: Editor) => {
          this.editor = editor
          this._setup()
        },

        init_instance_callback: (editor: Editor) => {
          this.editor = editor
          this._init()

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

  private _setup (): void {
    const linkOptions: object[] = []
    const elementTypeHandles: string[] = []
    const transformOptions = [{
      value: '',
      text: Craft.t('tinymce', 'No transform')
    }]
    transformOptions.push(...this._settings.transforms)

    for (const { elementType, optionTitle, sources } of this._settings.linkOptions) {
      const elementTypeHandle = this._commandHandleFromElementType(elementType)
      const menuItemTitle = `${elementTypeHandle}Link`

      const showModal = showModalFactory(elementType, {
        sources,
        criteria: { locale: this._settings.locale },
        onSelect: ([element]: [Element]) => {
          const selectedContent = this.editor.selection.getContent()
          this.editor.windowManager.open(this._linkDialogConfig(optionTitle, false, {
            url: `${element.url}#${elementTypeHandle}:${element.id}@${this._settings.elementSiteId}:url`,
            // Doing `String(element.label)` in case the element title was a number
            text: selectedContent.length > 0 ? selectedContent : String(element.label),
            site: this._settings.elementSiteId
          }))
        }
      })

      linkOptions.push({
        type: 'menuitem',
        text: optionTitle,
        onAction: () => showModal()
      })
      this.editor.ui.registry.addMenuItem(menuItemTitle, {
        icon: 'link',
        text: optionTitle,
        onAction: () => showModal()
      })
      elementTypeHandles.push(menuItemTitle)
    }

    linkOptions.push({
      type: 'menuitem',
      text: Craft.t('tinymce', 'Insert/edit link'),
      onAction: () => this.editor.execCommand('mceLink')
    })

    // Insert link menu button, for use on the toolbar
    this.editor.ui.registry.addMenuButton('insertLink', {
      icon: 'link',
      tooltip: Craft.t('tinymce', 'Link'),
      fetch: (callback) => callback(linkOptions)
    })

    // Edit link menu item, for use on the context menu
    const editLinkTitle = Craft.t('tinymce', 'Edit link')
    this.editor.ui.registry.addMenuItem('editLink', {
      icon: 'link',
      text: editLinkTitle,
      onAction: (_) => {
        const element = this.editor.dom.getParent(this.editor.selection.getStart(), 'a[href]') as globalThis.Element
        const url = element?.getAttribute('href') ?? ''
        const siteMatch = url.match(/@([0-9]+)(:url)$/)
        this.editor.selection.select(element)
        this.editor.windowManager.open(this._linkDialogConfig(editLinkTitle, true, {
          url,
          text: element?.textContent ?? '',
          newTab: (element?.getAttribute('target') ?? '') === '_blank',
          site: siteMatch !== null ? siteMatch[1] : this._settings.elementSiteId
        }))
      }
    })

    this.editor.ui.registry.addContextMenu('craftLink', {
      update: (element) => {
        const parents = this.editor.dom.getParents(element, 'a')

        // If we're not on a link, show the element link options
        if (parents.length === 0) {
          return `${elementTypeHandles.join(' ')} link`
        }

        // If we're on a Craft link, show the Craft edit link option
        // Otherwise, show the normal TinyMCE link option
        const onCraftLink = parents.some((parent) => parent.href.endsWith(':url'))

        return `${onCraftLink ? 'editLink' : 'link openlink'} unlink`
      }
    })

    // Image button, for use on the toolbar
    const imageButtonTitle = Craft.t('tinymce', 'Insert an image')
    this.editor.ui.registry.addButton('insertImage', {
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
          this.editor.windowManager.open(this._imageDialogConfig(imageButtonTitle, true, transformOptions, element, {
            transform: transform ?? this._settings.defaultTransform
          }))
        }
      })()
    })

    // Image menu item, for use on the context menu
    const editImageTitle = Craft.t('tinymce', 'Edit image')
    this.editor.ui.registry.addMenuItem('editImage', {
      icon: 'image',
      text: editImageTitle,
      onAction: (_) => {
        const selectionStart = this.editor.selection.getStart()
        const img = this.editor.dom.getParent(selectionStart, 'img') as globalThis.Element
        const a = this.editor.dom.getParent(img, 'a')
        const figure = this.editor.dom.getParent(a ?? img, 'figure') as globalThis.Element
        const figcaption = (a ?? img).nextSibling
        const imgSrc = img?.getAttribute('src')

        const transformMatch = imgSrc?.match(/:transform:(.+)$/) ?? []
        const transform = transformMatch.length > 0 ? transformMatch.pop() as string : ''

        const elementIdMatch = imgSrc?.match(/#asset:([0-9]+)/) as string[]
        const elementId = elementIdMatch.pop() as string
        const elementUrl = (transform !== '' ? imgSrc?.replace(`/_${transform}/`, '/') : imgSrc)
          ?.replace(`:transform:${transform}`, '')
          ?.replace(/:url$/, '')
          ?.replace(`#asset:${elementId}`, '') as string

        this.editor.selection.select(figure)
        this.editor.windowManager.open(this._imageDialogConfig(editImageTitle, true, transformOptions, {
          id: elementId,
          url: elementUrl,
          label: '' // We don't care about the element label at this point
        }, {
          title: img?.getAttribute('alt') ?? '',
          caption: figcaption?.textContent ?? '',
          link: a?.href ?? '',
          newTab: a?.target === '_blank' ?? false,
          transform
        }))
      }
    })

    this.editor.ui.registry.addContextMenu('craftImage', {
      update: (element) => {
        const ancestors = this.editor.dom.getParents(element, 'figure, img')

        // If we're not on an image, don't show an option
        if (ancestors.length === 0) {
          return ''
        }

        // If we're not on a Craft asset, show the normal TinyMCE image option
        const figure = ancestors.some((ancestor) => ancestor.tagName === 'FIGURE')

        return figure ? 'editImage' : 'image'
      }
    })

    tinymce.addI18n(this._settings.language, this._settings.translations)
  }

  private _init (): void {
    const $element = $(this.editor.container)
    const $form = $(this.editor.formElement)

    this.editor.on('focus', (_: EditorEvent<any>) => $element.addClass('mce-focused'))
    this.editor.on('blur', (_: EditorEvent<any>) => $element.removeClass('mce-focused'))

    // Update the form value on any content change, and trigger a change event so drafts can autosave
    const elementEditor: ElementEditor = $form.data('elementEditor')
    const contentObserver = new window.MutationObserver(() => {
      $(this.editor.targetElm).val(this.editor.getContent())
      const $target = elementEditor.isFullPage ? Garnish.$bod : $form
      $target.trigger('change')
    })
    contentObserver.observe(this.editor.getBody(), {
      characterData: true,
      childList: true,
      subtree: true
    })

    // Allow use of Craft element save shortcuts
    this.editor.addShortcut(
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
    this.editor.addShortcut(
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

  private _linkDialogConfig (title: string, enforceReplace: boolean, initialData: object): any {
    const selectedContent = this.editor.selection.getContent()
    return dialogConfig(
      title,
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
      initialData,
      (api: any) => {
        const data = api.getData() as LinkDialogData
        api.setData({
          url: data.url.replace(/@([0-9]+)(:url)$/, `@${data.site}:url`)
        })
      },
      (api: any) => {
        const data = api.getData() as LinkDialogData
        const command = enforceReplace || selectedContent.length > 0 ? 'mceReplaceContent' : 'mceInsertContent'
        const newContent = `<a href="${data.url}" title="${data.text}"${data.newTab ? ' target="_blank"' : ''}>${data.text}</a>`

        this.editor.execCommand(command, false, newContent)
        api.close()
      }
    )
  }

  private _imageDialogConfig (
    title: string,
    enforceReplace: boolean,
    transforms: object,
    element: Element,
    initialData: object
  ): any {
    const selectedContent = this.editor.selection.getContent()
    return dialogConfig(
      title,
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
      initialData,
      () => {},
      (api: any) => {
        const apiData = api.getData() as AssetDialogData
        const command = enforceReplace || selectedContent.length > 0 ? 'mceReplaceContent' : 'mceInsertContent'
        const hasTitle = apiData.title.length > 0
        const hasCaption = apiData.caption.length > 0
        const hasLink = apiData.link.length > 0
        const hasTransform = apiData.transform !== ''
        const finishIt: (url: string) => void = (url) => {
          const content = [
            '<figure>',
            hasLink ? `<a href="${apiData.link}"${apiData.newTab ? ' target="_blank"' : ''}>` : '',
            `<img src="${url}"${hasTitle ? `alt="${apiData.title}"` : ''}>`,
            hasLink ? '</a>' : '',
            hasCaption ? `<figcaption>${apiData.caption}</figcaption>` : ''
          ].join('')

          this.editor.execCommand(command, false, content)
          api.close()
        }

        if (hasTransform) {
          const data = {
            assetId: element.id,
            handle: apiData.transform
          }
          Craft.sendActionRequest('POST', 'assets/generate-transform', { data })
            .then((response: CraftTransformResponse) => {
              const url = response.data.url + `#asset:${element.id}:transform:${apiData.transform}`
              finishIt(url)
            })
            .catch((_: any) => {
              Craft.cp.displayError(Craft.t('tinymce', 'There was an error generating the transform URL.'))
            })
        } else {
          finishIt(`${element.url}#asset:${element.id}:url`)
        }
      }
    )
  }
}

export { FieldSettings, TinyMCEField }
