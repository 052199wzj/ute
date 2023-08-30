package com.mes.server.controller.fmc;

import com.mes.server.controller.BaseController;
import com.mes.server.service.FMCService;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.fmc.FMCWorkArea;
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
@RequestMapping("/api/FMCWorkArea")
public class FMCWorkAreaController extends BaseController {

	private static Logger logger = LoggerFactory.getLogger(typeof(FMCWorkAreaController));

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

			int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));

			int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));

			int wWorkAreaID = StringUtils.parseInt(Request.QueryParamString("WorkAreaID"));

			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

			ServiceResult<List<FMCWorkArea>> wServiceResult = wFMCService.FMC_QueryWorkAreaList(wBMSEmployee,
					wWorkShopID, wLineID, wWorkAreaID, wActive);

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

			String wCode = StringUtils.parseString(Request.QueryParamString("Code"));

			ServiceResult<FMCWorkArea> wServiceResult = wFMCService.FMC_QueryWorkArea(wBMSEmployee, wID, wCode);

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.getResult());
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null,
						wServiceResult.getResult());
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

			FMCWorkArea wFMCWorkArea = CloneTool.Clone(wParam["data"], typeof(FMCWorkArea));
			@SuppressWarnings("unused")
			int wServerRst = 0;
			ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
			if (wFMCWorkArea.ID > 0) {
				wFMCWorkArea.Editor = wUserName;
				wFMCWorkArea.EditorID = wUserID;
				wFMCWorkArea.EditTime = DateTime.Now;
				wServiceResult = wFMCService.FMC_SaveWorkArea(wBMSEmployee, wFMCWorkArea);
				wServerRst = wServiceResult.Result;
			} else {
				wFMCWorkArea.Creator = wUserName;
				wFMCWorkArea.CreatorID = wUserID;
				wFMCWorkArea.CreateTime = DateTime.Now;
				wFMCWorkArea.Editor = wUserName;
				wFMCWorkArea.EditorID = wUserID;
				wFMCWorkArea.EditTime = DateTime.Now;
				wServiceResult = wFMCService.FMC_AddWorkArea(wBMSEmployee, wFMCWorkArea);
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

			List<FMCWorkArea> wFMCWorkAreaList = CloneTool.CloneArray(wParam["data"], typeof(FMCWorkArea));

			ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
			for (FMCWorkArea wFMCWorkArea : wFMCWorkAreaList) {
				if (wActive == 1) {
					wServiceResult = wFMCService.FMC_ActiveWorkArea(wBMSEmployee, wFMCWorkArea);
				} else {
					wServiceResult = wFMCService.FMC_DisableWorkArea(wBMSEmployee, wFMCWorkArea);
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
