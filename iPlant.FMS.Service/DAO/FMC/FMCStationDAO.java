package com.mes.server.serviceimpl.dao.fmc;

import java.util.List;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import com.mes.server.service.mesenum.BFCQRTypes;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bfc.BFCPlaceQRStruct;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.fmc.FMCLineUnit;
import com.mes.server.service.po.fmc.FMCStation;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.serviceimpl.utils.fmc.FMCConstants;
import com.mes.server.shristool.LoggerTool;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.service.utils.StringUtils;

public class FMCStationDAO extends BaseDAO {
	private static FMCStationDAO Instance = null;

	private FMCStationDAO() {
		super();
	}

	public static FMCStationDAO getInstance() {
		if (Instance == null)
			Instance = new FMCStationDAO();
		return Instance;
	}

	private FMCStation FMC_CheckStationByCode(BMSEmployee wLoginUser, FMCStation wStation,
			OutResult<Int32> wErrorCode) {
		FMCStation wStationDB = new FMCStation();
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = StringUtils.Format("Select ID from {0}.fmc_station ", wInstance.Result)
						+ " where ID!=@ID and LineID=@LineID and WorkShopID=@WorkShopID"
						+ " and AreaID=@AreaID  and Code=@Code";
				wParms.Clear();
				wParms.Add("ID", wStation.ID);
				wParms.Add("AreaID", wStation.AreaID);
				wParms.Add("Code", wStation.Code);
				wParms.Add("LineID", wStation.LineID);
				wParms.Add("WorkShopID", wStation.WorkShopID);

				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					wStationDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("FMCService", "FMC_CheckLineByName", "Function Exception:" + ex.ToString());
		}
		return wStationDB;
	}

	public void FMC_AddStation(BMSEmployee wLoginUser, FMCStation wStation, OutResult<Int32> wErrorCode) {

		try {
			wErrorCode.set(0);

			if (wStation == null || StringUtils.isEmpty(wStation.Code)) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, 131011);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result != 0)
				return;

			if (BFCConstants.getPlaceQRTypeByCode(wStation.Code) != (int)BFCQRTypes.Station()) {
				List<BFCPlaceQRStruct> wBFCPlaceQRStructList = BFCConstants.getPlaceQRTypeList();
				Optional<BFCPlaceQRStruct> wBFCPlaceQRStructOptional = wBFCPlaceQRStructList.stream()
						.filter(p -> p.getQRType() == (int)BFCQRTypes.Station()).findFirst();
				BFCPlaceQRStruct wBFCPlaceQRStruct = new BFCPlaceQRStruct();
				if (wBFCPlaceQRStructOptional.isPresent()) {
					wBFCPlaceQRStruct = wBFCPlaceQRStructOptional.get();
					if (!wStation.Code.startsWith(wBFCPlaceQRStruct.getQRStart()))
						wStation.Code = wBFCPlaceQRStruct.getQRStart() + wStation.Code;
					if (!wStation.Code.endsWith(wBFCPlaceQRStruct.getQREnd()))
						wStation.Code = wStation.Code + wBFCPlaceQRStruct.getQREnd();

					if (wStation.Code.Length > wBFCPlaceQRStruct.getMaxLength()) {
						wErrorCode.set(MESException.Parameter.Value);
						return;
					}
					if (wStation.Code.Length < wBFCPlaceQRStruct.getMinLength()) {
						wErrorCode.set(MESException.Parameter.Value);
						return;
					}
				}

			}

			FMCStation wStationDB = this.FMC_CheckStationByCode(wLoginUser, wStation, wErrorCode);
			if (wStationDB.ID > 0) {
				wErrorCode.set(MESException.Duplication.Value);
				wStation.ID = wStationDB.ID;
				return;
			}

			List<FMCStation> wFMCStationList = this.FMC_QueryStationList(wLoginUser, "", wStation.WorkShopID,
					wStation.LineID, wStation.AreaID, -1, wErrorCode);

			wStation.Name = this.CreateNewName(wStation.Name,
					wFMCStationList.stream().map(p -> p.Name).collect(Collectors.toList()));

			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			String wSQLText = "";

			wSQLText = StringUtils.Format("Insert Into {0}.fmc_station", wInstance.Result)
					+ "(Name,Code,WorkShopID,LineID,AreaID,CreatorID,EditorID,"
					+ " CreateTime,EditTime,Active,IPTModuleID,CERT,ENVIR,TestMethod,IsCalcPD) "
					+ " Values(@Name,@Code,@WorkShopID,@LineID,@AreaID,@CreatorID,@EditorID,"
					+ " now(),now(), @Active,@IPTModuleID,@CERT,@ENVIR,@TestMethod,@IsCalcPD);";
			wParms.Clear();

			wParms.Add("Name", wStation.Name);
			wParms.Add("Code", wStation.Code);
			wParms.Add("WorkShopID", wStation.WorkShopID);
			wParms.Add("LineID", wStation.LineID);
			wParms.Add("AreaID", wStation.AreaID);
			wParms.Add("CreatorID", wLoginUser.ID);
			wParms.Add("EditorID", wLoginUser.ID);
			wParms.Add("CERT", StringUtils.Join(";", wStation.CERT));
			wParms.Add("ENVIR", StringUtils.Join(";", wStation.ENVIR));
			wParms.Add("TestMethod", StringUtils.Join(";", wStation.TestMethod));

			wParms.Add("Active", wStation.Active);
			wParms.Add("IsCalcPD", wStation.IsCalcPD);
			wParms.Add("IPTModuleID", wStation.IPTModuleID);
			wSQLText = this.DMLChange(wSQLText);
			KeyHolder keyHolder = new GeneratedKeyHolder();

			SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
			mDBPool.update(wSQLText, wSqlParameterSource, keyHolder);

			wStation.ID = keyHolder.getKey().intValue();

			FMCConstants.RestStationTime();

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("FMCService", "FMC_AddStation", "Function Exception:" + ex.ToString());
		}

	}

	public void FMC_SaveStation(BMSEmployee wLoginUser, FMCStation wStation, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, 131011);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				FMCStation wStationDB = this.FMC_CheckStationByCode(wLoginUser, wStation, wErrorCode);
				if (wStationDB.ID > 0 || wStation.Name.Length < 1 || wStation.Code.Length < 1)
					wErrorCode.set(MESException.Logic.Value);
			}
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_station", wInstance.Result)
						+ " set Name=@Name,Code=@Code,WorkShopID=@WorkShopID,LineID=@LineID,"
						+ " AreaID=@AreaID,CERT=@CERT,ENVIR=@ENVIR,TestMethod=@TestMethod,IsCalcPD=@IsCalcPD,"
						+ " EditorID=@EditorID,EditTime=now(),Active=@Active,IPTModuleID=@IPTModuleID where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wStation.ID);
				wParms.Add("Name", wStation.Name);
				wParms.Add("Code", wStation.Code);
				wParms.Add("Active", wStation.Active);
				wParms.Add("WorkShopID", wStation.WorkShopID);
				wParms.Add("AreaID", wStation.AreaID);
				wParms.Add("LineID", wStation.LineID);
				wParms.Add("EditorID", wLoginUser.ID);
				wParms.Add("IsCalcPD", wStation.IsCalcPD);
				wParms.Add("IPTModuleID", wStation.IPTModuleID);
				wParms.Add("CERT", StringUtils.Join(";", wStation.CERT));
				wParms.Add("ENVIR", StringUtils.Join(";", wStation.ENVIR));
				wParms.Add("TestMethod", StringUtils.Join(";", wStation.TestMethod));
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);

				FMCConstants.RestStationTime();

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("FMCService", "FMC_SaveStation", "Function Exception:" + ex.ToString());
		}

	}

	public void FMC_DisableStation(BMSEmployee wLoginUser, FMCStation wStation, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, 131012);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_station", wInstance.Result) + " set EditorID=@EditorID,"
						+ " EditTime=now(),Active=2 where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wStation.ID);
				wParms.Add("EditorID", wLoginUser.ID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("FMCService", "FMC_DisableStation", "Function Exception:" + ex.ToString());
		}

	}

	public void FMC_ActiveStation(BMSEmployee wLoginUser, FMCStation wStation, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, 131012);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_station", wInstance.Result) + " set EditorID=@EditorID,"
						+ " EditTime=now(),Active=1 where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wStation.ID);

				wParms.Add("EditorID", wLoginUser.ID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("FMCService", "FMC_ActiveStation", "Function Exception:" + ex.ToString());
		}

	}

	public FMCStation FMC_QueryStation(BMSEmployee wLoginUser, int wID, String wCode, OutResult<Int32> wErrorCode) {
		FMCStation wStationDB = new FMCStation();
		try {
			wErrorCode.set(0);
			if (wID > 0) {
				List<FMCStation> wFMCStationList = this.FMC_QueryStationList(wLoginUser, wID, "", "", -1, -1, -1, -1,
						wErrorCode);
				if (wFMCStationList != null && wFMCStationList.Count > 0) {
					wStationDB = wFMCStationList.get(0);
				}
				return wStationDB;
			}
			if (StringUtils.isNotEmpty(wCode)) {
				List<FMCStation> wFMCStationList = this.FMC_QueryStationList(wLoginUser, -1, wCode, "", -1, -1, -1, -1,
						wErrorCode);
				if (wFMCStationList != null && wFMCStationList.Count > 0) {
					wStationDB = wFMCStationList.get(0);
				}
				return wStationDB;
			}

		} catch (Exception ex) {
			LoggerTool.SaveException("FMCService", "FMC_QueryStation", "Function Exception:" + ex.ToString());
			wErrorCode.set(MESException.Exception.Value);
		}
		return wStationDB;
	}

	public List<FMCStation> FMC_QueryStationList(BMSEmployee wLoginUser, String wName, int wWorkShopID, int wLineID,
			int wAreaID, int wActive, OutResult<Int32> wErrorCode) {
		List<FMCStation> wStationList = new List<FMCStation>();
		wErrorCode.set(0);

		try {
			wStationList = this.FMC_QueryStationList(wLoginUser, -1, "", wName, wWorkShopID, wLineID, wAreaID, wActive,
					wErrorCode);

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("FMCService", "FMC_QueryStationList: Query DB",
					"Function Exception:" + ex.ToString());
		}
		return wStationList;
	}

	private List<FMCStation> FMC_QueryStationList(BMSEmployee wLoginUser, int wID, String wCode, String wName,
			int wWorkShopID, int wLineID, int wAreaID, int wActive, OutResult<Int32> wErrorCode) {
		List<FMCStation> wStationList = new List<FMCStation>();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = StringUtils.Format("Select t.*,t1.Name as AreaName,t1.Code as AreaCode,"
						+ " t2.Name as WorkShop ,t3.Name as Line,t4.Name as Factory,t5.Name as BusinessUnit  from {0}.fmc_station t "
						+ " left join {0}.fmc_workarea t1 on t.AreaID=t1.ID "
						+ " left join {0}.fmc_workshop t2 on t.WorkShopID=t2.ID  "
						+ " left join {0}.fmc_line t3 on t.LineID=t3.ID "
						+ " left join {0}.fmc_factory t4 on t2.FactoryID=t4.ID  "
						+ " left join {0}.fmc_businessunit t5 on t2.BusinessUnitID=t5.ID  "
						+ " where 1=1  and ( @ID<=0 OR t.ID=@ID )"
						+ " AND (@Code='' or t.Code=@Code)  AND (@Name='' or t.Name=@Name)"
						+ " and (@WorkShopID<=0 or t.WorkShopID=@WorkShopID ) and ( @AreaID<=0 OR t.AreaID=@AreaID )"
						+ " and (@LineID<=0 or t.LineID=@LineID ) and (@Active<=0 or t.Active=@Active )",
						wInstance.Result);

				wParms.Add("ID", wID);
				wParms.Add("Code", wCode);
				wParms.Add("Name", wName);
				wParms.Add("WorkShopID", wWorkShopID);
				wParms.Add("LineID", wLineID);
				wParms.Add("Active", wActive);
				wParms.Add("AreaID", wAreaID);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					FMCStation wStationDB = new FMCStation();
					wStationDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wStationDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wStationDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wStationDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
					wStationDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
					wStationDB.IsCalcPD = StringUtils.parseInt(wSqlDataReader["IsCalcPD"]);
					wStationDB.Line = StringUtils.parseString(wSqlDataReader["Line"]);
					wStationDB.WorkShop = StringUtils.parseString(wSqlDataReader["WorkShop"]);
					wStationDB.AreaID = StringUtils.parseInt(wSqlDataReader["AreaID"]);
					wStationDB.CERT = StringUtils.splitList(StringUtils.parseString(wSqlDataReader["CERT"]), ";");
					wStationDB.ENVIR = StringUtils.splitList(StringUtils.parseString(wSqlDataReader["ENVIR"]), ";");
					wStationDB.TestMethod = StringUtils
							.splitList(StringUtils.parseString(wSqlDataReader["TestMethod"]), ";");
					wStationDB.Factory = StringUtils.parseString(wSqlDataReader["Factory"]);
					wStationDB.BusinessUnit = StringUtils.parseString(wSqlDataReader["BusinessUnit"]);
					wStationDB.AreaName = StringUtils.parseString(wSqlDataReader["AreaName"]);
					wStationDB.AreaCode = StringUtils.parseString(wSqlDataReader["AreaCode"]);
					wStationDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wStationDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wStationDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wStationDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wStationDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wStationDB.IPTModuleID = StringUtils.parseInt(wSqlDataReader["IPTModuleID"]);
					wStationDB.Creator = BFCConstants.GetBMSEmployeeName(wStationDB.CreatorID);
					wStationDB.Editor = BFCConstants.GetBMSEmployeeName(wStationDB.EditorID);

					wStationList.Add(wStationDB);
				}

			}

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("FMCService", "FMC_QueryStationList: Query DB",
					"Function Exception:" + ex.ToString());
		}
		return wStationList;
	}

	public boolean FMC_IsLineContainStation(BMSEmployee wLoginUser, int wLineID, int wPartID, int wStepID,
			int wStationID, OutResult<Int32> wErrorCode) {
		boolean wIsContain = false;
		try {

			List<FMCLineUnit> wFMCLineUnitList = FMCLineUnitDAO.getInstance()
					.FMC_QueryLineUnitListByLineID(wLoginUser.getCompanyID(), wLineID, 0, 0, false, wErrorCode);

			for (FMCLineUnit wPartUnit : wFMCLineUnitList) {
				if (wPartID > 0 && wPartUnit.UnitID != wPartID)
					continue;

				for (FMCLineUnit wStepUnit : wPartUnit.UnitList) {
					if (wStepID > 0 && wStepUnit.UnitID != wStepID)
						continue;

					for (FMCLineUnit wStationUnit : wStepUnit.UnitList) {
						if (wStationUnit.UnitID == wStationID) {
							wIsContain = true;
							break;
						}
					}
					if (wIsContain)
						break;
				}
				if (wIsContain)
					break;
			}

		} catch (

		Exception ex) {
			wErrorCode.set(MESException.Exception.Value);
			LoggerTool.SaveException("FMCService", "FMC_IsLineContainStation ", "Function Exception:" + ex.ToString());
		}
		return wIsContain;
	}
}
