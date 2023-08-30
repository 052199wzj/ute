package com.mes.server.serviceimpl.dao.fmc;

import java.util.List;
import java.util.DateTime;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import com.mes.server.service.mesenum.BPMStatus;
import com.mes.server.service.mesenum.FMCShiftLevel;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.fmc.FMCShift;
import com.mes.server.service.po.fmc.FMCTimeZone;
import com.mes.server.service.po.fmc.FMCWorkDay;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.serviceimpl.utils.fmc.FMCConstants;
import com.mes.server.shristool.LoggerTool;
import com.mes.server.serviceimpl.dao.BaseDAO; 
import com.mes.server.service.utils.StringUtils;

public class FMCShiftDAO extends BaseDAO {
	private static FMCShiftDAO Instance = null;

	private FMCShiftDAO() {
		super();
	}

	public static FMCShiftDAO getInstance() {
		if (Instance == null)
			Instance = new FMCShiftDAO();
		return Instance;
	}

	private static int RoleFunctionID = 900400;

	// 班次模板管理
	private FMCWorkDay FMC_CheckWorkDay(int wCompanyID, int wLoginID, FMCWorkDay wWorkDay,
			OutResult<Int32> wErrorCode) {
		FMCWorkDay wShiftDB = new FMCWorkDay();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("Select ID from {0}.fmc_workday ", wInstance.Result)
						+ " where ID!=@ID and FactoryID=@FactoryID and WorkShopID=@WorkShopID and Name=@Name";
				wParms.Clear();
				wParms.Add("ID", wWorkDay.ID);
				wParms.Add("Name", wWorkDay.Name);
				wParms.Add("WorkShopID", wWorkDay.WorkShopID);
				wParms.Add("FactoryID", wWorkDay.FactoryID);

				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					wShiftDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_CheckWorkDay", ex);

		}
		return wShiftDB;
	}

	public int FMC_AddWorkDay(int wCompanyID, int wLoginID, FMCWorkDay wWorkDay, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		int wID = 0;
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID,
					RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				FMCWorkDay wShiftDB = this.FMC_CheckWorkDay(wCompanyID, wLoginID, wWorkDay, wErrorCode);
				if (wShiftDB.ID > 0 || wWorkDay.Name.Length < 1)
					wErrorCode.set(MESException.Logic.Value);
			}
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("Insert Into {0}.fmc_workday", wInstance.Result)
						+ "(Name,FactoryID,WorkShopID,CreatorID,EditorID,AuditorID,CreateTime,EditTime,"
						+ " AuditTime,Status,StartTime,Minutes,WorkMinutes,IdleMinutes,EndTime,Active) "
						+ " Values(@Name,@FactoryID,@WorkShopID,@CreatorID,@EditorID,@AuditorID,"
						+ "@CreateTime,@EditTime,@AuditTime,@Status,@StartTime,@Minutes,@WorkMinutes,@IdleMinutes,@EndTime,@Active);";
				wParms.Clear();

				wParms.Add("Name", wWorkDay.Name);
				wParms.Add("FactoryID", wWorkDay.FactoryID);
				wParms.Add("WorkShopID", wWorkDay.WorkShopID);
				wParms.Add("StartTime", wWorkDay.StartTime);
				wParms.Add("Minutes", wWorkDay.Minutes);
				wParms.Add("WorkMinutes", wWorkDay.WorkMinutes);
				wParms.Add("IdleMinutes", wWorkDay.IdleMinutes);
				wParms.Add("EndTime", wWorkDay.EndTime);
				wParms.Add("CreatorID", wLoginID);
				wParms.Add("EditorID", wLoginID);
				wParms.Add("AuditorID", 0);

				wParms.Add("CreateTime", DateTime.Now);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("AuditTime", DateTime.Now);
				wParms.Add("Status", wWorkDay.Status);
				wParms.Add("Active", 0);
				wSQLText = this.DMLChange(wSQLText);
				KeyHolder keyHolder = new GeneratedKeyHolder();

				SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
				mDBPool.update(wSQLText, wSqlParameterSource, keyHolder);

				wID = keyHolder.getKey().intValue();
				wWorkDay.ID = wID;
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);

			logger.Error("FMC_AddWorkDay", ex);
		}
		return wID;
	}

	public int FMC_SaveWorkDay(int wCompanyID, int wLoginID, FMCWorkDay wWorkDay, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID,
					RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				FMCWorkDay wWorkDayDB = this.FMC_CheckWorkDay(wCompanyID, wLoginID, wWorkDay, wErrorCode);
				if (wWorkDayDB.ID > 0 || wWorkDay.Name.Length < 1)
					wErrorCode.set(MESException.Logic.Value);
			}
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_workday", wInstance.Result)
						+ " set Name=@Name,FactoryID=@FactoryID,WorkShopID=@WorkShopID,StartTime=@StartTime,Minutes=@Minutes,WorkMinutes=@WorkMinutes,"
						+ "IdleMinutes=@IdleMinutes,EndTime=@EndTime,EditorID=@EditorID,EditTime=@EditTime,Status=@Status where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wWorkDay.ID);

				wParms.Add("Name", wWorkDay.Name);
				wParms.Add("FactoryID", wWorkDay.FactoryID);
				wParms.Add("WorkShopID", wWorkDay.WorkShopID);
				wParms.Add("StartTime", wWorkDay.StartTime);
				wParms.Add("Minutes", wWorkDay.Minutes);
				wParms.Add("WorkMinutes", wWorkDay.WorkMinutes);
				wParms.Add("IdleMinutes", wWorkDay.IdleMinutes);
				wParms.Add("EndTime", wWorkDay.EndTime);
				wParms.Add("EditorID", wLoginID);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("Status", wWorkDay.Status);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
				// FMCFactoryDAO.getInstance().FMC_LoadFactoyEntry(wCompanyID, wErrorCode);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_SaveWorkDay", ex);
		}
		return wErrorCode.Result;
	}

	public int FMC_DisableWorkDay(int wCompanyID, int wLoginID, FMCWorkDay wWorkDay, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID,
					RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_workday", wInstance.Result) + " set AuditorID=@AuditorID,"
						+ " AuditTime=@AuditTime,Active=2 where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wWorkDay.ID);
				wParms.Add("AuditorID", wLoginID);
				wParms.Add("AuditTime", DateTime.Now);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);

			logger.Error("FMC_DisableWorkDay", ex);
		}
		return wErrorCode.Result;
	}

	public int FMC_ActiveWorkDay(int wCompanyID, int wLoginID, FMCWorkDay wWorkDay, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID,
					RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_workday", wInstance.Result) + " set AuditorID=@AuditorID,"
						+ " AuditTime=@AuditTime,Active=0  where ID>0 AND FactoryID=@FactoryID AND WorkShopID=@WorkShopID ;";
				wSQLText = this.DMLChange(wSQLText);
				wParms.Add("WorkShopID", wWorkDay.WorkShopID);
				wParms.Add("FactoryID", wWorkDay.FactoryID);
				wParms.Add("AuditorID", wLoginID);
				wParms.Add("AuditTime", DateTime.Now);
				mDBPool.update(wSQLText, wParms);

				wSQLText = StringUtils.Format("update {0}.fmc_workday", wInstance.Result)
						+ " set  AuditorID=@AuditorID," + " AuditTime=@AuditTime,Active=1 where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wWorkDay.ID);
				wParms.Add("AuditorID", wLoginID);
				wParms.Add("AuditTime", DateTime.Now);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);

			logger.Error("FMC_ActiveWorkDay", ex);
		}
		return wErrorCode.Result;
	}

	public int FMC_AuditWorkDay(int wCompanyID, int wLoginID, FMCWorkDay wWorkDay, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID,
					RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_workday", wInstance.Result) + " set AuditorID=@AuditorID,"
						+ "AuditTime=@AuditTime,Status=@Status where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wWorkDay.ID);

				wParms.Add("AuditorID", wLoginID);
				wParms.Add("AuditTime", DateTime.Now);
				wParms.Add("Status", wWorkDay.Status);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_AuditWorkDay", ex);
		}
		return wErrorCode.Result;
	}

	public FMCWorkDay FMC_QueryWorkDayByID(int wCompanyID, int wLoginID, int wID, OutResult<Int32> wErrorCode) {
		FMCWorkDay wWorkDayDB = new FMCWorkDay();
		wErrorCode.set(0);
		try {
			List<FMCWorkDay> wShiftList = this.FMC_QueryWorkDayList(wCompanyID, wLoginID, wID, -1, -1, -1, wErrorCode);
			if (wShiftList != null && wShiftList.Count > 0)
				wWorkDayDB = wShiftList[0];
		} catch (Exception ex) {
			logger.Error("FMC_QueryWorkDayByID", ex);
			wErrorCode.set(MESException.Exception.Value);
		}
		return wWorkDayDB;
	}

	public FMCWorkDay FMC_QueryActiveWorkDay(int wCompanyID, int wLoginID, int wFactoryID, int wWorkShopID,
			OutResult<Int32> wErrorCode) {
		FMCWorkDay wWorkDayDB = new FMCWorkDay();
		wErrorCode.set(0);
		try {
			List<FMCWorkDay> wShiftList = this.FMC_QueryWorkDayList(wCompanyID, wLoginID, 0, wFactoryID, wWorkShopID, 1,
					wErrorCode);
			if (wShiftList != null && wShiftList.Count > 0)
				wWorkDayDB = wShiftList[0];
		} catch (Exception ex) {
			logger.Error("FMC_QueryWorkDayByID", ex);
			wErrorCode.set(MESException.Exception.Value);
		}
		return wWorkDayDB;
	}

	private List<FMCWorkDay> FMC_QueryWorkDayList(int wCompanyID, int wLoginID, int wID, int wFactoryID,
			int wWorkShopID, int wActive, OutResult<Int32> wErrorCode) {
		List<FMCWorkDay> wShiftList = new List<FMCWorkDay>();
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = StringUtils
						.Format("Select t.*,t1.Name as Factory,t2.Name as WorkShopName  from {0}.fmc_workday t "
								+ " left join {0}.fmc_factory t1 on t1.ID=t.FactoryID "
								+ " left join {0}.fmc_workshop t2 on t2.ID=t.WorkShopID where (@ID<=0 OR t.ID=@ID)"
								+ " AND (@Active< 0 OR t.Active=@Active)"
								+ " AND (@FactoryID <=0  OR t.FactoryID=@FactoryID)"
								+ " AND (@WorkShopID <=0  OR t.WorkShopID=@WorkShopID)", wInstance.Result);
				wParms.Clear();
				wParms.Add("ID", wID);
				wParms.Add("Active", wActive);
				wParms.Add("FactoryID", wFactoryID);
				wParms.Add("WorkShopID", wWorkShopID);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					FMCWorkDay wShiftDB = new FMCWorkDay();
					wShiftDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wShiftDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wShiftDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);
					wShiftDB.Factory = StringUtils.parseString(wSqlDataReader["Factory"]);
					wShiftDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
					wShiftDB.WorkShopName = StringUtils.parseString(wSqlDataReader["WorkShopName"]);
					wShiftDB.StartTime = StringUtils.parseDate(wSqlDataReader["StartTime"]);
					wShiftDB.Minutes = StringUtils.parseInt(wSqlDataReader["Minutes"]);
					wShiftDB.WorkMinutes = StringUtils.parseInt(wSqlDataReader["WorkMinutes"]);
					wShiftDB.IdleMinutes = StringUtils.parseInt(wSqlDataReader["IdleMinutes"]);
					wShiftDB.EndTime = StringUtils.parseDate(wSqlDataReader["EndTime"]);

					wShiftDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wShiftDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wShiftDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wShiftDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wShiftDB.AuditTime = StringUtils.parseDate(wSqlDataReader["AuditTime"]);
					wShiftDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wShiftDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
					wShiftDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wShiftDB.StatusText = BPMStatus.getEnumType(wShiftDB.Status).getLable();

					wShiftDB.Creator = BFCConstants.GetBMSEmployeeName(wShiftDB.CreatorID);
					wShiftDB.Auditor = BFCConstants.GetBMSEmployeeName(wShiftDB.AuditorID);
					wShiftDB.Editor = BFCConstants.GetBMSEmployeeName(wShiftDB.EditorID);

					wShiftList.Add(wShiftDB);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryWorkDayList: Query DB",
					ex);
		}
		return wShiftList;
	}

	public List<FMCWorkDay> FMC_QueryWorkDayList(int wCompanyID, int wLoginID, int wFactoryID, int wWorkShopID,
			int wActive, OutResult<Int32> wErrorCode) {
		List<FMCWorkDay> wShiftList = new List<FMCWorkDay>();
		wErrorCode.set(0);
		try {
			wShiftList = this.FMC_QueryWorkDayList(wCompanyID, wLoginID, 0, wFactoryID, wWorkShopID, wActive,
					wErrorCode);

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryWorkDayList: Query DB",
					ex);
		}
		return wShiftList;
	}

	private FMCShift FMC_CheckShift(int wCompanyID, int wLoginID, FMCShift wShift, OutResult<Int32> wErrorCode) {
		FMCShift wShiftDB = new FMCShift();
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";
				if (wShift.ID > 0) {
					wSQLText = StringUtils.Format("Select * from {0}.fmc_shift ", wInstance.Result)
							+ " where ID!=@ID and LevelID=@LevelID and WorkDayID=@WorkDayID";
					wParms.Clear();
					wParms.Add("ID", wShift.ID);
					wParms.Add("LevelID", wShift.LevelID);
					wParms.Add("WorkDayID", wShift.WorkDayID);
				} else {
					wSQLText = StringUtils.Format("Select * from {0}.fmc_shift ", wInstance.Result)
							+ " where LevelID=@LevelID and WorkDayID=@WorkDayID";
					wParms.Clear();
					wParms.Add("LevelID", wShift.LevelID);
					wParms.Add("WorkDayID", wShift.WorkDayID);
				}
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					wShiftDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wShiftDB.LevelID = StringUtils.parseInt(wSqlDataReader["LevelID"]);
					wShiftDB.WorkDayID = StringUtils.parseInt(wSqlDataReader["WorkDayID"]);
					wShiftDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wShiftDB.StartTime = StringUtils.parseDate(wSqlDataReader["StartTime"]);
					wShiftDB.Minutes = StringUtils.parseInt(wSqlDataReader["Minutes"]);
					wShiftDB.WorkMinutes = StringUtils.parseInt(wSqlDataReader["WorkMinutes"]);
					wShiftDB.IdleMinutes = StringUtils.parseInt(wSqlDataReader["IdleMinutes"]);
					wShiftDB.EndTime = StringUtils.parseDate(wSqlDataReader["EndTime"]);
					wShiftDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_CheckShift", ex);
		}
		return wShiftDB;
	}

	public List<FMCShift> FMC_QueryShiftList(int wCompanyID, int wLoginID, int wWorkDayID, int wActive,
			OutResult<Int32> wErrorCode) {
		List<FMCShift> wShiftList = new List<FMCShift>();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {

				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";
				wSQLText = StringUtils.Format("Select t.* from {0}.fmc_shift t ", wInstance.Result)
						+ " where t.WorkDayID=@WorkDayID and (@Active<=0 or t.Active=@Active )";
				wParms.Clear();
				wParms.Add("WorkDayID", wWorkDayID);
				wParms.Add("Active", wActive);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					FMCShift wShiftDB = new FMCShift();

					wShiftDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wShiftDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wShiftDB.LevelID = StringUtils.parseInt(wSqlDataReader["LevelID"]);
					wShiftDB.WorkDayID = StringUtils.parseInt(wSqlDataReader["WorkDayID"]);
					wShiftDB.StartTime = StringUtils.parseDate(wSqlDataReader["StartTime"]);
					wShiftDB.Minutes = StringUtils.parseInt(wSqlDataReader["Minutes"]);
					wShiftDB.WorkMinutes = StringUtils.parseInt(wSqlDataReader["WorkMinutes"]);

					wShiftDB.IdleMinutes = StringUtils.parseInt(wSqlDataReader["IdleMinutes"]);
					wShiftDB.EndTime = StringUtils.parseDate(wSqlDataReader["EndTime"]);
					wShiftDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wShiftDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wShiftDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wShiftDB.Creator = BFCConstants.GetBMSEmployeeName(
							wShiftDB.CreatorID);
					wShiftList.Add(wShiftDB);
				}
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryShiftList: Query DB",
					ex);
		}
		return wShiftList;
	}

	public int FMC_SaveShiftList(int wCompanyID, int wLoginID, List<FMCShift> wShiftList,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		int wID = 0;
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID,
					RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";
				for (FMCShift wShift : wShiftList) {
					if (wErrorCode.Result == 0) {
						FMCShift wShiftDB = this.FMC_CheckShift(wCompanyID, wLoginID, wShift, wErrorCode);
						if (wShiftDB.ID > 0 || wShift.Name.Length < 1 || wShift.WorkDayID < 1)
							wErrorCode.set(MESException.Logic.Value);
					}
					if (wErrorCode.Result == 0)
						break;
					// Step02：增加或更新排班记录
					if (wShift.ID < 1) {
						wShift.Name = FMCShiftLevel.getEnumType(wShift.LevelID).getLable();

						wSQLText = StringUtils.Format("Insert Into {0}.fmc_shift", wInstance.Result)
								+ "(Name,WorkDayID,LevelID,StartTime,Minutes,WorkMinutes,IdleMinutes,EndTime,Active,CreatorID,CreateTime) "
								+ " Values(@Name,@WorkDayID,@LevelID,@StartTime,@Minutes,@WorkMinutes,@IdleMinutes,@EndTime,@Active,@CreatorID,@CreateTime);";
						wParms.Clear();

						wParms.Add("WorkDayID", wShift.WorkDayID);
						wParms.Add("LevelID", wShift.LevelID);
						wParms.Add("Name", wShift.Name);
						wParms.Add("StartTime", wShift.StartTime);
						wParms.Add("Minutes", wShift.Minutes);
						wParms.Add("WorkMinutes", wShift.WorkMinutes);
						wParms.Add("IdleMinutes", wShift.IdleMinutes);
						wParms.Add("EndTime", wShift.EndTime);
						wParms.Add("Active", wShift.Active);
						wParms.Add("CreatorID", wLoginID);
						wParms.Add("CreateTime", DateTime.Now);
						wSQLText = this.DMLChange(wSQLText);
						KeyHolder keyHolder = new GeneratedKeyHolder();

						SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
						mDBPool.update(wSQLText, wSqlParameterSource, keyHolder);

						wID = keyHolder.getKey().intValue();
						wShift.ID = wID;

					} else {
						wSQLText = StringUtils.Format("update {0}.fmc_shift", wInstance.Result)
								+ " set Name=@Name,WorkDayID=@WorkDayID,StartTime=@StartTime,Minutes=@Minutes,"
								+ " WorkMinutes=@WorkMinutes,IdleMinutes=@IdleMinutes,EndTime=@EndTime,Active=@Active,CreatorID=@CreatorID,CreateTime=@CreateTime where ID=@ID ";
						wParms.Clear();

						wParms.Add("WorkDayID", wShift.WorkDayID);
						wParms.Add("Name", wShift.Name);
						wParms.Add("StartTime", wShift.StartTime);
						wParms.Add("Minutes", wShift.Minutes);
						wParms.Add("WorkMinutes", wShift.WorkMinutes);
						wParms.Add("IdleMinutes", wShift.IdleMinutes);
						wParms.Add("EndTime", wShift.EndTime);
						wParms.Add("Active", wShift.Active);
						wParms.Add("CreatorID", wLoginID);
						wParms.Add("CreateTime", DateTime.Now);
						wParms.Add("ID", wShift.ID);
						wSQLText = this.DMLChange(wSQLText);
						mDBPool.update(wSQLText, wParms);

						wID = wShift.ID;
					}
				}
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_SaveShiftList", ex);
		}
		return wID;
	}

	public int FMC_SaveShift(int wCompanyID, int wLoginID, FMCShift wShift, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		int wID = 0;

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID,
					RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				FMCShift wShiftDB = this.FMC_CheckShift(wCompanyID, wLoginID, wShift, wErrorCode);
				if (wShiftDB.ID > 0 || wShift.Name.Length < 1 || wShift.WorkDayID < 1)
					wErrorCode.set(MESException.Logic.Value);
			}
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";
				// Step02：增加或更新排班记录
				if (wShift.ID < 1) {
					wShift.Name = FMCShiftLevel.getEnumType(wShift.LevelID).getLable();
					wSQLText = StringUtils.Format("Insert Into {0}.fmc_shift", wInstance.Result)
							+ "(Name,WorkDayID,LevelID,StartTime,Minutes,WorkMinutes,IdleMinutes,EndTime,Active,CreatorID,CreateTime) "
							+ " Values(@Name,@WorkDayID,@LevelID,@StartTime,@Minutes,@WorkMinutes,@IdleMinutes,@EndTime,@Active,@CreatorID,@CreateTime);";
					wParms.Clear();

					wParms.Add("WorkDayID", wShift.WorkDayID);
					wParms.Add("LevelID", wShift.LevelID);
					wParms.Add("Name", wShift.Name);
					wParms.Add("StartTime", wShift.StartTime);
					wParms.Add("Minutes", wShift.Minutes);
					wParms.Add("WorkMinutes", wShift.WorkMinutes);
					wParms.Add("IdleMinutes", wShift.IdleMinutes);
					wParms.Add("EndTime", wShift.EndTime);
					wParms.Add("Active", wShift.Active);
					wParms.Add("CreatorID", wLoginID);
					wParms.Add("CreateTime", DateTime.Now);
					wSQLText = this.DMLChange(wSQLText);
					KeyHolder keyHolder = new GeneratedKeyHolder();

					SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
					mDBPool.update(wSQLText, wSqlParameterSource, keyHolder);

					wID = keyHolder.getKey().intValue();
					wShift.ID = wID;
				} else {
					wSQLText = StringUtils.Format("update {0}.fmc_shift", wInstance.Result)
							+ " set Name=@Name,WorkDayID=@WorkDayID,LevelID=@LevelID,StartTime=@StartTime,Minutes=@Minutes,"
							+ " WorkMinutes=@WorkMinutes,IdleMinutes=@IdleMinutes,EndTime=@EndTime,Active=@Active,CreatorID=@CreatorID,CreateTime=@CreateTime where ID=@ID ";
					wParms.Clear();

					wParms.Add("WorkDayID", wShift.WorkDayID);
					wParms.Add("LevelID", wShift.LevelID);
					wParms.Add("Name", wShift.Name);
					wParms.Add("StartTime", wShift.StartTime);
					wParms.Add("Minutes", wShift.Minutes);
					wParms.Add("WorkMinutes", wShift.WorkMinutes);
					wParms.Add("IdleMinutes", wShift.IdleMinutes);
					wParms.Add("EndTime", wShift.EndTime);
					wParms.Add("Active", wShift.Active);
					wParms.Add("CreatorID", wLoginID);
					wParms.Add("CreateTime", DateTime.Now);
					wParms.Add("ID", wShift.ID);
					wSQLText = this.DMLChange(wSQLText);
					mDBPool.update(wSQLText, wParms);
					wID = wShift.ID;
				}
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_SaveShift", ex);
		}

		return wID;
	}

	public FMCShift FMC_QueryShiftByID(int wCompanyID, int wLoginID, int wID, OutResult<Int32> wErrorCode) {
		FMCShift wShiftDB = new FMCShift();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";
				wSQLText = StringUtils.Format("Select t.* from {0}.fmc_shift t ", wInstance.Result) + " where t.ID=@ID";
				wParms.Clear();
				wParms.Add("ID", wID);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					wShiftDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wShiftDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wShiftDB.WorkDayID = StringUtils.parseInt(wSqlDataReader["WorkDayID"]);
					wShiftDB.LevelID = StringUtils.parseInt(wSqlDataReader["LevelID"]);
					wShiftDB.StartTime = StringUtils.parseDate(wSqlDataReader["StartTime"]);
					wShiftDB.Minutes = StringUtils.parseInt(wSqlDataReader["Minutes"]);
					wShiftDB.WorkMinutes = StringUtils.parseInt(wSqlDataReader["WorkMinutes"]);

					wShiftDB.IdleMinutes = StringUtils.parseInt(wSqlDataReader["IdleMinutes"]);
					wShiftDB.EndTime = StringUtils.parseDate(wSqlDataReader["EndTime"]);
					wShiftDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wShiftDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wShiftDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);

				}

				if (wShiftDB.ID > 0) {
					// Step01：人员姓名

					wShiftDB.Creator = BFCConstants.GetBMSEmployeeName(
							wShiftDB.CreatorID);
					wShiftDB.IdleZoneList = this.FMC_LoadShiftTimeZoneList(wCompanyID, wShiftDB.ID, wErrorCode);
					wShiftDB.Name = FMCShiftLevel.getEnumType(wShiftDB.LevelID).getLable();
				}
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryShiftByID: Query DB",
					ex);
		}
		return wShiftDB;
	}

	public int FMC_DeleteShiftByID(int wCompanyID, int wLoginID, int wID, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				FMCShift wShiftDB = this.FMC_QueryShiftByID(wCompanyID, wLoginID, wID, wErrorCode);
				if (wErrorCode.Result == 0 && wShiftDB.ID > 0) {
					Dictionary<String, Object> wParms = new Dictionary<String, Object>();
					String wSQLText = "";

					wSQLText = StringUtils.Format("Delete t.* from {0}.fmc_shiftzonetime t ", wInstance.Result)
							+ " where t.ShiftID=@ShiftID";
					wParms.Clear();
					wParms.Add("ShiftID", wID);
					wSQLText = this.DMLChange(wSQLText);
					mDBPool.update(wSQLText, wParms);

					wSQLText = StringUtils.Format("Delete t.* from {0}.fmc_shift t ", wInstance.Result)
							+ " where t.ID=@ID";
					wParms.Clear();
					wParms.Add("ID", wID);
					wSQLText = this.DMLChange(wSQLText);
					mDBPool.update(wSQLText, wParms);
				}
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_DeleteShiftByID: Query DB",
					ex);

		}
		return wErrorCode.Result;
	}

	public List<FMCTimeZone> FMC_QueryShiftTimeZoneList(int wCompanyID, int wLoginID, int wShiftID,
			OutResult<Int32> wErrorCode) {
		List<FMCTimeZone> wTimeZoneList = new List<FMCTimeZone>();
		wErrorCode.set(0);

		try {
			wTimeZoneList = this.FMC_LoadShiftTimeZoneList(wCompanyID, wShiftID, wErrorCode);
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryShiftTimeZoneList", ex);
		}
		return wTimeZoneList;
	}

	public int FMC_SaveShiftTimeZoneList(int wCompanyID, int wLoginID, List<FMCTimeZone> wTimeZoneList, int wShiftID,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		int wID = 0;
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID,
					RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";
				for (FMCTimeZone wTimeZone : wTimeZoneList) {
					// Step02：增加或更新排班记录
					if (wTimeZone.ID < 1) {
						wSQLText = StringUtils.Format("Insert Into {0}.fmc_shiftzonetime", wInstance.Result)
								+ "(ShiftID,Name,StartTime,Minutes,IdleOrWork) "
								+ " Values(@ShiftID,@Name,@StartTime,@Minutes,@IdleOrWork);";
						wParms.Clear();

						wParms.Add("ShiftID", wTimeZone.ShiftID);
						wParms.Add("Name", wTimeZone.ZoneName);
						wParms.Add("StartTime", wTimeZone.StartTime);
						wParms.Add("Minutes", wTimeZone.Minutes);
						wParms.Add("IdleOrWork", wTimeZone.IdleOrWork ? 1 : 0);
						wSQLText = this.DMLChange(wSQLText);
						KeyHolder keyHolder = new GeneratedKeyHolder();

						SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
						mDBPool.update(wSQLText, wSqlParameterSource, keyHolder);

						wID = keyHolder.getKey().intValue();
						wTimeZone.ID = wID;
					} else {
						wSQLText = StringUtils.Format("update {0}.fmc_shiftzonetime", wInstance.Result)
								+ " set Name=@Name,StartTime=@StartTime,"
								+ " Minutes=@Minutes,IdleOrWork=@IdleOrWork where ID=@ID ";
						wParms.Clear();

						wParms.Add("ID", wTimeZone.ID);
						wParms.Add("Name", wTimeZone.ZoneName);
						wParms.Add("StartTime", wTimeZone.StartTime);
						wParms.Add("Minutes", wTimeZone.Minutes);
						wParms.Add("IdleOrWork", wTimeZone.IdleOrWork ? 1 : 0);
						wSQLText = this.DMLChange(wSQLText);
						mDBPool.update(wSQLText, wParms);

						wID = wTimeZone.ID;
					}
				}
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_SaveShiftTimeZoneList", ex);
		}
		return wID;
	}

	// 工作日历设置

	public List<FMCWorkDay> FMC_LoadWorkDayList(int wCompanyID, OutResult<Int32> wErrorCode) {
		List<FMCWorkDay> wWorkDayList = new List<FMCWorkDay>();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				String wSQLText = StringUtils.Format("Select * from {0}.fmc_workday t ", wInstance.Result);

				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Clear();
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					FMCWorkDay wWorkDayDB = new FMCWorkDay();
					wWorkDayDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wWorkDayDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wWorkDayDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);
					wWorkDayDB.StartTime = StringUtils.parseDate(wSqlDataReader["StartTime"]);
					wWorkDayDB.Minutes = StringUtils.parseInt(wSqlDataReader["Minutes"]);
					wWorkDayDB.WorkMinutes = StringUtils.parseInt(wSqlDataReader["WorkMinutes"]);
					wWorkDayDB.IdleMinutes = StringUtils.parseInt(wSqlDataReader["IdleMinutes"]);
					wWorkDayDB.EndTime = StringUtils.parseDate(wSqlDataReader["EndTime"]);

					wWorkDayDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wWorkDayDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wWorkDayDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wWorkDayDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wWorkDayDB.AuditTime = StringUtils.parseDate(wSqlDataReader["AuditTime"]);
					wWorkDayDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wWorkDayDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
					wWorkDayDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wWorkDayList.Add(wWorkDayDB);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_LoadWorkDayList", ex);
		}
		return wWorkDayList;
	}

	public FMCWorkDay FMC_LoadWorkDayByID(int wCompanyID, int wID, OutResult<Int32> wErrorCode) {
		FMCWorkDay wWorkDayDB = new FMCWorkDay();
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				if (wID > 0) {
					Dictionary<String, Object> wParms = new Dictionary<String, Object>();
					String wSQLText = "";

					wSQLText = StringUtils.Format("Select * from {0}.fmc_workday ", wInstance.Result)
							+ " where ID=@ID ";
					wParms.Clear();
					wParms.Add("ID", wID);
					wSQLText = this.DMLChange(wSQLText);
					List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
					for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
						wWorkDayDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
						wWorkDayDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
						wWorkDayDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);
						wWorkDayDB.StartTime = StringUtils.parseDate(wSqlDataReader["StartTime"]);
						wWorkDayDB.Minutes = StringUtils.parseInt(wSqlDataReader["Minutes"]);
						wWorkDayDB.WorkMinutes = StringUtils.parseInt(wSqlDataReader["WorkMinutes"]);
						wWorkDayDB.IdleMinutes = StringUtils.parseInt(wSqlDataReader["IdleMinutes"]);
						wWorkDayDB.EndTime = StringUtils.parseDate(wSqlDataReader["EndTime"]);

						wWorkDayDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
						wWorkDayDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
						wWorkDayDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
						wWorkDayDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
						wWorkDayDB.AuditTime = StringUtils.parseDate(wSqlDataReader["AuditTime"]);
						wWorkDayDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
						wWorkDayDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
						wWorkDayDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					}

					if (wWorkDayDB.ID > 0) {
						wWorkDayDB.ShiftList = this.FMC_QueryShiftListByWorkDayID(wCompanyID, wWorkDayDB.ID,
								wErrorCode);
						for (FMCShift wShift : wWorkDayDB.ShiftList) {
							wShift.IdleZoneList = this.FMC_LoadShiftTimeZoneList(wCompanyID, wShift.ID, wErrorCode);
						}
					}
				}
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryWorkDayByID", ex);
		}
		return wWorkDayDB;
	}

	private List<FMCShift> FMC_QueryShiftListByWorkDayID(int wCompanyID, int wWorkDayID,
			OutResult<Int32> wErrorCode) {
		List<FMCShift> wShiftList = new List<FMCShift>();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				String wSQLText = StringUtils.Format("Select t.* from {0}.fmc_shift t ", wInstance.Result)
						+ " where t.WorkDayID=@WorkDayID";

				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Clear();
				wParms.Add("WorkDayID", wWorkDayID);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					FMCShift wShiftDB = new FMCShift();
					wShiftDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wShiftDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wShiftDB.WorkDayID = StringUtils.parseInt(wSqlDataReader["WorkDayID"]);
					wShiftDB.LevelID = StringUtils.parseInt(wSqlDataReader["LevelID"]);
					wShiftDB.StartTime = StringUtils.parseDate(wSqlDataReader["StartTime"]);
					wShiftDB.Minutes = StringUtils.parseInt(wSqlDataReader["Minutes"]);
					wShiftDB.WorkMinutes = StringUtils.parseInt(wSqlDataReader["WorkMinutes"]);

					wShiftDB.IdleMinutes = StringUtils.parseInt(wSqlDataReader["IdleMinutes"]);
					wShiftDB.EndTime = StringUtils.parseDate(wSqlDataReader["EndTime"]);
					wShiftDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wShiftDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wShiftDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wShiftDB.Name = FMCShiftLevel.getEnumType(wShiftDB.LevelID).getLable();
					wShiftList.Add(wShiftDB);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryShiftList: Query DB",
					ex);
		}
		return wShiftList;
	}

	private List<FMCTimeZone> FMC_LoadShiftTimeZoneList(int wCompanyID, int wShiftID, OutResult<Int32> wErrorCode) {
		List<FMCTimeZone> wTimeZoneList = new List<FMCTimeZone>();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				String wSQLText = StringUtils.Format("Select t.* from {0}.fmc_shiftzonetime t ", wInstance.Result)
						+ " where t.ShiftID=@ShiftID";

				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Clear();
				wParms.Add("ShiftID", wShiftID);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					FMCTimeZone wTimeZoneDB = new FMCTimeZone();
					wTimeZoneDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wTimeZoneDB.ShiftID = StringUtils.parseInt(wSqlDataReader["ShiftID"]);
					wTimeZoneDB.ZoneName = StringUtils.parseString(wSqlDataReader["Name"]);
					wTimeZoneDB.StartTime = StringUtils.parseDate(wSqlDataReader["StartTime"]);
					wTimeZoneDB.Minutes = StringUtils.parseInt(wSqlDataReader["Minutes"]);
					wTimeZoneDB.IdleOrWork = StringUtils.parseBoolean(wSqlDataReader["IdleOrWork"]);
					wTimeZoneList.Add(wTimeZoneDB);
				}
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_LoadShiftTimeZoneList", ex);
		}
		return wTimeZoneList;
	}

	public String FMC_QueryShiftNameByID(int wCompanyID, int wID) {
		String wFactoryCode = "";
		try {
			wFactoryCode = FMCConstants.GetFMCWorkDayName(wID);
		} catch (Exception ex) {
			logger.Error("FMC_QueryShiftNameByID ", ex);
		}
		return wFactoryCode;
	}

}
