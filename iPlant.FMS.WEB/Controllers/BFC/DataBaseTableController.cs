
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
    public class DataBaseTableController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DataBaseTableController));


        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                

                BMSEmployee wBMSEmployee = GetSession();

                int wSqlType = StringUtils.parseInt(Request.QueryParamString("SqlType"));

                if (wSqlType <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, "数据库类型不能为空");
                    return Json(wResult);
                }

                ServiceResult<List<Dictionary<String, Object>>> wServiceResult = ServiceInstance.mBFCService.CGS_GetDataTableList(wBMSEmployee,
                        wSqlType);

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

        // 获取表格配置
        [HttpGet]
        public ActionResult Info()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                

                BMSEmployee wBMSEmployee = GetSession();

                int wSqlType = StringUtils.parseInt(Request.QueryParamString("SqlType"));

                if (wSqlType <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, "数据库类型不能为空");
                    return Json(wResult);
                }

                String wDBName = StringUtils.parseString(Request.QueryParamString("DBName"));

                if (StringUtils.isEmpty(wDBName))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, "数据库名称不能为空");
                    return Json(wResult);
                }
                String wTableName = StringUtils.parseString(Request.QueryParamString("TableName"));
                if (StringUtils.isEmpty(wTableName))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, "数据表名称不能为空");
                    return Json(wResult);
                }

                ServiceResult<List<Dictionary<String, Object>>> wServiceResult = ServiceInstance.mBFCService.CGS_GetDataTableInfo(wBMSEmployee,
                        wSqlType, wDBName, wTableName);

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



    }
}
