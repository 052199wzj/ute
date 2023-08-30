package com.mes.server.serviceimpl.dao.bms;

import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mes.server.service.mesenum.DBEnumType;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.po.OutResult;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.shristool.LoggerTool;


import com.mes.server.service.utils.StringUtils;

public class ADCardDAO extends BaseDAO {
	private static ADCardDAO Instance = null;

	private ADCardDAO() {
		super(DBEnumType.SQLServer);
	}
	private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(typeof(ADCardDAO));
	public static ADCardDAO getInstance() {
		if (Instance == null)
			Instance = new ADCardDAO();
		return Instance;
	}

	public String ADC_GetLoginIDByCardID(String wCardID, OutResult<Int32> wErrorCode) {

		String wResult = "";
		try {

			if (StringUtils.isEmpty(wCardID)) {
				wErrorCode.set(MESException.Parameter.Value);
				return wResult;
			}
			String wSQLText = StringUtils
					.Format("select emp_id from  ICCO.dbo.Employee  where card_sn=@CardID and issued = 1; ");

			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Clear();

			wParms.Add("CardID", wCardID);
			wSQLText = this.DMLChange(wSQLText);
			List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
			for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
				wResult = StringUtils.parseString(wSqlDataReader["emp_id"]);
			}
			wResult=wResult.Trim();

		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			LoggerTool.SaveException("ADCardDAO", "ADC_GetLoginIDByCardID ", ex);

		}
		return wResult;
	}

}
