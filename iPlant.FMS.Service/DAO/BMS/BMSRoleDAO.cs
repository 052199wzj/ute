using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iPlant.Data.EF;

namespace iPlant.FMC.Service
{
    class BMSRoleDAO : BaseDAO
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(BMSRoleDAO));
        private static BMSRoleDAO Instance = null;

        private BMSRoleDAO() : base()
        {

        }

        public static BMSRoleDAO getInstance()
        {

            if (Instance == null)
                Instance = new BMSRoleDAO();
            return Instance;
        }

        private static int RoleManageEnable = StringUtils
                .parseInt(GlobalConstant.GlobalConfiguration.GetValue("Role.Manager.Enable"));


        private BMSRole BMS_CheckRoleName(BMSEmployee wLoginUser, BMSRole wBMSRole,
             OutResult<Int32> wErrorCode)
        {
            BMSRole wRole = new BMSRole();
            wErrorCode.set(0);
            try
            {

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                String wSQLText = StringUtils.Format(
                            "Select * from {0}.mbs_role where ID!=@ID and ((Name=@Name and DepartmentID=@DepartmentID ) OR Code=@Code );",
                            MESDBSource.Basic.getDBName());


                wParms.Add("ID", wBMSRole.ID);
                wParms.Add("Name", wBMSRole.Name);
                wParms.Add("DepartmentID", wBMSRole.DepartmentID);
                wParms.Add("Code", wBMSRole.Code);
                wSQLText = this.DMLChange(wSQLText);
                List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {
                    wRole.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    wRole.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                    wRole.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                    wRole.Remark = StringUtils.parseString(wSqlDataReader["Remark"]);
                    wRole.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                    wRole.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                    wRole.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
                    wRole.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                }


            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("BMS_CheckRoleName",
                       ex);
            }
            return wRole;
        }


        public void BMS_AddRole(BMSEmployee wLoginUser, BMSRole wRole, OutResult<Int32> wErrorCode)
        {

            lock (mLockHelper)
            {
                try
                {
                    if (wRole == null || StringUtils.isEmpty(wRole.Name) )
                    {
                        wErrorCode.set(MESException.Parameter.getValue());
                        return;
                    }

                    BMSRole wBMSRoleDB = this.BMS_CheckRoleName(wLoginUser, wRole, wErrorCode);
                    if (wErrorCode.Result != 0)
                    {
                        return;
                    }
                    if (wBMSRoleDB != null && wBMSRoleDB.ID > 0)
                    {
                        wErrorCode.set(MESException.Duplication.getValue());
                        return;
                    }

                 
                    if (StringUtils.isEmpty(wRole.Code))
                    {
                        int wMaxID = this.GetMaxPrimaryKey(StringUtils.Format("{0}.mbs_role", MESDBSource.Basic.getDBName()), "ID");
                        wRole.Code = StringUtils.Format("GW-{0}", String.Format("{0:D6}", wMaxID + 1));
                    }
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    wParms.Clear();
                    wParms.Add("Name", wRole.Name);
                    wParms.Add("Code", wRole.Code);
                    wParms.Add("DepartmentID", wRole.DepartmentID);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("Remark", wRole.Remark);
                    wParms.Add("EditTime", DateTime.Now);
                    wParms.Add("Active", wRole.Active);
                    wRole.ID = this.Insert(StringUtils.Format("{0}.mbs_role", MESDBSource.Basic.getDBName()), wParms);

                }
                catch (Exception ex)
                {
                    logger.Error("BMS_AddRole", ex);
                    wErrorCode.set(MESException.DBSQL.Value);
                }
            }
        }

        private List<BMSRole> BMS_GetRoleList(BMSEmployee wLoginUser, int wID, String wCode, String wName,
            int wDepartmentID, int wUserID, int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            List<BMSRole> wRoleList = new List<BMSRole>();

            try
            {

                String wSQLText = StringUtils.Format(
                        "select r.*,d.Name as DepartmentName ,d.Code as DepartmentCode,b.Name as  EditorName," +
                        " count(b2.ID) as EmployeeCount,GROUP_CONCAT(b2.ID) as EmployeeIDList FROM {0}.mbs_role r"
                                + "  left join {0}.bms_department d on r.DepartmentID=d.ID"
                                + "  left join {0}.mbs_user b on r.EditorID=b.ID"
                                + "  left join {0}.mbs_roleuser t2 on r.ID=t2.RoleID AND t2.UserID>0 "
                                + "  left join {0}.mbs_user b2 on t2.UserID=b2.ID and t2.UserID>0"
                                + "  where  r.ID>0 AND (@ID<=0 or r.ID=@ID) and (@Active< 0 or r.Active=@Active)"
                                + "  and (@Name = ''  or r.Name like @Name) and (@Code = ''  or r.Code=@Code) and (@UserID<=0 or t2.UserID=@UserID)"
                                + "  and (@DepartmentID<=0 or r.DepartmentID=@DepartmentID) group by r.ID ",
                        MESDBSource.Basic.getDBName());
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Add("Active", wActive);
                wParms.Add("ID", wID);
                wParms.Add("Name", StringUtils.isEmpty(wName) ? wName : "%" + wName + "%");
                wParms.Add("Code", wCode);
                wParms.Add("UserID", wUserID);
                wParms.Add("DepartmentID", wDepartmentID);

                List<Dictionary<String, Object>> wQueryResultList = base.mDBPool.queryForList(wSQLText, wParms,wPagination);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {
                    BMSRole wRole = new BMSRole();
                    wRole.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    wRole.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                    wRole.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                    wRole.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                    wRole.EditorName = StringUtils.parseString(wSqlDataReader["EditorName"]);
                    wRole.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                    wRole.EmployeeCount = StringUtils.parseInt(wSqlDataReader["EmployeeCount"]);
                    wRole.EmployeeIDList = StringUtils.parseIntList(wSqlDataReader["EmployeeIDList"], ",");
                    wRole.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
                    wRole.DepartmentName = StringUtils.parseString(wSqlDataReader["DepartmentName"]);
                    wRole.DepartmentCode = StringUtils.parseString(wSqlDataReader["DepartmentCode"]);
                    wRole.Remark = StringUtils.parseString(wSqlDataReader["Remark"]);
                    wRole.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                    wRoleList.Add(wRole);
                }


            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("BMS_GetRoleList", ex);
            }

            return wRoleList;
        }

        public List<BMSRole> BMS_GetRoleList(BMSEmployee wLoginUser, String wName, int wDepartmentID, int wUserID, int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            List<BMSRole> wRoleList = new List<BMSRole>();

            try
            {
                wRoleList = this.BMS_GetRoleList(wLoginUser, 0, "", wName, wDepartmentID, wUserID, wActive, wPagination, wErrorCode);
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("BMS_GetRoleList", ex);
            }

            return wRoleList;
        }

        public BMSRole BMS_GetRole(BMSEmployee wLoginUser, int wID, String wCode, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            BMSRole wResult = new BMSRole();
            try
            {
                List<BMSRole> wRoleList = null;
                if (wID > 0)
                {
                    wRoleList = this.BMS_GetRoleList(wLoginUser, wID, "", "", -1, -1, -1, Pagination.Default, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wCode))
                {
                    wRoleList = this.BMS_GetRoleList(wLoginUser, 0, wCode, "", -1, -1, -1, Pagination.Default, wErrorCode);
                }
                else
                {
                    return wResult;
                }

                if (wRoleList != null && wRoleList.Count > 0)
                    wResult = wRoleList[0];
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("BMS_GetRoleList", ex);
            }

            return wResult;
        }

        public void BMS_RemoveRole(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {
                String wSQLText = "";
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();


                wSQLText = StringUtils.Format("Delete from {0}.mbs_role where ID=@ID and Active = 0; ",
                        MESDBSource.Basic.getDBName());

                wParms.Clear();
                wParms.Add("ID", wID);
                base.mDBPool.update(wSQLText, wParms);

                wSQLText = StringUtils.Format("delete from {0}.mbs_roleuser", MESDBSource.Basic.getDBName())
                        + " where RoleID=@RoleID";
                wParms.Clear();
                wParms.Add("RoleID", wID);
                base.mDBPool.update(wSQLText, wParms);


            }
            catch (Exception ex)
            {
                logger.Error("BMS_RemoveRole", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }

        }

        public void BMS_SaveRole(BMSEmployee wLoginUser, BMSRole wRole, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {
                if (wRole == null || StringUtils.isEmpty(wRole.Name) )
                {
                    wErrorCode.set(MESException.Parameter.getValue());
                    return;
                }

                BMSRole wBMSRoleDB = this.BMS_CheckRoleName(wLoginUser, wRole, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    return;
                }
                if (wBMSRoleDB != null && wBMSRoleDB.ID > 0)
                {
                    wErrorCode.set(MESException.Duplication.getValue());
                    return;
                }
               

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Clear();
                wParms.Add("ID", wRole.ID);
                wParms.Add("Name", wRole.Name);
                wParms.Add("Code", wRole.Code);
                wParms.Add("DepartmentID", wRole.DepartmentID);
                wParms.Add("EditorID", wLoginUser.ID);
                wParms.Add("Remark", wRole.Remark);
                wParms.Add("EditTime", DateTime.Now);
                wParms.Add("Active", wRole.Active);
                this.Update(StringUtils.Format("{0}.mbs_role", MESDBSource.Basic.getDBName()), "ID", wParms);
            }
            catch (Exception ex)
            {

                logger.Error("BMS_SaveRole", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
        }

        public int BMS_SaveRoleFunctionList(BMSEmployee wLoginUser, int wRoleID, List<BMSRoleItem> wFunctionList,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {

                String wSQLText = "";
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                // Step01@Delete
                if (wRoleID > 0)
                {
                    wSQLText = StringUtils.Format("delete from {0}.mbs_rolefunction", MESDBSource.Basic.getDBName())
                            + " where RoleID=@RoleID";
                    wParms.Clear();
                    wParms.Add("RoleID", wRoleID);
                    base.mDBPool.update(wSQLText, wParms);
                }
                // Step02:

                List<String> wValueStringList = new List<String>();
                foreach (BMSRoleItem wFunctionRole in wFunctionList)
                {
                    wValueStringList
                            .Add(StringUtils.Format("({0},{1})", wFunctionRole.RoleID, wFunctionRole.FunctionID));
                }
                if (wValueStringList.Count > 0)
                {
                    wSQLText = StringUtils.Format(
                            "Insert Into {0}.mbs_rolefunction" + "(RoleID,FunctionID) " + " Values {1}",
                            MESDBSource.Basic.getDBName(), StringUtils.Join(",", wValueStringList));
                    base.mDBPool.update(wSQLText, wParms);
                }

            }
            catch (Exception ex)
            {
                logger.Error("BMS_SaveRoleFunctionList", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wErrorCode.Result;
        }

        public int BMS_SaveRoleRangeList(BMSEmployee wLoginUser, int wRoleID, List<BMSRoleItem> wFunctionList,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {

                String wSQLText = "";
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                // Step01@Delete
                if (wRoleID > 0)
                {
                    wSQLText = StringUtils.Format("delete from {0}.mbs_rolerange", MESDBSource.Basic.getDBName())
                            + " where RoleID=@RoleID";
                    wParms.Clear();
                    wParms.Add("RoleID", wRoleID);
                    base.mDBPool.update(wSQLText, wParms);
                }
                // Step02@
                foreach (BMSRoleItem wFunctionRole in wFunctionList)
                {
                    wSQLText = StringUtils.Format("Insert Into {0}.mbs_rolerange", MESDBSource.Basic.getDBName())
                            + "(RoleID,FunctionID,TypeID) " + " Values(@RoleID,@FunctionID,@TypeID)";
                    wParms.Clear();
                    wParms.Add("RoleID", wFunctionRole.RoleID);
                    wParms.Add("FunctionID", wFunctionRole.FunctionID);
                    wParms.Add("TypeID", wFunctionRole.TypeID);
                    base.mDBPool.update(wSQLText, wParms);
                }

            }
            catch (Exception ex)
            {

                logger.Error("BMS_SaveRoleRangeList", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wErrorCode.Result;
        }

        public int BMS_SaveRoleUserList(BMSEmployee wLoginUser, int wRoleID, List<BMSRoleItem> wUserList,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {

                String wSQLText = "";
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                // Step01@Delete
                if (wRoleID > 0)
                {
                    wSQLText = StringUtils.Format("delete from {0}.mbs_roleuser", MESDBSource.Basic.getDBName())
                            + " where RoleID=@RoleID";
                    wParms.Clear();
                    wParms.Add("RoleID", wRoleID);
                    base.mDBPool.update(wSQLText, wParms);
                }

                // Step02@
                foreach (BMSRoleItem wFunctionRole in wUserList)
                {
                    wSQLText = StringUtils.Format("Insert Into {0}.mbs_roleuser", MESDBSource.Basic.getDBName()) + "(RoleID,UserID) "
                            + " Values(@RoleID,@UserID)";
                    wParms.Clear();
                    wParms.Add("RoleID", wFunctionRole.RoleID);
                    wParms.Add("UserID", wFunctionRole.UserID > 0 ? wFunctionRole.UserID : wFunctionRole.FunctionID);
                    base.mDBPool.update(wSQLText, wParms);
                }

            }
            catch (Exception ex)
            {

                logger.Error("BMS_SaveRoleUserList", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wErrorCode.Result;
        }


        public int BMS_SaveRoleUserListByUser(BMSEmployee wLoginUser, int wUserID, List<BMSRoleItem> wUserList,
              OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {

                String wSQLText = "";
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                // Step01@Delete
                if (wUserID > 0)
                {
                    wSQLText = StringUtils.Format("delete from {0}.mbs_roleuser", MESDBSource.Basic.getDBName())
                            + " where UserID=@UserID";
                    wParms.Clear();
                    wParms.Add("UserID", wUserID);
                    base.mDBPool.update(wSQLText, wParms);
                }

                // Step02@
                foreach (BMSRoleItem wFunctionRole in wUserList)
                {
                    wSQLText = StringUtils.Format("Insert Into {0}.mbs_roleuser", MESDBSource.Basic.getDBName()) + "(RoleID,UserID) "
                            + " Values(@RoleID,@UserID)";
                    wParms.Clear();
                    wParms.Add("RoleID", wFunctionRole.RoleID);
                    wParms.Add("UserID", wFunctionRole.UserID);
                    base.mDBPool.update(wSQLText, wParms);
                }


            }
            catch (Exception ex)
            {

                logger.Error("BMS_SaveRoleUserList", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wErrorCode.Result;
        }


        public List<BMSRoleItem> BMS_QueryFunctionListByRoleID(BMSEmployee wLoginUser, int wRoleID,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            List<BMSRoleItem> wUserList = new List<BMSRoleItem>();

            try
            {

                String wSQLText = "";
                wSQLText = StringUtils.Format("Select * from {0}.mbs_rolefunction", MESDBSource.Basic.getDBName())
                        + " where RoleID=@RoleID";

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                wParms.Clear();
                wParms.Add("RoleID", wRoleID);
                List<Dictionary<String, Object>> wQueryResultList = base.mDBPool.queryForList(wSQLText, wParms);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {
                    int wFunctionID = StringUtils.parseInt(wSqlDataReader["FunctionID"]);
                    // int wTypeID = StringUtils.parseInt(wSqlDataReader["TypeID"]);
                    BMSRoleItem wRoleFunction = new BMSRoleItem();
                    wRoleFunction.RoleID = wRoleID;
                    wRoleFunction.FunctionID = wFunctionID;
                    // wRoleFunction.TypeID = wTypeID;
                    wUserList.Add(wRoleFunction);
                }


            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("BMS_QueryFunctionListByRoleID",
                         ex);
            }
            return wUserList;
        }




        public List<BMSRoleItem> BMS_QueryFunctionListByLoginID(BMSEmployee wLoginUser, int wUserID,
            OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            List<BMSRoleItem> wFunctionList = new List<BMSRoleItem>();

            try
            {


                if (wUserID == -100)
                {
                    wFunctionList = this.BMS_GetFunctionNodeTree(wLoginUser, -1, 1, wErrorCode);
                    return wFunctionList;
                }

                String wSQLText = "";
                wSQLText = StringUtils.Format(
                        "SELECT t.*,r.Text,r.RoleID as UserID FROM {0}.mbs_rolefunction t "
                        + "left join {0}.mbs_roletree r on t.FunctionID = r.FunctionID"
                                + " left join {0}.mbs_roleuser t1 on t.RoleID=t1.RoleID where t1.UserID=@UserID",
                        MESDBSource.Basic.getDBName());

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                wParms.Clear();
                wParms.Add("UserID", wUserID);
                List<Dictionary<String, Object>> wQueryResultList = base.mDBPool.queryForList(wSQLText, wParms);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {
                    BMSRoleItem wRoleFunction = new BMSRoleItem();
                    wRoleFunction.FunctionID = StringUtils.parseInt(wSqlDataReader["FunctionID"]);
                    wRoleFunction.RoleID = StringUtils.parseInt(wSqlDataReader["RoleID"]);
                    wRoleFunction.UserID = StringUtils.parseInt(wSqlDataReader["UserID"]);
                    wRoleFunction.Text = StringUtils.parseString(wSqlDataReader["Text"]);
                    wFunctionList.Add(wRoleFunction);
                }

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("BMS_QueryFunctionListByLoginID",
                         ex);
            }
            return wFunctionList;
        }

        public List<BMSRoleItem> BMS_QueryUserListByRoleID(BMSEmployee wLoginUser, int wRoleID,
                OutResult<Int32> wErrorCode)
        {
            List<BMSRoleItem> wUserList = new List<BMSRoleItem>();
            wErrorCode.set(0);

            try
            {

                String wSQLText = "";
                wSQLText = StringUtils.Format("Select r.*,u.name as UserName,u.LoginID from {0}.mbs_roleuser r,{0}.mbs_user u",
                        MESDBSource.Basic.getDBName()) + " where r.RoleID=@RoleID and r.UserID=u.ID";
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                wParms.Clear();
                wParms.Add("RoleID", wRoleID);
                List<Dictionary<String, Object>> wQueryResultList = base.mDBPool.queryForList(wSQLText, wParms);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {
                    BMSRoleItem wRoleUser = new BMSRoleItem();
                   
                    
                    wRoleUser.RoleID = wRoleID;
                    wRoleUser.FunctionID = StringUtils.parseInt(wSqlDataReader["UserID"]);
                    wRoleUser.UserID = StringUtils.parseInt(wSqlDataReader["UserID"]);
                    wRoleUser.Text = StringUtils.parseString(wSqlDataReader["UserName"]);
                    wRoleUser.Remark = StringUtils.parseString(wSqlDataReader["LoginID"]);

                    wUserList.Add(wRoleUser);
                }


            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("BMS_GetUserList", ex);
            }
            return wUserList;
        }




        public List<BMSRoleItem> BMS_QueryUserListByFunctionID(BMSEmployee wLoginUser, int wFunctionID,
                OutResult<Int32> wErrorCode)
        {

            List<BMSRoleItem> wUserList = new List<BMSRoleItem>();
            wErrorCode.set(0);
            try
            {

                String wSQLText = "";
                wSQLText = StringUtils.Format(
                        "SELECT t.*,t1.UserID,t2.LoginID,t2.Name as UserName  FROM {0}.mbs_rolefunction t"
                                + " left join {0}.mbs_roleuser t1 on t.RoleID=t1.RoleID"
                                + " left join {0}.mbs_user t2 on t1.UserID=t2.ID where t.FunctionID=@FunctionID",
                        MESDBSource.Basic.getDBName());

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                wParms.Clear();
                wParms.Add("FunctionID", wFunctionID);
                List<Dictionary<String, Object>> wQueryResultList = base.mDBPool.queryForList(wSQLText, wParms);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {
                    BMSRoleItem wRoleFunction = new BMSRoleItem();
                    wRoleFunction.FunctionID = StringUtils.parseInt(wSqlDataReader["FunctionID"]);
                    wRoleFunction.RoleID = StringUtils.parseInt(wSqlDataReader["RoleID"]);
                    wRoleFunction.UserID = StringUtils.parseInt(wSqlDataReader["UserID"]);
                    wRoleFunction.Text = StringUtils.parseString(wSqlDataReader["UserName"]);
                    wRoleFunction.Remark = StringUtils.parseString(wSqlDataReader["LoginID"]);
                    wUserList.Add(wRoleFunction);
                }


            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("BMS_QueryUserListByFunctionID",
                         ex);
            }
            return wUserList;
        }

        public List<BMSRoleItem> BMS_QueryUserListByPath(BMSEmployee wLoginUser, String wPath,
              OutResult<Int32> wErrorCode)
        {

            List<BMSRoleItem> wUserList = new List<BMSRoleItem>();

            try
            {

                String wSQLText = "";
                wSQLText = StringUtils.Format(
                        "SELECT t.*,t1.UserID,t2.Path,t2.Remark FROM {0}.mbs_rolefunction t" +
                        " inner join {0}.mbs_roletree t2 on t.FunctionID=t2.FunctionID "
                                + " left join {0}.mbs_roleuser t1 on t.RoleID=t1.RoleID where t2.Path=@Path",
                        MESDBSource.Basic.getDBName());

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                wParms.Clear();
                wParms.Add("Path", wPath);
                List<Dictionary<String, Object>> wQueryResultList = base.mDBPool.queryForList(wSQLText, wParms);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {
                    BMSRoleItem wRoleFunction = new BMSRoleItem();
                    wRoleFunction.FunctionID = StringUtils.parseInt(wSqlDataReader["FunctionID"]);
                    wRoleFunction.Path = StringUtils.parseString(wSqlDataReader["Path"]);
                    wRoleFunction.Remark = StringUtils.parseString(wSqlDataReader["Remark"]);
                    wRoleFunction.RoleID = StringUtils.parseInt(wSqlDataReader["RoleID"]);
                    wRoleFunction.UserID = StringUtils.parseInt(wSqlDataReader["UserID"]);
                    wUserList.Add(wRoleFunction);
                }


            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("BMS_QueryUserListByFunctionID",
                         ex);
            }
            return wUserList;
        }

        public List<BMSRoleItem> BMS_QueryRangeList(BMSEmployee wLoginUser, int wOperatorID, int wFunctionID,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            List<BMSRoleItem> wRangeList = new List<BMSRoleItem>();

            try
            {

                String wSQLText = "";

                wSQLText = StringUtils
                        .Format("SELECT t1.FunctionID ,t2.* ,t3.FunctionID as RangeID,t3.TypeID as RangeType,t4.UserID"
                                + "  FROM {0}.mbs_rolefunction t1,{0}.mbs_role t2,{0}.mbs_rolerange t3,{0}.mbs_roleuser t4 "
                                + " where  t1.RoleID=t2.ID AND t2.ID=t3.RoleID AND t4.RoleID=t2.ID AND t2.Active=1"
                                + " and (@FunctionID<=0 OR t1.FunctionID=@FunctionID)"
                                + " and (@UserID<=0 OR  t4.UserID=@UserID)", MESDBSource.Basic.getDBName());

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                wParms.Clear();
                wParms.Add("UserID", wOperatorID);
                wParms.Add("FunctionID", wFunctionID);

                wSQLText = this.DMLChange(wSQLText);
                List<Dictionary<String, Object>> wQueryResultList = base.mDBPool.queryForList(wSQLText, wParms);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {
                    BMSRoleItem wRoleFunction = new BMSRoleItem();
                    wRoleFunction.RoleID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    wRoleFunction.FunctionID = StringUtils.parseInt(wSqlDataReader["RangeID"]);
                    wRoleFunction.TypeID = StringUtils.parseInt(wSqlDataReader["RangeType"]);

                    wRangeList.Add(wRoleFunction);
                }


            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("BMS_QueryRangeListByOperatorID",
                         ex);
            }
            return wRangeList;
        }

        public List<BMSRoleItem> BMS_QueryRangeListByRoleID(BMSEmployee wLoginUser, int wRoleID,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            List<BMSRoleItem> wRangeList = new List<BMSRoleItem>();

            try
            {
                String wSQLText = "";
                wSQLText = StringUtils.Format("Select * from {0}.mbs_rolerange", MESDBSource.Basic.getDBName())
                        + " where RoleID=@RoleID";
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                wSQLText = this.DMLChange(wSQLText);

                wParms.Clear();
                wParms.Add("RoleID", wRoleID);
                List<Dictionary<String, Object>> wQueryResultList = base.mDBPool.queryForList(wSQLText, wParms);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {
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
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("BMS_QueryRangeListByRoleID", ex);
            }
            return wRangeList;
        }

        public int BMS_DisableRole(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {
                String wSQLText = "";

                wSQLText = StringUtils.Format("Update {0}.mbs_role", MESDBSource.Basic.getDBName()) + " set Active=2 where ID=@ID";
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Clear();
                wParms.Add("ID", wID);
                base.mDBPool.update(wSQLText, wParms);


            }
            catch (Exception ex)
            {

                logger.Error("BMS_DisableRole", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wErrorCode.Result;
        }

        public int BMS_ActiveRole(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {

                String wSQLText = "";
                wSQLText = StringUtils.Format("Update {0}.mbs_role", MESDBSource.Basic.getDBName()) + " set Active=1 where ID=@ID";
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                wParms.Clear();
                wParms.Add("ID", wID);
                base.mDBPool.update(wSQLText, wParms);


            }
            catch (Exception ex)
            {

                logger.Error("BMS_ActiveRole", ex);
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
         * false; } catch (Exception ex) { logger.Error(
         * "BMS_CheckRangeByLoginID",  ex); } return
         * wRange; }
         */

        public List<BMSRoleItem> BMS_GetFunctionNodeTree(BMSEmployee wLoginUser, int wFunctionID, int wActive,
                OutResult<Int32> wErrorCode)
        {
            List<BMSRoleItem> wFunctionNodeList = new List<BMSRoleItem>();
            try
            {
                wErrorCode.set(0);
                String wSQLText = "";
                wSQLText = StringUtils.Format(
                        "Select * from {0}.mbs_roletree where 1=1" + " and (@FunctionID<=0 OR FunctionID=@FunctionID)"
                                + " and (@Active<0 OR Active=@Active) order by OrderID ",
                        MESDBSource.Basic.getDBName());
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Add("FunctionID", wFunctionID);
                wParms.Add("Active", wActive);
                List<Dictionary<String, Object>> wQueryResultList = base.mDBPool.queryForList(wSQLText, wParms);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {
                    // wSqlDataReader\[(\"\w+\")\] wSqlDataReader.get($1)
                    BMSRoleItem wRoleFunction = new BMSRoleItem();
                    wRoleFunction.FunctionID = StringUtils.parseInt(wSqlDataReader["FunctionID"]);
                    wRoleFunction.RoleID = StringUtils.parseInt(wSqlDataReader["RoleID"]);
                    wRoleFunction.UserID = StringUtils.parseInt(wSqlDataReader["OrderID"]);
                    wRoleFunction.Text = StringUtils.parseString(wSqlDataReader["Text"]);
                    wRoleFunction.Path = StringUtils.parseString(wSqlDataReader["Path"]);
                    wRoleFunction.Remark = StringUtils.parseString(wSqlDataReader["Remark"]);
                    wRoleFunction.TypeID = StringUtils.parseInt(wSqlDataReader["Active"]);

                    wFunctionNodeList.Add(wRoleFunction);
                }


            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("BMS_GetFunctionNodeTree", ex);
            }
            return wFunctionNodeList;
        }

        public Boolean BMS_CheckPowerByLoginID(int wCompanyID, int wUserID, int wFunctionID, BMSRange wTypeID,
                int wObjectID, OutResult<Int32> wErrorCode)
        {
            Boolean wPower = false;
            try
            {
                if (RoleManageEnable <= 0)
                    return true;
                if (wUserID == 0 || wFunctionID <= 0 || wUserID == SysAdmin.ID || wUserID > 2147483600)
                {
                    return true;
                }


                String wSQLText = StringUtils.Format(
                        "SELECT t1.FunctionID ,t2.* ,t3.FunctionID as RangeID,t3.TypeID as RangeType,t4.UserID FROM {0}.mbs_rolefunction t1"
                                + " left join {0}.mbs_role t2 on t1.RoleID=t2.ID"
                                + " left join {0}.mbs_rolerange t3 on  t2.ID=t3.RoleID "
                                + " left join {0}.mbs_roleuser t4 on  t4.RoleID=t2.ID "
                                + "	where t2.Active=1 and t1.FunctionID=@FunctionID and t4.UserID=@UserID"
                                + " and (@RangeID<=0 OR t3.FunctionID=@RangeID) "
                                + " and (@RangType<=0 OR t3.TypeID=@RangType) ",
                        MESDBSource.Basic.getDBName());

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Add("UserID", wUserID);
                wParms.Add("RangeID", wObjectID);
                wParms.Add("FunctionID", wFunctionID);
                wParms.Add("RangType", wTypeID);
                wSQLText = this.DMLChange(wSQLText);
                List<Dictionary<String, Object>> wQueryResultList = base.mDBPool.queryForList(wSQLText, wParms);
                if (wQueryResultList.Count > 0)
                    wPower = true;

            }
            catch (Exception ex)
            {
                logger.Error("BMS_CheckPowerByLoginID",
                         ex);
            }
            return wPower;
        }


        public Boolean BMS_CheckPowerByLoginID(int wCompanyID, int wUserID, String wPath, BMSRange wTypeID,
               int wObjectID, OutResult<Int32> wErrorCode)
        {
            Boolean wPower = false;
            try
            {
                if (RoleManageEnable <= 0)
                    return true;
                if (wUserID == 0 || StringUtils.isEmpty(wPath) || wUserID == SysAdmin.ID || wUserID > 2147483600)
                {
                    return true;
                }


                String wSQLText = StringUtils.Format(
                        "SELECT t1.FunctionID ,t2.* ,t3.FunctionID as RangeID,t3.TypeID as RangeType,t4.UserID FROM {0}.mbs_rolefunction t1"
                                + " left join {0}.mbs_role t2 on t1.RoleID=t2.ID"
                                + " left join {0}.mbs_rolerange t3 on  t2.ID=t3.RoleID "
                                + " left join {0}.mbs_roleuser t4 on  t4.RoleID=t2.ID "
                                + " inner join {0}.mbs_roletree t5 on  t5.FunctionID=t1.FunctionID "
                                + "	where t2.Active=1 and t5.Path=@Path and t4.UserID=@UserID"
                                + " and (@RangeID<=0 OR t3.FunctionID=@RangeID) "
                                + " and (@RangType<=0 OR t3.TypeID=@RangType) ",
                        MESDBSource.Basic.getDBName());

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Add("UserID", wUserID);
                wParms.Add("RangeID", wObjectID);
                wParms.Add("Path", wPath);
                wParms.Add("RangType", wTypeID);
                wSQLText = this.DMLChange(wSQLText);
                List<Dictionary<String, Object>> wQueryResultList = base.mDBPool.queryForList(wSQLText, wParms);
                if (wQueryResultList.Count <= 0)
                {
                    wSQLText = StringUtils.Format(
                       "SELECT * FROM {0}.mbs_roletree  where Path=@Path ",
                       MESDBSource.Basic.getDBName());
                    wQueryResultList = base.mDBPool.queryForList(wSQLText, wParms);

                    if (wQueryResultList.Count <= 0)
                    {
                        wPower = true;
                    }
                }
                else
                {
                    wPower = true;
                }

            }
            catch (Exception ex)
            {
                logger.Error("BMS_CheckPowerByLoginID",
                         ex);
            }
            return wPower;
        }

        public Boolean BMS_CheckPowerByLoginID(int wCompanyID, int wUserID, String wPath, OutResult<Int32> wErrorCode)
        {
            return BMS_CheckPowerByLoginID(wCompanyID, wUserID, wPath, BMSRange.Default, 0, wErrorCode);
        }

        public void BMS_UpdateFunctionNodeTree(BMSEmployee wLoginUser, BMSRoleItem wBMSRoleItem,
                OutResult<Int32> wErrorCode)
        {

            try
            {
                wErrorCode.set(0);

                List<BMSRoleItem> wBMSRoleItemList = this.BMS_GetFunctionNodeTree(wLoginUser, wBMSRoleItem.FunctionID, -1,
                        wErrorCode);

                String wSQLText = "";
                if (wBMSRoleItemList == null || wBMSRoleItemList.Count <= 0)
                {
                    wSQLText = StringUtils.Format(
                            "Insert into {0}.mbs_roletree (FunctionID,RoleID,Text,Active,OrderID,Path,Remark)" +
                            " Values (@FunctionID,@RoleID,@Text,0,@OrderID,@Path,@Remark);",
                            MESDBSource.Basic.getDBName());
                }
                else
                {
                    wSQLText = StringUtils.Format(
                            "Update {0}.mbs_roletree set RoleID=@RoleID ,Text=@Text,OrderID=@OrderID,Path=@Path,Remark=@Remark Where FunctionID=@FunctionID ;",
                            MESDBSource.Basic.getDBName());
                }

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Add("FunctionID", wBMSRoleItem.FunctionID);
                wParms.Add("RoleID", wBMSRoleItem.RoleID);
                wParms.Add("Text", wBMSRoleItem.Text);
                wParms.Add("OrderID", wBMSRoleItem.UserID);
                wParms.Add("Path", wBMSRoleItem.Path);
                wParms.Add("Remark", wBMSRoleItem.Remark);


                base.mDBPool.update(wSQLText, wParms);

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("BMS_GetFunctionNodeTree", ex);
            }
        }

        public void BMS_ActiveFunctionNodeTree(BMSEmployee wLoginUser, List<Int32> wFunctionIDList, int wActive,
                OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0);

                if (wFunctionIDList == null || wFunctionIDList.Count <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                if (wActive != 1)
                    wActive = 2;

                String wSQLText = StringUtils.Format(
                        "Update {0}.mbs_roletree set Active=@wActive Where FunctionID IN (@FunctionIDList);",
                        MESDBSource.Basic.getDBName());

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Add("wActive", wActive);
                wParms.Add("FunctionIDList", StringUtils.Join(",", wFunctionIDList));

                base.mDBPool.update(wSQLText, wParms);

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("BMS_ActiveFunctionNodeTree", ex);
            }
        }

        public void BMS_DeleteFunctionNodeTree(BMSEmployee wLoginUser, List<Int32> wFunctionIDList,
                OutResult<Int32> wErrorCode)
        {

            try
            {
                wErrorCode.set(0);

                if (wFunctionIDList == null || wFunctionIDList.Count <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                String wSQLText = StringUtils.Format(
                        "Delete FROM {0}.mbs_roletree  Where ID>0 AND FunctionID IN (@FunctionIDList) AND Active =0 ;",
                        MESDBSource.Basic.getDBName());

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                wParms.Add("FunctionIDList", StringUtils.Join(",", wFunctionIDList));

                base.mDBPool.update(wSQLText, wParms);

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("BMS_ActiveFunctionNodeTree", ex);
            }

        }

        public int BMS_MaxFunctionIDNode(BMSEmployee wLoginUser, int wMinFunctionID, int MaxFunctionID,
                OutResult<Int32> wErrorCode)
        {
            int wResult = 0;
            try
            {
                wErrorCode.set(0);

                String wSQLText = StringUtils.Format(
                       "Select max(FunctionID) as FunctionID from {0}.mbs_roletree where FunctionID between @MinFunctionID AND  @MaxFunctionID ",
                       MESDBSource.Basic.getDBName());
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                wParms.Add("MinFunctionID", wMinFunctionID);
                wParms.Add("MaxFunctionID", MaxFunctionID);

                Dictionary<String, Object> wResultMap = base.mDBPool.queryForMap(wSQLText, wParms);
                wResult = StringUtils.parseInt(wResultMap["FunctionID"]);


            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("BMS_GetFunctionNodeTree", ex);
            }
            return wResult;
        }
    }
}
