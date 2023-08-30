package com.mes.server.serviceimpl.dao.bms;

import java.util.List;
import java.util.DateTime;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;
import java.util.Optional;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import com.mes.server.service.mesenum.BMSGrads;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.serviceimpl.dao.BaseDAO; 
import com.mes.server.serviceimpl.utils.mes.MESServer;
import com.mes.server.shristool.LoggerTool;
import com.mes.server.utils.Constants;
import com.mes.server.utils.SessionContants;
import com.mes.server.service.utils.DesUtil;
import com.mes.server.service.utils.StringUtils;

public class BMSEmployeeDAO extends BaseDAO {
	private static BMSEmployeeDAO Instance = null;

	private BMSEmployeeDAO() {
		super();
	}

	public static BMSEmployeeDAO getInstance() {
		if (Instance == null)
			Instance = new BMSEmployeeDAO();
		return Instance;
	}

	private static int RoleFunctionID = 900000;
	// 用户管理接口函数
	// 用户管理逻辑函数

	private boolean MBS_CheckLoginName(BMSEmployee wLoginUser, BMSEmployee wEmployee, OutResult<Int32> wErrorCode) {
		boolean wResult = false;
		try {
			// wSqlDataReader\[(\"\w+\")\] wSqlDataReader.get($1)
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";
				wSQLText = StringUtils.Format("Select Count(*) As UserCount from {0}.mbs_user", wInstance.Result)
						+ " where ID!=@ID and LoginName=@LoginName";

				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Clear();

				wParms.Add("ID", wEmployee.ID);
				wParms.Add("LoginName", wEmployee.LoginName);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					int wUserCount = StringUtils.parseInt(wSqlDataReader["UserCount"]);
					if (wUserCount > 0)
						wResult = true;
				}
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "MBS_CheckLoginName ", ex);
		}
		return wResult;
	}

	public BMSEmployee BMS_LoginEmployeeByToken(String wLoginName, String wToken, OutResult<Int32> wErrorCode) {
		BMSEmployee wEmployee = new BMSEmployee();
		wErrorCode.set(0);
		wEmployee.ID = -1;
		try {
			int wCompanyID = this.BMS_LoginByStoken(wLoginName, wToken, wErrorCode);
			if (wCompanyID >= 0) {

				if (MESServer.Instance < 1) {
					if (DesUtil.encrypt(wLoginName, appSecret).equalsIgnoreCase(BaseDAO.SysAdmin.LoginName)) {
						return BaseDAO.SysAdmin;
					}
					if (StringUtils.parseInt(wLoginName) > Constants.EngineerUserIDMin) {
						Optional<BMSEmployee> wBMSEmployeeOptional = Constants.GetEngineerUserList().stream()
								.filter(p -> p.LoginName.equalsIgnoreCase(wLoginName)).findAny();
						if (wBMSEmployeeOptional.isPresent()) {
							wEmployee = wBMSEmployeeOptional.get();
							wEmployee.LoginName = DesUtil.encrypt(wEmployee.LoginName, appSecret);
							return BaseDAO.SysAdmin;
						}
					}

				}

				ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);
				wErrorCode.set(wInstance.ErrorCode);
				if (wInstance.Result.Length < 1) {
					wEmployee.ID = -5;
					return wEmployee;
				}
				if (DateTime.Now.CompareTo(MESServer.ExpiredTime) > 0) {
					wEmployee.ID = -5;
					return wEmployee;
				}
				String wSQLText = StringUtils
						.Format("select u.*,t1.Name as Department,t2.Name as PositionName from {0}.mbs_user u "
								+ " left join {0}.bms_department t1 on u.DepartmentID=t1.ID "
								+ " left join {0}.bms_position t2 on u.Position=t2.ID "
								+ " where u.LoginName=@LoginName and u.Active=1", wInstance.Result);

				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Clear();

				wParms.Add("LoginName", wLoginName);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {

					wEmployee.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
					wEmployee.CompanyID = wCompanyID;
					wEmployee.Name = StringUtils.parseString(wSqlDataReader["Name"]);
					wEmployee.Password = StringUtils.parseString(wSqlDataReader["Password"]);
					wEmployee.LoginName = DesUtil.encrypt(StringUtils.parseString(wSqlDataReader["LoginName"]),
							appSecret);
					wEmployee.Password = StringUtils.parseString(wSqlDataReader["Password"]);
					wEmployee.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
					wEmployee.Department = StringUtils.parseString(wSqlDataReader["Department"]);
					wEmployee.PositionName = StringUtils.parseString(wSqlDataReader["PositionName"]);
					wEmployee.Active= StringUtils.parseInt(wSqlDataReader["Active"]); 
					wEmployee.Grad = StringUtils.parseInt(wSqlDataReader["Grad"]);
					wEmployee.Manager = StringUtils.parseInt(wSqlDataReader["Manager"]);
					wEmployee.Operator = StringUtils.parseString(wSqlDataReader["Operator"]);
					wEmployee.LoginID = StringUtils.parseString(wSqlDataReader["LoginID"]);

					wEmployee.Phone = StringUtils.parseString(wSqlDataReader["Phone"]);
					wEmployee.PhoneMAC = StringUtils.parseLong(wSqlDataReader["PhoneMAC"]);

					wEmployee.Email = StringUtils.parseString(wSqlDataReader["Email"]);
					wEmployee.CreateDate = StringUtils.parseDate(wSqlDataReader["CreateDate"]);
					wEmployee.WeiXin = StringUtils.parseString(wSqlDataReader["WeiXin"]);

					wEmployee.Position = StringUtils.parseInt(wSqlDataReader["Position"]);
					wEmployee.DutyID = StringUtils.parseInt(wSqlDataReader["DutyID"]);
					boolean wDBOnline = StringUtils.parseBoolean(wSqlDataReader["Online"]);

					wEmployee.Online = wDBOnline ? 1 : 0;
					wEmployee.OnLineTime = StringUtils.parseDate(wSqlDataReader["OnLineTime"]);
					if (wEmployee.Grad >= (int)BMSGrads.Engineer()) {
						wEmployee.Grad = (int)BMSGrads.Default();
					}

				}
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_LoginEmployeeByToken ", ex);
			wEmployee.ID = -3;
		}
		return wEmployee;
	}

	public BMSEmployee BMS_LoginEmployee(String wLoginName, String wPassword, long wMAC,
			OutResult<Int32> wErrorCode) {
		BMSEmployee wEmployee = new BMSEmployee();
		wEmployee.ID = -1;
		try {
			String wDESPassword = DesUtil.encrypt(wPassword, appSecret);

			int wCompanyID = this.BMS_Login(wLoginName, wDESPassword, wMAC, wErrorCode);
			if (wCompanyID >= 0) {
				if (DesUtil.encrypt(wLoginName, appSecret).equalsIgnoreCase(BaseDAO.SysAdmin.LoginName)
						&& wDESPassword.equalsIgnoreCase(BaseDAO.SysAdmin.Password)) {
					return BaseDAO.SysAdmin;
				}
				if (StringUtils.parseInt(wLoginName) > Constants.EngineerUserIDMin) {
					// 开发登录
					Optional<BMSEmployee> wOptional = Constants.GetEngineerUserList().stream().filter(
							p -> p.LoginName.equalsIgnoreCase(wLoginName) && p.Password.equalsIgnoreCase(wDESPassword))
							.findFirst();

					if (wOptional.isPresent()) {
						wEmployee = wOptional.get();
						wEmployee.LoginName = DesUtil.encrypt(wEmployee.LoginName, SessionContants.appSecret);
						return wEmployee;
					}

				}

				ServiceResult<String> wInstance = this.GetDataBaseName(wCompanyID, MESDBSource.Basic);
				wErrorCode.set(wInstance.ErrorCode);
				if (wInstance.Result.Length < 1) {
					wEmployee.ID = -5;
					return wEmployee;
				}
				if (DateTime.Now.CompareTo(MESServer.ExpiredTime) > 0) {
					wEmployee.ID = -5;
					return wEmployee;
				}
				String wSQLText = StringUtils
						.Format("select u.*,t1.Name as Department,t2.Name as PositionName from {0}.mbs_user u "
								+ " left join {0}.bms_department t1 on u.DepartmentID=t1.ID "
								+ " left join {0}.bms_position t2 on u.Position=t2.ID "
								+ " where u.LoginName=@LoginName and u.Active=1", wInstance.Result);

				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Clear();

				wParms.Add("LoginName", wLoginName);
				wSQLText = this.DMLChange(wSQLText);
				List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
				for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
					wEmployee.ID = -2;
					String wDBPassword = StringUtils.parseString(wSqlDataReader["Password"]);

					if (wDESPassword.equalsIgnoreCase(wDBPassword)) {
						wEmployee.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
						wEmployee.CompanyID = wCompanyID;
						wEmployee.Name = StringUtils.parseString(wSqlDataReader["Name"]);
						wEmployee.LoginName = DesUtil.encrypt(StringUtils.parseString(wSqlDataReader["LoginName"]),
								appSecret);
						wEmployee.Password = StringUtils.parseString(wSqlDataReader["Password"]);
						wEmployee.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);

						wEmployee.Department = StringUtils.parseString(wSqlDataReader["Department"]);
						wEmployee.PositionName = StringUtils.parseString(wSqlDataReader["PositionName"]);
						 
						wEmployee.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
						wEmployee.Grad = StringUtils.parseInt(wSqlDataReader["Grad"]);
						wEmployee.Manager = StringUtils.parseInt(wSqlDataReader["Manager"]);
						wEmployee.Operator = StringUtils.parseString(wSqlDataReader["Operator"]);
						wEmployee.LoginID = StringUtils.parseString(wSqlDataReader["LoginID"]);
						wEmployee.Phone = StringUtils.parseString(wSqlDataReader["Phone"]);
						wEmployee.PhoneMAC = StringUtils.parseLong(wSqlDataReader["PhoneMAC"]);

						wEmployee.Email = StringUtils.parseString(wSqlDataReader["Email"]);
						wEmployee.CreateDate = StringUtils.parseDate(wSqlDataReader["CreateDate"]);
						wEmployee.WeiXin = StringUtils.parseString(wSqlDataReader["WeiXin"]);

						wEmployee.Position = StringUtils.parseInt(wSqlDataReader["Position"]);
						wEmployee.DutyID = StringUtils.parseInt(wSqlDataReader["DutyID"]);
						boolean wDBOnline = StringUtils.parseBoolean(wSqlDataReader["Online"]);
						wEmployee.Password = wDBPassword;
						wEmployee.Online = wDBOnline ? 1 : 0;
						wEmployee.OnLineTime = StringUtils.parseDate(wSqlDataReader["OnLineTime"]);
						if (wEmployee.Grad >= (int)BMSGrads.Engineer()) {
							wEmployee.Grad = (int)BMSGrads.Default();
						}
					}
				}
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_LoginEmployee ", ex);
			wEmployee.ID = -3;
		}
		return wEmployee;
	}

	public BMSEmployee BMS_LoginEmployeeByUserName(String wUserName, String wPassword, OutResult<Int32> wErrorCode) {
		BMSEmployee wEmployee = new BMSEmployee();
		wEmployee.ID = -1;
		try {
			String wDESPassword = DesUtil.encrypt(wPassword, appSecret);

			if (wUserName.equalsIgnoreCase(BaseDAO.SysAdmin.Name)
					&& wDESPassword.equalsIgnoreCase(BaseDAO.SysAdmin.Password)) {
				return BaseDAO.SysAdmin;
			}

			ServiceResult<String> wInstance = this.GetDataBaseName(0, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wInstance.Result.Length < 1) {
				wEmployee.ID = -5;
				return wEmployee;
			}
			if (DateTime.Now.CompareTo(MESServer.ExpiredTime) > 0) {
				wEmployee.ID = -5;
				return wEmployee;
			}
			String wSQLText = StringUtils
					.Format("select u.*,t1.Name as Department,t2.Name as PositionName from {0}.mbs_user u "
							+ " left join {0}.bms_department t1 on u.DepartmentID=t1.ID "
							+ " left join {0}.bms_position t2 on u.Position=t2.ID "
							+ " where u.Name=@Name and u.Password =@Password and  u.Active=1", wInstance.Result);

			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Clear();

			wParms.Add("Name", wUserName);
			wParms.Add("Password", wDESPassword);
			wSQLText = this.DMLChange(wSQLText);
			List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
			for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {

				wEmployee.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
				wEmployee.CompanyID = 0;
				wEmployee.Name = StringUtils.parseString(wSqlDataReader["Name"]);
				wEmployee.LoginName = DesUtil.encrypt(StringUtils.parseString(wSqlDataReader["LoginName"]),
						appSecret);
				wEmployee.Password = StringUtils.parseString(wSqlDataReader["Password"]);
				wEmployee.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
				wEmployee.Department = StringUtils.parseString(wSqlDataReader["Department"]);
				 
				wEmployee.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
				wEmployee.Grad = StringUtils.parseInt(wSqlDataReader["Grad"]);
				wEmployee.Manager = StringUtils.parseInt(wSqlDataReader["Manager"]);
				wEmployee.Operator = StringUtils.parseString(wSqlDataReader["Operator"]);
				wEmployee.LoginID = StringUtils.parseString(wSqlDataReader["LoginID"]);
				wEmployee.Phone = StringUtils.parseString(wSqlDataReader["Phone"]);
				wEmployee.PhoneMAC = StringUtils.parseLong(wSqlDataReader["PhoneMAC"]);

				wEmployee.Email = StringUtils.parseString(wSqlDataReader["Email"]);
				wEmployee.CreateDate = StringUtils.parseDate(wSqlDataReader["CreateDate"]);
				wEmployee.WeiXin = StringUtils.parseString(wSqlDataReader["WeiXin"]);

				wEmployee.Position = StringUtils.parseInt(wSqlDataReader["Position"]);

				wEmployee.PositionName = StringUtils.parseString(wSqlDataReader["PositionName"]);
				wEmployee.DutyID = StringUtils.parseInt(wSqlDataReader["DutyID"]);
				boolean wDBOnline = StringUtils.parseBoolean(wSqlDataReader["Online"]);
				wEmployee.Password = wDESPassword;
				wEmployee.Online = wDBOnline ? 1 : 0;
				wEmployee.OnLineTime = StringUtils.parseDate(wSqlDataReader["OnLineTime"]);
				if (wEmployee.Grad >= (int)BMSGrads.Engineer()) {
					wEmployee.Grad = (int)BMSGrads.Default();
				}

			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_LoginEmployee ", ex);
			wEmployee.ID = -3;
		}
		return wEmployee;
	}

	public void BMS_AddEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee, OutResult<Int32> wErrorCode) {

		try {
			wErrorCode.set(0);
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			String wDefaultPassword = DesUtil.encrypt(defaultPassword, appSecret);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return;
			}
			String wSQLText = "";
			if (wEmployee.ID <= 0) {
				wSQLText = StringUtils.Format("Insert Into {0}.mbs_user", wInstance.Result)
						+ "(Name,LoginName,Password,Phone,PhoneMAC,Email,DepartmentID,CreateDate,Operator,WeiXin,Grad,Manager,"
						+ " Position,DutyID,Active,Online,DepartureDate,OnLineTime,LastOnLineTime,LoginID,Type,SuperiorID) "
						+ " Values(@Name,@LoginName,@Password,@Phone,@PhoneMAC,@Email,@DepartmentID,@CreateDate,@Operator,@WeiXin,@Grad,"
						+ "@Manager,@Position,@DutyID,@Active,@Online,@DepartureDate,@OnLineTime,@LastOnLineTime,@LoginID,@Type,@SuperiorID)";
			} else {

				wSQLText = StringUtils.Format("Insert Into {0}.mbs_user", wInstance.Result)
						+ "(ID,Name,LoginName,Password,Phone,PhoneMAC,Email,DepartmentID,CreateDate,Operator,WeiXin,Grad,Manager,"
						+ " Position,DutyID,Active,Online,DepartureDate,OnLineTime,LastOnLineTime,LoginID,Type,SuperiorID) "
						+ " Values(@ID,@Name,@LoginName,@Password,@Phone,@PhoneMAC,@Email,@DepartmentID,@CreateDate,@Operator,@WeiXin,@Grad,"
						+ "@Manager,@Position,@DutyID,@Active,@Online,@DepartureDate,@OnLineTime,@LastOnLineTime,@LoginID,@Type,@SuperiorID)";

			}

			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Clear();

			BMSEmployee wBMSEmployeeDB = null;
			if (StringUtils.isNotEmpty(wEmployee.LoginID) && wEmployee.LoginID.Length > 6) {
				// 检查LoginID唯一性 检查LoginID在LoginName中的唯一性
				wBMSEmployeeDB = this.BMS_QueryEmployeeByLoginID(wLoginUser, wEmployee.LoginID, wErrorCode);
				if (wBMSEmployeeDB.ID > 0) {
					wErrorCode.set(MESException.Logic.Value);
					return;
				}

				if (StringUtils.isEmpty(wEmployee.LoginName)) {
					wEmployee.LoginName = wEmployee.LoginID;
				}

			}
			if (StringUtils.isNotEmpty(wEmployee.LoginName) && wEmployee.LoginName.Length >= 6) {
				// 检查LoginID唯一性 检查LoginID在LoginName中的唯一性
				wBMSEmployeeDB = this.BMS_QueryEmployeeByLoginName(wLoginUser, wEmployee.LoginName, wErrorCode);
				if (wBMSEmployeeDB.ID > 0) {
					wErrorCode.set(MESException.Logic.Value);
					return;
				}
			}
			wParms.Add("ID", wEmployee.ID);
			wParms.Add("Name", wEmployee.Name);
			wParms.Add("LoginName", wEmployee.LoginName);
			wParms.Add("Password", wDefaultPassword);
			wParms.Add("Email", wEmployee.Email);
			wParms.Add("Phone", wEmployee.Phone);
			wParms.Add("PhoneMAC", wEmployee.PhoneMAC);

			wParms.Add("DepartmentID", wEmployee.DepartmentID);
			wParms.Add("CreateDate", DateTime.Now);
			wParms.Add("Operator", wEmployee.Operator);
			wParms.Add("WeiXin", wEmployee.WeiXin);

			if (wEmployee.Grad >= (int)BMSGrads.Engineer()) {
				wEmployee.Grad = (int)BMSGrads.Default();
			}

			wParms.Add("Grad", wEmployee.Grad);
			wParms.Add("Manager", wEmployee.Manager);
			wParms.Add("Position", wEmployee.Position);
			wParms.Add("DutyID", wEmployee.DutyID);
			wParms.Add("LoginID", wEmployee.LoginID);
			wParms.Add("Active", wEmployee.Active);
			wParms.Add("Online", 1);
			wParms.Add("OnLineTime", DateTime.Now);
			wParms.Add("DepartureDate", DateTime.Now);
			wParms.Add("LastOnLineTime", DateTime.Now);
			wParms.Add("Type", wEmployee.Type);
			wParms.Add("SuperiorID", wEmployee.SuperiorID);
			wSQLText = this.DMLChange(wSQLText);
			KeyHolder keyHolder = new GeneratedKeyHolder();

			SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParms);
			mDBPool.update(wSQLText, wSqlParameterSource, keyHolder);
			wEmployee.ID = keyHolder.getKey().intValue();

			if (StringUtils.isEmpty(wEmployee.LoginName) && wEmployee.ID > 0) {
				wEmployee.LoginName = String.format("%06d", wEmployee.ID);
				wSQLText = StringUtils.Format("Update {0}.mbs_user", wInstance.Result)
						+ " Set LoginName=@LoginName  where ID = @ID";
				wParms.Clear();

				wParms.Add("LoginName", wEmployee.LoginName);
				wParms.Add("ID", wEmployee.ID);

				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
			}
			this.BMS_addLoginUser(wEmployee, wErrorCode);

		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_addEmployee ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
	}

	public void BMS_UpdateOnline(BMSEmployee wEmployee, OutResult<Int32> wErrorCode) {

		try {
			if (wEmployee == null || wEmployee.ID <= 0 || wEmployee.ID >= Constants.EngineerUserIDMin) {
				return;
			}

			wEmployee.Online = 1;
			DateTime wBaseTime = DateTime.Now;
			wBaseTime.set(2020, 0, 1);

			if (wEmployee.LastOnLineTime == null || wEmployee.LastOnLineTime.CompareTo(wBaseTime) <= 0)
				wEmployee.LastOnLineTime = DateTime.Now;

			if (wEmployee.OnLineTime == null || wEmployee.OnLineTime.CompareTo(wBaseTime) <= 0)
				wEmployee.OnLineTime = wEmployee.LastOnLineTime;

			wBaseTime = DateTime.Now;
			wBaseTime.Add(DateTime.MINUTE, -10);

			if (wEmployee.LastOnLineTime.CompareTo(wBaseTime) < 0)
				wEmployee.OnLineTime = DateTime.Now;

			wEmployee.LastOnLineTime = DateTime.Now;

			wErrorCode.set(0);
			ServiceResult<String> wInstance = this.GetDataBaseName(0, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return;
			}

			String wSQLText = "";
			wSQLText = StringUtils.Format("Update {0}.mbs_user", wInstance.Result)
					+ " Set LastOnLineTime=@LastOnLineTime,OnLineTime=@OnLineTime where ID=@ID";

			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Clear();
			wParms.Add("LastOnLineTime", wEmployee.LastOnLineTime);
			wParms.Add("OnLineTime", wEmployee.OnLineTime);
			wParms.Add("ID", wEmployee.ID);
			wSQLText = this.DMLChange(wSQLText);
			mDBPool.update(wSQLText, wParms);
		} catch (Exception ex) {

			LoggerTool.SaveException("BMSService", "BMS_UpdateOnline ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
	}

	public int BMS_SaveEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				if (this.MBS_CheckLoginName(wLoginUser, wEmployee, wErrorCode))
					wErrorCode.set(MESException.Logic.Value);

				String wSQLText = "";
				wSQLText = StringUtils.Format("Update {0}.mbs_user", wInstance.Result)
						+ " Set Name=@Name,LoginName=@LoginName,DepartmentID=@DepartmentID,Operator=@Operator,Grad=@Grad,Type=@Type,SuperiorID=@SuperiorID,"
						+ " Active=@Active,Manager=@Manager,Position=@Position,DutyID=@DutyID,Phone=@Phone,PhoneMAC=@PhoneMAC,Email=@Email,WeiXin=@WeiXin  where ID=@ID";

				if (wEmployee.Grad > 0)
					wEmployee.Active = 1;

				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Clear();
				wParms.Add("Name", wEmployee.Name);
				wParms.Add("LoginName", wEmployee.LoginName);
				wParms.Add("Type", wEmployee.Type);
				wParms.Add("SuperiorID", wEmployee.SuperiorID);

				if (wEmployee.Grad >= (int)BMSGrads.Engineer()) {
					wEmployee.Grad = (int)BMSGrads.Default();
				}
				wParms.Add("Grad", wEmployee.Grad);
				wParms.Add("DepartmentID", wEmployee.DepartmentID);
				wParms.Add("Operator", wEmployee.Operator);
				wParms.Add("Active", wEmployee.Active);
				wParms.Add("Manager", wEmployee.Manager);
				wParms.Add("Position", wEmployee.Position);
				wParms.Add("DutyID", wEmployee.DutyID);
				wParms.Add("Phone", wEmployee.Phone);
				wParms.Add("PhoneMAC", wEmployee.PhoneMAC);
				wParms.Add("Email", wEmployee.Email);
				wParms.Add("WeiXin", wEmployee.WeiXin);

				wParms.Add("ID", wEmployee.ID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);

				this.BMS_SaveLoginUser(wEmployee, wErrorCode);
				// this.BMS_LoadEmployeeList(wCompanyID, wErrorCode);
			}
		} catch (Exception ex) {

			LoggerTool.SaveException("BMSService", "BMS_SaveEmployee ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	public int BMS_SaveEmployeeSuperiorID(BMSEmployee wLoginUser, BMSEmployee wEmployee,
			OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				if (this.MBS_CheckLoginName(wLoginUser, wEmployee, wErrorCode))
					wErrorCode.set(MESException.Logic.Value);

				String wSQLText = "";
				wSQLText = StringUtils.Format("Update {0}.mbs_user", wInstance.Result)
						+ " Set SuperiorID=@SuperiorID where ID=@ID";

				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Clear();

				wParms.Add("SuperiorID", wEmployee.SuperiorID);

				wParms.Add("ID", wEmployee.ID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);

			}
		} catch (Exception ex) {

			LoggerTool.SaveException("BMSService", "BMS_SaveEmployee ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	public int BMS_SavePassword(BMSEmployee wLoginUser, BMSEmployee wEmployee, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {

				String wSQLText = "";
				wSQLText = StringUtils.Format("Update {0}.mbs_user", wInstance.Result)
						+ " Set Password=@Password where ID=@ID";

				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Clear();
				wParms.Add("Password", DesUtil.encrypt(wEmployee.Password, appSecret));

				wParms.Add("ID", wEmployee.ID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);

				this.BMS_SaveLoginPassword(wEmployee, wErrorCode);
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_SavePassword ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	public int BMS_DisableEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";
				wSQLText = StringUtils.Format("Update {0}.mbs_user", wInstance.Result)
						+ " Set Active=2,DepartureDate=@DepartureDate where ID=@ID and Grad=0";
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Clear();
				wParms.Add("ID", wEmployee.ID);
				wParms.Add("DepartureDate", DateTime.Now);
				wSQLText = this.DMLChange(wSQLText);
				this.mDBPool.update(wSQLText, wParms);

				this.BMS_DisableLoginUser(wEmployee, wErrorCode);
			}
		} catch (Exception ex) {

			LoggerTool.SaveException("BMSService", "BMS_DisableEmployee ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	public int BMS_ActiveEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";
				wSQLText = StringUtils.Format("Update {0}.mbs_user", wInstance.Result)
						+ " Set Active=1 where ID=@ID and Grad=0";

				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Clear();
				wParms.Add("ID", wEmployee.ID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
				this.BMS_ActiveLoginUser(wEmployee, wErrorCode);
			}
		} catch (Exception ex) {

			LoggerTool.SaveException("BMSService", "BMS_ActiveEmployee ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	public int BMS_ResetPassword(BMSEmployee wLoginUser, BMSEmployee wEmployee, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		try {

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";
				wSQLText = StringUtils.Format("Update {0}.mbs_user", wInstance.Result)
						+ " Set Password=@Password where ID=@ID and Grad=0";
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Clear();
				wParms.Add("Password", DesUtil.encrypt(defaultPassword, appSecret));
				wParms.Add("ID", wEmployee.ID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
				this.BMS_ResetLoginUser(wEmployee, wErrorCode);
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_ResetPassword ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	private List<BMSEmployee> BMS_QueryEmployeeList(BMSEmployee wLoginUser, int wID, String wLoginID, String wLoginName,
			int wDepartmentID, int wPosition, int wDepartmentType, int wPositionType, int wActive,
			OutResult<Int32> wErrorCode) {
		List<BMSEmployee> wEmployeeList = new List<BMSEmployee>();
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wEmployeeList;
			}

			if (wLoginID == null)
				wLoginID = "";
			if (wLoginName == null)
				wLoginName = "";

			String wSQLText = StringUtils.Format(
					"select u.*,t1.Name as Department,t2.Name as PositionName,GROUP_CONCAT(t3.RoleID) as RoleIDList from {0}.mbs_user u"
							+ " left join {0}.bms_department t1 on u.DepartmentID=t1.ID "
							+ " left join {0}.bms_position t2 on u.Position=t2.ID "
							+ " left join {0}.mbs_roleuser t3 on u.ID=t3.UserID "
							+ " where (@Active<=0  or u.Active=@Active ) " + " and  ( @ID <=0   or u.ID=@ID )"
							+ " and  ( @LoginName =''   or u.LoginName=@LoginName )"
							+ " and  ( @LoginID  =''   or u.LoginID=@LoginID )"
							+ " and  ( @DepartmentID <=0   or u.DepartmentID=@DepartmentID )"
							+ " and  ( @DepartmentType <=0   or t1.Type=@DepartmentType )"
							+ " and  ( @PositionType <=0   or t2.DutyID=@PositionType )"
							+ " and  ( @Position <=0   or u.Position=@Position ) group by u.ID  order by u.ID  ",
					wInstance.Result);

			wSQLText = this.DMLChange(wSQLText);
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("Position", wPosition);
			wParms.Add("Active", wActive);
			wParms.Add("DepartmentID", wDepartmentID);
			wParms.Add("DepartmentType", wDepartmentType);
			wParms.Add("PositionType", wPositionType);
			wParms.Add("ID", wID);
			wParms.Add("LoginID", wLoginID);
			wParms.Add("LoginName", wLoginName);

			List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);

			DateTime wBaseTime = DateTime.Now;
			wBaseTime.Add(DateTime.MINUTE, -10);
			for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {

				BMSEmployee wEmployee = new BMSEmployee();
				wEmployee.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
				wEmployee.Name = StringUtils.parseString(wSqlDataReader["Name"]);
				wEmployee.LoginName = StringUtils.parseString(wSqlDataReader["LoginName"]);
				wEmployee.LoginID = StringUtils.parseString(wSqlDataReader["LoginID"]);
				wEmployee.Password = StringUtils.parseString(wSqlDataReader["Password"]);
				wEmployee.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
				wEmployee.Department = StringUtils.parseString(wSqlDataReader["Department"]);
				wEmployee.SuperiorID = StringUtils.parseInt(wSqlDataReader["SuperiorID"]);
				wEmployee.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
				wEmployee.Type = StringUtils.parseInt(wSqlDataReader["Type"]);

				wEmployee.Grad = StringUtils.parseInt(wSqlDataReader["Grad"]);
				wEmployee.Manager = StringUtils.parseInt(wSqlDataReader["Manager"]);
				wEmployee.Position = StringUtils.parseInt(wSqlDataReader["Position"]);
				wEmployee.PositionName = StringUtils.parseString(wSqlDataReader["PositionName"]);
				wEmployee.DutyID = StringUtils.parseInt(wSqlDataReader["DutyID"]);

				wEmployee.Operator = StringUtils.parseString(wSqlDataReader["Operator"]);

				wEmployee.Phone = StringUtils.parseString(wSqlDataReader["Phone"]);
				wEmployee.PhoneMAC = StringUtils.parseLong(wSqlDataReader["PhoneMAC"]);
				wEmployee.Email = StringUtils.parseString(wSqlDataReader["Email"]);
				wEmployee.CreateDate = StringUtils.parseDate(wSqlDataReader["CreateDate"]);

				wEmployee.WeiXin = StringUtils.parseString(wSqlDataReader["WeiXin"]);
				wEmployee.Online = StringUtils.parseInt(wSqlDataReader["Online"]);
				wEmployee.OnLineTime = StringUtils.parseDate(wSqlDataReader["OnLineTime"]);
				wEmployee.LastOnLineTime = StringUtils.parseDate(wSqlDataReader["LastOnLineTime"]);
				wEmployee.RoleIDList = StringUtils
						.parseIntList(StringUtils.parseString(wSqlDataReader["RoleIDList"]), ",");
				if (wEmployee.LastOnLineTime.CompareTo(wBaseTime) > 0)
					wEmployee.Online = 1;
				else
					wEmployee.Online = 0;

				wEmployee.DepartureDate = StringUtils.parseDate(wSqlDataReader["DepartureDate"]);
				if (wEmployee.Active > 0)
					wEmployee.DepartureDate.Add(DateTime.YEAR, 10);

				if (wEmployee.Grad >= (int)BMSGrads.Engineer()) {
					wEmployee.Grad = (int)BMSGrads.Default();
				}

				wEmployeeList.Add(wEmployee);

			}

		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_QueryEmployeeList ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wEmployeeList;
	}

	public List<BMSEmployee> BMS_QueryEmployeeList(BMSEmployee wLoginUser, List<Int32> wIDList,
			OutResult<Int32> wErrorCode) {
		List<BMSEmployee> wEmployeeList = new List<BMSEmployee>();
		try {
			if (wIDList == null || wIDList.Count <= 0)
				return wEmployeeList;

			wIDList.RemoveAll(p -> p <= 0);

			if (wIDList.Count <= 0)
				return wEmployeeList;

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wEmployeeList;
			}

			String wSQLText = StringUtils.Format(
					"select u.*,t1.Name as Department,t2.Name as PositionName from {0}.mbs_user u"
							+ " left join {0}.bms_department t1 on u.DepartmentID=t1.ID "
							+ " left join {0}.bms_position t2 on u.Position=t2.ID " + " where  u.ID in ({1})",
					wInstance.Result, StringUtils.Join(",", wIDList));

			wSQLText = this.DMLChange(wSQLText);
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();

			List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);

			DateTime wBaseTime = DateTime.Now;
			wBaseTime.Add(DateTime.MINUTE, -10);
			for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {

				BMSEmployee wEmployee = new BMSEmployee();
				wEmployee.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
				wEmployee.Name = StringUtils.parseString(wSqlDataReader["Name"]);
				wEmployee.LoginName = StringUtils.parseString(wSqlDataReader["LoginName"]);
				wEmployee.LoginID = StringUtils.parseString(wSqlDataReader["LoginID"]);
				wEmployee.Password = StringUtils.parseString(wSqlDataReader["Password"]);
				wEmployee.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
				wEmployee.Department = StringUtils.parseString(wSqlDataReader["Department"]);
				wEmployee.SuperiorID = StringUtils.parseInt(wSqlDataReader["SuperiorID"]);
				wEmployee.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
				wEmployee.Type = StringUtils.parseInt(wSqlDataReader["Type"]);

				wEmployee.Grad = StringUtils.parseInt(wSqlDataReader["Grad"]);
				wEmployee.Manager = StringUtils.parseInt(wSqlDataReader["Manager"]);
				wEmployee.Position = StringUtils.parseInt(wSqlDataReader["Position"]);
				wEmployee.PositionName = StringUtils.parseString(wSqlDataReader["PositionName"]);
				wEmployee.DutyID = StringUtils.parseInt(wSqlDataReader["DutyID"]);

				wEmployee.Operator = StringUtils.parseString(wSqlDataReader["Operator"]);

				wEmployee.Phone = StringUtils.parseString(wSqlDataReader["Phone"]);
				wEmployee.PhoneMAC = StringUtils.parseLong(wSqlDataReader["PhoneMAC"]);
				wEmployee.Email = StringUtils.parseString(wSqlDataReader["Email"]);
				wEmployee.CreateDate = StringUtils.parseDate(wSqlDataReader["CreateDate"]);

				wEmployee.WeiXin = StringUtils.parseString(wSqlDataReader["WeiXin"]);
				wEmployee.Online = StringUtils.parseInt(wSqlDataReader["Online"]);
				wEmployee.OnLineTime = StringUtils.parseDate(wSqlDataReader["OnLineTime"]);
				wEmployee.LastOnLineTime = StringUtils.parseDate(wSqlDataReader["LastOnLineTime"]);

				if (wEmployee.LastOnLineTime.CompareTo(wBaseTime) > 0)
					wEmployee.Online = 1;
				else
					wEmployee.Online = 0;

				wEmployee.DepartureDate = StringUtils.parseDate(wSqlDataReader["DepartureDate"]);
				if (wEmployee.Active > 0)
					wEmployee.DepartureDate.Add(DateTime.YEAR, 10);

				if (wEmployee.Grad >= (int)BMSGrads.Engineer()) {
					wEmployee.Grad = (int)BMSGrads.Default();
				}

				wEmployeeList.Add(wEmployee);

			}

		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_QueryEmployeeList ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wEmployeeList;
	}

	public List<BMSEmployee> BMS_QueryEmployeeList(BMSEmployee wLoginUser, int wDepartmentID, int wPosition,
			int wDepartmentType, int wPositionType, int wActive, OutResult<Int32> wErrorCode) {
		List<BMSEmployee> wEmployeeList = new List<BMSEmployee>();
		try {

			wEmployeeList = this.BMS_QueryEmployeeList(wLoginUser, 0, "", "", wDepartmentID, wPosition, wDepartmentType,
					wPositionType, wActive, wErrorCode);
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_QueryEmployeeList ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wEmployeeList;
	}

	public BMSEmployee BMS_QueryEmployeeByLoginID(BMSEmployee wLoginUser, String wLoginID,
			OutResult<Int32> wErrorCode) {
		BMSEmployee wBMSEmployee = new BMSEmployee();
		try {
			if (StringUtils.isEmpty(wLoginID))
				return wBMSEmployee;
			List<BMSEmployee> wBMSEmployeeList = this.BMS_QueryEmployeeList(wLoginUser, 0, wLoginID, "", 0, 0, 0, 0, -1,
					wErrorCode);
			if (wBMSEmployeeList != null && wBMSEmployeeList.Count > 0)
				wBMSEmployee = wBMSEmployeeList[0];
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_QueryEmployeeByLoginID ",
					ex);
		}
		return wBMSEmployee;
	}

	public BMSEmployee BMS_QueryEmployeeByLoginName(BMSEmployee wLoginUser, String wLoginName,
			OutResult<Int32> wErrorCode) {
		BMSEmployee wBMSEmployee = new BMSEmployee();
		try {
			if (StringUtils.isEmpty(wLoginName))
				return wBMSEmployee;
			List<BMSEmployee> wBMSEmployeeList = this.BMS_QueryEmployeeList(wLoginUser, 0, "", wLoginName, 0, 0, 0, 0,
					-1, wErrorCode);
			if (wBMSEmployeeList != null && wBMSEmployeeList.Count > 0)
				wBMSEmployee = wBMSEmployeeList[0];
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_QueryEmployeeByLoginName ",
					ex);
		}
		return wBMSEmployee;
	}

	public BMSEmployee BMS_QueryEmployeeByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode) {
		BMSEmployee wBMSEmployee = new BMSEmployee();
		try {
			if (wID <= 0)
				return wBMSEmployee;
			List<BMSEmployee> wBMSEmployeeList = this.BMS_QueryEmployeeList(wLoginUser, wID, "", "", 0, 0, 0, 0, -1,
					wErrorCode);
			if (wBMSEmployeeList != null && wBMSEmployeeList.Count > 0)
				wBMSEmployee = wBMSEmployeeList[0];
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_QueryEmployeeByID ", ex);
		}
		return wBMSEmployee;
	}
 

	public int BMS_DeleteEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		try {

			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.Basic, RoleFunctionID);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result == 0) {
				String wSQLText = "";
				wSQLText = StringUtils.Format("Delete From {0}.mbs_user", wInstance.Result)
						+ " where ID=@ID and Grad=0 and Active=0";
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();
				wParms.Clear();
				wParms.Add("ID", wEmployee.ID);
				wSQLText = this.DMLChange(wSQLText);
				mDBPool.update(wSQLText, wParms);
				this.BMS_ResetLoginUser(wEmployee, wErrorCode);
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_ResetPassword ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	// 多用户平台版
	private int BMS_addLoginUser(BMSEmployee wEmployee, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		ServiceResult<String> wInstance = this.GetDataBaseName(0, MESDBSource.Instance);
		try {
			String wSQLText = "";
			wSQLText = StringUtils.Format("Insert Into {0}.mes_loginuser", wInstance.Result)
					+ "(CompanyID,LoginID,LoginName,Password,Name,PhoneMAC,CreateTime,Active) "
					+ " Values(@CompanyID,@LoginID,@LoginName,@Password,@Name,@PhoneMAC,@CreateTime,@Active)";
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();

			wParms.Add("CompanyID", wEmployee.CompanyID);
			wParms.Add("LoginID", wEmployee.LoginID);
			wParms.Add("LoginName", wEmployee.LoginName);
			wParms.Add("Password", DesUtil.encrypt(defaultPassword, appSecret));
			wParms.Add("Name", wEmployee.Name);
			wParms.Add("PhoneMAC", wEmployee.PhoneMAC);
			wParms.Add("CreateTime", DateTime.Now);
			wParms.Add("Active", wEmployee.Active);
			mDBPool.update(wSQLText, wParms);
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_addLoginUser ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	private int BMS_SaveLoginUser(BMSEmployee wEmployee, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		ServiceResult<String> wInstance = this.GetDataBaseName(0, MESDBSource.Instance);
		try {

			String wSQLText = "";
			wSQLText = StringUtils.Format("Update {0}.mes_loginuser", wInstance.Result)
					+ " Set LoginName=@LoginName,Name=@Name,PhoneMAC=@PhoneMAC,Active=@Active "
					+ " where CompanyID=@CompanyID and LoginID=@LoginID ";
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("LoginName", wEmployee.LoginName);
			wParms.Add("Name", wEmployee.Name);
			wParms.Add("PhoneMAC", wEmployee.PhoneMAC);
			wParms.Add("Active", wEmployee.Active);
			wParms.Add("CompanyID", wEmployee.CompanyID);
			wParms.Add("LoginID", wEmployee.LoginID);
			mDBPool.update(wSQLText, wParms);
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_SaveLoginUser ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	private int BMS_DisableLoginUser(BMSEmployee wEmployee, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		ServiceResult<String> wInstance = this.GetDataBaseName(0, MESDBSource.Instance);
		try {

			String wSQLText = "";
			wSQLText = StringUtils.Format("Update {0}.mes_loginuser", wInstance.Result) + " Set Active=2 "
					+ " where CompanyID=@CompanyID and LoginID=@LoginID ";
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();

			wParms.Add("CompanyID", wEmployee.CompanyID);
			wParms.Add("LoginID", wEmployee.LoginID);
			mDBPool.update(wSQLText, wParms);
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_DisableLoginUser ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	private int BMS_ActiveLoginUser(BMSEmployee wEmployee, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		ServiceResult<String> wInstance = this.GetDataBaseName(wEmployee, MESDBSource.Instance);
		try {
			String wSQLText = "";
			wSQLText = StringUtils.Format("Update {0}.mes_loginuser", wInstance.Result) + " Set Active=1 "
					+ " where CompanyID=@CompanyID and LoginID=@LoginID ";
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();

			wParms.Add("CompanyID", wEmployee.CompanyID);
			wParms.Add("LoginID", wEmployee.LoginID);
			mDBPool.update(wSQLText, wParms);
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_ActiveLoginUser ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	private int BMS_ResetLoginUser(BMSEmployee wEmployee, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		ServiceResult<String> wInstance = this.GetDataBaseName(0, MESDBSource.Instance);

		try {
			String wSQLText = "";
			wSQLText = StringUtils.Format("Update {0}.mes_loginuser", wInstance.Result) + " Set Password=@Password "
					+ " where CompanyID=@CompanyID and LoginID=@LoginID ";
			Dictionary<String, Object> wParms = new Dictionary<String, Object>();
			wParms.Add("Password", DesUtil.encrypt(defaultPassword, appSecret));
			wParms.Add("CompanyID", wEmployee.CompanyID);
			wParms.Add("LoginID", wEmployee.LoginID);
			mDBPool.update(wSQLText, wParms);
		} catch (Exception ex) {

			LoggerTool.SaveException("BMSService", "BMS_ResetLoginUser ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	private int BMS_SaveLoginPassword(BMSEmployee wEmployee, OutResult<Int32> wErrorCode) {
		wErrorCode.set(0);
		ServiceResult<String> wInstance = this.GetDataBaseName(0, MESDBSource.Instance);
		try {
			wErrorCode.set(wInstance.ErrorCode);
			if (wInstance.ErrorCode == 0) {
				String wSQLText = "";
				wSQLText = StringUtils.Format("Update {0}.mes_loginuser", wInstance.Result) + " Set Password=@Password "
						+ " where CompanyID=@CompanyID and LoginID=@LoginID ";
				Dictionary<String, Object> wParms = new Dictionary<String, Object>();

				wParms.Add("Password", wEmployee.Password);
				wParms.Add("CompanyID", wEmployee.CompanyID);
				wParms.Add("LoginID", wEmployee.LoginID);
				mDBPool.update(wSQLText, wParms);
			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_SaveLoginPassword ", ex);
			wErrorCode.set(MESException.DBSQL.Value);
		}
		return wErrorCode.Result;
	}

	private int BMS_Login(String wLoginName, String wPassword, long wMAC, OutResult<Int32> wErrorCode) {
		int wCompanyID = -1;
		try {
			if (StringUtils.isEmpty(wLoginName))
				return wCompanyID;

			if (MESServer.Instance < 1) {
				if (DesUtil.encrypt(wLoginName, appSecret).equalsIgnoreCase(BaseDAO.SysAdmin.LoginName)
						&& wPassword.equalsIgnoreCase(BaseDAO.SysAdmin.Password)) {
					wCompanyID = 0;
					return wCompanyID;
				}
				if (StringUtils.parseInt(wLoginName) > Constants.EngineerUserIDMin) {
					Optional<BMSEmployee> wBMSEmployeeOptional = Constants.GetEngineerUserList().stream().filter(
							p -> p.LoginName.equalsIgnoreCase(wLoginName) && wPassword.equalsIgnoreCase(p.Password))
							.findAny();
					if (wBMSEmployeeOptional.isPresent()) {
						wCompanyID = 0;
						return wCompanyID;
					}
				}

			}
		} catch (Exception ex) {
			LoggerTool.SaveException("BMSService", "BMS_LoginByMAC ", ex);
			wCompanyID = -4;
		}
		try {
			if (wLoginName.Length >= 6) {
				if (MESServer.Instance > 0) {
					ServiceResult<String> wInstance = this.GetDataBaseName(0, MESDBSource.Instance);
					if (wInstance.ErrorCode == 0) {
						String wSQLText = StringUtils.Format(
								"select * from {0}.mes_loginuser u where u.LoginName=@LoginName and u.Active=1",
								wInstance.Result);

						Dictionary<String, Object> wParms = new Dictionary<String, Object>();
						wParms.Add("LoginName", wLoginName);

						List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
						for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
							// wSqlDataReader\[(\"\w+\")\] wSqlDataReader.get($1)
							String wDBPassword = StringUtils.parseString(wSqlDataReader["Password"]);
							long wDBMAC = StringUtils.parseLong(wSqlDataReader["PhoneMAC"]);
							if (wPassword.equalsIgnoreCase(wDBPassword)) {
								if (wMAC != wDBMAC && wDBMAC > 0)
									wCompanyID = -2;
								else
									wCompanyID = StringUtils.parseInt(wSqlDataReader["CompanyID"]);
							} else {
								wCompanyID = -2;
							}
						}

					}
				} else {
					ServiceResult<String> wInstance = this.GetDataBaseName(0, MESDBSource.Basic);
					if (wInstance.ErrorCode == 0) {
						String wSQLText = StringUtils.Format(
								"select * from {0}.mbs_user u where u.LoginName=@LoginName and u.Active=1",
								wInstance.Result);
						Dictionary<String, Object> wParms = new Dictionary<String, Object>();
						wParms.Add("LoginName", wLoginName);

						List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
						for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
							String wDBPassword = StringUtils.parseString(wSqlDataReader["Password"]);
							long wDBMAC = StringUtils.parseLong(wSqlDataReader["PhoneMAC"]);
							if (wPassword.equalsIgnoreCase(wDBPassword)) {
								if (wMAC != wDBMAC && wDBMAC > 0)
									wCompanyID = -2;
								else
									wCompanyID = 0;
							} else {
								wCompanyID = -2;
							}
						}

					}
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			LoggerTool.SaveException("BMSEmployeeDAO", "BMS_Login", ex);
			wCompanyID = -4;
		}
		return wCompanyID;
	}

	private int BMS_LoginByStoken(String wLoginName, String wToken, OutResult<Int32> wErrorCode) {
		int wCompanyID = -1;

		try {

			if (StringUtils.isEmpty(wLoginName))
				return wCompanyID;

			if (StringUtils.isEmpty(wToken))
				return wCompanyID;

			wToken = DesUtil.decrypt(wToken, appSecret);

			String[] wTokenArray = wToken.split("\\+-abc072-\\+");
			if (wTokenArray == null || wTokenArray.length != 5) {
				wCompanyID = -10;
				return wCompanyID;
			}
			String wTokenLoginName = StringUtils.Format("{0}{1}", wTokenArray[3], wTokenArray[1]);
			if (!wLoginName.equalsIgnoreCase(wTokenLoginName)) {
				wCompanyID = -10;
				return wCompanyID;
			}
			DateTime wTokenTime = StringUtils.parseDate(
					StringUtils.Format("{0}-{1} {2}", wTokenArray[2], wTokenArray[4], wTokenArray[0]),
					"yyyy-MM-dd HH:mm:ss");
			DateTime wStartTime = DateTime.Now;
			wStartTime.Add(DateTime.MINUTE, -3);

			DateTime wEndTime = DateTime.Now;
			wEndTime.Add(DateTime.MINUTE, 5);
			if (wTokenTime.CompareTo(wEndTime) > 0 || wTokenTime.CompareTo(wStartTime) < 0) {

				wCompanyID = -10;
				return wCompanyID;
			}
			wCompanyID = 0;
			if (wLoginName.Length >= 6) {
				if (MESServer.Instance > 0) {
					ServiceResult<String> wInstance = this.GetDataBaseName(0, MESDBSource.Instance);
					if (wInstance.ErrorCode == 0) {
						String wSQLText = StringUtils.Format(
								"select * from {0}.mes_loginuser u where u.LoginName=@LoginName and u.Active=1",
								wInstance.Result);

						Dictionary<String, Object> wParms = new Dictionary<String, Object>();
						wParms.Add("LoginName", wLoginName);

						List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
						for (Dictionary<String, Object> wSqlDataReader : wQueryResultList) {
							// wSqlDataReader\[(\"\w+\")\] wSqlDataReader.get($1)
							wCompanyID = StringUtils.parseInt(wSqlDataReader["CompanyID"]);
						}

					}
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			LoggerTool.SaveException("BMSService", "BMS_Login", ex);

		}
		return wCompanyID;
	}

}
