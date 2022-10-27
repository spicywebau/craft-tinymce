# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
