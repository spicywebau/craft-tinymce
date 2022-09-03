<?php

namespace spicyweb\tinymce\fields;

use Craft;
use craft\base\ElementInterface;
use craft\elements\Asset;
use craft\elements\Category;
use craft\elements\Entry;
use craft\helpers\Html;
use craft\helpers\Json;
use craft\htmlfield\HtmlField;
use craft\models\Section;
use spicyweb\tinymce\assets\FieldAsset;
use spicyweb\tinymce\assets\TinyMCEAsset;
use spicyweb\tinymce\Plugin;

class TinyMCE extends HtmlField
{
    /**
     * @var string|null The TinyMCE config file to use
     */
    public ?string $tinymceConfig = null;

    /**
     * @var string|array|null The volumes that should be available for Image selection.
     */
    public $availableVolumes = '*';

    /**
     * @var string|array|null The transforms available when selecting an image
     */
    public $availableTransforms = '*';

    /**
     * @var string The default transform to use.
     */
    public string $defaultTransform = '';

    /**
     * @inheritdoc
     */
    public static function displayName(): string
    {
        return Craft::t('tinymce', 'TinyMCE');
    }

    // public function defineContentAttribute()
    // {
    //     $settings = $this->getSettings();

    //     return [ AttributeType::String, 'column' => $settings->columnType ];
    // }

    // public function validate($value)
    // {
    //     $valid = true;
    //     $settings = $this->getSettings();

    //     $postContentSize = strlen($value);
    //     $maxDbColumnSize = DbHelper::getTextualColumnStorageCapacity($settings->columnType);

    //     // Give ourselves 10% wiggle room.
    //     $maxDbColumnSize = ceil($maxDbColumnSize * 0.9);

    //     if($postContentSize > $maxDbColumnSize)
    //     {
    //         $valid = Craft::t('{attribute} is too long.', [ 'attribute' => Craft::t($this->model->name) ]);
    //     }

    //     return $valid;
    // }

    /**
     * @inheritdoc
     */
    public function getSettingsHtml(): string
    {
        $volumeOptions = [];
        foreach (Craft::$app->getVolumes()->getAllVolumes() as $volume) {
            if ($volume->getFs()->hasUrls) {
                $volumeOptions[] = [
                    'label' => $volume->name,
                    'value' => $volume->uid,
                ];
            }
        }

        $transformOptions = [];
        foreach (Craft::$app->getImageTransforms()->getAllTransforms() as $transform) {
            $transformOptions[] = [
                'label' => $transform->name,
                'value' => $transform->uid,
            ];
        }

        return Craft::$app->getView()->renderTemplate('tinymce/_settings', [
            'field' => $this,
            'tinymceConfigOptions' => $this->configOptions('tinymce'),
            'purifierConfigOptions' => $this->configOptions('htmlpurifier'),
            'volumeOptions' => $volumeOptions,
            'transformOptions' => $transformOptions,
            'defaultTransformOptions' => array_merge([
                [
                    'label' => Craft::t('tinymce', 'No transform'),
                    'value' => null,
                ],
            ], $transformOptions),
        ]);
    }

    /**
     * @inheritdoc
     */
    protected function inputHtml(mixed $value, ElementInterface $element = null): string
    {
        $view = Craft::$app->getView();
        $view->registerAssetBundle(FieldAsset::class);

        $id = Html::id($this->handle);
        $sitesService = Craft::$app->getSites();
        $elementSite = $element ? $element->getSite() : $sitesService->getCurrentSite();
        $siteId = $element?->siteId ?? Craft::$app->getSites()->getCurrentSite()->id;
        $allSites = [];

        foreach ($sitesService->getAllSites(false) as $site) {
            $allSites[$site->id] = $site->name;
        }

        $settings = [
            'id' => $view->namespaceInputId($id),
            'linkOptions' => [], // $this->_getLinkOptions(),
            'mediaOptions' => [], // $this->_getVolumeKeys(),
            // 'transforms' => $this->_getTransforms(),
            // 'defaultTransform' => $defaultTransform,
            'elementSiteId' => $elementSite->id,
            'allSites' => $allSites,
        ];

        if ($this->translationMethod != self::TRANSLATION_METHOD_NONE) {
            // Explicitly set the text direction
            $locale = Craft::$app->getI18n()->getLocaleById($elementSite->language);
            $settings['direction'] = $locale->getOrientation();
        }

        // $apiKey = Plugin::$plugin->getSettings()->editorCloudApiKey;
        // if ($apiKey) {
        //     $libraryDir = 'https://cloud.tinymce.com/stable/';
        //     $libraryQuery = '?apiKey=' . $apiKey;

        //     $view->registerJsFile($libraryDir . 'tinymce.min.js' . $libraryQuery);
        // } else {
        //     craft()->templates->includeJsResource('tinymce/tinymce/tinymce.min.js');
        // }

        $view->registerAssetBundle(TinyMCEAsset::class);
        $view->registerAssetBundle(FieldAsset::class);
        $view->registerJs('initTinyMCE(' . Json::encode($settings) . ');');
        $value = $this->prepValueForInput($value, $element);

        return implode('', [
            '<textarea id="' . $id . '" name="' . $this->handle . '" style="visibility: hidden; position: fixed; top: -9999px">',
                htmlentities($value, ENT_NOQUOTES, 'UTF-8'),
            '</textarea>',
        ]);
    }

