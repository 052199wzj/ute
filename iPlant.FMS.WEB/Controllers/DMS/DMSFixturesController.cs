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
    public class DMSFixturesController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSFixturesController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                String wProductNo = StringUtils.parseString(Request.QueryParamString("ProductNo"));
                String wProductNoLike = StringUtils.parseString(Request.QueryParamString("ProductNoLike"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                List<int> wProductID = StringUtils.parseIntList(Request.QueryParamString("ProductID"),",");
                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));

                Pagination wPagination = this.GetPagination();


                ServiceResult<List<DMSFixtures>> wServiceResult = ServiceInstance.mDMSService.DMS_GetFixturesList(wBMSEmployee, wLineID,
             wDeviceID, wProductID, wAssetNo, wProductNo, wProductNoLike, wPagination);

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
        public ActionResult DeviceAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));

                Pagination wPagination = this.GetPagination();

                ServiceResult<List<DMSFixtures>> wServiceResult = ServiceInstance.mDMSService.DMS_GetDeviceFixturesList(wBMSEmployee, wLineID, wProductID, wPagination);

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

                DMSFixtures wDMSFixtures = CloneTool.Clone<DMSFixtures>(wParam["data"]);


                ServiceResult<Int32> wServiceResult = ServiceInstance.mDMSService.DMS_UpdateFixtures(wBMSEmployee, wDMSFixtures);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSFixtures);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wDMSFixtures);
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

                List<DMSFixtures> wDMSFixturesList = CloneTool.CloneArray<DMSFixtures>(wParam["data"]);
                if (wDMSFixturesList == null || wDMSFixturesList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                List<Int32> wIDList = new List<Int32>();
                foreach (DMSFixtures wItem in wDMSFixturesList)
                {
                    wIDList.Add(wItem.ID);
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mDMSService.DMS_DeleteFixturesList(wBMSEmployee, wIDList);
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
