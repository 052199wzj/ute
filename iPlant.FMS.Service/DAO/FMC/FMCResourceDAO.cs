using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class FMCResourceDAO : BaseDAO
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FMCResourceDAO));

        private static FMCResourceDAO Instance = null;

        private FMCResourceDAO() : base()
        {

        }

        public static FMCResourceDAO getInstance()
        {
            if (Instance == null)
                Instance = new FMCResourceDAO();
            return Instance;
        }

        // 制造资源
        private FMCResource FMC_CheckResourceByName(BMSEmployee wLoginUser, FMCResource wResource,
                OutResult<Int32> wErrorCode)
        {
            FMCResource wResourceDB = new FMCResource();
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = StringUtils.Format("Select ID from {0}.fmc_resource ", wInstance)
                            + " where ID!=@ID and StationID=@StationID and Type=@Type and ResourceID=@ResourceID;";
                    wParms.Clear();
                    wParms.Add("ID", wResource.ID);
                    wParms.Add("StationID", wResource.StationID);
                    wParms.Add("Type", wResource.Type);
                    wParms.Add("ResourceID", wResource.ResourceID);

                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wResourceDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    }

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_CheckResourceByName", ex);
            }
            return wResourceDB;
        }

        public void FMC_AddResource(BMSEmployee wLoginUser, FMCResource wResource, OutResult<Int32> wErrorCode)
        {

            try
            {
                wErrorCode.set(0);
                if (wResource == null || wResource.StationID <= 0 || wResource.ResourceID <= 0 || wResource.Type <= 0)
                {
                    wErrorCode.set(MESException.Logic.Value);
                    return;
                }

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    FMCResource wResourceDB = this.FMC_CheckResourceByName(wLoginUser, wResource, wErrorCode);
                    if (wResourceDB.ID > 0)
                    {
                        wErrorCode.set(MESException.Duplication.Value);
                        wResource.ID = wResourceDB.ID;
                    }

                }
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("Insert Into {0}.fmc_resource", wInstance)
                            + "(StationID,Type,ResourceID,CreatorID,EditorID,CreateTime,EditTime,Active) "
                            + " Values(@StationID,@Type,@ResourceID,@CreatorID,@EditorID, now(), now(),@Active);";
                    wParms.Clear();

                    wParms.Add("StationID", wResource.StationID);
                    wParms.Add("Type", wResource.Type);
                    wParms.Add("ResourceID", wResource.ResourceID);
                    wParms.Add("CreatorID", wLoginUser.ID);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("Active", wResource.Active);
                    wSQLText = this.DMLChange(wSQLText);
                    wResource.ID = (int)mDBPool.insert(wSQLText, wParms);

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("FMC_AddResource", ex);
            }
        }

        public void FMC_SaveResource(BMSEmployee wLoginUser, FMCResource wResource, OutResult<Int32> wErrorCode)
        {

            try
            {
                wErrorCode.set(0);
                if (wResource == null || wResource.StationID <= 0 || wResource.ResourceID <= 0 || wResource.Type <= 0)
                {
                    wErrorCode.set(MESException.Logic.Value);
                    return;
                }
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    FMCResource wResourceDB = this.FMC_CheckResourceByName(wLoginUser, wResource, wErrorCode);
                    if (wResourceDB.ID > 0)
                        wErrorCode.set(MESException.Logic.Value);
                }
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("update {0}.fmc_resource", wInstance)
                            + " set StationID=@StationID,ResourceID=@ResourceID,Type=@Type, EditorID=@EditorID,"
                            + " EditTime=now(),Active=@Active  where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wResource.ID);

                    wParms.Add("StationID", wResource.StationID);
                    wParms.Add("Type", wResource.Type);
                    wParms.Add("ResourceID", wResource.ResourceID);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("Active", wResource.Active);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_SaveResource", ex);
            }
        }

        public void FMC_DisableResource(BMSEmployee wLoginUser, FMCResource wResource, OutResult<Int32> wErrorCode)
        {

            try
            {
                wErrorCode.set(0);
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("update {0}.fmc_resource", wInstance) + " set EditorID=@EditorID,"
                            + " EditTime=now(),Active=2 where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wResource.ID);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_DisableResource", ex);
            }
        }

        public void FMC_DisableResource(BMSEmployee wLoginUser, int wStationID, OutResult<Int32> wErrorCode)
        {

            try
            {
                wErrorCode.set(0);
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("update {0}.fmc_resource", wInstance) + " set EditorID=@EditorID,"
                            + " EditTime=now(),Active=2 where ID>0 AND StationID=@StationID;";
                    wParms.Clear();

                    wParms.Add("StationID", wStationID);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("FMC_DisableResource", ex);
            }
        }

        public void FMC_ActiveResource(BMSEmployee wLoginUser, FMCResource wResource, OutResult<Int32> wErrorCode)
        {

            try
            {
                wErrorCode.set(0);
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("update {0}.fmc_resource", wInstance) + " set EditorID=@EditorID,"
                            + " EditTime=now(),Active=1 where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wResource.ID);

                    wParms.Add("EditorID", wLoginUser.ID);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("FMC_ActiveResource", ex);
            }
        }


        public void FMC_DeleteResource(BMSEmployee wLoginUser, FMCResource wResource, OutResult<Int32> wErrorCode)
        {

            try
            {
                wErrorCode.set(0);
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("delete from {0}.fmc_resource", wInstance)  
                            + " where  ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wResource.ID);
                     
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("FMC_ActiveResource", ex);
            }
        }


        public void FMC_DeleteResource(BMSEmployee wLoginUser, int wStationID,int wType, OutResult<Int32> wErrorCode)
        {

            try
            {
                wErrorCode.set(0);
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("delete from {0}.fmc_resource ", wInstance)
                            + " where StationID=@StationID and Type=@Type and ID>0 ";
                    wParms.Clear();

                    wParms.Add("StationID", wStationID);
                    wParms.Add("Type", wType);

                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("FMC_ActiveResource", ex);
            }
        }


        public FMCResource FMC_QueryResourceByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            FMCResource wResourceDB = new FMCResource();

            try
            {
                wErrorCode.set(0);
                if (wID > 0)
                {
                    List<FMCResource> wFMCResourceList = this.FMC_QueryResourceList(wLoginUser, wID, -1, -1, -1, -1, -1, -1,
                            -1, wErrorCode);
                    if (wFMCResourceList != null && wFMCResourceList.Count > 0)
                    {
                        wResourceDB = wFMCResourceList[0];
                    }
                    return wResourceDB;
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_QueryResourceByID", ex);

            }
            return wResourceDB;
        }

        public List<FMCResource> FMC_QueryResourceList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID, int wStationID,
                int wAreaID, int wResourceID, int wType, int wActive, OutResult<Int32> wErrorCode)
        {
            List<FMCResource> wResourceList = new List<FMCResource>();

            try
            {

                wResourceList = this.FMC_QueryResourceList(wLoginUser, -1, wWorkShopID, wLineID, wStationID, wAreaID,
                        wResourceID, wType, wActive, wErrorCode);

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_QueryResourceList", ex);

            }
            return wResourceList;
        }

        private List<FMCResource> FMC_QueryResourceList(BMSEmployee wLoginUser, int wID, int wWorkShopID, int wLineID,
                int wStationID, int wAreaID, int wResourceID, int wType, int wActive, OutResult<Int32> wErrorCode)
        {
            List<FMCResource> wResourceList = new List<FMCResource>();

            try
            {
                wErrorCode.set(0);
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {

                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = StringUtils.Format("Select t.*,t1.WorkShopID,t1.LineID,t1.Name as StationName,"
                            + " t1.Code as StationCode,t2.Name as WorkShopName,t3.Name as LineName,t4.Name as DeviceName ,"
                            + " t4.Code as DeviceNo,t5.Name as Creator,t6.Name as Editor"
                            + " from {0}.fmc_resource t inner join {0}.fmc_station t1 on t.StationID=t1.ID "
                            + " left join {0}.fmc_workshop t2 on t1.WorkShopID=t2.ID  "
                            + " left join {0}.fmc_line t3 on t1.LineID=t3.ID "
                            + " left join {0}.dms_device_ledger t4 on t.ResourceID=t4.ID  "
                            + " left join {0}.mbs_user t5 on t.CreatorID=t5.ID "
                            + " left join {0}.mbs_user t6 on t.EditorID=t6.ID "
                            + " where 1=1 and ( @ID<=0 OR t.ID=@ID ) and (@ResourceID <=0 or t.ResourceID=@ResourceID) "
                            + " AND (@StationID <=0  or t.StationID=@StationID)  AND (@Type <=0  or t.Type=@Type)"
                            + " and (@WorkShopID<=0 or t1.WorkShopID=@WorkShopID ) and ( @AreaID<=0 OR t1.AreaID=@AreaID )"
                            + " and (@LineID<=0 or t1.LineID=@LineID ) and (@Active<0 or t.Active=@Active )",

                            wInstance);

                    wParms.Add("ID", wID);
                    wParms.Add("ResourceID", wResourceID);
                    wParms.Add("StationID", wStationID);
                    wParms.Add("Type", wType);
                    wParms.Add("WorkShopID", wWorkShopID);
                    wParms.Add("LineID", wLineID);
                    wParms.Add("Active", wActive);
                    wParms.Add("AreaID", wAreaID);
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        FMCResource wResourceDB = new FMCResource();
                        wResourceDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wResourceDB.Name = "";
                        wResourceDB.Code = "";
                        wResourceDB.StationID = StringUtils.parseInt(wSqlDataReader["StationID"]);

                        wResourceDB.StationName = StringUtils.parseString(wSqlDataReader["StationName"]);
                        wResourceDB.StationCode = StringUtils.parseString(wSqlDataReader["StationCode"]);

                        wResourceDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
                        wResourceDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
                        wResourceDB.LineName = StringUtils.parseString(wSqlDataReader["LineName"]);
                        wResourceDB.WorkShopName = StringUtils.parseString(wSqlDataReader["WorkShopName"]);

                        wResourceDB.ResourceID = StringUtils.parseInt(wSqlDataReader["ResourceID"]);
                        wResourceDB.Type = StringUtils.parseInt(wSqlDataReader["Type"]);
                        wResourceDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wResourceDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wResourceDB.Creator = StringUtils.parseString(wSqlDataReader["Creator"]);
                        wResourceDB.Editor = StringUtils.parseString(wSqlDataReader["Editor"]);

                        wResourceDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wResourceDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wResourceDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wResourceList.Add(wResourceDB);

                        switch ((FMCResourceType)wResourceDB.Type)
                        {
                            case FMCResourceType.Device:
                                wResourceDB.Name = StringUtils.parseString(wSqlDataReader["DeviceName"]);
                                wResourceDB.Code = StringUtils.parseString(wSqlDataReader["DeviceNo"]);
                                break;
                            case FMCResourceType.Spare:

                                break;
                            case FMCResourceType.Measure:

                                break;
                            case FMCResourceType.Parts:

                                break;
                            case FMCResourceType.Default:

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
                logger.Error("FMC_QueryResourceList: Query DB",
                        ex);
            }
            return wResourceList;
        }

    }
}
