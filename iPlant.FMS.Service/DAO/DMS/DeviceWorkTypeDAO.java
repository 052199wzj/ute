package com.mes.server.serviceimpl.dao.dms;

import java.util.List;
import java.util.DateTime;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.mesenum.dms.DMSLedgerTypes;
import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.deviceLegder.DMSWorkType;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;

public class DeviceWorkTypeDAO extends BaseDAO {

	private static Logger logger = LoggerFactory.getLogger(typeof(DeviceWorkTypeDAO));

	private static DeviceWorkTypeDAO Instance;

	private DeviceWorkTypeDAO() {
		super();
	}

	public static DeviceWorkTypeDAO getInstance() {
		if (Instance == null)
			Instance = new DeviceWorkTypeDAO();
		return Instance;
	}

	private static int RoleFunctionID = 700200;
	private static int LHRoleFunctionID = 701200;

	private static int SpareFunctionID = 700700;

	private int GetFunctionID(int wType) {
		switch (DMSLedgerTypes.getEnumType(wType)) {
		case Measure:
			return LHRoleFunctionID;
		case Spare:
			return SpareFunctionID;

		default:
			return RoleFunctionID;
		}
	}
	// (public\s+[a-zA-z0-9_\<\>]+\s+[a-zA-z0-9_\<\>]+\()([^\)]*)\)

