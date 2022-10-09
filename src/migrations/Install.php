<?php

namespace spicyweb\tinymce\migrations;

use craft\db\Migration;
use spicyweb\tinymce\Plugin;

/**
 * Class Install
 *
 * @package spicyweb\tinymce\migrations
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.1.0
 */
class Install extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $configDir = Plugin::$plugin->config->path();

        foreach (['Default', 'Full', 'Simple'] as $filename) {
            $configFile = $configDir . DIRECTORY_SEPARATOR . "$filename.json";

            // Only generate the config file if a file doesn't already exist at the location
            // (e.g. if the user provided their own files, or the plugin was previously installed)
            if (!file_exists($configFile)) {
                $method = "generate$filename";
                Plugin::$plugin->config->save($filename, Plugin::$plugin->config->{$method}());
            }
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        return true;
    }
}
