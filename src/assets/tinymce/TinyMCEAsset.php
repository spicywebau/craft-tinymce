<?php

namespace spicyweb\tinymce\assets\tinymce;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;

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

        parent::init();
    }
}

class_alias(TinyMCEAsset::class, \spicyweb\tinymce\assets\TinyMCEAsset::class);
