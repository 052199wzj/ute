package com.mes.server.serviceimpl.dao.fmc;

import java.util.List;
import java.util.DateTime;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import com.mes.server.service.mesenum.BFCQRTypes;
import com.mes.server.service.mesenum.DBEnumType;
import com.mes.server.service.mesenum.FPCProductTransport;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bfc.BFCPlaceQRStruct;
import com.mes.server.service.po.fmc.FMCWorkspace;
import com.mes.server.service.po.fmc.FMCWorkspaceRecord;
import com.mes.server.service.po.fpc.FPCProduct;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.dao.fpc.FPCProductDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;

public class FMCWorkspaceDAO extends BaseDAO {

	private static Logger logger = LoggerFactory.getLogger(typeof(FMCWorkspaceDAO));

	private static FMCWorkspaceDAO Instance;

	private FMCWorkspaceDAO() {
		super();
	}

	public static FMCWorkspaceDAO getInstance() {
		if (Instance == null)
			Instance = new FMCWorkspaceDAO();
		return Instance;
	}

	public FMCWorkspaceDAO(NamedParameterJdbcTemplate mDBPool) {
		super(mDBPool);
		// TODO Auto-generated constructor stub
	}

	public FMCWorkspaceDAO(NamedParameterJdbcTemplate mDBPool, DBEnumType wSQLTypes) {
		super(mDBPool, wSQLTypes);
		// TODO Auto-generated constructor stub
	}

	private static int RoleFunctionID = 900701;

	private static int BindRoleFunctionID = 900702;

