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
    public class DepartmentController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DepartmentController));
        [HttpGet]
        public ActionResult AllDepartment()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                if (CheckCookieEmpty())
                {
                    wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
                    return Json(wResult); ;
                }
                BMSEmployee wBMSEmployee = GetSession();

                int wActive = Request.Query.ContainsKey("Active") ? StringUtils.parseInt(Request.QueryParamString("Active")) : -1;
                String wName = StringUtils.parseString(Request.QueryParamString("Name"));
                int wParentID = StringUtils.parseInt(Request.QueryParamString("ParentID"));


                Pagination wPagination = GetPagination();


                ServiceResult<List<BMSDepartment>> wServerRst = ServiceInstance.mBMSService.BMS_QueryDepartmentList(wBMSEmployee, wName, wParentID, wActive, wPagination);

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst.getResult(), wPagination.TotalPage);
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

        [HttpGet]
        public ActionResult InfoDepartment()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                
                BMSEmployee wBMSEmployee = GetSession();

                int wID = StringUtils.parseInt(Request.QueryParamString("ID"));

                String wCode = StringUtils.parseString(Request.QueryParamString("Code"));

                ServiceResult<BMSDepartment> wServerRst = ServiceInstance.mBMSService.BMS_QueryDepartmentByID(wBMSEmployee, wID, wCode);

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst.getResult());
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
        public ActionResult UpdateDepartment()
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

                BMSDepartment wBMSDepartment = CloneTool.Clone<BMSDepartment>(wParam["data"]);
                ServiceResult<Int32> wServerRst = new ServiceResult<Int32>();
                if (wBMSDepartment.ID > 0)
                {
                    wServerRst = ServiceInstance.mBMSService.BMS_SaveDepartment(wBMSEmployee, wBMSDepartment);
                }
                else
                {
                    wServerRst = ServiceInstance.mBMSService.BMS_AddDepartment(wBMSEmployee, wBMSDepartment);
                }

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBMSDepartment);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wBMSDepartment);
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
        public ActionResult SyncDepartmentAll()
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

                List<BMSDepartment> wBMSDepartmentList = CloneTool.CloneArray<BMSDepartment>(wParam["data"]);
                ServiceResult<List<String>> wServerRst = ServiceInstance.mBMSService.BMS_SyncDepartmentList(wBMSEmployee, wBMSDepartmentList);


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


        [HttpGet]
        public ActionResult AllPosition()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                

                BMSEmployee wBMSEmployee = GetSession();

                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
                String wName = StringUtils.parseString(Request.QueryParamString("Name"));
                int wDepartmentID = StringUtils.parseInt(Request.QueryParamString("DepartmentID"));

                Pagination wPagination = GetPagination();


                ServiceResult<List<BMSPosition>> wServerRst = ServiceInstance.mBMSService.BMS_QueryPositionList(wBMSEmployee, wName, wDepartmentID, wActive, wPagination);

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst.getResult(),  wPagination.TotalPage);
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

        [HttpGet]
        public ActionResult InfoPosition()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                
                BMSEmployee wBMSEmployee = GetSession();

                int wID = StringUtils.parseInt(Request.QueryParamString("ID"));

                String wCode = StringUtils.parseString(Request.QueryParamString("Code"));
                ServiceResult<BMSPosition> wServerRst = ServiceInstance.mBMSService.BMS_QueryPositionByID(wBMSEmployee, wID, wCode);

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst.getResult());
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
        public ActionResult UpdatePosition()
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

                BMSPosition wBMSPosition = CloneTool.Clone<BMSPosition>(wParam["data"]);
                ServiceResult<Int32> wServerRst = new ServiceResult<Int32>();
                if (wBMSPosition.ID > 0)
                {
                    wServerRst = ServiceInstance.mBMSService.BMS_SavePosition(wBMSEmployee, wBMSPosition);
                }
                else
                {
                    wServerRst = ServiceInstance.mBMSService.BMS_AddPosition(wBMSEmployee, wBMSPosition);
                }

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst.getResult());
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
        public ActionResult ActiveDepartment()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                
                BMSEmployee wBMSEmployee = GetSession();

                if (!wParam.ContainsKey("data") || !wParam.ContainsKey("Active"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                int wActive = StringUtils.parseInt(wParam["Active"]);
                List<BMSDepartment> wBMSDepartmentList = CloneTool.CloneArray<BMSDepartment>(wParam["data"]);
                ServiceResult<Int32> wServerRst = new ServiceResult<Int32>();
                foreach (BMSDepartment wBMSDepartment in wBMSDepartmentList)
                {
                    if (wActive == 1)
                    {
                        wServerRst = ServiceInstance.mBMSService.BMS_ActiveDepartmentByID(wBMSEmployee, wBMSDepartment.ID);
                    }
                    else
                    {
                        wServerRst = ServiceInstance.mBMSService.BMS_DisableDepartmentByID(wBMSEmployee, wBMSDepartment.ID);
                    }
                }

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst.getResult());
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
        public ActionResult ActivePosition()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                
                BMSEmployee wBMSEmployee = GetSession();

                if (!wParam.ContainsKey("data") || !wParam.ContainsKey("Active"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                int wActive = StringUtils.parseInt(wParam["Active"]);
                List<BMSPosition> wBMSPositionList = CloneTool.CloneArray<BMSPosition>(wParam["data"]);
                ServiceResult<Int32> wServerRst = new ServiceResult<Int32>();
                foreach (BMSPosition wBMSPosition in wBMSPositionList)
                {
                    if (wActive == 1)
                    {
                        wServerRst = ServiceInstance.mBMSService.BMS_ActivePositionByID(wBMSEmployee, wBMSPosition.ID);
                    }
                    else
                    {
                        wServerRst = ServiceInstance.mBMSService.BMS_DisablePositionByID(wBMSEmployee, wBMSPosition.ID);
                    }
                }
                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst.getResult());
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
        public ActionResult DeleteDepartment()
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

                List<BMSDepartment> wBMSDepartmentList = CloneTool.CloneArray<BMSDepartment>(wParam["data"]);
                ServiceResult<Int32> wServerRst = new ServiceResult<Int32>();
                foreach (BMSDepartment wBMSDepartment in wBMSDepartmentList)
                {
                    if (wBMSDepartment == null || wBMSDepartment.Active != 0 || wBMSDepartment.ID <= 0)
                    {
                        continue;
                    }
                    wServerRst = ServiceInstance.mBMSService.BMS_DeleteDepartmentByID(wBMSEmployee, wBMSDepartment.ID);
                }

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst.getResult());
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
        public ActionResult DeletePosition()
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

                List<BMSPosition> wBMSPositionList = CloneTool.CloneArray<BMSPosition>(wParam["data"]);
                ServiceResult<Int32> wServerRst = new ServiceResult<Int32>();
                foreach (BMSPosition wBMSPosition in wBMSPositionList)
                {
                    if (wBMSPosition == null || wBMSPosition.Active != 0 || wBMSPosition.ID <= 0)
                    {
                        continue;
                    }
                    wServerRst = ServiceInstance.mBMSService.BMS_DeletePositionByID(wBMSEmployee, wBMSPosition.ID);

                }
                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst.getResult());
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
    }
}
