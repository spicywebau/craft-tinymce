<?php
/**
 * @copyright Copyright (c) 2022-2024 Spicy Web
 * @license GPL-3.0-or-later
 */

namespace spicyweb\tinymce\assets\tinymce;

use Craft;
use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;
use spicyweb\tinymce\Plugin;

/**
 * Class FieldAsset
 *
 * @package spicyweb\tinymce\assets\tinymce
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.2.0
 */
class TinyMCEAsset extends AssetBundle
{
    /**
     * @inheritdoc
     */
    public function init(): void
    {
        $this->sourcePath = __DIR__ . DIRECTORY_SEPARATOR . 'dist';

        $this->depends = [
            CpAsset::class,
        ];
        $this->js = [
            'tinymce.min.js',
        ];

        $this->_loadTranslationFile(Plugin::$plugin->language->mapLanguage(Craft::$app->language));

        parent::init();
    }

    private function _loadTranslationFile(string $language): void
    {
        $languagesDir = Craft::$app->getPath()->getConfigPath() .
            DIRECTORY_SEPARATOR . 'tinymce' . DIRECTORY_SEPARATOR . 'languages';

        try {
            if (is_dir($languagesDir)) {
                $languageFile = $languagesDir . DIRECTORY_SEPARATOR . $language . '.js';

                if (is_file($languageFile)) {
                    $contents = stripslashes(file_get_contents($languageFile));

                    if (preg_match('/tinymce.addI18n\(\'([a-zA-Z-_]+)\',(.+)\);/s', $contents, $matches)) {
                        Craft::$app->getView()->registerJs($contents);
                    }
                }
            }
        } catch (\Exception $e) {
            // Just do nothing
        }
    }
}

class_alias(TinyMCEAsset::class, \spicyweb\tinymce\assets\TinyMCEAsset::class);
