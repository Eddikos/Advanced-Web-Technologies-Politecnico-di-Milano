/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird'),
    $ = require('jquery');

function ViewModel(params) {
    var self = this;
    self.context = params.context;
    self.status = ko.observable('');
    self.fields = ko.observable({});
    self.errors = ko.observable({});

    self.trigger = function (id) {
        self.context.events[id](self.context, self.output);
    };
}

ViewModel.prototype.id = 'campaignnumbers';

ViewModel.prototype.waitForStatusChange = function () {
    return this._propagating ||
           this._initializing ||
           Promise.resolve();
};

ViewModel.prototype._compute = function () {
    if (this._propagating) {
        this._propagating.cancel();
    }
    this.output = {
        'id': this.input['id'],
        'annotation_replica': this.input['annotation_replica'],
        'annotation_size': this.input['annotation_size'],
        'name': this.input['name'],
        'selection_replica': this.input['selection_replica'],
        'threshold': this.input['threshold'],
    }
    var self = this,
        fields = {
            'id': ko.observable(this.input['id']),
            'annotation_replica': ko.observable(this.input['annotation_replica']),
            'annotation_size': ko.observable(this.input['annotation_size']),
            'name': ko.observable(this.input['name']),
            'selection_replica': ko.observable(this.input['selection_replica']),
            'threshold': ko.observable(this.input['threshold']),
        },
        errors = {
            'annotation_replica': ko.observable(this.input['annotation_replica-error']),
            'annotation_size': ko.observable(this.input['annotation_size-error']),
            'name': ko.observable(this.input['name-error']),
            'selection_replica': ko.observable(this.input['selection_replica-error']),
            'threshold': ko.observable(this.input['threshold-error']),
        };
    fields['id'].subscribe(function (value) {
        self.output['id'] = value;
        self.errors()['id'](undefined);
    });
    fields['annotation_replica'].subscribe(function (value) {
        self.output['annotation_replica'] = value;
        self.errors()['annotation_replica'](undefined);
    });
    fields['annotation_size'].subscribe(function (value) {
        self.output['annotation_size'] = value;
        self.errors()['annotation_size'](undefined);
    });
    fields['name'].subscribe(function (value) {
        self.output['name'] = value;
        self.errors()['name'](undefined);
    });
    fields['selection_replica'].subscribe(function (value) {
        self.output['selection_replica'] = value;
        self.errors()['selection_replica'](undefined);
    });
    fields['threshold'].subscribe(function (value) {
        self.output['threshold'] = value;
        self.errors()['threshold'](undefined);
    });
    this.fields(fields);
    this.errors(errors);
    this.status('computed');

    var campaignStatus = document.getElementById("campaignStatus").innerHTML;

    if(campaignStatus !== 'ready') {

        $("#campaignnumbers_field_0, #campaignnumbers_field_1, #campaignnumbers_field_2, #campaignnumbers_field_3, #campaignnumbers_field_4").each(function(){
            $(this).prop('disabled', true);
            $('#saveCampaignNumbers').addClass('disabled');
        });
    } else {
        $("#campaignnumbers_field_0, #campaignnumbers_field_1, #campaignnumbers_field_2, #campaignnumbers_field_3, #campaignnumbers_field_4").each(function(){
            $(this).prop('disabled', false);
            $('#saveCampaignNumbers').removeClass('disabled');
        });
    }
    
};

ViewModel.prototype._allComputed = function () {
    if (!this.context.vms['campaigndetails'] || this.context.vms['campaigndetails'].status() !== 'computed') {
        return false;
    }
    return true;
}
ViewModel.prototype._firstNotReady = function() {
    if (!this.context.vms['campaigndetails']) {
        return Promise.reject();
    }
    if (this.context.vms['campaigndetails'].status() !== 'computed') {
        return this.context.vms['campaigndetails'].waitForStatusChange();
}
    return Promise.resolve();
};

ViewModel.prototype._waitForDependencies = function () {
    if (this._allComputed()) {
        return Promise.resolve();
    } else {
        var self = this;
        return this._firstNotReady().then(function () {
            return self._waitForDependencies();
        });
    }
};

ViewModel.prototype._propagate = function() {
    if (this._propagating) {
        this._propagating.cancel();
    }
    var self = this;
    this._propagating = this._waitForDependencies().then(function () {
        self.input['annotation_replica'] = self.input['annotation_replica'] || (
            self.context.vms['campaigndetails'].output &&
            self.context.vms['campaigndetails'].output['annotation_replica']);
        self.input['name'] = self.input['name'] || (
            self.context.vms['campaigndetails'].output &&
            self.context.vms['campaigndetails'].output['name']);
        self.input['annotation_size'] = self.input['annotation_size'] || (
            self.context.vms['campaigndetails'].output &&
            self.context.vms['campaigndetails'].output['annotation_size']);
        self.input['selection_replica'] = self.input['selection_replica'] || (
            self.context.vms['campaigndetails'].output &&
            self.context.vms['campaigndetails'].output['selection_replica']);
        self.input['threshold'] = self.input['threshold'] || (
            self.context.vms['campaigndetails'].output &&
            self.context.vms['campaigndetails'].output['threshold']);
        self.input['id'] = self.input['id'] || (
            self.context.vms['campaigndetails'].output &&
            self.context.vms['campaigndetails'].output['id']);
        self.status('ready');
        self._propagating = undefined;
        self._compute();
    });
};

ViewModel.prototype.init = function (options) {
    options = options || {};
    this.output = undefined;
    this.fields({});
    this.errors({});
    this.input = options.input || {};
    this.status('clear');
    var self = this;
    this._initializing = new Promise(function (resolve) {
        setTimeout(function () {
            self._propagate();
            resolve();
            self._initializing = undefined;
        }, 1);
    });
};

exports.register = function () {
    ko.components.register('c-campaignnumbers', {
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
