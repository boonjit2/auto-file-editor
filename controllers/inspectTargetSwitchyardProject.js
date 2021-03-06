const file = require('./file');
const log = require('./log');
const clone = require('clone');
const path = require('path');
const string = require('./stringu');
const stringify = require('json-stringify-safe');
const { format } = require('path');

function _extractJavaPackagePath(javaSourceFile) {

    let javaPackagePath = null;

    // get file content
    let fileContent = file.readFile(javaSourceFile);

    // extract package line
    let pattern = /^[ ]?package.*;$/gm;
    let matches = pattern.exec(fileContent);
    // replace "package "
    let match = matches[0];
    match = match.replace(/^[ ]?package[ ]*/gm, '/')
    // reformat
    match = match.replace(/[ ;]/gm, '');
    javaPackagePath = match.replace(/[.]/gm, '/');

    return javaPackagePath;
}

function _extractJavaPackageName(javaSourceFile) {

    let javaPackageName = null;

    // get file content
    let fileContent = file.readFile(javaSourceFile);

    // extract package line
    let pattern = /^[ ]?package.*;$/gm;
    let matches = pattern.exec(fileContent);
    // replace "package "
    let match = matches[0];
    match = match.replace(/^[ ]?package[ ]*/gm, '')
    // reformat
    javaPackageName = match.replace(/[ ;]/gm, '');

    return javaPackageName;
}


