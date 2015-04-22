/* globals jQuery, alert */
"use strict";

var AlertController = function () {};

AlertController.prototype = {
    show: function (html) {
        this.message.html(html);
        this.container.addClass("showing");
    },
    hide: function () {
        this.container.removeClass("showing");
    },
    bindListeners: function () {
        this.container = $('.alertContainer');
        this.message = this.container.find('.message:first');
        
        $("#ok").on("click", this.hide.bind(this));
    }
};

// to pull into node namespace if included
if (typeof module !== "undefined" && module.exports !== undefined) {
    module.exports = AlertController;
}


