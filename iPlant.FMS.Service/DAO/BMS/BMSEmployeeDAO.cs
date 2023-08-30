using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iPlant.Data.EF;

namespace iPlant.FMC.Service
{
    class BMSEmployeeDAO : BaseDAO
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(BMSEmployeeDAO));
        private static BMSEmployeeDAO Instance = null;


        private static readonly LockHelper mLockHelperM = new LockHelper();

        public const int EngineerUserIDMin = Int32.MaxValue - 47;

        public static String EngineerUserPath = GlobalConstant.GlobalConfiguration.GetValue("User.Engineer.Path");
        private static List<BMSEmployee> EngineerUserList = new List<BMSEmployee>();
        public static List<BMSEmployee> GetEngineerUserList()
        {

            lock (mLockHelperM)
            {
                if (EngineerUserList == null || EngineerUserList.Count <= 0)
                {
                    try
                    {
                        if (!File.Exists(EngineerUserPath))
                        {
                            FileInfo fi = new FileInfo(EngineerUserPath);
                            if (!Directory.Exists(fi.DirectoryName))
                                Directory.CreateDirectory(fi.DirectoryName);

                            File.WriteAllText(EngineerUserPath, "");
                        }
                        String wFileString = File.ReadAllText(EngineerUserPath);
                        if (StringUtils.isNotEmpty(wFileString))
                        {
                            EngineerUserList = JsonTool.JsonToObject<List<BMSEmployee>>(DesUtil.decrypt(wFileString, appSecret));
                        }
                    }
                    catch (Exception e)
                    {
                        logger.Error("GetEngineerUserList", e);
                    }
                }
                if (EngineerUserList == null)
                {
                    EngineerUserList = new List<BMSEmployee>();
                }
            }

            return CloneTool.Clone(EngineerUserList);
        }

        public static void SetEngineerUserList(List<BMSEmployee> wEngineerUserList)
        {
            lock (mLockHelperM)
            {
                try
                {

                    if (wEngineerUserList == null)
                        wEngineerUserList = new List<BMSEmployee>();
                    EngineerUserList = CloneTool.Clone(wEngineerUserList);
                    if (!File.Exists(EngineerUserPath))
                    {
                        FileInfo fi = new FileInfo(EngineerUserPath);
                        if (!Directory.Exists(fi.DirectoryName))
                            Directory.CreateDirectory(fi.DirectoryName);

                        File.WriteAllText(EngineerUserPath, "");
                    }
                    File.WriteAllText(EngineerUserPath, DesUtil.encrypt(JsonTool.ObjectToJson(EngineerUserList), appSecret));

                }
                catch (Exception e)
                {
                    logger.Error("SetEngineerUserList", e);
                }
            }

        }


        private BMSEmployeeDAO() : base()
        {

        }
        //  wSqlDataReader\.get\(\"([^\\"]+)\"\)  wSqlDataReader["$1"]
        public static BMSEmployeeDAO getInstance()
        {
            if (Instance == null)
                Instance = new BMSEmployeeDAO();
            return Instance;
        }

        // 用户管理接口函数
        // 用户管理逻辑函数

        private Boolean MBS_CheckLoginName(BMSEmployee wLoginUser, BMSEmployee wEmployee, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            Boolean wResult = false;
            try
            {
                // wSqlDataReader\[(\"\w+\")\] wSqlDataReader.get($1)

                String wSQLText = "";
                wSQLText = StringUtils.Format("Select Count(*) As UserCount from {0}.mbs_user", MESDBSource.Basic.getDBName())
                        + " where ID!=@ID and (LoginName=@LoginName or  ( @LoginID != '' and   LoginID=@LoginID ) )";

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Clear();

                wParms.Add("ID", wEmployee.ID);
                wParms.Add("LoginName", wEmployee.LoginName);
                wParms.Add("LoginID", wEmployee.LoginID);
                wSQLText = this.DMLChange(wSQLText);
                List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {
                    int wUserCount = StringUtils.parseInt(wSqlDataReader["UserCount"]);
                    if (wUserCount > 0)
                        wResult = true;
                }

            }
            catch (Exception ex)
            {
                logger.Error("MBS_CheckLoginName ", ex);
            }
            return wResult;
        }


        private Boolean ChcekToken(String wLoginName, String wToken, OutResult<Int32> wErrorCode)
        {
            if (StringUtils.isEmpty(wLoginName))
            {
                wErrorCode.set(MESException.UserValidationFailed.Value);
                return false;
            }


            if (StringUtils.isEmpty(wToken))
            {
                wErrorCode.set(MESException.UserValidationFailed.Value);
                return false;
            }

            wToken = DesUtil.decrypt(wToken, appSecret);

            String[] wTokenArray = StringUtils.split(wToken, "+-abc072-+");
            if (wTokenArray == null || wTokenArray.Length != 5)
            {
                wErrorCode.set(MESException.UserValidationFailed.Value);
                return false;
            }
            String wTokenLoginName = StringUtils.Format("{0}{1}", wTokenArray[3], wTokenArray[1]);
            if (!wLoginName.Equals(wTokenLoginName, StringComparison.CurrentCultureIgnoreCase))
            {
                wErrorCode.set(MESException.UserValidationFailed.Value);
                return false;
            }
            DateTime wTokenTime = StringUtils.parseDate(
                    StringUtils.Format("{0}-{1} {2}", wTokenArray[2], wTokenArray[4], wTokenArray[0]),
                    "yyyy-MM-dd HH:mm:ss");
            DateTime wStartTime = DateTime.Now;
            wStartTime = wStartTime.AddMinutes(-3);

            DateTime wEndTime = DateTime.Now;
            wEndTime = wEndTime.AddMinutes(5);
            if (wTokenTime.CompareTo(wEndTime) > 0 || wTokenTime.CompareTo(wStartTime) < 0)
            {
                wErrorCode.set(MESException.UserValidationFailed.Value);
                return false;
            }
            return true;
        }
        public BMSEmployee BMS_LoginEmployeeByToken(String wLoginName, String wToken, OutResult<Int32> wErrorCode)
        {
            BMSEmployee wEmployee = new BMSEmployee();
            wErrorCode.set(0);
            wEmployee.ID = 0;
            try
            {
                if (!ChcekToken(wLoginName, wToken, wErrorCode))
                {
                    return wEmployee;
                }

                if (DesUtil.encrypt(wLoginName, appSecret).Equals(BaseDAO.SysAdmin.LoginName, StringComparison.CurrentCultureIgnoreCase))
                {
                    return BaseDAO.SysAdmin;
                }
                if (StringUtils.parseInt(wLoginName) > 2147483600)
                {
                    BMSEmployee wBMSEmployeeOptional = GetEngineerUserList().Find(p => p.LoginName.Equals(wLoginName));
                    if (wBMSEmployeeOptional != null && wBMSEmployeeOptional.ID > 0)
                    {
                        wEmployee = wBMSEmployeeOptional;
                        wEmployee.LoginName = DesUtil.encrypt(wEmployee.LoginName, appSecret);
                        return wEmployee;
                    }
                }


                if (DateTime.Now.CompareTo(MESServer.ExpiredTime) > 0)
                {
                    wErrorCode.set(MESException.UnPower.Value);
                    return wEmployee;
                }
                String wSQLText = StringUtils
                        .Format("select u.*,t5.Name as Operator,t1.Name as Department,t1.Code as DepartmentCode,t2.Name as PositionName from {0}.mbs_user u "
                                + " left join {0}.bms_department t1 on u.DepartmentID=t1.ID "
                                + " left join {0}.bms_position t2 on u.Position=t2.ID "
                                + " left join {0}.mbs_user t5 on t5.ID=u.OperatorID "
                                + " where u.LoginName=@LoginName and u.Active=1", MESDBSource.Basic.getDBName());

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Clear();

                wParms.Add("LoginName", wLoginName);
                wSQLText = this.DMLChange(wSQLText);
                List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {

                    wEmployee.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    wEmployee.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                    wEmployee.Password = StringUtils.parseString(wSqlDataReader["Password"]);
                    wEmployee.LoginName = DesUtil.encrypt(StringUtils.parseString(wSqlDataReader["LoginName"]),
                            appSecret);
                    wEmployee.Password = StringUtils.parseString(wSqlDataReader["Password"]);
                    wEmployee.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
                    wEmployee.Department = StringUtils.parseString(wSqlDataReader["Department"]);
                    wEmployee.DepartmentCode = StringUtils.parseString(wSqlDataReader["DepartmentCode"]);
                    wEmployee.PositionName = StringUtils.parseString(wSqlDataReader["PositionName"]);
                    wEmployee.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                    wEmployee.Grad = StringUtils.parseInt(wSqlDataReader["Grad"]);
                    wEmployee.Manager = StringUtils.parseInt(wSqlDataReader["Manager"]);
                    wEmployee.OperatorID = StringUtils.parseInt(wSqlDataReader["OperatorID"]);
                    wEmployee.Operator = StringUtils.parseString(wSqlDataReader["Operator"]);
                    wEmployee.LoginID = StringUtils.parseString(wSqlDataReader["LoginID"]);

                    wEmployee.Phone = StringUtils.parseString(wSqlDataReader["Phone"]);
                    wEmployee.PhoneMAC = StringUtils.parseString(wSqlDataReader["PhoneMAC"]);

                    wEmployee.Email = StringUtils.parseString(wSqlDataReader["Email"]);
                    wEmployee.CreateDate = StringUtils.parseDate(wSqlDataReader["CreateDate"]);
                    wEmployee.WeiXin = StringUtils.parseString(wSqlDataReader["WeiXin"]);

                    wEmployee.Position = StringUtils.parseInt(wSqlDataReader["Position"]);
                    wEmployee.DutyID = StringUtils.parseInt(wSqlDataReader["DutyID"]);
                    Boolean wDBOnline = StringUtils.parseBoolean(wSqlDataReader["Online"]);

                    wEmployee.Online = wDBOnline ? 1 : 0;
                    wEmployee.OnLineTime = StringUtils.parseDate(wSqlDataReader["OnLineTime"]);

                    wEmployee.FaceIcon = StringUtils.parseString(wSqlDataReader["FaceIcon"]);
                    if (wEmployee.Grad >= (int)BMSGrads.Engineer)
                    {
                        wEmployee.Grad = (int)BMSGrads.Default;
                    }

                }

            }
            catch (Exception ex)
            {
                logger.Error("BMS_LoginEmployeeByToken ", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wEmployee;
        }

        public BMSEmployee BMS_LoginEmployee(String wLoginName, String wPassword, long wMAC,
                OutResult<Int32> wErrorCode)
        {
            BMSEmployee wEmployee = new BMSEmployee();
            wErrorCode.set(0);
            try
            {
                wEmployee.ID = 0;
                String wDESPassword = DesUtil.encrypt(wPassword, appSecret);


                if (DesUtil.encrypt(wLoginName, appSecret).Equals(BaseDAO.SysAdmin.LoginName, StringComparison.CurrentCultureIgnoreCase)
                        && wDESPassword.Equals(BaseDAO.SysAdmin.Password, StringComparison.CurrentCultureIgnoreCase))
                {
                    return BaseDAO.SysAdmin;
                }
                if (StringUtils.parseInt(wLoginName) > 2147483600)
                {
                    BMSEmployee wBMSEmployeeOptional = GetEngineerUserList().Find(p => p.LoginName.Equals(wLoginName));
                    if (wBMSEmployeeOptional != null && wBMSEmployeeOptional.ID > 0)
                    {
                        wEmployee = wBMSEmployeeOptional;
                        wEmployee.LoginName = DesUtil.encrypt(wEmployee.LoginName, appSecret);
                        return wEmployee;
                    }
                }


                if (DateTime.Now.CompareTo(MESServer.ExpiredTime) > 0)
                {
                    wErrorCode.set(MESException.UnPower.Value);
                    return wEmployee;
                }
                String wSQLText = StringUtils
                        .Format("select u.*,t5.Name as Operator, t1.Name as Department,t1.Code as DepartmentCode,t2.Name as PositionName from {0}.mbs_user u" +
                        " left join {0}.mbs_user t5 on t5.ID=u.OperatorID "
                                + " left join {0}.bms_department t1 on u.DepartmentID=t1.ID "
                                + " left join {0}.bms_position t2 on u.Position=t2.ID "
                                + " where u.LoginName=@LoginName and u.Password=@Password and u.Active=1", MESDBSource.Basic.getDBName());

                Dictionary<String, Object> wParms = new Dictionary<String, Object>
                {
                    { "LoginName", wLoginName },
                    { "Password", wDESPassword }
                };

                List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {

                    wEmployee.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    // wEmployee.CompanyID = StringUtils.parseInt(wSqlDataReader["CompanyID"]);
                    wEmployee.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                    wEmployee.LoginName = DesUtil.encrypt(StringUtils.parseString(wSqlDataReader["LoginName"]),
                            appSecret);
                    wEmployee.Password = StringUtils.parseString(wSqlDataReader["Password"]);
                    wEmployee.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);

                    wEmployee.Department = StringUtils.parseString(wSqlDataReader["Department"]);
                    wEmployee.DepartmentCode = StringUtils.parseString(wSqlDataReader["DepartmentCode"]);
                    wEmployee.PositionName = StringUtils.parseString(wSqlDataReader["PositionName"]);

                    wEmployee.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                    wEmployee.Grad = StringUtils.parseInt(wSqlDataReader["Grad"]);
                    wEmployee.Manager = StringUtils.parseInt(wSqlDataReader["Manager"]);
                    wEmployee.OperatorID = StringUtils.parseInt(wSqlDataReader["OperatorID"]);
                    wEmployee.Operator = StringUtils.parseString(wSqlDataReader["Operator"]);
                    wEmployee.LoginID = StringUtils.parseString(wSqlDataReader["LoginID"]);
                    wEmployee.Phone = StringUtils.parseString(wSqlDataReader["Phone"]);
                    wEmployee.PhoneMAC = StringUtils.parseString(wSqlDataReader["PhoneMAC"]);

                    wEmployee.Email = StringUtils.parseString(wSqlDataReader["Email"]);
                    wEmployee.CreateDate = StringUtils.parseDate(wSqlDataReader["CreateDate"]);
                    wEmployee.WeiXin = StringUtils.parseString(wSqlDataReader["WeiXin"]);

                    wEmployee.Position = StringUtils.parseInt(wSqlDataReader["Position"]);
                    wEmployee.DutyID = StringUtils.parseInt(wSqlDataReader["DutyID"]);
                    Boolean wDBOnline = StringUtils.parseBoolean(wSqlDataReader["Online"]);
                    wEmployee.Password = StringUtils.parseString(wSqlDataReader["Password"]);
                    wEmployee.Online = wDBOnline ? 1 : 0;
                    wEmployee.OnLineTime = StringUtils.parseDate(wSqlDataReader["OnLineTime"]);
                    wEmployee.FaceIcon = StringUtils.parseString(wSqlDataReader["FaceIcon"]);
                    if (wEmployee.Grad >= (int)BMSGrads.Engineer)
                    {
                        wEmployee.Grad = (int)BMSGrads.Default;
                    }

                }

                if (wEmployee.ID == 0)
                {
                    wErrorCode.set(MESException.UserValidationFailed.Value);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                logger.Error("BMS_LoginEmployee ", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wEmployee;
        }

        public BMSEmployee BMS_LoginEmployeeByUserName(String wUserName, String wPassword, OutResult<Int32> wErrorCode)
        {
            BMSEmployee wEmployee = new BMSEmployee();
            wErrorCode.set(0);
            try
            {
                String wDESPassword = DesUtil.encrypt(wPassword, appSecret);

                if (wUserName.Equals(BaseDAO.SysAdmin.Name, StringComparison.CurrentCultureIgnoreCase)
                        && wDESPassword.Equals(BaseDAO.SysAdmin.Password, StringComparison.CurrentCultureIgnoreCase))
                {
                    return BaseDAO.SysAdmin;
                }


                if (DateTime.Now.CompareTo(MESServer.ExpiredTime) > 0)
                {
                    wErrorCode.set(MESException.UnPower.Value);
                    return wEmployee;
                }
                String wSQLText = StringUtils
                      .Format("select u.*,t5.Name as Operator, t1.Name as Department,t1.Code as DepartmentCode,t2.Name as PositionName from {0}.mbs_user u" +
                        " left join {0}.mbs_user t5 on t5.ID=u.OperatorID "
                                + " left join {0}.bms_department t1 on u.DepartmentID=t1.ID "
                                + " left join {0}.bms_position t2 on u.Position=t2.ID "
                                + " where u.Name=@Name and u.Password =@Password and  u.Active=1", MESDBSource.Basic.getDBName());

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Clear();

                wParms.Add("Name", wUserName);
                wParms.Add("Password", wDESPassword);
                wSQLText = this.DMLChange(wSQLText);
                List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {

                    wEmployee.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    wEmployee.CompanyID = 0;
                    wEmployee.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                    wEmployee.LoginName = DesUtil.encrypt(StringUtils.parseString(wSqlDataReader["LoginName"]),
                            appSecret);
                    wEmployee.Password = StringUtils.parseString(wSqlDataReader["Password"]);
                    wEmployee.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
                    wEmployee.Department = StringUtils.parseString(wSqlDataReader["Department"]);
                    wEmployee.DepartmentCode = StringUtils.parseString(wSqlDataReader["DepartmentCode"]);

                    wEmployee.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                    wEmployee.Grad = StringUtils.parseInt(wSqlDataReader["Grad"]);
                    wEmployee.Manager = StringUtils.parseInt(wSqlDataReader["Manager"]);
                    wEmployee.OperatorID = StringUtils.parseInt(wSqlDataReader["OperatorID"]);
                    wEmployee.Operator = StringUtils.parseString(wSqlDataReader["Operator"]);
                    wEmployee.LoginID = StringUtils.parseString(wSqlDataReader["LoginID"]);
                    wEmployee.Phone = StringUtils.parseString(wSqlDataReader["Phone"]);
                    wEmployee.PhoneMAC = StringUtils.parseString(wSqlDataReader["PhoneMAC"]);

                    wEmployee.Email = StringUtils.parseString(wSqlDataReader["Email"]);
                    wEmployee.CreateDate = StringUtils.parseDate(wSqlDataReader["CreateDate"]);
                    wEmployee.WeiXin = StringUtils.parseString(wSqlDataReader["WeiXin"]);

                    wEmployee.Position = StringUtils.parseInt(wSqlDataReader["Position"]);

                    wEmployee.PositionName = StringUtils.parseString(wSqlDataReader["PositionName"]);
                    wEmployee.DutyID = StringUtils.parseInt(wSqlDataReader["DutyID"]);
                    Boolean wDBOnline = StringUtils.parseBoolean(wSqlDataReader["Online"]);
                    wEmployee.Password = wDESPassword;
                    wEmployee.Online = wDBOnline ? 1 : 0;
                    wEmployee.OnLineTime = StringUtils.parseDate(wSqlDataReader["OnLineTime"]);

                    wEmployee.FaceIcon = StringUtils.parseString(wSqlDataReader["FaceIcon"]);
                    if (wEmployee.Grad >= (int)BMSGrads.Engineer)
                    {
                        wEmployee.Grad = (int)BMSGrads.Default;
                    }

                }
                if (wEmployee.ID == 0)
                {
                    wErrorCode.set(MESException.UserValidationFailed.Value);
                }
            }
            catch (Exception ex)
            {
                logger.Error("BMS_LoginEmployee ", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wEmployee;
        }

        public void BMS_AddEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee, OutResult<Int32> wErrorCode)
        {

            try
            {
                wErrorCode.set(0);

                String wDefaultPassword = DesUtil.encrypt(defaultPassword, appSecret);

                String wSQLText = "";
                if (wEmployee.ID <= 0)
                {
                    wSQLText = StringUtils.Format("Insert Into {0}.mbs_user", MESDBSource.Basic.getDBName())
                            + "(Name,LoginName,Password,Phone,PhoneMAC,Email,DepartmentID,CreateDate,OperatorID,WeiXin,Grad,Manager,"
                            + " Position,DutyID,Active,Online,DepartureDate,OnLineTime,LastOnLineTime,LoginID,Type,SuperiorID) "
                            + " Values(@Name,@LoginName,@Password,@Phone,@PhoneMAC,@Email,@DepartmentID,@CreateDate,@OperatorID,@WeiXin,@Grad,"
                            + "@Manager,@Position,@DutyID,@Active,@Online,@DepartureDate,@OnLineTime,@LastOnLineTime,@LoginID,@Type,@SuperiorID)";
                }
                else
                {

                    wSQLText = StringUtils.Format("Insert Into {0}.mbs_user", MESDBSource.Basic.getDBName())
                            + "(ID,Name,LoginName,Password,Phone,PhoneMAC,Email,DepartmentID,CreateDate,OperatorID,WeiXin,Grad,Manager,"
                            + " Position,DutyID,Active,Online,DepartureDate,OnLineTime,LastOnLineTime,LoginID,Type,SuperiorID) "
                            + " Values(@ID,@Name,@LoginName,@Password,@Phone,@PhoneMAC,@Email,@DepartmentID,@CreateDate,@OperatorID,@WeiXin,@Grad,"
                            + "@Manager,@Position,@DutyID,@Active,@Online,@DepartureDate,@OnLineTime,@LastOnLineTime,@LoginID,@Type,@SuperiorID)";

                }

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Clear();

                BMSEmployee wBMSEmployeeDB = null;
                if (StringUtils.isNotEmpty(wEmployee.LoginID) && wEmployee.LoginID.Length > 6)
                {
                    // 检查LoginID唯一性 检查LoginID在LoginName中的唯一性
                    wBMSEmployeeDB = this.BMS_QueryEmployeeByLoginID(wLoginUser, wEmployee.LoginID, wErrorCode);
                    if (wBMSEmployeeDB.ID > 0)
                    {
                        wErrorCode.set(MESException.Logic.Value);
                        return;
                    }

                    if (StringUtils.isEmpty(wEmployee.LoginName))
                    {
                        wEmployee.LoginName = wEmployee.LoginID;
                    }

                }
                if (StringUtils.isNotEmpty(wEmployee.LoginName) && wEmployee.LoginName.Length >= 6)
                {
                    // 检查LoginID唯一性 检查LoginID在LoginName中的唯一性
                    wBMSEmployeeDB = this.BMS_QueryEmployeeByLoginName(wLoginUser, wEmployee.LoginName, wErrorCode);
                    if (wBMSEmployeeDB.ID > 0)
                    {
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
                wParms.Add("OperatorID", wEmployee.OperatorID);
                wParms.Add("WeiXin", wEmployee.WeiXin);

                if (wEmployee.Grad >= (int)BMSGrads.Engineer)
                {
                    wEmployee.Grad = (int)BMSGrads.Default;
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

                if (wEmployee.ID > 0)
                {
                    mDBPool.update(wSQLText, wParms);
                }
                else
                {
                    wEmployee.ID = (int)mDBPool.insert(wSQLText, wParms);
                }

                if (StringUtils.isEmpty(wEmployee.LoginName) && wEmployee.ID > 0)
                {
                    wEmployee.LoginName = String.Format("{0:D6}", wEmployee.ID);
                    wSQLText = StringUtils.Format("Update {0}.mbs_user", MESDBSource.Basic.getDBName())
                            + " Set LoginName=@LoginName  where ID = @ID";
                    wParms.Clear();

                    wParms.Add("LoginName", wEmployee.LoginName);
                    wParms.Add("ID", wEmployee.ID);

                    mDBPool.update(wSQLText, wParms);
                }

            }
            catch (Exception ex)
            {
                logger.Error("BMS_addEmployee ", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
        }

        public void BMS_UpdateOnline(BMSEmployee wEmployee, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {
                if (wEmployee == null || wEmployee.ID <= 0 || wEmployee.ID >= 2147483600)
                {
                    return;
                }

                wEmployee.Online = 1;
                DateTime wBaseTime = DateTime.Now;
                wBaseTime = new DateTime(2020, 1, 1);

                if (wEmployee.LastOnLineTime.CompareTo(wBaseTime) <= 0)
                    wEmployee.LastOnLineTime = DateTime.Now;

                if (wEmployee.OnLineTime.CompareTo(wBaseTime) <= 0)
                    wEmployee.OnLineTime = wEmployee.LastOnLineTime;

                wBaseTime = DateTime.Now;
                wBaseTime = wBaseTime.AddMinutes(-10);

                if (wEmployee.LastOnLineTime.CompareTo(wBaseTime) < 0)
                    wEmployee.OnLineTime = DateTime.Now;

                wEmployee.LastOnLineTime = DateTime.Now;

                wErrorCode.set(0);


                String wSQLText = "";
                wSQLText = StringUtils.Format("Update {0}.mbs_user", MESDBSource.Basic.getDBName())
                        + " Set LastOnLineTime=@LastOnLineTime,OnLineTime=@OnLineTime where ID=@ID";

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Clear();
                wParms.Add("LastOnLineTime", wEmployee.LastOnLineTime);
                wParms.Add("OnLineTime", wEmployee.OnLineTime);
                wParms.Add("ID", wEmployee.ID);
                wSQLText = this.DMLChange(wSQLText);
                mDBPool.update(wSQLText, wParms);
            }
            catch (Exception ex)
            {

                logger.Error("BMS_UpdateOnline ", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
        }

        public void BMS_SaveEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee, OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0);


                if (this.MBS_CheckLoginName(wLoginUser, wEmployee, wErrorCode))
                {
                    wErrorCode.set(MESException.Duplication.Value);
                    return;
                }

                String wSQLText = "";
                wSQLText = StringUtils.Format("Update {0}.mbs_user", MESDBSource.Basic.getDBName())
                        + " Set Name=@Name,LoginName=@LoginName,DepartmentID=@DepartmentID,OperatorID=@OperatorID,Grad=@Grad,Type=@Type,SuperiorID=@SuperiorID,"
                        + " Active=@Active,Manager=@Manager,Position=@Position,DutyID=@DutyID,Phone=@Phone,PhoneMAC=@PhoneMAC,Email=@Email,WeiXin=@WeiXin,LoginID=@LoginID,FaceIcon=@FaceIcon  where ID=@ID";

                if (wEmployee.Grad > 0)
                    wEmployee.Active = 1;

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Clear();
                wParms.Add("Name", wEmployee.Name);
                wParms.Add("LoginName", wEmployee.LoginName);
                wParms.Add("Type", wEmployee.Type);
                wParms.Add("SuperiorID", wEmployee.SuperiorID);

                wParms.Add("FaceIcon", wEmployee.FaceIcon);

                if (wEmployee.Grad >= (int)BMSGrads.Engineer)
                {
                    wEmployee.Grad = (int)BMSGrads.Default;
                }
                wParms.Add("Grad", wEmployee.Grad);
                wParms.Add("DepartmentID", wEmployee.DepartmentID);
                wParms.Add("OperatorID", wEmployee.OperatorID);
                wParms.Add("Active", wEmployee.Active);
                wParms.Add("Manager", wEmployee.Manager);
                wParms.Add("Position", wEmployee.Position);
                wParms.Add("DutyID", wEmployee.DutyID);
                wParms.Add("Phone", wEmployee.Phone);
                wParms.Add("PhoneMAC", wEmployee.PhoneMAC);
                wParms.Add("Email", wEmployee.Email);
                wParms.Add("WeiXin", wEmployee.WeiXin);
                wParms.Add("LoginID", wEmployee.LoginID);

                wParms.Add("ID", wEmployee.ID);
                wSQLText = this.DMLChange(wSQLText);
                mDBPool.update(wSQLText, wParms);


            }
            catch (Exception ex)
            {
                logger.Error("BMS_SaveEmployee error:", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
        }


        public int BMS_SyncEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {

                if (this.MBS_CheckLoginName(wLoginUser, wEmployee, wErrorCode))
                    wErrorCode.set(MESException.Logic.Value);

                String wSQLText = "";
                wSQLText = StringUtils.Format("Update {0}.mbs_user", MESDBSource.Basic.getDBName())
                        + " Set Name=@Name,LoginName=@LoginName,DepartmentID=@DepartmentID,OperatorID=@OperatorID,"
                        + " Grad=@Grad,Type=@Type,SuperiorID=@SuperiorID,Password=@Password,"
                        + " Active=@Active,Manager=@Manager,Position=@Position,DutyID=@DutyID,Phone=@Phone,PhoneMAC=@PhoneMAC,Email=@Email,WeiXin=@WeiXin  where ID=@ID";

                if (wEmployee.Grad > 0)
                    wEmployee.Active = 1;

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Clear();
                wParms.Add("Name", wEmployee.Name);
                wParms.Add("LoginName", wEmployee.LoginName);
                wParms.Add("Password", DesUtil.encrypt(wEmployee.Password, appSecret));
                wParms.Add("Type", wEmployee.Type);
                wParms.Add("SuperiorID", wEmployee.SuperiorID);

                if (wEmployee.Grad >= (int)BMSGrads.Engineer)
                {
                    wEmployee.Grad = (int)BMSGrads.Default;
                }
                wParms.Add("Grad", wEmployee.Grad);
                wParms.Add("DepartmentID", wEmployee.DepartmentID);
                wParms.Add("OperatorID", wEmployee.OperatorID);
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


            }
            catch (Exception ex)
            {

                logger.Error("BMS_SaveEmployee ", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wErrorCode.Result;
        }

        public int BMS_SaveEmployeeSuperiorID(BMSEmployee wLoginUser, BMSEmployee wEmployee,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {
                if (this.MBS_CheckLoginName(wLoginUser, wEmployee, wErrorCode))
                    wErrorCode.set(MESException.Logic.Value);

                String wSQLText = "";
                wSQLText = StringUtils.Format("Update {0}.mbs_user", MESDBSource.Basic.getDBName())
                        + " Set SuperiorID=@SuperiorID where ID=@ID";

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Clear();

                wParms.Add("SuperiorID", wEmployee.SuperiorID);

                wParms.Add("ID", wEmployee.ID);
                wSQLText = this.DMLChange(wSQLText);
                mDBPool.update(wSQLText, wParms);


            }
            catch (Exception ex)
            {

                logger.Error("BMS_SaveEmployee ", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wErrorCode.Result;
        }

        public int BMS_SavePassword(BMSEmployee wLoginUser, BMSEmployee wEmployee, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {


                String wSQLText = "";
                wSQLText = StringUtils.Format("Update {0}.mbs_user", MESDBSource.Basic.getDBName())
                        + " Set Password=@Password where ID=@ID";

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Clear();
                wParms.Add("Password", DesUtil.encrypt(wEmployee.Password, appSecret));

                wParms.Add("ID", wEmployee.ID);
                wSQLText = this.DMLChange(wSQLText);
                mDBPool.update(wSQLText, wParms);


            }
            catch (Exception ex)
            {
                logger.Error("BMS_SavePassword ", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wErrorCode.Result;
        }

        public int BMS_DisableEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {

                String wSQLText = "";
                wSQLText = StringUtils.Format("Update {0}.mbs_user", MESDBSource.Basic.getDBName())
                        + " Set Active=2,DepartureDate=@DepartureDate where ID=@ID and Grad=0";
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Clear();
                wParms.Add("ID", wEmployee.ID);
                wParms.Add("DepartureDate", DateTime.Now);
                wSQLText = this.DMLChange(wSQLText);
                this.mDBPool.update(wSQLText, wParms);


            }
            catch (Exception ex)
            {

                logger.Error("BMS_DisableEmployee ", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wErrorCode.Result;
        }

        public int BMS_ActiveEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {

                String wSQLText = "";
                wSQLText = StringUtils.Format("Update {0}.mbs_user", MESDBSource.Basic.getDBName())
                        + " Set Active=1 where ID=@ID and Grad=0";

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Clear();
                wParms.Add("ID", wEmployee.ID);
                wSQLText = this.DMLChange(wSQLText);
                mDBPool.update(wSQLText, wParms);

            }
            catch (Exception ex)
            {

                logger.Error("BMS_ActiveEmployee ", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wErrorCode.Result;
        }

        public int BMS_ResetPassword(BMSEmployee wLoginUser, BMSEmployee wEmployee, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {


                String wSQLText = "";
                wSQLText = StringUtils.Format("Update {0}.mbs_user", MESDBSource.Basic.getDBName())
                        + " Set Password=@Password where ID=@ID and Grad=0";
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Clear();
                wParms.Add("Password", DesUtil.encrypt(defaultPassword, appSecret));
                wParms.Add("ID", wEmployee.ID);
                wSQLText = this.DMLChange(wSQLText);
                mDBPool.update(wSQLText, wParms);


            }
            catch (Exception ex)
            {
                logger.Error("BMS_ResetPassword ", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wErrorCode.Result;
        }

        private List<BMSEmployee> BMS_QueryEmployeeList(BMSEmployee wLoginUser, int wID, String wLoginID, String wLoginName, String wName,
                int wDepartmentID, int wPosition, int wDepartmentType, int wPositionType, int wRoleID, int wActive, Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<BMSEmployee> wEmployeeList = new List<BMSEmployee>();
            wErrorCode.set(0);
            try
            {

                if (wLoginID == null)
                    wLoginID = "";
                if (wLoginName == null)
                    wLoginName = "";

                String wSQLText = StringUtils.Format(
                        "select u.*,t5.Name as Operator,t1.Name as Department,t1.Code as DepartmentCode,t2.Name as PositionName," +
                        " GROUP_CONCAT(t3.RoleID) as RoleIDList, GROUP_CONCAT(t6.Code) as RoleCode," +
                        " GROUP_CONCAT(t6.Name) as RoleName from {0}.mbs_user u"
                                + " left join {0}.bms_department t1 on u.DepartmentID=t1.ID "
                                + " left join {0}.bms_position t2 on u.Position=t2.ID "
                                + " left join {0}.mbs_roleuser t3 on u.ID=t3.UserID "
                                + " left join {0}.mbs_user t5 on t5.ID=u.OperatorID "
                                + " left join {0}.mbs_role t6 on t6.ID=t3.RoleID "
                                + " where (@Active< 0  or u.Active=@Active ) " + " and  ( @ID <=0   or u.ID=@ID )"
                                + " and  ( @LoginName =''   or u.LoginName=@LoginName )"
                                + " and  ( @LoginID  =''   or u.LoginID=@LoginID )"
                                + " and  ( @Name  =''   or u.Name like @Name )"
                                + " and  ( @DepartmentID <=0   or u.DepartmentID=@DepartmentID )"
                                + " and  ( @DepartmentType <=0   or t1.Type=@DepartmentType )"
                                + " and  ( @RoleID <=0   or t3.RoleID=@RoleID )"
                                + " and  ( @PositionType <=0   or t2.DutyID=@PositionType )"
                                + " and  ( @Position <=0   or u.Position=@Position ) group by u.ID    ",
                        MESDBSource.Basic.getDBName());

                wSQLText = this.DMLChange(wSQLText);
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Add("Position", wPosition);
                wParms.Add("Active", wActive);
                wParms.Add("DepartmentID", wDepartmentID);
                wParms.Add("DepartmentType", wDepartmentType);
                wParms.Add("PositionType", wPositionType);
                wParms.Add("RoleID", wRoleID);
                wParms.Add("Name", StringUtils.isEmpty(wName) ? wName : "%" + wName + "%");
                wParms.Add("ID", wID);
                wParms.Add("LoginID", wLoginID);
                wParms.Add("LoginName", wLoginName);
                 

                List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms, wPagination);

                DateTime wBaseTime = DateTime.Now;
                wBaseTime = wBaseTime.AddMinutes(-10);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {

                    BMSEmployee wEmployee = new BMSEmployee();
                    wEmployee.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    wEmployee.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                    wEmployee.LoginName = StringUtils.parseString(wSqlDataReader["LoginName"]);
                    wEmployee.LoginID = StringUtils.parseString(wSqlDataReader["LoginID"]);
                    wEmployee.Password = StringUtils.parseString(wSqlDataReader["Password"]);
                    wEmployee.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
                    wEmployee.Department = StringUtils.parseString(wSqlDataReader["Department"]);
                    wEmployee.DepartmentCode = StringUtils.parseString(wSqlDataReader["DepartmentCode"]);
                    wEmployee.SuperiorID = StringUtils.parseInt(wSqlDataReader["SuperiorID"]);
                    wEmployee.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                    wEmployee.Type = StringUtils.parseInt(wSqlDataReader["Type"]);

                    wEmployee.Grad = StringUtils.parseInt(wSqlDataReader["Grad"]);
                    wEmployee.Manager = StringUtils.parseInt(wSqlDataReader["Manager"]);
                    wEmployee.Position = StringUtils.parseInt(wSqlDataReader["Position"]);
                    wEmployee.PositionName = StringUtils.parseString(wSqlDataReader["PositionName"]);
                    wEmployee.DutyID = StringUtils.parseInt(wSqlDataReader["DutyID"]);

                    wEmployee.OperatorID = StringUtils.parseInt(wSqlDataReader["OperatorID"]);
                    wEmployee.Operator = StringUtils.parseString(wSqlDataReader["Operator"]);

                    wEmployee.Phone = StringUtils.parseString(wSqlDataReader["Phone"]);
                    wEmployee.PhoneMAC = StringUtils.parseString(wSqlDataReader["PhoneMAC"]);
                    wEmployee.Email = StringUtils.parseString(wSqlDataReader["Email"]);
                    wEmployee.CreateDate = StringUtils.parseDate(wSqlDataReader["CreateDate"]);

                    wEmployee.WeiXin = StringUtils.parseString(wSqlDataReader["WeiXin"]);
                    wEmployee.Online = StringUtils.parseInt(wSqlDataReader["Online"]);
                    wEmployee.OnLineTime = StringUtils.parseDate(wSqlDataReader["OnLineTime"]);
                    wEmployee.LastOnLineTime = StringUtils.parseDate(wSqlDataReader["LastOnLineTime"]);
                    wEmployee.RoleIDList = StringUtils
                            .parseIntList(StringUtils.parseString(wSqlDataReader["RoleIDList"]), ",");
                    wEmployee.RoleName = StringUtils.parseString(wSqlDataReader["RoleName"]);
                    wEmployee.RoleCode = StringUtils.parseString(wSqlDataReader["RoleCode"]);
                    if (wEmployee.LastOnLineTime.CompareTo(wBaseTime) > 0)
                        wEmployee.Online = 1;
                    else
                        wEmployee.Online = 0;

                    wEmployee.DepartureDate = StringUtils.parseDate(wSqlDataReader["DepartureDate"]);

                    wEmployee.FaceIcon = StringUtils.parseString(wSqlDataReader["FaceIcon"]);
                    if (wEmployee.Active > 0)
                        wEmployee.DepartureDate = wEmployee.DepartureDate.AddYears(10);

                    if (wEmployee.Grad >= (int)BMSGrads.Engineer)
                    {
                        wEmployee.Grad = (int)BMSGrads.Default;
                    }

                    wEmployeeList.Add(wEmployee);

                }

            }
            catch (Exception ex)
            {
                logger.Error("BMS_QueryEmployeeList ", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wEmployeeList;
        }


        public List<BMSEmployee> BMS_QueryEmployeeAll(BMSEmployee wLoginUser,int wActive,
                OutResult<Int32> wErrorCode)
        {
            return this.BMS_QueryEmployeeList(wLoginUser, "", -1, -1, -1, -1, -1, wActive, Pagination.MaxSize, wErrorCode);
        }

        public List<BMSEmployee> BMS_QueryEmployeeList(BMSEmployee wLoginUser, List<Int32> wIDList,
                OutResult<Int32> wErrorCode)
        {
            List<BMSEmployee> wEmployeeList = new List<BMSEmployee>();
            wErrorCode.set(0);
            try
            {
                if (wIDList == null || wIDList.Count <= 0)
                    return wEmployeeList;

                wIDList.RemoveAll(p => p <= 0);

                if (wIDList.Count <= 0)
                    return wEmployeeList;



                String wSQLText = StringUtils.Format(
                        "select u.*,t5.Name as Operator,t1.Name as Department,t1.Code as DepartmentCode,t2.Name as PositionName from {0}.mbs_user u"
                                + " left join {0}.bms_department t1 on u.DepartmentID=t1.ID "
                                + " left join {0}.bms_position t2 on u.Position=t2.ID "
                                  + " left join {0}.mbs_user t5 on t5.ID=u.OperatorID "
                                + " where  u.ID in ({1})",
                        MESDBSource.Basic.getDBName(), StringUtils.Join(",", wIDList));

                wSQLText = this.DMLChange(wSQLText);
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);

                DateTime wBaseTime = DateTime.Now;
                wBaseTime = wBaseTime.AddMinutes(-10);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {

                    BMSEmployee wEmployee = new BMSEmployee();
                    wEmployee.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    wEmployee.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                    wEmployee.LoginName = StringUtils.parseString(wSqlDataReader["LoginName"]);
                    wEmployee.LoginID = StringUtils.parseString(wSqlDataReader["LoginID"]);
                    wEmployee.Password = StringUtils.parseString(wSqlDataReader["Password"]);
                    wEmployee.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
                    wEmployee.Department = StringUtils.parseString(wSqlDataReader["Department"]);
                    wEmployee.DepartmentCode = StringUtils.parseString(wSqlDataReader["DepartmentCode"]);
                    wEmployee.SuperiorID = StringUtils.parseInt(wSqlDataReader["SuperiorID"]);
                    wEmployee.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                    wEmployee.Type = StringUtils.parseInt(wSqlDataReader["Type"]);

                    wEmployee.Grad = StringUtils.parseInt(wSqlDataReader["Grad"]);
                    wEmployee.Manager = StringUtils.parseInt(wSqlDataReader["Manager"]);
                    wEmployee.Position = StringUtils.parseInt(wSqlDataReader["Position"]);
                    wEmployee.PositionName = StringUtils.parseString(wSqlDataReader["PositionName"]);
                    wEmployee.DutyID = StringUtils.parseInt(wSqlDataReader["DutyID"]);

                    wEmployee.OperatorID = StringUtils.parseInt(wSqlDataReader["OperatorID"]);
                    wEmployee.Operator = StringUtils.parseString(wSqlDataReader["Operator"]);


                    wEmployee.Phone = StringUtils.parseString(wSqlDataReader["Phone"]);
                    wEmployee.PhoneMAC = StringUtils.parseString(wSqlDataReader["PhoneMAC"]);
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

                    wEmployee.FaceIcon = StringUtils.parseString(wSqlDataReader["FaceIcon"]);
                    if (wEmployee.Active > 0)
                        wEmployee.DepartureDate = wEmployee.DepartureDate.AddYears(10);

                    if (wEmployee.Grad >= (int)BMSGrads.Engineer)
                    {
                        wEmployee.Grad = (int)BMSGrads.Default;
                    }

                    wEmployeeList.Add(wEmployee);

                }

            }
            catch (Exception ex)
            {
                logger.Error("BMS_QueryEmployeeList ", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wEmployeeList;
        }

        public List<BMSEmployee> BMS_QueryEmployeeList(BMSEmployee wLoginUser, String wName, int wDepartmentID, int wPosition,
                int wDepartmentType, int wPositionType, int wRoleID, int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<BMSEmployee> wEmployeeList = new List<BMSEmployee>();
            try
            {

                wEmployeeList = this.BMS_QueryEmployeeList(wLoginUser, 0, "", "", wName, wDepartmentID, wPosition, wDepartmentType,
                        wPositionType, wRoleID, wActive, wPagination, wErrorCode);
            }
            catch (Exception ex)
            {
                logger.Error("BMS_QueryEmployeeList ", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wEmployeeList;
        }

        public BMSEmployee BMS_QueryEmployeeByLoginID(BMSEmployee wLoginUser, String wLoginID,
                OutResult<Int32> wErrorCode)
        {
            BMSEmployee wBMSEmployee = new BMSEmployee();
            try
            {
                if (StringUtils.isEmpty(wLoginID))
                    return wBMSEmployee;
                List<BMSEmployee> wBMSEmployeeList = this.BMS_QueryEmployeeList(wLoginUser, 0, wLoginID, "", "", 0, 0, 0, 0, 0, -1, Pagination.Default,
                        wErrorCode);
                if (wBMSEmployeeList != null && wBMSEmployeeList.Count > 0)
                    wBMSEmployee = wBMSEmployeeList[0];
            }
            catch (Exception ex)
            {
                logger.Error("BMS_QueryEmployeeByLoginID ",
                        ex);
            }
            return wBMSEmployee;
        }

        public BMSEmployee BMS_QueryEmployeeByLoginName(BMSEmployee wLoginUser, String wLoginName,
                OutResult<Int32> wErrorCode)
        {
            BMSEmployee wBMSEmployee = new BMSEmployee();
            try
            {
                if (StringUtils.isEmpty(wLoginName))
                    return wBMSEmployee;
                List<BMSEmployee> wBMSEmployeeList = this.BMS_QueryEmployeeList(wLoginUser, 0, "", wLoginName, "", 0, 0, 0, 0, 0,
                        -1, Pagination.Default, wErrorCode);
                if (wBMSEmployeeList != null && wBMSEmployeeList.Count > 0)
                    wBMSEmployee = wBMSEmployeeList[0];
            }
            catch (Exception ex)
            {
                logger.Error("BMS_QueryEmployeeByLoginName ",
                        ex);
            }
            return wBMSEmployee;
        }

        public BMSEmployee BMS_QueryEmployeeByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            BMSEmployee wBMSEmployee = new BMSEmployee();
            try
            {
                if (wID <= 0)
                    return wBMSEmployee;
                List<BMSEmployee> wBMSEmployeeList = this.BMS_QueryEmployeeList(wLoginUser, wID, "", "", "", 0, 0, 0, 0, 0, -1, Pagination.Default,
                        wErrorCode);
                if (wBMSEmployeeList != null && wBMSEmployeeList.Count > 0)
                    wBMSEmployee = wBMSEmployeeList[0];
            }
            catch (Exception ex)
            {
                logger.Error("BMS_QueryEmployeeByID ", ex);
            }
            return wBMSEmployee;
        }


        public int BMS_DeleteEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {


                String wSQLText = "";
                wSQLText = StringUtils.Format("Delete From {0}.mbs_user", MESDBSource.Basic.getDBName())
                        + " where ID=@ID and Grad=0 and Active=0";
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Clear();
                wParms.Add("ID", wEmployee.ID);
                wSQLText = this.DMLChange(wSQLText);
                mDBPool.update(wSQLText, wParms);

            }
            catch (Exception ex)
            {
                logger.Error("BMS_ResetPassword ", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wErrorCode.Result;
        }


    }
}
