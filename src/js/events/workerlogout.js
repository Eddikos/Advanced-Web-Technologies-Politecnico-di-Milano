/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context) {
        var promise = context.actions['logout'](context);
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
