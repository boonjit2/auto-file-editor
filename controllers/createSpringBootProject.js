const file = require('./file');
const log = require('./log');
const stringify = require('json-stringify-safe');
const path = require('path');
const string = require('./stringu');
const switchyard = require('./switchyard');
const { kStringMaxLength } = require('buffer');
const { strict } = require('assert');

function _extractJavaClassHeader(javaSourceFile) {
    let JavaClassHeader = "";

    // get file content
    let fileContent = file.readFile(javaSourceFile);
    let pattern = /^[ ]?xxx.*;$/gm;
    let matches = pattern.exec(fileContent);

    JavaClassHeader = matches[0];
    return JavaClassHeader;
}

module.exports = function (source, destination) {

    // parse
    let switchyardProjectInfoFile = source.switchyardProjectInfoFile;
    let springBootTemplateFolder = source.springBootTemplateFolder;
    let sourceProjectName = source.projectName;

    let mavenFilesLocationDir = destination.mavenFilesLocationDir;
    let rootPackageName = destination.rootPackageName;
    let projectNameUppercase = destination.projectNameUppercase;

    // paths we need to know
    let contextPath = null;
    let rootPackagePath = path.posix.join(mavenFilesLocationDir, '/src/main/java/', rootPackageName.replace(/\./gm, '/'));
    log.out(`rootPackagePath=${rootPackagePath}`);
    let projectSrcMainJavaPath = path.join(mavenFilesLocationDir, '/src/main/java/');
    // log.out(`projectSrcMainJavaPath=${projectSrcMainJavaPath}`);

    // parse switchyard info
    let switchyardInfo = file.readFileToJson(switchyardProjectInfoFile);

    // create destination path to /src/main/java/
    let pathPrefix = path.join(mavenFilesLocationDir, '/src/main/java/');

    // delete old destination folder
    let targetPathToCheck = mavenFilesLocationDir;
    if (file.isPathExist(targetPathToCheck) === true) {
        log.out(`found existing and removing dir: ${targetPathToCheck}`)
        file.deleteDirRecursive(targetPathToCheck);
    }

    // iterate switchyardInfo file list and process each file
    // copy those files over to new location
    for (let member of switchyardInfo) {
        // handle java files
        if (member.isJavaSource) {
            let sourcePath = member.fullPath;
            let destinationPath = path.join(pathPrefix, member.packagePath, member.fileName);
            file.copy(sourcePath, destinationPath);

        }

        // get switchyard contextPath and put it into \springboot_project_template\src\main\webapp\WEB-INF\jboss-web.xml
        if (member.fileName === 'switchyard.xml') {
            let switchyardLines = file.readFileToArrayOfLines(member.fullPath);
            // log.out(`switchyardLines=${stringify(switchyardLines, null, 2)}`);
            contextPath = string.extractXmlValue(switchyardLines, /<resteasy:contextPath>.*<\/resteasy:contextPath>/gm, '<resteasy:contextPath>', '</resteasy:contextPath>');
            if (contextPath === null) {
                throw new Error(`Unable to find contextPath from ${member.fullPath}`);
            }
            contextPath = path.posix.join('/', contextPath); // original context path has no / at the beginning

            // replace contextPath in the template file
            // let pathFragment2 = '/src/main/webapp/WEB-INF'
            // file.replaceInfile(
            //     path.join(targetPath, pathFragment2, '/jboss-web.xml')
            //     , /{{contextPath}}/gm,
            //     contextPath);

        }

    }

    // copy over maven files
    let sourcePath = path.join(springBootTemplateFolder, '/maven_files/').normalize();
    let destinationPath = mavenFilesLocationDir;
    file.copy(sourcePath, destinationPath);

    // edit pom file
    // pom file
    file.replaceInfile(
        path.join(destinationPath, '/pom.xml')
        , /{{sourceProjectName}}/gm,
        sourceProjectName);

    file.replaceInfile(
        path.join(destinationPath, '/pom.xml')
        , /{{projectNameUppercase}}/gm,
        projectNameUppercase);

    let projectVersion = '1.0.0'
    file.replaceInfile(
        path.join(destinationPath, '/pom.xml')
        , /{{projectVersion}}/gm,
        projectVersion);

    // copy over+rename ProjectNameApplication.java file
    sourcePath = path.join(springBootTemplateFolder, '/src_main_java_root/ProjectNameApplication.java').normalize();
    destinationPath = path.join(rootPackagePath, '/', `${projectNameUppercase}Application.java`).normalize();
    file.copy(sourcePath, destinationPath);

    // edit ProjectNameApplication.java
    file.replaceInfile(
        destinationPath
        , /{{rootPackageName}}/gm,
        rootPackageName);

    file.replaceInfile(
        destinationPath
        , /{{sourceProjectName}}/gm,
        sourceProjectName);

    file.replaceInfile(
        destinationPath
        , /{{projectNameUppercase}}/gm,
        projectNameUppercase);

    // copy over+rename ServletInitializer file
    sourcePath = path.join(springBootTemplateFolder, '/src_main_java_root/ServletInitializer.java').normalize();
    destinationPath = path.join(rootPackagePath, '/', `ServletInitializer.java`).normalize();
    file.copy(sourcePath, destinationPath);

    // edit ServletInitializer file
    file.replaceInfile(
        destinationPath
        , /{{rootPackageName}}/gm,
        rootPackageName);

    file.replaceInfile(
        destinationPath
        , /{{sourceProjectName}}/gm,
        sourceProjectName);

    file.replaceInfile(
        destinationPath
        , /{{projectNameUppercase}}/gm,
        projectNameUppercase);


    // copy over+ rename main controller file
    sourcePath = path.join(springBootTemplateFolder, '/main_controller/ProjectNameController.java').normalize();
    destinationPath = path.join(rootPackagePath, '/', `${projectNameUppercase}Controller.java`);
    file.copy(sourcePath, destinationPath);

    // edit main controller file


    // copy over resource files


    // copy over jboss files



    log.breakpoint();

    // let projectNameLowercase = projectNameUppercase.toLowerCase();
    // let pathFragment1 = '/src/main/java/th/co/ais/mynetwork/';

    // error if targetPath not empty
    // if (file.isPathEmpty(targetPath) === false) {
    //     throw new Error(`targetPath ${targetPath} is not empty, please check and remove it before you continue`)
    // }

    // create empty directory
    if (file.isPathExist(targetPath) === false) {
        file.mkDir(targetPath);
    }

    // delete some essential folder in targetPath before continue
    // let targetPathToCheck = path.join(targetPath, pathFragment1, projectNameLowercase);
    // if (file.isPathExist(targetPathToCheck) === true) {
    //     log.out(`found existing and removing dir: ${targetPathToCheck}`)
    //     file.deleteDirRecursive(targetPathToCheck);
    // }
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

    // // pom file
    // file.replaceInfile(
    //     path.join(targetPath, '/pom.xml')
    //     , /{{projectNameLowercase}}/gm,
    //     projectNameLowercase);

    // file.replaceInfile(
    //     path.join(targetPath, '/pom.xml')
    //     , /{{projectNameUppercase}}/gm,
    //     projectNameUppercase);

    // let projectVersion = '1.0.0'
    // file.replaceInfile(
    //     path.join(targetPath, '/pom.xml')
    //     , /{{projectVersion}}/gm,
    //     projectVersion);




    return `controllers.createSpringBootProject.js: created project at: ${mavenFilesLocationDir}`;
}