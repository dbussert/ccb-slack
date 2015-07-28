'use strict';

var _ = require('underscore'),
	moment = require('moment'),
	peopleModel = require('../models/people'),
	Promise = require('bluebird');

module.exports = function (router) {
	router.get('/', function (req, res) {
		switch(res.locals.function) {
			case 'whois':
				whois(req, res);
				break;
			case 'since':
				since(req,res);
				break;
		}
	});
};

function whois(req, res) {
	var columns = res.locals.options.columns || ["name", "phone", "email", "address"],
		delimiter = res.locals.options.delimiter,
		names = res.locals.data.split(' '), //see if there is a first and last name
		people = null;

	peopleModel.whois({
		first_name: names[0],
		last_name: names[1]
	}).then(function(result) {
		people = result;
		if (people.length === 0) {
			return peopleModel.whois({
				last_name: names[0] //if no first names found, search the name as a last name
			});
		} else {
			return Promise.resolve([]); //return 0 immediately go to next promise in chain
		}
	}).then(function(result) {
		people = people.concat(result);
		var output = _.map(_.sortBy(people, 'name'), function(person) { //sort the list of people and turn the objects into an array of strings
			return person.toString(columns);
		}).join(res.locals.options.break); //convert the array of strings into a string
		res.send(output || "Couldn't find anyone by that name");
	});
}

function since(req, res) {
	var columns = res.locals.options.columns || ["name", "phone", "email", "created"],
		delimiter = res.locals.options.delimiter,
		date = null;

	//parse well known time frames or default to a
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
		//this should not happen
	}

	peopleModel.since({
		date: date
	}).then(function(people) {
		people = _.filter(people, function(person) { //filter out updates of existing records
		   return moment(person.created) > moment(date); //only get people created after the user's requested date
		});
		var output = _.map(_.sortBy(people, 'name'), function(person) { //sort by name and then convert objects into an array of strings
			return person.toString(columns, delimiter);
		}).join(res.locals.options.break); //convert the array of strings into a string
		res.send(output || "Couldn't find anyone since then");
	});
}
