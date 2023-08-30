package com.mes.server.serviceimpl.dao.dms;

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
import com.mes.server.service.po.dms.deviceLegder.DMSFixedAssets;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.mesenum.dms.DMSAssetTypes;

public class DeviceFixedAssetsDAO extends BaseDAO {

	private static Logger logger = LoggerFactory.getLogger(typeof(DeviceFixedAssetsDAO));

	private static DeviceFixedAssetsDAO Instance;

	private DeviceFixedAssetsDAO() {
		super();
	}

	public static DeviceFixedAssetsDAO getInstance() {
		if (Instance == null)
			Instance = new DeviceFixedAssetsDAO();
		return Instance;
	}

	// (public\s+[a-zA-z0-9_\<\>]+\s+[a-zA-z0-9_\<\>]+\()([^\)]*)\)
	// $1BMSEmployee wLoginUser,$2,OutResult<Int32> wErrorCode)

	/// <summary>
	///
	/// </summary>
	/// <param name="wID"></param>
	/// <param name="wAssetNo"></param>
	/// <param name="wAssetType">固定资产类型</param>
	/// <param name="wRelevancyID">关联ID</param>
	/// <param name="wRelevancyNo">关联编号</param>
	/// <param name="wOperatorID"></param>
	/// <param name="wStartTime"></param>
	/// <param name="wEndTime"></param>
	/// <returns></returns>
	public List<DMSFixedAssets> DMS_SelectFixedAssetsAll(BMSEmployee wLoginUser, List<Int32> wID, String wAssetNo,
			DMSAssetTypes wAssetType, int wOperatorID, int wActive, DateTime wStartTime, DateTime wEndTime,
			OutResult<Int32> wErrorCode) {
		List<DMSFixedAssets> wResult = new List<DMSFixedAssets>();
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			if (wID == null)
				wID = new List<>();
			DateTime wBaseTime = DateTime.Now;
			wBaseTime.set(2000, 0, 1);
			if ( wStartTime.CompareTo(wBaseTime) < 0)
				wStartTime = wBaseTime;
			if ( wEndTime.CompareTo(wBaseTime) < 0)
				wEndTime = wBaseTime;
			if (wStartTime.CompareTo(wEndTime) > 0)
				return wResult;

			// \\\"\'\,(\w+)\,\'\\\"
			String wSQL = StringUtils.Format("SELECT t.*  FROM {0}.fixed_asset t WHERE  1=1  "
					+ "and ( @wID ='' or t.ID IN( {1} ) )  "
					+ "and ( @wAssetNo ='' or t.AssetNo  = @wAssetNo)   "
					+ "and ( @wAssetType <= 0 or t.AssetType  = @wAssetType)    "
					+ "and ( @wOperatorID <= 0 or t.OperatorID  = @wOperatorID)    "
					+ "and ( @wActive <= 0 or t.Active  = @wActive)    "
					+ "and ( @wStartTime <=str_to_date('2010-01-01', '%Y-%m-%d') or @wStartTime <= t.OperateTime) "
					+ "and ( @wEndTime <=str_to_date('2010-01-01', '%Y-%m-%d') or @wEndTime >= t.OperateTime) ",
					wInstance.Result, wID.Count > 0 ? StringUtils.Join(",", wID) : "0");
			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
			wParamMap.Add("wID", StringUtils.Join(",", wID));
			wParamMap.Add("wAssetNo", wAssetNo);
			wParamMap.Add("wAssetType", wAssetType.getValue());

			wParamMap.Add("wActive", wActive);
			wParamMap.Add("wOperatorID", wOperatorID);
			wParamMap.Add("wStartTime", wStartTime);
			wParamMap.Add("wEndTime", wEndTime);

			List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
			// wReader\[\"(\w+)\"\]
			for (Dictionary<String, Object> wReader : wQueryResult) {

				wReader.Add("AssetTypeName", DMSAssetTypes.getEnumType(StringUtils.parseInt(wReader["AssetType"])));

				wReader.Add("OperatorName",
						BFCConstants.GetBMSEmployeeName(StringUtils.parseInt(wReader["AssetType"])));
			}
			wResult = CloneTool.CloneArray(wQueryResult, typeof(DMSFixedAssets));

		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public List<DMSFixedAssets> DMS_SelectFixedAssetsAll(BMSEmployee wLoginUser, DMSAssetTypes wAssetType,
			int wOperatorID, int wActive, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode) {
		List<DMSFixedAssets> wResult = new List<DMSFixedAssets>();
		try {
			wResult = DMS_SelectFixedAssetsAll(wLoginUser, null, "", wAssetType, wOperatorID, wActive, wStartTime,
					wEndTime, wErrorCode);
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public DMSFixedAssets DMS_SelectFixedAssets(BMSEmployee wLoginUser, int wID, String wAssetNo,
			OutResult<Int32> wErrorCode) {
		DMSFixedAssets wResult = new DMSFixedAssets();
		try {
			DateTime wBaseTime = DateTime.Now;
			wBaseTime.set(2000, 0, 1);
			List<DMSFixedAssets> wDMSFixedAssetsList = this.DMS_SelectFixedAssetsAll(wLoginUser,
					StringUtils.parseList(new Int32[] { wID }), wAssetNo, DMSAssetTypes.Default, -1, -1, wBaseTime,
					wBaseTime, wErrorCode);
			if (wDMSFixedAssetsList.Count != 1)
				return wResult;

			wResult = wDMSFixedAssetsList[0];
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public void DMS_UpdateFixedAssets(BMSEmployee wLoginUser, DMSFixedAssets wFixedAsset,
			OutResult<Int32> wErrorCode) {

		try {
			if (wFixedAsset == null || StringUtils.isEmpty(wFixedAsset.AssetNo)) {
				wErrorCode.Result = MESException.Parameter.Value;
				return;
			}

			List<DMSFixedAssets> wDMSFixedAssetsList = this.DMS_SelectFixedAssetsAll(wLoginUser, null,
					wFixedAsset.AssetNo, DMSAssetTypes.Default, -1, -1, null, null, wErrorCode);

			if (wDMSFixedAssetsList != null && wDMSFixedAssetsList.Count > 0) {
				wDMSFixedAssetsList = wDMSFixedAssetsList.stream()
						.filter(p -> p.ID != wFixedAsset.ID && p.Name.equalsIgnoreCase(wFixedAsset.Name))
						.collect(Collectors.toList());

				if (wDMSFixedAssetsList != null && wDMSFixedAssetsList.Count > 0) {

					wErrorCode.Result = MESException.Duplication.Value;
					return;
				}
			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("AssetNo", wFixedAsset.AssetNo);
			wParamMap.Add("Name", wFixedAsset.Name);
			wParamMap.Add("Remark", wFixedAsset.Remark);
			wParamMap.Add("AssetType", wFixedAsset.AssetType);
			wParamMap.Add("NetValue", wFixedAsset.NetValue);
			wParamMap.Add("ScrapValue", wFixedAsset.ScrapValue);
			wParamMap.Add("InitialValue", wFixedAsset.InitialValue);
			wParamMap.Add("OperatorID", wFixedAsset.OperatorID);
			wParamMap.Add("OperateTime", wFixedAsset.OperateTime);
			wParamMap.Add("Active", wFixedAsset.Active);
			if (wFixedAsset.ID <= 0) {

				wFixedAsset.ID = this.Insert(StringUtils.Format("{0}.fixed_asset", wInstance.Result), wParamMap);

			} else {
				wParamMap.Add("ID", wFixedAsset.ID);
				this.Update(StringUtils.Format("{0}.fixed_asset", wInstance.Result), "ID", wParamMap);
			}

		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
	}

	public void DMS_ActiveFixedAssets(BMSEmployee wLoginUser, List<Long> wIDList, int wActive,
			OutResult<Int32> wErrorCode) {
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			if (wIDList == null)
				wIDList = new List<Long>();
			wIDList = wIDList.stream().filter(p -> p > 0).collect(Collectors.toList());

			if (wIDList.Count <= 0)
				return;
			if (wActive != 1)
				wActive = 2;
			String wSql = StringUtils.Format("UPDATE {0}.fixed_asset SET Active ={1} WHERE ID IN({2}) ;",
					wInstance.Result, String.valueOf(wActive), StringUtils.Join(",", wIDList));

			this.ExecuteSqlTransaction(wSql);
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
	}
}
