/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        data = data || {};
        var packet = {
            'id' : data['id']
        };
        var promise = context.actions['deleteimageaction'](context, {filters: packet});
        context.runningActionsByContainer['campaigndiv'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['campaigndiv'].splice(
                context.runningActionsByContainer['campaigndiv'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};