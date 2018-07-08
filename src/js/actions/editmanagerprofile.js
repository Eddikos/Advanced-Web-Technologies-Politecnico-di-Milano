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

        $.ajax({
            url: 'http://awt.ifmledit.org'+"/api/user/me",
            headers: {
                "Authorization": "APIToken " + context.repositories['token']
            },
            type: 'PUT',
            contentType: "application/json",
            data: JSON.stringify({
                "fullname": parameters['fullname'],
                "password": parameters['password']
            })
        }).done(function (result) {
            
            $.notify({message: 'Edit Profile'}, {allow_dismiss: true, type: 'success'});
            solve({
                event: 'onchangesfinish', // OnFinish
                data: {
                    'error': '0',
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
                error.textStatus="Something Went Wrong in the request";    
           console.log(error.textStatus);
        });
    });
};