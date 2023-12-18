<?php

namespace spicyweb\tinymce\services;

use Craft;
use craft\helpers\FileHelper;
use craft\helpers\Json;
use yii\base\Component;

/**
 * Class ConfigService
 *
 * @package spicyweb\tinymce\services
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.1.0
 */
class ConfigService extends Component
{
    /**
     * Generates the default TinyMCE field config.
     *
     * @var array $overrides key/value pairs of TinyMCE config options to override the default
     * @return array
     */
    public function generateDefault(array $overrides = []): array
    {
        return $overrides + [
            'plugins' => 'autoresize lists link image code',
            'menubar' => false,
            'statusbar' => false,
            'toolbar' => 'undo redo | styles | bold italic strikethrough | bullist numlist | insertLink insertImage | hr | code',
            'contextmenu' => 'craftLink linkchecker craftImage table spellchecker configurepermanentpen',
        ];
    }

    /**
     * Generates the full TinyMCE field config.
     *
     * Based on the settings from https://www.tiny.cloud/docs/tinymce/6/full-featured-open-source-demo/
     *
     * @var array $overrides key/value pairs of TinyMCE config options to override the default
     * @return array
     */
    public function generateFull(array $overrides = []): array
    {
        return $overrides + [
            'plugins' => 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
            'menubar' => true,
            'statusbar' => true,
            'toolbar' => implode(' | ', [
                'undo redo',
                'fontfamily fontsize styles',
                'bold italic underline strikethrough',
                'alignleft aligncenter alignright alignjustify',
                'outdent indent',
                'bullist numlist',
                'forecolor backcolor removeformat',
                'pagebreak',
                'charmap emoticons',
                'fullscreen preview save print',
                'insertfile insertLink insertImage media template anchor codesample',
                'hr',
                'ltr rtl',
                'code',
            ]),
            'contextmenu' => 'craftLink linkchecker craftImage table spellchecker configurepermanentpen',
        ];
    }

    /**
     * Generates the simple TinyMCE field config.
     *
     * @var array $overrides key/value pairs of TinyMCE config options to override the default
     * @return array
     */
    public function generateSimple(array $overrides = []): array
    {
        return $overrides + [
            'plugins' => 'autoresize lists',
            'menubar' => false,
            'statusbar' => false,
            'toolbar' => 'bold italic',
            'contextmenu' => 'table spellchecker configurepermanentpen',
        ];
    }

    /**
     * Returns the path to the directory where TinyMCE config files are stored.
     *
     * @return string
     */
    public function path(): string
    {
        return Craft::$app->getPath()->getConfigPath() . DIRECTORY_SEPARATOR . 'tinymce';
    }

    /**
     * Saves a given TinyMCE config into a file with the given name.
     *
     * @var string $filename the filename (without the `.json` suffix)
     * @var array $config
     */
    public function save(string $filename, array $config): void
    {
        $file = "$filename.json";
        $json = Json::encode($config, JSON_PRETTY_PRINT) . "\n";
        FileHelper::writeToFile($this->path() . DIRECTORY_SEPARATOR . $file, $json);
    }
}
