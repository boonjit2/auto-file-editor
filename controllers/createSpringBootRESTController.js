const file = require('./file');
const log = require('./log');
const stringify = require('json-stringify-safe');
const path = require('path');
const string = require('./stringu');
const switchyard = require('./switchyard');

let logLine = '';


// return "@RequestBody " if parameters has members
function _addRequestBodyAnnotation(parameters) {
    if (parameters && parameters.length > 0) {
        return '@RequestBody '
    } else {
        return '';
    }

}



module.exports = function (source, destination) {
    //  input example:
    //      "source": {
    //         "interfaceDeclarationFile": "D:/myNetworkAppSwitchYard/planning/pre-pr/src/main/java/th/co/ais/mynetwork/planning/pre_pr/PrePRRestResource.java",
    //         "interfaceImplementationFile": "D:/myNetworkAppSwitchYard/planning/pre-pr/src/main/java/th/co/ais/mynetwork/planning/pre_pr/PrePRRoute.java",
    //     },
    //     "destination": {
    //         "packageName": "th.co.ais.mynetwork.planning.pre_pr.controller",
    //         "fullPath": "D:/myNetworkAppSpringBoot/planning/pre_pr/src/main/java/th/co/ais/mynetwork/planning/pre_pr/controller/PrePRController.java",
    //     }

    //parse
    let switchyardInterfaceDeclarationFile = source.interfaceDeclarationFile;
    let switchyardInterfaceImplementationFile = source.interfaceImplementationFile;
    let outputFile = destination.fullPath;
    let packageName = destination.packageName;

    // calculate controller name
    //          xxxController.java
    let subs = path.basename(outputFile).split(/[Cc]ontroller\.java/gm);
    //          ["xxx" ,"Controller.java"]
    let controllerNameUpperCase = subs[0];

    let text = '';
    text += `package ${packageName};\n`;
    text += `
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;

@RestController
//@RequestMapping(path="/")
public class ${controllerNameUpperCase}Controller {
    //	@Autowired
    //	public alarmGatewayManagementBean bean;
    //	
    //    @PostMapping(path = "/{{MethodPath}}", produces = "application/json")
    //    public {{ResponseClassName}} {{ControllerMethodName}}(@RequestBody {{RequestClassName}} request){ 	
    //		{{ControllerLogic}}
    //        return response;
    //    }
    private static final Logger LOGGER = Logger.getLogger(${controllerNameUpperCase}Controller.class);

    @PostMapping(path = "/hello", produces = "application/json")
    public String hello() {
        // LOGGER.info("hello"+request);
        return "hello";
     }
`

    // Add a constructor codes
    let allLines = file.readFileToArrayOfLines(switchyardInterfaceImplementationFile);
    // log.out(`allLines=${stringify(allLines, null, 2)}`);
    let switchyardInterfaceImplementationClassName = path.basename(switchyardInterfaceImplementationFile, '.java');
    let constructorHeaderPattern = new RegExp(`${switchyardInterfaceImplementationClassName}[ ]*\\(\\)[ ]*{`, "gm");
    // log.out(`constructorHeaderPattern=${constructorHeaderPattern}`);
    let constructorTexts = string.extractJavaMethod(allLines, constructorHeaderPattern, 10000);
    // log.out(`constructorTexts=${stringify(constructorTexts, null, 2)}`);

    // rename a constructor
    if (constructorTexts) {
        constructorTexts[0] = string.replaceall(`${switchyardInterfaceImplementationClassName}`, `${controllerNameUpperCase}Controller`, constructorTexts[0]);
    }

    constructorTexts.forEach(line => {
        text += `${line}\n`;
    });
    text += `\n`;
    // throw new Error('Breakpoint');


    // try to get a list of methods from the declaration
    let methodCount = 0;
    let methodList = file.getAllMatches(switchyardInterfaceDeclarationFile, /public.*\(.*\);/gm);

    // prepare method declaration list
    let declarationText = file.readFile(switchyardInterfaceDeclarationFile);
    // Create Array containing each line of declarationText
    let declarationTexts = string.tokenize(declarationText, /\n/gm, null);
    // log.out(`declarationTexts=${stringify(declarationTexts, null, 2)}`);

    let switchyardServiceInfoList = switchyard.getSwithyardServiceAnnotationInfo(declarationTexts);
    // log.out(`switchyardServiceInfoList=${stringify(switchyardServiceInfoList, null, 2)}`);

    // read from switchyardInterfaceImplementationFile
    let methodImplementationLines = file.readFileToArrayOfLines(switchyardInterfaceImplementationFile);

    // TODO: get import.* lines from methodImplementationLines
    // and insert it into the controller

    // append .implementLines = [...] to each of switchyardServiceInfoList
    for (let serviceInfo of switchyardServiceInfoList) {
        // create header pattern
        let methodHeaderPatternString = '';
        if (serviceInfo.methodInfo.parameters.length === 0) {
            // method with no parameters
            methodHeaderPatternString = `${serviceInfo.methodInfo.returnType}[ ]*${serviceInfo.methodInfo.methodName}[ ]*\\\([ ]*\\\)[ ]*{`;
        } else {
            // method with parameters

            // create parameters pattern string
            let parameterPatternString = '[ ]*';
            for (let member of serviceInfo.methodInfo.parameters) {
                parameterPatternString += `${member.type}[ ]*${member.name}[ ]*`;
            }

            methodHeaderPatternString = `${serviceInfo.methodInfo.returnType}[ ]*${serviceInfo.methodInfo.methodName}[ ]*\\\(${parameterPatternString}\\\)[ ]*{`;
        }

        let methodHeaderPattern = new RegExp(methodHeaderPatternString, "gm");

        serviceInfo.methodInfo.implementLines = string.extractJavaMethod(methodImplementationLines, methodHeaderPattern, 100000);

        // remake heading line
        serviceInfo.methodInfo.implementLines[0] = `\t${string.arrayToString(serviceInfo.methodInfo.modifiers)} ${serviceInfo.methodInfo.returnType} ${serviceInfo.methodInfo.methodName}(${_addRequestBodyAnnotation(serviceInfo.methodInfo.parameters)}${string.parameterNameTypeToString(serviceInfo.methodInfo.parameters)}) {\r`;

    }

    // log.out(`switchyardServiceInfoList=${stringify(switchyardServiceInfoList, null, 2)}`);

    // add each .implementLines to text

    for (let serviceInfo of switchyardServiceInfoList) {
        // method header
        text += `\n`
        for (let line of serviceInfo.methodInfo.implementLines) {
            text += `${line}\n`;
        }


    }



    // class footer
    text += `\n}`


    file.write(outputFile, text);

    log.out(`${logLine}`);
    log.out(`switchyardServiceInfoList.length=${switchyardServiceInfoList.length}`);

    return `${logLine}\ncontrollers.createSpringBootRESTController.js: created REST controller at: ${outputFile}\n methodCount=${methodCount}`;

}