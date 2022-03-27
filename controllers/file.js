const fs = require('fs-extra');
var path = require('path');


function _isFile(fileName) {
    return fs.lstatSync(fileName).isFile()
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
    fs.writeFile(targetPath, data, 'utf8', function (err) {
        if (err) {
            console.log("file.write: Error:");
            return console.log(err);
        }

        console.log(`file.write: Done: Wrote to file: ${targetPath}`);
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

// fs.readdirSync(folderPath).map(fileName => {
//     return path.join(folderPath, fileName)
// })
