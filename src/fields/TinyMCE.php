<?php
/**
 * @copyright Copyright (c) 2022-2024 Spicy Web
 * @license GPL-3.0-or-later
 */

/*
This class is based on the Redactor field class from the Redactor plugin version 3.0.2, by Pixel & Tonic, Inc.
https://github.com/craftcms/redactor/blob/3.0.2/src/Field.php
The Redactor plugin is released under the terms of the MIT License, a copy of which is included below.
https://github.com/craftcms/redactor/blob/3.0.2/LICENSE.md

The MIT License (MIT)

Copyright (c) Pixel & Tonic, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

namespace spicyweb\tinymce\fields;

use Craft;
use craft\base\ElementInterface;
use craft\commerce\elements\Product;
use craft\commerce\elements\Variant;
use craft\commerce\Plugin as Commerce;
use craft\elements\Asset;
use craft\elements\Category;
use craft\elements\Entry;
use craft\helpers\Html;
use craft\helpers\Json;
use craft\helpers\UrlHelper;
use craft\htmlfield\HtmlField;
use craft\htmlfield\HtmlFieldData;
use craft\models\Section;
use spicyweb\tinymce\assets\FieldAsset;
use spicyweb\tinymce\assets\TinyMCEAsset;
use spicyweb\tinymce\enums\TinyMCESource;
use spicyweb\tinymce\errors\InvalidSourceException;
use spicyweb\tinymce\Plugin;
use yii\base\InvalidArgumentException;

/**
 * Class TinyMCE
 *
 * @package spicyweb\tinymce\fields
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @since 1.0.0
 */
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
     * @var string Config selection mode ('choose' or 'manual')
     * @since 1.2.0
     */
    public string $configSelectionMode = 'choose';

    /**
     * @var string Manual config to use
     * @since 1.2.0
     */
    public string $manualConfig = '';

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

    /**
     * @inheritdoc
     */
    protected function defineRules(): array
    {
        $rules = parent::defineRules();
        $rules[] = [['manualConfig'], 'trim'];
        $rules[] = [
            ['manualConfig'],
            function() {
                if (!Json::isJsonObject($this->manualConfig)) {
                    $this->addError('manualConfig', Craft::t('tinymce', 'This must be a valid JSON object.'));
                    return;
                }
                try {
                    Json::decode($this->manualConfig);
                } catch (InvalidArgumentException $e) {
                    $this->addError('manualConfig', Craft::t('tinymce', 'This must be a valid JSON object.'));
                }
            },
        ];
        return $rules;
    }

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
    protected function inputHtml(mixed $value, ?ElementInterface $element = null): string
    {
        $view = Craft::$app->getView();
        $view->registerAssetBundle(FieldAsset::class);

        $id = Html::id($this->handle);
        $sitesService = Craft::$app->getSites();
        $elementSite = $element ? $element->getSite() : $sitesService->getCurrentSite();
        $siteId = $element?->siteId ?? Craft::$app->getSites()->getCurrentSite()->id;
        $allSites = [];

        foreach ($sitesService->getAllSites(false) as $site) {
            $allSites[] = [
                'value' => (string)$site->id,
                'text' => $site->name,
            ];
        }

        $defaultTransform = '';

        if (!empty($this->defaultTransform) && $transform = Craft::$app->getImageTransforms()->getTransformByUid($this->defaultTransform)) {
            $defaultTransform = $transform->handle;
        }

        $pluginSettings = Plugin::$plugin->getSettings();
        $apiKey = $pluginSettings->editorCloudApiKey ?: 'no-api-key';
        $language = Craft::$app->language;
        $translations = $this->_loadTranslations($language);

        $settings = [
            'id' => $view->namespaceInputId($id),
            'linkOptions' => $this->_getLinkOptions($element),
            'volumes' => $this->_getVolumeKeys(),
            'editorConfig' => $this->_getEditorConfig(),
            'transforms' => $this->_getTransforms(),
            'defaultTransform' => $defaultTransform,
            'elementSiteId' => (string)$elementSite->id,
            'allSites' => $allSites,
            'direction' => $this->getOrientation($element),
            'language' => Plugin::$plugin->language->mapLanguage($language),
            'translations' => $translations,
        ];

        // Load the editor from wherever it should be loaded based on the plugin settings
        switch ($pluginSettings->nonNullTinymceSource()) {
            case TinyMCESource::Default:
                $view->registerAssetBundle(TinyMCEAsset::class);
                break;
            case TinyMCESource::TinyCloud:
                $view->registerJsFile("https://cdn.tiny.cloud/1/{$apiKey}/tinymce/6/tinymce.min.js", [
                    'referrerpolicy' => 'origin',
                ]);

                if ($pluginSettings->enablePremiumPlugins) {
                    $view->registerJsFile("https://cdn.tiny.cloud/1/{$apiKey}/tinymce/6/plugins.min.js", [
                        'referrerpolicy' => 'origin',
                    ]);
                }
                break;
            case TinyMCESource::Custom:
                $customSource = $pluginSettings->tinymceCustomSource;

                if (empty($customSource)) {
                    throw new InvalidSourceException('`tinymceCustomSource` not set when `tinymceSource` set to ' . TinyMCESource::Custom);
                }

                $view->registerJsFile(UrlHelper::url($customSource), [
                    'referrerpolicy' => 'origin',
                ]);

                if ($pluginSettings->enablePremiumPlugins) {
                    $view->registerJsFile("https://cdn.tiny.cloud/1/{$apiKey}/tinymce/6/plugins.min.js", [
                        'referrerpolicy' => 'origin',
                    ]);
                }
                break;
            default:
                throw new InvalidSourceException('Invalid `tinymceSource` setting set');
        }

        $fieldAssetBundle = $view->registerAssetBundle(FieldAsset::class);

        if (!isset($settings['editorConfig']['skin_url'])) {
            $settings['editorConfig']['skin_url'] = $fieldAssetBundle->baseUrl . DIRECTORY_SEPARATOR . 'styles';
        }

        $view->registerJs('TinyMCE.init(' . Json::encode($settings) . ');');
        $value = $this->prepValueForInput($value, $element);

        return Html::textarea($this->handle, $value, [
            'id' => $id,
            'style' => [
                'visibility' => 'hidden',
                'position' => 'fixed',
                'top' => '-9999px',
            ],
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

    /**
     * @inheritdoc
     */
    public function serializeValue(mixed $value, ?ElementInterface $element = null): mixed
    {
        if ($value instanceof HtmlFieldData) {
            $value = $value->getRawContent();
        }

        if ($this->removeEmptyTags) {
            $value = preg_replace('/<figure\s*><\/figure>/', '', $value);
        }

        return parent::serializeValue($value, $element);
    }

    private function _getLinkOptions(?ElementInterface $element = null): array
    {
        $pluginsService = Craft::$app->getPlugins();
        $options = [];

        $sectionSources = $this->_getSectionSources($element);
        $categorySources = $this->_getCategorySources($element);
        $volumeKeys = $this->_getVolumeKeys();

        if (!empty($sectionSources)) {
            $options[] = self::_option('Link to an entry', Entry::class, Entry::refHandle(), $sectionSources);
        }

        if (!empty($categorySources)) {
            $options[] = self::_option('Link to a category', Category::class, Category::refHandle(), $categorySources);
        }

        if (!empty($volumeKeys)) {
            $options[] = self::_option('Link to an asset', Asset::class, Asset::refHandle(), $volumeKeys);
        }

        if ($pluginsService->isPluginInstalled('commerce') && $pluginsService->isPluginEnabled('commerce')) {
            $productSources = $this->_getProductSources($element);

            if (!empty($productSources)) {
                $options[] = self::_option('Link to a product', Product::class, Product::refHandle(), $productSources);
                $options[] = self::_option('Link to a variant', Variant::class, Variant::refHandle(), $productSources);
            }
        }

        return $options;
    }

    private static function _option(string $optionTitle, string $elementType, string $refHandle, array $sources): array
    {
        return [
            'optionTitle' => Craft::t('tinymce', $optionTitle),
            'elementType' => $elementType,
            'refHandle' => $refHandle,
            'sources' => $sources,
        ];
    }

    private function _getSectionSources(?ElementInterface $element = null): array
    {
        $sources = [];
        $sections = Craft::$app->getSections()->getAllSections();
        $sites = Craft::$app->getSites()->getAllSites();
        $showSingles = false;

        foreach ($sections as $section) {
            if ($section->type === Section::TYPE_SINGLE) {
                $showSingles = true;
            } elseif ($element) {
                $sectionSiteSettings = $section->getSiteSettings();

                foreach ($sites as $site) {
                    if (isset($sectionSiteSettings[$site->id]) && $sectionSiteSettings[$site->id]->hasUrls) {
                        $sources[] = 'section:' . $section->uid;
                    }
                }
            }
        }

        if ($showSingles) {
            array_unshift($sources, 'singles');
        }

        if (!empty($sources)) {
            array_unshift($sources, '*');
        }

        return $sources;
    }

    private function _getCategorySources(?ElementInterface $element = null): array
    {
        return self::_sources($element, Craft::$app->getCategories()->getAllGroups(), 'group');
    }

    private function _getProductSources(?ElementInterface $element = null): array
    {
        return self::_sources($element, Commerce::getInstance()->getProductTypes()->getAllProductTypes(), 'productType');
    }

    private static function _sources(?ElementInterface $element, array $types, string $prefix): array
    {
        $sources = [];

        if ($element) {
            foreach ($types as $type) {
                $siteSettings = $type->getSiteSettings();

                if (isset($siteSettings[$element->siteId]) && $siteSettings[$element->siteId]->hasUrls) {
                    $sources[] = "$prefix:" . $type->uid;
                }
            }
        }

        return $sources;
    }

    private function _getVolumeKeys(): array
    {
        if (!$this->availableVolumes) {
            return [];
        }

        $criteria = ['parentId' => ':empty:'];

        $allVolumes = Craft::$app->getVolumes()->getAllVolumes();
        $allowedVolumes = [];
        $userService = Craft::$app->getUser();

        foreach ($allVolumes as $volume) {
            $allowedBySettings = $this->availableVolumes === '*' || (is_array($this->availableVolumes) && in_array($volume->uid, $this->availableVolumes));
            if ($allowedBySettings && $userService->checkPermission("viewAssets:$volume->uid")) {
                $allowedVolumes[] = 'volume:' . $volume->uid;
            }
        }

        return $allowedVolumes;
    }

    private function _getTransforms()
    {
        if (!$this->availableTransforms) {
            return [];
        }

        $transformList = [];

        foreach (Craft::$app->getImageTransforms()->getAllTransforms() as $transform) {
            if (!is_array($this->availableTransforms) || in_array($transform->uid, $this->availableTransforms, false)) {
                $transformList[] = [
                    'value' => $transform->handle,
                    'text' => $transform->name,
                ];
            }
        }

        return $transformList;
    }

    /**
     * Returns the TinyMCE editor config used by this field.
     *
     * @return array
     */
    private function _getEditorConfig(): array
    {
        return $this->configSelectionMode === 'manual'
            ? Json::decode($this->manualConfig)
            : ($this->config('tinymce', $this->tinymceConfig) ?: []);
    }

    private function _loadTranslations(): array
    {
        $messages = [
            'File',
            'New document',
            'Restore last draft',
            'Preview',
            'Print...',
            'Edit',
            'Undo',
            'Redo',
            'Cut',
            'Copy',
            'Paste',
            'Paste as text',
            'Select all',
            'Find and replace...',
            'View',
            'Source code',
            'Visual aids',
            'Show invisible characters',
            'Show blocks',
            'Preview',
            'Fullscreen',
            'Insert',
            'Image...',
            'Link...',
            'Media...',
            'Insert template...',
            'Code sample...',
            'Table',
            'Special character...',
            'Emojis...',
            'Horizontal line',
            'Page break',
            'Nonbreaking space',
            'Anchor...',
            'Date/time',
            'Format',
            'Bold',
            'Italic',
            'Underline',
            'Strikethrough',
            'Superscript',
            'Subscript',
            'Code',
            'Formats',
            'Blocks',
            'Paragraph',
            'Heading 1',
            'Heading 2',
            'Heading 3',
            'Heading 4',
            'Heading 5',
            'Heading 6',
            'Preformatted',
            'Fonts',
            'Font sizes',
            'Align',
            'Left',
            'Center',
            'Right',
            'Justify',
            'Line height',
            'Text color',
            'Background color',
            'Clear formatting',
            'Tools',
            'Word count',
            'Count',
            'Document',
            'Selection',
            'Words',
            'Characters (no spaces)',
            'Characters',
            'Cell',
            'Cell properties',
            'Merge cells',
            'Split cell',
            'Row',
            'Insert row before',
            'Insert row after',
            'Delete row',
            'Row properties',
            'Cut row',
            'Copy row',
            'Paste row before',
            'Paste row after',
            'Column',
            'Insert column before',
            'Insert column after',
            'Delete column',
            'Cut column',
            'Copy column',
            'Paste column before',
            'Paste column after',
            'Table properties',
            'Delete table',
            'Help',
            'Align left',
            'Align center',
            'Align right',
            'Decrease indent',
            'Increase indent',
            'Bullet list',
            'Default',
            'Circle',
            'Square',
            'Numbered list',
            'Lower Alpha',
            'Lower Greek',
            'Lower Roman',
            'Upper Alpha',
            'Upper Roman',
            'Special character',
            'Emojis',
            'Save',
            'Print',
            'Insert an image',
            'Insert/edit media',
            'Insert template',
            'Anchor',
            'Insert/edit code sample',
            'Left to right',
            'Right to left',
            'More...',
        ];
        $translations = [];

        foreach ($messages as $message) {
            $translatedMessage = Craft::t('tinymce', $message);

            if ($message !== $translatedMessage) {
                $translations[$message] = $translatedMessage;
            }
        }

        return $translations;
    }
}
