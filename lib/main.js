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


exports.csv2Json = function (inFile, outFile, callback) {
	var datasets = [ ];
	csv()
        .from.stream(fs.createReadStream(inFile), {
            columns: true
        })
        .transform(function (record, index, callback){
	        	// I rename the 'columns'
	        	_.each([
	        		{ from: "Facet 1", to: "Category" },
	        		{ from: "Facet 2", to: "Type" },
	        		{ from: "Link to DGU record if not DGU record then external link", to: "Link" },
	        	], function (renameSetting) {
	        		record[renameSetting.to] = record[renameSetting.from];
	        		delete record[renameSetting.from];
	        	});
	        	// I enrich with other data
	        	if (publishers[record.Publisher]) {
		        	record.Publisher = {
		        		name: record.Publisher,
		        		url: publishers[record.Publisher].url,
		        	};
	        	} else {
	        		console.log("Warning: found publisher not listed at http://data.gov.uk/publisher: \"" + record.Publisher + "\"");
	        		record.Publisher = { name: record.Publisher };
	        	}
	        	// finished */
	        	datasets.push(record); 
				callback();			
			}, {parallel: 1})
        .on('error', function (error) {
          console.log(error.message);
        })
        .on('end', function (count) {
        	fs.writeFile(outFile, JSON.stringify(datasets), function (err) {
	        	if (callback) callback (null);
	        });
        });
};