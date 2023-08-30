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
    public class FMCWorkDayController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FMCWorkDayController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();
                int wUserID = wBMSEmployee.ID;
                int wCompanyID = wBMSEmployee.CompanyID;

                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
                ServiceResult<List<FMCWorkDay>> wServiceResult = ServiceInstance.mFMCService.FMC_QueryWorkDayList(wBMSEmployee,
                        wFactoryID, wWorkShopID, wActive);
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
                int wUserID = wBMSEmployee.ID;
                int wCompanyID = wBMSEmployee.CompanyID;

                int wID = StringUtils.parseInt(Request.QueryParamString("ID"));

                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));

                ServiceResult<FMCWorkDay> wServiceResult;
                if (wID > 0)
                {
                    wServiceResult = ServiceInstance.mFMCService.FMC_QueryWorkDayByID(wBMSEmployee, wID);
                }
                else
                {
                    wServiceResult = ServiceInstance.mFMCService.FMC_QueryActiveWorkDay(wBMSEmployee, wFactoryID, wWorkShopID);

                }

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.Result);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null,
                            wServiceResult.Result);
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
                int wCompanyID = wBMSEmployee.CompanyID;
                String wUserName = wBMSEmployee.Name;

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                FMCWorkDay wFMCWorkDay = CloneTool.Clone<FMCWorkDay>(wParam["data"]);


                ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
                if (wFMCWorkDay.ID > 0)
                {
                    wFMCWorkDay.Editor = wUserName;
                    wFMCWorkDay.EditorID = wUserID;
                    wFMCWorkDay.EditTime = DateTime.Now;
                    wServiceResult = ServiceInstance.mFMCService.FMC_SaveWorkDay(wBMSEmployee, wFMCWorkDay);
                }
                else
                {
                    wFMCWorkDay.Creator = wUserName;
                    wFMCWorkDay.CreatorID = wUserID;
                    wFMCWorkDay.CreateTime = DateTime.Now;
                    wFMCWorkDay.Editor = wUserName;
                    wFMCWorkDay.EditorID = wUserID;
                    wFMCWorkDay.EditTime = DateTime.Now;
                    wServiceResult = ServiceInstance.mFMCService.FMC_AddWorkDay(wBMSEmployee, wFMCWorkDay);
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

        public ActionResult Active()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wBMSEmployee = GetSession();
                int wUserID = wBMSEmployee.ID;
                int wCompanyID = wBMSEmployee.CompanyID;


                String wUserName = wBMSEmployee.Name;

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                int wActive = wParam.ContainsKey("Active") ? StringUtils.parseInt(wParam["Active"]) : 0;

                List<FMCWorkDay> wFMCWorkDayList = CloneTool.CloneArray<FMCWorkDay>(wParam["data"]);
                ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
                foreach (FMCWorkDay wFMCWorkDay in wFMCWorkDayList)
                {
                    if (wActive == 1)
                    {
                        wServiceResult = ServiceInstance.mFMCService.FMC_ActiveWorkDay(wBMSEmployee, wFMCWorkDay);
                    }
                    else
                    {
                        wServiceResult = ServiceInstance.mFMCService.FMC_DisableWorkDay(wBMSEmployee, wFMCWorkDay);
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
