const file = require('./file');
const log = require('./log');
const stringify = require('json-stringify-safe');

function _extractJavaPackagePath(javaSourceFile) {

    let javaPackagePath = "";

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

function _getSwitchyardXmlInfo(xmlFile) {
    let switchyardXMLInfo;

    switchyardXMLInfo.source = file.readXmlFiletoJsonObj(xmlFile);

    // process a big source object into something more informative
    switchyardXMLInfo.processed = null;

    // ge references from source
    let references = [];
    let reference = {};
    for (let element1 of source.elements) {
        // source.elements[{name:"sy:switchyard"}]
        if (element1.name === 'sy:switchyard') {
            for (let element2 of element1.elements) {
                // source.elements[{name:"sy:switchyard",elements:[ {name:"sca:composite", elements:[ ] } ]}] and so on
                if (element2.name === 'sca:composite') {
                    for (let element3 of element2.elements) {
                        if (element3.name === 'sca:reference') {
                            reference.name = element3.attributes.name;
                            for (let element4 of element3.elements) {
                                if (element4.name === 'resteasy:binding.rest') {

                                }
                            }
                        }
                    }
                }
            }
        }

    }


    switchyardXMLInfo.processed = references;

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

            // log.out(`result.packagePath=${stringify(result.packagePath, null, 2)}`);
            // throw new Error('Breakpoint');
        }

        if (result.fileName.match(/^switchyard\.xml$/gm) && needToProcessSwitchyardXmlFile) {
            log.out(`found switchyard.xml at ${result.fullPath}`);

            result.isSwitchyardXml = true;
            let switchyardJsonInfo = _getSwitchyardXmlInfo(result.fullPath);

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
            needToProcessSwitchyardXmlFile = false;
        }

    }



    // write results to project info file
    file.write(outputFile, `${stringify(results, null, 2)}`);

    return "controllers.inspectTargetSwitchyardProject.js executed ok";
}