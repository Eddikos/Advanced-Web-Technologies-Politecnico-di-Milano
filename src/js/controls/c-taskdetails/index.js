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

    self.visible=ko.observable(undefined);

    self.trigger = function (id) {
        self.context.events[id](self.context, self.item());
    };
}

ViewModel.prototype.id = 'taskdetails';

ViewModel.prototype.fields = {
    id: 1
    ,'id': 1
    ,'session': 1
    ,'statistics': 1
    ,'type': 1
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

    self.visible(undefined);

    this._computing = this._repository.getTasks(self.context, url).then(function (item) {
        self.output = item;
        self.item(item);

        $.ajax({
            url: 'http://awt.ifmledit.org' + item.session,
            headers: {
                "Authorization": "APIToken " + self.context.repositories['token']
            },
            type: "POST",
            contentType: "application/json",
            error: function(err, textStatus, errorThrown) { 
                if(err.status == 404  || err.status == 410 || errorThrown == 'Not Found') { 
                    self.visible(undefined);
                }
            },
        }).done(function (result) {

            self.visible(true);

        }).fail(function (err) {
            self.visible(undefined);
        });


        self.context.vms['taskstatistics'].init(item.statistics);

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
            if (options.input){
                self._compute(options.input.id);
            } else {
                self._compute(options);
            }
            resolve();
            self._initializing = undefined;
        }, 1);
    });
};

exports.register = function () {
    ko.components.register('c-taskdetails', {
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
