<?php

namespace spicyweb\tinymce\assets;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;

/**
 * Class FieldAsset
 *
 * @package spicyweb\tinymce\assets
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.0.0
 */
class FieldAsset extends AssetBundle
{
    /**
     * @inheritdoc
     */
    public function init(): void
    {
        $this->sourcePath = '@spicyweb/tinymce/resources';

        $this->depends = [
            CpAsset::class,
        ];
        $this->js = [
            'input.js',
        ];

        parent::init();
    }
}
