/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        data = data || {};
        var packet = {
            'fullname' : data['fullname']
            ,'password' : data['password']
        };
        var promise = context.actions['workerprofilechange'](context, {filters: packet});
        context.runningActionsByContainer['workerwindow'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['workerwindow'].splice(
                context.runningActionsByContainer['workerwindow'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