	public List<FMCWorkspace> FMC_GetFMCWorkspaceList(int wCompanyID, int wLoginID, List<Int32> wIDList, String wCode,
			int wProductID, int wPartID, String wPartNo, int wPlaceType, int wActive, OutResult<Int32> wErrorCode) {
		List<FMCWorkspace> wResult = new List<FMCWorkspace>();
		try {
			if (wIDList == null)
				wIDList = new List<Int32>();

			wIDList.RemoveAll(p -> p <= 0);

			if (wCode == null)
				wCode = "";
			if (wPartNo == null)
				wPartNo = "";
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			String wSQLText = StringUtils.Format(
					"Select t.* from {0}.fmc_workspace t  where 1=1 " + " and ( @wID ='' or t.ID IN( {1} ) ) "
							+ " and ( @wPartID<= 0 or t.PartID =@wPartID)  "
							+ " and ( @wProductID<= 0 or t.ProductID =@wProductID)  "
							+ " and ( @wCode is null or @wCode ='' or t.Code =  @wCode )"
							+ " and ( @wPartNo is null or @wPartNo ='' or t.PartNo =  @wPartNo )"
							+ " and ( @wPlaceType <= 0 or t.PlaceType =@wPlaceType)  "
							+ " and ( @wActive< 0 or t.Active =@wActive)   ",
					wInstance.Result, wIDList.Count > 0 ? StringUtils.Join(",", wIDList) : "0");

			wSQLText = this.DMLChange(wSQLText);
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("wID", StringUtils.Join(",", wIDList));
			wParms.Add("wPartID", wPartID);
			wParms.Add("wProductID", wProductID);
			wParms.Add("wPlaceType", wPlaceType);
			wParms.Add("wActive", wActive);
			wParms.Add("wCode", wCode);
			wParms.Add("wPartNo", wPartNo);

			List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
			for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
				FMCWorkspace wDepartment = new FMCWorkspace();
				wDepartment.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
				wDepartment.Name = StringUtils.parseString(wSqlDataReader["Name"]);
				wDepartment.ProductID = StringUtils.parseInt(wSqlDataReader["ProductID"]);
				wDepartment.TransType = StringUtils.parseInt(wSqlDataReader["TransType"]);
				wDepartment.PlaceType = StringUtils.parseInt(wSqlDataReader["PlaceType"]);
				wDepartment.OrderID = StringUtils.parseInt(wSqlDataReader["OrderID"]);
				wDepartment.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
				wDepartment.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
				wDepartment.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
				wDepartment.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
				wDepartment.Length = StringUtils.parseDouble(wSqlDataReader["Length"]);
				wDepartment.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
				wDepartment.PartID = StringUtils.parseInt(wSqlDataReader["PartID"]);
				wDepartment.PartNo = StringUtils.parseString(wSqlDataReader["PartNo"]);
				wDepartment.Length = StringUtils.parseDouble(wSqlDataReader["Length"]);
				wDepartment.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
				wDepartment.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
				wDepartment.ParentID = StringUtils.parseInt(wSqlDataReader["ParentID"]);
				wDepartment.Code = StringUtils.parseString(wSqlDataReader["Code"]);
				wDepartment.ActualPartNoList = StringUtils
						.splitList(StringUtils.parseString(wSqlDataReader["ActualPartNoList"]), "||");
				wDepartment.Editor = BFCConstants.GetBMSEmployeeName(wDepartment.EditorID);
				wDepartment.Creator = BFCConstants.GetBMSEmployeeName(wDepartment.CreatorID);
				wResult.Add(wDepartment);
			}

		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	private FMCWorkspace FMC_GetFMCWorkspaceByPartNo(int wCompanyID, int wLoginID, String wPartNo,
			OutResult<Int32> wErrorCode) {
		FMCWorkspace wResult = new FMCWorkspace();
		try {
			if (StringUtils.isEmpty(wPartNo))
				return wResult;

			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			String wSQLText = StringUtils.Format(
					"Select t.* from {0}.fmc_workspace t  where t.Active =1 "
							+ " and ( t.PartNo =  @wPartNo or t.ActualPartNoList like ''%{1}%'' )",
					wInstance.Result, wPartNo);

			wSQLText = this.DMLChange(wSQLText);
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();

			wParms.Add("wPartNo", wPartNo);

			List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
			for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {

				wResult.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
				wResult.Name = StringUtils.parseString(wSqlDataReader["Name"]);
				wResult.ProductID = StringUtils.parseInt(wSqlDataReader["ProductID"]);
				wResult.TransType = StringUtils.parseInt(wSqlDataReader["TransType"]);
				wResult.PlaceType = StringUtils.parseInt(wSqlDataReader["PlaceType"]);
				wResult.OrderID = StringUtils.parseInt(wSqlDataReader["OrderID"]);
				wResult.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
				wResult.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
				wResult.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
				wResult.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
				wResult.Length = StringUtils.parseDouble(wSqlDataReader["Length"]);
				wResult.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
				wResult.PartID = StringUtils.parseInt(wSqlDataReader["PartID"]);
				wResult.PartNo = StringUtils.parseString(wSqlDataReader["PartNo"]);
				wResult.Length = StringUtils.parseDouble(wSqlDataReader["Length"]);
				wResult.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
				wResult.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
				wResult.ParentID = StringUtils.parseInt(wSqlDataReader["ParentID"]);
				wResult.Code = StringUtils.parseString(wSqlDataReader["Code"]);
				wResult.ActualPartNoList = StringUtils
						.splitList(StringUtils.parseString(wSqlDataReader["ActualPartNoList"]), "||");
				wResult.Editor = BFCConstants.GetBMSEmployeeName(wResult.EditorID);
				wResult.Creator = BFCConstants.GetBMSEmployeeName(wResult.CreatorID);
			}

		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	public List<FMCWorkspace> FMC_GetFMCWorkspaceList(int wCompanyID, int wLoginID, int wProductID, int wPartID,
			String wPartNo, int wPlaceType, int wActive, OutResult<Int32> wErrorCode) {
		List<FMCWorkspace> wResult = new List<FMCWorkspace>();
		try {
			wErrorCode.set(0);

			wResult = FMC_GetFMCWorkspaceList(wCompanyID, wLoginID, null, "", wProductID, wPartID, wPartNo, wPlaceType,
					wActive, wErrorCode);
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	public List<FMCWorkspace> FMC_GetFMCWorkspaceList(int wCompanyID, int wLoginID, List<Int32> wIDList,
			OutResult<Int32> wErrorCode) {
		List<FMCWorkspace> wResult = new List<FMCWorkspace>();
		try {
			wErrorCode.set(0);

			wResult = FMC_GetFMCWorkspaceList(wCompanyID, wLoginID, wIDList, "", 0, 0, "", 0, -1, wErrorCode);
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	public FMCWorkspace FMC_GetFMCWorkspace(int wCompanyID, int wLoginID, int wID, String wCode,
			OutResult<Int32> wErrorCode) {
		FMCWorkspace wResult = new FMCWorkspace();
		try {
			wErrorCode.set(0);
			if (wID <= 0 && StringUtils.isEmpty(wCode))
				return wResult;
			List<FMCWorkspace> wFMCWorkspaceList = FMC_GetFMCWorkspaceList(wCompanyID, wLoginID,
					StringUtils.parseList(new Int32[] { wID }), wCode, 0, 0, "", 0, -1, wErrorCode);
			if (wFMCWorkspaceList.Count > 0) {
				wResult = wFMCWorkspaceList[0];
			}
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	/**
	 * 只做数据更新
	 * 
	 * @param wFMCWorkspace
	 * @param wErrorCode
	 */
	private void FMC_SaveFMCWorkspace(int wCompanyID, int wLoginID, FMCWorkspace wFMCWorkspace,
			OutResult<Int32> wErrorCode) {
		try {
			if (wFMCWorkspace == null || StringUtils.isEmpty(wFMCWorkspace.Code)) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}
			if (BFCConstants.getPlaceQRTypeByCode(wFMCWorkspace.Code) != (int)BFCQRTypes.WorkPlace()) {
				List<BFCPlaceQRStruct> wBFCPlaceQRStructList = BFCConstants.getPlaceQRTypeList();
				Optional<BFCPlaceQRStruct> wBFCPlaceQRStructOptional = wBFCPlaceQRStructList.stream()
						.filter(p -> p.getQRType() == (int)BFCQRTypes.WorkPlace()).findFirst();
				BFCPlaceQRStruct wBFCPlaceQRStruct = new BFCPlaceQRStruct();
				if (wBFCPlaceQRStructOptional.isPresent()) {
					wBFCPlaceQRStruct = wBFCPlaceQRStructOptional.get();
					if (!wFMCWorkspace.Code.startsWith(wBFCPlaceQRStruct.getQRStart()))
						wFMCWorkspace.Code = wBFCPlaceQRStruct.getQRStart() + wFMCWorkspace.Code;
					if (!wFMCWorkspace.Code.endsWith(wBFCPlaceQRStruct.getQREnd()))
						wFMCWorkspace.Code = wFMCWorkspace.Code + wBFCPlaceQRStruct.getQRStart();

					if (wFMCWorkspace.Code.Length > wBFCPlaceQRStruct.getMaxLength()) {
						wErrorCode.set(MESException.Parameter.Value);
						return;
					}
					if (wFMCWorkspace.Code.Length < wBFCPlaceQRStruct.getMinLength()) {
						wErrorCode.set(MESException.Parameter.Value);
						return;
					}
				}

			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			String wSQL = "";

			int wPartID = this.FMC_GetPartIDByPartNo(wInstance.Result, wFMCWorkspace.PartNo);
			if (wPartID > 0) {
				wFMCWorkspace.PartID = wPartID;
			}
			if (wFMCWorkspace.PartNo == null)
				wFMCWorkspace.PartNo = "";
			if (StringUtils.isEmpty(wFMCWorkspace.PartNo))
				wFMCWorkspace.PartID = 0;

			if (StringUtils.isEmpty(wFMCWorkspace.PartNo) || wFMCWorkspace.PartNo.indexOf("#") <= 0) {
				wFMCWorkspace.ProductID = 0;
			} else {
				wFMCWorkspace.ProductID = FPCProductDAO.getInstance().FPC_QueryProductByID(SysAdmin, 0,
						wFMCWorkspace.PartNo.split("#")[0], wErrorCode).ID;
			}

			if (wFMCWorkspace.ActualPartNoList != null && wFMCWorkspace.ActualPartNoList.Count > 0) {

				wFMCWorkspace.ActualPartNoList = wFMCWorkspace.ActualPartNoList.stream().distinct()
						.collect(Collectors.toList());

			}

			if (wFMCWorkspace.PartID > 0 || StringUtils.isEmpty(wFMCWorkspace.PartNo)) {
				wSQL = StringUtils.Format(
						"UPDATE {0}.fmc_workspace SET  Name = @wName,Code = @wCode, TransType=@wTransType, ProductID = @wProductID,OrderID=@wOrderID, "
								+ "PlaceType = @wPlaceType,   EditorID = @wEditorID, EditTime = now(), PartID = @wPartID, "
								+ "PartNo = @wPartNo,  ParentID = @wParentID ,Length=@wLength,Status=@wStatus,ActualPartNoList=@wActualPartNoList  WHERE ID = @wID; ",
						wInstance.Result);

			} else {
				wSQL = StringUtils.Format(
						"UPDATE {0}.fmc_workspace t1, (select max(PartID)+1 as ID from {0}.fmc_workspace_record) as t2"
								+ " SET  t1.Name = @wName,t1.Code = @wCode,  t1.ProductID = @wProductID,OrderID=@wOrderID, "
								+ "t1.PlaceType = @wPlaceType,   t1.EditorID = @wEditorID, t1.EditTime = now(), t1.PartID = t2.ID, "
								+ "t1.PartNo = @wPartNo,t1.TransType = @wTransType,  t1.ParentID = @wParentID  ,t1.Length=@wLength,t1.Status=@wStatus,"
								+ "ActualPartNoList=@wActualPartNoList  WHERE t1.ID = @wID; ",
						wInstance.Result);
			}

			wSQL = this.DMLChange(wSQL);

			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("wID", wFMCWorkspace.ID);
			wParamMap.Add("wPartID", wFMCWorkspace.PartID);
			wParamMap.Add("wTransType", wFMCWorkspace.TransType);
			wParamMap.Add("wName", wFMCWorkspace.Name);
			wParamMap.Add("wCode", wFMCWorkspace.Code);
			wParamMap.Add("wProductID", wFMCWorkspace.ProductID);
			wParamMap.Add("wPlaceType", wFMCWorkspace.PlaceType);
			wParamMap.Add("wCreatorID", wFMCWorkspace.CreatorID);
			wParamMap.Add("wEditorID", wFMCWorkspace.EditorID);

			wParamMap.Add("wOrderID", wFMCWorkspace.OrderID);
			wParamMap.Add("wLength", wFMCWorkspace.Length);
			wParamMap.Add("wStatus", wFMCWorkspace.Status);
			wParamMap.Add("wPartNo", wFMCWorkspace.PartNo);
			wParamMap.Add("wParentID", wFMCWorkspace.ParentID);
			wParamMap.Add("wActualPartNoList", StringUtils.Join("||", wFMCWorkspace.ActualPartNoList));

			mDBPool.update(wSQL, wParamMap);

			FMCWorkspace wFMCWorkspaceTemp = this.FMC_GetFMCWorkspace(wCompanyID, wLoginID, wFMCWorkspace.ID, "",
					wErrorCode);
			wFMCWorkspace.PartID = wFMCWorkspaceTemp.PartID;

			List<FMCWorkspaceRecord> wFMCWorkspaceRecordList = this.FMC_GetFMCWorkspaceRecordList(wCompanyID, wLoginID,
					0, 0, "", wFMCWorkspace.ID, 0, null, null, 1, wErrorCode);

			if (wFMCWorkspaceRecordList == null || wFMCWorkspaceRecordList.Count <= 0
					|| wFMCWorkspaceRecordList[0].PartNo == null
					|| !wFMCWorkspaceRecordList[0].PartNo.equals(wFMCWorkspace.PartNo)) {

				if (StringUtils.isNotEmpty(wFMCWorkspace.PartNo)) {
					FMCWorkspaceRecord wFMCWorkspaceRecord = new FMCWorkspaceRecord(wFMCWorkspace);
					wFMCWorkspaceRecord.ID = FMC_UpdateFMCWorkspaceRecord(wCompanyID, wLoginID, wFMCWorkspaceRecord,
							wErrorCode);
				}
			}
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
	}

	public void FMC_EditFMCWorkspace(int wCompanyID, int wLoginID, FMCWorkspace wFMCWorkspace,
			OutResult<Int32> wErrorCode) {
		try {
			if (wFMCWorkspace == null || StringUtils.isEmpty(wFMCWorkspace.Code)) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}
			if (BFCConstants.getPlaceQRTypeByCode(wFMCWorkspace.Code) != (int)BFCQRTypes.WorkPlace()) {
				List<BFCPlaceQRStruct> wBFCPlaceQRStructList = BFCConstants.getPlaceQRTypeList();
				Optional<BFCPlaceQRStruct> wBFCPlaceQRStructOptional = wBFCPlaceQRStructList.stream()
						.filter(p -> p.getQRType() == (int)BFCQRTypes.WorkPlace()).findFirst();
				BFCPlaceQRStruct wBFCPlaceQRStruct = new BFCPlaceQRStruct();
				if (wBFCPlaceQRStructOptional.isPresent()) {
					wBFCPlaceQRStruct = wBFCPlaceQRStructOptional.get();
					if (!wFMCWorkspace.Code.startsWith(wBFCPlaceQRStruct.getQRStart()))
						wFMCWorkspace.Code = wBFCPlaceQRStruct.getQRStart() + wFMCWorkspace.Code;
					if (!wFMCWorkspace.Code.endsWith(wBFCPlaceQRStruct.getQREnd()))
						wFMCWorkspace.Code = wFMCWorkspace.Code + wBFCPlaceQRStruct.getQRStart();

					if (wFMCWorkspace.Code.Length > wBFCPlaceQRStruct.getMaxLength()) {
						wErrorCode.set(MESException.Parameter.Value);
						return;
					}
					if (wFMCWorkspace.Code.Length < wBFCPlaceQRStruct.getMinLength()) {
						wErrorCode.set(MESException.Parameter.Value);
						return;
					}
				}

			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID,
					RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			String wSQL = StringUtils.Format(
					"UPDATE {0}.fmc_workspace SET  Name = @wName,Code = @wCode, OrderID=@wOrderID,TransType=@wTransType, "
							+ "PlaceType = @wPlaceType,   EditorID = @wEditorID, EditTime = now(),  "
							+ " ParentID = @wParentID ,Length=@wLength,Status=@wStatus  WHERE ID = @wID; ",
					wInstance.Result);

			wSQL = this.DMLChange(wSQL);

			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("wID", wFMCWorkspace.ID);
			wParamMap.Add("wName", wFMCWorkspace.Name);
			wParamMap.Add("wCode", wFMCWorkspace.Code);
			wParamMap.Add("wTransType", wFMCWorkspace.TransType);
			wParamMap.Add("wPlaceType", wFMCWorkspace.PlaceType);
			wParamMap.Add("wEditorID", wFMCWorkspace.EditorID);
			wParamMap.Add("wOrderID", wFMCWorkspace.OrderID);
			wParamMap.Add("wLength", wFMCWorkspace.Length);
			wParamMap.Add("wStatus", wFMCWorkspace.Status);
			wParamMap.Add("wParentID", wFMCWorkspace.ParentID);

			mDBPool.update(wSQL, wParamMap);

		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
	}

	/**
	 * 只在数据插入
	 * 
	 * @param wFMCWorkspace
	 * @param wErrorCode
	 */
	public void FMC_AddFMCWorkspace(int wCompanyID, int wLoginID, FMCWorkspace wFMCWorkspace,
			OutResult<Int32> wErrorCode) {

		try {

			if (wFMCWorkspace == null || StringUtils.isEmpty(wFMCWorkspace.Code)) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}
			if (BFCConstants.getPlaceQRTypeByCode(wFMCWorkspace.Code) != (int)BFCQRTypes.WorkPlace()) {
				List<BFCPlaceQRStruct> wBFCPlaceQRStructList = BFCConstants.getPlaceQRTypeList();
				Optional<BFCPlaceQRStruct> wBFCPlaceQRStructOptional = wBFCPlaceQRStructList.stream()
						.filter(p -> p.getQRType() == (int)BFCQRTypes.WorkPlace()).findFirst();
				BFCPlaceQRStruct wBFCPlaceQRStruct = new BFCPlaceQRStruct();
				if (wBFCPlaceQRStructOptional.isPresent()) {
					wBFCPlaceQRStruct = wBFCPlaceQRStructOptional.get();
					if (!wFMCWorkspace.Code.startsWith(wBFCPlaceQRStruct.getQRStart()))
						wFMCWorkspace.Code = wBFCPlaceQRStruct.getQRStart() + wFMCWorkspace.Code;
					if (!wFMCWorkspace.Code.endsWith(wBFCPlaceQRStruct.getQREnd()))
						wFMCWorkspace.Code = wFMCWorkspace.Code + wBFCPlaceQRStruct.getQRStart();

					if (wFMCWorkspace.Code.Length > wBFCPlaceQRStruct.getMaxLength()) {
						wErrorCode.set(MESException.Parameter.Value);
						return;
					}
					if (wFMCWorkspace.Code.Length < wBFCPlaceQRStruct.getMinLength()) {
						wErrorCode.set(MESException.Parameter.Value);
						return;
					}
				}

			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID,
					RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			String wSQL = StringUtils.Format("INSERT INTO {0}.fmc_workspace ( Name,Code, TransType,"
					+ "ProductID, PlaceType, CreatorID, CreateTime, EditorID, "
					+ "EditTime, PartID, PartNo, Active,OrderID, ParentID,Length,Status,ActualPartNoList) VALUES "
					+ "(@wName,@wCode,@wTransType, @wProductID, @wPlaceType, @wCreatorID, now(), @wEditorID, "
					+ "now(), 0, '''', @wActive,@wOrderID, @wParentID,@wLength,@wStatus,'''');", wInstance.Result);

			wSQL = this.DMLChange(wSQL);

			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("wPartID", wFMCWorkspace.PartID);
			wParamMap.Add("wName", wFMCWorkspace.Name);
			wParamMap.Add("wCode", wFMCWorkspace.Code);
			wParamMap.Add("wTransType", wFMCWorkspace.TransType);
			wParamMap.Add("wProductID", wFMCWorkspace.ProductID);
			wParamMap.Add("wPlaceType", wFMCWorkspace.PlaceType);
			wParamMap.Add("wCreatorID", wFMCWorkspace.CreatorID);
			wParamMap.Add("wEditorID", wFMCWorkspace.EditorID);

			wParamMap.Add("wOrderID", wFMCWorkspace.OrderID);
			wParamMap.Add("wLength", wFMCWorkspace.Length);
			wParamMap.Add("wStatus", wFMCWorkspace.Status);
			wParamMap.Add("wPartNo", wFMCWorkspace.PartNo);
			wParamMap.Add("wActive", wFMCWorkspace.Active);
			wParamMap.Add("wParentID", wFMCWorkspace.ParentID);
			wParamMap.Add("wActualPartNoList", StringUtils.Join("||", wFMCWorkspace.ActualPartNoList));

			KeyHolder keyHolder = new GeneratedKeyHolder();

			SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParamMap);
			mDBPool.update(wSQL, wSqlParameterSource, keyHolder);
			wFMCWorkspace.setID(keyHolder.getKey().intValue());
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
	}

	/**
	 * 绑定车号
	 * 
	 * @param wCompanyID
	 * @param wLoginID
	 * @param wFMCWorkspace
	 * @param wErrorCode
	 * @return
	 */
	public synchronized int FMC_BindFMCWorkspace(int wCompanyID, int wLoginID, FMCWorkspace wFMCWorkspace,
			OutResult<Int32> wErrorCode) {
		int wResult = 0;
		try {

			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID,
					BindRoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			if (wFMCWorkspace.ID <= 0) {
				this.FMC_AddFMCWorkspace(wCompanyID, wLoginID, wFMCWorkspace, wErrorCode);
				return wResult;

			} else {

				if (StringUtils.isNotEmpty(wFMCWorkspace.PartNo) && wFMCWorkspace.PartNo.indexOf("#") <= 0) {
					wFMCWorkspace.PartNo = "";
				}

				if (StringUtils.isNotEmpty(wFMCWorkspace.PartNo)) {

					String wPartNo = wFMCWorkspace.PartNo;

					String wPruductNo = wPartNo.split("#")[0];
					String wPartNoNumber = wPartNo.split("#")[1];
					FPCProduct wFPCProduct = FPCProductDAO.getInstance().FPC_QueryProductByID(SysAdmin, 0, wPruductNo,
							wErrorCode);

					FMCWorkspace wSelfWorkspace = this.FMC_GetFMCWorkspace(wCompanyID, wLoginID, wFMCWorkspace.ID,
							"", wErrorCode);
					FMCWorkspace wExitWorkspace = this.FMC_GetFMCWorkspaceByPartNo(wCompanyID, wLoginID, wPartNo,
							wErrorCode);
					if (wSelfWorkspace != null && wSelfWorkspace.ID > 0) {
						// 判断车号与ActualPartNoList应该变成什么
						if (wSelfWorkspace.ActualPartNoList != null)
							wSelfWorkspace.ActualPartNoList
									.RemoveAll(p -> StringUtils.isEmpty(p) || p.indexOf("#") <= 0);

						// 判断是否能合并
						if (wSelfWorkspace.ActualPartNoList != null && wSelfWorkspace.ActualPartNoList.Count > 0) {

							if (wFPCProduct.TransportType == (int)FPCProductTransport.Whole()
									|| wSelfWorkspace.ActualPartNoList.Count >= 2) {
								wErrorCode.set(MESException.Logic.Value);
								return wResult;
							}
							wFMCWorkspace.ActualPartNoList.Add(wSelfWorkspace.ActualPartNoList[0]);
							String wPruductNo_S = wSelfWorkspace.ActualPartNoList[0].split("#")[0];
							String wPartNoNumber_S = wSelfWorkspace.ActualPartNoList[0].split("#")[1];
							FPCProduct wFPCProduct_S = FPCProductDAO.getInstance().FPC_QueryProductByID(SysAdmin, 0,
									wPruductNo_S, wErrorCode);
							if (wFPCProduct_S.TransportType == wFPCProduct.TransportType) {
								wErrorCode.set(MESException.Logic.Value);
								return wResult;
							}
							// 一样不能放
							if (wFPCProduct_S.TransportType == (int)FPCProductTransport.Whole()) {
								wErrorCode.set(MESException.Logic.Value);
								return wResult;
							}

							if (wFPCProduct.TransportType == (int)FPCProductTransport.Body()) {
								if (wFPCProduct_S.TransportType == (int)FPCProductTransport.Bottom()) {
									if (!wFPCProduct_S.PrevProductNo.equals(wFPCProduct.PrevProductNo)
											|| !wPartNoNumber.equals(wPartNoNumber_S)) {
										wErrorCode.set(MESException.Logic.Value);
										return wResult;
									}
								}

								wFMCWorkspace.ActualPartNoList.Add(wPartNo);
								wFMCWorkspace.PartNo = StringUtils.Format("{0}#{1}", wFPCProduct.PrevProductNo,
										wPartNoNumber);
								wFMCWorkspace.PartID = 0;
							} else if (wFPCProduct_S.TransportType == (int)FPCProductTransport.Body()) {
								if (wFPCProduct.TransportType == (int)FPCProductTransport.Bottom()) {
									if (!wFPCProduct_S.PrevProductNo.equals(wFPCProduct.PrevProductNo)
											|| !wPartNoNumber.equals(wPartNoNumber_S)) {
										wErrorCode.set(MESException.Logic.Value);
										return wResult;
									}
								}

								wFMCWorkspace.ActualPartNoList.Add(wPartNo);
								wFMCWorkspace.PartNo = StringUtils.Format("{0}#{1}", wFPCProduct_S.PrevProductNo,
										wPartNoNumber);
							} else {
								// 没有车体不能合并
								wErrorCode.set(MESException.Logic.Value);
								return wResult;
							}
						} else {

							if (wFPCProduct.TransportType == (int)FPCProductTransport.Whole()) {
								wFMCWorkspace.ActualPartNoList = new List<String>();

								if (wFPCProduct.Active == 1) {
									FPCProductDAO.getInstance().FPC_SetPrevProduct(wFPCProduct, wErrorCode);
								}
								wFMCWorkspace.ActualPartNoList.Add(StringUtils.Format("{0}{1}#{2}",
										wFPCProduct.ProductNo, FPCProductTransport.Body.getCode(), wPartNoNumber));
								if (wExitWorkspace != null && wExitWorkspace.ID > 0
										&& wExitWorkspace.ActualPartNoList != null
										&& wExitWorkspace.ActualPartNoList.Count > 0) {
									if (wExitWorkspace.ActualPartNoList != null
											&& wExitWorkspace.ActualPartNoList.Count > 0) {
										for (String wPartNoElement : wExitWorkspace.ActualPartNoList) {
											if (!wFMCWorkspace.ActualPartNoList.contains(wPartNoElement))
												wFMCWorkspace.ActualPartNoList.Add(wPartNoElement);
										}
									}
								}
								if (wFMCWorkspace.ActualPartNoList.Count <= 1) {
									wFMCWorkspace.ActualPartNoList
											.Add(StringUtils.Format("{0}{1}#{2}", wFPCProduct.ProductNo,
													FPCProductTransport.Bottom.getCode(), wPartNoNumber));
								}

							} else {
								wFMCWorkspace.ActualPartNoList = new List<String>();
								wFMCWorkspace.ActualPartNoList.Add(wPartNo);
							}
						}

					} else {
						wErrorCode.set(MESException.Parameter.Value);
						return wResult;
					}
					this.FMC_SaveFMCWorkspace(wCompanyID, wLoginID, wFMCWorkspace, wErrorCode);

					if (wExitWorkspace != null && wExitWorkspace.ID > 0) {
						// 判断是否是拆分 若是拆分则需要修改原台位车号与ActualPartNoList
						// 需要更新车号
						if (wExitWorkspace.PartNo.equals(wPartNo)) {
							wExitWorkspace.PartNo = "";
							wExitWorkspace.PartID = 0;
							wExitWorkspace.ActualPartNoList = new List<String>();
						} else if (wExitWorkspace.ActualPartNoList != null
								&& wExitWorkspace.ActualPartNoList.contains(wPartNo)) {
							// 拆分
							wExitWorkspace.ActualPartNoList.remove(wPartNo);
							if (wExitWorkspace.ActualPartNoList.Count > 0) {
								wExitWorkspace.PartNo = wExitWorkspace.ActualPartNoList[0];
							} else {
								wExitWorkspace.PartNo = "";
							}

						} else {
							wExitWorkspace.PartNo = "";
							wExitWorkspace.ActualPartNoList = new List<String>();
						}
						this.FMC_SaveFMCWorkspace(wCompanyID, wLoginID, wExitWorkspace, wErrorCode);

					}

				} else {
					this.FMC_SaveFMCWorkspace(wCompanyID, wLoginID, wFMCWorkspace, wErrorCode);
				}

			}

		} catch (Exception e) {

			logger.error("FMCWorkspaceDAO FMC_BindFMCWorkspace Error:", e);
			wErrorCode.set(MESException.Exception.Value);
		}
		return wResult;
	}

	public int FMC_ActiveFMCWorkspace(int wCompanyID, int wLoginID, int wActive, FMCWorkspace wFMCWorkspace,
			OutResult<Int32> wErrorCode) {
		int wResult = 0;
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID,
					RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;
			String wSQL = StringUtils.Format(
					"UPDATE {0}.fmc_workspace  Set Active=@wActive,  EditorID = @wEditorID, EditTime = now()  WHERE ID = @wID; ",
					wInstance.Result);

			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("wID", wFMCWorkspace.ID);
			wParamMap.Add("wActive", wActive);
			wParamMap.Add("wEditorID", wFMCWorkspace.EditorID);

			mDBPool.update(wSQL, wParamMap);

		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	public List<FMCWorkspaceRecord> FMC_GetFMCWorkspaceRecordList(int wCompanyID, int wLoginID, int wProductID,
			int wPartID, String wPartNo, int wPlaceID, int wPlaceType, DateTime wStartTime, DateTime wEndTime,
			int wLimit, OutResult<Int32> wErrorCode) {
		List<FMCWorkspaceRecord> wResult = new List<FMCWorkspaceRecord>();
		try {

			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			String wSQLText = StringUtils.Format(
					"SELECT  t1.* ,t2.Name as PlaceName   FROM  {0}.fmc_workspace_record t1,{0}.fmc_workspace t2 "
							+ " where t1.PlaceID =t2.ID  and ( @wPlaceID<= 0 or t1.PlaceID =@wPlaceID)  "
							+ " and ( @wPartID<= 0 or t1.PartID =@wPartID)  "
							+ " and ( @wProductID<= 0 or t1.ProductID =@wProductID) "
							+ " and ( @wPlaceID<= 0 or t1.PlaceID =@wPlaceID) "
							+ " and ( @wPartNo is null or @wPartNo ='' or t1.PartNo =  @wPartNo )"
							+ "and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d') or @wStartTime <= t1.CreateTime) "
							+ "and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d') or @wEndTime >= t1.CreateTime) order by t1.ID desc {1} ",
					wInstance.Result, wLimit <= 0 ? "" : "limit " + wLimit + " ;");

			wSQLText = this.DMLChange(wSQLText);
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("wPartID", wPartID);
			wParms.Add("wProductID", wProductID);
			wParms.Add("wPlaceType", wPlaceType);
			wParms.Add("wPlaceID", wPlaceID);
			wParms.Add("wPartNo", wPartNo);
			wParms.Add("wStartTime", wStartTime);
			wParms.Add("wEndTime", wEndTime);

			List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
			for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
				FMCWorkspaceRecord wDepartment = new FMCWorkspaceRecord();
				wDepartment.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
				wDepartment.PlaceID = StringUtils.parseInt(wSqlDataReader["PlaceID"]);
				wDepartment.PlaceName = StringUtils.parseString(wSqlDataReader["PlaceName"]);
				wDepartment.ProductID = StringUtils.parseInt(wSqlDataReader["ProductID"]);
				wDepartment.EditorID = StringUtils.parseInt(wSqlDataReader["ProductID"]);
				wDepartment.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
				wDepartment.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
				wDepartment.PartID = StringUtils.parseInt(wSqlDataReader["PartID"]);
				wDepartment.PartNo = StringUtils.parseString(wSqlDataReader["PartNo"]);
				wDepartment.Editor = BFCConstants.GetBMSEmployeeName(wDepartment.EditorID);
				wResult.Add(wDepartment);
			}

		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	public int FMC_UpdateFMCWorkspaceRecord(int wCompanyID, int wLoginID, FMCWorkspaceRecord wFMCWorkspaceRecord,
			OutResult<Int32> wErrorCode) {
		int wResult = 0;
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;
			String wSQL = "";
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
			if (wFMCWorkspaceRecord.ID <= 0) {
				wSQL = StringUtils.Format(
						"INSERT INTO {0}.fmc_workspace_record ( PlaceID, ProductID, EditorID, CreateTime, EditTime,PartID,PartNo) VALUES ( "
								+ "@wPlaceID, @wProductID, @wEditorID, now(),str_to_date(''2000-01-01'', '%Y-%m-%d'),@wPartID,@wPartNo); ",
						wInstance.Result);

				String wSqlText = StringUtils.Format("UPDATE {0}.fmc_workspace_record SET  EditTime = now()   "
						+ "WHERE ID>0 AND EditTime <= str_to_date('2010-01-01', '%Y-%m-%d') AND PlaceID = @wPlaceID; ",
						wInstance.Result);

				wParamMap.Add("wPlaceID", wFMCWorkspaceRecord.PlaceID);
				mDBPool.update(wSqlText, wParamMap);

			} else {

				wSQL = StringUtils
						.Format("UPDATE {0}.fmc_workspace_record SET   PlaceID = @wPlaceID, ProductID = @wProductID, "
								+ " EditorID = @wEditorID, EditTime = now() , PartID = @wPartID  ,"
								+ " PartNo =@wPartNo   WHERE ID = @wID; ", wInstance.Result);
			}

			wSQL = this.DMLChange(wSQL);
			wParamMap.clear();

			wParamMap.Add("wID", wFMCWorkspaceRecord.ID);
			wParamMap.Add("wPlaceID", wFMCWorkspaceRecord.PlaceID);
			wParamMap.Add("wProductID", wFMCWorkspaceRecord.ProductID);
			wParamMap.Add("wEditorID", wFMCWorkspaceRecord.EditorID);
			wParamMap.Add("wPartID", wFMCWorkspaceRecord.PartID);
			wParamMap.Add("wPartNo", wFMCWorkspaceRecord.PartNo);

			KeyHolder keyHolder = new GeneratedKeyHolder();

			SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParamMap);
			mDBPool.update(wSQL, wSqlParameterSource, keyHolder);
			if (wFMCWorkspaceRecord.ID <= 0) {
				wResult = keyHolder.getKey().intValue();
				wFMCWorkspaceRecord.setID(wResult);
			} else {
				wResult = wFMCWorkspaceRecord.ID;
			}
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	private int FMC_GetPartIDByPartNo(String wDBName, String wPartNo) {

		int wResult = 0;
		String wSQLText = StringUtils.Format(
				"Select t.PartID from {0}.fmc_workspace_record t  where t.PartNo = @wPartNo limit 1 ;", wDBName);

		wSQLText = this.DMLChange(wSQLText);
		Dictionary<String, Object> wParms = new Dictionary<String, Object>();
		wParms.Add("wPartNo", wPartNo);

		List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
		for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
			wResult = StringUtils.parseInt(wSqlDataReader["PartID"]);
		}
		return wResult;

	}
}
