using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iPlant.Common.Tools;

namespace iPlant.FMC.Service
{
    public interface WMSService
    {
        ServiceResult<List<WMSAgvTask>> WMS_SelectAgvTaskAll(BMSEmployee wLoginUser, int wLineID, int wDeviceID,
             string wDeviceLike, int wSourcePositionID, string wSourcePositionLike, int wTaskType, List<int> wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);
        
        ServiceResult<List<WMSAgvTask>> WMS_SelectAgvCurrentTaskAll(BMSEmployee wLoginUser, int wLineID, int wDeviceID,
            string wDeviceLike, int wSourcePositionID, string wSourcePositionLike, int wTaskType);

        ServiceResult<WMSAgvTask> WMS_SelectAgvTask(BMSEmployee wLoginUser, int wID, String wCode);

       
        ServiceResult<Int32> WMS_UpdateAgvTask(BMSEmployee wLoginUser, WMSAgvTask wWMSAgvTask);

       
        ServiceResult<Int32> WMS_UpdateAgvTaskStatus(BMSEmployee wLoginUser, int wTaskID, String wTaskCode, int wStatus, DateTime wStatusTime,
            int wConfirmerID, String wTargetPosition); 

    }
}
