/*jslint node: true, nomen: true */
"use strict";

exports.createRepositories = function (options) {
    var repositories = {}
    repositories['campaign'] = require('./campaign').createRepository(options);
    repositories['worker'] = require('./worker').createRepository(options);
    repositories['image'] = require('./image').createRepository(options);
    repositories['stats'] = require('./stats').createRepository(options);
    repositories['task'] = require('./task').createRepository(options);
    repositories['Task'] = require('./Task').createRepository(options);
    repositories['token'] = '';
    return repositories;
};
