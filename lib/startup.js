if (typeof jQuery === "function" && typeof wut.bindListeners === "function") {
    (function($,wut) {
        $(document).ready(function() {
            wut.bindListeners();
        });
    })(jQuery,wut);
}
  
if (typeof jQuery === "function" && typeof wut.bindListeners === "function") {
    (function($, message) {
        $(document).ready(function () {
            message.bindListeners();
        });
    })(jQuery, message);
}
