const fs = require('fs-extra');
var path = require('path');
const log = require('./log');
const replace = require('replace-in-file');
const clone = require('clone');
let stringify = require('json-stringify-safe');
const string = require('./stringu');

/** 
example: from array of lines:
"{"
...
"@GET"
"@Path("/version")""
"@Produces({ "application/json" })""
"public String getVersion();""
...
"@Path("/getConfig")""
"@POST"
"@Produces({ "application/json" })"
"@Consumes({ "application/json" })"
public ConfigResponse getConfig(ConfigRequest request);
...
}
to:
 [
    {
        httpMethod: "POST",
        methodName: "getConfig",
        requestClassName: "ConfigRequest" ,//(or null
        requestVariableName: ""
        methodInfo: ...
    }
 ]
*/
module.exports.getSwithyardServiceAnnotationInfo = function (allLines) {
    let results = [];
    // log.out(`allLines=${stringify(allLines, null, 2)}`);

    // get only method's lines
    let methodLines = string.getAllLinesFromFirstMatchToEndIndex(allLines, /{/gm, 0, allLines.length - 1);

    // remove first and last member's value
    methodLines[0] = "";
    methodLines[methodLines.length - 1] = "";
    // log.out(`methodLines=${stringify(methodLines, null, 2)}`);

    let methodGroups = string.stringLinesToGroups(methodLines);
    // log.out(`methodGroups=${stringify(methodGroups, null, 2)}`);

    // decode each methodLines groups
    // to:
    // {
    //     httpMethod:
    //     path:
    //     produce:
    //     consume:
    //     methodName:
    //     responseClassName:
    //     responseClassVariable:
    // }
    for (let group of methodGroups) {
        let result = {};

        for (let line of group) {
            if (line.match(/@GET/gm)) {
                result.httpMethod = "GET";
            }
            else if (line.match(/@POST/gm)) {
                result.httpMethod = "POST";
            }
            else if (line.match(/@PUT/gm)) {
                result.httpMethod = "PUT";
            }
            else if (line.match(/@PATCH/gm)) {
                result.httpMethod = "PATCH";
            }
            else if (line.match(/@DELETE/gm)) {
                result.httpMethod = "DELETE";
            }
            else if (line.match(/@CONNECT/gm)) {
                result.httpMethod = "CONNECT";
            }
            else if (line.match(/@OPTIONS/gm)) {
                result.httpMethod = "OPTIONS";
            }
            else if (line.match(/@TRACE/gm)) {
                result.httpMethod = "TRACE";
            }
            else if (line.match(/@Path/gm)) {
                result.path = string.getValueInsideDoubleQuote(line);
            }
            else if (line.match(/@Produces/gm)) {
                result.produce = string.getValueInsideCurlyBrace(line);
            }
            else if (line.match(/@Consumes/gm)) {
                result.consume = string.getValueInsideCurlyBrace(line);
            }
            else if (line.match(/[ ]*public.*\(.*\);/gm)) {
                result.methodInfo = string.getJavaMethodInfo(line);
            }
        }

        results.push(result);
    }

    // log.breakpoint();
    return results;
}