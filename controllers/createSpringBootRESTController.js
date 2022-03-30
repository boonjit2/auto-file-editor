const file = require('./file');
const log = require('./log');
const stringify = require('json-stringify-safe');
const path = require('path');
const string = require('./string');

module.exports = function (switchyardInterfaceDeclarationFile, switchyardInterfaceImplementationFile, targetPath) {

    // calculate controller name
    //          xxxController.java
    let subs = path.basename(targetPath).split(/[Cc]ontroller\.java/gm);
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
    // remove line break to make match() works
    // implementationText = string.replaceall('\n', '[:)newline(:]', implementationText);

    // Create Array containing each line of implementationText
    let implementationTexts = string.tokenize(implementationText, /\n/gm);

    // log.out(`implementationTexts=${stringify(implementationTexts, null, 2)}`);



    for (let method of methodList) {
        methodCount++;

        // prepare method header , remove ;
        let tokens = string.tokenize(method, ';');
        // method = "public methodName(xxx request)"
        method = tokens[0];
        method = string.replaceall('(', '\\(', method);
        method = string.replaceall(')', '\\)', method);

        // create method search pattern
        pattern = new RegExp(`${method}[ ]+{`, "gm");
        log.out(`pattern=${pattern}`);

        // find matching method declaration
        let extractedMethodLines = string.extractJavaMethod(implementationTexts, pattern, 100000);
        log.out(`extractedMethodLines=${stringify(extractedMethodLines, null, 2)}`);


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
    file.write(targetPath, text);

    log.out(`methodCount=${methodCount}`);
    return `controllers.createSpringBootRESTController.js: created REST controller at: ${targetPath}\n methodCount=${methodCount}`;

}