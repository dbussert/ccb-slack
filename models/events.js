'use strict';

var _ = require('underscore'),
	ccb = require('../lib/ccb.js'),
	Promise = require('bluebird'),
	request = require('request-promise'),
	xml2js = require('xml2js-promise');

module.exports.attendance = function(obj) {
	var Promises = [];

	_.each(obj.dates, function(date){
		Promises.push(
			request({
				uri: 'https://' + process.env.ccb_username + ":" + process.env.ccb_password + "@" + process.env.ccb_url + '.ccbchurch.com/api.php?srv=attendance_profile&id=' + process.env.ccb_event_id + '&occurrence='+ date
			}).then(xml2js).then(function(events){
				return Promise.resolve(ccb.parseEvents(events));
			})
		);
	});

	return Promise.all(Promises).then(function(events){
		return Promise.resolve(_.flatten(events));
	});
};
