package com.mes.server.serviceimpl.dao.dms.spare;

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
import com.mes.server.service.po.dms.deviceLegder.DMSUseRecord;
import com.mes.server.service.po.dms.deviceLegder.device.DMSDeviceLedger;
import com.mes.server.service.po.dms.deviceLegder.device.DMSDeviceModel;
import com.mes.server.service.po.dms.deviceLegder.spare.DMSSpareLedger;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.dao.dms.DMSUsedRecordDAO;
import com.mes.server.serviceimpl.dao.dms.DeviceEquipSpareDAO;
import com.mes.server.serviceimpl.dao.dms.device.DMSDeviceModelDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.serviceimpl.utils.dms.DMSConstants;
import com.mes.server.serviceimpl.utils.fmc.FMCConstants;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException; 
import com.mes.server.service.mesenum.dms.DMSLedgerStatus;
import com.mes.server.service.mesenum.dms.DMSLedgerTypes;

public class DMSSpareLedgerDAO extends BaseDAO {

	private static Logger logger = LoggerFactory.getLogger(typeof(DMSSpareLedgerDAO));

	private static DMSSpareLedgerDAO Instance;

	private DMSSpareLedgerDAO() {
		super();
	}

	public static DMSSpareLedgerDAO getInstance() {
		if (Instance == null)
			Instance = new DMSSpareLedgerDAO();
		return Instance;
	}

	private static int RoleFunctionID = 700701;
	private static int RoleFunctionScapID = 700702; 
	// (public\s+[a-zA-z0-9_\<\>]+\s+[a-zA-z0-9_\<\>]+\()([^\)]*)\)
	// $1BMSEmployee wLoginUser,$2,OutResult<Int32> wErrorCode)

