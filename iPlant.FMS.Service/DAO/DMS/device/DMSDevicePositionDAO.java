package com.mes.server.serviceimpl.dao.dms.device;

import java.util.List; 
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
import com.mes.server.service.po.dms.deviceLegder.DMSDevicePosition;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;

public class DMSDevicePositionDAO extends BaseDAO {

	private static Logger logger = LoggerFactory.getLogger(typeof(DMSDevicePositionDAO));

	private static DMSDevicePositionDAO Instance;

	private DMSDevicePositionDAO() {
		super();
	}

	public static DMSDevicePositionDAO getInstance() {
		if (Instance == null)
			Instance = new DMSDevicePositionDAO();
		return Instance;
	}

	private static int RoleFunctionID = 700600;

	// (public\s+[a-zA-z0-9_\<\>]+\s+[a-zA-z0-9_\<\>]+\()([^\)]*)\)
	// $1BMSEmployee wLoginUser,$2,OutResult<Int32> wErrorCode)

	public List<DMSDevicePosition> SelectDevicePosition(BMSEmployee wLoginUser, List<Long> wID, List<Int32> wBaseID,
			List<Int32> wFactoryID, List<Int32> wWorkShopID, List<Int32> wLineID, OutResult<Int32> wErrorCode) {
		List<DMSDevicePosition> wResult = new List<DMSDevicePosition>();
		try {

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			if (wID == null)
				wID = new List<Long>();
			if (wBaseID == null)
				wBaseID = new List<>();
			if (wFactoryID == null)
				wFactoryID = new List<>();
			if (wWorkShopID == null)
				wWorkShopID = new List<>();
			if (wLineID == null)
				wLineID = new List<>();

			String wSQL = StringUtils.Format(
					"SELECT device_position.ID,     device_position.BaseID, "
							+ "    device_position.FactoryID,     device_position.WorkShopID, "
							+ "    device_position.LineID,     device_position.PositionPoint, "
							+ "    device_position.PositionExtend,     device_position.OperatorID, "
							+ "    device_position.OperateTime FROM {0}.device_position WHERE  1=1  "
							+ "and ( @wID ='' or ID IN( {1} ) )  "
							+ "and ( @wBaseID ='' or BaseID IN( {2} ) )  "
							+ "and ( @wFactoryID ='' or FactoryID IN( {3} ) )   "
							+ "and ( @wWorkShopID ='' or WorkShopID IN( {4} ) )  "
							+ " and ( @wLineID ='' or LineID IN( {5} ) )  ;",
					wInstance.Result, wID.Count > 0 ? StringUtils.Join(",", wID) : "0",
					wBaseID.Count > 0 ? StringUtils.Join(",", wBaseID) : "0",
					wFactoryID.Count > 0 ? StringUtils.Join(",", wFactoryID) : "0",
					wWorkShopID.Count > 0 ? StringUtils.Join(",", wWorkShopID) : "0",
					wLineID.Count > 0 ? StringUtils.Join(",", wLineID) : "0");
			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
			wParamMap.Add("wID", StringUtils.Join(",", wID));
			wParamMap.Add("wBaseID", StringUtils.Join(",", wBaseID));
			wParamMap.Add("wFactoryID", StringUtils.Join(",", wFactoryID));
			wParamMap.Add("wWorkShopID", StringUtils.Join(",", wWorkShopID));
			wParamMap.Add("wLineID", StringUtils.Join(",", wLineID));

			List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
			// wReader\[\"(\w+)\"\]
			for (Dictionary<String, Object> wReader : wQueryResult) {

				DMSDevicePosition wDeviceModelW = new DMSDevicePosition();

				wDeviceModelW.ID = StringUtils.parseInt(wReader["ID"]);
				wDeviceModelW.BaseID = StringUtils.parseInt(wReader["BaseID"]);
				wDeviceModelW.FactoryID = StringUtils.parseInt(wReader["FactoryID"]);
				wDeviceModelW.WorkShopID = StringUtils.parseInt(wReader["WorkShopID"]);
				wDeviceModelW.LineID = StringUtils.parseInt(wReader["LineID"]);
				wDeviceModelW.PositionPoint = StringUtils
						.parseDoubleArray(StringUtils.parseString(wReader["PositionPoint"]), ",");
				wDeviceModelW.PositionExtend = StringUtils.parseString(wReader["PositionExtend"]);
				wDeviceModelW.OperatorID = StringUtils.parseInt(wReader["OperatorID"]);
				wDeviceModelW.OperatorName = BFCConstants.GetBMSEmployeeName(wDeviceModelW.OperatorID);
				wDeviceModelW.OperateTime = StringUtils.parseDate(wReader["OperateTime"]);

				wResult.Add(wDeviceModelW);
			}
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public void Update(BMSEmployee wLoginUser, DMSDevicePosition wDMSDevicePosition, OutResult<Int32> wErrorCode) {

		try {
			if (wDMSDevicePosition == null) {
				wErrorCode.Result = MESException.Parameter.Value;
				return;
			}
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;
			String wSQL = "";

			if (wDMSDevicePosition.ID <= 0) {

				wSQL = StringUtils.Format("INSERT INTO {0}.device_position (  BaseID, FactoryID, "
						+ "WorkShopID, LineID, PositionPoint, PositionExtend, "
						+ "OperatorID, OperateTime) VALUES (   @wBaseID, @wFactoryID,"
						+ " @wWorkShopID, @wLineID, @wPositionPoint, @wPositionExtend,   @wOperatorID, now()); ",
						wInstance.Result);
			} else {
				wSQL = StringUtils.Format(" UPDATE {0}.device_position SET BaseID = @wBaseID, "
						+ "FactoryID = @wFactoryID, WorkShopID = @wWorkShopID, LineID = @wLineID, "
						+ "PositionPoint = @wPositionPoint, PositionExtend = @wPositionExtend, "
						+ "OperatorID = @wOperatorID, OperateTime = now() WHERE ID = @wID;", wInstance.Result);
			}
			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
			wParamMap.Add("wID", wDMSDevicePosition.ID);
			wParamMap.Add("wBaseID", wDMSDevicePosition.BaseID);
			wParamMap.Add("wFactoryID", wDMSDevicePosition.FactoryID);
			wParamMap.Add("wWorkShopID", wDMSDevicePosition.WorkShopID);
			wParamMap.Add("wLineID", wDMSDevicePosition.LineID);
			wParamMap.Add("wPositionPoint", wDMSDevicePosition.PositionPoint);
			wParamMap.Add("wPositionExtend", wDMSDevicePosition.PositionExtend);
			wParamMap.Add("wOperatorID", wDMSDevicePosition.OperatorID);

			KeyHolder keyHolder = new GeneratedKeyHolder();
			SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParamMap);

			mDBPool.update(wSQL, wSqlParameterSource, keyHolder);
			if (wDMSDevicePosition.ID <= 0) {

				wDMSDevicePosition.ID = keyHolder.getKey().intValue();
			}
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
	}
}
