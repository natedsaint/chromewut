/* globals jQuery, chrome, message, AlertController */
"use strict";

var WutController = function (message) {
    var me = this;
    me.message = message;
};

WutController.prototype = {
    pad: function(n){
        return n < 10 ? '0' + n : n;
    },
    selectAll: function() {
        var $link = $("#link");
        $link.focus();
        $link.select();
    },
    executeCopy: function() {
        var me = this,
            input = document.createElement('textarea'),
            $link = $("#link");
        document.body.appendChild(input);
        input.value = $link.html();
        input.focus();
        input.select();
        document.execCommand('Copy');
        input.remove();
        $(".linkHolder").addClass("copied");
        setTimeout(function() {
            $(".linkHolder").removeClass("copied");
        },2000);
    },
    generateLink : function() {
        var me = this,
            url = $("#urlField").val() || $("#urlField").attr("placeholder"),
            activateDate = $("#activationDateField").val(),
            deactivateDate = $("#deactivationDateField").val(),
            button = $("#generateLink");

        if (button.hasClass("disabled")) {
            return false;
        }

        button.addClass("disabled").html("Generating...");

        $.ajax({
            url:"http://wut.link/",
            type:"POST",
            dataType: "json",
            data:{
                url:url,
                activateDate: activateDate,
                deactivateDate: deactivateDate
            },
            success: me.handleResponse.bind(me)
        });
    },
    handleResponse: function(response,data) {
        var me = this;
        if (response.errors) {
            me.onGenerateLinkError(response.errors);
        } else {
            me.onGenerateLinkSuccess(response);
        }
        
        me.resetGenerateLinkButton();
    },
    onGenerateLinkError: function (errors) {
        var me = this,
            text = [],
            error;
        
        if (typeof errors === "object") {
            for (error in errors) {
                if (errors.hasOwnProperty(error)) {
                    text = text.concat(errors[error]);
                }
            }
        }
        
        if (text.length && me.message !== undefined) {
            text.unshift("A link wasn't created because:<br>");
            me.message.show(text.join('<br>'));
        }
    },
    onGenerateLinkSuccess: function (response) {
        var me = this,
            button = $("#generateLink");
        $("#link").html(response.proxyUrl);
        $(".linkHolder").addClass("loaded");
        button.removeClass("disabled").html("Create Link");
        if ($('#copyAsap').is(':checked')) {
            me.executeCopy();
        }
    },
    bindListeners: function() {
        var me = this;
        // set placeholder to current url (will use this if not provided by user)
        chrome.tabs.query({'active': true,'currentWindow':true}, function(tabs) {
            $("#urlField").attr("placeholder",tabs[0].url);
        });

        $("#generateLink").on("click", $.proxy(this.generateLink, this));
        $("#link").on("click",this.selectAll);
        $("#copyButton").on("click",this.executeCopy);
        me.message.bindListeners();
    },
    resetGenerateLinkButton: function () {
        var button = $("#generateLink");
        
        button.removeClass("disabled").html("Create Link");
    }
};

// to pull into node namespace if included
if (typeof module !== "undefined" && module.exports !== undefined) {
    module.exports = WutController;
}
