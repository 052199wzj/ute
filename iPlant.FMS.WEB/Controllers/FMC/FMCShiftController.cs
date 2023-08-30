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
    public class FMCShiftController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FMCShiftController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();
                int wUserID = wBMSEmployee.ID;
                int wCompanyID = wBMSEmployee.CompanyID;

                int wWorkDayID = StringUtils.parseInt(Request.QueryParamString("WorkDayID"));

                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

                ServiceResult<List<FMCShift>> wServiceResult = ServiceInstance.mFMCService.FMC_QueryShiftList(wBMSEmployee,
                        wWorkDayID, wActive);
                List<FMCShift> wServerRst = wServiceResult.Result;

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

                ServiceResult<FMCShift> wServiceResult = ServiceInstance.mFMCService.FMC_QueryShiftByID(wBMSEmployee, wID);
                FMCShift wServerRst = wServiceResult.Result;

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
                FMCShift wFMCShift = CloneTool.Clone<FMCShift>(wParam["data"]);

                wFMCShift.Creator = wUserName;
                wFMCShift.CreatorID = wUserID;
                wFMCShift.CreateTime = DateTime.Now;
                ServiceResult<Int32> wServiceResult = ServiceInstance.mFMCService.FMC_SaveShift(wBMSEmployee, wFMCShift);

                if (wServiceResult.Result > 0)

                    wFMCShift.ID = wServiceResult.Result;

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
                List<FMCShift> wFMCShift = CloneTool.CloneArray<FMCShift>(wParam["data"]);


                int wWorkDayID = wParam.ContainsKey("WorkDayID") ? StringUtils.parseInt(wParam["WorkDayID"]) : 0;

                ServiceResult<Int32> wServiceResult = ServiceInstance.mFMCService.FMC_SaveShiftList(wBMSEmployee, wFMCShift);


                int wServerRst = wServiceResult.Result;

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
