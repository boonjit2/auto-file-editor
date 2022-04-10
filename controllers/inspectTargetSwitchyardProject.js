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

    switchyardXMLInfo = file.readXmlFiletoJsonObj(xmlFile);

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