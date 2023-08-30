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
    public class MSSMaterialController : BaseController
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(MSSMaterialController));
        [HttpGet]
        public ActionResult GetAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wMaterialNo = StringUtils.parseString(Request.QueryParamString("MaterialNo"));
                String wMaterialName = StringUtils.parseString(Request.QueryParamString("MaterialName"));
                String wGroes = StringUtils.parseString(Request.QueryParamString("Groes"));
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
                Pagination wPagination = GetPagination();

                ServiceResult<List<MSSMaterial>> wServiceResult = ServiceInstance.mMSSService.MSS_GetMaterialList(wBMSEmployee, wMaterialNo,
                 wMaterialName, wGroes, wActive, wPagination);

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

                MSSMaterial wMSSMaterial = CloneTool.Clone<MSSMaterial>(wParam["data"]);

                ServiceResult<Int32> wServiceResult = ServiceInstance.mMSSService.MSS_SaveMaterial(wBMSEmployee, wMSSMaterial);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wMSSMaterial);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wMSSMaterial);
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

                List<MSSMaterial> wMSSMaterialList = CloneTool.CloneArray<MSSMaterial>(wParam["data"]);
                if (wMSSMaterialList == null || wMSSMaterialList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                int wActive = StringUtils.parseInt(wParam["Active"]);

                List<Int32> wIDList = new List<Int32>();
                foreach (MSSMaterial wItem in wMSSMaterialList)
                {
                    wIDList.Add(wItem.ID);
                }
                ServiceResult<Int32> wServiceResult = ServiceInstance.mMSSService.MSS_ActiveMaterialList(wBMSEmployee, wIDList,
                        wActive);
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

                List<MSSMaterial> wMSSMaterialList = CloneTool.CloneArray<MSSMaterial>(wParam["data"]);
                if (wMSSMaterialList == null || wMSSMaterialList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                ServiceResult<Int32> wServiceResult = new ServiceResult<int>(0);
                foreach (MSSMaterial wItem in wMSSMaterialList)
                {
                    wServiceResult = ServiceInstance.mMSSService.MSS_DeleteMaterialList(wBMSEmployee, wItem);
                    if (StringUtils.isNotEmpty(wServiceResult.FaultCode))
                        break;
                }

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


        [HttpGet]
        public ActionResult GetMaterialStock()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wMaterialStoragePoint = StringUtils.parseString(Request.QueryParamString("MaterialStoragePoint"));
                int wLocationID = StringUtils.parseInt(Request.QueryParamString("LocationID"));
                int wMaterialID = StringUtils.parseInt(Request.QueryParamString("MaterialID"));
                String wMaterialNo = StringUtils.parseString(Request.QueryParamString("MaterialNo"));
                Pagination wPagination = GetPagination();


                ServiceResult<List<MSSStock>> wServiceResult = ServiceInstance.mMSSService.MSS_GetMaterialStock(wBMSEmployee, wMaterialID, wLocationID, wMaterialNo,
                   wPagination);

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
        public ActionResult GetLocationAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wType = StringUtils.parseInt(Request.QueryParamString("Type"));
                Pagination wPagination = GetPagination();


                ServiceResult<List<MSSLocation>> wServiceResult = ServiceInstance.mMSSService.MSS_GetMaterialLocation(wBMSEmployee, wType, wPagination);

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

        [HttpPost]

        public ActionResult UpdateLocation()
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

                MSSLocation wMSSLocation = CloneTool.Clone<MSSLocation>(wParam["data"]);

                ServiceResult<Int32> wServiceResult = ServiceInstance.mMSSService.MSS_UpdateMaterialLocation(wBMSEmployee, wMSSLocation);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wMSSLocation);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wMSSLocation);
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
        public ActionResult GetMaterialStockDetail()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wStockID = StringUtils.parseInt(Request.QueryParamString("StockID"));
                Pagination wPagination = GetPagination();


                ServiceResult<List<MSSMaterialOperationRecord>> wServiceResult = ServiceInstance.mMSSService.MSS_GetMaterialStockDetail(wBMSEmployee, wStockID, wPagination);

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

        [HttpPost]

        public ActionResult AddMaterialOperationRecord()
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

                MSSMaterialOperationRecord wMSSMaterialOperationRecord = CloneTool.Clone<MSSMaterialOperationRecord>(wParam["data"]);

                ServiceResult<Int32> wServiceResult = ServiceInstance.mMSSService.MSS_SaveMaterialOperationRecord(wBMSEmployee, wMSSMaterialOperationRecord);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wMSSMaterialOperationRecord);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wMSSMaterialOperationRecord);
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
        public ActionResult GetMaterialOperationRecord()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();


                int wLocationID = StringUtils.parseInt(Request.QueryParamString("LocationID"));
                String wMaterialStoragePoint = StringUtils.parseString(Request.QueryParamString("MaterialStoragePoint"));
                String wMaterialNo = StringUtils.parseString(Request.QueryParamString("MaterialNo"));
                String wMaterialBatch = StringUtils.parseString(Request.QueryParamString("MaterialBatch"));
                int wOperationType = StringUtils.parseInt(Request.QueryParamString("OperationType"));
                Pagination wPagination = GetPagination();
                ServiceResult<List<MSSMaterialOperationRecord>> wServiceResult = ServiceInstance.mMSSService.MSS_GetMaterialOperationRecord(wBMSEmployee, wLocationID,
                    wMaterialStoragePoint, wMaterialNo, wMaterialBatch, wOperationType, wPagination);

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


    }
}
