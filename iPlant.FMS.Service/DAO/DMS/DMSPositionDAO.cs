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
    class DMSPositionDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSPositionDAO));




        private static DMSPositionDAO Instance;

        private DMSPositionDAO() : base()
        {

        }

        public static DMSPositionDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSPositionDAO();
            return Instance;
        }

        // (public\s+[a-zA-z0-9_\<\>]+\s+[a-zA-z0-9_\<\>]+\()([^\)]*)\)

        private DMSPosition DMS_CheckPosition(BMSEmployee wLoginUser, DMSPosition wDMSPosition
                 , OutResult<Int32> wErrorCode)
        {
            DMSPosition wResult = new DMSPosition();
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();


                String wSQL = StringUtils.Format("SELECT t.* FROM {0}.dms_position t  " +
                    "  WHERE    @wID != t.ID  and  ( (t.Name  = @wName and t.LineID=@wLineID  and   t.Active=1) or   t.Code  = @wCode ) ;", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wDMSPosition.ID);
                wParamMap.Add("wName", wDMSPosition.Name);
                wParamMap.Add("wCode", wDMSPosition.Code);
                wParamMap.Add("wLineID", wDMSPosition.LineID);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.LineID = StringUtils.parseInt(wReader["LineID"]);
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

        private List<DMSPosition> DMS_SelectPositionList(BMSEmployee wLoginUser, int wID, int wLineID, String wName, String wCode,
              int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<DMSPosition> wResult = new List<DMSPosition>();
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.*,t3.Name as OperatorName,t2.Name as LineName FROM {0}.dms_position t " +
                    "  left join {0}.fmc_line t2 on t.LineID=t2.ID left join {0}.mbs_user t3 on t.OperatorID=t3.ID WHERE  1=1 "
                        + " and ( @wID <= 0 or t.ID  = @wID) and ( @wName ='' or t.Name  = @wName)  "
                        + " and ( @wCode =''  or t.Code  = @wCode) and ( @wLineID <= 0 or t.LineID  = @wLineID) "
                        + " and ( @wActive < 0 or t.Active  = @wActive)", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wID);
                wParamMap.Add("wName", wName);
                wParamMap.Add("wCode", wCode);
                wParamMap.Add("wActive", wActive);
                wParamMap.Add("wLineID", wLineID);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSPosition wDeviceModelW = new DMSPosition();

                    wDeviceModelW.ID = StringUtils.parseInt(wReader["ID"]);
                    wDeviceModelW.Name = StringUtils.parseString(wReader["Name"]);
                    wDeviceModelW.Code = StringUtils.parseString(wReader["Code"]);
                    wDeviceModelW.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wDeviceModelW.LineName = StringUtils.parseString(wReader["LineName"]);
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

        public List<DMSPosition> DMS_SelectPositionList(BMSEmployee wLoginUser, int wLineID, String wName, int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            return this.DMS_SelectPositionList(wLoginUser, -1, wLineID, wName, "",
                    wActive, wPagination, wErrorCode);
        }

        public DMSPosition DMS_SelectPosition(BMSEmployee wLoginUser, int wID, string wCode, OutResult<Int32> wErrorCode)
        {
            DMSPosition wResult = new DMSPosition();
            try
            {
                List<DMSPosition> wPositionList = null;
                if (wID > 0)
                {
                    wPositionList = this.DMS_SelectPositionList(wLoginUser, wID, -1, "", "",
                      -1, Pagination.Default, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wCode))
                {
                    wPositionList = this.DMS_SelectPositionList(wLoginUser, -1, -1, "", wCode,
                      -1, Pagination.Default, wErrorCode);
                }
                else
                {
                    return wResult;
                }


                if (wPositionList != null && wPositionList.Count > 0)
                    wResult = wPositionList[0];

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public void DMS_UpdatePosition(BMSEmployee wLoginUser, DMSPosition wDMSPosition, OutResult<Int32> wErrorCode)
        {
            lock (mLockHelper)
            {
                try
                {

                    if (wDMSPosition == null || StringUtils.isEmpty(wDMSPosition.Name))
                    {
                        wErrorCode.set(MESException.Parameter.Value);
                        return;
                    }
                    if (wDMSPosition.ID > 0 && StringUtils.isEmpty(wDMSPosition.Code))
                    {
                        wErrorCode.set(MESException.Parameter.Value);
                        return;
                    }
                    DMSPosition wDMSPositionDB = this.DMS_CheckPosition(wLoginUser, wDMSPosition, wErrorCode);
                    if (wDMSPositionDB.ID > 0)
                    {
                        wErrorCode.Result = MESException.Duplication.Value;

                        return;
                    }
                    wErrorCode.set(0);
                    String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                    //生成唯一编码
                    if (StringUtils.isEmpty(wDMSPosition.Code))
                    {
                        wDMSPosition.Code = this.CreateMaxCode(StringUtils.Format("{0}.dms_position", wInstance), "POS-", "Code", 4); 
                    }

                    Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                    wParamMap.Add("Name", wDMSPosition.Name);
                    wParamMap.Add("LineID", wDMSPosition.LineID);
                    wParamMap.Add("Remark", wDMSPosition.Remark);
                    wParamMap.Add("Code", wDMSPosition.Code);
                    wParamMap.Add("OperatorID", wDMSPosition.OperatorID);
                    wParamMap.Add("OperateTime", DateTime.Now);
                    wParamMap.Add("Active", wDMSPosition.Active);

                    if (wDMSPosition.ID <= 0)
                    {

                        wDMSPosition.ID = this.Insert(StringUtils.Format("{0}.dms_position", wInstance), wParamMap);

                    }
                    else
                    {
                        wParamMap.Add("ID", wDMSPosition.ID);
                        this.Update(StringUtils.Format("{0}.dms_position", wInstance), "ID", wParamMap);
                    }
                }
                catch (Exception e)
                {
                    logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                    wErrorCode.set(MESException.DBSQL.Value);
                }
            }
        }

        public void DMS_ActivePosition(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive,
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
                String wSql = StringUtils.Format("UPDATE {0}.dms_position SET Active ={1} WHERE ID IN({2}) ;",
                        wInstance, wActive, StringUtils.Join(",", wIDList));

                this.ExecuteSqlTransaction(wSql);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public void DMS_DeletePosition(BMSEmployee wLoginUser, List<Int32> wIDList,
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

                String wSql = StringUtils.Format("Delete from {0}.dms_position WHERE Active =0  and ID IN({1}) ;",
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
