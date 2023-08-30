using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class FMCShiftDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FMCShiftDAO));

        private static FMCShiftDAO Instance = null;

        private FMCShiftDAO() : base()
        {
        }

        public static FMCShiftDAO getInstance()
        {
            if (Instance == null)
                Instance = new FMCShiftDAO();
            return Instance;
        }
  
        // 班次模板管理
        private FMCWorkDay FMC_CheckWorkDay(BMSEmployee wLoginUser, FMCWorkDay wWorkDay,
                OutResult<Int32> wErrorCode)
        {
            FMCWorkDay wShiftDB = new FMCWorkDay();
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("Select ID from {0}.fmc_workday ", wInstance)
                            + " where ID!=@ID and FactoryID=@FactoryID and WorkShopID=@WorkShopID and Name=@Name";
                    wParms.Clear();
                    wParms.Add("ID", wWorkDay.ID);
                    wParms.Add("Name", wWorkDay.Name);
                    wParms.Add("WorkShopID", wWorkDay.WorkShopID);
                    wParms.Add("FactoryID", wWorkDay.FactoryID);

                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wShiftDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    }

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_CheckWorkDay", ex);

            }
            return wShiftDB;
        }

        public int FMC_AddWorkDay(BMSEmployee wLoginUser, FMCWorkDay wWorkDay, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            int wID = 0;
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    FMCWorkDay wShiftDB = this.FMC_CheckWorkDay(wLoginUser, wWorkDay, wErrorCode);
                    if (wShiftDB.ID > 0 || wWorkDay.Name.Length < 1)
                        wErrorCode.set(MESException.Logic.Value);
                }
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("Insert Into {0}.fmc_workday", wInstance)
                            + "(Name,FactoryID,WorkShopID,CreatorID,EditorID,CreateTime,EditTime,"
                            + " StartTime,Minutes,WorkMinutes,IdleMinutes,EndTime,Active) "
                            + " Values(@Name,@FactoryID,@WorkShopID,@CreatorID,@EditorID"
                            + "@CreateTime,@EditTime,@StartTime,@Minutes,@WorkMinutes,@IdleMinutes,@EndTime,@Active);";
                    wParms.Clear();

                    wParms.Add("Name", wWorkDay.Name);
                    wParms.Add("FactoryID", wWorkDay.FactoryID);
                    wParms.Add("WorkShopID", wWorkDay.WorkShopID);
                    wParms.Add("StartTime", wWorkDay.StartTime);
                    wParms.Add("Minutes", wWorkDay.Minutes);
                    wParms.Add("WorkMinutes", wWorkDay.WorkMinutes);
                    wParms.Add("IdleMinutes", wWorkDay.IdleMinutes);
                    wParms.Add("EndTime", wWorkDay.EndTime);
                    wParms.Add("CreatorID", wLoginUser.ID);
                    wParms.Add("EditorID", wLoginUser.ID); 

                    wParms.Add("CreateTime", DateTime.Now);
                    wParms.Add("EditTime", DateTime.Now); 
                    wParms.Add("Active", 0);
                    wSQLText = this.DMLChange(wSQLText);

                    wID = (int)mDBPool.insert(wSQLText, wParms);
                    wWorkDay.ID = wID;
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("FMC_AddWorkDay", ex);
            }
            return wID;
        }

        public int FMC_SaveWorkDay(BMSEmployee wLoginUser, FMCWorkDay wWorkDay, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    FMCWorkDay wWorkDayDB = this.FMC_CheckWorkDay(wLoginUser, wWorkDay, wErrorCode);
                    if (wWorkDayDB.ID > 0 || wWorkDay.Name.Length < 1)
                        wErrorCode.set(MESException.Logic.Value);
                }
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("update {0}.fmc_workday", wInstance)
                            + " set Name=@Name,FactoryID=@FactoryID,WorkShopID=@WorkShopID,StartTime=@StartTime,Minutes=@Minutes,WorkMinutes=@WorkMinutes,"
                            + "IdleMinutes=@IdleMinutes,EndTime=@EndTime,EditorID=@EditorID,EditTime=@EditTime where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wWorkDay.ID);

                    wParms.Add("Name", wWorkDay.Name);
                    wParms.Add("FactoryID", wWorkDay.FactoryID);
                    wParms.Add("WorkShopID", wWorkDay.WorkShopID);
                    wParms.Add("StartTime", wWorkDay.StartTime);
                    wParms.Add("Minutes", wWorkDay.Minutes);
                    wParms.Add("WorkMinutes", wWorkDay.WorkMinutes);
                    wParms.Add("IdleMinutes", wWorkDay.IdleMinutes);
                    wParms.Add("EndTime", wWorkDay.EndTime);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_SaveWorkDay", ex);
            }
            return wErrorCode.Result;
        }

        public int FMC_DisableWorkDay(BMSEmployee wLoginUser, FMCWorkDay wWorkDay, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("update {0}.fmc_workday", wInstance) + " set EditorID=@EditorID,"
                            + " EditTime=@EditTime,Active=2 where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wWorkDay.ID);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("FMC_DisableWorkDay", ex);
            }
            return wErrorCode.Result;
        }

        public int FMC_ActiveWorkDay(BMSEmployee wLoginUser, FMCWorkDay wWorkDay, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("update {0}.fmc_workday", wInstance) + " set EditorID=@EditorID,"
                            + " EditTime=@EditTime,Active=0  where ID>0 AND FactoryID=@FactoryID AND WorkShopID=@WorkShopID ;";
                    wSQLText = this.DMLChange(wSQLText);
                    wParms.Add("WorkShopID", wWorkDay.WorkShopID);
                    wParms.Add("FactoryID", wWorkDay.FactoryID);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    mDBPool.update(wSQLText, wParms);

                    wSQLText = StringUtils.Format("update {0}.fmc_workday", wInstance)
                            + " set  EditorID=@EditorID," + " EditTime=@EditTime,Active=1 where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wWorkDay.ID);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("FMC_ActiveWorkDay", ex);
            }
            return wErrorCode.Result;
        }



        public FMCWorkDay FMC_QueryWorkDayByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            FMCWorkDay wWorkDayDB = new FMCWorkDay();
            wErrorCode.set(0);
            try
            {
                List<FMCWorkDay> wShiftList = this.FMC_QueryWorkDayList(wLoginUser, wID, -1, -1, -1, wErrorCode);
                if (wShiftList != null && wShiftList.Count > 0)
                    wWorkDayDB = wShiftList[0];
            }
            catch (Exception ex)
            {
                logger.Error("FMC_QueryWorkDayByID", ex);
                wErrorCode.set(MESException.Exception.Value);
            }
            return wWorkDayDB;
        }

        public FMCWorkDay FMC_QueryActiveWorkDay(BMSEmployee wLoginUser, int wFactoryID, int wWorkShopID,
                OutResult<Int32> wErrorCode)
        {
            FMCWorkDay wWorkDayDB = new FMCWorkDay();
            wErrorCode.set(0);
            try
            {
                List<FMCWorkDay> wShiftList = this.FMC_QueryWorkDayList(wLoginUser, 0, wFactoryID, wWorkShopID, 1,
                        wErrorCode);
                if (wShiftList != null && wShiftList.Count > 0)
                    wWorkDayDB = wShiftList[0];
            }
            catch (Exception ex)
            {
                logger.Error("FMC_QueryWorkDayByID", ex);
                wErrorCode.set(MESException.Exception.Value);
            }
            return wWorkDayDB;
        }

        private List<FMCWorkDay> FMC_QueryWorkDayList(BMSEmployee wLoginUser, int wID, int wFactoryID,
                int wWorkShopID, int wActive, OutResult<Int32> wErrorCode)
        {
            List<FMCWorkDay> wShiftList = new List<FMCWorkDay>();
            wErrorCode.set(0);
            try
            {
                //  wSqlDataReader\.get\(\"([^\\"]+)\"\)  wSqlDataReader["$1"]

                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = StringUtils
                            .Format("Select t.*,t1.Name as Factory,t2.Name as WorkShopName,"
                                    + " t3.Name as Creator,t4.Name as Editor  from {0}.fmc_workday t "
                                    + " left join {0}.fmc_factory t1 on t1.ID=t.FactoryID "
                                    + " left join {0}.fmc_workshop t2 on t2.ID=t.WorkShopID"
                                    + " left join {0}.mbs_user t3 on t.CreatorID=t3.ID"
                                    + " left join {0}.mbs_user t4 on t.EditorID=t4.ID"
                                    + " where (@ID<=0 OR t.ID=@ID)"
                                    + " AND (@Active< 0 OR t.Active=@Active)"
                                    + " AND (@FactoryID <=0  OR t.FactoryID=@FactoryID)"
                                    + " AND (@WorkShopID <=0  OR t.WorkShopID=@WorkShopID)", wInstance);
                    wParms.Clear();
                    wParms.Add("ID", wID);
                    wParms.Add("Active", wActive);
                    wParms.Add("FactoryID", wFactoryID);
                    wParms.Add("WorkShopID", wWorkShopID);
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        FMCWorkDay wShiftDB = new FMCWorkDay();
                        wShiftDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wShiftDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wShiftDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);
                        wShiftDB.Factory = StringUtils.parseString(wSqlDataReader["Factory"]);
                        wShiftDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
                        wShiftDB.WorkShopName = StringUtils.parseString(wSqlDataReader["WorkShopName"]);
                        wShiftDB.StartTime = StringUtils.parseDate(wSqlDataReader["StartTime"]);
                        wShiftDB.Minutes = StringUtils.parseInt(wSqlDataReader["Minutes"]);
                        wShiftDB.WorkMinutes = StringUtils.parseInt(wSqlDataReader["WorkMinutes"]);
                        wShiftDB.IdleMinutes = StringUtils.parseInt(wSqlDataReader["IdleMinutes"]);
                        wShiftDB.EndTime = StringUtils.parseDate(wSqlDataReader["EndTime"]);

                        wShiftDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wShiftDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wShiftDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wShiftDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wShiftDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);

                        wShiftDB.Creator = StringUtils.parseString(wSqlDataReader["Creator"]);

                        wShiftDB.Editor = StringUtils.parseString(wSqlDataReader["Editor"]);

                        wShiftList.Add(wShiftDB);
                    }

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_QueryWorkDayList: Query DB",
                        ex);
            }
            return wShiftList;
        }

        public List<FMCWorkDay> FMC_QueryWorkDayList(BMSEmployee wLoginUser, int wFactoryID, int wWorkShopID,
                int wActive, OutResult<Int32> wErrorCode)
        {
            List<FMCWorkDay> wShiftList = new List<FMCWorkDay>();
            wErrorCode.set(0);
            try
            {
                wShiftList = this.FMC_QueryWorkDayList(wLoginUser, 0, wFactoryID, wWorkShopID, wActive,
                        wErrorCode);

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_QueryWorkDayList: Query DB",
                        ex);
            }
            return wShiftList;
        }

        private FMCShift FMC_CheckShift(BMSEmployee wLoginUser, FMCShift wShift, OutResult<Int32> wErrorCode)
        {
            FMCShift wShiftDB = new FMCShift();
            wErrorCode.set(0);
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";
                    if (wShift.ID > 0)
                    {
                        wSQLText = StringUtils.Format("Select * from {0}.fmc_shift ", wInstance)
                                + " where ID!=@ID and LevelID=@LevelID and WorkDayID=@WorkDayID";
                        wParms.Clear();
                        wParms.Add("ID", wShift.ID);
                        wParms.Add("LevelID", wShift.LevelID);
                        wParms.Add("WorkDayID", wShift.WorkDayID);
                    }
                    else
                    {
                        wSQLText = StringUtils.Format("Select * from {0}.fmc_shift ", wInstance)
                                + " where LevelID=@LevelID and WorkDayID=@WorkDayID";
                        wParms.Clear();
                        wParms.Add("LevelID", wShift.LevelID);
                        wParms.Add("WorkDayID", wShift.WorkDayID);
                    }
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wShiftDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wShiftDB.LevelID = StringUtils.parseInt(wSqlDataReader["LevelID"]);
                        wShiftDB.WorkDayID = StringUtils.parseInt(wSqlDataReader["WorkDayID"]);
                        wShiftDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wShiftDB.StartTime = StringUtils.parseDate(wSqlDataReader["StartTime"]);
                        wShiftDB.Minutes = StringUtils.parseInt(wSqlDataReader["Minutes"]);
                        wShiftDB.WorkMinutes = StringUtils.parseInt(wSqlDataReader["WorkMinutes"]);
                        wShiftDB.IdleMinutes = StringUtils.parseInt(wSqlDataReader["IdleMinutes"]);
                        wShiftDB.EndTime = StringUtils.parseDate(wSqlDataReader["EndTime"]);
                        wShiftDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                    }

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_CheckShift", ex);
            }
            return wShiftDB;
        }

        public List<FMCShift> FMC_QueryShiftList(BMSEmployee wLoginUser, int wWorkDayID, int wActive,
                OutResult<Int32> wErrorCode)
        {
            List<FMCShift> wShiftList = new List<FMCShift>();
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {

                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";
                    wSQLText = StringUtils.Format("Select t.*,t3.Name as  Creator from {0}.fmc_shift t " 
                            + " left join {0}.mbs_user t3 on t.CreatorID=t3.ID"
                            + " where t.WorkDayID=@WorkDayID and (@Active<=0 or t.Active=@Active )", wInstance);
                    wParms.Clear();
                    wParms.Add("WorkDayID", wWorkDayID);
                    wParms.Add("Active", wActive);
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        FMCShift wShiftDB = new FMCShift();

                        wShiftDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wShiftDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wShiftDB.LevelID = StringUtils.parseInt(wSqlDataReader["LevelID"]);
                        wShiftDB.WorkDayID = StringUtils.parseInt(wSqlDataReader["WorkDayID"]);
                        wShiftDB.StartTime = StringUtils.parseDate(wSqlDataReader["StartTime"]);
                        wShiftDB.Minutes = StringUtils.parseInt(wSqlDataReader["Minutes"]);
                        wShiftDB.WorkMinutes = StringUtils.parseInt(wSqlDataReader["WorkMinutes"]);

                        wShiftDB.IdleMinutes = StringUtils.parseInt(wSqlDataReader["IdleMinutes"]);
                        wShiftDB.EndTime = StringUtils.parseDate(wSqlDataReader["EndTime"]);
                        wShiftDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wShiftDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wShiftDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wShiftDB.Creator = StringUtils.parseString(wSqlDataReader["Creator"]);

                        wShiftList.Add(wShiftDB);
                    }
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_QueryShiftList: Query DB",
                        ex);
            }
            return wShiftList;
        }

        public int FMC_SaveShiftList(BMSEmployee wLoginUser, List<FMCShift> wShiftList,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            int wID = 0;
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";
                    foreach (FMCShift wShift in wShiftList)
                    {
                        if (wErrorCode.Result == 0)
                        {
                            FMCShift wShiftDB = this.FMC_CheckShift(wLoginUser, wShift, wErrorCode);
                            if (wShiftDB.ID > 0 || wShift.Name.Length < 1 || wShift.WorkDayID < 1)
                                wErrorCode.set(MESException.Logic.Value);
                        }
                        if (wErrorCode.Result == 0)
                            break;
                        // Step02：增加或更新排班记录
                        if (wShift.ID < 1)
                        {
                            wShift.Name = EnumTool.GetEnumDesc<FMCShiftLevel>(wShift.LevelID);

                            wSQLText = StringUtils.Format("Insert Into {0}.fmc_shift", wInstance)
                                    + "(Name,WorkDayID,LevelID,StartTime,Minutes,WorkMinutes,IdleMinutes,EndTime,Active,CreatorID,CreateTime) "
                                    + " Values(@Name,@WorkDayID,@LevelID,@StartTime,@Minutes,@WorkMinutes,@IdleMinutes,@EndTime,@Active,@CreatorID,@CreateTime);";
                            wParms.Clear();

                            wParms.Add("WorkDayID", wShift.WorkDayID);
                            wParms.Add("LevelID", wShift.LevelID);
                            wParms.Add("Name", wShift.Name);
                            wParms.Add("StartTime", wShift.StartTime);
                            wParms.Add("Minutes", wShift.Minutes);
                            wParms.Add("WorkMinutes", wShift.WorkMinutes);
                            wParms.Add("IdleMinutes", wShift.IdleMinutes);
                            wParms.Add("EndTime", wShift.EndTime);
                            wParms.Add("Active", wShift.Active);
                            wParms.Add("CreatorID", wLoginUser.ID);
                            wParms.Add("CreateTime", DateTime.Now);
                            wSQLText = this.DMLChange(wSQLText);
                            wID=(int) mDBPool.insert(wSQLText, wParms);
                             
                            wShift.ID = wID;

                        }
                        else
                        {
                            wSQLText = StringUtils.Format("update {0}.fmc_shift", wInstance)
                                    + " set Name=@Name,WorkDayID=@WorkDayID,StartTime=@StartTime,Minutes=@Minutes,"
                                    + " WorkMinutes=@WorkMinutes,IdleMinutes=@IdleMinutes,EndTime=@EndTime,Active=@Active,CreatorID=@CreatorID,CreateTime=@CreateTime where ID=@ID ";
                            wParms.Clear();

                            wParms.Add("WorkDayID", wShift.WorkDayID);
                            wParms.Add("Name", wShift.Name);
                            wParms.Add("StartTime", wShift.StartTime);
                            wParms.Add("Minutes", wShift.Minutes);
                            wParms.Add("WorkMinutes", wShift.WorkMinutes);
                            wParms.Add("IdleMinutes", wShift.IdleMinutes);
                            wParms.Add("EndTime", wShift.EndTime);
                            wParms.Add("Active", wShift.Active);
                            wParms.Add("CreatorID", wLoginUser.ID);
                            wParms.Add("CreateTime", DateTime.Now);
                            wParms.Add("ID", wShift.ID);
                            wSQLText = this.DMLChange(wSQLText);
                            mDBPool.update(wSQLText, wParms);

                            wID = wShift.ID;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_SaveShiftList", ex);
            }
            return wID;
        }

        public int FMC_SaveShift(BMSEmployee wLoginUser, FMCShift wShift, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            int wID = 0;

            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    FMCShift wShiftDB = this.FMC_CheckShift(wLoginUser, wShift, wErrorCode);
                    if (wShiftDB.ID > 0 || wShift.Name.Length < 1 || wShift.WorkDayID < 1)
                        wErrorCode.set(MESException.Logic.Value);
                }
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";
                    // Step02：增加或更新排班记录
                    if (wShift.ID < 1)
                    {
                        wShift.Name = EnumTool.GetEnumDesc<FMCShiftLevel>(wShift.LevelID);
                        wSQLText = StringUtils.Format("Insert Into {0}.fmc_shift", wInstance)
                                + "(Name,WorkDayID,LevelID,StartTime,Minutes,WorkMinutes,IdleMinutes,EndTime,Active,CreatorID,CreateTime) "
                                + " Values(@Name,@WorkDayID,@LevelID,@StartTime,@Minutes,@WorkMinutes,@IdleMinutes,@EndTime,@Active,@CreatorID,@CreateTime);";
                        wParms.Clear();

                        wParms.Add("WorkDayID", wShift.WorkDayID);
                        wParms.Add("LevelID", wShift.LevelID);
                        wParms.Add("Name", wShift.Name);
                        wParms.Add("StartTime", wShift.StartTime);
                        wParms.Add("Minutes", wShift.Minutes);
                        wParms.Add("WorkMinutes", wShift.WorkMinutes);
                        wParms.Add("IdleMinutes", wShift.IdleMinutes);
                        wParms.Add("EndTime", wShift.EndTime);
                        wParms.Add("Active", wShift.Active);
                        wParms.Add("CreatorID", wLoginUser.ID);
                        wParms.Add("CreateTime", DateTime.Now);
                        wSQLText = this.DMLChange(wSQLText);

                        wID = (int)mDBPool.insert(wSQLText, wParms);
                         
                        wShift.ID = wID;
                    }
                    else
                    {
                        wSQLText = StringUtils.Format("update {0}.fmc_shift", wInstance)
                                + " set Name=@Name,WorkDayID=@WorkDayID,LevelID=@LevelID,StartTime=@StartTime,Minutes=@Minutes,"
                                + " WorkMinutes=@WorkMinutes,IdleMinutes=@IdleMinutes,EndTime=@EndTime,Active=@Active,CreatorID=@CreatorID,CreateTime=@CreateTime where ID=@ID ";
                        wParms.Clear();

                        wParms.Add("WorkDayID", wShift.WorkDayID);
                        wParms.Add("LevelID", wShift.LevelID);
                        wParms.Add("Name", wShift.Name);
                        wParms.Add("StartTime", wShift.StartTime);
                        wParms.Add("Minutes", wShift.Minutes);
                        wParms.Add("WorkMinutes", wShift.WorkMinutes);
                        wParms.Add("IdleMinutes", wShift.IdleMinutes);
                        wParms.Add("EndTime", wShift.EndTime);
                        wParms.Add("Active", wShift.Active);
                        wParms.Add("CreatorID", wLoginUser.ID);
                        wParms.Add("CreateTime", DateTime.Now);
                        wParms.Add("ID", wShift.ID);
                        wSQLText = this.DMLChange(wSQLText);
                        mDBPool.update(wSQLText, wParms);
                        wID = wShift.ID;
                    }
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_SaveShift", ex);
            }

            return wID;
        }

        public FMCShift FMC_QueryShiftByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            FMCShift wShiftDB = new FMCShift();
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";
                    wSQLText = StringUtils.Format("Select t.*,t3.Name as Creator from {0}.fmc_shift t  "
                                    + " left join {0}.mbs_user t3 on t.CreatorID=t3.ID"
                                    + " where t.ID=@ID", wInstance);
                    wParms.Clear();
                    wParms.Add("ID", wID);
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wShiftDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wShiftDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wShiftDB.WorkDayID = StringUtils.parseInt(wSqlDataReader["WorkDayID"]);
                        wShiftDB.LevelID = StringUtils.parseInt(wSqlDataReader["LevelID"]);
                        wShiftDB.StartTime = StringUtils.parseDate(wSqlDataReader["StartTime"]);
                        wShiftDB.Minutes = StringUtils.parseInt(wSqlDataReader["Minutes"]);
                        wShiftDB.WorkMinutes = StringUtils.parseInt(wSqlDataReader["WorkMinutes"]);

                        wShiftDB.IdleMinutes = StringUtils.parseInt(wSqlDataReader["IdleMinutes"]);
                        wShiftDB.EndTime = StringUtils.parseDate(wSqlDataReader["EndTime"]);
                        wShiftDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wShiftDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wShiftDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);

                        wShiftDB.Creator = StringUtils.parseString(wSqlDataReader["Creator"]);
                    }

                    if (wShiftDB.ID > 0)
                    {
                        // Step01：人员姓名 
                        wShiftDB.IdleZoneList = this.FMC_LoadShiftTimeZoneList(wLoginUser, wShiftDB.ID, wErrorCode);
                        wShiftDB.Name = EnumTool.GetEnumDesc<FMCShiftLevel>(wShiftDB.LevelID);
                    }
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_QueryShiftByID: Query DB",
                        ex);
            }
            return wShiftDB;
        }

        public int FMC_DeleteShiftByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    FMCShift wShiftDB = this.FMC_QueryShiftByID(wLoginUser, wID, wErrorCode);
                    if (wErrorCode.Result == 0 && wShiftDB.ID > 0)
                    {
                        Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                        String wSQLText = "";

                        wSQLText = StringUtils.Format("Delete t.* from {0}.fmc_shiftzonetime t ", wInstance)
                                + " where t.ShiftID=@ShiftID";
                        wParms.Clear();
                        wParms.Add("ShiftID", wID);
                        wSQLText = this.DMLChange(wSQLText);
                        mDBPool.update(wSQLText, wParms);

                        wSQLText = StringUtils.Format("Delete t.* from {0}.fmc_shift t ", wInstance)
                                + " where t.ID=@ID";
                        wParms.Clear();
                        wParms.Add("ID", wID);
                        wSQLText = this.DMLChange(wSQLText);
                        mDBPool.update(wSQLText, wParms);
                    }
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_DeleteShiftByID: Query DB",
                        ex);

            }
            return wErrorCode.Result;
        }

        public List<FMCTimeZone> FMC_QueryShiftTimeZoneList(BMSEmployee wLoginUser, int wShiftID,
                OutResult<Int32> wErrorCode)
        {
            List<FMCTimeZone> wTimeZoneList = new List<FMCTimeZone>();
            wErrorCode.set(0);

            try
            {
                wTimeZoneList = this.FMC_LoadShiftTimeZoneList(wLoginUser, wShiftID, wErrorCode);
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_QueryShiftTimeZoneList", ex);
            }
            return wTimeZoneList;
        }

        public int FMC_SaveShiftTimeZoneList(BMSEmployee wLoginUser, List<FMCTimeZone> wTimeZoneList, int wShiftID,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            int wID = 0;
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";
                    foreach (FMCTimeZone wTimeZone in wTimeZoneList)
                    {
                        // Step02：增加或更新排班记录
                        if (wTimeZone.ID < 1)
                        {
                            wSQLText = StringUtils.Format("Insert Into {0}.fmc_shiftzonetime", wInstance)
                                    + "(ShiftID,Name,StartTime,Minutes,IdleOrWork) "
                                    + " Values(@ShiftID,@Name,@StartTime,@Minutes,@IdleOrWork);";
                            wParms.Clear();

                            wParms.Add("ShiftID", wTimeZone.ShiftID);
                            wParms.Add("Name", wTimeZone.ZoneName);
                            wParms.Add("StartTime", wTimeZone.StartTime);
                            wParms.Add("Minutes", wTimeZone.Minutes);
                            wParms.Add("IdleOrWork", wTimeZone.IdleOrWork ? 1 : 0);
                            wSQLText = this.DMLChange(wSQLText);

                            wID=(int) mDBPool.insert(wSQLText, wParms);
                             
                            wTimeZone.ID = wID;
                        }
                        else
                        {
                            wSQLText = StringUtils.Format("update {0}.fmc_shiftzonetime", wInstance)
                                    + " set Name=@Name,StartTime=@StartTime,"
                                    + " Minutes=@Minutes,IdleOrWork=@IdleOrWork where ID=@ID ";
                            wParms.Clear();

                            wParms.Add("ID", wTimeZone.ID);
                            wParms.Add("Name", wTimeZone.ZoneName);
                            wParms.Add("StartTime", wTimeZone.StartTime);
                            wParms.Add("Minutes", wTimeZone.Minutes);
                            wParms.Add("IdleOrWork", wTimeZone.IdleOrWork ? 1 : 0);
                            wSQLText = this.DMLChange(wSQLText);
                            mDBPool.update(wSQLText, wParms);

                            wID = wTimeZone.ID;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_SaveShiftTimeZoneList", ex);
            }
            return wID;
        }

       
        private List<FMCShift> FMC_QueryShiftListByWorkDayID(BMSEmployee wLoginUser, int wWorkDayID,
                OutResult<Int32> wErrorCode)
        {
            List<FMCShift> wShiftList = new List<FMCShift>();
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    String wSQLText = StringUtils.Format("Select t.* from {0}.fmc_shift t ", wInstance)
                            + " where t.WorkDayID=@WorkDayID";

                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    wParms.Clear();
                    wParms.Add("WorkDayID", wWorkDayID);
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        FMCShift wShiftDB = new FMCShift();
                        wShiftDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wShiftDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wShiftDB.WorkDayID = StringUtils.parseInt(wSqlDataReader["WorkDayID"]);
                        wShiftDB.LevelID = StringUtils.parseInt(wSqlDataReader["LevelID"]);
                        wShiftDB.StartTime = StringUtils.parseDate(wSqlDataReader["StartTime"]);
                        wShiftDB.Minutes = StringUtils.parseInt(wSqlDataReader["Minutes"]);
                        wShiftDB.WorkMinutes = StringUtils.parseInt(wSqlDataReader["WorkMinutes"]);

                        wShiftDB.IdleMinutes = StringUtils.parseInt(wSqlDataReader["IdleMinutes"]);
                        wShiftDB.EndTime = StringUtils.parseDate(wSqlDataReader["EndTime"]);
                        wShiftDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wShiftDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wShiftDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wShiftDB.Name = EnumTool.GetEnumDesc<FMCShiftLevel>(wShiftDB.LevelID);
                        wShiftList.Add(wShiftDB);
                    }

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_QueryShiftList: Query DB",
                        ex);
            }
            return wShiftList;
        }

        private List<FMCTimeZone> FMC_LoadShiftTimeZoneList(BMSEmployee wLoginUser, int wShiftID, OutResult<Int32> wErrorCode)
        {
            List<FMCTimeZone> wTimeZoneList = new List<FMCTimeZone>();
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    String wSQLText = StringUtils.Format("Select t.* from {0}.fmc_shiftzonetime t ", wInstance)
                            + " where t.ShiftID=@ShiftID";

                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    wParms.Clear();
                    wParms.Add("ShiftID", wShiftID);
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        FMCTimeZone wTimeZoneDB = new FMCTimeZone();
                        wTimeZoneDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wTimeZoneDB.ShiftID = StringUtils.parseInt(wSqlDataReader["ShiftID"]);
                        wTimeZoneDB.ZoneName = StringUtils.parseString(wSqlDataReader["Name"]);
                        wTimeZoneDB.StartTime = StringUtils.parseDate(wSqlDataReader["StartTime"]);
                        wTimeZoneDB.Minutes = StringUtils.parseInt(wSqlDataReader["Minutes"]);
                        wTimeZoneDB.IdleOrWork = StringUtils.parseBoolean(wSqlDataReader["IdleOrWork"]);
                        wTimeZoneList.Add(wTimeZoneDB);
                    }
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_LoadShiftTimeZoneList", ex);
            }
            return wTimeZoneList;
        }


    }
}
