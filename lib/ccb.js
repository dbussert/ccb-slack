'use strict';

var _ = require('underscore');

module.exports.parseIndividuals = function(xml) {
    var people = [];

    if(!xml || !xml.ccb_api.response[0].individuals) { //if there's no matches
        return [];
    }

    _.each(xml.ccb_api.response[0].individuals[0].individual, function (individual) {
        people.push({
            "name": individual.full_name[0],
            "phone": (individual.phones[0].phone[0]._ || "No phone number"),
            "email": (individual.email[0] || "No email")
        });
    });
    return people;
}

module.exports.individualToString = function(individual) {
    var output = "";
    output += individual.name + " - " + individual.phone + " - " + individual.email;
    return output;
}
