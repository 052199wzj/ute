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
    public class DMSEnergyStatisticsController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSEnergyStatisticsController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                List<int> wDeviceIDList = StringUtils.parseIntList(Request.QueryParamString("DeviceID"), ",");
                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
                int wStatType = StringUtils.parseInt(Request.QueryParamString("StatType"));
                int wEnergyType = StringUtils.parseInt(Request.QueryParamString("EnergyType"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));


                ServiceResult<List<DMSEnergyStatistics>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectEnergyStatisticsList(wBMSEmployee,
                    wDeviceIDList, wAreaID, wStatType, wEnergyType, wStartTime, wEndTime, wActive);
                List<DMSEnergyStatistics> wServerRst = wServiceResult.getResult();

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst, null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServerRst, null);
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
        public ActionResult StatisticsAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                List<int> wDeviceIDList = StringUtils.parseIntList(Request.QueryParamString("DeviceID"), ",");
                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
                int wStatType = StringUtils.parseInt(Request.QueryParamString("StatType"));
                int wEnergyType = StringUtils.parseInt(Request.QueryParamString("EnergyType"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime")); 


                ServiceResult<List<DMSEnergyStatistics>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectEnergyStatisticsList(wBMSEmployee,
                    wDeviceIDList, wAreaID, wStatType, wEnergyType, wStartTime, wEndTime);
                List<DMSEnergyStatistics> wServerRst = wServiceResult.getResult();

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst, null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServerRst, null);
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
                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                DMSEnergyStatistics wDMSEnergyStatistics = CloneTool.Clone<DMSEnergyStatistics>(wParam["data"]);
                ServiceResult<int> wServerRst = ServiceInstance.mDMSService.DMS_UpdateEnergyStatistics(wBMSEmployee, wDMSEnergyStatistics);
                // 直接更新数据库值 没有则插入
                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode());
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

        public ActionResult Active()
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

                List<DMSEnergyStatistics> wDMSEnergyStatisticsList = CloneTool.CloneArray<DMSEnergyStatistics>(wParam["data"]);
                if (wDMSEnergyStatisticsList == null || wDMSEnergyStatisticsList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                int wActive = wParam.ContainsKey("Active") ? StringUtils.parseInt(wParam["Active"]) : 0;

                List<Int32> wIDList = new List<Int32>();
                foreach (DMSEnergyStatistics wItem in wDMSEnergyStatisticsList)
                {
                    wIDList.Add(wItem.ID);
                }
                ServiceResult<Int32> wServiceResult = ServiceInstance.mDMSService.DMS_ActiveEnergyStatistics(wBMSEmployee, wIDList,
                        wActive);
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

                List<DMSEnergyStatistics> wDMSEnergyStatisticsList = CloneTool.CloneArray<DMSEnergyStatistics>(wParam["data"]);
                if (wDMSEnergyStatisticsList == null || wDMSEnergyStatisticsList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<Int32> wIDList = new List<Int32>();
                foreach (DMSEnergyStatistics wItem in wDMSEnergyStatisticsList)
                {
                    wIDList.Add(wItem.ID);
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mDMSService.DMS_DeleteEnergyStatistics(wBMSEmployee, wIDList);


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
