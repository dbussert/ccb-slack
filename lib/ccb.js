'use strict';

var _ = require('underscore');

module.exports.function = [
	"since",
	"whois"
];

module.exports.parseIndividuals = function(xml) {
	var people = [];

	if(!xml || !xml.ccb_api.response[0].individuals) { //if there's no matches
		return [];
	}

	_.each(xml.ccb_api.response[0].individuals[0].individual, function (individual) {
		people.push({
			"name": individual.full_name[0],
			"first_name": individual.first_name[0],
			"last_name": individual.last_name[0],
			"phone": (individual.phones[0].phone[0]._ || "No phone number"),
			"email": (individual.email[0] || "No email"),
			"created": individual.created[0],
			"creator": individual.creator[0]._,
			"modified": individual.modified[0],
			"modifier": individual.modifier[0]._
		});
	});
	return people;
}

module.exports.individualToString = function(individual, columns, delimiter) {
	var columns = columns || ["name", "phone", "email"],
		delimiter = delimiter || " - ";
	return _.toArray(_.pick(individual, columns)).join(delimiter);
}
