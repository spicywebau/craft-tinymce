<?php
/**
 * @copyright Copyright (c) 2022-2024 Spicy Web
 * @license GPL-3.0-or-later
 */

namespace spicyweb\tinymce\models;

use craft\base\Model;
use spicyweb\tinymce\enums\TinyMCESource;
use yii\base\ArrayableTrait;

/**
 * Class Settings
 *
 * @package spicyweb\tinymce\models
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.0.0
 */
class Settings extends Model
{
    use ArrayableTrait {
        toArray as traitToArray;
    }

    /**
     * @var string|null The API key to use when using Tiny Cloud.
     */
    public ?string $editorCloudApiKey = null;

    /**
     * @var bool Whether to enable premium plugins (requires [[editorCloudApiKey]] to be set).
     * @since 1.3.0
     */
    public bool $enablePremiumPlugins = false;

    /**
     * @var TinyMCESource
     * @since 1.4.0
     */
    public TinyMCESource $tinymceSource = TinyMCESource::Default;

    /**
     * @var string|null The URL to load TinyMCE from, if [[$tinymceSource]] is `TinyMCESource::Custom`.
     * @since 1.4.0
     */
    public ?string $tinymceCustomSource = null;

    /**
     * @inheritdoc
     */
    public function toArray(array $fields = [], array $expand = [], $recursive = true): array
    {
        $array = $this->traitToArray($fields, $expand, $recursive);

        if (isset($array['tinymceSource'])) {
            $array['tinymceSource'] = $array['tinymceSource']['value'];
        }

        return $array;
    }

    /**
     * @inheritdoc
     */
    public function setAttributes($values, $safeOnly = true): void
    {
        if (isset($values['tinymceSource'])) {
            if (is_string($values['tinymceSource'])) {
                // Ensure strings are converted to `TinyMCESource`
                $values['tinymceSource'] = TinyMCESource::tryFrom($values['tinymceSource']);
            }

            // Ensure Tiny Cloud users from prior to the tinymceSource setting being added will default to Tiny Cloud
            if ($values['tinymceSource'] === null) {
                $values['tinymceSource'] = $tinymceCustomSource !== null
                    ? TinyMCESource::TinyCloud
                    : TinyMCESource::Default;
            }
        }

        parent::setAttributes($values, $safeOnly);
    }

    // Just here to prevent errors

    /**
     * @inheritdoc
     */
    public function fields(): array
    {
        return parent::fields();
    }

    /**
     * @inheritdoc
     */
    public function extraFields(): array
    {
        return parent::extraFields();
    }
}
