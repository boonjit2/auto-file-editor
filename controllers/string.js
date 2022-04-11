const fs = require('fs-extra');
var path = require('path');
const log = require('./log');
const replace = require('replace-in-file');
const clone = require('clone');
let stringify = require('json-stringify-safe');


module.exports.matchCount = function (original, pattern) {
    let matches = original.match(pattern);
    if (matches) { return matches.length } else { return 0; }
}

module.exports.tokenize = function (st, pattern) {
    let subStrings = st.split(pattern);
    if (subStrings[subStrings.length - 1] === '') {
        subStrings.pop();
    }

    // remove all member with value= ""
    let subStrings2 = [];
    subStrings.forEach(element => {
        if (element !== '') {
            subStrings2.push(element);
        }
    });
    return subStrings2;
}

// Note: not compatible with regex matching, use string as input
module.exports.replaceall = function (oldString, newString, original) {
    // log.out(`original=${original}, type=${typeof original}`);

    // return original.replaceAll(oldString, newString);
    return original.replace(new RegExp(oldString, 'g'), newString);
}

module.exports.isBlankLine = function (stringLine) {
    if (typeof stringLine !== 'string') {
        throw new Error(`stringLine=${stringLine} type is not string`);
    }

    if (stringLine.trim() === '') {
        return true;
    } else {
        return false;
    }
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
            if (allLines[index].match(headerPattern)) {
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

// return index of matched member
// starts searching from beginIndex to endIndex (inclusive)
// return null if no matches
module.exports.getFirstMatchedLineIndex = function (arrayOfLines, detectPattern, beginIndex, endIndex) {
    let index = null;

    for (let i = beginIndex; i <= endIndex; i++) {
        if (arrayOfLines[i].match(detectPattern)) {
            return i;
        }
    }

    return index;
}

// get all lines starting from the first match
// return [] if no match found
module.exports.getAllLinesFromFirstMatchToEndIndex = function (arrayOfLines, detectPattern, beginIndex, endIndex) {
    let results = [];
    let startCopyingIndex = null;
    for (let i = beginIndex; i <= endIndex; i++) {
        if (arrayOfLines[i].match(detectPattern)) {
            startCopyingIndex = i;
            break;
        }
    }

    if (startCopyingIndex) {
        for (let j = startCopyingIndex; j <= endIndex; j++) {
            results.push(arrayOfLines[j]);
        }
    }

    return results;
}


// separate lines into a small groups using blank line as a delimiter
// example:
//    from: ["line1","line2","","","line3","line4",...]
//    to: [["line1","line2"],["line3","line4"],...]
// 
module.exports.stringLinesToGroups = function (arrayOfLines) {
    let groups = [];
    let smallGroups = [];

    for (let i = 0; i < arrayOfLines.length; i++) {

        if (this.isBlankLine(arrayOfLines[i]) === false) {
            // log.out(`arrayOfLines[${i}]=${arrayOfLines[i]}`);
            // found the line which is not blank
            smallGroups.push(arrayOfLines[i]);

            // save to groups if this is the last line of arrayOfLines
            if (i === arrayOfLines.length - 1) {
                if (smallGroups.length > 0) {
                    groups.push(clone(smallGroups));
                    smallGroups = [];
                }
            }

        } else {
            // found the blank line
            // save to groups if there is any member inside smallGroups 
            // , then clear smallGroups 
            if (smallGroups.length > 0) {
                groups.push(clone(smallGroups));
                smallGroups = [];
            }
        }
    }

    return groups;

}
