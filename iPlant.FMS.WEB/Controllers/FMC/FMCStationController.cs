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
    public class FMCStationController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FMCStationController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));

                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));

                int wWorkAreaID = StringUtils.parseInt(Request.QueryParamString("WorkAreaID"));

                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));


                Pagination wPagination = GetPagination();


                ServiceResult<List<FMCStation>> wServiceResult = ServiceInstance.mFMCService.FMC_QueryStationList(wBMSEmployee, wWorkShopID,
                        wLineID, wWorkAreaID, wActive, wPagination);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), wPagination.TotalPage);
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

                String wCode = StringUtils.parseString(Request.QueryParamString("Code"));

                ServiceResult<FMCStation> wServiceResult = ServiceInstance.mFMCService.FMC_QueryStation(wBMSEmployee, wID, wCode);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.getResult());
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null,
                            wServiceResult.getResult());
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

                FMCStation wFMCStation = CloneTool.Clone<FMCStation>(wParam["data"]);



                ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
                if (wFMCStation.ID > 0)
                {
                    wFMCStation.Editor = wUserName;
                    wFMCStation.EditorID = wUserID;
                    wFMCStation.EditTime = DateTime.Now;
                    wServiceResult = ServiceInstance.mFMCService.FMC_SaveStation(wBMSEmployee, wFMCStation);
                }
                else
                {
                    wFMCStation.Creator = wUserName;
                    wFMCStation.CreatorID = wUserID;
                    wFMCStation.CreateTime = DateTime.Now;
                    wFMCStation.Editor = wUserName;
                    wFMCStation.EditorID = wUserID;
                    wFMCStation.EditTime = DateTime.Now;
                    wServiceResult = ServiceInstance.mFMCService.FMC_AddStation(wBMSEmployee, wFMCStation);
                }

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wFMCStation);
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

                List<FMCStation> wFMCStationList = CloneTool.CloneArray<FMCStation>(wParam["data"]);

                ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
                foreach (FMCStation wFMCStation in wFMCStationList)
                {
                    if (wActive == 1)
                    {
                        wServiceResult = ServiceInstance.mFMCService.FMC_ActiveStation(wBMSEmployee, wFMCStation);
                    }
                    else
                    {
                        wServiceResult = ServiceInstance.mFMCService.FMC_DisableStation(wBMSEmployee, wFMCStation);
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
        public ActionResult SyncAll()
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

                List<FMCStation> wFMCStationList = CloneTool.CloneArray<FMCStation>(wParam["data"]);
                ServiceResult<List<String>> wServerRst = ServiceInstance.mFMCService.FMC_SyncStationList(wBMSEmployee, wFMCStationList);


                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst.getResult(), null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), wServerRst.getResult(), null);
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

                List<FMCStation> wFMCStationList = CloneTool.CloneArray<FMCStation>(wParam["data"]);

                ServiceResult<Int32> wServiceResult = new ServiceResult<Int32>(0);
                foreach (FMCStation wFMCStation in wFMCStationList)
                {
                    if (wFMCStation.Active <= 0)
                    {
                        wServiceResult = ServiceInstance.mFMCService.FMC_DeleteStation(wBMSEmployee, wFMCStation);
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
