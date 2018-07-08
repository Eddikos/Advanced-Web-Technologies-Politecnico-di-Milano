/*jslint node: true, nomen: true */
"use strict";

var Promise = require('bluebird');
var DataStore = require('nedb');
var $ = require('jquery');
var self;

function Repository(options) {
    if (!(this instanceof Repository)) {
        return new Repository(options);
    }
    //this.flag=false;
    
    self = this;
}

Repository.prototype.getTasks = function (context, id) {
    return new Promise(function (resolve, reject) {
        var url = "";

        if (id == 0 || id == undefined){
            url = "/api/task"
        } else if (id != 0) {
            url = id;
        }

        $.ajax({
            url: 'http://awt.ifmledit.org' + url,
            headers: {
                "Authorization": "APIToken " + context.repositories["token"]
            },
            type: 'GET',
            contentType: "application/json"
        }).done(function (result) {
            
            if (id == 0 || id == undefined){
                this.db = Promise.promisifyAll(new DataStore({
                    filename: 'tasks',
                    inMemoryOnly: true
                }));

                this.db.insert(result.tasks);

                resolve(result.tasks);
            } else if (id != 0) {
                this.db = Promise.promisifyAll(new DataStore({
                    filename: 'task',
                    inMemoryOnly: true
                }));

                this.db.insert(result);

                resolve(result);
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
                error.textStatus="Tasks could not be gotten";    
           console.log(error.textStatus);
        });
    });
};
Repository.prototype.findById = function (id) {
    // TODO: implement the accessor to the datasource which returns a promise
    // TODO: remove this BEGIN
    //return this.db.findOneAsync({id: id});
    // TODO: remove this END
};

Repository.prototype.find = function (fields, project) {
    // TODO: implement the accessor to the datasource which returns a promise
    // TODO: remove this BEGIN
    return this.db.findAsync(fields, project);
    // TODO: remove this END
};

exports.createRepository = Repository;
