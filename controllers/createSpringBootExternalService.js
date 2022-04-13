const file = require('./file');
const log = require('./log');
const stringify = require('json-stringify-safe');
const path = require('path');
const string = require('./string');
const { resourceLimits } = require('worker_threads');
const { match } = require('assert');


/**
 * convert: http://${mynetwork.global.host.ip}:${mynetwork.global.host.port}/mynetwork/workflow/management
 * to : /mynetwork/workflow/management
 * 
 */
function _getOnlyTrailingURL(fullUrl) {
    let result = "ATEError: _getOnlyTrailingURL unable to convert address";
    let matches = fullUrl.match(/http:\/\/.*}/gm);
    if (matches) {
        result = fullUrl.replace(/http:\/\/.*}/gm, '');
    }

    return result;
}

/**
 * convert: [
                  {
                    "type": "NextStepListRequest",
                    "name": "request"
                  },
                  {
                    "type": "type2",
                    "name": "name2"
                  },
                  ...

                ]
 * to : "NextStepListRequest request, type2 name2,..."
 * 
 */
function _parameterNameTypeToString(parameters) {
    // let result = "ATEError: _parameterNameTypeToString unable to convert parameters";
    let result = '';
    for (let parameter of parameters) {
        result += `${parameter.type} ${parameter.name},`
    }

    // replace trailing ,
    if (result !== '') {
        result = result.replace(/,$/gm, '');
    }

    return result;
}


// main export
module.exports = function (switchyardXmlInfoFile, targetPath) {
    let switchyardXmlInfo = file.readFileToJson(switchyardXmlInfoFile);
    let targetJavaSourcePath = path.join(targetPath, '/src/main/java/');
    for (let reference of switchyardXmlInfo.processed.references) {

        // only external services
        if (reference.isExternalService) {
            // create target file full path
            let targetJavaSourceFullPath = path.join(
                targetJavaSourcePath,
                reference.projectInfoReference.packagePath,
                reference.projectInfoReference.fileName
            )

            // log.out(`targetJavaSourceFullPath=${targetJavaSourceFullPath}`);

            // create file header
            let filecontent = '';
            let fileHeader = `package ${reference.projectInfoReference.packageName};
import java.time.Duration;
import java.util.concurrent.TimeUnit;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ClientHttpConnector;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;
import th.co.ais.mynetwork.planning.pre_pr.utility.Utility;

@Service  
public class ${reference.projectInfoReference.className} {
    private WebClient webClient = getWebClient();
	public WebClient getWebClient(){
		
		HttpClient httpClient = HttpClient.create()
				  .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 60000)
				  .responseTimeout(Duration.ofMillis(60000))
				  .doOnConnected(conn -> 
				    conn.addHandlerLast(new ReadTimeoutHandler(60000, TimeUnit.MILLISECONDS))
				      .addHandlerLast(new WriteTimeoutHandler(60000, TimeUnit.MILLISECONDS)));
		
		ClientHttpConnector connector = new ReactorClientHttpConnector(httpClient);	    

		return WebClient.builder()
                // ATE: original value: ${reference.address}
				.baseUrl("http://"+Utility.getSystemProperties("mynetwork.global.host.ip")+":"+Utility.getSystemProperties("mynetwork.global.host.port")+"${_getOnlyTrailingURL(reference.address)}")
		        .clientConnector(connector)
		        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
		        .build();
	}
            `
            filecontent += fileHeader;

            // repeating part for each service annotation
            for (let service of reference.interfaceInfo.serviceAnnotationInfoList) {
                let serviceMethod = `
    public ${service.methodInfo.returnType} ${service.methodInfo.methodName}(${_parameterNameTypeToString(service.methodInfo.parameters)}) {
        Mono<${service.methodInfo.returnType}> result;
        result = webClient.${service.httpMethod.toLowerCase()}()
        .uri("${path.posix.join(reference.interfaceInfo.firstPath, service.path)}")
        .retrieve()
        .bodyToMono(${service.methodInfo.returnType}.class);

        return result.block();
    }
`
                filecontent += serviceMethod;

            }

            // TODO: add check/commented text: "ATEError: this method is not producing JSON"


            // add footer
            filecontent += `}`


            // write a cmpleted content to file
            file.write(targetJavaSourceFullPath, filecontent)
            // log.breakpoint();
        }
    }
}