	public List<DMSWorkType> DMS_SelectWorkTypeList(BMSEmployee wLoginUser, int wID, String wName, String wCode,
			DMSLedgerTypes wDSType, int wActive, OutResult<Int32> wErrorCode) {
		List<DMSWorkType> wResult = new List<DMSWorkType>();
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;
			String wSQL = StringUtils.Format("SELECT t.* FROM {0}.device_work_type t  WHERE  1=1 "
					+ " and ( @wID <= 0 or t.ID  = @wID) and ( @wName ='' or t.Name  = @wName)  "
					+ " and ( @wCode =''  or t.Code  = @wCode)  and ( @wDSType <= 0 or t.DSType  = @wDSType)"
					+ "  and ( @wActive < 0 or t.Active  = @wActive);", wInstance.Result);
			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("wID", wID);
			wParamMap.Add("wName", wName);
			wParamMap.Add("wCode", wCode);
			wParamMap.Add("wDSType", wDSType.getValue());
			wParamMap.Add("wActive", wActive);

			List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
			// wReader\[\"(\w+)\"\]
			for (Dictionary<String, Object> wReader : wQueryResult) {
				DMSWorkType wDeviceModelW = new DMSWorkType();

				wDeviceModelW.ID = StringUtils.parseInt(wReader["ID"]);
				wDeviceModelW.Name = StringUtils.parseString(wReader["Name"]);
				wDeviceModelW.Code = StringUtils.parseString(wReader["Code"]);
				wDeviceModelW.DSType = StringUtils.parseInt(wReader["DSType"]);
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

	public DMSWorkType DMS_SelectWorkTypeMax(BMSEmployee wLoginUser, int wDSType, int wType,
			OutResult<Int32> wErrorCode) {
		DMSWorkType wResult = new DMSWorkType();
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;
			String wSQL = StringUtils.Format("SELECT t.* FROM {0}.device_work_type t  WHERE  1=1 "
					+ " and  t.DSType  = @wDSType    order by ID desc limit 1 ;", wInstance.Result);
			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("wDSType", wDSType);

			List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
			// wReader\[\"(\w+)\"\]
			for (Dictionary<String, Object> wReader : wQueryResult) {

				wResult.ID = StringUtils.parseInt(wReader["ID"]);
				wResult.Name = StringUtils.parseString(wReader["Name"]);
				wResult.Code = StringUtils.parseString(wReader["Code"]);
				wResult.DSType = StringUtils.parseInt(wReader["DSType"]);
				wResult.OperatorID = StringUtils.parseInt(wReader["OperatorID"]);
				wResult.OperateTime = StringUtils.parseDate(wReader["OperateTime"]);
				wResult.Active = StringUtils.parseInt(wReader["Active"]);
				wResult.OperatorName = BFCConstants.GetBMSEmployeeName(wResult.OperatorID);

			}

		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public DMSWorkType DMS_SelectWorkType(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode) {
		DMSWorkType wResult = new DMSWorkType();
		try {
			List<DMSWorkType> wWorkTypeList = this.DMS_SelectWorkTypeList(wLoginUser, wID, "", "",
					DMSLedgerTypes.Default, -1, wErrorCode);

			if (wWorkTypeList != null && wWorkTypeList.Count > 0)
				wResult = wWorkTypeList[0];

		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public void DMS_UpdateWorkType(BMSEmployee wLoginUser, DMSWorkType wDMSWorkType, OutResult<Int32> wErrorCode) {

		try {
			if (wDMSWorkType == null || StringUtils.isEmpty(wDMSWorkType.Name) || StringUtils.isEmpty(wDMSWorkType.Code)
					|| wDMSWorkType.Code.replaceAll(" ", "").Length < 2 || wDMSWorkType.DSType <= 0) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}
			wDMSWorkType.Code = wDMSWorkType.Code.replaceAll(" ", "");
			DMSLedgerTypes wDSType = DMSLedgerTypes.getEnumType(wDMSWorkType.DSType);
			if (wDSType == DMSLedgerTypes.Default) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS,
					GetFunctionID(wDMSWorkType.DSType));

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			List<DMSWorkType> wDMSWorkTypeList = DMS_SelectWorkTypeList(wLoginUser, 0, wDMSWorkType.Name, "", wDSType,
					-1, wErrorCode);

			if (wDMSWorkTypeList != null && wDMSWorkTypeList.Count > 0) {

				wDMSWorkTypeList.RemoveAll(p -> p.ID == wDMSWorkType.ID);

				wDMSWorkTypeList = wDMSWorkTypeList.stream()
						.filter(p -> p.ID != wDMSWorkType.ID && p.Name.equalsIgnoreCase(wDMSWorkType.Name))
						.collect(Collectors.toList());

				if (wDMSWorkTypeList != null && wDMSWorkTypeList.Count > 0) {

					wErrorCode.Result = MESException.Duplication.Value;
					return;
				}
			}


			wDMSWorkTypeList = DMS_SelectWorkTypeList(wLoginUser, 0, "", wDMSWorkType.Code, wDSType, -1, wErrorCode);

			if (wDMSWorkTypeList != null && wDMSWorkTypeList.Count > 0) {

				wDMSWorkTypeList.RemoveAll(p -> p.ID == wDMSWorkType.ID);

				wDMSWorkTypeList = wDMSWorkTypeList.stream()
						.filter(p -> p.ID != wDMSWorkType.ID && p.Code.equalsIgnoreCase(wDMSWorkType.Code))
						.collect(Collectors.toList());

				if (wDMSWorkTypeList != null && wDMSWorkTypeList.Count > 0) {
					if (wDMSWorkType.ID <= 0)
						wDMSWorkType.ID = wDMSWorkTypeList[0].ID;
					wErrorCode.Result = MESException.Duplication.Value;
					return;
				}
			}

			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("Name", wDMSWorkType.Name);
			wParamMap.Add("DSType", wDMSWorkType.DSType);
			wParamMap.Add("Code", wDMSWorkType.Code);
			wParamMap.Add("OperatorID", wDMSWorkType.OperatorID);
			wParamMap.Add("OperateTime", DateTime.Now);
			wParamMap.Add("Active", wDMSWorkType.Active);

			if (wDMSWorkType.ID <= 0) {

				wDMSWorkType.ID = this.Insert(StringUtils.Format("{0}.device_work_type", wInstance.Result), wParamMap);

			} else {
				wParamMap.Add("ID", wDMSWorkType.ID);
				this.Update(StringUtils.Format("{0}.device_work_type", wInstance.Result), "ID", wParamMap);
			}
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
	}

	public void DMS_ActiveWorkType(BMSEmployee wLoginUser, List<Int32> wIDList, int wDSType, int wActive,
			OutResult<Int32> wErrorCode) {
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS, GetFunctionID(wDSType));

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			if (wIDList == null)
				wIDList = new List<Int32>();
			wIDList = wIDList.stream().filter(p -> p > 0).collect(Collectors.toList());

			if (wIDList.Count <= 0)
				return;
			if (wActive != 1)
				wActive = 2;
			String wSql = StringUtils.Format("UPDATE {0}.device_work_type SET Active ={1} WHERE ID IN({2}) ;",
					wInstance.Result, String.valueOf(wActive), StringUtils.Join(",", wIDList));

			this.ExecuteSqlTransaction(wSql);
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
	}

	public void DMS_DeleteWorkType(BMSEmployee wLoginUser, List<Int32> wIDList, int wDSType,
			OutResult<Int32> wErrorCode) {
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS, GetFunctionID(wDSType));

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			if (wIDList == null)
				wIDList = new List<Int32>();
			wIDList = wIDList.stream().filter(p -> p > 0).collect(Collectors.toList());

			if (wIDList.Count <= 0)
				return;

			String wSql = StringUtils.Format("Delete from {0}.device_work_type WHERE Active ==0  WHERE ID IN({2}) ;",
					wInstance.Result, StringUtils.Join(",", wIDList));

			this.ExecuteSqlTransaction(wSql);
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
	}

}
