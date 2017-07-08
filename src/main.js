import $ from 'jquery'
import tinymce from 'tinymce'

window.initTinyMCE = function(settings, editorConfig={})
{
	tinymce.init(Object.assign(
		{
			skin: 'craft',

			// Toolbars
			menubar: false,
			statusbar: false,

			// Formatting
			allow_conditional_comments: false,
			element_format: 'html',
			fix_list_elements: true,

			// Plugins
			plugins: 'autoresize',
			autoresize_bottom_margin: 0,
		},
		editorConfig,
		{
			selector: '#' + settings.id,
			language: settings.locale,
			directionality: settings.direction,
			init_instance_callback: function(editor)
			{
				const $element = $(editor.container)
				const configInit = editorConfig.init_instance_callback

				editor.on('focus', e => $element.addClass('mce-focused'))
				editor.on('blur', e => $element.removeClass('mce-focused'))

				if(typeof configInit === 'function')
				{
					configInit.apply(this, arguments)
				}
			},
		}
	))
}
