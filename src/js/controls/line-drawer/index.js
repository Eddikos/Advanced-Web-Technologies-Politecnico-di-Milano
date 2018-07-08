/*jslint browser: true */
/*globals ko, $ */
var ko = require('knockout'),
    Promise = require('bluebird');
var con;
var canvas;
(function () {
    
    "use strict";
    ko.bindingHandlers.LineDrawSetSize = {
        update: function (element, valueAccessor) {
            var value = valueAccessor()();
            if (!value) { return; }
            element.height = value.height;
            element.width = value.width;
        }
    };

    ko.bindingHandlers.LineDrawNaturalSize = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();
            function update() {
                value({
                    width: element.naturalWidth,
                    height: element.naturalHeight
                });
            }
            update();
            $(element).on('load', update);
        }
    };

    ko.bindingHandlers.LineDraw = {
        init: function (element, valueAccessor) {
            var value = valueAccessor(),
                ctx = element.getContext('2d'),
                $element = $(element);
                con=ctx;
                canvas=element;
            $element.on('mousedown', function (e) {
                var x = (e.pageX - $element.offset().left) / $element.width() * element.width,
                    y = (e.pageY - $element.offset().top) / $element.height() * element.height;
                ctx.beginPath();
                ctx.moveTo(x, y);
                function draw(e) {
                    var pen = parseInt($element.data('pen'), 10) || 1,
                        tx = (e.pageX - $element.offset().left) / $element.width() * element.width,
                        ty = (e.pageY - $element.offset().top) / $element.height() * element.height;
                    ctx.lineTo(tx, ty);
                    ctx.strokeStyle = 'rgb(255,0,0)';
                    ctx.lineWidth = pen;
                    ctx.lineCap = 'round';
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(tx, ty);
                }
                function end() {
                    $element.off('mousemove', draw);
                    $element.off('mouseup', end);
                    value(element.toDataURL('image/png'));
                }
                $element.on('mousemove', draw);
                $element.on('mouseup', end);
            });
        }
    };

    ko.bindingHandlers.LineDrawPen = {
        update: function (element, valueAccessor) {
            var value = valueAccessor(),
                $element = $(element);
            $element.data('pen', value);
        }
    };
}());
    function ViewModel(params) {
        var self = this;
        self.src = params.src;
        self.pen = params.pen;
        self.line = params.line;
        self.clear=function(){
            con.clearRect(0, 0, canvas.width, canvas.height);
            self.line="";
        }
        self.showAnnotation=function(annotation){
            
            var img = new window.Image();
            con.clearRect(0, 0, canvas.width, canvas.height);
            img.src=annotation;
            con.drawImage(img,0,0);
        };
        self.disable=function(){
           $(canvas).off(); // remove event listeners     
        };
        self.naturalSize = ko.observable();
    }
ViewModel.prototype.id = 'line-drawer';

ViewModel.prototype.init = function (options) {
    options = options || {};
    this.output = undefined;
    this.filters = options.input || {};
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
    ko.components.register('line-drawer', {
        viewModel: {
            createViewModel: function (params, componentInfo) {
                var vm = new ViewModel(params);
                var id=vm.id;
                params.context.vms[id] = vm;
                //ko.utils.domNodeDisposal.addDisposeCallback(componentInfo.element, function () { delete params.context.vms[id]; });
                return vm;
            }
        },
        template: '<img data-bind="attr: { src: src }, LineDrawNaturalSize: naturalSize" class="background" draggable="false"><canvas data-bind="LineDraw: line, LineDrawSetSize: naturalSize, LineDrawPen: pen"></canvas>',
        synchronous: true
    });
};