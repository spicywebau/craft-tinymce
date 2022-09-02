<?php

namespace spicyweb\tinymce;

use craft\base\Model;
use craft\base\Plugin as BasePlugin;
use craft\events\RegisterComponentTypesEvent;
use craft\services\Fields;
use spicyweb\tinymce\fields\TinyMCE;
use spicyweb\tinymce\models\Settings;
use yii\base\Event;

/**
 * Class Plugin
 *
 * @package spicyweb\tinymce
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 0.1.0
 */
class Plugin extends BasePlugin
{
    /**
     * @inheritdoc
     */
    public function init(): void
    {
        parent::init();

        Event::on(
            Fields::class,
            Fields::EVENT_REGISTER_FIELD_TYPES,
            function(RegisterComponentTypesEvent $e) {
                $e->types[] = TinyMCE::class;
            }
        );
    }

    /**
     * @inheritdoc
     */
    protected function createSettingsModel(): ?Model
    {
        return new Settings();
    }
}
