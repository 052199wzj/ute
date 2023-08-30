package com.mes.server.serviceimpl.dao.fpc;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.mes.server.service.mesenum.APSUnitLevel;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.fpc.FPCPart;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.serviceimpl.utils.fmc.FMCConstants;
import com.mes.server.shristool.LoggerTool;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.dao.fmc.FMCLineUnitDAO;
import com.mes.server.service.utils.StringUtils;

public class FPCPartDAO extends BaseDAO {
	private static FPCPartDAO Instance = null;

	private FPCPartDAO() {
		super();
	}

	public static FPCPartDAO getInstance() {
		if (Instance == null)
			Instance = new FPCPartDAO();
		return Instance;
	}

	// 工艺管理
	// 标准工序
	private FPCPart FPC_CheckPartByCode(int wCompanyID, int wLoginID, FPCPart wPart, OutResult<Integer> wErrorCode) {
		FPCPart wPartDB = new FPCPart();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Map<String, Object> wParms = new HashMap<String, Object>();
				String wSQLText = StringUtils.Format("Select * from {0}.fpc_part ", wInstance.Result)
						+ " where ID!=:ID and Code=:Code and FactoryID=:FactoryID and WorkShopID=:WorkShopID"
						+ "  and LineID=:LineID and BusinessUnitID=:BusinessUnitID and ProductTypeID=:ProductTypeID";

				wParms.put("Code", wPart.Code);
				wParms.put("ID", wPart.ID);
				wParms.put("FactoryID", wPart.FactoryID);
				wParms.put("WorkShopID", wPart.WorkShopID);
				wParms.put("LineID", wPart.LineID);
				wParms.put("BusinessUnitID", wPart.BusinessUnitID);
				wParms.put("ProductTypeID", wPart.ProductTypeID);

				wSQLText = this.DMLChange(wSQLText);
				List<Map<String, Object>> wQueryResultList = nameJdbcTemplate.queryForList(wSQLText, wParms);
				for (Map<String, Object> wSqlDataReader : wQueryResultList) {
					wPartDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wPartDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wPartDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wPartDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);
					wPartDB.BusinessUnitID = StringUtils.parseInt(wSqlDataReader["BusinessUnitID"]);

					wPartDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
					wPartDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
					wPartDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wPartDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wPartDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wPartDB.CreateTime = StringUtils.parseCalendar(wSqlDataReader["CreateTime"]);
					wPartDB.AuditTime = StringUtils.parseCalendar(wSqlDataReader["AuditTime"]);
					wPartDB.EditTime = StringUtils.parseCalendar(wSqlDataReader["EditTime"]);
					wPartDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
					wPartDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wPartDB.PartType = StringUtils.parseInt(wSqlDataReader["PartType"]);
					wPartDB.QTPartID = StringUtils.parseInt(wSqlDataReader["QTPartID"]);
				}
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_CheckPartByName", "Function Exception:" + ex.toString());
		}
		return wPartDB;
	}

	public void FPC_AddPart(int wCompanyID, int wLoginID, FPCPart wPart, OutResult<Integer> wErrorCode) {
		wErrorCode.set(0);

		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）
		try {

			if (wPart == null || StringUtils.isEmpty(wPart.Name) || StringUtils.isEmpty(wPart.Code)) {
				wErrorCode.set(MESException.Parameter.getValue());
				return;
			}
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 131000);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result != 0) {
				return;
			}

			FPCPart wPartDB = this.FPC_CheckPartByCode(wCompanyID, wLoginID, wPart, wErrorCode);
			if (wPartDB.ID > 0) {
				wPart.ID = wPartDB.ID;
				wErrorCode.set(MESException.Duplication.getValue());
				return;
			}

			Map<String, Object> wParms = new HashMap<String, Object>();

			wParms.put("Name", wPart.Name);
			wParms.put("Code", wPart.Code);
			wParms.put("FactoryID", wPart.FactoryID);
			wParms.put("BusinessUnitID", wPart.BusinessUnitID);
			wParms.put("WorkShopID", wPart.WorkShopID);
			wParms.put("LineID", wPart.LineID);
			wParms.put("ProductTypeID", wPart.ProductTypeID);
			wParms.put("CreatorID", wLoginID);
			wParms.put("EditorID", 0);
			wParms.put("AuditorID", 0);
			wParms.put("CreateTime", Calendar.getInstance());
			wParms.put("EditTime", Calendar.getInstance());
			wParms.put("AuditTime", Calendar.getInstance());
			wParms.put("PartType", wPart.PartType);
			wParms.put("Status", wPart.Status);
			wParms.put("Active", wPart.Active);
			wParms.put("ERPID", wPart.ERPID);
			wParms.put("QTPartID", wPart.QTPartID);

			wPart.ID = this.Insert(StringUtils.Format("{0}.fpc_part", wInstance.Result), wParms);

			if (wPart.ID <= 0)
				return;

			FMCLineUnitDAO.getInstance().FMC_SyncLineUnit(wCompanyID, wLoginID, wPart, wErrorCode);

			FMCConstants.RestPartTime();

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_AddPart", "Function Exception:" + ex.toString());
		}
	}

	public void FPC_SavePart(int wCompanyID, int wLoginID, FPCPart wPart, OutResult<Integer> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 131000);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result != 0) {
				return;
			}
			FPCPart wPartDB = this.FPC_CheckPartByCode(wCompanyID, wLoginID, wPart, wErrorCode);
			if (wPartDB.ID > 0 || wPart.Name.length() < 1) {
				wErrorCode.set(MESException.Logic.getValue());
				return;
			}

			Map<String, Object> wParms = new HashMap<String, Object>();
			String wSQLText = "";

			wSQLText = StringUtils.Format("update {0}.fpc_part", wInstance.Result)
					+ " set Name=:Name,Code=:Code,FactoryID=:FactoryID,BusinessUnitID=:BusinessUnitID,"
					+ " ProductTypeID=:ProductTypeID,PartType=:PartType,QTPartID=:QTPartID,WorkShopID=:WorkShopID,"
					+ " LineID=:LineID,EditorID=:EditorID,EditTime=:EditTime,Status=:Status,ERPID=:ERPID where ID=:ID ";
			wParms.clear();

			wParms.put("ID", wPart.ID);

			wParms.put("Name", wPart.Name);
			wParms.put("Code", wPart.Code);
			wParms.put("WorkShopID", wPart.WorkShopID);
			wParms.put("LineID", wPart.LineID);
			wParms.put("FactoryID", wPart.FactoryID);
			wParms.put("BusinessUnitID", wPart.BusinessUnitID);
			wParms.put("ProductTypeID", wPart.ProductTypeID);
			wParms.put("PartType", wPart.PartType);
			wParms.put("QTPartID", wPart.QTPartID);
			wParms.put("EditorID", wLoginID);
			wParms.put("EditTime", Calendar.getInstance());
			wParms.put("Status", wPart.Status);
			wParms.put("ERPID", wPart.ERPID);
			wSQLText = this.DMLChange(wSQLText);
			nameJdbcTemplate.update(wSQLText, wParms);

			FMCLineUnitDAO.getInstance().FMC_SyncLineUnit(wCompanyID, wLoginID, wPart, wErrorCode);

			FMCConstants.RestPartTime();

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_SavePart", "Function Exception:" + ex.toString());
		}
	}

	public int FPC_DisablePart(int wCompanyID, int wLoginID, FPCPart wPart, OutResult<Integer> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 131000);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Map<String, Object> wParms = new HashMap<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fpc_part", wInstance.Result) + " set AuditorID=:AuditorID,"
						+ " AuditTime=:AuditTime,Active=2 where ID=:ID ";
				wParms.clear();

				wParms.put("ID", wPart.ID);

				wParms.put("AuditorID", wLoginID);
				wParms.put("AuditTime", Calendar.getInstance());
				wSQLText = this.DMLChange(wSQLText);
 

				FMCLineUnitDAO.getInstance().FMC_SyncLineUnit(wCompanyID, wLoginID, wPart, wErrorCode);

				nameJdbcTemplate.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_DisablePart", "Function Exception:" + ex.toString());
		}
		return wErrorCode.Result;
	}

	public void FPC_DeletePart(int wCompanyID, int wLoginID, FPCPart wPart, OutResult<Integer> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 131000);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Map<String, Object> wParms = new HashMap<String, Object>();

				wParms.put("ID", wPart.ID);
				wParms.put("Active", 0);
				this.Delete(StringUtils.Format("{0}.fpc_part", wInstance.Result), wParms);

				FMCLineUnitDAO.getInstance().FMC_DeleteLineUnitByUnitID(wCompanyID, wLoginID, wPart.LineID, 0, 0,
						wPart.ID, wPart.LineID, APSUnitLevel.Part.getValue(), wErrorCode);

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_DisablePartPoint", "Function Exception:" + ex.toString());
		}
	}

	public int FPC_ActivePart(int wCompanyID, int wLoginID, FPCPart wPart, OutResult<Integer> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 131000);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Map<String, Object> wParms = new HashMap<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fpc_part", wInstance.Result) + " set AuditorID=:AuditorID,"
						+ " AuditTime=:AuditTime,Active=1 where ID=:ID ";
				wParms.clear();

				wParms.put("ID", wPart.ID);

				wParms.put("AuditorID", wLoginID);
				wParms.put("AuditTime", Calendar.getInstance());
				wSQLText = this.DMLChange(wSQLText);

				FMCLineUnitDAO.getInstance().FMC_SyncLineUnit(wCompanyID, wLoginID, wPart, wErrorCode);
				nameJdbcTemplate.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_ActivePart", "Function Exception:" + ex.toString());
		}
		return wErrorCode.Result;
	}

	public int FPC_AuditPart(int wCompanyID, int wLoginID, FPCPart wPart, OutResult<Integer> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {

			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 131000);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Map<String, Object> wParms = new HashMap<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fpc_part", wInstance.Result) + " set AuditorID=:AuditorID,"
						+ "AuditTime=:AuditTime,Status=:Status where ID=:ID ";
				wParms.clear();

				wParms.put("ID", wPart.ID);

				wParms.put("AuditorID", wLoginID);
				wParms.put("AuditTime", Calendar.getInstance());
				wParms.put("Status", wPart.Status);
				wSQLText = this.DMLChange(wSQLText);

				FMCLineUnitDAO.getInstance().FMC_SyncLineUnit(wCompanyID, wLoginID, wPart, wErrorCode);

				nameJdbcTemplate.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_AuditPart", "Function Exception:" + ex.toString());
		}
		return wErrorCode.Result;
	}

	public FPCPart FPC_QueryPart(int wCompanyID, int wLoginID, int wID, String wCode, OutResult<Integer> wErrorCode) {
		FPCPart wPartDB = new FPCPart();
		wErrorCode.set(0);

		try {
			if (wCode == null)
				wCode = "";
			if (StringUtils.isEmpty(wCode) && wID <= 0) {
				wErrorCode.set(MESException.Parameter.getValue());
				return wPartDB;
			}

			List<FPCPart> wPartList = this.FPC_QueryPartList(wCompanyID, wLoginID, wID, wCode, -1, 0, 0, 0, 0, 0,
					wErrorCode);
			if (wPartList == null || wPartList.size() <= 0)
				return wPartDB;

			wPartDB = wPartList[0];

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_QueryPartByID", "Function Exception:" + ex.toString());
		}
		return wPartDB;
	}

	public FPCPart FPC_QueryPartByID(int wCompanyID, int wLoginID, int wID, OutResult<Integer> wErrorCode) {
		FPCPart wPartDB = new FPCPart();
		wErrorCode.set(0);

		try {

			wPartDB = this.FPC_QueryPart(wCompanyID, wLoginID, wID, "", wErrorCode);

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_QueryPartByID", "Function Exception:" + ex.toString());
		}
		return wPartDB;
	}

	public FPCPart FPC_QueryPartByCode(int wCompanyID, int wLoginID, String wCode, OutResult<Integer> wErrorCode) {
		FPCPart wPartDB = new FPCPart();
		wErrorCode.set(0);

		try {
			wPartDB = this.FPC_QueryPart(wCompanyID, wLoginID, 0, wCode, wErrorCode);

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_QueryPartByID", "Function Exception:" + ex.toString());
		}
		return wPartDB;
	}

	public List<FPCPart> FPC_QueryPartList(int wCompanyID, int wLoginID, int wID, String wCode, int wPartType,
			int wFactoryID, int wBusinessUnitID, int wWorkShopID, int wLineID, int wProductTypeID,
			OutResult<Integer> wErrorCode) {
		List<FPCPart> wPartList = new ArrayList<FPCPart>();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {

				// Step0:查询
				Map<String, Object> wParms = new HashMap<String, Object>();
				String wSQLText = "";
				wSQLText = StringUtils
						.Format("Select t.*,t1.Name as BusinessUnit,t2.Name as ProductType,t3.Name as Factory,"
								+ " GROUP_CONCAT(b.ClassID) as DepartmentIDList,GROUP_CONCAT(b.TechnicianList) as  TechnicianList,"
								+ " GROUP_CONCAT(b.QTCheckerList) as QTCheckerList from {0}.fpc_part t "
								+ " Left join  {0}.fmc_businessunit t1  on t.BusinessUnitID=t1.ID  "
								+ " Left join  {0}.fpc_producttype t2  on t.ProductTypeID=t2.ID  "
								+ " Left join  {0}.fmc_factory t3  on t.FactoryID=t3.ID  "
								+ " left join  {0}.bms_workcharge b on b.StationID=t.ID and b.Active=1 "
								+ " where t.ID > 0  AND ( :ID <=0 OR t.ID = :ID )"
								+ " and ( :BusinessUnitID <=0 OR t.BusinessUnitID = :BusinessUnitID )"
								+ " and ( :ProductTypeID <=0 OR t.ProductTypeID = :ProductTypeID )"
								+ " and ( :PartType <= 0 OR t.PartType = :PartType )"
								+ " and ( :WorkShopID <= 0 OR t.WorkShopID = :WorkShopID )"
								+ " and ( :LineID <= 0 OR t.LineID = :LineID )"
								+ " and ( :FactoryID <=0 OR t.FactoryID = :FactoryID )"
								+ " AND ( :Code='''' OR t.Code=:Code)  group by t.ID", wInstance.Result);

				wParms.clear();
				wParms.put("ID", wID);
				wParms.put("Code", wCode);
				wParms.put("BusinessUnitID", wBusinessUnitID);
				wParms.put("WorkShopID", wWorkShopID);
				wParms.put("ProductTypeID", wProductTypeID);
				wParms.put("PartType", wPartType);
				wParms.put("FactoryID", wFactoryID);
				wParms.put("WorkShopID", wWorkShopID);
				wParms.put("LineID", wLineID);
				wSQLText = this.DMLChange(wSQLText);
				List<Map<String, Object>> wQueryResultList = nameJdbcTemplate.queryForList(wSQLText, wParms);

				for (Map<String, Object> wSqlDataReader : wQueryResultList) {
					FPCPart wPartDB = new FPCPart();
					wPartDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wPartDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wPartDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wPartDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);
					wPartDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
					wPartDB.WorkShopName = FMCConstants.GetFMCWorkShopName(wPartDB.WorkShopID);
					wPartDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
					wPartDB.LineName = FMCConstants.GetFMCLineName(wPartDB.LineID);

					wPartDB.Factory = StringUtils.parseString(wSqlDataReader["Factory"]);
					wPartDB.BusinessUnit = StringUtils.parseString(wSqlDataReader["BusinessUnit"]);
					wPartDB.ProductType = StringUtils.parseString(wSqlDataReader["ProductType"]);
					wPartDB.BusinessUnitID = StringUtils.parseInt(wSqlDataReader["BusinessUnitID"]);
					wPartDB.ProductTypeID = StringUtils.parseInt(wSqlDataReader["ProductTypeID"]);

					wPartDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wPartDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wPartDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wPartDB.CreateTime = StringUtils.parseCalendar(wSqlDataReader["CreateTime"]);
					wPartDB.AuditTime = StringUtils.parseCalendar(wSqlDataReader["AuditTime"]);
					wPartDB.EditTime = StringUtils.parseCalendar(wSqlDataReader["EditTime"]);
					wPartDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
					wPartDB.ERPID = StringUtils.parseInt(wSqlDataReader["ERPID"]);
					wPartDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wPartDB.PartType = StringUtils.parseInt(wSqlDataReader["PartType"]);
					wPartDB.QTPartID = StringUtils.parseInt(wSqlDataReader["QTPartID"]);

					wPartDB.Creator = BFCConstants.GetBMSEmployeeName(wPartDB.CreatorID);
					wPartDB.Auditor = BFCConstants.GetBMSEmployeeName(wPartDB.AuditorID);
					wPartDB.Editor = BFCConstants.GetBMSEmployeeName(wPartDB.EditorID);

					wPartList.add(wPartDB);
				}
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_QueryPartList: Query DB",
					"Function Exception:" + ex.toString());
		}
		return wPartList;
	}

	public FPCPart FPC_QueryPartByID(int wCompanyID, int wID) {
		FPCPart wPart = new FPCPart();
		try {
			wPart = FMCConstants.GetFPCPart(wID);
		} catch (Exception ex) {
			LoggerTool.SaveException("FPCService", "FPC_QueryPartByID ", "Function Exception:" + ex.toString());
		}
		return wPart;
	}

}
