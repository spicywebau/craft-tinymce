<?php
/**
 * @copyright Copyright (c) 2022-2024 Spicy Web
 * @license GPL-3.0-or-later
 */

namespace spicyweb\tinymce;

use Craft;
use craft\base\Model;
use craft\base\Plugin as BasePlugin;
use craft\events\RegisterComponentTypesEvent;
use craft\services\Fields;
use spicyweb\tinymce\fields\TinyMCE;
use spicyweb\tinymce\models\Settings;
use spicyweb\tinymce\services\ConfigService;
use spicyweb\tinymce\services\LanguageService;
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
     * @var bool
     */
    public bool $hasCpSettings = true;

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

    /**
     * @inheritdoc
     */
    protected function settingsHtml(): ?string
    {
        return Craft::$app->getView()->renderTemplate('tinymce/plugin-settings', [
            'settings' => $this->getSettings(),
        ]);
    }

    private function _registerServices(): void
    {
        $this->setComponents([
            'config' => ConfigService::class,
            'language' => LanguageService::class,
        ]);
    }
}
