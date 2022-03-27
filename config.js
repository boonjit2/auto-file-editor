module.exports =
{
    "job": {
        "logFile": "D:/auto-file-editor/logs/log.txt",
        "available": [
            {
                "controller": "listTargetFolderStructure",
                "description": "List target folder structure from targetPath, then store it in outputFile",
                "targetPath": "",
                "outputFile": ""
            },
            {
                "controller": "inspectTargetSwitchyardProject",
                "description": "inspect Switchyard project folder in targetPath, then store data in outputFile",
                "targetPath": "D:/myNetworkAppSwitchYard/centralizedb",
                "outputFile": "D:/auto-file-editor/data/switchyardProjectInfo.JSON"
            }
        ],
        "selected": [
            {
                "controller": "inspectTargetSwitchyardProject",
                "targetPath": "D:/myNetworkAppSwitchYard/centralizedb",
                "outputFile": "D:/auto-file-editor/logs/switchyardProjectInfo.JSON"
            }
        ]
    }

}
