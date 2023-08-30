using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class FMCWorkShopDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FMCWorkShopDAO));

        private static FMCWorkShopDAO Instance = null;

        private FMCWorkShopDAO() : base()
        {

        }

        public static FMCWorkShopDAO getInstance()
        {
            if (Instance == null)
                Instance = new FMCWorkShopDAO();
            return Instance;
        }


        // 车间
        private FMCWorkShop FMC_CheckWorkShopByName(BMSEmployee wLoginUser, FMCWorkShop wWorkShop,
                OutResult<Int32> wErrorCode)
        {
            FMCWorkShop wWorkShopDB = new FMCWorkShop();
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";
                    if (wWorkShop.ID > 0)
                    {
                        wSQLText = StringUtils.Format("Select * from {0}.fmc_workshop ", wInstance)
                                + " where ID!=@ID and FactoryID=@FactoryID and BusinessUnitID=@BusinessUnitID and Name=@Name";
                        wParms.Clear();
                        wParms.Add("ID", wWorkShop.ID);
                        wParms.Add("FactoryID", wWorkShop.FactoryID);
                        wParms.Add("BusinessUnitID", wWorkShop.BusinessUnitID);
                        wParms.Add("Name", wWorkShop.Name);
                    }
                    else
                    {
                        wSQLText = StringUtils.Format("Select * from {0}.fmc_workshop ", wInstance)
                                + " where Name=@Name and FactoryID=@FactoryID and BusinessUnitID=@BusinessUnitID";
                        wParms.Clear();
                        wParms.Add("Name", wWorkShop.Name);
                        wParms.Add("FactoryID", wWorkShop.FactoryID);
                        wParms.Add("BusinessUnitID", wWorkShop.BusinessUnitID);
                    }
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wWorkShopDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wWorkShopDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wWorkShopDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);
                        wWorkShopDB.BusinessUnitID = StringUtils.parseInt(wSqlDataReader["BusinessUnitID"]);

                        wWorkShopDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wWorkShopDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wWorkShopDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wWorkShopDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wWorkShopDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wWorkShopDB.ERPID = StringUtils.parseInt(wSqlDataReader["ERPID"]);
                    }

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_CheckWorkShopByName", ex);
            }
            return wWorkShopDB;
        }

        public int FMC_AddWorkShop(BMSEmployee wLoginUser, FMCWorkShop wWorkShop, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            int wID = 0;
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    FMCWorkShop wWorkShopDB = this.FMC_CheckWorkShopByName(wLoginUser, wWorkShop, wErrorCode);
                    if (wWorkShopDB.ID > 0 || wWorkShop.Name.Length < 1)
                        wErrorCode.set(MESException.Logic.Value);
                }
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("Insert Into {0}.fmc_workshop", wInstance)
                            + "(Name,Code,FactoryID,BusinessUnitID,CreatorID,EditorID,CreateTime,EditTime,Active,ShiftID,SCPeriod,ERPID) "
                            + " Values(@Name,@Code,@FactoryID,@BusinessUnitID,@CreatorID,@EditorID,@CreateTime,@EditTime,@Active,@ShiftID,@SCPeriod,@ERPID);";
                    wParms.Clear();

                    wParms.Add("Name", wWorkShop.Name);
                    wParms.Add("Code", wWorkShop.Code);
                    wParms.Add("FactoryID", wWorkShop.FactoryID);
                    wParms.Add("BusinessUnitID", wWorkShop.BusinessUnitID);
                    wParms.Add("CreatorID", wLoginUser.ID);
                    wParms.Add("EditorID", wLoginUser.ID); 
                    wParms.Add("ERPID", wWorkShop.ERPID);

                    wParms.Add("CreateTime", DateTime.Now);
                    wParms.Add("EditTime", DateTime.Now);
                    wParms.Add("Active", wWorkShop.Active);
                    wParms.Add("ShiftID", wWorkShop.ShiftID);
                    wParms.Add("SCPeriod", wWorkShop.SCPeriod);
                    wSQLText = this.DMLChange(wSQLText);

                    wWorkShop.ID = (int)mDBPool.insert(wSQLText, wParms);

                    wID = wWorkShop.ID;
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_AddWorkShop", ex);
            }
            return wID;
        }

        public int FMC_SaveWorkShop(BMSEmployee wLoginUser, FMCWorkShop wWorkShop, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    FMCWorkShop wWorkShopDB = this.FMC_CheckWorkShopByName(wLoginUser, wWorkShop, wErrorCode);
                    if (wWorkShopDB.ID > 0 || wWorkShop.Name.Length < 1)
                        wErrorCode.set(MESException.Logic.Value);
                }
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("update {0}.fmc_workshop", wInstance)
                            + " set Name=@Name,Code=@Code,FactoryID=@FactoryID,BusinessUnitID=@BusinessUnitID,EditorID=@EditorID,ERPID=@ERPID,"
                            + "EditTime=@EditTime,ShiftID=@ShiftID,SCPeriod=@SCPeriod  where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wWorkShop.ID);

                    wParms.Add("Name", wWorkShop.Name);
                    wParms.Add("Code", wWorkShop.Code);
                    wParms.Add("FactoryID", wWorkShop.FactoryID);
                    wParms.Add("BusinessUnitID", wWorkShop.BusinessUnitID);
                    wParms.Add("ERPID", wWorkShop.ERPID);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wParms.Add("ShiftID", wWorkShop.ShiftID);
                    wParms.Add("SCPeriod", wWorkShop.SCPeriod);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                    // this.FMC_LoadFactoyEntry(wCompanyID, wErrorCode);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_SaveWorkShop", ex);
            }
            return wErrorCode.Result;
        }

        public int FMC_DisableWorkShop(BMSEmployee wLoginUser, FMCWorkShop wWorkShop, OutResult<Int32> wErrorCode)
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

                    wSQLText = StringUtils.Format("update {0}.fmc_workshop", wInstance)
                            + " set EditorID=@EditorID," + " EditTime=@EditTime,Active=2 where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wWorkShop.ID);

                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                    // this.FMC_LoadFactoyEntry(wCompanyID, wErrorCode);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_DisableWorkShop", ex);
            }
            return wErrorCode.Result;
        }

        public int FMC_ActiveWorkShop(BMSEmployee wLoginUser, FMCWorkShop wWorkShop, OutResult<Int32> wErrorCode)
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

                    wSQLText = StringUtils.Format("update {0}.fmc_workshop", wInstance)
                            + " set EditorID=@EditorID," + " EditTime=@EditTime,Active=1 where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wWorkShop.ID);

                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_ActiveWorkShop", ex);
            }
            return wErrorCode.Result;
        }

        public FMCWorkShop FMC_QueryWorkShopByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            FMCWorkShop wWorkShopDB = new FMCWorkShop();
            wErrorCode.set(0);
            try
            {
                if (wID <= 0)
                    return wWorkShopDB;
                List<FMCWorkShop> wList = this.FMC_QueryWorkShopList(wLoginUser, wID, "", 0, 0, -1, wErrorCode);
                if (wList != null && wList.Count > 0)
                    wWorkShopDB = wList[0];
            }
            catch (Exception ex)
            {
                logger.Error("FMC_QueryWorkShopByCode", ex);
                wErrorCode.set(MESException.Exception.Value);
            }
            return wWorkShopDB;
        }

        public FMCWorkShop FMC_QueryWorkShopByCode(BMSEmployee wLoginUser, String wCode,
                OutResult<Int32> wErrorCode)
        {
            FMCWorkShop wWorkShopDB = new FMCWorkShop();
            wErrorCode.set(0);
            try
            {
                if (StringUtils.isEmpty(wCode))
                    return wWorkShopDB;
                List<FMCWorkShop> wList = this.FMC_QueryWorkShopList(wLoginUser, 0, wCode, 0, 0,-1, wErrorCode);
                if (wList != null && wList.Count > 0)
                    wWorkShopDB = wList[0];
            }
            catch (Exception ex)
            {
                logger.Error("FMC_QueryWorkShopByCode", ex);
                wErrorCode.set(MESException.Exception.Value);
            }
            return wWorkShopDB;
        }


        public List<FMCWorkShop> FMC_QueryWorkShopList(BMSEmployee wLoginUser, int wFactoryID, int wBusinessUnitID, int wActive,
                 OutResult<Int32> wErrorCode)
        {
            return this.FMC_QueryWorkShopList(wLoginUser, 0, "", wFactoryID, wBusinessUnitID, wActive, wErrorCode);
        }

        private List<FMCWorkShop> FMC_QueryWorkShopList(BMSEmployee wLoginUser, int wID, String wCode, int wFactoryID, int wBusinessUnitID,int wActive,
                 OutResult<Int32> wErrorCode)
        {
            List<FMCWorkShop> wWorkShopList = new List<FMCWorkShop>();
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    String wCondition = "";
                    if (wFactoryID > 0)
                        wCondition = StringUtils.Format(" where t.FactoryID={0}", wFactoryID);

                    if (wBusinessUnitID > 0)
                    {
                        if (wCondition.Length > 0)
                            wCondition = StringUtils.Format(" {0} and t.BusinessUnitID={0}", wBusinessUnitID);
                        else
                            wCondition = StringUtils.Format(" where t.BusinessUnitID={0}", wBusinessUnitID);
                    }
                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("Select t.*,t3.Name as Creator,t4.Name as Editor, t2.Name as ShiftName from {0}.fmc_workshop t "
                                  + " left join {0}.fmc_shift t2 on t.ShiftID=t2.ID "
                                     + " left join {0}.mbs_user t3 on t.CreatorID=t3.ID "
                                        + " left join {0}.mbs_user t4 on t.EditorID=t4.ID "
                                 + " where (@ID<=0 OR t.ID=@ID) and  (@Code = '' OR t.Code=@Code)" +
                                 " and (@FactoryID<=0 OR t.FactoryID=@FactoryID) and  (@Active < 0 OR t.Active = @Active) " +
                                 "  and (@BusinessUnitID<=0 OR t.BusinessUnitID=@BusinessUnitID);", wInstance);
                    wParms.Clear();
                    wParms.Add("FactoryID", wFactoryID);
                    wParms.Add("BusinessUnitID", wBusinessUnitID);
                    wParms.Add("ID", wID);
                    wParms.Add("Code", wCode);
                    wParms.Add("Active", wActive);
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        FMCWorkShop wWorkShopDB = new FMCWorkShop();
                        wWorkShopDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wWorkShopDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wWorkShopDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                        wWorkShopDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);
                        wWorkShopDB.ERPID = StringUtils.parseInt(wSqlDataReader["ERPID"]);
                        wWorkShopDB.BusinessUnitID = StringUtils.parseInt(wSqlDataReader["BusinessUnitID"]);

                        wWorkShopDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wWorkShopDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wWorkShopDB.Creator = StringUtils.parseString(wSqlDataReader["Creator"]);
                        wWorkShopDB.Editor = StringUtils.parseString(wSqlDataReader["Editor"]);
                        wWorkShopDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wWorkShopDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wWorkShopDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wWorkShopDB.ShiftID = StringUtils.parseInt(wSqlDataReader["ShiftID"]);
                        wWorkShopDB.ShiftName = StringUtils.parseString(wSqlDataReader["ShiftName"]);
                        wWorkShopDB.SCPeriod = StringUtils.parseInt(wSqlDataReader["SCPeriod"]);
                        wWorkShopList.Add(wWorkShopDB);
                    }
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_QueryWorkShopList", ex);

            }
            return wWorkShopList;
        }

    }
}
