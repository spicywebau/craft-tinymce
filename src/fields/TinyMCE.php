<?php

namespace spicyweb\tinymce\fields;

use Craft;
use craft\htmlfield\HtmlField;

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

    // public function prepValue($value)
    // {
    //     if($value)
    //     {
    //         $charset = craft()->templates->getTwig()->getCharset();
    //         $value = new RichTextData($value, $charset);
    //     }
    //     else
    //     {
    //         $value = null;
    //     }

    //     return $value;
    // }

    // public function prepValueFromPost($value)
    // {
    //     if($value)
    //     {
    //         if($this->getSettings()->purifyHtml)
    //         {
    //             $purifier = new \CHtmlPurifier();
    //             $purifier->setOptions($this->_getPurifierConfig());
    //             $value = $purifier->purify($value);
    //         }

    //         if($this->getSettings()->cleanupHtml)
    //         {
    //             $allTags = [
    //                 "strong", "em", "b", "i", "u", "a",
    //                 "h1", "h2", "h3", "h4", "h5", "h6", "p",
    //                 "div", "blockquote", "pre",
    //             ];

    //             // Remove forbidden tags
    //             $tags = craft()->config->get('cleanupTags', 'tinymce');
    //             $tags = is_array($tags) ? implode('|', $tags) : false;
    //             if($tags)
    //             {
    //                 $value = preg_replace('/<(?:' . $tags . ')\b[^>]*>/', "", $value);
    //                 $value = preg_replace('/<\/(?:' . $tags . ')>/', "", $value);
    //             }

    //             // Remove inline styles
    //             if(craft()->config->get('cleanupInlineStyles', 'tinymce'))
    //             {
    //                 $value = preg_replace('/(<(?:' . implode('|', $allTags) . ')\b[^>]*)\s+style="[^"]*"/', '$1', $value);
    //             }

    //             // Remove empty tags
    //             if(craft()->config->get('cleanupEmptyTags', 'tinymce'))
    //             {
    //                 $value = preg_replace('/<(' . implode('|', $allTags) . ')\s*><\/\1>/', '', $value);
    //             }
    //         }
    //     }

    //     // Find any element URLs and swap them with ref tags
    //     $pattern = '/(href=|src=)([\'"])[^\'"#]+?(#[^\'"#]+)?(?:#|%23)(\w+):(\d+)(:' . HandleValidator::$handlePattern .' )?\2/';
    //     $value = preg_replace_callback($pattern, function($matches)
    //     {
    //         $refTag = implode('', [ '{', $matches[4], ':', $matches[5], (!empty($matches[6]) ? $matches[6] : ':url'), '}' ]);
    //         $hash = (!empty($matches[3]) ? $matches[3] : '');

    //         if($hash)
    //         {
    //             // Make sure that the hash isn't actually part of the parsed URL
    //             // (someone's Entry URL Format could be "#{slug}", etc.)
    //             $url = craft()->elements->parseRefs($refTag);

    //             if(mb_strpos($url, $hash) !== false)
    //             {
    //                 $hash = '';
    //             }
    //         }

    //         return implode('', [ $matches[1], $matches[2], $refTag, $hash, $matches[2] ]);

    //     }, $value);

    //     // Encode any 4-byte UTF-8 characters.
    //     $value = StringHelper::encodeMb4($value);

    //     return $value;
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

    // public function getInputHtml($name, $value)
    // {
    //     $id = craft()->templates->formatInputId($name);
    //     $localeId = (isset($this->element) ? $this->element->locale : craft()->language);
    //     $locale = craft()->i18n->getLocaleData($localeId);

    //     if($value instanceof RichTextData)
    //     {
    //         $value = $value->getRawContent();
    //     }

    //     if(strpos($value, '{') !== false)
    //     {
    //         // Preserve the ref tags with hashes {type:id:url} => {type:id:url}#type:id
    //         $pattern = '/(href=|src=)([\'"])(\{(\w+\:\d+\:' . HandleValidator::$handlePattern . ')\})(#[^\'"#]+)?\2/';
    //         $value = preg_replace_callback($pattern, function($matches)
    //         {
    //             return implode('', [
    //                 $matches[1], $matches[2], $matches[3],
    //                 (!empty($matches[5]) ? $matches[5] : ''),
    //                 '#', $matches[4], $matches[2],
    //             ]);
    //         }, $value);

    //         // Now parse 'em
    //         $value = craft()->elements->parseRefs($value);
    //     }

    //     $settings = [
    //         'id' => craft()->templates->namespaceInputId($id),
    //         'linkOptions' => $this->_getLinkOptions(),
    //         'mediaOptions' => $this->_getMediaOptions(),
    //         'transforms' => $this->_getTransforms(),
    //         'locale' => $localeId,
    //         'language' => $locale->getLanguageID($localeId),
    //         'direction' => $locale->getOrientation(),
    //     ];

    //     $apiKey = craft()->config->get('editorCloudApiKey', 'tinymce');
    //     if($apiKey)
    //     {
    //         $libraryDir = 'https://cloud.tinymce.com/stable/';
    //         $libraryQuery = '?apiKey=' . $apiKey;

    //         craft()->templates->includeJsFile($libraryDir . 'tinymce.min.js' . $libraryQuery);
    //     }
    //     else
    //     {
    //         craft()->templates->includeJsResource('tinymce/tinymce/tinymce.min.js');
    //     }

    //     craft()->templates->includeJsResource('tinymce/input.js');
    //     craft()->templates->includeJs('initTinyMCE(' . JsonHelper::encode($settings) . ');');

    //     return implode('', [
    //         '<textarea id="' . $id . '" name="' . $name . '" style="visibility: hidden; position: fixed; top: -9999px">',
    //             htmlentities($value, ENT_NOQUOTES, 'UTF-8'),
    //         '</textarea>',
    //     ]);
    // }

    // public function getStaticHtml($value)
    // {
    //     return implode('', [
    //         '<div class="text">',
    //             ($value ? $value : '&nbsp;'),
    //         '</div>',
    //     ]);
    // }

    // private function _getPurifierConfig()
    // {
    //     $settings = [
    //         'Attr.AllowedFrameTargets' => [ '_blank' ],
    //         'HTML.AllowedComments' => [ 'pagebreak' ],
    //     ];

    //     $file = $this->getSettings()->purifierConfig;
    //     $path = craft()->path->getConfigPath() . 'htmlpurifier/' . $file;

    //     if($file && IOHelper::fileExists($path))
    //     {
    //         $json = IOHelper::getFileContents($path);
    //         $settings = JsonHelper::decode($json);
    //     }

    //     return $settings;
    // }

    // private function _getLinkOptions()
    // {
    //     $linkOptions = [];

    //     $sectionSources = $this->_getSectionSources();
    //     $categorySources = $this->_getCategorySources();
    //     $assetSources = $this->_getAssetSources();

    //     if($sectionSources)
    //     {
    //         $linkOptions[] = [
    //             'optionTitle' => Craft::t("Link to an entry"),
    //             'elementType' => 'Entry',
    //             'sources' => $sectionSources,
    //         ];
    //     }

    //     if($categorySources)
    //     {
    //         $linkOptions[] = [
    //             'optionTitle' => Craft::t("Link to a category"),
    //             'elementType' => 'Category',
    //             'sources' => $categorySources,
    //         ];
    //     }

    //     if($assetSources)
    //     {
    //         $linkOptions[] = [
    //             'optionTitle' => Craft::t("Link to an asset"),
    //             'elementType' => 'Asset',
    //             'sources' => $assetSources,
    //         ];
    //     }

    //     // Give plugins a chance to add their own
    //     $allPluginLinkOptions = craft()->plugins->call('addRichTextLinkOptions', [], true);

    //     foreach($allPluginLinkOptions as $pluginLinkOptions)
    //     {
    //         $linkOptions = array_merge($linkOptions, $pluginLinkOptions);
    //     }

    //     return $linkOptions;
    // }

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

    // private function _getSectionSources()
    // {
    //     $sources = [];
    //     $sections = craft()->sections->getAllSections();
    //     $showSingles = false;

    //     foreach($sections as $section)
    //     {
    //         if($section->type == SectionType::Single)
    //         {
    //             $showSingles = true;
    //         }
    //         else if($section->hasUrls)
    //         {
    //             $sources[] = 'section:' . $section->id;
    //         }
    //     }

    //     if($showSingles)
    //     {
    //         array_unshift($sources, 'singles');
    //     }

    //     return $sources;
    // }

    // private function _getCategorySources()
    // {
    //     $sources = [];
    //     $categoryGroups = craft()->categories->getAllGroups();

    //     foreach($categoryGroups as $categoryGroup)
    //     {
    //         if($categoryGroup->hasUrls)
    //         {
    //             $sources[] = 'group:' . $categoryGroup->id;
    //         }
    //     }

    //     return $sources;
    // }

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
