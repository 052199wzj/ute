
using iPlant.Common.Tools;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace iPlant.FMS.WEB
{
    public class UploadController : BaseController
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(UploadController));
        [HttpPost]
        public IActionResult Submit(IFormFileCollection files)
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            string wMsg = "";

            try
            {
                if (files == null || files.Count <= 0)
                    files = Request.Form.Files;
                if (files.Count == 0)
                {
                    wMsg = "提示：没有要上传的文件！";
                    return Json(GetResult(RetCode.SERVER_CODE_ERR, wMsg, null, null));
                }

                string wFileNameUrl = "";
                string wPath = "";
                List<String> wPathList = new List<String>();

                String wProjectName = GetProjectName(Request);
                for (int i = 0; i < files.Count; i++)
                {
                    IFormFile wCurFile = files[i];
                    if (wCurFile != null && wCurFile.Length < 1)
                        continue;
                    //获取保存路径


                    string wFilesUrl = StringUtils.CombinePath(GlobalContext.WebRootPath, Constants.UPLOAD_SAVE_PATH);//全局配置读取

                    DateTime wDateTime = DateTime.Now;

                    wFilesUrl = StringUtils.CombinePath(wFilesUrl, wDateTime.ToString("yyyy/MM/dd/"));

                    if (Directory.Exists(wFilesUrl) == false)//路径不存在则创建  
                        Directory.CreateDirectory(wFilesUrl);


                    //获取文件名  
                    string wFileName = Path.GetFileName(wCurFile.FileName);
                    if (wFileName == null)
                        continue;
                    //文件后缀名   
                    //string wFilePostfixName = wFileName.Substring(wFileName.LastIndexOf('.'));


                    //if (wFilePostfixName != null)
                    //  wFilePostfixName = wFilePostfixName.ToLower();

                    //if (wFilePostfixName.StartsWith("."))
                    //wFilePostfixName = wFilePostfixName.Substring(1);

                    String wNewFileName = StringUtils.Format("{0}_{1}",
                    wDateTime.ToString("HHmmssfff"), wCurFile.FileName);

                    wFileNameUrl = StringUtils.CombinePath(Constants.UPLOAD_SAVE_PATH, wDateTime.ToString("yyyy/MM/dd/"), wNewFileName);


                    wPath = StringUtils.CombinePath(wFilesUrl, wNewFileName);
                    using (var fileStream = new FileStream(wPath, FileMode.Create))
                    {
                        wCurFile.CopyTo(fileStream);
                        fileStream.Flush();
                    }
                    //保存文件  

                    if (StringUtils.isEmpty(wFileNameUrl))
                    {
                        wResult = GetResult(RetCode.SERVER_CODE_ERR, "上传的文件不能为空!");
                        return Json(wResult);
                    }
                    wPathList.Add(StringUtils.CombinePath(wProjectName, wFileNameUrl));

                }
                if (wPathList == null || wPathList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, "上传的文件不能为空!");
                }
                else
                {
                    Dictionary<String, Object> wResultObject = new Dictionary<String, Object>();
                    wResultObject.Add("file_id", wPathList[0]);
                    wResultObject.Add("file_url", wPathList[0]);
                    wResultObject.Add("diskUrl", wPath);
                    wResultObject.Add("list", wPathList);
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, wResultObject);
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);

                wResult = GetResult(RetCode.SERVER_CODE_ERR, wMsg + "\n" + ex.ToString());
            }
            return Json(wResult);
        }

        [HttpGet]

        public ActionResult DownLoadFile()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                String wFilePath = Request.QueryParamString("Path");
                String wFileName = Request.QueryParamString("FileName");

                String wProjectName = GetProjectName(Request);
                if (wFilePath.StartsWith(wProjectName))
                {
                    wFilePath = wFilePath.Substring(wProjectName.Length);
                }
                String wFilesUrl = "";
                if (Constants.UPLOAD_SAVE_PATH.IndexOf('/') == 0)
                {
                    wFilesUrl = Constants.UPLOAD_SAVE_PATH.Substring(1);
                }
                else
                {
                    wFilesUrl = Constants.UPLOAD_SAVE_PATH;
                }
                if (wFilePath.IndexOf("/") != 0)
                {
                    wFilePath = "/" + wFilePath;
                }

                wFilesUrl += wFilePath;

                if (System.IO.File.Exists(wFilesUrl) && StringUtils.isEmpty(wFileName))
                    wFileName = System.IO.Path.GetFileName(wFilesUrl);


                return File(wFilesUrl, "text/plain", wFileName);
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString());
            }
            return Json(wResult);
        }

        /// <summary>
        /// 上载服务器硬盘文件到上传目录
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult UpLoadFile()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                String wFilePath = Request.QueryParamString("Path");

                if (!System.IO.File.Exists(wFilePath))
                {
                    return Json(GetResult(RetCode.SERVER_CODE_ERR, StringUtils.Format("上载文件不存在 Path:{0}", wFilePath)));
                }


                string wFileName = Path.GetFileName(wFilePath);

                if (StringUtils.isEmpty(wFileName))
                {
                    return Json(GetResult(RetCode.SERVER_CODE_ERR, StringUtils.Format("上载文件名称不存在 Path:{0}", wFilePath)));
                }


                string wFileDir = StringUtils.CombinePath(GlobalContext.WebRootPath, Constants.UPLOAD_SAVE_PATH);//全局配置读取

                DateTime wDateTime = DateTime.Now;

                wFileDir = StringUtils.CombinePath(wFileDir, wDateTime.ToString("yyyy/MM/dd/"));

                if (Directory.Exists(wFileDir) == false)//路径不存在则创建  
                    Directory.CreateDirectory(wFileDir);


                String wNewFileName = StringUtils.Format("{0}_{1}",
                    wDateTime.ToString("HHmmssfff"), wFileName);


                String wProjectName = GetProjectName(Request);

                String wFileUrl = StringUtils.CombinePath(wProjectName, Constants.UPLOAD_SAVE_PATH, wDateTime.ToString("yyyy/MM/dd/"), wNewFileName);

                String wPath = StringUtils.CombinePath(wFileDir, wNewFileName);

                System.IO.File.Copy(wFilePath, wPath, true);


                Dictionary<String, Object> wResultObject = new Dictionary<String, Object>();
                wResultObject.Add("file_id", wFileUrl);
                wResultObject.Add("file_url", wFileUrl);
                wResultObject.Add("diskUrl", wPath);
                wResultObject.Add("list", null);
                wResult = GetResult(RetCode.SERVER_CODE_SUC, wResultObject);


            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString());
            }
            return Json(wResult);
        }

        [HttpGet]
        public ActionResult FileCompare()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                String wSourcePath = Request.QueryParamString("SourcePath");
                String wTargetPath = Request.QueryParamString("TargetPath");

                String wProjectName = GetProjectName(Request);

                if (wSourcePath.StartsWith(wProjectName))
                {
                    wSourcePath = wSourcePath.Substring(wProjectName.Length);
                }

                if (wTargetPath.StartsWith(wProjectName))
                {
                    wTargetPath = wTargetPath.Substring(wProjectName.Length);
                }

                wSourcePath = StringUtils.CombinePath(GlobalContext.WebRootPath, wSourcePath);
                wTargetPath = StringUtils.CombinePath(GlobalContext.WebRootPath, wTargetPath);


                String wSourceMD5 = DesUtil.GetFileMD5(wSourcePath);
                String wTargetMD5 = DesUtil.GetFileMD5(wTargetPath);

                if (wSourceMD5.Equals(wTargetMD5))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, true);
                }
                else
                { 
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, false);
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString());
            }
            return Json(wResult);
        }


        [HttpPost]
        public ActionResult ImportExcel(IFormFileCollection files)
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            string wMsg = "";
            try
            {
                if (files == null || files.Count <= 0)
                    files = Request.Form.Files;
                if (files.Count == 0)
                {
                    wMsg = "提示：没有要导入的Excel文件！";
                    return Json(GetResult(RetCode.SERVER_CODE_ERR, wMsg, null, null));
                }

                for (int i = 0; i < files.Count; i++)
                {
                    IFormFile wCurFile = files[i];

                    if (wCurFile == null && wCurFile.Length < 1)
                        continue;

                    //获取文件名  
                    string wFileName = Path.GetFileName(wCurFile.FileName);
                    if (wFileName == null)
                        continue;

                    List<Dictionary<String, Object>> wReturnResult = ServerExcelUtils.Instance.Import(wCurFile.OpenReadStream(), wCurFile.FileName, out wMsg);

                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wReturnResult, null);
                    break;
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);

                wResult = GetResult(RetCode.SERVER_CODE_ERR, wMsg + "\n" + ex.ToString());
            }

            return Json(wResult);
        }
        [HttpPost]
        public ActionResult ExportExcel()
        {
            object wResult = new object();
            string wMsg = "";
            try
            {

                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                if (!wParam.ContainsKey("data") || !wParam.ContainsKey("head") || !wParam.ContainsKey("fileName"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                List<Dictionary<String, Object>> wList = CloneTool.Clone<Object, List<Dictionary<String, Object>>>(wParam["data"]);

                Dictionary<String, String> wHeadList = CloneTool.Clone<Object, Dictionary<String, String>>(wParam["head"]);

                String wTitle = wParam.ContainsKey("title") ? StringUtils.parseString(wParam["title"]) : "";

                String wFileName = StringUtils.parseString(wParam["fileName"]);

                List<String> wOrderList = wParam.ContainsKey("order") ? CloneTool.Clone<Object, List<String>>(wParam["order"]) : new List<string>();

                String wPath = ServerExcelUtils.Instance.Export(GlobalContext.WebRootPath, StringUtils.CombinePath(Constants.UPLOAD_EXCEL_URL, DateTime.Now.ToString("yyyy/MM/dd")), wList, wHeadList, wTitle, wFileName, out wMsg, wOrderList);
                Dictionary<String, Object> wInfo = new Dictionary<string, object>();


                wInfo.Add("path", StringUtils.CombinePath(GetProjectName(Request), wPath));

                wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wInfo);
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);

                wMsg += "\n" + ex.ToString();
            }
            finally
            {
                if (!String.IsNullOrWhiteSpace(wMsg))
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wMsg);
            }
            return Json(wResult);
        }





    }
}