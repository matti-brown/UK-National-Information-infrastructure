var uknii = require("./lib/main");

uknii.fetchPublishers(function (err) {
	uknii.csv2Json("./20131031_NII_DGU_I1.csv", function (err) {
		console.log("Done.");
	});
});
