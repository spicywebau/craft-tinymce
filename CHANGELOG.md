# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Fixed
- Fixed a bug where TinyMCE editors in Matrix, Neo and Super Table blocks became unusable after dragging the blocks

## 1.4.2 - 2023-10-26

### Changed
- Updated the distributed TinyMCE to 6.7.2

### Fixed
- Fixed an error that occurred on 1.4.0 and 1.4.1, when loading an element editor page containing a TinyMCE field, if the plugin settings page had never been opened and saved

## 1.4.1 - 2023-07-02

### Fixed
- Fixed a bug where it wasn't possible to enable premium plugins when using the custom TinyMCE source

## 1.4.0 - 2023-07-01

### Added
- Added the ability to load official TinyMCE translation files from the `config/tinymce/languages` directory
- Added `spicyweb\tinymce\enums\TinyMCESource`
- Added `spicyweb\tinymce\errors\InvalidSourceException`
- Added `spicyweb\tinymce\services\LanguageService`
- Added `spicyweb\tinymce\models\Settings::$tinymceCustomSource`
- Added `spicyweb\tinymce\models\Settings::$tinymceSource`
- Added `spicyweb\tinymce\models\Settings::nonNullTinymceSource()`
- Added a plugin settings page in the Craft control panel

### Changed
- Updated the distributed TinyMCE to 6.5.1
- TinyMCE can now be loaded from a user-defined external source

## 1.3.0 - 2023-02-15

### Added
- Added `spicyweb\tinymce\models\Settings::$enablePremiumPlugins`

### Fixed
- Fixed bugs when using the `editorCloudApiKey` plugin setting

## 1.2.1 - 2022-10-31

### Fixed
- Fixed a bug where TinyMCE editors became unusable after activating Craft's preview mode
- Fixed a script error that occurred when editing elements that don't autosave drafts

## 1.2.0 - 2022-10-27

### Added
- Added `spicyweb\tinymce\fields\TinyMCE::$configSelectionMode`
- Added `spicyweb\tinymce\fields\TinyMCE::$manualConfig`, which allows entering a custom config in JSON format for a specific TinyMCE field, like can be done for Redactor fields
- Added `spicyweb\tinymce\assets\field\FieldAsset`
- Added `spicyweb\tinymce\assets\tinymce\TinyMCEAsset`

### Deprecated
- Deprecated `spicyweb\tinymce\assets\FieldAsset`; use `spicyweb\tinymce\assets\field\FieldAsset` instead
- Deprecated `spicyweb\tinymce\assets\TinyMCEAsset`; use `spicyweb\tinymce\assets\tinymce\TinyMCEAsset` instead

### Fixed
- Fixed a bug where TinyMCE fields could cause 404 errors when attempting to load translations

## 1.1.1 - 2022-10-26

### Fixed
- Fixed a bug with the TinyMCE Field settings template, that caused issues when using TinyMCE Field within a Matrix field

## 1.1.0 - 2022-10-09

### Added
- Added the `php craft tinymce/config/regenerate-default` console command
- Added the `php craft tinymce/config/regenerate-full` console command
- Added the `php craft tinymce/config/regenerate-simple` console command
- Added `spicyweb\tinymce\console\controllers\ConfigController`
- Added `spicyweb\tinymce\services\ConfigService`

### Changed
- When installed, the plugin now saves `Default.json`, `Full.json` and `Simple.json` TinyMCE config files in a Craft install's `config/tinymce` directory, if the files didn't already exist

### Fixed
- Fixed a bug where the `craftcms/html-field` package dependency wasn't set

## 1.0.1 - 2022-09-26

### Fixed
- Fixed a bug where clicking on a TinyMCE dialog backdrop wouldn't close the dialog

## 1.0.0 - 2022-09-15

### Added
- Initial release, using TinyMCE 6.1.2
