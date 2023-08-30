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
    class DMSDeviceTypeDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSDeviceTypeDAO));




        private static DMSDeviceTypeDAO Instance;

        private DMSDeviceTypeDAO() : base()
        {

        }

        public static DMSDeviceTypeDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSDeviceTypeDAO();
            return Instance;
        }

        // (public\s+[a-zA-z0-9_\<\>]+\s+[a-zA-z0-9_\<\>]+\()([^\)]*)\)

        private DMSDeviceType DMS_CheckDeviceType(BMSEmployee wLoginUser, DMSDeviceType wDMSDeviceType
                 , OutResult<Int32> wErrorCode)
        {
            DMSDeviceType wResult = new DMSDeviceType();
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();


                String wSQL = StringUtils.Format("SELECT t.* FROM {0}.dms_device_type t  " +
                    "  WHERE    @wID != t.ID  and  ( (t.Name  = @wName  and   t.Active=1) or   t.Code  = @wCode ) ;", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wDMSDeviceType.ID);
                wParamMap.Add("wName", wDMSDeviceType.Name);
                wParamMap.Add("wCode", wDMSDeviceType.Code);

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

        private List<DMSDeviceType> DMS_SelectDeviceTypeList(BMSEmployee wLoginUser, int wID, String wName, String wCode,
              int wActive, OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceType> wResult = new List<DMSDeviceType>();
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.*,t3.Name as OperatorName FROM {0}.dms_device_type t " +
                    "  left join {0}.mbs_user t3 on t.OperatorID=t3.ID WHERE  1=1 "
                        + " and ( @wID <= 0 or t.ID  = @wID) and ( @wName ='' or t.Name  = @wName)  "
                        + " and ( @wCode =''  or t.Code  = @wCode) "
                        + "  and ( @wActive < 0 or t.Active  = @wActive);", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wID);
                wParamMap.Add("wName", wName);
                wParamMap.Add("wCode", wCode);
                wParamMap.Add("wActive", wActive);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSDeviceType wDeviceModelW = new DMSDeviceType();

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

        public List<DMSDeviceType> DMS_SelectDeviceTypeList(BMSEmployee wLoginUser, String wName, int wActive, OutResult<Int32> wErrorCode)
        {
            return this.DMS_SelectDeviceTypeList(wLoginUser, -1, wName, "",
                    wActive, wErrorCode);
        }

        public DMSDeviceType DMS_SelectDeviceType(BMSEmployee wLoginUser, int wID, string wCode, OutResult<Int32> wErrorCode)
        {
            DMSDeviceType wResult = new DMSDeviceType();
            try
            {
                List<DMSDeviceType> wDeviceTypeList = null;
                if (wID > 0)
                {
                    wDeviceTypeList = this.DMS_SelectDeviceTypeList(wLoginUser, wID, "", "",
                      -1, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wCode))
                {
                    wDeviceTypeList = this.DMS_SelectDeviceTypeList(wLoginUser, -1, "", wCode,
                      -1, wErrorCode);
                }
                else
                {
                    return wResult;
                }


                if (wDeviceTypeList != null && wDeviceTypeList.Count > 0)
                    wResult = wDeviceTypeList[0];

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public void DMS_UpdateDeviceType(BMSEmployee wLoginUser, DMSDeviceType wDMSDeviceType, OutResult<Int32> wErrorCode)
        {
            lock (mLockHelper)
            {
                try
                {

                    if (wDMSDeviceType == null || StringUtils.isEmpty(wDMSDeviceType.Name))
                    {
                        wErrorCode.set(MESException.Parameter.Value);
                        return;
                    }
                    if (wDMSDeviceType.ID > 0 && StringUtils.isEmpty(wDMSDeviceType.Code))
                    {
                        wErrorCode.set(MESException.Parameter.Value);
                        return;
                    }
                    DMSDeviceType wDMSDeviceTypeDB = this.DMS_CheckDeviceType(wLoginUser, wDMSDeviceType, wErrorCode);
                    if (wDMSDeviceTypeDB.ID > 0)
                    {
                        wErrorCode.Result = MESException.Duplication.Value;

                        return;
                    }
                    wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                    //生成唯一编码
                    if (StringUtils.isEmpty(wDMSDeviceType.Code))
                    {
                        int wMaxID = this.GetMaxPrimaryKey(StringUtils.Format("{0}.dms_device_type", wInstance), "ID");
                        wDMSDeviceType.Code = StringUtils.Format("DT-{0}", String.Format("{0:D3}", wMaxID + 1));
                    }

                    Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                    wParamMap.Add("Name", wDMSDeviceType.Name);
                    wParamMap.Add("Remark", wDMSDeviceType.Remark);
                    wParamMap.Add("Code", wDMSDeviceType.Code);
                    wParamMap.Add("OperatorID", wDMSDeviceType.OperatorID);
                    wParamMap.Add("OperateTime", DateTime.Now);
                    wParamMap.Add("Active", wDMSDeviceType.Active);

                    if (wDMSDeviceType.ID <= 0)
                    {

                        wDMSDeviceType.ID = this.Insert(StringUtils.Format("{0}.dms_device_type", wInstance), wParamMap);

                    }
                    else
                    {
                        wParamMap.Add("ID", wDMSDeviceType.ID);
                        this.Update(StringUtils.Format("{0}.dms_device_type", wInstance), "ID", wParamMap);
                    }
                }
                catch (Exception e)
                {
                    logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                    wErrorCode.set(MESException.DBSQL.Value);
                }
            }
        }

        public void DMS_ActiveDeviceType(BMSEmployee wLoginUser, List<Int32> wIDList,  int wActive,
                OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                if (wIDList == null)
                    wIDList = new List<Int32>();

                wIDList.RemoveAll(p => p <= 0);
                if (wIDList.Count <= 0)
                    return;
                if (wActive != 1)
                    wActive = 2;
                String wSql = StringUtils.Format("UPDATE {0}.dms_device_type SET Active ={1} WHERE ID IN({2}) ;",
                        wInstance, wActive, StringUtils.Join(",", wIDList));

                this.ExecuteSqlTransaction(wSql);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public void DMS_DeleteDeviceType(BMSEmployee wLoginUser, List<Int32> wIDList,  
                OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                if (wIDList == null)
                    wIDList = new List<Int32>();
                wIDList.RemoveAll(p => p <= 0);
                if (wIDList.Count <= 0)
                    return;

                String wSql = StringUtils.Format("Delete from {0}.dms_device_type WHERE Active =0  and ID IN({1}) ;",
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
