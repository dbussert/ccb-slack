'use strict';

var _ = require('underscore');

module.exports.function = [
	"people",
	"whois",
    "attendance"
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

module.exports.parseEvents = function(xml) {
    var events = [];

    if(!xml || !xml.ccb_api.response || !xml.ccb_api.response[0].events) { //if there's no matches
        return [];
    }

    _.each(xml.ccb_api.response[0].events[0].event, function (item) {
        events.push(new event(item));
    });
    return events;
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

function event(event)
{
    this.name = event.name[0];
    this.date = event.occurrence[0];
    this.attendance = event.head_count[0];
}

event.prototype.toString = function(columns, delimiter) {
    var columns = columns || ["name", "date", "attendance"],
        delimiter = delimiter || " - ";
    return _.toArray(_.pick(this, columns)).join(delimiter);
}
