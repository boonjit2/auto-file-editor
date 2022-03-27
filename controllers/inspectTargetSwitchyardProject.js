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

module.exports = function (targetPath, outputFile) {
    let results = file.getDirectoryAndFileListRecursive(targetPath, 20);
    // log.out(`results=${stringify(results, null, 2)}`);

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

    }



    // write results to project info file
    file.write(outputFile, `${stringify(results, null, 2)}`);

    return "controllers\inspectTargetSwitchyardProject.js executed ok";
}