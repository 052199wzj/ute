package com.mes.server.controller.elg;

import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mes.server.controller.BaseController;
import com.mes.server.service.ELGService;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.elg.ELGCatalog;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.utils.RetCode;

@RestController
@RequestMapping("/api/ELG")
public class ELGController extends BaseController {
	private static Logger logger = LoggerFactory.getLogger(typeof(ELGController));

	@Autowired
	ELGService wELGService;

	[HttpGet]
	public ActionResult LogList() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			ServiceResult<List<ELGCatalog>> wServiceResult = wELGService.ELG_QueryCataLogList(wBMSEmployee);
			wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, null);
		} catch (Exception e) {
			wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_CODE_ERR_MSG);
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
		}
		return wResult;
	}

	[HttpGet]
	public ActionResult LogInfo() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			int wID = StringUtils.parseInt(Request.QueryParamString("ID"));
			ServiceResult<List<String>> wServiceResult = wELGService.ELG_ShowLogFileByID(wBMSEmployee, wID);
			wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.Result);
		} catch (Exception e) {
			wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_CODE_ERR_MSG);
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
		}
		return wResult;
	}

	@GetMapping("/FileDownload")
	void FileDownload() {

		try {
			BMSEmployee wBMSEmployee = GetSession();
			int wID = StringUtils.parseInt(Request.QueryParamString("ID"));
			wELGService.ELG_DownloadLogFileByID(wBMSEmployee, wID, response);
		} catch (Exception e) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
		}
	}

	[HttpGet]
	public ActionResult DeleteInfo() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wID = StringUtils.parseInt(Request.QueryParamString("ID"));
			ServiceResult<Boolean> wServiceResult = wELGService.ELG_DeleteLogFileByID(wBMSEmployee, wID);
			wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.Result);
		} catch (Exception e) {
			wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_CODE_ERR_MSG);
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult DeleteList() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			List<Int32> wIDList = CloneTool.CloneArray(wParam["data"], typeof(Int32));
			ServiceResult<String> wServiceResult = wELGService.ELG_DeleteLogFileList(wBMSEmployee, wIDList);
			wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.Result);
		} catch (Exception e) {
			wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_CODE_ERR_MSG);
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
		}
		return wResult;
	}
}
