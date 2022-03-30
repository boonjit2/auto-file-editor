const file = require('./file');
const log = require('./log');
const stringify = require('json-stringify-safe');
const path = require('path');

function _extractJavaClassHeader(javaSourceFile) {
    let JavaClassHeader = "";

    // get file content
    let fileContent = file.readFile(javaSourceFile);
    let pattern = /^[ ]?xxx.*;$/gm;
    let matches = pattern.exec(fileContent);

    JavaClassHeader = matches[0];
    return JavaClassHeader;
}

module.exports = function (switchyardProjectInfoFile, springBootTemplateFolder, targetPath, projectNameUppercase) {

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

    // rename new project files
    let projectNameLowercase = projectNameUppercase.toLowerCase();
    file.rename(path.join(targetPath, '/src/main/java/th/co/ais/mynetwork/project_name'), path.join(targetPath, '/src/main/java/th/co/ais/mynetwork/', projectNameLowercase));
    file.rename(path.join(targetPath, '/src/main/java/th/co/ais/mynetwork/', projectNameLowercase, '/controller/ProjectNameController.java'), path.join(targetPath, '/src/main/java/th/co/ais/mynetwork/', projectNameLowercase, '/controller/', (projectNameUppercase + 'Controller.java')));

    file.rename(path.join(targetPath, '/src/main/java/th/co/ais/mynetwork/', projectNameLowercase, '/ProjectNameApplication.java'), path.join(targetPath, '/src/main/java/th/co/ais/mynetwork/', projectNameLowercase, '/', (projectNameUppercase + 'Application.java')));


    // replace patterns in files
    file.replaceInfile(
        path.join(targetPath, '/src/main/java/th/co/ais/mynetwork', projectNameLowercase, '/controller/*.java')
        , /{{projectNameLowercase}}/gm,
        projectNameLowercase);

    file.replaceInfile(
        path.join(targetPath, '/src/main/java/th/co/ais/mynetwork', projectNameLowercase, '/controller/*.java')
        , /{{projectNameUppercase}}/gm,
        projectNameUppercase);

    file.replaceInfile(
        path.join(targetPath, '/src/main/java/th/co/ais/mynetwork/', projectNameLowercase, '/*.java')
        , /{{projectNameLowercase}}/gm,
        projectNameLowercase);

    file.replaceInfile(
        path.join(targetPath, '/src/main/java/th/co/ais/mynetwork/', projectNameLowercase, '/*.java')
        , /{{projectNameUppercase}}/gm,
        projectNameUppercase);

    // pom file
    file.replaceInfile(
        path.join(targetPath, '/pom.xml')
        , /{{projectNameLowercase}}/gm,
        projectNameLowercase);

    file.replaceInfile(
        path.join(targetPath, '/pom.xml')
        , /{{projectNameUppercase}}/gm,
        projectNameUppercase);

    let projectVersion = '1.0.0'
    file.replaceInfile(
        path.join(targetPath, '/pom.xml')
        , /{{projectVersion}}/gm,
        projectVersion);

    // parse switchyard info
    let switchyardRaw = file.readFile(switchyardProjectInfoFile);
    let switchyardInfo = JSON.parse(switchyardRaw);

    // create destination path
    let pathPrefix = path.join(targetPath, '/src/main/java/');

    // iterate switchyardInfo file list
    for (let member of switchyardInfo) {
        // handle java files
        if (member.isJavaSource) {
            let sourcePath = member.fullPath;
            let destinationPath = path.join(pathPrefix, member.packagePath, member.fileName);
            file.copy(sourcePath, destinationPath);

            // check if this file has loggers
            if (file.containPattern(destinationPath, /import[ ]*org.apache.log4j.Logger;/gm)) {
                // apply new log import
                file.replaceInfile(
                    destinationPath
                    , /import[ ]*org.apache.log4j.Logger;/gm,
                    'import lombok.extern.slf4j.Slf4j;');

                // replace old LOGGER. with log.
                file.replaceInfile(
                    destinationPath
                    , /LOGGER\./gm,
                    'log.');

                // TODO: apply @Slf4j annotation before the header of the class
            }

        }

        // handle pom files
        if (member.fileName === 'pom.xml') {

        }


    }


    return `controllers.createSpringBootProject.js: created project at: ${targetPath}`;
}