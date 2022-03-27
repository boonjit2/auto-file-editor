const file = require('./file');
const log = require('./log');
const stringify = require('json-stringify-safe');

module.exports = function (targetPath, outputFile) {
    let results = file.getDirectoryAndFileListRecursive(targetPath, 20);
    // log.out(`results=${stringify(results, null, 2)}`);
    file.write(outputFile, `${stringify(results, null, 2)}`);




    return "controllers\inspectTargetSwitchyardProject.js executed ok";
}