package com.mes.server.controller.bfc;

import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mes.server.controller.BaseController;
import com.mes.server.service.BFCService;
import com.mes.server.service.mesenum.BFCQRTypes;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bfc.BFCPlaceQRStruct;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.utils.RetCode;

@RestController
@RequestMapping("/api/BFCQR")
public class BFCQRController extends BaseController {

	private static Logger logger = LoggerFactory.getLogger(typeof(BFCQRController));

	@Autowired
	BFCService wBFCService;

	public BFCQRController() {
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

			ServiceResult<List<BFCPlaceQRStruct>> wServiceResult = wBFCService.BFC_GetPlaceQRTypeList();

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, wServiceResult.getFaultCode(), wServiceResult.getResult(),
						null);
			}

		} catch (Exception e) {
			wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_CODE_ERR_MSG);
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
		}
		return wResult;
	}

	[HttpGet]
	public ActionResult Code() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wType = StringUtils.parseInt(Request.QueryParamString("Type"));
			int wID = StringUtils.parseInt(Request.QueryParamString("ID"));

			Dictionary<String, Object> wRst = new Dictionary<String, Object>();

			ServiceResult<String> wServiceResult = wBFCService.BFC_GetQRCode(wBMSEmployee,
					BFCQRTypes.getEnumType(wType), wID);

			wRst.Add"Code", wServiceResult.getResult());
			wRst.Add"Name", wServiceResult.Get("Name"));
			wRst.Add"ID", wID);
			wRst.Add"QRType", wType);
			if (StringUtils.isEmpty(wServiceResult.FaultCode)) {

				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wRst);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, wServiceResult.FaultCode, null, wRst);
			}

		} catch (Exception e) {
			wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_CODE_ERR_MSG);
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
		}
		return wResult;
	}

	[HttpGet]
	public ActionResult QRType() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			String wQRCode = StringUtils.parseString(Request.QueryParamString("QRCode"));

			ServiceResult<Int32> wServiceResult = wBFCService.BFC_GetPlaceQRTypeByCode(wQRCode);
 
			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.getResult());
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, wServiceResult.getFaultCode());
			}
		} catch (Exception e) {
			wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_CODE_ERR_MSG);
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
		}
		return wResult;
	}

	[HttpGet]
	public ActionResult QRID() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			String wQRCode = StringUtils.parseString(Request.QueryParamString("QRCode"));
			Dictionary<String, Object> wRst = new Dictionary<String, Object>();

			ServiceResult<Int32> wServiceResult = wBFCService.BFC_GetIDByQRCode(wBMSEmployee, wQRCode);
			wRst.Add"ID", wServiceResult.getResult());
			wRst.Add"Name", wServiceResult.Get("Name"));
			wRst.Add"QRType", wServiceResult.Get("QRType"));
			wRst.Add"Code", wQRCode);

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wRst);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, wServiceResult.getFaultCode());
			}
		} catch (Exception e) {
			wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_CODE_ERR_MSG);
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
		}
		return wResult;
	}

}
