var argv = require('optimist') 
		.usage('Usage: $0 command --in <input csv file> --out <output json file>')
		.demand([ 'in', 'out' ])
		.alias('in', 'i')
		.alias('out', 'o')
		.argv,
	uknii = require("./lib/main");

uknii.fetchPublishers(function (err) {
	uknii.csv2Json(argv.in, argv.out, function (err) {
		console.log("Done.");
	});
});
