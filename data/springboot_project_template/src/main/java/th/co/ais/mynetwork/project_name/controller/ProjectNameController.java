package th.co.ais.mynetwork.{{projectNameLowercase}}.controller;

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
public class {{projectNameUppercase}}Controller {
	
//	@Value("${mynewtork.test}")
//	public String testValue;
	
	@Autowired
	public {{projectNameUppercase}}ManagementBean bean;
	
//	private static final Logger LOGGER = Logger.getLogger({{projectNameUppercase}}Controller.class);

    @PostMapping(path = "/{{MethodPath}}", produces = "application/json")
    public {{ResponseClassName}} {{ControllerMethodName}}(@RequestBody {{RequestClassName}} request){
    	
		{{ControllerLogic}}
		
    	///
        return response;
    }
    
    
}

