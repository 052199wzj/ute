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
    class DMSDeviceGroupDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSDeviceGroupDAO));

        
        private static DMSDeviceGroupDAO Instance;

        private DMSDeviceGroupDAO() : base()
        {

        }

        public static DMSDeviceGroupDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSDeviceGroupDAO();
            return Instance;
        }

        // (public\s+[a-zA-z0-9_\<\>]+\s+[a-zA-z0-9_\<\>]+\()([^\)]*)\)

        private DMSDeviceGroup DMS_CheckDeviceGroup(BMSEmployee wLoginUser, DMSDeviceGroup wDMSDeviceGroup
                 , OutResult<Int32> wErrorCode)
        {
            DMSDeviceGroup wResult = new DMSDeviceGroup();
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();


                String wSQL = StringUtils.Format("SELECT t.* FROM {0}.dms_devicegroup t  " +
                    "  WHERE    @wID != t.ID  and  ( (t.Name  = @wName   and   t.Active=1) or   t.Code  = @wCode ) ;", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wDMSDeviceGroup.ID);
                wParamMap.Add("wName", wDMSDeviceGroup.Name);
                wParamMap.Add("wCode", wDMSDeviceGroup.Code); 

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wResult.ID = StringUtils.parseInt(wReader["ID"]); 
                    wResult.Name = StringUtils.parseString(wReader["Name"]);
                    wResult.Code = StringUtils.parseString(wReader["Code"]);
                    wResult.OperatorID = StringUtils.parseInt(wReader["OperatorID"]);
                    wResult.OperateTime = StringUtils.parseDate(wReader["OperateTime"]);
                    wResult.Active = StringUtils.parseInt(wReader["Active"]);
                    wResult.Remark = StringUtils.parseString(wReader["Remark"]);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        private List<DMSDeviceGroup> DMS_SelectDeviceGroupList(BMSEmployee wLoginUser, int wID,  String wName, String wCode,
              int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceGroup> wResult = new List<DMSDeviceGroup>();
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.*,t3.Name as OperatorName FROM {0}.dms_devicegroup t " +
                    "  left join {0}.mbs_user t3 on t.OperatorID=t3.ID WHERE  1=1 "
                        + " and ( @wID <= 0 or t.ID  = @wID) and ( @wName ='' or t.Name  = @wName)  "
                        + " and ( @wCode =''  or t.Code  = @wCode) "
                        + " and ( @wActive < 0 or t.Active  = @wActive)", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wID);
                wParamMap.Add("wName", wName);
                wParamMap.Add("wCode", wCode);
                wParamMap.Add("wActive", wActive); 

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSDeviceGroup wDeviceModelW = new DMSDeviceGroup();

                    wDeviceModelW.ID = StringUtils.parseInt(wReader["ID"]);
                    wDeviceModelW.Name = StringUtils.parseString(wReader["Name"]);
                    wDeviceModelW.Code = StringUtils.parseString(wReader["Code"]); 
                    wDeviceModelW.OperatorID = StringUtils.parseInt(wReader["OperatorID"]);
                    wDeviceModelW.OperateTime = StringUtils.parseDate(wReader["OperateTime"]);
                    wDeviceModelW.Active = StringUtils.parseInt(wReader["Active"]);
                    wDeviceModelW.OperatorName = StringUtils.parseString(wReader["OperatorName"]);
                    wDeviceModelW.Remark = StringUtils.parseString(wReader["Remark"]);

                    wResult.Add(wDeviceModelW);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSDeviceGroup> DMS_SelectDeviceGroupList(BMSEmployee wLoginUser,   String wName, int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            return this.DMS_SelectDeviceGroupList(wLoginUser, -1,  wName, "",
                    wActive, wPagination, wErrorCode);
        }

        public DMSDeviceGroup DMS_SelectDeviceGroup(BMSEmployee wLoginUser, int wID, string wCode, OutResult<Int32> wErrorCode)
        {
            DMSDeviceGroup wResult = new DMSDeviceGroup();
            try
            {
                List<DMSDeviceGroup> wDeviceGroupList = null;
                if (wID > 0)
                {
                    wDeviceGroupList = this.DMS_SelectDeviceGroupList(wLoginUser, wID,  "", "",
                      -1, Pagination.Default, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wCode))
                {
                    wDeviceGroupList = this.DMS_SelectDeviceGroupList(wLoginUser, -1,  "", wCode,
                      -1, Pagination.Default, wErrorCode);
                }
                else
                {
                    return wResult;
                }


                if (wDeviceGroupList != null && wDeviceGroupList.Count > 0)
                    wResult = wDeviceGroupList[0];

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public void DMS_UpdateDeviceGroup(BMSEmployee wLoginUser, DMSDeviceGroup wDMSDeviceGroup, OutResult<Int32> wErrorCode)
        {
            lock (mLockHelper)
            {
                try
                {

                    if (wDMSDeviceGroup == null || StringUtils.isEmpty(wDMSDeviceGroup.Name))
                    {
                        wErrorCode.set(MESException.Parameter.Value);
                        return;
                    }
                    if (wDMSDeviceGroup.ID > 0 && StringUtils.isEmpty(wDMSDeviceGroup.Code))
                    {
                        wErrorCode.set(MESException.Parameter.Value);
                        return;
                    }
                    DMSDeviceGroup wDMSDeviceGroupDB = this.DMS_CheckDeviceGroup(wLoginUser, wDMSDeviceGroup, wErrorCode);
                    if (wDMSDeviceGroupDB.ID > 0)
                    {
                        wErrorCode.Result = MESException.Duplication.Value;

                        return;
                    }
                    wErrorCode.set(0);
                    String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                    //生成唯一编码
                    if (StringUtils.isEmpty(wDMSDeviceGroup.Code))
                    {
                        wDMSDeviceGroup.Code = this.CreateMaxCode(StringUtils.Format("{0}.dms_devicegroup", wInstance), "POS-", "Code", 4); 
                    }

                    Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                    wParamMap.Add("Name", wDMSDeviceGroup.Name); 
                    wParamMap.Add("Remark", wDMSDeviceGroup.Remark);
                    wParamMap.Add("Code", wDMSDeviceGroup.Code);
                    wParamMap.Add("OperatorID", wDMSDeviceGroup.OperatorID);
                    wParamMap.Add("OperateTime", DateTime.Now);
                    wParamMap.Add("Active", wDMSDeviceGroup.Active);

                    if (wDMSDeviceGroup.ID <= 0)
                    { 
                        wDMSDeviceGroup.ID = this.Insert(StringUtils.Format("{0}.dms_devicegroup", wInstance), wParamMap); 
                    }
                    else
                    {
                        wParamMap.Add("ID", wDMSDeviceGroup.ID);
                        this.Update(StringUtils.Format("{0}.dms_devicegroup", wInstance), "ID", wParamMap);
                    }
                }
                catch (Exception e)
                {
                    logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                    wErrorCode.set(MESException.DBSQL.Value);
                }
            }
        }

        public void DMS_ActiveDeviceGroup(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive,
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
                if (wActive != 1)
                    wActive = 2;
                String wSql = StringUtils.Format("UPDATE {0}.dms_devicegroup SET Active ={1} WHERE ID IN({2}) ;",
                        wInstance, wActive, StringUtils.Join(",", wIDList));

                this.ExecuteSqlTransaction(wSql);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public void DMS_DeleteDeviceGroup(BMSEmployee wLoginUser, List<Int32> wIDList,
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

                String wSql = StringUtils.Format("Delete from {0}.dms_devicegroup WHERE Active =0  and ID IN({1}) ;",
                        wInstance, StringUtils.Join(",", wIDList));

                this.ExecuteSqlTransaction(wSql);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

    }
}
