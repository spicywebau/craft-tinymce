<?php

namespace spicyweb\tinymce\controllers;

use Craft;
use craft\elements\Entry;
use craft\helpers\Cp;
use craft\web\Controller;
use yii\web\Response;

/**
 * Class InputController
 *
 * @package spicyweb\tinymce\controllers
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 2.0.0
 */
class InputController extends Controller
{
    /**
     * Gets the card HTML for an entry nested in a TinyMCE field.
     */
    function actionEntryCardHtml(): Response
    {
        $view = Craft::$app->getView();
        $request = Craft::$app->getRequest();
        $entryId = $request->getRequiredBodyParam('entryId');
        $siteId = $request->getRequiredBodyParam('siteId');
        $entry = Entry::find()
            ->id($entryId)
            ->siteId($siteId)
            ->status(null)
            ->one();
        $cardHtml = Cp::elementCardHtml($entry, []);

        return $this->asSuccess(data: [
            'cardHtml' => $cardHtml,
            'headHtml' => $view->getHeadHtml(),
            'bodyHtml' => $view->getBodyHtml(),
        ]);
    }
}
