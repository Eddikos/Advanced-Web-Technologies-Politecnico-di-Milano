/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context) {
        if (!context.vms['homepage']) {
            context.top.active('homepage');
        }
        context.vms['homepage'].init();
    };
};
