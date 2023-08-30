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
    public class FMCLineController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FMCLineController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();
                int wUserID = wBMSEmployee.ID;
                int wCompanyID = wBMSEmployee.CompanyID;

                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));

                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));

                int wBusinessUnitID = StringUtils.parseInt(Request.QueryParamString("BusinessUnitID"));

                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"), -1);


                ServiceResult<List<FMCLine>> wServiceResult = ServiceInstance.mFMCService.FMC_QueryLineList(wBMSEmployee,
                        wBusinessUnitID, wFactoryID, wWorkShopID, wActive);
                List<FMCLine> wServerRst = wServiceResult.Result;


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
                int wUserID = wBMSEmployee.ID;
                int wCompanyID = wBMSEmployee.CompanyID;

                int wID = StringUtils.parseInt(Request.QueryParamString("ID"));

                ServiceResult<FMCLine> wServiceResult = ServiceInstance.mFMCService.FMC_QueryLineByID(wBMSEmployee, wID);
                FMCLine wServerRst = wServiceResult.Result;

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

                FMCLine wFMCLine = CloneTool.Clone<FMCLine>(wParam["data"]);


                ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
                if (wFMCLine.ID > 0)
                {
                    wFMCLine.Editor = wUserName;
                    wFMCLine.EditorID = wUserID;
                    wFMCLine.EditTime = DateTime.Now;
                    wServiceResult = ServiceInstance.mFMCService.FMC_SaveLine(wBMSEmployee, wFMCLine);

                }
                else
                {
                    wFMCLine.Creator = wUserName;
                    wFMCLine.CreatorID = wUserID;
                    wFMCLine.CreateTime = DateTime.Now;
                    wFMCLine.Editor = wUserName;
                    wFMCLine.EditorID = wUserID;
                    wFMCLine.EditTime = DateTime.Now;
                    wServiceResult = ServiceInstance.mFMCService.FMC_AddLine(wBMSEmployee, wFMCLine);

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

                List<FMCLine> wFMCLineList = CloneTool.CloneArray<FMCLine>(wParam["data"]);

                ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);

                foreach (FMCLine wFMCLine in wFMCLineList)
                {
                    if (wActive == 1)
                    {
                        wServiceResult = ServiceInstance.mFMCService.FMC_ActiveLine(wBMSEmployee, wFMCLine);
                    }
                    else
                    {
                        wServiceResult = ServiceInstance.mFMCService.FMC_DisableLine(wBMSEmployee, wFMCLine);
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
