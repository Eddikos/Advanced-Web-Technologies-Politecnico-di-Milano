/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird');

function ViewModel(params) {
    var self = this;
    self._repository = params.context.repositories['campaign'];
    self.context = params.context;
    self.status = ko.observable('');
    self.item = ko.observable(undefined);

    self.started=ko.observable(undefined);
    self.ready=ko.observable(undefined);
    self.ended=ko.observable(undefined);

    self.trigger = function (id) {
        self.context.events[id](self.context, self.item());
    };
}

ViewModel.prototype.id = 'campaigndetails';

ViewModel.prototype.fields = {
    id: 1
    ,'annotation_replica': 1
    ,'execution': 1
    ,'image': 1
    ,'name': 1
    ,'statistics': 1
    ,'worker': 1
    ,'id': 1
    ,'status': 1
    ,'selection_replica': 1
    ,'annotation_size': 1
    ,'threshold': 1
};

ViewModel.prototype.waitForStatusChange = function () {
    return this._computing ||
           this._initializing ||
           Promise.resolve();
};

ViewModel.prototype._compute = function(options) {
    if (this._computing) {
        this._computing.cancel();
    }
    var self = this;
    self.started(undefined);
    self.ready(undefined);
    self.ended(undefined);
    
    
    this._computing = this._repository.getCampaigns(self.context, options.input.id).then(function (item) {
        self.output = item;
        self.item(item);

        if(item.status=="ready"){
            self.ready(true);
            self.context.vms['campaignstatistics'].init(item.statistics);
            self.context.vms['uploadimageform'].init();
        } else if (item.status=="started") {
            self.started(true);
            self.context.vms['campaignstatistics'].init(item.statistics);
            self.context.vms['uploadimageform'].init();
        } else if (item.status=="ended") {
            self.ended(true);
            self.context.vms['campaignstatistics'].init(item.statistics);
            self.context.vms['uploadimageform'].init();
        }
            
        // If successful then u can call others as well
        self.context.vms['imagelist'].init(item.image);
        self.context.vms['workerlist'].init(item.worker);


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

exports.register = function () {
    ko.components.register('c-campaigndetails', {
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