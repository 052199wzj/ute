package com.mes.server.controller.fmc;

import java.util.Calendar;
import java.util.Dictionary;
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
import com.mes.server.service.FMCService;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.fmc.FMCWorkspace;
import com.mes.server.service.po.fmc.FMCWorkspaceRecord;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.utils.RetCode;

@RestController
@RequestMapping("/api/FMCWorkspace")
public class FMCWorkspaceController extends BaseController {
	private static Logger logger = LoggerFactory.getLogger(typeof(FMCWorkspaceController));
	@Autowired
	FMCService wFMCService;

	public FMCWorkspaceController() {
		// TODO Auto-generated constructor stub
	}

	[HttpGet]
	public ActionResult All() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.getCompanyID();
			int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
			int wPartID = StringUtils.parseInt(Request.QueryParamString("PartID"));
			int wPlaceType = StringUtils.parseInt(Request.QueryParamString("PlaceType"));
			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
			String wPartNo = StringUtils.parseString(Request.QueryParamString("PartNo"));
			ServiceResult<List<FMCWorkspace>> wServerRst = wFMCService.FMC_GetFMCWorkspaceList(wCompanyID, wUserID,
					wProductID, wPartID, wPartNo, wPlaceType, wActive);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst.getResult(), null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), wServerRst.getResult(), null);
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpGet]
	public ActionResult Record() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.getCompanyID();
			int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
			int wPartID = StringUtils.parseInt(Request.QueryParamString("PartID"));
			int wPlaceType = StringUtils.parseInt(Request.QueryParamString("PlaceType"));
			int wPlaceID = StringUtils.parseInt(Request.QueryParamString("PlaceID"));
			int wLimit = StringUtils.parseInt(Request.QueryParamString("Limit"));
			String wPartNo = StringUtils.parseString(Request.QueryParamString("PartNo"));

			Calendar wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
			Calendar wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

			ServiceResult<List<FMCWorkspaceRecord>> wServerRst = wFMCService.FMC_GetFMCWorkspaceRecordList(wCompanyID,
					wUserID, wProductID, wPartID, wPartNo, wPlaceID, wPlaceType, wLimit, wStartTime, wEndTime);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst.getResult(), null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), wServerRst.getResult(), null);
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpGet]
	public ActionResult Info() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.getCompanyID();
			int wID = StringUtils.parseInt(Request.QueryParamString("ID"));

			String wCode = StringUtils.parseString(Request.QueryParamString("Code"));
			ServiceResult<FMCWorkspace> wServerRst = wFMCService.FMC_GetFMCWorkspace(wCompanyID, wUserID, wID, wCode);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst.getResult());
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wServerRst.getResult());
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult Update() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.getCompanyID();
			String wUserName = wBMSEmployee.getName();

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			FMCWorkspace wFMCWorkspace = CloneTool.Clone(wParam["data"], typeof(FMCWorkspace));
			if (wFMCWorkspace == null) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}
			if (wFMCWorkspace.ID <= 0) {
				wFMCWorkspace.CreatorID = wUserID;
				wFMCWorkspace.Creator = wUserName;
				wFMCWorkspace.CreateTime = DateTime.Now;
			}
			wFMCWorkspace.EditorID = wUserID;
			wFMCWorkspace.Editor = wUserName;
			wFMCWorkspace.EditTime = DateTime.Now;

			ServiceResult<Int32> wServerRst = wFMCService.FMC_SaveFMCWorkspace(wCompanyID, wUserID, wFMCWorkspace);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wFMCWorkspace);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wFMCWorkspace);
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult Bind() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.getCompanyID();
			String wUserName = wBMSEmployee.getName();

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			FMCWorkspace wFMCWorkspace = CloneTool.Clone(wParam["data"], typeof(FMCWorkspace));

			wFMCWorkspace.EditorID = wUserID;
			wFMCWorkspace.Editor = wUserName;
			wFMCWorkspace.EditTime = DateTime.Now;

			ServiceResult<Int32> wServerRst = wFMCService.FMC_BindFMCWorkspace(wCompanyID, wUserID, wFMCWorkspace);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wFMCWorkspace);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wFMCWorkspace);
			}
		} catch (Exception ex) {

			logger.error("FMCWorkspaceController Bind Error:", ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult Active() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.getCompanyID();

			if (!wParam.ContainsKey("data") || !wParam.ContainsKey("Active")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}
			int wActive = StringUtils.parseInt(wParam["Active"]);
			List<FMCWorkspace> wFMCWorkspaceList = CloneTool.CloneArray(wParam["data"], typeof(FMCWorkspace));

			ServiceResult<Int32> wServerRst = new ServiceResult<Int32>(0);
			for (FMCWorkspace wFMCWorkspace : wFMCWorkspaceList) {
				wServerRst = wFMCService.FMC_ActiveFMCWorkspace(wCompanyID, wUserID, wActive, wFMCWorkspace);
				if (StringUtils.isNotEmpty(wServerRst.getFaultCode()))
					break;
			}

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode());
			}

		} catch (Exception ex) {
			ex.printStackTrace();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

}
