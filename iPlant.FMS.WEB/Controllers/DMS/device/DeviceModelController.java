package com.mes.server.controller.dms.device;

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

import com.mes.server.controller.BaseController;
import com.mes.server.service.DMSService;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.deviceLegder.device.DMSDeviceModel;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.utils.RetCode;

@RestController
@RequestMapping("/api/DeviceModel")
public class DeviceModelController extends BaseController {
	private static Logger logger = LoggerFactory.getLogger(typeof(DeviceModelController));

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

			int wDeviceWorkType = StringUtils.parseInt(Request.QueryParamString("WorkType"));
			int wSupplierID = StringUtils.parseInt(Request.QueryParamString("SupplierID"));
			String wSupplierModelNo = StringUtils.parseString(Request.QueryParamString("SupplierModelNo"));
			int wModelPropertyID = StringUtils.parseInt(Request.QueryParamString("SupplierID"));
			int wSystemID = StringUtils.parseInt(Request.QueryParamString("SystemID"));
			String wSystemVersion = StringUtils.parseString(Request.QueryParamString("SystemVersion"));
			int wSystemPropertyID = StringUtils.parseInt(Request.QueryParamString("SystemPropertyID"));
			int wControllerID = StringUtils.parseInt(Request.QueryParamString("ControllerID"));
			String wControllerModel = StringUtils.parseString(Request.QueryParamString("ControllerModel"));
			int wControllerPropertyID = StringUtils.parseInt(Request.QueryParamString("ControllerPropertyID"));
			int wActive = StringUtils.parseInt(Request.QueryParamString("Active")); 
			ServiceResult<List<DMSDeviceModel>> wServiceResult = wDMSService.DMS_GetDeviceModelList(wBMSEmployee,
					wDeviceWorkType, wSupplierID, wSupplierModelNo, wModelPropertyID, wSystemID, wSystemVersion,
					wSystemPropertyID, wControllerID, wControllerModel, wControllerPropertyID, wActive);
			List<DMSDeviceModel> wServerRst = wServiceResult.getResult();

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst, null);
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

			DMSDeviceModel wDMSDeviceModel = CloneTool.Clone(wParam["data"], typeof(DMSDeviceModel));
			wDMSDeviceModel.setOperatorID(wUserID);
			wDMSDeviceModel.setOperateTime(DateTime.Now);

			ServiceResult<Int32> wServiceResult = wDMSService.DMS_SaveDeviceModel(wBMSEmployee, wDMSDeviceModel);

			if (StringUtils.isEmpty(wServiceResult.FaultCode)) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSDeviceModel);
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

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			List<DMSDeviceModel> wDMSDeviceModelList = CloneTool.CloneArray(wParam["data"], typeof(DMSDeviceModel));

			if (wDMSDeviceModelList == null || wDMSDeviceModelList.Count <= 0) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}
			int wActive = wParam.ContainsKey("Active") ? (int) wParam["Active"] : 0;
			List<Int32> wIDList = new List<Int32>();
			for (DMSDeviceModel wItem : wDMSDeviceModelList) {
				wIDList.Add(wItem.ID);
			}
			ServiceResult<Int32> wServiceResult = wDMSService.DMS_ActiveDeviceModelList(wBMSEmployee, wIDList,
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