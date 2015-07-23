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

if(process.env.NODE_ENV === 'production') {
	app.use(function (req, res, next) { //check requests come from a valid Slack integration
		if (req.query.token !== process.env.slack_token) {
			res.send("It doesn't look like you're authorized");
		} else {
			next();
		}
	});
}

app.use(function (req, res, next) { //check the parameters are valid
	res.locals.command = decodeURI(req.query.command);
	var text = decodeURI(req.query.text).split(/ (.+)/); //split between the first space in the text
	res.locals.function = text[0];
	res.locals.data = text[1];

	if(!res.locals.function || ccb.function.indexOf(res.locals.function) === -1) {
		res.send("Sorry I don't understand " + res.locals.function);
	} else if(!res.locals.data) {
		res.send("Did you forget to type something?");
	} else {
		next();
	}
});

app.on('start', function () {
	console.log('Application ready to serve requests.');
	console.log('Environment: %s', app.kraken.get('env:env'));
});
