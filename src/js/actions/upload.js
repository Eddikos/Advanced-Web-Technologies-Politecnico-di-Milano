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

    var input = document.getElementById("uploadimageform_field_0");
    var campaignId = document.getElementById("campaignnumbers_field_5").value;

//params.context.repositories['image'].uploadImage();
//Repository.prototype.upload = function (context, image) {

    for (var key in input.files) {
        if (input.files.hasOwnProperty(key)) {
            var image = input.files[key];
            var fd = new FormData();
            fd.append("image", image); // Append the file
            
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: 'http://awt.ifmledit.org' + campaignId + '/image',
                    type: "POST",
                    contentType: false,
                    processData: false,
                    data:fd,
                    headers: {
                        "Authorization": "APIToken "+context.repositories["token"]
                    },
                }).done(function (result,a,request) {

                    $.notify({message: 'Upload'}, {allow_dismiss: true, type: 'success'});
                    solve({
                        event: 'imagelistreload', // reload
                        data: {
                            'url': campaignId + '/image',
                        }
                    });

                }).error(function (err) {
                    var error=new Error(err);
                    if(err.responseJSON)
                        error.textStatus=JSON.stringify(err.responseJSON.error);
                    else if(err.responseText)
                        error.textStatus=err.responseText;
                    else if (err.message)
                        error.textStatus=err.message;
                    else
                        error.textStatus="Upload Failed";    
                    reject(error);
                });
            });
        }
    }
};