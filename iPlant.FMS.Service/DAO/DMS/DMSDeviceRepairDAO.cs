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
    class DMSDeviceRepairDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSDeviceRepairDAO));




        private static DMSDeviceRepairDAO Instance;

        private DMSDeviceRepairDAO() : base()
        {

        }

        public static DMSDeviceRepairDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSDeviceRepairDAO();
            return Instance;
        }

        // (public\s+[a-zA-z0-9_\<\>]+\s+[a-zA-z0-9_\<\>]+\()([^\)]*)\)

        private DMSDeviceRepair DMS_CheckDeviceRepair(BMSEmployee wLoginUser, DMSDeviceRepair wDMSDeviceRepair
                 , OutResult<Int32> wErrorCode)
        {
            DMSDeviceRepair wResult = new DMSDeviceRepair();
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();


                String wSQL = StringUtils.Format("SELECT t.* FROM {0}.dms_device_repair t  " +
                    "  WHERE    @wID != t.ID  and  (  t.DeviceID  = @wDeviceID and t.Status=1  " +
                    "  and (t.AlarmName  = @wAlarmName  or ( @wAlarmCode != ''  and t.AlarmCode=@wAlarmCode)   ) ) ;", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamDictionary = new Dictionary<String, Object>();

                wParamDictionary.Add("wDeviceID", wDMSDeviceRepair.DeviceID);
                wParamDictionary.Add("wID", wDMSDeviceRepair.ID);
                wParamDictionary.Add("wAlarmName", wDMSDeviceRepair.AlarmName);
                wParamDictionary.Add("wAlarmCode", wDMSDeviceRepair.AlarmCode);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamDictionary);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wResult.Code = StringUtils.parseString(wReader["Code"]);
                    wResult.AlarmCode = StringUtils.parseString(wReader["AlarmCode"]);
                    wResult.AlarmName = StringUtils.parseString(wReader["AlarmName"]);
                    wResult.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wResult.Status = StringUtils.parseInt(wReader["Status"]);
                    wResult.AlarmRemark = StringUtils.parseString(wReader["AlarmRemark"]);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        private List<DMSDeviceRepair> DMS_SelectDeviceRepairList(BMSEmployee wLoginUser, int wID, String wCode,
            int wDeviceID, String wDeviceNo, int wAlarmType, int wAlarmLevel, int wStatus, DateTime wStartTime, DateTime wEndTime,
            Pagination wPagination,
               OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceRepair> wResult = new List<DMSDeviceRepair>();
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

                if (wCode == null)
                    wCode = "";
                if (wDeviceNo == null)
                    wDeviceNo = "";




                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();

                String wSQL = StringUtils.Format(
                     "SELECT t.*,t1.Code as DeviceNo,t1.Name as DeviceName "
                      + " FROM {0}.dms_device_repair t "
                      + " inner join {0}.dms_device_ledger t1 on t.DeviceID=t1.ID  WHERE  1=1 "
                      + " and ( @wID <= 0 or t.ID  = @wID)  "
                      + " and ( @wCode =''  or t.Code  = @wCode) "
                      + " and ( @wDeviceID <= 0 or t.DeviceID  = @wDeviceID)  "
                      + " and ( @wDeviceNo =''  or t.Code  = @wDeviceNo) "
                      + " and ( @wAlarmLevel <= 0 or t.AlarmLevel  = @wAlarmLevel) "
                      + " and ( @wAlarmType < 0 or t.AlarmType  = @wAlarmType) "
                      + " and ( @wStatus < 0 or t.Status  = @wStatus) "
                      + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d') or t.RepairTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wStartTime <= t.RepairTime) "
                      + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wEndTime >= t.CreateTime)  ", wInstance);

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wID);
                wParamMap.Add("wCode", wCode);
                wParamMap.Add("wDeviceID", wDeviceID);
                wParamMap.Add("wDeviceNo", wDeviceNo);
                wParamMap.Add("wAlarmLevel", wAlarmLevel);
                wParamMap.Add("wAlarmType", wAlarmType);
                wParamMap.Add("wStatus", wStatus);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);


                wSQL = this.DMLChange(wSQL);


                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);
                if (wQueryResult.Count <= 0)
                    return wResult;
                List<BMSEmployee> wBMSEmployeeList = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeAll(wLoginUser,-1, wErrorCode);
                Dictionary<int, String> wBMSEmployeeNameDic = wBMSEmployeeList.ToDictionary(p => p.ID, p => p.Name);


                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSDeviceRepair wDeviceModelW = new DMSDeviceRepair();

                    wDeviceModelW.ID = StringUtils.parseInt(wReader["ID"]);
                    wDeviceModelW.Code = StringUtils.parseString(wReader["Code"]);
                    wDeviceModelW.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wDeviceModelW.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wDeviceModelW.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wDeviceModelW.AlarmCode = StringUtils.parseString(wReader["AlarmCode"]);
                    wDeviceModelW.AlarmLevel = StringUtils.parseInt(wReader["AlarmLevel"]);
                    wDeviceModelW.AlarmType = StringUtils.parseInt(wReader["AlarmType"]);
                    wDeviceModelW.AlarmName = StringUtils.parseString(wReader["AlarmName"]);
                    wDeviceModelW.AlarmRemark = StringUtils.parseString(wReader["AlarmRemark"]);
                    wDeviceModelW.AlarmImageList = StringUtils.splitList(wReader["AlarmImageList"], " |,| ");
                    wDeviceModelW.CreatorID = StringUtils.parseInt(wReader["CreatorID"]);
                    wDeviceModelW.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wDeviceModelW.RepairerIDList = StringUtils.parseIntList(wReader["RepairerIDList"], ",");
                    wDeviceModelW.RepairTime = StringUtils.parseDate(wReader["RepairTime"]);
                    wDeviceModelW.RepairRemark = StringUtils.parseString(wReader["RepairRemark"]);
                    wDeviceModelW.RepairImageList = StringUtils.splitList(wReader["RepairImageList"], " |,| ");
                    wDeviceModelW.Status = StringUtils.parseInt(wReader["Status"]);
                    wDeviceModelW.RepairEndTime = StringUtils.parseDate(wReader["RepairEndTime"]);
                    wDeviceModelW.RepairStartTime = StringUtils.parseDate(wReader["RepairStartTime"]);
                    wDeviceModelW.Creator = StringUtils.parseName(wDeviceModelW.CreatorID, wBMSEmployeeNameDic);
                    wDeviceModelW.Repairer = StringUtils.parseName(wDeviceModelW.RepairerIDList, wBMSEmployeeNameDic); ;

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

        public List<DMSDeviceRepair> DMS_SelectDeviceRepairList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, int wAlarmType, int wAlarmLevel, int wStatus, DateTime wStartTime, DateTime wEndTime,
                Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            return this.DMS_SelectDeviceRepairList(wLoginUser, -1, "", wDeviceID, wDeviceNo, wAlarmType, wAlarmLevel, wStatus, wStartTime,
                    wEndTime, wPagination, wErrorCode);
        }

        public DMSDeviceRepair DMS_SelectDeviceRepair(BMSEmployee wLoginUser, int wID, string wCode, OutResult<Int32> wErrorCode)
        {
            DMSDeviceRepair wResult = new DMSDeviceRepair();
            try
            {
                List<DMSDeviceRepair> wDeviceRepairList = null;
                if (wID > 0)
                {
                    wDeviceRepairList = this.DMS_SelectDeviceRepairList(wLoginUser, wID, "", -1, "", -1, -1,
                      -1, new DateTime(2000, 1, 1), new DateTime(2000, 1, 1), Pagination.Default, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wCode))
                {
                    wDeviceRepairList = this.DMS_SelectDeviceRepairList(wLoginUser, -1, wCode, -1, "", -1, -1,
                      -1, new DateTime(2000, 1, 1), new DateTime(2000, 1, 1), Pagination.Default, wErrorCode);
                }
                else
                {
                    return wResult;
                }


                if (wDeviceRepairList != null && wDeviceRepairList.Count > 0)
                    wResult = wDeviceRepairList[0];

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public void DMS_UpdateDeviceRepair(BMSEmployee wLoginUser, DMSDeviceRepair wDMSDeviceRepair, OutResult<Int32> wErrorCode)
        {
            lock (mLockHelper)
            {
                try
                {

                    if (wDMSDeviceRepair == null || StringUtils.isEmpty(wDMSDeviceRepair.AlarmName))
                    {
                        wErrorCode.set(MESException.Parameter.Value);
                        return;
                    }
                    if (wDMSDeviceRepair.ID > 0 && StringUtils.isEmpty(wDMSDeviceRepair.Code))
                    {
                        wErrorCode.set(MESException.Parameter.Value);
                        return;
                    }
                    DMSDeviceRepair wDMSDeviceRepairDB = this.DMS_CheckDeviceRepair(wLoginUser, wDMSDeviceRepair, wErrorCode);
                    if (wDMSDeviceRepairDB.ID > 0)
                    {
                        wErrorCode.Result = MESException.Duplication.Value;

                        return;
                    }
                    wErrorCode.set(0);
                    String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                    //生成唯一编码
                    if (StringUtils.isEmpty(wDMSDeviceRepair.Code))
                    {
                        wDMSDeviceRepair.Code = this.CreateMaxCode(StringUtils.Format("{0}.dms_device_repair", wInstance), "RRO{yyyyMM}","Code",5 );
                    }
                    if (wDMSDeviceRepair.RepairerIDList == null)
                        wDMSDeviceRepair.RepairerIDList = new List<int>();

                    if (wDMSDeviceRepair.Status == 1)
                    {
                        if (wDMSDeviceRepair.CreateTime <= new DateTime(2010, 1, 1))
                            wDMSDeviceRepair.CreateTime = DateTime.Now;
                        if (wDMSDeviceRepair.CreatorID <= 0)
                            wDMSDeviceRepair.CreatorID = wLoginUser.ID;
                    }
                    else if (wDMSDeviceRepair.Status == 2)
                    {

                        if (wDMSDeviceRepair.RepairTime <= new DateTime(2010, 1, 1))
                            wDMSDeviceRepair.RepairTime = DateTime.Now;

                        if (wDMSDeviceRepair.RepairerIDList.Count <= 0)
                            wDMSDeviceRepair.RepairerIDList.Add(wLoginUser.ID);
                    }

                    Dictionary<String, Object> wParamDictionary = new Dictionary<String, Object>();

                    wParamDictionary.Add("Code", wDMSDeviceRepair.Code);
                    wParamDictionary.Add("DeviceID", wDMSDeviceRepair.DeviceID);
                    wParamDictionary.Add("AlarmLevel", wDMSDeviceRepair.AlarmLevel);
                    wParamDictionary.Add("AlarmType", wDMSDeviceRepair.AlarmType);
                    wParamDictionary.Add("AlarmCode", wDMSDeviceRepair.AlarmCode);
                    wParamDictionary.Add("AlarmName", wDMSDeviceRepair.AlarmName);
                    wParamDictionary.Add("AlarmRemark", wDMSDeviceRepair.AlarmRemark);
                    wParamDictionary.Add("AlarmImageList", StringUtils.Join(" |,| ", wDMSDeviceRepair.AlarmImageList));

                    wParamDictionary.Add("Status", wDMSDeviceRepair.Status);
                    wParamDictionary.Add("CreatorID", wDMSDeviceRepair.CreatorID);
                    wParamDictionary.Add("CreateTime", wDMSDeviceRepair.CreateTime);
                    wParamDictionary.Add("RepairerIDList", StringUtils.Join(",", wDMSDeviceRepair.RepairerIDList));
                    wParamDictionary.Add("RepairTime", wDMSDeviceRepair.RepairTime);
                    wParamDictionary.Add("RepairRemark", wDMSDeviceRepair.RepairRemark);
                    wParamDictionary.Add("RepairImageList", StringUtils.Join(" |,| ", wDMSDeviceRepair.RepairImageList));

                    wParamDictionary.Add("RepairStartTime", wDMSDeviceRepair.RepairStartTime);
                    wParamDictionary.Add("RepairEndTime", wDMSDeviceRepair.RepairEndTime);

                    if (wDMSDeviceRepair.ID <= 0)
                    {

                        wDMSDeviceRepair.ID = this.Insert(StringUtils.Format("{0}.dms_device_repair", wInstance), wParamDictionary);

                    }
                    else
                    {
                        wParamDictionary.Add("ID", wDMSDeviceRepair.ID);
                        this.Update(StringUtils.Format("{0}.dms_device_repair", wInstance), "ID", wParamDictionary);
                    }
                }
                catch (Exception e)
                {
                    logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                    wErrorCode.set(MESException.DBSQL.Value);
                }
            }
        }

        public void DMS_DeleteDeviceRepair(BMSEmployee wLoginUser, List<Int32> wIDList,
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

                String wSql = StringUtils.Format("Delete from {0}.dms_device_repair WHERE Status in (0,1)  and ID IN({1}) ;",
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
