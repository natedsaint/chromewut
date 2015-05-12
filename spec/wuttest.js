/* globals describe, it, expect, jasmine, spyOn, require, beforeEach, chrome */
"use strict";

// Node.js logic to pull in the code if it's not here

if (typeof message === "undefined" && typeof require !== "undefined") {
    var AlertController = require("../lib/AlertController.js");
}

var message = new AlertController();

if (typeof wut === "undefined" && typeof require !== "undefined") {
    var WutController = require("../lib/WutController.js");
}

var wut = new WutController(message);

if (typeof document === "undefined") {
    //fake browser window
    global.document = require("node-jsdom").jsdom();
    global.window = global.document.parentWindow;
    global.jQuery = require("jquery");
    global.$ = global.jQuery;
}

// tests for front and back end

describe('wut', function() {

    beforeEach(function() {
        $("#testHolder").remove();
        $("body").append('<div id="testHolder"></div>');
    });

    it('should exist', function() {
        expect(wut).toBeTruthy();
        expect(wut).toEqual(jasmine.any(Object));
    });

    describe('wut.pad',function() {

        it('should exist', function() {
            expect(wut.pad).toBeTruthy();
            expect(wut.pad).toEqual(jasmine.any(Function));
        });

        it('should add a zero to pad a single digit number',function() {
            var number = 10,
                testNum;
            // test 9 through 0
            while(number-- > -1) {
                testNum = wut.pad(number);
                expect(testNum).toEqual('0'+number);
            }
        });

        it('should not modify a number greater than 9',function() {
            var number = 10,
                testNum;
            testNum = wut.pad(number);
            expect(testNum).toEqual(number);
        });

    });

    describe('wut.selectAll',function() {

        it('should exist', function() {
            expect(wut.selectAll).toBeTruthy();
            expect(wut.selectAll).toEqual(jasmine.any(Function));
        });

        it('should have called focus and select on #link', function() {
            var focusSpy = spyOn($.fn, "focus"),
                selectSpy = spyOn($.fn, "select");
            wut.selectAll();
            expect($.fn.focus).toHaveBeenCalled();
            expect(focusSpy.calls.mostRecent().object.selector).toEqual('#link');
            expect($.fn.select).toHaveBeenCalled();
            expect(selectSpy.calls.mostRecent().object.selector).toEqual('#link');
        });

    });

    describe('wut.executeCopy',function() {

        it('should exist', function() {
            expect(wut.executeCopy).toBeTruthy();
            expect(wut.executeCopy).toEqual(jasmine.any(Function));
        });

        it('should act on the form', function() {
            jasmine.clock().install();
            var textAreaSpy = {
                    focus : jasmine.createSpy("focus"),
                    select : jasmine.createSpy("select"),
                    remove : jasmine.createSpy("remove")
                },
                addClassSpy = spyOn($.fn, "addClass"),
                removeClassSpy = spyOn($.fn, "removeClass");

            if (typeof document.execCommand === "undefined") {
                document.execCommand = jasmine.createSpy();
            } else {
                spyOn(document,"execCommand");
            }
            spyOn(document,"createElement").and.returnValue(textAreaSpy);
            spyOn(document.body,"appendChild");

            wut.executeCopy();
            
            expect(textAreaSpy.focus).toHaveBeenCalled();
            expect(textAreaSpy.select).toHaveBeenCalled();
            expect(textAreaSpy.remove).toHaveBeenCalled();
            expect(document.createElement).toHaveBeenCalledWith("textarea");
            expect(document.execCommand).toHaveBeenCalledWith("Copy");
            expect($.fn.addClass).toHaveBeenCalledWith("copied");

            jasmine.clock().tick(2001);
            expect($.fn.removeClass).toHaveBeenCalledWith("copied");
        });

    });

    describe('wut.generateLink',function() {

        it('should exist', function() {
            expect(wut.generateLink).toBeTruthy();
            expect(wut.generateLink).toEqual(jasmine.any(Function));
        });

        it('makes calls to attr and val',function() {
            var valSpy = spyOn($.fn, "val"),
                attrSpy = spyOn($.fn, "attr");

            wut.generateLink();
            expect($.fn.val).toHaveBeenCalled();
            expect($.fn.attr).toHaveBeenCalledWith("placeholder");
        });

        it('returns false if the button is disabled',function() {
            var testVal;

            $("#testHolder").append('<a href="" id="generateLink" class="disabled"></a>');
            testVal = wut.generateLink();
            expect(testVal).toBe(false);
        });

        it('makes an ajax request to wut.link',function() {
            var ajaxSpy = spyOn($, "ajax"),
                ACTIVATE_DATE = "2010/01/01",
                DEACTIVATE_DATE = "2020/01/01",
                TEST_URL = "http://www.test.com",
                args;

            $("#testHolder").append('<a href="" id="generateLink" class=""></a>');
            $("#testHolder").append('<input id="urlField" value="' + TEST_URL + '">');
            $("#testHolder").append('<input id="activationDateField" value="' + ACTIVATE_DATE + '" />');
            $("#testHolder").append('<input id="deactivationDateField" value="' + DEACTIVATE_DATE + '" />');

            wut.generateLink();

            expect($.ajax).toHaveBeenCalled();

            args = ajaxSpy.calls.mostRecent().args[0];
            expect(args.url).toBe("http://wut.link/");
            expect(args.type).toBe("POST");
            expect(args.success).toEqual(jasmine.any(Function));
            expect(args.data).toEqual(jasmine.any(Object));
            expect(args.data.activateDate).toEqual(ACTIVATE_DATE);
            expect(args.data.deactivateDate).toEqual(DEACTIVATE_DATE);
            expect(args.data.url).toEqual(TEST_URL);

        });

        it('should handle a successful request',function() {
            var ajaxSpy = spyOn($, "ajax").and.callFake(function(e) {
                e.success({});
            });
            spyOn(wut,'handleResponse');
            $("#testHolder").append('<a href="" id="generateLink" class=""></a>');
            wut.generateLink();
            expect($.ajax).toHaveBeenCalled();
            expect(wut.handleResponse).toHaveBeenCalled();
        });

    });

    describe('wut.onGenerateLinkError',function() {

        it('should exist', function() {
            expect(wut.onGenerateLinkError).toBeTruthy();
            expect(wut.onGenerateLinkError).toEqual(jasmine.any(Function));
        });

        it('should generate a correctly formatted message', function() {
            var ERROR_MSG = "A link wasn't created because:<br><br>one<br>two",
            errors = {
                "one":"one",
                "two":"two"
            };
            spyOn(message,"show");
            wut.onGenerateLinkError(errors);
            expect(wut.message.show).toHaveBeenCalledWith(ERROR_MSG);
        });

    });

    describe('wut.onGenerateLinkSuccess',function() {

        it('should exist', function() {
            expect(wut.onGenerateLinkSuccess).toBeTruthy();
            expect(wut.onGenerateLinkSuccess).toEqual(jasmine.any(Function));
        });

        it('should modify the dom', function() {
            var PROXY_URL = 'http://wut.link/A',
                testResponse = {
                    proxyUrl : PROXY_URL
                },
                htmlSpy = spyOn($.fn, "html"),
                addClassSpy = spyOn($.fn, "addClass"),
                removeClassSpy = spyOn($.fn, "removeClass").and.callThrough();

            $("#testHolder").append('<a href="" id="generateLink" class="disabled"></a>');
            $("#testHolder").append('<div class="linkHolder"></div>');
            $("#testHolder").append('<div id="link"></div>');
            wut.onGenerateLinkSuccess(testResponse);
            expect($.fn.html).toHaveBeenCalledWith(PROXY_URL);
            expect($.fn.addClass).toHaveBeenCalledWith("loaded");
            expect($.fn.removeClass).toHaveBeenCalledWith("disabled");
        });

        it('should copy to the clipboard if copyAsap is checked',function() {
            var copySpy = spyOn(wut,"executeCopy");
            $("#testHolder").append('<input type="checkbox" id="copyAsap" checked />');
            wut.onGenerateLinkSuccess({});
            expect(wut.executeCopy).toHaveBeenCalled();
        });

        it('should not copy to the clipboard if copyAsap is not checked',function() {
            var copySpy = spyOn(wut,"executeCopy");
            $("#testHolder").append('<input id="copyAsap"  />');
            wut.onGenerateLinkSuccess({});
            expect(wut.executeCopy).not.toHaveBeenCalled();
        });
    });

    describe('wut.handleResponse',function() {

        it('should exist', function() {
            expect(wut.handleResponse).toBeTruthy();
            expect(wut.handleResponse).toEqual(jasmine.any(Function));
        });

        it('should direct to the error handler in the event of an error', function() {
            var errors = {
                    "one":"one"
                },
                response = {
                    errors: errors
                },
                errorSpy = spyOn(wut,"onGenerateLinkError"),
                sucessSpy = spyOn(wut,"onGenerateLinkSuccess");
            wut.handleResponse(response);
            expect(wut.onGenerateLinkError).toHaveBeenCalledWith(errors);
            expect(wut.onGenerateLinkSuccess).not.toHaveBeenCalled();
        });

        it('should direct to the success handler in the event of success', function() {
            var TEST_URL = "http://wut.link/A",
                response = {
                    proxyUrl: TEST_URL
                },
                errorSpy = spyOn(wut,"onGenerateLinkError"),
                sucessSpy = spyOn(wut,"onGenerateLinkSuccess");
            wut.handleResponse(response);
            expect(wut.onGenerateLinkError).not.toHaveBeenCalled();
            expect(wut.onGenerateLinkSuccess).toHaveBeenCalledWith(response);
        });
    });

    describe('wut.bindListeners',function() {

        it('should exist', function() {
            expect(wut.bindListeners).toBeTruthy();
            expect(wut.bindListeners).toEqual(jasmine.any(Function));
        });

        it('should look at the current chrome tab',function() {
            if (typeof chrome === "undefined") {
                global.chrome = {};
                global.chrome.tabs = {};
                global.chrome.tabs.query = jasmine.createSpy("query");
            } else {
                spyOn(chrome.tabs,"query");
            }
            spyOn($.fn,"on");
            
            wut.bindListeners();
            expect(chrome.tabs.query).toHaveBeenCalled();
            expect($.fn.on).toHaveBeenCalledWith("click",jasmine.any(Function));

        });
    });

    describe('wut.resetGenerateLinkButton',function() {
        it('should exist', function() {
            expect(wut.resetGenerateLinkButton).toBeTruthy();
            expect(wut.resetGenerateLinkButton).toEqual(jasmine.any(Function));
        });
        it('should modify the generateLink button',function() {
            spyOn($.fn,"removeClass");
            spyOn($.fn,"html");
            wut.resetGenerateLinkButton();
            expect($.fn.removeClass).toHaveBeenCalledWith("disabled");
            expect($.fn.html).toHaveBeenCalledWith("Create Link");
        });
    });

    describe('wut.onTabQuery',function() {
        it('should exist', function() {
            expect(wut.onTabQuery).toBeTruthy();
            expect(wut.onTabQuery).toEqual(jasmine.any(Function));
        });
        it('should set the placeholder value to the current tab',function() {
            var TABS_URL = 'http://www.test.com',
                tabs = [
                    {'url':TABS_URL}
                ];
            spyOn($.fn,"attr");
            wut.onTabQuery(tabs);
            expect($.fn.attr).toHaveBeenCalledWith("placeholder",TABS_URL);
        });
    });

});

