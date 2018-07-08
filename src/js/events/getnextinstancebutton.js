/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        if (!context.vms['workerwindow']) {
            context.top.active('workerwindow');
            context.vms['workerwindow'].init({mask: 'nexttask'});
        }
        data = data || {};
        var packet = {
            'sessionurl' : data['sessionurl'],
            'image' : data['image'],
            'size' : data['size'],
            'type' : data['type'],
        };
        context.vms['nexttask'].init({input: packet});
    };
};
