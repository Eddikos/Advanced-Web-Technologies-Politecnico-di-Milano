/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        if (!context.vms['managerwindow']) {
            context.top.active('managerwindow');
        }
        data = data || {};
        var packet = {
            'fullname' : data['fullname']
        };
        context.vms['managerwindow'].init({input: packet});
    };
};
