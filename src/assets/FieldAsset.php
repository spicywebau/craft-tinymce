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

    /**
     * @inheritdoc
     */
    public function registerAssetFiles($view): void
    {
        $view->registerTranslations('tinymce', [
            'Cancel',
            'Caption',
            'Edit image',
            'Edit link',
            'Insert an image',
            'Insert/edit link',
            'Link',
            'Link to a category',
            'Link to a product',
            'Link to a variant',
            'Link to an asset',
            'Link to an entry',
            'No transform',
            'Open in new tab?',
            'Save',
            'Site',
            'Text',
            'There was an error generating the transform URL.',
            'TinyMCE',
            'Title',
            'Transform',
            'URL',
        ]);

        parent::registerAssetFiles($view);
    }
}
