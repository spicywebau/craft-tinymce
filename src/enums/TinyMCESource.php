<?php

namespace spicyweb\tinymce\enums;

/**
 * Pseudo-enum for representing the source to load TinyMCE from.
 *
 * @package spicyweb\tinymce\enums
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.4.0
 */
abstract class TinyMCESource
{
    public const Default = 'default';
    public const TinyCloud = 'tinyCloud';
    public const Custom = 'custom';
}
