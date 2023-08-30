using iPlant.Common.Tools;
using iPlant.FMS.Models;
using iPlant.FMC.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using iPlant.FMS.WEB;

namespace iPlant.FMS.WEB
{
    public class OMSOrderController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(OMSOrderController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wLoginUser = this.GetSession();

                int wCommandID = StringUtils.parseInt(Request.QueryParamString("CommandID"));
                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wStationID = StringUtils.parseInt(Request.QueryParamString("StationID"));
                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
                int wCustomerID = StringUtils.parseInt(Request.QueryParamString("CustomerID"));
                int wTeamID = StringUtils.parseInt(Request.QueryParamString("TeamID"));
                String wPartNo = StringUtils.parseString(Request.QueryParamString("PartNo"));
                String wOrderNo = StringUtils.parseString(Request.QueryParamString("OrderNo"));
                String wCommandNo = StringUtils.parseString(Request.QueryParamString("CommandNo"));
                String wFollowNo = StringUtils.parseString(Request.QueryParamString("FollowNo"));
                String wOperatorNo = StringUtils.parseString(Request.QueryParamString("OperatorNo"));

                DateTime wPreStartTime = StringUtils.parseDate(Request.QueryParamString("PreStartTime"));
                DateTime wPreEndTime = StringUtils.parseDate(Request.QueryParamString("PreEndTime"));
                DateTime wRelStartTime = StringUtils.parseDate(Request.QueryParamString("RelStartTime"));
                DateTime wRelEndTime = StringUtils.parseDate(Request.QueryParamString("RelEndTime"));
                List<int> wStatusList = StringUtils.parseIntList(Request.QueryParamString("StatusList"), ",");


                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                String wWorkPartPointCode = StringUtils.parseString(Request.QueryParamString("WorkPartPointCode"));


                Pagination wPagination = GetPagination("OrderPriority");



                ServiceResult<List<OMSOrder>> wServiceResult = ServiceInstance.mOMSService.OMS_SelectList(wLoginUser,
                          wCommandID, wCommandNo, wFollowNo, wOperatorNo, wFactoryID, wWorkShopID,
                 wLineID, wAssetNo, wWorkPartPointCode, wStationID, wProductID, wCustomerID, wTeamID, wPartNo,
                 wStatusList, wOrderNo, wPreStartTime, wPreEndTime, wRelStartTime,
                 wRelEndTime, wPagination);

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
        public ActionResult Andon()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wLoginUser = this.GetSession();

                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                List<int> wStatusList = StringUtils.parseIntList(Request.QueryParamString("StatusList"), ",");

                Pagination wPagination = Pagination.Create(1, 10, "OrderPriority", "desc");

                ServiceResult<List<OMSOrder>> wServiceResult = ServiceInstance.mOMSService.OMS_SelectList(wLoginUser,
                          -1, "", "", "", -1, -1, wLineID, "", "", -1, -1, -1, -1, "",
                    wStatusList, "", new DateTime(), new DateTime(), DateTime.Now.Date,
                      DateTime.Now.Date.AddDays(1), wPagination);



                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    DateTime wBaseTime = new DateTime(2010, 1, 1);


                    wServiceResult.Result.Sort((o1, o2) => ((int)((o1.RealFinishDate <= wBaseTime ? DateTime.Now : o1.RealFinishDate)
                    - (o2.RealFinishDate <= wBaseTime ? DateTime.Now : o2.RealFinishDate)).TotalSeconds));

                    List<OMSChangeProduct> wOMSChangeProductList = null;
                    if (wServiceResult.Result != null && wServiceResult.Result.Count > 0)
                    {

                        var wChangeOrderIDs = wServiceResult.Result.Select(p => p.ID).ToList();
                        ServiceResult<List<OMSChangeProduct>> wServiceResult2 = ServiceInstance.mOMSService.OMS_SelectChangeProductList(wLoginUser, wLineID,
                              wChangeOrderIDs, Pagination.MaxSize);

                        wOMSChangeProductList = wServiceResult2.Result;
                    }
                    OMSOrder wCurrentOrder = null;
                    OMSOrder wNextOrder = null;
                    for (int i = 0; i < wServiceResult.Result.Count; i++)
                    {
                        if (wServiceResult.Result[i] == null)
                            continue;

                        if (wServiceResult.Result[i].Status == ((int)OMSOrderStatus.ProductOrder))
                        {
                            wCurrentOrder = wServiceResult.Result[i];

                            if (i < wServiceResult.Result.Count - 1)
                            {
                                wNextOrder = wServiceResult.Result[i + 1];
                            }
                            else
                            {
                                wNextOrder = null;
                            }
                        }
                        if (wCurrentOrder == null)
                            wCurrentOrder = wServiceResult.Result[i];
                    }


                    ServiceResult<List<QMSOneTimePassRate>> wQMSOneTimePassRateServiceResult = ServiceInstance.mQMSService.QMS_GetOneTimePassRateForChartList(wLoginUser, wLineID, null,
                        ((int)DMSStatTypes.Day), DateTime.Now.Date, DateTime.Now.Date.AddDays(1).AddMilliseconds(-1));


                    ServiceResult<List<DMSDeviceLedger>> wDMSDeviceLedgerListResult = ServiceInstance.mDMSService.DMS_GetDeviceLedgerList(wLoginUser, wLineID, 1, Pagination.MaxSize);



                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wOMSChangeProductList);
                    SetResult(wResult, "CurrentOrder", wCurrentOrder);
                    SetResult(wResult, "NextOrder", wNextOrder);
                    SetResult(wResult, "OneTimePassRate", wQMSOneTimePassRateServiceResult.Result);
                    SetResult(wResult, "Device", wDMSDeviceLedgerListResult.Result);
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
        public ActionResult ProductAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wLoginUser = this.GetSession();

