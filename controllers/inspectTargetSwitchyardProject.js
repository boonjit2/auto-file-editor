const file = require('./file');
const log = require('./log');
const clone = require('clone');
const path = require('path');
const string = require('./string');
const stringify = require('json-stringify-safe');

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


function _getSwitchyardInterfaceInfo(allLines) {

    // find first line with @Path
    let firstPathIndex = string.getFirstMatchedLine(allLines, /@Path\(/gm, 0, allLines.length - 1);
    if (!firstPathIndex) {
        throw new Error('unable to get first line with @Path');
    }

    return { firstPath: allLines[firstPathIndex] };
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
            reference.fullPath = find1.fullPath;

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