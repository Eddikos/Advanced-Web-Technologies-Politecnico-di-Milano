/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird');

function ViewModel(params) {
    var self = this;
    self._repository = params.context.repositories['worker'];
    self.context = params.context;
    self.status = ko.observable('');
    self.selected = ko.observable(undefined);
    self.items = ko.observableArray([]);

    self.ready=ko.observable(undefined);

    self.select = function() {
        self.selected(this.id);
        self.output = this;
    };

    self.trigger = function (id) {
        self.context.events[id](self.context, this);
    };
}

ViewModel.prototype.id = 'workerlist';

ViewModel.prototype.fields = {
    id: 1
    ,'annotator': 1
    ,'fullname': 1
    ,'id': 1
    ,'selector': 1
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
    self.ready(undefined);

    var self = this;
    this._computing = this._repository.getWorkers(self.context, url).then(function (items) {
        self.selected(undefined);
        for (var i = 0; i < items.length; i++) { 
            items[i].selection = items[i].id + "/selection";
            items[i].annotation = items[i].id + "/annotation";
        }

        var campaignStatus = document.getElementById("campaignStatus").innerHTML;

        if(campaignStatus==="ready"){
            self.ready(true);
        }
        
        self.items(items);
        if (items.length) {
            self.selected(items[0].id);
            self.output = items[0];
        }

        $(function() {
            $('.toggle-one').bootstrapToggle({
                on: 'Enabled',
                off: 'Disabled'
            });
        })

        $(function() {
            $('.toggle-one').change(function() {
                $('#console-event').html('Toggle: ' + $(this).prop('checked'))
            })
        })


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
    ko.components.register('c-workerlist', {
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
    if (!this.context.vms['campaigndetails'] || this.context.vms['campaigndetails'].status() !== 'computed') {
        return false;
    }
    return true;
};

ViewModel.prototype._firstNotReady = function() {
    if (!this.context.vms['campaigndetails']) {
        return Promise.reject();
    }
    if (this.context.vms['campaigndetails'].status() !== 'computed') {
        return this.context.vms['campaigndetails'].waitForStatusChange();
    }
    return Promise.resolve();
};

ViewModel.prototype._waitForDependencies = function() {
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
    if (this._computing) {
        this._computing.cancel();
    }
    var self = this;
    this._propagating = this._waitForDependencies().then(function () {
        self.filters['id'] = self.filters['id'] || (
            self.context.vms['campaigndetails'].output &&
            self.context.vms['campaigndetails'].output['worker']);
        self.status('ready');
        self._propagating = undefined;
        self._compute();
    });
};
*/