                int wCommandID = StringUtils.parseInt(Request.QueryParamString("CommandID"));
                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));


                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                String wWorkPartPointCode = StringUtils.parseString(Request.QueryParamString("WorkPartPointCode"));

                DateTime wPlanReceiveDate = StringUtils.parseDate(Request.QueryParamString("PlanReceiveDate"));
                DateTime wPlanReceiveDate1 = StringUtils.parseDate(Request.QueryParamString("PlanReceiveDate1")).AddDays(1);

                Pagination wPagination = GetPagination();

                ServiceResult<List<OMSOrder>> wServiceResult = ServiceInstance.mOMSService.OMS_SelectProductList(wLoginUser,
                          wCommandID, wFactoryID, wWorkShopID,
                 wLineID, wAssetNo, wWorkPartPointCode, wPlanReceiveDate,
                 wPlanReceiveDate1, wPagination);

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
        public ActionResult WorkpieceNoPosition()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wLoginUser = this.GetSession();

                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                List<String> wOrderNoList = StringUtils.splitList(Request.QueryParamString("OrderNo"), ",");



                ServiceResult<Dictionary<String, Dictionary<String, int>>> wServiceResult = ServiceInstance.mOMSService.OMS_SelectOrderPositionList(wLoginUser,
                          wLineID, wOrderNoList);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.Result);
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



        public ActionResult StatusCount()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wLoginUser = this.GetSession();

                int wCommandID = StringUtils.parseInt(Request.QueryParamString("CommandID"));
                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wStationID = StringUtils.parseInt(Request.QueryParamString("StationID"));
                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
                int wCustomerID = StringUtils.parseInt(Request.QueryParamString("CustomerID"));
                int wTeamID = StringUtils.parseInt(Request.QueryParamString("TeamID"));
                String wPartNo = StringUtils.parseString(Request.QueryParamString("PartNo"));

                DateTime wPreStartTime = StringUtils.parseDate(Request.QueryParamString("PreStartTime"));
                DateTime wPreEndTime = StringUtils.parseDate(Request.QueryParamString("PreEndTime"));
                DateTime wRelStartTime = StringUtils.parseDate(Request.QueryParamString("RelStartTime"));
                DateTime wRelEndTime = StringUtils.parseDate(Request.QueryParamString("RelEndTime"));
                List<int> wStatusList = StringUtils.parseIntList(Request.QueryParamString("StatusList"), ",");

                String wOrderNo = StringUtils.parseString(Request.QueryParamString("OrderNo"));

                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                String wWorkPartPointCode = StringUtils.parseString(Request.QueryParamString("WorkPartPointCode"));

                ServiceResult<Dictionary<String, int>> wServiceResult = ServiceInstance.mOMSService.OMS_SelectStatusCount(wLoginUser,
                          wCommandID, wFactoryID, wWorkShopID,
                 wLineID, wAssetNo, wWorkPartPointCode, wStationID, wProductID, wCustomerID, wTeamID, wPartNo, wStatusList,
                 wOrderNo, wPreStartTime, wPreEndTime, wRelStartTime,
                 wRelEndTime);

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


        [HttpGet]
        public ActionResult RFOrderList()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wLoginUser = this.GetSession();


                int wCustomerID = StringUtils.parseInt(Request.QueryParamString("CustomerID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
                String wPartNo = StringUtils.parseString(Request.QueryParamString("PartNo"));

                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));
                Pagination wPagination = GetPagination("OrderPriority");
                 

                ServiceResult<List<OMSOrder>> wServiceResult = ServiceInstance.mOMSService.OMS_SelectList_RF(wLoginUser, wCustomerID,
                    wWorkShopID, wLineID, wProductID, wPartNo, wStartTime, wEndTime, wPagination);

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
        public ActionResult StatusAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wLoginUser = this.GetSession();


                List<int> wStatusList = StringUtils.parseIntList(Request.QueryParamString("StatusList"), ",");

                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));


                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                String wWorkPartPointCode = StringUtils.parseString(Request.QueryParamString("WorkPartPointCode"));

                Pagination wPagination = GetPagination("OrderPriority");

                ServiceResult<List<OMSOrder>> wServiceResult = ServiceInstance.mOMSService.OMS_QueryOrderByStatus(wLoginUser, wWorkShopID, wLineID, wAssetNo, wWorkPartPointCode,
                        wStatusList, wPagination);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wPagination.TotalPage);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_IN);
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

                ServiceResult<OMSOrder> wServiceResult = null;

                if (wID >= 0)
                {
                    wServiceResult = ServiceInstance.mOMSService.OMS_SelectOrderByID(wBMSEmployee, wID);
                }
                else if (StringUtils.isNotEmpty(wCode))
                {
                    wServiceResult = ServiceInstance.mOMSService.OMS_QueryOrderByNo(wBMSEmployee, wCode);

                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }


                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.Result);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wServiceResult.Result);
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
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                
                OMSOrder wOMSOrder = CloneTool.Clone<OMSOrder>(wParam["data"]);
                if (wOMSOrder == null)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                if (wOMSOrder.ID <= 0)
                {
                    wOMSOrder.CreatorID = wLoginUser.ID;
                    wOMSOrder.CreateTime = DateTime.Now;
                }
                else
                {
                    wOMSOrder.EditorID = wLoginUser.ID;
                    wOMSOrder.EditTime = DateTime.Now;
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mOMSService.OMS_UpdateOrder(wLoginUser, wOMSOrder);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wOMSOrder);
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
        public ActionResult UpdateList()
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

                List<OMSOrder> wOMSOrderList = CloneTool.CloneArray<OMSOrder>(wParam["data"]);
                if (wOMSOrderList == null || wOMSOrderList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                ServiceResult<Int32> wServiceResult = new ServiceResult<int>();
                foreach (OMSOrder wOMSOrder in wOMSOrderList)
                {
                    if (wOMSOrder.ID <= 0)
                    {
                        wOMSOrder.CreatorID = wLoginUser.ID;
                        wOMSOrder.CreateTime = DateTime.Now;
                    }
                    else
                    {
                        wOMSOrder.EditorID = wLoginUser.ID;
                        wOMSOrder.EditTime = DateTime.Now;
                    }

                    wServiceResult = ServiceInstance.mOMSService.OMS_UpdateOrder(wLoginUser, wOMSOrder);
                    if (StringUtils.isNotEmpty(wServiceResult.getFaultCode()))
                        break;
                }


                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wOMSOrderList);
                }
                else
                {
                    ServiceInstance.mOMSService.OMS_DeleteOrderList(wLoginUser, wOMSOrderList);
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
        public ActionResult CheckList()
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

                List<OMSOrder> wOMSOrderList = CloneTool.CloneArray<OMSOrder>(wParam["data"]);
                if (wOMSOrderList == null || wOMSOrderList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                List<OMSOrder> wBadOrderList;

                ServiceResult<List<OMSOrder>> wServiceResult = ServiceInstance.mOMSService.OMS_JudgeOrderImport(wLoginUser,
                    wOMSOrderList, out wBadOrderList);


                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wBadOrderList);
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
        public ActionResult Delete()
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

                List<OMSOrder> wOMSOrderList = CloneTool.CloneArray<OMSOrder>(wParam["data"]);
                if (wOMSOrderList == null || wOMSOrderList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mOMSService.OMS_DeleteOrderList(wLoginUser, wOMSOrderList);

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
        public ActionResult Audit()
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

                List<OMSOrder> wOMSOrderList = CloneTool.CloneArray<OMSOrder>(wParam["data"]);
                if (wOMSOrderList == null || wOMSOrderList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mOMSService.OMS_AuditOrder(wLoginUser, wOMSOrderList);

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
        public ActionResult OrderPriority()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("ID") || !wParam.ContainsKey("Num"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                int wID = StringUtils.parseInt(wParam["ID"]);
                int wNum = StringUtils.parseInt(wParam["Num"]);


                ServiceResult<Int32> wServiceResult = ServiceInstance.mOMSService.OMS_OrderPriority(wLoginUser, wID, wNum);

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
        public ActionResult SyncAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                logger.Info(JsonConvert.SerializeObject(wParam));
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                
                List<OMSOrder> wOMSOrderList = CloneTool.CloneArray<OMSOrder>(wParam["data"]);
                if (wOMSOrderList == null || wOMSOrderList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }


                ServiceResult<List<String>> wServerRst = ServiceInstance.mOMSService.OMS_SyncOrderList(wLoginUser, wOMSOrderList);

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
            logger.Info(JsonConvert.SerializeObject(wResult));
            return Json(wResult);
        }
        [HttpPost]
        public ActionResult StatusChange()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                logger.Info(JsonConvert.SerializeObject(wParam));
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                // 检查订单存在 存在且订单状态可以变更

                List<OMSOrder> wOMSOrderList = CloneTool.CloneArray<OMSOrder>(wParam["data"]);
                if (wOMSOrderList == null || wOMSOrderList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                ServiceResult<List<String>> wServerRst = ServiceInstance.mOMSService.OMS_SyncOrderChangeList(wLoginUser, wOMSOrderList);

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
            logger.Info(JsonConvert.SerializeObject(wResult));
            return Json(wResult);
        }
    }
}
