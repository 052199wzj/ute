package com.mes.server.serviceimpl.dao.bms;

import java.util.List;
import java.util.DateTime;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import com.mes.server.service.mesenum.DBEnumType;
import com.mes.server.service.mesenum.FMCShiftLevel;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.bms.BMSChargeGroup;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;

public class BMSChargeGroupDAO extends BaseDAO {

	private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(typeof(BMSChargeGroupDAO));

	private static BMSChargeGroupDAO Instance = null;

	private BMSChargeGroupDAO() {
		super();
	}

	private static int RoleFunctionID = 900603;
	public static BMSChargeGroupDAO getInstance() {
		if (Instance == null)
			Instance = new BMSChargeGroupDAO();
		return Instance;
	}

	public BMSChargeGroupDAO(NamedParameterJdbcTemplate mDBPool) {
		super(mDBPool);
		// TODO Auto-generated constructor stub
	}

	public BMSChargeGroupDAO(NamedParameterJdbcTemplate mDBPool, DBEnumType wSQLTypes) {
		super(mDBPool, wSQLTypes);
		// TODO Auto-generated constructor stub
	}

	private BMSChargeGroup BMS_CheckChargeGroup(BMSEmployee wLoginUser, BMSChargeGroup wBMSChargeGroup,
			OutResult<Int32> wErrorCode) {
		BMSChargeGroup wResult = new BMSChargeGroup();
		try {

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			String wSQLText = StringUtils.Format("SELECT t.ID From  {0}.bms_chargegroup  t "
					+ " WHERE  t.ID!=@ID  and  t.TeamID =@TeamID  and  t.Name =@Name ;", wInstance.Result);

			wSQLText = this.DMLChange(wSQLText);
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("TeamID", wBMSChargeGroup.TeamID);
			wParms.Add("ID", wBMSChargeGroup.ID);
			wParms.Add("Name", wBMSChargeGroup.Name);

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

	public List<BMSChargeGroup> BMS_GetChargeGroupList(BMSEmployee wLoginUser, int wTeamID, int wActive,
			OutResult<Int32> wErrorCode) {
		List<BMSChargeGroup> wResult = new List<BMSChargeGroup>();
		try {

			wResult = this.BMS_GetChargeGroupList(wLoginUser, -1, wTeamID, wActive, wErrorCode);
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	public BMSChargeGroup BMS_GetChargeGroup(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode) {
		BMSChargeGroup wResult = new BMSChargeGroup();
		try {
			List<BMSChargeGroup> wBMSChargeGroupList = this.BMS_GetChargeGroupList(wLoginUser, wID, -1, -1, wErrorCode);
			if (wBMSChargeGroupList.Count > 0)
				wResult = wBMSChargeGroupList[0];

		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	};

	private List<BMSChargeGroup> BMS_GetChargeGroupList(BMSEmployee wLoginUser, int wID, int wTeamID, int wActive,
			OutResult<Int32> wErrorCode) {
		List<BMSChargeGroup> wResult = new List<BMSChargeGroup>();
		try {

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			String wSQLText = StringUtils.Format("SELECT t.* FROM {0}.bms_chargegroup  t  WHERE  1=1 "
					+ " and ( @ID<= 0 or t.ID =@ID)  and ( @TeamID<= 0 or t.TeamID =@TeamID)"
					+ " and ( @Active< 0 or t.Active =@Active) ;", wInstance.Result);

			wSQLText = this.DMLChange(wSQLText);
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("ID", wID);
			wParms.Add("TeamID", wTeamID);
			wParms.Add("Active", wActive);

			List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);

			List<Int32> wIntList = null;
			for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {

				wSqlDataReader.Add("ShiftName",
						FMCShiftLevel.getEnumType(StringUtils.parseInt(wSqlDataReader["ShiftIndex"])).getLable());

				wSqlDataReader.Add("EditorName",
						BFCConstants.GetBMSEmployeeName(StringUtils.parseInt(wSqlDataReader["EditorID"])));
				wSqlDataReader.Add("CreatorName",
						BFCConstants.GetBMSEmployeeName(StringUtils.parseInt(wSqlDataReader["CreatorID"])));
				wIntList = StringUtils.parseIntList(wSqlDataReader["LeaderID"], ",");
				wSqlDataReader.Add("LeaderID", wIntList);
				wSqlDataReader.Add("LeaderName", BFCConstants.GetBMSEmployeeName(wIntList));

			}
			wResult = CloneTool.CloneArray(wQueryResultList, typeof(BMSChargeGroup));
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wResult;
	}

	public void BMS_UpdateChargeGroup(BMSEmployee wLoginUser, BMSChargeGroup wBMSChargeGroup,
			OutResult<Int32> wErrorCode) {

		try {
			if (wBMSChargeGroup == null || StringUtils.isEmpty(wBMSChargeGroup.Name)) {
				wErrorCode.Result = MESException.Parameter.Value;
				return;
			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;

			BMSChargeGroup wCheckChargeGroup = this.BMS_CheckChargeGroup(wLoginUser, wBMSChargeGroup, wErrorCode);
			if (wErrorCode.Result != 0)
				return;

			if (wCheckChargeGroup != null && wCheckChargeGroup.ID > 0) {
				wErrorCode.set(MESException.Duplication.Value);
				wBMSChargeGroup.ID = wCheckChargeGroup.ID;
				return;
			}

			String wSQL = "";

			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

			wParamMap.Add("TeamID", wBMSChargeGroup.TeamID);
			wParamMap.Add("Name", wBMSChargeGroup.Name);
			wParamMap.Add("ShiftIndex", wBMSChargeGroup.ShiftIndex);
			wParamMap.Add("LeaderID", StringUtils.Join(",", wBMSChargeGroup.LeaderID));
			wParamMap.Add("EditTime", DateTime.Now);
			wParamMap.Add("EditorID", wLoginUser.ID);
			wParamMap.Add("Active", wBMSChargeGroup.Active);

			if (wBMSChargeGroup.ID <= 0) {

				wParamMap.Add("CreatorID", wLoginUser.ID);
				wParamMap.Add("CreateTime", DateTime.Now);
				wBMSChargeGroup.ID = this.Insert(StringUtils.Format("{0}.bms_chargegroup", wInstance.Result),
						wParamMap);

			} else {
				wParamMap.Add("ID", wBMSChargeGroup.ID);
				this.Update(StringUtils.Format("{0}.bms_chargegroup", wInstance.Result), "ID", wParamMap);
			}
		} catch (Exception e) {
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
			wErrorCode.set(MESException.DBSQL.Value);
		}

	}

}
