<?php
/**
 * @copyright Copyright (c) 2022-2024 Spicy Web
 * @license GPL-3.0-or-later
 */

namespace spicyweb\tinymce\errors;

use yii\base\Exception;

/**
 * @package spicyweb\tinymce\errors
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.4.0
 */
class InvalidSourceException extends Exception
{
    /**
     * @inheritdoc
     */
    public function getName(): string
    {
        return 'Invalid TinyMCE source';
    }
}
