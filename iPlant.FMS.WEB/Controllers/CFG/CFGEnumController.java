
package com.mes.server.controller.cfg;

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
import com.mes.server.service.MESService;
import com.mes.server.service.mesenum.MESEnumModlue;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.cfg.CFGItem;
import com.mes.server.utils.RetCode;
import com.mes.server.service.utils.StringUtils;

@RestController
@RequestMapping("/api/MESEnum")
public class CFGEnumController extends BaseController {
	private static Logger logger = LoggerFactory.getLogger(typeof(CFGEnumController));

	@Autowired
	MESService wMESService;

	[HttpGet]
	public ActionResult All() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			int wModule = StringUtils.parseInt(Request.QueryParamString("module"));

			ServiceResult<List<CFGItem>> wServerRst = wMESService.MES_GetEnumList((MESEnumModlue.getEnumType(wModule)));
			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst.getResult(), null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, wServerRst.getFaultCode(), wServerRst.getResult(), null);
			}

			/*
			 * if (StringUtils.isEmpty(wServerRst.getFaultCode())) { wResult =
			 * GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst.getResult(), null); } else
			 * { wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(),
			 * wServerRst.getResult(), null); }
			 */
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}
}