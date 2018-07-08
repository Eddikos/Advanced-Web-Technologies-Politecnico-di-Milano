/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird');

function ViewModel(params) {
    var self = this;
    self._repository = params.context.repositories['task'];
    self.context = params.context;
    self.status = ko.observable('');
    self.item = ko.observable(undefined);
    self.line=ko.observable();
    self.size=ko.observable();
    self.image=ko.observable();
    self.trigger = function (id,value) {
        var optional=undefined;
        if(value==undefined)
        {
            value=self.line();
            optional="annotation";
        }
       
        self.context.events[id](self.context, self.item()['sessionurl'],value,optional);
    };
    self.clear=function(){
        self.context.vms["line-drawer"].clear();
    }
}

ViewModel.prototype.id = 'nexttask';

ViewModel.prototype.fields = {
    id: 1
    ,'image': 1
    ,'sessionurl': 1
    ,'size': 1
    ,'type': 1
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
    //this._computing = this._repository.findById(this.filters.id, this.fields).then(function (item) {
    options.input.image = 'http://awt.ifmledit.org/' + options.input.image;
    self.image(options.input.image);
    self.output = options.input;
    self.size(options.input.size);
    self.item(options.input);
    self.status('computed');
    self._computing = undefined;
    //});
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
    ko.components.register('c-nexttask', {
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
