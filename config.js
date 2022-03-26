module.exports =
{
    "jobSummaryFile": "summary.JSON",
    "job":{
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
