/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird'),
    $ = require('jquery');

function ViewModel(params) {
    var self = this;
    self._repository = params.context.repositories['campaign'];
    self.context = params.context;
    self.status = ko.observable('');
    self.selected = ko.observable(undefined);
    self.items = ko.observableArray([]);

    self.select = function() {
        self.selected(this.id);
        self.output = this;
        self.trigger.call(this, 'campaignlist-selected');
        self.trigger.call(this, 'campaignparameterschange');
    };

    self.trigger = function (id) {
        self.context.events[id](self.context, this);
    };
}

ViewModel.prototype.id = 'campaignlist';

ViewModel.prototype.fields = {
    id: 1
    ,'id': 1
    ,'name': 1
    ,'status': 1
};

ViewModel.prototype.waitForStatusChange = function () {
    return this._computing ||
           this._initializing ||
           Promise.resolve();
};

ViewModel.prototype._compute = function(url) {
    if (this._computing) {
        this._computing.cancel();
    }
    
    var self = this;
    this._computing = this._repository.getCampaigns(self.context, 0).then(function(items){
        self.selected(undefined);
        self.items(items.campaigns);

        var result = undefined;

        for (var i = 0; i < items.campaigns.length; i++) {

            if (items.campaigns[i].id == url.url){
                result = items.campaigns[i];
            }
        }

        if(result != undefined){
            self.selected(result.id);
            self.output = result;
            self.context.events['campaignlist-selected'](self.context, result);
            self.context.events['campaignparameterschange'](self.context, result);
        }
        if (items.campaigns.length) {
            self.selected(items.campaigns[0].id);
            self.output = items.campaigns[0];
            self.context.events['campaignlist-selected'](self.context, items.campaigns[0]);
            self.context.events['campaignparameterschange'](self.context, items.campaigns[0]);
        }
        self.status('computed');
        self._computing = undefined;
    });
};


ViewModel.prototype.init = function (options) {
    options = options || {};
    this.output = undefined;
    this.filters = options.input || {};
    this.status('ready');
    var self = this;
    this._initializing = new Promise(function (resolve) {
        setTimeout(function () {
            self._compute(options);
            resolve();
            self._initializing = undefined;
        }, 1);
    });
};
//remo was here
exports.register = function () {
    ko.components.register('c-campaignlist', {
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