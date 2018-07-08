/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        if (!context.vms['managerwindow']) {
            context.top.active('managerwindow');
            context.vms['managerwindow'].init({mask: 'imagelist'});
        }
        context.vms['imagelist'].init(data['url']);
    };
};
