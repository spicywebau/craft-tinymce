<?php
/**
 * @copyright Copyright (c) 2022-2024 Spicy Web
 * @license GPL-3.0-or-later
 */

namespace spicyweb\tinymce\enums;

/**
 * Enum for representing the source to load TinyMCE from.
 *
 * @package spicyweb\tinymce\enums
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 2.0.0
 */
enum TinyMCESource: string
{
    case Default = 'default';
    case TinyCloud = 'tinyCloud';
    case Custom = 'custom';
}
