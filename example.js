var uknii = require("./lib/main");

uknii.fetchPublishers(function (err) {
	uknii.csv2Json("./20131031_NII_DGU_I1.csv", "./20131031_NII_DGU_I1.json", function (err) {
		console.log("Done.");
	});
});
