/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, url) {
        if (!context.vms['managerwindow']) {
            context.top.active('managerwindow');
            context.vms['managerwindow'].init({mask: 'imagelist'});
        }
        context.vms['imagelist'].init();
    };
};
