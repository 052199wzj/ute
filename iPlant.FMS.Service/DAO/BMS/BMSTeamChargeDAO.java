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
import com.mes.server.service.po.bms.BMSTeamCharge;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.serviceimpl.utils.dms.DMSConstants;
import com.mes.server.serviceimpl.utils.fmc.FMCConstants;

public class BMSTeamChargeDAO extends BaseDAO {

	private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(typeof(BMSTeamChargeDAO));

	private static BMSTeamChargeDAO Instance = null;

	private static int RoleFunctionID = 900603;

	private BMSTeamChargeDAO() {
		super();
	}

	public static BMSTeamChargeDAO getInstance() {
		if (Instance == null)
			Instance = new BMSTeamChargeDAO();
		return Instance;
	}

	public BMSTeamChargeDAO(NamedParameterJdbcTemplate mDBPool) {
		super(mDBPool);
		// TODO Auto-generated constructor stub
	}

	public BMSTeamChargeDAO(NamedParameterJdbcTemplate mDBPool, DBEnumType wSQLTypes) {
		super(mDBPool, wSQLTypes);
		// TODO Auto-generated constructor stub
	}

	private BMSTeamCharge BMS_CheckTeamCharge(BMSEmployee wLoginUser, BMSTeamCharge wBMSTeamCharge,
			OutResult<Int32> wErrorCode) {
		BMSTeamCharge wResult = new BMSTeamCharge();
		try {

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			String wSQLText = StringUtils.Format("SELECT t.ID FROM {0}.bms_teamcharge  t "
					+ " WHERE  t.ID!=@ID  and  t.TeamID =@TeamID " + " and t.ItemID =@ItemID AND t.GroupID=@GroupID ;",
					wInstance.Result);

			wSQLText = this.DMLChange(wSQLText);
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("ID", wBMSTeamCharge.ID);
			wParms.Add("TeamID", wBMSTeamCharge.TeamID);
			wParms.Add("ItemID", wBMSTeamCharge.ItemID);
			wParms.Add("GroupID", wBMSTeamCharge.GroupID);

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

	public List<BMSTeamCharge> BMS_GetTeamChargeList(BMSEmployee wLoginUser, int wTeamID, int wGroupID, int wWorkShopID,
			int wDepartmentID, int wModuleID, int wLineID, int wPartID, int wPartPointID, int wStationID,
			int wMateUserID, int wShiftIndex, int wActive, OutResult<Int32> wErrorCode) {
		List<BMSTeamCharge> wResult = new List<BMSTeamCharge>();
		try {

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			String wSQLText = StringUtils.Format("SELECT t.*,t8.Name,t8.Active,t8.LineID,t8.PartID,"
					+ " t8.PartPointID,t8.MateUserIDList as ItemUserIDList, t8.StationID, t1.WorkShopID,"
					+ " t1.DepartmentID, t1.ModuleID,t1.Name as TeamName , t2.Name as DepartmentName, "
					+ " t3.Name as WorkShopName,t7.Name as GroupName,t7.ShiftIndex, t4.Name as LineName,"
					+ " t5.Name as PartName, t6.Name as PartPointName FROM {0}.bms_teamcharge  t "
					+ " inner join {0}.bms_teammanage t1 on t.TeamID=t1.ID "
					+ " inner join {0}.bms_teamitem t8 on t.ItemID=t8.ID "
					+ " left join {0}.bms_department t2 on t1.DepartmentID=t2.ID "
					+ " left join {0}.fmc_workshop t3 on t1.WorkShopID=t3.ID "
					+ " left join {0}.fmc_line t4 on t8.LineID=t4.ID "
					+ " left join {0}.fpc_part t5 on t8.PartID=t5.ID "
					+ " left join {0}.fpc_partpoint t6 on t8.PartPointID=t6.ID "
					+ " left join {0}.bms_chargegroup t7 on t.GroupID=t7.ID "
					+ " WHERE  1=1  and ( @TeamID<= 0 or t.TeamID =@TeamID)"
					+ " and ( @WorkShopID<= 0 or t1.WorkShopID =@WorkShopID) "
					+ " and ( @LineID<= 0 or t8.LineID =@LineID) and ( @PartID< 0 or t8.PartID =@PartID)   "
					+ " and ( @ShiftIndex <= 0 or t7.ShiftIndex =@ShiftIndex) "
					+ " and ( @PartPointID< 0 or t8.PartPointID =@PartPointID) "
					+ " and ( @StationID< 0 or t8.StationID =@StationID)  "
					+ " and ( @GroupID< 0 or t.GroupID =@GroupID) and ( @Active< 0 or t1.Active =@Active)  "
					+ " and ( @MateUserID<= 0 or FIND_IN_SET( @MateUserID,t.MateUserIDList) )"
					+ " and ( @ModuleID<= 0 or t1.ModuleID =@ModuleID)  "
					+ " and ( @DepartmentID<= 0 or t1.DepartmentID =@DepartmentID)  "
					+ " and ( @Active< 0 or t8.Active =@Active) ;", wInstance.Result);

			wSQLText = this.DMLChange(wSQLText);
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("WorkShopID", wWorkShopID);
			wParms.Add("TeamID", wTeamID);
			wParms.Add("LineID", wLineID);
			wParms.Add("PartID", wPartID);
			wParms.Add("PartPointID", wPartPointID);
			wParms.Add("StationID", wStationID);
			wParms.Add("DepartmentID", wDepartmentID);
			wParms.Add("ShiftIndex", wShiftIndex);
			wParms.Add("ModuleID", wModuleID);
			wParms.Add("GroupID", wGroupID);
			wParms.Add("MateUserID", wMateUserID);
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

				wSqlDataReader.Add("ItemUserIDList",
						StringUtils.parseIntList(wSqlDataReader["ItemUserIDList"], ","));

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
			wResult = CloneTool.CloneArray(wQueryResultList, typeof(BMSTeamCharge));

		} catch (Exception e) {
			e.printStackTrace();
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	public void BMS_UpdateTeamCharge(BMSEmployee wLoginUser, BMSTeamCharge wBMSTeamCharge,
			OutResult<Int32> wErrorCode) {

		try {

			if (wBMSTeamCharge == null || wBMSTeamCharge.TeamID <= 0 || StringUtils.isEmpty(wBMSTeamCharge.Name)) {
				wErrorCode.Result = MESException.Parameter.Value;
				return;
			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			BMSTeamCharge wCheckTeamCharge = this.BMS_CheckTeamCharge(wLoginUser, wBMSTeamCharge, wErrorCode);
			if (wErrorCode.Result != 0)
				return;

			if (wCheckTeamCharge != null && wCheckTeamCharge.ID > 0) {
				wBMSTeamCharge.ID = wCheckTeamCharge.ID;
				wErrorCode.set(MESException.Duplication.Value);
				return;
			}

			String wSQL = "";

			if (wBMSTeamCharge.ID <= 0) {

				wSQL = StringUtils.Format(
						"INSERT INTO {0}.bms_teamcharge (  TeamID,ItemID,   CreatorID, CreateTime,"
								+ " EditorID, EditTime,GroupID,MateUserIDList) "
								+ "VALUES (   @TeamID, @ItemID, @CreatorID, now(),"
								+ " @EditorID, now(), @GroupID,@MateUserIDList);",

						wInstance.Result);
			} else {
				wSQL = StringUtils.Format("UPDATE {0}.bms_teamcharge  SET   TeamID=@TeamID,ItemID = @ItemID,"
						+ " MateUserIDList=@MateUserIDList, GroupID=@GroupID, EditorID = @EditorID, EditTime = now() WHERE ID = @ID;  ",
						wInstance.Result);
			}

			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("ID", wBMSTeamCharge.ID);
			wParamMap.Add("GroupID", wBMSTeamCharge.GroupID);
			wParamMap.Add("ItemID", wBMSTeamCharge.ItemID);
			wParamMap.Add("MateUserIDList", StringUtils.Join(",", wBMSTeamCharge.MateUserIDList));
			wParamMap.Add("TeamID", wBMSTeamCharge.TeamID);
			wParamMap.Add("CreatorID", wLoginUser.ID);
			wParamMap.Add("EditorID", wLoginUser.ID);
			wParamMap.Add("Active", wBMSTeamCharge.Active);

			if (wBMSTeamCharge.ID <= 0) {
				KeyHolder keyHolder = new GeneratedKeyHolder();

				SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParamMap);
				mDBPool.update(wSQL, wSqlParameterSource, keyHolder);

				wBMSTeamCharge.setID(keyHolder.getKey().intValue());
			} else {
				mDBPool.update(wSQL, wParamMap);
			}
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}

	}

}
