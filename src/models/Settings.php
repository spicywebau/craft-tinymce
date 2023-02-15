<?php

namespace spicyweb\tinymce\models;

use craft\base\Model;

/**
 * Class Settings
 *
 * @package spicyweb\tinymce\models
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.0.0
 */
class Settings extends Model
{
    /**
     * @var string|null
     */
    public ?string $editorCloudApiKey = null;

    /**
     * @var bool
     */
    public bool $enablePremiumPlugins = false;
}