describe('message', function() {

    it('should exist', function() {
        expect(message).toBeTruthy();
        expect(message).toEqual(jasmine.any(Object));
    });

    describe('message.show',function() {

        it('should exist', function() {
            expect(message.show).toBeTruthy();
            expect(message.show).toEqual(jasmine.any(Function));
        });

        it('should show a message',function() {
            var TEST_MSG = "test message";
            spyOn(message.container,"addClass");
            spyOn(message.message,"html");
            message.show(TEST_MSG);
            expect(message.container.addClass).toHaveBeenCalledWith("showing");
            expect(message.message.html).toHaveBeenCalledWith(TEST_MSG);
        });

    });

    describe('message.hide', function() {

        it('should exist', function() {
            expect(message.hide).toBeTruthy();
            expect(message.hide).toEqual(jasmine.any(Function));
        });

        it('should hide a message', function() {
            spyOn(message.container,"removeClass");
            message.hide();
            expect(message.container.removeClass).toHaveBeenCalledWith("showing");
        });

    });

    describe('message.bindListeners', function() {

        it('should exist', function() {
            expect(message.bindListeners).toBeTruthy();
            expect(message.bindListeners).toEqual(jasmine.any(Function));
        });

        it('should initialize the listeners', function() {
            spyOn($.fn,"find");
            spyOn($.fn,"on");
            message.bindListeners();
            expect($.fn.find).toHaveBeenCalledWith('.message:first');
            expect($.fn.on).toHaveBeenCalledWith("click",jasmine.any(Function));
        })

    });
    
});
