package com.mes.server.serviceimpl.dao.dms;

import java.util.List;
import java.util.DateTime;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.stockWarning.DMSStockWarning;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.mesenum.dms.DMSLedgerTypes;

public class DeviceStockWarningDAO extends BaseDAO {
	private static Logger logger = LoggerFactory.getLogger(typeof(DeviceStockWarningDAO));

	private static DeviceStockWarningDAO Instance;

	private DeviceStockWarningDAO() {
		super();
	}

	public static DeviceStockWarningDAO getInstance() {
		if (Instance == null)
			Instance = new DeviceStockWarningDAO();
		return Instance;
	}

	// (public\s+[a-zA-z0-9_\<\>\,]+\s+[a-zA-z0-9_\<\>]+\()([^\)]*)\)
	// $1BMSEmployee wLoginUser,$2,OutResult<Int32> wErrorCode)

	public List<DMSStockWarning> SelectAll(BMSEmployee wLoginUser, long wID, int wModelID, String wModelNo,
			int wWorkType, int wSupplierID, String wSupplierModelNo, DMSLedgerTypes wDSType, int wActive,
			DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode) {
		List<DMSStockWarning> wResult = new List<DMSStockWarning>();
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;
			DateTime wBaseTime = DateTime.Now;
			wBaseTime.set(2000, 0, 1);
			if ( wStartTime.CompareTo(wBaseTime) < 0)
				wStartTime = wBaseTime;
			if ( wEndTime.CompareTo(wBaseTime) < 0)
				wEndTime = wBaseTime;
			if (wStartTime.CompareTo(wEndTime) > 0)
				return wResult;

			String wSQL = "";
			if (wDSType == DMSLedgerTypes.Device) {
				wSQL = StringUtils.Format(" SELECT dms_stock_warning.ID,     dms_stock_warning.ModelID, "
						+ "    device_model.ModelNo, 	device_model.DeviceWorkType as WorkType,   "
						+ "    device_property_model.PropertyID AS SupplierID, "
						+ "	device_property_model.PropertyName AS SupplierName, "
						+ "	device_property_model.PropertyNo AS SupplierModelNo,     dms_stock_warning.NeedNum, "
						+ "    dms_stock_warning.StockNum,     dms_stock_warning.ReplaceOptions, "
						+ "    dms_stock_warning.WarningInterval,     dms_stock_warning.WarningTime, "
						+ "    dms_stock_warning.ReplaceMinTime,     dms_stock_warning.DSType,     dms_stock_warning.Active "
						+ "FROM {0}.dms_stock_warning ,{0}.device_model,{0}.device_property_model "
						+ "Where dms_stock_warning.DSType= @wDSType    and device_property_model.DSType= @wDSType   "
						+ "and  dms_stock_warning.ModelID=device_model.ID "
						+ "and device_property_model.ID=device_model.ModelPropertyID "
						+ "and device_property_model.DevicePropertyType= 1 "
						+ "and (@wModelID<=0 or @wModelID=dms_stock_warning.ModelID) "
						+ "and (@wActive<0 or @wActive=dms_stock_warning.Active) and (@wID<=0 or @wID=dms_stock_warning.ID) "
						+ "and (@wModelNo is null or @wModelNo ='' or @wModelNo= device_model.ModelNo)  "
						+ "and (@wWorkType<=0 or @wWorkType=device_model.DeviceWorkType) "
						+ "and (@wSupplierID<=0 or @wSupplierID=device_property_model.PropertyID) "
						+ "and (@wSupplierModelNo is null or @wSupplierModelNo ='' or @wSupplierModelNo= device_property_model.PropertyNo)  "
						+ "and ( @wStartTime<= str_to_date('2010-01-01', '%Y-%m-%d') or  dms_stock_warning.WarningTime > @wStartTime or   dms_stock_warning.ReplaceMinTime > @wStartTime)  "
						+ "and ( @wEndTime<= str_to_date('2010-01-01', '%Y-%m-%d') or  dms_stock_warning.WarningTime < @wEndTime or  dms_stock_warning.ReplaceMinTime < @wEndTime)  ",
						wInstance.Result);
			} else if (wDSType == DMSLedgerTypes.Spare) {
				wSQL = StringUtils.Format("SELECT dms_stock_warning.ID,     dms_stock_warning.ModelID, "
						+ "	spare_model.ModelNo, 	spare_model.SpareWorkType as WorkType,   "
						+ "    device_property_model.PropertyID AS SupplierID, "
						+ "	device_property_model.PropertyName AS SupplierName, "
						+ "	device_property_model.PropertyNo AS SupplierModelNo,     dms_stock_warning.NeedNum, "
						+ "    dms_stock_warning.StockNum,     dms_stock_warning.ReplaceOptions, "
						+ "    dms_stock_warning.WarningInterval,     dms_stock_warning.WarningTime, "
						+ "    dms_stock_warning.ReplaceMinTime,     dms_stock_warning.DSType,     dms_stock_warning.Active "
						+ "FROM {0}.dms_stock_warning,{0}.spare_model,{0}.device_property_model "
						+ "Where dms_stock_warning.DSType= @wDSType   and device_property_model.DSType= @wDSType   "
						+ "and  dms_stock_warning.ModelID=spare_model.ID "
						+ "and device_property_model.ID=spare_model.ModelPropertyID "
						+ "and device_property_model.DevicePropertyType= 1 "
						+ "and (@wModelID<=0 or @wModelID=dms_stock_warning.ModelID) "
						+ "and (@wActive<0 or @wActive=dms_stock_warning.Active) and (@wID<=0 or @wID=dms_stock_warning.ID) "
						+ "and (@wModelNo is null or @wModelNo ='' or @wModelNo= spare_model.ModelNo)  "
						+ "and (@wWorkType<=0 or @wWorkType=spare_model.SpareWorkType) "
						+ "and (@wSupplierID<=0 or @wSupplierID=device_property_model.PropertyID) "
						+ "and (@wSupplierModelNo is null or @wSupplierModelNo ='' or @wSupplierModelNo= device_property_model.PropertyNo)  "
						+ "and ( @wStartTime<= str_to_date('2010-01-01', '%Y-%m-%d') or  dms_stock_warning.WarningTime > @wStartTime or   dms_stock_warning.ReplaceMinTime > @wStartTime)  "
						+ "and ( @wEndTime<= str_to_date('2010-01-01', '%Y-%m-%d') or  dms_stock_warning.WarningTime < @wEndTime or  dms_stock_warning.ReplaceMinTime < @wEndTime)  "
						+ ";", wInstance.Result);
			} else {
				return wResult;
			}

			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("wID", wID);
			wParamMap.Add("wModelID", wModelID);
			wParamMap.Add("wModelNo", wModelNo);
			wParamMap.Add("wWorkType", wWorkType);
			wParamMap.Add("wSupplierID", wSupplierID);
			wParamMap.Add("wSupplierModelNo", wSupplierModelNo);
			wParamMap.Add("wStartTime", wStartTime);
			wParamMap.Add("wEndTime", wEndTime);
			wParamMap.Add("wDSType", wDSType.getValue());
			wParamMap.Add("wActive", wActive);

			List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

			for (Dictionary<String, Object> wReader : wQueryResult) {
				long wIDSql = StringUtils.parseLong(wReader["ID"]);
				int wModelIDSql = StringUtils.parseInt(wReader["ModelID"]);
				String wModelNoSql = StringUtils.parseString(wReader["ModelNo"]);
				int wWorkTypeSql = StringUtils.parseInt(wReader["WorkType"]);
				int wSupplierIDSql = StringUtils.parseInt(wReader["SupplierID"]);
				String wSupplierNameSql = StringUtils.parseString(wReader["SupplierName"]);
				String wSupplierModelNoSql = StringUtils.parseString(wReader["SupplierModelNo"]);
				int wNeedNumSql = StringUtils.parseInt(wReader["NeedNum"]);
				int wStockNumSql = StringUtils.parseInt(wReader["StockNum"]);
				String wReplaceOptionsSql = StringUtils.parseString(wReader["ReplaceOptions"]);
				Double wWarningIntervalSql = StringUtils.parseDouble(wReader["WarningInterval"]);
				DateTime wWarningTimeSql = StringUtils.parseDate(wReader["WarningTime"]);
				DateTime wReplaceMinTimeSql = StringUtils.parseDate(wReader["ReplaceMinTime"]);
				int wDSTypeSql = StringUtils.parseInt(wReader["DSType"]);
				int wActiveSql = StringUtils.parseInt(wReader["Active"]);

				DMSStockWarning wDeviceStockWarning = new DMSStockWarning();

				wDeviceStockWarning.ID = wIDSql;
				wDeviceStockWarning.ModelID = wModelIDSql;
				wDeviceStockWarning.ModelNo = wModelNoSql;
				wDeviceStockWarning.WorkType = wWorkTypeSql;
				wDeviceStockWarning.SupplierID = wSupplierIDSql;
				wDeviceStockWarning.SupplierName = wSupplierNameSql;
				wDeviceStockWarning.SupplierModelNo = wSupplierModelNoSql;
				wDeviceStockWarning.NeedNum = wNeedNumSql;
				wDeviceStockWarning.StockNum = wStockNumSql;
				wDeviceStockWarning.ReplaceOptions = StringUtils.parseLongList(wReplaceOptionsSql.split(","));

				wDeviceStockWarning.WarningInterval = wWarningIntervalSql;
				wDeviceStockWarning.WarningTime = wWarningTimeSql;
				wDeviceStockWarning.ReplaceMinTime = wReplaceMinTimeSql;
				wDeviceStockWarning.DSType = wDSTypeSql;
				wDeviceStockWarning.Active = wActiveSql;

				wResult.Add(wDeviceStockWarning);
			}
		} catch (Exception e) {
			e.printStackTrace();
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public List<DMSStockWarning> SelectAll(BMSEmployee wLoginUser, int wModelID, String wModelNo, int wWorkType,
			int wSupplierID, String wSupplierModelNo, DMSLedgerTypes wDSType, int wActive, DateTime wStartTime,
			DateTime wEndTime, OutResult<Int32> wErrorCode) {
		List<DMSStockWarning> wResult = new List<DMSStockWarning>();
		try {
			wResult = SelectAll(wLoginUser, 0, wModelID, wModelNo, wWorkType, wSupplierID, wSupplierModelNo, wDSType,
					wActive, wStartTime, wEndTime, wErrorCode);
		} catch (Exception e) {
			e.printStackTrace();
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public DMSStockWarning Select(BMSEmployee wLoginUser, long wID, OutResult<Int32> wErrorCode) {
		DMSStockWarning wResult = new DMSStockWarning();
		try {
			DateTime wBaseTime = DateTime.Now;
			wBaseTime.set(2000, 0, 1);
			List<DMSStockWarning> wDMSStockWarningList = SelectAll(wLoginUser, wID, -1, "", -1, -1, "",
					DMSLedgerTypes.Default, -1, wBaseTime, wBaseTime, wErrorCode);
			if (wDMSStockWarningList.Count != 1)
				return wResult;
			wResult = wDMSStockWarningList[0];
		} catch (Exception e) {
			e.printStackTrace();
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public long Update(BMSEmployee wLoginUser, DMSStockWarning wDMSStockWarning, OutResult<Int32> wErrorCode) {
		long wResult = 0;
		try {
			if (wDMSStockWarning == null) {
				wErrorCode.set(MESException.Parameter.Value);
				return wResult;
			}
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			if (wDMSStockWarning.ReplaceOptions == null)
				wDMSStockWarning.ReplaceOptions = new List<>();

			String wSQL = "";
			long wCount = SelectCount(wLoginUser, wDMSStockWarning.getModelID(),
					DMSLedgerTypes.getEnumType(wDMSStockWarning.DSType), wDMSStockWarning.getNeedNum(),
					wDMSStockWarning.ReplaceOptions, wDMSStockWarning.ReplaceMinTime, wErrorCode);
			if (wCount == 0) {
				UpdateActive(SysAdmin, wDMSStockWarning.getModelID(),
						DMSLedgerTypes.getEnumType(wDMSStockWarning.DSType), wErrorCode);
				wSQL = StringUtils.Format(
						"INSERT INTO {0}.dms_stock_warning ( ModelID, NeedNum, "
								+ "StockNum, ReplaceOptions, WarningInterval, WarningTime, ReplaceMinTime, "
								+ "DSType, Active) VALUES (  @wModelID, @wNeedNum, @wStockNum, "
								+ "@wReplaceOptions, @wWarningInterval, now(), @wReplaceMinTime, @wDSType, 1);",
						wInstance.Result);
			} else {

				wSQL = StringUtils.Format(
						"UPDATE {0}.dms_stock_warning  SET      StockNum = @wStockNum,  "
								+ "Active = @wActive WHERE ModelID = @wModelID and DSType=@wDSType and Active=1; ",
						wInstance.Result);

			}
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
			wParamMap.Add("wModelID", wDMSStockWarning.ModelID);
			wParamMap.Add("wNeedNum", wDMSStockWarning.NeedNum);
			wParamMap.Add("wStockNum", wDMSStockWarning.StockNum);
			wParamMap.Add("wReplaceOptions", StringUtils.Join(",", wDMSStockWarning.ReplaceOptions));
			wParamMap.Add("wWarningInterval", wDMSStockWarning.WarningInterval);
			wParamMap.Add("wReplaceMinTime", wDMSStockWarning.ReplaceMinTime);
			wParamMap.Add("wDSType", wDMSStockWarning.DSType);

			KeyHolder keyHolder = new GeneratedKeyHolder();
			SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParamMap);

			mDBPool.update(wSQL, wSqlParameterSource, keyHolder);
			if (wDMSStockWarning.ID <= 0) {
				wResult = keyHolder.getKey().longValue();
				wDMSStockWarning.setID(wResult);
			} else {
				wResult = wDMSStockWarning.ID;
			}
		} catch (Exception e) {
			e.printStackTrace();
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	private long SelectCount(BMSEmployee wLoginUser, long wModelID, DMSLedgerTypes wDSType, int wNeedNum,
			List<Long> wReplaceOptions, DateTime wReplaceMinTime, OutResult<Int32> wErrorCode) {
		ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);

		wErrorCode.set(wInstance.ErrorCode);
		if (wErrorCode.Result != 0)
			return 0L;
		if (wReplaceOptions == null)
			wReplaceOptions = new List<Long>();
		String wSql = StringUtils.Format("Select count(0) FROM {0}.dms_stock_warning  "
				+ " WHERE ModelID = @wModelID and DSType=@wDSType and Active=1  "
				+ "  and NeedNum=@wNeedNum and  ReplaceOptions=@wReplaceOptions  "
				+ "  and ReplaceMinTime=@wReplaceMinTime;", wInstance.Result);

		Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
		wParamMap.Add("wModelID", wModelID);
		wParamMap.Add("wDSType", wDSType.getValue());
		wParamMap.Add("wNeedNum", wNeedNum);
		wParamMap.Add("wReplaceMinTime", wReplaceMinTime);
		wParamMap.Add("wReplaceOptions", StringUtils.Join(",", wReplaceOptions));
		return mDBPool.queryForObject(wSql, wParamMap, typeof(Long));
	}

	private long UpdateActive(BMSEmployee wLoginUser, long wModelID, DMSLedgerTypes wDSType,
			OutResult<Int32> wErrorCode) {
		ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);

		wErrorCode.set(wInstance.ErrorCode);
		if (wErrorCode.Result != 0)
			return 0L;
		String wSql = StringUtils.Format(
				" UPDATE {0}.dms_stock_warning    SET   Active = 2 "
						+ "   WHERE ID >0 and ModelID = @wModelID and DSType=@wDSType and Active<> 2; ",
				wInstance.Result);

		Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
		wParamMap.Add("wModelID", wModelID);
		wParamMap.Add("wDSType", wDSType.getValue());

		return mDBPool.update(wSql, wParamMap);
	}
}
