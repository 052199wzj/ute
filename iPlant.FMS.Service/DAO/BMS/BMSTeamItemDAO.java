package com.mes.server.serviceimpl.dao.bms;

import java.util.List;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import com.mes.server.service.mesenum.BMMFunctionModule;
import com.mes.server.service.mesenum.DBEnumType;
import com.mes.server.service.mesenum.FMCShiftLevel;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.bms.BMSTeamItem;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.serviceimpl.utils.dms.DMSConstants;
import com.mes.server.serviceimpl.utils.fmc.FMCConstants;

public class BMSTeamItemDAO extends BaseDAO {

	private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(typeof(BMSTeamItemDAO));

	private static BMSTeamItemDAO Instance = null;

	private BMSTeamItemDAO() {
		super();
	}

	private static int RoleFunctionID = 900602;

	public static BMSTeamItemDAO getInstance() {
		if (Instance == null)
			Instance = new BMSTeamItemDAO();
		return Instance;
	}

	public BMSTeamItemDAO(NamedParameterJdbcTemplate mDBPool) {
		super(mDBPool);
		// TODO Auto-generated constructor stub
	}

	public BMSTeamItemDAO(NamedParameterJdbcTemplate mDBPool, DBEnumType wSQLTypes) {
		super(mDBPool, wSQLTypes);
		// TODO Auto-generated constructor stub
	}

