using iPlant.Common.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using iPlant.FMC.Service;
using System.IO;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Http;
using iPlant.FMS.Models;
using Microsoft.AspNetCore.Mvc;

namespace iPlant.FMS.WEB
{
    public class iPlantFilter : ActionFilterAttribute
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(iPlantFilter));
        private static String IGNORE_CONTENT_TYPE = "multipart/form-data";

        public const String Filter_Api_ID = "filter_api_id";

        public const String Filter_Api_Time = "filter_api_time";

        private LockHelper mLockHelper = new LockHelper();

        private const String RESULT_KEY = "resultCode";


        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {

            HttpContext context = filterContext.HttpContext;

            HttpRequest wRequest = context.Request;

            HttpResponse wResponse = context.Response;
            try
            {
                //对接口有效

                wResponse.ContentType = "text/plain; charset=utf-8";

                if (wRequest.ContentType != null && wRequest.ContentType.Equals(IGNORE_CONTENT_TYPE, StringComparison.CurrentCultureIgnoreCase))
                {
                    return;
                }
                BMSEmployee wBMSEmployee = BaseController.GetSession(context.Session);


                if (wBMSEmployee == null)
                    wBMSEmployee = new BMSEmployee();

                String user_info = wRequest.QueryParamString(SessionContants.USER_INFO);
                String user_password = wRequest.QueryParamString(SessionContants.USER_PASSWORD);

                try
                {
                    if (StringUtils.isNotEmpty(user_info) && StringUtils.isNotEmpty(user_password))
                    {

                        user_info = user_info.Replace(" ", "+");
                        user_password = user_password.Replace(" ", "+");
                        int wModuleID = StringUtils.parseInt(wRequest.QueryParamString(SessionContants.Extension_Module_ID));
                        if (wModuleID > 0)
                        {

                            ServiceResult<BFCHomePageModule> wBFCHomePageModule = ServiceInstance.mBFCService
                                    .BFC_GetHomePageModuleByID(wBMSEmployee, wModuleID);
                            if (wBFCHomePageModule.getResult() != null
                                    && wBFCHomePageModule.getResult().ID == wModuleID)
                            {

                                user_info = DesUtil.decrypt(user_info, wBFCHomePageModule.getResult().SecretKey);
                                user_password = DesUtil.decrypt(user_password,
                                        wBFCHomePageModule.getResult().SecretKey);
                            }
                        }
                        else
                        {
                            user_info = DesUtil.decrypt(user_info, SessionContants.appSecret);
                            user_password = DesUtil.decrypt(user_password, SessionContants.appSecret);
                        }
                        if (!DesUtil.encrypt(user_info, SessionContants.appSecret).Equals(wBMSEmployee.LoginName))
                        {
                            wBMSEmployee = ServiceInstance.mBMSService.BMS_LoginEmployee(user_info, user_password, 0).getResult();
                            if (wBMSEmployee != null && (wBMSEmployee.ID > 0 || wBMSEmployee.ID == -100))
                            {
                                BaseController.SetSession(context.Session, wBMSEmployee);
                                BaseController.SetCookie(wRequest, wResponse, wBMSEmployee);
                            }
                        }
                    }

                }
                catch (Exception ex)
                {
                    logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name + " Content ", ex);
                }


                user_info = BaseController.getCookieValue(SessionContants.CookieUser, wRequest);
                if (StringUtils.isNotEmpty(user_info) && !DesUtil.encrypt(user_info, SessionContants.appSecret).Equals(wBMSEmployee.LoginName, StringComparison.CurrentCultureIgnoreCase))
                {
                    String wToken = BaseController.CreateToken(user_info);
                    wBMSEmployee = ServiceInstance.mBMSService.BMS_LoginEmployeeByToken(user_info, wToken)
                            .getResult();

                    if (wBMSEmployee != null && (wBMSEmployee.ID > 0 || wBMSEmployee.ID == -100))
                    {
                        BaseController.SetSession(context.Session, wBMSEmployee);
                        BaseController.SetCookie(wRequest, wResponse, wBMSEmployee);
                    }
                }

                String wControllerName = StringUtils.parseString(filterContext.RouteData.Values["controller"]);
                String wActionName = StringUtils.parseString(filterContext.RouteData.Values["action"]);
                String wURL = wControllerName + "/" + wActionName;

                long filter_api_id = 0;
                if (wBMSEmployee == null || (wBMSEmployee.ID <= 0 && wBMSEmployee.ID != -100))
                {
                    //判断是否是调用登录接口，否则提示未登录
                    if (!wURL.Contains("User/Login") && !wURL.Contains("HomePage/Index") && !wURL.Contains("RetrievePassword") && !wURL.Contains("Logout"))
                    {
                        filterContext.Result = wResponse.GetErrorResult(RetCode.SERVER_CODE_UNLOGIN, RetCode.SERVER_CODE_UNLOGIN_ERROR);

                        //tip 未登录 
                    }
                    return;
                }

                //判断权限
                //根据URL  获取对应权限是否拥有

                ServiceResult<Boolean> wPowerServiceResult = ServiceInstance.mBMSService.BMS_CheckPowerByLoginID(wBMSEmployee.CompanyID, wBMSEmployee.ID, wURL, 0, 0);

                if (!wPowerServiceResult.Result)
                {

                    filterContext.Result = wResponse.GetErrorResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_CODE_UNROLE);
                    return;
                }

                base.OnActionExecuting(filterContext);
                //启动倒带方式 

                String wBody = "";

                if (wRequest.Method.ToLower().Equals("post"))
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        wRequest.Body.Position = 0;  //请求到控制器之后 Position重置0
                        wRequest.Body.CopyTo(ms);
                        wRequest.Body.Position = 0;
                        using (var st = new StreamReader(ms))
                        {
                            st.BaseStream.Position = 0;
                            wBody = st.ReadToEndAsync().Result.Replace("\n", "");
                        }
                    }
                    wRequest.Body.Position = 0;
                }

                //context.Request.EnableBuffering(); //创建缓冲区存放Request.Body的内容，从而允许反复读取Request.Body的Stream


                filter_api_id = BaseController.SaveApiLog(wBMSEmployee.CompanyID, wBMSEmployee.ID,
                         BaseController.GetProjectName(wRequest), wRequest.Path, wRequest.Method,
                         JsonTool.ObjectToJson(wRequest.QueryString), wBody,
                             DateTime.Now);

                wResponse.Headers.Add(Filter_Api_ID, filter_api_id + "");
                wResponse.Headers.Add(Filter_Api_Time, DateTime.Now.Ticks + "");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString()); logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                filterContext.Result = wResponse.GetErrorResult(RetCode.SERVER_CODE_ERR, ex.Message);
                return;
            }
        }

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            try
            {

                HttpResponse wResponse = filterContext.HttpContext.Response;
                HttpRequest wRequest = filterContext.HttpContext.Request;
                if (!wResponse.Headers.ContainsKey(iPlantFilter.Filter_Api_ID))
                {
                    return;
                }
                int filter_api_id = StringUtils.parseInt(wResponse.Headers[iPlantFilter.Filter_Api_ID]);

                if (filter_api_id > 0 && (filterContext.Result is JsonResult))
                {
                    JsonResult wJsonResult = (JsonResult)filterContext.Result;
                    String jsonString = JsonTool.ObjectToJson(wJsonResult.Value);
                    int wStatus = wResponse.StatusCode;
                    long filter_api_time = wResponse.Headers.ContainsKey(iPlantFilter.Filter_Api_Time) ? StringUtils.parseLong(wResponse.Headers[iPlantFilter.Filter_Api_Time]) : DateTime.Now.Ticks;
                    if ((wJsonResult.Value is Dictionary<String, Object>) && ((Dictionary<String, Object>)wJsonResult.Value).ContainsKey(RESULT_KEY))
                    {
                        wStatus = StringUtils.parseInt(((Dictionary<String, Object>)wJsonResult.Value)[RESULT_KEY]);
                    }
                    //wRequest.UserHostAddress

                    BaseController.SaveApiLog(filter_api_id, wRequest.Path, jsonString, DateTime.Now, (DateTime.Now.Ticks - filter_api_time) / 10000,
                                    wStatus);


                    wResponse.Headers.Remove(iPlantFilter.Filter_Api_ID);
                    wResponse.Headers.Remove(iPlantFilter.Filter_Api_Time);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
        }

    }

}