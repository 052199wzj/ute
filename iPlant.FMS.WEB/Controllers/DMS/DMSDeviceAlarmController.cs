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
    public class DMSDeviceAlarmController : BaseController
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSDeviceAlarmController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wName = StringUtils.parseString(Request.QueryParamString("Name"));
                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                int wDeviceType = StringUtils.parseInt(Request.QueryParamString("DeviceType"));
                int wModelID = StringUtils.parseInt(Request.QueryParamString("ModelID"));
                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID")); 
                int wTeamID = StringUtils.parseInt(Request.QueryParamString("TeamID"));
                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
                int wPositionID = StringUtils.parseInt(Request.QueryParamString("PositionID"));
                int wEventType = StringUtils.parseInt(Request.QueryParamString("EventType"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime")); 

                Pagination wPagination = GetPagination();

                ServiceResult<List<DMSDeviceAlarm>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceAlarmList(wBMSEmployee, wName,
                 wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wPositionID, wTeamID,
                wEventType, wStartTime, wEndTime, wPagination);

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
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString());
            }
            return Json(wResult);
        }

        [HttpGet]
        public ActionResult Current()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wName = StringUtils.parseString(Request.QueryParamString("Name"));


                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                String AssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));

                int wDeviceType = StringUtils.parseInt(Request.QueryParamString("DeviceType"));
                int wModelID = StringUtils.parseInt(Request.QueryParamString("ModelID"));
                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wTeamID = StringUtils.parseInt(Request.QueryParamString("TeamID"));
                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
                int wPositionID = StringUtils.parseInt(Request.QueryParamString("PositionID"));

                ServiceResult<List<DMSDeviceAlarm>> wServiceResult = ServiceInstance.mDMSService.DMS_CurrentDeviceAlarmList(wBMSEmployee, wDeviceID, wDeviceNo, AssetNo,
                  wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wPositionID,wTeamID);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), null);
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
        public ActionResult DeviceInfo()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                String AssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));

                int wEventType = StringUtils.parseInt(Request.QueryParamString("EventType"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime")).AddDays(1);

                Pagination wPagination = GetPagination();

                ServiceResult<List<DMSDeviceAlarm>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceAlarm(wBMSEmployee, wID,
                    wDeviceNo, AssetNo, wEventType, wStartTime, wEndTime, wPagination);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wPagination.TotalPage);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.Result, null);
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
        public ActionResult DeviceAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                List<int> wIDList = StringUtils.parseIntList(Request.QueryParamString("DeviceIDList"), ",");

                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

                int wEventType = StringUtils.parseInt(Request.QueryParamString("EventType"));

                Pagination wPagination = GetPagination(); 


                ServiceResult<List<DMSDeviceAlarm>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceAlarmList(wBMSEmployee,
                    wIDList, wEventType, wStartTime, wEndTime, wPagination);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wPagination.TotalPage);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.Result, null);
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
        public ActionResult Statistics()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();


                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                String wDeviceName = StringUtils.parseString(Request.QueryParamString("DeviceName"));
                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                int wDeviceType = StringUtils.parseInt(Request.QueryParamString("DeviceType"));
                int wModelID = StringUtils.parseInt(Request.QueryParamString("ModelID"));
                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wTeamID = StringUtils.parseInt(Request.QueryParamString("TeamID"));
                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime")).AddDays(1);
                int wStatus = StringUtils.parseInt(Request.QueryParamString("Status"));

                Pagination wPagination = GetPagination();

                ServiceResult<List<DMSDeviceAlarmStatistics>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceAlarmStatisticsList(wBMSEmployee, wDeviceID, wDeviceNo, wDeviceName,
                 wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wTeamID, wStatus, wStartTime, wEndTime, wPagination);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), wPagination.TotalPage);
                     
                    SetResult(wResult, "Frequency", wServiceResult.Get("Frequency"));
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


        [HttpPost]
        public ActionResult SyncAlarmCurrent()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                
                BMSEmployee wBMSEmployee = GetSession();
                if (!wParam.ContainsKey("data")||!wParam.ContainsKey("AssetNoList"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<DMSDeviceAlarm> wDMSDeviceAlarmList = CloneTool.CloneArray<DMSDeviceAlarm>(wParam["data"]);

                List<String> wAssetNoList = CloneTool.CloneArray<String>(wParam["AssetNoList"]);

                ServiceResult<List<String>> wServerRst  = ServiceInstance.mDMSService.DMS_SyncDeviceAlarmList(wBMSEmployee, wAssetNoList, wDMSDeviceAlarmList);
                //数据库当前报警与数据当前报警对比 有变更则查询最后一条历史记录 与数据库当前报警对比 更新结束时间并添加变更历史记录 
                //数据库当前报警变更为当前报警

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst.getResult(), null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), wServerRst.getResult(), null);
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
        public ActionResult SyncAlarmHistory()
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

                List<DMSDeviceAlarm> wDMSDeviceAlarmList = CloneTool.CloneArray<DMSDeviceAlarm>(wParam["data"]);
                ServiceResult<List<String>> wServerRst = ServiceInstance.mDMSService.DMS_SyncDeviceAlarmHistoryList(wBMSEmployee, wDMSDeviceAlarmList);
                

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst.getResult(), null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), wServerRst.getResult(), null);
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
