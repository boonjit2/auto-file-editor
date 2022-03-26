let config = require('./config.js');
let stringify = require('json-stringify-safe');
let log = require('./controllers/log');
let listTargetFolderStructure = require('./controllers/listTargetFolderStructure');


console.log('config=',stringify(config));
let result = "";

for(let selected of config.job.selected){
    if(selected.controller==="listTargetFolderStructure"){
        result += listTargetFolderStructure();
        
    }

    log.write(config.job.logFile,result);
}

