package com.mes.server.serviceimpl.dao.bms;

import java.util.List;
import java.util.DateTime;
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
import com.mes.server.service.po.bms.BMSPosition;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.shristool.LoggerTool;
import com.mes.server.service.utils.StringUtils;

public class BMSPositionDAO extends BaseDAO {
	private static BMSPositionDAO Instance = null;

	private BMSPositionDAO() {
		super();
	}

	public static BMSPositionDAO getInstance() {
		if (Instance == null)
			Instance = new BMSPositionDAO();
		return Instance;
	}

	private static int RoleFunctionID = 900300;

	private BMSPosition BMS_CheckPositionName(BMSEmployee wLoginUser, int wID, int wParentID, String wName,
			OutResult<Int32> wErrorCode) {
		BMSPosition wPosition = new BMSPosition();
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";
				if (wID > 0) {
					wSQLText = StringUtils.Format(
							"Select * from {0}.bms_position where ID!=@ID and Name=@Name and ParentID=@ParentID;",
							wInstance.Result);

				} else {
					wSQLText = StringUtils.Format(
							"Select * from {0}.bms_position where Name=@Name and ParentID=@ParentID;",
							wInstance.Result);

				}
				wParms.Add("ID", wID);
				wParms.Add("Name", wName);
				wParms.Add("ParentID", wParentID);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					wPosition.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wPosition.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wPosition.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wPosition.OperatorID = StringUtils.parseInt(wSqlDataReader["OperatorID"]);
					wPosition.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
					wPosition.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wPosition.ParentID = StringUtils.parseInt(wSqlDataReader["ParentID"]);
					wPosition.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wPosition.DutyID = StringUtils.parseInt(wSqlDataReader["DutyID"]);

					if (StringUtils.isEmpty(wPosition.Code)) {
						wPosition.Code = StringUtils.Format("GW{0}", String.format("%07d", wPosition.ID));
					}
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("BMSPositionDAO", "BMS_CheckPositionName", ex);
		}
		return wPosition;
	}

	public int BMS_AddPosition(BMSEmployee wLoginUser, BMSPosition wPosition, OutResult<Int32> wErrorCode) {
		int wID = 0;
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				BMSPosition wPositionO = this.BMS_CheckPositionName(wLoginUser, 0, wPosition.ParentID, wPosition.Name,
						wErrorCode);
				if (wPosition.Name.Length < 1 || wPositionO.ID > 0)
					wErrorCode.set(MESException.Logic.Value);
			}

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				String wSQLText = "";

				if (wPosition.ID <= 0) {
					wSQLText = StringUtils.Format("Insert Into {0}.bms_position", wInstance.Result)
							+ "(Name,OperatorID,EditTime,Active,DepartmentID,DutyID,ParentID) "
							+ " Values(@Name,@OperatorID,@EditTime,@Active,@DepartmentID,@DutyID,@ParentID);";
				} else {
					wSQLText = StringUtils.Format("Insert Into {0}.bms_position", wInstance.Result)
							+ "(ID,Name,OperatorID,EditTime,Active,DepartmentID,DutyID,ParentID) "
							+ " Values(@ID,@Name,@OperatorID,@EditTime,@Active,@DepartmentID,@DutyID,@ParentID);";
				}

				wParms.Clear();

				wParms.Add("ID", wPosition.ID);
				wParms.Add("Name", wPosition.Name);
				wParms.Add("OperatorID", wLoginUser.ID);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("Active", wPosition.Active);
				wParms.Add("DepartmentID", wPosition.DepartmentID);
				wParms.Add("DutyID", wPosition.DutyID);
				wParms.Add("ParentID", wPosition.ParentID);
				wSQLText = this.DMLChange(wSQLText);
				if (wPosition.ID <= 0) {
					KeyHolder keyHolder = new GeneratedKeyHolder();

					SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
					mDBPool.update(wSQLText, wSqlParameterSource, keyHolder);

					wPosition.ID = keyHolder.getKey().intValue();
				} else {
					mDBPool.update(wSQLText, wParms);
				}
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSPositionDAO", "BMS_AddPosition", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wID;
	}

	public int BMS_SavePosition(BMSEmployee wLoginUser, BMSPosition wPosition, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				BMSPosition wPositionO = this.BMS_CheckPositionName(wLoginUser, wPosition.ID, wPosition.ParentID,
						wPosition.Name, wErrorCode);
				if (wPosition.Name.Length < 1 || wPositionO.ID > 0)
					wErrorCode.set(MESException.Logic.Value);
			}

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = StringUtils.Format("Update {0}.bms_position", wInstance.Result)
						+ " Set Name=@Name,Code=@Code,OperatorID=@OperatorID,DepartmentID=@DepartmentID,"
						+ "EditTime=@EditTime,ParentID=@ParentID,DutyID=@DutyID where ID=@ID and Active=0;";
				wParms.Clear();

				wParms.Add("Name", wPosition.Name);
				wParms.Add("OperatorID", wLoginUser.ID);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("ParentID", wPosition.ParentID);
				wParms.Add("DepartmentID", wPosition.DepartmentID);
				wParms.Add("DutyID", wPosition.DutyID);
				wParms.Add("ID", wPosition.ID);
				wParms.Add("Code", StringUtils.Format("GW{0}", String.format("%07d", wPosition.ID)));
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSPositionDAO", "BMS_SavePosition", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	public int BMS_ActivePositionByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				String wSQLText = StringUtils.Format("Update {0}.bms_position", wInstance.Result)
						+ " Set Code=@Code, OperatorID=@OperatorID,EditTime=@EditTime,Active=1 where ID=@ID";
				wParms.Clear();

				wParms.Add("OperatorID", wLoginUser.ID);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("ID", wID);

				wParms.Add("Code", StringUtils.Format("GW{0}", String.format("%07d", wID)));
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSPositionDAO", "BMS_ActivePositionByID", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	public int BMS_DisablePositionByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				String wSQLText = StringUtils.Format("Update {0}.bms_position", wInstance.Result)
						+ " Set  Code=@Code,OperatorID=@OperatorID,EditTime=@EditTime,Active=2 where ID=@ID;";
				wParms.Clear();

				wParms.Add("OperatorID", wLoginUser.ID);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("ID", wID);
				wParms.Add("Code", StringUtils.Format("GW{0}", String.format("%07d", wID)));
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSPositionDAO", "BMS_DisablePositionByID",
					ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	public void BMS_DeletePositionByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode) {
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("ID", wID);
			wParms.Add("Active", 0);
			this.Delete(StringUtils.Format(" {0}.bms_position ", wInstance.Result), wParms);
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSPositionDAO", "BMS_DeletePositionByID", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
	}

	public List<BMSPosition> BMS_QueryPositionList(BMSEmployee wLoginUser, int wActive, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		List<BMSPosition> wPositionList = new List<BMSPosition>();

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				String wSQLText = StringUtils.Format(
						"Select * from {0}.bms_position where ID>0 AND (@Active<=0 or  Active=@Active);  ",
						wInstance.Result);
				wParms.Clear();
				wParms.Add("Active", wActive);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					BMSPosition wPosition = new BMSPosition();
					wPosition.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wPosition.Name = StringUtils.parseString(wSqlDataReader["Name"]);

					wPosition.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wPosition.OperatorID = StringUtils.parseInt(wSqlDataReader["OperatorID"]);
					wPosition.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
					wPosition.PrevDepartmentID = BFCConstants.GetBMSDepartment(wPosition.DepartmentID).ParentID;
					wPosition.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wPosition.ParentID = StringUtils.parseInt(wSqlDataReader["ParentID"]);
					wPosition.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wPosition.DutyID = StringUtils.parseInt(wSqlDataReader["DutyID"]);

					wPosition.Operator = BFCConstants.GetBMSEmployeeName(wPosition.OperatorID);
					if (StringUtils.isEmpty(wPosition.Code)) {
						wPosition.Code = StringUtils.Format("GW{0}", String.format("%07d", wPosition.ID));
					}
					wPositionList.Add(wPosition);
				}
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSPositionDAO", "BMS_QueryPositionList", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wPositionList;
	}

	public BMSPosition BMS_QueryPositionByID(BMSEmployee wLoginUser, int wID, String wCode,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		BMSPosition wPosition = new BMSPosition();

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				String wSQLText = StringUtils.Format(
						"Select * from {0}.bms_position where ID=@ID   or ( @Code !='''' and  Code=@Code);",
						wInstance.Result);
				wParms.Clear();
				wParms.Add("ID", wID);
				wParms.Add("Code", wCode);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					wPosition.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wPosition.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wPosition.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wPosition.OperatorID = StringUtils.parseInt(wSqlDataReader["OperatorID"]);
					wPosition.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
					wPosition.PrevDepartmentID = BFCConstants.GetBMSDepartment(wPosition.DepartmentID).ParentID;
					wPosition.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wPosition.ParentID = StringUtils.parseInt(wSqlDataReader["ParentID"]);
					wPosition.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wPosition.DutyID = StringUtils.parseInt(wSqlDataReader["DutyID"]);
					wPosition.Operator = BFCConstants.GetBMSEmployeeName(wPosition.OperatorID);
					if (StringUtils.isEmpty(wPosition.Code)) {
						wPosition.Code = StringUtils.Format("GW{0}", String.format("%07d", wPosition.ID));
					}
				}

			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSPositionDAO", "BMS_QueryPositionByID", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wPosition;
	}
}
