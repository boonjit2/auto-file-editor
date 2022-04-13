const file = require('./file');
const log = require('./log');
const stringify = require('json-stringify-safe');
const path = require('path');
const string = require('./string');

function _extractJavaClassHeader(javaSourceFile) {
    let JavaClassHeader = "";

    // get file content
    let fileContent = file.readFile(javaSourceFile);
    let pattern = /^[ ]?xxx.*;$/gm;
    let matches = pattern.exec(fileContent);

    JavaClassHeader = matches[0];
    return JavaClassHeader;
}

// TODO? don't need Slf4j anymore ?
// function _applyLogAnnotation(targetPath) {
//     let lines = file.readFileToArrayOfLines(targetPath);

//     // find a line with pattern : import


//     return;
// }

module.exports = function (switchyardProjectInfoFile, springBootTemplateFolder, targetPath, projectNameUppercase) {

    let projectNameLowercase = projectNameUppercase.toLowerCase();
    let pathFragment1 = '/src/main/java/th/co/ais/mynetwork/';

    // error if targetPath not empty
    // if (file.isPathEmpty(targetPath) === false) {
    //     throw new Error(`targetPath ${targetPath} is not empty, please check and remove it before you continue`)
    // }

    // create empty directory
    if (file.isPathExist(targetPath) === false) {
        file.mkDir(targetPath);
    }

    // delete some essential folder in targetPath before continue
    let targetPathToCheck = path.join(targetPath, pathFragment1, projectNameLowercase);
    if (file.isPathExist(targetPathToCheck) === true) {
        log.out(`found existing and removing dir: ${targetPathToCheck}`)
        file.deleteDirRecursive(targetPathToCheck);
    }
    // log.breakpoint();

    // copy template to target location
    file.copy(springBootTemplateFolder, targetPath)

    // rename new project files
    file.rename(path.join(targetPath, pathFragment1, 'project_name'), path.join(targetPath, '/src/main/java/th/co/ais/mynetwork/', projectNameLowercase));
    file.rename(path.join(targetPath, pathFragment1, projectNameLowercase, '/controller/ProjectNameController.java'), path.join(targetPath, '/src/main/java/th/co/ais/mynetwork/', projectNameLowercase, '/controller/', (projectNameUppercase + 'Controller.java')));
    file.rename(path.join(targetPath, pathFragment1, projectNameLowercase, '/ProjectNameApplication.java'), path.join(targetPath, '/src/main/java/th/co/ais/mynetwork/', projectNameLowercase, '/', (projectNameUppercase + 'Application.java')));


    // replace patterns in files
    file.replaceInfile(
        path.join(targetPath, pathFragment1, projectNameLowercase, '/controller/*.java')
        , /{{projectNameLowercase}}/gm,
        projectNameLowercase);

    file.replaceInfile(
        path.join(targetPath, pathFragment1, projectNameLowercase, '/controller/*.java')
        , /{{projectNameUppercase}}/gm,
        projectNameUppercase);

    file.replaceInfile(
        path.join(targetPath, pathFragment1, projectNameLowercase, '/*.java')
        , /{{projectNameLowercase}}/gm,
        projectNameLowercase);

    file.replaceInfile(
        path.join(targetPath, pathFragment1, projectNameLowercase, '/*.java')
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

    // iterate switchyardInfo file list and process each file
    for (let member of switchyardInfo) {
        // handle java files
        if (member.isJavaSource) {
            let sourcePath = member.fullPath;
            let destinationPath = path.join(pathPrefix, member.packagePath, member.fileName);
            file.copy(sourcePath, destinationPath);

            // // check if this file has loggers
            // if (file.containPattern(destinationPath, /import[ ]*org.apache.log4j.Logger;/gm)) {
            //     // apply new log import
            //     file.replaceInfile(
            //         destinationPath
            //         , /import[ ]*org.apache.log4j.Logger;/gm,
            //         'import lombok.extern.slf4j.Slf4j;');

            //     // replace old LOGGER. with log.
            //     file.replaceInfile(
            //         destinationPath
            //         , /LOGGER\./gm,
            //         'log.');

            //     // Note: don't need Slf4j anymore ? apply @Slf4j annotation before the header of the class
            //     // _applyLogAnnotation(destinationPath);
            // }

        }

        // handle pom files
        // Note: no need to automate dependencies yet, this job can
        // still be manually doable
        // if (member.fileName === 'pom.xml') {
        // }



        // get switchyard contextPath and put it into \springboot_project_template\src\main\webapp\WEB-INF\jboss-web.xml
        if (member.fileName === 'switchyard.xml') {
            let switchyardLines = file.readFileToArrayOfLines(member.fullPath);
            // log.out(`switchyardLines=${stringify(switchyardLines, null, 2)}`);
            let contextPath = string.extractXmlValue(switchyardLines, /<resteasy:contextPath>.*<\/resteasy:contextPath>/gm, '<resteasy:contextPath>', '</resteasy:contextPath>');
            if (contextPath === null) {
                throw new Error(`Unable to find contextPath from ${member.fullPath}`);
            }
            contextPath = '/' + contextPath;

            // replace contextPath in the template file
            let pathFragment2 = '/src/main/webapp/WEB-INF'
            file.replaceInfile(
                path.join(targetPath, pathFragment2, '/jboss-web.xml')
                , /{{contextPath}}/gm,
                contextPath);

        }

    }


    return `controllers.createSpringBootProject.js: created project at: ${targetPath}`;
}