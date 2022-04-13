let config = require('./config.js');
let stringify = require('json-stringify-safe');
let log = require('./controllers/log');
let inspectTargetSwitchyardProject = require('./controllers/inspectTargetSwitchyardProject');
let createSpringBootProject = require('./controllers/createSpringBootProject');
let createRequestExample = require('./controllers/createRequestExample');
let createSpringBootRESTController = require('./controllers/createSpringBootRESTController');
let createSpringBootExternalService = require('./controllers/createSpringBootExternalService');

// console.log('config=',stringify(config));
let result = "";

for (let selected of config.job.selected) {
    if (selected.controller === "inspectTargetSwitchyardProject") {
        result += inspectTargetSwitchyardProject(selected.targetPath, selected.outputFile, selected.outputFileSwitchyardXmlFileInfo);
    } else if (selected.controller === "createSpringBootProject") {
        result += createSpringBootProject(
            selected.switchyardProjectInfoFile,
            selected.springBootTemplateFolder,
            selected.targetPath,
            selected.projectNameUppercase);
    } else if (selected.controller === "createRequestExample") {
        result += createRequestExample(
            selected.switchyardProjectInfoFile,
            selected.targetRestResourceFile,
            selected.outputFile);
    } else if (selected.controller === "createSpringBootRESTController") {
        result += createSpringBootRESTController(
            selected.switchyardInterfaceDeclarationFile,
            selected.switchyardInterfaceImplementationFile,
            selected.outputFile);
    } else if (selected.controller === "createSpringBootExternalService") {
        result += createSpringBootExternalService(
            selected.switchyardXmlInfoFile,
            selected.targetPath);
    }


    log.write(config.job.logFile, result);
}