    /**
     * @inheritdoc
     */
    public function getStaticHtml(mixed $value, ElementInterface $element): string
    {
        return implode('', [
            '<div class="text">',
                ($this->prepValueForInput($value, $element) ?: '&nbsp;'),
            '</div>',
        ]);
    }

    private function _getLinkOptions(): array
    {
        $linkOptions = [];

        $sectionSources = $this->_getSectionSources();
        $categorySources = $this->_getCategorySources();
        // $assetSources = $this->_getAssetSources();

        if (!empty($sectionSources)) {
            $linkOptions[] = [
                'optionTitle' => Craft::t('tinymce', 'Link to an entry'),
                'elementType' => Entry::class,
                'refHandle' => Entry::refHandle(),
                'sources' => $sectionSources,
            ];
        }

        if (!empty($categorySources)) {
            $linkOptions[] = [
                'optionTitle' => Craft::t('tinymce', 'Link to a category'),
                'elementType' => Category::class,
                'sources' => $categorySources,
            ];
        }

        // if (!empty($assetSources)) {
        //     $linkOptions[] = [
        //         'optionTitle' => Craft::t('tinymce', 'Link to an asset'),
        //         'elementType' => Asset::class,
        //         'sources' => $assetSources,
        //     ];
        // }

        // Give plugins a chance to add their own
        $allPluginLinkOptions = craft()->plugins->call('addRichTextLinkOptions', [], true);

        foreach($allPluginLinkOptions as $pluginLinkOptions)
        {
            $linkOptions = array_merge($linkOptions, $pluginLinkOptions);
        }

        return $linkOptions;
    }

    // private function _getMediaOptions()
    // {
    //     $mediaOptions = [];

    //     $assetSources = $this->_getAssetSources();

    //     if($assetSources)
    //     {
    //         $mediaOptions[] = [
    //             'optionTitle' => Craft::t("Insert an asset"),
    //             'elementType' => 'Asset',
    //             'sources' => $assetSources,
    //         ];
    //     }

    //     // Give plugins a chance to add their own
    //     $allPluginMediaOptions = craft()->plugins->call('addRichTextMediaOptions', [], true);

    //     foreach($allPluginMediaOptions as $pluginMediaOptions)
    //     {
    //         $mediaOptions = array_merge($mediaOptions, $pluginMediaOptions);
    //     }

    //     return $mediaOptions;
    // }

    private function _getSectionSources(): array
    {
        $sources = [];
        $sections = Craft::$app->getSections()->getAllSections();
        $showSingles = false;

        foreach ($sections as $section) {
            if ($section->type === Section::TYPE_SINGLE) {
                $showSingles = true;
            } elseif ($section->hasUrls) {
                $sources[] = 'section:' . $section->id;
            }
        }

        if ($showSingles) {
            array_unshift($sources, 'singles');
        }

        return $sources;
    }

    private function _getCategorySources(): array
    {
        $sources = [];
        $categoryGroups = Craft::$app->getCategories()->getAllGroups();

        foreach ($categoryGroups as $categoryGroup) {
            if ($categoryGroup->hasUrls) {
                $sources[] = 'group:' . $categoryGroup->id;
            }
        }

        return $sources;
    }

    // private function _getAssetSources()
    // {
    //     $sources = [];
    //     $assetSourceIds = $this->getSettings()->availableAssetSources;

    //     if($assetSourceIds === '*' || !$assetSourceIds)
    //     {
    //         $assetSourceIds = craft()->assetSources->getPublicSourceIds();
    //     }

    //     $folders = craft()->assets->findFolders([
    //         'sourceId' => $assetSourceIds,
    //         'parentId' => ':empty:',
    //     ]);

    //     // Sort it by source order.
    //     $list = [];
    //     foreach($folders as $folder)
    //     {
    //         $list[ $folder->sourceId ] = $folder->id;
    //     }

    //     foreach($assetSourceIds as $assetSourceId) {
    //         $sources[] = 'folder:' . $list[ $assetSourceId ];
    //     }

    //     return $sources;
    // }

    // private function _getTransforms()
    // {
    //     $transforms = craft()->assetTransforms->getAllTransforms('id');
    //     $settings = $this->getSettings();

    //     $transformIds = [];
    //     if(!empty($settings->availableTransforms) && is_array($settings->availableTransforms))
    //     {
    //         $transformIds = array_flip($settings->availableTransforms);
    //     }

    //     if(!empty($transformIds))
    //     {
    //         $transforms = array_intersect_key($transforms, $transformIds);
    //     }

    //     $transformList = [];
    //     foreach($transforms as $transform)
    //     {
    //         $transformList[] = (object) [
    //             'handle' => HtmlHelper::encode($transform->handle),
    //             'name' => HtmlHelper::encode($transform->name),
    //         ];
    //     }

    //     return $transformList;
    // }
}