	private BMSTeamItem BMS_CheckTeamItem(BMSEmployee wLoginUser, BMSTeamItem wBMSTeamItem,
			OutResult<Int32> wErrorCode) {
		BMSTeamItem wResult = new BMSTeamItem();
		try {

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			String wSQLText = StringUtils.Format("SELECT t.ID FROM {0}.bms_teamitem  t "
					+ " WHERE  t.ID!=@ID  and  t.TeamID =@TeamID  and t.Active =1 and t.Name =@Name  "
					+ " and ( @LineID<= 0 or t.LineID =@LineID) and ( @PartID<= 0 or t.PartID =@PartID)  "
					+ " and ( @PartPointID<= 0 or t.PartPointID =@PartPointID)  "
					+ " and ( @StationID<= 0 or t.StationID =@StationID) ;", wInstance.Result);

			wSQLText = this.DMLChange(wSQLText);
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("ID", wBMSTeamItem.ID);
			wParms.Add("TeamID", wBMSTeamItem.TeamID);
			wParms.Add("Name", wBMSTeamItem.Name);
			wParms.Add("LineID", wBMSTeamItem.LineID);
			wParms.Add("PartID", wBMSTeamItem.PartID);
			wParms.Add("PartPointID", wBMSTeamItem.PartPointID);
			wParms.Add("StationID", wBMSTeamItem.StationID);

			List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
			for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {

				wResult.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
			}

		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	public List<BMSTeamItem> BMS_GetTeamItemList(BMSEmployee wLoginUser, int wTeamID, int wWorkShopID,
			int wDepartmentID, int wModuleID, int wLineID, int wPartID, int wPartPointID, int wStationID, int wActive,
			OutResult<Int32> wErrorCode) {
		List<BMSTeamItem> wResult = new List<BMSTeamItem>();
		try {

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			String wSQLText = StringUtils
					.Format("SELECT t.*,t1.WorkShopID,t1.DepartmentID, t1.ModuleID,t1.Name as TeamName ,"
							+ " t2.Name as DepartmentName, t3.Name as WorkShopName,  "
							+ " t4.Name as LineName, t5.Name as PartName, t6.Name as PartPointName FROM {0}.bms_teamitem  t "
							+ " left join {0}.bms_teammanage t1 on t.TeamID=t1.ID "
							+ " left join {0}.bms_department t2 on t1.DepartmentID=t2.ID "
							+ " left join {0}.fmc_workshop t3 on t1.WorkShopID=t3.ID "
							+ " left join {0}.fmc_line t4 on t.LineID=t4.ID "
							+ " left join {0}.fpc_part t5 on t.PartID=t5.ID "
							+ " left join {0}.fpc_partpoint t6 on t.PartPointID=t6.ID "
							+ " WHERE  1=1  and ( @TeamID<= 0 or t.TeamID =@TeamID)"
							+ " and ( @Active< 0 or t1.Active =@Active)"
							+ " and ( @WorkShopID<= 0 or t1.WorkShopID =@WorkShopID) "
							+ " and ( @LineID<= 0 or t.LineID =@LineID) and ( @PartID< 0 or t.PartID =@PartID)   "
							+ " and ( @PartPointID< 0 or t.PartPointID =@PartPointID) "
							+ " and ( @StationID< 0 or t.StationID =@StationID)  "
							+ " and ( @ModuleID<= 0 or t1.ModuleID =@ModuleID)  "
							+ " and ( @DepartmentID<= 0 or t1.DepartmentID =@DepartmentID)  "
							+ " and ( @Active< 0 or t.Active =@Active) ;", wInstance.Result);

			wSQLText = this.DMLChange(wSQLText);
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("WorkShopID", wWorkShopID);
			wParms.Add("TeamID", wTeamID);
			wParms.Add("LineID", wLineID);
			wParms.Add("PartID", wPartID);
			wParms.Add("PartPointID", wPartPointID);
			wParms.Add("StationID", wStationID);
			wParms.Add("DepartmentID", wDepartmentID);
			wParms.Add("ModuleID", wModuleID);
			wParms.Add("Active", wActive);

			List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);

			int wTempInt = 0;
			int wStationIDTemp = 0;
			List<Int32> wIntList = null;
			for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {

				wTempInt = StringUtils.parseInt(wSqlDataReader["ModuleID"]);

				wSqlDataReader.Add("ModuleName", BMMFunctionModule.getEnumType(wTempInt).getLable());
				wSqlDataReader.Add("ShiftName",
						FMCShiftLevel.getEnumType(StringUtils.parseInt(wSqlDataReader["ShiftIndex"])).getLable());

				wSqlDataReader.Add("Editor",
						BFCConstants.GetBMSEmployeeName(StringUtils.parseInt(wSqlDataReader["EditorID"])));
				wSqlDataReader.Add("Creator",
						BFCConstants.GetBMSEmployeeName(StringUtils.parseInt(wSqlDataReader["CreatorID"])));
				wIntList = StringUtils.parseIntList(wSqlDataReader["MateUserIDList"], ",");
				wSqlDataReader.Add("MateUserIDList", wIntList);
				wSqlDataReader.Add("MateUserName", BFCConstants.GetBMSEmployeeName(wIntList));

				wStationIDTemp = StringUtils.parseInt(wSqlDataReader["StationID"]);
				if (wStationIDTemp <= 0)
					continue;

				switch (BMMFunctionModule.getEnumType(wTempInt)) {
				case Equipment:
					wSqlDataReader.Add("StationName", DMSConstants.GetDMSDeviceLedgerName(wStationIDTemp));
					break;
				default:
					wSqlDataReader.Add("StationName", FMCConstants.GetFMCStationName(wStationIDTemp));
					wSqlDataReader.Add("CERT", FMCConstants.GetFMCStation(wStationIDTemp).CERT);
					break;
				}
			}
			wResult = CloneTool.CloneArray(wQueryResultList, typeof(BMSTeamItem));

		} catch (Exception e) {
			e.printStackTrace();
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	public void BMS_UpdateTeamItem(BMSEmployee wLoginUser, BMSTeamItem wBMSTeamItem, OutResult<Int32> wErrorCode) {

		try {

			if (wBMSTeamItem == null || wBMSTeamItem.TeamID <= 0 || StringUtils.isEmpty(wBMSTeamItem.Name)) {
				wErrorCode.Result = MESException.Parameter.Value;
				return;
			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			BMSTeamItem wCheckTeamItem = this.BMS_CheckTeamItem(wLoginUser, wBMSTeamItem, wErrorCode);
			if (wErrorCode.Result != 0)
				return;

			if (wCheckTeamItem != null && wCheckTeamItem.ID > 0) {
				wBMSTeamItem.ID = wCheckTeamItem.ID;
				wErrorCode.set(MESException.Duplication.Value);
				return;
			}

			String wSQL = "";

			if (wBMSTeamItem.ID <= 0) {

				wSQL = StringUtils.Format("INSERT INTO {0}.bms_teamitem (Name, TeamID,LineID, PartID,PartPointID,"
						+ "StationID, CreatorID, CreateTime, EditorID, EditTime, Active,MateUserIDList) "
						+ "VALUES ( @Name, @TeamID, @LineID, @PartID,@PartPointID,@StationID, @CreatorID, now(),"
						+ " @EditorID, now(), @Active,@MateUserIDList);",

						wInstance.Result);
			} else {
				wSQL = StringUtils.Format("UPDATE {0}.bms_teamitem  SET  Name=@Name, TeamID=@TeamID,LineID = @LineID,"
						+ " MateUserIDList=@MateUserIDList,PartID=@PartID, PartPointID=@PartPointID,StationID=@StationID,"
						+ "  EditorID = @EditorID, EditTime = now() WHERE ID = @ID;  ", wInstance.Result);
			}

			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("ID", wBMSTeamItem.ID);
			wParamMap.Add("Name", wBMSTeamItem.Name);
			wParamMap.Add("MateUserIDList", StringUtils.Join(",", wBMSTeamItem.MateUserIDList));
			wParamMap.Add("TeamID", wBMSTeamItem.TeamID);
			wParamMap.Add("LineID", wBMSTeamItem.LineID);
			wParamMap.Add("PartID", wBMSTeamItem.PartID);
			wParamMap.Add("PartPointID", wBMSTeamItem.PartPointID);
			wParamMap.Add("StationID", wBMSTeamItem.StationID);
			wParamMap.Add("CreatorID", wLoginUser.ID);
			wParamMap.Add("EditorID", wLoginUser.ID);
			wParamMap.Add("Active", wBMSTeamItem.Active);

			if (wBMSTeamItem.ID <= 0) {
				KeyHolder keyHolder = new GeneratedKeyHolder();

				SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParamMap);
				mDBPool.update(wSQL, wSqlParameterSource, keyHolder);

				wBMSTeamItem.setID(keyHolder.getKey().intValue());
			} else {
				mDBPool.update(wSQL, wParamMap);
			}
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}

	}

	public int BMS_ActiveTeamItem(BMSEmployee wLoginUser, int wActive, BMSTeamItem wBMSTeamItem,
			OutResult<Int32> wErrorCode) {
		int wResult = 0;
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;
			String wSQL = "";
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wSQL = StringUtils.Format(
					"UPDATE {0}.bms_teamitem SET EditorID = @EditorID, EditTime =now(), Active = @Active WHERE ID = @ID;  ",
					wInstance.Result);
			wSQL = this.DMLChange(wSQL);
			wParamMap.clear();
			wParamMap.Add("ID", wBMSTeamItem.ID);
			wParamMap.Add("Active", wActive);
			wParamMap.Add("EditorID", wLoginUser.ID);

			mDBPool.update(wSQL, wParamMap);

		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	public int BMS_DeleteTeamItem(BMSEmployee wLoginUser, BMSTeamItem wBMSTeamItem, OutResult<Int32> wErrorCode) {
		int wResult = 0;
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			String wSQL = StringUtils.Format("Delete from {0}.bms_teamitem  WHERE ID = @ID and Active=0;  ",
					wInstance.Result);

			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("ID", wBMSTeamItem.ID);
			mDBPool.update(wSQL, wParamMap);
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

}
