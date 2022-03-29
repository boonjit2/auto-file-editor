const file = require('./file');
const log = require('./log');
const stringify = require('json-stringify-safe');
const path = require('path');

module.exports = function (switchyardProjectInfoFile, targetRestResourceFile, outputFile) {

    let results = [];
    let result;
    let requestInfoList = [];

    // get lines with /public*(.*[ ]request)/gm
    let pattern = /public.*\(.*[ ]?request[ ]?\)/gm;
    let matches = file.getAllMatches(targetRestResourceFile, pattern);
    // extract only (xxx request)
    requestInfoList = matches.map(member => {
        let subStrings = member.split(/[\(\) ]+/gm);
        // remove last empty member of array
        if (subStrings[subStrings.length - 1] === '') {
            subStrings.pop();
        }

        // map to request info
        let requestClassName = subStrings[subStrings.length - 2];
        let requestMethodName = subStrings[subStrings.length - 3];

        return {
            requestClassName,
            requestMethodName
        };
    });



    results = requestInfoList;

    // write results to project info file
    file.write(outputFile, `${stringify(results, null, 2)}`);

    return `controllers.createRequestExample.js: created request examples at: ${outputFile}`;
}