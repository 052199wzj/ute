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
    public class FPCProductController : BaseController
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FPCProductController));
        [HttpGet]
        public ActionResult GetAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wProductNo= StringUtils.parseString(Request.QueryParamString("ProductNo"));
                String wProductLike = StringUtils.parseString(Request.QueryParamString("ProductLike"));
                String wDrawingNo = StringUtils.parseString(Request.QueryParamString("DrawingNo"));
                int wProductType = StringUtils.parseInt(Request.QueryParamString("ProductType"));
                int wMaterialID = StringUtils.parseInt(Request.QueryParamString("MaterialID")); 

                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
                Pagination wPagination = GetPagination();

                ServiceResult<List<FPCProduct>> wServiceResult = ServiceInstance.mFPCService.FPC_GetProductList(wBMSEmployee,  wProductNo,  wProductLike,
             wProductType,  wMaterialID,  wDrawingNo,  wActive, wPagination);

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
        public ActionResult Info()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wID = StringUtils.parseInt(Request.QueryParamString("ID"));
                String wProductNo = StringUtils.parseString(Request.QueryParamString("ProductNo")); 



                ServiceResult<FPCProduct> wServiceResult = ServiceInstance.mFPCService.FPC_GetProduct(wBMSEmployee, wID,
                    wProductNo);

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

                BMSEmployee wBMSEmployee = GetSession();
                int wUserID = wBMSEmployee.ID;

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                FPCProduct wFPCProduct = CloneTool.Clone<FPCProduct>(wParam["data"]);

                ServiceResult<Int32> wServiceResult = ServiceInstance.mFPCService.FPC_UpdateProduct(wBMSEmployee, wFPCProduct);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wFPCProduct);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wFPCProduct);
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

                List<FPCProduct> wFPCProductList = CloneTool.CloneArray<FPCProduct>(wParam["data"]);
                if (wFPCProductList == null || wFPCProductList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                int wActive = wParam.ContainsKey("Active") ? StringUtils.parseInt(wParam["Active"]) : 0;

                List<Int32> wIDList = new List<Int32>();
                foreach (FPCProduct wItem in wFPCProductList)
                {
                    wIDList.Add(wItem.ID);
                }
                ServiceResult<Int32> wServiceResult = ServiceInstance.mFPCService.FPC_ActiveProduct(wBMSEmployee, wIDList,
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

                List<FPCProduct> wFPCProductList = CloneTool.CloneArray<FPCProduct>(wParam["data"]);
                if (wFPCProductList == null || wFPCProductList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                ServiceResult<Int32> wServiceResult = new ServiceResult<int>(0);
                foreach (FPCProduct wItem in wFPCProductList)
                {
                    wServiceResult = ServiceInstance.mFPCService.FPC_DeleteProduct(wBMSEmployee, wItem);
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
 

    }
}
