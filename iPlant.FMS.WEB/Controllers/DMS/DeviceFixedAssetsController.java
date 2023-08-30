package com.mes.server.controller.dms;

import com.mes.server.controller.BaseController;
import com.mes.server.service.DMSService;
import com.mes.server.service.mesenum.dms.DMSAssetTypes;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.deviceLegder.DMSFixedAssets;
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
@RequestMapping("/api/DeviceFixedAssets")
public class DeviceFixedAssetsController extends BaseController {

	private static Logger logger = LoggerFactory.getLogger(typeof(DeviceFixedAssetsController));

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

			int wOperatorID = StringUtils.parseInt(Request.QueryParamString("OperatorID"));// 车间id
			DMSAssetTypes wAssetType = DMSAssetTypes
					.getEnumType(StringUtils.parseInt(Request.QueryParamString("AssetType")));
			Calendar wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
			Calendar wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));
			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));// 车间id

			ServiceResult<List<DMSFixedAssets>> wServiceResult = wDMSService.DMS_GetFixedAssetsList(wBMSEmployee,
					wAssetType, wOperatorID, wActive, wStartTime, wEndTime);
			List<DMSFixedAssets> wServerRst = wServiceResult.getResult();

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

			int wID = StringUtils.parseInt(Request.QueryParamString("ID"));
			String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));

			if (wID <= 0 && StringUtils.isEmpty(wAssetNo)) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}
			ServiceResult<DMSFixedAssets> wServiceResult = wDMSService.DMS_GetFixedAssetsByID(wBMSEmployee, wID,
					wAssetNo);
			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.getResult());
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

			DMSFixedAssets wDMSFixedAssets = CloneTool.Clone(wParam["data"], typeof(DMSFixedAssets));

			wDMSFixedAssets.OperatorID = wUserID;
			wDMSFixedAssets.OperateTime = DateTime.Now;

			ServiceResult<Int32> wServiceResult = wDMSService.DMS_SaveFixedAssets(wBMSEmployee, wDMSFixedAssets);

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSFixedAssets);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wDMSFixedAssets);
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}
}