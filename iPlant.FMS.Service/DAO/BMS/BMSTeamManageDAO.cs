using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class BMSTeamManageDAO : BaseDAO
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(BMSTeamManageDAO));

        private static BMSTeamManageDAO Instance = null;

        private BMSTeamManageDAO() : base()
        {

        }

        public static BMSTeamManageDAO getInstance()
        {
            if (Instance == null)
                Instance = new BMSTeamManageDAO();
            return Instance;
        }


        private BMSTeamManage BMS_CheckBMSTeamManage(BMSEmployee wLoginUser, BMSTeamManage wBMSTeamManage,
              OutResult<Int32> wErrorCode)
        {
            BMSTeamManage wResult = new BMSTeamManage();
            try
            {

                if (wBMSTeamManage == null || StringUtils.isEmpty(wBMSTeamManage.Name))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return wResult;
                }

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                String wSQLText = StringUtils.Format("SELECT t1.ID FROM {0}.bms_teammanage  t1 "
                        + " where t1.ID!=@ID AND t1.WorkShopID =@WorkShopID  and t1.ModuleID=@ModuleID"
                        + "  and ( t1.Name =@Name or t1.Code= @Code);", wInstance);

                wSQLText = this.DMLChange(wSQLText);
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Add("ID", wBMSTeamManage.ID);
                wParms.Add("WorkShopID", wBMSTeamManage.WorkShopID);
                wParms.Add("ModuleID", wBMSTeamManage.ModuleID);
                wParms.Add("Name", wBMSTeamManage.Name);
                wParms.Add("Code", wBMSTeamManage.Code);

                List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {
                    wResult.ID = StringUtils.parseInt(wSqlDataReader["ID"]);

                }
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wResult;
        }

        private List<BMSTeamManage> BMS_GetTeamManageList(BMSEmployee wLoginUser, List<Int32> wIDList, String wCode, String wName, int wWorkShopID,
                int wDepartmentID, int wModuleID, int wLeaderID, int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<BMSTeamManage> wResult = new List<BMSTeamManage>();
            try
            {
                if (wIDList == null)
                    wIDList = new List<Int32>();

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                String wSQLText = StringUtils.Format(
                        "SELECT t1.*, t2.Name as DepartmentName,t2.Code as DepartmentCode,  t3.Name as WorkShopName ,"  
                        + " group_concat(distinct case when t4.ID = t1.CreatorID then  t4.Name else null end) as CreatorName,"
                        + " group_concat(distinct case when t4.ID = t1.EditorID then  t4.Name else null end) as EditorName,"
                        + " group_concat(distinct  case when FIND_IN_SET(t4.ID, t1.LeaderID) then  t4.Name else null end ) as LeaderName, "
                        + " group_concat(distinct  case when FIND_IN_SET(t4.ID, t1.LeaderID) then  t4.LoginID else null end ) as LeaderCode, "
                        + " group_concat(distinct  case when FIND_IN_SET(t4.ID, t1.MateID) then  t4.Name else null end ) as MateName, "
                        + " group_concat(distinct  case when FIND_IN_SET(t4.ID, t1.MateID) then  t4.LoginID else null end ) as MateCode "
                                + " FROM {0}.bms_teammanage  t1 inner join  mbs_user as  t4 "
                                + " left join {0}.bms_department  t2  on  t1.DepartmentID=t2.ID "
                                + " left join {0}.fmc_workshop  t3  on  t1.WorkShopID=t3.ID  where 1=1 "
                                + " and ( @ID ='' or t1.ID IN( {1} ) ) "
                                + " and ( @WorkShopID<= 0 or t1.WorkShopID =@WorkShopID)  "
                                + " and ( @Code = ''  or t1.Code =@Code)  "
                                + " and ( @Name = ''  or t1.Name like @Name)  "
                                + " and ( @LeaderID<= 0 or FIND_IN_SET( @LeaderID,t1.LeaderID))  "
                                + " and ( @ModuleID<= 0 or t1.ModuleID =@ModuleID)  "
                                + " and ( @DepartmentID<= 0 or t1.DepartmentID =@DepartmentID)  "
                                + " and ( @Active< 0 or t1.Active =@Active) group by t1.ID  ",
                        wInstance, wIDList.Count > 0 ? StringUtils.Join(",", wIDList) : "0");

                wSQLText = this.DMLChange(wSQLText);
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Add("ID", StringUtils.Join(",", wIDList));
                wParms.Add("WorkShopID", wWorkShopID);
                wParms.Add("DepartmentID", wDepartmentID);
                wParms.Add("Code", wCode);
                wParms.Add("Name", StringUtils.isEmpty(wName) ? wName : "%" + wName + "%");
                wParms.Add("LeaderID", wLeaderID);
                wParms.Add("ModuleID", wModuleID);
                wParms.Add("Active", wActive);

                List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms, wPagination);

                if (wQueryResultList.Count <= 0)
                {
                    return wResult;
                } 

                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {
                    BMSTeamManage wDepartment = new BMSTeamManage();
                    wDepartment.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    wDepartment.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                    wDepartment.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                    wDepartment.Remark = StringUtils.parseString(wSqlDataReader["Remark"]);
                    wDepartment.ModuleID = StringUtils.parseInt(wSqlDataReader["ModuleID"]);
                    wDepartment.ModuleName = EnumTool.GetEnumDesc<BMMFunctionModule>(wDepartment.ModuleID);
                    wDepartment.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
                    wDepartment.WorkShopName = StringUtils.parseString(wSqlDataReader["WorkShopName"]);
                    wDepartment.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
                    wDepartment.DepartmentName = StringUtils.parseString(wSqlDataReader["DepartmentName"]);
                    wDepartment.DepartmentCode = StringUtils.parseString(wSqlDataReader["DepartmentCode"]);
                    wDepartment.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                    wDepartment.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                    wDepartment.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                    wDepartment.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                    wDepartment.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                    wDepartment.LeaderID = StringUtils
                            .parseIntList(StringUtils.split(StringUtils.parseString(wSqlDataReader["LeaderID"]), ","));

                    wDepartment.LeaderName = StringUtils.parseString(wSqlDataReader["LeaderName"]);
                    wDepartment.LeaderCode = StringUtils.parseString(wSqlDataReader["LeaderCode"]);
                     
                    wDepartment.MateID = StringUtils
                            .parseIntList(StringUtils.split(StringUtils.parseString(wSqlDataReader["MateID"]), ",")); 

                    wDepartment.MateName = StringUtils.parseString(wSqlDataReader["MateName"]);
                    wDepartment.MateCode = StringUtils.parseString(wSqlDataReader["MateCode"]);


                    wDepartment.Editor = StringUtils.parseString(wSqlDataReader["EditorName"]);
                    wDepartment.Creator = StringUtils.parseString(wSqlDataReader["CreatorName"]); 

                    wResult.Add(wDepartment);
                }
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wResult;
        }

        public List<BMSTeamManage> BMS_GetTeamManageList(BMSEmployee wLoginUser, String wName, int wWorkShopID, int wDepartmentID,
                int wModuleID, int wLeaderID, int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<BMSTeamManage> wResult = new List<BMSTeamManage>();
            try
            {
                wErrorCode.set(0);

                wResult = BMS_GetTeamManageList(wLoginUser, null, "", wName, wWorkShopID, wDepartmentID, wModuleID, wLeaderID, wActive, wPagination,
                        wErrorCode);
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wResult;
        }

        public List<BMSTeamManage> BMS_GetTeamManageList(BMSEmployee wLoginUser, List<Int32> wIDList,
                OutResult<Int32> wErrorCode)
        {
            List<BMSTeamManage> wResult = new List<BMSTeamManage>();
            try
            {
                wErrorCode.set(0);

                wResult = BMS_GetTeamManageList(wLoginUser, wIDList, "", "", 0, 0, 0, 0, -1, Pagination.MaxSize, wErrorCode);
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wResult;
        }

        public BMSTeamManage BMS_GetTeamManage(BMSEmployee wLoginUser, int wID, String wCode, OutResult<Int32> wErrorCode)
        {
            BMSTeamManage wResult = new BMSTeamManage();
            try
            {
                wErrorCode.set(0);
                List<BMSTeamManage> wBMSTeamManageList = null;
                if (wID > 0)
                {
                    wBMSTeamManageList = this.BMS_GetTeamManageList(wLoginUser,
                            StringUtils.parseList(new Int32[] { wID }), "", "", 0, 0, 0, 0, -1, Pagination.Default, wErrorCode);

                }
                else if (StringUtils.isNotEmpty(wCode))
                {
                    wBMSTeamManageList = this.BMS_GetTeamManageList(wLoginUser,
                        null, wCode, "", 0, 0, 0, 0, -1, Pagination.Default, wErrorCode);
                }
                if (wBMSTeamManageList != null && wBMSTeamManageList.Count > 0)
                {
                    wResult = wBMSTeamManageList[0];
                    //wResult.TeamChargeList = BMSTeamChargeDAO.getInstance().BMS_GetTeamChargeList(wLoginUser,
                    //        wResult.ID, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, wErrorCode);
                }
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wResult;
        }

        public void BMS_UpdateTeamManage(BMSEmployee wLoginUser, BMSTeamManage wBMSTeamManage,
                OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                BMSTeamManage wCheckTeamManage = this.BMS_CheckBMSTeamManage(wLoginUser, wBMSTeamManage, wErrorCode);
                if (wErrorCode.Result != 0)
                    return;

                if (wCheckTeamManage != null && wCheckTeamManage.ID > 0)
                {
                    wErrorCode.set(MESException.Logic.Value);
                    return;
                }

                String wSQL = "";

                if (wBMSTeamManage.ID <= 0)
                {

                    int wCount = this.GetMaxPrimaryKey(StringUtils.Format("{0}.bms_teammanage", wInstance), "ID");

                    wBMSTeamManage.Code = StringUtils.Format("BZ-{0}", String.Format("{0:D5}", wCount + 1));

                    wSQL = StringUtils.Format("INSERT INTO {0}.bms_teammanage ( Code,LeaderID, "
                            + "Name, ModuleID,WorkShopID,DepartmentID,CreatorID, CreateTime, EditorID, "
                            + "EditTime, Active,MateID,Remark) "
                            + "VALUES (@Code,@LeaderID,@Name, @ModuleID,@WorkShopID,@DepartmentID,@CreatorID, "
                            + "now(), @EditorID, now(), @Active,@MateID,@Remark);", wInstance);
                }
                else
                {

                    BMSTeamManage wTeamManageTemp = this.BMS_GetTeamManage(wLoginUser, wBMSTeamManage.ID, "", wErrorCode);
                    if (wTeamManageTemp == null || wTeamManageTemp.ID <= 0)
                    {
                        wErrorCode.set(MESException.NotFound.Value);
                        return;
                    }

                    wSQL = StringUtils.Format(
                            "UPDATE {0}.bms_teammanage SET  Name = @Name,Code = @Code,LeaderID=@LeaderID,MateID=@MateID, "
                                    + "ModuleID=@ModuleID, WorkShopID=@WorkShopID,DepartmentID=@DepartmentID,Remark=@Remark,"
                                    + "EditorID = @EditorID, EditTime = now() WHERE ID = @ID;  ",
                            wInstance);
                }

                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("ID", wBMSTeamManage.ID);
                wParamMap.Add("Code", wBMSTeamManage.Code);
                wParamMap.Add("Name", wBMSTeamManage.Name);
                wParamMap.Add("CreatorID", wLoginUser.ID);
                wParamMap.Add("EditorID", wLoginUser.ID);
                wParamMap.Add("LeaderID", StringUtils.Join(",", wBMSTeamManage.LeaderID));
                wParamMap.Add("MateID", StringUtils.Join(",", wBMSTeamManage.MateID));
                wParamMap.Add("ModuleID", wBMSTeamManage.ModuleID);
                wParamMap.Add("WorkShopID", wBMSTeamManage.WorkShopID);
                wParamMap.Add("DepartmentID", wBMSTeamManage.DepartmentID);
                wParamMap.Add("Active", wBMSTeamManage.Active);
                wParamMap.Add("Remark", wBMSTeamManage.Remark);

                if (wBMSTeamManage.ID <= 0)
                {

                    wBMSTeamManage.ID = (int)mDBPool.insert(wSQL, wParamMap);

                }
                else
                {
                    mDBPool.update(wSQL, wParamMap);
                }
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wErrorCode.set(MESException.DBSQL.Value);
            }

        }

        public int BMS_DeleteTeamManage(BMSEmployee wLoginUser, BMSTeamManage wBMSTeamManage,
                OutResult<Int32> wErrorCode)
        {
            int wResult = 0;
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                String wSQL = StringUtils.Format("Delete from {0}.bms_teammanage  WHERE ID = @ID and Active=0;  ",
                        wInstance);

                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("ID", wBMSTeamManage.ID);
                mDBPool.update(wSQL, wParamMap);
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wResult;
        }

        public int BMS_ActiveTeamManage(BMSEmployee wLoginUser, int wActive, BMSTeamManage wBMSTeamManage,
                OutResult<Int32> wErrorCode)
        {
            int wResult = 0;
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                String wSQL = StringUtils.Format(
                        "UPDATE {0}.bms_teammanage SET EditorID = @wEditorID, EditTime =now(), Active = @wActive WHERE ID = @wID;  ",
                        wInstance);
                wSQL = this.DMLChange(wSQL);
                wParamMap.Clear();
                wParamMap.Add("wID", wBMSTeamManage.ID);
                wParamMap.Add("wActive", wActive);
                wParamMap.Add("wEditorID", wLoginUser.ID);

                mDBPool.update(wSQL, wParamMap);

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wResult;
        }
    
    }
}