	public List<DMSSpareLedger> DMS_SelectSpareLedgerList(BMSEmployee wLoginUser, List<Int32> wID, String wCode,
			int wModelID, int wEquipID, int wDeviceID, int wBusinessUnitID, int wBaseID, int wFactoryID,
			int wWorkShopID, int wLineID, List<Int32> wStatus, OutResult<Int32> wErrorCode) {
		List<DMSSpareLedger> wResult = new List<DMSSpareLedger>();
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			if (wID == null)
				wID = new List<Int32>();
			wID.RemoveAll(p -> p <= 0);
			if (wStatus == null)
				wStatus = new List<>();
			wStatus.RemoveAll(p -> p <= 0);

			// \\\"\'\,(\w+)\,\'\\\"
			String wSQL = StringUtils.Format(
					"SELECT t.*,t1.ModelName,t1.ModelNo,t2.Code as DeviceNo FROM {0}.device_spare_ledger t"
							+ " left join  {0}.device_spare_model t1 on t.ModelID=t1.ID "
							+ " left join  {0}.device_ledger t2 on t.DeviceID=t2.ID  WHERE  1=1  "
							+ " and ( @wID ='' or t.ID IN( {1} ) )  " + " and ( @wCode ='' or t.Code =@wCode )   "
							+ " and ( @wModelID <= 0 or t.ModelID  = @wModelID)     "
							+ " and ( @wStatus ='' or t.Status IN( {2} ) )  "
							+ " and ( @wEquipID <= 0 or t.EquipID  = @wEquipID)  "
							+ " and ( @wDeviceID <= 0 or t.DeviceID  = @wDeviceID)   "
							+ " and ( @wBusinessUnitID <= 0 or t.BusinessUnitID  = @wBusinessUnitID)   "
							+ " and ( @wBaseID <= 0 or t.BaseID  = @wBaseID)   "
							+ " and ( @wFactoryID <= 0 or t.FactoryID  = @wFactoryID)   "
							+ " and ( @wWorkShopID <= 0 or t.WorkShopID  = @wWorkShopID)  "
							+ " and ( @wLineID <= 0 or t.LineID  = @wLineID)    ;",
					wInstance.Result, wID.Count > 0 ? StringUtils.Join(",", wID) : "0",
					wStatus.Count > 0 ? StringUtils.Join(",", wStatus) : "0");
			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
			wParamMap.Add("wID", StringUtils.Join(",", wID));
			wParamMap.Add("wCode", wCode);
			wParamMap.Add("wStatus", StringUtils.Join(",", wStatus));
			wParamMap.Add("wModelID", wModelID);
			wParamMap.Add("wEquipID", wEquipID);
			wParamMap.Add("wDeviceID", wDeviceID);
			wParamMap.Add("wBusinessUnitID", wBusinessUnitID);
			wParamMap.Add("wBaseID", wBaseID);
			wParamMap.Add("wFactoryID", wFactoryID);
			wParamMap.Add("wWorkShopID", wWorkShopID);
			wParamMap.Add("wLineID", wLineID);

			List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
			// wReader\[\"(\w+)\"\]
			for (Dictionary<String, Object> wReader : wQueryResult) {
				DMSSpareLedger wSpareLedger = new DMSSpareLedger();

				wSpareLedger.ID = StringUtils.parseInt(wReader["ID"]);
				wSpareLedger.Code = StringUtils.parseString(wReader["Code"]);
				wSpareLedger.Name = StringUtils.parseString(wReader["Name"]);
				wSpareLedger.ModelID = StringUtils.parseInt(wReader["ModelID"]);
				wSpareLedger.ModelNo = StringUtils.parseString(wReader["ModelNo"]);
				wSpareLedger.ModelName = StringUtils.parseString(wReader["ModelName"]);
				wSpareLedger.EquipID = StringUtils.parseInt(wReader["EquipID"]);
				wSpareLedger.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
				wSpareLedger.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
				wSpareLedger.Life = StringUtils.parseDouble(wReader["Life"]);
				wSpareLedger.LimitCount = StringUtils.parseLong(wReader["LimitCount"]);
				wSpareLedger.BusinessUnitID = StringUtils.parseInt(wReader["BusinessUnitID"]);
				wSpareLedger.BaseID = StringUtils.parseInt(wReader["BaseID"]);
				wSpareLedger.FactoryID = StringUtils.parseInt(wReader["FactoryID"]);
				wSpareLedger.WorkShopID = StringUtils.parseInt(wReader["WorkShopID"]);
				wSpareLedger.LineID = StringUtils.parseInt(wReader["LineID"]);
				wSpareLedger.Status = StringUtils.parseInt(wReader["Status"]);
				wSpareLedger.CreatorID = StringUtils.parseInt(wReader["CreatorID"]);
				wSpareLedger.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
				wSpareLedger.EditorID = StringUtils.parseInt(wReader["EditorID"]);
				wSpareLedger.EditTime = StringUtils.parseDate(wReader["EditTime"]);

				wSpareLedger.BusinessUnitName = FMCConstants.GetFMCBusinessUnitName(wSpareLedger.BusinessUnitID);

				wSpareLedger.FactoryName = FMCConstants.GetFMCFactoryName(wSpareLedger.FactoryID);
				wSpareLedger.WorkShopName = FMCConstants.GetFMCWorkShopName(wSpareLedger.WorkShopID);
				wSpareLedger.LineName = FMCConstants.GetFMCLineName(wSpareLedger.LineID);

				wSpareLedger.CreatorName = BFCConstants.GetBMSEmployeeName(wSpareLedger.CreatorID);
				wSpareLedger.EditorName = BFCConstants.GetBMSEmployeeName(wSpareLedger.EditorID);

				wResult.Add(wSpareLedger);
			}
		} catch (Exception e) {
			wErrorCode.Result = MESException.DBSQL.Value;
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public List<DMSSpareLedger> DMS_SelectSpareLedgerList(BMSEmployee wLoginUser, int wModelID, int wEquipID,
			int wDeviceID, int wBusinessUnitID, int wBaseID, int wFactoryID, int wWorkShopID, int wLineID,
			DMSLedgerStatus wStatus, OutResult<Int32> wErrorCode) {
		List<DMSSpareLedger> wResult = new List<DMSSpareLedger>();
		try {
			wResult = DMS_SelectSpareLedgerList(wLoginUser, null, "", wModelID, wEquipID, wDeviceID, wBusinessUnitID,
					wBaseID, wFactoryID, wWorkShopID, wLineID,
					StringUtils.parseList(new Int32[] { wStatus.getValue() }), wErrorCode);
		} catch (Exception e) {
			wErrorCode.Result = MESException.DBSQL.Value;
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public DMSSpareLedger DMS_SelectSpareLedger(BMSEmployee wLoginUser, int wID, String wCode,
			OutResult<Int32> wErrorCode) {
		DMSSpareLedger wResult = new DMSSpareLedger();
		try {
			List<Int32> wIDList = new List<>();
			if (wID > 0)
				wIDList.Add(wID);

			List<DMSSpareLedger> wDMSSpareLedgerList = DMS_SelectSpareLedgerList(wLoginUser, wIDList, wCode, -1, -1, -1,
					-1, -1, -1, -1, -1, null, wErrorCode);

			if (wDMSSpareLedgerList.Count > 0)
				wResult = wDMSSpareLedgerList[0];
		} catch (Exception e) {
			wErrorCode.Result = MESException.DBSQL.Value;
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public List<DMSSpareLedger> DMS_SelectSpareLedgerList(BMSEmployee wLoginUser, List<Int32> wIDList,
			OutResult<Int32> wErrorCode) {
		List<DMSSpareLedger> wResult = new List<DMSSpareLedger>();
		try {
			if (wIDList == null || wIDList.Count < 1)
				return wResult;

			List<Int32> wSelectList = new List<>();
			for (int i = 0; i < wIDList.Count; i++) {
				wSelectList.Add(wIDList.get(i));
				if (i % 25 == 0) {
					wResult.addAll(DMS_SelectSpareLedgerList(wLoginUser, wSelectList, "", -1, -1, -1, -1, -1, -1, -1,
							-1, null, wErrorCode));

					wSelectList.clear();
				}
				if (i == wIDList.Count - 1) {
					if (wSelectList.Count > 0)
						wResult.addAll(DMS_SelectSpareLedgerList(wLoginUser, wSelectList, "", -1, -1, -1, -1, -1, -1,
								-1, -1, null, wErrorCode));
					break;
				}
			}
		} catch (Exception e) {
			wErrorCode.Result = MESException.DBSQL.Value;
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public void DMS_UpdateSpareLedger(BMSEmployee wLoginUser, DMSSpareLedger wSpareLedger,
			OutResult<Int32> wErrorCode) {

		try {
			if (wSpareLedger == null) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			int wFunction = 0;

			switch (DMSLedgerStatus.getEnumType(wSpareLedger.Status)) {

			case Scrap:
			case SealUp:
			case Using:
			case Free:
				wFunction = RoleFunctionScapID;
				break;
			default:
				wFunction = RoleFunctionID;
				break;
			} 

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS, wFunction);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;
			DMSSpareLedger wSpareLedgerTemp = null;
			if (StringUtils.isNotEmpty(wSpareLedger.Code)) {
				wSpareLedgerTemp = DMS_SelectSpareLedger(wLoginUser, -1, wSpareLedger.Code, wErrorCode);
				if (wSpareLedgerTemp != null && wSpareLedgerTemp.ID > 0 && wSpareLedgerTemp.ID != wSpareLedger.ID) {
					wErrorCode.Result = MESException.Duplication.Value;
					return;
				}
			}

			if (wSpareLedger.ID > 0 && (int)DMSLedgerStatus.Using() == wSpareLedger.Status) {

				wSpareLedgerTemp = DMS_SelectSpareLedger(wLoginUser, wSpareLedger.ID, "", wErrorCode);

				if (wSpareLedgerTemp != null && wSpareLedgerTemp.ID == wSpareLedger.ID
						&& wSpareLedgerTemp.Status != wSpareLedger.Status) {

					DMSDeviceLedger wDMSDeviceLedger = DMSConstants.GetDMSDeviceLedger(wSpareLedger.DeviceID);

					if (wDMSDeviceLedger == null || wDMSDeviceLedger.ID <= 0 || wSpareLedger.EquipID <= 0) {
						wErrorCode.Result = MESException.Logic.Value;
						return;
					}

					DMSEquipSpare wDMSEquipSpare = DeviceEquipSpareDAO.getInstance().DMS_SelectEquipSpare(wLoginUser,
							wSpareLedger.EquipID, wErrorCode);

					if (wDMSEquipSpare == null || wDMSEquipSpare.ID <= 0) {
						wErrorCode.Result = MESException.Logic.Value;
						return;
					}

					List<DMSSpareLedger> wDMSSpareLedgerList = DMS_SelectSpareLedgerList(wLoginUser, -1,
							wDMSEquipSpare.ID, wDMSDeviceLedger.ID, -1, -1, -1, -1, -1, DMSLedgerStatus.Default,
							wErrorCode);

					if (wDMSSpareLedgerList.Count >= wDMSEquipSpare.EquipNum) {
						wErrorCode.Result = MESException.Logic.Value;
						return;
					}
					DMSUseRecord wDMSSpareRecord = new DMSUseRecord();

					wDMSSpareRecord.EquipmentID = wSpareLedger.DeviceID;
					wDMSSpareRecord.LedgerID = wSpareLedger.ID; 
					wDMSSpareRecord.DSType = (int)DMSLedgerTypes.Spare();
					wDMSSpareRecord.ModelID = wSpareLedger.ModelID;
					wDMSSpareRecord.EquipmentNo = wSpareLedger.Code;
					wDMSSpareRecord.EndTime = DateTime.Now;
					wDMSSpareRecord.StartTime = DateTime.Now;
					wDMSSpareRecord.ProcessingMin = 0;
					wDMSSpareRecord.ProcessingPartsNum = 0;
					wDMSSpareRecord.Used = 1;
					wDMSSpareRecord.ID = 0;

					DMSUsedRecordDAO.getInstance().DMS_InsertUseRecord(SysAdmin, wDMSSpareRecord, wErrorCode);

				}

			}
			if (wSpareLedger.ID <= 0 && StringUtils.isEmpty(wSpareLedger.Code)) {

				DMSDeviceModel wDMSDeviceModel = DMSDeviceModelDAO.getInstance().DMS_SelectDeviceModel(wLoginUser,
						wSpareLedger.getModelID(), wErrorCode);
				int wCount = SelectLedgerCount(wLoginUser, wSpareLedger.getModelID(), wErrorCode);
				wSpareLedger.Code = StringUtils.Format("SP-{0}-{1}-{2}", wDMSDeviceModel.ModelNo,
						StringUtils.parseCalendarToString(DateTime.Now, "yyyy-MM"),
						String.format("%05d", wCount + 1));
			}

			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
			wParamMap.Add("ID", wSpareLedger.ID);
			wParamMap.Add("Code", wSpareLedger.Code);
			wParamMap.Add("Name", wSpareLedger.Name);
			wParamMap.Add("ModelID", wSpareLedger.ModelID);
			wParamMap.Add("DeviceID", wSpareLedger.DeviceID);
			wParamMap.Add("EquipID", wSpareLedger.EquipID);
			wParamMap.Add("Life", wSpareLedger.Life);
			wParamMap.Add("LimitCount", wSpareLedger.LimitCount);
			wParamMap.Add("BusinessUnitID", wSpareLedger.BusinessUnitID);
			wParamMap.Add("BaseID", wSpareLedger.BaseID);
			wParamMap.Add("FactoryID", wSpareLedger.FactoryID);
			wParamMap.Add("WorkShopID", wSpareLedger.WorkShopID);
			wParamMap.Add("LineID", wSpareLedger.LineID);
			wParamMap.Add("Status", wSpareLedger.Status);
			wParamMap.Add("EditorID", wLoginUser.ID);
			wParamMap.Add("EditTime", DateTime.Now);

			if (wSpareLedger.ID <= 0) {
				wParamMap.Add("CreatorID", wLoginUser.ID);
				wParamMap.Add("CreateTime", DateTime.Now);
				wSpareLedger.ID = this.Insert(StringUtils.Format("{0}.device_spare_ledger", wInstance.Result),
						wParamMap);

				DMSUseRecord wDMSSpareRecord = new DMSUseRecord();
				wDMSSpareRecord.DSType = (int)DMSLedgerTypes.Spare(); 
				wDMSSpareRecord.EquipmentID = wSpareLedger.DeviceID;
				wDMSSpareRecord.LedgerID = wSpareLedger.ID;
				wDMSSpareRecord.ModelID = wSpareLedger.ModelID;
				wDMSSpareRecord.EquipmentNo = wSpareLedger.Code;
				wDMSSpareRecord.EndTime = DateTime.Now;
				wDMSSpareRecord.StartTime = DateTime.Now;
				wDMSSpareRecord.ProcessingMin = 0;
				wDMSSpareRecord.ProcessingPartsNum = 0;
				wDMSSpareRecord.Used = 1;
				wDMSSpareRecord.ID = 0;

				DMSUsedRecordDAO.getInstance().DMS_InsertUseRecord(SysAdmin, wDMSSpareRecord, wErrorCode);

			} else {
				wParamMap.Add("ID", wSpareLedger.ID);
				this.Update(StringUtils.Format("{0}.device_spare_ledger", wInstance.Result), "ID", wParamMap);
			}

		} catch (Exception e) {
			wErrorCode.Result = MESException.DBSQL.Value;
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
	}

	/**
	 * 
	 * @param wModelID
	 * @return
	 */
	private int SelectLedgerCount(BMSEmployee wLoginUser, int wModelID, OutResult<Int32> wErrorCode) {
		ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);

		wErrorCode.set(wInstance.ErrorCode);
		if (wErrorCode.Result != 0)
			return 0;
		String wSql = StringUtils.Format("select count(0) from {0}.device_spare_ledger where    t.ModelID = @wModelID",
				wInstance.Result);

		Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
		wParamMap.Add("wModelID", wModelID);
		return mDBPool.queryForObject(wSql, wParamMap, typeof(Int32));
	}
}
