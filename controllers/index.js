'use strict';

var _ = require('underscore'),
	ccb = require('../lib/ccb'),
	moment = require('moment'),
	peopleModel = require('../models/people'),
	Promise = require('bluebird');

module.exports = function (router) {
	router.get('/', function (req, res) {
		switch(res.locals.function) {
			case 'who':
				who(req, res);
				break;
			case 'since':
				since(req,res);
				break;
		}
	});
};

function who(req, res) {
	var names = res.locals.data.split(' '), //see if there is a first and last name
		people = [];

	peopleModel.who({
		first_name: names[0],
		last_name: names[1]
	}).then(function(result) {
		people = people.concat(ccb.parseIndividuals(result));
		if (people.length === 0) {
			return peopleModel.who({
				last_name: names[0] //if no first names found, search the name as a last name
			});
		} else {
			return Promise.resolve(null); //immediately go to next promise in chain
		}
	}).then(function(result) {
		people = people.concat(ccb.parseIndividuals(result));
		var output = _.map(_.sortBy(people, 'name'), function(person) { //sort the list of people and turn the objects into an array of strings
			return ccb.individualToString(person);
		}).join('\n');
		res.send(output || "Couldn't find anyone by that name");
	});
}

function since(req, res) {
	var date = null;

	if (res.locals.data === 'last week') {
		date = moment().subtract(1, 'week').format('YYYY-MM-DD');
	} else if (res.locals.data === 'yesterday') {
		date = moment().subtract(1, 'day').format('YYYY-MM-DD');
	} else if (res.locals.data === 'two weeks ago') {
		date = moment().subtract(2, 'week').format('YYYY-MM-DD');
	} else if (res.locals.data) {
		var parts = res.locals.data.split(' ');
		date = moment().subtract(parts[0], parts[1]).format('YYYY-MM-DD');
	} else {
		date = moment().subtract(1, 'week').format('YYYY-MM-DD');
	}

	peopleModel.since({
		date: date
	}).then(function(result) {
		var people = ccb.parseIndividuals(result);
		people = _.filter(people, function(person) { //filter out updates of existing records
		   return moment(person.created) > moment(date);
		});
		var output = _.map(_.sortBy(people, 'name'), function(person) {
			return ccb.individualToString(person);
		}).join('\n');
		res.send(output || "Couldn't find anyone since then");
	});
}
