<?php
namespace Craft;

class TinyMCEPlugin extends BasePlugin
{
	public function getName()
	{
		return "TinyMCE";
	}

	public function getDescription()
	{
		return Craft::t("Adds TinyMCE as a rich text field type to Craft");
	}

	public function getVersion()
	{
		return '1.0.0';
	}

	public function getSchemaVersion()
	{
		return '1.0.0';
	}

	public function getDeveloper()
	{
		return "Spicy Web";
	}

	public function getDeveloperUrl()
	{
		return "http://spicyweb.com.au";
	}

	public function getMinCraftVersion()
	{
		return '2.5';
	}

	public function getMinPHPVersion()
	{
		return '5.4';
	}

	public function isCompatible()
	{
		return (
			version_compare(craft()->getVersion(), $this->getMinCraftVersion(), '>=') &&
			version_compare(PHP_VERSION, $this->getMinPHPVersion(), '>=')
		);
	}

	public function onBeforeInstall()
	{
		$compatible = $this->isCompatible();

		if(!$compatible)
		{
			self::log(Craft::t("This plugin requires at least Craft {craft} and PHP {php}", [
				'craft' => craft()->getVersion(),
				'php' => PHP_VERSION,
			]), LogLevel::Error, true);
		}

		return $compatible;
	}
}
