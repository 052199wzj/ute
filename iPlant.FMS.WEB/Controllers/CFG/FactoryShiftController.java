package com.mes.server.controller.cfg;

import com.mes.server.controller.BaseController;
import com.mes.server.service.CFGService;
import com.mes.server.service.SFCService;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.utils.RetCode;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/FactoryShift")
public class FactoryShiftController extends BaseController {
	private static Logger logger = LoggerFactory.getLogger(typeof(FactoryShiftController));

	@Autowired
	CFGService wCFGService;

	@Autowired
	SFCService wSFCService;

	@SuppressWarnings("unused")
	@GetMapping("/GetShiftRecord")
	public Object GetShiftRecord() {
		Object wResult = new Object();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.CompanyID;

			int wShifts = StringUtils.parseInt(Request.QueryParamString("Shifts"));

			int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));

			int wServerRst = 0; //wCFGService.Cfg_GetShiftID(wCompanyID, wWorkShopID, wShifts);

			wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst);
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	@SuppressWarnings("unused")
	@GetMapping("/GetShiftRecordFive")
	public Object GetShiftRecordFive() {
		Object wResult = new Object();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.CompanyID;

			int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));

			int[] wServerRst = new int[5];
			for (int i = -2; i <= 2; i++) {
				wServerRst[i + 2] = 0;
				// wSFCService.SFC_QueryShiftID(wCompanyID, wLoginID, wShifts)(wCompanyID, wWorkShopID, i);
			}
			wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst, null);
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}
}
