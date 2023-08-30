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
    public class FMCResourceController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FMCResourceController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
                int wStationID = StringUtils.parseInt(Request.QueryParamString("StationID"));
                int wType = StringUtils.parseInt(Request.QueryParamString("Type"));
                int wResourceID = StringUtils.parseInt(Request.QueryParamString("ResourceID"));
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

                ServiceResult<List<FMCResource>> wServiceResult = ServiceInstance.mFMCService.FMC_QueryResourceList(wBMSEmployee,
                        wWorkShopID, wLineID, wStationID, wAreaID, wResourceID, wType, wActive);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.getResult(),
                            null);
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

                ServiceResult<FMCResource> wServiceResult = ServiceInstance.mFMCService.FMC_QueryResourceByID(wBMSEmployee, wID);
                FMCResource wServerRst = wServiceResult.Result;

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wServerRst);
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
                String wUserName = wBMSEmployee.Name;

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                FMCResource wFMCResource = CloneTool.Clone<FMCResource>(wParam["data"]);


                ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
                if (wFMCResource.ID > 0)
                {
                    wFMCResource.Editor = wUserName;
                    wFMCResource.EditorID = wUserID;
                    wFMCResource.EditTime = DateTime.Now;
                    wServiceResult = ServiceInstance.mFMCService.FMC_SaveResource(wBMSEmployee, wFMCResource);

                }
                else
                {
                    wFMCResource.Creator = wUserName;
                    wFMCResource.CreatorID = wUserID;
                    wFMCResource.CreateTime = DateTime.Now;
                    wFMCResource.Editor = wUserName;
                    wFMCResource.EditorID = wUserID;
                    wFMCResource.EditTime = DateTime.Now;
                    wServiceResult = ServiceInstance.mFMCService.FMC_AddResource(wBMSEmployee, wFMCResource);

                }

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wFMCResource);
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

                int wActive = wParam.ContainsKey("Active") ? StringUtils.parseInt(wParam["Active"]) : 0;

                List<FMCResource> wFMCResourceList = CloneTool.CloneArray<FMCResource>(wParam["data"]);

                ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
                foreach (FMCResource wFMCResource in wFMCResourceList)
                {
                    if (wActive == 1)
                    {
                        wServiceResult = ServiceInstance.mFMCService.FMC_ActiveResource(wBMSEmployee, wFMCResource);
                    }
                    else
                    {
                        wServiceResult = ServiceInstance.mFMCService.FMC_DisableResource(wBMSEmployee, wFMCResource);
                    }

                    if (!StringUtils.isEmpty(wServiceResult.getFaultCode()))
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

                List<FMCResource> wFMCStationList = CloneTool.CloneArray<FMCResource>(wParam["data"]);

                ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
                foreach (FMCResource wFMCStation in wFMCStationList)
                {
                    if (wFMCStation.Active <= 0)
                    {
                        wServiceResult = ServiceInstance.mFMCService.FMC_DeleteResource(wBMSEmployee, wFMCStation);
                    }

                    if (!StringUtils.isEmpty(wServiceResult.getFaultCode()))
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
