package com.mes.server.serviceimpl.dao.bms;

import java.io.File;

import java.util.List;
import java.util.DateTime;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;

import com.mes.server.service.mesenum.BMSRange;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.mesenum.MESFileType;
import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.bms.BMSMenuControl;
import com.mes.server.service.po.bms.BMSRole;
import com.mes.server.service.po.bms.BMSRoleItem;
import com.mes.server.service.utils.XmlTool;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.serviceimpl.utils.mes.MESServer;
import com.mes.server.shristool.LoggerTool;
import com.mes.server.utils.Constants;
import com.mes.server.service.utils.Configuration;
import com.mes.server.service.utils.StringUtils;

public class BMSRoleDAO extends BaseDAO {
	private static BMSRoleDAO Instance = null;

	private BMSRoleDAO() {
		super();
	}

	public static BMSRoleDAO getInstance() {
		if (Instance == null)
			Instance = new BMSRoleDAO();
		return Instance;
	}

	private static int RoleManageEnable = StringUtils
			.parseInt(Configuration.readConfigString("role.manager.enable", "config/config"));

	private static int RoleFunctionID = 900100;

	public List<BMSMenuControl> BMS_QueryMenuControlList(BMSEmployee wLoginUser, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		List<BMSMenuControl> wMenuControlList = new List<BMSMenuControl>();
		try {
			String wFilePath = MESServer.MES_GetFilePath(wLoginUser.getCompanyID(), MESFileType.Common);
			String wFileName = StringUtils.Format("{0}BMSMenuControl.xml", wFilePath);
			File wDirFile = new File(wFileName);
			if (wDirFile.exists()) {
				wMenuControlList = XmlTool.ReadXml(wFileName);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.File.Value);
			LoggerTool.SaveException("BMSService", "BMS_QueryMenuControlList", ex);
		}
		return wMenuControlList;
	}

	public BMSRole BMS_AddRole(BMSEmployee wLoginUser, BMSRole wRole, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";

				if (wRole.OwnerID < 1)
					wRole.OwnerID = 1;

				wSQLText = StringUtils.Format("Insert Into {0}.mbs_role", wInstance.Result)
						+ "(Name,OwnerID,ExplainText,Active,CreateTime)"
						+ " Values(@Name,@OwnerID,@ExplainText,@Active,@CreateTime)";
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Clear();
				wParms.Add("Name", wRole.Name);
				wParms.Add("OwnerID", wRole.OwnerID);
				wParms.Add("ExplainText", wRole.Explain);
				wParms.Add("CreateTime", DateTime.Now);
				wParms.Add("Active", wRole.Active);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_AddRole", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}

		return wRole;
	}

	private List<BMSRole> BMS_GetRoleList(BMSEmployee wLoginUser, int wID, int wActive, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		List<BMSRole> wRoleList = new List<BMSRole>();

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);

			if (wErrorCode.Result == 0) {
				String wSQLText = StringUtils.Format(
						"select r.* FROM {0}.mbs_role r"
								+ " where  r.ID>0 AND (@ID<=0 or r.ID=@ID) and (@Active<=0 or r.Active=@Active);",
						wInstance.Result);
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Add("Active", wActive);
				wParms.Add("ID", wID);

				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					BMSRole wRole = new BMSRole();
					wRole.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wRole.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wRole.OwnerID = StringUtils.parseInt(wSqlDataReader["OwnerID"]);
					wRole.OwnerName = BFCConstants.GetBMSEmployeeName(wRole.OwnerID);
					wRole.Explain = StringUtils.parseString(wSqlDataReader["ExplainText"]);
					wRole.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
					wRole.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
					wRoleList.Add(wRole);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("BMSService", "BMS_GetRoleList", ex);
		}

