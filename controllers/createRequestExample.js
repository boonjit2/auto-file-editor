const file = require('./file');
const log = require('./log');

const stringify = require('json-stringify-safe');
const path = require('path');
const string = require('./stringu');
const switchyard = require('./switchyard');

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
function _getRequestURL(contextPath, requestMethodName, sourceRestResourceFile) {
    let requestURL = null;
    let httpMethod = 'UNKNOWN'
    let requestPath = '/UNKNOWN'
    let hostname = '{{host}}';
    let allLines = file.readFileToArrayOfLines(sourceRestResourceFile);
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
                    let tokens = string.tokenize(st[0], /\"/gm, null);
                    // tokens now should be = [ "@Path(", "listWifiTemplateScript" , ")" ]
                    requestPath = tokens[tokens.length - 2];
                }
            }

            // summarize
            requestURL = `${httpMethod} ${hostname}${contextPath}/${requestPath}`;
            // fix // to /
            requestURL = string.replaceall('//', '/', requestURL);

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
    // log.out(`javaFileName=${javaFileName},switchyardProjectInfoFile=${switchyardProjectInfoFile}`);

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
    // log.out(`javaFileInfo=${stringify(javaFileInfo, null, 2)}`);
    // try to capture all private variables to the list = ["private xx yy", "private aa bb" ...]
    // let privateVariables = javaFileContent.match(/((private|String|int|byte|short|long|float|double|boolean|List.*)( )+)?(private|String|int|byte|short|long|float|double|boolean|List.*)( )+([a-zA-Z_]+);/gm);
    //
    // example from:
    //
    //
    // public class ReqEDSAutoBurstSpeedMultiRerun { << starting point
    //     private List<Integer> requestIdList;     << parse these lines (may be empty or End of Array)
    //     private List<String> createDateList;
    //      ...
    //
    //     public List<Integer> getRequestIdList() { << ending point (or End of Array)
    //         return requestIdList;
    //     }
    let allLines = file.readFileToArrayOfLines(javaFileInfo.fullPath);
    // log.out(`allLines=${stringify(allLines, null, 2)}`);

    // let className = path.basename(javaFileInfo.fileName, '.java');
    let pattern = /{/gm;
    let startIndex = 0;
    let endIndex = 0;
    for (let i = 0; i < allLines.length; i++) {
        // find the class header index
        if (allLines[i].match(pattern)) {
            startIndex = i + 1;
            break; // stop the iteration
        }
    }
    // log.out(`startIndex=${startIndex}`);

    // find the class's first method/constructor index (or just end of the class)
    for (let j = startIndex; j < allLines.length; j++) {
        // find the class header index
        if (allLines[j].match(/(.*)[ ]+{/gm)) {
            endIndex = j;
            break; // stop the iteration
        }
    }
    // log.out(`endIndex=${endIndex}`);

    // try to capture all private variables to the list = ["private xx yy", "private aa bb" ...]
    let privateVariableLines = [];
    for (let k = startIndex; k < endIndex; k++) {
        privateVariableLines.push(allLines[k]);
    }
    log.out(`privateVariableLines=${stringify(privateVariableLines, null, 2)}`);
    // log.breakpoint();

    // remove lines with comments , ex: "// private String xxx"
    let pattern3 = new RegExp("\\/\\/", "gm");
    // log.out(`pattern3=${pattern3}`);
    for (let i = 0; i < privateVariableLines.length; i++) {
        if (privateVariableLines[i].match(pattern3)) {
            privateVariableLines[i] = "";
        }
    }

    let privateVariables = [];
    for (let privateVariableLine of privateVariableLines) {
        // break to small tokens = [ ["private","xx","yy"], ["private","aa","bb"] ...]
        let tokens = string.tokenize(privateVariableLine, /[\(\) ;]+/gm, null);
        // log.out(`tokens=${stringify(tokens, null, 2)}`);
        if (tokens.length >= 2) {
            let name = tokens[tokens.length - 1].trim();
            let type = tokens[tokens.length - 2].trim();
            privateVariables.push({ name, type });
        }
    }



    return privateVariables;
}


// convert "Name", "String" to { "Name":"" }
// convert "Name", "List<String>" to { "Name":[""] }
function _resolveJavaVariableToJson(type, depthLimit, switchyardProjectInfoFile) {
    let resolved = `${type}`;
    // log.out(`_resolveJavaVariableToJson(): type=${type}, depthLimit=${depthLimit}`);
    // log.out(`type=${type}, depthLimit=${depthLimit}`);

    // int|byte|short|long|float|double|boolean
    if (depthLimit <= 0) {
        let result = resolved;
        // log.out(`case:1, result=${result}`);
        return result;
    } else if (type.toLowerCase() === 'arraylist') {
        // this is not Arraylist<*> but just Arraylist
        return [""];
    } else if (type.toLowerCase().match(/(list)<.*>/gm)) {
        // list of another types
        let results = [];
        // get <listType>
        let tokens = string.tokenize(type, /[ <>]+/gm, null);
        // log.out(`case:5,tokens=${stringify(tokens)}`);
        let listType = tokens[1];
        // log.out(`case:5,listType=${listType}`);
        results.push(_resolveJavaVariableToJson(listType, depthLimit - 1, switchyardProjectInfoFile))
        // log.out(`case:5,results=${stringify(results)}`);
        return results;
    } else if (type.toLowerCase().match(/(int|integer|byte|short|long|double)/gm)) {
        let result = 0;
        // log.out(`case:2,result=${result}`);
        return result;
    } else if (type.toLowerCase().match(/(boolean)/gm)) {
        let result = false;
        // log.out(`case:3,result=${result}`);
        return result;
    } else if (type.toLowerCase() === "string") {
        let result = "String";
        // log.out(`case:4,result=${result}`);
        return result;
    } else if (type.toLowerCase() === "timestamp") {
        let result = "Timestamp";
        // log.out(`case:8,result=${result}`);
        return result;
    } else {
        // another className to resolve:
        let result = {};
        let javaFileInfo = _getJavaFileInfo(`${type}.java`, switchyardProjectInfoFile);
        // log.out(`case:6 javaFileInfo=${stringify(javaFileInfo, null, 2)}`);

        if (javaFileInfo) {

            let privateVariableList = _getPrivateVariableList(javaFileInfo);
            // log.out(`javaFileInfo=${stringify(javaFileInfo, null, 2)}: privateVariableList=${stringify(privateVariableList, null, 2)}`);

            for (let privateVariable of privateVariableList) {
                result[privateVariable.name] = _resolveJavaVariableToJson(privateVariable.type, depthLimit - 1, switchyardProjectInfoFile);
                // log.out(`case:6 result["${privateVariable.name}"]=${stringify(result[privateVariable.name])}`);

            }

            // found the class data
            return result;
        }

        // log.out(`case:9,results=${stringify({ ATEError: 'cannot resolve this type' })}`);
        // not found the class data
        return { ATEError: 'cannot resolve this type' };
    }

}

// main
module.exports = function (switchyardProjectInfoFile, sourceRestResourceFile, outputFile) {

    let results = [];
    let result;

    // get context path
    let contextPath = _getSwitchyardContextPath(switchyardProjectInfoFile);

    // get all lines to array
    let allRestResourceLines = file.readFileToArrayOfLines(sourceRestResourceFile);
    // log.out(`allRestResourceLines=${stringify(allRestResourceLines, null, 2)}`);

    let serviceInfoList = switchyard.getSwithyardServiceAnnotationInfo(allRestResourceLines);
    // log.out(`serviceInfoList=${stringify(serviceInfoList, null, 2)}`);

    // iterate requestInfoList
    /*
    from: serviceInfo=[
  {
    "httpMethod": "GET",
    "path": "/version",
    "produce": "application/json",
    "methodInfo": {
      "modifiers": [
        "public"
      ],
      "returnType": "String",
      "methodName": "getVersion",
      "parameters": []
    }
  },
  {
    "httpMethod": "POST",
    "path": "/getCurrency",
    "produce": "MediaType.APPLICATION_JSON",
    "consume": "MediaType.APPLICATION_JSON",
    "methodInfo": {
      "modifiers": [
        "public"
      ],
      "returnType": "CurrencyMasterResponse",
      "methodName": "getCurrency",
      "parameters": [
        {
          "type": "CommonRequest",
          "name": "request"
        }
      ]
    }
  },
    
    to: 
    requestExamples=[
        {
            header: "POST {{host}}/contextpath/url",
            body: "{...}"
        }


    ]
    
    
    */
    let requestExamples = [];
    for (let serviceInfo of serviceInfoList) {
        let requestExample = {};

        let tempPath = path.posix.join(contextPath, serviceInfo.path);
        requestExample.header = `${serviceInfo.httpMethod} {{host}}${tempPath}`;
        requestExample.body = null;

        // have parameters
        if (serviceInfo.methodInfo.parameters.length > 0) {
            // log.out(`serviceInfo=${stringify(serviceInfo, null, 2)}`);
            let javaFileInfo = _getJavaFileInfo(`${serviceInfo.methodInfo.parameters[0].type}.java`, switchyardProjectInfoFile);
            // log.out(`javaFileInfo=${stringify(javaFileInfo, null, 2)}`);
            // log.breakpoint();


            // found the class data inside this project
            if (javaFileInfo) {
                let privateVariableList = _getPrivateVariableList(javaFileInfo);
                // log.out(`javaFileInfo=${stringify(javaFileInfo, null, 2)}: privateVariableList=${stringify(privateVariableList, null, 2)}`);

                requestExample.body = {};
                for (let privateVariable of privateVariableList) {
                    requestExample.body[privateVariable.name] = _resolveJavaVariableToJson(privateVariable.type, 20, switchyardProjectInfoFile);
                }
            } else {
                // javaFileInfo===null means it might be a primitive type , such as List<string>
                // or some classes which was imported from outside
                requestExample.body = _resolveJavaVariableToJson(serviceInfo.methodInfo.parameters[0].type, 20, switchyardProjectInfoFile);
            }
        } else {

        }

        requestExamples.push(requestExample);


    }

    log.out(`requestExamples=${stringify(requestExamples, null, 2)}`);
    log.breakpoint();

    // find starting index
    // let startIndex = 0;
    // for (let i = 0; i < allRestResourceLines.length; i++) {
    //     // the first '{' is the start
    //     if (allRestResourceLines[i].match(/{/gm)) {
    //         startIndex = i;
    //         break;
    //     }
    // }
    // // log.out(`startIndex=${startIndex}`);

    // // extract lines
    // let methodDeclarations = [];
    // for (let i2 = startIndex + 1; i2 < allRestResourceLines.length; i2++) {
    //     let pattern = /(.*);/gm
    //     let matches = allRestResourceLines[i2].match(pattern);
    //     if (matches) {
    //         methodDeclarations.push(allRestResourceLines[i2]);
    //     }
    // }

    // log.out(`methodDeclarations=${stringify(methodDeclarations, null, 2)}`);

    // let requestInfoList = [];

    // methodDeclarations.forEach(element => {
    //     // pattern2: xxx();
    //     let pattern2 = /\([ ]?\);/gm;
    //     // pattern1: xxx(yyy zzz);
    //     let pattern1 = /\(.*\);/gm;
    //     let tokens = string.tokenize(element, /[\(\) ;]+/gm, null);

    //     if (element.match(pattern2)) {
    //         // pattern2: xxx();
    //         let matches2 = element.match(pattern2);
    //         // log.out(`matches2=${stringify(matches2, null, 2)}`);

    //         let requestInfo = {
    //             requestURL: null,
    //             requestVariableName: null,
    //             requestClassName: null,
    //             requestMethodName: tokens[tokens.length - 1]
    //         }
    //         requestInfoList.push(requestInfo);


    //     } else if (element.match(pattern1)) {
    //         // pattern1: xxx(yyy zzz);
    //         let matches1 = element.match(pattern1);
    //         // log.out(`matches1=${stringify(matches1, null, 2)}`);

    //         let requestInfo = {
    //             requestURL: null,
    //             requestVariableName: tokens[tokens.length - 1],
    //             requestClassName: tokens[tokens.length - 2],
    //             requestMethodName: tokens[tokens.length - 3]
    //         }

    //         requestInfoList.push(requestInfo);
    //     }

    // });


    // // iterate requestInfoList
    // for (let requestInfo of requestInfoList) {

    //     if (requestInfo.requestClassName) {
    //         // log.out(`requestInfo=${stringify(requestInfo, null, 2)}`);
    //         let javaFileInfo = _getJavaFileInfo(`${requestInfo.requestClassName}.java`, switchyardProjectInfoFile);
    //         // log.out(`javaFileInfo=${stringify(javaFileInfo, null, 2)}`);


    //         if (javaFileInfo) {
    //             let privateVariableList = _getPrivateVariableList(javaFileInfo);
    //             // log.out(`javaFileInfo=${stringify(javaFileInfo, null, 2)}: privateVariableList=${stringify(privateVariableList, null, 2)}`);

    //             requestInfo.requestBodyExample = {};
    //             for (let privateVariable of privateVariableList) {
    //                 requestInfo.requestBodyExample[privateVariable.name] = _resolveJavaVariableToJson(privateVariable.type, 10, switchyardProjectInfoFile);
    //             }
    //         } else {
    //             // javaFileInfo===null means it might be a primitive type , such as List<string>
    //             requestInfo.requestBodyExample = _resolveJavaVariableToJson(requestInfo.requestClassName, 10, switchyardProjectInfoFile);
    //         }
    //     }




    //     // try to find the http method from requestMethodName
    //     // example from:
    //     //         @POST
    //     //         ...
    //     //         @Path("getSiteCodeSiteName")
    //     //         ...
    //     //         /public.*\(.*[ ]?(request|data)[ ]?\)/gm;
    //     //
    //     //  to:
    //     //      requestInfo.requestURL = "POST /${contextPath}/getSiteCodeSiteName"
    //     requestInfo.requestURL = _getRequestURL(contextPath, requestInfo.requestMethodName, sourceRestResourceFile);

    // }

    // log.out(`requestInfoList=${stringify(requestInfo, null, 2)}`);
    // log.breakpoint();

    results = requestInfoList;

    // write results to project info file
    file.write(outputFile, `${stringify(results, null, 2)}`);

    return `controllers.createRequestExample.js: created request examples at: ${outputFile}`;
}