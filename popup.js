/* globals jQuery, controller, chrome */
"use strict";

var WutController = function() {

};

WutController.prototype = {
    pad: function(n){
        return n<10 ? '0'+n : n
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
        var url = $("#urlField").val() || $("#urlField").attr("placeholder"),
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
                $("#link").html(response.proxyUrl);
                $(".linkHolder").addClass("loaded");
                button.removeClass("disabled").html("Create Link");
            }
        });
    },
    bindListeners: function() {
        // set placeholder to current url (will use this if not provided by user)
        chrome.tabs.query({'active': true,'currentWindow':true}, function(tabs) {
            $("#urlField").attr("placeholder",tabs[0].url);
        });

        $("#generateLink").on("click",this.generateLink);
        $("#link").on("click",this.selectAll);
        $("#copyButton").on("click",this.executeCopy);
    }
};

var wut = new WutController();


(function($,wut) {
    $(document).ready(function() {
        wut.bindListeners();
    });
})(jQuery,wut);






