<?php

namespace spicyweb\tinymce\models;

use craft\base\Model;
use spicyweb\tinymce\enums\TinyMCESource;

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
     * @var string|null The API key to use when [[nonNullTinymceSource()]] returns `tinyCloud`.
     */
    public ?string $editorCloudApiKey = null;

    /**
     * @var bool Whether to enable premium plugins when [[nonNullTinymceSource()]] returns `tinyCloud`.
     * @since 1.3.0
     */
    public bool $enablePremiumPlugins = false;

    /**
     * @var string|null
     * @since 1.4.0
     * @see nonNullTinymceSource()
     */
    public ?string $tinymceSource = null;

    /**
     * @var string|null The URL to load TinyMCE from, if [[nonNullTinymceSource()]] returns `custom`.
     * @since 1.4.0
     */
    public ?string $tinymceCustomSource = null;

    /**
     * @var string Where TinyMCE will be loaded from.
     *
     * If [[tinymceSource]] is not null, this will return one of the following:
     *
     * - `default` – Load the distributed version of TinyMCE
     * - `tinyCloud` – Load TinyMCE from the Tiny Cloud CDN - make sure to also set [[editorCloudApiKey]] when using this
     * - `custom` – Load TinyMCE from the URL set for [[tinymceCustomSource]]
     *
     * If [[tinymceSource]] is null, this will return either `default` or `tinyCloud`, depending on whether
     * [[editorCloudApiKey]] is set.
     *
     * @since 1.4.0
     */
    public function nonNullTinymceSource(): string
    {
        // Ensure Tiny Cloud users from prior to the tinymceSource setting being added will default to tinyCloud
        if ($this->tinymceSource === null) {
            return $this->editorCloudApiKey !== null ? TinyMCESource::TinyCloud : TinyMCESource::Default;
        }

        return $this->tinymceSource;
    }
}
