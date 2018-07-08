/*jslint node: true, nomen: true */
"use strict";

var Promise = require('bluebird');

function Action() { // add "options" parameters if needed
    // TODO: Global Initialization
    /*
    example:
    this.collection = options.repositories.mail;
    */
}

exports.createAction = function (options) {
    var action = new Action(options);
    return function (context, data) {
        return new Promise(function (solve, reject, onCancel) {
            var parameters = (data && data.filters) || {};
            action.run(context, parameters, solve, onCancel);
        });
    };
};

Action.prototype.run = function (context, parameters, solve) { // add "onCancel" parameters if needed

    var self = this;
    return new Promise(function (resolve, reject) {
        
        var requestType = '';
        if (parameters['status'] == 'ready'){
            requestType = 'POST';
        } else if (parameters['status'] == 'started') {
            requestType = 'DELETE';
        }

        $.ajax({
            url: 'http://awt.ifmledit.org' + parameters['executionurl'],
            headers: {
                "Authorization": "APIToken " + context.repositories['token']
            },
            type: requestType,
            contentType: "application/json"
        }).done(function (result) {

            $.notify({message: 'Campaign Started'}, {allow_dismiss: true, type: 'success'});
            solve({
                event: 'reloadcampaignslist', // reload
                data: {
                    'url': parameters['id'],
                }
            });

        }).fail(function (err) {
            console.log(err);
            var error=new Error(err);
            if (err.responseJSON)
                error.textStatus=JSON.stringify(err.responseJSON.error);
            else if(err.responseText)
                error.textStatus=err.responseText;
            else if (err.message)
                error.textStatus=err.message;
            else
                error.textStatus="Couldn't Start the Campaign";    
           console.log(error.textStatus);
        });
    });
};