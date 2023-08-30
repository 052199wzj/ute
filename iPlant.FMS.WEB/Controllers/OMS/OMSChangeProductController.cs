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
    /// <summary>
    /// 换型确认单
    /// </summary>
    public class OMSChangeProductController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(OMSChangeProductController));

        /// <summary>
        /// 查询产线换型记录
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wCodeLike = StringUtils.parseString(Request.QueryParamString("Code"));
                int wOldOrderID = StringUtils.parseInt(Request.QueryParamString("OldOrderID"));
                String wOldOrderNo = StringUtils.parseString(Request.QueryParamString("OldOrderNo"));
                List<int> wChangeOrderIDs = StringUtils.parseIntList(Request.QueryParamString("ChangeOrderID"),",");
                String wChangeOrderNo = StringUtils.parseString(Request.QueryParamString("ChangeOrderNo"));
                int wOldProductID = StringUtils.parseInt(Request.QueryParamString("OldProductID"));
                int wChangeProductID = StringUtils.parseInt(Request.QueryParamString("ChangeProductID"));
                int wEditorID = StringUtils.parseInt(Request.QueryParamString("EditorID"));
                int wStatus = StringUtils.parseInt(Request.QueryParamString("Status"));
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

                Pagination wPagination = this.GetPagination();

                ServiceResult<List<OMSChangeProduct>> wServiceResult = ServiceInstance.mOMSService.OMS_SelectChangeProductList(wBMSEmployee, wCodeLike,
                     wOldOrderID, wOldOrderNo, wChangeOrderIDs, wChangeOrderNo, wOldProductID,
                     wChangeProductID, wEditorID, wStatus, wActive, wStartTime, wEndTime, wPagination);
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

        /// <summary>
        /// 查询产线换型记录单条
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Info()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wCode = StringUtils.parseString(Request.QueryParamString("Code"));
                int wID = StringUtils.parseInt(Request.QueryParamString("ID"));

                Pagination wPagination = this.GetPagination();

                ServiceResult<OMSChangeProduct> wServiceResult = ServiceInstance.mOMSService.OMS_SelectChangeProduct(wBMSEmployee, wID,
                     wCode);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.Result);
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
        /// 更新产线换型记录
        /// </summary>
        /// <returns></returns>
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

                OMSChangeProduct wOMSChangeProduct = CloneTool.Clone<OMSChangeProduct>(wParam["data"]);

                wOMSChangeProduct.SetUserInfo(wBMSEmployee);

                ServiceResult<Int32> wServiceResult = ServiceInstance.mOMSService.OMS_UpdateChangeProduct(wBMSEmployee, wOMSChangeProduct);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wOMSChangeProduct);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wOMSChangeProduct);
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
        /// 创建产线换型记录
        /// </summary>
        /// <returns></returns>
        [HttpPost]

        public ActionResult Create()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                BMSEmployee wBMSEmployee = GetSession();
                int wUserID = wBMSEmployee.ID;

                if (!wParam.ContainsKey("LineID") || !wParam.ContainsKey("ChangeOrderID"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);

                    return Json(wResult);
                }

                int wLineID = StringUtils.parseInt(wParam["LineID"]);

                int wChangeOrderID = StringUtils.parseInt(wParam["ChangeOrderID"]);

                int wOldOrderID = wParam.ContainsKey("OldOrderID") ? StringUtils.parseInt(wParam["OldOrderID"]) : 0;
                  

                ServiceResult<Int32> wServiceResult = ServiceInstance.mOMSService.OMS_CreateChangeProduct(wBMSEmployee, wLineID, wOldOrderID, wChangeOrderID);

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
        /// 删除产线换型记录
        /// </summary>
        /// <returns></returns>
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

                List<OMSChangeProduct> wOMSChangeProductList = CloneTool.CloneArray<OMSChangeProduct>(wParam["data"]);
                if (wOMSChangeProductList == null || wOMSChangeProductList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                List<Int32> wIDList = new List<Int32>();
                foreach (OMSChangeProduct wItem in wOMSChangeProductList)
                {
                    wIDList.Add(wItem.ID);
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mOMSService.OMS_DeleteChangeProduct(wBMSEmployee, wIDList);
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
        /// 获取设备换型记录列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult DeviceAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wCodeLike = StringUtils.parseString(Request.QueryParamString("Code"));
                List<int> wMainIDList = StringUtils.parseIntList(Request.QueryParamString("MainID"), ",");
                List<int> wDeviceIDList = StringUtils.parseIntList(Request.QueryParamString("DeviceID"), ",");
                int wEditorID = StringUtils.parseInt(Request.QueryParamString("EditorID"));
                int wStatus = StringUtils.parseInt(Request.QueryParamString("Status"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

                Pagination wPagination = this.GetPagination();

                ServiceResult<List<OMSChangeProductDevice>> wServiceResult = ServiceInstance.mOMSService.OMS_SelectChangeProductDeviceList(wBMSEmployee, wMainIDList, wDeviceIDList, wEditorID, wStatus, wStartTime, wEndTime, wPagination);
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

        /// <summary>
        /// 获取设备换型记录单条
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult DeviceInfo()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wID = StringUtils.parseInt(Request.QueryParamString("ID"));

                Pagination wPagination = this.GetPagination();

                ServiceResult<OMSChangeProductDevice> wServiceResult = ServiceInstance.mOMSService.OMS_SelectChangeProductDevice(wBMSEmployee, wID);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.Result);
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
        /// 修改设备换型记录
        /// </summary>
        /// <returns></returns>
        [HttpPost]

        public ActionResult DeviceUpdate()
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

                OMSChangeProductDevice wOMSChangeProductDevice = CloneTool.Clone<OMSChangeProductDevice>(wParam["data"]);

                wOMSChangeProductDevice.SetUserInfo(wBMSEmployee);

                ServiceResult<Int32> wServiceResult = ServiceInstance.mOMSService.OMS_UpdateChangeProductDevice(wBMSEmployee, wOMSChangeProductDevice);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wOMSChangeProductDevice);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wOMSChangeProductDevice);
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
        /// 删除设备换型记录
        /// </summary>
        /// <returns></returns>
        [HttpPost]

        public ActionResult DeviceDelete()
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

                List<OMSChangeProductDevice> wOMSChangeProductDeviceList = CloneTool.CloneArray<OMSChangeProductDevice>(wParam["data"]);
                if (wOMSChangeProductDeviceList == null || wOMSChangeProductDeviceList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                List<Int32> wIDList = new List<Int32>();
                foreach (OMSChangeProductDevice wItem in wOMSChangeProductDeviceList)
                {
                    wIDList.Add(wItem.ID);
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mOMSService.OMS_DeleteChangeProductDevice(wBMSEmployee, wIDList);
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
