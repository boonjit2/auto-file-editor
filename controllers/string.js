const fs = require('fs-extra');
var path = require('path');
const log = require('./log');
const replace = require('replace-in-file');

module.exports.tokenize = function (string, pattern) {
    let subStrings = string.split(pattern);
    if (subStrings[subStrings.length - 1] === '') {
        subStrings.pop();
    }
    return subStrings;
}