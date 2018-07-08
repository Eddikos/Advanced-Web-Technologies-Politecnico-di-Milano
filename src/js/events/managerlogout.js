/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context) {
        var promise = context.actions['logout'](context);
        context.runningActionsByContainer['managerwindow'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['managerwindow'].splice(
                context.runningActionsByContainer['managerwindow'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
