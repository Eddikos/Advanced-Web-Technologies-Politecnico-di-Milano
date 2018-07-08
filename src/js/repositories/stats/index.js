/*jslint node: true, nomen: true */
"use strict";

var Promise = require('bluebird'),
    DataStore = require('nedb');

function Repository(options) {
    if (!(this instanceof Repository)) {
        return new Repository(options);
    }

    // TODO: initialization

    // TODO: remove this BEGIN
    
    // TODO: remove this END
}

Repository.prototype.getCampaignStats = function (context, url) {
    return new Promise(function (resolve, reject) {

        $.ajax({
            url: 'http://awt.ifmledit.org' + url,
            headers: {
                "Authorization": "APIToken " + context.repositories["token"]
            },
            type: 'GET',
            contentType: "application/json"
        }).done(function (result) {

            this.db = Promise.promisifyAll(new DataStore({
                filename: 'stats',
                inMemoryOnly: true
            }));
            this.db.insert(result);
            
            resolve(result);

        }).fail(function (err) {
            var error=new Error(err);
            if (err.responseJSON)
                error.textStatus=JSON.stringify(err.responseJSON.error);
            else if(err.responseText)
                error.textStatus=err.responseText;
            else if (err.message)
                error.textStatus=err.message;
            else
                error.textStatus="Campaign Statistics could not be gotten";    
            console.log(error.textStatus);
        });
    });
};

Repository.prototype.getTaskStats = function (context, url) {
    return new Promise(function (resolve, reject) {

        $.ajax({
            url: 'http://awt.ifmledit.org' + url,
            headers: {
                "Authorization": "APIToken " + context.repositories["token"]
            },
            type: 'GET',
            contentType: "application/json"
        }).done(function (result) {

            this.db = Promise.promisifyAll(new DataStore({
                filename: 'stats',
                inMemoryOnly: true
            }));
            this.db.insert(result);
            
            resolve(result);

        }).fail(function (err) {
            var error=new Error(err);
            if (err.responseJSON)
                error.textStatus=JSON.stringify(err.responseJSON.error);
            else if(err.responseText)
                error.textStatus=err.responseText;
            else if (err.message)
                error.textStatus=err.message;
            else
                error.textStatus="Task Statistics could not be gotten";    
            console.log(error.textStatus);
        });
    });
};

Repository.prototype.findById = function (id) {
    // TODO: implement the accessor to the datasource which returns a promise
    // TODO: remove this BEGIN
    return this.db.findOneAsync({id: id});
    // TODO: remove this END
};

Repository.prototype.find = function (fields, project) {
    // TODO: implement the accessor to the datasource which returns a promise
    // TODO: remove this BEGIN
    return this.db.findAsync(fields, project);
    // TODO: remove this END
};

exports.createRepository = Repository;
