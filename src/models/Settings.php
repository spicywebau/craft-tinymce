<?php

namespace spicyweb\tinymce\models;

use craft\base\Model;

/**
 * Class Settings
 *
 * @package spicyweb\tinymce\models
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 0.1.0
 */
class Settings extends Model
{
    /**
     * @var string[]
     */
    public array $cleanupTags = ['span', 'font'];

    /**
     * @var bool
     */
    public bool $editorCloudApiKey = false;
}
