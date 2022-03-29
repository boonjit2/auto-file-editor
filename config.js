module.exports =
{
    "job": {
        "logFile": "D:/auto-file-editor/logs/log.txt",
        "available": [
            {
                "controller": "inspectTargetSwitchyardProject",
                "description": "inspect Switchyard project folder in targetPath, then store data in outputFile",
                "targetPath": "D:/myNetworkAppSwitchYard/centralizedb",
                "outputFile": "D:/auto-file-editor/data/switchyardProjectInfo.JSON"
            },
            {
                "controller": "createSpringBootProject",
                "description": "create Spring Boot project folder from template and switchyardProjectInfo to targetPath",
                "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo.JSON",
                "springBootTemplateFolder": "D:/auto-file-editor/data/springboot_project_template",
                "targetPath": "D:/auto-file-editor/logs/centralizedb",
                "projectNameUppercase": "CentralizeDB"
            },
            {
                "controller": "createRequestExample",
                "description": "generate request examples from the target switchyard project",
                "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo.JSON",
                "targetRestResourceFile": "D:/myNetworkAppSwitchYard/centralizedb/src/main/java/th/co/ais/mynetwork/centralizedb/ListServiceRestResource.java",
                "outputFile": "D:/auto-file-editor/logs/ListServiceRestResourceRequests.JSON",
            },
        ],
        "selected": [
            // {
            //     "controller": "inspectTargetSwitchyardProject",
            //     "targetPath": "D:/myNetworkAppSwitchYard/centralizedb",
            //     "outputFile": "D:/auto-file-editor/logs/switchyardProjectInfo.JSON"
            // }
            // {
            //     "controller": "createSpringBootProject",
            //     "description": "create Spring Boot project folder from template and switchyardProjectInfo to targetPath",
            //     "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo.JSON",
            //     "springBootTemplateFolder": "D:/auto-file-editor/data/springboot_project_template",
            //     "targetPath": "D:/auto-file-editor/logs/centralizedb",
            //     "projectNameUppercase": "CentralizeDB"
            // }
            {
                "controller": "createRequestExample",
                "description": "generate request examples from the target switchyard project",
                "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo.JSON",
                "targetRestResourceFile": "D:/myNetworkAppSwitchYard/centralizedb/src/main/java/th/co/ais/mynetwork/centralizedb/ListServiceRestResource.java",
                "outputFile": "D:/auto-file-editor/logs/ListServiceRestResourceRequests.JSON",
            }
        ]
    }

}
