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

import com.mes.server.service.mesenum.APSUnitLevel;
import com.mes.server.service.mesenum.BPMStatus;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.aps.APSOrder;
import com.mes.server.service.po.fmc.FMCLine;
import com.mes.server.service.po.fmc.FMCLineUnit;
import com.mes.server.service.po.fmc.FMCStation;
import com.mes.server.service.po.fpc.FPCPart;
import com.mes.server.service.po.fpc.FPCPartPoint;
import com.mes.server.service.po.fpc.FPCProduct;
import com.mes.server.service.po.fpc.FPCRoute;
import com.mes.server.service.utils.Configuration;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.dao.fpc.FPCProductDAO;
import com.mes.server.serviceimpl.dao.fpc.FPCRouteDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.serviceimpl.utils.fmc.FMCConstants;
import com.mes.server.shristool.LoggerTool;

public class FMCLineUnitDAO extends BaseDAO {
	private static FMCLineUnitDAO Instance = null;

	private static int ProductEnable = StringUtils
			.parseInt(Configuration.readConfigString("line.unit.product.enable", "config/config"));

	private static int CustomerEnable = StringUtils
			.parseInt(Configuration.readConfigString("line.unit.customer.enable", "config/config"));

	private FMCLineUnitDAO() {
		super();
	}

	public static FMCLineUnitDAO getInstance() {
		if (Instance == null)
			Instance = new FMCLineUnitDAO();
		return Instance;
	}

