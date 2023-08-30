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
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.fmc.FMCLine;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.serviceimpl.utils.fmc.FMCConstants;
import com.mes.server.shristool.LoggerTool;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.service.utils.StringUtils;

public class FMCLineDAO extends BaseDAO {
	private static FMCLineDAO Instance = null;

	private FMCLineDAO() {
		super();
	}

	public static FMCLineDAO getInstance() {
		if (Instance == null)
			Instance = new FMCLineDAO();
		return Instance;
	}

	// 产线
	// 产线管理
	private FMCLine FMC_CheckLineByName(int wCompanyID, int wLoginID, FMCLine wLine, OutResult<Int32> wErrorCode) {
		FMCLine wLineDB = new FMCLine();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";
				if (wLine.ID > 0) {
					wSQLText = StringUtils.Format("Select * from {0}.fmc_line ", wInstance.Result)
							+ " where ID!=@ID and FactoryID=@FactoryID and BusinessUnitID=@BusinessUnitID and WorkShopID=@WorkShopID and Name=@Name";
					wParms.Clear();
					wParms.Add("ID", wLine.ID);
					wParms.Add("FactoryID", wLine.FactoryID);
					wParms.Add("BusinessUnitID", wLine.BusinessUnitID);
					wParms.Add("WorkShopID", wLine.WorkShopID);
					wParms.Add("Name", wLine.Name);
				} else {
					wSQLText = StringUtils.Format("Select * from {0}.fmc_line ", wInstance.Result)
							+ " where FactoryID=@FactoryID and BusinessUnitID=@BusinessUnitID and WorkShopID=@WorkShopID and Name=@Name ";
					wParms.Clear();
					wParms.Add("Name", wLine.Name);
					wParms.Add("FactoryID", wLine.FactoryID);
					wParms.Add("BusinessUnitID", wLine.BusinessUnitID);
					wParms.Add("WorkShopID", wLine.WorkShopID);
				}
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					wLineDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wLineDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wLineDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);
					wLineDB.BusinessUnitID = StringUtils.parseInt(wSqlDataReader["BusinessUnitID"]);
					wLineDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);

					wLineDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wLineDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wLineDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wLineDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wLineDB.AuditTime = StringUtils.parseDate(wSqlDataReader["AuditTime"]);
					wLineDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wLineDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
					wLineDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_CheckLineByName", ex);
		}
		return wLineDB;
	}

	public synchronized void FMC_AddLine(int wCompanyID, int wLoginID, FMCLine wLine, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {

			if (wLine == null || StringUtils.isEmpty(wLine.Name) || wLine.FactoryID < 1 || wLine.WorkShopID < 1) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 124001);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result != 0) {
				return;

			}
			FMCLine wLineDB = this.FMC_CheckLineByName(wCompanyID, wLoginID, wLine, wErrorCode);
			if (wLineDB.ID > 0) {
				wErrorCode.set(MESException.Duplication.Value);
				wLine.ID = wLineDB.ID;
				return;
			}

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("Insert Into {0}.fmc_line", wInstance.Result)
						+ "(Name,Code,PLMCode,FactoryID,BusinessUnitID,WorkShopID,CreatorID,EditorID,AuditorID,CreateTime,EditTime,AuditTime,Status,Active,ERPID,Mode,ShiftID) "
						+ " Values(@Name,@Code,@PLMCode,@FactoryID,@BusinessUnitID,@WorkShopID,@CreatorID,@EditorID,@AuditorID,@CreateTime,@EditTime,@AuditTime,@Status,@Active,@ERPID,@Mode,@ShiftID);";
				wParms.Clear();

				wParms.Add("Name", wLine.Name);
				wParms.Add("Code", wLine.Code);
				wParms.Add("PLMCode", wLine.PLMCode);
				wParms.Add("FactoryID", wLine.FactoryID);
				wParms.Add("BusinessUnitID", wLine.BusinessUnitID);
				wParms.Add("WorkShopID", wLine.WorkShopID);
				wParms.Add("CreatorID", wLoginID);
				wParms.Add("EditorID", wLoginID);
				wParms.Add("AuditorID", 0);

				wParms.Add("CreateTime", DateTime.Now);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("AuditTime", DateTime.Now);
				wParms.Add("Status", wLine.Status);
				wParms.Add("ERPID", wLine.ERPID);
				wParms.Add("Mode", wLine.Mode);
				wParms.Add("Active", wLine.Active);
				wParms.Add("ShiftID", wLine.ShiftID);

				wSQLText = this.DMLChange(wSQLText);
				KeyHolder keyHolder = new GeneratedKeyHolder();

				SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
				mDBPool.update(wSQLText, wSqlParameterSource, keyHolder);

				wLine.ID = keyHolder.getKey().intValue();

				FMCConstants.RestLineTime();
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_AddLine", ex);
		}
	}

	public synchronized void FMC_SaveLine(int wCompanyID, int wLoginID, FMCLine wLine, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			if (wLine == null || StringUtils.isEmpty(wLine.Name) || wLine.FactoryID < 1 || wLine.WorkShopID < 1) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 124001);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				return;
			}
			FMCLine wLineDB = this.FMC_CheckLineByName(wCompanyID, wLoginID, wLine, wErrorCode);
			if (wLineDB.ID > 0) {
				wErrorCode.set(MESException.Duplication.Value);
				return;
			}

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_line", wInstance.Result)
						+ " set Name=@Name,Code=@Code,PLMCode=@PLMCode,FactoryID=@FactoryID,BusinessUnitID=@BusinessUnitID,"
						+ "WorkShopID=@WorkShopID,EditorID=@EditorID,EditTime=@EditTime,Status=@Status,ShiftID=@ShiftID  where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wLine.ID);

				wParms.Add("Name", wLine.Name);
				wParms.Add("Code", wLine.Code);
				wParms.Add("PLMCode", wLine.PLMCode);
				wParms.Add("FactoryID", wLine.FactoryID);
				wParms.Add("BusinessUnitID", wLine.BusinessUnitID);
				wParms.Add("WorkShopID", wLine.WorkShopID);
				wParms.Add("EditorID", wLoginID);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("Status", wLine.Status);
				wParms.Add("ShiftID", wLine.ShiftID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);

				FMCConstants.RestLineTime();
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_SaveLine", ex);
		}

	}

	public int FMC_DisableLine(int wCompanyID, int wLoginID, FMCLine wLine, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 124002);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_line", wInstance.Result) + " set AuditorID=@AuditorID,"
						+ " AuditTime=@AuditTime,Active=2 where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wLine.ID);
				wParms.Add("AuditorID", wLoginID);
				wParms.Add("AuditTime", DateTime.Now);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_DisableLine", ex);
		}
		return wErrorCode.Result;
	}

	public int FMC_ActiveLine(int wCompanyID, int wLoginID, FMCLine wLine, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 124002);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_line", wInstance.Result) + " set AuditorID=@AuditorID,"
						+ " AuditTime=@AuditTime,Active=1 where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wLine.ID);

				wParms.Add("AuditorID", wLoginID);
				wParms.Add("AuditTime", DateTime.Now);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_ActiveLine", ex);
		}
		return wErrorCode.Result;
	}

	public int FMC_AuditLine(int wCompanyID, int wLoginID, FMCLine wLine, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			int wFunction = 124002;
			if (wLine.Status == (int)BPMStatus.Audited()) {
				wFunction = 124002;
			}
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, wFunction);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_line", wInstance.Result) + " set AuditorID=@AuditorID,"
						+ "AuditTime=@AuditTime,Status=@Status where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wLine.ID);

				wParms.Add("AuditorID", wLoginID);
				wParms.Add("AuditTime", DateTime.Now);
				wParms.Add("Status", wLine.Status);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);

			logger.Error("FMC_AuditLine", ex);
		}
		return wErrorCode.Result;
	}

	public FMCLine FMC_QueryLineByID(int wCompanyID, int wLoginID, int wID, OutResult<Int32> wErrorCode) {
		FMCLine wLineDB = new FMCLine();
		wErrorCode.set(0);
		try {
			// Step0:查询
			if (wID > 0) {
				// Step02：工厂与事业部

				wLineDB = this.FMC_QueryLineByID(wCompanyID, wID);
				if (wLineDB.ID > 0) {
					// Step01：人员姓名

					wLineDB.Creator = BFCConstants.GetBMSEmployeeName(wLineDB.CreatorID);
					wLineDB.Auditor = BFCConstants.GetBMSEmployeeName(wLineDB.AuditorID);
					wLineDB.Editor = BFCConstants.GetBMSEmployeeName(wLineDB.EditorID);

					wLineDB.Factory = FMCFactoryDAO.getInstance().FMC_QueryFactoryNameByID(wCompanyID,
							wLineDB.FactoryID);
					wLineDB.BusinessUnit = FMCFactoryDAO.getInstance().FMC_QueryBusinessUnitNameByID(wCompanyID,
							wLineDB.BusinessUnitID);
					wLineDB.WorkShop = FMCFactoryDAO.getInstance().FMC_QueryWorkShopNameByID(wCompanyID,
							wLineDB.WorkShopID);
					wLineDB.ShiftName = FMCShiftDAO.getInstance().FMC_QueryShiftNameByID(wCompanyID, wLineDB.ShiftID);
				}
			}
		} catch (Exception ex) {
			logger.Error("FMC_QueryLineByID", ex);
			wErrorCode.set(MESException.Exception.Value);
		}
		return wLineDB;
	}

	public FMCLine FMC_QueryLineByCode(int wCompanyID, int wLoginID, String wCode, OutResult<Int32> wErrorCode) {
		FMCLine wLineDB = new FMCLine();
		wErrorCode.set(0);
		try {
			// Step0:查询
			if (wCode.Length > 0) {
				// Step02：工厂与事业部
				for (FMCLine wItem : FMCConstants.GetFMCLineList().values()) {
					if (wItem.Code.equalsIgnoreCase(wCode)) {
						wLineDB = wItem;
						break;
					}
				}
				if (wLineDB.ID > 0) {
					// Step01：人员姓名

					wLineDB.Creator = BFCConstants.GetBMSEmployeeName(wLineDB.CreatorID);
					wLineDB.Auditor = BFCConstants.GetBMSEmployeeName(wLineDB.AuditorID);
					wLineDB.Editor = BFCConstants.GetBMSEmployeeName(wLineDB.EditorID);

					wLineDB.Factory = FMCFactoryDAO.getInstance().FMC_QueryFactoryNameByID(wCompanyID,
							wLineDB.FactoryID);
					wLineDB.BusinessUnit = FMCFactoryDAO.getInstance().FMC_QueryBusinessUnitNameByID(wCompanyID,
							wLineDB.BusinessUnitID);
					wLineDB.WorkShop = FMCFactoryDAO.getInstance().FMC_QueryWorkShopNameByID(wCompanyID,
							wLineDB.WorkShopID);
					wLineDB.ShiftName = FMCShiftDAO.getInstance().FMC_QueryShiftNameByID(wCompanyID, wLineDB.ShiftID);
				}
			}
		} catch (Exception ex) {
			logger.Error("FMC_QueryLineByCode", ex);
			wErrorCode.set(MESException.Exception.Value);
		}
		return wLineDB;
	}

	public List<FMCLine> FMC_QueryLineList(int wCompanyID, int wLoginID, int wBusinessUnitID, int wFactoryID,
			int wWorkShopID, boolean wLoad, OutResult<Int32> wErrorCode) {
		List<FMCLine> wLineList = new List<FMCLine>();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);
			wInstance.ErrorCode = wInstance.ErrorCode;
			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				String wCondition = "";
				if (wBusinessUnitID > 0)
					wCondition = StringUtils.Format(" where t.BusinessUnitID={0}", wBusinessUnitID);

				if (wFactoryID > 0) {
					if (wCondition.Length > 1)
						wCondition = StringUtils.Format(" {0} and t.FactoryID={1}", wCondition, wFactoryID);
					else
						wCondition = StringUtils.Format(" where t.FactoryID={0}", wFactoryID);
				}

				if (wWorkShopID > 0) {
					if (wCondition.Length > 1)
						wCondition = StringUtils.Format(" {0} and t.WorkShopID={1}", wCondition, wWorkShopID);
					else
						wCondition = StringUtils.Format(" where t.WorkShopID={0}", wWorkShopID);
				}
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("Select * from {0}.fmc_line t ", wInstance.Result) + wCondition;
				wParms.Clear();
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					FMCLine wLineDB = new FMCLine();
					wLineDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wLineDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wLineDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wLineDB.PLMCode = StringUtils.parseString(wSqlDataReader["PLMCode"]);
					wLineDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);
					wLineDB.BusinessUnitID = StringUtils.parseInt(wSqlDataReader["BusinessUnitID"]);
					wLineDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
					wLineDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wLineDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wLineDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wLineDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wLineDB.AuditTime = StringUtils.parseDate(wSqlDataReader["AuditTime"]);
					wLineDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wLineDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
					wLineDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wLineDB.ERPID = StringUtils.parseInt(wSqlDataReader["ERPID"]);
					wLineDB.Mode = StringUtils.parseInt(wSqlDataReader["Mode"]);
					wLineDB.ShiftID = StringUtils.parseInt(wSqlDataReader["ShiftID"]);
					wLineList.Add(wLineDB);
				}
				if (!wLoad)
					wLineList = this.FMC_SetLineTextList(wCompanyID, wLineList, wErrorCode);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryLineList: Query DB",
					ex);
		}
		return wLineList;
	}

	private List<FMCLine> FMC_SetLineTextList(int wCompanyID, List<FMCLine> wLineList, OutResult<Int32> wErrorCode) {
		List<FMCLine> wLineTextList = new List<FMCLine>();
		try {

			for (FMCLine wLineDB : wLineList) {
				wLineDB.Creator = BFCConstants.GetBMSEmployeeName(wLineDB.CreatorID);
				wLineDB.Auditor = BFCConstants.GetBMSEmployeeName(wLineDB.AuditorID);
				wLineDB.Editor = BFCConstants.GetBMSEmployeeName(wLineDB.EditorID);

				wLineDB.Factory = FMCFactoryDAO.getInstance().FMC_QueryFactoryNameByID(wCompanyID, wLineDB.FactoryID);
				wLineDB.BusinessUnit = FMCFactoryDAO.getInstance().FMC_QueryBusinessUnitNameByID(wCompanyID,
						wLineDB.BusinessUnitID);
				wLineDB.WorkShop = FMCFactoryDAO.getInstance().FMC_QueryWorkShopNameByID(wCompanyID,
						wLineDB.WorkShopID);

				wLineDB.FactoryCode = FMCFactoryDAO.getInstance().FMC_QueryFactoryCodeByID(wCompanyID,
						wLineDB.FactoryID);
				wLineDB.BusinessCode = FMCFactoryDAO.getInstance().FMC_QueryBusinessUnitCodeByID(wCompanyID,
						wLineDB.BusinessUnitID);
				wLineDB.WorkShopCode = FMCFactoryDAO.getInstance().FMC_QueryWorkShopNameByID(wCompanyID,
						wLineDB.WorkShopID);
				wLineDB.ShiftName = FMCShiftDAO.getInstance().FMC_QueryShiftNameByID(wCompanyID, wLineDB.ShiftID);
				wLineTextList.Add(wLineDB);
			}
		} catch (Exception ex) {
			logger.Error("FMC_SetLineTextList", ex);
		}
		return wLineTextList;
	}

	public FMCLine FMC_QueryLineByID(int wCompanyID, int wID) {
		FMCLine wLine = new FMCLine();
		try {
			wLine = FMCConstants.GetFMCLine(wID);
		} catch (Exception ex) {
			logger.Error("FMC_QueryLineByID ", ex);
		}
		return wLine;
	}

	public String FMC_QueryLineCodeByID(int wCompanyID, int wID) {
		String wLineCode = "ALL";
		try {
			wLineCode = FMCConstants.GetFMCLine(wID).getCode();
		} catch (Exception ex) {
			logger.Error("FMC_QueryLineCodeByID ", ex);
		}
		return wLineCode;
	}

	public String FMC_QueryLineNameByID(int wCompanyID, int wID) {
		String wLineName = "Share";
		try {
			wLineName = FMCConstants.GetFMCLineName(wID);

		} catch (Exception ex) {
			logger.Error("FMC_QueryLineNameByID ", ex);
		}
		return wLineName;
	}

	public List<FMCLine> FMC_LoadLineList(int wCompanyID, OutResult<Int32> wErrorCode) {
		List<FMCLine> wLineList = new List<FMCLine>();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				String wSQLText = StringUtils.Format("Select * from {0}.fmc_line t ", wInstance.Result);

				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Clear();
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					FMCLine wLineDB = new FMCLine();
					wLineDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wLineDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wLineDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wLineDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);
					wLineDB.BusinessUnitID = StringUtils.parseInt(wSqlDataReader["BusinessUnitID"]);
					wLineDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
					wLineDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wLineDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wLineDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wLineDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wLineDB.AuditTime = StringUtils.parseDate(wSqlDataReader["AuditTime"]);
					wLineDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wLineDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
					wLineDB.ERPID = StringUtils.parseInt(wSqlDataReader["ERPID"]);
					wLineDB.Mode = StringUtils.parseInt(wSqlDataReader["Mode"]);
					wLineDB.ShiftID = StringUtils.parseInt(wSqlDataReader["ShiftID"]);
					wLineList.Add(wLineDB);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_LoadLineList", ex);
		}
		return wLineList;
	}

}
