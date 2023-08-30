using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    public class WMSServiceImpl : WMSService
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(WMSServiceImpl));
        private static WMSService _instance = new WMSServiceImpl();

        public static WMSService getInstance()
        {
            if (_instance == null)
                _instance = new WMSServiceImpl();

            return _instance;
        }

        public ServiceResult<WMSAgvTask> WMS_SelectAgvTask(BMSEmployee wLoginUser, int wID, string wCode)
        {
            ServiceResult<WMSAgvTask> wResult = new ServiceResult<WMSAgvTask>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);


                wResult.Result = WMSAgvTaskDAO.getInstance().WMS_SelectAgvTask(wLoginUser, wID, wCode, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<WMSAgvTask>> WMS_SelectAgvTaskAll(BMSEmployee wLoginUser, int wLineID, int wDeviceID,
            string wDeviceLike, int wSourcePositionID, string wSourcePositionLike, int wTaskType, 
            List<int> wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<WMSAgvTask>> wResult = new ServiceResult<List<WMSAgvTask>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);


                wResult.Result = WMSAgvTaskDAO.getInstance().WMS_SelectAgvTaskAll(wLoginUser, -1, "", wLineID, wDeviceID,
                    wDeviceLike, wSourcePositionID, wSourcePositionLike, wTaskType, wStatus, wStartTime, wEndTime, wPagination, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<WMSAgvTask>> WMS_SelectAgvCurrentTaskAll(BMSEmployee wLoginUser, int wLineID, int wDeviceID,
           string wDeviceLike, int wSourcePositionID, string wSourcePositionLike, int wTaskType)
        {
            ServiceResult<List<WMSAgvTask>> wResult = new ServiceResult<List<WMSAgvTask>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                List<int> wStatus = StringUtils.parseListArgs(((int)WMSAgvTaskStatus.Staring), ((int)WMSAgvTaskStatus.WiatConfirm), ((int)WMSAgvTaskStatus.WaitStart),
                    ((int)WMSAgvTaskStatus.Staring), ((int)WMSAgvTaskStatus.Started), ((int)WMSAgvTaskStatus.Arrived));

                DateTime wBaseTime = new DateTime(2000, 1, 1);
                wResult.Result = WMSAgvTaskDAO.getInstance().WMS_SelectAgvTaskAll(wLoginUser, -1, "", wLineID, wDeviceID,
                    wDeviceLike, wSourcePositionID, wSourcePositionLike, wTaskType, wStatus, wBaseTime, wBaseTime,
                    Pagination.Create(1, Int32.MaxValue, "EditTime"), wErrorCode);

                if (wResult.Result != null && wResult.Result.Count > 0)

                    wResult.Result = wResult.Result.GroupBy(p => p.DeviceID).Select(p => p.First()).ToList();

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<int> WMS_UpdateAgvTask(BMSEmployee wLoginUser, WMSAgvTask wWMSAgvTask)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                //判断是否需要下发AGV调度任务
                //判断是否需要

                WMSAgvTaskDAO.getInstance().WMS_UpdateAgvTask(wLoginUser, wWMSAgvTask, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<int> WMS_UpdateAgvTaskStatus(BMSEmployee wLoginUser, int wTaskID, string wTaskCode, int wStatus, DateTime wStatusTime, int wConfirmerID, string wTargetPosition)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                WMSAgvTaskDAO.getInstance().WMS_UpdateAgvTaskStatus(wLoginUser, wTaskID, wTaskCode, wStatus, wStatusTime, wConfirmerID, wTargetPosition, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
    }
}
