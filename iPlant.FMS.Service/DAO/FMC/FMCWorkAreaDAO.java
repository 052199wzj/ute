package com.mes.server.serviceimpl.dao.fmc;

import java.util.List;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.fmc.FMCWorkArea;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.shristool.LoggerTool;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.service.utils.StringUtils;

public class FMCWorkAreaDAO extends BaseDAO {
	private static FMCWorkAreaDAO Instance = null;

	private FMCWorkAreaDAO() {
		super();
	}

	public static FMCWorkAreaDAO getInstance() {
		if (Instance == null)
			Instance = new FMCWorkAreaDAO();
		return Instance;
	}

	private FMCWorkArea FMC_CheckWorkAreaByCode(BMSEmployee wLoginUser, FMCWorkArea wWorkArea,
			OutResult<Int32> wErrorCode) {
		FMCWorkArea wWorkAreaDB = new FMCWorkArea();
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = StringUtils.Format("Select ID from {0}.fmc_workarea ", wInstance.Result)
						+ " where ID!=@ID and WorkShopID=@WorkShopID and LineID=@LineID"
						+ "  and Name=@Name and ParentID=@ParentID";
				wParms.Clear();
				wParms.Add("ID", wWorkArea.ID);
				wParms.Add("LineID", wWorkArea.LineID);
				wParms.Add("WorkShopID", wWorkArea.WorkShopID);
				wParms.Add("Name", wWorkArea.Name);
				wParms.Add("ParentID", wWorkArea.ParentID);

				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					wWorkAreaDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_CheckLineByName", ex);
		}
		return wWorkAreaDB;
	}

	public void FMC_AddWorkArea(BMSEmployee wLoginUser, FMCWorkArea wWorkArea, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, 110001);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				FMCWorkArea wWorkAreaDB = this.FMC_CheckWorkAreaByCode(wLoginUser, wWorkArea, wErrorCode);
				if (wWorkAreaDB.ID > 0 || wWorkArea.Name.Length < 1 || wWorkArea.Code.Length < 1)
					wErrorCode.set(MESException.Logic.Value);
			}
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("Insert Into {0}.fmc_workarea", wInstance.Result)
						+ "(Name,Code,WorkShopID,LineID,OrderID,ParentID,CreatorID,EditorID,"
						+ " CreateTime,EditTime,Active) "
						+ " Values(@Name,@Code,@WorkShopID,@LineID,@OrderID,@ParentID,,@CreatorID,@EditorID,"
						+ " now(),now(),@Active);";
				wParms.Clear();

				wParms.Add("Name", wWorkArea.Name);
				wParms.Add("Code", wWorkArea.Code);
				wParms.Add("WorkShopID", wWorkArea.WorkShopID);
				wParms.Add("LineID", wWorkArea.LineID);
				wParms.Add("OrderID", wWorkArea.OrderID);
				wParms.Add("ParentID", wWorkArea.ParentID);
				wParms.Add("CreatorID", wLoginUser.ID);
				wParms.Add("EditorID", wLoginUser.ID);

				wParms.Add("Active", wWorkArea.Active);
				wSQLText = this.DMLChange(wSQLText);
				KeyHolder keyHolder = new GeneratedKeyHolder();

				SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
				mDBPool.update(wSQLText, wSqlParameterSource, keyHolder);

				wWorkArea.ID = keyHolder.getKey().intValue();

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_AddWorkArea", ex);
		}

	}

	public void FMC_SaveWorkArea(BMSEmployee wLoginUser, FMCWorkArea wWorkArea, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, 110001);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				FMCWorkArea wWorkAreaDB = this.FMC_CheckWorkAreaByCode(wLoginUser, wWorkArea, wErrorCode);
				if (wWorkAreaDB.ID > 0 || wWorkArea.Name.Length < 1 || wWorkArea.Code.Length < 1)
					wErrorCode.set(MESException.Logic.Value);
			}
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_workarea", wInstance.Result)
						+ " set Name=@Name,Code=@Code,OrderID=@OrderID,ParentID=@ParentID,"
						+ " WorkShopID=@WorkShopID,LineID=@LineID,"
						+ " EditorID=@EditorID,EditTime=now() where ID=@ID ; ";
				wParms.Clear();

				wParms.Add("ID", wWorkArea.ID);
				wParms.Add("Name", wWorkArea.Name);
				wParms.Add("Code", wWorkArea.Code);
				wParms.Add("OrderID", wWorkArea.OrderID);
				wParms.Add("ParentID", wWorkArea.ParentID);
				wParms.Add("WorkShopID", wWorkArea.WorkShopID);
				wParms.Add("LineID", wWorkArea.LineID);
				wParms.Add("EditorID", wLoginUser.ID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_SaveWorkArea", ex);
		}

	}

	public void FMC_DisableWorkArea(BMSEmployee wLoginUser, FMCWorkArea wWorkArea, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, 110001);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_workarea", wInstance.Result)
						+ " set EditorID=@EditorID, EditTime=now(),Active=2 where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wWorkArea.ID);
				wParms.Add("EditorID", wLoginUser.ID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_DisableLine", ex);
		}

	}

	public void FMC_ActiveWorkArea(BMSEmployee wLoginUser, FMCWorkArea wWorkArea, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, 110001);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_workarea", wInstance.Result)
						+ " set EditorID=@EditorID, EditTime=now(),Active=1 where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wWorkArea.ID);
				wParms.Add("EditorID", wLoginUser.ID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_ActiveLine", ex);
		}

	}

	public FMCWorkArea FMC_QueryWorkArea(BMSEmployee wLoginUser, String wName, int wParentID,
			OutResult<Int32> wErrorCode) {
		FMCWorkArea wWorkAreaDB = new FMCWorkArea();
		wErrorCode.set(0);
		try {
			if (StringUtils.isEmpty(wName) || wParentID < 0)
				return wWorkAreaDB;

			List<FMCWorkArea> wFMCWorkAreaList = this.FMC_QueryWorkAreaList(wLoginUser, -1, "", wName, -1, -1,
					wParentID, -1, wErrorCode);
			if (wFMCWorkAreaList != null && wFMCWorkAreaList.Count > 0) {
				wWorkAreaDB = wFMCWorkAreaList[0];
			}

		} catch (Exception ex) {
			logger.Error("FMC_QueryWorkArea", ex);
			wErrorCode.set(MESException.Exception.Value);
		}
		return wWorkAreaDB;
	}

	public FMCWorkArea FMC_QueryWorkArea(BMSEmployee wLoginUser, int wID, String wCode, OutResult<Int32> wErrorCode) {
		FMCWorkArea wWorkAreaDB = new FMCWorkArea();

		try {
			wErrorCode.set(0);
			if (wID > 0) {
				List<FMCWorkArea> wFMCWorkAreaList = this.FMC_QueryWorkAreaList(wLoginUser, wID, "", "", -1, -1, -1, -1,
						wErrorCode);
				if (wFMCWorkAreaList != null && wFMCWorkAreaList.Count > 0) {
					wWorkAreaDB = wFMCWorkAreaList[0];
				}
				return wWorkAreaDB;
			}
			if (StringUtils.isNotEmpty(wCode)) {
				List<FMCWorkArea> wFMCWorkAreaList = this.FMC_QueryWorkAreaList(wLoginUser, -1, wCode, "", -1, -1, -1,
						-1, wErrorCode);
				if (wFMCWorkAreaList != null && wFMCWorkAreaList.Count > 0) {
					wWorkAreaDB = wFMCWorkAreaList[0];
				}
				return wWorkAreaDB;
			}

		} catch (Exception ex) {
			logger.Error("FMC_QueryWorkArea", ex);
			wErrorCode.set(MESException.Exception.Value);
		}
		return wWorkAreaDB;
	}

	private List<FMCWorkArea> FMC_QueryWorkAreaList(BMSEmployee wLoginUser, int wID, String wCode, String wName,
			int wWorkShopID, int wLineID, int wParentID, int wActive, OutResult<Int32> wErrorCode) {
		List<FMCWorkArea> wWorkAreaList = new List<FMCWorkArea>();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = StringUtils
						.Format("Select t.*,t1.Name as WorkShopName,t2.Name as LineName from {0}.fmc_workarea t "
								+ " left join {0}.fmc_workshop t1 on t.WorkShopID=t1.ID  "
								+ " left join {0}.fmc_line t2 on t.LineID=t2.ID where 1=1  and ( @ID<=0 OR t.ID=@ID )"
								+ " AND (@Code='''' or t.Code=@Code)  AND (@Name='''' or t.Name=@Name)"
								+ " and (@WorkShopID<=0 or t.WorkShopID=@WorkShopID )"
								+ " and (@LineID<=0 or t.LineID=@LineID )" + " and (@Active<=0 or t.Active=@Active )"
								+ " and (@ParentID<=0 or t.ParentID=@ParentID ) order by t.OrderID;", wInstance.Result);
				wParms.Add("ID", wID);
				wParms.Add("Code", wCode);
				wParms.Add("Name", wName);
				wParms.Add("WorkShopID", wWorkShopID);
				wParms.Add("LineID", wLineID);
				wParms.Add("Active", wActive);
				wParms.Add("ParentID", wParentID);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					FMCWorkArea wWorkAreaDB = new FMCWorkArea();
					wWorkAreaDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wWorkAreaDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wWorkAreaDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wWorkAreaDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
					wWorkAreaDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
					wWorkAreaDB.LineName = StringUtils.parseString(wSqlDataReader["LineName"]);
					wWorkAreaDB.WorkShopName = StringUtils.parseString(wSqlDataReader["WorkShopName"]);
					wWorkAreaDB.ParentID = StringUtils.parseInt(wSqlDataReader["ParentID"]);
					wWorkAreaDB.OrderID = StringUtils.parseInt(wSqlDataReader["OrderID"]);
					wWorkAreaDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wWorkAreaDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wWorkAreaDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wWorkAreaDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wWorkAreaDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wWorkAreaDB.Creator = BFCConstants.GetBMSEmployeeName(wWorkAreaDB.CreatorID);
					wWorkAreaDB.Editor = BFCConstants.GetBMSEmployeeName(wWorkAreaDB.EditorID);
					wWorkAreaList.Add(wWorkAreaDB);
				}
			}

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryWorkAreaList: Query DB",
					ex);
		}
		return wWorkAreaList;
	}

	public List<FMCWorkArea> FMC_QueryWorkAreaList(BMSEmployee wLoginUser, String wName, int wWorkShopID, int wLineID,
			int wParentID, int wActive, OutResult<Int32> wErrorCode) {
		List<FMCWorkArea> wWorkAreaList = new List<FMCWorkArea>();
		wErrorCode.set(0);
		try {
			wWorkAreaList = this.FMC_QueryWorkAreaList(wLoginUser, 0, "", wName, wWorkShopID, wLineID, wParentID,
					wActive, wErrorCode);
		} catch (Exception ex) {
			logger.Error("FMC_QueryWorkAreaList", ex);
			wErrorCode.set(MESException.Exception.Value);
		}
		return wWorkAreaList;
	}

}
