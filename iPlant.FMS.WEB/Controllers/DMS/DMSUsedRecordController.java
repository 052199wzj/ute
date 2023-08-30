package com.mes.server.controller.dms;

import com.mes.server.controller.BaseController;
import com.mes.server.service.DMSService;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.deviceLegder.DMSUseRecord;
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
@RequestMapping("/api/DMSUsedRecord")
public class DMSUsedRecordController extends BaseController {
	private static Logger logger = LoggerFactory.getLogger(typeof(DMSUsedRecordController));

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

			int wDSType = StringUtils.parseInt(Request.QueryParamString("DSType"));
			int wLedgerID = StringUtils.parseInt(Request.QueryParamString("LedgerID"));
			int wEquipID = StringUtils.parseInt(Request.QueryParamString("EquipID"));
			int wUsed = StringUtils.parseInt(Request.QueryParamString("Used"));
			Calendar wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
			Calendar wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

			ServiceResult<List<DMSUseRecord>> wServiceResult = wDMSService.DMS_GetUseRecordList(wBMSEmployee, wDSType,
					wLedgerID, wEquipID, wUsed, wStartTime, wEndTime);

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
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
			// 不对外开放
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			@SuppressWarnings("unused")
			int wUserID = wBMSEmployee.ID;
			@SuppressWarnings("unused")
			int wCompanyID = wBMSEmployee.getCompanyID();
			@SuppressWarnings("unused")
			String wUserName = wBMSEmployee.getName();

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			DMSUseRecord wDMSSpareRecord = CloneTool.Clone(wParam["data"], typeof(DMSUseRecord));

			ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
			if (wDMSSpareRecord.ID <= 0) {
				wServiceResult = wDMSService.DMS_InsertUseRecord(wBMSEmployee, wDMSSpareRecord);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSSpareRecord);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wDMSSpareRecord);
			}

		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}
}