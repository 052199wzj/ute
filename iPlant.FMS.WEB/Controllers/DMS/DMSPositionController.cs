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
    public class DMSPositionController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSPositionController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                String wName = StringUtils.parseString(Request.QueryParamString("Name"));
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
                Pagination wPagination = GetPagination();

                ServiceResult<List<DMSPosition>> wServiceResult = ServiceInstance.mDMSService.DMS_GetPositionList(wBMSEmployee, wLineID,
                        wName, wActive, wPagination); 

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), wPagination.TotalPage);
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

                DMSPosition wDMSPosition = CloneTool.Clone<DMSPosition>(wParam["data"]);

                wDMSPosition.OperatorID = wUserID;
                wDMSPosition.OperateTime = DateTime.Now;

                ServiceResult<Int32> wServiceResult = ServiceInstance.mDMSService.DMS_SavePosition(wBMSEmployee, wDMSPosition);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSPosition);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wDMSPosition);
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

                List<DMSPosition> wDMSPositionList = CloneTool.CloneArray<DMSPosition>(wParam["data"]);
                if (wDMSPositionList == null || wDMSPositionList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                int wActive = wParam.ContainsKey("Active") ? StringUtils.parseInt(wParam["Active"]) : 0;

                List<Int32> wIDList = new List<Int32>();
                foreach (DMSPosition wItem in wDMSPositionList)
                {
                    wIDList.Add(wItem.ID);
                }
                ServiceResult<Int32> wServiceResult = ServiceInstance.mDMSService.DMS_ActivePositionList(wBMSEmployee, wIDList,
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

                List<DMSPosition> wDMSPositionList = CloneTool.CloneArray<DMSPosition>(wParam["data"]);
                if (wDMSPositionList == null || wDMSPositionList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                List<Int32> wIDList = new List<Int32>();
                foreach (DMSPosition wItem in wDMSPositionList)
                {
                    wIDList.Add(wItem.ID);
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mDMSService.DMS_DeletePositionList(wBMSEmployee, wIDList);
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
