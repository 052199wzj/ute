package com.mes.server.controller.dms.spare;

import com.mes.server.controller.BaseController;
import com.mes.server.service.DMSService;
import com.mes.server.service.mesenum.dms.DMSLedgerStatus;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.deviceLegder.spare.DMSSpareLedger;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.utils.RetCode;
 
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
@RequestMapping("/api/SpareLedger")
public class SpareLedgerController extends BaseController {

	private static Logger logger = LoggerFactory.getLogger(typeof(SpareLedgerController));

	@Autowired
	DMSService wDMSService;

	@GetMapping("/All")
	public Object All() {
		Object wResult = new Object();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			@SuppressWarnings("unused")
			int wUserID = wBMSEmployee.ID;
			@SuppressWarnings("unused")
			int wCompanyID = wBMSEmployee.getCompanyID();

			int wModelID = StringUtils.parseInt(Request.QueryParamString("ModelID"));
			int wEquipID = StringUtils.parseInt(Request.QueryParamString("EquipID"));
			int wDeviceLedgerID = StringUtils.parseInt(Request.QueryParamString("DeviceLedgerID"));
			int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));// 车间id
			int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
			int wBusinessUnitID = StringUtils.parseInt(Request.QueryParamString("BusinessUnitID"));
			int wBaseID = StringUtils.parseInt(Request.QueryParamString("BaseID"));
			int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
			int wStatus = StringUtils.parseInt(Request.QueryParamString("Status"));

			ServiceResult<List<DMSSpareLedger>> wServiceResult = wDMSService.DMS_GetSpareLedgerList(wBMSEmployee,
					wModelID, wEquipID, wDeviceLedgerID, wBusinessUnitID, wBaseID, wFactoryID, wWorkShopID, wLineID,
					DMSLedgerStatus.getEnumType(wStatus));
			List<DMSSpareLedger> wServerRst = wServiceResult.getResult();

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst, null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServerRst, null);
			}

		} catch (Exception ex) {
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
			@SuppressWarnings("unused")
			int wUserID = wBMSEmployee.ID;
			@SuppressWarnings("unused")
			int wCompanyID = wBMSEmployee.getCompanyID();

			int wID = StringUtils.parseInt(Request.QueryParamString("ID"));
			String wSpareNo = StringUtils.parseString(Request.QueryParamString("SpareNo"));

			ServiceResult<DMSSpareLedger> wServiceResult = wDMSService.DMS_GetSpareLedger(wBMSEmployee, wID, wSpareNo);
			DMSSpareLedger wServerRst = wServiceResult.getResult();

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

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			DMSSpareLedger wDMSSpareLedger = CloneTool.Clone(wParam["data"], typeof(DMSSpareLedger));

			ServiceResult<Int32> wServiceResult = wDMSService.DMS_SaveSpareLedger(wBMSEmployee, wDMSSpareLedger);

			if (StringUtils.isEmpty(wServiceResult.FaultCode)) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSSpareLedger);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.FaultCode, null, wDMSSpareLedger);
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}
}