'use strict';

var ccb = require('./lib/ccb'),
	express = require('express'),
	kraken = require('kraken-js');


var options, app;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
	onconfig: function (config, next) {
		/*
		 * Add any additional config setup or overrides here. `config` is an initialized
		 * `confit` (https://github.com/krakenjs/confit/) configuration object.
		 */
		next(null, config);
	}
};

app = module.exports = express();
app.use(kraken(options));

app.use(function (req, res, next) { //check requests come from a valid Slack integration
    if(process.env.NODE_ENV === 'production' && req.query.token !== process.env.slack_token) {
		res.send('An Error Occurred: invalid token');
	} else {
        next();
    }
});

app.use(function (req, res, next) { //check the parameters are valid
	res.locals.command = decodeURI(req.query.command);
	var text = decodeURI(req.query.text).split(/ (.+)/); //split between the first space in the text
	res.locals.function = text[0];
	res.locals.data = text[1];

	if(!res.locals.command || res.locals.command !== '/ccb') {
		res.send('An Error Occurred: invalid input, command not ccb');
	} else if(!res.locals.function || ccb.function.indexOf(res.locals.function) === -1) {
		res.send('An Error Occurred: invalid input, function is not valid');
	} else if(!res.locals.data) {
		res.send('An Error Occurred: invalid input, no data');
	} else {
		next();
	}
});

app.on('start', function () {
	console.log('Application ready to serve requests.');
	console.log('Environment: %s', app.kraken.get('env:env'));
});
