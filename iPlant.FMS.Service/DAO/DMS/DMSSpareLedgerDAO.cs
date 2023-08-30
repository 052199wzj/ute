using iPlant.Common.Tools;
using iPlant.Data.EF.Repository;
using iPlant.FMS.Models;
using iPlant.Data.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class DMSSpareLedgerDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSSpareLedgerDAO));

        private static DMSSpareLedgerDAO Instance = null;

        private DMSSpareLedgerDAO() : base()
        {
        }

        public static DMSSpareLedgerDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSSpareLedgerDAO();
            return Instance;
        }

        // 标准工步
        private DMSSpareLedger DMS_CheckSpareLedgerByCode(BMSEmployee wLoginUser, DMSSpareLedger wSpareLedger,
                OutResult<Int32> wErrorCode)
        {
            DMSSpareLedger wSpareLedgerDB = new DMSSpareLedger();
            wErrorCode.set(0);

            try
            {
                String wInstance = MESDBSource.Basic.getDBName();


                if (wErrorCode.Result == 0)
                {
                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = StringUtils.Format("Select * from {0}.dms_spareledger ", wInstance)
                            + " where ID!=@ID and  ((Name=@Name and WorkShopID=@WorkShopID"
                            + " and LineID=@LineID and ModelName=@ModelName and SupplierName=@SupplierName ) or Code=@Code )  ";
                    wParms.Clear();
                    wParms.Add("ID", wSpareLedger.ID);
                    wParms.Add("Code", wSpareLedger.Code);
                    wParms.Add("Name", wSpareLedger.Name);
                    wParms.Add("WorkShopID", wSpareLedger.WorkShopID);
                    wParms.Add("LineID", wSpareLedger.LineID);
                    wParms.Add("ModelName", wSpareLedger.ModelName);
                    wParms.Add("SupplierName", wSpareLedger.SupplierName);

                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wSpareLedgerDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wSpareLedgerDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wSpareLedgerDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                        wSpareLedgerDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]); 
                        wSpareLedgerDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
                        wSpareLedgerDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wSpareLedgerDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wSpareLedgerDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wSpareLedgerDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wSpareLedgerDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                    }

                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wSpareLedgerDB;
        }

        public void DMS_UpdateSpareLedger(BMSEmployee wLoginUser, DMSSpareLedger wSpareLedger, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {

                if (wSpareLedger == null || StringUtils.isEmpty(wSpareLedger.Code) || StringUtils.isEmpty(wSpareLedger.Name))
                {
                    wErrorCode.Result = MESException.Parameter.getValue();
                    return;
                }

                String wInstance = MESDBSource.Basic.getDBName();



                DMSSpareLedger wSpareLedgerDB = this.DMS_CheckSpareLedgerByCode(wLoginUser, wSpareLedger, wErrorCode);
                if (wSpareLedgerDB.ID > 0)
                {
                    wErrorCode.set(MESException.Duplication.getValue());
                    wSpareLedger.ID = wSpareLedgerDB.ID;
                    return;
                }

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                wParms.Add("Name", wSpareLedger.Name);
                wParms.Add("Code", wSpareLedger.Code);

                wParms.Add("WorkShopID", wSpareLedger.WorkShopID);
                wParms.Add("LineID", wSpareLedger.LineID);
                wParms.Add("ModelName", wSpareLedger.ModelName);
                wParms.Add("ManufactorName", wSpareLedger.ManufactorName);
                wParms.Add("SupplierName", wSpareLedger.SupplierName);
                wParms.Add("Description", wSpareLedger.Description);
                wParms.Add("Period", wSpareLedger.Period);


                wParms.Add("EditorID", wLoginUser.ID);
                wParms.Add("EditTime", DateTime.Now);

                if (wSpareLedger.ID <= 0)
                {
                    wParms.Add("CreatorID", wLoginUser.ID);
                    wParms.Add("CreateTime", DateTime.Now);
                    wSpareLedger.ID = this.Insert(StringUtils.Format("{0}.dms_spareledger", wInstance), wParms);

                }
                else
                {
                    wParms.Add("ID", wSpareLedger.ID);
                    this.Update(StringUtils.Format("{0}.dms_spareledger", wInstance), "ID", wParms);
                }

                //FMCLineUnitDAO.getInstance().FMC_SyncLineUnit(wLoginUser, wSpareLedger, wErrorCode);


            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }


        public void DMS_ActiveSpareLedger(BMSEmployee wLoginUser, List<int> wSpareLedgerIDList, int wActive,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                if (wSpareLedgerIDList == null || wSpareLedgerIDList.Count <= 0)
                    return;


                if (wActive != 1)
                    wActive = 2;

                String wInstance = MESDBSource.Basic.getDBName();
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                String wSQLText = "";

                wSQLText = StringUtils.Format("update {0}.dms_spareledger set EditorID=@EditorID,EditTime=now(),Active=@Active" +
                    " where ID IN ({1}) ", wInstance, StringUtils.Join(",", wSpareLedgerIDList));
                wParms.Clear();

                wParms.Add("Active", wActive);
                wParms.Add("EditorID", wLoginUser.ID);
                wSQLText = this.DMLChange(wSQLText);

                //FMCLineUnitDAO.getInstance().FMC_SyncLineUnit(wLoginUser, wSpareLedger, wErrorCode);

                mDBPool.update(wSQLText, wParms);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public void DMS_DeleteSpareLedger(BMSEmployee wLoginUser, DMSSpareLedger wSpareLedger,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                if (wSpareLedger == null || wSpareLedger.ID <= 0 || StringUtils.isEmpty(wSpareLedger.Code) || StringUtils.isEmpty(wSpareLedger.Name))
                {
                    wErrorCode.Result = MESException.Parameter.getValue();
                    return;
                }
                String wInstance = MESDBSource.Basic.getDBName();

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                wParms.Add("ID", wSpareLedger.ID);
                wParms.Add("Active", 0);
                this.Delete(StringUtils.Format("{0}.dms_spareledger", wInstance), wParms);
                 
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }


        public DMSSpareLedger DMS_GetSpareLedger(BMSEmployee wLoginUser, int wID, String wCode,
                OutResult<Int32> wErrorCode)
        {
            DMSSpareLedger wSpareLedgerDB = new DMSSpareLedger();
            wErrorCode.set(0);

            try
            {

                if (wCode == null)
                    wCode = "";
                if (StringUtils.isEmpty(wCode) && wID <= 0)
                {
                    wErrorCode.set(MESException.Parameter.getValue());
                    return wSpareLedgerDB;
                }

                List<DMSSpareLedger> wSpareLedgerList = this.DMS_QuerySpareLedgerList(wLoginUser, wID, wCode, -1, -1, "", "",
                        "", -1, Pagination.Default, wErrorCode);
                if (wSpareLedgerList == null || wSpareLedgerList.Count <= 0)
                    return wSpareLedgerDB;

                wSpareLedgerDB = wSpareLedgerList[0];
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wSpareLedgerDB;
        }

        public List<DMSSpareLedger> DMS_GetSpareLedgerList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID, String wModelNameLike,
            String wManufactorNameLike, String wSupplierNameLike, int wActive, Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<DMSSpareLedger> wSpareLedgerList = new List<DMSSpareLedger>();
            wErrorCode.set(0);

            try
            {
                wSpareLedgerList = this.DMS_QuerySpareLedgerList(wLoginUser, 0, "", wWorkShopID, wLineID, wModelNameLike, wManufactorNameLike, wSupplierNameLike, wActive, wPagination, wErrorCode);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wSpareLedgerList;
        }

        private List<DMSSpareLedger> DMS_QuerySpareLedgerList(BMSEmployee wLoginUser, int wID, String wCode, int wWorkShopID, int wLineID,String wModelNameLike,
            String wManufactorNameLike, String wSupplierNameLike , int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<DMSSpareLedger> wSpareLedgerList = new List<DMSSpareLedger>();
            wErrorCode.set(0);

            try
            {
                String wInstance = MESDBSource.Basic.getDBName();

                if (wCode == null)
                    wCode = "";


                // Step0:查询
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                String wSQLText = "";
                wSQLText = StringUtils.Format(
                        "Select t.*,t1.Name as WorkShopName,t2.Name as LineName,sum(case when t3.RecordType in (2,4) then -1*t3.RecordNum else t3.RecordNum END) as StockNum," +
                            " t4.Name as CreatorName,t5.Name as EditorName  from {0}.dms_spareledger t "
                                + " Left join  {0}.fmc_workshop t1  on t.WorkShopID=t1.ID  "
                                + " Left join  {0}.fmc_line t2  on t.LineID=t2.ID  "
                                + " Left join  {0}.dms_sparerecord t3  on t.ID=t3.SpareID  "
                                + " Left join  {0}.mbs_user t4  on t.CreatorID=t4.ID  "
                                + " Left join  {0}.mbs_user t5  on t.EditorID=t5.ID  "
                                + " where t.ID > 0  AND ( @ID <=0 OR t.ID = @ID )"
                                + " and ( @WorkShopID <=0 OR t.WorkShopID = @WorkShopID )"
                                + " and ( @LineID <=0 OR t.LineID = @LineID )"
                                + " AND ( @ModelNameLike='' OR t.ModelName LIKE @ModelNameLike) "
                                + " AND ( @ManufactorNameLike='' OR t.ManufactorName LIKE @ManufactorNameLike) "
                                + " AND ( @SupplierNameLike='' OR t.SupplierName LIKE @SupplierNameLike) " 
                                + " and ( @Active <0 OR t.Active = @Active )"
                                + " AND ( @Code='' OR t.Code=@Code) group by t.ID",
                         wInstance);
                wParms.Clear(); 

                wParms.Add("ID", wID);
                wParms.Add("Code", wCode);
                wParms.Add("WorkShopID", wWorkShopID);
                wParms.Add("LineID", wLineID);
                wParms.Add("ModelNameLike", StringUtils.isEmpty(wModelNameLike) ? "" : "%" + wModelNameLike + "%" );
                wParms.Add("ManufactorNameLike", StringUtils.isEmpty(wManufactorNameLike) ? "" : "%" + wManufactorNameLike + "%" );
                wParms.Add("SupplierNameLike", StringUtils.isEmpty(wSupplierNameLike) ? "" : "%" + wSupplierNameLike + "%");
                wParms.Add("Active", wActive);
                wSQLText = this.DMLChange(wSQLText);

                List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms, wPagination);

                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {
                    DMSSpareLedger wSpareLedgerDB = new DMSSpareLedger();
                    wSpareLedgerDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    wSpareLedgerDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                    wSpareLedgerDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);

                    wSpareLedgerDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
                    wSpareLedgerDB.WorkShopName = StringUtils.parseString(wSqlDataReader["WorkShopName"]);
                    wSpareLedgerDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
                    wSpareLedgerDB.LineName = StringUtils.parseString(wSqlDataReader["LineName"]); 
                    wSpareLedgerDB.ModelName = StringUtils.parseString(wSqlDataReader["ModelName"]);

                    wSpareLedgerDB.ManufactorName = StringUtils.parseString(wSqlDataReader["ManufactorName"]);
                    wSpareLedgerDB.SupplierName = StringUtils.parseString(wSqlDataReader["SupplierName"]);

                    wSpareLedgerDB.Period = StringUtils.parseString(wSqlDataReader["Period"]);
                    wSpareLedgerDB.Description = StringUtils.parseString(wSqlDataReader["Description"]);

                     
                    wSpareLedgerDB.StockNum = StringUtils.parseDouble(wSqlDataReader["StockNum"]);

                    wSpareLedgerDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                    wSpareLedgerDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                    wSpareLedgerDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                    wSpareLedgerDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                    wSpareLedgerDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);

                    wSpareLedgerList.Add(wSpareLedgerDB);
                }


            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wSpareLedgerList;
        }



        public Dictionary<String, List<String>> DMS_GetSpareModelAll(BMSEmployee wLoginUser, OutResult<Int32> wErrorCode) {

            Dictionary<String, List<String>> wResult = new Dictionary<String, List<String>>();
            wErrorCode.set(0);

            try
            {
                String wInstance = MESDBSource.Basic.getDBName();
                 
                // Step0:查询
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                String wSQLText = "";
                wSQLText = StringUtils.Format(
                        "Select DISTINCT t.SupplierName, t.ModelName   from {0}.dms_spareledger t " ,
                         wInstance);
                wParms.Clear();
                wSQLText = this.DMLChange(wSQLText);
                 

                List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);

                String wModelName = "";
                String wSupplierName = "";

                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {

                    wSupplierName = StringUtils.parseString(wSqlDataReader["SupplierName"]);
                    wModelName = StringUtils.parseString(wSqlDataReader["ModelName"]);

                    if (!wResult.ContainsKey(wSupplierName)) {
                        wResult.Add(wSupplierName, new List<string>());
                    }

                    wResult[wSupplierName].Add(wModelName); 
                }
                 
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;

        }

    }
}
