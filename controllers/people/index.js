'use strict';

var _ = require('underscore'),
    moment = require('moment'),
    people = require('../../models/people'),
    Promise = require('bluebird');

module.exports = function (router) {
    router.get('/', function (req, res) {
        var obj = {};
        if(req.query.first_name) {
            obj.first_name = req.query.first_name;
        }
        if(req.query.last_name) {
            obj.last_name = req.query.last_name;
        }
        if(req.query.name) {
            obj.first_name = req.query.name.split(' ')[0];
            obj.last_name = req.query.name.split(' ')[1];
        }
        people.search(obj).then(function(result) {
            var names = [];
            _.each(result.ccb_api.response[0].individuals[0].individual, function(individual){
                names.push(individual.full_name[0] + " - " + (individual.phones[0].phone[0]._ || "No phone number") + " - " + individual.email[0]);
            });
            res.send({
                "text": names.join(', ')
            });
        }).catch(function(err) {
            res.send({
                "text": 'An Error Occurred:' + err.message
            });
        });
    });
};
