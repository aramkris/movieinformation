'use strict';
// create an API server
const Restify = require('restify');
const server = Restify.createServer({
	name: 'MovieInformation'
});
const PORT = process.env.PORT || 8080;

server.use(Restify.jsonp());
server.use(Restify.bodyParser());
server.use((req, res, next) => f.verifySignature(req, res, next));

// Tokens
const config = require('./configuration');

// FBeamer
const FBeamer = require('./fbeamer');
const f = new FBeamer(config.FB);

// WIT
const Wit = require('node-wit').Wit;
const wit = new Wit({
	accessToken:config.WIT_ACCESS_TOKEN
});

//OMDB
const omdb = require('./omdb');
// Your Bot here

// Register the webhooks
server.get('/', (req, res, next) => {
	f.registerHook(req, res);
	return next();
});

// Receive all incoming messages
server.post('/', (req, res, next) => {
	f.incoming(req, res, msg => {
		// Process messages

		const {
			message,
			sender
		} = msg;
		if(message.text) {
			// If a text message is received
			f.txt(sender, `You said ${message.text}`);

  		// Wit's Message API
			wit.message(message.text, {})
				.then(omdb)
				.then(response => {
					f.txt(sender, response.text);
					if(response.image) {
						f.img(sender, response.image);
					}
				})
				.catch(error => {
					console.log(error);
					f.txt(sender, "Hmm. My servers are acting weird. This is embarassing. Can you check back after sometime?");
				});
		}
	});
	return next();
});

// Subscribe
f.subscribe();
server.listen(PORT, () => console.log(`MovieInformation running on port ${PORT}`));
