using iPlant.Common.Tools;
using iPlant.FMS.Models;
using iPlant.FMC.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
namespace iPlant.FMS.WEB
{
    public class DMSGroupParameterController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSGroupParameterController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wName = StringUtils.parseString(Request.QueryParamString("Name"));
                String wVariableName = StringUtils.parseString(Request.QueryParamString("VariableName"));
                String wDeviceGroupCode = StringUtils.parseString(Request.QueryParamString("DeviceGroupCode"));
                String wDeviceName = StringUtils.parseString(Request.QueryParamString("DeviceName"));
                String wProtocol = StringUtils.parseString(Request.QueryParamString("Protocol"));
                String wOPCClass = StringUtils.parseString(Request.QueryParamString("OPCClass"));
                int wDataType = StringUtils.parseInt(Request.QueryParamString("DataType"));
                int wDataClass = StringUtils.parseInt(Request.QueryParamString("DataClass"));
                int wPositionID = StringUtils.parseInt(Request.QueryParamString("PositionID"));
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));


                Pagination wPagination = GetPagination();

                ServiceResult<List<DMSGroupParameter>> wServiceResult = ServiceInstance.mDMSService.DMS_QueryGroupParameterList(wBMSEmployee, wName, wVariableName,
                    wDeviceGroupCode, wProtocol, wOPCClass, wDataType, wDataClass, wPositionID, wActive, wPagination);
                List<DMSGroupParameter> wServerRst = wServiceResult.getResult();

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



                ServiceResult<DMSGroupParameter> wServiceResult = ServiceInstance.mDMSService.DMS_QueryGroupParameter(wBMSEmployee, wID,
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

                DMSGroupParameter wDMSGroupParameter = CloneTool.Clone<DMSGroupParameter>(wParam["data"]);

                ServiceResult<Int32> wServiceResult = ServiceInstance.mDMSService.DMS_UpdateGroupParameter(wBMSEmployee, wDMSGroupParameter);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSGroupParameter);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wDMSGroupParameter);
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

                List<DMSGroupParameter> wDMSGroupParameterList = CloneTool.CloneArray<DMSGroupParameter>(wParam["data"]);

                ServiceResult<List<String>> wServiceResult = ServiceInstance.mDMSService.DMS_UpdateGroupParameterList(wBMSEmployee, wDMSGroupParameterList);

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

                List<DMSGroupParameter> wDMSGroupParameterList = CloneTool.CloneArray<DMSGroupParameter>(wParam["data"]);
                if (wDMSGroupParameterList == null || wDMSGroupParameterList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                int wActive = wParam.ContainsKey("Active") ? StringUtils.parseInt(wParam["Active"]) : 0;

                List<Int32> wIDList = new List<Int32>();
                foreach (DMSGroupParameter wItem in wDMSGroupParameterList)
                {
                    wIDList.Add(wItem.ID);
                }
                ServiceResult<Int32> wServiceResult = ServiceInstance.mDMSService.DMS_ActiveGroupParameter(wBMSEmployee, wIDList,
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

                List<DMSGroupParameter> wDMSGroupParameterList = CloneTool.CloneArray<DMSGroupParameter>(wParam["data"]);
                if (wDMSGroupParameterList == null || wDMSGroupParameterList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                ServiceResult<Int32> wServiceResult = new ServiceResult<int>(0);
                foreach (DMSGroupParameter wItem in wDMSGroupParameterList)
                {
                    wServiceResult = ServiceInstance.mDMSService.DMS_DeleteGroupParameter(wBMSEmployee, wItem);
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


        [HttpPost]

        public ActionResult CreateDevice()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                BMSEmployee wBMSEmployee = GetSession();

                if (!wParam.ContainsKey("GroupCode"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                String wGroupCode = StringUtils.parseString(wParam["GroupCode"]);
                Boolean wIsAll = false;
                if (wParam.ContainsKey("IsAll"))
                {
                    wIsAll = StringUtils.parseBoolean(wParam["IsAll"]);
                }
                List<DMSDeviceLedger> wDMSDeviceLedgerList = new List<DMSDeviceLedger>();
                if (wIsAll)
                {
                    ServiceResult<List<DMSDeviceLedger>> wDeviceServiceResult = ServiceInstance.mDMSService.DMS_GetDeviceLedgerList(wBMSEmployee, "",
               "",-1, -1, -1, -1, -1,"", wGroupCode, -1, -1,  1, Pagination.Create(1, int.MaxValue));

                    if (StringUtils.isNotEmpty(wDeviceServiceResult.getFaultCode()))
                    {
                        wResult = GetResult(RetCode.SERVER_CODE_ERR, wDeviceServiceResult.getFaultCode());
                        return Json(wResult);
                    }
                    //做个过滤
                    wDMSDeviceLedgerList = wDeviceServiceResult.Result;
                }
                else if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                else
                {
                    wDMSDeviceLedgerList = CloneTool.CloneArray<DMSDeviceLedger>(wParam["data"]);
                }

                if (wDMSDeviceLedgerList == null || wDMSDeviceLedgerList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, "可生成设备参数的的设备不存在！");
                    return Json(wResult);
                }
                ServiceResult<List<String>> wServiceResult = ServiceInstance.mDMSService.DMS_UpdateDeviceParameterList(wBMSEmployee, wGroupCode, wDMSDeviceLedgerList);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, null);
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


    }
}
