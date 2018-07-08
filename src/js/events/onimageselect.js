/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        if (!context.vms['managerwindow']) {
            context.top.active('managerwindow');
            context.vms['managerwindow'].init({mask: 'imagedetails'});
        }
        data = data || {};
        var packet = {
            'id' : data['id'],
            'canonical' : data['canonical']
        };
        context.vms['imagedetails'].init(context, {input: packet});
    };
};
