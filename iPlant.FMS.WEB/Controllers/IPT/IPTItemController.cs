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
    public class IPTItemController : BaseController
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(IPTItemController));

        /// <summary>
        /// 配置查询 （IPTType：首巡检 点检 维护）
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult ItemAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();


                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
                String wProductLike = StringUtils.parseString(Request.QueryParamString("ProductLike"));
                int wIPTType = StringUtils.parseInt(Request.QueryParamString("IPTType"));
                int wModeType = StringUtils.parseInt(Request.QueryParamString("ModeType"));
                int wMainID = StringUtils.parseInt(Request.QueryParamString("MainID"));
                String wMainNameLike = StringUtils.parseString(Request.QueryParamString("MainNameLike"));
                String wItemNameLike = StringUtils.parseString(Request.QueryParamString("ItemNameLike"));
                String wGroupNameLike = StringUtils.parseString(Request.QueryParamString("GroupNameLike"));
                 
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime")); 

                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

                Pagination wPagination = GetPagination();


                ServiceResult<List<IPTItem>> wServiceResult = ServiceInstance.mIPTService.IPT_SelectItemList(wBMSEmployee, wLineID, wProductID, wProductLike, wIPTType, wModeType,
                    wMainID, wMainNameLike, wGroupNameLike, wItemNameLike, wStartTime, wEndTime,
                      wActive, wPagination);

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
        /// 修改配置信息
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult UpdateItem()
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

                IPTItem wIPTItem = CloneTool.Clone<IPTItem>(wParam["data"]);
                if (wIPTItem == null)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                ServiceResult<int> wServiceResult = ServiceInstance.mIPTService.IPT_UpdateItem(wLoginUser, wIPTItem);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wIPTItem);
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
        /// 删除配置信息
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult DeleteItem()
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

                IPTItem wIPTItem = CloneTool.Clone<IPTItem>(wParam["data"]);
                if (wIPTItem == null)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }


                ServiceResult<int> wServiceResult = ServiceInstance.mIPTService.IPT_DeleteItem(wLoginUser, wIPTItem);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wIPTItem);
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
        /// 修改配置状态信息
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult ActiveItem()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data") || !wParam.ContainsKey("Active"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<int> wIDList = CloneTool.CloneArray<int>(wParam["data"]);
                int wActive = StringUtils.parseInt(wParam["Active"]);



                ServiceResult<int> wServiceResult = ServiceInstance.mIPTService.IPT_ActiveItem(wLoginUser, wIDList, wActive);

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
        /// 记录查询
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult RecordAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();


                int wOrderID = StringUtils.parseInt(Request.QueryParamString("OrderID"));
                int wItemID = StringUtils.parseInt(Request.QueryParamString("ItemID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
                String wProductLike = StringUtils.parseString(Request.QueryParamString("ProductLike"));
                int wIPTType = StringUtils.parseInt(Request.QueryParamString("IPTType"));
                int wModeType = StringUtils.parseInt(Request.QueryParamString("ModeType"));
                int wMainID = StringUtils.parseInt(Request.QueryParamString("MainID"));
                int wModelID = StringUtils.parseInt(Request.QueryParamString("ModelID"));


                String wMainNameLike = StringUtils.parseString(Request.QueryParamString("MainNameLike"));
                String wGroupNameLike = StringUtils.parseString(Request.QueryParamString("GroupNameLike"));

                String wItemNameLike = StringUtils.parseString(Request.QueryParamString("ItemNameLike"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

                int wCreatorID = StringUtils.parseInt(Request.QueryParamString("CreatorID"));
                int wEditorID = StringUtils.parseInt(Request.QueryParamString("EditorID"));
                int wStatus = StringUtils.parseInt(Request.QueryParamString("Status"));

                Pagination wPagination = GetPagination();


                ServiceResult<List<IPTRecordItem>> wServiceResult = ServiceInstance.mIPTService.IPT_SelectRecordItemList(wBMSEmployee, wOrderID, wItemID, wLineID, wProductID, wModelID, wProductLike, wIPTType, wModeType,
                    wMainID, wMainNameLike, wGroupNameLike, wItemNameLike, wCreatorID, wEditorID, wStartTime, wEndTime,
                      wStatus, wPagination);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wPagination.TotalPage);
                    SetResult(wResult, "TotalCount", wPagination.TotalCount);
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
        /// 首巡检查询当天记录（包括未填写的）
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult PatrolRecordDetail()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wOrderID = StringUtils.parseInt(Request.QueryParamString("OrderID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID")); 
                DateTime wWorkDate = StringUtils.parseDate(Request.QueryParamString("WorkDate"));



                ServiceResult<List<IPTRecordItem>> wServiceResult = ServiceInstance.mIPTService.IPT_PatrolRecordDetail(wBMSEmployee, wOrderID, wLineID, wProductID, wWorkDate);

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
        /// 修改记录信息
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult UpdateRecordItem()
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

                IPTRecordItem wIPTRecordItem = CloneTool.Clone<IPTRecordItem>(wParam["data"]);
                if (wIPTRecordItem == null)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }


                ServiceResult<int> wServiceResult = ServiceInstance.mIPTService.IPT_UpdateRecordItem(wLoginUser, wIPTRecordItem);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wIPTRecordItem);
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
        /// 修改记录信息
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult DeleteRecordItem()
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

                IPTRecordItem wIPTRecordItem = CloneTool.Clone<IPTRecordItem>(wParam["data"]);
                if (wIPTRecordItem == null)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }


                ServiceResult<int> wServiceResult = ServiceInstance.mIPTService.IPT_DeleteRecordItem(wLoginUser, wIPTRecordItem);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wIPTRecordItem);
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
