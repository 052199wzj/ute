using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class FMCLineUnitDAO : BaseDAO
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FMCLineUnitDAO));

        private static FMCLineUnitDAO Instance = null;

        private static int ProductEnable = StringUtils
                .parseInt( GlobalConstant.GlobalConfiguration.GetValue("FPC.LineUnit.ProductEnable"));

        private static int CustomerEnable = StringUtils
                .parseInt( GlobalConstant.GlobalConfiguration.GetValue("FPC.LineUnit.CustomerEnable"));

        private FMCLineUnitDAO() : base()
        {

        }

        public static FMCLineUnitDAO getInstance()
        {
            if (Instance == null)
                Instance = new FMCLineUnitDAO();
            return Instance;
        }

        // 产线工艺配置
        private FMCLineUnit FMC_CheckLineUnit(BMSEmployee wLoginUser, FMCLineUnit wLineUnit,
                OutResult<Int32> wErrorCode)
        {
            FMCLineUnit wLineUnitDB = new FMCLineUnit();
            wErrorCode.set(0);
            try
            {
                if (ProductEnable != 1)
                    wLineUnit.ProductID = 0;
                if (CustomerEnable != 1)
                    wLineUnit.CustomerID = 0;
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result != 0)
                {
                    return wLineUnitDB;
                }
                // Step0:查询
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                String wSQLText = StringUtils.Format("Select * from {0}.fmc_lineunit ", wInstance)
                        + " where ID!=@ID and LineID=@LineID and ProductID=@ProductID and CustomerID=@CustomerID"
                        + " and UnitID=@UnitID and LevelID=@LevelID and ParentUnitID=@ParentUnitID";
                wParms.Clear();
                wParms.Add("ID", wLineUnit.ID);
                wParms.Add("LineID", wLineUnit.LineID);
                wParms.Add("UnitID", wLineUnit.UnitID);
                wParms.Add("LevelID", wLineUnit.LevelID);
                wParms.Add("ProductID", wLineUnit.ProductID);
                wParms.Add("CustomerID", wLineUnit.CustomerID);
                wParms.Add("ParentUnitID", wLineUnit.ParentUnitID);

                wSQLText = this.DMLChange(wSQLText);
                List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {
                    wLineUnitDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    wLineUnitDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
                    wLineUnitDB.UnitID = StringUtils.parseInt(wSqlDataReader["UnitID"]);
                    wLineUnitDB.LevelID = StringUtils.parseInt(wSqlDataReader["LevelID"]);
                    wLineUnitDB.OrderID = StringUtils.parseInt(wSqlDataReader["OrderID"]);

                    wLineUnitDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                    wLineUnitDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                    wLineUnitDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                    wLineUnitDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                    wLineUnitDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                    wLineUnitDB.ShiftDays = StringUtils.parseInt(wSqlDataReader["ShiftDays"]);
                    wLineUnitDB.QTPeriod = StringUtils.parseInt(wSqlDataReader["QTPeriod"]);
                    wLineUnitDB.TechPeriod = StringUtils.parseInt(wSqlDataReader["TechPeriod"]);
                }

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_CheckLineByName", ex);

            }
            return wLineUnitDB;
        }

        public void FMC_AddLineUnit(BMSEmployee wLoginUser, FMCLineUnit wLineUnit, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {

                if (wLineUnit == null || wLineUnit.LineID <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                if (ProductEnable != 1)
                    wLineUnit.ProductID = 0;
                else if (wLineUnit.ProductID <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                if (CustomerEnable != 1)
                    wLineUnit.CustomerID = 0;
                else if (wLineUnit.CustomerID <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    FMCLineUnit wLineUnitDB = this.FMC_CheckLineUnit(wLoginUser, wLineUnit, wErrorCode);
                    if (wLineUnitDB.ID > 0 || wLineUnit.LineID < 1 || wLineUnit.UnitID < 1 || wLineUnit.LevelID < 1)
                    {
                        wErrorCode.set(MESException.Duplication.Value);
                        wLineUnit.ID = wLineUnitDB.ID;
                    }
                }
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("Insert Into {0}.fmc_lineunit", wInstance)
                            + "(LineID,UnitID,OrderID,LevelID,CreatorID,EditorID,CreateTime,EditTime"
                            + " Active,ParentUnitID,ShiftDays,Code,ProductID,CustomerID) "
                            + " Values(@LineID,@UnitID,@OrderID,@LevelID,@CreatorID,@EditorID,now(), now(),"
                            + "@Active,@ParentUnitID,@ShiftDays,@Code,@ProductID,@CustomerID);";
                    wParms.Clear();

                    wParms.Add("LineID", wLineUnit.LineID);
                    wParms.Add("UnitID", wLineUnit.UnitID);
                    wParms.Add("OrderID", wLineUnit.OrderID);
                    wParms.Add("LevelID", wLineUnit.LevelID);
                    wParms.Add("Code", wLineUnit.Code);
                    wParms.Add("ProductID", wLineUnit.ProductID);
                    wParms.Add("CustomerID", wLineUnit.CustomerID);
                    wParms.Add("CreatorID", wLoginUser.ID);
                    wParms.Add("EditorID", wLoginUser.ID);


                    wParms.Add("Active", wLineUnit.Active);
                    wParms.Add("ParentUnitID", wLineUnit.ParentUnitID);
                    wParms.Add("ShiftDays", wLineUnit.ShiftDays);
                    wParms.Add("QTPeriod", wLineUnit.QTPeriod);
                    wParms.Add("TechPeriod", wLineUnit.TechPeriod);
                    wSQLText = this.DMLChange(wSQLText);
                    wLineUnit.ID = (int)mDBPool.insert(wSQLText, wParms);


                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_AddLineUnit", ex);
            }
        }

        public FMCLineUnit FMC_SyncLineUnit(BMSEmployee wLoginUser, FPCPart wPart, OutResult<Int32> wErrorCode)
        {
            FMCLineUnit wResult = new FMCLineUnit();
            wErrorCode.set(0);

            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                FMCLineUnit wLineUnit = this.FMC_QueryLineUnit(wLoginUser, -1, wPart.LineID, -1, wPart.ID,
                        (int)APSUnitLevel.Part, -1, wErrorCode);

                wLineUnit.LineID = wPart.LineID;
                wLineUnit.Active = wPart.Active;
                wLineUnit.Code = wPart.Code;
                wLineUnit.CreateTime = DateTime.Now;
                wLineUnit.Creator = "";
                wLineUnit.CreatorID = wLoginUser.ID;
                wLineUnit.CustomerID = 0;
                wLineUnit.Editor = "";
                wLineUnit.EditorID = wLoginUser.ID;
                wLineUnit.EditTime = DateTime.Now;
                wLineUnit.LevelID = (int)APSUnitLevel.Part;
                wLineUnit.LevelName = EnumTool.GetEnumDesc(APSUnitLevel.Part);
                wLineUnit.ParentUnitID = wPart.LineID;
                wLineUnit.UnitID = wPart.ID;
                wLineUnit.UnitCode = wPart.Code;
                wLineUnit.Name = wPart.Name;
                wLineUnit.OrderID = 1;
                wLineUnit.ProductID = 0;

                if (wLineUnit.ID <= 0)
                {
                    this.FMC_AddLineUnit(wLoginUser, wLineUnit, wErrorCode);
                }
                else
                {
                    this.FMC_SaveLineUnit(wLoginUser, wLineUnit, wErrorCode);
                }

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_SyncLineUnit", ex);
            }
            return wResult;
        }

        public FMCLineUnit FMC_SyncLineUnit(BMSEmployee wLoginUser, FPCPartPoint wFPCPartPoint,
                OutResult<Int32> wErrorCode)
        {
            FMCLineUnit wResult = new FMCLineUnit();
            wErrorCode.set(0);

            try
            {
                FMCLineUnit wLineUnit = this.FMC_QueryLineUnit(wLoginUser, -1, wFPCPartPoint.LineID, -1,
                        wFPCPartPoint.ID, (int)APSUnitLevel.Step, wFPCPartPoint.PartID, wErrorCode);

                wLineUnit.LineID = wFPCPartPoint.LineID;
                wLineUnit.Active = wFPCPartPoint.Active;
                wLineUnit.Code = wFPCPartPoint.Code;
                wLineUnit.CreateTime = DateTime.Now;
                wLineUnit.Creator = "";
                wLineUnit.CreatorID = wLoginUser.ID;
                wLineUnit.CustomerID = 0;
                wLineUnit.Editor = "";
                wLineUnit.EditorID = wLoginUser.ID;
                wLineUnit.EditTime = DateTime.Now;
                wLineUnit.LevelID = (int)APSUnitLevel.Step;
                wLineUnit.LevelName = EnumTool.GetEnumDesc(APSUnitLevel.Step);
                wLineUnit.Name = wFPCPartPoint.Name;
                wLineUnit.UnitID = wFPCPartPoint.ID;
                wLineUnit.UnitCode = wFPCPartPoint.Code;
                wLineUnit.ParentUnitID = wFPCPartPoint.PartID;
                wLineUnit.OrderID = 1;
                wLineUnit.ProductID = 0;

                if (wLineUnit.ID <= 0)
                {
                    this.FMC_AddLineUnit(wLoginUser, wLineUnit, wErrorCode);
                }
                else
                {
                    this.FMC_SaveLineUnit(wLoginUser, wLineUnit, wErrorCode);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_SyncLineUnit", ex);
            }
            return wResult;
        }

        public void FMC_CopyLineUnit(BMSEmployee wLoginUser, int wOldLineID, int wOldProductID, int wOldCustomerID,
                int wLineID, int wProductID, int wCustomerID, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {

                if (ProductEnable != 1)
                {
                    wOldProductID = 0;
                    wProductID = 0;
                }
                if (CustomerEnable != 1)
                {
                    wOldCustomerID = 0;
                    wCustomerID = 0;
                }
                if (wOldLineID <= 0 || wLineID <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                if (ProductEnable == 1 && (wProductID <= 0 || wOldProductID <= 0))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                if (CustomerEnable == 1 && (wCustomerID <= 0 || wOldCustomerID <= 0))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                if (wOldLineID == wLineID && wOldProductID == wProductID && wOldCustomerID == wCustomerID)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result != 0)
                {
                    return;
                }

                List<FMCLineUnit> wFMCLineUnitList = this.FMC_QueryLineUnitListByLineID(wLoginUser, wOldProductID,
                        wOldProductID, wOldCustomerID, true, wErrorCode);

                if (wFMCLineUnitList == null || wFMCLineUnitList.Count <= 0)
                {
                    return;
                }

                String wValueTemp = "({0},{1},{2},{3},{4},{5},now(),now(),"
                        + "{6},{7},{8},'{9}',{10},{11})";

                List<String> wValueArray = new List<String>();

                foreach (FMCLineUnit wFMCLineUnit in wFMCLineUnitList)
                {

                    if (wFMCLineUnit.ID <= 0 || wFMCLineUnit.Active != 1)
                        continue;

                    wValueArray.Add(StringUtils.Format(wValueTemp, wLineID, wFMCLineUnit.UnitID, wFMCLineUnit.OrderID,
                            wFMCLineUnit.LevelID, wLoginUser.ID, wLoginUser.ID, 0, wFMCLineUnit.ParentUnitID,
                            wFMCLineUnit.ShiftDays, wFMCLineUnit.Code, wProductID, wCustomerID));
                }

                if (wValueArray == null || wValueArray.Count <= 0)
                    return;

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                String wSQLText = StringUtils.Format("Insert Into {0}.fmc_lineunit"
                        + "(LineID,UnitID,OrderID,LevelID,CreatorID,EditorID,CreateTime,EditTime,Active,"
                        + "ParentUnitID,ShiftDays,Code,ProductID,CustomerID) " + " Values {1};", wInstance,
                        StringUtils.Join(",", wValueArray));
                wParms.Clear();

                mDBPool.update(wSQLText, wParms);

            }
            catch (Exception ex)
            {

                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_CopyLineUnit", ex);
            }
        }

        public void FMC_SaveLineUnit(BMSEmployee wLoginUser, FMCLineUnit wLineUnit, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                if (wLineUnit == null || wLineUnit.LineID <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                if (ProductEnable != 1)
                    wLineUnit.ProductID = 0;
                else if (wLineUnit.ProductID <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                if (CustomerEnable != 1)
                    wLineUnit.CustomerID = 0;
                else if (wLineUnit.CustomerID <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result != 0)
                    return;

                FMCLineUnit wLineUnitDB = this.FMC_CheckLineUnit(wLoginUser, wLineUnit, wErrorCode);
                if (wLineUnitDB.ID > 0 || wLineUnit.LineID < 1 || wLineUnit.UnitID < 1 || wLineUnit.OrderID < 1
                        || wLineUnit.LevelID < 1)
                {
                    wErrorCode.set(MESException.Logic.Value);
                    return;
                }

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                wParms.Add("ID", wLineUnit.ID);

                wParms.Add("LineID", wLineUnit.LineID);
                wParms.Add("UnitID", wLineUnit.UnitID);
                wParms.Add("OrderID", wLineUnit.OrderID);
                wParms.Add("LevelID", wLineUnit.LevelID);
                wParms.Add("Code", wLineUnit.Code);
                wParms.Add("ProductID", wLineUnit.ProductID);
                wParms.Add("CustomerID", wLineUnit.CustomerID);
                wParms.Add("EditorID", wLoginUser.ID);
                wParms.Add("EditTime", DateTime.Now);

                wParms.Add("Active", wLineUnit.Active);
                wParms.Add("ParentUnitID", wLineUnit.ParentUnitID);
                wParms.Add("ShiftDays", wLineUnit.ShiftDays);
                wParms.Add("QTPeriod", wLineUnit.QTPeriod);
                wParms.Add("TechPeriod", wLineUnit.TechPeriod);

                this.Update(StringUtils.Format("{0}.fmc_lineunit", wInstance), "ID", wParms);

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_SaveLineUnit", ex);
            }
        }

        public int FMC_DeleteLineUnitByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
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
                    wSQLText = StringUtils.Format("Delete from {0}.fmc_lineunit", wInstance)
                            + " where ID=@ID and Active !=1 ";
                    wParms.Clear();

                    wParms.Add("ID", wID);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_DeleteLineUnitByID", ex);
            }
            return wErrorCode.Result;
        }

        public int FMC_DeleteLineUnitByUnitID(BMSEmployee wLoginUser, int wLineID, int wProductID, int wCustomerID,
                int wUnitID, int wParentUnitID, int wLevelID, OutResult<Int32> wErrorCode)
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
                    wSQLText = StringUtils.Format("Delete from {0}.fmc_lineunit", wInstance)
                            + " where LineID=@LineID AND  UnitID=@UnitID and LevelID=@LevelID"
                            + " and  ProductID=@ProductID and CustomerID=@CustomerID"
                            + " and ParentUnitID=@ParentUnitID and Active !=1 ";
                    wParms.Clear();

                    wParms.Add("LineID", wLineID);
                    wParms.Add("LevelID", wLevelID);
                    wParms.Add("ProductID", wProductID);
                    wParms.Add("CustomerID", wCustomerID);
                    wParms.Add("UnitID", wUnitID);
                    wParms.Add("ParentUnitID", wParentUnitID);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_DeleteLineUnitByUnitID", ex);
            }
            return wErrorCode.Result;
        }

        public int FMC_ActiveLineUnit(BMSEmployee wLoginUser, FMCLineUnit wLineUnit, OutResult<Int32> wErrorCode)
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

                    wSQLText = StringUtils.Format("update {0}.fmc_lineunit", wInstance) + " set Active=1,"
                            + "EditorID=@EditorID,EditTime=@EditTime where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wLineUnit.ID);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("FMC_ActiveLineUnit", ex);
            }
            return wErrorCode.Result;
        }

        public int FMC_DisableLineUnit(BMSEmployee wLoginUser, FMCLineUnit wLineUnit, OutResult<Int32> wErrorCode)
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

                    wSQLText = StringUtils.Format("update {0}.fmc_lineunit", wInstance) + " set Active=2,"
                            + "EditorID=@EditorID,EditTime=@EditTime where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wLineUnit.ID);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("FMC_DisableLineUnit", ex);
            }
            return wErrorCode.Result;
        }

        public List<FMCLineUnit> FMC_QueryLineUnitListByLineID(BMSEmployee wLoginUser, int wProductID,
                int wCustomerID, int wLineID, int wID, Boolean wIsList, OutResult<Int32> wErrorCode)
        {
            List<FMCLineUnit> wLineUnitList = new List<FMCLineUnit>();
            wErrorCode.set(0);

            try
            {
                if (ProductEnable != 1)
                    wProductID = 0;
                if (CustomerEnable != 1)
                    wCustomerID = 0;
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                    String wSQLText = StringUtils
                             .Format("Select t.*,l.Name as LineName,l.Code as LineCode,t5.Name as Creator,t6.Name as Editor,t2.Name as PartName,"
                        + " t2.Code as PartCode,t2.PartType, t3.Name as PartPointName,t3.Code as PartPointCode,"
                        + " t3.StepType, t4.Name as StationName,t4.Code as StationCode from {0}.fmc_lineunit t"
                        + " left join {0}.fmc_line l on t.LineID=l.ID"
                        + " left join {0}.fpc_part t2 on t.UnitID=t2.ID and t.LevelID=2 "
                         + " left join {0}.fpc_partpoint t3 on t.UnitID=t3.ID and t.LevelID=3 "
                          + " left join {0}.fmc_station t4 on t.UnitID=t4.ID and t.LevelID=4 "
                          + " left join {0}.mbs_user t5 on t.CreatorID=t5.ID "
                            + " left join {0}.mbs_user t6 on t.EditorID=t6.ID "
                                    + " where t.ID>0 and (@LineID<=0 or t.LineID=@LineID) "
                                    + " and (@CustomerID<=0 or t.CustomerID=@CustomerID)"
                                    + " and (@ProductID<=0 or t.ProductID=@ProductID)"
                                    + " order by t.LevelID,t.OrderID,t.CreateTime;", wInstance);
                    wParms.Clear();
                    wParms.Add("LineID", wLineID);
                    wParms.Add("CustomerID", wCustomerID);
                    wParms.Add("ProductID", wProductID);

                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        FMCLineUnit wLineUnitDB = new FMCLineUnit();
                        wLineUnitDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wLineUnitDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                        wLineUnitDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
                        wLineUnitDB.CustomerID = StringUtils.parseInt(wSqlDataReader["CustomerID"]);
                        wLineUnitDB.ProductID = StringUtils.parseInt(wSqlDataReader["ProductID"]);
                        wLineUnitDB.UnitID = StringUtils.parseInt(wSqlDataReader["UnitID"]);
                        wLineUnitDB.LevelID = StringUtils.parseInt(wSqlDataReader["LevelID"]);
                        wLineUnitDB.OrderID = StringUtils.parseInt(wSqlDataReader["OrderID"]);
                        wLineUnitDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                        wLineUnitDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wLineUnitDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wLineUnitDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wLineUnitDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wLineUnitDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wLineUnitDB.ParentUnitID = StringUtils.parseInt(wSqlDataReader["ParentUnitID"]);
                        wLineUnitDB.ShiftDays = StringUtils.parseInt(wSqlDataReader["ShiftDays"]);
                        wLineUnitDB.QTPeriod = StringUtils.parseInt(wSqlDataReader["QTPeriod"]);
                        wLineUnitDB.TechPeriod = StringUtils.parseInt(wSqlDataReader["TechPeriod"]);

                        wLineUnitDB.LevelName = EnumTool.GetEnumDesc<APSUnitLevel>(wLineUnitDB.LevelID);
                        wLineUnitDB.Creator = StringUtils.parseString(wSqlDataReader["Creator"]);
                        wLineUnitDB.Editor = StringUtils.parseString(wSqlDataReader["Editor"]);
                        wLineUnitDB.LineName = StringUtils.parseString(wSqlDataReader["LineName"]);

                        switch ((APSUnitLevel)wLineUnitDB.LevelID)
                        {
                            case APSUnitLevel.Line:

                                wLineUnitDB.Name = StringUtils.parseString(wSqlDataReader["LineName"]);
                                wLineUnitDB.UnitCode = StringUtils.parseString(wSqlDataReader["LineCode"]);
                                break;
                            case APSUnitLevel.Part:
                                wLineUnitDB.Name = StringUtils.parseString(wSqlDataReader["PartName"]);
                                wLineUnitDB.UnitCode = StringUtils.parseString(wSqlDataReader["PartCode"]);
                                wLineUnitDB.Type = StringUtils.parseInt(wSqlDataReader["PartType"]);
                                break;
                            case APSUnitLevel.Step:
                                wLineUnitDB.Name = StringUtils.parseString(wSqlDataReader["PartPointName"]);
                                wLineUnitDB.UnitCode = StringUtils.parseString(wSqlDataReader["PartPointCode"]);
                                wLineUnitDB.Type = StringUtils.parseInt(wSqlDataReader["StepType"]);
                                break;
                            case APSUnitLevel.Station:

                                wLineUnitDB.Name = StringUtils.parseString(wSqlDataReader["StationName"]);
                                wLineUnitDB.UnitCode = StringUtils.parseString(wSqlDataReader["StationCode"]);
                                break;
                            default:
                                break;
                        }

                        wLineUnitList.Add(wLineUnitDB);
                    }
                     

                    if (wLineID > 0)
                    {
                        int wUnitID = wLineID;
                        int wLevelID = (int)APSUnitLevel.Part;
                        if (wID > 0)
                        {
                            FMCLineUnit wLineUnitDB = this.FMC_QueryLineUnitByID(wLoginUser, wID, wErrorCode);
                            wUnitID = wLineUnitDB.UnitID;
                            wLevelID = wLineUnitDB.LevelID + 1;
                        }
                        if (!wIsList)
                            wLineUnitList = this.FMC_SortLineUnitList(wLineUnitList, wIsList, wUnitID, wLevelID,
                                    wErrorCode);
                    }
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("FMC_QueryLineUnitListByLineID", ex);
            }
            return wLineUnitList;
        }

        public FMCLineUnit FMC_QueryLineUnit(BMSEmployee wLoginUser, int wProductID, int wLineID, int wCustomerID,
                int wUnitID, int wLevelID, int wParentUnitID, OutResult<Int32> wErrorCode)
        {
            FMCLineUnit wResult = new FMCLineUnit();
            wErrorCode.set(0);

            try
            {
                if (ProductEnable != 1)
                    wProductID = 0;
                if (CustomerEnable != 1)
                    wCustomerID = 0;
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result != 0)
                {
                    return wResult;
                }

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                String wSQLText = StringUtils
                        .Format("Select t.*,l.Name as LineName,l.Code as LineCode,t5.Name as Creator,t6.Name as Editor,t2.Name as PartName,"
                        + " t2.Code as PartCode,t2.PartType, t3.Name as PartPointName,t3.Code as PartPointCode,"
                        + " t3.StepType, t4.Name as StationName,t4.Code as StationCode from {0}.fmc_lineunit t"
                        + " left join {0}.fmc_line l on t.LineID=l.ID"
                        + " left join {0}.fpc_part t2 on t.UnitID=t2.ID and t.LevelID=2 "
                         + " left join {0}.fpc_partpoint t3 on t.UnitID=t3.ID and t.LevelID=3 "
                          + " left join {0}.fmc_station t4 on t.UnitID=t4.ID and t.LevelID=4 "
                          + " left join {0}.mbs_user t5 on t.CreatorID=t5.ID "
                            + " left join {0}.mbs_user t6 on t.EditorID=t6.ID "
                                + " where t.ID>0 and  t.LineID=@LineID and  t.ProductID=@ProductID"
                                + " and (@CustomerID<=0 or t.CustomerID=@CustomerID)"
                                + " and (@ParentUnitID<=0 or t.ParentUnitID=@ParentUnitID)"
                                + " and t.UnitID=@UnitID and t.LevelID=@LevelID;", wInstance);

                wParms.Clear();
                wParms.Add("LineID", wLineID);
                wParms.Add("CustomerID", wCustomerID);
                wParms.Add("ProductID", wProductID);
                wParms.Add("ParentUnitID", wParentUnitID);
                wParms.Add("UnitID", wUnitID);
                wParms.Add("LevelID", wLevelID);

                wSQLText = this.DMLChange(wSQLText);
                List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {

                    wResult.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    wResult.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                    wResult.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
                    wResult.CustomerID = StringUtils.parseInt(wSqlDataReader["CustomerID"]);
                    wResult.ProductID = StringUtils.parseInt(wSqlDataReader["ProductID"]);
                    wResult.UnitID = StringUtils.parseInt(wSqlDataReader["UnitID"]);
                    wResult.LevelID = StringUtils.parseInt(wSqlDataReader["LevelID"]);
                    wResult.OrderID = StringUtils.parseInt(wSqlDataReader["OrderID"]);
                    wResult.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                    wResult.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                    wResult.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                    wResult.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                    wResult.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                    wResult.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                    wResult.ParentUnitID = StringUtils.parseInt(wSqlDataReader["ParentUnitID"]);
                    wResult.ShiftDays = StringUtils.parseInt(wSqlDataReader["ShiftDays"]);
                    wResult.QTPeriod = StringUtils.parseInt(wSqlDataReader["QTPeriod"]);
                    wResult.TechPeriod = StringUtils.parseInt(wSqlDataReader["TechPeriod"]);

                    wResult.LevelName = EnumTool.GetEnumDesc< APSUnitLevel>(wResult.LevelID);
                    wResult.Creator = StringUtils.parseString(wSqlDataReader["Creator"]);
                    wResult.Editor = StringUtils.parseString(wSqlDataReader["Editor"]);
                    wResult.LineName = StringUtils.parseString(wSqlDataReader["LineName"]);

                    switch ((APSUnitLevel)wResult.LevelID)
                    {
                        case APSUnitLevel.Line:
                           
                            wResult.Name = StringUtils.parseString(wSqlDataReader["LineName"]);
                            wResult.UnitCode = StringUtils.parseString(wSqlDataReader["LineCode"]);
                            break;
                        case APSUnitLevel.Part:
                            wResult.Name = StringUtils.parseString(wSqlDataReader["PartName"]);
                            wResult.UnitCode = StringUtils.parseString(wSqlDataReader["PartCode"]);
                            wResult.Type = StringUtils.parseInt(wSqlDataReader["PartType"]);  
                            break;
                        case APSUnitLevel.Step:
                            wResult.Name = StringUtils.parseString(wSqlDataReader["PartPointName"]);
                            wResult.UnitCode = StringUtils.parseString(wSqlDataReader["PartPointCode"]);
                            wResult.Type = StringUtils.parseInt(wSqlDataReader["StepType"]); 
                            break;
                        case APSUnitLevel.Station:

                            wResult.Name = StringUtils.parseString(wSqlDataReader["StationName"]);
                            wResult.UnitCode = StringUtils.parseString(wSqlDataReader["StationCode"]);
                            break;
                        default:
                            break;
                    }

                }

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_QueryLineUnitListByLineID", ex); 
            }
            return wResult;
        }

        private FMCLineUnit FMC_QueryLineUnitByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            FMCLineUnit wLineUnitDB = new FMCLineUnit();
            wErrorCode.set(0);
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                   String wSQLText = StringUtils
                       .Format("Select t.*,l.Name as LineName,l.Code as LineCode,t5.Name as Creator,t6.Name as Editor,t2.Name as PartName,"
                       + " t2.Code as PartCode,t2.PartType, t3.Name as PartPointName,t3.Code as PartPointCode,"
                       + " t3.StepType, t4.Name as StationName,t4.Code as StationCode from {0}.fmc_lineunit t"
                       + " left join {0}.fmc_line l on t.LineID=l.ID"
                       + " left join {0}.fpc_part t2 on t.UnitID=t2.ID and t.LevelID=2 "
                        + " left join {0}.fpc_partpoint t3 on t.UnitID=t3.ID and t.LevelID=3 "
                         + " left join {0}.fmc_station t4 on t.UnitID=t4.ID and t.LevelID=4 "
                         + " left join {0}.mbs_user t5 on t.CreatorID=t5.ID "
                           + " left join {0}.mbs_user t6 on t.EditorID=t6.ID  where ID=@ID ;", wInstance);
                    wParms.Clear();
                    wParms.Add("ID", wID);
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wLineUnitDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wLineUnitDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                        wLineUnitDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
                        wLineUnitDB.CustomerID = StringUtils.parseInt(wSqlDataReader["CustomerID"]);
                        wLineUnitDB.ProductID = StringUtils.parseInt(wSqlDataReader["ProductID"]);
                        wLineUnitDB.UnitID = StringUtils.parseInt(wSqlDataReader["UnitID"]);
                        wLineUnitDB.LevelID = StringUtils.parseInt(wSqlDataReader["LevelID"]);
                        wLineUnitDB.OrderID = StringUtils.parseInt(wSqlDataReader["OrderID"]);
                        wLineUnitDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                        wLineUnitDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wLineUnitDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wLineUnitDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wLineUnitDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wLineUnitDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wLineUnitDB.ParentUnitID = StringUtils.parseInt(wSqlDataReader["ParentUnitID"]);
                        wLineUnitDB.ShiftDays = StringUtils.parseInt(wSqlDataReader["ShiftDays"]);
                        wLineUnitDB.QTPeriod = StringUtils.parseInt(wSqlDataReader["QTPeriod"]);
                        wLineUnitDB.TechPeriod = StringUtils.parseInt(wSqlDataReader["TechPeriod"]);

                        wLineUnitDB.LevelName = EnumTool.GetEnumDesc<APSUnitLevel>(wLineUnitDB.LevelID);
                        wLineUnitDB.Creator = StringUtils.parseString(wSqlDataReader["Creator"]);
                        wLineUnitDB.Editor = StringUtils.parseString(wSqlDataReader["Editor"]);
                        wLineUnitDB.LineName = StringUtils.parseString(wSqlDataReader["LineName"]);

                        switch ((APSUnitLevel)wLineUnitDB.LevelID)
                        {
                            case APSUnitLevel.Line:

                                wLineUnitDB.Name = StringUtils.parseString(wSqlDataReader["LineName"]);
                                wLineUnitDB.UnitCode = StringUtils.parseString(wSqlDataReader["LineCode"]);
                                break;
                            case APSUnitLevel.Part:
                                wLineUnitDB.Name = StringUtils.parseString(wSqlDataReader["PartName"]);
                                wLineUnitDB.UnitCode = StringUtils.parseString(wSqlDataReader["PartCode"]);
                                wLineUnitDB.Type = StringUtils.parseInt(wSqlDataReader["PartType"]);
                                break;
                            case APSUnitLevel.Step:
                                wLineUnitDB.Name = StringUtils.parseString(wSqlDataReader["PartPointName"]);
                                wLineUnitDB.UnitCode = StringUtils.parseString(wSqlDataReader["PartPointCode"]);
                                wLineUnitDB.Type = StringUtils.parseInt(wSqlDataReader["StepType"]);
                                break;
                            case APSUnitLevel.Station:

                                wLineUnitDB.Name = StringUtils.parseString(wSqlDataReader["StationName"]);
                                wLineUnitDB.UnitCode = StringUtils.parseString(wSqlDataReader["StationCode"]);
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("FMC_QueryLineUnitByID", ex); 

            }
            return wLineUnitDB;
        }

        

        public List<FMCLineUnit> FMC_SortLineUnitList(List<FMCLineUnit> wLineUnitList, Boolean wIsList, int wParentUnitID,
                int wLevelID, OutResult<Int32> wErrorCode)
        {
            List<FMCLineUnit> wItemList = new List<FMCLineUnit>();
            try
            {
                foreach (FMCLineUnit wItem in wLineUnitList)
                {
                    if (wItem.ParentUnitID == wParentUnitID && wItem.LevelID == wLevelID)
                    {
                        List<FMCLineUnit> wSonUnitList = this.FMC_SortLineUnitList(wLineUnitList, wIsList, wItem.UnitID,
                                wItem.LevelID + 1, wErrorCode);
                        if (wIsList)
                        {
                            wItemList.Add(wItem);
                            wItemList.AddRange(wSonUnitList);
                        }
                        else
                        {
                            wItem.UnitList.AddRange(wSonUnitList);
                            wItemList.Add(wItem);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error("FMC_SortLineUnitList", ex); 
            }
            return wItemList;
        }

        public List<FMCLineUnit> FMC_QueryLineUnitListByLineID(BMSEmployee wLoginUser, int wLineID, int wProductID, int wCustomerID,
                Boolean wIsList, OutResult<Int32> wErrorCode)
        {
            List<FMCLineUnit> wLineUnitList = new List<FMCLineUnit>();
            wErrorCode.set(0);

            try
            {

                wLineUnitList = this.FMC_QueryLineUnitListByLineID(wLoginUser, wProductID, wCustomerID, wLineID, 0,
                        wIsList, wErrorCode);
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_QueryLineUnitListByLineID", ex);
            }
            return wLineUnitList;
        }

         

    }
}
