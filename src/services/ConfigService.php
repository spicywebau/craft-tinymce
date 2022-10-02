<?php

namespace spicyweb\tinymce\services;

use Craft;
use craft\helpers\FileHelper;
use craft\helpers\Json;
use yii\base\Component;

/**
 * Class Plugin
 *
 * @package spicyweb\tinymce\services
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.1.0
 */
class ConfigService extends Component
{
    /**
     * Generates the default TinyMCE field config.
     *
     * @var array $overrides key/value pairs of TinyMCE config options to override the default
     * @return array
     */
    public function generateDefault(array $overrides = []): array
    {
        return $overrides + [
            'skin' => 'craft',
            'plugins' => 'autoresize lists link image code',
            'content_css' => false,

            // Toolbars
            'menubar' => false,
            'statusbar' => false,
            'toolbar' => 'undo redo | blocks | bold italic strikethrough | bullist numlist | insertLink insertImage | hr | code',

            // Context menu (the default setting, except replacing the inbuilt link/image options with our own)
            'contextmenu' => 'craftLink linkchecker craftImage table spellchecker configurepermanentpen',

            // Formatting
            'allow_conditional_comments' => false,
            'element_format' => 'xhtml',
            'entity_encoding' => 'raw',
            'fix_list_elements' => true,

            // Links
            'relative_urls' => false,
            'remove_script_host' => false,
            'anchor_top' => false,
            'anchor_bottom' => false,

            // Auto-resize
            'autoresize_bottom_margin' => 0,
        ];
    }

    /**
     * Generates the simple TinyMCE field config.
     *
     * @var array $overrides key/value pairs of TinyMCE config options to override the default
     * @return array
     */
    public function generateSimple(array $overrides = []): array
    {
        return $this->generateDefault($overrides + [
            'toolbar' => 'bold italic',
            'contextmenu' => 'table spellchecker configurepermanentpen',
        ]);
    }

    /**
     * Saves a given TinyMCE config into a file with the given name.
     *
     * @var string $filename the filename (without the `.json` suffix)
     * @var array $config
     */
    public function save(string $filename, array $config): void
    {
        $dir = Craft::$app->getPath()->getConfigPath() . DIRECTORY_SEPARATOR . 'tinymce';
        $file = "$filename.json";
        $json = Json::encode($config, JSON_PRETTY_PRINT) . "\n";
        FileHelper::writeToFile($dir . DIRECTORY_SEPARATOR . $file, $json);
    }
}
