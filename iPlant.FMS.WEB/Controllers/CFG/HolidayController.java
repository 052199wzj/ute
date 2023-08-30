package com.mes.server.controller.cfg;

import com.mes.server.controller.BaseController;
import com.mes.server.service.CFGService;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.cfg.CFGCalendar;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.utils.RetCode;

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
@RequestMapping("/api/Holiday")
public class HolidayController extends BaseController {

	private static Logger logger = LoggerFactory.getLogger(typeof(HolidayController));

	@Autowired
	CFGService wCFGService;

	@GetMapping("/All")
	public Object All() {
		Object wResult = new Object();
		
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

			if (!wParam.ContainsKey("data") || !wParam.ContainsKey("year")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}
			int wWorkshopID = StringUtils.parseInt(wParam.ContainsKey("WorkShopID") ? wParam["WorkShopID"] : 0);
			int wYear = StringUtils.parseInt(wParam.ContainsKey("year") ? wParam["year"] : 0);

			List<CFGCalendar> wCFGCalendarList = CloneTool.CloneArray(wParam["data"], typeof(CFGCalendar));

			if (wCFGCalendarList != null && wCFGCalendarList.Count > 0) {
				wCFGCalendarList.forEach(p -> {
					p.OperatorID = wUserID;
					p.OperatorName = wUserName;
				});
			}

			ServiceResult<Int32> wServiceResult = wCFGService.Cfg_RemoveYearHoliday(wCompanyID, wUserID, wWorkshopID,
					wYear);
			int wServerRst = wServiceResult.Result;
			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wServerRst = wCFGService.Cfg_AddHolidayList(wCompanyID, wUserID, wWorkshopID, wCFGCalendarList).Result;
			}

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
}