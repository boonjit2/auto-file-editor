const file = require('./file');
const log = require('./log');

const stringify = require('json-stringify-safe');
const path = require('path');
const string = require('./string');

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

    // iterate requestInfoList
    for (let requestInfo of requestInfoList) {
        // parse
        let switchyardProjectInfo = file.readFileToJson(switchyardProjectInfoFile);

        // get the full path to .java file 
        let find1 = switchyardProjectInfo.find(member => {
            if (member.fileName === `${requestInfo.requestClassName}.java`) {
                return true;
            } else {
                return false;
            }
        });

        if (find1) {
            // look into the .java file
            let javaFileContent = file.readFile(find1.fullPath);
            let privateVariables = javaFileContent.match(/((private|String|int)( )+)?(String|int|List.*)( )+([a-zA-Z_]+);/gm);
            // requestInfo.privateVariables = privateVariables;
            requestInfo.privateVariables = [];

            // convert each privateVariables to request key-value
            requestInfo.requestExample = {};
            for (let privateVariable of privateVariables) {
                let tokens = string.tokenize(privateVariable, /[\(\) ;]+/gm);
                // requestInfo.privateVariables.push(tokens);

                // variables
                let type = tokens[tokens.length - 2];
                let name = tokens[tokens.length - 1];

                requestInfo.privateVariables.push({ type, name });

                // if (type === 'String') {
                //     requestInfo.privateVariables[name] = '';
                // } else {
                //     requestInfo.privateVariables[name] = 'unknown';
                // }
            }


        }
    }


    results = requestInfoList;

    // write results to project info file
    file.write(outputFile, `${stringify(results, null, 2)}`);

    return `controllers.createRequestExample.js: created request examples at: ${outputFile}`;
}