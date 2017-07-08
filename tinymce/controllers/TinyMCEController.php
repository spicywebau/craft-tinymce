<?php
namespace Craft;

class TinyMCEController extends BaseController
{
	public function actionConfig()
	{
		$configFile = craft()->request->getSegment(-1);
		$configPath = craft()->path->getConfigPath() . 'tinymce/' . $configFile;
		$config = IOHelper::getFileContents($configPath);

		if(IOHelper::getExtension($configFile) === 'json')
		{
			$config = 'module.exports = ' . $config;
		}

		HeaderHelper::setContentTypeByExtension('js');

		echo "
			(function(module)
			{

			})
		";

		echo $config;
		craft()->end();
	}
}
