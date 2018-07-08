/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data,errorField) {
        data = data || {};
        var packet = {
            'fullname' : data['fullname']
            ,'password' : data['password']
            ,'type' : data['type']
            ,'username' : data['username']
        };
        
        var promise = context.actions['registration']({filters: packet,error:errorField});
        context.runningActionsByContainer['homepage'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['homepage'].splice(
                context.runningActionsByContainer['homepage'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
