/* globals jQuery, wut, chrome, Message */
"use strict";

var WutController = function () {};

WutController.prototype = {
    pad: function(n){
        return n < 10 ? '0' + n : n;
    },
    selectAll: function() {
        $("#link").focus();
        $("#link").select();
    },
    executeCopy: function() {
        var input = document.createElement('textarea');
        document.body.appendChild(input);
        input.value = $("#link").html();
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
        var controller = this,
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
            success: function(response,data) {
                if (response.errors) {
                    controller.onGenerateLinkError(response.errors);
                } else {
                    controller.onGenerateLinkSuccess(response);
                }
                
                controller.resetGenerateLinkButton();
            }
        });
    },
    onGenerateLinkError: function (errors) {
        var text = [];
        
        if (typeof errors === "object") {
            for (var error in errors) {
                text = text.concat(errors[error]);
            }
        }
        
        if (text.length) {
            text.unshift("A link wasn't created because:<br>");
            Message.show(text.join('<br>'));
        }
    },
    onGenerateLinkSuccess: function (response) {
        var button = $("#generateLink");
        
        $("#link").html(response.proxyUrl);
        $(".linkHolder").addClass("loaded");
        button.removeClass("disabled").html("Create Link");
        
        if ($('#copyAsap').is(':checked')) {
            this.executeCopy();
        }
    },
    bindListeners: function() {
        // set placeholder to current url (will use this if not provided by user)
        chrome.tabs.query({'active': true,'currentWindow':true}, function(tabs) {
            $("#urlField").attr("placeholder",tabs[0].url);
        });

        $("#generateLink").on("click", $.proxy(this.generateLink, this));
        $("#link").on("click",this.selectAll);
        $("#copyButton").on("click",this.executeCopy);
    },
    resetGenerateLinkButton: function () {
        var button = $("#generateLink");
        
        button.removeClass("disabled").html("Create Link");
    }
};

var wut = new WutController();


(function($,wut) {
    $(document).ready(function() {
        wut.bindListeners();
    });
})(jQuery,wut);