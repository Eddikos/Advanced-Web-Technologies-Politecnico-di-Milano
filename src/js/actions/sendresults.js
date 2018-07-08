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

Action.prototype.run = function (context, packet, solve) { // add "onCancel" parameters if needed
    
    var data = {
        accepted: packet.value
    };
    if(packet.optional){
        data={
            skyline:packet.value
        };
    }

    var self = this;
    return new Promise(function (resolve, reject) {

        $.ajax({
            url: 'http://awt.ifmledit.org' + packet.sessionurl,
            headers: {
                "Authorization": "APIToken " + context.repositories['token']
            },
            type: 'PUT',
            contentType: "application/json",
            data: JSON.stringify(data)
        }).done(function () {

            $.notify({message: 'Results Sent'}, {allow_dismiss: true, type: 'success'});
            
            $.ajax({
                url: 'http://awt.ifmledit.org' + packet.sessionurl,
                headers: {
                    "Authorization": "APIToken " + context.repositories['token']
                },
                type: "GET",
                dataType:"json",
                contentType: "application/json",
                error: function(err, textStatus, errorThrown) { 
                    if(err.status == 404 || err.status == 410 || errorThrown == 'Not Found') { 
                        $.notify({message: "Couldn't get a new task"}, {allow_dismiss: true, type: 'danger'});
                        
                        $(function () {
                           $('#nextTask').modal('toggle');
                        });

                        context.vms['workerwindow'].init({mask: 'taskdetails'});
                        
                        var e=new Error(err);
                        e.textStatus=err.status;
                        reject(e); 
                    }
                     
                    var error=new Error(err);
                    if(err.status)
                        error.status=err.status;
                    else if(err.responseJSON)
                        error.textStatus=JSON.stringify(err.responseJSON.error);
                    else if(err.responseText)
                        error.textStatus=err.responseText;
                    else if (err.message)
                        error.textStatus=err.message;
                    else
                        error.textStatus="Couldn't get new task";    
                    reject(error);
                }
            }).done(function (result) {

                $.notify({message: 'Got a Task'}, {allow_dismiss: true, type: 'success'});
                solve({
                    event: 'getnextinstancebutton', // Get Next
                    data: {
                        'image': result.image,
                        'sessionurl': packet.sessionurl,
                        'size': result.size,
                        'type': result.type,
                    }
                });

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
   
    // THIS CAN BE REMOVED (END)
};
