package com.mes.server.controller.bfc;

import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping; 
import org.springframework.web.bind.annotation.RestController;

import com.mes.server.controller.BaseController;
import com.mes.server.service.BFCService;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bfc.BFCAuditAction;
import com.mes.server.service.po.bfc.BFCAuditConfig;
import com.mes.server.service.po.bfc.BFCAuditVersion;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.utils.RetCode;

@RestController
@RequestMapping("/api/BFCAudit")
public class BFCAuditController extends BaseController {

	private static Logger logger = LoggerFactory.getLogger(typeof(BFCAuditController));

	@Autowired
	BFCService wBFCService;

	public BFCAuditController() {
		// TODO Auto-generated constructor stub
	}

	[HttpGet]
	public ActionResult ConfigVersion() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			int wEventModule = StringUtils.parseInt(Request.QueryParamString("ModuleID"));

			ServiceResult<List<BFCAuditVersion>> wServiceResult = wBFCService.BFC_GetVersionList(wBMSEmployee,
					wEventModule);

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, wServiceResult.getFaultCode(), wServiceResult.getResult(),
						null);
			}
		} catch (Exception e) {
			wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_CODE_ERR_MSG);
			logger.error("BFCAuditController ConfigVersion ERROR:", e);
		}
		return wResult;
	}

	[HttpGet]
	public ActionResult ConfigAll() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			String wName = StringUtils.parseString(Request.QueryParamString("Name"));
			int wEventModule = StringUtils.parseInt(Request.QueryParamString("ModuleID"));
			String wVersionNo = StringUtils.parseString(Request.QueryParamString("VersionNo"));
			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
			int wFunctionID = StringUtils.parseInt(Request.QueryParamString("FunctionID"));

			ServiceResult<List<BFCAuditConfig>> wServiceResult = wBFCService.BFC_GetAuditConfigList(wBMSEmployee, wName,
					wEventModule, wVersionNo, wActive, wFunctionID);
			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, wServiceResult.getFaultCode(), wServiceResult.getResult(),
						null);
			}

		} catch (Exception e) {
			wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_CODE_ERR_MSG);
			logger.error("BFCAuditController ConfigAll ERROR:", e);
		}
		return wResult;
	}

	[HttpGet]
	public ActionResult ConfigAllTask() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			int wEventModule = StringUtils.parseInt(Request.QueryParamString("ModuleID"));
			int wTaskID = StringUtils.parseInt(Request.QueryParamString("TaskID"));

			if (wEventModule <= 0 || wTaskID <= 0) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			ServiceResult<List<BFCAuditConfig>> wServiceResult = wBFCService.BFC_GetTaskConfigList(wBMSEmployee,
					wTaskID, wEventModule);
			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, wServiceResult.getFaultCode(), wServiceResult.getResult(),
						null);
			}

		} catch (Exception e) {
			wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_CODE_ERR_MSG);
			logger.error("BFCAuditController ConfigAll ERROR:", e);
		}
		return wResult;
	}

	[HttpGet]
	public ActionResult CurrentConfig() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			int wEventModule = StringUtils.parseInt(Request.QueryParamString("ModuleID"));
			int wTaskID = StringUtils.parseInt(Request.QueryParamString("TaskID"));
			int wUserID = StringUtils.parseInt(Request.QueryParamString("UserID"));

			if (wEventModule <= 0 || wTaskID <= 0) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}
			if (wUserID <= 0 && wUserID != -100) {
				wUserID = wBMSEmployee.ID;
			}

			ServiceResult<BFCAuditConfig> wServiceResult = wBFCService.BFC_GetCurrentConfig(wBMSEmployee, wUserID,
					wTaskID, wEventModule);
			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.getResult());
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, wServiceResult.getFaultCode(), null,
						wServiceResult.getResult());
			}

		} catch (Exception e) {
			wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_CODE_ERR_MSG);
			logger.error("BFCAuditController ConfigAll ERROR:", e);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult OtherSaveConfig() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			if (!wParam.ContainsKey("data") || !wParam.ContainsKey("ModuleID") || !wParam.ContainsKey("VersionNo")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}
			int wEventModule = StringUtils.parseInt(wParam["ModuleID"]);
			String wVersionNo = StringUtils.parseString(wParam["VersionNo"]);

			List<BFCAuditConfig> wBFCAuditConfigList = CloneTool.CloneArray(wParam["data"], typeof(BFCAuditConfig));

			ServiceResult<Int32> wServerRst = wBFCService.BFC_OtherSaveAuditConfigList(wBMSEmployee, wEventModule,
					wVersionNo, wBFCAuditConfigList);
			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wBFCAuditConfigList, null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), wBFCAuditConfigList, null);
			}

		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult UpdateConfig() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			BFCAuditConfig wBFCAuditConfig = CloneTool.Clone(wParam["data"], typeof(BFCAuditConfig));
			if (wBFCAuditConfig.ID <= 0) {
				wBFCAuditConfig.CreatorID = wBMSEmployee.ID;
			}
			wBFCAuditConfig.EditorID = wBMSEmployee.ID;
			ServiceResult<Int32> wServerRst = wBFCService.BFC_UpdateAuditConfig(wBMSEmployee, wBFCAuditConfig);
			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBFCAuditConfig);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wBFCAuditConfig);
			}

		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult ActiveConfig() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			if (!wParam.ContainsKey("ModuleID") || !wParam.ContainsKey("Active") || !wParam.ContainsKey("VersionNo")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			int wActive = StringUtils.parseInt(wParam["Active"]);
			int wEventModule = StringUtils.parseInt(wParam["ModuleID"]);
			String wVersionNo = StringUtils.parseString(wParam["VersionNo"]);

			ServiceResult<Int32> wServerRst = wBFCService.BFC_ActiveAuditConfig(wBMSEmployee, wEventModule,
					wVersionNo, wActive);
			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode());
			}

		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult DeleteConfig() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			if (!wParam.ContainsKey("data") && !wParam.ContainsKey("VersionNo")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			BFCAuditConfig wBFCAuditConfig = null;
			if (wParam.ContainsKey("data")) {
				wBFCAuditConfig = CloneTool.Clone(wParam["data"], typeof(BFCAuditConfig));
			}

			String wVersionNo = "";

			if (wParam.ContainsKey("VersionNo")) {
				wVersionNo = StringUtils.parseString(wParam["VersionNo"]);
			}

			ServiceResult<Int32> wServerRst = wBFCService.BFC_DelectAuditConfig(wBMSEmployee, wBFCAuditConfig,
					wVersionNo);
			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode());
			}

		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpGet]
	public ActionResult ActionAll() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			int wEventModule = StringUtils.parseInt(Request.QueryParamString("ModuleID"));
			int wTaskID = StringUtils.parseInt(Request.QueryParamString("TaskID"));

			if (wEventModule <= 0 || wTaskID <= 0) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			ServiceResult<List<BFCAuditAction>> wServiceResult = wBFCService.BFC_GetAuditActionList(wBMSEmployee,
					wTaskID, wEventModule);
			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, wServiceResult.getFaultCode(), wServiceResult.getResult(),
						null);
			}

		} catch (Exception e) {
			wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_CODE_ERR_MSG);
			logger.error("BFCAuditController ConfigAll ERROR:", e);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult UpdateAction() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			if (!wParam.ContainsKey("data") || !wParam.ContainsKey("Title")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			BFCAuditAction wBFCUpdateAction = CloneTool.Clone(wParam["data"], typeof(BFCAuditAction));

			String wTitle = StringUtils.parseString(wParam["Title"]);

			if (StringUtils.isEmpty(wTitle)) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}
			ServiceResult<Int32> wServerRst = wBFCService.BFC_UpdateAuditAction(wBMSEmployee, wBFCUpdateAction,
					wTitle);
			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBFCUpdateAction);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wBFCUpdateAction);
			}

		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

}
