# Plugin Settings

TinyMCE Field includes plugin settings to control where TinyMCE is loaded from, and the use of TinyMCE's premium features. These are editable either in the TinyMCE Field plugin settings page in the Craft control panel, or in your Craft project's `config/tinymce.php` file.

## `tinymceSource`

Where TinyMCE will be loaded from.

This setting is of type [`TinyMCESource`](https://github.com/spicywebau/craft-tinymce/blob/2.x/src/enums/TinyMCESource.php). The valid options are:

- `TinyMCESource::Default` – Load the version of TinyMCE distributed with the plugin (7.0.0)
- `TinyMCESource::TinyCloud` – Load TinyMCE from the Tiny Cloud CDN - make sure to also set `editorCloudApiKey` when using this
- `TinyMCESource::Custom` – Load TinyMCE from the URL set for `tinymceCustomSource`

## `tinymceCustomSource`

The URL to load TinyMCE from if `tinymceSource` is set to `TinyMCESource::Custom`.

## `editorCloudApiKey`

The API key to use if `tinymceSource` is set to `TinyMCESource::TinyCloud`, or `enablePremiumPlugins` is `true`.

## `enablePremiumPlugins`

If you are a Tiny Cloud premium customer, set this to enable the use of premium plugins. This setting requires `editorCloudApiKey` to set to a valid Tiny Cloud API key.
