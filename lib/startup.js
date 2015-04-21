/* globals jQuery, AlertController, WutController */

if (typeof jQuery === "function" && typeof WutController === "object" &&
    typeof AlertController === "object") {
    (function($, AlertController, WutController) {
        "use strict";
        $(document).ready(function () {
            var message = new AlertController(),
                wut = new WutController(message);
            wut.bindListeners();
        });
    })(jQuery, AlertController, WutController);
}
