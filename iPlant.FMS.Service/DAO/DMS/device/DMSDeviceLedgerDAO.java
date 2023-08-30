package com.mes.server.serviceimpl.dao.dms.device;

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
import com.mes.server.service.po.dms.deviceLegder.DMSUseRecord;
import com.mes.server.service.po.dms.deviceLegder.device.DMSDeviceLedger;
import com.mes.server.service.po.dms.deviceLegder.device.DMSDeviceModel;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.dao.dms.DMSUsedRecordDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.serviceimpl.utils.fmc.FMCConstants;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException; 
import com.mes.server.service.mesenum.dms.DMSLedgerStatus;
import com.mes.server.service.mesenum.dms.DMSLedgerTypes;

public class DMSDeviceLedgerDAO extends BaseDAO {

	private static Logger logger = LoggerFactory.getLogger(typeof(DMSDeviceLedgerDAO));
	private static DMSDeviceLedgerDAO Instance;

	private DMSDeviceLedgerDAO() {
		super();
	}

	public static DMSDeviceLedgerDAO getInstance() {
		if (Instance == null)
			Instance = new DMSDeviceLedgerDAO();
		return Instance;
	}

	private static int RoleFunctionID = 700400;

	private static int RoleFunctionScapID = 700500; 

	// (public\s+[a-zA-z0-9_\<\>]+\s+[a-zA-z0-9_\<\>]+\()([^\)]*)\)
	// $1BMSEmployee wLoginUser,$2,OutResult<Int32> wErrorCode)

