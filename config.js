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
                "description": "create Spring Boot project folder from template and switchyardProjectInfo to targetPath",
                "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo.JSON",
                "springBootTemplateFolder": "D:/auto-file-editor/data/springboot_project_template",
                "targetPath": "D:/auto-file-editor/logs/centralizedb",
                "projectNameUppercase": "CentralizeDB"
            },
            {
                "controller": "createSpringBootRESTController",
                "description": "create Spring Boot REST controller using data from Switchyard controller files, also list its services into logs",
                "switchyardInterfaceDeclarationFile": "D:/myNetworkAppSpringBoot/alarmgateway/src/main/java/th/co/ais/mynetwork/alarmgateway/ListServiceRestResource.java",
                "switchyardInterfaceImplementationFile": "D:/myNetworkAppSpringBoot/alarmgateway/src/main/java/th/co/ais/mynetwork/alarmgateway/ListServiceInterfaceBean.java",
                "outputFile": "D:/myNetworkAppSpringBoot/alarmgateway/src/main/java/th/co/ais/mynetwork/alarmgateway/controller/alarmGatewayController.java"
            },
            {
                "controller": "createSpringBootExternalService",
                "description": "convert Switchyard external service to Spring Boot services",
                "switchyardXmlInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo.JSON",
                "targetPath": "D:/myNetworkAppSpringBoot/centralizedb",
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
            //     "outputFile": "D:/auto-file-editor/logs/switchyardProjectInfo_centralizedb.JSON",
            //     "outputFileSwitchyardXmlFileInfo": "D:/auto-file-editor/logs/switchyardXmlFileInfo_centralizedb.JSON"
            // }
            // {
            //     "controller": "inspectTargetSwitchyardProject",
            //     "targetPath": "D:/myNetworkAppSwitchYard/alarmGateway",
            //     "outputFile": "D:/auto-file-editor/logs/switchyardProjectInfo_alarmGateway.JSON"
            // }
            // {
            //     "controller": "inspectTargetSwitchyardProject",
            //     "targetPath": "D:/myNetworkAppSwitchYard/certificate",
            //     "outputFile": "D:/auto-file-editor/logs/switchyardProjectInfo_certificate.JSON",
            //     "outputFileSwitchyardXmlFileInfo": "D:/auto-file-editor/logs/switchyardXmlFileInfo_certificate.JSON"
            // }
            // {
            //     "controller": "inspectTargetSwitchyardProject",
            //     "targetPath": "D:/myNetworkAppSwitchYard/planning/pre-pr",
            //     "outputFile": "D:/auto-file-editor/logs/switchyardProjectInfo_pre_pr.JSON",
            //     "outputFileSwitchyardXmlFileInfo": "D:/auto-file-editor/logs/switchyardXmlFileInfo_pre_pr.JSON"
            // }
            //
            // createSpringBootProject
            //
            // {
            //     "controller": "createSpringBootProject",
            //     "description": "create Spring Boot project folder from template and switchyardProjectInfo to targetPath",
            //     "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo_centralizedb.JSON",
            //     "springBootTemplateFolder": "D:/auto-file-editor/data/springboot_project_template",
            //     "targetPath": "D:/myNetworkAppSpringBoot/centralizedb",
            //     "projectNameUppercase": "CentralizeDB"
            // }
            // {
            //     "controller": "createSpringBootProject",
            //     "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo_alarmGateway.JSON",
            //     "springBootTemplateFolder": "D:/auto-file-editor/data/springboot_project_template",
            //     "targetPath": "D:/myNetworkAppSpringBoot/alarmgateway",
            //     // "targetPath": "D:/auto-file-editor/logs/alarmgateway",
            //     "projectNameUppercase": "alarmGateway"
            // }
            // {
            //     "controller": "createSpringBootProject",
            //     "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo_certificate.JSON",
            //     "springBootTemplateFolder": "D:/auto-file-editor/data/springboot_project_template",
            //     "targetPath": "D:/myNetworkAppSpringBoot/certificate",
            //     "projectNameUppercase": "Certificate"
            // }
            //
            //  createSpringBootRESTController
            // {
            //     "controller": "createSpringBootRESTController",
            //     "switchyardInterfaceDeclarationFile": "D:/myNetworkAppSwitchYard/centralizedb/src/main/java/th/co/ais/mynetwork/centralizedb/ListServiceRestResource.java",
            //     "switchyardInterfaceImplementationFile": "D:/myNetworkAppSwitchYard/centralizedb/src/main/java/th/co/ais/mynetwork/centralizedb/ListServiceInterfaceBean.java",
            //     "outputFile": "D:/myNetworkAppSpringBoot/centralizedb/src/main/java/th/co/ais/mynetwork/centralizedb/controller/CentralizeDBController.java"
            // }
            // {
            //     "controller": "createSpringBootRESTController",
            //     "switchyardInterfaceDeclarationFile": "D:/myNetworkAppSpringBoot/alarmgateway/src/main/java/th/co/ais/mynetwork/alarmgateway/ListServiceRestResource.java",
            //     "switchyardInterfaceImplementationFile": "D:/myNetworkAppSpringBoot/alarmgateway/src/main/java/th/co/ais/mynetwork/alarmgateway/ListServiceInterfaceBean.java",
            //     "outputFile": "D:/myNetworkAppSpringBoot/alarmgateway/src/main/java/th/co/ais/mynetwork/alarmgateway/controller/alarmGatewayController.java"
            // }
            // {
            //     "controller": "createSpringBootRESTController",
            //     "switchyardInterfaceDeclarationFile": "D:/myNetworkAppSpringBoot/certificate/src/main/java/th/co/ais/mynetwork/certificate/ListServiceRestResource.java",
            //     "switchyardInterfaceImplementationFile": "D:/myNetworkAppSpringBoot/certificate/src/main/java/th/co/ais/mynetwork/certificate/ListServiceInterfaceBean.java",
            //     "outputFile": "D:/myNetworkAppSpringBoot/certificate/src/main/java/th/co/ais/mynetwork/certificate/controller/CertificateController.java",
            // }
            //
            // createSpringBootExternalService
            {
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
            //     "targetRestResourceFile": "D:/myNetworkAppSwitchYard/centralizedb/src/main/java/th/co/ais/mynetwork/centralizedb/ListServiceRestResource.java",
            //     "outputFile": "D:/auto-file-editor/logs/ListServiceRestResourceRequests_centralizedb.JSON",
            // }
            // {
            //     "controller": "createRequestExample",
            //     "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo_alarmGateway.JSON",
            //     "targetRestResourceFile": "D:/myNetworkAppSwitchYard/alarmgateway/src/main/java/th/co/ais/mynetwork/alarmgateway/ListServiceRestResource.java",
            //     "outputFile": "D:/auto-file-editor/logs/ListServiceRestResourceRequests_alarmGateway.JSON",
            // }
            // {
            //     "controller": "createRequestExample",
            //     "switchyardProjectInfoFile": "D:/auto-file-editor/logs/switchyardProjectInfo_certificate.JSON",
            //     "targetRestResourceFile": "D:/myNetworkAppSwitchYard/certificate/src/main/java/th/co/ais/mynetwork/certificate/ListServiceRestResource.java",
            //     "outputFile": "D:/auto-file-editor/logs/ListServiceRestResourceRequests_certificate.JSON",
            // }
        ]
    }

}
