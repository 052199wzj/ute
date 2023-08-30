
package com.mes.server.controller.cfg;

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
import com.mes.server.controller.utils.RMSRegionUtils;
import com.mes.server.service.RMSService;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.rms.RMSRegion;
import com.mes.server.utils.RetCode;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;

@RestController
@RequestMapping("/api/Area")
public class AreaController extends BaseController {
	private static Logger logger = LoggerFactory.getLogger(typeof(AreaController));

	@Autowired
	RMSService wRMSService;

	[HttpGet]
	public ActionResult All() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();

			ServiceResult<List<RMSRegion>> wServerRst = wRMSService.RMS_QueryRegionList(wBMSEmployee);

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
	public ActionResult Tree() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();

			ServiceResult<List<RMSRegion>> wServerRst = wRMSService.RMS_QueryRegionList(wBMSEmployee);

			wServerRst.Result = RMSRegionUtils.getInstance().ChangeToTree(wServerRst.Result);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst.getResult(), null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), wServerRst.getResult(), null);
			}

		} catch (Exception ex) {
			ex.printStackTrace();
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

			int wID = StringUtils.parseInt(Request.QueryParamString("ID"));

			ServiceResult<RMSRegion> wServerRst = wRMSService.RMS_QueryRegionByID(wBMSEmployee, wID);

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

	[HttpGet]
	public ActionResult Items() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();

			int wID = StringUtils.parseInt(Request.QueryParamString("ID"));

			ServiceResult<List<RMSRegion>> wServerRst = wRMSService.RMS_QueryRegionListByParentID(wBMSEmployee, wID,
					false);

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

	[HttpPost]
	public ActionResult Update() {

		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			String wUserName = wBMSEmployee.getName();
			int wUserID = wBMSEmployee.ID;
			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}
			RMSRegion wRMSRegion = CloneTool.Clone(wParam["data"], typeof(RMSRegion));

			ServiceResult<Int32> wServerRst = new ServiceResult<Int32>(0);
			int wID = wRMSRegion.ID;
			if (wID > 0) {
				wRMSRegion.Editor = wUserName;
				wRMSRegion.EditorID = wUserID;
				wServerRst = wRMSService.RMS_RenameRegion(wBMSEmployee, wRMSRegion);
			} else {
				wRMSRegion.Creator = wUserName;
				wRMSRegion.CreatorID = wUserID;
				wRMSRegion.Editor = wUserName;
				wRMSRegion.EditorID = wUserID;
				wServerRst = wRMSService.RMS_AddRegion(wBMSEmployee, wRMSRegion);
			}

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
	public ActionResult Active() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
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

			List<RMSRegion> wRMSRegionList = CloneTool.CloneArray(wParam["data"], typeof(RMSRegion));

			int wActive = wParam.ContainsKey("active") ? (int) wParam["active"] : 0;
			int wServerRst = 0;

			ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
			for (RMSRegion wRMSRegion : wRMSRegionList) {
				if (wRMSRegion.ID <= 0)
					continue;

				if (wActive == 1) {
					wServiceResult = wRMSService.RMS_ActiveRegion(wBMSEmployee, wRMSRegion.ID);
					wServerRst = wServiceResult.Result;

				} else {
					wServiceResult = wRMSService.RMS_DisableRegion(wBMSEmployee, wRMSRegion.ID);
					wServerRst = wServiceResult.Result;
				}
			}
			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.getResult());
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wServerRst);
			}

		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult Remove() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
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
			RMSRegion wRMSRegion = CloneTool.Clone(wParam["data"], typeof(RMSRegion));

			ServiceResult<Int32> wServiceResult = wRMSService.RMS_RemoveRegion(wBMSEmployee, wRMSRegion.ID);
			int wServerRst = wServiceResult.Result;

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.getResult());
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wServerRst);
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}
}
