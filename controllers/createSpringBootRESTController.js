const file = require('./file');
const log = require('./log');
const stringify = require('json-stringify-safe');
const path = require('path');
const string = require('./stringu');
const switchyard = require('./switchyard');

let logLine = '';

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

    // prepare method implementation list
    let implementationText = file.readFile(switchyardInterfaceImplementationFile);
    // Create Array containing each line of implementationText
    let implementationTexts = string.tokenize(implementationText, /\n/gm, null);

    // prepare method declaration list
    let declarationText = file.readFile(switchyardInterfaceDeclarationFile);
    // Create Array containing each line of declarationText
    let declarationTexts = string.tokenize(declarationText, /\n/gm, null);
    // log.out(`declarationTexts=${stringify(declarationTexts, null, 2)}`);

    let switchyardDeclarationInfoList = switchyard.getSwithyardServiceAnnotationInfo(declarationTexts);
    log.out(`switchyardDeclarationInfoList=${stringify(switchyardDeclarationInfoList, null, 2)}`);
    log.breakpoint();



    // for (let declarationInfo of switchyardDeclarationInfoList) {

    //     // create pattern strings
    //     let patternString = `${declarationInfo.methodName}[ ]?\\\(`;
    //     if (declarationInfo.requestClassName) {
    //         patternString += `${declarationInfo.requestClassName} .*\\\)[ ]?{`;
    //     } else {
    //         patternString += `.*\\\)[ ]?{`;
    //     }

    //     // create method search pattern
    //     pattern = new RegExp(`${patternString}`, "gm");
    //     // log.out(`pattern=${pattern}`);

    //     // find matching method declaration
    //     let extractedMethodLines = string.extractJavaMethod(implementationTexts, pattern, 100000);
    //     log.out(`extractedMethodLines=${stringify(extractedMethodLines, null, 2)}`);

    //     // insert @RequestBody annotation
    //     //                       V          V
    //     // ex: public methodName(@RequestBody requestClassName variable){

    //     let beforeBrackets = extractedMethodLines[0].match(/.*\(/gm);
    //     // public methodName(
    //     // log.out(`beforeBrackets=${stringify(beforeBrackets, null, 2)}`);

    //     let afterBrackets = extractedMethodLines[0].match(/\(.*/gm);
    //     // (requestClassName variable){
    //     afterBrackets[0] = afterBrackets[0].replace('(', '');
    //     // requestClassName variable){
    //     // log.out(`afterBrackets=${stringify(afterBrackets, null, 2)}`);

    //     // sum it up
    //     extractedMethodLines[0] = `${beforeBrackets}@RequestBody ${afterBrackets}`;
    //     // fix (@RequestBody) to ()
    //     extractedMethodLines[0] = extractedMethodLines[0].replace(/\([ ]*@RequestBody[ ]*\)/, '()');
    //     log.out(`extractedMethodLines[0]=${extractedMethodLines[0]}`);

    //     // throw new Error('Breakpoint');

    //     let httpMethod = declarationInfo.httpMethod;
    //     let MethodPath = declarationInfo.path;
    //     // log.out(`MethodPath=${MethodPath}`);

    //     text += `\t@${httpMethod}Mapping(path = "${MethodPath}", produces = "application/json")\n`;

    //     extractedMethodLines.forEach(element => {
    //         text += `${element}\n`;
    //     });
    //     text += `\n`;

    //     // if (matches) {
    //     //     // reformat text again
    //     //     let text2 = '';
    //     //     text2 = string.replaceall('@Override', '', matches[0]);
    //     //     text2 = string.replaceall('{{newline}}', '\n', text2);

    //     //     text += `${text2}\n`;
    //     // } else {
    //     //     text += `${method} { // Error: ATE can't find this method implementation }\n`;
    //     // }

    // }

    text += `\n}`
    file.write(outputFile, text);
    log.out(`${logLine}`);
    log.out(`declarationInfo.length=${switchyardDeclarationInfoList.length}`);

    return `${logLine}\ncontrollers.createSpringBootRESTController.js: created REST controller at: ${outputFile}\n methodCount=${methodCount}`;

}