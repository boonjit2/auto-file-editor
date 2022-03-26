const fs = require('fs');

module.exports.write = function(logFile,data){
    fs.writeFile(logFile, data, 'utf8', function (err) {
        if (err) {
            console.log("log.write: Error:");
            return console.log(err);
        }

        console.log(`log.write: Done: Wrote to file: ${logFile}`);
    });
}