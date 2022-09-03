import $ from 'jquery'
import Craft from 'craft'
import tinymce from 'tinymce'
import 'tinymce/icons/default'
import 'tinymce/models/dom'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/code'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/themes/silver'

function showModalFactory(elementType, settings={})
{
	let modal
	return function showModal()
	{
		if(!modal)
		{
			modal = Craft.createElementSelectorModal(elementType, Object.assign({
				resizable: true,
				multiSelect: false,
				disableOnSelect: true,
			}, settings))
		}
		else
		{
			modal.show()
		}
	}
}

window.initTinyMCE = function(settings, editorConfig={})
{
	console.log(settings)
	function setup(editor)
	{
		for(let { elementType, optionTitle, sources } of settings.linkOptions)
		{
			const elementTypeHandle = elementType.replace(/^\w|_\w/g, (match) => match.toLowerCase())
			const command = elementTypeHandle + 'Link'

			const showModal = showModalFactory(elementType, {
				sources,
				criteria: { locale: settings.locale },
				onSelect([ element ])
				{
					const selectedContent = editor.selection.getContent()

					const url = `${element.url}#${elementTypeHandle}:${element.id}`
					const title = element.label
					const label = (selectedContent || element.label)
					const command = (selectedContent ? 'mceReplaceContent' : 'mceInsertContent')

					editor.execCommand(command, false, `<a href="${url}" title="${title}">${label}</a>`)
				},
			})

			editor.addButton(command, {
				icon: 'link',
				storageKey: 'tinymce.' + command,
				tooltip: optionTitle,
				onclick: () => showModal(),
			})
		}

		for(let { elementType, optionTitle, sources } of settings.mediaOptions)
		{
			const elementTypeHandle = elementType.replace(/^\w|_\w/g, (match) => match.toLowerCase())
			const command = elementTypeHandle + 'Media'

			const showModal = showModalFactory(elementType, {
				sources,
				transforms: settings.transforms,
				storageKey: 'RichTextFieldType.ChooseImage',
				criteria: {
					locale: settings.locale,
					kind: 'image',
				},
				onSelect([ element ], transform=null)
				{
					const selectedContent = editor.selection.getContent()

					const url = `${element.url}#${elementTypeHandle}:${element.id}` + (transform ? `:${transform}` : '')
					const title = element.label
					const width = ''
					const height = ''
					const command = (selectedContent ? 'mceReplaceContent' : 'mceInsertContent')

					editor.execCommand(command, false, `<img src="${url}" alt="${title}" width="${width}" height="${height}">`)
				},
			})

			editor.addButton(command, {
				icon: 'image',
				storageKey: 'tinymce.' + command,
				tooltip: optionTitle,
				onclick: () => showModal(),
			})
		}
	}

	function init(editor)
	{
		const $element = $(editor.container)
		const $form = $(editor.formElement)

		editor.on('focus', e => $element.addClass('mce-focused'))
		editor.on('blur', e => $element.removeClass('mce-focused'))

		const elementEditor = $form.data('elementEditor')
		const contentObserver = new window.MutationObserver(() => {
			editor.targetElm.value = editor.getContent()
			const $target = elementEditor.isFullPage ? Garnish.$bod : $form
			$target.trigger('change')
		})
		contentObserver.observe(editor.getBody(), {
			characterData: true,
			childList: true,
			subtree: true,
		})
	}

	tinymce.init(Object.assign(
		{
			plugins: 'autoresize lists link image code',
			content_css: false,

			// Toolbars
			menubar: false,
			statusbar: false,
			toolbar: 'undo redo | blocks | bold italic strikethrough | bullist numlist | link entryLink assetLink | image assetMedia | hr | code',

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
			autoresize_bottom_margin: 0,
		},
		editorConfig,
		{
			selector: '#' + settings.id,
			language: settings.language,
			directionality: settings.direction,

			setup,

			init_instance_callback(editor)
			{
				init(editor)
				
				const configInit = editorConfig.init_instance_callback
				if(typeof configInit === 'function')
				{
					configInit.apply(this, arguments)
				}
			},
		}
	))
}
