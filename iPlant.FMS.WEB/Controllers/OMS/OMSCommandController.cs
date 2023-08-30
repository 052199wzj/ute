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
    public class OMSCommandController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(OMSCommandController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wLoginUser = this.GetSession();

                int wCustomerID = StringUtils.parseInt(Request.QueryParamString("CustomerID"));
                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wBusinessUnitID = StringUtils.parseInt(Request.QueryParamString("BusinessUnitID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

                ServiceResult<List<OMSCommand>> wServiceResult = ServiceInstance.mOMSService.OMS_SelectCommandList(wLoginUser,
                        wFactoryID, wBusinessUnitID, wWorkShopID, wCustomerID, wProductID, wStartTime, wEndTime);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, null);
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

                String wWBSNo = StringUtils.parseString(Request.QueryParamString("WBSNo"));

                String wPartNo = StringUtils.parseString(Request.QueryParamString("PartNo"));

                ServiceResult<OMSCommand> wServiceResult = null;

                if (wID >= 0)
                {
                    wServiceResult = ServiceInstance.mOMSService.OMS_SelectCommandByID(wBMSEmployee, wID);
                }
                else if (StringUtils.isNotEmpty(wPartNo))
                {
                    wServiceResult = ServiceInstance.mOMSService.OMS_SelectCommandByPartNo(wBMSEmployee, wPartNo);

                }
                else if (StringUtils.isNotEmpty(wWBSNo))
                {
                    wServiceResult = ServiceInstance.mOMSService.OMS_SelectCommandByCode(wBMSEmployee, wWBSNo);

                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }


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
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                OMSCommand wOMSCommand = CloneTool.Clone<OMSCommand>(wParam["data"]);
                if (wOMSCommand == null)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                if (wOMSCommand.ID <= 0)
                {
                    wOMSCommand.CreatorID = wLoginUser.ID;
                    wOMSCommand.CreateTime = DateTime.Now;
                }
                else
                {
                    wOMSCommand.EditorID = wLoginUser.ID;
                    wOMSCommand.EditTime = DateTime.Now;
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mOMSService.OMS_UpdateCommand(wLoginUser, wOMSCommand);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wOMSCommand);
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
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<OMSCommand> wOMSCommandList = CloneTool.CloneArray<OMSCommand>(wParam["data"]);
                if (wOMSCommandList == null || wOMSCommandList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mOMSService.OMS_DeleteCommandList(wLoginUser, wOMSCommandList);

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
