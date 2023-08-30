package com.mes.server.controller.fmc;

import com.mes.server.controller.BaseController;
import com.mes.server.service.FMCService; 
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.fmc.FMCBusinessUnit;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.utils.RetCode;

import java.util.Calendar;
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

@RestController
@RequestMapping("/api/BusinessUnit")
public class BusinessUnitController extends BaseController {
	private static Logger logger = LoggerFactory.getLogger(typeof(BusinessUnitController));

	@Autowired
	FMCService wFMCService;

	@GetMapping("/All")
	public Object All() {
		Object wResult = new Object();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.CompanyID;
 

			ServiceResult<List<FMCBusinessUnit>> wServiceResult = wFMCService.FMC_QueryBusinessUnitList(wCompanyID,
					wUserID,false);
			List<FMCBusinessUnit> wServerRst = wServiceResult.Result;

			 
			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst, null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServerRst, null);
			}

		} catch (Exception ex) {
			ex.printStackTrace();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	@GetMapping("/Info")
	public Object Info() {
		Object wResult = new Object();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.CompanyID;

			int wID = StringUtils.parseInt(Request.QueryParamString("ID"));

			ServiceResult<FMCBusinessUnit> wServiceResult = wFMCService.FMC_QueryBusinessUnitByID(wCompanyID, wUserID,
					wID);
			FMCBusinessUnit wServerRst = wServiceResult.Result;

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wServerRst);
			}

		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	@PostMapping("/Update")
	public Object Update() {
		Object wResult = new Object();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.CompanyID;
			String wUserName = wBMSEmployee.Name;

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}
			FMCBusinessUnit wFMCBusinessUnit = CloneTool.Clone(wParam["data"], typeof(FMCBusinessUnit));

			@SuppressWarnings("unused")
			int wServerRst = 0;
			ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
			if (wFMCBusinessUnit.ID > 0) {
				wFMCBusinessUnit.Editor = wUserName;
				wFMCBusinessUnit.EditorID = wUserID;
				wFMCBusinessUnit.EditTime = DateTime.Now;
				wServiceResult = wFMCService.FMC_SaveBusinessUnit(wCompanyID, wUserID, wFMCBusinessUnit);
				wServerRst = wServiceResult.Result;
			} else {
				wFMCBusinessUnit.Creator = wUserName;
				wFMCBusinessUnit.CreatorID = wUserID;
				wFMCBusinessUnit.CreateTime = DateTime.Now;
				wFMCBusinessUnit.Editor = wUserName;
				wFMCBusinessUnit.EditorID = wUserID;
				wFMCBusinessUnit.EditTime = DateTime.Now;
				wServiceResult = wFMCService.FMC_AddBusinessUnit(wCompanyID, wUserID, wFMCBusinessUnit);
				wServerRst = wServiceResult.Result;
			}

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	@PostMapping("/Audit")
	public Object Audit() {
		Object wResult = new Object();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.CompanyID;
			String wUserName = wBMSEmployee.Name;

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			FMCBusinessUnit wFMCBusinessUnit = CloneTool.Clone(wParam["data"], typeof(FMCBusinessUnit));
			@SuppressWarnings("unused")
			int wServerRst = 0;
			ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
			if (wFMCBusinessUnit.ID > 0) {
				wFMCBusinessUnit.Auditor = wUserName;
				wFMCBusinessUnit.AuditorID = wUserID;
				wFMCBusinessUnit.AuditTime = DateTime.Now;
				wServiceResult = wFMCService.FMC_AuditBusinessUnit(wCompanyID, wUserID, wFMCBusinessUnit);
				wServerRst = wServiceResult.Result;
			}

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	@PostMapping("/Active")
	public Object Active() {
		Object wResult = new Object();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.CompanyID;
			@SuppressWarnings("unused")
			String wUserName = wBMSEmployee.Name;

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			int wActive = wParam.ContainsKey("Active") ? (int) wParam["Active"] : 0;

			List<FMCBusinessUnit> wFMCBusinessUnitList = CloneTool.CloneArray(wParam["data"],
					typeof(FMCBusinessUnit));

			ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);

			for (FMCBusinessUnit wFMCBusinessUnit : wFMCBusinessUnitList) {
				if (wActive == 1) {
					wServiceResult = wFMCService.FMC_ActiveBusinessUnit(wCompanyID, wUserID, wFMCBusinessUnit);
				} else {
					wServiceResult = wFMCService.FMC_DisableBusinessUnit(wCompanyID, wUserID, wFMCBusinessUnit);
				}

				if (!StringUtils.isEmpty(wServiceResult.getFaultCode()))
					break;
			}

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}
}
