package com.mes.server.controller.dms.spare;

import com.mes.server.controller.BaseController;
import com.mes.server.service.DMSService;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.deviceLegder.spare.DMSSpareModel;
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
@RequestMapping("/api/SpareModel")
public class SpareModelController extends BaseController {

	private static Logger logger = LoggerFactory.getLogger(typeof(SpareModelController));

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

			int wSpareWorkType = StringUtils.parseInt(Request.QueryParamString("WorkType"));
			int wSupplierID = StringUtils.parseInt(Request.QueryParamString("SupplierID"));
			String wSupplierModelNo = StringUtils.parseString(Request.QueryParamString("SupplierModelNo"));
			int wModelPropertyID = StringUtils.parseInt(Request.QueryParamString("SupplierID"));
			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

			ServiceResult<List<DMSSpareModel>> wServiceResult = wDMSService.DMS_GetSpareModelList(wBMSEmployee,
					wSpareWorkType, wModelPropertyID, wSupplierID, wSupplierModelNo, wActive);

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

			DMSSpareModel wDMSSpareModel = CloneTool.Clone(wParam["data"], typeof(DMSSpareModel));

			wDMSSpareModel.OperatorID = wUserID;
			wDMSSpareModel.OperateTime = DateTime.Now;

			ServiceResult<Int32> wServiceResult = wDMSService.DMS_SaveSpareModel(wBMSEmployee, wDMSSpareModel);

			if (StringUtils.isEmpty(wServiceResult.FaultCode)) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSSpareModel);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.FaultCode, null, wDMSSpareModel);
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

			List<DMSSpareModel> wDMSSpareModelList = CloneTool.CloneArray(wParam["data"], typeof(DMSSpareModel));

			int wActive = wParam.ContainsKey("Active") ? (int) wParam["Active"] : 0;

			List<Int32> wIDList = new List<Int32>();
			for (DMSSpareModel wItem : wDMSSpareModelList) {
				wIDList.Add(wItem.ID);
			}

			wDMSService.DMS_ActiveSpareModelList(wBMSEmployee, wIDList, wActive);
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}
}