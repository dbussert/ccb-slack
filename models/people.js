'use strict';

var _ = require('underscore'),
	ccb = require('../lib/ccb.js'),
	geocoder = require('node-geocoder')('google', 'http'),
	map = require('../lib/map.js'),
	Promise = require('bluebird'),
	request = require('request-promise'),
	xml2js = require('xml2js-promise');

module.exports.whois = function(obj) {
	var criteria = (obj.first_name ? "&first_name="+ obj.first_name: "") + (obj.last_name ? "&last_name="+ obj.last_name: "");

	return request({
		uri: 'https://' + process.env.ccb_username + ":" + process.env.ccb_password + "@" + process.env.ccb_url + '.ccbchurch.com/api.php?srv=individual_search' + criteria
	}).then(xml2js).then(function(individuals){
		return Promise.resolve(ccb.parseIndividuals(individuals));
	});
};

module.exports.since = function(obj) {
	return request({
		uri: 'https://' + process.env.ccb_username + ":" + process.env.ccb_password + "@" + process.env.ccb_url + '.ccbchurch.com/api.php?srv=individual_profiles&modified_since=' + obj.date
	}).then(xml2js).then(function(individuals){
		return Promise.resolve(ccb.parseIndividuals(individuals));
	});
};

module.exports.people = function() {
	return request({
		uri: 'https://' + process.env.ccb_username + ":" + process.env.ccb_password + "@" + process.env.ccb_url + '.ccbchurch.com/api.php?srv=individual_profiles'
	}).then(xml2js).then(function(individuals){
		return Promise.resolve(ccb.parseIndividuals(individuals));
	});
};

module.exports.geocode = function(people) {
	var Promises = [];

	_.each(people, function(person, i){
		Promises.push(
			Promise.delay(i/4*1000).then(function() { //delay 4 calls per second because google does not allow more than 5 per second
				return geocoder.geocode(person.address)
			}).then(function(lookup){
				if(lookup && lookup.length > 0) {
					person.latitude = lookup[0].latitude;
					person.longitude = lookup[0].longitude;
				}
				return Promise.resolve(person);
			})
		);
	});

	return Promise.all(Promises).then(function(people){
		console.log('Finished all people: ' + people.length);
		return Promise.resolve(people);
	});
};

module.exports.kml = function(people) {
	var template = 'models/kml.ejs';
	return map.renderEJS(template, {
		people: people
	});
};
