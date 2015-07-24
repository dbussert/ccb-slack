'use strict';

var _ = require('underscore'),
	ccb = require('./lib/ccb'),
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

if(process.env.NODE_ENV === 'production') {
	app.use(function (req, res, next) { //check requests come from a valid Slack integration
		if (req.query.token !== process.env.slack_token) {
			return res.send("It doesn't look like you're authorized");
		} else {
			next();
		}
	});
}

app.use(function (req, res, next) { //check the parameters are valid
	if(!req.query.command || !req.query.text) { //we don't care what command slack integration, typicaly its /ccb
		return res.send("Something is missing"); //should only happen if the server is hit by anyone but slack
	}

	//ex: since last week {delimiter:',' , columns:['email']}
	var text = decodeURI(req.query.text).split(/ (.+)/); //split between the first space in the text to get the function
	res.locals.function = text[0];
	if(!res.locals.function || ccb.function.indexOf(res.locals.function) === -1) {
		return res.send("Sorry I don't understand " + res.locals.function);
	}

	//ex: last week {delimiter:',' , columns:['email']}
	text = text[1].split(/({.*})/); //split out any options that were passed in the message
	res.locals.options = {
		break: '\n',
		delimiter: ' - '
	};
	if(text.length > 1) { //if options were provided
		try {
			_.extend(res.locals.options, JSON.parse(text[1])); //attempt to parse the json and override the default options
		}
		catch(e) {
			return res.send("Your options aren't quite right");
		}
	}

	//ex: last week
	res.locals.data = text[0].trim(); //after everything else is parsed out, save the data
	if(!res.locals.data) {
		return res.send("Did you forget to type something?");
	}

	next();
});

app.on('start', function () {
	console.log('Application ready to serve requests.');
	console.log('Environment: %s', app.kraken.get('env:env'));
});
