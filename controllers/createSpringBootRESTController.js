const file = require('./file');
const log = require('./log');
const stringify = require('json-stringify-safe');
const path = require('path');
const string = require('./string');


let logLine = '';

// from:
//
// [
// "\t",
// "\t@POST",
// "\t@Path(\"searchAutoBurstSpeedHistory\")",
// "\t@Produces({\"application/json\"})",
// "\tpublic CommonResponse searchAutoBurstSpeedHistory(ReqOrderHistoryModel request);",
// "\t",
// "\t@POST",
// "\t@Path(\"getDefaultDropDown\")",
// "\t@Produces({\"application/json\"})",
// "\tpublic CommonResponse getDefaultDropDown();",
// "}"
// ]
//
// to:
// [
//  {
//     httpMethod: "POST",
//     path: "getDefaultDropDown",
//     methodHeader: "public CommonResponse getDefaultDropDown()"
//  },
//  {...}
// ]
//
//
//
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
                    text3 = `/${text3}`;
                    switchyardDeclarationInfo.path = text3;
                }
            }

            // log.out(`declarationTexts[index + 3] = ${declarationTexts[index + 3]}`);
            let matches = declarationTexts[index + 3].match(/public.*\)/gm);
            if (matches) {
                switchyardDeclarationInfo.methodHeader = matches[0];

                // parse method header data
                let tokens = string.tokenize(switchyardDeclarationInfo.methodHeader, /[\(\) ;]+/gm);

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
@Slf4j
public class ${controllerNameUpperCase}Controller {
    //	@Autowired
    //	public alarmGatewayManagementBean bean;
    //	
    //    @PostMapping(path = "/{{MethodPath}}", produces = "application/json")
    //    public {{ResponseClassName}} {{ControllerMethodName}}(@RequestBody {{RequestClassName}} request){ 	
    //		{{ControllerLogic}}
    //        return response;
    //    }
      
`

    // try to get a list of methods from the declaration
    let methodCount = 0;
    let methodList = file.getAllMatches(switchyardInterfaceDeclarationFile, /public.*\(.*\);/gm);

    // prepare method implementation list
    let implementationText = file.readFile(switchyardInterfaceImplementationFile);
    // Create Array containing each line of implementationText
    let implementationTexts = string.tokenize(implementationText, /\n/gm);

    // prepare method declaration list
    let declarationText = file.readFile(switchyardInterfaceDeclarationFile);
    // Create Array containing each line of declarationText
    let declarationTexts = string.tokenize(declarationText, /\n/gm);

    // log.out(`declarationTexts=${stringify(declarationTexts, null, 2)}`);
    let switchyardDeclarationInfoList = _createSwitchyardDeclarationInfoList(declarationTexts);
    // log.out(`switchyardDeclarationInfoList=${stringify(switchyardDeclarationInfoList, null, 2)}`);


    for (let declarationInfo of switchyardDeclarationInfoList) {

        // create pattern strings
        let patternString = `${declarationInfo.methodName}[ ]?\\\(`;
        if (declarationInfo.requestClassName) {
            patternString += `${declarationInfo.requestClassName} .*\\\)[ ]?{`;
        } else {
            patternString += `.*\\\)[ ]?{`;
        }

        // create method search pattern
        pattern = new RegExp(`${patternString}`, "gm");
        // log.out(`pattern=${pattern}`);

        // find matching method declaration
        let extractedMethodLines = string.extractJavaMethod(implementationTexts, pattern, 100000);
        // log.out(`extractedMethodLines=${stringify(extractedMethodLines, null, 2)}`);

        // throw new Error('Breakpoint');

        let httpMethod = declarationInfo.httpMethod;
        let MethodPath = declarationInfo.path;

        text += `\t@${httpMethod}Mapping(path = "${MethodPath}", produces = "application/json")\n`;
        extractedMethodLines.forEach(element => {
            text += `${element}\n`;
        });
        text += `\n`;

        // if (matches) {
        //     // reformat text again
        //     let text2 = '';
        //     text2 = string.replaceall('@Override', '', matches[0]);
        //     text2 = string.replaceall('{{newline}}', '\n', text2);

        //     text += `${text2}\n`;
        // } else {
        //     text += `${method} { // Error: ATE can't find this method implementation }\n`;
        // }

    }

    text += `\n}`
    file.write(outputFile, text);
    log.out(`${logLine}`);
    log.out(`declarationInfo.length=${switchyardDeclarationInfoList.length}`);

    return `${logLine}\ncontrollers.createSpringBootRESTController.js: created REST controller at: ${outputFile}\n methodCount=${methodCount}`;

}