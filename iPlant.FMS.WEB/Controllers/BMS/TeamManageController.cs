

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Http;using Microsoft.AspNetCore.Mvc;
using iPlant.Common.Tools;
using iPlant.FMS.Models;
using iPlant.FMC.Service;

namespace iPlant.FMS.WEB
{
    public class TeamManageController : BaseController
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(TeamManageController));


        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                
                BMSEmployee wBMSEmployee = GetSession();
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wDepartmentID = StringUtils.parseInt(Request.QueryParamString("DepartmentID"));
                int wModuleID = StringUtils.parseInt(Request.QueryParamString("ModuleID"));
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

                int wLeaderID = StringUtils.parseInt(Request.QueryParamString("LeaderID"));

                String wName = StringUtils.parseString(Request.QueryParamString("Name"));
                int wHasItem = StringUtils.parseInt(Request.QueryParamString("HasItem"));


                Pagination wPagination = GetPagination();


                ServiceResult<List<BMSTeamManage>> wServerRst = ServiceInstance.mBMSService.BMS_GetTeamManageList(wBMSEmployee, wName, wWorkShopID,
                        wDepartmentID, wModuleID, wLeaderID, wActive, wHasItem, wPagination);

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
        public ActionResult Info()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                
                BMSEmployee wBMSEmployee = GetSession();
                int wID = StringUtils.parseInt(Request.QueryParamString("ID"));
                
                String wCode = StringUtils.parseString(Request.QueryParamString("Code"));
                ServiceResult<BMSTeamManage> wServerRst = ServiceInstance.mBMSService.BMS_GetTeamManage(wBMSEmployee, wID, wCode);

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst.getResult());
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode());
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

                BMSTeamManage wBMSTeamManage = CloneTool.Clone<BMSTeamManage>(wParam["data"]);

                if (wBMSTeamManage.ID <= 0)
                {
                    wBMSTeamManage.CreatorID = wUserID;
                    wBMSTeamManage.Creator = wBMSEmployee.Name;
                    wBMSTeamManage.CreateTime = DateTime.Now;
                }
                wBMSTeamManage.EditorID = wUserID;
                wBMSTeamManage.Editor = wBMSEmployee.Name;
                wBMSTeamManage.EditTime = DateTime.Now;

                ServiceResult<Int32> wServerRst = ServiceInstance.mBMSService.BMS_UpdateTeamManage(wBMSEmployee, wBMSTeamManage);

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    //wBMSTeamManage.ID = wServerRst.getResult();
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBMSTeamManage);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wBMSTeamManage);
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

                BMSTeamManage wBMSTeamManage = CloneTool.Clone<BMSTeamManage>(wParam["data"]);

                ServiceResult<Int32> wServerRst = ServiceInstance.mBMSService.BMS_DeleteTeamManage(wBMSEmployee, wBMSTeamManage);

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wBMSTeamManage.ID = wServerRst.getResult();
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode());
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

                if (!wParam.ContainsKey("data") || !wParam.ContainsKey("Active"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                int wActive = StringUtils.parseInt(wParam["Active"]);
                List<BMSTeamManage> wBMSTeamManageList = CloneTool.CloneArray<BMSTeamManage>(wParam["data"]);

                ServiceResult<Int32> wServerRst = new ServiceResult<Int32>(0);
                foreach (BMSTeamManage wBMSTeamManage in wBMSTeamManageList)
                {
                    wServerRst = ServiceInstance.mBMSService.BMS_ActiveTeamManage(wBMSEmployee, wActive, wBMSTeamManage);
                    if (StringUtils.isNotEmpty(wServerRst.getFaultCode()))
                        break;
                }

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode());
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
        public ActionResult MonitorAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                
                BMSEmployee wBMSEmployee = GetSession();

                int wLeaderID = StringUtils.parseInt(Request.QueryParamString("LeaderID"));

                if (wLeaderID <= 0)
                    wLeaderID = wBMSEmployee.ID;
                ServiceResult<List<BMSTeamManage>> wServerRst = ServiceInstance.mBMSService.BMS_GetTeamManageList(wBMSEmployee, wLeaderID);

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

                List<BMSTeamManage> wBMSTeamManageList = CloneTool.CloneArray<BMSTeamManage>(wParam["data"]);
                ServiceResult<List<String>> wServerRst = ServiceInstance.mBMSService.BMS_SyncTeamManageList(wBMSEmployee, wBMSTeamManageList);


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

    }
}
