using iPlant.Common.Tools;
using iPlant.FMS.Models;
using iPlant.FMC.Service;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace iPlant.FMS.WEB
{
    public class FPCPartPointController : BaseController
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FPCPartPointController));
        [HttpGet]
        public ActionResult GetAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wPartID = StringUtils.parseInt(Request.QueryParamString("PartID"));


                int wQTType = StringUtils.parseInt(Request.QueryParamString("QTType"));
                int wStepType = StringUtils.parseInt(Request.QueryParamString("StepType"));

                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
                Pagination wPagination = GetPagination();



                ServiceResult<List<FPCPartPoint>> wServiceResult = ServiceInstance.mFPCService.FPC_GetPartPointList(wBMSEmployee, wWorkShopID, wLineID, wPartID, wStepType,
                 wQTType, wActive, wPagination);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wPagination.TotalPage);
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



        [HttpGet]
        public ActionResult Info()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wID = StringUtils.parseInt(Request.QueryParamString("ID"));
                String wPartPointNo = StringUtils.parseString(Request.QueryParamString("PartPointNo"));



                ServiceResult<FPCPartPoint> wServiceResult = ServiceInstance.mFPCService.FPC_GetPartPoint(wBMSEmployee, wID,
                    wPartPointNo);

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

                FPCPartPoint wFPCPartPoint = CloneTool.Clone<FPCPartPoint>(wParam["data"]);

                ServiceResult<Int32> wServiceResult = ServiceInstance.mFPCService.FPC_UpdatePartPoint(wBMSEmployee, wFPCPartPoint);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wFPCPartPoint);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wFPCPartPoint);
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

                List<FPCPartPoint> wFPCPartPointList = CloneTool.CloneArray<FPCPartPoint>(wParam["data"]);
                if (wFPCPartPointList == null || wFPCPartPointList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                int wActive = wParam.ContainsKey("Active") ? StringUtils.parseInt(wParam["Active"]) : 0;

                List<Int32> wIDList = new List<Int32>();
                foreach (FPCPartPoint wItem in wFPCPartPointList)
                {
                    wIDList.Add(wItem.ID);
                }
                ServiceResult<Int32> wServiceResult = ServiceInstance.mFPCService.FPC_ActivePartPoint(wBMSEmployee, wIDList,
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

                List<FPCPartPoint> wFPCPartPointList = CloneTool.CloneArray<FPCPartPoint>(wParam["data"]);
                if (wFPCPartPointList == null || wFPCPartPointList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                ServiceResult<Int32> wServiceResult = new ServiceResult<int>(0);
                foreach (FPCPartPoint wItem in wFPCPartPointList)
                {
                    wServiceResult = ServiceInstance.mFPCService.FPC_DeletePartPoint(wBMSEmployee, wItem);
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


    }
}
