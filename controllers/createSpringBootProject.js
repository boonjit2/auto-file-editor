const file = require('./file');
const log = require('./log');
const stringify = require('json-stringify-safe');
const path = require('path');

module.exports = function (switchyardProjectInfoFile, springBootTemplateFolder, targetPath) {

    // error if targetPath not empty
    if (file.isPathEmpty(targetPath) === false) {
        throw new Error(`targetPath ${targetPath} is not empty, please check and remove it before you continue`)
    }

    // create empty directory
    if (file.isPathExist(targetPath)) {
        file.mkDir(targetPath);
    }

    // copy template to target location
    file.copy(springBootTemplateFolder, targetPath)

    // parse switchyard info
    let switchyardRaw = file.readFile(switchyardProjectInfoFile);
    let switchyardInfo = JSON.parse(switchyardRaw);

    // create destination path
    let pathPrefix = path.join(targetPath, '/src/main/java/');

    // copy 
    for (let member of switchyardInfo) {
        if (member.isJavaSource) {
            let sourcePath = member.fullPath;
            let destinationPath = path.join(pathPrefix, member.packagePath, member.fileName);
            file.copy(sourcePath, destinationPath);

            // create destination folder if not exist

        }
    }


    return `controllers\createSpringBootProject.js: created project at: ${targetPath}`;
}