// get "xxx" from .*YYY("xxx").*;
function _getValueInsideDoubleQuote(stringLine) {
    // log.out(`stringLine=${stringLine}`);
    let matches = stringLine.match(/(?<=\").*?(?=\")/gm);
    // log.out(`matches=${stringify(matches)}`);
    if (matches) {
        let value = matches[0];
        return value;
    }

    return null;
}

// get "xxx" from .*YYY({ xxx }).*;
function _getValueInsideCurlyBrace(stringLine) {
    // log.out(`stringLine=${stringLine}`);
    let matches = stringLine.match(/(?<=\{).*?(?=\})/gm);
    // log.out(`matches=${stringify(matches)}`);
    if (matches) {
        let value = matches[0].trim();
        // log.out(`values=${stringify(values)}`);
        // remove "
        if (value.match(/\"/gm)) {
            value = value.replace(/\"/gm, '')
        }

        return value;
    }

    return null;
}


// example: from
// {
// ...
// @GET
// @Path("/version")
// @Produces({ "application/json" })
// public String getVersion();
// ...
// @Path("/getConfig")
// @POST
// @Produces({ "application/json" })
// @Consumes({ "application/json" })
// public ConfigResponse getConfig(ConfigRequest request);
// ...
// }
// to:
//  [
//     {
//         httpMethod: "POST",
//         methodName: "getConfig",
//         requestClassName: "ConfigRequest" ,//(or null
//         requestVariableName: ""
//     }
//  ]
//
// 
function _getSwithyardServiceAnnotationInfo(allLines) {
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
                result.path = _getValueInsideDoubleQuote(line);
            }
            else if (line.match(/@Produces/gm)) {
                result.produce = _getValueInsideCurlyBrace(line);
            }
            else if (line.match(/@Consumes/gm)) {
                result.consume = _getValueInsideCurlyBrace(line);
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

function _getSwitchyardInterfaceInfo(allLines) {

    let result = {};

    // find first line with @Path
    let firstPathIndex = string.getFirstMatchedLineIndex(allLines, /@Path\(/gm, 0, allLines.length - 1);
    if (!firstPathIndex) {
        throw new Error('unable to get first line with @Path');
    }
    result.firstPath = _getValueInsideDoubleQuote(allLines[firstPathIndex]);

    // get all "lines of methods"
    result.serviceAnnotationInfoList = _getSwithyardServiceAnnotationInfo(allLines);


    return result;
}

function _getSwitchyardXmlInfo(xmlFile, switchyardProjectInfoFile) {
    let switchyardXMLInfo = { source: null };

    switchyardXMLInfo.source = file.readXmlFiletoJsonObj(xmlFile);

    // process a big source object into something more informative
    switchyardXMLInfo.processed = null;

    // ge references from source
    let references = [];
    let reference = {};
    for (let element1 of switchyardXMLInfo.source.elements) {
        // source.elements[{name:"sy:switchyard"}]
        if (element1.name === 'sy:switchyard') {
            for (let element2 of element1.elements) {
                // source.elements[{name:"sy:switchyard",elements:[ {name:"sca:composite", elements:[ ] } ]}] and so on
                if (element2.name === 'sca:composite') {
                    for (let element3 of element2.elements) {
                        reference.name = null;
                        reference.isExternalService = false;
                        if (element3.name === 'sca:service') {
                            reference.name = element3.attributes.name;
                            for (let element4 of element3.elements) {
                                if (element4.name === 'resteasy:binding.rest') {
                                    for (let element5 of element4.elements) {
                                        if (element5.name === 'resteasy:contextPath') {
                                            reference.contextPath = element5.elements[0].text;
                                        }

                                        if (element5.name === 'resteasy:interfaces') {
                                            reference.interfaceName = element5.elements[0].text;
                                        }
                                    }
                                }
                            }

                        }

                        if (element3.name === 'sca:reference') {

                            reference.name = element3.attributes.name;

                            for (let element4 of element3.elements) {
                                if (element4.name === 'resteasy:binding.rest') {
                                    for (let element5 of element4.elements) {

                                        if (element5.name === 'resteasy:interfaces') {
                                            reference.interfaceName = element5.elements[0].text;
                                        }

                                        if (element5.name === 'resteasy:address') {
                                            reference.address = element5.elements[0].text;
                                            reference.isExternalService = true;
                                        }

                                    }


                                }
                            }

                            // log.out(`reference=${stringify(reference, null, 2)}`);


                        }

                        // save, clear data
                        if (reference.name) {
                            references.push(clone(reference));
                            reference = {};
                        }
                    }
                }
            }
        }
    }

    // from references , look into each .java file for more details
    // cross-reference with switchyardProjectInfoFile
    let switchyardProjectInfoList = file.readFileToJson(switchyardProjectInfoFile);
    for (let reference of references) {

        let find1 = switchyardProjectInfoList.find((member) => {
            if (member.isJavaSource) {
                let memberClassFullName = `${member.packageName}.${member.className}`;
                if (memberClassFullName === reference.interfaceName) {
                    return true;
                }

            } else {
                return false;
            }

        });

        if (!find1) {
            throw new Error(`unable to find service name ${reference.interfaceName} that was mentioned in references`);
        }

        // found matching class info
        if (find1) {
            // log.out(`found reference->class =${stringify(find1, null, 2)}`);
            reference.projectInfoReference = find1;

            let allLines = file.readFileToArrayOfLines(find1.fullPath);
            let interfaceInfo = _getSwitchyardInterfaceInfo(allLines);
            reference.interfaceInfo = interfaceInfo;

        }

    }

    switchyardXMLInfo.processed = { references };

    return switchyardXMLInfo;
}

module.exports = function (targetPath, outputFile, outputFileSwitchyardXmlFileInfo) {
    let results = file.getDirectoryAndFileListRecursive(targetPath, 60);
    // log.out(`results=${stringify(results, null, 2)}`);
    let needToProcessSwitchyardXmlFile = true;

    // do analyse each file in the list
    for (let result of results) {
        // with *.java
        let pattern = /.[Jj][Aa][Vv][Aa]$/gm;
        if (pattern.test(result.fileName)) {
            result.isJavaSource = true;
            result.packagePath = _extractJavaPackagePath(result.fullPath);
            result.packageName = _extractJavaPackageName(result.fullPath);
            result.className = path.basename(result.fileName, '.java');


            // log.out(`result.packagePath=${stringify(result.packagePath, null, 2)}`);
            // throw new Error('Breakpoint');
        }

    }

    // write results to project info file
    file.write(outputFile, `${stringify(results, null, 2)}`);

    // process details in switchyard.xml
    let switchyardProjectInfoFile = outputFile;
    for (let result of results) {
        if (result.fileName.match(/^switchyard\.xml$/gm)) {
            log.out(`found switchyard.xml at ${result.fullPath}`);

            result.isSwitchyardXml = true;
            let switchyardJsonInfo = _getSwitchyardXmlInfo(result.fullPath, switchyardProjectInfoFile);

            // outputFileSwitchyardXmlFileInfo can be undefined
            if (outputFileSwitchyardXmlFileInfo) {
                // log.out(`switchyardJsonInfo=${stringify(switchyardJsonInfo, null, 2)}`);
                let outputDataString = `${stringify(switchyardJsonInfo, null, 2)}`;
                // log.out(`outputDataString=${outputDataString}`);
                // log.out(`outputFileSwitchyardXmlFileInfo=${outputFileSwitchyardXmlFileInfo}`);
                file.write(outputFileSwitchyardXmlFileInfo, outputDataString);
            }

            // log.breakpoint();

            // no need to process another SwitchyardXmlFile if found in this project
            break;
        }
    }





    return "controllers.inspectTargetSwitchyardProject.js executed ok";
}