let config = require('./config.js');
let stringify = require('json-stringify-safe');
let listTargetFolderStructure = require('./controllers/listTargetFolderStructure');

console.log('config=',stringify(config));

for(let selected of config.job.selected){
    if(selected.controller==="listTargetFolderStructure"){
        console.log(listTargetFolderStructure());
    }

}

