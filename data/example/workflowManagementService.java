package th.co.ais.mynetwork.planning.pre_pr.model.reference.workflow;

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
public class WorkflowManagementService {
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
				.baseUrl("http://"+Utility.getSystemProperties("mynetwork.global.host.ip")+":"+Utility.getSystemProperties("mynetwork.global.host.port")+"/mynetwork/workflow/management")
		        .clientConnector(connector)
		        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
		        .build();
	}
 
	public WorkFlowListResponse getWorkFlowList() {
		Mono<WorkFlowListResponse> result;
		result = webClient.post()
		.uri("/getWorkFlowList")
		.retrieve()
		.bodyToMono(WorkFlowListResponse.class);
		
		return result.block();
	}
 
	public NextStepListResponse getNextStepList(NextStepListRequest request) {
		Mono<NextStepListResponse> result;
		result = webClient.post()
		.uri("/getNextStepList")
		.body(Mono.just(request), NextStepListRequest.class)
		.retrieve()
		.bodyToMono(NextStepListResponse.class);
		
		return result.block();
	}
 
	public WorkFlowStepResponse getWorkFlowStepById(WorkFlowStepRequest request) {
		Mono<WorkFlowStepResponse> result;
		result = webClient.post()
		.uri("/getWorkFlowStep")
		.body(Mono.just(request), WorkFlowStepRequest.class)
		.retrieve()
		.bodyToMono(WorkFlowStepResponse.class);
		
		return result.block();
	}

	public WorkFlowStepResponse getWorkFlowStepByIds(WorkFlowStepByIdsRequest request) {
		Mono<WorkFlowStepResponse> result;
		result = webClient.post()
		.uri("/getWorkFlowStepByIds")
		.body(Mono.just(request), WorkFlowStepByIdsRequest.class)
		.retrieve()
		.bodyToMono(WorkFlowStepResponse.class);
		
		return result.block();
	}

	public SubmitNextStepResponse submitNextStep(SubmitNextStepRequest request) {
		Mono<SubmitNextStepResponse> result;
		result = webClient.post()
		.uri("/submitNextStep")
		.body(Mono.just(request), SubmitNextStepRequest.class)
		.retrieve()
		.bodyToMono(SubmitNextStepResponse.class);
		
		return result.block();
	}

	public SubmitNextStepByIdsResponse submitNextStepByIds(SubmitNextStepByIdsRequest request) {
		Mono<SubmitNextStepByIdsResponse> result;
		result = webClient.post()
		.uri("/submitNextStepByIds")
		.body(Mono.just(request), SubmitNextStepByIdsRequest.class)
		.retrieve()
		.bodyToMono(SubmitNextStepByIdsResponse.class);
		
		return result.block();
	}

	public UnlockDocumentResponse unlockDocument(UnlockDocumentRequest request) {
		Mono<UnlockDocumentResponse> result;
		result = webClient.post()
		.uri("/unlockDocument")
		.body(Mono.just(request), UnlockDocumentRequest.class)
		.retrieve()
		.bodyToMono(UnlockDocumentResponse.class);
		
		return result.block();
	}

	public AccessDocumentResponse accessDocument(AccessDocumentRequest request) {
		Mono<AccessDocumentResponse> result;
		result = webClient.post()
		.uri("/accessDocument")
		.body(Mono.just(request), AccessDocumentRequest.class)
		.retrieve()
		.bodyToMono(AccessDocumentResponse.class);
		
		return result.block();
	}

	public GetToDoResponse getToDoList(GetToDoRequest request) {
		Mono<GetToDoResponse> result;
		result = webClient.post()
		.uri("/getToDo")
		.body(Mono.just(request), GetToDoRequest.class)
		.retrieve()
		.bodyToMono(GetToDoResponse.class);
		
		return result.block();
	}
	
	public WorkFlowSendMailResponse sendMail(WorkFlowSendMailRequest request) {
		Mono<WorkFlowSendMailResponse> result;
		result = webClient.post()
		.uri("/sendMail")
		.body(Mono.just(request), WorkFlowSendMailRequest.class)
		.retrieve()
		.bodyToMono(WorkFlowSendMailResponse.class);
		
		return result.block();
	}

	public GetWorkflowTransactionResponse getWorkflowTransaction(GetWorkflowTransactionRequest request) {
		Mono<GetWorkflowTransactionResponse> result;
		result = webClient.post()
		.uri("/getWorkflowTransaction")
		.body(Mono.just(request), GetWorkflowTransactionRequest.class)
		.retrieve()
		.bodyToMono(GetWorkflowTransactionResponse.class);
		
		return result.block();
	}
}
