'use strict';

var _ = require('underscore'),
    Promise = require('bluebird'),
    request = require('request-promise'),
    xml2js = require('xml2js-promise');

module.exports.search = function(obj) {
    var criteria = (obj.first_name ? "&first_name="+ obj.first_name: "") + (obj.last_name ? "&last_name="+ obj.last_name: "");

    return request({
        uri: 'https://' + process.env.ccb_username + ":" + process.env.ccb_password + "@" + process.env.ccb_url + '.ccbchurch.com/api.php?srv=individual_search' + criteria
    }).then(xml2js);
};
