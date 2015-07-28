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
		people.push(new person(individual));
	});
	return people;
}

function person(individual)
{
    this.name = individual.full_name[0];
    this.first_name = individual.first_name[0];
    this.last_name = individual.last_name[0];
    this.phone = (individual.phones[0].phone[0]._ || "No phone number");
    this.email = (individual.email[0] || "No email");
    this.created = individual.created[0];
    this.creator = individual.creator[0]._;
    this.modified =  individual.modified[0];
    this.modifier = individual.modifier[0]._;
    this.address = individual.addresses[0].address[0].line_1 + ", " + individual.addresses[0].address[0].line_2;
}

person.prototype.toString = function(columns, delimiter) {
    var columns = columns || ["name", "phone", "email"],
        delimiter = delimiter || " - ";
    return _.toArray(_.pick(this, columns)).join(delimiter);
}
