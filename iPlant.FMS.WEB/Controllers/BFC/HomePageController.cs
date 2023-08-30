
using iPlant.Common.Tools;
using iPlant.FMS.Models;
using iPlant.FMC.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using iPlant.Data.EF.Repository;

namespace iPlant.FMS.WEB
{

    public class HomePageController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(HomePageController));

        // GET: HomePage
        [HttpGet]
        public ActionResult Index()
        {
            return Redirect("../../index.html");
        }

        [HttpGet]
        public ActionResult Show()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();
                int wType = StringUtils.parseInt(Request.QueryParamString("Type"));
                BFCHomeUser wHomeUser = new BFCHomeUser();

                wHomeUser.Name = wBMSEmployee.Name;
                /**
                 * HomeUser的其他字段需要后续的xml补充
                 */
                wHomeUser.CompanyName = Constants.CompanyName;
                wHomeUser.CompanyFaces = GetProjectName(Request) + Constants.CompanyFaceUrl;
                wHomeUser.Faces = GetProjectName(Request) + wBMSEmployee.FaceIcon;
                wHomeUser.LoginName = DesUtil.decrypt(wBMSEmployee.LoginName, SessionContants.appSecret);
                wHomeUser.Name = wBMSEmployee.Name;
                wHomeUser.Grad = wBMSEmployee.Grad;
                wHomeUser.LoginID = wBMSEmployee.LoginID;
                wHomeUser.UserID = wBMSEmployee.ID;
                wHomeUser.RoleList = ServiceInstance.mBMSService.BMS_GetFunctionListByLoginID(wBMSEmployee,
                        wBMSEmployee.ID).Result;

                Dictionary<String, Object> Rst = new Dictionary<String, Object>();

                ServiceResult<List<BFCHomePageGroup>> wBFCHomePageGroupList = ServiceInstance.mBFCService.BFC_GetHomePageGroupList(wBMSEmployee, wType,
                        wBMSEmployee.Grad);

                ServiceResult<List<BFCHomePageModule>> wBFCHomePageModuleList = ServiceInstance.mBFCService.BFC_GetHomePageModuleList(wBMSEmployee, wType,
                        wBMSEmployee.Grad);

                if (wBFCHomePageGroupList.Result.Count > 1)
                {
                    wBFCHomePageGroupList.Result.Sort((o1, o2) => o1.OrderNum - o2.OrderNum);
                }
                if (wBFCHomePageModuleList.Result.Count > 1)
                {
                    wBFCHomePageModuleList.Result.Sort((o1, o2) => o1.OrderNum - o2.OrderNum);
                }

                DateTime wBaseTime = new
                DateTime(2000, 1, 1);
                List<BFCHomePageGroup> wServerRst = new List<BFCHomePageGroup>();

                Dictionary<Int32, Int32> wEXCMessageDic = new Dictionary<Int32, Int32>();
                if (wType != (int)BFCClientType.WEB)
                {
                    // GetMessageCount获取消息数量
                    ServiceResult<Dictionary<Int32, Int32>> wEXCMessageListResult = ServiceInstance.mBFCService
                            .BFC_GetUndoMessagCount(wBMSEmployee, wBMSEmployee.ID, -1);

                    if (wEXCMessageListResult != null && wEXCMessageListResult.getResult() != null
                            && wEXCMessageListResult.getResult().Count > 0)
                    {
                        wEXCMessageDic = wEXCMessageListResult.getResult();
                    }
                }

                if (wEXCMessageDic.ContainsKey(0))
                {
                    wEXCMessageDic.Remove(0);
                }
                // Dictionary<int,EXCMessage>
                // wEXCMessageList.stream().collect(Collectors.toMap(p=>p.ModuleID, k=>k));

                // 获取这个人的所有权限

                List<Int32> wFunctionIDList = new List<Int32>();

                List<BMSRoleItem> wOwnFunctionList = ServiceInstance.mBMSService.BMS_GetFunctionListByLoginID(wBMSEmployee, wBMSEmployee.ID)
                        .getResult();
                if (wOwnFunctionList != null && wOwnFunctionList.Count > 0)
                {
                    wFunctionIDList = wOwnFunctionList.Select(p => p.FunctionID).Distinct().ToList();

                }

                foreach (BFCHomePageGroup wBFCHomePageGroup in wBFCHomePageGroupList.getResult())
                {
                    if (wBFCHomePageGroup.Active != 1)
                        continue;

                    if (wBFCHomePageGroup.Grad != wBMSEmployee.Grad)
                    {
                        continue;
                    }

                    // 检查菜单权限
                    if (wBFCHomePageGroup.RoleID > 0 && !wFunctionIDList.Contains(wBFCHomePageGroup.RoleID))
                    {
                        continue;
                    }

                    foreach (BFCHomePageModule wBFCHomePageModule in wBFCHomePageModuleList.getResult())
                    {
                        if (wBFCHomePageModule.Active != 1
                                || wBFCHomePageModule.GroupID != wBFCHomePageGroup.ID)
                            continue;
                        if (wBFCHomePageModule.Grad != wBMSEmployee.Grad)
                        {
                            continue;
                        }

                        // 检查菜单权限
                        if (wBFCHomePageModule.RoleID > 0
                                && !wFunctionIDList.Contains(wBFCHomePageModule.RoleID))
                        {
                            continue;
                        }

                        if (wType != (int)BFCClientType.WEB)
                        {

                            if (wEXCMessageDic.ContainsKey(wBFCHomePageModule.EventModule))
                            {
                                wBFCHomePageModule.MessageCount = wEXCMessageDic[wBFCHomePageModule.EventModule];
                            }
                        }
                        wBFCHomePageModule.SecretKey = "";
                        wBFCHomePageGroup.ModuleList.Add(wBFCHomePageModule);
                        wBFCHomePageGroup.MessageCount += wBFCHomePageModule.MessageCount;

                        this.SetMsgCount(wBFCHomePageGroupList.getResult(), wBFCHomePageGroup.GroupID,
                                wBFCHomePageModule.MessageCount);
                        // 找上级组 然后加

                    }

                    if (wBFCHomePageGroup.GroupID <= 0)
                    {
                        // 主目录
                        wServerRst.Add(wBFCHomePageGroup);
                    }
                    else if (wBFCHomePageGroup.ModuleList != null && wBFCHomePageGroup.ModuleList.Count > 0)
                    {
                        // 此目录需要子项为
                        wServerRst.Add(wBFCHomePageGroup);
                    }
                }
                Rst.Add("module", wServerRst);
                Rst.Add("user", wHomeUser);
                wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, Rst);

            }
            catch (Exception e)
            {
                wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_CODE_ERR_MSG);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);
        }


        [HttpGet]
        public ActionResult CopyMenu()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();
                int wType = StringUtils.parseInt(Request.QueryParamString("Type"));

                int wGrad = StringUtils.parseInt(Request.QueryParamString("Grad"));


                int wToGrad = StringUtils.parseInt(Request.QueryParamString("ToGrad"));

                if (wType <= 0 || wGrad < 0 || wToGrad < 0 || wGrad == wToGrad)
                {

                    wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_RST_ERROR_OUT);

                    return Json(wResult);
                }



                Dictionary<String, Object> Rst = new Dictionary<String, Object>();

                ServiceResult<List<BFCHomePageGroup>> wBFCHomePageGroupList = ServiceInstance.mBFCService.BFC_GetHomePageGroupList(wBMSEmployee, wType,
                        wGrad);

                ServiceResult<List<BFCHomePageModule>> wBFCHomePageModuleList = ServiceInstance.mBFCService.BFC_GetHomePageModuleList(wBMSEmployee, wType,
                        wGrad);

                if (wBFCHomePageGroupList.Result.Count > 1)
                {
                    wBFCHomePageGroupList.Result.Sort((o1, o2) => o1.OrderNum - o2.OrderNum);
                }
                if (wBFCHomePageModuleList.Result.Count > 1)
                {
                    wBFCHomePageModuleList.Result.Sort((o1, o2) => o1.OrderNum - o2.OrderNum);
                }

                DateTime wBaseTime = new
                DateTime(2000, 1, 1);
                List<BFCHomePageGroup> wServerRst = new List<BFCHomePageGroup>();




                var wGroupDic = wBFCHomePageGroupList.getResult().ToDictionary(p => p.ID, p => p);

                wBFCHomePageGroupList.getResult().ForEach(p => { p.MessageCount = p.ID; p.ID = 0; });

                foreach (BFCHomePageGroup wBFCHomePageGroup in wBFCHomePageGroupList.getResult())
                {
                    if (wBFCHomePageGroup.Active != 1)
                        continue;

                    if (wBFCHomePageGroup.Grad != wGrad)
                    {
                        continue;
                    }
                    wBFCHomePageGroup.Grad = wToGrad;

                    if (wBFCHomePageGroup.GroupID > 0)
                    {
                        if (wGroupDic.ContainsKey(wBFCHomePageGroup.GroupID))
                        {

                            if (wGroupDic[wBFCHomePageGroup.GroupID].ID <= 0)
                            {
                                //插入
                                ServiceInstance.mBFCService.BFC_UpdateHomePageGroup(wBMSEmployee, wGroupDic[wBFCHomePageGroup.GroupID]);
                            }

                            wBFCHomePageGroup.GroupID = wGroupDic[wBFCHomePageGroup.GroupID].ID;
                        }
                        else
                        {
                            wBFCHomePageGroup.GroupID = 0;
                        }

                    }

                    //插入 
                    ServiceInstance.mBFCService.BFC_UpdateHomePageGroup(wBMSEmployee, wBFCHomePageGroup);

                }

                //插入菜单组 
                foreach (BFCHomePageModule wBFCHomePageModule in wBFCHomePageModuleList.getResult())
                {
                    if (wBFCHomePageModule.Active != 1
                            || !wGroupDic.ContainsKey(wBFCHomePageModule.GroupID))
                        continue;

                    if (wBFCHomePageModule.Grad != wGrad)
                    {
                        continue;
                    }
                    wBFCHomePageModule.Grad = wToGrad;
                    wBFCHomePageModule.ID = 0;
                    wBFCHomePageModule.GroupID = wGroupDic[wBFCHomePageModule.GroupID].ID;
                    //插入菜单项
                    ServiceInstance.mBFCService.BFC_UpdateHomePageModule(wBMSEmployee, wBFCHomePageModule);

                }

                wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, Rst);

            }
            catch (Exception e)
            {
                wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_CODE_ERR_MSG);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);
        }


        [HttpPost]
        [HttpGet]
        public ActionResult Error()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {


            }
            catch (Exception e)
            {
                wResult = GetResult(RetCode.SERVER_CODE_SUC, RetCode.SERVER_CODE_ERR_MSG);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);
        }



        private void SetMsgCount(List<BFCHomePageGroup> wBFCHomePageGroupList, int wGroupID, int wMsgCount)
        {

            try
            {
                if (wGroupID <= 0)
                    return;
                BFCHomePageGroup wBFCHomePageGroup = wBFCHomePageGroupList.Find(p => p.ID == wGroupID);
                if (wBFCHomePageGroup == null || wBFCHomePageGroup.ID <= 0)
                {
                    return;
                }

                wBFCHomePageGroup.MessageCount += wMsgCount;
                if (wBFCHomePageGroup.GroupID <= 0)
                    return;
                SetMsgCount(wBFCHomePageGroupList, wBFCHomePageGroup.GroupID, wMsgCount);
            }
            catch (Exception e)
            {
                logger.Error("SetMsgCount", e);
            }
        }

        [HttpGet]
        public ActionResult VersionLast()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                String client_info = StringUtils.parseString(Request.QueryParamString("client_info"));
                int wType = StringUtils.parseInt(Request.QueryParamString("Type"));
                if (client_info == null)
                    client_info = "";
                if (wType <= 0)
                    wType = (int)BFCClientType.APP;

                BFCClientConfig wClientManage = new BFCClientConfig();
                switch (wType)
                {
                    case (int)BFCClientType.APP:
                        wClientManage = Constants.getBFCClientConfig_APP();
                        break;
                    case (int)BFCClientType.CLIENT:
                        wClientManage = Constants.getBFCClientConfig();
                        break;
                    default:
                        break;
                }

                Dictionary<String, Object> wInfo = new Dictionary<String, Object>();
                wInfo.Add("version_info", wClientManage.VersionID);
                wInfo.Add("description", wClientManage.Description);
                wInfo.Add("url", GetProjectName(Request) + wClientManage.Url);
                wInfo.Add("is_update", wClientManage.IsUpdate);

                if (wClientManage.IsUpdate && client_info.Equals(wClientManage.VersionID, StringComparison.CurrentCultureIgnoreCase))
                {
                    wInfo.Add("is_update", false);
                }

                wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wInfo);
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);
        }

        [HttpGet]
        public ActionResult GroupAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                if (wBMSEmployee.Grad < (int)BMSGrads.Engineer)
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_CODE_UNROLE);
                    return Json(wResult);
                }
                int wType = StringUtils.parseInt(Request.QueryParamString("Type"));
                int wGrad = StringUtils.parseInt(Request.QueryParamString("Grad"));

                ServiceResult<List<BFCHomePageGroup>> wServiceResult = ServiceInstance.mBFCService.BFC_GetHomePageGroupList(wBMSEmployee, wType, wGrad);
                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.getResult(),
                            null);
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);
        }


        [HttpGet]
        public ActionResult ModuleAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                if (wBMSEmployee.Grad < (int)BMSGrads.Engineer)
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_CODE_UNROLE);
                    return Json(wResult);
                }
                int wType = StringUtils.parseInt(Request.QueryParamString("Type"));
                int wGrad = StringUtils.parseInt(Request.QueryParamString("Grad"));

                ServiceResult<List<BFCHomePageModule>> wServiceResult = ServiceInstance.mBFCService.BFC_GetHomePageModuleList(wBMSEmployee, wType, wGrad);
                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {

                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.getResult(),
                            null);
                }
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);
        }


        [HttpPost]
        public ActionResult GroupUpdate()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                BMSEmployee wBMSEmployee = GetSession();

                if (wBMSEmployee.Grad < (int)BMSGrads.Engineer)
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_CODE_UNROLE);
                    return Json(wResult);
                }
                if (!wParam.ContainsKey("data"))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                BFCHomePageGroup wBFCHomePageGroup = CloneTool.Clone<BFCHomePageGroup>(wParam["data"]);

                if (wBFCHomePageGroup.ID <= 0)
                {
                    wBFCHomePageGroup.CreateTime = DateTime.Now;
                    wBFCHomePageGroup.CreatorID = wBMSEmployee.ID;
                    wBFCHomePageGroup.Active = 0;
                    if (StringUtils.isEmpty(wBFCHomePageGroup
                            .Icon))
                    {
                        wBFCHomePageGroup
                                .Icon = StringUtils.Format("{0}{1}", GetProjectName(Request), Constants.MENU_GROUP_ICON);
                    }
                }
                else if (wBFCHomePageGroup.Active > 3 || wBFCHomePageGroup.Active < 0)
                {
                    wBFCHomePageGroup.Active = 3;
                }
                wBFCHomePageGroup.EditTime = DateTime.Now;
                wBFCHomePageGroup.EditorID = wBMSEmployee.ID;

                ServiceResult<Int32> wServiceResult = ServiceInstance.mBFCService.BFC_UpdateHomePageGroup(wBMSEmployee, wBFCHomePageGroup);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_SUC, "", null, wBFCHomePageGroup);
                }
                else
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null,
                            wBFCHomePageGroup);
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString(), null, null);
            }
            return Json(wResult);
        }


        [HttpPost]
        public ActionResult ModuleUpdate()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                BMSEmployee wBMSEmployee = GetSession();

                if (wBMSEmployee.Grad < (int)BMSGrads.Engineer)
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_CODE_UNROLE);
                    return Json(wResult);
                }

                if (!wParam.ContainsKey("data"))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                BFCHomePageModule wBFCHomePageModule = CloneTool.Clone<BFCHomePageModule>(wParam["data"]);
                if (wBFCHomePageModule.ID <= 0)
                {
                    wBFCHomePageModule.CreateTime = DateTime.Now;
                    wBFCHomePageModule.CreatorID = wBMSEmployee.ID;
                    wBFCHomePageModule.Active = 0;
                    if (StringUtils.isEmpty(wBFCHomePageModule
                          .Icon))
                    {

                        wBFCHomePageModule
                            .Icon = StringUtils.Format("{0}{1}", GetProjectName(Request), Constants.MENU_MODULE_ICON);
                    }
                }
                else if (wBFCHomePageModule.Active > 3 || wBFCHomePageModule.Active < 0)
                {
                    wBFCHomePageModule.Active = 3;
                }
                wBFCHomePageModule.EditTime = DateTime.Now;
                wBFCHomePageModule.EditorID = wBMSEmployee.ID;

                ServiceResult<Int32> wServiceResult = ServiceInstance.mBFCService.BFC_UpdateHomePageModule(wBMSEmployee, wBFCHomePageModule);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_SUC, "", null, wBFCHomePageModule);
                }
                else
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null,
                            wBFCHomePageModule);
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString(), null, null);
            }
            return Json(wResult);

        }



        [HttpGet]
        public ActionResult getMessageCount()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                // BMSEmployee wBMSEmployee = GetSession();
                String wLoginName = StringUtils.parseString(Request.QueryParamString("username"));

                int wMessageType = StringUtils.parseInt(Request.QueryParamString("MessageType"));

                List<Int32> wMessageIDList = StringUtils
                        .parseIntList(StringUtils.parseString(Request.QueryParamString("EventModules")), ",");

                DateTime wBaseTime = new DateTime(2000, 1, 1);

                BMSEmployee wBMSEmployee = new BMSEmployee();

                if (StringUtils.isNotEmpty(wLoginName))
                {
                    wBMSEmployee = ServiceInstance.mBMSService.BMS_LoginEmployeeByOne(wLoginName).getResult();
                }

                if (wBMSEmployee.ID <= 0)
                {
                    wResult.Add("state", "1");
                    wResult.Add("errorMessage", StringUtils.Format("用户： {0}不存在！", wLoginName));
                    wResult.Add("count", "0");
                    return Json(wResult);
                }

                ServiceResult<int> wServiceResult = ServiceInstance.mBFCService
                        .BFC_GetMessageCount(wBMSEmployee, wBMSEmployee.ID, wMessageType, wMessageIDList);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult.Add("state", "1");
                    wResult.Add("errorMessage", "");
                    wResult.Add("count", "" + wServiceResult.Result);

                }
                else
                {
                    wResult.Add("state", "0");
                    wResult.Add("errorMessage", wServiceResult.getFaultCode());
                    wResult.Add("count", "0");
                }

            }
            catch (Exception e)
            {
                wResult.Add("state", "0");
                wResult.Add("errorMessage", RetCode.SERVER_RST_ERROR_IN);
                wResult.Add("count", "0");
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);
        }



        [HttpGet]
        public ActionResult MessageBell()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();


                int wMessageType = StringUtils.parseInt(Request.QueryParamString("MessageType"));


                int wResponsorID = StringUtils.parseInt(Request.QueryParamString("ResponsorID"));

                List<Int32> wMessageIDList = StringUtils
                        .parseIntList(StringUtils.parseString(Request.QueryParamString("EventModules")), ",");

                if (wResponsorID <= 0)
                    wResponsorID = wBMSEmployee.ID;

                ServiceResult<int> wServiceResult = ServiceInstance.mBFCService
                        .BFC_GetMessageCount(wBMSEmployee, wResponsorID, wMessageType, wMessageIDList);


                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.Result);

                }
                else
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
                }

            }
            catch (Exception e)
            {
                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString(), null, null);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);
        }


        [HttpGet]
        public ActionResult ModuleMessageCount()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                BMSEmployee wBMSEmployee = GetSession();

                ServiceResult<Dictionary<Int32, Int32>> wServiceResult = ServiceInstance.mBFCService
                        .BFC_GetUndoMessagCount(wBMSEmployee, wBMSEmployee.ID, -1);

                Dictionary<String, Int32> wServiceRst = new Dictionary<String, Int32>();
                if (wServiceResult.getResult() != null && wServiceResult.getResult().Count > 0)
                {
                    foreach (Int32 wInteger in wServiceResult.getResult().Keys)
                    {
                        wServiceRst.Add(wInteger + "", wServiceResult.getResult()[wInteger]);
                    }
                }


                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceRst);
                }
                else
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
                }

            }
            catch (Exception e)
            {
                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString(), null, null);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);
        }


        [HttpGet]
        public ActionResult MsgAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {


                BMSEmployee wBMSEmployee = GetSession();

                DateTime wBaseTime = new DateTime(2000, 1, 1);

                int wResponsorID = StringUtils.parseInt(Request.QueryParamString("ResponsorID"));
                List<Int32> wModuleID = StringUtils
                        .parseIntList(Request.QueryParamString("ModuleID"), ",");
                List<Int32> wMessageIDList = StringUtils
                        .parseIntList(Request.QueryParamString("MessageID"), ",");
                int wType = StringUtils.parseInt(Request.QueryParamString("Type"));
                int wShiftID = StringUtils.parseInt(Request.QueryParamString("ShiftID"));
                List<int> wActive = StringUtils.parseIntList(Request.QueryParamString("Active"), ",");
                int wSendStatus = StringUtils.parseInt(Request.QueryParamString("SendStatus"));
                int wStepID = StringUtils.parseInt(Request.QueryParamString("StepID"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

             

                Pagination wPagination = GetPagination();

                // wResponsorID = wBMSEmployee.ID;

                ServiceResult<List<BFCMessage>> wServiceResult = ServiceInstance.mBFCService.BFC_GetMessageList(wBMSEmployee,
                        wResponsorID, wType, wModuleID, wMessageIDList, wActive, wSendStatus, wShiftID, wStartTime,
                        wEndTime, wStepID, wPagination);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), wPagination.TotalPage);
                }
                else
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(),
                            wServiceResult.getResult(), null);
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString(), null, null);
            }
            return Json(wResult);
        }


        [HttpPost]
        public ActionResult MsgUpdate()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                BMSEmployee wBMSEmployee = GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                int wIsSend = wParam.ContainsKey("Send") ? StringUtils.parseInt(wParam["Send"]) : 0;
                List<BFCMessage> wBFCMessageList = CloneTool.CloneArray<BFCMessage>(wParam["data"]);

                ServiceResult<Int32> wServiceResult = null;
                if (wIsSend > 0)
                {
                    wServiceResult = ServiceInstance.mBFCService.BFC_SendMessageList(wBMSEmployee, wBFCMessageList);
                }
                else
                {
                    wServiceResult = ServiceInstance.mBFCService.BFC_UpdateMessageList(wBMSEmployee, wBFCMessageList);
                }
                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_SUC, "", wBFCMessageList, null);
                }
                else
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wBFCMessageList, null);
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString(), null, null);
            }
            return Json(wResult);
        }


        [HttpPost]
        public ActionResult MsgReceive()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                BMSEmployee wBMSEmployee = GetSession();
                if (!wParam.ContainsKey("MessageIDList") || !wParam.ContainsKey("ModuleID"))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                int wModuleID = StringUtils.parseInt(wParam["ModuleID"]);
                List<Int64> wMessageIDList = CloneTool.CloneArray<Int64>(wParam["MessageIDList"]);

                int wResponsorID = wParam.ContainsKey("ResponsorID") ? StringUtils.parseInt(wParam["ResponsorID"])
                        : wBMSEmployee.ID;

                List<Int32> wStepID = wParam.ContainsKey("StepID")
                        ? CloneTool.CloneArray<Int32>(wParam["StepID"])
                        : new List<Int32>();

                ServiceResult<Int32> wServiceResult = ServiceInstance.mBFCService.BFC_ReceiveMessage(wBMSEmployee,
                        wResponsorID, wMessageIDList, wStepID, wModuleID);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_SUC, "");
                }
                else
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString(), null, null);
            }
            return Json(wResult);
        }


        [HttpPost]
        public ActionResult MsgRead()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                BMSEmployee wBMSEmployee = GetSession();
                if (!wParam.ContainsKey("MsgIDList"))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<long> wMsgIDList = CloneTool.CloneArray<long>(wParam["MsgIDList"]);

                ServiceResult<Int32> wServiceResult = ServiceInstance.mBFCService.BFC_HandleMessageByIDList(wBMSEmployee, wMsgIDList,
                        (int)BFCMessageStatus.Read, -1);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_SUC, "");
                }
                else
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString(), null, null);
            }
            return Json(wResult);
        }


        [HttpPost]
        public ActionResult MsgSent()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                BMSEmployee wBMSEmployee = GetSession();
                if (!wParam.ContainsKey("MsgIDList"))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<long> wMsgIDList = CloneTool.CloneArray<long>(wParam["MsgIDList"]);
                int wSendStatus = StringUtils.parseInt(wParam["SendStatus"]);
                ServiceResult<Int32> wServiceResult = ServiceInstance.mBFCService.BFC_HandleMessageByIDList(wBMSEmployee, wMsgIDList,
                        (int)BFCMessageStatus.Sent, wSendStatus);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_SUC, "");
                }
                else
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString(), null, null);
            }
            return Json(wResult);
        }


        [HttpPost]
        public ActionResult MsgHandle()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                BMSEmployee wBMSEmployee = GetSession();
                if (!wParam.ContainsKey("MessageIDList") || !wParam.ContainsKey("ModuleID")
                        || !wParam.ContainsKey("Status"))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                int wModuleID = StringUtils.parseInt(wParam["ModuleID"]);
                int wStatus = StringUtils.parseInt(wParam["Status"]);
                List<Int32> wStepID = wParam.ContainsKey("StepID")
                        ? CloneTool.CloneArray<Int32>(wParam["StepID"])
                        : new List<Int32>();

                List<long> wMessageIDList = CloneTool.CloneArray<long>(wParam["MessageIDList"]);

                int wResponsorID = wParam.ContainsKey("ResponsorID") ? StringUtils.parseInt(wParam["ResponsorID"])
                        : wBMSEmployee.ID;

                int wIsAuto = wParam.ContainsKey("IsAuto") ? StringUtils.parseInt(wParam["IsAuto"])
                        : wBMSEmployee.ID;

                if (wStatus != (int)BFCMessageStatus.Close && wStatus != (int)BFCMessageStatus.Finished)
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                if (wResponsorID == 0)
                {
                    wResponsorID = wBMSEmployee.ID;
                }
                if (wStatus == (int)BFCMessageStatus.Finished && wIsAuto == 1
                        && (wResponsorID > 0 || wResponsorID == -100))
                {
                    ServiceInstance.mBFCService.BFC_HandleMessage(wBMSEmployee, -1, wMessageIDList, wStepID, wModuleID,
                            (int)BFCMessageType.Task, (int)BFCMessageStatus.Close);
                }
                ServiceResult<Int32> wServiceResult = ServiceInstance.mBFCService.BFC_HandleMessage(wBMSEmployee,
                        wResponsorID, wMessageIDList, wStepID, wModuleID, (int)BFCMessageType.Task, wStatus);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_SUC, "");
                }
                else
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString(), null, null);
            }
            return Json(wResult);
        }


        [HttpPost]
        public ActionResult MsgHandleTask()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                BMSEmployee wBMSEmployee = GetSession();
                if (!wParam.ContainsKey("TaskIDList") || !wParam.ContainsKey("ModuleID") || !wParam.ContainsKey("Status")
                        || !wParam.ContainsKey("StepID"))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                int wModuleID = StringUtils.parseInt(wParam["ModuleID"]);
                int wStepID = StringUtils.parseInt(wParam["StepID"]);
                int wStatus = StringUtils.parseInt(wParam["Status"]);
                List<Int32> wTaskIDList = CloneTool.CloneArray<Int32>(wParam["TaskIDList"]);

                int wResponsorID = wParam.ContainsKey("ResponsorID") ? StringUtils.parseInt(wParam["ResponsorID"])
                        : wBMSEmployee.ID;

                int wIsAuto = wParam.ContainsKey("IsAuto") ? StringUtils.parseInt(wParam["IsAuto"]) : 0;

                if (wStatus != (int)BFCMessageStatus.Close && wStatus != (int)BFCMessageStatus.Finished)
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mBFCService.BFC_HandleTaskMessage(wBMSEmployee, wResponsorID,
                        wTaskIDList, wModuleID, wStepID, wStatus, wIsAuto);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_SUC, "");
                }
                else
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString(), null, null);
            }
            return Json(wResult);
        }


        [HttpPost]
        public ActionResult MsgForward()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                BMSEmployee wBMSEmployee = GetSession();
                if (!wParam.ContainsKey("MessageID") || !wParam.ContainsKey("ModuleID") || !wParam.ContainsKey("StepID")
                        || !wParam.ContainsKey("ResponsorID") || !wParam.ContainsKey("ForwarderList"))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                int wModuleID = StringUtils.parseInt(wParam["ModuleID"]);
                int wMessageID = StringUtils.parseInt(wParam["MessageID"]);
                int wStepID = StringUtils.parseInt(wParam["StepID"]);
                int wResponsorID = StringUtils.parseInt(wParam["ResponsorID"]);
                List<Int32> wForwarderList = CloneTool.CloneArray<Int32>(wParam["ForwarderList"]);
                if (wModuleID <= 0 || wMessageID <= 0 || wStepID <= 0 || (wResponsorID <= 0 && wResponsorID != -100)
                        || wForwarderList == null || wForwarderList.Count <= 0)
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mBFCService.BFC_ForwardMessage(wBMSEmployee, wResponsorID,
                        wForwarderList, wModuleID, wMessageID, wStepID);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_SUC, "");
                }
                else
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString(), null, null);
            }
            return Json(wResult);
        }



        [HttpGet]
        public ActionResult GetApiLogStatistics()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wLoginUser = GetSession();

                DateTime wBaseTime = new DateTime(2000, 1, 1);

                String wProjectName = StringUtils.parseString(Request.QueryParamString("ProjectName"));
                String wUri = StringUtils.parseString(Request.QueryParamString("Uri"));
                String wURIName = StringUtils.parseString(Request.QueryParamString("URIName"));
                String wMethod = StringUtils.parseString(Request.QueryParamString("Method"));
                int wRequestTimes = StringUtils.parseInt(Request.QueryParamString("RequestTimes"));

                int wAvgIntervalTime = StringUtils.parseInt(Request.QueryParamString("AvgIntervalTime"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

                Pagination wPagination = GetPagination();

                List<Dictionary<String, Object>> wApiLogList = GetApiLogStatistics(
                        wStartTime, wEndTime, wAvgIntervalTime, wProjectName, wUri, wURIName, wMethod, wRequestTimes,
                        wPagination);


                wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wApiLogList,
                          wPagination.TotalPage);


            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString());
            }
            return Json(wResult);
        }


        [HttpGet]
        public ActionResult GetApiLog()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {


                BMSEmployee wBMSEmployee = GetSession();

                DateTime wBaseTime = new DateTime(2000, 1, 1);

                String wProjectName = StringUtils.parseString(Request.QueryParamString("ProjectName"));

                String wUri = StringUtils.parseString(Request.QueryParamString("Uri"));
                String wURIName = StringUtils.parseString(Request.QueryParamString("URIName"));
                String wMethod = StringUtils.parseString(Request.QueryParamString("Method"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));
                int wUserID = StringUtils.parseInt(Request.QueryParamString("UserID"));

                int wUserControl = StringUtils.parseInt(Request.QueryParamString("UserControl"));


                int wIntervalMin = StringUtils.parseInt(Request.QueryParamString("IntervalMin"));
                int wIntervalMax = StringUtils.parseInt(Request.QueryParamString("IntervalMax"));
                int wResponseStatus = StringUtils.parseInt(Request.QueryParamString("ResponseStatus"));

                Pagination wPagination = GetPagination();

                List<Dictionary<String, Object>> wApiLogList = GetApiLog(wBMSEmployee.CompanyID, wUserID,
                    wProjectName, wUri, wURIName, wMethod, wUserControl, wIntervalMin, wIntervalMax, wResponseStatus,
                    wStartTime, wEndTime, wPagination);

                wResult = this.GetResult(RetCode.SERVER_CODE_SUC, "", wApiLogList, wPagination.TotalPage);

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString());
            }
            return Json(wResult);
        }

        [HttpPost]
        public ActionResult SetApiControl()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wBMSEmployee = GetSession();
                if (!wParam.ContainsKey("ProjectName") || !wParam.ContainsKey("Uri") || !wParam.ContainsKey("URIName") ||
                    !wParam.ContainsKey("UserControl"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                String wProjectName = StringUtils.parseString(wParam["ProjectName"]);
                String wUri = StringUtils.parseString(wParam["Uri"]);
                String wURIName = StringUtils.parseString(wParam["URIName"]);
                int wUserControl = StringUtils.parseInt(wParam["UserControl"]);
                if (StringUtils.isEmpty(wProjectName) || StringUtils.isEmpty(wUri))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                SetApiControl(wBMSEmployee.CompanyID, wProjectName, wUri,
                       wURIName, wUserControl);


                wResult = GetResult(RetCode.SERVER_CODE_SUC, "");


            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString());
            }
            return Json(wResult);
        }



        [HttpGet]
        public ActionResult GetCurrentServerStatus()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {


                BMSEmployee wBMSEmployee = GetSession();
                Dictionary<String, Object> wMap = new Dictionary<string, object>();


                wMap.Add("MaxConnection", RepositoryFactory.GetDBPool().MaxConnection);
                wMap.Add("CurrentConnection", RepositoryFactory.GetDBPool().CurrentConnection);
                wMap.Add("ComputerInfo", DiskUtils.getInstance().GetComputerInfo());
                wMap.Add("DiskList", DiskUtils.getInstance().DiskInfoList);

                wResult = this.GetResult(RetCode.SERVER_CODE_SUC, "", null, wMap);

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString());
            }
            return Json(wResult);
        }



        /**
         * 获取已做集合 HasDoList集合 HasDoCounts消息数
         * 
         * @param Request
         * @return
         */

        [HttpGet]
        public ActionResult GetHasDoList()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {


                BMSEmployee wBMSEmployee = GetSession();

                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));

                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

                List<Int32> wEventModuleList = StringUtils.parseIntList(Request.QueryParamString("EventModules"), ",");

                int wResponsorID = StringUtils.parseInt(Request.QueryParamString("ResponsorID"));

                if (wResponsorID <= 0)
                {
                    wResponsorID = wBMSEmployee.ID;
                }

                if (wEventModuleList != null)
                    wEventModuleList.RemoveAll(p => p <= 0);


                Pagination wPagination = GetPagination();

                ServiceResult<List<BFCMessage>> wServiceResult = ServiceInstance.mBFCService
                        .BFC_GetMessageDoneList(wBMSEmployee, wResponsorID, wEventModuleList, wStartTime, wEndTime, wPagination);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(),
                            wPagination.TotalPage);
                }
                else
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString());
            }
            return Json(wResult);
        }

        /**
         * 获取待做集合 HasDoList集合 HasDoCounts消息数
         * 
         * @param Request
         * @return
         */

        [HttpGet]
        public ActionResult GetUnDoList()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {


                BMSEmployee wBMSEmployee = GetSession();

                int wResponsorID = StringUtils.parseInt(Request.QueryParamString("ResponsorID"));
                int wModuleID = StringUtils.parseInt(Request.QueryParamString("ModuleID"));
                List<Int32> wEventModuleList = StringUtils
                        .parseIntList(StringUtils.parseString(Request.QueryParamString("EventModules")), ",");
                int wMessageID = StringUtils.parseInt(Request.QueryParamString("MessageID"));
                int wShiftID = StringUtils.parseInt(Request.QueryParamString("ShiftID"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));


                Pagination wPagination = GetPagination();

                if (wResponsorID <= 0)
                {
                    wResponsorID = wBMSEmployee.ID;
                }
                if (wEventModuleList != null)
                    wEventModuleList.RemoveAll(p => p <= 0);
                if (wModuleID > 0 && !wEventModuleList.Contains(wModuleID))
                    wEventModuleList.Add(wModuleID);

                ServiceResult<List<BFCMessage>> wServiceResult = ServiceInstance.mBFCService.BFC_GetUndoMessageList(
                        wBMSEmployee, wResponsorID, wEventModuleList, wMessageID, wShiftID, wStartTime, wEndTime, wPagination);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(),
                            wPagination.TotalPage);

                    SetResult(wResult, "MsgCount", wPagination.TotalCount);
                }
                else
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
                }
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString());
            }
            return Json(wResult);
        }

        /**
         * 获取通知集合
         * 
         * @param Request
         * @return
         */

        [HttpGet]
        public ActionResult GetNoticeList()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {


                BMSEmployee wBMSEmployee = GetSession();

                int wResponsorID = StringUtils.parseInt(Request.QueryParamString("ResponsorID"));

                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

                int wUseTime = StringUtils.parseInt(Request.QueryParamString("UseTime"));

                List<Int32> wEventModuleList = StringUtils
                        .parseIntList(StringUtils.parseString(Request.QueryParamString("EventModules")), ",");

                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));

                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

                if (wResponsorID <= 0)
                {
                    wResponsorID = wBMSEmployee.ID;
                }
                if (wEventModuleList != null)
                    wEventModuleList.RemoveAll(p => p <= 0);

                Pagination wPagination = GetPagination();


                OutResult<Int32> wCount = new OutResult<Int32>(0);
                ServiceResult<List<BFCMessage>> wServiceResult = ServiceInstance.mBFCService.BFC_GetNoticeList(wBMSEmployee,
                        wResponsorID, wEventModuleList, wActive, wUseTime, wStartTime, wEndTime, wCount, wPagination);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {

                    wResult = this.GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), wPagination.TotalPage);
                    SetResult(wResult, "MsgCount", wCount.Result);
                }
                else
                {
                    wResult = this.GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult = this.GetResult(RetCode.SERVER_CODE_ERR, e.ToString());
            }
            return Json(wResult);
        }


    }
}
