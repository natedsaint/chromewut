/* globals jQuery, AlertController, WutController */

if (typeof jQuery === "function" && typeof WutController === "function" &&
    typeof AlertController === "function") {
    (function($, AlertController, WutController) {
        "use strict";
        $(document).ready(function () {
            var message = new AlertController(),
                wut = new WutController(message);
            wut.bindListeners();
        });
    })(jQuery, AlertController, WutController);
}
