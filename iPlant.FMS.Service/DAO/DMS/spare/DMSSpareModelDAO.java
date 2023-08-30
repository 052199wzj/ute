package com.mes.server.serviceimpl.dao.dms.spare;

import java.util.List;
import java.util.DateTime;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.deviceLegder.spare.DMSSpareModel;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;

public class DMSSpareModelDAO extends BaseDAO {

	private static Logger logger = LoggerFactory.getLogger(typeof(DMSSpareModelDAO));

	private static DMSSpareModelDAO Instance;

	private DMSSpareModelDAO() {
		super();
	}

	public static DMSSpareModelDAO getInstance() {
		if (Instance == null)
			Instance = new DMSSpareModelDAO();
		return Instance;
	}

	private static int RoleFunctionID = 700703;

	// (public\s+[a-zA-z0-9_\<\>]+\s+[a-zA-z0-9_\<\>]+\()([^\)]*)\)

	public List<DMSSpareModel> DMS_SelectSpareModelList(BMSEmployee wLoginUser, List<Int32> wID, String wModelNo,
			int wWorkType, int wModelPropertyID, int wSupplierID, String wSupplierModelNo, int wActive,
			OutResult<Int32> wErrorCode) {
		List<DMSSpareModel> wResult = new List<DMSSpareModel>();
		try {

			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser, MESDBSource.DMS);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			if (wID == null)
				wID = new List<Int32>();

			// \\\"\'\,(\w+)\,\'\\\"
			String wSQL = StringUtils.Format(
					"SELECT t1.*,  t2.PropertyName as SupplierName,  t2.PropertyNo as SupplierModelNo,t3.Name as  WorkTypeName"
							+ " FROM {0}.device_spare_model t1   left join  (SELECT  *  FROM "
							+ "  {0}.device_property_model  WHERE  DSType=2 AND DevicePropertyType =1) t2 on t1.ModelPropertyID = t2.ID   "
							+ " left join {0}.device_work_type t3 on t1.WorkType=t3.ID "
							+ " WHERE (@wID =''''or t1.ID IN( {1} ) )  "
							+ "and ( @wModelNo =''''or t1.ModelNo = @wModelNo)  "
							+ "and ( @wWorkType <= 0 or t1.WorkType  = @wWorkType)    "
							+ "and ( @wModelPropertyID <= 0 or t1.ModelPropertyID  = @wModelPropertyID)  "
							+ "and ( @wSupplierID <= 0 or t2.PropertyID  = @wSupplierID)  "
							+ "and ( @wSupplierModelNo =''''or t2.PropertyNo = @wSupplierModelNo)    "
							+ "and ( @wActive < 0 or t1.Active  = @wActive);",
					wInstance.Result, wID.Count > 0 ? StringUtils.Join(",", wID) : "0");
			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
			wParamMap.Add("wID", StringUtils.Join(",", wID));
			wParamMap.Add("wModelNo", wModelNo);
			wParamMap.Add("wWorkType", wWorkType);
			wParamMap.Add("wModelPropertyID", wModelPropertyID);
			wParamMap.Add("wSupplierModelNo", wSupplierModelNo);
			wParamMap.Add("wActive", wActive);
			wParamMap.Add("wSupplierID", wSupplierID);

			List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
			// wReader\[\"(\w+)\"\]
			for (Dictionary<String, Object> wReader : wQueryResult) {

				DMSSpareModel wDeviceModelW = new DMSSpareModel();

				wDeviceModelW.ID = StringUtils.parseInt(wReader["ID"]);
				wDeviceModelW.ModelNo = StringUtils.parseString(wReader["ModelNo"]);
				wDeviceModelW.ModelName = StringUtils.parseString(wReader["ModelName"]);
				wDeviceModelW.WorkType = StringUtils.parseInt(wReader["WorkType"]);
				wDeviceModelW.WorkTypeName = StringUtils.parseString(wReader["WorkTypeName"]);
				wDeviceModelW.ModelPropertyID = StringUtils.parseInt(wReader["SupplierID"]);
				wDeviceModelW.SupplierName = StringUtils.parseString(wReader["SupplierName"]);
				wDeviceModelW.SupplierModelNo = StringUtils.parseString(wReader["SupplierModelNo"]);
				wDeviceModelW.Life = StringUtils.parseDouble(wReader["Life"]);
				wDeviceModelW.Cost = StringUtils.parseDouble(wReader["Cost"]);
				wDeviceModelW.LimitCount = StringUtils.parseLong(wReader["LimitCount"]);
				wDeviceModelW.StockNum = StringUtils.parseInt(wReader["StockNum"]);
				wDeviceModelW.WarningCycle = StringUtils.parseDouble(wReader["WarningCycle"]);
				wDeviceModelW.WarningNum = StringUtils.parseInt(wReader["WarningNum"]);
				wDeviceModelW.OperatorID = StringUtils.parseInt(wReader["OperatorID"]);
				wDeviceModelW.OperateTime = StringUtils.parseDate(wReader["OperateTime"]);
				wDeviceModelW.Active = StringUtils.parseInt(wReader["Active"]);

				wDeviceModelW.OperatorName = BFCConstants.GetBMSEmployeeName(wDeviceModelW.OperatorID);
				wResult.Add(wDeviceModelW);
			}

		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public List<DMSSpareModel> DMS_SelectSpareModelList(BMSEmployee wLoginUser, int wWorkType, int wModelPropertyID,
			int wSupplierID, String wSupplierModelNo, int wActive, OutResult<Int32> wErrorCode) {
		List<DMSSpareModel> wResult = new List<DMSSpareModel>();
		try {
			wResult = DMS_SelectSpareModelList(wLoginUser, null, "", wWorkType, wModelPropertyID, wSupplierID,
					wSupplierModelNo, wActive, wErrorCode);
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public List<DMSSpareModel> DMS_SelectSpareModelList(BMSEmployee wLoginUser, List<Int32> wIDList,
			OutResult<Int32> wErrorCode) {
		List<DMSSpareModel> wResult = new List<DMSSpareModel>();
		try {
			if (wIDList == null || wIDList.Count < 1)
				return wResult;
			DateTime wBaseTime = DateTime.Now;
			wBaseTime.set(2000, 0, 1);
			List<Int32> wSelectList = new List<Int32>();
			for (int i = 0; i < wIDList.Count; i++) {
				wSelectList.Add(wIDList.get(i));
				if (i % 25 == 0) {
					wResult.addAll(
							DMS_SelectSpareModelList(wLoginUser, wSelectList, "", -1, -1, -1, "", -1, wErrorCode));

					wSelectList.clear();
				}
				if (i == wIDList.Count - 1) {
					if (wSelectList.Count > 0)
						wResult.addAll(
								DMS_SelectSpareModelList(wLoginUser, wSelectList, "", -1, -1, -1, "", -1, wErrorCode));
					break;
				}
			}
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public void DMS_UpdateSpareModel(BMSEmployee wLoginUser, DMSSpareModel wDeviceModel,
			OutResult<Int32> wErrorCode) {
		wErrorCode.Result = 0;
		try {

			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser, MESDBSource.DMS, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			if (wDeviceModel == null) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}
			DateTime wBaseTime = DateTime.Now;
			wBaseTime.set(2000, 0, 1);
			boolean wIsInsert = wDeviceModel.ID <= 0;

			List<DMSSpareModel> wDMSSpareModelList = DMS_SelectSpareModelList(wLoginUser, null, wDeviceModel.ModelNo,
					-1, -1, -1, "", -1, wErrorCode);
			if (wDMSSpareModelList != null && wDMSSpareModelList.Count > 0) {
				if (wIsInsert) {
					wErrorCode.Result = MESException.Duplication.Value;
					return;
				} else if (wDMSSpareModelList.stream()
						.filter(p -> p.ModelNo.equalsIgnoreCase(wDeviceModel.ModelNo) && p.ID != wDeviceModel.ID)
						.findFirst().isPresent()) {
					wErrorCode.Result = MESException.Duplication.Value;
					return;
				}
			}

			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("ModelNo", wDeviceModel.ModelNo);
			wParamMap.Add("ModelName", wDeviceModel.ModelName);
			wParamMap.Add("WorkType", wDeviceModel.WorkType);
			wParamMap.Add("SupplierID", wDeviceModel.ModelPropertyID);
			wParamMap.Add("Cost", wDeviceModel.Cost);
			wParamMap.Add("Life", wDeviceModel.Life);
			wParamMap.Add("LimitCount", wDeviceModel.LimitCount);
			wParamMap.Add("StockNum", wDeviceModel.StockNum);
			wParamMap.Add("WarningCycle", wDeviceModel.WarningCycle);
			wParamMap.Add("WarningNum", wDeviceModel.WarningNum);
			wParamMap.Add("OperatorID", wDeviceModel.OperatorID);
			wParamMap.Add("OperateTime", DateTime.Now);
			wParamMap.Add("Active", wDeviceModel.Active);

			if (wDeviceModel.ID <= 0) {

				wDeviceModel.ID = this.Insert(StringUtils.Format("{0}.device_spare_model", wInstance.Result),
						wParamMap);
			} else {
				wParamMap.Add("ID", wDeviceModel.ID);
				this.Update(StringUtils.Format("{0}.device_spare_model", wInstance.Result), "ID", wParamMap);
			}

		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return;
	}

	public void DMS_ActiveSpareModel(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive,
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

			if (wActive != 1) {
				wActive = 2;
			}
			String wSql = StringUtils.Format("UPDATE {0}.device_spare_model SET Active ={1} WHERE ID IN({2}) ;",
					wInstance.Result, String.valueOf(wActive), StringUtils.Join(",", wIDList));
			ExecuteSqlTransaction(wSql);
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
	}
}
