/*jslint node: true, nomen: true */
"use strict";

var Promise = require('bluebird');

function Action() { // add "options" parameters if needed

}

Action.prototype.run = function (errorField,parameters, solve) { // add "onCancel" parameters if needed

    var self = this;
    return new Promise(function (resolve, reject) {

        $.ajax({
            url: 'http://awt.ifmledit.org'+"/api/user",
            headers: {
                "Authorization": "APIKey b21a020e-aec7-42e9-a90d-f1bc45ce8b6d"
            },
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify({
                "fullname": parameters['fullname'],
                "username": parameters['username'],
                "password": parameters['password'],
                "type": parameters['type']
            })
        }).done(function (result) {
            
            $.notify({message: 'User has been registered!'}, {allow_dismiss: true, type: 'success'});
            solve({
                event: 'afterregistration',
                data: {
                }
            });

        }).fail(function (err) {
            var error=new Error(err);
            if (err.responseJSON)
                error.textStatus=JSON.stringify(err.responseJSON.error);
            else if(err.responseText)
                error.textStatus=err.responseText;
            else if (err.message)
                error.textStatus=err.message;
            else
                error.textStatus="Something Went Wrong in the request";    
           errorField(error.textStatus);
        });
    });
};

exports.createAction = function (options) {
    var action = new Action(options);
    return function (data) {
        return new Promise(function (solve, reject, onCancel) {
            var parameters = (data && data.filters) || {};
            action.run(data.error,parameters, solve, onCancel);
        });
    };
};
