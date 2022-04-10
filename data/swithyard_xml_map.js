// example mappings made by hand from data\example\switchyardXmlFileInfo_pre_pr.JSON

let mapExample =
{
  "elements": [
    {
      "name": "sy:switchyard",
      "elements": [
        {
          "name": "sca:composite",
          "elements": [
            {
              "name": "sca:component",
              "elements": [
                {
                  "name": "bean:implementation.bean"
                },
                {
                  "name": "sca:service",
                  "attributes": {
                    "name": "PrePRService"  // main service name
                  },
                  "elements": [
                    {
                      "type": "element",
                      "name": "sca:interface.java",
                      "attributes": {
                        "interface": "th.co.ais.mynetwork.planning.pre_pr.PrePRInterface"
                      }
                    }
                  ]
                },
                {
                  "type": "element",
                  "name": "sca:reference", // this is reference
                  "attributes": {
                    "name": "WorkflowManagementService" // reference name
                  },
                  "elements": [
                    {
                      "type": "element",
                      "name": "sca:interface.java",
                      "attributes": {
                        "interface": "th.co.ais.mynetwork.planning.pre_pr.model.reference.workflow.WorkflowManagementService" // interface path ?
                      }
                    }
                  ]
                } // reference
              ] // sca:component
            },
            {
              "type": "element",
              "name": "sca:service",
              "attributes": {
                "name": "PrePRService",  // main service name
                "promote": "PrePRRoute/PrePRService"
              },
              "elements": [
                {
                  "type": "element",
                  "name": "sca:interface.java",
                  "attributes": {
                    "interface": "th.co.ais.mynetwork.planning.pre_pr.PrePRInterface" // interface root path ?
                  }
                },
                {
                  "type": "element",
                  "name": "resteasy:binding.rest", // bind ?
                  "attributes": {
                    "name": "PrePRRestGW"
                  },
                  "elements": [
                    {
                      "type": "element",
                      "name": "resteasy:interfaces",
                      "elements": [
                        {
                          "type": "text",
                          "text": "th.co.ais.mynetwork.planning.pre_pr.PrePRRestResource" // main interface name ?
                        }
                      ]
                    },
                    {
                      "type": "element",
                      "name": "resteasy:contextPath", // contextPath key
                      "elements": [
                        {
                          "type": "text",
                          "text": "mynetwork/planning/pre-pr" // contextPath value
                        }
                      ]
                    }

                  ]
                }
              ] // sca:service elements
            },
            {
              "type": "element",
              "name": "sca:reference",
              "attributes": {
                "name": "WorkflowManagementService", // reference name
              },
              "elements": [
                {
                  "type": "element",
                  "name": "sca:interface.java",
                  "attributes": {
                    "interface": "th.co.ais.mynetwork.planning.pre_pr.model.reference.workflow.WorkflowManagementService"
                  }
                },
                {
                  "type": "element",
                  "name": "resteasy:binding.rest",
                  "attributes": {
                    "name": "WorkflowManagementServiceRestGW"
                  },
                  "elements": [
                    {
                      "type": "element",
                      "name": "resteasy:interfaces",
                      "elements": [
                        {
                          "type": "text",
                          "text": "th.co.ais.mynetwork.planning.pre_pr.model.reference.workflow.WorkflowManagementService" // service package name
                        }
                      ] // resteasy:interfaces elements
                    },
                    {
                      "type": "element",
                      "name": "resteasy:address",
                      "elements": [
                        {
                          "type": "text",
                          "text": "http://${mynetwork.global.host.ip}:${mynetwork.global.host.port}/mynetwork/workflow/management" // external service call address
                        }
                      ] // resteasy:address elements
                    },
                  ] //resteasy:binding.rest elements
                }
              ] //sca:reference elements
            }
          ] // sca:composite elements
        }
      ] // "sy:switchyard" elements

    }

  ] // main
}