module.exports =
{
    "job": {
        "logFile": "D:/auto-file-editor/logs/log.txt",
        "available": [
            {
                "controller": "inspectTargetSwitchyardProject",
                "description": "inspect Switchyard project folder in targetPath, then store data in outputFile",
                "targetPath": "D:/myNetworkAppSwitchYard/centralizedb",
                "outputFile": "D:/auto-file-editor/data/switchyardProjectInfo_centralizedb.JSON",
                "outputFileSwitchyardXmlFileInfo": "D:/auto-file-editor/logs/switchyardXmlFileInfo_centralizedb.JSON"
            },
            {
                "controller": "createSpringBootProject",
                "description": "create Spring Boot project folder from source to destination",
                "source": {
                    "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo_pre_pr.JSON",
                    "springBootTemplateFolder": "D:/auto-file-editor/data/springboot_project_template",
                    "projectName": "pre_pr" // original project name that was specified in "package.*"
                },
                "destination": {
                    "mavenFilesLocationDir": "D:/myNetworkAppSpringBoot/planning/pre_pr",
                    "rootPackageName": "th.co.ais.mynetwork.planning.pre_pr",
                    "projectNameUppercase": "PrePR"
                }
            },
            , { // pre_pr
                // NOTE: recommended name : XxxSpringBootController so it won't overwrite old ones
                "controller": "createSpringBootRESTController",
                "description": "create Spring Boot REST controller using data from Switchyard controller files, also list its services into logs",
                "source": {
                    "interfaceDeclarationFile": "D:/myNetworkAppSwitchYard/planning/pre-pr/src/main/java/th/co/ais/mynetwork/planning/pre_pr/PrePRRestResource.java",
                    "interfaceImplementationFile": "D:/myNetworkAppSwitchYard/planning/pre-pr/src/main/java/th/co/ais/mynetwork/planning/pre_pr/PrePRRoute.java",
                },
                "destination": {
                    "packageName": "th.co.ais.mynetwork.planning.pre_pr.controller",
                    "fullPath": "D:/myNetworkAppSpringBoot/planning/pre_pr/src/main/java/th/co/ais/mynetwork/planning/pre_pr/controller/PrePRSpringBootController.java",
                }
            },
            {
                "controller": "createSpringBootExternalService",
                "description": "convert Switchyard external service to Spring Boot services",
                "switchyardXmlInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo.JSON",
                "targetPath": "D:/myNetworkAppSpringBoot/centralizedb",
            },
            , {
                "controller": "createRequestExample",
                "description": "generate request examples from the target switchyard project",
                "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo_pre_pr.JSON",
                "sourceRestResourceFile": "D:/myNetworkAppSwitchYard/planning/pre-pr/src/main/java/th/co/ais/mynetwork/planning/pre_pr/PrePRRestResource.java",
                "outputFile": "D:/auto-file-editor/logs/ListServiceRestResourceRequests_pre_pr.JSON",
            }

        ],
        "selected": [
            {} // heading
            // inspectTargetSwitchyardProject
            //
            // {
            //     "controller": "inspectTargetSwitchyardProject",
            //     "targetPath": "D:/myNetworkAppSwitchYard/centralizedb",
            //     "outputFile": "D:/auto-file-editor/logs/switchyardProjectInfo_centralizedb.JSON",
            //     "outputFileSwitchyardXmlFileInfo": "D:/auto-file-editor/logs/switchyardXmlFileInfo_centralizedb.JSON"
            // }
            // , {
            //     "controller": "inspectTargetSwitchyardProject",
            //     "targetPath": "D:/myNetworkAppSwitchYard/alarmGateway",
            //     "outputFile": "D:/auto-file-editor/logs/switchyardProjectInfo_alarmGateway.JSON",
            //     "outputFileSwitchyardXmlFileInfo": "D:/auto-file-editor/logs/switchyardXmlFileInfo_alarmGateway.JSON"
            // }
            // {
            //     "controller": "inspectTargetSwitchyardProject",
            //     "targetPath": "D:/myNetworkAppSwitchYard/certificate",
            //     "outputFile": "D:/auto-file-editor/logs/switchyardProjectInfo_certificate.JSON",
            //     "outputFileSwitchyardXmlFileInfo": "D:/auto-file-editor/logs/switchyardXmlFileInfo_certificate.JSON"
            // }
            //
            , { // pre_pr
                "controller": "inspectTargetSwitchyardProject",
                "targetPath": "D:/myNetworkAppSwitchYard/planning/pre-pr",
                "outputFile": "D:/auto-file-editor/logs/switchyardProjectInfo_pre_pr.JSON",
                "outputFileSwitchyardXmlFileInfo": "D:/auto-file-editor/logs/switchyardXmlFileInfo_pre_pr.JSON"
            }
            //
            // createSpringBootProject
            //
            // , { // alarmgateway
            //     "controller": "createSpringBootProject",
            //     "source": {
            //         "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo_alarmGateway.JSON",
            //         "springBootTemplateFolder": "D:/auto-file-editor/data/springboot_project_template",
            //         "projectName": "alarmgateway"
            //     },
            //     "destination": {
            //         "mavenFilesLocationDir": "D:/myNetworkAppSpringBoot/alarmGateway",
            //         "rootPackageName": "th.co.ais.mynetwork.alarmgateway",
            //         "projectNameUppercase": "alarmGateway"
            //     }
            // }
            , { // pre_pr
                "controller": "createSpringBootProject",
                "source": {
                    "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo_pre_pr.JSON",
                    "springBootTemplateFolder": "D:/auto-file-editor/data/springboot_project_template",
                    "projectName": "pre_pr"
                },
                "destination": {
                    "mavenFilesLocationDir": "D:/myNetworkAppSpringBoot/planning/pre_pr",
                    "rootPackageName": "th.co.ais.mynetwork.planning.pre_pr",
                    "projectNameUppercase": "PrePR"
                }
            }
            //
            //  createSpringBootRESTController
            , { // pre_pr
                "controller": "createSpringBootRESTController",
                "source": {
                    "interfaceDeclarationFile": "D:/myNetworkAppSwitchYard/planning/pre-pr/src/main/java/th/co/ais/mynetwork/planning/pre_pr/PrePRRestResource.java",
                    "interfaceImplementationFile": "D:/myNetworkAppSwitchYard/planning/pre-pr/src/main/java/th/co/ais/mynetwork/planning/pre_pr/PrePRRoute.java",
                },
                "destination": {
                    "packageName": "th.co.ais.mynetwork.planning.pre_pr.controller",
                    "fullPath": "D:/myNetworkAppSpringBoot/planning/pre_pr/src/main/java/th/co/ais/mynetwork/planning/pre_pr/controller/PrePRSpringBootController.java",
                }
            }
            //
            // createSpringBootExternalService
            , { // pre_pr
                "controller": "createSpringBootExternalService",
                "switchyardXmlInfoFile": "D:/auto-file-editor/logs/switchyardXmlFileInfo_pre_pr.JSON",
                "targetPath": "D:/myNetworkAppSpringBoot/planning/pre_pr"
            }
            //
            // createRequestExample
            //
            // , {
            //     "controller": "createRequestExample",
            //     "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo_centralizedb.JSON",
            //     "sourceRestResourceFile": "D:/myNetworkAppSwitchYard/centralizedb/src/main/java/th/co/ais/mynetwork/centralizedb/ListServiceRestResource.java",
            //     "outputFile": "D:/auto-file-editor/logs/ListServiceRestResourceRequests_centralizedb.JSON",
            // }
            // {
            //     "controller": "createRequestExample",
            //     "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo_alarmGateway.JSON",
            //     "sourceRestResourceFile": "D:/myNetworkAppSwitchYard/alarmgateway/src/main/java/th/co/ais/mynetwork/alarmgateway/ListServiceRestResource.java",
            //     "outputFile": "D:/auto-file-editor/logs/ListServiceRestResourceRequests_alarmGateway.JSON",
            // }
            // {
            //     "controller": "createRequestExample",
            //     "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo_certificate.JSON",
            //     "sourceRestResourceFile": "D:/myNetworkAppSwitchYard/certificate/src/main/java/th/co/ais/mynetwork/certificate/ListServiceRestResource.java",
            //     "outputFile": "D:/auto-file-editor/logs/ListServiceRestResourceRequests_certificate.JSON",
            // }
            , { // pre_pr
                "controller": "createRequestExample",
                "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo_pre_pr.JSON",
                "sourceRestResourceFile": "D:/myNetworkAppSwitchYard/planning/pre-pr/src/main/java/th/co/ais/mynetwork/planning/pre_pr/PrePRRestResource.java",
                "outputFile": "D:/auto-file-editor/logs/ListServiceRestResourceRequests_pre_pr.JSON",
            }
        ]
    }

}
