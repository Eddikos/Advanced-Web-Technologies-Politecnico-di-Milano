/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
    	data = data || {};
        var packet = {
            'campaignURL' : data['url']
        };
        if (!context.vms['managerwindow']) {
            context.top.active('managerwindow');
            context.vms['managerwindow'].init({mask: 'campaignlist'});
        }
        context.vms['campaignlist'].init(data);
    };
};
