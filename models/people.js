'use strict';

var _ = require('underscore'),
    moment = require('moment'),
    xml2js = require('xml2js-promise'),
    Promise = require('bluebird'),
    request = require('request-promise');

module.exports.search = function(obj) {
    var criteria = (obj.first_name ? "&first_name="+ obj.first_name: "") + (obj.last_name ? "&last_name="+ obj.last_name: "");

    return request({
        uri: 'https://' + process.env.username + ":" + process.env.password + "@" + process.env.url + '.ccbchurch.com/api.php?srv=individual_search' + criteria
    })
    .then(xml2js);
};
