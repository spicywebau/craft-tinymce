<?php

namespace spicyweb\tinymce;

use craft\base\Model;
use craft\base\Plugin as BasePlugin;
use craft\events\RegisterComponentTypesEvent;
use craft\services\Fields;
use spicyweb\tinymce\fields\TinyMCE;
use spicyweb\tinymce\models\Settings;
use spicyweb\tinymce\services\ConfigService;
use yii\base\Event;

/**
 * Class Plugin
 *
 * @package spicyweb\tinymce
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.0.0
 */
class Plugin extends BasePlugin
{
    public static ?Plugin $plugin = null;

    /**
     * @inheritdoc
     */
    public function init(): void
    {
        parent::init();
        self::$plugin = $this;
        $this->_registerServices();

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

    private function _registerServices(): void
    {
        $this->setComponents([
            'config' => ConfigService::class,
        ]);
    }
}
