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
    class BMSRegionDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(BMSRegionDAO));




        private static BMSRegionDAO Instance;

        private BMSRegionDAO() : base()
        {

        }

        public static BMSRegionDAO getInstance()
        {
            if (Instance == null)
                Instance = new BMSRegionDAO();
            return Instance;
        }

        // (public\s+[a-zA-z0-9_\<\>]+\s+[a-zA-z0-9_\<\>]+\()([^\)]*)\)

        private BMSRegion BMS_CheckRegion(BMSEmployee wLoginUser, BMSRegion wBMSRegion
                 , OutResult<Int32> wErrorCode)
        {
            BMSRegion wResult = new BMSRegion();
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();


                String wSQL = StringUtils.Format("SELECT t.* FROM {0}.bms_region t  " +
                    "  WHERE    @wID != t.ID  and  ( (t.Name  = @wName  and   t.Active=1) or   t.Code  = @wCode ) ;", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wBMSRegion.ID);
                wParamMap.Add("wName", wBMSRegion.Name);
                wParamMap.Add("wCode", wBMSRegion.Code);

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

        private List<BMSRegion> BMS_SelectRegionList(BMSEmployee wLoginUser, int wID, String wName, String wCode,int wParentID,
              int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<BMSRegion> wResult = new List<BMSRegion>();
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.*,t2.Name as ParentName,t2.Code as ParentCode," +
                    "  t3.Name as OperatorName FROM {0}.bms_region t " +
                    "  left join {0}.bms_region t2 on t.ParentID=t2.ID" +
                    "  left join {0}.mbs_user t3 on t.OperatorID=t3.ID WHERE  1=1 "
                        + " and ( @wID <= 0 or t.ID  = @wID) and ( @wName ='' or t.Name  like @wName)  "
                        + " and ( @wCode =''  or t.Code  = @wCode) and ( @wParentID <= 0 or t.ParentID  = @wParentID) "
                        + "  and ( @wActive < 0 or t.Active  = @wActive) ", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wID);
                wParamMap.Add("wName", StringUtils.isEmpty(wName) ?wName :  "%" + wName + "%");
                wParamMap.Add("wCode", wCode);
                wParamMap.Add("wActive", wActive);
                wParamMap.Add("wParentID", wParentID);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    BMSRegion wDeviceModelW = new BMSRegion();

                    wDeviceModelW.ID = StringUtils.parseInt(wReader["ID"]);
                    wDeviceModelW.Name = StringUtils.parseString(wReader["Name"]);
                    wDeviceModelW.Code = StringUtils.parseString(wReader["Code"]);
                    wDeviceModelW.OperatorID = StringUtils.parseInt(wReader["OperatorID"]);
                    wDeviceModelW.ParentID = StringUtils.parseInt(wReader["ParentID"]);
                    wDeviceModelW.ParentName = StringUtils.parseString(wReader["ParentName"]);
                    wDeviceModelW.ParentCode = StringUtils.parseString(wReader["ParentCode"]);
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

        public List<BMSRegion> BMS_SelectRegionList(BMSEmployee wLoginUser, String wName, int wParentID, int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            return this.BMS_SelectRegionList(wLoginUser, -1, wName, "", wParentID,
                    wActive, wPagination,wErrorCode);
        }

        public List<BMSRegion> BMS_SelectRegionList(BMSEmployee wLoginUser,  int wActive,  OutResult<Int32> wErrorCode)
        {
            return this.BMS_SelectRegionList(wLoginUser, -1, "", "", -1,
                    wActive, Pagination.MaxSize, wErrorCode);
        }

        public BMSRegion BMS_SelectRegion(BMSEmployee wLoginUser, int wID, string wCode, OutResult<Int32> wErrorCode)
        {
            BMSRegion wResult = new BMSRegion();
            try
            {
                List<BMSRegion> wRegionList = null;
                if (wID > 0)
                {
                    wRegionList = this.BMS_SelectRegionList(wLoginUser, wID, "", "",-1,
                      -1, Pagination.Default, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wCode))
                {
                    wRegionList = this.BMS_SelectRegionList(wLoginUser, -1, "", wCode,-1,
                      -1, Pagination.Default, wErrorCode);
                }
                else
                {
                    return wResult;
                }


                if (wRegionList != null && wRegionList.Count > 0)
                    wResult = wRegionList[0];

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public void BMS_UpdateRegion(BMSEmployee wLoginUser, BMSRegion wBMSRegion, OutResult<Int32> wErrorCode)
        {
            lock (mLockHelper)
            {
                try
                {

                    if (wBMSRegion == null || StringUtils.isEmpty(wBMSRegion.Name))
                    {
                        wErrorCode.set(MESException.Parameter.Value);
                        return;
                    }
                    if (wBMSRegion.ID > 0 && StringUtils.isEmpty(wBMSRegion.Code))
                    {
                        wErrorCode.set(MESException.Parameter.Value);
                        return;
                    }
                    BMSRegion wBMSRegionDB = this.BMS_CheckRegion(wLoginUser, wBMSRegion, wErrorCode);
                    if (wBMSRegionDB.ID > 0)
                    {
                        wErrorCode.Result = MESException.Duplication.Value;

                        return;
                    }
                    wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                    //生成唯一编码
                    if (StringUtils.isEmpty(wBMSRegion.Code))
                    {
                        wBMSRegion.Code = "";

                        int wMaxID = this.GetMaxPrimaryKey(StringUtils.Format("{0}.bms_region", wInstance), "ID");
                        wBMSRegion.Code = StringUtils.Format("DT-{0}", String.Format("{0:D3}", wMaxID + 1));
                    }

                    Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                    wParamMap.Add("Name", wBMSRegion.Name);
                    wParamMap.Add("Remark", wBMSRegion.Remark);
                    wParamMap.Add("Code", wBMSRegion.Code);
                    wParamMap.Add("OperatorID", wBMSRegion.OperatorID);
                    wParamMap.Add("OperateTime", DateTime.Now);
                    wParamMap.Add("Active", wBMSRegion.Active); 
                    wParamMap.Add("ParentID", wBMSRegion.ParentID); 
                    if (wBMSRegion.ID <= 0)
                    {

                        wBMSRegion.ID = this.Insert(StringUtils.Format("{0}.bms_region", wInstance), wParamMap);

                    }
                    else
                    {
                        wParamMap.Add("ID", wBMSRegion.ID);
                        this.Update(StringUtils.Format("{0}.bms_region", wInstance), "ID", wParamMap);
                    }
                }
                catch (Exception e)
                {
                    logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                    wErrorCode.set(MESException.DBSQL.Value);
                }
            }
        }

        public void BMS_ActiveRegion(BMSEmployee wLoginUser, List<Int32> wIDList,  int wActive,
                OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                if (wIDList == null)
                    wIDList = new List<Int32>();

                wIDList.RemoveAll(p => p <= 0);
                if (wIDList.Count <= 0)
                    return;
                if (wActive != 1)
                    wActive = 2;
                String wSql = StringUtils.Format("UPDATE {0}.bms_region SET Active ={1} WHERE ID IN({2}) ;",
                        wInstance, wActive, StringUtils.Join(",", wIDList));

                this.ExecuteSqlTransaction(wSql);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public void BMS_DeleteRegion(BMSEmployee wLoginUser, List<Int32> wIDList,  
                OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                if (wIDList == null)
                    wIDList = new List<Int32>();
                wIDList.RemoveAll(p => p <= 0);
                if (wIDList.Count <= 0)
                    return;

                String wSql = StringUtils.Format("Delete from {0}.bms_region WHERE Active =0  and ID IN({1}) ;",
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
