
using iPlant.Common.Tools;
using iPlant.FMS.Models;
using iPlant.FMC.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using Microsoft.AspNetCore.Http;using Microsoft.AspNetCore.Mvc;

namespace iPlant.FMS.WEB
{
   
    public class TableConfigController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger( typeof(TableConfigController));

        [iPlantFilter]
        [HttpGet]
        public ActionResult ALL()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                

                BMSEmployee wBMSEmployee = GetSession();

                int wUserID = wBMSEmployee.ID;

                String wTableName = StringUtils.parseString(Request.QueryParamString("TableName"));

                String wModuleName = StringUtils.parseString(Request.QueryParamString("ModleName"));

                if (wModuleName.Length <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, "模块名称为空！！！");
                    return Json(wResult);
                }

                ServiceResult<List<CGSTable>> wServiceResult = ServiceInstance.mBFCService.CGS_SelectCGTableByName(wBMSEmployee, wUserID,
                        wTableName, wModuleName);

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
                wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_CODE_ERR_MSG);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return Json(wResult);
        }


        [HttpPost]
        public ActionResult Save()
        {
            Object wResult = new Object();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                BMSEmployee wBMSEmployee = GetSession();

                int wUserID = wBMSEmployee.ID;

                int wCompanyID = wBMSEmployee.CompanyID;

                List<CGSTable> wCGTableList = CloneTool.CloneArray<CGSTable>(wParam["data"]);

                foreach (CGSTable cgTable in wCGTableList)
                {
                    cgTable.UserID = wUserID;
                    cgTable.CompanyID = wCompanyID;
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mBFCService.CGS_SaveCGTable(wBMSEmployee, wCGTableList);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wCGTableList, null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wCGTableList, null);
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
        public Object Delete()
        {
            Object wResult = new Object();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                BMSEmployee wBMSEmployee = GetSession();

                int wUserID = wBMSEmployee.ID;

                List<CGSTable> wCGTable = CloneTool.CloneArray<CGSTable>(wParam["data"]);

                foreach (CGSTable cgTable in wCGTable)
                {
                    cgTable.UserID = wUserID;
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mBFCService.CGS_DeleteCGTable(wBMSEmployee, wCGTable);
                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wCGTable, null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wCGTable, null);
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
