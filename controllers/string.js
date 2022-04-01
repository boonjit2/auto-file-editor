const fs = require('fs-extra');
var path = require('path');
const log = require('./log');
const replace = require('replace-in-file');
const replaceall = require('replaceall');
let stringify = require('json-stringify-safe');

module.exports.matchCount = function (original, pattern) {
    let matches = original.match(pattern);
    if (matches) { return matches.length } else { return 0; }
}

module.exports.tokenize = function (string, pattern) {
    let subStrings = string.split(pattern);
    if (subStrings[subStrings.length - 1] === '') {
        subStrings.pop();
    }
    return subStrings;
}

module.exports.replaceall = function (old, new1, original) {
    return replaceall(old, new1, original);
}

// extract java method from list of fragmented line of codes
// method (params) {
//  codes    
// }
module.exports.extractJavaMethod = function (allLines, headerPattern, maxExtractLines) {
    let extractedMethodLines = [];

    // log.out(`allLines=${stringify(allLines, null, 0)}`);

    if (allLines.length) {
        for (let index = 0; index < allLines.length; index++) {
            let openedCurlBraceCount = 0;
            if (allLines[index].match(pattern)) {
                // start extraction
                // using the logic "counting { and } until all paired"
                do {
                    // extract this line
                    extractedMethodLines.push(allLines[index]);

                    // find opening '{' in this line
                    let openningCurlFound = this.matchCount(allLines[index], /{/gm);
                    // log.out(`openningCurlFound=${openningCurlFound}`);
                    if (openningCurlFound > 0) {
                        openedCurlBraceCount += openningCurlFound;
                    }

                    // find closing '}' in this line
                    let closingCurlFound = this.matchCount(allLines[index], /}/gm);
                    // log.out(`openningCurlFound=${openningCurlFound}`);
                    if (closingCurlFound > 0) {
                        openedCurlBraceCount -= closingCurlFound;
                    }

                    // log.out(`openedCurlBraceCount=${openedCurlBraceCount}`);

                    // update limit 
                    maxExtractLines--;
                    // go to next line 
                    index++;
                    // stop if index reached the last
                    if (index >= allLines.length - 1) { break; }

                } while (maxExtractLines > 0 && openedCurlBraceCount > 0)

            }
        }
    }

    return extractedMethodLines;
}


module.exports.extractXmlValue = function (arrayOfLines, detectPattern, begin, end) {
    let XmlValue = null;

    arrayOfLines.forEach(element => {
        let matches = element.match(detectPattern);
        if (matches) {
            let s = matches[0];

            // remove heading and tailing strings such as "<key>value</key>" to just "value"
            s = this.replaceall(begin, '', s);
            s = this.replaceall(end, '', s);
            XmlValue = s;
        }
    });

    return XmlValue;
}