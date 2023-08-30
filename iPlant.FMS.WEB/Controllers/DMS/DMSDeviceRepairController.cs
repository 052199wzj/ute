using iPlant.Common.Tools;
using iPlant.FMS.Models;
using iPlant.FMC.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Http;using Microsoft.AspNetCore.Mvc;
namespace iPlant.FMS.WEB
{
    public class DMSDeviceRepairController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSDeviceRepairController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                
                BMSEmployee wBMSEmployee = GetSession();
                 
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                int wAlarmType = StringUtils.parseInt(Request.QueryParamString("AlarmType"));
                int wAlarmLevel = StringUtils.parseInt(Request.QueryParamString("AlarmLevel"));
                int wStatus = StringUtils.parseInt(Request.QueryParamString("Status"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));
                Pagination wPagination = GetPagination();
                ServiceResult<List<DMSDeviceRepair>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceRepairList(wBMSEmployee,
                        wDeviceID, wDeviceNo,  wAlarmType,  wAlarmLevel, wStatus, wStartTime, wEndTime, wPagination); 

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), wPagination.TotalPage); 
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.getResult(), null);
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
            }
            return Json(wResult);
        }

        [HttpGet]
        public ActionResult Info()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wCode = StringUtils.parseString(Request.QueryParamString("Code"));
                int wID = StringUtils.parseInt(Request.QueryParamString("ID")); 

                ServiceResult<DMSDeviceRepair> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceRepair(wBMSEmployee,
                        wID, wCode); 

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null , wServiceResult.getResult());
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wServiceResult.getResult());
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
            }
            return Json(wResult);
        }


        [HttpPost] 
        public ActionResult Update()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                BMSEmployee wBMSEmployee = GetSession();
                int wUserID = wBMSEmployee.ID;

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                DMSDeviceRepair wDMSDeviceRepair = CloneTool.Clone<DMSDeviceRepair>(wParam["data"]);
                 
                ServiceResult<Int32> wServiceResult =  ServiceInstance.mDMSService.DMS_UpdateDeviceRepair(wBMSEmployee, wDMSDeviceRepair);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSDeviceRepair);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wDMSDeviceRepair);
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
            }
            return Json(wResult);
        }


       

        [HttpPost]

        public ActionResult Delete()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                BMSEmployee wBMSEmployee = GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<DMSDeviceRepair> wDMSDeviceRepairList = CloneTool.CloneArray<DMSDeviceRepair>(wParam["data"]);
                if (wDMSDeviceRepairList == null || wDMSDeviceRepairList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                List<Int32> wIDList = new List<Int32>();
                foreach (DMSDeviceRepair wItem in wDMSDeviceRepairList)
                {
                    wIDList.Add(wItem.ID);
                }
               
                ServiceResult<Int32> wServiceResult =  ServiceInstance.mDMSService.DMS_DeleteDeviceRepair(wBMSEmployee, wIDList);
                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
            }
            return Json(wResult);
        }
    }
}
