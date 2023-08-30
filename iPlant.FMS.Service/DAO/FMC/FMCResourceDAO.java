package com.mes.server.serviceimpl.dao.fmc;

import java.util.List;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import com.mes.server.service.mesenum.FMCResourceType;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.fmc.FMCResource;
import com.mes.server.shristool.LoggerTool;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.utils.dms.DMSConstants;
import com.mes.server.service.utils.StringUtils;

public class FMCResourceDAO extends BaseDAO {
	private static FMCResourceDAO Instance = null;

	private FMCResourceDAO() {
		super();
	}

	public static FMCResourceDAO getInstance() {
		if (Instance == null)
			Instance = new FMCResourceDAO();
		return Instance;
	}

	// 制造资源
	private FMCResource FMC_CheckResourceByName(BMSEmployee wLoginUser, FMCResource wResource,
			OutResult<Int32> wErrorCode) {
		FMCResource wResourceDB = new FMCResource();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = StringUtils.Format("Select ID from {0}.fmc_resource ", wInstance.Result)
						+ " where ID!=@ID and StationID=@StationID and Type=@Type and ResourceID=@ResourceID;";
				wParms.Clear();
				wParms.Add("ID", wResource.ID);
				wParms.Add("StationID", wResource.StationID);
				wParms.Add("Type", wResource.Type);
				wParms.Add("ResourceID", wResource.ResourceID);

				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					wResourceDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_CheckResourceByName", ex);
		}
		return wResourceDB;
	}

	public void FMC_AddResource(BMSEmployee wLoginUser, FMCResource wResource, OutResult<Int32> wErrorCode) {

		try {
			wErrorCode.set(0);
			if (wResource == null || wResource.StationID <= 0 || wResource.ResourceID <= 0 || wResource.Type <= 0) {
				wErrorCode.set(MESException.Logic.Value);
				return;
			}

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, 131101);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				FMCResource wResourceDB = this.FMC_CheckResourceByName(wLoginUser, wResource, wErrorCode);
				if (wResourceDB.ID > 0) {
					wErrorCode.set(MESException.Duplication.Value);
					wResource.ID = wResourceDB.ID;
				}

			}
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("Insert Into {0}.fmc_resource", wInstance.Result)
						+ "(StationID,Type,ResourceID,CreatorID,EditorID,CreateTime,EditTime,Active) "
						+ " Values(@StationID,@Type,@ResourceID,@CreatorID,@EditorID, now(), now(),@Active);";
				wParms.Clear();

				wParms.Add("StationID", wResource.StationID);
				wParms.Add("Type", wResource.Type);
				wParms.Add("ResourceID", wResource.ResourceID);
				wParms.Add("CreatorID", wLoginUser.ID);
				wParms.Add("EditorID", wLoginUser.ID);
				wParms.Add("Active", wResource.Active);
				wSQLText = this.DMLChange(wSQLText);
				KeyHolder keyHolder = new GeneratedKeyHolder();

				SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
				mDBPool.update(wSQLText, wSqlParameterSource, keyHolder);

				wResource.ID = keyHolder.getKey().intValue();

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_AddResource", ex);
		}
	}

	public void FMC_SaveResource(BMSEmployee wLoginUser, FMCResource wResource, OutResult<Int32> wErrorCode) {

		try {
			wErrorCode.set(0);
			if (wResource == null || wResource.StationID <= 0 || wResource.ResourceID <= 0 || wResource.Type <= 0) {
				wErrorCode.set(MESException.Logic.Value);
				return;
			}
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, 131101);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				FMCResource wResourceDB = this.FMC_CheckResourceByName(wLoginUser, wResource, wErrorCode);
				if (wResourceDB.ID > 0)
					wErrorCode.set(MESException.Logic.Value);
			}
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_resource", wInstance.Result)
						+ " set StationID=@StationID,ResourceID=@ResourceID,Type=@Type, EditorID=@EditorID,"
						+ " EditTime=now(),Active=@Active  where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wResource.ID);

				wParms.Add("StationID", wResource.StationID);
				wParms.Add("Type", wResource.Type);
				wParms.Add("ResourceID", wResource.ResourceID);
				wParms.Add("EditorID", wLoginUser.ID);
				wParms.Add("Active", wResource.Active);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);

			logger.Error("FMC_SaveResource", ex);
		}
	}

	public void FMC_DisableResource(BMSEmployee wLoginUser, FMCResource wResource, OutResult<Int32> wErrorCode) {

		try {
			wErrorCode.set(0);
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, 131102);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_resource", wInstance.Result) + " set EditorID=@EditorID,"
						+ " EditTime=now(),Active=2 where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wResource.ID);
				wParms.Add("EditorID", wLoginUser.ID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_DisableResource", ex);
		}
	}

	public void FMC_DisableResource(BMSEmployee wLoginUser, int wStationID, OutResult<Int32> wErrorCode) {

		try {
			wErrorCode.set(0);
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, 131102);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_resource", wInstance.Result) + " set EditorID=@EditorID,"
						+ " EditTime=now(),Active=2 where ID>0 AND StationID=@StationID;";
				wParms.Clear();

				wParms.Add("StationID", wStationID);
				wParms.Add("EditorID", wLoginUser.ID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_DisableResource", ex);
		}
	}

	public void FMC_ActiveResource(BMSEmployee wLoginUser, FMCResource wResource, OutResult<Int32> wErrorCode) {

		try {
			wErrorCode.set(0);
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, 131102);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";

				wSQLText = StringUtils.Format("update {0}.fmc_resource", wInstance.Result) + " set EditorID=@EditorID,"
						+ " EditTime=now(),Active=1 where ID=@ID ";
				wParms.Clear();

				wParms.Add("ID", wResource.ID);

				wParms.Add("EditorID", wLoginUser.ID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_ActiveResource", ex);
		}
	}

	public FMCResource FMC_QueryResourceByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode) {
		FMCResource wResourceDB = new FMCResource();

		try {
			wErrorCode.set(0);
			if (wID > 0) {
				List<FMCResource> wFMCResourceList = this.FMC_QueryResourceList(wLoginUser, wID, -1, -1, -1, -1, -1, -1,
						-1, wErrorCode);
				if (wFMCResourceList != null && wFMCResourceList.Count > 0) {
					wResourceDB = wFMCResourceList[0];
				}
				return wResourceDB;
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryResourceByID", ex);

		}
		return wResourceDB;
	}

	public List<FMCResource> FMC_QueryResourceList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID, int wStationID,
			int wAreaID, int wResourceID, int wType, int wActive, OutResult<Int32> wErrorCode) {
		List<FMCResource> wResourceList = new List<FMCResource>();

		try {

			wResourceList = this.FMC_QueryResourceList(wLoginUser, -1, wWorkShopID, wLineID, wStationID, wAreaID,
					wResourceID, wType, wActive, wErrorCode);

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryResourceList: Query DB",
					ex);
		}
		return wResourceList;
	}

	private List<FMCResource> FMC_QueryResourceList(BMSEmployee wLoginUser, int wID, int wWorkShopID, int wLineID,
			int wStationID, int wAreaID, int wResourceID, int wType, int wActive, OutResult<Int32> wErrorCode) {
		List<FMCResource> wResourceList = new List<FMCResource>();

		try {
			wErrorCode.set(0);
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {

				// Step0:查询
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = StringUtils.Format("Select t.*,t1.WorkShopID,t1.LineID,t1.Name asStationName,"
						+ " t1.Code as StationCode,t2.Name as WorkShopName,t3.Name as LineName"
						+ " from {0}.fmc_resource t inner join {0}.fmc_station t1 on t.StationID=t1.ID "
						+ " left join {0}.fmc_workshop t2 on t1.WorkShopID=t2.ID  "
						+ " left join {0}.fmc_line t3 on t1.LineID=t3.ID where 1=1"
						+ " and ( @ID<=0 OR t.ID=@ID ) and (@ResourceID <=0 or t.ResourceID=@ResourceID) "
						+ " AND (@StationID <=0  or t.StationID=@StationID)  AND (@Type <=0  or t.Type=@Type)"
						+ " and (@WorkShopID<=0 or t1.WorkShopID=@WorkShopID ) and ( @AreaID<=0 OR t1.AreaID=@AreaID )"
						+ " and (@LineID<=0 or t1.LineID=@LineID ) and (@Active<=0 or t.Active=@Active )",

						wInstance.Result);

				wParms.Add("ID", wID);
				wParms.Add("ResourceID", wResourceID);
				wParms.Add("StationID", wStationID);
				wParms.Add("Type", wType);
				wParms.Add("WorkShopID", wWorkShopID);
				wParms.Add("LineID", wLineID);
				wParms.Add("Active", wActive);
				wParms.Add("AreaID", wAreaID);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					FMCResource wResourceDB = new FMCResource();
					wResourceDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wResourceDB.Name = "";
					wResourceDB.Code = "";
					wResourceDB.StationID = StringUtils.parseInt(wSqlDataReader["StationID"]);

					wResourceDB.StationName = StringUtils.parseString(wSqlDataReader["StationName"]);
					wResourceDB.StationCode = StringUtils.parseString(wSqlDataReader["StationCode"]);

					wResourceDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
					wResourceDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
					wResourceDB.LineName = StringUtils.parseString(wSqlDataReader["LineName"]);
					wResourceDB.WorkShopName = StringUtils.parseString(wSqlDataReader["WorkShopName"]);

					wResourceDB.ResourceID = StringUtils.parseInt(wSqlDataReader["ResourceID"]);
					wResourceDB.Type = StringUtils.parseInt(wSqlDataReader["Type"]);
					wResourceDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
					wResourceDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
					wResourceDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wResourceDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wResourceDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wResourceList.Add(wResourceDB);

					switch (FMCResourceType.getEnumType(wResourceDB.Type)) {
					case Device:
						wResourceDB.Code = DMSConstants.GetDMSDeviceLedger(wResourceDB.ResourceID).Code;
						wResourceDB.Name = DMSConstants.GetDMSDeviceLedger(wResourceDB.ResourceID).Name;
						break;
					case Spare:
						wResourceDB.Code = DMSConstants.GetDMSSpareLedger(wResourceDB.ResourceID).Code;
						wResourceDB.Name = DMSConstants.GetDMSSpareLedger(wResourceDB.ResourceID).Name;
						break;
					case Measure:
						wResourceDB.Code = DMSConstants.GetDMSMeasureLedger(wResourceDB.ResourceID).Code;
						wResourceDB.Name = DMSConstants.GetDMSMeasureLedger(wResourceDB.ResourceID).Name;
						break;
					case Parts:

						break;
					case Default:

						break;

					default:
						break;
					}

				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			logger.Error("FMC_QueryResourceList: Query DB",
					ex);
		}
		return wResourceList;
	}

}
