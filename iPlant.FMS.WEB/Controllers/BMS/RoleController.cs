

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
    public class RoleController : BaseController
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(RoleController));


        [HttpGet]
        public ActionResult Tree()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                
                BMSEmployee wBMSEmployee = GetSession();

                ServiceResult<List<BMSRoleItem>> wServerRst = ServiceInstance.mBMSService.BMS_GetFunctionNodeTree(wBMSEmployee, 1);

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
        public ActionResult TreeAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                
                BMSEmployee wBMSEmployee = GetSession();
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

                ServiceResult<List<BMSRoleItem>> wServerRst = ServiceInstance.mBMSService.BMS_GetFunctionNodeTree(wBMSEmployee, wActive);

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
        public ActionResult TreeUpdate()
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

                BMSRoleItem wBMSRoleItem = CloneTool.Clone<BMSRoleItem>(wParam["data"]);

                ServiceResult<BMSRoleItem> wServerRst = ServiceInstance.mBMSService.BMS_UpdateFunctionNodeTree(wBMSEmployee, wBMSRoleItem);

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
        public ActionResult TreeActive()
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

                List<Int32> wFunctionIDList = CloneTool.CloneArray<Int32>(wParam["data"]);
                int wActive = StringUtils.parseInt(wParam["Active"]);
                ServiceResult<Int32> wServerRst = ServiceInstance.mBMSService.BMS_ActiveFunctionNodeTree(wBMSEmployee, wFunctionIDList,
                        wActive);

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

        [HttpPost]
        public ActionResult TreeDelete()
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

                List<Int32> wFunctionIDList = CloneTool.CloneArray<Int32>(wParam["data"]);

                ServiceResult<Int32> wServerRst = ServiceInstance.mBMSService.BMS_DeleteFunctionNodeTree(wBMSEmployee, wFunctionIDList);

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
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                
                BMSEmployee wBMSEmployee = GetSession();
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
                int wDepartmentID = StringUtils.parseInt(Request.QueryParamString("DepartmentID"));
                int wUserID = StringUtils.parseInt(Request.QueryParamString("UserID"));
                String wName = StringUtils.parseString(Request.QueryParamString("Name"));


                Pagination wPagination = GetPagination();

                ServiceResult<List<BMSRole>> wServerRst = ServiceInstance.mBMSService.BMS_GetRoleList(wBMSEmployee, wName, wDepartmentID, wUserID,wActive, wPagination);

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
        public ActionResult Select()
        {

            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                
                BMSEmployee wBMSEmployee = GetSession();
                int wRoleID = StringUtils.parseInt(Request.QueryParamString("role_id"));

                ServiceResult<List<BMSRoleItem>> wServerRst = ServiceInstance.mBMSService.BMS_QueryFunctionListByRoleID(wBMSEmployee,
                        wRoleID);

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
        public ActionResult UserAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                
                BMSEmployee wBMSEmployee = GetSession();
                int wRoleID = StringUtils.parseInt(Request.QueryParamString("role_id"));

                ServiceResult<List<BMSRoleItem>> wServerRst = ServiceInstance.mBMSService.BMS_QueryUserListByRoleID(wBMSEmployee, wRoleID);

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

                List<BMSRole> wBMSRoleItemList = CloneTool.CloneArray<BMSRole>(wParam["data"]);

                int wActive = wParam.ContainsKey("active") ? StringUtils.parseInt(wParam["active"]) : 0;
                if (wActive != 1)
                {
                    wActive = wParam.ContainsKey("Active") ? StringUtils.parseInt(wParam["Active"]) : 0;
                }
                ServiceResult<Int32> wServerRst = new ServiceResult<Int32>(0);
                foreach (BMSRole wBMSRoleItem in wBMSRoleItemList)
                {
                    if (wBMSRoleItem.ID <= 0)
                    {
                        continue;
                    }

                    if (wActive == 1)
                    {
                        wServerRst = ServiceInstance.mBMSService.BMS_ActiveRole(wBMSEmployee, wBMSRoleItem.ID);
                    }
                    else
                    {
                        wServerRst = ServiceInstance.mBMSService.BMS_DisableRole(wBMSEmployee, wBMSRoleItem.ID);
                    }
                    if (StringUtils.isNotEmpty(wServerRst.getFaultCode()))
                        break;

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
        public ActionResult Update()
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

                BMSRole wBMSRole = CloneTool.Clone<BMSRole>(wParam["data"]);
                if (wBMSRole == null)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                ServiceResult<BMSRole> wServerRst = new ServiceResult<BMSRole>(wBMSRole);

                if (wBMSRole.ID > 0)
                {
                    ServiceResult<Int32> wServiceResult = ServiceInstance.mBMSService.BMS_SaveRole(wBMSEmployee, wBMSRole);
                    wServerRst.FaultCode = wServiceResult.getFaultCode();

                }
                else
                {
                    wServerRst = ServiceInstance.mBMSService.BMS_AddRole(wBMSEmployee, wBMSRole);
                }

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBMSRole);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wBMSRole);
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

                List<BMSRole> wBMSRoleList = CloneTool.CloneArray<BMSRole>(wParam["data"]);
                ServiceResult<List<String>> wServerRst = ServiceInstance.mBMSService.BMS_SyncRoleList(wBMSEmployee, wBMSRoleList);


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

                BMSRole wBMSRole = CloneTool.Clone<BMSRole>(wParam["data"]);
                if (wBMSRole == null || wBMSRole.ID <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }


                ServiceResult<Int32> wServiceResult = ServiceInstance.mBMSService.BMS_RemoveRole(wBMSEmployee, wBMSRole.ID);



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
        public ActionResult UpdateSelect()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                
                BMSEmployee wBMSEmployee = GetSession();

                if (!wParam.ContainsKey("data") || !wParam.ContainsKey("RoleID"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                List<BMSRoleItem> wBMSRoleItemList = CloneTool.CloneArray<BMSRoleItem>(wParam["data"]);

                int wRoleID = StringUtils.parseInt(wParam["RoleID"]);

                ServiceResult<Int32> wServerRst = ServiceInstance.mBMSService.BMS_SaveRoleFunctionList(wBMSEmployee, wRoleID,
                        wBMSRoleItemList);

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
        public ActionResult UpdateUser()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                
                BMSEmployee wBMSEmployee = GetSession();

                if (!wParam.ContainsKey("data") || !wParam.ContainsKey("RoleID"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<BMSRoleItem> wBMSRoleItemList = CloneTool.CloneArray<BMSRoleItem>(wParam["data"]);
                int wRoleID = StringUtils.parseInt(wParam["RoleID"]);
                ServiceResult<Int32> wServerRst = ServiceInstance.mBMSService.BMS_SaveRoleUserList(wBMSEmployee, wRoleID,
                        wBMSRoleItemList);

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
        public ActionResult UserAllByFunctionID()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                
                BMSEmployee wBMSEmployee = GetSession();


                String wPath = StringUtils.parseString(Request.QueryParamString("Path"));
                int wFunctionID = StringUtils.parseInt(Request.QueryParamString("FunctionID"));

                ServiceResult<List<BMSRoleItem>> wServerRst = new ServiceResult<List<BMSRoleItem>>();
                if (StringUtils.isNotEmpty(wPath))
                {
                    wServerRst = ServiceInstance.mBMSService.BMS_QueryUserListByPath(wBMSEmployee,
                       wPath);
                }
                else
                {
                    wServerRst = ServiceInstance.mBMSService.BMS_QueryUserListByFunctionID(wBMSEmployee,
                       wFunctionID);
                }


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
        public ActionResult Check()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                int wUserID = StringUtils.parseInt(Request.QueryParamString("UserID"));
                int wCompanyID = StringUtils.parseInt(Request.QueryParamString("CompanyID"));

                if (!CheckCookieEmpty())
                {
                    BMSEmployee wBMSEmployee = GetSession();
                    wUserID = wBMSEmployee.ID;
                    wCompanyID = wBMSEmployee.CompanyID;
                }

                int wAuthortyID = StringUtils.parseInt(Request.QueryParamString("AuthortyID"));

                String wPath = StringUtils.parseString(Request.QueryParamString("Path"));

                int wRangeID = StringUtils.parseInt(Request.QueryParamString("RangeID"));

                int wTypeID = StringUtils.parseInt(Request.QueryParamString("TypeID"));
                ServiceResult<Boolean> wServerRst = new ServiceResult<bool>(false);
                if (StringUtils.isNotEmpty(wPath))
                {
                    wServerRst = ServiceInstance.mBMSService.BMS_CheckPowerByLoginID(wCompanyID, wUserID, wPath,
                        wRangeID, wTypeID);
                }
                else
                {
                    wServerRst = ServiceInstance.mBMSService.BMS_CheckPowerByLoginID(wCompanyID, wUserID, wAuthortyID,
                     wRangeID, wTypeID);
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
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, false);
            }
            return Json(wResult);
        }

        [HttpGet]
        public ActionResult FunctionAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                
                BMSEmployee wBMSEmployee = GetSession();
                int wLoginID = wBMSEmployee.ID;

                int wOperatorID = StringUtils.parseInt(Request.QueryParamString("OperatorID"));

                if (wOperatorID <= 0)
                    wOperatorID = wLoginID;

                ServiceResult<List<BMSRoleItem>> wServerRst = ServiceInstance.mBMSService.BMS_GetFunctionListByLoginID(wBMSEmployee,
                        wOperatorID);

                List<Int32> wDistin = new List<Int32>();
                if (wServerRst != null && wServerRst.getResult() != null && wServerRst.getResult().Count > 0)
                {
                    wDistin = wServerRst.getResult().Select(p => p.FunctionID).Distinct().ToList();
                }

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst.getResult(), wDistin);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), wServerRst.getResult(),
                            wDistin);
                }

            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, false);
            }
            return Json(wResult);
        }

        [HttpGet]
        public ActionResult UserRoleByFunctionID()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                

                BMSEmployee wBMSEmployee = GetSession();
                int wUserID = wBMSEmployee.ID;
                int wFunctionID = StringUtils.parseInt(Request.QueryParamString("FunctionID"));

                List<BMSRoleItem> wBMSRoleItemList = new List<BMSRoleItem>();
                ServiceResult<List<BMSRole>> wBMSRoleServerRst = ServiceInstance.mBMSService.BMS_GetRoleList(wBMSEmployee, "", -1, -1, 1,Pagination.MaxSize);
                if (wBMSRoleServerRst.getResult() != null)
                {
                    foreach (BMSRole wBMSRole in wBMSRoleServerRst.getResult())
                    {
                        ServiceResult<List<BMSRoleItem>> wFunctionServerRst = ServiceInstance.mBMSService
                                .BMS_QueryFunctionListByRoleID(wBMSEmployee, wBMSRole.ID);
                        wBMSRoleServerRst.FaultCode += wFunctionServerRst.FaultCode;
                        if (wFunctionServerRst.getResult() == null || wFunctionServerRst.getResult().Count <= 0)
                            continue;
                        if (wFunctionServerRst.getResult().FindIndex(p => p.FunctionID == wFunctionID) >= 0
                              )
                        {
                            ServiceResult<List<BMSRoleItem>> wUserServerRst = ServiceInstance.mBMSService
                                    .BMS_QueryUserListByRoleID(wBMSEmployee, wBMSRole.ID);
                            wBMSRoleServerRst.FaultCode += wUserServerRst.FaultCode;
                            if (wUserServerRst.getResult() != null && wUserServerRst.getResult().Count > 0)
                                wBMSRoleItemList.AddRange(wUserServerRst.getResult());
                        }
                    }
                }

                List<BMSRoleItem> wServerRst = wBMSRoleItemList.FindAll(p => p.FunctionID == wUserID);

                if (StringUtils.isEmpty(wBMSRoleServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wBMSRoleServerRst.getFaultCode(), null, wServerRst);
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
        public ActionResult RoleRangeAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                

                BMSEmployee wBMSEmployee = GetSession();

                int wRoleID = StringUtils.parseInt(Request.QueryParamString("RoleID"));

                ServiceResult<List<BMSRoleItem>> wServerRst = ServiceInstance.mBMSService.BMS_QueryRangeListByRoleID(wBMSEmployee, wRoleID);

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
        public ActionResult FunctionRangeAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                

                BMSEmployee wBMSEmployee = GetSession();
                int wUserID = wBMSEmployee.ID;

                int wFunctionID = StringUtils.parseInt(Request.QueryParamString("FunctionID"));
                int wOperatorID = StringUtils.parseInt(Request.QueryParamString("OperatorID"));

                if (wOperatorID <= 0)
                    wOperatorID = wUserID;
                ServiceResult<List<BMSRoleItem>> wServerRst = ServiceInstance.mBMSService.BMS_QueryRangeListByOperatorID(wBMSEmployee,
                        wOperatorID, wFunctionID);

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
        public ActionResult UpdateRoleRange()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                
                BMSEmployee wBMSEmployee = GetSession();

                if (!wParam.ContainsKey("data") || !wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                int wRoleID = StringUtils.parseInt(wParam["RoleID"]);
                List<BMSRoleItem> wBMSRoleItemList = CloneTool.CloneArray<BMSRoleItem>(wParam["data"]);

                ServiceResult<Int32> wServerRst = ServiceInstance.mBMSService.BMS_SaveRoleRangeList(wBMSEmployee, wRoleID,
                        wBMSRoleItemList);

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
