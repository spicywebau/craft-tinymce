# Plugin Settings

TinyMCE Field includes plugin settings to control where TinyMCE is loaded from, and the use of TinyMCE's premium features. These are editable either in the TinyMCE Field plugin settings page in the Craft control panel, or in your Craft project's `config/tinymce.php` file.

## `tinymceSource`

Where TinyMCE will be loaded from. The valid options are:

- `'default'` – Load the version of TinyMCE distributed with the plugin (6.5.1)
- `'tinyCloud'` – Load TinyMCE from the Tiny Cloud CDN - make sure to also set `editorCloudApiKey` when using this
- `'custom'` – Load TinyMCE from the URL set for `tinymceCustomSource`

## `tinymceCustomSource`

The URL to load TinyMCE from if `tinymceSource` is set to `'custom'`.

## `editorCloudApiKey`

The API key to use if `tinymceSource` is set to `'tinyCloud'`.

## `enablePremiumPlugins`

If you are a Tiny Cloud premium customer, set this to enable the use of premium plugins. If you are not a Tiny Cloud premium customer, this setting has no effect.
