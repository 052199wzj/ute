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
    public class FMCWorkShopController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FMCWorkShopController));
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

                int wBusinessUnitID = StringUtils.parseInt(Request.QueryParamString("BusinessUnitID"));
                int wActive = -1;
                if (!Request.Query.ContainsKey("Active"))
                    wActive = StringUtils.parseInt(Request.QueryParamString("Active"));


                ServiceResult<List<FMCWorkShop>> wServiceResult = ServiceInstance.mFMCService.FMC_QueryWorkShopList(wBMSEmployee,
                        wFactoryID, wBusinessUnitID, wActive);


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
                String wCode = StringUtils.parseString(Request.QueryParamString("Code"));

                ServiceResult<FMCWorkShop> wServiceResult;
                if (wID > 0)
                {
                    wServiceResult = ServiceInstance.mFMCService.FMC_QueryWorkShopByID(wBMSEmployee, wID);
                }
                else
                {
                    wServiceResult = ServiceInstance.mFMCService.FMC_QueryWorkShopByCode(wBMSEmployee, wCode);
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
                BMSEmployee wBMSEmployee = GetSession();
                int wUserID = wBMSEmployee.ID;
                int wCompanyID = wBMSEmployee.CompanyID;
                String wUserName = wBMSEmployee.Name;

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                FMCWorkShop wFMCWorkShop = CloneTool.Clone<FMCWorkShop>(wParam["data"]);


                int wServerRst = 0;
                ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
                if (wFMCWorkShop.ID > 0)
                {
                    wFMCWorkShop.Editor = wUserName;
                    wFMCWorkShop.EditorID = wUserID;
                    wFMCWorkShop.EditTime = DateTime.Now;
                    wServiceResult = ServiceInstance.mFMCService.FMC_SaveWorkShop(wBMSEmployee, wFMCWorkShop);
                    wServerRst = wServiceResult.Result;
                }
                else
                {
                    wFMCWorkShop.Creator = wUserName;
                    wFMCWorkShop.CreatorID = wUserID;
                    wFMCWorkShop.CreateTime = DateTime.Now;
                    wFMCWorkShop.Editor = wUserName;
                    wFMCWorkShop.EditorID = wUserID;
                    wFMCWorkShop.EditTime = DateTime.Now;
                    wServiceResult = ServiceInstance.mFMCService.FMC_AddWorkShop(wBMSEmployee, wFMCWorkShop);
                    wServerRst = wServiceResult.Result;
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

                List<FMCWorkShop> wFMCWorkShopList = CloneTool.CloneArray<FMCWorkShop>(wParam["data"]);
                ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
                foreach (FMCWorkShop wFMCWorkShop in wFMCWorkShopList)
                {
                    if (wActive == 1)
                    {
                        wServiceResult = ServiceInstance.mFMCService.FMC_ActiveWorkShop(wBMSEmployee, wFMCWorkShop);
                    }
                    else
                    {
                        wServiceResult = ServiceInstance.mFMCService.FMC_DisableWorkShop(wBMSEmployee, wFMCWorkShop);
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
