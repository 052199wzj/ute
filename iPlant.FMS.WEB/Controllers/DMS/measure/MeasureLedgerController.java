package com.mes.server.controller.dms.measure;

import com.mes.server.service.po.excel.ExcelData;
import com.mes.server.utils.ExcelReader;
import com.mes.server.controller.BaseController;
import com.mes.server.service.DMSService;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.deviceLegder.measure.DMSMeasureLedger;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/MeasureLedger")
public class MeasureLedgerController extends BaseController {

	private static Logger logger = LoggerFactory.getLogger(typeof(MeasureLedgerController));

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
			int wModelID = StringUtils.parseInt(Request.QueryParamString("ModelID"));
			int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
			int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
			int wPartID = StringUtils.parseInt(Request.QueryParamString("PartID"));
			int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
			int wSupplierID = StringUtils.parseInt(Request.QueryParamString("SupplierID"));
			String wSupplierModelNo = StringUtils.parseString(Request.QueryParamString("SupplierModelNo"));
			int wCalibrationLevel = StringUtils.parseInt(Request.QueryParamString("CalibrationLevel"));
			List<Int32> wStatus = StringUtils.parseIntList(Request.QueryParamString("Status"), ",");

			ServiceResult<List<DMSMeasureLedger>> wServiceResult = wDMSService.DMS_GetMeasureLedgerList(wBMSEmployee,
					wWorkType, wSupplierID, wSupplierModelNo, wCalibrationLevel, wModelID, wWorkShopID, wLineID,
					wPartID, wDeviceID, wStatus);

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

			ServiceResult<DMSMeasureLedger> wServiceResult = wDMSService.DMS_GetMeasureLedger(wBMSEmployee, wID, wCode);
			DMSMeasureLedger wServerRst = wServiceResult.getResult();

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

	/**
	 * 导入量具信息
	 * 
	 * @param request
	 * @param files
	 * @param wIPTMode
	 * @param wLineID
	 * @param wProductID
	 * @param wPartID
	 * @param wCustomerID
	 * @return
	 */
	@PostMapping("/Import")
	public Object Import(, @RequestParam("file") MultipartFile[] files) {
		Object wResult = new Object();
		try {
//			if (CheckCookieEmpty()) {
//				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
//				return wResult;
//			}
//
//			BMSEmployee wLoginUser = GetSession();
			BMSEmployee wLoginUser=BaseDAO.SysAdmin;
			if (files.length == 0) {
				return GetResult(RetCode.SERVER_CODE_ERR, "提示：没有要上传的Excel文件！");
			}

			ServiceResult<List<DMSMeasureLedger>> wServiceResult = new ServiceResult<>();
			ServiceResult<ExcelData> wExcelData = null;
			String wOriginalFileName = null;
			for (MultipartFile wMultipartFile : files) {
				wOriginalFileName = wMultipartFile.getOriginalFilename();

				if (wOriginalFileName.contains("xlsx"))
					wExcelData = ExcelReader.getInstance().readMultiSheetExcel(wMultipartFile.getInputStream(),
							wOriginalFileName, "xlsx", 1000000);
				else if (wOriginalFileName.contains("xls"))
					wExcelData = ExcelReader.getInstance().readMultiSheetExcel(wMultipartFile.getInputStream(),
							wOriginalFileName, "xls", 1000000);

				if (StringUtils.isNotEmpty(wExcelData.FaultCode)) {
					wResult = GetResult(RetCode.SERVER_CODE_ERR, wExcelData.FaultCode);
					return wResult;
				}

				wServiceResult = wDMSService.DMS_ImportMeasureLedger(wLoginUser, wExcelData.Result);
				// 数据处理 并验证保存

				if (!StringUtils.isEmpty(wServiceResult.FaultCode)) {
					wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.FaultCode);
					return wResult;
				}
			}

			if (StringUtils.isEmpty(wServiceResult.FaultCode)) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "导入成功!", wServiceResult.Result, null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.FaultCode);
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

			DMSMeasureLedger wDMSMeasureLedger = CloneTool.Clone(wParam["data"], typeof(DMSMeasureLedger));

			ServiceResult<Int32> wServiceResult = wDMSService.DMS_SaveMeasureLedger(wBMSEmployee, wDMSMeasureLedger);

			if (StringUtils.isEmpty(wServiceResult.FaultCode)) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSMeasureLedger);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.FaultCode, null, wDMSMeasureLedger);
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

			DMSMeasureLedger wDMSMeasureLedger = CloneTool.Clone(wParam["data"], typeof(DMSMeasureLedger));

			ServiceResult<Int32> wServiceResult = wDMSService.DMS_DeleteMeasureLedger(wBMSEmployee,
					wDMSMeasureLedger);

			if (StringUtils.isEmpty(wServiceResult.FaultCode)) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSMeasureLedger);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.FaultCode, null, wDMSMeasureLedger);
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}
}