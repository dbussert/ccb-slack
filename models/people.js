'use strict';

var Promise = require('bluebird'),
	request = require('request-promise'),
	xml2js = require('xml2js-promise');

module.exports.whois = function(obj) {
	var criteria = (obj.first_name ? "&first_name="+ obj.first_name: "") + (obj.last_name ? "&last_name="+ obj.last_name: "");

	return request({
		uri: 'https://' + process.env.ccb_username + ":" + process.env.ccb_password + "@" + process.env.ccb_url + '.ccbchurch.com/api.php?srv=individual_search' + criteria
	}).then(xml2js);
};

module.exports.since = function(obj) {
	return request({
		uri: 'https://' + process.env.ccb_username + ":" + process.env.ccb_password + "@" + process.env.ccb_url + '.ccbchurch.com/api.php?srv=individual_profiles&modified_since=' + obj.date
	}).then(xml2js);
};
