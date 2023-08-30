using iPlant.Common.Tools;
using iPlant.Data.EF.Repository;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    /// <summary>
    /// 设备工艺说明数据库操作
    /// </summary>
    class DMSFixturesDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSFixturesDAO));


        public Repository _Repository = null;

        private static DMSFixturesDAO Instance;

        private DMSFixturesDAO() : base()
        {

        }

        public static DMSFixturesDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSFixturesDAO();


            Instance._Repository = Instance.BaseRepository();

            Instance.SetInstance(typeof(DMSFixtures).FullName, Instance);
            return Instance;
        }

        // (public\s+[a-zA-z0-9_\<\>]+\s+[a-zA-z0-9_\<\>]+\()([^\)]*)\)

        private DMSFixtures DMS_CheckFixtures(BMSEmployee wLoginUser, DMSFixtures wDMSFixtures
                 , OutResult<Int32> wErrorCode)
        {
            DMSFixtures wResult = new DMSFixtures();
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();


                String wSQL = StringUtils.Format("SELECT t.* FROM {0}.dms_fixtures t  " +
                    "  WHERE    @wID != t.ID  and  (t.DeviceID  = @wDeviceID  and   t.ProductID=@wProductID   ) ;", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wDMSFixtures.ID);
                wParamMap.Add("wDeviceID", wDMSFixtures.DeviceID);
                wParamMap.Add("wProductID", wDMSFixtures.ProductID);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wResult.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSFixtures> DMS_SelectFixturesList(BMSEmployee wLoginUser, int wLineID,
            int wDeviceID,List< int> wProductID, String wAssetNo, String wProductNo, String wProductNoLike, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<DMSFixtures> wResult = new List<DMSFixtures>();
            try
            {
                if (wProductID == null)
                    wProductID = new List<int>();

                wProductID.RemoveAll(p => p <= 0);

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.*,t1.Name as DeviceName,t1.Code as DeviceNo," +
                    " t1.AssetNo ,t1.NCEnable,t1.ToolEnable, t1.FixturesEnable,t2.Name as  LineName," +
                    " t3.Name as CreatorName,t4.Name as EditorName," +
                    " t5.ProductNo,t5.ProductName,t5.DrawingNo,t5.DrawingNoFile, " +
                    " t6.ProgramName as NCCode, t6.Description as  NCDescription  " +
                    " FROM {0}.dms_fixtures t left join {0}.dms_device_ledger t1  on t.DeviceID=t1.ID" +
                    " left join {0}.fpc_product t5  on t.ProductID=t5.ID  " +
                    " left join {0}.mbs_user t3 on t.CreatorID=t3.ID " +
                    " left join {0}.mbs_user t4 on t.EditorID=t4.ID" +
                    " left join {0}.fmc_line t2 on t1.LineID=t2.ID " + 
                    " left join {0}.dms_program_nc t6 on t.ProductID=t6.ProductID AND t.DeviceID=t6.DeviceID " +
                    " WHERE  1=1  and ( @wLineID <= 0 or t1.LineID  = @wLineID)  " +
                    " and ( @wDeviceID <= 0 or t.DeviceID  = @wDeviceID)" +
                    " and ( @wProductID = ''  or t.ProductID  in ('{1}'))" +
                    " and ( @wAssetNo =''  or t1.AssetNo  = @wAssetNo) " +
                    " and ( @wProductNo =''  or t5.ProductNo  = @wProductNo) " +
                    " and ( @wProductNoLike ='' or t5.ProductNo like  concat('%', @wProductNoLike ,'%'))"
                    , wInstance,StringUtils.Join("','", wProductID));




                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wDeviceID", wDeviceID);
                wParamMap.Add("wProductID", StringUtils.Join("','", wProductID));
                wParamMap.Add("wAssetNo", wAssetNo);
                wParamMap.Add("wProductNo", wProductNo);
                wParamMap.Add("wProductNoLike", wProductNoLike);

                wResult = mDBPool.queryForList<DMSFixtures>(wSQL, wParamMap, wPagination);


            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSFixtures> DMS_SelectDeviceFixturesList(BMSEmployee wLoginUser, int wLineID, int wProductID, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<DMSFixtures> wResult = new List<DMSFixtures>();
            try
            {

                if (wProductID <= 0) 
                    return wResult;

                wPagination.Sort = "DeviceID";

                DateTime wBaseTime = new DateTime(2000, 1, 1);

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT ifnull(t.ID,0) as ID,ifnull(t.FixturesCode,'') AS FixturesCode ," +
                    " ifnull( t.FixturesDescription,'') as FixturesDescription, ifnull( t.FixturesFile,'') as FixturesFile," +
                    " ifnull(t.ToolCode,'') as ToolCode,ifnull(t.ToolDescription,'') as ToolDescription," +
                    " ifnull(t.ToolFile,'') as ToolFile,ifnull(t.Description,'') as Description,ifnull(t.CreatorID,0) as CreatorID," +
                    " ifnull(t.EditorID,0) as EditorID,ifnull(t.CreateTime,'2000-01-01') as CreateTime,ifnull(t.EditTime,'2000-01-01') as EditTime," +
                    " t5.ID as ProductID,t1.ID as DeviceID,  t1.Name as DeviceName,t1.Code as DeviceNo," +
                    " t1.AssetNo ,t1.NCEnable,t1.ToolEnable, t1.FixturesEnable,t2.Name as  LineName," +
                    " t3.Name as CreatorName,t4.Name as EditorName," +
                    " t5.ProductNo,t5.ProductName,t5.DrawingNo,t5.DrawingNoFile, " +
                    " CONCAT(ifnull(t6.ProgramName,''),' ',ifnull(t6.ProgramName_B,'')) as NCCode, t6.Description as  NCDescription  " +
                    " FROM {0}.dms_device_ledger t1  left join {0}.dms_fixtures t  on t.DeviceID=t1.ID AND t.ProductID=@wProductID" +
                    " left join {0}.fpc_product t5  on t5.ID=@wProductID  " +
                    " left join {0}.mbs_user t3 on t.CreatorID=t3.ID " +
                    " left join {0}.mbs_user t4 on t.EditorID=t4.ID" +
                    " left join {0}.fmc_line t2 on t1.LineID=t2.ID " +
                    " left join {0}.dms_program_nc t6 on t6.ProductID=@wProductID AND t1.ID=t6.DeviceID " +
                    " WHERE   @wLineID <= 0 or t1.LineID  = @wLineID  "
                    , wInstance);




                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wProductID", wProductID);

                wResult = mDBPool.queryForList<DMSFixtures>(wSQL, wParamMap, wPagination);


            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public DMSFixtures DMS_SelectFixtures(BMSEmployee wLoginUser, int wDeviceID, int wProductID, String wProductNo, OutResult<Int32> wErrorCode)
        {
            DMSFixtures wResult = new DMSFixtures();
            try
            {
                List<DMSFixtures> wFixturesList = null;
                if (wDeviceID <= 0 || (wProductID <= 0 && StringUtils.isEmpty(wProductNo)))
                    return wResult;


                if (wProductID > 0)
                {
                    wFixturesList = this.DMS_SelectFixturesList(wLoginUser, -1, wDeviceID,StringUtils.parseListArgs( wProductID), "", "", "", Pagination.Default, wErrorCode);
                }
                else
                {
                    wFixturesList = this.DMS_SelectFixturesList(wLoginUser, -1, wDeviceID, null, wProductNo, "", "", Pagination.Default, wErrorCode);

                }

                if (wFixturesList != null && wFixturesList.Count > 0)
                    wResult = wFixturesList[0];

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public void DMS_UpdateFixtures(BMSEmployee wLoginUser, DMSFixtures wDMSFixtures, OutResult<Int32> wErrorCode)
        {
            lock (mLockHelper)
            {
                try
                {

                    if (wDMSFixtures == null || wDMSFixtures.DeviceID <= 0 || wDMSFixtures.ProductID <= 0)
                    {
                        wErrorCode.set(MESException.Parameter.Value);
                        return;
                    }

                    DMSFixtures wDMSFixturesDB = this.DMS_CheckFixtures(wLoginUser, wDMSFixtures, wErrorCode);
                    if (wDMSFixturesDB.ID > 0)
                    {
                        if (wDMSFixtures.ID > 0)
                        {
                            wErrorCode.Result = MESException.Duplication.Value;

                            return;
                        }
                        wDMSFixtures.ID = wDMSFixturesDB.ID;
                    }
                    wErrorCode.set(0);
                    String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();


                    Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                    wParamMap.Add("DeviceID", wDMSFixtures.DeviceID);
                    wParamMap.Add("ProductID", wDMSFixtures.ProductID);
                    wParamMap.Add("FixturesCode", wDMSFixtures.FixturesCode);
                    wParamMap.Add("FixturesDescription", wDMSFixtures.FixturesDescription);
                    wParamMap.Add("FixturesFile", wDMSFixtures.FixturesFile);
                    wParamMap.Add("ToolCode", wDMSFixtures.ToolCode);
                    wParamMap.Add("ToolDescription", wDMSFixtures.ToolDescription);
                    wParamMap.Add("ToolFile", wDMSFixtures.ToolFile);
                    wParamMap.Add("Description", wDMSFixtures.Description);
                    wParamMap.Add("EditorID", wLoginUser.ID);
                    wParamMap.Add("EditTime", DateTime.Now);

                    if (wDMSFixtures.ID <= 0)
                    {

                        wParamMap.Add("CreatorID", wLoginUser.ID);

                        wParamMap.Add("CreateTime", DateTime.Now);
                        wDMSFixtures.ID = this.Insert(StringUtils.Format("{0}.dms_fixtures", wInstance), wParamMap);

                    }
                    else
                    {
                        wParamMap.Add("ID", wDMSFixtures.ID);
                        this.Update(StringUtils.Format("{0}.dms_fixtures", wInstance), "ID", wParamMap);
                    }

                }
                catch (Exception e)
                {
                    logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                    wErrorCode.set(MESException.DBSQL.Value);
                }
            }
        }

        public void DMS_DeleteFixtures(BMSEmployee wLoginUser, List<Int32> wIDList,
                OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                if (wIDList == null)
                    wIDList = new List<Int32>();
                wIDList.RemoveAll(p => p <= 0);
                if (wIDList.Count <= 0)
                    return;

                this.Delete(StringUtils.Format("{0}.dms_fixtures", wInstance), null, StringUtils.Format(" ID IN ({0})", StringUtils.Join(",", wIDList)));


            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }





    }
}
