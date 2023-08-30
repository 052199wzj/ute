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
    public class HolidayController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(HolidayController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                

                BMSEmployee wBMSEmployee = GetSession();
                int wUserID = wBMSEmployee.ID;
                int wCompanyID = wBMSEmployee.CompanyID;

                int wWorkshopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));

                int wYear = StringUtils.parseInt(Request.QueryParamString("year"));
                if (wYear < 2000)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                ServiceResult<List<CFGCalendar>> wServiceResult = ServiceInstance.mCFGService.CFG_QueryHoliday(wBMSEmployee,
                        wWorkshopID, wYear);
                List<CFGCalendar> wServerRst = wServiceResult.Result;

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

                if (!wParam.ContainsKey("data") || !wParam.ContainsKey("year"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                int wWorkshopID = StringUtils.parseInt(wParam.ContainsKey("WorkShopID") ? wParam["WorkShopID"] : 0);
                int wYear = StringUtils.parseInt(wParam.ContainsKey("year") ? wParam["year"] : 0);

                List<CFGCalendar> wCFGCalendarList = CloneTool.CloneArray<CFGCalendar>(wParam["data"]);

                if (wCFGCalendarList != null && wCFGCalendarList.Count > 0)
                {
                    wCFGCalendarList.ForEach(p =>
                    {
                        p.OperatorID = wUserID;
                        p.OperatorName = wUserName;
                    });
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mCFGService.CFG_RemoveYearHoliday(wBMSEmployee, wWorkshopID,
                        wYear);
                int wServerRst = wServiceResult.Result;
                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wServerRst = ServiceInstance.mCFGService.CFG_AddHolidayList(wBMSEmployee, wWorkshopID, wCFGCalendarList).Result;
                }

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
    }
}
