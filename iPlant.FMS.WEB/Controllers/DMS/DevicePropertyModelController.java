package com.mes.server.controller.dms;

import com.mes.server.controller.BaseController;
import com.mes.server.service.DMSService;
import com.mes.server.service.mesenum.dms.DMSLedgerTypes;
import com.mes.server.service.mesenum.dms.DMSPropertyTypes;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.deviceLegder.DMSPropertyModel;
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
@RequestMapping("/api/DevicePropertyModel")
public class DevicePropertyModelController extends BaseController {

	private static Logger logger = LoggerFactory.getLogger(typeof(DevicePropertyModelController));

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

			int wPropertyID = StringUtils.parseInt(Request.QueryParamString("PropertyID"));
			String wPropertyName = StringUtils.parseString(Request.QueryParamString("PropertyName"));
			String wPropertyNo = StringUtils.parseString(Request.QueryParamString("PropertyNo"));
			int wPropertyType = StringUtils.parseInt(Request.QueryParamString("PropertyType"));
			int wDSType = StringUtils.parseInt(Request.QueryParamString("DSType"));
			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

			ServiceResult<List<DMSPropertyModel>> wServiceResult = wDMSService.DMS_GetPropertyModelList(wBMSEmployee,
					wPropertyID, wPropertyNo, wPropertyName, DMSPropertyTypes.getEnumType(wPropertyType),
					DMSLedgerTypes.getEnumType(wDSType), wActive);
			List<DMSPropertyModel> wServerRst = wServiceResult.getResult();

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
			int wUserID = wBMSEmployee.ID;

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			DMSPropertyModel wDMSPropertyModel = CloneTool.Clone(wParam["data"], typeof(DMSPropertyModel));

			wDMSPropertyModel.OperatorID = wUserID;
			wDMSPropertyModel.OperateTime = DateTime.Now;

			ServiceResult<Int32> wServiceResult = wDMSService.DMS_SavePropertyModel(wBMSEmployee, wDMSPropertyModel);

			if (StringUtils.isEmpty(wServiceResult.FaultCode)) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSPropertyModel);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.FaultCode);
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

			List<DMSPropertyModel> wDMSPropertyModelList = CloneTool.CloneArray(wParam["data"],
					typeof(DMSPropertyModel));

			int wActive = wParam.ContainsKey("Active") ? (int) wParam["Active"] : 0;

			List<Int32> wIDList = new List<Int32>();
			for (DMSPropertyModel wItem : wDMSPropertyModelList) {
				wIDList.Add(wItem.ID);
			}

			ServiceResult<Int32> wServiceResult = wDMSService.DMS_ActivePropertyModelList(wBMSEmployee, wIDList,
					wActive);

			if (StringUtils.isEmpty(wServiceResult.FaultCode)) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.FaultCode);
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}
}