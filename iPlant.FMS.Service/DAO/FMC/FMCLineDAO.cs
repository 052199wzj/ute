using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class FMCLineDAO : BaseDAO
    {

        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FMCLineDAO));
        private static FMCLineDAO Instance = null;

        private FMCLineDAO() : base()
        {

        }

        public static FMCLineDAO getInstance()
        {
            if (Instance == null)
                Instance = new FMCLineDAO();
            return Instance;
        }

        // 产线
        // 产线管理
        private FMCLine FMC_CheckLineByName(BMSEmployee wLoginUser, FMCLine wLine, OutResult<Int32> wErrorCode)
        {
            FMCLine wLineDB = new FMCLine();
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = StringUtils.Format("Select * from {0}.fmc_line ", wInstance)
                                + " where ID!=@ID and ( (FactoryID=@FactoryID and BusinessUnitID=@BusinessUnitID" +
                                " and WorkShopID=@WorkShopID and Name=@Name) or Code=@Code)";
                    wParms.Clear();
                    wParms.Add("ID", wLine.ID);
                    wParms.Add("FactoryID", wLine.FactoryID);
                    wParms.Add("BusinessUnitID", wLine.BusinessUnitID);
                    wParms.Add("WorkShopID", wLine.WorkShopID);
                    wParms.Add("Name", wLine.Name);
                    wParms.Add("Code", wLine.Code);

                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wLineDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wLineDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wLineDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);
                        wLineDB.BusinessUnitID = StringUtils.parseInt(wSqlDataReader["BusinessUnitID"]);
                        wLineDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);

                        wLineDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wLineDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wLineDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wLineDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wLineDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                    }

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_CheckLineByName", ex);
            }
            return wLineDB;
        }

        public void FMC_AddLine(BMSEmployee wLoginUser, FMCLine wLine, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {

                if (wLine == null || StringUtils.isEmpty(wLine.Name) || StringUtils.isEmpty(wLine.Code) || wLine.WorkShopID < 1)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result != 0)
                {
                    return;

                }
                FMCLine wLineDB = this.FMC_CheckLineByName(wLoginUser, wLine, wErrorCode);
                if (wLineDB.ID > 0)
                {
                    wErrorCode.set(MESException.Duplication.Value);
                    wLine.ID = wLineDB.ID;
                    return;
                }

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("Insert Into {0}.fmc_line", wInstance)
                            + "(Name,Code,PLMCode,FactoryID,BusinessUnitID,WorkShopID,CreatorID,EditorIDCreateTime,EditTime,Active,ERPID,Mode,ShiftID) "
                            + " Values(@Name,@Code,@PLMCode,@FactoryID,@BusinessUnitID,@WorkShopID,@CreatorID,@EditorID,@CreateTime,@EditTime,@Active,@ERPID,@Mode,@ShiftID);";
                    wParms.Clear();

                    wParms.Add("Name", wLine.Name);
                    wParms.Add("Code", wLine.Code);
                    wParms.Add("PLMCode", wLine.PLMCode);
                    wParms.Add("FactoryID", wLine.FactoryID);
                    wParms.Add("BusinessUnitID", wLine.BusinessUnitID);
                    wParms.Add("WorkShopID", wLine.WorkShopID);
                    wParms.Add("CreatorID", wLoginUser.ID);
                    wParms.Add("EditorID", wLoginUser.ID);

                    wParms.Add("CreateTime", DateTime.Now);
                    wParms.Add("EditTime", DateTime.Now);
                    wParms.Add("ERPID", wLine.ERPID);
                    wParms.Add("Mode", wLine.Mode);
                    wParms.Add("Active", wLine.Active);
                    wParms.Add("ShiftID", wLine.ShiftID);

                    wSQLText = this.DMLChange(wSQLText);

                    wLine.ID = (int)mDBPool.insert(wSQLText, wParms);

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_AddLine", ex);
            }
        }

        public void FMC_SaveLine(BMSEmployee wLoginUser, FMCLine wLine, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                if (wLine == null || StringUtils.isEmpty(wLine.Name) || StringUtils.isEmpty(wLine.Code) || wLine.WorkShopID < 1)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    return;
                }
                FMCLine wLineDB = this.FMC_CheckLineByName(wLoginUser, wLine, wErrorCode);
                if (wLineDB.ID > 0)
                {
                    wErrorCode.set(MESException.Duplication.Value);
                    return;
                }

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("update {0}.fmc_line", wInstance)
                            + " set Name=@Name,Code=@Code,PLMCode=@PLMCode,FactoryID=@FactoryID,BusinessUnitID=@BusinessUnitID,ERPID=@ERPID,"
                            + "WorkShopID=@WorkShopID,EditorID=@EditorID,EditTime=@EditTime,ShiftID=@ShiftID  where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wLine.ID);

                    wParms.Add("Name", wLine.Name);
                    wParms.Add("Code", wLine.Code);
                    wParms.Add("PLMCode", wLine.PLMCode);
                    wParms.Add("ERPID", wLine.ERPID);
                    wParms.Add("FactoryID", wLine.FactoryID);
                    wParms.Add("BusinessUnitID", wLine.BusinessUnitID);
                    wParms.Add("WorkShopID", wLine.WorkShopID);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wParms.Add("ShiftID", wLine.ShiftID);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_SaveLine", ex);
            }

        }

        public int FMC_DisableLine(BMSEmployee wLoginUser, FMCLine wLine, OutResult<Int32> wErrorCode)
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

                    wSQLText = StringUtils.Format("update {0}.fmc_line", wInstance) + " set EditorID=@EditorID,"
                            + " EditTime=@EditTime,Active=2 where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wLine.ID);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_DisableLine", ex);
            }
            return wErrorCode.Result;
        }

        public int FMC_ActiveLine(BMSEmployee wLoginUser, FMCLine wLine, OutResult<Int32> wErrorCode)
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

                    wSQLText = StringUtils.Format("update {0}.fmc_line", wInstance) + " set EditorID=@EditorID,"
                            + " EditTime=@EditTime,Active=1 where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wLine.ID);

                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_ActiveLine", ex);
            }
            return wErrorCode.Result;
        }

        public FMCLine FMC_QueryLineByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            FMCLine wLineDB = new FMCLine();
            wErrorCode.set(0);
            try
            {
                if (wID <= 0)
                    return wLineDB;
                List<FMCLine> wList = this.FMC_QueryLineList(wLoginUser, wID, "", 0, 0, 0, -1, wErrorCode);
                if (wList != null && wList.Count > 0)
                    wLineDB = wList[0];
            }
            catch (Exception ex)
            {
                logger.Error("FMC_QueryLineByID", ex);
                wErrorCode.set(MESException.Exception.Value);
            }
            return wLineDB;
        }

        public FMCLine FMC_QueryLineByCode(BMSEmployee wLoginUser, String wCode, OutResult<Int32> wErrorCode)
        {
            FMCLine wLineDB = new FMCLine();
            wErrorCode.set(0);
            try
            {
                if (StringUtils.isEmpty(wCode))
                    return wLineDB;
                List<FMCLine> wList = this.FMC_QueryLineList(wLoginUser, 0, wCode, 0, 0, 0, -1, wErrorCode);
                if (wList != null && wList.Count > 0)
                    wLineDB = wList[0];
                
            }
            catch (Exception ex)
            {
                logger.Error("FMC_QueryLineByCode", ex);
                wErrorCode.set(MESException.Exception.Value);
            }
            return wLineDB;
        }


        public List<FMCLine> FMC_QueryLineList(BMSEmployee wLoginUser, int wBusinessUnitID, int wFactoryID,
              int wWorkShopID, int wActive, OutResult<Int32> wErrorCode)
        {
            return this.FMC_QueryLineList(wLoginUser, 0, "", wBusinessUnitID, wFactoryID, wWorkShopID, wActive, wErrorCode);
        }

        private List<FMCLine> FMC_QueryLineList(BMSEmployee wLoginUser, int wID, String wCode, int wBusinessUnitID, int wFactoryID,
                int wWorkShopID, int wActive, OutResult<Int32> wErrorCode)
        {
            List<FMCLine> wLineList = new List<FMCLine>();
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {

                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("Select t.*,t1.Name as WorkShop,t1.Code as WorkShopCode," +
                        " t3.Name as Creator,t4.Name as Editor, t2.Name as ShiftName from {0}.fmc_line t " +
                        " left join {0}.fmc_workshop t1 on t.WorkShopID=t1.ID  "
                                + " left join {0}.fmc_shift t2 on t.ShiftID=t2.ID "
                                   + " left join {0}.mbs_user t3 on t.CreatorID=t3.ID "
                                      + " left join {0}.mbs_user t4 on t.EditorID=t4.ID "
                               + " where (@ID<=0 OR t.ID=@ID) and  (@Code = '' OR t.Code=@Code)" +
                               " and (@WorkShopID<=0 OR t.WorkShopID=@WorkShopID)"
                               + " and (@FactoryID<=0 OR t1.FactoryID=@FactoryID)" +
                               "  and (@BusinessUnitID<=0 OR t1.BusinessUnitID=@BusinessUnitID)" +
                               "  and(@Active < 0 OR t.Active = @Active) ;", wInstance);


                    wParms.Clear();
                    wParms.Add("FactoryID", wFactoryID);
                    wParms.Add("BusinessUnitID", wBusinessUnitID);
                    wParms.Add("ID", wID);
                    wParms.Add("Code", wCode);
                    wParms.Add("Active", wActive);
                    wParms.Add("WorkShopID", wWorkShopID);
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        FMCLine wLineDB = new FMCLine();
                        wLineDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wLineDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wLineDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                        wLineDB.PLMCode = StringUtils.parseString(wSqlDataReader["PLMCode"]);
                        wLineDB.FactoryID = StringUtils.parseInt(wSqlDataReader["FactoryID"]);
                        wLineDB.BusinessUnitID = StringUtils.parseInt(wSqlDataReader["BusinessUnitID"]);
                        wLineDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
                        wLineDB.WorkShop = StringUtils.parseString(wSqlDataReader["WorkShop"]);
                        wLineDB.WorkShopCode = StringUtils.parseString(wSqlDataReader["WorkShopCode"]);
                        wLineDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wLineDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wLineDB.Creator = StringUtils.parseString(wSqlDataReader["Creator"]);
                        wLineDB.Editor = StringUtils.parseString(wSqlDataReader["Editor"]);
                        wLineDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wLineDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wLineDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wLineDB.ERPID = StringUtils.parseInt(wSqlDataReader["ERPID"]);
                        wLineDB.Mode = StringUtils.parseInt(wSqlDataReader["Mode"]);
                        wLineDB.ShiftID = StringUtils.parseInt(wSqlDataReader["ShiftID"]);
                        wLineDB.ShiftName = StringUtils.parseString(wSqlDataReader["ShiftName"]);
                        wLineList.Add(wLineDB);
                    }

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_QueryLineList: Query DB",
                        ex);
            }
            return wLineList;
        }


    }
}
