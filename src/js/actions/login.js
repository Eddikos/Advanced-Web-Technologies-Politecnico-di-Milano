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
            action.run(data.error, context, parameters, solve, onCancel);
        });
    };
};

Action.prototype.run = function (errorField, context, parameters, solve) { // add "onCancel" parameters if needed
    
    var self = this;
    return new Promise(function (resolve, reject) {

        $.ajax({
            url: 'http://awt.ifmledit.org'+"/api/auth",
            headers: {
                "Authorization": "APIKey b21a020e-aec7-42e9-a90d-f1bc45ce8b6d"
            },
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify({
                "username": parameters['username'],
                "password": parameters['password']
            })
        }).done(function (result) {
            
            context.repositories["token"]=result.token;

            $.ajax({
                url: 'http://awt.ifmledit.org'+"/api/user/me",
                headers: {
                    "Authorization": "APIToken " + result.token
                },
                type: 'GET',
                contentType: "application/json"
            }).done(function (user) {
                
                if (user.type == "master") {
                    $.notify({message: 'Manager Login'}, {allow_dismiss: true, type: 'success'});
                    solve({
                        event: 'loginmanager', // Manager Login
                        data: {
                            'error': '0',
                            'fullname': '0',
                            'token': result.token,
                            'type': '0',
                            'username': parameters['username'],
                        }
                    });
                } else if (user.type == "worker") {
                    $.notify({message: 'Worker Login'}, {allow_dismiss: true, type: 'success'});
                    solve({
                        event: 'workerlogin', // Manager Login
                        data: {
                            'error': '0',
                            'fullname': '0',
                            'token': result.token,
                            'type': '0',
                            'username': parameters['username'],
                        }
                    });
                }

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
           errorField(error.textStatus);
        });
    });
};


