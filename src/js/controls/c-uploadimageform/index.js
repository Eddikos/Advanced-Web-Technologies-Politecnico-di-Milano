/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird');

function ViewModel(params) {
    var self = this;
    self.context = params.context;
    self.status = ko.observable('');
    self.fields = ko.observable({});
    self.errors = ko.observable({});

    self.started=ko.observable(undefined);
    self.ready=ko.observable(undefined);
    self.ended=ko.observable(undefined);

    self.trigger = function (id) {
        self.context.events[id](self.context, self.output);
    };
}

ViewModel.prototype.id = 'uploadimageform';

ViewModel.prototype.waitForStatusChange = function () {
    return this._initializing ||
           Promise.resolve();
};

ViewModel.prototype._compute = function () {
    this.output = {
        'image': this.input['image'],
    }
    var self = this,
        fields = {
            'image': ko.observable(this.input['image']),
        },
        errors = {
            'image': ko.observable(this.input['image-error']),
        };
    fields['image'].subscribe(function (value) {
        self.output['image'] = value;
        self.errors()['image'](undefined);
    });

    self.ready(undefined);
    self.started(undefined);
    self.ended(undefined);

    var campaignStatus = document.getElementById("campaignStatus").innerHTML;
    
    if(campaignStatus==="ready"){
        self.ready(true);
    } else if (campaignStatus==="started") {
        self.started(true);
    } else if (campaignStatus==="ended") {
        self.ended(true);
    }

    this.fields(fields);
    this.errors(errors);
    this.status('computed');
};


ViewModel.prototype.init = function (options) {
    options = options || {};
    this.output = undefined;
    this.fields({});
    this.errors({});
    this.input = options.input || {};
    this.status('ready');
    var self = this;
    this._initializing = new Promise(function (resolve) {
        setTimeout(function () {
            self._compute();
            resolve();
            self._initializing = undefined;
        }, 1);
    });
};

exports.register = function () {
    ko.components.register('c-uploadimageform', {
        viewModel: {
            createViewModel: function (params, componentInfo) {
                var vm = new ViewModel(params);
                params.context.vms[vm.id] = vm;
                ko.utils.domNodeDisposal.addDisposeCallback(componentInfo.element, function () { delete params.context.vms[vm.id]; });
                return vm;
            }
        },
        template: require('./index.html'),
        synchronous: true
    });
};
