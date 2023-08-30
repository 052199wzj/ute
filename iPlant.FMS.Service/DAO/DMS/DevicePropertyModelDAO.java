package com.mes.server.serviceimpl.dao.dms;

import java.util.List;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.deviceLegder.DMSPropertyModel;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException; 
import com.mes.server.service.mesenum.dms.DMSLedgerTypes;
import com.mes.server.service.mesenum.dms.DMSPropertyTypes;

public class DevicePropertyModelDAO extends BaseDAO {

	private static Logger logger = LoggerFactory.getLogger(typeof(DevicePropertyModelDAO));

	private static DevicePropertyModelDAO Instance;

	private DevicePropertyModelDAO() {
		super();
	}

	private static int RoleFunctionID = 700100;

	public static DevicePropertyModelDAO getInstance() {
		if (Instance == null)
			Instance = new DevicePropertyModelDAO();
		return Instance;
	}

	public List<DMSPropertyModel> DMS_SelectPropertyModelList(BMSEmployee wLoginUser, List<Int32> wID,
			int wPropertyID, String wPropertyNo, String wPropertyName, DMSPropertyTypes wDevicePropertyType,
			DMSLedgerTypes wDSType, int wActive, OutResult<Int32> wErrorCode) {
		List<DMSPropertyModel> wResult = new List<DMSPropertyModel>();
		try {
			if (wID == null)
				wID = new List<Int32>();

			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser, MESDBSource.DMS);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			String wSQL = StringUtils.Format("SELECT t.* FROM {0}.device_property_model t WHERE  1=1 "
					+ " and ( @wID ='' or t.ID IN( {1} ) ) "
					+ " and ( @wDSType <= 0 or t.DSType  = @wDSType) " + "and ( @wActive < 0 or t.Active  = @wActive)  "
					+ " and ( @wPropertyID <= 0 or t.PropertyID  = @wPropertyID)  "
					+ " and ( @wDevicePropertyType <= 0 or t.DevicePropertyType  = @wDevicePropertyType)   "
					+ " and ( @wPropertyNo ='' or t.PropertyNo  = @wPropertyNo) "
					+ " and ( @wPropertyName ='' or t.PropertyName  = @wPropertyName);",
					wInstance.Result, wID.Count > 0 ? StringUtils.Join(",", wID) : "0");
			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
			wParamMap.Add("wID", StringUtils.Join(",", wID));
			wParamMap.Add("wDevicePropertyType", wDevicePropertyType.getValue());
			wParamMap.Add("wPropertyID", wPropertyID);
			wParamMap.Add("wPropertyNo", wPropertyNo);
			wParamMap.Add("wPropertyName", wPropertyName);
			wParamMap.Add("wDSType", wDSType.getValue());
			wParamMap.Add("wActive", wActive);

			List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
			// wReader\[\"(\w+)\"\]
			for (Dictionary<String, Object> wReader : wQueryResult) {
				DMSPropertyModel wDevicePropertyModel = new DMSPropertyModel();
				wDevicePropertyModel.ID = StringUtils.parseInt(wReader["ID"]);
				wDevicePropertyModel.PropertyNo = StringUtils.parseString(wReader["PropertyNo"]);
				wDevicePropertyModel.PropertyID = StringUtils.parseInt(wReader["PropertyID"]);
				wDevicePropertyModel.DevicePropertyType = StringUtils.parseInt(wReader["DevicePropertyType"]);
				wDevicePropertyModel.PropertyName = StringUtils.parseString(wReader["PropertyName"]);
				wDevicePropertyModel.OperatorID = StringUtils.parseInt(wReader["OperatorID"]);
				wDevicePropertyModel.DSType = StringUtils.parseInt(wReader["DSType"]);
				wDevicePropertyModel.Active = StringUtils.parseInt(wReader["Active"]);
				wDevicePropertyModel.OperateTime = StringUtils.parseDate(wReader["OperateTime"]);

				wDevicePropertyModel.OperatorName = BFCConstants.GetBMSEmployeeName(wDevicePropertyModel.OperatorID);

				wResult.Add(wDevicePropertyModel);
			}
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public List<DMSPropertyModel> DMS_SelectPropertyModelList(BMSEmployee wLoginUser, int wPropertyID,
			String wPropertyNo, String wPropertyName, DMSPropertyTypes wDevicePropertyType, DMSLedgerTypes wDSType,
			int wActive, OutResult<Int32> wErrorCode) {
		List<DMSPropertyModel> wResult = new List<DMSPropertyModel>();
		try {
			wResult = DMS_SelectPropertyModelList(wLoginUser, null, wPropertyID, wPropertyNo, wPropertyName,
					wDevicePropertyType, wDSType, wActive, wErrorCode);
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public void DMS_UpdatePropertyModel(BMSEmployee wLoginUser, DMSPropertyModel wDeviceModel,
			OutResult<Int32> wErrorCode) {

		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser, MESDBSource.DMS, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			if (wDeviceModel == null) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			List<DMSPropertyModel> wDMSPropertyModelList = DMS_SelectPropertyModelList(wLoginUser,
					wDeviceModel.PropertyID, wDeviceModel.PropertyNo, "",
					DMSPropertyTypes.getEnumType(wDeviceModel.DevicePropertyType),
					DMSLedgerTypes.getEnumType(wDeviceModel.DSType), -1, wErrorCode);
			if (wDMSPropertyModelList != null && wDMSPropertyModelList.Count > 0) {
				if (wDeviceModel.ID <= 0) {
					wErrorCode.Result = MESException.Duplication.Value;
					return;
				} else {
					if (wDMSPropertyModelList.stream().filter(p -> p.ID == wDeviceModel.ID).findFirst().isPresent()) {
						wErrorCode.Result = MESException.Duplication.Value;
						return;
					}
				}
			}

			String wSQL = "";

			if (wDeviceModel.ID <= 0) {

				wSQL = StringUtils.Format(" INSERT INTO  {0}.device_property_model   (   DevicePropertyType , "
						+ " PropertyNo ,   PropertyID ,   PropertyName ,   OperatorID , "
						+ " DSType ,   OperateTime ,   Active )  VALUES "
						+ "(@wDevicePropertyType,  @wPropertyNo,  @wPropertyID,  @wPropertyName, "
						+ "@wOperatorID,  @wDSType,  now(),  @wActive);", wInstance.Result);
			} else {
				wSQL = StringUtils.Format(" UPDATE  {0}.device_property_model   SET  "
						+ " DevicePropertyType  =@wDevicePropertyType,   PropertyNo  =@wPropertyNo, "
						+ " PropertyID  = @wPropertyID,   PropertyName  = @wPropertyName, "
						+ " OperatorID  = @wOperatorID,   DSType  = @wDSType,   OperateTime  = now(), "
						+ " Active  =@wActive  WHERE  ID  =@wID;", wInstance.Result);
			}
			wSQL = this.DMLChange(wSQL);

			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
			wParamMap.Add("wID", wDeviceModel.ID);
			wParamMap.Add("wPropertyNo", wDeviceModel.PropertyNo);
			wParamMap.Add("wPropertyID", wDeviceModel.PropertyID);
			wParamMap.Add("wPropertyName", wDeviceModel.PropertyName);
			wParamMap.Add("wDevicePropertyType", wDeviceModel.DevicePropertyType);
			wParamMap.Add("wOperatorID", wDeviceModel.OperatorID);
			wParamMap.Add("wActive", wDeviceModel.Active);
			wParamMap.Add("wDSType", wDeviceModel.DSType);

			KeyHolder keyHolder = new GeneratedKeyHolder();
			SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParamMap);

			mDBPool.update(wSQL, wSqlParameterSource, keyHolder);
			if (wDeviceModel.ID <= 0) {
				wDeviceModel.ID = keyHolder.getKey().intValue();
			}

		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
	}

	public void DMS_ActivePropertyModel(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive,
			OutResult<Int32> wErrorCode) {
		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser, MESDBSource.DMS, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			if (wIDList == null || wIDList.Count <= 0) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			if (wActive != 1)
				wActive = 2;

			wIDList = wIDList.stream().filter(p -> p > 0).collect(Collectors.toList());

			if (wIDList.Count <= 0) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			String wSql = StringUtils.Format("UPDATE {0}.device_property_model SET Active ={1} WHERE ID IN({2}) ;",
					wInstance.Result, String.valueOf(wActive), StringUtils.Join(",", wIDList));

			ExecuteSqlTransaction(wSql);
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
	}
}
