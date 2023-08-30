package com.mes.server.serviceimpl.dao.dms;

import java.util.List;

import java.util.DateTime;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.deviceLegder.DMSEquipSpare;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;

public class DeviceEquipSpareDAO extends BaseDAO {

	private static Logger logger = LoggerFactory.getLogger(typeof(DeviceEquipSpareDAO));

	private static DeviceEquipSpareDAO Instance;

	private DeviceEquipSpareDAO() {
		super();
	}

	public static DeviceEquipSpareDAO getInstance() {
		if (Instance == null)
			Instance = new DeviceEquipSpareDAO();
		return Instance;
	}

	private static int RoleFunctionID = 700704;

	public List<DMSEquipSpare> DMS_SelectEquipSpareList(BMSEmployee wLoginUser, List<Int32> wID, String wDeviceSpareName,
			int wDeviceModelID, int wSpareModelID, int wActive, DateTime wStartTime, DateTime wEndTime,
			OutResult<Int32> wErrorCode) {
		List<DMSEquipSpare> wResult = new List<DMSEquipSpare>();
		try {

			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser, MESDBSource.DMS);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			if (wID == null)
				wID = new List<Int32>();

			DateTime wBaseTime = DateTime.Now;
			wBaseTime.set(2000, 0, 1);
			if ( wStartTime.CompareTo(wBaseTime) < 0)
				wStartTime = wBaseTime;
			if ( wEndTime.CompareTo(wBaseTime) < 0)
				wEndTime = wBaseTime;
			if (wStartTime.CompareTo(wEndTime) > 0)
				return wResult;

			// \\\"\'\,(\w+)\,\'\\\"
			String wSQL = StringUtils.Format("SELECT t.*,t1.ModelName as DeviceModelName, t1.ModelNo as DeviceModelNo,"
					+ " t2.ModelNo as SpareModelNo,t2.ModelName as SpareModelName  FROM {0}.device_equip_spare t"
					+ " left join {0}.device_model t1 on  t.DeviceModelID=t1.ID "
					+ " left join {0}.device_spare_model t2 on  t.SpareModelID=t2.ID  WHERE  1=1  "
					+ " and ( @wID ='' or t.ID IN( {1} ) )  "
					+ " and ( @wActive < 0 or t.Active  = @wActive)  "
					+ " and ( @wDeviceSpareName ='' or t.DeviceSpareName = @wDeviceSpareName)   "
					+ " and ( @wDeviceModelID <= 0 or t.DeviceModelID  = @wDeviceModelID)  "
					+ " and ( @wSpareModelID <= 0 or t.SpareModelID  = @wSpareModelID)   "
					+ " and ( @wStartTime <=str_to_date('2010-01-01', '%Y-%m-%d') or @wStartTime <= t.EditTime) "
					+ " and ( @wEndTime <=str_to_date('2010-01-01', '%Y-%m-%d') or @wEndTime >= t.CreateTime) ",
					wInstance.Result, wID.Count > 0 ? StringUtils.Join(",", wID) : "0");
			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("wID", StringUtils.Join(",", wID));
			wParamMap.Add("wDeviceSpareName", wDeviceSpareName);
			wParamMap.Add("wDeviceModelID", wDeviceModelID);
			wParamMap.Add("wSpareModelID", wSpareModelID);
			wParamMap.Add("wStartTime", wStartTime);
			wParamMap.Add("wEndTime", wEndTime);
			wParamMap.Add("wActive", wActive);

			List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
			// wReader\[\"(\w+)\"\]
			for (Dictionary<String, Object> wReader : wQueryResult) {

				DMSEquipSpare wEquipSpare = new DMSEquipSpare();

				wEquipSpare.ID = StringUtils.parseInt(wReader["ID"]);
				wEquipSpare.DeviceSpareName = StringUtils.parseString(wReader["DeviceSpareName"]);
				wEquipSpare.DeviceModelID = StringUtils.parseInt(wReader["DeviceModelID"]);
				wEquipSpare.SpareModelID = StringUtils.parseInt(wReader["SpareModelID"]);
				wEquipSpare.EquipNum = StringUtils.parseInt(wReader["EquipNum"]);
				wEquipSpare.EquipOptions = StringUtils
						.parseIntList(StringUtils.parseString(wReader["EquipOptions"]), ",");
				wEquipSpare.CreatorID = StringUtils.parseInt(wReader["CreatorID"]);
				wEquipSpare.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
				wEquipSpare.EditorID = StringUtils.parseInt(wReader["EditorID"]);
				wEquipSpare.EditTime = StringUtils.parseDate(wReader["EditTime"]);
				wEquipSpare.Active = StringUtils.parseInt(wReader["Active"]);

				wEquipSpare.CreatorName = BFCConstants.GetBMSEmployeeName(wEquipSpare.CreatorID);
				wEquipSpare.EditorName = BFCConstants.GetBMSEmployeeName(wEquipSpare.EditorID);

				wResult.Add(wEquipSpare);
			}

		} catch (Exception e) {
			wErrorCode.Result = MESException.DBSQL.Value;
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public List<DMSEquipSpare> DMS_SelectEquipSpareList(BMSEmployee wLoginUser, String wDeviceSpareName,
			int wDeviceModelID, int wSpareModelID, int wActive, DateTime wStartTime, DateTime wEndTime,
			OutResult<Int32> wErrorCode) {
		List<DMSEquipSpare> wResult = new List<DMSEquipSpare>();
		try {
			wResult = DMS_SelectEquipSpareList(wLoginUser, null, wDeviceSpareName, wDeviceModelID, wSpareModelID,
					wActive, wStartTime, wEndTime, wErrorCode);
		} catch (Exception e) {
			wErrorCode.Result = MESException.DBSQL.Value;
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public DMSEquipSpare DMS_SelectEquipSpare(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode) {
		DMSEquipSpare wResult = new DMSEquipSpare();
		try {
			DateTime wBaseTime = DateTime.Now;
			wBaseTime.set(2000, 0, 1);
			List<DMSEquipSpare> wDMSEquipSpareList = DMS_SelectEquipSpareList(wLoginUser,
					StringUtils.parseList(new Int32[] { wID }), "", -1, -1, -1, wBaseTime, wBaseTime, wErrorCode);
			if (wDMSEquipSpareList.Count == 1)
				wResult = wDMSEquipSpareList[0];
		} catch (Exception e) {
			wErrorCode.Result = MESException.DBSQL.Value;
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public void DMS_UpdateEquipSpare(BMSEmployee wLoginUser, DMSEquipSpare wDeviceEquipSpare,
			OutResult<Int32> wErrorCode) {

		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser, MESDBSource.DMS, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			if (wDeviceEquipSpare == null) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			if (wDeviceEquipSpare.EquipOptions == null)
				wDeviceEquipSpare.EquipOptions = new List<>();

			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("DeviceSpareName", wDeviceEquipSpare.DeviceSpareName);
			wParamMap.Add("DeviceModelID", wDeviceEquipSpare.DeviceModelID);
			wParamMap.Add("SpareModelID", wDeviceEquipSpare.SpareModelID);
			wParamMap.Add("EquipNum", wDeviceEquipSpare.EquipNum);
			wParamMap.Add("EquipOptions", StringUtils.Join(",", wDeviceEquipSpare.EquipOptions));
			wParamMap.Add("EditTime", wDeviceEquipSpare.EditTime);
			wParamMap.Add("EditorID", wDeviceEquipSpare.EditorID);
			wParamMap.Add("Active", wDeviceEquipSpare.Active);

			if (wDeviceEquipSpare.ID <= 0) {
				wParamMap.Add("CreatorID", wLoginUser.ID);
				wParamMap.Add("CreateTime", DateTime.Now);
				wDeviceEquipSpare.ID = this.Insert(StringUtils.Format("{0}.device_equip_spare", wInstance.Result),
						wParamMap);

			} else {
				wParamMap.Add("ID", wDeviceEquipSpare.ID);
				this.Update(StringUtils.Format("{0}.device_equip_spare", wInstance.Result), "ID", wParamMap);
			}

		} catch (Exception e) {
			wErrorCode.Result = MESException.DBSQL.Value;
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
	}

	public void DMS_ActiveEquipSpare(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive, OutResult<Int32> wErrorCode) {

		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser, MESDBSource.DMS, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			if (wIDList == null || wIDList.Count <= 0) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}
			wIDList.RemoveAll(p -> p <= 0);

			if (wIDList.Count <= 0) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}
			if (wActive != 1)
				wActive = 2;

			String wSql = StringUtils.Format("UPDATE {0}.device_equip_spare SET Active ={1} WHERE ID IN({2}) ;",
					wInstance.Result, String.valueOf(wActive), StringUtils.Join(",", wIDList));
			ExecuteSqlTransaction(wSql);
		} catch (Exception e) {
			wErrorCode.Result = MESException.DBSQL.Value;
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
	}
}
