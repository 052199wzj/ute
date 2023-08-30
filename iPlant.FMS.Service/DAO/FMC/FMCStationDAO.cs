using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class FMCStationDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FMCStationDAO));

        private static FMCStationDAO Instance = null;

        private FMCStationDAO() : base()
        {
        }

        public static FMCStationDAO getInstance()
        {
            if (Instance == null)
                Instance = new FMCStationDAO();
            return Instance;
        }

        private FMCStation FMC_CheckStation(BMSEmployee wLoginUser, FMCStation wStation,
              OutResult<Int32> wErrorCode)
        {
            FMCStation wStationDB = new FMCStation();
            wErrorCode.set(0);
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = StringUtils.Format("Select ID from {0}.fmc_station ", wInstance)
                            + " where ID!=@ID and ( (LineID=@LineID and WorkShopID=@WorkShopID"
                            + " and AreaID=@AreaID and Name =@Name ) or Code=@Code)";
                    wParms.Clear();
                    wParms.Add("ID", wStation.ID);
                    wParms.Add("AreaID", wStation.AreaID);
                    wParms.Add("Code", wStation.Code);
                    wParms.Add("LineID", wStation.LineID);
                    wParms.Add("Name", wStation.Name);
                    wParms.Add("WorkShopID", wStation.WorkShopID);

                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wStationDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    }

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_CheckLineByName", ex);
            }
            return wStationDB;
        }

        public void FMC_AddStation(BMSEmployee wLoginUser, FMCStation wStation, OutResult<Int32> wErrorCode)
        {

            try
            {
                wErrorCode.set(0);
                if (wStation == null || StringUtils.isEmpty(wStation.Code) || StringUtils.isEmpty(wStation.Name) || StringUtils.isEmpty(wStation.WorkName))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();



                FMCStation wStationDB = this.FMC_CheckStation(wLoginUser, wStation, wErrorCode);
                if (wStationDB.ID > 0)
                {
                    wErrorCode.set(MESException.Duplication.Value);
                    wStation.ID = wStationDB.ID;
                    return;
                }


                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                String wSQLText = "";

                wSQLText = StringUtils.Format("Insert Into {0}.fmc_station", wInstance)
                        + "(Name,Code,WorkShopID,LineID,AreaID,CreatorID,EditorID,"
                        + " CreateTime,EditTime,Active,IPTModuleID,CERT,ENVIR,TestMethod,IsCalcPD,Remark,WorkName) "
                        + " Values(@Name,@Code,@WorkShopID,@LineID,@AreaID,@CreatorID,@EditorID,"
                        + " now(),now(), @Active,@IPTModuleID,@CERT,@ENVIR,@TestMethod,@IsCalcPD,@Remark,@WorkName);";
                wParms.Clear();

                wParms.Add("Name", wStation.Name);
                wParms.Add("Code", wStation.Code);
                wParms.Add("WorkShopID", wStation.WorkShopID);
                wParms.Add("LineID", wStation.LineID);
                wParms.Add("AreaID", wStation.AreaID);
                wParms.Add("CreatorID", wLoginUser.ID);
                wParms.Add("EditorID", wLoginUser.ID);
                wParms.Add("CreateTime", DateTime.Now);
                wParms.Add("EditTime", DateTime.Now);
                wParms.Add("Remark", wStation.Remark);
                wParms.Add("WorkName", wStation.WorkName);
                wParms.Add("CERT", StringUtils.Join(";", wStation.CERT));
                wParms.Add("ENVIR", StringUtils.Join(";", wStation.ENVIR));
                wParms.Add("TestMethod", StringUtils.Join(";", wStation.TestMethod));

                wParms.Add("Active", wStation.Active);
                wParms.Add("IsCalcPD", wStation.IsCalcPD);
                wParms.Add("IPTModuleID", wStation.IPTModuleID);
                wSQLText = this.DMLChange(wSQLText);
                wStation.ID = (int)mDBPool.insert(wSQLText, wParms);
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_AddStation", ex);
            }

        }

        public void FMC_SaveStation(BMSEmployee wLoginUser, FMCStation wStation, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {
                if (wStation == null || StringUtils.isEmpty(wStation.Code) || StringUtils.isEmpty(wStation.Name) || StringUtils.isEmpty(wStation.WorkName))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }


                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    FMCStation wStationDB = this.FMC_CheckStation(wLoginUser, wStation, wErrorCode);
                    if (wStationDB.ID > 0 || wStation.Name.Length < 1 || wStation.Code.Length < 1)
                        wErrorCode.set(MESException.Logic.Value);
                }
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("update {0}.fmc_station", wInstance)
                            + " set Name=@Name,Code=@Code,WorkShopID=@WorkShopID,LineID=@LineID,"
                            + " AreaID=@AreaID,CERT=@CERT,ENVIR=@ENVIR,TestMethod=@TestMethod,IsCalcPD=@IsCalcPD,"
                            + " EditorID=@EditorID,EditTime=now(),Active=@Active,IPTModuleID=@IPTModuleID,Remark=@Remark,WorkName=@WorkName where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wStation.ID);
                    wParms.Add("Name", wStation.Name);
                    wParms.Add("Code", wStation.Code);
                    wParms.Add("Active", wStation.Active);
                    wParms.Add("WorkShopID", wStation.WorkShopID);
                    wParms.Add("AreaID", wStation.AreaID);
                    wParms.Add("LineID", wStation.LineID);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wParms.Add("Remark", wStation.Remark);
                    wParms.Add("WorkName", wStation.WorkName);
                    wParms.Add("IsCalcPD", wStation.IsCalcPD);
                    wParms.Add("IPTModuleID", wStation.IPTModuleID);
                    wParms.Add("CERT", StringUtils.Join(";", wStation.CERT));
                    wParms.Add("ENVIR", StringUtils.Join(";", wStation.ENVIR));
                    wParms.Add("TestMethod", StringUtils.Join(";", wStation.TestMethod));
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);


                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_SaveStation", ex);
            }

        }

        public void FMC_DisableStation(BMSEmployee wLoginUser, FMCStation wStation, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("update {0}.fmc_station", wInstance) + " set EditorID=@EditorID,"
                            + " EditTime=now(),Active=2 where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wStation.ID);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_DisableStation", ex);
            }

        }

        public void FMC_ActiveStation(BMSEmployee wLoginUser, FMCStation wStation, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("update {0}.fmc_station", wInstance) + " set EditorID=@EditorID,"
                            + " EditTime=now(),Active=1 where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wStation.ID);

                    wParms.Add("EditorID", wLoginUser.ID);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_ActiveStation", ex);
            }

        }



        public void FMC_DeleteStation(BMSEmployee wLoginUser, FMCStation wStation, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("delete from {0}.fmc_station", wInstance)
                            + " where ID=@ID and Active=0 ";
                    wParms.Clear();

                    wParms.Add("ID", wStation.ID);

                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_ActiveStation", ex);
            }

        }

        public FMCStation FMC_QueryStation(BMSEmployee wLoginUser, int wID, String wCode, OutResult<Int32> wErrorCode)
        {
            FMCStation wStationDB = new FMCStation();
            try
            {
                wErrorCode.set(0);
                if (wID > 0)
                {
                    List<FMCStation> wFMCStationList = this.FMC_QueryStationList(wLoginUser, wID, "", "", -1, -1, -1, -1, Pagination.Default,
                            wErrorCode);
                    if (wFMCStationList != null && wFMCStationList.Count > 0)
                    {
                        wStationDB = wFMCStationList[0];
                    }
                    return wStationDB;
                }
                if (StringUtils.isNotEmpty(wCode))
                {
                    List<FMCStation> wFMCStationList = this.FMC_QueryStationList(wLoginUser, -1, wCode, "", -1, -1, -1, -1, Pagination.Default,
                            wErrorCode);
                    if (wFMCStationList != null && wFMCStationList.Count > 0)
                    {
                        wStationDB = wFMCStationList[0];
                    }
                    return wStationDB;
                }

            }
            catch (Exception ex)
            {
                logger.Error("FMC_QueryStation", ex);
                wErrorCode.set(MESException.Exception.Value);
            }
            return wStationDB;
        }

        public List<FMCStation> FMC_QueryStationList(BMSEmployee wLoginUser, String wName, int wWorkShopID, int wLineID,
                int wAreaID, int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<FMCStation> wStationList = new List<FMCStation>();
            wErrorCode.set(0);

            try
            {
                wStationList = this.FMC_QueryStationList(wLoginUser, -1, "", wName, wWorkShopID, wLineID, wAreaID, wActive, wPagination,
                        wErrorCode);

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_QueryStationList: Query DB",
                        ex);
            }
            return wStationList;
        }

        private List<FMCStation> FMC_QueryStationList(BMSEmployee wLoginUser, int wID, String wCode, String wName,
                int wWorkShopID, int wLineID, int wAreaID, int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<FMCStation> wStationList = new List<FMCStation>();
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = StringUtils.Format("Select t.*,t1.Name as AreaName,t1.Code as AreaCode,"
                            + " t2.Name as WorkShop ,t3.Name as Line,t4.Name as Factory,t5.Name as BusinessUnit,"
                            + " t6.Name as Creator,t7.Name as Editor  from {0}.fmc_station t "
                            + " left join {0}.bms_region t1 on t.AreaID=t1.ID "
                            + " left join {0}.fmc_workshop t2 on t.WorkShopID=t2.ID  "
                            + " left join {0}.fmc_line t3 on t.LineID=t3.ID "
                            + " left join {0}.fmc_factory t4 on t2.FactoryID=t4.ID  "
                            + " left join {0}.fmc_businessunit t5 on t2.BusinessUnitID=t5.ID  "
                            + " left join {0}.mbs_user t6 on t.CreatorID=t6.ID "
                            + " left join {0}.mbs_user t7 on t.EditorID=t7.ID "
                            + " where 1=1  and ( @ID<=0 OR t.ID=@ID )"
                            + " AND (@Code='' or t.Code=@Code)  AND (@Name='' or t.Name=@Name)"
                            + " and (@WorkShopID<=0 or t.WorkShopID=@WorkShopID ) and ( @AreaID<=0 OR t.AreaID=@AreaID )"
                            + " and (@LineID<=0 or t.LineID=@LineID ) and (@Active<0 or t.Active=@Active ) ",
                            wInstance);

                    wParms.Add("ID", wID);
                    wParms.Add("Code", wCode);
                    wParms.Add("Name", wName);
                    wParms.Add("WorkShopID", wWorkShopID);
                    wParms.Add("LineID", wLineID);
                    wParms.Add("Active", wActive);
                    wParms.Add("AreaID", wAreaID);
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms, wPagination);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        FMCStation wStationDB = new FMCStation();
                        wStationDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wStationDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wStationDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                        wStationDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
                        wStationDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
                        wStationDB.IsCalcPD = StringUtils.parseInt(wSqlDataReader["IsCalcPD"]);
                        wStationDB.Line = StringUtils.parseString(wSqlDataReader["Line"]);
                        wStationDB.WorkShop = StringUtils.parseString(wSqlDataReader["WorkShop"]);
                        wStationDB.AreaID = StringUtils.parseInt(wSqlDataReader["AreaID"]);
                        wStationDB.CERT = StringUtils.splitList(StringUtils.parseString(wSqlDataReader["CERT"]), ";");
                        wStationDB.ENVIR = StringUtils.splitList(StringUtils.parseString(wSqlDataReader["ENVIR"]), ";");
                        wStationDB.TestMethod = StringUtils
                                .splitList(StringUtils.parseString(wSqlDataReader["TestMethod"]), ";");
                        wStationDB.Factory = StringUtils.parseString(wSqlDataReader["Factory"]);
                        wStationDB.BusinessUnit = StringUtils.parseString(wSqlDataReader["BusinessUnit"]);
                        wStationDB.AreaName = StringUtils.parseString(wSqlDataReader["AreaName"]);
                        wStationDB.AreaCode = StringUtils.parseString(wSqlDataReader["AreaCode"]);
                        wStationDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wStationDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wStationDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wStationDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wStationDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wStationDB.IPTModuleID = StringUtils.parseInt(wSqlDataReader["IPTModuleID"]);

                        wStationDB.Remark = StringUtils.parseString(wSqlDataReader["Remark"]);
                        wStationDB.WorkName = StringUtils.parseString(wSqlDataReader["WorkName"]);
                        wStationDB.Creator = StringUtils.parseString(wSqlDataReader["Creator"]);
                        wStationDB.Editor = StringUtils.parseString(wSqlDataReader["Editor"]);
                        wStationList.Add(wStationDB);
                    }

                }

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_QueryStationList: Query DB",
                        ex);
            }
            return wStationList;
        }

        public Boolean FMC_IsLineContainStation(BMSEmployee wLoginUser, int wLineID, int wPartID, int wStepID,
                int wStationID, OutResult<Int32> wErrorCode)
        {
            Boolean wIsContain = false;
            try
            {

                List<FMCLineUnit> wFMCLineUnitList = FMCLineUnitDAO.getInstance()
                        .FMC_QueryLineUnitListByLineID(wLoginUser, wLineID, 0, 0, false, wErrorCode);

                foreach (FMCLineUnit wPartUnit in wFMCLineUnitList)
                {
                    if (wPartID > 0 && wPartUnit.UnitID != wPartID)
                        continue;

                    foreach (FMCLineUnit wStepUnit in wPartUnit.UnitList)
                    {
                        if (wStepID > 0 && wStepUnit.UnitID != wStepID)
                            continue;

                        foreach (FMCLineUnit wStationUnit in wStepUnit.UnitList)
                        {
                            if (wStationUnit.UnitID == wStationID)
                            {
                                wIsContain = true;
                                break;
                            }
                        }
                        if (wIsContain)
                            break;
                    }
                    if (wIsContain)
                        break;
                }

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.Exception.Value);
                logger.Error("FMC_IsLineContainStation ", ex);
            }
            return wIsContain;
        }


    }
}
