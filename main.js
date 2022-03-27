let config = require('./config.js');
let stringify = require('json-stringify-safe');
let log = require('./controllers/log');
let inspectTargetSwitchyardProject = require('./controllers/inspectTargetSwitchyardProject');
let createSpringBootProject = require('./controllers/createSpringBootProject');


// console.log('config=',stringify(config));
let result = "";

for (let selected of config.job.selected) {
    if (selected.controller === "inspectTargetSwitchyardProject") {
        result += inspectTargetSwitchyardProject(selected.targetPath, selected.outputFile);
    } else if (selected.controller === "createSpringBootProject") {
        result += createSpringBootProject(selected.switchyardProjectInfoFile,
            selected.springBootTemplateFolder,
            selected.targetPath,
            selected.projectNameUppercase);
    }

    log.write(config.job.logFile, result);
}

