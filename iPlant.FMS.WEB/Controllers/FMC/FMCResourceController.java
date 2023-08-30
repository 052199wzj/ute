package com.mes.server.controller.fmc;

import com.mes.server.controller.BaseController;
import com.mes.server.service.FMCService;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.fmc.FMCResource;
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
@RequestMapping("/api/FMCResource")
public class FMCResourceController extends BaseController {
	private static Logger logger = LoggerFactory.getLogger(typeof(FMCResourceController));

	@Autowired
	FMCService wFMCService;

	@GetMapping("/All")
	public Object All() {
		Object wResult = new Object();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();

			int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
			int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
			int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
			int wStationID = StringUtils.parseInt(Request.QueryParamString("StationID"));
			int wType = StringUtils.parseInt(Request.QueryParamString("Type"));
			int wResourceID = StringUtils.parseInt(Request.QueryParamString("ResourceID"));
			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

			ServiceResult<List<FMCResource>> wServiceResult = wFMCService.FMC_QueryResourceList(wBMSEmployee,
					wWorkShopID, wLineID, wStationID, wAreaID, wResourceID, wType, wActive);

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.getResult(),
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

			ServiceResult<FMCResource> wServiceResult = wFMCService.FMC_QueryResourceByID(wBMSEmployee, wID);
			FMCResource wServerRst = wServiceResult.Result;

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
			int wUserID = wBMSEmployee.ID;
			String wUserName = wBMSEmployee.Name;

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			FMCResource wFMCResource = CloneTool.Clone(wParam["data"], typeof(FMCResource));

			@SuppressWarnings("unused")
			int wServerRst = 0;
			ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
			if (wFMCResource.ID > 0) {
				wFMCResource.Editor = wUserName;
				wFMCResource.EditorID = wUserID;
				wFMCResource.EditTime = DateTime.Now;
				wServiceResult = wFMCService.FMC_SaveResource(wBMSEmployee, wFMCResource);
				wServerRst = wServiceResult.Result;
			} else {
				wFMCResource.Creator = wUserName;
				wFMCResource.CreatorID = wUserID;
				wFMCResource.CreateTime = DateTime.Now;
				wFMCResource.Editor = wUserName;
				wFMCResource.EditorID = wUserID;
				wFMCResource.EditTime = DateTime.Now;
				wServiceResult = wFMCService.FMC_AddResource(wBMSEmployee, wFMCResource);
				wServerRst = wServiceResult.Result;
			}

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
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

			int wActive = wParam.ContainsKey("Active") ? (int) wParam["Active"] : 0;

			List<FMCResource> wFMCResourceList = CloneTool.CloneArray(wParam["data"], typeof(FMCResource));

			ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
			for (FMCResource wFMCResource : wFMCResourceList) {
				if (wActive == 1) {
					wServiceResult = wFMCService.FMC_ActiveResource(wBMSEmployee, wFMCResource);
				} else {
					wServiceResult = wFMCService.FMC_DisableResource(wBMSEmployee, wFMCResource);
				}

				if (!StringUtils.isEmpty(wServiceResult.getFaultCode()))
					break;
			}

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}
}
