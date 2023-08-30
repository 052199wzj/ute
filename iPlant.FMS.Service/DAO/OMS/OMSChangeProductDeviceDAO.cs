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
    class OMSChangeProductDeviceDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(OMSChangeProductDeviceDAO));


        public Repository _Repository = null;

        private static OMSChangeProductDeviceDAO Instance;

        private OMSChangeProductDeviceDAO() : base()
        {

        }

        public static OMSChangeProductDeviceDAO getInstance()
        {
            if (Instance == null)
                Instance = new OMSChangeProductDeviceDAO();

             
            Instance._Repository = Instance.BaseRepository();
            Instance.SetInstance(typeof(OMSChangeProductDevice).FullName, Instance);
            return Instance;
        }

        // (public\s+[a-zA-z0-9_\<\>]+\s+[a-zA-z0-9_\<\>]+\()([^\)]*)\)

        private OMSChangeProductDevice OMS_CheckChangeProductDevice(BMSEmployee wLoginUser, OMSChangeProductDevice wOMSChangeProductDevice
                 , OutResult<Int32> wErrorCode)
        {
            OMSChangeProductDevice wResult = new OMSChangeProductDevice();
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();


                String wSQL = StringUtils.Format("SELECT t.* FROM {0}.oms_changeproductdevice t  " +
                    "  WHERE    @wID != t.ID  and  t.MainID  = @wMainID  and   t.DeviceID=@wDeviceID   ;", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wOMSChangeProductDevice.ID);
                wParamMap.Add("wMainID", wOMSChangeProductDevice.MainID);
                wParamMap.Add("wDeviceID", wOMSChangeProductDevice.DeviceID);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.MainID = StringUtils.parseInt(wReader["MainID"]);
                    wResult.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        private List<OMSChangeProductDevice> OMS_SelectChangeProductDeviceList(BMSEmployee wLoginUser, int wID, List<int> wMainIDList,
            List<int> wDeviceIDList, int wEditorID, int wStatus, DateTime wStartTime,
            DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<OMSChangeProductDevice> wResult = new List<OMSChangeProductDevice>();
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
                if (wMainIDList == null)
                    wMainIDList = new List<int>();
                if (wDeviceIDList == null)
                    wDeviceIDList = new List<int>();

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.*,t2.OrderNo as ChangeOrderNo,t2.ProductID as ChangeProductID," +
                    " t3.Name as CreatorName,t4.Name as EditorName,t5.AssetNo,t5.Code as DeviceNo, " +
                    " t5.Name as DeviceName, t5.NCEnable,t5.ToolEnable,t5.FixturesEnable,t6.ToolCode,t6.ToolDescription," +
                    " t6.ToolFile,t6.FixturesCode,t6.FixturesDescription,t6.FixturesFile,concat( t7.ProgramName,' ', t7.ProgramName_B) as NCCode,t7.Description as NCDescription  " +
                    " FROM {0}.oms_changeproductdevice t left join {0}.oms_changeproduct t1 on t.MainID=t1.ID " + 
                    " left join {0}.oms_order t2 on t1.ChangeOrderID=t2.ID " +
                    " left join {0}.mbs_user t3 on t.CreatorID=t3.ID " +
                    " left join {0}.mbs_user t4 on t.EditorID=t4.ID" +
                    " left join {0}.dms_device_ledger t5 on t.DeviceID=t5.ID" +
                    " left join {0}.dms_fixtures t6 on t.DeviceID=t6.DeviceID and t2.ProductID=t6.ProductID " +
                    " left join {0}.dms_program_nc t7 on t.DeviceID=t7.DeviceID and t2.ProductID=t7.ProductID " +
                    " WHERE  1=1  and ( @wID <= 0 or t.ID  = @wID)  " +
                    " and ( @wMainID =''  or t.MainID IN  ( '{1}' ) ) " +
                    " and ( @wDeviceID =''  or t.DeviceID IN  ( '{1}' ) ) " +
                    " and ( @wEditorID <= 0 or t.EditorID  = @wEditorID)" +
                    " and ( @wStatus < 0 or t.Status  = @wStatus)" +
                    " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wStartTime <= t.EditTime) " +
                    " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= t.CreateTime) "
                    , wInstance, StringUtils.Join("','", wMainIDList), StringUtils.Join("','", wDeviceIDList));




                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wID);
                wParamMap.Add("wMainID", StringUtils.Join("','", wMainIDList));
                wParamMap.Add("wDeviceID", StringUtils.Join("','", wDeviceIDList));
                wParamMap.Add("wEditorID", wEditorID);
                wParamMap.Add("wStatus", wStatus);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);


                wResult = mDBPool.queryForList<OMSChangeProductDevice>(wSQL, wParamMap, wPagination);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<OMSChangeProductDevice> OMS_SelectChangeProductDeviceList(BMSEmployee wLoginUser, List<int> wMainIDList,
            List<int> wDeviceIDList, int wEditorID, int wStatus, DateTime wStartTime,
            DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            return this.OMS_SelectChangeProductDeviceList(wLoginUser, -1, wMainIDList, wDeviceIDList, wEditorID,
               wStatus, wStartTime,
             wEndTime, wPagination, wErrorCode);
        }

        public OMSChangeProductDevice OMS_SelectChangeProductDevice(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            OMSChangeProductDevice wResult = new OMSChangeProductDevice();
            try
            {
                List<OMSChangeProductDevice> wChangeProductDeviceList = null;
                if (wID > 0)
                {
                    wChangeProductDeviceList = this.OMS_SelectChangeProductDeviceList(wLoginUser, wID, null, null, -1,
                         -1, new DateTime(2000, 1, 1), new DateTime(2000, 1, 1), Pagination.Default, wErrorCode);
                } 
                else
                {
                    return wResult;
                }


                if (wChangeProductDeviceList != null && wChangeProductDeviceList.Count > 0)
                    wResult = wChangeProductDeviceList[0];

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public void OMS_UpdateChangeProductDevice(BMSEmployee wLoginUser, OMSChangeProductDevice wOMSChangeProductDevice, OutResult<Int32> wErrorCode)
        {
            lock (mLockHelper)
            {
                try
                {

                    if (wOMSChangeProductDevice == null || wOMSChangeProductDevice.MainID <= 0 || wOMSChangeProductDevice.DeviceID <= 0)
                    {
                        wErrorCode.set(MESException.Parameter.Value);
                        return;
                    }
                   
                    OMSChangeProductDevice wOMSChangeProductDeviceDB = this.OMS_CheckChangeProductDevice(wLoginUser, wOMSChangeProductDevice, wErrorCode);
                    if (wOMSChangeProductDeviceDB.ID > 0)
                    {
                        if (wOMSChangeProductDevice.ID > 0)
                        {
                            wErrorCode.Result = MESException.Duplication.Value;

                            return;
                        }
                        wOMSChangeProductDevice.ID = wOMSChangeProductDeviceDB.ID; 
                    }
                    wErrorCode.set(0);
                    String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();
                   

                    Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                    wParamMap.Add("MainID", wOMSChangeProductDevice.MainID);
                    wParamMap.Add("DeviceID", wOMSChangeProductDevice.DeviceID);
                    wParamMap.Add("ToolConfirm", wOMSChangeProductDevice.ToolConfirm);
                    wParamMap.Add("ToolConfirmRemark", wOMSChangeProductDevice.ToolConfirmRemark);
                    wParamMap.Add("NCConfirm", wOMSChangeProductDevice.NCConfirm);
                    wParamMap.Add("NCConfirmRemark", wOMSChangeProductDevice.NCConfirmRemark);
                    wParamMap.Add("FixturesConfirm", wOMSChangeProductDevice.FixturesConfirm);
                    wParamMap.Add("FixturesConfirmRemark", wOMSChangeProductDevice.FixturesConfirmRemark);
                    wParamMap.Add("Status", wOMSChangeProductDevice.Status); 
                    wParamMap.Add("EditorID", wLoginUser.ID);
                    wParamMap.Add("EditTime", DateTime.Now);
                    wParamMap.Add("Remark", wOMSChangeProductDevice.Remark);

                    if (wOMSChangeProductDevice.ID <= 0)
                    {

                        wParamMap.Add("CreatorID", wLoginUser.ID);

                        wParamMap.Add("CreateTime", DateTime.Now);
                        wOMSChangeProductDevice.ID = this.Insert(StringUtils.Format("{0}.oms_changeproductdevice", wInstance), wParamMap);

                    }
                    else
                    {
                        wParamMap.Add("ID", wOMSChangeProductDevice.ID);
                        this.Update(StringUtils.Format("{0}.oms_changeproductdevice", wInstance), "ID", wParamMap);
                    }
                }
                catch (Exception e)
                {
                    logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                    wErrorCode.set(MESException.DBSQL.Value);
                }
            }
        }
 

        public void OMS_DeleteChangeProductDevice(BMSEmployee wLoginUser, List<Int32> wIDList,
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

                this.Delete(StringUtils.Format("{0}.oms_changeproductdevice", wInstance), null, StringUtils.Format(" ID IN ({0})", StringUtils.Join(",", wIDList)));
                 
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }


        public void OMS_DeleteChangeProductDeviceByMainID(BMSEmployee wLoginUser, List<Int32> wMainIDList,
            OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                if (wMainIDList == null)
                    wMainIDList = new List<Int32>();
                wMainIDList.RemoveAll(p => p <= 0);
                if (wMainIDList.Count <= 0)
                    return;

                this.Delete(StringUtils.Format("{0}.oms_changeproductdevice", wInstance), null, StringUtils.Format(" MainID IN ({0})", StringUtils.Join(",", wMainIDList))); 
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }


    }
}
