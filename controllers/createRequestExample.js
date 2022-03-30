const file = require('./file');
const log = require('./log');

const stringify = require('json-stringify-safe');
const path = require('path');
const string = require('./string');


function _getJavaFileInfo(javaFileName, switchyardProjectInfoFile) {
    // parse
    let switchyardProjectInfo = file.readFileToJson(switchyardProjectInfoFile);

    // get the full path to .java file 
    let javaFileInfo = switchyardProjectInfo.find(member => {
        if (member.fileName === javaFileName) {
            return true;
        } else {
            return false;
        }
    });

    if (javaFileInfo) {
        return javaFileInfo;
    } else {
        return null;
    }
}


// convert from:
//  javaFileInfo.fullPath
// to:
//  [ {name:"VariableName",type:"VariableType"}, {...} ... ]
//   
//
function _getPrivateVariableList(javaFileInfo) {
    // look into the .java file
    let javaFileContent = file.readFile(javaFileInfo.fullPath);

    // try to capture all private variables to the list = ["private xx yy", "private aa bb" ...]
    let privateVariables = javaFileContent.match(/((private|String|int|byte|short|long|float|double|boolean|List.*)( )+)?(private|String|int|byte|short|long|float|double|boolean|List.*)( )+([a-zA-Z_]+);/gm);
    let variables = [];

    for (let privateVariable of privateVariables) {
        // break to small tokens = [ ["private","xx","yy"], ["private","aa","bb"] ...]
        let tokens = string.tokenize(privateVariable, /[\(\) ;]+/gm);
        let name = tokens[tokens.length - 1];
        let type = tokens[tokens.length - 2];
        variables.push({ name, type });
    }

    return variables;
}


// convert "Name", "String" to { "Name":"" }
// convert "Name", "List<String>" to { "Name":[""] }
function _resolveJavaVariableToJson(type, depthLimit, switchyardProjectInfoFile) {

    let resolved = `${type}`;

    // int|byte|short|long|float|double|boolean
    if (depthLimit <= 0) {
        return resolved;
    } else if (type.toLowerCase().match(/(int|byte|short|long|double)/gm)) {
        return 0;
    } else if (type.toLowerCase().match(/(boolean)/gm)) {
        return false;
    } else if (type.toLowerCase() === 'string') {
        return "";
    } else if (type.toLowerCase().match(/list<.*>/gm)) {
        // list of another types
        let list = [];
        // get <listType>
        let tokens = string.tokenize(type, /[ <>]+/gm);
        let listType = tokens[1];
        list.push(_resolveJavaVariableToJson(listType, depthLimit - 1, switchyardProjectInfoFile))
        return list;
    } else {
        // another className to resolve:
        let resolved = {};
        let javaFileInfo = _getJavaFileInfo(`${type}.java`, switchyardProjectInfoFile);

        if (javaFileInfo) {
            let privateVariableList = _getPrivateVariableList(javaFileInfo);

            for (let privateVariable of privateVariableList) {
                resolved[privateVariable.name] = _resolveJavaVariableToJson(privateVariable.type, depthLimit - 1, switchyardProjectInfoFile);
            }

            return resolved;
        }

        return resolved;
    }

}


module.exports = function (switchyardProjectInfoFile, targetRestResourceFile, outputFile) {

    let results = [];
    let result;
    let requestInfoList = [];

    // get lines with /public*(.*[ ]request)/gm
    let pattern = /public.*\(.*[ ]?(request|data)[ ]?\)/gm;
    let matches = file.getAllMatches(targetRestResourceFile, pattern);
    // extract only (xxx request)
    requestInfoList = matches.map(member => {
        let subStrings = string.tokenize(member, /[\(\) ]+/gm);

        // map to request info
        let requestVariableName = subStrings[subStrings.length - 1];
        let requestClassName = subStrings[subStrings.length - 2];
        let requestMethodName = subStrings[subStrings.length - 3];

        return {
            requestMethodName,
            requestClassName,
            requestVariableName
        };
    });

    // iterate requestInfoList
    for (let requestInfo of requestInfoList) {
        let javaFileInfo = _getJavaFileInfo(`${requestInfo.requestClassName}.java`, switchyardProjectInfoFile);

        if (javaFileInfo) {
            let privateVariableList = _getPrivateVariableList(javaFileInfo);

            requestInfo.requestBodyExample = {};
            for (let privateVariable of privateVariableList) {
                requestInfo.requestBodyExample[privateVariable.name] = _resolveJavaVariableToJson(privateVariable.type, 10, switchyardProjectInfoFile);
            }
        } else {
            // no javaFileInfo means it might be a primitive type , such as List<string>
            requestInfo.requestBodyExample = {};
            requestInfo.requestBodyExample[requestInfo.requestVariableName] = _resolveJavaVariableToJson(requestInfo.requestClassName, 10, switchyardProjectInfoFile);

        }

    }

    results = requestInfoList;

    // write results to project info file
    file.write(outputFile, `${stringify(results, null, 2)}`);

    return `controllers.createRequestExample.js: created request examples at: ${outputFile}`;
}