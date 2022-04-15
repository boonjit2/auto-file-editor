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
    log.out(`projectSrcMainJavaPath=${projectSrcMainJavaPath}`);
    let projectSrcMainResourcePath = path.join(mavenFilesLocationDir, '/src/main/resources/');
    log.out(`projectSrcMainResourcePath=${projectSrcMainResourcePath}`);
    let projectWebInfoPath = path.join(mavenFilesLocationDir, '/src/main/webapp/WEB-INF/');
    log.out(`projectWebInfoPath=${projectWebInfoPath}`);



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
    // sourcePath = path.join(springBootTemplateFolder, '/main_controller/ProjectNameController.java').normalize();
    // destinationPath = path.join(rootPackagePath, '/controller/', `${projectNameUppercase}Controller.java`).normalize();
    // file.copy(sourcePath, destinationPath);

    // // edit main controller file
    // file.replaceInfile(
    //     destinationPath
    //     , /{{rootPackageName}}/gm,
    //     rootPackageName);

    // file.replaceInfile(
    //     destinationPath
    //     , /{{sourceProjectName}}/gm,
    //     sourceProjectName);

    // file.replaceInfile(
    //     destinationPath
    //     , /{{projectNameUppercase}}/gm,
    //     projectNameUppercase);

    // copy over resource files
    sourcePath = path.join(springBootTemplateFolder, '/resources/').normalize();
    destinationPath = projectSrcMainResourcePath;
    file.copy(sourcePath, destinationPath);

    // copy over jboss-web.xml
    sourcePath = path.join(springBootTemplateFolder, '/WEB-INF/jboss-web.xml').normalize();
    destinationPath = path.join(projectWebInfoPath, '/jboss-web.xml').normalize();
    file.copy(sourcePath, destinationPath);

    // edit jboss-web.xml
    file.replaceInfile(
        destinationPath
        , /{{contextPath}}/gm,
        contextPath);

    // copy over jboss-deployment-structure.xml
    sourcePath = path.join(springBootTemplateFolder, '/WEB-INF/jboss-deployment-structure.xml').normalize();
    destinationPath = path.join(projectWebInfoPath, '/jboss-deployment-structure.xml').normalize();
    file.copy(sourcePath, destinationPath);

    return `controllers.createSpringBootProject.js: created project at: ${mavenFilesLocationDir}`;
}