	public List<DMSDeviceLedger> DMS_SelectDeviceLedgerList(BMSEmployee wLoginUser, List<Int32> wID, String wCode,
			int wAssetID, int wModelID, int wBusinessUnitID, int wBaseID, int wFactoryID, int wWorkShopID, int wLineID,
			List<Int32> wStatus, OutResult<Int32> wErrorCode) {
		List<DMSDeviceLedger> wResult = new List<DMSDeviceLedger>();
		try {

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			if (wID == null)
				wID = new List<>();
			if (wStatus == null)
				wStatus = new List<>();
			if (wStatus.contains(0) && wStatus.Count == 1)
				wStatus.clear();
			if (wCode == null)
				wCode = "";

			String wSQL = StringUtils.Format(
					"SELECT t.*,t1.ModelNo ,t1.ModelName,t2.AssetNo as AssetCode FROM {0}.device_ledger t"
							+ "  left join  {0}.device_model t1 on t.ModelID=t1.ID "
							+ "  left join  {0}.fixed_asset t2 on t.AssetID=t2.ID  "
							+ "  left join  {0}.device_position t3 on t.PositionID=t3.ID  WHERE  1=1  "
							+ " and ( @wID ='' or t.ID IN( {1} ) )  "
							+ " and ( @wCode ='' or t.Code  = @wCode)  "
							+ " and ( @wAssetID <= 0 or t. AssetID  = @wAssetID)  "
							+ " and ( @wModelID <= 0 or t.ModelID  = @wModelID)   "
							+ " and ( @wStatus ='' or t.Status IN( {2} ) )  "
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
			wParamMap.Add("wAssetID", wAssetID);
			wParamMap.Add("wModelID", wModelID);
			wParamMap.Add("wStatus", StringUtils.Join(",", wStatus));
			wParamMap.Add("wBusinessUnitID", wBusinessUnitID);
			wParamMap.Add("wBaseID", wBaseID);
			wParamMap.Add("wFactoryID", wFactoryID);
			wParamMap.Add("wWorkShopID", wWorkShopID);
			wParamMap.Add("wLineID", wLineID);

			List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
			// wReader\[\"(\w+)\"\]
			for (Dictionary<String, Object> wReader : wQueryResult) {
				DMSDeviceLedger wDeviceLedger = new DMSDeviceLedger();

				wDeviceLedger.ID = StringUtils.parseInt(wReader["ID"]);
				wDeviceLedger.Code = StringUtils.parseString(wReader["Code"]);
				wDeviceLedger.Name = StringUtils.parseString(wReader["Name"]);
				wDeviceLedger.AssetID = StringUtils.parseInt(wReader["AssetID"]);
				wDeviceLedger.AssetCode = StringUtils.parseString(wReader["AssetCode"]);
				wDeviceLedger.ModelID = StringUtils.parseInt(wReader["ModelID"]);
				wDeviceLedger.ModelName = StringUtils.parseString(wReader["ModelName"]);
				wDeviceLedger.ModelNo = StringUtils.parseString(wReader["ModelNo"]);
				wDeviceLedger.Status = StringUtils.parseInt(wReader["Status"]);
				wDeviceLedger.BusinessUnitID = StringUtils.parseInt(wReader["BusinessUnitID"]);
				wDeviceLedger.BaseID = StringUtils.parseInt(wReader["BaseID"]);
				wDeviceLedger.FactoryID = StringUtils.parseInt(wReader["FactoryID"]);
				wDeviceLedger.WorkShopID = StringUtils.parseInt(wReader["WorkShopID"]);
				wDeviceLedger.LineID = StringUtils.parseInt(wReader["LineID"]);
				wDeviceLedger.PositionID = StringUtils.parseInt(wReader["PositionID"]);
				wDeviceLedger.CreatorID = StringUtils.parseInt(wReader["CreatorID"]);
				wDeviceLedger.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
				wDeviceLedger.EditorID = StringUtils.parseInt(wReader["EditorID"]);
				wDeviceLedger.EditTime = StringUtils.parseDate(wReader["EditTime"]);
				wDeviceLedger.NetValue = StringUtils.parseDouble(wReader["NetValue"]);
				wDeviceLedger.Life = StringUtils.parseDouble(wReader["DeviceLife"]);
				wDeviceLedger.ScrapValue = StringUtils.parseDouble(wReader["ScrapValue"]);
				wDeviceLedger.LimitCount = StringUtils.parseLong(wReader["LimitCount"]);

				wDeviceLedger.BusinessUnitName = FMCConstants.GetFMCBusinessUnitName(wDeviceLedger.BusinessUnitID);

				wDeviceLedger.FactoryName = FMCConstants.GetFMCFactoryName(wDeviceLedger.FactoryID);
				wDeviceLedger.WorkShopName = FMCConstants.GetFMCWorkShopName(wDeviceLedger.WorkShopID);
				wDeviceLedger.LineName = FMCConstants.GetFMCLineName(wDeviceLedger.LineID);

				wDeviceLedger.CreatorName = BFCConstants.GetBMSEmployeeName(wDeviceLedger.CreatorID);
				wDeviceLedger.EditorName = BFCConstants.GetBMSEmployeeName(wDeviceLedger.EditorID);

				wResult.Add(wDeviceLedger);
			}

		} catch (Exception e) {

			wErrorCode.Result = MESException.DBSQL.Value;
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public List<DMSDeviceLedger> DMS_SelectDeviceLedgerList(BMSEmployee wLoginUser, int wModelID, int wBusinessUnitID,
			int wBaseID, int wFactoryID, int wWorkShopID, int wLineID, DMSLedgerStatus wStatus,
			OutResult<Int32> wErrorCode) {
		List<DMSDeviceLedger> wResult = new List<DMSDeviceLedger>();
		try {
			wResult = DMS_SelectDeviceLedgerList(wLoginUser, null, "", -1, wModelID, wBusinessUnitID, wBaseID,
					wFactoryID, wWorkShopID, wLineID, StringUtils.parseList(new Int32[] { wStatus.getValue() }),
					wErrorCode);
		} catch (Exception e) {
			wErrorCode.Result = MESException.DBSQL.Value;
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public DMSDeviceLedger DMS_SelectDeviceLedger(BMSEmployee wLoginUser, int wID, String wCode, int wAssetID,
			OutResult<Int32> wErrorCode) {
		DMSDeviceLedger wResult = new DMSDeviceLedger();
		try {
			List<Int32> wIDList = new List<>();
			if (wID > 0)
				wIDList.Add(wID);
			List<DMSDeviceLedger> wDMSDeviceLedgerList = DMS_SelectDeviceLedgerList(wLoginUser, wIDList, wCode,
					wAssetID, -1, -1, -1, -1, -1, -1, null, wErrorCode);
			if (wDMSDeviceLedgerList.Count != 1)
				return wResult;

			wResult = wDMSDeviceLedgerList[0];
		} catch (Exception e) {
			wErrorCode.Result = MESException.DBSQL.Value;
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public List<DMSDeviceLedger> DMS_SelectDeviceLedgerList(BMSEmployee wLoginUser, List<Int32> wIDList,
			OutResult<Int32> wErrorCode) {
		List<DMSDeviceLedger> wResult = new List<DMSDeviceLedger>();
		try {
			if (wIDList == null || wIDList.Count < 1)
				return wResult;

			List<Int32> wSelectList = new List<>();
			for (int i = 0; i < wIDList.Count; i++) {
				wSelectList.Add(wIDList.get(i));
				if (i % 25 == 0) {
					wResult.addAll(DMS_SelectDeviceLedgerList(wLoginUser, wSelectList, "", -1, -1, -1, -1, -1, -1, -1,
							null, wErrorCode));

					wSelectList.clear();
				}
				if (i == wIDList.Count - 1) {
					if (wSelectList.Count > 0)
						wResult.addAll(DMS_SelectDeviceLedgerList(wLoginUser, wSelectList, "", -1, -1, -1, -1, -1, -1,
								-1, null, wErrorCode));
					break;
				}
			}
		} catch (Exception e) {
			wErrorCode.Result = MESException.DBSQL.Value;
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public synchronized void DMS_UpdateDeviceLedger(BMSEmployee wLoginUser, DMSDeviceLedger wDeviceLedger,
			OutResult<Int32> wErrorCode) {

		try {
			if (wDeviceLedger == null || (StringUtils.isEmpty(wDeviceLedger.Code) && wDeviceLedger.ID > 0)) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			int wFunction = 0;

			switch (DMSLedgerStatus.getEnumType(wDeviceLedger.Status)) {

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

			if (wDeviceLedger.ID > 0) {

				DMSDeviceLedger wDMSDeviceLedgerTemp = DMS_SelectDeviceLedger(wLoginUser, -1, wDeviceLedger.Code, -1,
						wErrorCode);

				if (wDMSDeviceLedgerTemp != null && wDMSDeviceLedgerTemp.ID > 0
						&& wDMSDeviceLedgerTemp.ID != wDeviceLedger.ID) {
					wErrorCode.Result = MESException.Duplication.Value;
					return;
				}

				wDMSDeviceLedgerTemp = DMS_SelectDeviceLedger(wLoginUser, wDeviceLedger.ID, "", -1, wErrorCode);
				if (wDMSDeviceLedgerTemp != null && wDMSDeviceLedgerTemp.ID == wDeviceLedger.ID
						&& wDMSDeviceLedgerTemp.Status != wDeviceLedger.Status) {
					if ((int)DMSLedgerStatus.Using() == wDeviceLedger.Status) {

						DMSUseRecord wDMSDeviceRecord = new DMSUseRecord();

						wDMSDeviceRecord.LedgerID = wDeviceLedger.ID;
						wDMSDeviceRecord.ModelID = wDeviceLedger.ModelID;
						wDMSDeviceRecord.LedgerNo = wDeviceLedger.Code;
						wDMSDeviceRecord.EndTime = DateTime.Now;
						wDMSDeviceRecord.StartTime = DateTime.Now;
						wDMSDeviceRecord.DSType = (int)DMSLedgerTypes.Device();
						wDMSDeviceRecord.ProcessingMin = 0;
						wDMSDeviceRecord.ProcessingPartsNum = 0;
						wDMSDeviceRecord.Used = 1;
						wDMSDeviceRecord.ID = 0;

						DMSUsedRecordDAO.getInstance().DMS_InsertUseRecord(wLoginUser, wDMSDeviceRecord, wErrorCode);

					}
				}

			}

			if (wDeviceLedger.ID <= 0 && StringUtils.isEmpty(wDeviceLedger.Code)) {

				DMSDeviceModel wDMSDeviceModel = DMSDeviceModelDAO.getInstance().DMS_SelectDeviceModel(wLoginUser,
						wDeviceLedger.getModelID(), wErrorCode);

				DMSDeviceLedger wDMSDeviceLedgerMax = this.DMS_SelectDeviceLedgerMax(wLoginUser,
						wDeviceLedger.getModelID(), wErrorCode);

				int wCount = 0;
				if (StringUtils.isNotEmpty(wDMSDeviceLedgerMax.Code)
						&& wDMSDeviceLedgerMax.Code.startsWith(wDMSDeviceModel.ModelNo)
						&& StringUtils.split(wDMSDeviceLedgerMax.Code, ".").length == 3) {

					wDMSDeviceLedgerMax.Code = StringUtils.split(wDMSDeviceLedgerMax.Code, ".")[2];
					wCount = StringUtils.parseInt(wDMSDeviceLedgerMax.Code);
				}
				if (wCount <= 0) {
					wCount = DMS_SelectDeviceLedgerCount(wLoginUser, wDeviceLedger.getModelID(), wErrorCode);
				}
				wDeviceLedger.Code = StringUtils.Format("{0}.{1}", wDMSDeviceModel.ModelNo,
						String.format("%04d", wCount + 1));

			}

			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("Code", wDeviceLedger.Code);
			wParamMap.Add("Name", wDeviceLedger.Name);
			wParamMap.Add("AssetID", wDeviceLedger.AssetID);
			wParamMap.Add("ModelID", wDeviceLedger.ModelID);
			wParamMap.Add("Life", wDeviceLedger.Life);
			wParamMap.Add("LimitCount", wDeviceLedger.LimitCount);
			wParamMap.Add("Status", wDeviceLedger.Status);
			wParamMap.Add("BusinessUnitID", wDeviceLedger.BusinessUnitID);
			wParamMap.Add("BaseID", wDeviceLedger.BaseID);
			wParamMap.Add("FactoryID", wDeviceLedger.FactoryID);
			wParamMap.Add("WorkShopID", wDeviceLedger.WorkShopID);
			wParamMap.Add("LineID", wDeviceLedger.LineID);
			wParamMap.Add("PositionID", wDeviceLedger.PositionID);
			wParamMap.Add("EditorID", wLoginUser.ID);
			wParamMap.Add("EditTime", DateTime.Now);

			if (wDeviceLedger.ID <= 0) {
				wParamMap.Add("CreatorID", wLoginUser.ID);
				wParamMap.Add("CreateTime", DateTime.Now);
				wDeviceLedger.ID = this.Insert(StringUtils.Format("{0}.device_ledger", wInstance.Result), wParamMap);

				DMSUseRecord wDMSDeviceRecord = new DMSUseRecord();

				wDMSDeviceRecord.LedgerID = wDeviceLedger.ID;
				wDMSDeviceRecord.ModelID = wDeviceLedger.ModelID;
				wDMSDeviceRecord.LedgerNo = wDeviceLedger.Code;
				wDMSDeviceRecord.EndTime = DateTime.Now;
				wDMSDeviceRecord.StartTime = DateTime.Now;
				wDMSDeviceRecord.DSType = (int)DMSLedgerTypes.Device();
				wDMSDeviceRecord.ProcessingMin = 0;
				wDMSDeviceRecord.ProcessingPartsNum = 0;
				wDMSDeviceRecord.Used = 1;
				wDMSDeviceRecord.ID = 0;

				DMSUsedRecordDAO.getInstance().DMS_InsertUseRecord(wLoginUser, wDMSDeviceRecord, wErrorCode);

			} else {
				wParamMap.Add("ID", wDeviceLedger.ID);
				this.Update(StringUtils.Format("{0}.device_ledger", wInstance.Result), "ID", wParamMap);
			}

		} catch (Exception e) {
			wErrorCode.Result = MESException.DBSQL.Value;
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
	}

	public DMSDeviceLedger DMS_SelectDeviceLedgerMax(BMSEmployee wLoginUser, int wModelID,
			OutResult<Int32> wErrorCode) {
		DMSDeviceLedger wResult = new DMSDeviceLedger();
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;
			String wSQL = StringUtils.Format("SELECT t.* FROM {0}.device_ledger t  WHERE  1=1 "
					+ " and    t.ModelID  = @ModelID  order by ID desc limit 1 ;", wInstance.Result);
			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("ModelID", wModelID);

			List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
			// wReader\[\"(\w+)\"\]
			for (Dictionary<String, Object> wReader : wQueryResult) {

				wResult.ID = StringUtils.parseInt(wReader["ID"]);
				wResult.Code = StringUtils.parseString(wReader["Code"]);
				wResult.Name = StringUtils.parseString(wReader["Name"]);
				wResult.ModelID = StringUtils.parseInt(wReader["ModelID"]);
			}

		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	/**
	 * 
	 * @param wModelID
	 * @return
	 */
	private synchronized int DMS_SelectDeviceLedgerCount(BMSEmployee wLoginUser, int wModelID,
			OutResult<Int32> wErrorCode) {

		ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);

		wErrorCode.set(wInstance.ErrorCode);
		if (wErrorCode.Result != 0)
			return 0;

		String wSql = StringUtils.Format("select count(0) from {0}.device_ledger t where  t.ModelID = @wModelID;",
				wInstance.Result);

		Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
		wParamMap.Add("wModelID", wModelID);
		return mDBPool.queryForObject(wSql, wParamMap, typeof(Int32));
	}

}
