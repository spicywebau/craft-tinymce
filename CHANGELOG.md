# Changelog

## Unreleased

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
