const fs = require('fs-extra');
var path = require('path');
const log = require('./log');
const replace = require('replace-in-file');
const string = require('./string');
var convert = require('xml-js');

const { stringify } = require('querystring');


function _isFile(fileName) {
    return fs.lstatSync(fileName).isFile()
}

module.exports.readXmlFiletoJsonObj = function (filePath) {
    let xmlString = this.readFile(filePath);
    // log.out(`xmlString=${xmlString}`);
    var json1 = convert.xml2json(xmlString, { compact: false, spaces: 0 });
    let json2 = JSON.parse(json1);
    // log.out(`json1=${json1}`);

    return json2;
}

// function _getDirectoryAndFileList(folderPath,remainingLevelAllowed) {
//     return fs.readdirSync(folderPath).map(fileName => {
//         let fullPath = path.join(folderPath, fileName).replace(/\\/g, '/');
//         let isFile = _isFile(fullPath);

//         return {
//             isFile,
//             folderPath,
//             fileName,
//             fullPath
//         }
//     })
// }

module.exports.write = function (targetPath, data) {
    fs.writeFileSync(targetPath, data, 'utf8');
    // , function (err) ;
    // {
    //     if (err) {
    //         console.log("file.write: Error:");
    //         return console.log(err);
    //     }
    //     console.log(`file.write: Done: Wrote to file: ${targetPath}`);
    // });
    console.log(`file.write: Done: Wrote to file: ${targetPath}`);
}

module.exports.writeArrayOfLinesToFile = function (targetPath, arrayOfLines) {

    let data = '';
    arrayOfLines.forEach(element => {
        data += `element\n`
    });

    fs.writeFile(targetPath, data, 'utf8', function (err) {
        if (err) {
            console.log("file.write: Error:");
            return console.log(err);
        }

        // console.log(`file.writeArrayOfLinesToFile: Done: Wrote to file: ${targetPath}`);
    });
}



module.exports.getDirectoryAndFileListRecursive = function (folderPath, depthLimit) {
    let currentDirAndFileList = [];
    let results = [];
    currentDirAndFileList = fs.readdirSync(folderPath).map(fileName => {
        let fullPath = path.join(folderPath, fileName).replace(/\\/g, '/');
        let isFile = _isFile(fullPath);

        return {
            isFile,
            folderPath,
            fileName,
            fullPath
        }
    })

    // error if depth limit reached
    if (depthLimit <= 0) {
        // return {};
        throw new Error(`depth limit reached 0 before it can reach the deepest level.`);
    }

    // check if this list has any folder
    for (let file of currentDirAndFileList) {
        if (file.isFile === false) {
            results.push(file);
            // this is folder, need to iterate into sub level.
            let lowerLevelList = this.getDirectoryAndFileListRecursive(file.fullPath, depthLimit - 1);
            results = results.concat(lowerLevelList);
        } else {
            results.push(file);
        }
    }

    return results;

}

module.exports.readFile = function (FilePath) {
    return fs.readFileSync(FilePath, { encoding: 'utf8' });
}

module.exports.readFileToJson = function (FilePath) {
    let raw = fs.readFileSync(FilePath, { encoding: 'utf8' });
    return JSON.parse(raw);
}

module.exports.readFileToArrayOfLines = function (FilePath) {
    let raw = fs.readFileSync(FilePath, { encoding: 'utf8' });
    // Create Array containing each line of declarationText
    let arrayOfLines = string.tokenize(raw, /\n/gm);
    return arrayOfLines;
}

module.exports.copy = function (src, dest) {
    // log.out(`copy from ${src} to ${dest}`);
    return fs.copySync(src, dest, { overwrite: true });
}

module.exports.mkDir = function (targetPath) {
    return fs.mkdirSync(targetPath);
}

// fs.readdirSync(folderPath).map(fileName => {
//     return path.join(folderPath, fileName)
// })

module.exports.isPathEmpty = function (targetPath) {
    // path exists
    if (fs.existsSync(targetPath)) {
        return fs.readdirSync(targetPath).length === 0;
    } else {
        // path not exists, so path is empty
        return true;
    }
}

module.exports.isPathExist = function (targetPath) {
    // path exists
    if (fs.existsSync(targetPath)) {
        return true;
    } else {
        return false;
    }
}

module.exports.rename = function (oldPath, newPath) {
    return fs.renameSync(oldPath, newPath);
}

module.exports.replaceInfile = function (files, from, to) {
    let options = { files, from, to };
    return replace.sync(options);
}

module.exports.containPattern = function (filePath, pattern) {
    // get file content
    let fileContent = this.readFile(filePath);
    let matches = pattern.exec(fileContent);

    if (matches && matches.length > 0) {
        return true;
    } else {
        return false;
    }
}

module.exports.getAllMatches = function (filePath, pattern) {
    // get file content
    let fileContent = this.readFile(filePath);
    // log.out(`fileContent=${fileContent}`);
    let matches = fileContent.match(pattern);

    return matches;
}
