/* globals describe, it, expect, jasmine, spyOn, require */
"use strict";

// Node.js logic to pull in the code if it's not here

if (typeof wut === "undefined") {
    var wut = require("../lib/Wutcontroller.js");
}

if (typeof message === "undefined") {
    var message = require("../lib/AlertController.js");
}

if (typeof document === "undefined") {
    //fake browser window
    global.document = require("node-jsdom").jsdom();
    global.window = global.document.parentWindow;
    global.jQuery = require("jquery");
    global.$ = global.jQuery;
}

// tests for front and back end

describe('wut', function() {
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
            while(number--) {
                testNum = wut.pad(number);
                expect(testNum).toEqual('0'+number);
            }
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
        // note: for node-jsdom, contentEditable is not implemented, so we 
        // can't mock this method without lots of polyfills
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
    });
    describe('wut.onGenerateLinkError',function() {
        it('should exist', function() {
            expect(wut.onGenerateLinkError).toBeTruthy();
            expect(wut.onGenerateLinkError).toEqual(jasmine.any(Function));
        });
    });
    describe('wut.onGenerateLinkSuccess',function() {
        it('should exist', function() {
            expect(wut.onGenerateLinkSuccess).toBeTruthy();
            expect(wut.onGenerateLinkSuccess).toEqual(jasmine.any(Function));
        });
    });
    describe('wut.bindListeners',function() {
        it('should exist', function() {
            expect(wut.bindListeners).toBeTruthy();
            expect(wut.bindListeners).toEqual(jasmine.any(Function));
        });
    });
    describe('wut.resetGenerateLinkButton',function() {
        it('should exist', function() {
            expect(wut.resetGenerateLinkButton).toBeTruthy();
            expect(wut.resetGenerateLinkButton).toEqual(jasmine.any(Function));
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
    });
    describe('message.hide',function() {
        it('should exist', function() {
            expect(message.hide).toBeTruthy();
            expect(message.hide).toEqual(jasmine.any(Function));
        });
    });
    describe('message.bindListeners',function() {
        it('should exist', function() {
            expect(message.bindListeners).toBeTruthy();
            expect(message.bindListeners).toEqual(jasmine.any(Function));
        });
    });
    
});