package com.mes.server.controller.fmc;

import com.mes.server.controller.BaseController;
import com.mes.server.service.FMCService;
import com.mes.server.service.mesenum.APSUnitLevel;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.fmc.FMCLineUnit;
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
@RequestMapping("/api/FMCLineUnit")
public class FMCLineUnitController extends BaseController {
	private static Logger logger = LoggerFactory.getLogger(typeof(FMCLineUnitController));

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
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.CompanyID;

			int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
			int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
			int wCustomerID = StringUtils.parseInt(Request.QueryParamString("CustomerID"));

			int wIsStruct = StringUtils.parseInt(Request.QueryParamString("IsStruct"));

			int wID = StringUtils.parseInt(Request.QueryParamString("ID"));

			ServiceResult<List<FMCLineUnit>> wServiceResult = wFMCService.FMC_QueryLineUnitListByLineID(wCompanyID,
					wUserID, wProductID, wCustomerID, wLineID, wID, wIsStruct != 1);
			List<FMCLineUnit> wServerRst = wServiceResult.Result;

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

	@GetMapping("/StationPart")
	public Object StationPart() {
		Object wResult = new Object();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.CompanyID;

			int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
			int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
			int wCustomerID = StringUtils.parseInt(Request.QueryParamString("CustomerID"));

			int wStationID = StringUtils.parseInt(Request.QueryParamString("StationID"));

			ServiceResult<List<FMCLineUnit>> wServiceResult = wFMCService.FMC_QueryLineUnitListByStationID(wCompanyID,
					wUserID, wProductID, wCustomerID, wLineID, wStationID);
			List<FMCLineUnit> wServerRst = wServiceResult.Result;

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

	@GetMapping("/PartStation")
	public Object PartStation() {
		Object wResult = new Object();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.CompanyID;

			int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
			int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
			int wCustomerID = StringUtils.parseInt(Request.QueryParamString("CustomerID"));

			int wPartID = StringUtils.parseInt(Request.QueryParamString("PartID"));

			ServiceResult<List<FMCLineUnit>> wServiceResult = wFMCService.FMC_QueryLineUnitListByPartID(wCompanyID,
					wUserID, wProductID, wCustomerID, wLineID, wPartID);
			List<FMCLineUnit> wServerRst = wServiceResult.Result;

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

	@GetMapping("/Tree")
	public Object Tree() {
		Object wResult = new Object();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.CompanyID;

			int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));

			int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
			int wCustomerID = StringUtils.parseInt(Request.QueryParamString("CustomerID"));
			int wID = StringUtils.parseInt(Request.QueryParamString("ID"));

			ServiceResult<List<FMCLineUnit>> wServiceResult = wFMCService.FMC_QueryLineUnitListByLineID(wCompanyID,
					wUserID, wProductID, wCustomerID, wLineID, wID, false);
			List<FMCLineUnit> wServerRst = wServiceResult.Result;

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
			int wCompanyID = wBMSEmployee.CompanyID;
			String wUserName = wBMSEmployee.Name;

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			FMCLineUnit wFMCLineUnit = CloneTool.Clone(wParam["data"], typeof(FMCLineUnit));

			if (wFMCLineUnit.LevelID != (int)APSUnitLevel.Station()) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, "接口弃用");
				return wResult;
			}

			@SuppressWarnings("unused")
			int wServerRst = 0;
			ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
			if (wFMCLineUnit.ID > 0) {
				wFMCLineUnit.Editor = wUserName;
				wFMCLineUnit.EditorID = wUserID;
				wFMCLineUnit.EditTime = DateTime.Now;
				wServiceResult = wFMCService.FMC_SaveLineUnit(wCompanyID, wUserID, wFMCLineUnit);
				wServerRst = wServiceResult.Result;
			} else {
				wFMCLineUnit.Creator = wUserName;
				wFMCLineUnit.CreatorID = wUserID;
				wFMCLineUnit.CreateTime = DateTime.Now;
				wFMCLineUnit.Editor = wUserName;
				wFMCLineUnit.EditorID = wUserID;
				wFMCLineUnit.EditTime = DateTime.Now;
				wServiceResult = wFMCService.FMC_AddLineUnit(wCompanyID, wUserID, wFMCLineUnit);
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

	@GetMapping("/Copy")
	public Object Copy() {
		Object wResult = new Object();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.CompanyID;

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));

			int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
			int wCustomerID = StringUtils.parseInt(Request.QueryParamString("CustomerID"));

			int wNewLineID = StringUtils.parseInt(Request.QueryParamString("NewLineID"));

			int wNewProductID = StringUtils.parseInt(Request.QueryParamString("NewProductID"));
			int wNewCustomerID = StringUtils.parseInt(Request.QueryParamString("NewCustomerID"));

			ServiceResult<Int32> wServiceResult = wFMCService.FMC_CopyLineUnit(wCompanyID, wUserID, wLineID,
					wProductID, wCustomerID, wNewLineID, wNewProductID, wNewCustomerID);

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

			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.CompanyID;

			@SuppressWarnings("unused")
			String wUserName = wBMSEmployee.Name;

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			int wActive = wParam.ContainsKey("Active") ? (int) wParam["Active"] : 0;

			List<FMCLineUnit> wFMCLineUnitList = CloneTool.CloneArray(wParam["data"], typeof(FMCLineUnit));
			ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
			for (FMCLineUnit wFMCLineUnit : wFMCLineUnitList) {

				if (wFMCLineUnit.LevelID != (int)APSUnitLevel.Station()) {
					wResult = GetResult(RetCode.SERVER_CODE_ERR, "接口弃用");
					return wResult;
				}

				if (wActive == 1) {
					wServiceResult = wFMCService.FMC_ActiveLineUnit(wCompanyID, wUserID, wFMCLineUnit);
				} else {
					wServiceResult = wFMCService.FMC_DisableLineUnit(wCompanyID, wUserID, wFMCLineUnit);
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

	@PostMapping("/Remove")
	public Object Remove() {
		Object wResult = new Object();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();

			int wUserID = wBMSEmployee.ID;
			int wCompanyID = wBMSEmployee.CompanyID;

			@SuppressWarnings("unused")
			String wUserName = wBMSEmployee.Name;

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			FMCLineUnit wFMCLineUnit = CloneTool.Clone(wParam["data"], typeof(FMCLineUnit));

			if (wFMCLineUnit.LevelID != (int)APSUnitLevel.Station()) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, "接口弃用");
				return wResult;
			}
			ServiceResult<Int32> wServiceResult = wFMCService.FMC_DeleteLineUnitByID(wCompanyID, wUserID,
					wFMCLineUnit.ID);

			@SuppressWarnings("unused")
			int wServerRst = wServiceResult.Result;

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
