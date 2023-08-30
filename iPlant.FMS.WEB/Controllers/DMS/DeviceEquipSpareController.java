package com.mes.server.controller.dms;

import com.mes.server.controller.BaseController;
import com.mes.server.service.DMSService;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.deviceLegder.DMSEquipSpare;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.utils.RetCode;

import java.util.List;
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
@RequestMapping("/api/DeviceEquipSpare")
public class DeviceEquipSpareController extends BaseController {

	private static Logger logger = LoggerFactory.getLogger(typeof(DeviceEquipSpareController));

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

			String wDeviceSpareName = StringUtils.parseString(Request.QueryParamString("DeviceSpareName"));
			int wDeviceModelID = StringUtils.parseInt(Request.QueryParamString("DeviceModelID"));
			int wSpareModelID = StringUtils.parseInt(Request.QueryParamString("SpareModelID"));
			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
			Calendar wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
			Calendar wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

			ServiceResult<List<DMSEquipSpare>> wServiceResult = wDMSService.DMS_GetEquipSpareList(wBMSEmployee,
					wDeviceSpareName, wDeviceModelID, wSpareModelID, wActive, wStartTime, wEndTime);
			List<DMSEquipSpare> wServerRst = wServiceResult.getResult();

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
			DMSEquipSpare wDMSEquipSpare = CloneTool.Clone(wParam["data"], typeof(DMSEquipSpare));

			ServiceResult<Int32> wServiceResult = wDMSService.DMS_SaveEquipSpare(wBMSEmployee, wDMSEquipSpare);

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSEquipSpare);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wDMSEquipSpare);
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
			 

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}
			List<DMSEquipSpare> wDMSEquipSpareList = CloneTool.CloneArray(wParam["data"], typeof(DMSEquipSpare));

			int wActive = wParam.ContainsKey("Active") ? (int) wParam["Active"] : 0;

			List<Int32> wIDList = new List<Int32>();
			for (DMSEquipSpare wItem : wDMSEquipSpareList) {
				wIDList.Add(wItem.ID);
			}

			wDMSService.DMS_ActiveEquipSpareList(wBMSEmployee, wIDList, wActive);
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}
}