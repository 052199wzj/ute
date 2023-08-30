using iPlant.Common.Tools;
using iPlant.Data.EF.Repository;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{ 
public class FPCPartPointDAO : BaseDAO {
	private static FPCPartPointDAO Instance = null;

	private FPCPartPointDAO() {
		super();
	}

	public static FPCPartPointDAO getInstance() {
		if (Instance == null)
			Instance = new FPCPartPointDAO();
		return Instance;
	}

	// 标准工步
	private FPCPartPoint FPC_CheckPartPointByCode(int wCompanyID, int wLoginID, FPCPartPoint wPartPoint,
			OutResult<Integer> wErrorCode) {
		FPCPartPoint wPartPointDB = new FPCPartPoint();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Map<String, Object> wParms = new HashMap<String, Object>();
				String wSQLText = StringUtils.Format("Select * from {0}.fpc_partpoint ", wInstance.Result)
						+ " where ID!=:ID and  Code=:Code and FactoryID=:FactoryID and WorkShopID=:WorkShopID"
						+ " and LineID=:LineID AND PartID=:PartID  and BusinessUnitID=:BusinessUnitID and ProductTypeID=:ProductTypeID";
				wParms.clear();
				wParms.put("ID", wPartPoint.ID);
				wParms.put("Code", wPartPoint.Code);
				wParms.put("WorkShopID", wPartPoint.WorkShopID);
				wParms.put("LineID", wPartPoint.LineID);
				wParms.put("PartID", wPartPoint.PartID);
				wParms.put("FactoryID", wPartPoint.FactoryID);
				wParms.put("BusinessUnitID", wPartPoint.BusinessUnitID);
				wParms.put("ProductTypeID", wPartPoint.ProductTypeID);

				wSQLText = this.DMLChange(wSQLText);
				List<Map<String, Object>> wQueryResultList = nameJdbcTemplate.queryForList(wSQLText, wParms);
				for (Map<String, Object> wSqlDataReader : wQueryResultList) {
					wPartPointDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wPartPointDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wPartPointDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wPartPointDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);
					wPartPointDB.BusinessUnitID = StringUtils.parseInt(wSqlDataReader["BusinessUnitID"]);
					wPartPointDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
					wPartPointDB.PartID = StringUtils.parseInt(wSqlDataReader["PartID"]);
					wPartPointDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
					wPartPointDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wPartPointDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wPartPointDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wPartPointDB.CreateTime = StringUtils.parseCalendar(wSqlDataReader["CreateTime"]);
					wPartPointDB.AuditTime = StringUtils.parseCalendar(wSqlDataReader["AuditTime"]);
					wPartPointDB.EditTime = StringUtils.parseCalendar(wSqlDataReader["EditTime"]);
					wPartPointDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
					wPartPointDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_CheckPartPointByName", "Function Exception:" + ex.toString());
		}
		return wPartPointDB;
	}

	public void FPC_AddPartPoint(int wCompanyID, int wLoginID, FPCPartPoint wPartPoint, OutResult<Integer> wErrorCode) {
		wErrorCode.set(0);

		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {

			if (wPartPoint == null || StringUtils.isEmpty(wPartPoint.Code) || StringUtils.isEmpty(wPartPoint.Name)) {
				wErrorCode.Result = MESException.Parameter.getValue();
				return;
			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 132000);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result != 0) {
				return;
			}

			FPCPartPoint wPartPointDB = this.FPC_CheckPartPointByCode(wCompanyID, wLoginID, wPartPoint, wErrorCode);
			if (wPartPointDB.ID > 0) {
				wErrorCode.set(MESException.Duplication.getValue());
				wPartPoint.ID = wPartPointDB.ID;
				return;
			}

			Map<String, Object> wParms = new HashMap<String, Object>();

			wParms.put("Name", wPartPoint.Name);
			wParms.put("Code", wPartPoint.Code);
			wParms.put("FactoryID", wPartPoint.FactoryID);
			wParms.put("StepType", wPartPoint.StepType);
			wParms.put("BusinessUnitID", wPartPoint.BusinessUnitID);
			wParms.put("ProductTypeID", wPartPoint.ProductTypeID);
			wParms.put("CreatorID", wLoginID);
			wParms.put("EditorID", 0);
			wParms.put("AuditorID", 0);

			wParms.put("WorkShopID", wPartPoint.WorkShopID);
			wParms.put("LineID", wPartPoint.LineID);
			wParms.put("PartID", wPartPoint.PartID);
			wParms.put("CreateTime", Calendar.getInstance());
			wParms.put("EditTime", Calendar.getInstance());
			wParms.put("AuditTime", Calendar.getInstance());
			wParms.put("Status", wPartPoint.Status);
			wParms.put("Active", wPartPoint.Active);
			wParms.put("ERPID", wPartPoint.ERPID);
			wParms.put("QTType", wPartPoint.QTType);

			wParms.put("OperateContent", wPartPoint.OperateContent);

			wPartPoint.ID = this.Insert(StringUtils.Format("{0}.fpc_partpoint", wInstance.Result), wParms);

			FMCLineUnitDAO.getInstance().FMC_SyncLineUnit(wCompanyID, wLoginID, wPartPoint, wErrorCode);

			FMCConstants.RestStepTime();

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_AddPartPoint", "Function Exception:" + ex.toString());
		}
	}

	public void FPC_SavePartPoint(int wCompanyID, int wLoginID, FPCPartPoint wPartPoint,
			OutResult<Integer> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {

			if (wPartPoint == null || StringUtils.isEmpty(wPartPoint.Code) || StringUtils.isEmpty(wPartPoint.Name)) {
				wErrorCode.Result = MESException.Parameter.getValue();
				return;
			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 132000);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result != 0) {
				return;
			}
			FPCPartPoint wPartPointDB = this.FPC_CheckPartPointByCode(wCompanyID, wLoginID, wPartPoint, wErrorCode);
			if (wPartPointDB.ID > 0 || wPartPoint.Name.length() < 1) {
				wErrorCode.set(MESException.Logic.getValue());
				return;
			}

			Map<String, Object> wParms = new HashMap<String, Object>();
			String wSQLText = "";

			wSQLText = StringUtils.Format("update {0}.fpc_partpoint", wInstance.Result)
					+ " set Name=:Name,Code=:Code,FactoryID=:FactoryID,BusinessUnitID=:BusinessUnitID,StepType=:StepType,"
					+ " OperateContent=:OperateContent,WorkShopID=:WorkShopID,  LineID=:LineID,"
					+ " EditorID=:EditorID,EditTime=:EditTime,Status=:Status,ERPID=:ERPID,QTType=:QTType where ID=:ID ";
			wParms.clear();

			wParms.put("ID", wPartPoint.ID);

			wParms.put("Name", wPartPoint.Name);
			wParms.put("Code", wPartPoint.Code);
			wParms.put("StepType", wPartPoint.StepType);
			wParms.put("FactoryID", wPartPoint.FactoryID);
			wParms.put("WorkShopID", wPartPoint.WorkShopID);
			wParms.put("LineID", wPartPoint.LineID);
			wParms.put("PartID", wPartPoint.PartID);
			wParms.put("BusinessUnitID", wPartPoint.BusinessUnitID);
			wParms.put("EditorID", wLoginID);
			wParms.put("EditTime", Calendar.getInstance());
			wParms.put("Status", wPartPoint.Status);
			wParms.put("ERPID", wPartPoint.ERPID);
			wParms.put("QTType", wPartPoint.QTType);
			wParms.put("OperateContent", wPartPoint.OperateContent);
			wSQLText = this.DMLChange(wSQLText);
			nameJdbcTemplate.update(wSQLText, wParms);
			FMCLineUnitDAO.getInstance().FMC_SyncLineUnit(wCompanyID, wLoginID, wPartPoint, wErrorCode);

			FMCConstants.RestStepTime();

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_SavePartPoint", "Function Exception:" + ex.toString());
		}
	}

	public int FPC_DisablePartPoint(int wCompanyID, int wLoginID, FPCPartPoint wPartPoint,
			OutResult<Integer> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 132000);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Map<String, Object> wParms = new HashMap<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fpc_partpoint", wInstance.Result)
						+ " set AuditorID=:AuditorID, AuditTime=:AuditTime,Active=2 where ID=:ID ";
				wParms.clear();

				wParms.put("ID", wPartPoint.ID);

				wParms.put("AuditorID", wLoginID);
				wParms.put("AuditTime", Calendar.getInstance());
				wSQLText = this.DMLChange(wSQLText);

				FMCLineUnitDAO.getInstance().FMC_SyncLineUnit(wCompanyID, wLoginID, wPartPoint, wErrorCode);

				nameJdbcTemplate.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_DisablePartPoint", "Function Exception:" + ex.toString());
		}
		return wErrorCode.Result;
	}

	public int FPC_ActivePartPoint(int wCompanyID, int wLoginID, FPCPartPoint wPartPoint,
			OutResult<Integer> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {

			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 132000);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Map<String, Object> wParms = new HashMap<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fpc_partpoint", wInstance.Result)
						+ " set AuditorID=:AuditorID," + " AuditTime=:AuditTime,Active=1 where ID=:ID ";
				wParms.clear();

				wParms.put("ID", wPartPoint.ID);

				wParms.put("AuditorID", wLoginID);
				wParms.put("AuditTime", Calendar.getInstance());
				wSQLText = this.DMLChange(wSQLText);

				FMCLineUnitDAO.getInstance().FMC_SyncLineUnit(wCompanyID, wLoginID, wPartPoint, wErrorCode);

				nameJdbcTemplate.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_ActivePartPoint", "Function Exception:" + ex.toString());
		}
		return wErrorCode.Result;
	}

	public void FPC_DeletePartPoint(int wCompanyID, int wLoginID, FPCPartPoint wPartPoint,
			OutResult<Integer> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 132000);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Map<String, Object> wParms = new HashMap<String, Object>();

				wParms.put("ID", wPartPoint.ID);
				wParms.put("Active", 0);
				this.Delete(StringUtils.Format("{0}.fpc_partpoint", wInstance.Result), wParms);

				FMCLineUnitDAO.getInstance().FMC_DeleteLineUnitByUnitID(wCompanyID, wLoginID, wPartPoint.LineID, 0, 0,
						wPartPoint.ID, wPartPoint.PartID, APSUnitLevel.Step.getValue(), wErrorCode);

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_DisablePartPoint", "Function Exception:" + ex.toString());
		}
	}

	public int FPC_AuditPartPoint(int wCompanyID, int wLoginID, FPCPartPoint wPartPoint,
			OutResult<Integer> wErrorCode) {
		wErrorCode.set(0);
		// 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic, wLoginID, 132000);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Map<String, Object> wParms = new HashMap<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fpc_partpoint", wInstance.Result)
						+ " set AuditorID=:AuditorID," + "AuditTime=:AuditTime,Status=:Status where ID=:ID ";
				wParms.clear();

				wParms.put("ID", wPartPoint.ID);

				wParms.put("AuditorID", wLoginID);
				wParms.put("AuditTime", Calendar.getInstance());
				wParms.put("Status", wPartPoint.Status);
				wSQLText = this.DMLChange(wSQLText);
				

				nameJdbcTemplate.update(wSQLText, wParms);
				
				
				FMCLineUnitDAO.getInstance().FMC_SyncLineUnit(wCompanyID, wLoginID, wPartPoint, wErrorCode);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_AuditPartPoint", "Function Exception:" + ex.toString());
		}
		return wErrorCode.Result;
	}

	public FPCPartPoint FPC_QueryPartPoint(int wCompanyID, int wLoginID, int wID, String wCode,
			OutResult<Integer> wErrorCode) {
		FPCPartPoint wPartPointDB = new FPCPartPoint();
		wErrorCode.set(0);

		try {

			if (wCode == null)
				wCode = "";
			if (StringUtils.isEmpty(wCode) && wID <= 0) {
				wErrorCode.set(MESException.Parameter.getValue());
				return wPartPointDB;
			}

			List<FPCPartPoint> wPartPointList = this.FPC_QueryPartPointList(wCompanyID, wLoginID, wID, wCode, -1, 0, 0,
					0, 0, 0, 0, wErrorCode);
			if (wPartPointList == null || wPartPointList.size() <= 0)
				return wPartPointDB;

			wPartPointDB = wPartPointList[0];
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_QueryPartPointByID", "Function Exception:" + ex.toString());
		}
		return wPartPointDB;
	}

	public FPCPartPoint FPC_QueryPartPointByID(int wCompanyID, int wLoginID, int wID, OutResult<Integer> wErrorCode) {
		FPCPartPoint wPartPointDB = new FPCPartPoint();
		wErrorCode.set(0);

		try {
			wPartPointDB = this.FPC_QueryPartPoint(wCompanyID, wLoginID, wID, "", wErrorCode);
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_QueryPartPointByID", "Function Exception:" + ex.toString());
		}
		return wPartPointDB;
	}

	public List<FPCPartPoint> FPC_QueryPartPointList(int wCompanyID, int wLoginID, int wStepType, int wFactoryID,
			int wBusinessUnitID, int wWorkShopID, int wLineID, int wPartID, int wProductTypeID,
			OutResult<Integer> wErrorCode) {
		List<FPCPartPoint> wPartPointList = new ArrayList<FPCPartPoint>();
		wErrorCode.set(0);

		try {
			wPartPointList = this.FPC_QueryPartPointList(wCompanyID, wLoginID, 0, "", wStepType, wFactoryID,
					wBusinessUnitID, wWorkShopID, wLineID, wPartID, wProductTypeID, wErrorCode);
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_QueryPartPointList: Query DB",
					"Function Exception:" + ex.toString());
		}
		return wPartPointList;
	}

	private List<FPCPartPoint> FPC_QueryPartPointList(int wCompanyID, int wLoginID, int wID, String wCode,
			int wStepType, int wFactoryID, int wBusinessUnitID, int wWorkShopID, int wLineID, int wPartID,
			int wProductTypeID, OutResult<Integer> wErrorCode) {
		List<FPCPartPoint> wPartPointList = new ArrayList<FPCPartPoint>();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);
			if (wCode == null)
				wCode = "";
			if (wErrorCode.Result == 0) {

				// Step0:查询
				Map<String, Object> wParms = new HashMap<String, Object>();
				String wSQLText = "";
				wSQLText = StringUtils.Format(
						"Select t.*,t1.Name as BusinessUnit,t2.Name as ProductType,t3.Name as Factory  from {0}.fpc_partpoint t "
								+ " Left join  {0}.fmc_businessunit t1  on t.BusinessUnitID=t1.ID  "
								+ " Left join  {0}.fpc_producttype t2  on t.ProductTypeID=t2.ID  "
								+ " Left join  {0}.fmc_factory t3  on t.FactoryID=t3.ID  "
								+ " where t.ID > 0  AND ( :ID <=0 OR t.ID = :ID )"
								+ " and ( :BusinessUnitID <=0 OR t.BusinessUnitID = :BusinessUnitID )"
								+ " and ( :WorkShopID <=0 OR t.WorkShopID = :WorkShopID )"
								+ " and ( :LineID <=0 OR t.LineID = :LineID )"
								+ " and ( :PartID <=0 OR t.PartID = :PartID )"
								+ " and ( :ProductTypeID <=0 OR t.ProductTypeID = :ProductTypeID )"
								+ " and ( :StepType <= 0 OR t.StepType = :StepType )"
								+ " and ( :FactoryID <=0 OR t.FactoryID = :FactoryID )"
								+ " AND ( :Code='''' OR t.Code=:Code)",
						wInstance.Result);
				wParms.clear();
				wSQLText = this.DMLChange(wSQLText);

				wParms.put("ID", wID);
				wParms.put("Code", wCode);
				wParms.put("BusinessUnitID", wBusinessUnitID);
				wParms.put("ProductTypeID", wProductTypeID);
				wParms.put("WorkShopID", wWorkShopID);
				wParms.put("LineID", wLineID);
				wParms.put("PartID", wPartID);
				wParms.put("StepType", wStepType);
				wParms.put("FactoryID", wFactoryID);
				wSQLText = this.DMLChange(wSQLText);

				List<Map<String, Object>> wQueryResultList = nameJdbcTemplate.queryForList(wSQLText, wParms);

				for (Map<String, Object> wSqlDataReader : wQueryResultList) {
					FPCPartPoint wPartPointDB = new FPCPartPoint();
					wPartPointDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wPartPointDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wPartPointDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wPartPointDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);

					wPartPointDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
					wPartPointDB.WorkShopName = FMCConstants.GetFMCWorkShopName(wPartPointDB.WorkShopID);
					wPartPointDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
					wPartPointDB.LineName = FMCConstants.GetFMCLineName(wPartPointDB.LineID);
					wPartPointDB.PartID = StringUtils.parseInt(wSqlDataReader["PartID"]);
					wPartPointDB.PartName = FMCConstants.GetFPCPartName(wPartPointDB.PartID);

					wPartPointDB.StepType = StringUtils.parseInt(wSqlDataReader["StepType"]);
					wPartPointDB.Factory = StringUtils.parseString(wSqlDataReader["Factory"]);
					wPartPointDB.BusinessUnit = StringUtils.parseString(wSqlDataReader["BusinessUnit"]);
					wPartPointDB.ProductType = StringUtils.parseString(wSqlDataReader["ProductType"]);
					wPartPointDB.BusinessUnitID = StringUtils.parseInt(wSqlDataReader["BusinessUnitID"]);
					wPartPointDB.ProductTypeID = StringUtils.parseInt(wSqlDataReader["ProductTypeID"]);

					wPartPointDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wPartPointDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wPartPointDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wPartPointDB.CreateTime = StringUtils.parseCalendar(wSqlDataReader["CreateTime"]);
					wPartPointDB.AuditTime = StringUtils.parseCalendar(wSqlDataReader["AuditTime"]);
					wPartPointDB.EditTime = StringUtils.parseCalendar(wSqlDataReader["EditTime"]);
					wPartPointDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
					wPartPointDB.ERPID = StringUtils.parseInt(wSqlDataReader["ERPID"]);
					wPartPointDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wPartPointDB.QTType = StringUtils.parseInt(wSqlDataReader["QTType"]);

					wPartPointDB.Creator = BFCConstants.GetBMSEmployeeName(wPartPointDB.CreatorID);
					wPartPointDB.Auditor = BFCConstants.GetBMSEmployeeName(wPartPointDB.AuditorID);
					wPartPointDB.Editor = BFCConstants.GetBMSEmployeeName(wPartPointDB.EditorID);
					wPartPointList.add(wPartPointDB);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_QueryPartPointList: Query DB",
					"Function Exception:" + ex.toString());
		}
		return wPartPointList;
	}

	public FPCPartPoint FPC_QueryPartPointByCode(int wCompanyID, int wLoginID, String wCode,
			OutResult<Integer> wErrorCode) {
		FPCPartPoint wPartPointDB = new FPCPartPoint();
		wErrorCode.set(0);

		try {
			wPartPointDB = this.FPC_QueryPartPoint(wCompanyID, wLoginID, 0, wCode, wErrorCode);
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_QueryPartPointByID", "Function Exception:" + ex.toString());
		}
		return wPartPointDB;
	}

	public FPCPartPoint FPC_QueryPartPointByID(int wCompanyID, int wID) {
		FPCPartPoint wPartPoint = new FPCPartPoint();
		try {
			wPartPoint = FMCConstants.GetFPCStep(wID);
		} catch (Exception ex) {
			LoggerTool.SaveException("FPCService", "FPC_QueryPartPointByID ", "Function Exception:" + ex.toString());
		}
		return wPartPoint;
	}

	public String FPC_QueryPartPointNameByID(int wCompanyID, int wID) {
		String wPartPointName = "";
		try {
			wPartPointName = FMCConstants.GetFPCStepName(wID);
		} catch (Exception ex) {
			LoggerTool.SaveException("FPCService", "FPC_QueryPartPointNameByID ",
					"Function Exception:" + ex.toString());
		}
		return wPartPointName;
	}

	public List<FPCPartPoint> FPC_LoadPartPointList(int wCompanyID, OutResult<Integer> wErrorCode) {
		List<FPCPartPoint> wPartPointList = new ArrayList<FPCPartPoint>();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				String wSQLText = StringUtils.Format("Select * from {0}.fpc_partpoint ", wInstance.Result);

				Map<String, Object> wParms = new HashMap<String, Object>();
				wParms.clear();
				wSQLText = this.DMLChange(wSQLText);
				List<Map<String, Object>> wQueryResultList = nameJdbcTemplate.queryForList(wSQLText, wParms);
				for (Map<String, Object> wSqlDataReader : wQueryResultList) {
					FPCPartPoint wPartPointDB = new FPCPartPoint();
					wPartPointDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wPartPointDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wPartPointDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);

					wPartPointDB.StepType = StringUtils.parseInt(wSqlDataReader["StepType"]);
					wPartPointDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);
					wPartPointDB.BusinessUnitID = StringUtils.parseInt(wSqlDataReader["BusinessUnitID"]);

					wPartPointDB.AuditorID = StringUtils.parseInt(wSqlDataReader["AuditorID"]);
					wPartPointDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wPartPointDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wPartPointDB.CreateTime = StringUtils.parseCalendar(wSqlDataReader["CreateTime"]);
					wPartPointDB.AuditTime = StringUtils.parseCalendar(wSqlDataReader["AuditTime"]);
					wPartPointDB.EditTime = StringUtils.parseCalendar(wSqlDataReader["EditTime"]);
					wPartPointDB.Status = StringUtils.parseInt(wSqlDataReader["Status"]);
					wPartPointDB.ERPID = StringUtils.parseInt(wSqlDataReader["ERPID"]);
					wPartPointList.add(wPartPointDB);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			LoggerTool.SaveException("FPCService", "FPC_LoadPartPointList", "Function Exception:" + ex.toString());
		}
		return wPartPointList;
	}
}
}
