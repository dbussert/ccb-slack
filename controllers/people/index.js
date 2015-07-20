'use strict';

var _ = require('underscore'),
	ccb = require('../../lib/ccb'),
	peopleModel = require('../../models/people'),
	Promise = require('bluebird');

module.exports = function (router) {
	router.get('/', function (req, res) {
		if(process.env.NODE_ENV === 'production' && req.query.token !== process.env.slack_token) { //make this an express middleware
			res.send('An Error Occurred: invalid token');
		}

		if(!req.query.text) {
			res.send('An Error Occurred: invalid input');
		}

		var obj = {},
			names = decodeURI(req.query.text).split(' '),
			individuals = [];

		obj.first_name = names[0];
		obj.last_name = names[1];

		peopleModel.search({
			first_name: names[0],
			last_name: names[1]
		}).then(function(first) {
			individuals = individuals.concat(ccb.parseIndividuals(first));
			if (individuals.length === 0) {
				return peopleModel.search({
					last_name: names[0] //if no first names found, search the name as a last name
				});
			} else {
				return Promise.resolve(null);
			}
		}).then(function(last) {
			individuals = individuals.concat(ccb.parseIndividuals(last));
			var output = _.map(individuals, function(individual) {
				return ccb.individualToString(individual);
			}).join(', ');
			res.send(output || "Couldn't find anyone by that name");
		})
	});
};
