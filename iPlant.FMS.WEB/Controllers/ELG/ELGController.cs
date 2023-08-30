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
    public class ELGController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(ELGController));
        [HttpGet]
        public ActionResult LogList()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                
                BMSEmployee wBMSEmployee = GetSession();

                ServiceResult<List<ELGCatalog>> wServiceResult = ServiceInstance.mELGService.ELG_QueryCataLogList(wBMSEmployee);
                wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, null);
            }
            catch (Exception e)
            {
                wResult = GetResult(RetCode.SERVER_CODE_ERR, e.ToString());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);
        }

        [HttpGet]
        public ActionResult LogInfo()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                
                BMSEmployee wBMSEmployee = GetSession();
                 
                String wPath = StringUtils.parseString(Request.QueryParamString("Path"));

                ServiceResult<List<String>> wServiceResult = ServiceInstance.mELGService.ELG_ShowLogFile(wBMSEmployee, wPath);
                wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, null);
                 
            }
            catch (Exception e)
            {
                wResult = GetResult(RetCode.SERVER_CODE_ERR, e.ToString());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);
        }

        [HttpGet]

        public ActionResult FileDownload()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                BMSEmployee wBMSEmployee = GetSession();
                String wPath = StringUtils.parseString(Request.QueryParamString("Path"));



                if (!System.IO.File.Exists(wPath))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "路径对应的文件不存在");
                }

                return File(wPath, "text/plain", System.IO.Path.GetFileName(wPath));
            }
            catch (Exception e)
            {
                wResult = GetResult(RetCode.SERVER_CODE_ERR, e.ToString());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);
        }

        [HttpGet]
        public ActionResult DeleteInfo()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                
                BMSEmployee wBMSEmployee = GetSession();
                String wPath = StringUtils.parseString(Request.QueryParamString("Path"));
                ServiceResult<Boolean> wServiceResult = ServiceInstance.mELGService.ELG_DeleteLogFile(wBMSEmployee, wPath);
                wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.Result);
            }
            catch (Exception e)
            {
                wResult = GetResult(RetCode.SERVER_CODE_ERR, e.ToString());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);
        }

        [HttpPost]
        public ActionResult DeleteList()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                
                BMSEmployee wBMSEmployee = GetSession();
                List<String> wPathList = CloneTool.CloneArray<String>(wParam["data"]);
                ServiceResult<String> wServiceResult = ServiceInstance.mELGService.ELG_DeleteLogFileList(wBMSEmployee, wPathList);
                wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.Result);
            }
            catch (Exception e)
            {
                wResult = GetResult(RetCode.SERVER_CODE_ERR, e.ToString());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);
        }
    }
}
