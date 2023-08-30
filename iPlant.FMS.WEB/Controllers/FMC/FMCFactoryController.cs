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
    public class FMCFactoryController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FMCFactoryController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession(); 

                String wName = StringUtils.parseString(Request.QueryParamString("Name"));
                int wCountryID = StringUtils.parseInt(Request.QueryParamString("CountryID"));
                int wProvinceID = StringUtils.parseInt(Request.QueryParamString("ProvinceID"));
                int wCityID = StringUtils.parseInt(Request.QueryParamString("CityID"));
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
                ServiceResult<List<FMCFactory>> wServiceResult =  ServiceInstance.mFMCService.FMC_QueryFactoryList(wBMSEmployee, 
                    wName,  wCountryID, wProvinceID,  wCityID,  wActive);

                List<FMCFactory> wServerRst = wServiceResult.Result;

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
        public ActionResult Info()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession(); 

                int wID = StringUtils.parseInt(Request.QueryParamString("ID"));

                ServiceResult<FMCFactory> wServiceResult = ServiceInstance.mFMCService.FMC_QueryFactoryByID(wBMSEmployee, wID);
                FMCFactory wServerRst = wServiceResult.Result;

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
                int wCompanyID = wBMSEmployee.CompanyID;
                String wUserName = wBMSEmployee.Name;

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                FMCFactory wFMCFactory = CloneTool.Clone<FMCFactory>(wParam["data"]);

                ServiceResult<Int32> wServerRst = new ServiceResult<Int32>(0);
                if (wFMCFactory.ID > 0)
                {
                    wFMCFactory.Editor = wUserName;
                    wFMCFactory.EditorID = wUserID;
                    wFMCFactory.EditTime = DateTime.Now;
                    wServerRst = ServiceInstance.mFMCService.FMC_SaveFactory(wBMSEmployee, wFMCFactory);

                }
                else
                {
                    wFMCFactory.Creator = wUserName;
                    wFMCFactory.CreatorID = wUserID;
                    wFMCFactory.CreateTime = DateTime.Now;
                    wFMCFactory.Editor = wUserName;
                    wFMCFactory.EditorID = wUserID;
                    wFMCFactory.EditTime = DateTime.Now;
                    wServerRst = ServiceInstance.mFMCService.FMC_AddFactory(wBMSEmployee, wFMCFactory);

                }

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wFMCFactory);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wServerRst.getResult());
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

                List<FMCFactory> wFMCFactoryList = CloneTool.CloneArray<FMCFactory>(wParam["data"]);
                ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
                foreach (FMCFactory wFMCFactory in wFMCFactoryList)
                {
                    if (wActive == 1)
                    {
                        wServiceResult = ServiceInstance.mFMCService.FMC_ActiveFactory(wBMSEmployee, wFMCFactory);
                    }
                    else
                    {
                        wServiceResult = ServiceInstance.mFMCService.FMC_DisableFactory(wBMSEmployee, wFMCFactory);
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
                int wUserID = wBMSEmployee.ID;
                int wCompanyID = wBMSEmployee.CompanyID;


                String wUserName = wBMSEmployee.Name;

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                 

                List<FMCFactory> wFMCFactoryList = CloneTool.CloneArray<FMCFactory>(wParam["data"]);
                ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
                foreach (FMCFactory wFMCFactory in wFMCFactoryList)
                {
                    if (wFMCFactory.Active==0)
                    {
                        wServiceResult = ServiceInstance.mFMCService.FMC_DeleteFactory(wBMSEmployee, wFMCFactory);
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
