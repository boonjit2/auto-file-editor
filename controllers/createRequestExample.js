const file = require('./file');
const log = require('./log');

const stringify = require('json-stringify-safe');
const path = require('path');
const string = require('./string');

// try to find the http method from requestMethodName
// example from:
//         @POST
//         ...
//         @Path("getSiteCodeSiteName")
//         ...
//         /public.*\(.*[ ]?(request|data)[ ]?\)/gm;
//
//  to:
//      requestInfo.requestURL = "POST /${contextPath}/getSiteCodeSiteName"
function _getRequestURL(contextPath, requestMethodName, targetRestResourceFile) {
    let requestURL = null;
    let httpMethod = 'UNKNOWN'
    let requestPath = '/UNKNOWN'
    let hostname = '{{host}}';
    let allLines = file.readFileToArrayOfLines(targetRestResourceFile);
    // log.out(`allLines=${stringify(allLines, null, 2)}`);
    // throw new Error('Breakpoint');

    // create match pattern for public.*methodName line , this will be a starting point to search for @POST
    let pattern = new RegExp(`public.*${requestMethodName}\(.*[ ]?(request|data|)[ ]?\)`, "gm");

    // iterate allLines
    for (let i = 0; i < allLines.length; i++) {
        // match the starting point?
        let maxLookupDistance = 6;
        let startIndex = i - maxLookupDistance;
        let endIndex = i;
        if (allLines[i].match(pattern)) {
            // looking back for few lines from allLines[startIndex] to allLines[endIndex]
            for (let j = startIndex; j < endIndex; j++) {
                // match @POST or @GET
                if (allLines[j].match(/@(POST)/gm)) {
                    httpMethod = 'POST';
                }
                if (allLines[j].match(/@(GET)/gm)) {
                    httpMethod = 'GET';
                }
                if (allLines[j].match(/@Path\(".*"\)/gm)) {

                    // extract what inside the ""
                    let st = allLines[j].match(/@Path\(".*"\)/gm);
                    // log.out(`st=${stringify(st)}`);
                    let tokens = string.tokenize(st[0], /\"/gm);
                    // tokens now should be = [ "@Path(", "listWifiTemplateScript" , ")" ]
                    requestPath = tokens[tokens.length - 2];
                }
            }

            // summarize
            requestURL = `${httpMethod} ${hostname}${contextPath}/${requestPath}`;

            // return on first match
            break;
        }
    }


    return requestURL;
}


function _getSwitchyardContextPath(switchyardProjectInfoFile) {
    let switchyardProjectInfoList = file.readFileToJson(switchyardProjectInfoFile);
    let contextPath = null;
    for (let member of switchyardProjectInfoList) {
        if (member.fileName === 'switchyard.xml') {
            let switchyardLines = file.readFileToArrayOfLines(member.fullPath);
            // log.out(`switchyardLines=${stringify(switchyardLines, null, 2)}`);
            contextPath = string.extractXmlValue(switchyardLines, /<resteasy:contextPath>.*<\/resteasy:contextPath>/gm, '<resteasy:contextPath>', '</resteasy:contextPath>');
            if (contextPath === null) {
                throw new Error(`Unable to find contextPath from ${member.fullPath}`);
            }
            contextPath = '/' + contextPath;
        }
    }
    return contextPath;
}

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

    // get context path
    let contextPath = _getSwitchyardContextPath(switchyardProjectInfoFile);

    // try to get lines with requestMethodName(.*)
    let pattern = /public.*\(.*[ ]?(request|data|)[ ]?\)/gm;
    let matches = file.getAllMatches(targetRestResourceFile, pattern);

    // these are 2 patterns we should have matched
    // 1. public.* requestMethodName(requestClassName requestVariableName)
    // 2. public.* requestMethodName();
    for (let element of matches) {
        let matches1 = element.match(/public.*\(.*[ ]?(request|data)[ ]?\)/gm);
        let matches2 = element.match(/public.*\([ ]?[ ]?\)/gm);
        if (matches1) {
            let subStrings = string.tokenize(matches1[0], /[\(\) ]+/gm);
            // [ ... requestMethodName,requestClassName,requestVariableName ]
            let requestURL = '';
            let requestVariableName = subStrings[subStrings.length - 1];
            let requestClassName = subStrings[subStrings.length - 2];
            let requestMethodName = subStrings[subStrings.length - 3];

            requestInfoList.push({
                requestURL, requestVariableName, requestClassName, requestMethodName
            });

        } else if (matches2) {
            let subStrings = string.tokenize(matches2[0], /[\(\) ]+/gm);
            // [ ... requestMethodName ]
            let requestURL = '';
            let requestVariableName = null;
            let requestClassName = null;
            let requestMethodName = subStrings[subStrings.length - 1];

            requestInfoList.push({
                requestURL, requestVariableName, requestClassName, requestMethodName
            });
        }
    }



    // extract only (xxx request)
    // requestInfoList = matches.map(member => {
    //     let subStrings = string.tokenize(member, /[\(\) ]+/gm);

    //     // map to request info
    //     // [ ... requestMethodName,requestClassName,requestVariableName ]
    //     let requestVariableName = subStrings[subStrings.length - 1];
    //     let requestClassName = subStrings[subStrings.length - 2];
    //     let requestMethodName = subStrings[subStrings.length - 3];

    //     return {
    //         requestURL: '',
    //         requestMethodName,
    //         requestClassName,
    //         requestVariableName
    //     };
    // });

    // iterate requestInfoList
    for (let requestInfo of requestInfoList) {

        if (requestInfo.requestClassName) {
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

        // try to find the http method from requestMethodName
        // example from:
        //         @POST
        //         ...
        //         @Path("getSiteCodeSiteName")
        //         ...
        //         /public.*\(.*[ ]?(request|data)[ ]?\)/gm;
        //
        //  to:
        //      requestInfo.requestURL = "POST /${contextPath}/getSiteCodeSiteName"
        requestInfo.requestURL = _getRequestURL(contextPath, requestInfo.requestMethodName, targetRestResourceFile);

    }

    results = requestInfoList;

    // write results to project info file
    file.write(outputFile, `${stringify(results, null, 2)}`);

    return `controllers.createRequestExample.js: created request examples at: ${outputFile}`;
}