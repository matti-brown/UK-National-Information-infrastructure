var async = require("async"),
	csv = require("csv"),
	fs = require("fs"),
	request = require("request"),
	_ = require("underscore");

var publishers = { };


exports.fetchPublishers = function (callback) {
	request.get(
		{ uri: "http://data.gov.uk/publisher" },
		function (err, response, body) { 
			publishers = { };
			if (!err) {
				_.each(_.rest(body.split('<a class="publisher-row" ')), function (item) {
					var name = item.split('">')[1].split('</a>')[0],
						url = "http://data.gov.uk" + item.split('href="')[1].split('"')[0];
					publishers[name] = {
						url: url,
					};
				});
			}
			callback(err, publishers); 
		}
	);
}


var readCsv = function (inFile, callback) {
	var datasets = [ ];
	csv()
        .from.stream(fs.createReadStream(inFile), {
            columns: true
        })
        .on('record', function (row, index) {
          datasets.push(row);
        })
        .on('error', function (error) {
          console.log(error.message);
        })
        .on('end', function (count) {
        	if (callback) callback (null, datasets);
        });
};


exports.csv2Json = function (inFile, outFile, callback) {
	readCsv(inFile, function (err, datasets) {

		// first round of transformation / enhancement
		datasets = _.map(datasets, function (dataset) {
        	_.each([
        		{ from: "Facet 1", to: "Category" },
        		{ from: "Facet 2", to: "Type" },
        		{ from: "Link to DGU record if not DGU record then external link", to: "Link" },
        	], function (renameSetting) {
        		dataset[renameSetting.to] = dataset[renameSetting.from];
        		delete dataset[renameSetting.from];
        	});
        	// I enrich with data from the publishers
    		dataset.Publisher = { name: dataset.Publisher };
        	if (publishers[dataset.Publisher.name]) {
	        	dataset.Publisher.url = publishers[dataset.Publisher.name].url;
        	} else {
        		console.log("Warning: found publisher not listed at http://data.gov.uk/publisher: \"" + dataset.Publisher.name + "\"");
        	}
        	// finished */
        	return dataset; 
        });

		// second round of transformation / enhancement
    	async.mapLimit(datasets, 3, function (dataset, callback) {

			request.get(
				{ uri: dataset.Link },
				function (err, response, body) { 
		    		if (body.indexOf("<h2>Additional Information</h2>") > -1) {
		    			// it's published on data.gov.uk
		    			dataset.published = "data.gov.uk";
		    		} else if (body.indexOf('<div class="panel-heading">Unpublished Dataset</div>') > -1) {
		    			dataset.published = "Not published";
		    		} else {
		    			dataset.published = "Unknown";
		    		}
		    		if (dataset.published == "data.gov.uk") {
						_.each(_.rest(body.split("<h2>Additional Information</h2>")[1].split("</tbody>")[0].split("<tr>")), function (item) {
							var key = item.split('<td class="key">')[1].split('</td>')[0],
								value;
							switch (key) {
								case "Taxonomy URL":
									value = item.split('<td class="value"><a href="')[1].split('">')[0];
									break;
								default:
									value = item.split('<td class="value">')[1].split('</td>')[0];
									break;
							}
							value = value.replace(/<br\/>/g, ' ');
							dataset[key] = value ? value : "NA";
						});
					}
		    		callback(null, dataset);
				}
			);

    	}, function (err, datasets) {

	    	// finished, saving
	    	fs.writeFile(outFile, JSON.stringify(datasets), function (err) {
	        	if (callback) callback (null);
	        });

    	});

	});
}