	// 产线工艺配置
	private FMCLineUnit FMC_CheckLineUnit(int wCompanyID, int wLoginID, FMCLineUnit wLineUnit,
			OutResult<Int32> wErrorCode) {
		FMCLineUnit wLineUnitDB = new FMCLineUnit();
		wErrorCode.set(0);
		try {
			if (ProductEnable != 1)
				wLineUnit.ProductID = 0;
			if (CustomerEnable != 1)
				wLineUnit.CustomerID = 0;
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result != 0) {
				return wLineUnitDB;
			}
			// Step0:查询
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			String wSQLText = StringUtils.Format("Select * from {0}.fmc_lineunit ", wInstance.Result)
					+ " where ID!=@ID and LineID=@LineID and ProductID=@ProductID and CustomerID=@CustomerID"
					+ " and UnitID=@UnitID and LevelID=@LevelID and ParentUnitID=@ParentUnitID";
			wParms.Clear();
			wParms.Add("ID", wLineUnit.ID);
			wParms.Add("LineID", wLineUnit.LineID);
			wParms.Add("UnitID", wLineUnit.UnitID);
			wParms.Add("LevelID", wLineUnit.LevelID);
			wParms.Add("ProductID", wLineUnit.ProductID);
			wParms.Add("CustomerID", wLineUnit.CustomerID);
			wParms.Add("ParentUnitID", wLineUnit.ParentUnitID);

			wSQLText = this.DMLChange(wSQLText);
			List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
			for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
				wLineUnitDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
				wLineUnitDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
				wLineUnitDB.UnitID = StringUtils.parseInt(wSqlDataReader["UnitID"]);
				wLineUnitDB.LevelID = StringUtils.parseInt(wSqlDataReader["LevelID"]);
				wLineUnitDB.OrderID = StringUtils.parseInt(wSqlDataReader["OrderID"]);

				wLineUnitDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
				wLineUnitDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
				wLineUnitDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
				wLineUnitDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
				wLineUnitDB.AuditTime = StringUtils.parseDate(wSqlDataReader["AuditTime"]);
				wLineUnitDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
				wLineUnitDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
				wLineUnitDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
				wLineUnitDB.ShiftDays = StringUtils.parseInt(wSqlDataReader["ShiftDays"]);
				wLineUnitDB.QTPeriod = StringUtils.parseInt(wSqlDataReader["QTPeriod"]);
				wLineUnitDB.TechPeriod = StringUtils.parseInt(wSqlDataReader["TechPeriod"]);
			}

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_CheckLineByName", ex);
		}
		return wLineUnitDB;
	}

	public void FMC_AddLineUnit(int wCompanyID, int wLoginID, FMCLineUnit wLineUnit, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {

			if (wLineUnit == null || wLineUnit.LineID <= 0) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			if (ProductEnable != 1)
				wLineUnit.ProductID = 0;
			else if (wLineUnit.ProductID <= 0) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}
			if (CustomerEnable != 1)
				wLineUnit.CustomerID = 0;
			else if (wLineUnit.CustomerID <= 0) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 125001);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				FMCLineUnit wLineUnitDB = this.FMC_CheckLineUnit(wCompanyID, wLoginID, wLineUnit, wErrorCode);
				if (wLineUnitDB.ID > 0 || wLineUnit.LineID < 1 || wLineUnit.UnitID < 1 || wLineUnit.LevelID < 1) {
					wErrorCode.set(MESException.Duplication.Value);
					wLineUnit.ID = wLineUnitDB.ID;
				}
			}
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("Insert Into {0}.fmc_lineunit", wInstance.Result)
						+ "(LineID,UnitID,OrderID,LevelID,CreatorID,EditorID,AuditorID,CreateTime,EditTime,AuditTime,"
						+ " Status,Active,ParentUnitID,ShiftDays,Code,ProductID,CustomerID) "
						+ " Values(@LineID,@UnitID,@OrderID,@LevelID,@CreatorID,@EditorID,@AuditorID,now(), now(), @AuditTime,"
						+ " @Status,@Active,@ParentUnitID,@ShiftDays,@Code,@ProductID,@CustomerID);";
				wParms.Clear();

				wParms.Add("LineID", wLineUnit.LineID);
				wParms.Add("UnitID", wLineUnit.UnitID);
				wParms.Add("OrderID", wLineUnit.OrderID);
				wParms.Add("LevelID", wLineUnit.LevelID);
				wParms.Add("Code", wLineUnit.Code);
				wParms.Add("ProductID", wLineUnit.ProductID);
				wParms.Add("CustomerID", wLineUnit.CustomerID);
				wParms.Add("CreatorID", wLoginID);
				wParms.Add("EditorID", wLoginID);
				wParms.Add("AuditorID", wLineUnit.AuditorID);

				wLineUnit.AuditTime = DateTime.Now;
				wLineUnit.AuditTime.set(2000, 0, 1);
				wParms.Add("AuditTime", wLineUnit.AuditTime);

				wParms.Add("Status", wLineUnit.Status);
				wParms.Add("Active", wLineUnit.Active);
				wParms.Add("ParentUnitID", wLineUnit.ParentUnitID);
				wParms.Add("ShiftDays", wLineUnit.ShiftDays);
				wParms.Add("QTPeriod", wLineUnit.QTPeriod);
				wParms.Add("TechPeriod", wLineUnit.TechPeriod);
				wSQLText = this.DMLChange(wSQLText);
				KeyHolder keyHolder = new GeneratedKeyHolder();

				SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
				mDBPool.update(wSQLText, wSqlParameterSource, keyHolder);

				wLineUnit.ID = keyHolder.getKey().intValue();

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_AddLineUnit", ex);
		}
	}

	public FMCLineUnit FMC_SyncLineUnit(int wCompanyID, int wLoginID, FPCPart wPart, OutResult<Int32> wErrorCode) {
		FMCLineUnit wResult = new FMCLineUnit();
		wErrorCode.set(0);

		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			FMCLineUnit wLineUnit = this.FMC_QueryLineUnit(wCompanyID, wLoginID, -1, wPart.LineID, -1, wPart.ID,
					(int)APSUnitLevel.Part(), -1, wErrorCode);

			wLineUnit.LineID = wPart.LineID;
			wLineUnit.Active = wPart.Active;
			wLineUnit.Auditor = "";
			wLineUnit.AuditorID = wLoginID;
			wLineUnit.AuditTime = DateTime.Now;
			wLineUnit.Code = wPart.Code;
			wLineUnit.CreateTime = DateTime.Now;
			wLineUnit.Creator = "";
			wLineUnit.CreatorID = wLoginID;
			wLineUnit.CustomerID = 0;
			wLineUnit.Editor = "";
			wLineUnit.EditorID = wLoginID;
			wLineUnit.EditTime = DateTime.Now;
			wLineUnit.LevelID = (int)APSUnitLevel.Part();
			wLineUnit.LevelName = EnumTool.GetEnumDesc(APSUnitLevel.Part);
			wLineUnit.ParentUnitID = wPart.LineID;
			wLineUnit.UnitID = wPart.ID;
			wLineUnit.UnitCode = wPart.Code;
			wLineUnit.Name = wPart.Name;
			wLineUnit.OrderID = 1;
			wLineUnit.ProductID = 0;
			wLineUnit.Status = 0;

			if (wLineUnit.ID <= 0) {
				this.FMC_AddLineUnit(wCompanyID, wLoginID, wLineUnit, wErrorCode);
			} else {
				this.FMC_SaveLineUnit(wCompanyID, wLoginID, wLineUnit, wErrorCode);
			}

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_SyncLineUnit", ex);
		}
		return wResult;
	}

	public FMCLineUnit FMC_SyncLineUnit(int wCompanyID, int wLoginID, FPCPartPoint wFPCPartPoint,
			OutResult<Int32> wErrorCode) {
		FMCLineUnit wResult = new FMCLineUnit();
		wErrorCode.set(0);

		try {
			FMCLineUnit wLineUnit = this.FMC_QueryLineUnit(wCompanyID, wLoginID, -1, wFPCPartPoint.LineID, -1,
					wFPCPartPoint.ID, (int)APSUnitLevel.Step(), wFPCPartPoint.PartID, wErrorCode);

			wLineUnit.LineID = wFPCPartPoint.LineID;
			wLineUnit.Active = wFPCPartPoint.Active;
			wLineUnit.Auditor = "";
			wLineUnit.AuditorID = wLoginID;
			wLineUnit.AuditTime = DateTime.Now;
			wLineUnit.Code = wFPCPartPoint.Code;
			wLineUnit.CreateTime = DateTime.Now;
			wLineUnit.Creator = "";
			wLineUnit.CreatorID = wLoginID;
			wLineUnit.CustomerID = 0;
			wLineUnit.Editor = "";
			wLineUnit.EditorID = wLoginID;
			wLineUnit.EditTime = DateTime.Now;
			wLineUnit.LevelID = (int)APSUnitLevel.Step();
			wLineUnit.LevelName = EnumTool.GetEnumDesc(APSUnitLevel.Step);
			wLineUnit.Name = wFPCPartPoint.Name;
			wLineUnit.UnitID = wFPCPartPoint.ID;
			wLineUnit.UnitCode = wFPCPartPoint.Code;
			wLineUnit.ParentUnitID = wFPCPartPoint.PartID;
			wLineUnit.OrderID = 1;
			wLineUnit.ProductID = 0;
			wLineUnit.Status = 0;

			if (wLineUnit.ID <= 0) {
				this.FMC_AddLineUnit(wCompanyID, wLoginID, wLineUnit, wErrorCode);
			} else {
				this.FMC_SaveLineUnit(wCompanyID, wLoginID, wLineUnit, wErrorCode);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_SyncLineUnit", ex);
		}
		return wResult;
	}

	public void FMC_CopyLineUnit(int wCompanyID, int wLoginID, int wOldLineID, int wOldProductID, int wOldCustomerID,
			int wLineID, int wProductID, int wCustomerID, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {

			if (ProductEnable != 1) {
				wOldProductID = 0;
				wProductID = 0;
			}
			if (CustomerEnable != 1) {
				wOldCustomerID = 0;
				wCustomerID = 0;
			}
			if (wOldLineID <= 0 || wLineID <= 0) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}
			if (ProductEnable == 1 && (wProductID <= 0 || wOldProductID <= 0)) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}
			if (CustomerEnable == 1 && (wCustomerID <= 0 || wOldCustomerID <= 0)) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}
			if (wOldLineID == wLineID && wOldProductID == wProductID && wOldCustomerID == wCustomerID) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 125001);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result != 0) {
				return;
			}

			List<FMCLineUnit> wFMCLineUnitList = this.FMC_QueryLineUnitListByLineID(wCompanyID, wOldProductID,
					wOldProductID, wOldCustomerID, true, wErrorCode);

			if (wFMCLineUnitList == null || wFMCLineUnitList.Count <= 0) {
				return;
			}

			String wValueTemp = "({0},{1},{2},{3},{4},{5},{6},now(),now(),str_to_date(''2000-01-01'', '%Y-%m-%d'),"
					+ "{7},{8},{9},{10},{11},{12})";

			List<String> wValueArray = new List<String>();

			for (FMCLineUnit wFMCLineUnit : wFMCLineUnitList) {

				if (wFMCLineUnit.ID <= 0 || wFMCLineUnit.Active != 1)
					continue;

				wValueArray.Add(StringUtils.Format(wValueTemp, wLineID, wFMCLineUnit.UnitID, wFMCLineUnit.OrderID,
						wFMCLineUnit.LevelID, wLoginID, wLoginID, 0, wFMCLineUnit.Status, 0, wFMCLineUnit.ParentUnitID,
						wFMCLineUnit.ShiftDays, wFMCLineUnit.Code, wProductID, wCustomerID));
			}

			if (wValueArray == null || wValueArray.Count <= 0)
				return;

			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			String wSQLText = StringUtils.Format("Insert Into {0}.fmc_lineunit"
					+ "(LineID,UnitID,OrderID,LevelID,CreatorID,EditorID,AuditorID,CreateTime,EditTime,AuditTime,Status,Active,"
					+ "ParentUnitID,ShiftDays,Code,ProductID,CustomerID) " + " Values {1};", wInstance.Result,
					StringUtils.Join(",", wValueArray));
			wParms.Clear();

			mDBPool.update(wSQLText, wParms);

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_CopyLineUnit", ex);
		}
	}

	public void FMC_SaveLineUnit(int wCompanyID, int wLoginID, FMCLineUnit wLineUnit, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			if (wLineUnit == null || wLineUnit.LineID <= 0) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			if (ProductEnable != 1)
				wLineUnit.ProductID = 0;
			else if (wLineUnit.ProductID <= 0) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}
			if (CustomerEnable != 1)
				wLineUnit.CustomerID = 0;
			else if (wLineUnit.CustomerID <= 0) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 125000);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result != 0)
				return;

			FMCLineUnit wLineUnitDB = this.FMC_CheckLineUnit(wCompanyID, wLoginID, wLineUnit, wErrorCode);
			if (wLineUnitDB.ID > 0 || wLineUnit.LineID < 1 || wLineUnit.UnitID < 1 || wLineUnit.OrderID < 1
					|| wLineUnit.LevelID < 1) {
				wErrorCode.set(MESException.Logic.Value);
				return;
			}

			Dictionary<String, Object> wParms = new Dictionary<String, Object>();

			wParms.Add("ID", wLineUnit.ID);

			wParms.Add("LineID", wLineUnit.LineID);
			wParms.Add("UnitID", wLineUnit.UnitID);
			wParms.Add("OrderID", wLineUnit.OrderID);
			wParms.Add("LevelID", wLineUnit.LevelID);
			wParms.Add("Code", wLineUnit.Code);
			wParms.Add("ProductID", wLineUnit.ProductID);
			wParms.Add("CustomerID", wLineUnit.CustomerID);
			wParms.Add("EditorID", wLoginID);
			wParms.Add("EditTime", DateTime.Now);

			wParms.Add("AuditorID", wLineUnit.AuditorID);

			wLineUnit.AuditTime = DateTime.Now;
			wLineUnit.AuditTime.set(2000, 0, 1);
			wParms.Add("AuditTime", wLineUnit.AuditTime);

			wParms.Add("Status", wLineUnit.Status);
			wParms.Add("Active", wLineUnit.Active);
			wParms.Add("ParentUnitID", wLineUnit.ParentUnitID);
			wParms.Add("ShiftDays", wLineUnit.ShiftDays);
			wParms.Add("QTPeriod", wLineUnit.QTPeriod);
			wParms.Add("TechPeriod", wLineUnit.TechPeriod);

			this.Update(StringUtils.Format("{0}.fmc_lineunit", wInstance.Result), "ID", wParms);

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_SaveLineUnit", ex);
		}
	}

	public int FMC_DeleteLineUnitByID(int wCompanyID, int wLoginID, int wID, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 125000);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";
				wSQLText = StringUtils.Format("Delete from {0}.fmc_lineunit", wInstance.Result)
						+ " where ID=@ID and Active !=1 ";
				wParms.Clear();

				wParms.Add("ID", wID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_DeleteLineUnitByID", ex);
		}
		return wErrorCode.Result;
	}

	public int FMC_DeleteLineUnitByUnitID(int wCompanyID, int wLoginID, int wLineID, int wProductID, int wCustomerID,
			int wUnitID, int wParentUnitID, int wLevelID, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 125000);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";
				wSQLText = StringUtils.Format("Delete from {0}.fmc_lineunit", wInstance.Result)
						+ " where LineID=@LineID AND  UnitID=@UnitID and LevelID=@LevelID"
						+ " and  ProductID=@ProductID and CustomerID=@CustomerID"
						+ " and ParentUnitID=@ParentUnitID and Active !=1 ";
				wParms.Clear();

				wParms.Add("LineID", wLineID);
				wParms.Add("LevelID", wLevelID);
				wParms.Add("ProductID", wProductID);
				wParms.Add("CustomerID", wCustomerID);
				wParms.Add("UnitID", wUnitID);
				wParms.Add("ParentUnitID", wParentUnitID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_DeleteLineUnitByID", ex);
		}
		return wErrorCode.Result;
	}

	public int FMC_ActiveLineUnit(int wCompanyID, int wLoginID, FMCLineUnit wLineUnit, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 125000);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_lineunit", wInstance.Result) + " set Active=1,"
						+ "EditorID=@EditorID,EditTime=@EditTime,Status=@Status where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wLineUnit.ID);
				wParms.Add("EditorID", wLoginID);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("Status", wLineUnit.Status);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_ActiveLineUnit", ex);
		}
		return wErrorCode.Result;
	}

	public int FMC_DisableLineUnit(int wCompanyID, int wLoginID, FMCLineUnit wLineUnit, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 125000);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_lineunit", wInstance.Result) + " set Active=2,"
						+ "EditorID=@EditorID,EditTime=@EditTime,Status=@Status where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wLineUnit.ID);
				wParms.Add("EditorID", wLoginID);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("Status", wLineUnit.Status);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_DisableLineUnit", ex);
		}
		return wErrorCode.Result;
	}

	public List<FMCLineUnit> FMC_QueryLineUnitListByLineID(int wCompanyID, int wLoginID, int wProductID,
			int wCustomerID, int wLineID, int wID, boolean wIsList, OutResult<Int32> wErrorCode) {
		List<FMCLineUnit> wLineUnitList = new List<FMCLineUnit>();
		wErrorCode.set(0);

		try {
			if (ProductEnable != 1)
				wProductID = 0;
			if (CustomerEnable != 1)
				wCustomerID = 0;
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				String wSQLText = StringUtils
						.Format("Select t.* from {0}.fmc_lineunit t left join {0}.fmc_line l on t.LineID=l.ID "
								+ " where t.ID>0 and (@LineID<=0 or t.LineID=@LineID) "
								+ " and (@CustomerID<=0 or t.CustomerID=@CustomerID)"
								+ " and (@ProductID<=0 or t.ProductID=@ProductID)"
								+ " order by t.LevelID,t.OrderID,t.CreateTime", wInstance.Result);
				wParms.Clear();
				wParms.Add("LineID", wLineID);
				wParms.Add("CustomerID", wCustomerID);
				wParms.Add("ProductID", wProductID);

				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					FMCLineUnit wLineUnitDB = new FMCLineUnit();
					wLineUnitDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wLineUnitDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wLineUnitDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
					wLineUnitDB.CustomerID = StringUtils.parseInt(wSqlDataReader["CustomerID"]);
					wLineUnitDB.ProductID = StringUtils.parseInt(wSqlDataReader["ProductID"]);
					wLineUnitDB.UnitID = StringUtils.parseInt(wSqlDataReader["UnitID"]);
					wLineUnitDB.LevelID = StringUtils.parseInt(wSqlDataReader["LevelID"]);
					wLineUnitDB.OrderID = StringUtils.parseInt(wSqlDataReader["OrderID"]);
					wLineUnitDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wLineUnitDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wLineUnitDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wLineUnitDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wLineUnitDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wLineUnitDB.AuditTime = StringUtils.parseDate(wSqlDataReader["AuditTime"]);
					wLineUnitDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wLineUnitDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
					wLineUnitDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wLineUnitDB.ParentUnitID = StringUtils.parseInt(wSqlDataReader["ParentUnitID"]);
					wLineUnitDB.ShiftDays = StringUtils.parseInt(wSqlDataReader["ShiftDays"]);
					wLineUnitDB.QTPeriod = StringUtils.parseInt(wSqlDataReader["QTPeriod"]);
					wLineUnitDB.TechPeriod = StringUtils.parseInt(wSqlDataReader["TechPeriod"]);

					wLineUnitList.Add(wLineUnitDB);
				}

				wLineUnitList = this.FMC_SetLineUnitTextList(wCompanyID, wLineUnitList, wErrorCode);

				if (wLineID > 0) {
					int wUnitID = wLineID;
					int wLevelID = (int)APSUnitLevel.Part();
					if (wID > 0) {
						FMCLineUnit wLineUnitDB = this.FMC_QueryLineUnitByID(wCompanyID, wLoginID, wID, wErrorCode);
						wUnitID = wLineUnitDB.UnitID;
						wLevelID = wLineUnitDB.LevelID + 1;
					}
					if (!wIsList)
						wLineUnitList = this.FMC_SortLineUnitList(wLineUnitList, wIsList, wUnitID, wLevelID,
								wErrorCode);
				}
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryLineUnitListByLineID",
					ex);
		}
		return wLineUnitList;
	}

	public FMCLineUnit FMC_QueryLineUnit(int wCompanyID, int wLoginID, int wProductID, int wLineID, int wCustomerID,
			int wUnitID, int wLevelID, int wParentUnitID, OutResult<Int32> wErrorCode) {
		FMCLineUnit wResult = new FMCLineUnit();
		wErrorCode.set(0);

		try {
			if (ProductEnable != 1)
				wProductID = 0;
			if (CustomerEnable != 1)
				wCustomerID = 0;
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result != 0) {
				return wResult;
			}

			Dictionary<String, Object> wParms = new Dictionary<String, Object>();

			String wSQLText = StringUtils
					.Format("Select t.* from {0}.fmc_lineunit t left join {0}.fmc_line l on t.LineID=l.ID "
							+ " where t.ID>0 and  t.LineID=@LineID and  t.ProductID=@ProductID"
							+ " and (@CustomerID<=0 or t.CustomerID=@CustomerID)"
							+ " and (@ParentUnitID<=0 or t.ParentUnitID=@ParentUnitID)"
							+ " and t.UnitID=@UnitID and t.LevelID=@LevelID;", wInstance.Result);

			wParms.Clear();
			wParms.Add("LineID", wLineID);
			wParms.Add("CustomerID", wCustomerID);
			wParms.Add("ProductID", wProductID);
			wParms.Add("ParentUnitID", wParentUnitID);
			wParms.Add("UnitID", wUnitID);
			wParms.Add("LevelID", wLevelID);

			wSQLText = this.DMLChange(wSQLText);
			List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
			for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
				 
				wResult.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
				wResult.Code = StringUtils.parseString(wSqlDataReader["Code"]);
				wResult.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
				wResult.CustomerID = StringUtils.parseInt(wSqlDataReader["CustomerID"]);
				wResult.ProductID = StringUtils.parseInt(wSqlDataReader["ProductID"]);
				wResult.UnitID = StringUtils.parseInt(wSqlDataReader["UnitID"]);
				wResult.LevelID = StringUtils.parseInt(wSqlDataReader["LevelID"]);
				wResult.OrderID = StringUtils.parseInt(wSqlDataReader["OrderID"]);
				wResult.Code = StringUtils.parseString(wSqlDataReader["Code"]);
				wResult.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
				wResult.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
				wResult.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
				wResult.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
				wResult.AuditTime = StringUtils.parseDate(wSqlDataReader["AuditTime"]);
				wResult.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
				wResult.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
				wResult.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
				wResult.ParentUnitID = StringUtils.parseInt(wSqlDataReader["ParentUnitID"]);
				wResult.ShiftDays = StringUtils.parseInt(wSqlDataReader["ShiftDays"]);
				wResult.QTPeriod = StringUtils.parseInt(wSqlDataReader["QTPeriod"]);
				wResult.TechPeriod = StringUtils.parseInt(wSqlDataReader["TechPeriod"]);

				wResult.StatusText = BPMStatus.getEnumType(wResult.Status).getLable();
				wResult.LevelName = APSUnitLevel.getEnumType(wResult.LevelID).getLable();
				wResult.Creator = BFCConstants.GetBMSEmployeeName(wResult.CreatorID);
				wResult.Editor = BFCConstants.GetBMSEmployeeName(wResult.EditorID);
				wResult.Auditor = BFCConstants.GetBMSEmployeeName(wResult.AuditorID);

				switch (APSUnitLevel.getEnumType(wResult.LevelID)) {
				case Line:
					FMCLine wLine = FMCConstants.GetFMCLine(wResult.UnitID);
					wResult.Name = wLine.Name;
					wResult.UnitCode = wLine.Code;
					break;
				case Part:
					FPCPart wPart = FMCConstants.GetFPCPart(wResult.UnitID);
					wResult.Name = wPart.Name;
					wResult.Type = wPart.PartType;
					wResult.UnitCode = wPart.Code;
					break;
				case Step:
					FPCPartPoint wPartPoint = FMCConstants.GetFPCStep(wResult.UnitID);
					wResult.Name = wPartPoint.Name;
					wResult.Type = wPartPoint.StepType;
					wResult.UnitCode = wPartPoint.Code;
					break;
				case Station:
					FMCStation wStation = FMCConstants.GetFMCStation(wResult.UnitID);
					wResult.Name = wStation.Name;
					wResult.UnitCode = wStation.Code;
					break;
				default:
					break;
				}

			}

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryLineUnitListByLineID",
					ex);
		}
		return wResult;
	}

	private FMCLineUnit FMC_QueryLineUnitByID(int wCompanyID, int wLoginID, int wID, OutResult<Int32> wErrorCode) {
		FMCLineUnit wLineUnitDB = new FMCLineUnit();
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";
				wSQLText = StringUtils.Format("Select * from {0}.fmc_lineunit ", wInstance.Result) + " where ID=@ID";
				wParms.Clear();
				wParms.Add("ID", wID);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					wLineUnitDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wLineUnitDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wLineUnitDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
					wLineUnitDB.CustomerID = StringUtils.parseInt(wSqlDataReader["CustomerID"]);
					wLineUnitDB.ProductID = StringUtils.parseInt(wSqlDataReader["ProductID"]);
					wLineUnitDB.UnitID = StringUtils.parseInt(wSqlDataReader["UnitID"]);
					wLineUnitDB.LevelID = StringUtils.parseInt(wSqlDataReader["LevelID"]);
					wLineUnitDB.OrderID = StringUtils.parseInt(wSqlDataReader["OrderID"]);

					wLineUnitDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wLineUnitDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wLineUnitDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wLineUnitDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wLineUnitDB.AuditTime = StringUtils.parseDate(wSqlDataReader["AuditTime"]);
					wLineUnitDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wLineUnitDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
					wLineUnitDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wLineUnitDB.ParentUnitID = StringUtils.parseInt(wSqlDataReader["ParentUnitID"]);
					wLineUnitDB.ShiftDays = StringUtils.parseInt(wSqlDataReader["ShiftDays"]);
					wLineUnitDB.QTPeriod = StringUtils.parseInt(wSqlDataReader["QTPeriod"]);
					wLineUnitDB.TechPeriod = StringUtils.parseInt(wSqlDataReader["TechPeriod"]);

					wLineUnitDB.StatusText = BPMStatus.getEnumType(wLineUnitDB.Status).getLable();
					wLineUnitDB.LevelName = APSUnitLevel.getEnumType(wLineUnitDB.LevelID).getLable();
					wLineUnitDB.Creator = BFCConstants.GetBMSEmployeeName(wLineUnitDB.CreatorID);
					wLineUnitDB.Editor = BFCConstants.GetBMSEmployeeName(wLineUnitDB.EditorID);
					wLineUnitDB.Auditor = BFCConstants.GetBMSEmployeeName(wLineUnitDB.AuditorID);

					switch (APSUnitLevel.getEnumType(wLineUnitDB.LevelID)) {
					case Line:
						FMCLine wLine = FMCConstants.GetFMCLine(wLineUnitDB.UnitID);
						wLineUnitDB.Name = wLine.Name;
						wLineUnitDB.UnitCode = wLine.Code;
						break;
					case Part:
						FPCPart wPart = FMCConstants.GetFPCPart(wLineUnitDB.UnitID);
						wLineUnitDB.Name = wPart.Name;
						wLineUnitDB.Type = wPart.PartType;
						wLineUnitDB.UnitCode = wPart.Code;
						break;
					case Step:
						FPCPartPoint wPartPoint = FMCConstants.GetFPCStep(wLineUnitDB.UnitID);
						wLineUnitDB.Name = wPartPoint.Name;
						wLineUnitDB.Type = wPartPoint.StepType;
						wLineUnitDB.UnitCode = wPartPoint.Code;
						break;
					case Station:
						FMCStation wStation = FMCConstants.GetFMCStation(wLineUnitDB.UnitID);
						wLineUnitDB.Name = wStation.Name;
						wLineUnitDB.UnitCode = wStation.Code;
						break;
					default:
						break;
					}
				}
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryLineUnitByID", ex);

		}
		return wLineUnitDB;
	}

	private List<FMCLineUnit> FMC_SetLineUnitTextList(int wCompanyID, List<FMCLineUnit> wLineUnitList,
			OutResult<Int32> wErrorCode) {
		List<FMCLineUnit> wLineUnitTextList = new List<FMCLineUnit>();
		try {

			for (FMCLineUnit wItem : wLineUnitList) {
				wItem.StatusText = BPMStatus.getEnumType(wItem.Status).getLable();
				wItem.LevelName = APSUnitLevel.getEnumType(wItem.LevelID).getLable();
				wItem.Creator = BFCConstants.GetBMSEmployeeName(wItem.CreatorID);
				wItem.Editor = BFCConstants.GetBMSEmployeeName(wItem.EditorID);
				wItem.Auditor = BFCConstants.GetBMSEmployeeName(wItem.AuditorID);

				switch (APSUnitLevel.getEnumType(wItem.LevelID)) {
				case Line:
					FMCLine wLine = FMCConstants.GetFMCLine(wItem.UnitID);
					wItem.Name = wLine.Name;
					wItem.UnitCode = wLine.Code;
					break;
				case Part:
					FPCPart wPart = FMCConstants.GetFPCPart(wItem.UnitID);
					wItem.Name = wPart.Name;
					wItem.Type = wPart.PartType;
					wItem.UnitCode = wPart.Code;
					break;
				case Step:
					FPCPartPoint wPartPoint = FMCConstants.GetFPCStep(wItem.UnitID);
					wItem.Name = wPartPoint.Name;
					wItem.Type = wPartPoint.StepType;
					wItem.UnitCode = wPartPoint.Code;
					break;
				case Station:
					FMCStation wStation = FMCConstants.GetFMCStation(wItem.UnitID);
					wItem.Name = wStation.Name;
					wItem.UnitCode = wStation.Code;
					break;
				default:
					break;
				}
				wLineUnitTextList.Add(wItem);
			}
		} catch (Exception ex) {
			logger.Error("FMC_SetLineUnitTextList", ex);
		}
		return wLineUnitTextList;
	}

	public List<FMCLineUnit> FMC_SortLineUnitList(List<FMCLineUnit> wLineUnitList, boolean wIsList, int wParentUnitID,
			int wLevelID, OutResult<Int32> wErrorCode) {
		List<FMCLineUnit> wItemList = new List<FMCLineUnit>();
		try {
			for (FMCLineUnit wItem : wLineUnitList) {
				if (wItem.ParentUnitID == wParentUnitID && wItem.LevelID == wLevelID) {
					List<FMCLineUnit> wSonUnitList = this.FMC_SortLineUnitList(wLineUnitList, wIsList, wItem.UnitID,
							wItem.LevelID + 1, wErrorCode);
					if (wIsList) {
						wItemList.Add(wItem);
						wItemList.addAll(wSonUnitList);
					} else {
						wItem.UnitList.addAll(wSonUnitList);
						wItemList.Add(wItem);
					}
				}
			}
		} catch (Exception ex) {
			logger.Error("FMC_SortLineUnitList", ex);
		}
		return wItemList;
	}

	public List<FMCLineUnit> FMC_QueryLineUnitListByLineID(int wCompanyID, int wLineID, int wProductID, int wCustomerID,
			boolean wIsList, OutResult<Int32> wErrorCode) {
		List<FMCLineUnit> wLineUnitList = new List<FMCLineUnit>();
		wErrorCode.set(0);

		try {

			wLineUnitList = this.FMC_QueryLineUnitListByLineID(wCompanyID, 0, wProductID, wCustomerID, wLineID, 0,
					wIsList, wErrorCode);
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryLineUnitListByLineID",
					ex);
		}
		return wLineUnitList;
	}

	public List<FMCLineUnit> FMC_QueryLineUnitListByOrder(int wCompanyID, APSOrder wOrder,
			OutResult<Int32> wErrorCode) {
		List<FMCLineUnit> wLineUnitList = new List<FMCLineUnit>();
		wErrorCode.set(0);

		try {

			FPCProduct wFPCProduct = FPCProductDAO.getInstance().FPC_QueryProductByID(SysAdmin, 0, wOrder.ProductNo,
					wErrorCode);
			if (wFPCProduct == null || wFPCProduct.ID <= 0)
				return wLineUnitList;

			FPCRoute wRoute = FPCRouteDAO.getInstance().FPC_QueryRouteByLineID(SysAdmin, wOrder.LineID, wFPCProduct.ID,
					wOrder.CustomerID, wErrorCode);
			wLineUnitList = this.FMC_QueryLineUnitListByLineID(wCompanyID, wOrder.LineID, wFPCProduct.ID,
					wOrder.CustomerID, true, wErrorCode);
			wLineUnitList = FPCRouteDAO.getInstance().FPC_RemoveLineUnitByRoute(wLineUnitList, wRoute, wErrorCode);
			int wUnitID = wOrder.LineID;
			int wLevelID = (int)APSUnitLevel.Part();
			wLineUnitList = this.FMC_SortLineUnitList(wLineUnitList, false, wUnitID, wLevelID, wErrorCode);
		} catch (Exception ex) {
			logger.Error("FMC_QueryLineUnitListByOrder",
					ex);
			wErrorCode.set(MESException.Exception.Value);
		}
		return wLineUnitList;
	}

}
