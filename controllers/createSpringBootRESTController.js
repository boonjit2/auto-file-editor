const file = require('./file');
const log = require('./log');
const stringify = require('json-stringify-safe');
const path = require('path');
const string = require('./stringu');
const switchyard = require('./switchyard');

let logLine = '';

// old function : to be removed
function _createSwitchyardDeclarationInfoList(declarationTexts) {
    let switchyardDeclarationInfoList = [];

    // clear
    logLine = '';

    // iterate declarationTexts
    for (let index = 0; index < declarationTexts.length; index++) {
        let switchyardDeclarationInfo = {};
        // start at @httpMethod
        if (declarationTexts[index].match(/(@POST|@GET)/gm)) {

            // httpMethod
            if (declarationTexts[index].match(/(@GET)/gm)) {
                switchyardDeclarationInfo.httpMethod = 'Get';
            } else if (declarationTexts[index].match(/(@POST)/gm)) {
                switchyardDeclarationInfo.httpMethod = 'Post';
            }

            // path
            // log.out(`declarationTexts[index + 1] = ${declarationTexts[index + 1]}`);
            if (declarationTexts[index + 1].match(/(@Path)/gm)) {

                // extract path
                // from: "\t@Path(\"changeStatusEDSAutoBurstSpeed\")",
                // to: \"changeStatusEDSAutoBurstSpeed\"
                let matches = declarationTexts[index + 1].match(/\".*\"/gm);
                if (matches) {
                    let text3 = string.replaceall('\"', '', matches[0]);

                    // if the text begins with / (ex: "/xxx")
                    if (text3.match(/^\//gm)) {
                        // do nothing
                    } else {
                        // insert / at the beginning
                        text3 = `/${text3}`;
                    }

                    switchyardDeclarationInfo.path = text3;
                }
            }

            // log.out(`declarationTexts[index + 3] = ${declarationTexts[index + 3]}`);
            let matches = declarationTexts[index + 3].match(/public.*\)/gm);
            if (matches) {
                switchyardDeclarationInfo.methodHeader = matches[0];

                // parse method header data
                let tokens = string.tokenize(switchyardDeclarationInfo.methodHeader, /[\(\) ;]+/gm, null);

                // add to log
                // tokens.forEach(element => {
                //     logLine += `${element} `;
                // });
                // logLine += `\n`;

                if (tokens.length === 5) {
                    // example header format (5 positions):
                    // public ResponseData getMenuByTransporter (ReqGetMenuUser request)
                    switchyardDeclarationInfo.requestVariableName = tokens[4];
                    switchyardDeclarationInfo.requestClassName = tokens[3];
                    switchyardDeclarationInfo.methodName = tokens[2];

                    logLine += `${switchyardDeclarationInfo.methodName}(${switchyardDeclarationInfo.requestClassName} ${switchyardDeclarationInfo.requestVariableName})\n`;
                } else if (tokens.length === 3) {
                    // 3 positions: public ResponseData getBloodType()
                    switchyardDeclarationInfo.requestVariableName = null;
                    switchyardDeclarationInfo.requestClassName = null;
                    switchyardDeclarationInfo.methodName = tokens[2];

                    logLine += `${switchyardDeclarationInfo.methodName}()\n`;
                } else {
                    throw new Error(`Unable to parse method header data of string=${switchyardDeclarationInfo.methodHeader}`);
                    // switchyardDeclarationInfo.requestVariableName = null;
                    // switchyardDeclarationInfo.requestClassName = null;
                    // switchyardDeclarationInfo.methodName = null;
                }

            }


            // save to result array
            switchyardDeclarationInfoList.push(switchyardDeclarationInfo);
        }

    }


    return switchyardDeclarationInfoList;
}



module.exports = function (switchyardInterfaceDeclarationFile, switchyardInterfaceImplementationFile, outputFile) {

    // calculate controller name
    //          xxxController.java
    let subs = path.basename(outputFile).split(/[Cc]ontroller\.java/gm);
    //          ["xxx" ,"Controller.java"]
    let controllerNameUpperCase = subs[0];


    let controllerNameLowerCase = controllerNameUpperCase.toLowerCase();


    let text = '';
    text += `package th.co.ais.mynetwork.${controllerNameLowerCase}.controller;\n`;
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
        serviceInfo.methodInfo.implementLines[0] = `\t${string.arrayToString(serviceInfo.methodInfo.modifiers)} ${serviceInfo.methodInfo.returnType} ${serviceInfo.methodInfo.methodName}(@RequestBody ${string.parameterNameTypeToString(serviceInfo.methodInfo.parameters)}) {\r`;

    }

    // log.out(`switchyardServiceInfoList=${stringify(switchyardServiceInfoList, null, 2)}`);

    // add each .implementLines to text
    for (let serviceInfo of switchyardServiceInfoList) {
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