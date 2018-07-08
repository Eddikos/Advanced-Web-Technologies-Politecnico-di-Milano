/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        if (!context.vms['managerwindow']) {
            context.top.active('managerwindow');
            context.vms['managerwindow'].init({mask: 'campaignnumbers'});
        }
        data = data || {};
        var packet = {
            'annotation_replica' : data['annotation_replica']
            ,'annotation_size' : data['annotation_size']
            ,'selection_replica' : data['selection_replica']
            ,'threshold' : data['threshold']
            ,'name' : data['name']
            ,'id' : data['id']
        };
        context.vms['campaignnumbers'].init({input: packet});
    };
};
