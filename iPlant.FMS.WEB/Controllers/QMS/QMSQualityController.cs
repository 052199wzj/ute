using iPlant.Common.Tools;
using iPlant.FMS.Models;
using iPlant.FMC.Service;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace iPlant.FMS.WEB
{
    public class QMSQualityController : BaseController
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(QMSQualityController));

        /// <summary>
        /// 获取工件参数信息
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult GetWorkpieceCheckResult()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wOrderID = StringUtils.parseInt(Request.QueryParamString("OrderID"));
                int wCommandID = StringUtils.parseInt(Request.QueryParamString("CommandID"));
                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
                String wOrderNo = StringUtils.parseString(Request.QueryParamString("OrderNo"));
                String wProductNo = StringUtils.parseString(Request.QueryParamString("ProductNo"));
                String wWorkpieceNo = StringUtils.parseString(Request.QueryParamString("WorkpieceNo"));
                int wStatus = StringUtils.parseInt(Request.QueryParamString("Status"), -1);
                int wCheckResult = StringUtils.parseInt(Request.QueryParamString("CheckResult"), -1);
                int wSpotCheckResult = StringUtils.parseInt(Request.QueryParamString("SpotCheckResult"), -1);
                int wPatrolCheckResult = StringUtils.parseInt(Request.QueryParamString("PatrolCheckResult"), -1);
                int wThreeDimensionalResult = StringUtils.parseInt(Request.QueryParamString("ThreeDimensionalResult"), -1);
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));
                Pagination wPagination = GetPagination();

                ServiceResult<List<Dictionary<String, Object>>> wServiceResult = ServiceInstance.mQMSService.QMS_GetWorkpieceCheckResultList(wBMSEmployee, wLineID, wCommandID, wOrderID,
             wOrderNo, wProductID, wProductNo, wWorkpieceNo, wStatus,
             wCheckResult, wSpotCheckResult, wPatrolCheckResult, wThreeDimensionalResult,
                 wStartTime, wEndTime, wPagination);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wPagination.TotalPage);
                    SetResult(wResult, "Header", wServiceResult.Get("Header"));
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

        /// <summary>
        /// 获取工件信息
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult GetWorkpieceQualityInfo()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wOrderID = StringUtils.parseInt(Request.QueryParamString("OrderID"));
                int wCommandID = StringUtils.parseInt(Request.QueryParamString("CommandID"));
                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
                String wOrderNo = StringUtils.parseString(Request.QueryParamString("OrderNo"));
                String wProductNo = StringUtils.parseString(Request.QueryParamString("ProductNo"));
                String wWorkpieceNo = StringUtils.parseString(Request.QueryParamString("WorkpieceNo"));
                int wStatus = StringUtils.parseInt(Request.QueryParamString("Status"));
                int wCheckResult = StringUtils.parseInt(Request.QueryParamString("CheckResult"));
                int wSpotCheckResult = StringUtils.parseInt(Request.QueryParamString("SpotCheckResult"));
                int wPatrolCheckResult = StringUtils.parseInt(Request.QueryParamString("PatrolCheckResult"));
                int wThreeDimensionalResult = StringUtils.parseInt(Request.QueryParamString("ThreeDimensionalResult"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));
                Pagination wPagination = GetPagination();
                ServiceResult<List<QMSWorkpiece>> wServiceResult = ServiceInstance.mQMSService.QMS_GetWorkpieceList(wBMSEmployee, wLineID, wCommandID, wOrderID,
                     wOrderNo, wProductID, wProductNo, wWorkpieceNo, wStatus,
                     wCheckResult, wSpotCheckResult, wPatrolCheckResult, wThreeDimensionalResult,
                 wStartTime, wEndTime, wPagination);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wPagination.TotalPage);
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

        /// <summary>
        /// 创建工件信息
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult CreateWorkpiece()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("OrderID") || !wParam.ContainsKey("Num"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                int wOrderID = StringUtils.parseInt(wParam["OrderID"]);
                int wNum = StringUtils.parseInt(wParam["Num"]);


                ServiceResult<List<QMSWorkpiece>> wServiceResult = ServiceInstance.mQMSService.QMS_CreateWorkpiece(wLoginUser, wOrderID, wNum);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, null);
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


        /// <summary>
        /// 变更订单 清除未使用工件信息
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult ClearWorkpiece()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("OrderNo") || !wParam.ContainsKey("LineID"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                String wOrderNo = StringUtils.parseString(wParam["OrderNo"]);
                int wLineID = StringUtils.parseInt(wParam["LineID"]);


                ServiceResult<int> wServiceResult = ServiceInstance.mQMSService.QMS_ClearWorkpieceNoByChangeOrderNo(wLoginUser, wLineID, wOrderNo);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, null);
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


        /// <summary>
        /// 修改工件信息
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult UpdateWorkpiece()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                QMSWorkpiece wQMSWorkpiece = CloneTool.Clone<QMSWorkpiece>(wParam["data"]);
                if (wQMSWorkpiece == null)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }


                ServiceResult<Boolean> wServiceResult = ServiceInstance.mQMSService.QMS_UpdateWorkpiece(wLoginUser, wQMSWorkpiece);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wQMSWorkpiece);
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
        public ActionResult DeleteWorkpiece()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<QMSWorkpiece> wQMSWorkpieceList = CloneTool.CloneArray<QMSWorkpiece>(wParam["data"]);
                if (wQMSWorkpieceList == null || wQMSWorkpieceList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }


                ServiceResult<int> wServiceResult = ServiceInstance.mQMSService.QMS_DeleteWorkpiece(wLoginUser, wQMSWorkpieceList);

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



        /// <summary>
        /// 修改工件状态信息
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult UpdateWorkpieceStatus()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("WorkpieceNo") || !wParam.ContainsKey("Status"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                String wWorkpieceNo = StringUtils.parseString(wParam["WorkpieceNo"]);

                String wRemark = wParam.ContainsKey("Remark") ? StringUtils.parseString(wParam["Remark"]) : "";
                String wOrderNo = wParam.ContainsKey("OrderNo") ? StringUtils.parseString(wParam["OrderNo"]) : "";

                int wStatus = StringUtils.parseInt(wParam["Status"]);



                ServiceResult<Boolean> wServiceResult = ServiceInstance.mQMSService.QMS_UpdateWorkpieceStatus(wLoginUser, wWorkpieceNo, wOrderNo, wStatus, wRemark);

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


        /// <summary>
        /// 添加或修改工件参数
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult UpdateWorkpieceCheckResult()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<QMSCheckResult> wQMSCheckResultList = CloneTool.CloneArray<QMSCheckResult>(wParam["data"]);
                if (wQMSCheckResultList == null || wQMSCheckResultList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }


                ServiceResult<Int32> wServiceResult = ServiceInstance.mQMSService.QMS_UpdateCheckResult(wLoginUser, wQMSCheckResultList);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wQMSCheckResultList, null);
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

        /// <summary>
        /// 获取三坐标结果
        /// </summary>
        /// <returns></returns>

        [HttpGet]
        public ActionResult GetThreeDimensionalCheckResult()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();



                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
                String wProductNoLike = StringUtils.parseString(Request.QueryParamString("ProductNoLike"));
                String wParamNameLike = StringUtils.parseString(Request.QueryParamString("ParamNameLike"));
                int wRecordID = StringUtils.parseInt(Request.QueryParamString("ProcessRecordID"));
                int wParameterID = StringUtils.parseInt(Request.QueryParamString("ParameterID"));
                String wWorkpieceNo = StringUtils.parseString(Request.QueryParamString("WorkpieceNo"));
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
                int wCheckResult = StringUtils.parseInt(Request.QueryParamString("CheckResult"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

                Pagination wPagination = GetPagination();

                ServiceResult<List<QMSThreeDimensionalCheckResult>> wServiceResult = ServiceInstance.mQMSService.QMS_GetThreeDimensionalCheckResultList(wBMSEmployee,
                    wProductID, wProductNoLike, wParamNameLike, wRecordID, wWorkpieceNo, wCheckResult, wActive, wStartTime, wEndTime, wPagination);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wPagination.TotalPage);
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


        /// <summary>
        /// 获取质量数据配置 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult GetThreeDimensionalSet()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();



                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
                String wProductNoLike = StringUtils.parseString(Request.QueryParamString("ProductNoLike"));
                String wCheckParameterLike = StringUtils.parseString(Request.QueryParamString("ParamNameLike"));

                Pagination wPagination = GetPagination();

                ServiceResult<List<QMSThreeDimensionalSet>> wServiceResult = ServiceInstance.mQMSService.QMS_GetThreeDimensionalSetAll(wBMSEmployee,
                    wProductID, wProductNoLike, wCheckParameterLike, ((int)QMSParameterTypes.ThreeDimensional), wPagination);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wPagination.TotalPage);
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

        [HttpGet]
        public ActionResult GetQualityParameterSet()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();



                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
                String wProductNoLike = StringUtils.parseString(Request.QueryParamString("ProductNoLike"));
                String wCheckParameterLike = StringUtils.parseString(Request.QueryParamString("ParamNameLike"));
                int wType = StringUtils.parseInt(Request.QueryParamString("Type"));

                Pagination wPagination = GetPagination();

                ServiceResult<List<QMSThreeDimensionalSet>> wServiceResult = ServiceInstance.mQMSService.QMS_GetThreeDimensionalSetAll(wBMSEmployee,
                    wProductID, wProductNoLike, wCheckParameterLike, wType, wPagination);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wPagination.TotalPage);
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



        /// <summary>
        /// 修改产品检测参数配置
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult UpdateThreeDimensionalSet()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                QMSThreeDimensionalSet wQMSThreeDimensionalSet = CloneTool.Clone<QMSThreeDimensionalSet>(wParam["data"]);


                ServiceResult<Int32> wServiceResult = ServiceInstance.mQMSService.QMS_UpdateThreeDimensionalSet(wLoginUser, wQMSThreeDimensionalSet);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wQMSThreeDimensionalSet);
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


        /// <summary>
        /// 修改产品检测参数配置
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult UpdateThreeDimensionalSetList()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<QMSThreeDimensionalSet> wQMSThreeDimensionalSetList = CloneTool.CloneArray<QMSThreeDimensionalSet>(wParam["data"]);
                ServiceResult<Int32> wServiceResult = new ServiceResult<int>(0);
                String wMsg = "";
                foreach (QMSThreeDimensionalSet wQMSThreeDimensionalSet in wQMSThreeDimensionalSetList)
                {
                    wServiceResult = ServiceInstance.mQMSService.QMS_UpdateThreeDimensionalSet(wLoginUser, wQMSThreeDimensionalSet);
                    wMsg += wServiceResult.FaultCode;
                }

                if (StringUtils.isEmpty(wMsg))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wQMSThreeDimensionalSetList, null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wMsg);
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
            }
            return Json(wResult);
        }


        /// <summary>
        /// 修改产品检测参数配置
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult DeleteThreeDimensionalSet()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                QMSThreeDimensionalSet wQMSThreeDimensionalSet = CloneTool.Clone<QMSThreeDimensionalSet>(wParam["data"]);

                ServiceResult<Int32> wServiceResult = ServiceInstance.mQMSService.QMS_DeleteThreeDimensionalSet(wLoginUser, wQMSThreeDimensionalSet);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wQMSThreeDimensionalSet);
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



        /// <summary>
        /// 一次性合格率
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult GetOneTimePassRate()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();


                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                List<int> wProductIDList = StringUtils.parseIntList(Request.QueryParamString("ProductID"), ",");
                int wStatType = StringUtils.parseInt(Request.QueryParamString("StatType"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));

                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));
                Pagination wPagination = GetPagination();

                ServiceResult<List<QMSOneTimePassRate>> wServiceResult = ServiceInstance.mQMSService.QMS_GetOneTimePassRateList(wBMSEmployee, wLineID, wProductIDList,
                   wStatType, wStartTime, wEndTime, wPagination);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wPagination.TotalPage);
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


        [HttpGet]
        public ActionResult GetOneTimePassRateForChart()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                List<int> wProductIDList = StringUtils.parseIntList(Request.QueryParamString("ProductID"), ",");
                int wStatType = StringUtils.parseInt(Request.QueryParamString("StatType"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));

                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

                ServiceResult<List<QMSOneTimePassRate>> wServiceResult = ServiceInstance.mQMSService.QMS_GetOneTimePassRateForChartList(wBMSEmployee, wLineID, wProductIDList,
                   wStatType, wStartTime, wEndTime);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, null);
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
        public ActionResult UpdateOneTimePassRate()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                QMSOneTimePassRate wQMSOneTimePassRate = CloneTool.Clone<QMSOneTimePassRate>(wParam["data"]);

                ServiceResult<Int32> wServiceResult = ServiceInstance.mQMSService.QMS_UpdateOneTimePassRate(wLoginUser, wQMSOneTimePassRate);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wQMSOneTimePassRate);
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


        [HttpGet]
        public ActionResult GetDoneQualityRate()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));

                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));


                Boolean wHasCheckItem = StringUtils.parseBoolean(Request.QueryParamString("HasCheckItem"));

                ServiceResult<Dictionary<String, double>> wServiceResult = ServiceInstance.mQMSService.QMS_GetDoneQualityRate(wBMSEmployee, wStartTime, wEndTime, wHasCheckItem);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wServiceResult.Get("CheckItem"));
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


    }
}