		return wRoleList;
	}

	public List<BMSRole> BMS_GetRoleList(BMSEmployee wLoginUser, int wActive, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		List<BMSRole> wRoleList = new List<BMSRole>();

		try {
			wRoleList = this.BMS_GetRoleList(wLoginUser, 0, wActive, wErrorCode);
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("BMSService", "BMS_GetRoleList", ex);
		}

		return wRoleList;
	}

	public BMSRole BMS_GetRoleByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		BMSRole wResult = new BMSRole();
		try {
			if (wID <= 0)
				return wResult;
			List<BMSRole> wRoleList = this.BMS_GetRoleList(wLoginUser, wID, -1, wErrorCode);
			if (wRoleList != null && wRoleList.Count > 0)
				wResult = wRoleList[0];
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("BMSService", "BMS_GetRoleList", ex);
		}

		return wResult;
	}

	public void BMS_RemoveRole(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				BMSRole wBMSRole = this.BMS_GetRoleByID(wLoginUser, wID, wErrorCode);
				if (wBMSRole == null || wBMSRole.ID <= 0 || wBMSRole.Active != 0) {
					return;
				}
				wSQLText = StringUtils.Format("Delete from {0}.mbs_role where ID=@ID and Active = 0; ",
						wInstance.Result);

				wParms.Clear();
				wParms.Add("ID", wID);
				mDBPool.update(wSQLText, wParms);

				wSQLText = StringUtils.Format("delete from {0}.mbs_roleuser", wInstance.Result)
						+ " where RoleID=@RoleID";
				wParms.Clear();
				wParms.Add("RoleID", wID);
				mDBPool.update(wSQLText, wParms);

			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_RemoveRole", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}

	}

	public int BMS_SaveRole(BMSEmployee wLoginUser, BMSRole wRole, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wSQLText = StringUtils.Format("Update {0}.mbs_role", wInstance.Result)
						+ " set Name=@Name,ExplainText=@ExplainText where ID=@ID and Active=0;";

				wParms.Clear();
				wParms.Add("ID", wRole.ID);
				wParms.Add("Name", wRole.Name);
				wParms.Add("ExplainText", wRole.Explain);
				mDBPool.update(wSQLText, wParms);

			}
		} catch (Exception ex) {

			LoggerTool.SaveException("BMSService", "BMS_SaveRole", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	public int BMS_SaveRoleFunctionList(BMSEmployee wLoginUser, int wRoleID, List<BMSRoleItem> wFunctionList,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				// Step01@Delete
				if (wRoleID > 0) {
					wSQLText = StringUtils.Format("delete from {0}.mbs_rolefunction", wInstance.Result)
							+ " where RoleID=@RoleID";
					wParms.Clear();
					wParms.Add("RoleID", wRoleID);
					mDBPool.update(wSQLText, wParms);
				}
				// Step02:

				List<String> wValueStringList = new List<String>();
				for (BMSRoleItem wFunctionRole : wFunctionList) {
					wValueStringList
							.Add(StringUtils.Format("({0},{1})", wFunctionRole.RoleID, wFunctionRole.FunctionID));
				}
				if (wValueStringList.Count > 0) {
					wSQLText = StringUtils.Format(
							"Insert Into {0}.mbs_rolefunction" + "(RoleID,FunctionID) " + " Values {1}",
							wInstance.Result, StringUtils.Join(",", wValueStringList));
					mDBPool.update(wSQLText, wParms);
				}

			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_SaveRoleFunctionList", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	public int BMS_SaveRoleRangeList(BMSEmployee wLoginUser, int wRoleID, List<BMSRoleItem> wFunctionList,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				// Step01@Delete
				if (wRoleID > 0) {
					wSQLText = StringUtils.Format("delete from {0}.mbs_rolerange", wInstance.Result)
							+ " where RoleID=@RoleID";
					wParms.Clear();
					wParms.Add("RoleID", wRoleID);
					mDBPool.update(wSQLText, wParms);
				}
				// Step02:
				for (BMSRoleItem wFunctionRole : wFunctionList) {
					wSQLText = StringUtils.Format("Insert Into {0}.mbs_rolerange", wInstance.Result)
							+ "(RoleID,FunctionID,TypeID) " + " Values(@RoleID,@FunctionID,@TypeID)";
					wParms.Clear();
					wParms.Add("RoleID", wFunctionRole.RoleID);
					wParms.Add("FunctionID", wFunctionRole.FunctionID);
					wParms.Add("TypeID", wFunctionRole.TypeID);
					mDBPool.update(wSQLText, wParms);
				}

			}
		} catch (Exception ex) {

			LoggerTool.SaveException("BMSService", "BMS_SaveRoleRangeList", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	public int BMS_SaveRoleUserList(BMSEmployee wLoginUser, int wRoleID, List<BMSRoleItem> wUserList,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				// Step01@Delete
				if (wRoleID > 0) {
					wSQLText = StringUtils.Format("delete from {0}.mbs_roleuser", wInstance.Result)
							+ " where RoleID=@RoleID";
					wParms.Clear();
					wParms.Add("RoleID", wRoleID);
					mDBPool.update(wSQLText, wParms);
				}

				// Step02:
				for (BMSRoleItem wFunctionRole : wUserList) {
					wSQLText = StringUtils.Format("Insert Into {0}.mbs_roleuser", wInstance.Result) + "(RoleID,UserID) "
							+ " Values(@RoleID,@UserID)";
					wParms.Clear();
					wParms.Add("RoleID", wFunctionRole.RoleID);
					wParms.Add("UserID", wFunctionRole.FunctionID);
					mDBPool.update(wSQLText, wParms);
				}

			}
		} catch (Exception ex) {

			LoggerTool.SaveException("BMSService", "BMS_SaveRoleUserList", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	public List<BMSRoleItem> BMS_QueryFunctionListByRoleID(BMSEmployee wLoginUser, int wRoleID,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		List<BMSRoleItem> wUserList = new List<BMSRoleItem>();

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";
				wSQLText = StringUtils.Format("Select * from {0}.mbs_rolefunction", wInstance.Result)
						+ " where RoleID=@RoleID";

				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				wParms.Clear();
				wParms.Add("RoleID", wRoleID);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					int wFunctionID = StringUtils.parseInt(wSqlDataReader["FunctionID"]);
					// int wTypeID = StringUtils.parseInt(wSqlDataReader["TypeID"]);
					BMSRoleItem wRoleFunction = new BMSRoleItem();
					wRoleFunction.RoleID = wRoleID;
					wRoleFunction.FunctionID = wFunctionID;
					// wRoleFunction.TypeID = wTypeID;
					wUserList.Add(wRoleFunction);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("BMSService", "BMS_QueryFunctionListByRoleID",
					ex);
		}
		return wUserList;
	}

	public List<BMSRoleItem> BMS_QueryFunctionListByLoginID(BMSEmployee wLoginUser, int wUserID,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		List<BMSRoleItem> wFunctionList = new List<BMSRoleItem>();

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wFunctionList;

			if (wUserID == -100) {
				wFunctionList = this.BMS_GetFunctionNodeTree(wLoginUser, -1, 1, wErrorCode);
				return wFunctionList;
			}

			String wSQLText = "";
			wSQLText = StringUtils.Format(
					"SELECT t.*,r.Text,r.RoleID as UserID FROM {0}.mbs_rolefunction t "
					+ "left join {0}.mbs_roletree r on t.FunctionID = r.FunctionID"
							+ " left join {0}.mbs_roleuser t1 on t.RoleID=t1.RoleID where t1.UserID=@UserID",
					wInstance.Result);

			Dictionary<String, Object> wParms = new Dictionary<String, Object>();

			wParms.Clear();
			wParms.Add("UserID", wUserID);
			List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
			for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
				BMSRoleItem wRoleFunction = new BMSRoleItem();
				wRoleFunction.FunctionID = StringUtils.parseInt(wSqlDataReader["FunctionID"]);
				wRoleFunction.RoleID = StringUtils.parseInt(wSqlDataReader["RoleID"]);
				wRoleFunction.UserID=StringUtils.parseInt(wSqlDataReader["UserID"]);
				wRoleFunction.Text=StringUtils.parseString(wSqlDataReader["Text"]);
				wFunctionList.Add(wRoleFunction);
			}

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("BMSService", "BMS_QueryFunctionListByLoginID",
					ex);
		}
		return wFunctionList;
	}

	public List<BMSRoleItem> BMS_QueryUserListByRoleID(BMSEmployee wLoginUser, int wRoleID,
			OutResult<Int32> wErrorCode) {
		List<BMSRoleItem> wUserList = new List<BMSRoleItem>();
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";
				wSQLText = StringUtils.Format("Select r.*,u.name as UserName from {0}.mbs_roleuser r,{1}.mbs_user u",
						wInstance.Result, wInstance.Result) + " where r.RoleID=@RoleID and r.UserID=u.ID";
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				wParms.Clear();
				wParms.Add("RoleID", wRoleID);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					int wUserID = StringUtils.parseInt(wSqlDataReader["UserID"]);
					String wUserName = StringUtils.parseString(wSqlDataReader["UserName"]);
					BMSRoleItem wRoleUser = new BMSRoleItem();
					wRoleUser.RoleID = wRoleID;
					wRoleUser.FunctionID = wUserID;
					wRoleUser.Text = wUserName;

					wUserList.Add(wRoleUser);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);

			LoggerTool.SaveException("BMSService", "BMS_GetUserList", ex);
		}
		return wUserList;
	}

	public List<BMSRoleItem> BMS_QueryUserListByFunctionID(BMSEmployee wLoginUser, int wFunctionID,
			OutResult<Int32> wErrorCode) {

		List<BMSRoleItem> wUserList = new List<BMSRoleItem>();

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";
				wSQLText = StringUtils.Format(
						"SELECT t.*,t1.UserID FROM {0}.mbs_rolefunction t"
								+ " left join {0}.mbs_roleuser t1 on t.RoleID=t1.RoleID where t.FunctionID=@FunctionID",
						wInstance.Result);

				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				wParms.Clear();
				wParms.Add("FunctionID", wFunctionID);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					BMSRoleItem wRoleFunction = new BMSRoleItem();
					wRoleFunction.FunctionID = StringUtils.parseInt(wSqlDataReader["FunctionID"]);
					wRoleFunction.RoleID = StringUtils.parseInt(wSqlDataReader["RoleID"]);
					wRoleFunction.UserID = StringUtils.parseInt(wSqlDataReader["UserID"]);
					wUserList.Add(wRoleFunction);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("BMSService", "BMS_QueryUserListByFunctionID",
					ex);
		}
		return wUserList;
	}

	public List<BMSRoleItem> BMS_QueryRangeList(BMSEmployee wLoginUser, int wOperatorID, int wFunctionID,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		List<BMSRoleItem> wRangeList = new List<BMSRoleItem>();

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);

			wErrorCode.set(wInstance.ErrorCode);

			if (wErrorCode.Result == 0) {
				String wSQLText = "";

				wSQLText = StringUtils
						.Format("SELECT t1.FunctionID ,t2.* ,t3.FunctionID as RangeID,t3.TypeID as RangeType,t4.UserID"
								+ "  FROM {0}.mbs_rolefunction t1,{0}.mbs_role t2,{0}.mbs_rolerange t3,{0}.mbs_roleuser t4 "
								+ " where  t1.RoleID=t2.ID AND t2.ID=t3.RoleID AND t4.RoleID=t2.ID AND t2.Active=1"
								+ " and (@FunctionID<=0 OR t1.FunctionID=@FunctionID)"
								+ " and (@UserID<=0 OR  t4.UserID=@UserID)", wInstance.Result);

				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				wParms.Clear();
				wParms.Add("UserID", wOperatorID);
				wParms.Add("FunctionID", wFunctionID);

				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					BMSRoleItem wRoleFunction = new BMSRoleItem();
					wRoleFunction.RoleID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wRoleFunction.FunctionID = StringUtils.parseInt(wSqlDataReader["RangeID"]);
					wRoleFunction.TypeID = StringUtils.parseInt(wSqlDataReader["RangeType"]);

					wRangeList.Add(wRoleFunction);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);

			LoggerTool.SaveException("BMSService", "BMS_QueryRangeListByOperatorID",
					ex);
		}
		return wRangeList;
	}

	public List<BMSRoleItem> BMS_QueryRangeListByRoleID(BMSEmployee wLoginUser, int wRoleID,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		List<BMSRoleItem> wRangeList = new List<BMSRoleItem>();

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";
				wSQLText = StringUtils.Format("Select * from {0}.mbs_rolerange", wInstance.Result)
						+ " where RoleID=@RoleID";
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				wSQLText = this.DMLChange(wSQLText);

				wParms.Clear();
				wParms.Add("RoleID", wRoleID);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					// wSqlDataReader\[(\"\w+\")\] wSqlDataReader.get($1)
					int wFunctionID = StringUtils.parseInt(wSqlDataReader["FunctionID"]);
					int wTypeID = StringUtils.parseInt(wSqlDataReader["TypeID"]);
					BMSRoleItem wRoleFunction = new BMSRoleItem();
					wRoleFunction.RoleID = wRoleID;
					wRoleFunction.FunctionID = wFunctionID;
					wRoleFunction.TypeID = wTypeID;
					wRangeList.Add(wRoleFunction);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("BMSService", "BMS_QueryRangeListByRoleID", ex);
		}
		return wRangeList;
	}

	public int BMS_DisableRole(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";

				wSQLText = StringUtils.Format("Update {0}.mbs_role", wInstance.Result) + " set Active=2 where ID=@ID";
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Clear();
				wParms.Add("ID", wID);
				mDBPool.update(wSQLText, wParms);

			}
		} catch (Exception ex) {

			LoggerTool.SaveException("BMSService", "BMS_DisableRole", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	public int BMS_ActiveRole(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";
				wSQLText = StringUtils.Format("Update {0}.mbs_role", wInstance.Result) + " set Active=1 where ID=@ID";
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				wParms.Clear();
				wParms.Add("ID", wID);
				mDBPool.update(wSQLText, wParms);

			}
		} catch (Exception ex) {

			LoggerTool.SaveException("BMSService", "BMS_ActiveRole", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	/*
	 * public boolean BMS_CheckPowerByLoginID(BMSEmployee wLoginUser, int
	 * wFunctionID, BMSRange wTypeID, int wObjectID, OutResult<Int32> wErrorCode)
	 * { boolean wRange = false; try { if (wTypeID == null) wTypeID =
	 * BMSRange.Default;
	 * 
	 * if (wLoginID == 0 || wLoginID == SysAdmin.ID || wLoginID >
	 * Constants.EngineerUserIDMin || wFunctionID <= 0) { wRange = true; return
	 * wRange; }
	 * 
	 * if (wLoginID > 0) { wRange = this.BMS_CheckRangeByAuthorityID(wCompanyID,
	 * wLoginID, wFunctionID, wTypeID, wObjectID, wErrorCode); }
	 * 
	 * if (RoleManageEnable <= 0) wRange = true;
	 * 
	 * if (DateTime.Now.CompareTo(MESServer.ExpiredTime) > 0) wRange =
	 * false; } catch (Exception ex) { LoggerTool.SaveException("BMSService",
	 * "BMS_CheckRangeByLoginID", ex); } return
	 * wRange; }
	 */

	public List<BMSRoleItem> BMS_GetFunctionNodeTree(BMSEmployee wLoginUser, int wFunctionID, int wActive,
			OutResult<Int32> wErrorCode) {
		List<BMSRoleItem> wFunctionNodeList = new List<BMSRoleItem>();
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";
				wSQLText = StringUtils.Format(
						"Select * from {0}.mbs_roletree where 1=1" + " and (@FunctionID<=0 OR FunctionID=@FunctionID)"
								+ " and (@Active<=0 OR Active=@Active) order by OrderID ",
						wInstance.Result);
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Add("FunctionID", wFunctionID);
				wParms.Add("Active", wActive);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					// wSqlDataReader\[(\"\w+\")\] wSqlDataReader.get($1)
					BMSRoleItem wRoleFunction = new BMSRoleItem();
					wRoleFunction.FunctionID = StringUtils.parseInt(wSqlDataReader["FunctionID"]);
					wRoleFunction.RoleID = StringUtils.parseInt(wSqlDataReader["RoleID"]);
					wRoleFunction.Text = StringUtils.parseString(wSqlDataReader["Text"]);
					wRoleFunction.TypeID = StringUtils.parseInt(wSqlDataReader["Active"]);

					wFunctionNodeList.Add(wRoleFunction);
				}

			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("BMSService", "BMS_GetFunctionNodeTree", ex);
		}
		return wFunctionNodeList;
	}

	public boolean BMS_CheckPowerByLoginID(int wCompanyID, int wUserID, int wFunctionID, BMSRange wTypeID,
			int wObjectID, OutResult<Int32> wErrorCode) {
		boolean wPower = false;
		try {
			if (RoleManageEnable <= 0)
				return true;
			if (wUserID == 0 || wFunctionID <= 0 || wUserID == SysAdmin.ID || wUserID > Constants.EngineerUserIDMin) {
				return true;
			}
			ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wPower;

			String wSQLText = StringUtils.Format(
					"SELECT t1.FunctionID ,t2.* ,t3.FunctionID as RangeID,t3.TypeID as RangeType,t4.UserID FROM {0}.mbs_rolefunction t1"
							+ " left join {0}.mbs_role t2 on t1.RoleID=t2.ID"
							+ " left join {0}.mbs_rolerange t3 on  t2.ID=t3.RoleID "
							+ " left join {0}.mbs_roleuser t4 on  t4.RoleID=t2.ID "
							+ "	where t2.Active=1 and t1.FunctionID=@FunctionID and t4.UserID=@UserID"
							+ " and (@RangeID<=0 OR t3.FunctionID=@RangeID) "
							+ " and (@RangType<=0 OR t3.TypeID=@RangType) ",
					wInstance.Result);

			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("UserID", wUserID);
			wParms.Add("RangeID", wObjectID);
			wParms.Add("FunctionID", wFunctionID);
			wParms.Add("RangType", wTypeID);
			wSQLText = this.DMLChange(wSQLText);
			List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
			if (wQueryResultList.Count > 0)
				wPower = true;

		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_CheckRangeByAuthorityID",
					ex);
		}
		return wPower;
	}

	public void BMS_UpdateFunctionNodeTree(BMSEmployee wLoginUser, BMSRoleItem wBMSRoleItem,
			OutResult<Int32> wErrorCode) {

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return;
			}

			List<BMSRoleItem> wBMSRoleItemList = this.BMS_GetFunctionNodeTree(wLoginUser, wBMSRoleItem.FunctionID, -1,
					wErrorCode);

			String wSQLText = "";
			if (wBMSRoleItemList == null || wBMSRoleItemList.Count <= 0) {
				wSQLText = StringUtils.Format(
						"Insert into {0}.mbs_roletree (FunctionID,RoleID,Text,Active,OrderID) Values (@FunctionID,@RoleID,@Text,0,@OrderID);",
						wInstance.Result);
			} else {
				wSQLText = StringUtils.Format(
						"Update {0}.mbs_roletree set RoleID=@RoleID ,Text=@Text,OrderID=@OrderID Where FunctionID=@FunctionID ;",
						wInstance.Result);
			}

			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("FunctionID", wBMSRoleItem.FunctionID);
			wParms.Add("RoleID", wBMSRoleItem.RoleID);
			wParms.Add("Text", wBMSRoleItem.Text);
			wParms.Add("OrderID", wBMSRoleItem.TypeID);

			SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
			mDBPool.update(wSQLText, wSqlParameterSource);

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("BMSService", "BMS_GetFunctionNodeTree", ex);
		}
	}

	public void BMS_ActiveFunctionNodeTree(BMSEmployee wLoginUser, List<Int32> wFunctionIDList, int wActive,
			OutResult<Int32> wErrorCode) {
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return;
			}

			if (wFunctionIDList == null || wFunctionIDList.Count <= 0) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			if (wActive != 1)
				wActive = 2;

			String wSQLText = StringUtils.Format(
					"Update {0}.mbs_roletree set Active=@wActive Where FunctionID IN (@FunctionIDList);",
					wInstance.Result);

			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("wActive", wActive);
			wParms.Add("FunctionIDList", StringUtils.Join(",", wFunctionIDList));

			SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
			mDBPool.update(wSQLText, wSqlParameterSource);

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("BMSService", "BMS_ActiveFunctionNodeTree", ex);
		}
	}

	public void BMS_DeleteFunctionNodeTree(BMSEmployee wLoginUser, List<Int32> wFunctionIDList,
			OutResult<Int32> wErrorCode) {

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return;
			}

			if (wFunctionIDList == null || wFunctionIDList.Count <= 0) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			String wSQLText = StringUtils.Format(
					"Delete FROM {0}.mbs_roletree  Where ID>0 AND FunctionID IN (@FunctionIDList) AND Active =0 ;",
					wInstance.Result);

			Dictionary<String, Object> wParms = new Dictionary<String, Object>();

			wParms.Add("FunctionIDList", StringUtils.Join(",", wFunctionIDList));

			SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
			mDBPool.update(wSQLText, wSqlParameterSource);

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("BMSService", "BMS_ActiveFunctionNodeTree", ex);
		}

	}

	public int BMS_MaxFunctionIDNode(BMSEmployee wLoginUser, int wMinFunctionID, int MaxFunctionID,
			OutResult<Int32> wErrorCode) {
		int wResult = 0;
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResult;
			}

			String wSQLText = StringUtils.Format(
					"Select max(FunctionID) from {0}.mbs_roletree where FunctionID between @MinFunctionID AND  @MaxFunctionID ",
					wInstance.Result);
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();

			wParms.Add("MinFunctionID", wMinFunctionID);
			wParms.Add("MaxFunctionID", MaxFunctionID);

			wResult = mDBPool.queryForObject(wSQLText, wParms, typeof(Int32));

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.Value);
			LoggerTool.SaveException("BMSService", "BMS_GetFunctionNodeTree", ex);
		}
		return wResult;
	}
}
