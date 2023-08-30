
using iPlant.Common.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using iPlant.FMS.Models;
using iPlant.FMC.Service;

namespace iPlant.FMS.WEB
{
    
    public class UserController : BaseController
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(UserController));
        [HttpPost]
        public ActionResult Login()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                 
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                int wUserID = 0;
                BMSEmployee wBMSEmployeeOld = GetSession();
                if (wBMSEmployeeOld != null && wBMSEmployeeOld.ID > 0)
                {
                    wUserID = wBMSEmployeeOld.ID;
                }
                String wLoginName = wParam.ContainsKey("user_id") ? StringUtils.parseString(wParam["user_id"]) : "";
                String wLoginName_Name = wParam.ContainsKey("user_name") ? StringUtils.parseString(wParam["user_name"])
                        : "";
                String wPassword = wParam.ContainsKey("passWord") ? StringUtils.parseString(wParam["passWord"]) : "";

                String wToken = wParam.ContainsKey("token") ? StringUtils.parseString(wParam["token"]) : "";

                long wMac = wParam.ContainsKey("PhoneMac") ? StringUtils.parseLong(wParam["PhoneMac"]) : 0L;

                int wNetJS = wParam.ContainsKey("netJS") ? StringUtils.parseInt(wParam["netJS"]) : 0;

                BMSEmployee wBMSEmployee = new BMSEmployee();
                ServiceResult<BMSEmployee> wServiceResult = new ServiceResult<BMSEmployee>(wBMSEmployee);
                if (StringUtils.isNotEmpty(wLoginName_Name))
                {
                    wServiceResult = ServiceInstance.mBMSService.BMS_LoginEmployeeByUserName(wLoginName_Name, wPassword);
                    wBMSEmployee = wServiceResult.Result;
                }

                if (wBMSEmployee.ID <= 0 && wBMSEmployee.ID != -100)
                {
                    if (wNetJS > 0)
                    {
                        // 解密
                        wLoginName = DesUtil.decrypt(wLoginName, SessionContants.appSecret);
                        wPassword = DesUtil.decrypt(wPassword, SessionContants.appSecret);
                        wServiceResult = ServiceInstance.mBMSService.BMS_LoginEmployee(wLoginName, wPassword, wMac);
                        wBMSEmployee = wServiceResult.Result;

                    }
                    else
                    {
                        if (StringUtils.isNotEmpty(wPassword) && wPassword.Length > 5)
                        {
                            wServiceResult = ServiceInstance.mBMSService.BMS_LoginEmployee(wLoginName, wPassword, wMac);
                            wBMSEmployee = wServiceResult.Result;
                        }
                        else if (StringUtils.isNotEmpty(wToken) && wToken.Length > 5)
                        {

                            wServiceResult = ServiceInstance.mBMSService.BMS_LoginEmployeeByToken(wLoginName, wToken);
                            wBMSEmployee = wServiceResult.Result;
                        }

                        if (wBMSEmployee.ID <= 0 && wBMSEmployee.ID != -100)
                        {

                            //LdapContext adLogin = AppDomainUtils.adLogin(wLoginName, wPassword);
                            //if (adLogin != null)
                            //{

                            //    wBMSEmployee = ServiceInstance.mBMSService.BMS_LoginEmployeeByOne(wLoginName).getResult();

                            //}
                        }
                    }
                }

                if (wUserID > 0 && wUserID != wBMSEmployee.ID && wNetJS <= 0)
                {
                    wResult = GetResult(RetCode.LOGIN_ERR_CODE_LOGIN_FAIL, "");
                    return Json(wResult);
                }
                if (StringUtils.isNotEmpty(wServiceResult.FaultCode))
                {
                    wResult = GetResult(RetCode.LOGIN_ERR_CODE_LOGIN_FAIL, wServiceResult.FaultCode);
                    return Json(wResult);
                }

                if (wBMSEmployee.ID <= 0 && wBMSEmployee.ID != -100)
                {
                    wResult = GetResult(RetCode.LOGIN_ERR_CODE_LOGIN_FAIL, RetCode.SERVER_CODE_UNLOGIN_ALARM);
                    return Json(wResult);
                }


                SetSession(Session, wBMSEmployee);
                SetCookie(Request, Response, wBMSEmployee);


                Dictionary<String, Object> wTempResult = CloneTool.Clone<Dictionary<String, Object>>(wBMSEmployee);
                wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBMSEmployee);
                wResult = wResult.Concat(wTempResult).ToDictionary(p => p.Key, p => p.Value);

            }
            catch (Exception e)
            {
                wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_IN);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);
        }
        [HttpPost]

        public ActionResult LoginByUserName()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                String wLoginID = wParam.ContainsKey("username") ? StringUtils.parseString(wParam["username"]) : "";

                BMSEmployee wBMSEmployee = new BMSEmployee();

                if (StringUtils.isNotEmpty(wLoginID))
                {
                    wBMSEmployee = ServiceInstance.mBMSService.BMS_LoginEmployeeByOne(wLoginID).getResult();
                }

                if (wBMSEmployee.ID <= 0 && wBMSEmployee.ID != -100)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, StringUtils.Format("用户： {0}不存在！", wLoginID));
                    return Json(wResult);
                }

                SetSession(Session, wBMSEmployee);
                SetCookie(Request, Response, wBMSEmployee);


                Dictionary<String, Object> wTempResult = CloneTool.Clone<Dictionary<String, Object>>(wBMSEmployee);
                wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBMSEmployee);
                wResult = wResult.Concat(wTempResult).ToDictionary(p => p.Key, p => p.Value);
            }
            catch (Exception e)
            {
                wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_IN);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);

        }

        [HttpPost]

        public ActionResult Logout()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                RmoveSession(Session);
                RmoveCookie(Request, Response);
                wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
            }
            catch (Exception e)
            {
                wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, e.ToString());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
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
                int wLoginID = wBMSEmployee.ID;

                int wUserID = StringUtils.parseInt(Request.QueryParamString("user_info"));
                if (wUserID <= 0)
                    wUserID = wLoginID;
                ServiceResult<BMSEmployee> wServerRst = ServiceInstance.mBMSService.BMS_QueryEmployeeByID(wBMSEmployee, wUserID);

                if (StringUtils.isEmpty(wServerRst.FaultCode))
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

        public ActionResult RetrievePassword()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<BMSEmployee> wBMSEmployeeList = CloneTool.Clone<List<BMSEmployee>>(wParam["data"]);

                if (wBMSEmployeeList == null || wBMSEmployeeList.Count < 1)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_IN);
                    return Json(wResult);
                }
                ServiceResult<Int32> wServerRst = new ServiceResult<Int32>(0);

                List<BMSEmployee> wEngineerUserList = ServiceInstance.mBMSService.BMS_GetEngineerUserList().Result;

                BMSEmployee wEngineerUser = null;
                BMSGrads wBMSGrads = BMSGrads.Default;

                foreach (BMSEmployee wBMSEmployeeTemp in wBMSEmployeeList)
                {
                    if (wBMSEmployeeTemp.ID <= 0)
                        continue;

                    wBMSGrads = (BMSGrads)wBMSEmployeeTemp.Grad;

                    if (wBMSEmployeeTemp.ID > ServiceInstance.mBMSService.BMS_GetMinEngineerUserID().Result || wBMSGrads == BMSGrads.Engineer
                            || wBMSGrads == BMSGrads.System)
                    {

                        wEngineerUser = wEngineerUserList.Find(p => p.ID == wBMSEmployeeTemp.ID);
                        if (wEngineerUser != null && wEngineerUser.ID > 0)
                        {
                            wEngineerUser.Password = DesUtil.encrypt("123456", SessionContants.appSecret);
                            ServiceInstance.mBMSService.BMS_SetEngineerUserList(wEngineerUserList);
                        }
                    }
                    wServerRst = ServiceInstance.mBMSService.BMS_ResetPassword(wBMSEmployee, wBMSEmployeeTemp);
                    if (StringUtils.isNotEmpty(wServerRst.getFaultCode()))
                        break;

                }
                if (wEngineerUser != null)
                {
                    ServiceInstance.mBMSService.BMS_SetEngineerUserList(wEngineerUserList);
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

        [HttpPost]

        public ActionResult PasswordModify()
        {

            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                BMSEmployee wBMSEmployee = null;

                String wUserAcc = StringUtils.parseString(wParam["Id"]);
                String wPassword = StringUtils.parseString(wParam["PassWord"]);
                String wOldPassWord = StringUtils.parseString(wParam["OldPassWord"]);

                if (StringUtils.isEmpty(wPassword) || wPassword.Trim().Length < 6 || wPassword.Trim().Length > 12)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, "新密码不符合标准！（长度6-12的字母和数字）");
                    return Json(wResult);
                }

                if (StringUtils.parseInt(wUserAcc) > ServiceInstance.mBMSService.BMS_GetMinEngineerUserID().Result)
                {

                    List<BMSEmployee> wEngineerUserList = ServiceInstance.mBMSService.BMS_GetEngineerUserList().Result;
                    wBMSEmployee = wEngineerUserList
                            .Find(p => p.LoginName.Equals(wUserAcc, StringComparison.CurrentCultureIgnoreCase) && p.Password
                                    .Equals(DesUtil.encrypt(wOldPassWord, SessionContants.appSecret), StringComparison.CurrentCultureIgnoreCase))
                            ;

                    if (wBMSEmployee != null && wBMSEmployee.ID > 0)
                    {

                        wBMSEmployee.Password = DesUtil.encrypt(wPassword, SessionContants.appSecret);

                        ServiceInstance.mBMSService.BMS_SetEngineerUserList(wEngineerUserList);

                        wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBMSEmployee);
                    }
                    else
                    {
                        wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_CODE_UNLOGIN_ALARM);
                    }

                    return Json(wResult);
                }

                ServiceResult<BMSEmployee> wServerRst = ServiceInstance.mBMSService.BMS_LoginEmployee(wUserAcc, wOldPassWord, 0);

                if (wServerRst.getResult() != null)
                {
                    wBMSEmployee = wServerRst.getResult();
                    if (wBMSEmployee.ID <= 0)
                    {
                        if (wBMSEmployee.ID == -1)
                        {
                            wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_CODE_UNLOGIN_ALARM);
                        }
                        else if (wBMSEmployee.ID == -2)
                        {
                            wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_CODE_UNLOGIN_ALARM_NOPD);
                        }
                        else if (wBMSEmployee.ID == -5)
                        {
                            wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_CODE_UNLOGIN_ALARM_NOMAC);
                        }
                        else
                        {
                            wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_IN);
                        }

                        return Json(wResult);
                    }

                    wBMSEmployee.Password = wPassword;

                    ServiceResult<Int32> wServiceResult = ServiceInstance.mBMSService.BMS_SavePassword(wBMSEmployee, wBMSEmployee);
                    wServerRst.FaultCode += wServiceResult.getFaultCode();
                }

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBMSEmployee);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wBMSEmployee);
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_SUC, ex.ToString(), null, null);
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

                int wActive = StringUtils.parseInt(Request.QueryParamString("active"));
                if (wActive != 1)
                    wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

                int wGrad = StringUtils.parseInt(Request.QueryParamString("grad"));

                if (wGrad > 0 && (wBMSEmployee.Grad == (int)BMSGrads.System
                        || wBMSEmployee.Grad == (int)BMSGrads.Engineer))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", ServiceInstance.mBMSService.BMS_GetEngineerUserList().Result, null);
                    return Json(wResult);
                }

                int wDepartmentID = StringUtils.parseInt(Request.QueryParamString("DepartmentID"));
                int wPosition = StringUtils.parseInt(Request.QueryParamString("Position"));
                int wPositionType = StringUtils.parseInt(Request.QueryParamString("PositionType"));
                int wRoleID = StringUtils.parseInt(Request.QueryParamString("RoleID"));
                String wName = StringUtils.parseString(Request.QueryParamString("Name"));
                int wDepartmentType = StringUtils.parseInt(Request.QueryParamString("DepartmentType"));

                Pagination wPagination = GetPagination();
                ServiceResult<List<BMSEmployee>> wServerRst = ServiceInstance.mBMSService.BMS_QueryEmployeeList(wBMSEmployee, wName, wDepartmentID,
                        wPosition, wDepartmentType, wPositionType, wRoleID, wActive,wPagination);

                if (wServerRst != null && wServerRst.getResult() != null)
                {

                    foreach (BMSEmployee wBmsEmployee in wServerRst.getResult())
                    {
                        wBmsEmployee.Password = "";
                    }
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

        public ActionResult IDAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                List<Int32> wInteger = StringUtils
                        .parseIntList(StringUtils.split(StringUtils.parseString(Request.QueryParamString("IDList")), ","));

                ServiceResult<List<BMSEmployee>> wServerRst = ServiceInstance.mBMSService.BMS_QueryEmployeeList(wBMSEmployee, wInteger);

                if (wServerRst != null && wServerRst.getResult() != null)
                {

                    foreach (BMSEmployee wBmsEmployee in wServerRst.getResult())
                    {
                        wBmsEmployee.Password = "";
                    }
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
                BMSEmployee wBMSEmployeeTemp = CloneTool.Clone<BMSEmployee>(wParam["data"]);

                wBMSEmployeeTemp.Operator = wBMSEmployee.Name;

                if (wBMSEmployeeTemp.Grad == (int)BMSGrads.System)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR,
                            StringUtils.Format("无权限操作{0}用户！", EnumTool.GetEnumDesc(BMSGrads.System)));
                    return Json(wResult);
                }

                if (wBMSEmployeeTemp.Grad == (int)BMSGrads.Engineer)
                {
                    if (wBMSEmployee.Grad != (int)BMSGrads.System)
                    {
                        wResult = GetResult(RetCode.SERVER_CODE_ERR,
                                StringUtils.Format("无权限操作{0}用户！", EnumTool.GetEnumDesc(BMSGrads.Engineer)));
                        return Json(wResult);
                    }
                    List<BMSEmployee> wEngineerUserList = ServiceInstance.mBMSService.BMS_GetEngineerUserList().Result;
                    if (wEngineerUserList == null)
                        wEngineerUserList = new List<BMSEmployee>();
                    BMSEmployee wOptionalBMSEmployee = null;
                    if (wBMSEmployeeTemp.ID > 0)
                    {
                        wOptionalBMSEmployee = wEngineerUserList.Find(p => p.ID == wBMSEmployeeTemp.ID);
                        if (wOptionalBMSEmployee == null || wOptionalBMSEmployee.ID <= 0)
                        {
                            wResult = GetResult(RetCode.SERVER_CODE_ERR,
                                    StringUtils.Format("要修改的{0}用户不存在！", EnumTool.GetEnumDesc(BMSGrads.Engineer)));
                            return Json(wResult);
                        }
                        wEngineerUserList.RemoveAll(p => p.ID == wBMSEmployeeTemp.ID);
                        wEngineerUserList.Add(wBMSEmployeeTemp);
                        ServiceInstance.mBMSService.BMS_SetEngineerUserList(wEngineerUserList);
                    }
                    else
                    {

                        foreach (BMSEmployee bmsEmployee in wEngineerUserList)
                        {
                            if (bmsEmployee.ID >= wBMSEmployeeTemp.ID)
                            {
                                wBMSEmployeeTemp.ID = bmsEmployee.ID;
                            }
                        }
                        if (wBMSEmployeeTemp.ID > 0)
                        {
                            if (wBMSEmployeeTemp.ID == Int32.MaxValue)
                            {
                                wResult = GetResult(RetCode.SERVER_CODE_ERR,
                                        StringUtils.Format("{0}用户数量已达到最大值！", EnumTool.GetEnumDesc(BMSGrads.Engineer)));
                                return Json(wResult);
                            }
                            wBMSEmployeeTemp.ID++;

                        }
                        else
                        {
                            wBMSEmployeeTemp.ID = ServiceInstance.mBMSService.BMS_GetMinEngineerUserID().Result + 1;
                        }
                        wBMSEmployeeTemp.LoginName = wBMSEmployeeTemp.ID + "";
                        wBMSEmployeeTemp.Password = DesUtil.encrypt(ServiceInstance.mBMSService.BMS_GetDefaultPassword().Result, SessionContants.appSecret);
                        wEngineerUserList.Add(wBMSEmployeeTemp);
                        ServiceInstance.mBMSService.BMS_SetEngineerUserList(wEngineerUserList);

                    }
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBMSEmployeeTemp);
                    return Json(wResult);

                }

                ServiceResult<Int32> wServerRst = new ServiceResult<Int32>(0);

                if (wBMSEmployeeTemp.ID > 0)

                    wServerRst = ServiceInstance.mBMSService.BMS_SaveEmployee(wBMSEmployee, wBMSEmployeeTemp);
                else
                    wServerRst = ServiceInstance.mBMSService.BMS_AddEmployee(wBMSEmployee, wBMSEmployeeTemp);

                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBMSEmployeeTemp);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wBMSEmployeeTemp);
                }
            }
            catch (

          Exception ex)
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

                List<BMSEmployee> wBMSEmployeeList = CloneTool.CloneArray<BMSEmployee>(wParam["data"]);

                int wActive = wParam.ContainsKey("active") ? StringUtils.parseInt(wParam["active"]) : 0;

                if (wActive != 1)
                {
                    wActive = wParam.ContainsKey("Active") ? StringUtils.parseInt(wParam["Active"]) : 0;
                }
                if (wBMSEmployeeList == null || wBMSEmployeeList.Count < 1)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_IN);
                    return Json(wResult);
                }
                ServiceResult<Int32> wServerRst = new ServiceResult<Int32>(0);
                foreach (BMSEmployee wBMSEmployeeTemp in wBMSEmployeeList)
                {
                    if (wBMSEmployee.ID <= 0)
                        continue;
                    if (wActive == 1)
                    {
                        wServerRst = ServiceInstance.mBMSService.BMS_ActiveEmployee(wBMSEmployee, wBMSEmployeeTemp);
                    }
                    else
                    {
                        wServerRst = ServiceInstance.mBMSService.BMS_DisableEmployee(wBMSEmployee, wBMSEmployeeTemp);
                    }
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

        [HttpPost]

        public ActionResult SetSuperior()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);


                BMSEmployee wBMSEmployee = GetSession();
                if (!wParam.ContainsKey("data") || !wParam.ContainsKey("DutyOrders"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<BMSEmployee> wBMSEmployeeList = CloneTool.CloneArray<BMSEmployee>(wParam["data"]);

                List<Int32> wDutyOrders = CloneTool.CloneArray<Int32>(wParam["DutyOrders"]);

                if (wBMSEmployeeList == null || wBMSEmployeeList.Count < 1 || wDutyOrders == null
                        || wDutyOrders.Count < 1)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_IN);
                    return Json(wResult);
                }
                ServiceResult<Int32> wServerRst = ServiceInstance.mBMSService.BMS_AutoSetEmployeeSuperior(wBMSEmployee, wBMSEmployeeList,
                        wDutyOrders);
                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wBMSEmployeeList, null);
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

        public ActionResult GetSuperior()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);


                BMSEmployee wBMSEmployee = GetSession();
                if (!wParam.ContainsKey("data") || !wParam.ContainsKey("DutyOrders"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }


                BMSEmployee wEmployee = CloneTool.Clone<BMSEmployee>(wParam["data"]);

                List<Int32> wDutyOrders = CloneTool.CloneArray<Int32>(wParam["DutyOrders"]);

                if (wDutyOrders == null || wDutyOrders.Count < 1)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_IN);
                    return Json(wResult);
                }
                ServiceResult<Int32> wServerRst = ServiceInstance.mBMSService.BMS_GetEmployeeSuperior(wBMSEmployee, wEmployee,
                        wDutyOrders, null, null, null);
                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wEmployee);
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

                List<BMSEmployee> wBMSEmployeeList = CloneTool.CloneArray<BMSEmployee>(wParam["data"]);

                if (wBMSEmployeeList == null || wBMSEmployeeList.Count < 1)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_IN);
                    return Json(wResult);
                }
                ServiceResult<Int32> wServerRst = new ServiceResult<Int32>(0);
                foreach (BMSEmployee wBMSEmployeeTemp in wBMSEmployeeList)
                {
                    if (wBMSEmployee.ID <= 0)
                        continue;
                    if (wBMSEmployeeTemp.Active == 1)
                        continue;

                    wServerRst = ServiceInstance.mBMSService.BMS_DeleteEmployee(wBMSEmployee, wBMSEmployeeTemp);

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

        public ActionResult InfoSecret()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wModuleID = StringUtils.parseInt(Request.QueryParamString("ModuleID"));

                if (wModuleID <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                BFCHomePageModule wHomePageModule = new BFCHomePageModule();
                ServiceResult<BFCHomePageModule> wServiceResult = ServiceInstance.mBFCService.BFC_GetHomePageModuleByID(wBMSEmployee, wModuleID);

                if (wServiceResult == null || wServiceResult.getResult() == null
                        || StringUtils.isNotEmpty(wServiceResult.getFaultCode())
                        || wServiceResult.getResult().ID != wModuleID)
                {

                    wResult = GetResult(RetCode.SERVER_CODE_ERR,
                            "Module Not Find!" + "    " + wServiceResult.getFaultCode());

                    return Json(wResult);
                }

                wHomePageModule = wServiceResult.getResult();
                Dictionary<String, Object> wRst = new Dictionary<String, Object>();

                wRst.Add("ID", DesUtil.encrypt(wBMSEmployee.ID + "", wHomePageModule.SecretKey));
                wRst.Add("LoginName", DesUtil.encrypt(wBMSEmployee.LoginName, wHomePageModule.SecretKey));
                wRst.Add("LoginID", DesUtil.encrypt(wBMSEmployee.LoginID + "", wHomePageModule.SecretKey));
                wRst.Add("Password", DesUtil.encrypt(wBMSEmployee.Password, wHomePageModule.SecretKey));
                wRst.Add("ModuleID", wModuleID);

                wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wRst);
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
            }
            return Json(wResult);
        }

        [HttpGet]

        public ActionResult SyncUser()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                Boolean wCheckPower = ServiceInstance.mBMSService
                        .BMS_CheckPowerByLoginID(wBMSEmployee.CompanyID, wBMSEmployee.ID, 900000, 0, 0)
                        .getResult();
                if (wCheckPower)
                {
                    //TaskThread.getInstance().AddDepartment();
                    //TaskThread.getInstance().AddPosition();
                    //TaskThread.getInstance().AddEmployee();
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_CODE_UNROLE);
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

                List<BMSEmployee> wBMSDepartmentList = CloneTool.CloneArray<BMSEmployee>(wParam["data"]);
                ServiceResult<List<String>> wServerRst = ServiceInstance.mBMSService.BMS_SyncEmployeeList(wBMSEmployee, wBMSDepartmentList);


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

        public ActionResult LoginByADCard()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                String wCardID = wParam.ContainsKey("ad_card") ? StringUtils.parseString(wParam["ad_card"]) : "";
                if (StringUtils.isEmpty(wCardID))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                String wLoginID = ServiceInstance.mBMSService.ADC_GetLoginIDByCardID(wCardID).getResult();

                BMSEmployee wBMSEmployee = new BMSEmployee();

                if (StringUtils.isNotEmpty(wLoginID))
                {
                    wBMSEmployee = ServiceInstance.mBMSService.BMS_LoginEmployeeByOne(wLoginID).getResult();
                }

                if (wBMSEmployee.ID <= 0 && wBMSEmployee.ID != -100)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, StringUtils.Format("用户： {0}不存在！", wLoginID));
                    return Json(wResult);
                }

                SetSession(Session, wBMSEmployee);
                SetCookie(Request, Response, wBMSEmployee);

                Dictionary<String, Object> wTempResult = CloneTool.Clone<Dictionary<String, Object>>(wBMSEmployee);
                wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBMSEmployee);
                wResult = wResult.Concat(wTempResult).ToDictionary(p => p.Key, p => p.Value);
            }
            catch (Exception e)
            {
                wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_IN);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);

        }


    }
}
