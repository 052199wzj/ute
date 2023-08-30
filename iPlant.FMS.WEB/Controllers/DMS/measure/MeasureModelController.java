package com.mes.server.controller.dms.measure;

import com.mes.server.controller.BaseController;
import com.mes.server.service.DMSService;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.deviceLegder.measure.DMSMeasureModel;
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
@RequestMapping("/api/MeasureModel")
public class MeasureModelController extends BaseController {

	private static Logger logger = LoggerFactory.getLogger(typeof(MeasureModelController));

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

			int wWorkType = StringUtils.parseInt(Request.QueryParamString("WorkType"));
			int wSupplierID = StringUtils.parseInt(Request.QueryParamString("SupplierID"));
			String wSupplierModelNo = StringUtils.parseString(Request.QueryParamString("SupplierModelNo")); 
			int wMeasureModel = StringUtils.parseInt(Request.QueryParamString("MeasureModel"));
			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

			ServiceResult<List<DMSMeasureModel>> wServiceResult = wDMSService.DMS_GetMeasureModelList(wBMSEmployee,
					wWorkType,  wSupplierID, wSupplierModelNo, wMeasureModel, wActive);

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

			int wID = StringUtils.parseInt(Request.QueryParamString("ID"));
			String wCode = StringUtils.parseString(Request.QueryParamString("Code"));

			ServiceResult<DMSMeasureModel> wServiceResult = wDMSService.DMS_GetMeasureModel(wBMSEmployee, wID, wCode);
			DMSMeasureModel wServerRst = wServiceResult.getResult();

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

			DMSMeasureModel wDMSMeasureModel = CloneTool.Clone(wParam["data"], typeof(DMSMeasureModel));

			ServiceResult<Int32> wServiceResult = wDMSService.DMS_SaveMeasureModel(wBMSEmployee, wDMSMeasureModel);

			if (StringUtils.isEmpty(wServiceResult.FaultCode)) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSMeasureModel);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.FaultCode, null, wDMSMeasureModel);
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

			List<DMSMeasureModel> wDMSMeasureModelList = CloneTool.CloneArray(wParam["data"],
					typeof(DMSMeasureModel));

			int wActive = wParam.ContainsKey("Active") ? (int) wParam["Active"] : 0;

			List<Int32> wIDList = new List<Int32>();
			for (DMSMeasureModel wItem : wDMSMeasureModelList) {
				wIDList.Add(wItem.ModelID);
			}

			ServiceResult<Int32> wServiceResult = wDMSService.DMS_ActiveMeasureModelList(wBMSEmployee, wIDList,
					wActive);

			if (StringUtils.isEmpty(wServiceResult.FaultCode)) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wDMSMeasureModelList, null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.FaultCode, wDMSMeasureModelList, null);
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

			DMSMeasureModel wDMSMeasureModel = CloneTool.Clone(wParam["data"], typeof(DMSMeasureModel));

			ServiceResult<Int32> wServiceResult = wDMSService.DMS_DeleteMeasureModel(wBMSEmployee, wDMSMeasureModel);

			if (StringUtils.isEmpty(wServiceResult.FaultCode)) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSMeasureModel);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.FaultCode, null, wDMSMeasureModel);
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}
}