# Console Commands

TinyMCE Field offers some console commands for regenerating config files, optionally with some config settings overridden.

## `tinymce/config/regenerate-default`

Regenerates the `Default.json` config file.

### Options

- `--plugins`: The TinyMCE plugin override items to include.
- `--menubar`: The TinyMCE menu bar override items to include, or 1 for all items, or 0 for none.
- `--statusbar`: The TinyMCE status bar override setting.
- `--toolbar`: The TinyMCE toolbar override items to include.
- `--contextmenu`: The TinyMCE toolbar override items to include.

### Example

Regenerate the Default.json config, but include a menu bar with all valid items for the default plugins:

```sh
php craft tinymce/config/regenerate-default --menubar=1
```

## `tinymce/config/regenerate-full`

Regenerates the `Full.json` config file.

### Options

Same as `tinymce/config/regenerate-default`.

### Example

Regenerate the Full.json config, but don't include a menu bar or status bar:

```sh
php craft tinymce/config/regenerate-full --menubar=0 --statusbar=0
```

## `tinymce/config/regenerate-simple`

Regenerates the `Simple.json` config file.

### Options

Same as `tinymce/config/regenerate-default`.

### Example

Regenerate the Simple.json config, but allow inserting links and images:

```sh
php craft tinymce/config/regenerate-simple --plugins="autoresize lists image link" --toolbar="undo redo | insertLink insertImage" --contextmenu="craftLink linkchecker craftImage table spellchecker configurepermanentpen"
```
