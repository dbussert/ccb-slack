'use strict';

var _ = require('underscore'),
	ejs = require('ejs'),
	fs = require('fs'),
	Promise = require('bluebird');

Promise.promisifyAll(fs);

module.exports.renderEJS = function(path, obj) {
	return fs.readFileAsync(path, 'utf8').then(function(template) {
		return ejs.render(template, obj);
	})
};
