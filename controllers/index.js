'use strict';

var _ = require('underscore'),
    eventModel = require('../models/events'),
    moment = require('moment'),
	peopleModel = require('../models/people'),
	Promise = require('bluebird');

module.exports = function (router) {
	router.get('/', function (req, res) {
		switch(res.locals.function) {
			case 'whois':
				whois(req, res);
				break;
			case 'people':
				people(req,res);
				break;
            case 'attendance':
                attendance(req,res);
                break;
		}
	});
};

//whois Dillon
//whois Dillon Bussert
//whois D B
//whois Bussert
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

// people since last week
// people since yesterday
// people since two two weeks ago
// people since 5 two weeks ago
function people(req, res) {
	var columns = res.locals.options.columns || ["name", "phone", "email", "created"],
		delimiter = res.locals.options.delimiter,
		date = null,
        parts = res.locals.data.split(' ');

	//parse well known time frames or default to a
	if (parts[1] === 'last') { //last week
		date = moment().subtract(1, 'week').format('YYYY-MM-DD');
	} else if (parts[1] === 'yesterday') {
		date = moment().subtract(1, 'day').format('YYYY-MM-DD');
	} else if (parts[1] === 'two') { //two weeks ago
		date = moment().subtract(2, 'week').format('YYYY-MM-DD');
	} else if (res.locals.data) {
		date = moment().subtract(parts[1], parts[2]).format('YYYY-MM-DD');
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

// attedence since 2015-07-30
// attedence last 5 weeks
// attedence 2015-07-30
function attendance(req, res) {
    var columns = res.locals.options.columns || ["name", "date", "attendance"],
        delimiter = res.locals.options.delimiter,
        dates = [],
        parts = res.locals.data.split(' ');

    //parse well known time frames or default to a
    if (parts[0] === 'last') {
        var weeks = parts[1] === 'week' ? 1 : parts[1]; //last week is equal to 1 week ago, or take the number provided
        for(var i = 0; i < weeks; i++) {
            dates.push(moment().day(-7 * i).format('YYYY-MM-DD')); //add every date going backwards the number of weeks provided
        }
    } else if (parts[0] === 'since') {
        var weeks = moment().day(7).diff(moment(parts[1]), 'weeks'); //number of weeks since the provided date, rounded up
        for(var i = 0; i < weeks; i++) {
            dates.push(moment().day(-7 * i).format('YYYY-MM-DD')); //add every date going backwards the number of weeks provided
        }
    } else if (res.locals.data) { //assume its a date
        dates.push(res.locals.data);
    }  else {
        //this should not happen
    }

    eventModel.attendance({
        dates: dates
    }).then(function(events) {
        var output = _.map(events, function(event) { //sort by name and then convert objects into an array of strings
            return event.toString(columns, delimiter);
        }).join(res.locals.options.break); //convert the array of strings into a string
        res.send(output || "No events found");
    });
}
