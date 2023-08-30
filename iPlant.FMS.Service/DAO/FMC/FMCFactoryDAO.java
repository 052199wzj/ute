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
import com.mes.server.service.po.fmc.FMCBusinessUnit;
import com.mes.server.service.po.fmc.FMCFactory;
import com.mes.server.service.po.fmc.FMCWorkShop;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.serviceimpl.utils.fmc.FMCConstants;
import com.mes.server.shristool.LoggerTool;
import com.mes.server.serviceimpl.dao.BaseDAO; 
import com.mes.server.serviceimpl.dao.crm.CRMRegionDAO;
import com.mes.server.service.utils.StringUtils;

public class FMCFactoryDAO extends BaseDAO {
	private static FMCFactoryDAO Instance = null;

	private FMCFactoryDAO() {
		super();
	}

	public static FMCFactoryDAO getInstance() {
		if (Instance == null)
			Instance = new FMCFactoryDAO();
		return Instance;
	}

	// 工厂&事业部&车间&产线&工位
	// 工厂
	private FMCFactory FMC_CheckFactoryByCode(int wCompanyID, int wLoginID, FMCFactory wFactory,
			OutResult<Int32> wErrorCode) {
		FMCFactory wFactoryDB = new FMCFactory();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";
				if (wFactory.ID > 0) {
					wSQLText = StringUtils.Format("Select * from {0}.fmc_factory ", wInstance.Result)
							+ " where ID!=@ID and Code=@Code";
					wParms.Clear();
					wParms.Add("ID", wFactory.ID);
					wParms.Add("Code", wFactory.Code);
				} else {
					wSQLText = StringUtils.Format("Select * from {0}.fmc_factory ", wInstance.Result)
							+ " where Code=@Code ";
					wParms.Clear();
					wParms.Add("Code", wFactory.Code);
				}
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					wFactoryDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wFactoryDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wFactoryDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wFactoryDB.CountryID = StringUtils.parseInt(wSqlDataReader["CountryID"]);
					wFactoryDB.ProvinceID = StringUtils.parseInt(wSqlDataReader["ProvinceID"]);
					wFactoryDB.CityID = StringUtils.parseInt(wSqlDataReader["CityID"]);

					wFactoryDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wFactoryDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wFactoryDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wFactoryDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wFactoryDB.AuditTime = StringUtils.parseDate(wSqlDataReader["AuditTime"]);
					wFactoryDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wFactoryDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_CheckFactoryByCode", ex);

		}
		return wFactoryDB;
	}

	public synchronized int FMC_AddFactory(int wCompanyID, int wLoginID, FMCFactory wFactory,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		int wID = 0;
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 122001);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				FMCFactory wFactoryDB = this.FMC_CheckFactoryByCode(wCompanyID, wLoginID, wFactory, wErrorCode);
				if (wFactoryDB.ID > 0)
					wErrorCode.set(MESException.Logic.Value);
			}
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("Insert Into {0}.fmc_factory", wInstance.Result)
						+ "(Name,Code,CreatorID,EditorID,AuditorID,CreateTime,EditTime,AuditTime,Status,Active,CountryID,ProvinceID,CityID,ShiftID) "
						+ " Values(@Name,@Code,@CreatorID,@EditorID,@AuditorID,@CreateTime,@EditTime,@AuditTime,@Status,@Active,@CountryID,@ProvinceID,@CityID,@ShiftID);";
				wParms.Clear();

				wParms.Add("Name", wFactory.Name);
				wParms.Add("Code", wFactory.Code);
				wParms.Add("CreatorID", wLoginID);
				wParms.Add("EditorID", 0);
				wParms.Add("AuditorID", 0);

				wParms.Add("CreateTime", DateTime.Now);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("AuditTime", DateTime.Now);
				wParms.Add("CountryID", wFactory.CountryID);
				wParms.Add("ProvinceID", wFactory.ProvinceID);

				wParms.Add("CityID", wFactory.CityID);
				wParms.Add("Status", wFactory.Status);
				wParms.Add("Active", wFactory.Active);
				wParms.Add("ShiftID", wFactory.ShiftID);
				wSQLText = this.DMLChange(wSQLText);
				KeyHolder keyHolder = new GeneratedKeyHolder();

				SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
				mDBPool.update(wSQLText, wSqlParameterSource, keyHolder);

				wID = keyHolder.getKey().intValue();
				wFactory.ID = wID;
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_AddFactory", ex);
		}
		return wID;
	}

	public synchronized int FMC_SaveFactory(int wCompanyID, int wLoginID, FMCFactory wFactory,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 122001);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				FMCFactory wFactoryDB = this.FMC_CheckFactoryByCode(wCompanyID, wLoginID, wFactory, wErrorCode);
				if (wFactoryDB.ID > 0)
					wErrorCode.set(MESException.Logic.Value);
			}
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_factory", wInstance.Result)
						+ " set Name=@Name,Code=@Code,EditorID=@EditorID,"
						+ "EditTime=@EditTime,CountryID=@CountryID,ProvinceID=@ProvinceID,CityID=@CityID,Status=@Status,ShiftID=@ShiftID where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wFactory.ID);

				wParms.Add("Name", wFactory.Name);
				wParms.Add("Code", wFactory.Code);
				wParms.Add("EditorID", wLoginID);
				wParms.Add("EditTime", DateTime.Now);

				wParms.Add("CountryID", wFactory.CountryID);
				wParms.Add("ProvinceID", wFactory.ProvinceID);
				wParms.Add("CityID", wFactory.CityID);
				wParms.Add("Status", wFactory.Status);
				wParms.Add("ShiftID", wFactory.ShiftID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);

			logger.Error("FMC_SaveFactory", ex);
		}
		return wErrorCode.Result;
	}

	public int FMC_DisableFactory(int wCompanyID, int wLoginID, FMCFactory wFactory, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 122002);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_factory", wInstance.Result) + " set AuditorID=@AuditorID,"
						+ " AuditTime=@AuditTime,Active=2 where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wFactory.ID);

				wParms.Add("AuditorID", wLoginID);
				wParms.Add("AuditTime", DateTime.Now);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);

			logger.Error("FMC_DisableFactory", ex);
		}
		return wErrorCode.Result;
	}

	public int FMC_ActiveFactory(int wCompanyID, int wLoginID, FMCFactory wFactory, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 122002);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_factory", wInstance.Result) + " set AuditorID=@AuditorID,"
						+ " AuditTime=@AuditTime,Active=1 where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wFactory.ID);

				wParms.Add("AuditorID", wLoginID);
				wParms.Add("AuditTime", DateTime.Now);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);

			logger.Error("FMC_ActiveFactory", ex);
		}
		return wErrorCode.Result;
	}

	public int FMC_AuditFactory(int wCompanyID, int wLoginID, FMCFactory wFactory, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			int wFunction = 122002;
			if (wFactory.Status == (int)BPMStatus.Audited()) {
				wFunction = 122002;
			}
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, wFunction);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_factory", wInstance.Result) + " set AuditorID=@AuditorID,"
						+ "AuditTime=@AuditTime,Status=@Status where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wFactory.ID);

				wParms.Add("AuditorID", wLoginID);
				wParms.Add("AuditTime", DateTime.Now);
				wParms.Add("Status", wFactory.Status);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);

			logger.Error("FMC_AuditFactory", ex);
		}
		return wErrorCode.Result;
	}

	public FMCFactory FMC_QueryFactoryByID(int wCompanyID, int wLoginID, int wID, OutResult<Int32> wErrorCode) {
		FMCFactory wFactoryDB = new FMCFactory();
		wErrorCode.set(0);
		try {
			// Step0:查询
			if (wID > 0) {
				wFactoryDB = FMCConstants.GetFMCFactory(wID);

				if (wFactoryDB.ID > 0) {

					wFactoryDB.Creator = BFCConstants.GetBMSEmployeeName(wFactoryDB.CreatorID);
					wFactoryDB.Auditor = BFCConstants.GetBMSEmployeeName(wFactoryDB.AuditorID);
					wFactoryDB.Editor = BFCConstants.GetBMSEmployeeName(wFactoryDB.EditorID);
					wFactoryDB.ShiftName = FMCShiftDAO.getInstance().FMC_QueryShiftNameByID(wCompanyID,
							wFactoryDB.ShiftID);

					wFactoryDB.Country = CRMRegionDAO.getInstance().RMS_QueryRegionNameByID(wCompanyID,
							wFactoryDB.CountryID);
					wFactoryDB.Province = CRMRegionDAO.getInstance().RMS_QueryRegionNameByID(wCompanyID,
							wFactoryDB.ProvinceID);
					wFactoryDB.City = CRMRegionDAO.getInstance().RMS_QueryRegionNameByID(wCompanyID, wFactoryDB.CityID);
				}
			}
		} catch (Exception ex) {
			logger.Error("FMC_QueryFactoryByID", ex);
			wErrorCode.set(MESException.Exception.Value);
		}
		return wFactoryDB;
	}

	public FMCFactory FMC_QueryFactoryByCode(int wCompanyID, int wLoginID, String wCode,
			OutResult<Int32> wErrorCode) {
		FMCFactory wFactoryDB = new FMCFactory();
		wErrorCode.set(0);
		try {
			for (FMCFactory wFactory : FMCConstants.GetFMCFactoryList().values()) {
				if (wFactory.Code.equalsIgnoreCase(wCode)) {
					wFactoryDB = wFactory;
					break;
				}
			}
			if (wFactoryDB.ID > 0) {

				wFactoryDB.Creator = BFCConstants.GetBMSEmployeeName(wFactoryDB.CreatorID);
				wFactoryDB.Auditor = BFCConstants.GetBMSEmployeeName(wFactoryDB.AuditorID);
				wFactoryDB.Editor = BFCConstants.GetBMSEmployeeName(wFactoryDB.EditorID);
				wFactoryDB.ShiftName = FMCShiftDAO.getInstance().FMC_QueryShiftNameByID(wCompanyID, wFactoryDB.ShiftID);

				wFactoryDB.Country = CRMRegionDAO.getInstance().RMS_QueryRegionNameByID(wCompanyID,
						wFactoryDB.CountryID);
				wFactoryDB.Province = CRMRegionDAO.getInstance().RMS_QueryRegionNameByID(wCompanyID,
						wFactoryDB.ProvinceID);
				wFactoryDB.City = CRMRegionDAO.getInstance().RMS_QueryRegionNameByID(wCompanyID, wFactoryDB.CityID);
			}
		} catch (Exception ex) {
			logger.Error("FMC_QueryFactoryByCode", ex);
			wErrorCode.set(MESException.Exception.Value);
		}
		return wFactoryDB;
	}

	public List<FMCFactory> FMC_QueryFactoryList(int wCompanyID, int wLoginID, boolean wLoad,
			OutResult<Int32> wErrorCode) {
		List<FMCFactory> wFactoryList = new List<FMCFactory>();
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("Select * from {0}.fmc_factory ", wInstance.Result);
				wParms.Clear();
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					FMCFactory wFactoryDB = new FMCFactory();
					wFactoryDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wFactoryDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wFactoryDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wFactoryDB.CountryID = StringUtils.parseInt(wSqlDataReader["CountryID"]);
					wFactoryDB.ProvinceID = StringUtils.parseInt(wSqlDataReader["ProvinceID"]);
					wFactoryDB.CityID = StringUtils.parseInt(wSqlDataReader["CityID"]);

					wFactoryDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wFactoryDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wFactoryDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wFactoryDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wFactoryDB.AuditTime = StringUtils.parseDate(wSqlDataReader["AuditTime"]);
					wFactoryDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wFactoryDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
					wFactoryDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wFactoryDB.ShiftID = StringUtils.parseInt(wSqlDataReader["ShiftID"]);
					wFactoryList.Add(wFactoryDB);
				}
				if (!wLoad)
					wFactoryList = this.FMC_SetFactoryTextList(wCompanyID, wFactoryList, wErrorCode);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryFactoryList,Query DB",
					ex);
		}
		return wFactoryList;
	}

	private List<FMCFactory> FMC_SetFactoryTextList(int wCompanyID, List<FMCFactory> wFactoryList,
			OutResult<Int32> wErrorCode) {
		List<FMCFactory> wFactoryTextList = new List<FMCFactory>();
		try {

			for (FMCFactory wFactoryDB : wFactoryList) {
				wFactoryDB.Creator = BFCConstants.GetBMSEmployeeName(wFactoryDB.CreatorID);
				wFactoryDB.Auditor = BFCConstants.GetBMSEmployeeName(wFactoryDB.AuditorID);
				wFactoryDB.Editor = BFCConstants.GetBMSEmployeeName(wFactoryDB.EditorID);
				wFactoryDB.ShiftName = FMCShiftDAO.getInstance().FMC_QueryShiftNameByID(wCompanyID, wFactoryDB.ShiftID);

				wFactoryDB.Country = CRMRegionDAO.getInstance().RMS_QueryRegionNameByID(wCompanyID,
						wFactoryDB.CountryID);
				wFactoryDB.Province = CRMRegionDAO.getInstance().RMS_QueryRegionNameByID(wCompanyID,
						wFactoryDB.ProvinceID);
				wFactoryDB.City = CRMRegionDAO.getInstance().RMS_QueryRegionNameByID(wCompanyID, wFactoryDB.CityID);
				wFactoryTextList.Add(wFactoryDB);
			}
		} catch (Exception ex) {
			logger.Error("FMC_SetFactoryTextList", ex);
		}
		return wFactoryTextList;
	}

	// 事业部
	private FMCBusinessUnit FMC_CheckBusinessUnitByCode(int wCompanyID, int wLoginID, FMCBusinessUnit wFactory,
			OutResult<Int32> wErrorCode) {
		FMCBusinessUnit wBusinessUnitDB = new FMCBusinessUnit();
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";
				if (wFactory.ID > 0) {
					wSQLText = StringUtils.Format("Select * from {0}.fmc_businessunit ", wInstance.Result)
							+ " where ID!=@ID and Code=@Code";
					wParms.Clear();
					wParms.Add("ID", wFactory.ID);
					wParms.Add("Code", wFactory.Code);
				} else {
					wSQLText = StringUtils.Format("Select * from {0}.fmc_businessunit ", wInstance.Result)
							+ " where Code=@Code ";
					wParms.Clear();
					wParms.Add("Code", wFactory.Code);
				}
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					wBusinessUnitDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wBusinessUnitDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wBusinessUnitDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);

					wBusinessUnitDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wBusinessUnitDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wBusinessUnitDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wBusinessUnitDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wBusinessUnitDB.AuditTime = StringUtils.parseDate(wSqlDataReader["AuditTime"]);
					wBusinessUnitDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wBusinessUnitDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_CheckBusinessUnitByCode",
					ex);
		}
		return wBusinessUnitDB;
	}

	public int FMC_AddBusinessUnit(int wCompanyID, int wLoginID, FMCBusinessUnit wBusinessUnit,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		int wID = 0;
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 121001);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				FMCBusinessUnit wFactoryDB = this.FMC_CheckBusinessUnitByCode(wCompanyID, wLoginID, wBusinessUnit,
						wErrorCode);
				if (wFactoryDB.ID > 0)
					wErrorCode.set(MESException.Logic.Value);
			}
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("Insert Into {0}.fmc_businessunit", wInstance.Result)
						+ "(Name,Code,CreatorID,EditorID,AuditorID,CreateTime,EditTime,AuditTime,Status,Active,ShiftID) "
						+ " Values(@Name,@Code,@CreatorID,@EditorID,@AuditorID,@CreateTime,@EditTime,@AuditTime,@Status,@Active,@ShiftID);";
				wParms.Clear();

				wParms.Add("Name", wBusinessUnit.Name);
				wParms.Add("Code", wBusinessUnit.Code);
				wParms.Add("CreatorID", wLoginID);
				wParms.Add("EditorID", 0);
				wParms.Add("AuditorID", 0);

				wParms.Add("CreateTime", DateTime.Now);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("AuditTime", DateTime.Now);
				wParms.Add("Status", wBusinessUnit.Status);
				wParms.Add("Active", wBusinessUnit.Active);
				wParms.Add("ShiftID", wBusinessUnit.ShiftID);
				wSQLText = this.DMLChange(wSQLText);
				KeyHolder keyHolder = new GeneratedKeyHolder();

				SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
				mDBPool.update(wSQLText, wSqlParameterSource, keyHolder);

				wID = keyHolder.getKey().intValue();
				wBusinessUnit.ID = wID;
				// this.FMC_LoadFactoyEntry(wCompanyID, wErrorCode);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_AddBusinessUnit", ex);
		}
		return wID;
	}

	public int FMC_SaveBusinessUnit(int wCompanyID, int wLoginID, FMCBusinessUnit wBusinessUnit,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 121001);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				FMCBusinessUnit wFactoryDB = this.FMC_CheckBusinessUnitByCode(wCompanyID, wLoginID, wBusinessUnit,
						wErrorCode);
				if (wFactoryDB.ID > 0)
					wErrorCode.set(MESException.Logic.Value);
			}
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_businessunit", wInstance.Result)
						+ " set Name=@Name,Code=@Code,"
						+ "EditorID=@EditorID,EditTime=@EditTime,Status=@Status,ShiftID=@ShiftID where ID=@ID  ";
				wParms.Clear();

				wParms.Add("ID", wBusinessUnit.ID);

				wParms.Add("Name", wBusinessUnit.Name);
				wParms.Add("Code", wBusinessUnit.Code);
				wParms.Add("EditorID", wLoginID);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("Status", wBusinessUnit.Status);
				wParms.Add("ShiftID", wBusinessUnit.ShiftID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
				// this.FMC_LoadFactoyEntry(wCompanyID, wErrorCode);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_SaveBusinessUnit", ex);
		}
		return wErrorCode.Result;
	}

	public int FMC_DisableBusinessUnit(int wCompanyID, int wLoginID, FMCBusinessUnit wBusinessUnit,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 121002);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_businessunit", wInstance.Result)
						+ " set AuditorID=@AuditorID," + " AuditTime=@AuditTime,Active=2 where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wBusinessUnit.ID);

				wParms.Add("AuditorID", wLoginID);
				wParms.Add("AuditTime", DateTime.Now);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_DisableFactory", ex);
		}
		return wErrorCode.Result;
	}

	public int FMC_ActiveBusinessUnit(int wCompanyID, int wLoginID, FMCBusinessUnit wBusinessUnit,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 121002);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_businessunit", wInstance.Result)
						+ " set AuditorID=@AuditorID," + " AuditTime=@AuditTime,Active=1 where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wBusinessUnit.ID);

				wParms.Add("AuditorID", wLoginID);
				wParms.Add("AuditTime", DateTime.Now);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_ActiveFactory", ex);
		}
		return wErrorCode.Result;
	}

	public int FMC_AuditBusinessUnit(int wCompanyID, int wLoginID, FMCBusinessUnit wBusinessUnit,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {

			int wFunction = 121002;
			if (wBusinessUnit.Status == (int)BPMStatus.Audited()) {
				wFunction = 121002;
			}
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, wFunction);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_businessunit", wInstance.Result)
						+ " set AuditorID=@AuditorID," + "AuditTime=@AuditTime,Status=@Status where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wBusinessUnit.ID);

				wParms.Add("AuditorID", wLoginID);
				wParms.Add("AuditTime", DateTime.Now);
				wParms.Add("Status", wBusinessUnit.Status);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_AuditBusinessUnit", ex);
		}
		return wErrorCode.Result;
	}

	public FMCBusinessUnit FMC_QueryBusinessUnitByID(int wCompanyID, int wLoginID, int wID,
			OutResult<Int32> wErrorCode) {
		FMCBusinessUnit wBusinessUnitDB = new FMCBusinessUnit();
		wErrorCode.set(0);
		try {

			// Step0:查询
			if (wID > 0) {

				wBusinessUnitDB = FMCConstants.GetFMCBusinessUnit(wID);

				if (wBusinessUnitDB.ID > 0) {

					wBusinessUnitDB.Creator = BFCConstants.GetBMSEmployeeName(wBusinessUnitDB.CreatorID);
					wBusinessUnitDB.Auditor = BFCConstants.GetBMSEmployeeName(wBusinessUnitDB.AuditorID);
					wBusinessUnitDB.Editor = BFCConstants.GetBMSEmployeeName(wBusinessUnitDB.EditorID);
					wBusinessUnitDB.ShiftName = FMCShiftDAO.getInstance().FMC_QueryShiftNameByID(wCompanyID,
							wBusinessUnitDB.ShiftID);
				}
			}
		} catch (Exception ex) {
			logger.Error("FMC_QueryFactoryByID", ex);
			wErrorCode.set(MESException.Exception.Value);
		}
		return wBusinessUnitDB;
	}

	public FMCBusinessUnit FMC_QueryBusinessUnitByCode(int wCompanyID, int wLoginID, String wCode,
			OutResult<Int32> wErrorCode) {
		FMCBusinessUnit wBusinessUnitDB = new FMCBusinessUnit();
		wErrorCode.set(0);
		try {
			// Step0:查询
			if (wCode.Length > 0) {
				for (FMCBusinessUnit wBusinessUnit : FMCConstants.GetFMCBusinessUnitList().values()) {
					if (wBusinessUnit.Code.equalsIgnoreCase(wCode)) {
						wBusinessUnitDB = wBusinessUnit;
						break;
					}
				}
				if (wBusinessUnitDB.ID > 0) {

					wBusinessUnitDB.Creator = BFCConstants.GetBMSEmployeeName(wBusinessUnitDB.CreatorID);
					wBusinessUnitDB.Auditor = BFCConstants.GetBMSEmployeeName(wBusinessUnitDB.AuditorID);
					wBusinessUnitDB.Editor = BFCConstants.GetBMSEmployeeName(wBusinessUnitDB.EditorID);
					wBusinessUnitDB.ShiftName = FMCShiftDAO.getInstance().FMC_QueryShiftNameByID(wCompanyID,
							wBusinessUnitDB.ShiftID);
				}
			}
		} catch (Exception ex) {
			logger.Error("FMC_QueryBusinessUnitByCode",
					ex);
			wErrorCode.set(MESException.Exception.Value);
		}
		return wBusinessUnitDB;
	}

	public List<FMCBusinessUnit> FMC_QueryBusinessUnitList(int wCompanyID, int wLoginID, boolean wLoad,
			OutResult<Int32> wErrorCode) {
		List<FMCBusinessUnit> wBusinessUnitList = new List<FMCBusinessUnit>();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("Select * from {0}.fmc_businessunit ", wInstance.Result);
				wParms.Clear();
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					FMCBusinessUnit wBusinessUnitDB = new FMCBusinessUnit();
					wBusinessUnitDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wBusinessUnitDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wBusinessUnitDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);

					wBusinessUnitDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wBusinessUnitDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wBusinessUnitDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wBusinessUnitDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wBusinessUnitDB.AuditTime = StringUtils.parseDate(wSqlDataReader["AuditTime"]);
					wBusinessUnitDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wBusinessUnitDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
					wBusinessUnitDB.Active = StringUtils.parseBoolean(wSqlDataReader["Active"]);
					wBusinessUnitDB.ShiftID = StringUtils.parseInt(wSqlDataReader["ShiftID"]);
					wBusinessUnitList.Add(wBusinessUnitDB);
				}
				if (!wLoad)
					wBusinessUnitList = this.FMC_SetBusinessUnitTextList(wCompanyID, wBusinessUnitList, wErrorCode);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryBusinessUnitList", ex);

		}
		return wBusinessUnitList;
	}

	private List<FMCBusinessUnit> FMC_SetBusinessUnitTextList(int wCompanyID, List<FMCBusinessUnit> wBusinessUnitList,
			OutResult<Int32> wErrorCode) {
		List<FMCBusinessUnit> wBusinessUnitTextList = new List<FMCBusinessUnit>();
		try {

			for (FMCBusinessUnit wBusinessUnitDB : wBusinessUnitList) {
				wBusinessUnitDB.Creator = BFCConstants.GetBMSEmployeeName(wBusinessUnitDB.CreatorID);
				wBusinessUnitDB.Auditor = BFCConstants.GetBMSEmployeeName(wBusinessUnitDB.AuditorID);
				wBusinessUnitDB.Editor = BFCConstants.GetBMSEmployeeName(wBusinessUnitDB.EditorID);
				wBusinessUnitDB.ShiftName = FMCShiftDAO.getInstance().FMC_QueryShiftNameByID(wCompanyID,
						wBusinessUnitDB.ShiftID);
				wBusinessUnitTextList.Add(wBusinessUnitDB);
			}
		} catch (Exception ex) {
			logger.Error("FMC_SetTextOfBusinessUnitList",
					ex);
		}
		return wBusinessUnitTextList;
	}

	// 车间
	private FMCWorkShop FMC_CheckWorkShopByName(int wCompanyID, int wLoginID, FMCWorkShop wWorkShop,
			OutResult<Int32> wErrorCode) {
		FMCWorkShop wWorkShopDB = new FMCWorkShop();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";
				if (wWorkShop.ID > 0) {
					wSQLText = StringUtils.Format("Select * from {0}.fmc_workshop ", wInstance.Result)
							+ " where ID!=@ID and FactoryID=@FactoryID and BusinessUnitID=@BusinessUnitID and Name=@Name";
					wParms.Clear();
					wParms.Add("ID", wWorkShop.ID);
					wParms.Add("FactoryID", wWorkShop.FactoryID);
					wParms.Add("BusinessUnitID", wWorkShop.BusinessUnitID);
					wParms.Add("Name", wWorkShop.Name);
				} else {
					wSQLText = StringUtils.Format("Select * from {0}.fmc_workshop ", wInstance.Result)
							+ " where Name=@Name and FactoryID=@FactoryID and BusinessUnitID=@BusinessUnitID";
					wParms.Clear();
					wParms.Add("Name", wWorkShop.Name);
					wParms.Add("FactoryID", wWorkShop.FactoryID);
					wParms.Add("BusinessUnitID", wWorkShop.BusinessUnitID);
				}
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					wWorkShopDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wWorkShopDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wWorkShopDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);
					wWorkShopDB.BusinessUnitID = StringUtils.parseInt(wSqlDataReader["BusinessUnitID"]);

					wWorkShopDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wWorkShopDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wWorkShopDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wWorkShopDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wWorkShopDB.AuditTime = StringUtils.parseDate(wSqlDataReader["AuditTime"]);
					wWorkShopDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wWorkShopDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
					wWorkShopDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_CheckWorkShopByName", ex);
		}
		return wWorkShopDB;
	}

	public int FMC_AddWorkShop(int wCompanyID, int wLoginID, FMCWorkShop wWorkShop, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		int wID = 0;
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 123001);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				FMCWorkShop wWorkShopDB = this.FMC_CheckWorkShopByName(wCompanyID, wLoginID, wWorkShop, wErrorCode);
				if (wWorkShopDB.ID > 0 || wWorkShop.Name.Length < 1)
					wErrorCode.set(MESException.Logic.Value);
			}
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("Insert Into {0}.fmc_workshop", wInstance.Result)
						+ "(Name,Code,FactoryID,BusinessUnitID,CreatorID,EditorID,AuditorID,CreateTime,EditTime,AuditTime,Status,Active,ShiftID,IPTModuleID,SCPeriod) "
						+ " Values(@Name,@Code,@FactoryID,@BusinessUnitID,@CreatorID,@EditorID,@AuditorID,@CreateTime,@EditTime,@AuditTime,@Status,@Active,@ShiftID,@IPTModuleID,@SCPeriod);";
				wParms.Clear();

				wParms.Add("Name", wWorkShop.Name);
				wParms.Add("Code", wWorkShop.Code);
				wParms.Add("FactoryID", wWorkShop.FactoryID);
				wParms.Add("BusinessUnitID", wWorkShop.BusinessUnitID);
				wParms.Add("CreatorID", wLoginID);
				wParms.Add("EditorID", 0);
				wParms.Add("AuditorID", 0);

				wParms.Add("CreateTime", DateTime.Now);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("AuditTime", DateTime.Now);
				wParms.Add("Status", wWorkShop.Status);
				wParms.Add("Active", wWorkShop.Active);
				wParms.Add("ShiftID", wWorkShop.ShiftID);
				wParms.Add("IPTModuleID", wWorkShop.IPTModuleID);
				wParms.Add("SCPeriod", wWorkShop.SCPeriod);
				wSQLText = this.DMLChange(wSQLText);
				KeyHolder keyHolder = new GeneratedKeyHolder();

				SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
				mDBPool.update(wSQLText, wSqlParameterSource, keyHolder);

				wID = keyHolder.getKey().intValue();
				wWorkShop.ID = wID;
				// this.FMC_LoadFactoyEntry(wCompanyID, wErrorCode);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_AddWorkShop", ex);
		}
		return wID;
	}

	public int FMC_SaveWorkShop(int wCompanyID, int wLoginID, FMCWorkShop wWorkShop, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 123001);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				FMCWorkShop wWorkShopDB = this.FMC_CheckWorkShopByName(wCompanyID, wLoginID, wWorkShop, wErrorCode);
				if (wWorkShopDB.ID > 0 || wWorkShop.Name.Length < 1)
					wErrorCode.set(MESException.Logic.Value);
			}
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_workshop", wInstance.Result)
						+ " set Name=@Name,Code=@Code,FactoryID=@FactoryID,BusinessUnitID=@BusinessUnitID,EditorID=@EditorID,"
						+ "EditTime=@EditTime,Status=@Status,ShiftID=@ShiftID,IPTModuleID=@IPTModuleID,SCPeriod=@SCPeriod  where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wWorkShop.ID);

				wParms.Add("Name", wWorkShop.Name);
				wParms.Add("Code", wWorkShop.Code);
				wParms.Add("FactoryID", wWorkShop.FactoryID);
				wParms.Add("BusinessUnitID", wWorkShop.BusinessUnitID);
				wParms.Add("EditorID", wLoginID);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("Status", wWorkShop.Status);
				wParms.Add("ShiftID", wWorkShop.ShiftID);
				wParms.Add("IPTModuleID", wWorkShop.IPTModuleID);
				wParms.Add("SCPeriod", wWorkShop.SCPeriod);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
				// this.FMC_LoadFactoyEntry(wCompanyID, wErrorCode);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_SaveWorkShop", ex);
		}
		return wErrorCode.Result;
	}

	public int FMC_DisableWorkShop(int wCompanyID, int wLoginID, FMCWorkShop wWorkShop, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 123002);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_workshop", wInstance.Result)
						+ " set AuditorID=@AuditorID," + " AuditTime=@AuditTime,Active=2 where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wWorkShop.ID);

				wParms.Add("AuditorID", wLoginID);
				wParms.Add("AuditTime", DateTime.Now);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
				// this.FMC_LoadFactoyEntry(wCompanyID, wErrorCode);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_DisableWorkShop", ex);
		}
		return wErrorCode.Result;
	}

	public int FMC_ActiveWorkShop(int wCompanyID, int wLoginID, FMCWorkShop wWorkShop, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 123002);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_workshop", wInstance.Result)
						+ " set AuditorID=@AuditorID," + " AuditTime=@AuditTime,Active=1 where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wWorkShop.ID);

				wParms.Add("AuditorID", wLoginID);
				wParms.Add("AuditTime", DateTime.Now);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_ActiveWorkShop", ex);
		}
		return wErrorCode.Result;
	}

	public int FMC_AuditWorkShop(int wCompanyID, int wLoginID, FMCWorkShop wWorkShop, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			int wFunction = 123002;
			if (wWorkShop.Status == (int)BPMStatus.Audited()) {
				wFunction = 123002;
			}
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, wFunction);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_workshop", wInstance.Result)
						+ " set AuditorID=@AuditorID," + "AuditTime=@AuditTime,Status=@Status where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wWorkShop.ID);

				wParms.Add("AuditorID", wLoginID);
				wParms.Add("AuditTime", DateTime.Now);
				wParms.Add("Status", wWorkShop.Status);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_AuditWorkShop", ex);
		}
		return wErrorCode.Result;
	}

	public FMCWorkShop FMC_QueryWorkShopByID(int wCompanyID, int wLoginID, int wID, OutResult<Int32> wErrorCode) {
		FMCWorkShop wWorkShopDB = new FMCWorkShop();
		wErrorCode.set(0);
		try {
			// Step0:查询
			if (wID > 0) {

				wWorkShopDB = this.FMC_QueryWorkShopByID(wCompanyID, wID);

				if (wWorkShopDB.ID > 0) {
					// Step01：人员姓名

					wWorkShopDB.Creator = BFCConstants.GetBMSEmployeeName(wWorkShopDB.CreatorID);
					wWorkShopDB.Auditor = BFCConstants.GetBMSEmployeeName(wWorkShopDB.AuditorID);
					wWorkShopDB.Editor = BFCConstants.GetBMSEmployeeName(wWorkShopDB.EditorID);

					wWorkShopDB.Factory = this.FMC_QueryFactoryNameByID(wCompanyID, wWorkShopDB.FactoryID);
					wWorkShopDB.BusinessUnit = this.FMC_QueryBusinessUnitNameByID(wCompanyID,
							wWorkShopDB.BusinessUnitID);
					wWorkShopDB.FactoryCode = this.FMC_QueryFactoryNameByID(wCompanyID, wWorkShopDB.FactoryID);
					wWorkShopDB.BusinessCode = this.FMC_QueryBusinessUnitNameByID(wCompanyID,
							wWorkShopDB.BusinessUnitID);
					wWorkShopDB.ShiftName = FMCShiftDAO.getInstance().FMC_QueryShiftNameByID(wCompanyID,
							wWorkShopDB.ShiftID);
				}
			}
		} catch (Exception ex) {
			logger.Error("FMC_QueryWorkShopByID", ex);
			wErrorCode.set(MESException.Exception.Value);
		}
		return wWorkShopDB;
	}

	public FMCWorkShop FMC_QueryWorkShopByCode(int wCompanyID, int wLoginID, String wCode,
			OutResult<Int32> wErrorCode) {
		FMCWorkShop wWorkShopDB = new FMCWorkShop();
		wErrorCode.set(0);
		try {
			// Step0:查询
			if (wCode.Length > 0) {
				for (FMCWorkShop wItem : FMCConstants.GetFMCWorkShopList().values()) {
					if (wItem.Code.equalsIgnoreCase(wCode)) {
						wWorkShopDB = wItem;
						break;
					}
				}

				if (wWorkShopDB.ID > 0) {
					// Step01：人员姓名

					wWorkShopDB.Creator = BFCConstants.GetBMSEmployeeName(wWorkShopDB.CreatorID);
					wWorkShopDB.Auditor = BFCConstants.GetBMSEmployeeName(wWorkShopDB.AuditorID);
					wWorkShopDB.Editor = BFCConstants.GetBMSEmployeeName(wWorkShopDB.EditorID);

					wWorkShopDB.Factory = this.FMC_QueryFactoryNameByID(wCompanyID, wWorkShopDB.FactoryID);
					wWorkShopDB.BusinessUnit = this.FMC_QueryBusinessUnitNameByID(wCompanyID,
							wWorkShopDB.BusinessUnitID);
					wWorkShopDB.FactoryCode = this.FMC_QueryFactoryNameByID(wCompanyID, wWorkShopDB.FactoryID);
					wWorkShopDB.BusinessCode = this.FMC_QueryBusinessUnitNameByID(wCompanyID,
							wWorkShopDB.BusinessUnitID);
					wWorkShopDB.ShiftName = FMCShiftDAO.getInstance().FMC_QueryShiftNameByID(wCompanyID,
							wWorkShopDB.ShiftID);
				}
			}
		} catch (Exception ex) {
			logger.Error("FMC_QueryWorkShopByCode", ex);
			wErrorCode.set(MESException.Exception.Value);
		}
		return wWorkShopDB;
	}

	public List<FMCWorkShop> FMC_QueryWorkShopList(int wCompanyID, int wLoginID, int wFactoryID, int wBusinessUnitID,
			boolean wLoad, OutResult<Int32> wErrorCode) {
		List<FMCWorkShop> wWorkShopList = new List<FMCWorkShop>();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				String wCondition = "";
				if (wFactoryID > 0)
					wCondition = StringUtils.Format(" where t.FactoryID={0}", wFactoryID);

				if (wBusinessUnitID > 0) {
					if (wCondition.Length > 0)
						wCondition = StringUtils.Format(" {0} and t.BusinessUnitID={0}", wBusinessUnitID);
					else
						wCondition = StringUtils.Format(" where t.BusinessUnitID={0}", wBusinessUnitID);
				}
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("Select * from {0}.fmc_workshop t", wInstance.Result) + wCondition;
				wParms.Clear();
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					FMCWorkShop wWorkShopDB = new FMCWorkShop();
					wWorkShopDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wWorkShopDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wWorkShopDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wWorkShopDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);
					wWorkShopDB.BusinessUnitID = StringUtils.parseInt(wSqlDataReader["BusinessUnitID"]);

					wWorkShopDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wWorkShopDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wWorkShopDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wWorkShopDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wWorkShopDB.AuditTime = StringUtils.parseDate(wSqlDataReader["AuditTime"]);
					wWorkShopDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wWorkShopDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
					wWorkShopDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wWorkShopDB.ShiftID = StringUtils.parseInt(wSqlDataReader["ShiftID"]);
					wWorkShopDB.IPTModuleID = StringUtils.parseInt(wSqlDataReader["IPTModuleID"]);
					wWorkShopDB.SCPeriod = StringUtils.parseInt(wSqlDataReader["SCPeriod"]);
					wWorkShopList.Add(wWorkShopDB);
				}
				if (!wLoad)
					wWorkShopList = this.FMC_SetWorkShopTextList(wCompanyID, wWorkShopList, wErrorCode);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryWorkShopList", ex);

		}
		return wWorkShopList;
	}

	private List<FMCWorkShop> FMC_SetWorkShopTextList(int wCompanyID, List<FMCWorkShop> wBusinessUnitList,
			OutResult<Int32> wErrorCode) {
		List<FMCWorkShop> wWorkShopTextList = new List<FMCWorkShop>();
		try {
			// Step01：人员姓名

			for (FMCWorkShop wWorkShopDB : wBusinessUnitList) {
				wWorkShopDB.Creator = BFCConstants.GetBMSEmployeeName(wWorkShopDB.CreatorID);
				wWorkShopDB.Auditor = BFCConstants.GetBMSEmployeeName(wWorkShopDB.AuditorID);
				wWorkShopDB.Editor = BFCConstants.GetBMSEmployeeName(wWorkShopDB.EditorID);
			}
			// Step02：工厂与事业部
			for (FMCWorkShop wWorkShopDB : wBusinessUnitList) {
				wWorkShopDB.Factory = this.FMC_QueryFactoryNameByID(wCompanyID, wWorkShopDB.FactoryID);
				wWorkShopDB.BusinessUnit = this.FMC_QueryBusinessUnitNameByID(wCompanyID, wWorkShopDB.BusinessUnitID);
				wWorkShopDB.FactoryCode = this.FMC_QueryFactoryNameByID(wCompanyID, wWorkShopDB.FactoryID);
				wWorkShopDB.BusinessCode = this.FMC_QueryBusinessUnitNameByID(wCompanyID, wWorkShopDB.BusinessUnitID);
				wWorkShopDB.ShiftName = FMCShiftDAO.getInstance().FMC_QueryShiftNameByID(wCompanyID,
						wWorkShopDB.ShiftID);
				wWorkShopTextList.Add(wWorkShopDB);
			}
		} catch (Exception ex) {
			logger.Error("FMC_SetWorkShopTextList", ex);
		}
		return wWorkShopTextList;
	}

	// 静态函数（工厂模型）
	// 文本提取
	public String FMC_QueryFactoryCodeByID(int wCompanyID, int wID) {
		String wFactoryCode = "";
		try {
			wFactoryCode = FMCConstants.GetFMCFactory(wID).getCode();
		} catch (Exception ex) {
			logger.Error("FMC_QueryFactoryCodeByID ", ex);
		}
		return wFactoryCode;
	}

	public String FMC_QueryFactoryNameByID(int wCompanyID, int wID) {
		String wFactoryCode = "";
		try {
			wFactoryCode = FMCConstants.GetFMCFactoryName(wID);
		} catch (Exception ex) {
			logger.Error("FMC_QueryFactoryNameByID ", ex);
		}
		return wFactoryCode;
	}

	public String FMC_QueryBusinessUnitCodeByID(int wCompanyID, int wID) {
		String wBusinessUnitCode = "";
		try {
			wBusinessUnitCode = FMCConstants.GetFMCBusinessUnit(wID).getCode();
		} catch (Exception ex) {
			logger.Error("FMC_QueryBusinessUnitCodeByID ",
					ex);
		}
		return wBusinessUnitCode;
	}

	public String FMC_QueryBusinessUnitNameByID(int wCompanyID, int wID) {
		String wBusinessUnitCode = "";
		try {
			wBusinessUnitCode = FMCConstants.GetFMCBusinessUnitName(wID);
		} catch (Exception ex) {
			logger.Error("FMC_QueryBusinessUnitNameByID ",
					ex);
		}
		return wBusinessUnitCode;
	}

	public String FMC_QueryWorkShopCodeByID(int wCompanyID, int wID) {
		String wWorkShopCode = "All";
		try {
			wWorkShopCode = FMCConstants.GetFMCWorkShop(wID).getCode();
		} catch (Exception ex) {
			logger.Error("FMC_QueryWorkShopCodeByID ", ex);
		}
		return wWorkShopCode;
	}

	public String FMC_QueryWorkShopNameByID(int wCompanyID, int wID) {
		String wWorkShopCode = "";
		try {
			wWorkShopCode = FMCConstants.GetFMCWorkShopName(wID);
		} catch (Exception ex) {
			logger.Error("FMC_QueryWorkShopNameByID ", ex);
		}
		return wWorkShopCode;
	}

	public FMCWorkShop FMC_QueryWorkShopByID(int wCompanyID, int wID) {
		FMCWorkShop wWorkShop = new FMCWorkShop();
		try {
			wWorkShop = FMCConstants.GetFMCWorkShop(wID);
		} catch (Exception ex) {
			logger.Error("FMC_QueryWorkShopByID ", ex);
		}
		return wWorkShop;
	}

	// 关联数据
}
