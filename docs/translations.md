# Translations

The TinyMCE Field plugin offers two ways of setting translations for TinyMCE.

## Craft translations

TinyMCE Field integrates with the Craft/Yii translation system, so you can set your translations in your Craft project's `translations/<language>/tinymce.php` file. An example English translation file is distributed with TinyMCE Field, which should contain all strings used by the plugin, including those used by TinyMCE itself. If you find that any are missing, feel free to either [open a bug report](https://github.com/spicywebau/craft-tinymce/issues/new?assignees=&labels=bug&projects=&template=BUG-REPORT.yml) or a [pull request](https://github.com/spicywebau/craft-tinymce/pulls).

Any translations provided for the Craft/Yii translation system take priority over translations provided by a TinyMCE language pack for the same language.

## TinyMCE language packs

As of TinyMCE Field 1.4.0, [TinyMCE language packs](https://www.tiny.cloud/get-tiny/language-packages/) are supported, and can be placed in the `config/tinymce/languages` directory. Please note that TinyMCE's and Craft's language codes don't always exactly match, so if you find that a language pack isn't working for this reason, feel free to [open a feature request](https://github.com/spicywebau/craft-tinymce/issues/new?assignees=&labels=enhancement&projects=&template=FEATURE-REQUEST.yml) so we can add support for that language.
