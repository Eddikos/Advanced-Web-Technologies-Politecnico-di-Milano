/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird');

function ViewModel(params) {
    var self = this;
    self._repository = params.context.repositories['image'];
    self.context = params.context;
    self.status = ko.observable('');
    self.item = ko.observable(undefined);
    self.size = ko.observable(10);
    self.line = ko.observable("");

    self.visible=ko.observable(undefined);

    self.select = function(data) {
        self.context.vms['line-drawer'].showAnnotation(data);
        //self.context.vms['line-drawer'].disable();
    }

    self.trigger = function (id) {
        self.context.events[id](self.context, self.item());
    };
}

ViewModel.prototype.id = 'imagedetails';

ViewModel.prototype.fields = {
    id: 1
    ,'annotation': 1
    ,'selection': 1
};

ViewModel.prototype.waitForStatusChange = function () {
    return //this._propagating ||
           this._computing ||
           this._initializing ||
           Promise.resolve();
};


ViewModel.prototype._compute = function(image) {
    // if (this._propagating) {
    //     this._propagating.cancel();
    // }
    if (this._computing) {
        this._computing.cancel();
    }
    var self = this;
    
    self.visible(undefined);
    this._computing = this._repository.getImageInfo(self.context, image).then(function (item) {
        
        var campaignStatus = document.getElementById("campaignStatus").innerHTML;
        if(campaignStatus==="started" || campaignStatus==="ended"){
            self.visible(true);
        }

        self.output = item;
        self.item(item);
        self.status('computed');
        self._computing = undefined;
    });
};

ViewModel.prototype.init = function (options, packet) {
    options = options || {};
    this.output = undefined;
    this.filters = options.input || {};
    this.status('clear');
    var self = this;
    this._initializing = new Promise(function (resolve) {
        setTimeout(function () {
            self._compute(packet.input);
            resolve();
            self._initializing = undefined;
        }, 1);
    });
};

exports.register = function () {
    ko.components.register('c-imagedetails', {
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


/*
ViewModel.prototype._allComputed = function() {
    if (!this.context.vms['imagelist'] || this.context.vms['imagelist'].status() !== 'computed') {
        return false;
    }
    return true;
};

ViewModel.prototype._firstNotReady = function () {
    if (!this.context.vms['imagelist']) {
        return Promise.reject();
    }
    if (this.context.vms['imagelist'].status() !== 'computed') {
        return this.context.vms['imagelist'].waitForStatusChange();
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

ViewModel.prototype._propagate = function () {
    if (this._propagating) {
        this._propagating.cancel();
    }
    if (this._computing) {
        this._computing.cancel();
    }
    var self = this;
    this._propagating = this._waitForDependencies().then(function () {
        self.filters['id'] = self.filters['id'] || (
            self.context.vms['imagelist'].output &&
            self.context.vms['imagelist'].output['statistics']);
        self.status('ready');
        self._propagating = undefined;
        self._compute();
    });
};

*/
