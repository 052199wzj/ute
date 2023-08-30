package com.mes.server.controller.dms.measure;

import com.mes.server.controller.BaseController;
import com.mes.server.service.DMSService;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.deviceLegder.measure.DMSCalibrationLevel;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.utils.RetCode;

import java.util.List;
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
@RequestMapping("/api/CalibrationLevel")
public class CalibrationLevelController extends BaseController {

	private static Logger logger = LoggerFactory.getLogger(typeof(CalibrationLevelController));

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

			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

			ServiceResult<List<DMSCalibrationLevel>> wServiceResult = wDMSService
					.DMS_GetCalibrationLevelList(wBMSEmployee, wActive);

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.Result,
						null);
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
			String wCode = StringUtils.parseString(Request.QueryParamString("Code"));

			ServiceResult<DMSCalibrationLevel> wServiceResult = wDMSService.DMS_GetCalibrationLevel(wBMSEmployee, wID,
					wCode);
			DMSCalibrationLevel wServerRst = wServiceResult.getResult();

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

			DMSCalibrationLevel wDMSCalibrationLevel = CloneTool.Clone(wParam["data"], typeof(DMSCalibrationLevel));

			ServiceResult<Int32> wServiceResult = wDMSService.DMS_SaveCalibrationLevel(wBMSEmployee,
					wDMSCalibrationLevel);

			if (StringUtils.isEmpty(wServiceResult.FaultCode)) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSCalibrationLevel);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.FaultCode, null, wDMSCalibrationLevel);
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

			List<DMSCalibrationLevel> wDMSCalibrationLevelList = CloneTool.CloneArray(wParam["data"],
					typeof(DMSCalibrationLevel));

			int wActive = wParam.ContainsKey("Active") ? (int) wParam["Active"] : 0;

			List<Int32> wIDList = new List<Int32>();
			for (DMSCalibrationLevel wItem : wDMSCalibrationLevelList) {
				wIDList.Add(wItem.ID);
			}

			ServiceResult<Int32> wServiceResult = wDMSService.DMS_ActiveCalibrationLevelList(wBMSEmployee, wIDList,
					wActive);

			if (StringUtils.isEmpty(wServiceResult.FaultCode)) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wDMSCalibrationLevelList, null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.FaultCode, wDMSCalibrationLevelList, null);
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	@PostMapping("/Delete")
	public Object Delete() {
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

			DMSCalibrationLevel wDMSCalibrationLevel = CloneTool.Clone(wParam["data"], typeof(DMSCalibrationLevel));

			ServiceResult<Int32> wServiceResult = wDMSService.DMS_DeleteCalibrationLevel(wBMSEmployee,
					wDMSCalibrationLevel);

			if (StringUtils.isEmpty(wServiceResult.FaultCode)) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSCalibrationLevel);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.FaultCode, null, wDMSCalibrationLevel);
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}
}