/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        data = data || {};
        var packet = {
            'sessionurl' : data['session'],
            'id' : data['id']
        };
        var promise = context.actions['sessionstart'](context, {filters: packet});
        context.runningActionsByContainer['taskdetailsdiv'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['taskdetailsdiv'].splice(
                context.runningActionsByContainer['taskdetailsdiv'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
