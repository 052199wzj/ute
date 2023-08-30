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
import com.mes.server.service.po.bms.BMSDepartment;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.shristool.LoggerTool;
import com.mes.server.service.utils.StringUtils;

public class BMSDepartmentDAO extends BaseDAO {
	private static BMSDepartmentDAO Instance = null;

	private BMSDepartmentDAO() {
		super();
	}

	public static BMSDepartmentDAO getInstance() {
		if (Instance == null)
			Instance = new BMSDepartmentDAO();
		return Instance;
	}

	private static int RoleFunctionID = 900200;

	private BMSDepartment BMS_CheckDepartmentName(BMSEmployee wLoginUser, int wID, int wParentID, String wName,
			OutResult<Int32> wErrorCode) {
		BMSDepartment wDepartment = new BMSDepartment();
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = "";
				if (wID > 0) {
					wSQLText = StringUtils.Format(
							"Select * from {0}.bms_department where ID!=@ID and Name=@Name and ParentID=@ParentID ;",
							wInstance.Result);

				} else {
					wSQLText = StringUtils.Format(
							"Select * from {0}.bms_department where Name=@Name and ParentID=@ParentID;",
							wInstance.Result);

				}
				wParms.Add("ID", wID);
				wParms.Add("Name", wName);
				wParms.Add("ParentID", wParentID);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					wDepartment.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wDepartment.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wDepartment.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wDepartment.OperatorID = StringUtils.parseInt(wSqlDataReader["OperatorID"]);
					wDepartment.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wDepartment.ParentID = StringUtils.parseInt(wSqlDataReader["ParentID"]);
					wDepartment.Type = StringUtils.parseInt(wSqlDataReader["Type"]);
					wDepartment.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					if (StringUtils.isEmpty(wDepartment.Code)) {
						wDepartment.Code = StringUtils.Format("BM{0}", String.format("%06d", wDepartment.ID));
					}
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("BMSDepartmentDAO", "BMS_CheckDepartmentName",
					ex);
		}
		return wDepartment;
	}

	public void BMS_AddDepartment(BMSEmployee wLoginUser, BMSDepartment wDepartment, OutResult<Int32> wErrorCode) {

		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				BMSDepartment wDepartmentO = this.BMS_CheckDepartmentName(wLoginUser, 0, wDepartment.ParentID,
						wDepartment.Name, wErrorCode);
				if (wDepartment.Name.Length < 1 || wDepartmentO.ID > 0)
					wErrorCode.set(MESException.Logic.Value);
			}

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				String wSQLText = "";

				if (wDepartment.ID <= 0) {
					wSQLText = StringUtils.Format("Insert Into {0}.bms_department", wInstance.Result)
							+ "(Name,OperatorID,EditTime,Active,ParentID,Type) "
							+ " Values(@Name,@OperatorID,@EditTime,@Active,@ParentID,@Type);";
				} else {
					wSQLText = StringUtils.Format("Insert Into {0}.bms_department", wInstance.Result)
							+ "(ID,Name,OperatorID,EditTime,Active,ParentID,Type) "
							+ " Values(@ID,@Name,@OperatorID,@EditTime,@Active,@ParentID,@Type);";
				}

				wParms.Clear();
				wParms.Add("ID", wDepartment.ID);
				wParms.Add("Name", wDepartment.Name);
				wParms.Add("OperatorID", wLoginUser.ID);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("Active", wDepartment.Active);
				wParms.Add("ParentID", wDepartment.ParentID);
				wParms.Add("Type", wDepartment.Type);
				wSQLText = this.DMLChange(wSQLText);

				if (wDepartment.ID <= 0) {
					KeyHolder keyHolder = new GeneratedKeyHolder();

					SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
					mDBPool.update(wSQLText, wSqlParameterSource, keyHolder);

					wDepartment.ID = keyHolder.getKey().intValue();
				} else {
					mDBPool.update(wSQLText, wParms);
				}
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSDepartmentDAO", "BMS_AddDepartment", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
	}

	public int BMS_SaveDepartment(BMSEmployee wLoginUser, BMSDepartment wDepartment, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				BMSDepartment wDepartmentO = this.BMS_CheckDepartmentName(wLoginUser, wDepartment.ID,
						wDepartment.ParentID, wDepartment.Name, wErrorCode);
				if (wDepartment.Name.Length < 1 || wDepartmentO.ID > 0)
					wErrorCode.set(MESException.Logic.Value);
			}

			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				String wSQLText = StringUtils.Format("Update {0}.bms_department", wInstance.Result)
						+ " Set Code=@Code, Name=@Name,OperatorID=@OperatorID,"
						+ "EditTime=@EditTime,ParentID=@ParentID,Type=@Type where ID=@ID and Active =0 ;";
				wParms.Clear();

				wParms.Add("Name", wDepartment.Name);
				wParms.Add("OperatorID", wLoginUser.ID);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("ParentID", wDepartment.ParentID);
				wParms.Add("Type", wDepartment.Type);
				wParms.Add("ID", wDepartment.ID);
				wParms.Add("Code", StringUtils.isNotEmpty(wDepartment.Code) ? wDepartment.Code
						: StringUtils.Format("BM{0}", String.format("%06d", wDepartment.ID)));
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSDepartmentDAO", "BMS_SaveDepartment", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	public void BMS_DeleteDepartmentByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode) {
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("ID", wID);
			wParms.Add("Active", 0);
			this.Delete(StringUtils.Format(" {0}.bms_department ", wInstance.Result), wParms);
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSPositionDAO", "BMS_DeletePositionByID", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
	}

	public int BMS_ActiveDepartmentByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				String wSQLText = StringUtils.Format("Update {0}.bms_department", wInstance.Result)
						+ " Set  OperatorID=@OperatorID,EditTime=@EditTime,Active=1 where ID=@ID";
				wParms.Clear();

				wParms.Add("OperatorID", wLoginUser.ID);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("ID", wID);
				// wParms.Add("Code", StringUtils.Format("BM{0}", String.format("%06d", wID)));
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSDepartmentDAO", "BMS_ActiveDepartmentByID",
					ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	public int BMS_DisableDepartmentByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				String wSQLText = StringUtils.Format("Update {0}.bms_department", wInstance.Result)
						+ " Set OperatorID=@OperatorID,EditTime=@EditTime,Active=2 where ID=@ID";
				wParms.Clear();

				wParms.Add("OperatorID", wLoginUser.ID);
				wParms.Add("EditTime", DateTime.Now);
				wParms.Add("ID", wID);
				// wParms.Add("Code", StringUtils.Format("BM{0}", String.format("%06d",wID)));
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSDepartmentDAO", "BMS_DisableDepartmentByID",
					ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	public List<BMSDepartment> BMS_QueryDepartmentList(BMSEmployee wLoginUser, int wActive,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		List<BMSDepartment> wDepartmentList = new List<BMSDepartment>();

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				String wSQLText = StringUtils.Format(
						"Select * from {0}.bms_department where ID>0 AND (@Active<=0 or  Active=@Active); ",
						wInstance.Result);
				wParms.Clear();
				wParms.Add("Active", wActive);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					BMSDepartment wDepartment = new BMSDepartment();
					wDepartment.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wDepartment.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wDepartment.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wDepartment.OperatorID = StringUtils.parseInt(wSqlDataReader["OperatorID"]);
					wDepartment.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wDepartment.ParentID = StringUtils.parseInt(wSqlDataReader["ParentID"]);
					wDepartment.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wDepartment.Type = StringUtils.parseInt(wSqlDataReader["Type"]);

					wDepartment.Operator = BFCConstants.GetBMSEmployeeName(wDepartment.OperatorID);

					if (StringUtils.isEmpty(wDepartment.Code)) {
						wDepartment.Code = StringUtils.Format("BM{0}", String.format("%06d", wDepartment.ID));
					}
					wDepartmentList.Add(wDepartment);
				}
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSDepartmentDAO", "BMS_QueryDepartmentList",
					ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wDepartmentList;
	}

	public BMSDepartment BMS_QueryDepartmentByID(BMSEmployee wLoginUser, int wID, String wCode,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		BMSDepartment wDepartment = new BMSDepartment();

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				String wSQLText = StringUtils.Format(
						"Select * from {0}.bms_department where ID=@ID or ( @Code !='''' and  Code=@Code);",
						wInstance.Result);
				wParms.Clear();
				wParms.Add("ID", wID);
				wParms.Add("Code", wCode);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					wDepartment.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wDepartment.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wDepartment.Code = StringUtils.parseString(wSqlDataReader["Code"]);
					wDepartment.OperatorID = StringUtils.parseInt(wSqlDataReader["OperatorID"]);
					wDepartment.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wDepartment.ParentID = StringUtils.parseInt(wSqlDataReader["ParentID"]);
					wDepartment.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
					wDepartment.Operator = BFCConstants.GetBMSEmployeeName(wDepartment.OperatorID);
					wDepartment.Type = StringUtils.parseInt(wSqlDataReader["Type"]);
					if (StringUtils.isEmpty(wDepartment.Code)) {
						wDepartment.Code = StringUtils.Format("BM{0}", String.format("%06d", wDepartment.ID));
					}
				}
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSDepartmentDAO", "BMS_QueryDepartmentByID",
					ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wDepartment;
	}
}
