/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird');

function ViewModel(params) {
    var self = this;
    self._repository = params.context.repositories['stats'];
    self.context = params.context;
    self.status = ko.observable('');
    self.item = ko.observable(undefined);

    self.trigger = function (id) {
        self.context.events[id](self.context, self.item());
    };
}

ViewModel.prototype.id = 'taskstatistics';

ViewModel.prototype.fields = {
    id: 1
    ,'accepted': 1
    ,'annotated': 1
    ,'available': 1
    ,'rejected': 1
};

ViewModel.prototype.waitForStatusChange = function () {
    return //this._propagating ||
           this._computing ||
           this._initializing ||
           Promise.resolve();
};

ViewModel.prototype._compute = function(url) {
    // if (this._propagating) {
    //     this._propagating.cancel();
    // }
    if (this._computing) {
        this._computing.cancel();
    }

    var self = this;
    this._computing = this._repository.getTaskStats(self.context, url).then(function (item) {
        self.output = item;
        self.item(item);
        self.status('computed');
        self._computing = undefined;
    });
};

ViewModel.prototype.init = function (options) {
    options = options || {};
    this.output = undefined;
    this.filters = options.input || {};
    this.status('clear');
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
    ko.components.register('c-taskstatistics', {
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
    if (!this.context.vms['taskdetails'] || this.context.vms['taskdetails'].status() !== 'computed') {
        return false;
    }
    return true;
};

ViewModel.prototype._firstNotReady = function () {
    if (!this.context.vms['taskdetails']) {
        return Promise.reject();
    }
    if (this.context.vms['taskdetails'].status() !== 'computed') {
        return this.context.vms['taskdetails'].waitForStatusChange();
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
            self.context.vms['taskdetails'].output &&
            self.context.vms['taskdetails'].output['statistics']);
        self.status('ready');
        self._propagating = undefined;
        self._compute();
    });
};
*/