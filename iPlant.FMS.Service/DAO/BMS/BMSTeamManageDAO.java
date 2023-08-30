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
import com.mes.server.service.po.bms.BMSTeamManage;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;

public class BMSTeamManageDAO extends BaseDAO {

	private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(typeof(BMSTeamManageDAO));

	private static BMSTeamManageDAO Instance = null;
	private static int RoleFunctionID = 900601;

	private BMSTeamManageDAO() {
		super();
	}

	public static BMSTeamManageDAO getInstance() {
		if (Instance == null)
			Instance = new BMSTeamManageDAO();
		return Instance;
	}

	public BMSTeamManageDAO(NamedParameterJdbcTemplate mDBPool) {
		super(mDBPool);
		// TODO Auto-generated constructor stub
	}

	public BMSTeamManageDAO(NamedParameterJdbcTemplate mDBPool, DBEnumType wSQLTypes) {
		super(mDBPool, wSQLTypes);
		// TODO Auto-generated constructor stub
	}

	private BMSTeamManage BMS_CheckBMSTeamManage(BMSEmployee wLoginUser, BMSTeamManage wBMSTeamManage,
			OutResult<Int32> wErrorCode) {
		BMSTeamManage wResult = new BMSTeamManage();
		try {

			if (wBMSTeamManage == null || StringUtils.isEmpty(wBMSTeamManage.Name)) {
				wErrorCode.set(MESException.Parameter.Value);
				return wResult;
			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			String wSQLText = StringUtils.Format("SELECT t1.ID FROM {0}.bms_teammanage  t1 "
					+ " where t1.ID!=@ID AND t1.WorkShopID =@WorkShopID  and t1.ModuleID=@ModuleID"
					+ "  and ( t1.Name =@Name or t1.Code= @Code);", wInstance.Result);

			wSQLText = this.DMLChange(wSQLText);
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("ID", wBMSTeamManage.ID);
			wParms.Add("WorkShopID", wBMSTeamManage.WorkShopID);
			wParms.Add("ModuleID", wBMSTeamManage.ModuleID);
			wParms.Add("Name", wBMSTeamManage.Name);
			wParms.Add("Code", wBMSTeamManage.Code);

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

	private List<BMSTeamManage> BMS_GetTeamManageList(BMSEmployee wLoginUser, List<Int32> wIDList, int wWorkShopID,
			int wDepartmentID, int wModuleID, int wLeaderID, int wActive, OutResult<Int32> wErrorCode) {
		List<BMSTeamManage> wResult = new List<BMSTeamManage>();
		try {
			if (wIDList == null)
				wIDList = new List<Int32>();

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			String wSQLText = StringUtils.Format(
					"SELECT t1.*, t2.Name as DepartmentName, t3.Name as WorkShopName FROM {0}.bms_teammanage  t1  "
							+ " left join {0}.bms_department  t2  on  t1.DepartmentID=t2.ID "
							+ " left join {0}.fmc_workshop  t3  on  t1.WorkShopID=t3.ID  where 1=1 "
							+ " and ( @ID ='' or t1.ID IN( {1} ) ) "
							+ " and ( @WorkShopID<= 0 or t1.WorkShopID =@WorkShopID)  "
							+ " and ( @LeaderID<= 0 or FIND_IN_SET( @LeaderID,t1.LeaderID))  "
							+ " and ( @ModuleID<= 0 or t1.ModuleID =@ModuleID)  "
							+ " and ( @DepartmentID<= 0 or t1.DepartmentID =@DepartmentID)  "
							+ " and ( @Active< 0 or t1.Active =@Active) ;",
					wInstance.Result, wIDList.Count > 0 ? StringUtils.Join(",", wIDList) : "0");

			wSQLText = this.DMLChange(wSQLText);
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("ID", StringUtils.Join(",", wIDList));
			wParms.Add("WorkShopID", wWorkShopID);
			wParms.Add("DepartmentID", wDepartmentID);
			wParms.Add("LeaderID", wLeaderID);
			wParms.Add("ModuleID", wModuleID);
			wParms.Add("Active", wActive);

			List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
			for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
				BMSTeamManage wDepartment = new BMSTeamManage();
				wDepartment.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
				wDepartment.Code = StringUtils.parseString(wSqlDataReader["Code"]);
				wDepartment.Name = StringUtils.parseString(wSqlDataReader["Name"]);
				wDepartment.ShiftIndex = StringUtils.parseInt(wSqlDataReader["ShiftIndex"]);
				wDepartment.ShiftName = FMCShiftLevel.getEnumType(wDepartment.ShiftIndex).getLable();
				wDepartment.ModuleID = StringUtils.parseInt(wSqlDataReader["ModuleID"]);
				wDepartment.ModuleName = BMMFunctionModule.getEnumType(wDepartment.ModuleID).getLable();
				wDepartment.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
				wDepartment.WorkShopName = StringUtils.parseString(wSqlDataReader["WorkShopName"]);
				wDepartment.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
				wDepartment.DepartmentName = StringUtils.parseString(wSqlDataReader["DepartmentName"]);
				wDepartment.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
				wDepartment.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
				wDepartment.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
				wDepartment.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
				wDepartment.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
				wDepartment.LeaderID = StringUtils
						.parseIntList(StringUtils.split(StringUtils.parseString(wSqlDataReader["LeaderID"]), ","));
				wDepartment.LeaderName = BFCConstants.GetBMSEmployeeName(wDepartment.LeaderID);
				wDepartment.MateID = StringUtils
						.parseIntList(StringUtils.split(StringUtils.parseString(wSqlDataReader["MateID"]), ","));
				wDepartment.MateName = BFCConstants.GetBMSEmployeeName(wDepartment.MateID);
				wDepartment.DepartmentName = StringUtils.parseString(wSqlDataReader["DepartmentName"]);
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

	public List<BMSTeamManage> BMS_GetTeamManageList(BMSEmployee wLoginUser, int wWorkShopID, int wDepartmentID,
			int wModuleID, int wLeaderID, int wActive, OutResult<Int32> wErrorCode) {
		List<BMSTeamManage> wResult = new List<BMSTeamManage>();
		try {
			wErrorCode.set(0);

			wResult = BMS_GetTeamManageList(wLoginUser, null, wWorkShopID, wDepartmentID, wModuleID, wLeaderID, wActive,
					wErrorCode);
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	public List<BMSTeamManage> BMS_GetTeamManageList(BMSEmployee wLoginUser, List<Int32> wIDList,
			OutResult<Int32> wErrorCode) {
		List<BMSTeamManage> wResult = new List<BMSTeamManage>();
		try {
			wErrorCode.set(0);

			wResult = BMS_GetTeamManageList(wLoginUser, wIDList, 0, 0, 0, 0, -1, wErrorCode);
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	public BMSTeamManage BMS_GetTeamManage(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode) {
		BMSTeamManage wResult = new BMSTeamManage();
		try {
			wErrorCode.set(0);
			List<BMSTeamManage> wBMSTeamManageList = this.BMS_GetTeamManageList(wLoginUser,
					StringUtils.parseList(new Int32[] { wID }), 0, 0, 0, 0, -1, wErrorCode);
			if (wBMSTeamManageList != null && wBMSTeamManageList.Count > 0) {
				wResult = wBMSTeamManageList[0];
				wResult.TeamChargeList = BMSTeamChargeDAO.getInstance().BMS_GetTeamChargeList(wLoginUser,
						wResult.ID, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, wErrorCode);
			}
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	public void BMS_UpdateTeamManage(BMSEmployee wLoginUser, BMSTeamManage wBMSTeamManage,
			OutResult<Int32> wErrorCode) {
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			BMSTeamManage wCheckTeamManage = this.BMS_CheckBMSTeamManage(wLoginUser, wBMSTeamManage, wErrorCode);
			if (wErrorCode.Result != 0)
				return;

			if (wCheckTeamManage != null && wCheckTeamManage.ID > 0) {
				wErrorCode.set(MESException.Logic.Value);
				return;
			}

			String wSQL = "";

			if (wBMSTeamManage.ID <= 0) {

				int wCount = this.GetMaxPrimaryKey(StringUtils.Format("{0}.bms_teammanage", wInstance.Result), "ID");

				wBMSTeamManage.Code = StringUtils.Format("BZ-{0}", String.format("%05d", wCount + 1));

				wSQL = StringUtils.Format("INSERT INTO {0}.bms_teammanage ( Code,LeaderID, "
						+ "Name, ModuleID,WorkShopID,DepartmentID,CreatorID, CreateTime, EditorID, "
						+ "EditTime, Active,MateID,ShiftIndex) "
						+ "VALUES (@Code,@LeaderID,@Name, @ModuleID,@WorkShopID,@DepartmentID,@CreatorID, "
						+ "now(), @EditorID, now(), @Active,@MateID,@ShiftIndex);", wInstance.Result);
			} else {

				BMSTeamManage wTeamManageTemp = this.BMS_GetTeamManage(wLoginUser, wBMSTeamManage.ID, wErrorCode);
				if (wTeamManageTemp == null || wTeamManageTemp.ID <= 0) {
					wErrorCode.set(MESException.NotFound.Value);
					return;
				}

				wSQL = StringUtils.Format(
						"UPDATE {0}.bms_teammanage SET  Name = @Name,Code = @Code,LeaderID=@LeaderID,MateID=@MateID, "
								+ "ModuleID=@ModuleID, WorkShopID=@WorkShopID,DepartmentID=@DepartmentID,ShiftIndex=@ShiftIndex,"
								+ "EditorID = @EditorID, EditTime = now() WHERE ID = @ID;  ",
						wInstance.Result);
			}

			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("ID", wBMSTeamManage.ID);
			wParamMap.Add("Code", wBMSTeamManage.Code);
			wParamMap.Add("Name", wBMSTeamManage.Name);
			wParamMap.Add("ShiftIndex", wBMSTeamManage.ShiftIndex);
			wParamMap.Add("CreatorID", wLoginUser.ID);
			wParamMap.Add("EditorID", wLoginUser.ID);
			wParamMap.Add("LeaderID", StringUtils.Join(",", wBMSTeamManage.LeaderID));
			wParamMap.Add("MateID", StringUtils.Join(",", wBMSTeamManage.MateID));
			wParamMap.Add("ModuleID", wBMSTeamManage.ModuleID);
			wParamMap.Add("WorkShopID", wBMSTeamManage.WorkShopID);
			wParamMap.Add("DepartmentID", wBMSTeamManage.DepartmentID);
			wParamMap.Add("Active", wBMSTeamManage.Active);

			if (wBMSTeamManage.ID <= 0) {
				KeyHolder keyHolder = new GeneratedKeyHolder();

				SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParamMap);
				mDBPool.update(wSQL, wSqlParameterSource, keyHolder);

				wBMSTeamManage.setID(keyHolder.getKey().intValue());
			} else {
				mDBPool.update(wSQL, wParamMap);
			}
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}

	}

	public int BMS_DeleteTeamManage(BMSEmployee wLoginUser, BMSTeamManage wBMSTeamManage,
			OutResult<Int32> wErrorCode) {
		int wResult = 0;
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			String wSQL = StringUtils.Format("Delete from {0}.bms_teammanage  WHERE ID = @ID and Active=0;  ",
					wInstance.Result);

			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("ID", wBMSTeamManage.ID);
			mDBPool.update(wSQL, wParamMap);
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	public int BMS_ActiveTeamManage(BMSEmployee wLoginUser, int wActive, BMSTeamManage wBMSTeamManage,
			OutResult<Int32> wErrorCode) {
		int wResult = 0;
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			String wSQL = StringUtils.Format(
					"UPDATE {0}.bms_teammanage SET EditorID = @wEditorID, EditTime =now(), Active = @wActive WHERE ID = @wID;  ",
					wInstance.Result);
			wSQL = this.DMLChange(wSQL);
			wParamMap.clear();
			wParamMap.Add("wID", wBMSTeamManage.ID);
			wParamMap.Add("wActive", wActive);
			wParamMap.Add("wEditorID", wLoginUser.ID);

			mDBPool.update(wSQL, wParamMap);

		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

}
