/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context) {
        if (!context.vms['workerwindow']) {
            context.top.active('workerwindow');
        }
        context.vms['workerwindow'].init();
    };
};
