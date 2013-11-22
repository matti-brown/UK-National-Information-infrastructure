UK-National-Information-infrastructure
======================================

# Objective

## Introduction
We want the UK Government National Information Infrastructure (NII) to qualify for '5 stars' according to the [open data deployment star rating](http://data.gov.uk/blog/5-stars-rating-algorithm) as defined by Sir Tim Berners-Lee.

In addition to that, we want a relevant number of NII datasets to qualify for the Open Data Institute (ODI) [Open Data Certificates](https://certificates.theodi.org/).

We started with the [NII CSV](http://data.gov.uk/dataset/national-information-infrastructure) which can be found on [data.gov.uk](http://www.data.gov.uk) and a copy of which is [available here](https://github.com/matti-brown/UK-National-Information-infrastructure/blob/master/20131031_NII_DGU_I1.csv).

## This project
This project is a proof of concept developed at the ODI in the context of the [Open Data in Practice course](http://theodi.org/courses/open-data-practice). 

Its objective is to build a software capable of automatically enhancing the NII CSV onto a better structured format (JSON/RDF). 

The new file should be suitable to: a) qualify for an open data deployment rating beyond 3 stars and, eventually, b) qualify for an open data certificate at least at "pilot" level.

# Usage
This software comes as a combination of a [Node.js](http://nodejs.org/):
- library, and
- example command-line application

The key functionality is placed in a library so that other software clients could be developed in the future, e.g. the same service could be provided through an intranet website accessible to government agencies. 

Only JSON is supported for the time being.

To use the example command-line application you just need to do:

    $ node example.js --in <input csv file> --out <output JSON file>

# Sources
Together with the aforementioned .csv file, two additional sources are merged into the data of the file produced by the library:

- data.gov.uk's list of publishers at [http://data.gov.uk/publisher](http://data.gov.uk/publisher), and
- each dataset's detail page, if hosted on data.gov.uk itself

Note that if any of the datasets names as a publisher a body that is not listed in the aforementioned list of publishers, a warning will be issued, and the publisher won't be related to the official publisher URI. E.g.

	$ node example.js --in 20131031_NII_DGU_I1.csv --out 20131031_NII_DGU_I1.json
	Warning: found publisher not listed at http://data.gov.uk/publisher: "Victoria & Albert Museum"
	Warning: found publisher not listed at http://data.gov.uk/publisher: "HMG"
	Warning: found publisher not listed at http://data.gov.uk/publisher: "HMG"
	Warning: found publisher not listed at http://data.gov.uk/publisher: "HMG"
	Warning: found publisher not listed at http://data.gov.uk/publisher: "HMG"
	Warning: found publisher not listed at http://data.gov.uk/publisher: "High Speed 2"
	Warning: found publisher not listed at http://data.gov.uk/publisher: "National Institute for Health and Clinical Excellence (NICE)"
	Warning: found publisher not listed at http://data.gov.uk/publisher: "National Institute for Health and Clinical Excellence (NICE)"
	Done.
	$ 

In that case, the input .csv must be amended accordingly.

# License
Copyright (c) 2013 Gianfranco Cecconi and Matthew Brown

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.