package com.mes.server.serviceimpl.dao.dms.device;

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

import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.deviceLegder.DMSWorkType;
import com.mes.server.service.po.dms.deviceLegder.device.DMSDeviceModel;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.dao.dms.DeviceWorkTypeDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;

public class DMSDeviceModelDAO extends BaseDAO {

	private static Logger logger = LoggerFactory.getLogger(typeof(DMSDeviceModelDAO));

	private static DMSDeviceModelDAO Instance;

	private DMSDeviceModelDAO() {
		super();
	}

	public static DMSDeviceModelDAO getInstance() {
		if (Instance == null)
			Instance = new DMSDeviceModelDAO();
		return Instance;
	}

	private static int RoleFunctionID = 700301;

	public List<DMSDeviceModel> DMS_SelectDeviceModelList(BMSEmployee wLoginUser, List<Int32> wID, String wModelNo,
			int wWorkType, int wSupplierID, String wSupplierModelNo, int wModelPropertyID, int wSystemID,
			String wSystemVersion, int wSystemPropertyID, int wControllerID, String wControllerModel,
			int wControllerPropertyID, int wActive, OutResult<Int32> wErrorCode) {
		List<DMSDeviceModel> wResult = new List<DMSDeviceModel>();
		try {

			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser, MESDBSource.DMS);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			if (wID == null)
				wID = new List<>();

			if (wModelNo == null)
				wModelNo = "";
			if (wSupplierModelNo == null)
				wSupplierModelNo = "";
			if (wSystemVersion == null)
				wSystemVersion = "";
			if (wControllerModel == null)
				wControllerModel = "";

			// \\\"\'\,(\w+)\,\'\\\"
			String wSQL = StringUtils.Format(
					"SELECT t1.*,  t2.PropertyName as SupplierName, t2.PropertyNo as SupplierModelNo,"
							+ " t3.PropertyName as SystemName,  t3.PropertyNo as SystemVersion, "
							+ " t4.PropertyName as ControllerName, t4.PropertyNo as ControllerModel,t5.Name as  WorkTypeName"
							+ " FROM {0}.device_model t1 left join {0}.device_work_type t5 on t1.WorkType=t5.ID  "
							+ " left join (SELECT * FROM  {0}.device_property_model  WHERE  DSType=1 AND DevicePropertyType =1)  t2  on  t1.ModelPropertyID = t2.ID  "
							+ " left join (SELECT * FROM  {0}.device_property_model  WHERE  DSType=1 AND DevicePropertyType =2)  t3  on  t1.SystemPropertyID = t3.ID "
							+ " left join (SELECT * FROM  {0}.device_property_model  WHERE  DSType=1 AND DevicePropertyType =3)  t4  on  t1.ControllerPropertyID = t4.ID "
							+ " WHERE 1=1   and ( @wID ='' or t1.ID IN( {1} ) )   "
							+ " and ( @wWorkType <= 0 or t1.WorkType  = @wWorkType)  "
							+ " and ( @wModelNo ='' or t1.ModelNo = @wModelNo)    "
							+ " and ( @wModelPropertyID <= 0 or t1.ModelPropertyID  = @wModelPropertyID)  "
							+ " and ( @wSupplierID <= 0 or t2.PropertyID  = @wSupplierID)  "
							+ " and ( @wSupplierModelNo ='' or t2.PropertyNo = @wSupplierModelNo)    "
							+ " and ( @wSystemPropertyID <= 0 or t1.SystemPropertyID  = @wSystemPropertyID)  "
							+ " and ( @wSystemID <= 0 or t3.PropertyID  = @wSystemID)  "
							+ " and ( @wSystemVersion ='' or t3.PropertyNo = @wSystemVersion)    "
							+ " and ( @wControllerPropertyID <= 0 or t1.ControllerPropertyID  = @wControllerPropertyID)  "
							+ " and ( @wControllerID <= 0 or t4.PropertyID  = @wControllerID)  "
							+ " and ( @wControllerModel ='' or t4.PropertyNo = @wControllerModel)    "
							+ " and ( @wActive < 0 or t1.Active  = @wActive)  ;",
					wInstance.Result, wID.Count > 0 ? StringUtils.Join(",", wID) : "0");
			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
			wParamMap.Add("wID", StringUtils.Join(",", wID));
			wParamMap.Add("wModelNo", wModelNo);
			wParamMap.Add("wWorkType", wWorkType);
			wParamMap.Add("wModelPropertyID", wModelPropertyID);
			wParamMap.Add("wSupplierID", wSupplierID);
			wParamMap.Add("wSupplierModelNo", wSupplierModelNo);
			wParamMap.Add("wSystemPropertyID", wSystemPropertyID);
			wParamMap.Add("wSystemID", wSystemID);
			wParamMap.Add("wSystemVersion", wSystemVersion);
			wParamMap.Add("wControllerPropertyID", wControllerPropertyID);
			wParamMap.Add("wControllerID", wControllerID);
			wParamMap.Add("wControllerModel", wControllerModel);
			wParamMap.Add("wActive", wActive);

			List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
			// wReader\[\"(\w+)\"\]
			for (Dictionary<String, Object> wReader : wQueryResult) {

				DMSDeviceModel wDeviceModel = new DMSDeviceModel();

				wDeviceModel.ID = StringUtils.parseInt(wReader["ID"]);
				wDeviceModel.ModelNo = StringUtils.parseString(wReader["ModelNo"]);
				wDeviceModel.ModelName = StringUtils.parseString(wReader["ModelName"]);
				wDeviceModel.WorkType = StringUtils.parseInt(wReader["WorkType"]);
				wDeviceModel.WorkTypeName = StringUtils.parseString(wReader["WorkTypeName"]);
				wDeviceModel.ModelPropertyID = StringUtils.parseInt(wReader["SupplierID"]);

				wDeviceModel.SupplierName = StringUtils.parseString(wReader["SupplierName"]);
				wDeviceModel.SupplierModelNo = StringUtils.parseString(wReader["SupplierModelNo"]);
				wDeviceModel.SystemPropertyID = StringUtils.parseInt(wReader["SystemPropertyID"]);

				wDeviceModel.SystemName = StringUtils.parseString(wReader["SystemName"]);
				wDeviceModel.SystemVersion = StringUtils.parseString(wReader["SystemVersion"]);
				wDeviceModel.ControllerPropertyID = StringUtils.parseInt(wReader["ControllerPropertyID"]);
				wDeviceModel.ControllerName = StringUtils.parseString(wReader["ControllerName"]);

				wDeviceModel.ControllerModel = StringUtils.parseString(wReader["ControllerModel"]);
				wDeviceModel.Cost = StringUtils.parseDouble(wReader["Cost"]);
				wDeviceModel.Life = StringUtils.parseDouble(wReader["Life"]);
				wDeviceModel.LimitCount = StringUtils.parseInt(wReader["LimitCount"]);
				wDeviceModel.StockNum = StringUtils.parseInt(wReader["StockNum"]);
				wDeviceModel.WarningCycle = StringUtils.parseDouble(wReader["WarningCycle"]);
				wDeviceModel.WarningNum = StringUtils.parseInt(wReader["WarningNum"]);
				wDeviceModel.OperatorID = StringUtils.parseInt(wReader["OperatorID"]);
				wDeviceModel.OperateTime = StringUtils.parseDate(wReader["OperateTime"]);
				wDeviceModel.Active = StringUtils.parseInt(wReader["Active"]);

				wDeviceModel.OperatorName = BFCConstants.GetBMSEmployeeName(wDeviceModel.OperatorID);
				wResult.Add(wDeviceModel);
			}

		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public int DMS_CheckDeviceModel(BMSEmployee wLoginUser, DMSDeviceModel wDMSDeviceModel,
			OutResult<Int32> wErrorCode) {
		int wResult = 0;
		try {

			if (wDMSDeviceModel == null || StringUtils.isEmpty(wDMSDeviceModel.ModelName)
					|| wDMSDeviceModel.WorkType <= 0) {
				return wResult;
			}

			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser, MESDBSource.DMS);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			// \\\"\'\,(\w+)\,\'\\\"
			String wSQL = StringUtils.Format(
					"SELECT t1.ID FROM {0}.device_model t1 WHERE t1.ID != @ID AND t1.WorkType=@WorkType and t1.ModelName=@ModelName   ;",
					wInstance.Result);
			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
			wParamMap.Add("WorkType", wDMSDeviceModel.WorkType);
			wParamMap.Add("ModelName", wDMSDeviceModel.ModelName);
			wParamMap.Add("ID", wDMSDeviceModel.ID);

			List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
			// wReader\[\"(\w+)\"\]
			for (Dictionary<String, Object> wReader : wQueryResult) {

				wResult = StringUtils.parseInt(wReader["ID"]);
			}

		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public DMSDeviceModel DMS_SelectDeviceModelMax(BMSEmployee wLoginUser, int wWorkType,
			OutResult<Int32> wErrorCode) {
		DMSDeviceModel wResult = new DMSDeviceModel();
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;
			String wSQL = StringUtils.Format("SELECT t.* FROM {0}.device_model t  WHERE  1=1 "
					+ " and      t.WorkType  = @wWorkType  order by ID desc limit 1 ;", wInstance.Result);
			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("wWorkType", wWorkType);

			List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
			// wReader\[\"(\w+)\"\]
			for (Dictionary<String, Object> wReader : wQueryResult) {

				wResult.ID = StringUtils.parseInt(wReader["ID"]);
				wResult.ModelNo = StringUtils.parseString(wReader["ModelNo"]);
			}

		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public List<DMSDeviceModel> DMS_SelectDeviceModelList(BMSEmployee wLoginUser, int wWorkType, int wSupplierID,
			String wSupplierModelNo, int wModelPropertyID, int wSystemID, String wSystemVersion, int wSystemPropertyID,
			int wControllerID, String wControllerModel, int wControllerPropertyID, int wActive,
			OutResult<Int32> wErrorCode) {
		List<DMSDeviceModel> wResult = new List<DMSDeviceModel>();
		try {
			wResult = DMS_SelectDeviceModelList(wLoginUser, null, "", wWorkType, wSupplierID, wSupplierModelNo,
					wModelPropertyID, wSystemID, wSystemVersion, wSystemPropertyID, wControllerID, wControllerModel,
					wControllerPropertyID, wActive, wErrorCode);
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public List<DMSDeviceModel> DMS_SelectDeviceModelList(BMSEmployee wLoginUser, List<Int32> wIDList,
			OutResult<Int32> wErrorCode) {
		List<DMSDeviceModel> wResult = new List<DMSDeviceModel>();
		try {

			if (wIDList == null || wIDList.Count < 1)
				return wResult;
			List<Int32> wSelectList = new List<>();
			for (int i = 0; i < wIDList.Count; i++) {
				wSelectList.Add(wIDList.get(i));
				if (i % 25 == 0) {
					wResult.addAll(DMS_SelectDeviceModelList(wLoginUser, wSelectList, "", -1, -1, "", -1, -1, "", -1,
							-1, "", -1, -1, wErrorCode));

					wSelectList.clear();
				}
				if (i == wIDList.Count - 1) {
					if (wSelectList.Count > 0)
						wResult.addAll(DMS_SelectDeviceModelList(wLoginUser, wSelectList, "", -1, -1, "", -1, -1, "",
								-1, -1, "", -1, -1, wErrorCode));
					break;
				}
			}
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public DMSDeviceModel DMS_SelectDeviceModel(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode) {
		DMSDeviceModel wResult = new DMSDeviceModel();

		try {
			List<DMSDeviceModel> wDMSDeviceModelList = DMS_SelectDeviceModelList(wLoginUser,
					StringUtils.parseList(new Int32[] { wID }), wErrorCode);
			if (wDMSDeviceModelList.Count > 0)
				wResult = wDMSDeviceModelList[0];
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public void DMS_UpdateDeviceModel(BMSEmployee wLoginUser, DMSDeviceModel wDeviceModel,
			OutResult<Int32> wErrorCode) {
		try {

			if (wDeviceModel == null || StringUtils.isEmpty(wDeviceModel.ModelName) || wDeviceModel.WorkType <= 0) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			int wDuplicationID = DMS_CheckDeviceModel(wLoginUser, wDeviceModel, wErrorCode);
			if (wDuplicationID > 0) {
				wErrorCode.Result = MESException.Duplication.Value;
				if (wDeviceModel.ID <= 0) {
					wDeviceModel.ID = wDuplicationID;
				}
				return;
			}

			if (wDeviceModel.ID <= 0) {
				// 设置ModelNo
				DMSDeviceModel wDMSDeviceModelMax = this.DMS_SelectDeviceModelMax(wLoginUser, wDeviceModel.WorkType,
						wErrorCode);

				DMSWorkType wDMSWorkType = DeviceWorkTypeDAO.getInstance().DMS_SelectWorkType(wLoginUser,
						wDeviceModel.WorkType, wErrorCode);
				int wCount = 0;
				if (StringUtils.isNotEmpty(wDMSDeviceModelMax.ModelNo)
						&& wDMSDeviceModelMax.ModelNo.startsWith(wDMSWorkType.Code)
						&& StringUtils.split(wDMSDeviceModelMax.ModelNo, ".").length == 2) {

					wDMSDeviceModelMax.ModelNo = StringUtils.split(wDMSDeviceModelMax.ModelNo, ".")[1];
					wCount = StringUtils.parseInt(wDMSDeviceModelMax.ModelNo);
				}
				wDeviceModel.ModelNo = StringUtils.Format("{0}.{1}", wDMSWorkType.Code,
						String.format("%03d", wCount + 1));
			}

			String wSQL = "";

			if (wDeviceModel.ID <= 0) {

				wSQL = StringUtils.Format("INSERT INTO {0}.device_model ( ModelNo,ModelName, WorkType, "
						+ "SupplierID, SystemPropertyID, ControllerPropertyID, "
						+ "Cost, Life, LimitCount, StockNum, " + "WarningCycle, WarningNum, OperatorID, OperateTime, "
						+ "Active) VALUES ( @wModelNo ,@wModelName,  @wWorkType, "
						+ "@wModelPropertyID, @wSystemPropertyID, @wControllerPropertyID, "
						+ "@wCost, @wLife, @wLimitCount, @wStockNum, "
						+ "@wWarningCycle, @wWarningNum, @wOperatorID, now(), @wActive);", wInstance.Result);
			} else {
				wSQL = StringUtils.Format("UPDATE {0}.device_model SET  ModelNo = @wModelNo,ModelName=@wModelName, "
						+ "WorkType = @wWorkType, SupplierID = @wModelPropertyID, "
						+ "SystemPropertyID = @wSystemPropertyID, "
						+ "ControllerPropertyID = @wControllerPropertyID, Cost = @wCost, "
						+ "Life = @wLife, LimitCount = @wLimitCount, "
						+ "StockNum = @wStockNum, WarningCycle = @wWarningCycle, "
						+ "WarningNum = @wWarningNum, OperatorID = @wOperatorID, "
						+ "OperateTime =now(), Active = @wActive WHERE ID = @wID;", wInstance.Result);
			}
			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
			wParamMap.Add("wID", wDeviceModel.ID);
			wParamMap.Add("wModelNo", wDeviceModel.ModelNo);
			wParamMap.Add("wModelName", wDeviceModel.ModelName);
			wParamMap.Add("wWorkType", wDeviceModel.WorkType);
			wParamMap.Add("wModelPropertyID", wDeviceModel.ModelPropertyID);
			wParamMap.Add("wSystemPropertyID", wDeviceModel.SystemPropertyID);
			wParamMap.Add("wControllerPropertyID", wDeviceModel.ControllerPropertyID);
			wParamMap.Add("wCost", wDeviceModel.Cost);
			wParamMap.Add("wLife", wDeviceModel.Life);
			wParamMap.Add("wLimitCount", wDeviceModel.LimitCount);
			wParamMap.Add("wStockNum", wDeviceModel.StockNum);
			wParamMap.Add("wWarningCycle", wDeviceModel.WarningCycle);
			wParamMap.Add("wWarningNum", wDeviceModel.WarningNum);
			wParamMap.Add("wOperatorID", wDeviceModel.OperatorID);
			wParamMap.Add("wActive", wDeviceModel.Active);
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

	public void DMS_ActiveDeviceModel(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive,
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
			wIDList = wIDList.stream().filter(p -> p > 0).collect(Collectors.toList());

			if (wIDList.Count <= 0) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			if (wActive != 1)
				wActive = 2;
			String wSql = StringUtils.Format("UPDATE {0}.device_model SET Active ={1} WHERE ID IN({2}) ;",
					wInstance.Result, String.valueOf(wActive), StringUtils.Join(",", wIDList));

			ExecuteSqlTransaction(wSql);
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
	}
}
