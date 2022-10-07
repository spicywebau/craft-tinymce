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
     * Regenerates the Default.json config file.
     *
     * @return int
     */
    public function actionRegenerateDefault(): int
    {
        return $this->_saveConfig('Default', Plugin::$plugin->config->generateDefault());
    }

    /**
     * Regenerates the Full.json config file.
     *
     * @return int
     */
    public function actionRegenerateFull(): int
    {
        return $this->_saveConfig('Full', Plugin::$plugin->config->generateFull());
    }

    /**
     * Regenerates the Simple.json config file.
     *
     * @return int
     */
    public function actionRegenerateSimple(): int
    {
        return $this->_saveConfig('Simple', Plugin::$plugin->config->generateSimple());
    }

    /**
     * General method for regenerating TinyMCE field configs.
     */
    private function _saveConfig(string $filename, array $config): int
    {
        $this->stdout("Saving $filename.json..." . PHP_EOL);

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
