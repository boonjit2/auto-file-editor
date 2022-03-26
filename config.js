module.exports =
{ 
    "job":{
        "logFile": "D:/auto-file-editor/logs/log.txt",
        "available" : [
            {
                "controller": "listTargetFolderStructure",
                "description": "List target folder structure from targetPath, then store it in outputFile",
                "targetPath": "",
                "outputFile": ""
            }
        ],
        "selected" :[
            {
                "controller": "listTargetFolderStructure"
            }
        ]
    }

}
