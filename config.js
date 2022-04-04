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
                "controller": "createSpringBootRESTController",
                "description": "create Spring Boot REST controller using data from Switchyard controller files",
                "switchyardInterfaceDeclarationFile": "D:/myNetworkAppSpringBoot/alarmgateway/src/main/java/th/co/ais/mynetwork/alarmgateway/ListServiceRestResource.java",
                "switchyardInterfaceImplementationFile": "D:/myNetworkAppSpringBoot/alarmgateway/src/main/java/th/co/ais/mynetwork/alarmgateway/ListServiceInterfaceBean.java",
                "outputFile": "D:/myNetworkAppSpringBoot/alarmgateway/src/main/java/th/co/ais/mynetwork/alarmgateway/controller/alarmGatewayController.java"
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

            // inspectTargetSwitchyardProject
            //
            // {
            //     "controller": "inspectTargetSwitchyardProject",
            //     "targetPath": "D:/myNetworkAppSwitchYard/centralizedb",
            //     "outputFile": "D:/auto-file-editor/logs/switchyardProjectInfo.JSON"
            // }
            // {
            //     "controller": "inspectTargetSwitchyardProject",
            //     "targetPath": "D:/myNetworkAppSwitchYard/alarmGateway",
            //     "outputFile": "D:/auto-file-editor/logs/switchyardProjectInfo_alarmGateway.JSON"
            // }
            //
            // createSpringBootProject
            //
            // {
            //     "controller": "createSpringBootProject",
            //     "description": "create Spring Boot project folder from template and switchyardProjectInfo to targetPath",
            //     "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo.JSON",
            //     "springBootTemplateFolder": "D:/auto-file-editor/data/springboot_project_template",
            //     "targetPath": "D:/auto-file-editor/logs/centralizedb",
            //     "projectNameUppercase": "CentralizeDB"
            // }
            // {
            //     "controller": "createSpringBootProject",
            //     "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo_alarmGateway.JSON",
            //     "springBootTemplateFolder": "D:/auto-file-editor/data/springboot_project_template",
            //     // "targetPath": "D:/myNetworkAppSpringBoot/alarmgateway",
            //     "targetPath": "D:/auto-file-editor/logs/alarmgateway",
            //     "projectNameUppercase": "alarmGateway"
            // }
            //
            //  createSpringBootRESTController
            //
            // {
            //     "controller": "createSpringBootRESTController",
            //     "switchyardInterfaceDeclarationFile": "D:/myNetworkAppSpringBoot/alarmgateway/src/main/java/th/co/ais/mynetwork/alarmgateway/ListServiceRestResource.java",
            //     "switchyardInterfaceImplementationFile": "D:/myNetworkAppSpringBoot/alarmgateway/src/main/java/th/co/ais/mynetwork/alarmgateway/ListServiceInterfaceBean.java",
            //     "outputFile": "D:/myNetworkAppSpringBoot/alarmgateway/src/main/java/th/co/ais/mynetwork/alarmgateway/controller/alarmGatewayController.java"
            // }
            //
            // createRequestExample
            //
            // {
            //     "controller": "createRequestExample",
            //     "description": "generate request examples from the target switchyard project",
            //     "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo.JSON",
            //     "targetRestResourceFile": "D:/myNetworkAppSwitchYard/centralizedb/src/main/java/th/co/ais/mynetwork/centralizedb/ListServiceRestResource.java",
            //     "outputFile": "D:/auto-file-editor/logs/ListServiceRestResourceRequests.JSON",
            // }
            {
                "controller": "createRequestExample",
                "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo_alarmGateway.JSON",
                "targetRestResourceFile": "D:/myNetworkAppSwitchYard/alarmgateway/src/main/java/th/co/ais/mynetwork/alarmgateway/ListServiceRestResource.java",
                "outputFile": "D:/auto-file-editor/logs/ListServiceRestResourceRequests_alarmGateway.JSON",
            }
        ]
    }

}
