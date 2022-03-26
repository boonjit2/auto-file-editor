package th.co.ais.mynetwork.{{project_name}}.controller;

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
public class PrePRController {
	
//	@Value("${mynewtork.test}")
//	public String testValue;
	
	@Autowired
	public PrePRManagementBean bean;
	
//	private static final Logger LOGGER = Logger.getLogger(PrePRController.class);

    @PostMapping(path = "/getGroupAmountByWbs", produces = "application/json")
    public GroupAmountByWbsResponse getGroupAmountByWbs(@RequestBody GroupAmountByWbsRequest request){
    	
    	TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
    	
        GroupAmountByWbsResponse response = new GroupAmountByWbsResponse();
        response.setResultList(new ArrayList<GroupAmountByWbsModel>());
        try {
        	response = bean.getGroupAmountByWbs(request);
        } catch (ExceptionHandle e) {
            response.setError(e.getErrorType());
        } catch (Exception e) {
            ErrorType error = new ErrorType();
            error.setCode("500");
            error.setMessage(ExceptionHandle.findRootCause(e));
            response.setError(error);
        }

        log.info(logger.end(response));
        return response;
    }
    
    @PostMapping(path = "/getPOByDate", produces = "application/json")
    public GetPOResponse getPOByDate(@RequestBody GetPORequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		GetPOResponse response = new GetPOResponse();
		try {

			response = bean.GetPOByDate(request);

		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
    
    @PostMapping(path = "/cancelPrePR", produces = "application/json")
    public CancelPrePRResponse cancelPrePR(@RequestBody CancelPrePRRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		CancelPrePRResponse response = new CancelPrePRResponse();
		try {

			response = bean.cancelPrePR(request);

		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
    
    @GetMapping(path ="/hello")
    public String hello() {
    	
    	return "hello jboss";
    }
    
    
    
    @PostMapping(path ="/getProjectNameByCriteria", produces = "application/json")
    public GetProjectNameByCriteriaResponse getProjectNameByCriteria(@RequestBody GetProjectNameByCriteriaRequest request) {
    	TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		GetProjectNameByCriteriaResponse response = new GetProjectNameByCriteriaResponse();
		try {
			response = bean.getProjectNameByCriteria(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
    }
    
    @PostMapping(path ="/getProjectNameOpexByCriteria", produces = "application/json")
	public GetProjectNameByCriteriaResponse getProjectNameOpexByCriteria(@RequestBody GetProjectNameByCriteriaRequest request) {
    	TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		GetProjectNameByCriteriaResponse response = new GetProjectNameByCriteriaResponse();

		try {
			
			response = bean.getProjectNameOpexByCriteria(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
    }
    
	@PostMapping(path ="/getPurchaser", produces = "application/json")
	public GetPurchaserResponse getPurchaser(@RequestBody GetPurchaserRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		GetPurchaserResponse response = new GetPurchaserResponse();

		try {
			response = bean.getPurchaser(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/getPurchasing", produces = "application/json")
	public GetPurchasingResponse getPurchasing(@RequestBody GetPurchasingRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		GetPurchasingResponse response = new GetPurchasingResponse();

		try {
			response = bean.getPurchasing(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/getSKU", produces = "application/json")
	public GetSKUResponse getSKU(@RequestBody GetSKURequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		GetSKUResponse response = new GetSKUResponse();

		try {
			response = bean.getSKU(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));

		return response;
	}
	
	@PostMapping(path ="/getTodolistByBatch", produces = "application/json")
	public GetTodolistByBatchResponse getTodolistByBatch(@RequestBody GetTodolistByBatchRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), null);
		GetTodolistByBatchResponse response = new GetTodolistByBatchResponse();

		try {
			response = bean.getTodolistByBatch(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));

		return response;
	}
	
	@PostMapping(path ="/getTodoListMultiTransfer", produces = "application/json")
	public GetTodoListMultiTransferResponse getTodoListMultiTransfer(@RequestBody GetTodoListMultiTransferRequest request) {
		
			TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
			GetTodoListMultiTransferResponse response = new GetTodoListMultiTransferResponse();

			try {
				response = bean.getTodoListMultiTransfer(request);
			} catch (ExceptionHandle e) {
				response.setError(e.getErrorType());
			} catch (Exception e) {
				ErrorType error = new ErrorType();
				error.setCode("500");
				error.setMessage(ExceptionHandle.findRootCause(e));
				response.setError(error);
			}

			log.info(logger.end(response));
			return response;
		
	}
	
	@GetMapping(path ="/version", produces = "application/json")
	public String getVersion() {
		InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream("mock/version.json");
		InputStreamReader inputStreamReader = new InputStreamReader(inputStream);
		BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

		return new Gson().toJson(new Gson().fromJson(bufferedReader, ProjectDescription.class));
	}
	
	@PostMapping(path ="/getViewMultiPreprDoc", produces = "application/json")
	public ViewMultiPreprDocResponse getViewMultiPreprDoc(@RequestBody ViewMultiPreprDocRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		ViewMultiPreprDocResponse response = new ViewMultiPreprDocResponse();

		try {
			response = bean.getViewMultiPreprDoc(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/getPrePR", produces = "application/json")
	public GetPrePRResponse getPrePR(@RequestBody GetPrePRRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		GetPrePRResponse response = new GetPrePRResponse();

		try {
			response = bean.getPrePR(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));

		return response;
	}
	
	@PostMapping(path ="/getPrePRHeaderTPT", produces = "application/json")
	public GetPrePRHeaderTPTResponse getPrePRHeaderTPT(@RequestBody GetPrePRHeaderTPTRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		GetPrePRHeaderTPTResponse response = new GetPrePRHeaderTPTResponse();

		try {
			response = bean.getPrePRHeaderTPT(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/validateUpdatePrPoByBudgetType", produces = "application/json")
	public ValidateUpdatePrPoByBudgetTypeResponse validateUpdatePrPoByBudgetType(@RequestBody ValidateUpdatePrPoByBudgetTypeRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		ValidateUpdatePrPoByBudgetTypeResponse response = new ValidateUpdatePrPoByBudgetTypeResponse();

		try {
			response = bean.validateUpdatePrPoByBudgetType(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/validateImportAddEditPurchaser", produces = "application/json")
	public ValidateImportAddEditPurchaserResponse validateImportAddEditPurchaser(@RequestBody ValidateImportAddEditPurchaserRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		ValidateImportAddEditPurchaserResponse response = new ValidateImportAddEditPurchaserResponse();

		try {
			response = bean.validateImportAddEditPurchaser(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/validateImportAddEditCurrencyExchangeRate", produces = "application/json")
	public ValidateImportAddEditCurrencyExchangeRateResponse validateImportAddEditCurrencyExchangeRate(@RequestBody ValidateImportAddEditCurrencyExchangeRateRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		ValidateImportAddEditCurrencyExchangeRateResponse response = new ValidateImportAddEditCurrencyExchangeRateResponse();

		try {
			response = bean.validateImportAddEditCurrencyExchangeRate(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/validateAssetSKU", produces = "application/json")
	public ValidateAssetSKUResponse validateAssetSKU(@RequestBody ValidateAssetSKURequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		ValidateAssetSKUResponse response = new ValidateAssetSKUResponse();
		try {
			response = bean.validateAssetSKU(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/uploadSKU", produces = "application/json")
	public UploadSKUResponse uploadSKU(@RequestBody UploadSKURequest request) {
			TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
			UploadSKUResponse response = new UploadSKUResponse();

			try {
				response = bean.uploadSKU(request);
			} catch (ExceptionHandle e) {
				response.setError(e.getErrorType());
			} catch (Exception e) {
				ErrorType error = new ErrorType();
				error.setCode("500");
				error.setMessage(ExceptionHandle.findRootCause(e));
				response.setError(error);
			}

			log.info(logger.end(response));
			return response;
	}
	
	@PostMapping(path ="/updateDetailSKUPrPo", produces = "application/json")
	public UpdateDetailSKUPrPoResponse updateDetailSKUPrPo(@RequestBody UpdateDetailSKUPrPoRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		UpdateDetailSKUPrPoResponse response = new UpdateDetailSKUPrPoResponse();

		try {
			response = bean.updateDetailSKUPrPo(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/transformPOToMynetwork", produces = "application/json")
	public TransformPOResponse transformPOToMynetwork(@RequestBody TransformPORequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		TransformPOResponse response = new TransformPOResponse();
		try {

			response = bean.TransformInterfacePoSap(request);

		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/prePrtransferBudget", produces = "application/json")
	public CreateTransferBudgetToSapResponse transferBudgetToSapPi(@RequestBody CreateTransferBudgetToSapRequest request) {
			TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
			CreateTransferBudgetToSapResponse response = new CreateTransferBudgetToSapResponse();
			boolean isTransferBudget = true;
			try {
				response = bean.transferBudgetToSapPi(request, isTransferBudget);
			} catch (ExceptionHandle e) {
				response.setError(e.getErrorType());
			} catch (Exception e) {
				ErrorType error = new ErrorType();
				error.setCode("500");
				error.setMessage(ExceptionHandle.findRootCause(e));
				response.setError(error);
			}

			log.info(logger.end(response));
			return response;
		
	}
	
	@PostMapping(path ="/searchPrePR", produces = "application/json")
	public SearchPrePRResponse searchPrePR(@RequestBody SearchPrePRRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		SearchPrePRResponse response = new SearchPrePRResponse();

		try {
			response = bean.searchPrePR(request);
		} catch (ExceptionHandle e) {
			log.error(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;

	}
		
	@PostMapping(path ="/getCurrency", produces = "application/json")
	public CurrencyMasterResponse getCurrency(@RequestBody CommonRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		CurrencyMasterResponse response = new CurrencyMasterResponse();

		try {
			response.setCurrencyMasterList(bean.getCurrency());
		} catch (ExceptionHandle e) {
			log.info(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;

	}
	
	@PostMapping(path ="/searchPrePRforCancel", produces = "application/json")
	public SearchPrePRforCancelResponse searchPrePRforCancel(@RequestBody SearchPrePRforCancelRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		SearchPrePRforCancelResponse response = new SearchPrePRforCancelResponse();

		try {
			response = bean.searchPrePRforCancel(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;

	}
	
	@PostMapping(path ="/getCurrencyExchangeRate", produces = "application/json")
	public GetCurrencyExchangeRateResponse getCurrencyExchangeRate(@RequestBody GetCurrencyExchangeRateRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		GetCurrencyExchangeRateResponse response = new GetCurrencyExchangeRateResponse();

		try {
			response = bean.getCurrencyExchangeRate(request);
		} catch (ExceptionHandle e) {
			log.info(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;

	}
	
	
	public SaveSKUResponse saveSKU(@RequestBody SaveSKURequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		SaveSKUResponse response = new SaveSKUResponse();

		try {
			response = bean.saveSKU(request);
		} catch (ExceptionHandle e) {
			log.error(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;

	}

	@PostMapping(path ="/getDocDetailNoPrPoByBudgetType", produces = "application/json")
	public GetDocDetailNoPrPoByBudgetTypeResponse getDocDetailNoPrPoByBudgetType(@RequestBody GetDocDetailNoPrPoByBudgetTypeRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		GetDocDetailNoPrPoByBudgetTypeResponse response = new GetDocDetailNoPrPoByBudgetTypeResponse();

		try {
			response = bean.getDocDetailNoPrPoByBudgetType(request);
		} catch (ExceptionHandle e) {
			log.info(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;

	}
	
	@PostMapping(path ="/savePRPOByPOStatus", produces = "application/json")
	public SavePRPOByPOStatusResponse savePRPOByPOStatus(@RequestBody SavePRPOByPOStatusRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		SavePRPOByPOStatusResponse response = new SavePRPOByPOStatusResponse();

		try {
			response = bean.savePRPOByPOStatus(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;

	}
	
	@PostMapping(path ="/getDocId", produces = "application/json")
	public CreatePrePRResponse getDocId(@RequestBody CreatePrePRRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		CreatePrePRResponse response = new CreatePrePRResponse();

		try {
			response = bean.getDocId(request);
		} catch (ExceptionHandle e) {
			log.info(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;

	}
	
	@PostMapping(path ="/sendMailSummaryMultiPrePRToSap", produces = "application/json")
	public CommonResponse sendMailSummaryMultiPrePRToSap(@RequestBody CommonRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), null);
		CommonResponse response = new CommonResponse();

		try {
			bean.sendMailSummaryMultiPrePRToSap(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;

	}
	
	@PostMapping(path ="/getGroupNameBudgetTypeA", produces = "application/json")
	public GetGroupNameBudgetTypeAResponse getGroupNameBudgetTypeA(@RequestBody GetGroupNameBudgetTypeARequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		GetGroupNameBudgetTypeAResponse response = new GetGroupNameBudgetTypeAResponse();

		try {
			response = bean.getGroupNameBudgetTypeA(request);
		} catch (ExceptionHandle e) {
			log.info(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;

	}
	
	@PostMapping(path ="/savePrePRTPTHeader", produces = "application/json")
	public SavePrePRTPTHeaderResponse savePrePRTPTHeader(@RequestBody SavePrePRTPTHeaderRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		SavePrePRTPTHeaderResponse response = new SavePrePRTPTHeaderResponse();

		try {
			response = bean.savePrePRTPTHeader(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;

	}

	@PostMapping(path ="/getAssetSKUBudgetTypeA", produces = "application/json")
	public GetAssetSKUBudgetTypeAResponse getAssetSKUBudgetTypeA(@RequestBody GetAssetSKUBudgetTypeARequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		GetAssetSKUBudgetTypeAResponse response = new GetAssetSKUBudgetTypeAResponse();

		try {
			response = bean.getAssetSKUBudgetTypeA(request);
		} catch (ExceptionHandle e) {
			log.info(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;

	}
	
	@PostMapping(path ="/resubmitPrePRToSAP", produces = "application/json")
	public CommonResponse resubmitPrePRToSAP(@RequestBody ResubmitPrePRToSAPRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		CommonResponse response = new CommonResponse();

		try {
			response = bean.reSubmitPrePRToSAP(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/resubmitPrePRToSAPPI", produces = "application/json")
	public CommonResponse resubmitPrePRToSapPi(@RequestBody ResubmitPrePRToSAPRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		CommonResponse response = new CommonResponse();

		try {
			response = bean.reSubmitPrePRToSapPi(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;

	}
	
	@PostMapping(path ="/createPrePR", produces = "application/json")
	public CreatePrePRResponse createPrePR(@RequestBody CreatePrePRRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		CreatePrePRResponse response = new CreatePrePRResponse();

		try {
			response = bean.createPrePR(request);
		} catch (ExceptionHandle e) {
			log.error(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));

		return response;
	}
	
	@PostMapping(path ="/createPrePRToSap", produces = "application/json")
	public CreatePrePRToSapResponse createPrePRToSap(@RequestBody CreatePrePRToSapRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		CreatePrePRToSapResponse response = new CreatePrePRToSapResponse();
		try {
			bean.createPrePRToSap(request);
		} catch (ExceptionHandle e) {
			log.error(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		response.setDocumentId(request.getDocumentId());

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/createPrePRToSAPPI", produces = "application/json")
	public CreatePrePRToSapResponse createPrePRToSapPi(@RequestBody CreatePrePRToSapRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		CreatePrePRToSapResponse response = new CreatePrePRToSapResponse();
		String findTypeY = "";
		if (ValidateUtil.notNull(request.getMoreInfo())) {
			findTypeY = request.getMoreInfo().trim().replaceAll("\\s", "");
		}
		String msgStrLog = "Service : CreatePrePRToSapPi" + "|Budget Type : " + request.getBudgetType() + "|DocumentId : " + request.getDocumentId() + "|RunAsSynchronous : "
				+ request.isRunAsSynchronous() + "|UserName : " + request.getUserName() + "|UUid : " + request.getUuid() + "| PrType : " + request.getPrType() + "| findTypeY : " + findTypeY;

		log.info(msgStrLog);

		try {

			if ("A".equalsIgnoreCase(request.getBudgetType()) && !(findTypeY.contains("PRTYPEY"))) {

				if ("Y".equalsIgnoreCase(request.getPrType())) {
					log.info("createPrePRToSapPi | DocumentId : " + request.getDocumentId() + " call Flow type Y");
					bean.createPrePRToSapPi(request);
				} else {
					log.info("createPrePRToSapPi | DocumentId : " + request.getDocumentId() + " call Flow type A");
					bean.createPrePRToSapPi_TypeA(request);
				}
			} else {
				log.info("createPrePRToSapPi | DocumentId : " + request.getDocumentId() + " call Flow type Y");
				bean.createPrePRToSapPi(request);
			}

		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		response.setDocumentId(request.getDocumentId());
		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/createPrePRTPTtoAAM", produces = "application/json")
	public CreatePrePRTPTtoAAMResponse createPrePRTPTtoAAM(@RequestBody CreatePrePRTPTtoAAMRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		CreatePrePRTPTtoAAMResponse response = new CreatePrePRTPTtoAAMResponse();

		try {
			response = bean.createPrePRTPTtoAAM(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/createPrePRTPT", produces = "application/json")
	public CreatePrePRTPTResponse createPrePRTPT(@RequestBody CreatePrePRTPTRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		CreatePrePRTPTResponse response = new CreatePrePRTPTResponse();

		try {
			response = bean.createPrePRTPT(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/getAssetSKUByAssetId", produces = "application/json")
	public GetAssetSKUByAssetIdResponse getAssetSKUByAssetId(@RequestBody GetAssetSKUByAssetIdRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		GetAssetSKUByAssetIdResponse response = new GetAssetSKUByAssetIdResponse();

		try {
			response = bean.getAssetSKUByAssetId(request);
		} catch (ExceptionHandle e) {
			log.info(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;

	}
	
	@PostMapping(path ="/reSubmitPrePRMultiToSAPPI", produces = "application/json")
	public CommonResponse reSubmitPrePRMultiToSAPPI(@RequestBody ResubmitPrePRToSAPRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), null);
		CommonResponse response = new CommonResponse();

		try {
			response = bean.reSubmitPrePRMultiToSapPi(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/prePrMultiTransferBudget", produces = "application/json")
	public PrePrMultiTransferBudgetResponse prePrMultiTransferBudget(@RequestBody PrePrMultiTransferBudgetRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		PrePrMultiTransferBudgetResponse response = new PrePrMultiTransferBudgetResponse();
		try {
			response = bean.prePrMultiTransferBudget(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(e.getMessage());
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/deletePrePR", produces = "application/json")
	public DeletePrePRResponse deletePrePR(@RequestBody DeletePrePRRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		DeletePrePRResponse response = new DeletePrePRResponse();
		try {
			response = bean.deletePrePR(request);
		} catch (ExceptionHandle e) {
			log.error(e.getMessage(), e);
			ErrorType errorType = new ErrorType();
			errorType.setCode("500");
			errorType.setMessage(ExceptionHandle.findRootCause(e));

			response.setError(errorType);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			ErrorType errorType = new ErrorType();
			errorType.setCode("100");
			errorType.setMessage(ExceptionHandle.findRootCause(e));

			response.setError(errorType);
		}

		log.info(logger.end(response));
		return response;
	}
	@PostMapping(path ="/getAssetTypeBudgetTypeA", produces = "application/json")
	public GetAssetTypeBudgetTypeAResponse getAssetTypeBudgetTypeA(@RequestBody GetAssetTypeBudgetTypeARequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		GetAssetTypeBudgetTypeAResponse response = new GetAssetTypeBudgetTypeAResponse();

		try {
			response = bean.getAssetTypeBudgetTypeA(request);
		} catch (ExceptionHandle e) {
			log.info(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/insertDocToMultiTransfer", produces = "application/json")
	public InsertDocToMultiTransferResponse insertDocToMultiTransfer(@RequestBody InsertDocToMultiTransferRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		InsertDocToMultiTransferResponse response = new InsertDocToMultiTransferResponse();

		try {
			response = bean.insertDocToMultiTransfer(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
		
	@PostMapping(path ="/getLogErrorPrePrFileTransferBudget", produces = "application/json")
	public GetLogErrorPrePrFileTransferBudgetResponse getLogErrorPrePrFileTransferBudget(@RequestBody GetLogErrorPrePrFileTransferBudgetRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		GetLogErrorPrePrFileTransferBudgetResponse response = new GetLogErrorPrePrFileTransferBudgetResponse();

		try {
			response = bean.getLogErrorPrePrFileTransferBudget(request);
		} catch (ExceptionHandle e) {
			log.info(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/importAddEditCurrencyExchangeRate", produces = "application/json")
	public ImportAddEditCurrencyExchangeRateResponse importAddEditCurrencyExchangeRate(@RequestBody ImportAddEditCurrencyExchangeRateRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		ImportAddEditCurrencyExchangeRateResponse response = new ImportAddEditCurrencyExchangeRateResponse();

		try {
			response = bean.importAddEditCurrencyExchangeRate(request);
		} catch (ExceptionHandle e) {
			log.error(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	@PostMapping(path ="/getLogPrePrFileTransferBudget", produces = "application/json")
	public GetLogPrePrFileTransferBudgetResponse getLogPrePrFileTransferBudget(@RequestBody GetLogPrePrFileTransferBudgetRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		GetLogPrePrFileTransferBudgetResponse response = new GetLogPrePrFileTransferBudgetResponse();

		try {
			response = bean.getLogPrePrFileTransferBudget(request);
		} catch (ExceptionHandle e) {
			log.info(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/importAddEditPurchaser", produces = "application/json")
	public ImportAddEditPurchaserResponse importAddEditPurchaser(@RequestBody ImportAddEditPurchaserRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		ImportAddEditPurchaserResponse response = new ImportAddEditPurchaserResponse();

		try {
			response = bean.importAddEditPurchaser(request);
		} catch (ExceptionHandle e) {
			log.error(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/getMultiTransferViewPrePrItem", produces = "application/json")
	public MultiTransferViewPrePrItemResponse getMultiTransferViewPrePrItem(@RequestBody MultiTransferViewPrePrItemRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		MultiTransferViewPrePrItemResponse response = new MultiTransferViewPrePrItemResponse();

		try {
			response = bean.getMultiTransferViewPrePrItem(request);
		} catch (ExceptionHandle e) {
			log.info(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/importPrePrFileTransferBudget", produces = "application/json")
	public ImportPrePrFileTransferBudgetResponse importPrePrFileTransferBudget(@RequestBody ImportPrePrFileTransferBudgetRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		ImportPrePrFileTransferBudgetResponse response = new ImportPrePrFileTransferBudgetResponse();
		boolean isMultiTransfer = false;
		try {
			response = bean.importPrePrFileTransferBudget(request,isMultiTransfer);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(e.getMessage());
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/getDocReSubmitPrePRToSAP", produces = "application/json")
	public GetDocReSubmitPrePRToSAPResponse getDocReSubmitPrePRToSAP(@RequestBody ResubmitPrePRToSAPRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		GetDocReSubmitPrePRToSAPResponse response = new GetDocReSubmitPrePRToSAPResponse();

		try {
			response = bean.getDocReSubmitPrePRToSAP(request);
		} catch (ExceptionHandle e) {
			log.info(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
				response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/multiTransferViewProcessingDocByBatch", produces = "application/json")
	public MultiTransferViewProcessingDocByBatchResponse multiTransferViewProcessingDocByBatch(@RequestBody MultiTransferViewProcessingDocByBatchRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		MultiTransferViewProcessingDocByBatchResponse response = new MultiTransferViewProcessingDocByBatchResponse();

		try {
			response = bean.multiTransferViewProcessingDocByBatch(request);
		} catch (ExceptionHandle e) {
			log.error(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}

	@PostMapping(path ="/insertUpdateMultiCreatePr", produces = "application/json")
	public InsertUpdateMultiCreatePrResponse insertUpdateMultiCreatePr(@RequestBody InsertUpdateMultiCreatePrRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		InsertUpdateMultiCreatePrResponse response = new InsertUpdateMultiCreatePrResponse();

		try {
			response = bean.insertUpdateMultiCreatePr(request);
		} catch (ExceptionHandle e) {
			log.info(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/multiTransferViewDocByBatch", produces = "application/json")
	public MultiTransferViewDocByBatchResponse multiTransferViewDocByBatch(@RequestBody MultiTransferViewDocByBatchRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		MultiTransferViewDocByBatchResponse response = new MultiTransferViewDocByBatchResponse();

		try {
			response = bean.multiTransferViewDocByBatch(request);
		} catch (ExceptionHandle e) {
			log.error(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}
		return response;
	}
	
	@PostMapping(path ="/multiTransferBudgetToSapPi", produces = "application/json")
	public MultiTransferBudgetToSapPiResponse multiTransferBudgetToSapPi(@RequestBody MultiTransferBudgetToSapPiRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		MultiTransferBudgetToSapPiResponse response = new MultiTransferBudgetToSapPiResponse();
		try {
			response = bean.multiTransferBudgetToSapPi(request);
		} catch (ExceptionHandle e) {
			log.info(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.info(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));

		return response;
	}
	
	@PostMapping(path ="/multiTransferValidateWBS", produces = "application/json")
	public MultiTransferValidateWBSResponse multiTransferValidateWBS(@RequestBody MultiTransferValidateWBSRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), null);
		MultiTransferValidateWBSResponse response = new MultiTransferValidateWBSResponse();
		
		try {
			response = bean.multiTransferValidateWBS(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}
	
		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/autoConfirmBudgetOverSLA", produces = "application/json")
	public AutoConfirmBudgetOverSLAResponse autoConfirmBudgetOverSLA(@RequestBody AutoConfirmBudgetOverSLARequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), null);
		AutoConfirmBudgetOverSLAResponse response = new AutoConfirmBudgetOverSLAResponse();

		try {
			response = bean.autoConfirmBudgetOverSLA(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage("sendMailSummaryMultiPrePRToSap : " + ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/multiTransferGetWBSByBatch", produces = "application/json")
	public MultiTransferGetWBSByBatchResponse multiTransferGetWBSByBatch(@RequestBody MultiTransferGetWBSByBatchRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		MultiTransferGetWBSByBatchResponse response = new MultiTransferGetWBSByBatchResponse();

		try {
			response = bean.multiTransferGetWBSByBatch(request);
		} catch (ExceptionHandle e) {
			log.error(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));

		return response;
	}
	
	@PostMapping(path ="/multiTransferDeleteDocIdByBatch", produces = "application/json")
	public MultiTransferDeleteDocIdByBatchResponse multiTransferDeleteDocIdByBatch(@RequestBody MultiTransferDeleteDocIdByBatchRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		MultiTransferDeleteDocIdByBatchResponse response = new MultiTransferDeleteDocIdByBatchResponse();

		try {
			response = bean.multiTransferDeleteDocIdByBatch(request);
		} catch (ExceptionHandle e) {
			log.error(e.getMessage(), e);
			response.setError(e.getErrorType());
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}

		log.info(logger.end(response));
		return response;
	}

	@PostMapping(path ="/downloadPrePRAttachFile", produces = "application/json")
	public Response downloadPrePRAttachFile(@RequestBody DownloadPrePRAttachFileRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		Response response = null;
		DownloadPrePRAttachFileResponse downloadResponse = new DownloadPrePRAttachFileResponse();

		try {
			response = bean.downloadPrePRAttachFile(request);
		} catch (ExceptionHandle e) {
			downloadResponse.setError(e.getErrorType());
			response = Response.serverError().type(MediaType.APPLICATION_JSON).entity(new Gson().toJson(downloadResponse)).build();
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			downloadResponse.setError(error);
			response = Response.serverError().type(MediaType.APPLICATION_JSON).entity(new Gson().toJson(downloadResponse)).build();
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/deleteTempSKU", produces = "application/json")
	public DeleteTempSKUResponse deleteTempSKU(@RequestBody DeleteTempSKURequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		DeleteTempSKUResponse response = new DeleteTempSKUResponse();

		try {
			response = bean.deleteTempSKU(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/mappingPrePR", produces = "application/json")
	public MappingPrePRResponse mappingPrePR(@RequestBody CommonRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		MappingPrePRResponse response = new MappingPrePRResponse();
		try {
			response = bean.mappingPrePR(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}

	@PostMapping(path ="/deleteBatch", produces = "application/json")
	public DeleteBatchResponse deleteBatch(@RequestBody DeleteBatchRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), null);
		DeleteBatchResponse response = new DeleteBatchResponse();

		try {
			response = bean.deleteBatch(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/mappingPrePRToSAPPI", produces = "application/json")
	public mappingPrePRToSAPPIResponse mappingPrePRToSAPPI(@RequestBody mappingPrePRToSAPPIRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		mappingPrePRToSAPPIResponse response = new mappingPrePRToSAPPIResponse();

		try {
			response = bean.mappingPrePRToSAPPI(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
			
	@PostMapping(path ="/checkProcessMultiCreatePrePr", produces = "application/json")
	public CheckProcessMultiCreatePrePrResponse checkProcessMultiCreatePrePr(@RequestBody CheckProcessMultiCreatePrePrRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		CheckProcessMultiCreatePrePrResponse response = new CheckProcessMultiCreatePrePrResponse();

		try {
			response = bean.checkProcessMultiCreatePrePr(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/multiConfirmBudget", produces = "application/json")
	public MultiConfirmBudgetResponse multiConfirmBudget(@RequestBody MultiConfirmBudgetRequest request) {

		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		MultiConfirmBudgetResponse response = new MultiConfirmBudgetResponse();

		try {
			response = bean.multiConfirmBudget(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}

	@PostMapping(path ="/checkBudgetAvailableToSAPPI", produces = "application/json")
	public CheckBudgetAvailableToSAPPIResponse checkBudgetAvailableToSAPPI(@RequestBody CheckBudgetAvailableToSAPPIRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		CheckBudgetAvailableToSAPPIResponse response = new CheckBudgetAvailableToSAPPIResponse();

		try {
			response = bean.checkBudgetAvailableToSAPPI(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/multiTransferCheckBudgetAvailableToSAPPI", produces = "application/json")
	public InsertUpdateMultiCreatePrResponse multiTransferCheckBudgetAvailableToSAPPI(@RequestBody MultiTransferCheckBudgetAvailableToSAPPIRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), null);
		InsertUpdateMultiCreatePrResponse response = new InsertUpdateMultiCreatePrResponse();

		try {
			response = bean.multiTransferCheckBudgetAvailableToSAPPI(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}

	@PostMapping(path ="/cancelPrePRToSAPPI", produces = "application/json")
	public CancelPrePRToSAPPIResponse cancelPrePRToSAPPI(@RequestBody CancelPrePRToSAPPIRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), request);
		CancelPrePRToSAPPIResponse response = new CancelPrePRToSAPPIResponse();

		try {
			response = bean.cancelPrePRToSAPPI(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage(ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
	
	@PostMapping(path ="/jobPrePRSendToSAP", produces = "application/json")
	public JobPrePRSendToSAPResponse jobPrePRSendToSAP(@RequestBody JobPrePRSendToSAPRequest request) {
		TransactionLog logger = new TransactionLog(Thread.currentThread().getStackTrace()[1].getMethodName(), null);
		JobPrePRSendToSAPResponse response = new JobPrePRSendToSAPResponse();

		try {
			response = bean.jobPrePRSendToSAP(request);
		} catch (ExceptionHandle e) {
			response.setError(e.getErrorType());
		} catch (Exception e) {
			ErrorType error = new ErrorType();
			error.setCode("500");
			error.setMessage("jobPrePRSendToSAP : " + ExceptionHandle.findRootCause(e));
			response.setError(error);
		}

		log.info(logger.end(response));
		return response;
	}
}

