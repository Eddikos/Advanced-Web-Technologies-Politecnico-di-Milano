/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        data = data || {};
        var packet = {
            'annotation_replica' : data['annotation_replica']
            ,'annotation_size' : data['annotation_size']
            ,'name' : data['name']
            ,'selection_replica' : data['selection_replica']
            ,'threshold' : data['threshold']
        };
        var promise = context.actions['createcampaign'](context,{filters: packet});
        context.runningActionsByContainer['campaignslist'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['campaignslist'].splice(
                context.runningActionsByContainer['campaignslist'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
