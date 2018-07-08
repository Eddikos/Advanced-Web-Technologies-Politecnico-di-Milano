/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        if (!context.vms['managerwindow']) {
            context.top.active('managerwindow');
            context.vms['managerwindow'].init({mask: 'campaigndetails'});
        }
        data = data || {};
        var packet = {
            'id' : data['id']
        };
        context.vms['campaigndetails'].init({input: packet});
    };
};
