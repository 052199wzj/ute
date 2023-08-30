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
    class OMSChangeProductDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(OMSChangeProductDAO));


        public Repository _Repository = null;

        private static OMSChangeProductDAO Instance;

        private OMSChangeProductDAO() : base()
        {

        }

        public static OMSChangeProductDAO getInstance()
        {
            if (Instance == null)
                Instance = new OMSChangeProductDAO();


            Instance._Repository = Instance.BaseRepository();

            Instance.SetInstance(typeof(OMSChangeProduct).FullName, Instance);
            return Instance;
        }

        // (public\s+[a-zA-z0-9_\<\>]+\s+[a-zA-z0-9_\<\>]+\()([^\)]*)\)

        private OMSChangeProduct OMS_CheckChangeProduct(BMSEmployee wLoginUser, OMSChangeProduct wOMSChangeProduct
                 , OutResult<Int32> wErrorCode)
        {
            OMSChangeProduct wResult = new OMSChangeProduct();
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();


                String wSQL = StringUtils.Format("SELECT t.* FROM {0}.oms_changeproduct t  " +
                    "  WHERE    @wID != t.ID  and  ((t.OldOrderID  = @wOldOrderID  and   t.ChangeOrderID=@wChangeOrderID " +
                    " and t.LineID=@wLineID and t.Status=1 ) or   t.Code  = @wCode ) ;", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wOMSChangeProduct.ID);
                wParamMap.Add("wLineID", wOMSChangeProduct.LineID);
                wParamMap.Add("wOldOrderID", wOMSChangeProduct.OldOrderID);
                wParamMap.Add("wChangeOrderID", wOMSChangeProduct.ChangeOrderID);
                wParamMap.Add("wCode", wOMSChangeProduct.Code);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.Code = StringUtils.parseString(wReader["Code"]);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        private List<OMSChangeProduct> OMS_SelectChangeProductList(BMSEmployee wLoginUser, int wID, String wCode, String wCodeLike, int wOldOrderID, String wOldOrderNo,
            List<int> wChangeOrderIDs, String wChangeOrderNo, int wOldProductID, int wChangeProductID, int wEditorID,
              int wStatus, int wActive, DateTime wStartTime,
            DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<OMSChangeProduct> wResult = new List<OMSChangeProduct>();
            try
            {

                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if (wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if (wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return wResult;
                }
                if (wChangeOrderIDs == null)
                    wChangeOrderIDs = new List<int>();
                wChangeOrderIDs.RemoveAll(p => p <= 0);

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.*,t2.Name as  LineName," +
                    " t3.Name as CreatorName,t4.Name as EditorName,t5.OrderNo as OldOrderNo, " +
                    " t5.ProductID as OldProductID, t6.ProductNo as  OldProductNo ," +
                    " t6.DrawingNo as OldDrawingNo,t6.DrawingNoFile as OldDrawingNoFile," +
                    " t7.OrderNo as ChangeOrderNo,t7.ProductID as ChangeProductID,t8.ProductNo as  ChangeProductNo, " +
                    " t8.DrawingNo as ChangeDrawingNo,t8.DrawingNoFile as ChangeDrawingNoFile,t9.MaterialNo,t9.MaterialName " +
                    " FROM {0}.oms_changeproduct t  left join {0}.mbs_user t3 on t.CreatorID=t3.ID " +
                    " left join {0}.mbs_user t4 on t.EditorID=t4.ID" +
                    " left join {0}.oms_order t5 on t.OldOrderID=t5.ID" +
                    " left join {0}.fpc_product t6 on t5.ProductID=t6.ID" +
                    " left join {0}.oms_order t7 on t.ChangeOrderID=t7.ID" +
                    " left join {0}.fpc_product t8 on t7.ProductID=t8.ID" +
                    " left join {0}.mss_material t9 on t.MaterialID=t9.ID" +
                    " left join {0}.fmc_line t2 on t7.LineID=t2.ID" +
                    " WHERE  1=1  and ( @wID <= 0 or t.ID  = @wID)  " +
                    " and ( @wCode =''  or t.Code  = @wCode) " +
                    " and ( @wCodeLike ='' or t.Code like  concat('%', @wCodeLike ,'%'))" +
                    " and ( @wOldOrderID <= 0 or t.OldOrderID  = @wOldOrderID)" +
                    " and ( @wOldOrderNo ='' or t5.OrderNo like  concat('%', @wOldOrderNo ,'%'))" +
                    " and ( @wChangeOrderID = ''  or t.ChangeOrderID  in ('{1}'))" +
                    " and ( @wChangeOrderNo ='' or t7.OrderNo like  concat('%', @wChangeOrderNo ,'%'))" +
                    " and ( @wOldProductID <= 0 or t5.ProductID  = @wOldProductID)" +
                    " and ( @wChangeProductID <= 0 or t7.ProductID  = @wChangeProductID)" +
                    " and ( @wEditorID <= 0 or t.EditorID  = @wEditorID)" +
                    " and ( @wStatus < 0 or t.Status  = @wStatus)" +
                    " and ( @wActive < 0 or t.Active  = @wActive)" +
                    " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wStartTime <= t.EditTime) " +
                    " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= t.CreateTime) "
                    , wInstance, StringUtils.Join("','", wChangeOrderIDs));

                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wID);
                wParamMap.Add("wCode", wCode);
                wParamMap.Add("wCodeLike", wCodeLike);
                wParamMap.Add("wOldOrderID", wOldOrderID);
                wParamMap.Add("wOldOrderNo", wOldOrderNo);
                wParamMap.Add("wChangeOrderID", StringUtils.Join("','", wChangeOrderIDs));
                wParamMap.Add("wChangeOrderNo", wChangeOrderNo);
                wParamMap.Add("wOldProductID", wOldProductID);
                wParamMap.Add("wChangeProductID", wChangeProductID);
                wParamMap.Add("wEditorID", wEditorID);
                wParamMap.Add("wStatus", wStatus);
                wParamMap.Add("wActive", wActive);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);


                wResult = mDBPool.queryForList<OMSChangeProduct>(wSQL, wParamMap, wPagination);

                if (wResult != null && wResult.Count > 0)
                {

                    Dictionary<int, OMSChangeProduct> wResultDic = wResult.GroupBy(p => p.ID).ToDictionary(p => p.Key, p => p.First());

                    List<Int32> wIDList = wResultDic.Keys.ToList();
                    wIDList.RemoveAll(p => p <= 0);
                    if (wIDList.Count > 0)
                    {
                        List<OMSChangeProductDevice> wChangeProductDevices = OMSChangeProductDeviceDAO.getInstance().OMS_SelectChangeProductDeviceList(wLoginUser,
                            wIDList, null, -1, -1, new DateTime(2000, 1, 1), new DateTime(2000, 1, 1), Pagination.MaxSize, wErrorCode);


                        foreach (OMSChangeProductDevice wOMSChangeProductDevice in wChangeProductDevices)
                        {
                            if (wOMSChangeProductDevice == null || wOMSChangeProductDevice.ID <= 0
                                || (!wResultDic.ContainsKey(wOMSChangeProductDevice.MainID)) || wResultDic[wOMSChangeProductDevice.MainID] == null)
                                continue;

                            if (wResultDic[wOMSChangeProductDevice.MainID].DeviceList == null)
                                wResultDic[wOMSChangeProductDevice.MainID].DeviceList = new List<OMSChangeProductDevice>();
                            wResultDic[wOMSChangeProductDevice.MainID].DeviceList.Add(wOMSChangeProductDevice);

                        }

                    }
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }




        public List<OMSChangeProduct> OMS_SelectChangeProductList(BMSEmployee wLoginUser, int wLineID, List<int> wChangeOrderIDs, String wOrderNo, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<OMSChangeProduct> wResult = new List<OMSChangeProduct>();
            try
            {
                if (wChangeOrderIDs == null)
                    wChangeOrderIDs = new List<int>();
                wChangeOrderIDs.RemoveAll(p => p <= 0);

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT ifnull(t.ID,0) as ID,ifnull(t.Code,'') as Code,t7.LineID," +
                    " ifnull(t.OldOrderID,0) as OldOrderID,t7.ID AS ChangeOrderID , " +
                    " ifnull(t.MaterialID,0) as MaterialID,ifnull(t.Status,0) as Status,ifnull(t.Active,0) as Active," +
                    " ifnull(t.Remark,'') as Remark,ifnull(t.CreatorID,0) as CreatorID,ifnull(t.EditorID,0) as EditorID," +
                    " ifnull(t.CreateTime,'2000-01-01') as CreateTime,ifnull(t.EditTime,'2000-01-01') as EditTime,t2.Name as  LineName," +
                    " t3.Name as CreatorName,t4.Name as EditorName,t5.OrderNo as OldOrderNo, " +
                    " t5.ProductID as OldProductID, t6.ProductNo as  OldProductNo ," +
                    " t6.DrawingNo as OldDrawingNo,t6.DrawingNoFile as OldDrawingNoFile," +
                    " t7.OrderNo as ChangeOrderNo,t7.ProductID as ChangeProductID,t8.ProductNo as  ChangeProductNo, " +
                    " t8.DrawingNo as ChangeDrawingNo,t8.DrawingNoFile as ChangeDrawingNoFile,t9.MaterialNo,t9.MaterialName " +
                    " FROM {0}.oms_order t7 left join {0}.oms_changeproduct t  on t.ChangeOrderID=t7.ID and t.Active=1 " +
                    " left join {0}.mbs_user t3 on t.CreatorID=t3.ID " +
                    " left join {0}.mbs_user t4 on t.EditorID=t4.ID" +
                    " left join {0}.oms_order t5 on t.OldOrderID=t5.ID" +
                    " left join {0}.fpc_product t6 on t5.ProductID=t6.ID" +
                    " left join {0}.fpc_product t8 on t7.ProductID=t8.ID" +
                    " left join {0}.mss_material t9 on t.MaterialID=t9.ID" +
                    " left join {0}.fmc_line t2 on t7.LineID=t2.ID" +
                    " WHERE  1=1  and ( @wLineID<=0 OR t7.LineID=@wLineID ) and ( @wOrderNo = '' OR t7.OrderNo=@wOrderNo )" +
                    "  and ( @wChangeOrderID = ''  or t7.ID  in ('{1}'))"
                    , wInstance, StringUtils.Join("','", wChangeOrderIDs));

                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();


                wParamMap.Add("wChangeOrderID", StringUtils.Join("','", wChangeOrderIDs));
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wOrderNo", wOrderNo);

                wResult = mDBPool.queryForList<OMSChangeProduct>(wSQL, wParamMap, wPagination);

                if (wResult != null && wResult.Count > 0)
                {
                    Dictionary<int, OMSChangeProduct> wResultDic = wResult.FindAll(p => p.ID > 0).GroupBy(p => p.ID).ToDictionary(p => p.Key, p => p.First());

                    List<Int32> wIDList = wResultDic.Keys.ToList();
                    wIDList.RemoveAll(p => p <= 0);
                    if (wIDList.Count > 0)
                    {
                        List<OMSChangeProductDevice> wChangeProductDevices = OMSChangeProductDeviceDAO.getInstance().OMS_SelectChangeProductDeviceList(wLoginUser,
                            wIDList, null, -1, -1, new DateTime(2000, 1, 1), new DateTime(2000, 1, 1), Pagination.MaxSize, wErrorCode);


                        foreach (OMSChangeProductDevice wOMSChangeProductDevice in wChangeProductDevices)
                        {
                            if (wOMSChangeProductDevice == null || wOMSChangeProductDevice.ID <= 0
                                || (!wResultDic.ContainsKey(wOMSChangeProductDevice.MainID)) || wResultDic[wOMSChangeProductDevice.MainID] == null)
                                continue;

                            if (wResultDic[wOMSChangeProductDevice.MainID].DeviceList == null)
                                wResultDic[wOMSChangeProductDevice.MainID].DeviceList = new List<OMSChangeProductDevice>();
                            wResultDic[wOMSChangeProductDevice.MainID].DeviceList.Add(wOMSChangeProductDevice);

                        }

                    }

                    wResultDic = wResult.FindAll(p => p.ID <= 0).GroupBy(p => p.ChangeOrderID).ToDictionary(p => p.Key, p => p.First());


                    if (wResultDic.Count > 0)
                    {
                        List<int> wChangeProductList = wResultDic.Values.Select(p => p.ChangeProductID).Distinct().ToList();

                        wChangeProductList.RemoveAll(p => p <= 0);

                        List<DMSDeviceLedger> wDMSDeviceLedgerList = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedgerList(wLoginUser, wLineID, 1, Pagination.Create(1,int.MaxValue), wErrorCode);

                        List<DMSFixtures> wDMSFixturesList = DMSFixturesDAO.getInstance().DMS_SelectFixturesList(wLoginUser, wLineID,
                            -1, wChangeProductList, "", "", "", Pagination.MaxSize, wErrorCode);

                        var wDMSFixturesDic = wDMSFixturesList.GroupBy(p => p.ProductID).ToDictionary(p => p.Key, p =>
                           p.GroupBy(q => q.DeviceID).ToDictionary(q => q.Key, q => q.First()));

                        OMSChangeProductDevice wOMSChangeProductDevice;
                        foreach (var wChangeOrderID in wResultDic.Keys)
                        {
                            foreach (DMSDeviceLedger wDMSDeviceLedger in wDMSDeviceLedgerList)
                            {
                                wOMSChangeProductDevice = new OMSChangeProductDevice(wDMSDeviceLedger);

                                if (wDMSFixturesDic.ContainsKey(wResultDic[wChangeOrderID].ChangeProductID)
                                    && wDMSFixturesDic[wResultDic[wChangeOrderID].ChangeProductID].ContainsKey(wDMSDeviceLedger.ID))
                                {

                                    wOMSChangeProductDevice.SetDeviceFixtures(wDMSFixturesDic[wResultDic[wChangeOrderID].ChangeProductID][wDMSDeviceLedger.ID]);

                                }

                                wResultDic[wChangeOrderID].DeviceList.Add(wOMSChangeProductDevice);
                            }
                        }

                    }

                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



        public List<OMSChangeProduct> OMS_SelectChangeProductList(BMSEmployee wLoginUser, string wCodeLike, int wOldOrderID, String wOldOrderNo,
             List<int> wChangeOrderIDs, String wChangeOrderNo, int wOldProductID, int wChangeProductID, int wEditorID,
              int wStatus, int wActive, DateTime wStartTime,
            DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            return this.OMS_SelectChangeProductList(wLoginUser, -1, "", wCodeLike, wOldOrderID, wOldOrderNo,
             wChangeOrderIDs, wChangeOrderNo, wOldProductID, wChangeProductID, wEditorID,
               wStatus, wActive, wStartTime,
             wEndTime, wPagination, wErrorCode);
        }

        public OMSChangeProduct OMS_SelectChangeProduct(BMSEmployee wLoginUser, int wID, string wCode, OutResult<Int32> wErrorCode)
        {
            OMSChangeProduct wResult = new OMSChangeProduct();
            try
            {
                List<OMSChangeProduct> wChangeProductList = null;
                if (wID > 0)
                {
                    wChangeProductList = this.OMS_SelectChangeProductList(wLoginUser, wID, "", "", -1, "", null, "", -1, -1, -1,
                         -1, -1, new DateTime(2000, 1, 1), new DateTime(2000, 1, 1), Pagination.Default, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wCode))
                {
                    wChangeProductList = this.OMS_SelectChangeProductList(wLoginUser, -1, wCode, "", -1, "", null, "", -1, -1, -1,
                          -1, -1, new DateTime(2000, 1, 1), new DateTime(2000, 1, 1), Pagination.Default, wErrorCode);
                }
                else
                {
                    return wResult;
                }


                if (wChangeProductList != null && wChangeProductList.Count > 0)
                    wResult = wChangeProductList[0];

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public void OMS_UpdateChangeProduct(BMSEmployee wLoginUser, OMSChangeProduct wOMSChangeProduct, OutResult<Int32> wErrorCode)
        {
            lock (mLockHelper)
            {
                try
                {

                    if (wOMSChangeProduct == null || wOMSChangeProduct.LineID <= 0 || wOMSChangeProduct.ChangeOrderID <= 0)
                    {
                        wErrorCode.set(MESException.Parameter.Value);
                        return;
                    }
                    if (wOMSChangeProduct.ID > 0 && StringUtils.isEmpty(wOMSChangeProduct.Code))
                    {
                        wErrorCode.set(MESException.Parameter.Value);
                        return;
                    }
                    OMSChangeProduct wOMSChangeProductDB = this.OMS_CheckChangeProduct(wLoginUser, wOMSChangeProduct, wErrorCode);
                    if (wOMSChangeProductDB.ID > 0)
                    {
                        if (wOMSChangeProduct.ID > 0)
                        {
                            wErrorCode.Result = MESException.Duplication.Value;

                            return;
                        }
                        wOMSChangeProduct.ID = wOMSChangeProductDB.ID;
                        wOMSChangeProduct.Code = wOMSChangeProductDB.Code;
                    }
                    wErrorCode.set(0);
                    String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();
                    //生成唯一编码
                    if (StringUtils.isEmpty(wOMSChangeProduct.Code))
                    {
                        wOMSChangeProduct.Code = this.CreateMaxCode(StringUtils.Format("{0}.oms_changeproduct", wInstance), "HX{yyMMdd}", "Code", 2);

                    }

                    Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                    wParamMap.Add("Code", wOMSChangeProduct.Code);
                    wParamMap.Add("LineID", wOMSChangeProduct.LineID);
                    wParamMap.Add("OldOrderID", wOMSChangeProduct.OldOrderID);
                    wParamMap.Add("ChangeOrderID", wOMSChangeProduct.ChangeOrderID);
                    wParamMap.Add("MaterialID", wOMSChangeProduct.MaterialID);
                    wParamMap.Add("EditorID", wLoginUser.ID);
                    wParamMap.Add("EditTime", DateTime.Now);
                    wParamMap.Add("Status", wOMSChangeProduct.Status);
                    wParamMap.Add("Remark", wOMSChangeProduct.Remark);

                    if (wOMSChangeProduct.ID <= 0)
                    {

                        wParamMap.Add("CreatorID", wLoginUser.ID);

                        wParamMap.Add("CreateTime", DateTime.Now);
                        wOMSChangeProduct.ID = this.Insert(StringUtils.Format("{0}.oms_changeproduct", wInstance), wParamMap);

                    }
                    else
                    {
                        wParamMap.Add("ID", wOMSChangeProduct.ID);
                        wParamMap.Add("Active", 1);

                        mDBPool.update(StringUtils.Format("update {0}.oms_changeproduct set Active=2 where ID>0 and Active=1 and LineID=@LineID AND  ChangeOrderID=@ChangeOrderID", wInstance), wParamMap);

                        this.Update(StringUtils.Format("{0}.oms_changeproduct", wInstance), "ID", wParamMap);
                    }

                    if (wOMSChangeProduct.DeviceList != null && wOMSChangeProduct.DeviceList.Count > 0)
                    {
                        foreach (OMSChangeProductDevice wOMSChangeProductDevice in wOMSChangeProduct.DeviceList)
                        {
                            if (wOMSChangeProductDevice == null)
                                continue;
                            wOMSChangeProductDevice.MainID = wOMSChangeProduct.ID;
                            OMSChangeProductDeviceDAO.getInstance().OMS_UpdateChangeProductDevice(wLoginUser, wOMSChangeProductDevice, wErrorCode);
                        }

                    }

                }
                catch (Exception e)
                {
                    logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                    wErrorCode.set(MESException.DBSQL.Value);
                }
            }
        }

        public void OMS_DeleteChangeProduct(BMSEmployee wLoginUser, List<Int32> wIDList,
                OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                if (wIDList == null)
                    wIDList = new List<Int32>();
                wIDList.RemoveAll(p => p <= 0);
                if (wIDList.Count <= 0)
                    return;

                int wRow = this.Delete(StringUtils.Format("{0}.oms_changeproduct", wInstance), null, StringUtils.Format(" ID IN ({0})", StringUtils.Join(",", wIDList)));
                if (wRow > 0)
                {
                    OMSChangeProductDeviceDAO.getInstance().OMS_DeleteChangeProductDeviceByMainID(wLoginUser, wIDList, wErrorCode);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }





    }
}
