/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        if (!context.vms['workerwindow']) {
            context.top.active('workerwindow');
            context.vms['workerwindow'].init({mask: 'taskdetails'});
        }
        data = data || {};
        var packet = {
            'id' : data['id']
        };
        context.vms['taskdetails'].init({input: packet});
    };
};
