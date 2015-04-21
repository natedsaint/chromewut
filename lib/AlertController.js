/* globals jQuery, alert */
"use strict";

var AlertController = function () {};

AlertController.prototype = {
    show: function (html) {
        this.message.html(html);
        this.container.css('visibility', 'visible');
        this.container.css('opacity', 1);
    },
    hide: function () {
        this.container.css('visibility', 'hidden');
        this.container.css('opacity', 0);
    },
    bindListeners: function () {
        this.container = $('.alertContainer');
        this.message = this.container.find('.message:first');
        
        $("#ok").on("click", $.proxy(this.hide, this));
    }
};

var message = new AlertController();

// to pull into node namespace if included
if (typeof module !== "undefined" && module.exports !== undefined) {
    module.exports = message;
}


