using System;
using System.Collections.Generic;
using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iPlant.Data.EF;

namespace iPlant.FMC.Service
{
    class WMSAgvTaskDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(WMSAgvTaskDAO));

        private static WMSAgvTaskDAO Instance;

        public List<WMSAgvTask> WMS_SelectAgvTaskAll(BMSEmployee wLoginUser, int wID, String wCode, int wLineID, int wDeviceID, String wDeviceLike,
            int wSourcePositionID, String wSourcePositionLike, int wTaskType,
            List<int> wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<WMSAgvTask> wResult = new List<WMSAgvTask>();
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (StringUtils.isNotEmpty(wDeviceLike))
                {
                    wDeviceLike = "%" + wDeviceLike + "%";
                }
                if (StringUtils.isNotEmpty(wSourcePositionLike))
                {
                    wSourcePositionLike = "%" + wSourcePositionLike + "%";
                }
                if (wStatus == null)
                    wStatus = new List<int>();

                wStatus.RemoveAll(p => p <= 0);


                String wSQL = StringUtils.Format(
                        " SELECT t.*,t1.Name as DeviceName,t1.Code as DeviceNo,t2.Name as  LineName," +
                        " t3.Name as SourcePositionName ,t3.Code as SourcePositionCode,t4.Name as ConfirmerName" +
                        " From  {0}.wms_agvtask t inner join {0}.dms_device_ledger t1 on t.DeviceID=t1.ID" +
                        " inner join {0}.dms_device_ledger t3 on t.SourcePositionID=t3.ID  " +
                        " left join {0}.fmc_line t2 on t3.LineID=t2.ID" +
                        " left join {0}.mbs_user t4 on t.ConfirmerID=t4.ID" +
                        " WHERE 1=1 and (@wID <= 0 or @wID=t.ID) " +
                        " and (@wCode = '' or  @wCode = t.Code ) " +
                        " and (@wTaskType <= 0 or @wTaskType = t.TaskType   ) " +
                        " and (@wLineID <= 0 or @wLineID = t3.LineID or @wLineID = t1.LineID  ) " +
                        " and (@wDeviceID <= 0 or @wDeviceID = t.DeviceID   ) " +
                        " and (@wDeviceLike = '' or  t1.Code like @wDeviceLike or  t1.Name like @wDeviceLike) " +
                        " and (@wSourcePositionID <= 0 or @wSourcePositionID = t.SourcePositionID   ) " +
                        " and (@wSourcePositionLike = '' or  t3.Code like @wSourcePositionLike or  t3.Name like @wSourcePositionLike) " +
                        " and ( @wStatus = '' or  t.Status in  ( {1})   ) " +
                        " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wStartTime <= t.EditTime) " +
                        " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= t.CreateTime)  ", wInstance,
                        wStatus.Count > 0 ? StringUtils.Join(",", wStatus) : "0");

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wID", wID);
                wParamMap.Add("wCode", wCode);
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wDeviceID", wDeviceID);
                wParamMap.Add("wDeviceLike", wDeviceLike);
                wParamMap.Add("wSourcePositionID", wSourcePositionID);
                wParamMap.Add("wSourcePositionLike", wSourcePositionLike);
                wParamMap.Add("wTaskType", wTaskType);
                wParamMap.Add("wStatus", StringUtils.Join(",", wStatus));
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                wSQL = this.DMLChange(wSQL);

                wResult = this.QueryForList<WMSAgvTask>(wSQL, wParamMap, wPagination);

            }
            catch (Exception e)
            {

                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

            }
            return wResult;
        }





        public WMSAgvTask WMS_CheckAgvTask(BMSEmployee wLoginUser, WMSAgvTask wWMSAgvTask, OutResult<Int32> wErrorCode)
        {

            WMSAgvTask wResult = new WMSAgvTask();
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                List<int> wAgvStatus = StringUtils.parseListArgs(((int)WMSAgvTaskStatus.Default), ((int)WMSAgvTaskStatus.WiatConfirm),
                    ((int)WMSAgvTaskStatus.WaitStart), ((int)WMSAgvTaskStatus.Staring), ((int)WMSAgvTaskStatus.Started));

                String wSQL = StringUtils.Format(
                        " SELECT t.*  From  {0}.wms_agvtask t  WHERE   @wID !=t.ID " +
                        " and (( @wTaskType = t.TaskType  " +
                        " and @wSourcePositionID = t.SourcePositionID    " +
                        " and t.Status in ({1})) or t.Code =@wCode  )", wInstance, StringUtils.Join(",", wAgvStatus));

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wCode", wWMSAgvTask.Code);
                wParamMap.Add("wID", wWMSAgvTask.ID);
                wParamMap.Add("wSourcePositionID", wWMSAgvTask.SourcePositionID);
                wParamMap.Add("wTaskType", wWMSAgvTask.TaskType);

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.Code = StringUtils.parseString(wReader["Code"]);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

            }
            return wResult;
        }

        public WMSAgvTask WMS_SelectAgvTask(BMSEmployee wLoginUser, int wID, String wCode, OutResult<Int32> wErrorCode)
        {
            WMSAgvTask wResult = new WMSAgvTask();
            try
            {
                if (wID <= 0 && StringUtils.isEmpty(wCode))
                    return wResult;

                List<WMSAgvTask> wWMSAgvTaskList = WMS_SelectAgvTaskAll(wLoginUser, wID, wCode,
                    -1, -1, "", -1, "", -1, null, new DateTime(2000, 1, 1), new DateTime(2000, 1, 1), Pagination.Default, wErrorCode);

                if (wWMSAgvTaskList.Count > 0)
                {
                    wResult = wWMSAgvTaskList[0];
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

            }
            return wResult;
        }

        public void WMS_UpdateAgvTask(BMSEmployee wLoginUser, WMSAgvTask wWMSAgvTask, OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0);
                if (wWMSAgvTask == null || wWMSAgvTask.SourcePositionID <= 0 || wWMSAgvTask.TaskType <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                if (wWMSAgvTask.ID > 0 && StringUtils.isEmpty(wWMSAgvTask.Code))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                WMSAgvTask wAgvTask = WMS_CheckAgvTask(wLoginUser, wWMSAgvTask, wErrorCode);

                if (wAgvTask.ID > 0)
                {
                    if (wWMSAgvTask.ID <= 0)
                    {
                        wWMSAgvTask.ID = wAgvTask.ID;
                    }
                    else {
                        wErrorCode.set(MESException.Duplication.Value);
                        return;
                    }
                } 
                
                String wInstance = MESDBSource.Basic.getDBName();

                wWMSAgvTask.EditTime = DateTime.Now;

                Dictionary<String, Object> wParams = new Dictionary<string, object>();
                wParams.Add("Code", wWMSAgvTask.Code);
                wParams.Add("DeviceID", wWMSAgvTask.DeviceID);
                wParams.Add("TaskType", wWMSAgvTask.TaskType);
                wParams.Add("SourcePositionID", wWMSAgvTask.SourcePositionID);
                wParams.Add("TargetPositionCode", wWMSAgvTask.TargetPositionCode);
                wParams.Add("DeliveryNum", wWMSAgvTask.DeliveryNum);
                wParams.Add("CreateTime", wWMSAgvTask.CreateTime);
                wParams.Add("StartTime", wWMSAgvTask.StartTime);
                wParams.Add("ArriveTime", wWMSAgvTask.ArriveTime);
                wParams.Add("EndTime", wWMSAgvTask.EndTime);
                wParams.Add("Status", wWMSAgvTask.Status);
                wParams.Add("ConfirmerID", wWMSAgvTask.ConfirmerID);
                wParams.Add("ConfirmTime", wWMSAgvTask.ConfirmTime);
                wParams.Add("EditTime", wWMSAgvTask.EditTime);
                wParams.Add("Remark", wWMSAgvTask.Remark);

                if (wWMSAgvTask.ID <= 0)
                {
                    wWMSAgvTask.ID = this.Insert(StringUtils.Format(" {0}.wms_agvtask ", wInstance), wParams);
                }
                else
                {
                    wParams.Add("ID", wWMSAgvTask.ID);
                    this.Update(StringUtils.Format(" {0}.wms_agvtask ", wInstance), "ID", wParams);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

            }
        }
        public void WMS_UpdateAgvTaskStatus(BMSEmployee wLoginUser, int wTaskID, String wTaskCode, int wStatus, DateTime wStatusTime,
            int wConfirmerID, String wTargetPosition, OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                WMSAgvTask wWMSAgvTask = this.WMS_SelectAgvTask(wLoginUser, wTaskID, wTaskCode, wErrorCode);
                if (wErrorCode.Result != 0 || wWMSAgvTask == null || wWMSAgvTask.ID <= 0)
                    return;

                if (wWMSAgvTask.Status == wStatus)
                    return;
                if (!Enum.TryParse<WMSAgvTaskStatus>(wStatus + "", out WMSAgvTaskStatus wWMSAgvTaskStatus))
                {
                    return;
                }

                if (wStatusTime < new DateTime(2010, 1, 1))
                    wStatusTime = DateTime.Now;
                if (wConfirmerID <= 0 && wConfirmerID != BaseDAO.SysAdmin.ID)
                    wConfirmerID = wLoginUser.ID;
                wWMSAgvTask.Status = wStatus;
                wWMSAgvTask.EditTime = DateTime.Now;
                switch (wWMSAgvTaskStatus)
                {
                    case WMSAgvTaskStatus.WiatConfirm:
                        wWMSAgvTask.StartTime = new DateTime(2000, 1, 1);
                        wWMSAgvTask.ArriveTime = new DateTime(2000, 1, 1);
                        wWMSAgvTask.EndTime = new DateTime(2000, 1, 1);
                        wWMSAgvTask.ConfirmTime = new DateTime(2000, 1, 1);
                        wWMSAgvTask.ConfirmerID = 0;
                        wWMSAgvTask.TargetPositionCode = "";
                        break;
                    case WMSAgvTaskStatus.WaitStart:
                        wWMSAgvTask.StartTime = new DateTime(2000, 1, 1);
                        wWMSAgvTask.ArriveTime = new DateTime(2000, 1, 1);
                        wWMSAgvTask.EndTime = new DateTime(2000, 1, 1);
                        wWMSAgvTask.ConfirmTime = wStatusTime;
                        wWMSAgvTask.ConfirmerID = wConfirmerID;
                        wWMSAgvTask.TargetPositionCode = "";
                        break;
                    case WMSAgvTaskStatus.Staring:

                        wWMSAgvTask.StartTime = new DateTime(2000, 1, 1);
                        wWMSAgvTask.ArriveTime = new DateTime(2000, 1, 1);
                        wWMSAgvTask.EndTime = new DateTime(2000, 1, 1);
                        wWMSAgvTask.TargetPositionCode = "";
                        if (wWMSAgvTask.ConfirmTime <= wWMSAgvTask.ArriveTime)
                        {
                            wWMSAgvTask.ConfirmTime = wStatusTime;
                            wWMSAgvTask.ConfirmerID = wConfirmerID;
                        }
                        break;
                    case WMSAgvTaskStatus.Started:
                        wWMSAgvTask.StartTime = wStatusTime;
                        wWMSAgvTask.ArriveTime = new DateTime(2000, 1, 1);
                        wWMSAgvTask.EndTime = new DateTime(2000, 1, 1);
                        wWMSAgvTask.TargetPositionCode = "";
                        if (wWMSAgvTask.ConfirmTime <= wWMSAgvTask.ArriveTime)
                        {
                            wWMSAgvTask.ConfirmTime = wStatusTime;
                            wWMSAgvTask.ConfirmerID = wConfirmerID;
                        }
                        break;
                    case WMSAgvTaskStatus.Arrived:
                        wWMSAgvTask.ArriveTime = wStatusTime;
                        wWMSAgvTask.EndTime = new DateTime(2000, 1, 1);
                        if (StringUtils.isNotEmpty(wTargetPosition))
                            wWMSAgvTask.TargetPositionCode = wTargetPosition;
                        if (wWMSAgvTask.StartTime <= wWMSAgvTask.EndTime)
                        {
                            wWMSAgvTask.StartTime = wStatusTime;
                        }
                        if (wWMSAgvTask.ConfirmTime <= wWMSAgvTask.ArriveTime)
                        {
                            wWMSAgvTask.ConfirmTime = wStatusTime;
                            wWMSAgvTask.ConfirmerID = wConfirmerID;
                        }
                        break;
                    case WMSAgvTaskStatus.End:
                        wWMSAgvTask.EndTime = wStatusTime;
                        if (StringUtils.isEmpty(wWMSAgvTask.TargetPositionCode))
                            wWMSAgvTask.TargetPositionCode = wTargetPosition;
                        if (wWMSAgvTask.ArriveTime <= new DateTime(2000, 1, 1))
                        {
                            wWMSAgvTask.ArriveTime = wStatusTime;
                        }
                        if (wWMSAgvTask.StartTime <= wWMSAgvTask.EndTime)
                        {
                            wWMSAgvTask.StartTime = wStatusTime;
                        }
                        if (wWMSAgvTask.ConfirmTime <= wWMSAgvTask.ArriveTime)
                        {
                            wWMSAgvTask.ConfirmTime = wStatusTime;
                            wWMSAgvTask.ConfirmerID = wConfirmerID;
                        }
                        break;
                    case WMSAgvTaskStatus.Cancle:
                        wWMSAgvTask.EndTime = wStatusTime;
                        if (StringUtils.isEmpty(wWMSAgvTask.TargetPositionCode))
                            wWMSAgvTask.TargetPositionCode = wTargetPosition;
                        if (wWMSAgvTask.ArriveTime <= new DateTime(2000, 1, 1))
                        {
                            wWMSAgvTask.ArriveTime = wStatusTime;
                        }
                        if (wWMSAgvTask.StartTime <= wWMSAgvTask.EndTime)
                        {
                            wWMSAgvTask.StartTime = wStatusTime;
                        }
                        if (wWMSAgvTask.ConfirmTime <= wWMSAgvTask.ArriveTime)
                        {
                            wWMSAgvTask.ConfirmTime = wStatusTime;
                            wWMSAgvTask.ConfirmerID = wConfirmerID;
                        }
                        break;
                    case WMSAgvTaskStatus.Default:
                    default:
                        return;
                }

                wWMSAgvTask.EditTime = DateTime.Now;

                Dictionary<String, Object> wParams = new Dictionary<string, object>();

                wParams.Add("TargetPositionCode", wWMSAgvTask.TargetPositionCode);
                wParams.Add("CreateTime", wWMSAgvTask.CreateTime);
                wParams.Add("StartTime", wWMSAgvTask.StartTime);
                wParams.Add("ArriveTime", wWMSAgvTask.ArriveTime);
                wParams.Add("EndTime", wWMSAgvTask.EndTime);
                wParams.Add("Status", wWMSAgvTask.Status);
                wParams.Add("ConfirmerID", wWMSAgvTask.ConfirmerID);
                wParams.Add("ConfirmTime", wWMSAgvTask.ConfirmTime);
                wParams.Add("EditTime", wWMSAgvTask.EditTime);
                wParams.Add("ID", wWMSAgvTask.ID);

                this.Update(StringUtils.Format(" {0}.wms_agvtask ", wInstance), "ID", wParams);


            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

            }
        }


        private WMSAgvTaskDAO() : base()

        {
        }

        public static WMSAgvTaskDAO getInstance()
        {
            if (Instance == null)
                Instance = new WMSAgvTaskDAO();
            return Instance;
        }

    }
}
