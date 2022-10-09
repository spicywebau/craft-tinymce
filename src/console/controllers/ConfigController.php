<?php

namespace spicyweb\tinymce\console\controllers;

use craft\console\Controller;
use craft\helpers\Console;
use spicyweb\tinymce\Plugin;
use yii\console\ExitCode;

/**
 * Actions for managing TinyMCE config files.
 *
 * @package spicyweb\tinymce\console\controllers
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.1.0
 */
class ConfigController extends Controller
{
    /**
     * @var string|null The TinyMCE plugin override items to include.
     */
    public ?string $plugins = null;

    /**
     * @var string|null The TinyMCE menu bar override items to include, or '1' for all items, or '0' for none.
     */
    public ?string $menubar = null;

    /**
     * @var bool|null The TinyMCE status bar override setting, to override the chosen config.
     */
    public ?bool $statusbar = null;

    /**
     * @var string|null The TinyMCE toolbar override items to include.
     */
    public ?string $toolbar = null;

    /**
     * @var string|null The TinyMCE context menu override items to include.
     */
    public ?string $contextmenu = null;

    /**
     * @inheritdoc
     */
    public function options($actionID): array
    {
        $options = parent::options($actionID);
        $options[] = 'plugins';
        $options[] = 'menubar';
        $options[] = 'statusbar';
        $options[] = 'toolbar';
        $options[] = 'contextmenu';

        return $options;
    }

    /**
     * Regenerates the Default.json config file.
     *
     * @return int
     */
    public function actionRegenerateDefault(): int
    {
        return $this->_saveConfig('Default');
    }

    /**
     * Regenerates the Full.json config file.
     *
     * @return int
     */
    public function actionRegenerateFull(): int
    {
        return $this->_saveConfig('Full');
    }

    /**
     * Regenerates the Simple.json config file.
     *
     * @return int
     */
    public function actionRegenerateSimple(): int
    {
        return $this->_saveConfig('Simple');
    }

    /**
     * General method for regenerating TinyMCE field configs.
     */
    private function _saveConfig(string $filename): int
    {
        $this->stdout("Saving $filename.json..." . PHP_EOL);
        $method = "generate$filename";
        $overrides = [];

        foreach (['plugins', 'statusbar', 'toolbar', 'contextmenu'] as $property) {
            $value = $this->{$property};

            if ($value !== null) {
                $overrides[$property] = $value;
            }
        }

        if ($this->menubar !== null) {
            $overrides['menubar'] = match ($this->menubar) {
                '1' => true,
                '0' => false,
                default => $this->menubar,
            };
        }

        $config = Plugin::$plugin->config->{$method}($overrides);

        try {
            Plugin::$plugin->config->save($filename, $config);
        } catch (\Exception $e) {
            $this->stderr('An error occurred while saving.' . PHP_EOL, Console::FG_RED);
            return ExitCode::UNSPECIFIED_ERROR;
        }

        $this->stdout('Done.' . PHP_EOL);
        return ExitCode::OK;
    }
}
