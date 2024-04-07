<?php
/**
 * @copyright Copyright (c) 2022-2024 Spicy Web
 * @license GPL-3.0-or-later
 */

namespace spicyweb\tinymce\services;

use Craft;
use yii\base\Component;

/**
 * Class LanguageService
 *
 * @package spicyweb\tinymce\services
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.4.0
 */
class LanguageService extends Component
{
    /**
     * Generates the TinyMCE equivalent language code for a given Craft CMS language code.
     *
     * @param string $language
     * @return string
     */
    public function mapLanguage(string $language): string
    {
        return match ($language) {
            'fr' => 'fr_FR',
            default => $language,
        };
    }
}
