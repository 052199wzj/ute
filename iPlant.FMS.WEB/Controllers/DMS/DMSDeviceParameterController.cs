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
    public class DMSDeviceParameterController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSDeviceParameterController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wName = StringUtils.parseString(Request.QueryParamString("Name"));
                String wVariableName = StringUtils.parseString(Request.QueryParamString("VariableName"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                String AssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                String wDeviceName = StringUtils.parseString(Request.QueryParamString("DeviceName"));
                String wProtocol = StringUtils.parseString(Request.QueryParamString("Protocol"));
                String wOPCClass = StringUtils.parseString(Request.QueryParamString("OPCClass"));
                int wDataType = StringUtils.parseInt(Request.QueryParamString("DataType"));
                int wDataClass = StringUtils.parseInt(Request.QueryParamString("DataClass"));
                int wPositionID = StringUtils.parseInt(Request.QueryParamString("PositionID"));
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

                Pagination wPagination = GetPagination();


                ServiceResult<List<DMSDeviceParameter>> wServiceResult = ServiceInstance.mDMSService.DMS_QueryDeviceParameterList(wBMSEmployee, wName, wVariableName,
                wLineID, wDeviceID, wDeviceNo, AssetNo, wDeviceName, wProtocol, wOPCClass, wDataType, wDataClass, wPositionID, wActive, wPagination);
                List<DMSDeviceParameter> wServerRst = wServiceResult.getResult();

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst, wPagination.TotalPage);
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
        public ActionResult Info()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wID = StringUtils.parseInt(Request.QueryParamString("ID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo")); 



                ServiceResult<DMSDeviceParameter> wServiceResult = ServiceInstance.mDMSService.DMS_QueryDeviceParameter(wBMSEmployee, wID,
                    wDeviceNo);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.Result);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wServiceResult.Result);
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

                DMSDeviceParameter wDMSDeviceParameter = CloneTool.Clone<DMSDeviceParameter>(wParam["data"]);

                ServiceResult<Int32> wServiceResult = ServiceInstance.mDMSService.DMS_UpdateDeviceParameter(wBMSEmployee, wDMSDeviceParameter);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSDeviceParameter);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wDMSDeviceParameter);
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

        public ActionResult UpdateList()
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

                List< DMSDeviceParameter> wDMSDeviceParameterList = CloneTool.CloneArray<DMSDeviceParameter>(wParam["data"]);

                ServiceResult<List<String>> wServiceResult = ServiceInstance.mDMSService.DMS_UpdateDeviceParameterList(wBMSEmployee, wDMSDeviceParameterList);

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

                List<DMSDeviceParameter> wDMSDeviceParameterList = CloneTool.CloneArray<DMSDeviceParameter>(wParam["data"]);
                if (wDMSDeviceParameterList == null || wDMSDeviceParameterList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                int wActive = wParam.ContainsKey("Active") ? StringUtils.parseInt(wParam["Active"]) : 0;

                List<Int32> wIDList = new List<Int32>();
                foreach (DMSDeviceParameter wItem in wDMSDeviceParameterList)
                {
                    wIDList.Add(wItem.ID);
                }
                ServiceResult<Int32> wServiceResult = ServiceInstance.mDMSService.DMS_ActiveDeviceParameter(wBMSEmployee, wIDList,
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

                List<DMSDeviceParameter> wDMSDeviceParameterList = CloneTool.CloneArray<DMSDeviceParameter>(wParam["data"]);
                if (wDMSDeviceParameterList == null || wDMSDeviceParameterList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                ServiceResult<Int32> wServiceResult = new ServiceResult<int>(0);
                foreach (DMSDeviceParameter wItem in wDMSDeviceParameterList)
                {
                    wServiceResult = ServiceInstance.mDMSService.DMS_DeleteDeviceParameter(wBMSEmployee, wItem);
                    if (StringUtils.isNotEmpty(wServiceResult.FaultCode))
                        break;
                }

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


        /// <summary>
        /// 获取设备服务器配置
        /// </summary>
        /// <returns></returns>

        [HttpGet]
        public ActionResult ServerAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wServerType = StringUtils.parseInt(Request.QueryParamString("ServerType"));
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

                Pagination wPagination = GetPagination();

                ServiceResult<List<DMSDeviceServer>> wServiceResult = ServiceInstance.mDMSService.DMS_GetDeviceServerList(wBMSEmployee, wServerType, wActive, wPagination);


                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), wPagination.TotalPage);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.getResult(), wPagination.TotalPage);
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
            }
            return Json(wResult);
        }


        /// <summary>
        /// 更新设备服务器配置
        /// </summary>
        /// <returns></returns>

        [HttpPost]

        public ActionResult UpdateServer()
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

                DMSDeviceServer wDMSDeviceServer = CloneTool.Clone<DMSDeviceServer>(wParam["data"]);

                ServiceResult<Int32> wServiceResult = ServiceInstance.mDMSService.DMS_UpdateDeviceServer(wBMSEmployee, wDMSDeviceServer);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSDeviceServer);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wDMSDeviceServer);
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

        public ActionResult InitTable()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                BMSEmployee wBMSEmployee = GetSession(); 
                 

                ServiceResult<Int32> wServiceResult = ServiceInstance.mDMSService.DMS_InitDeviceTable(wBMSEmployee);

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
