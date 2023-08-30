using iPlant.Common.Tools;
using iPlant.FMS.Models;
using iPlant.FMC.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
namespace iPlant.FMS.WEB
{
    public class DMSDeviceRealParameterController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSDeviceRealParameterController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wName = StringUtils.parseString(Request.QueryParamString("Name"));
                List<String> wVariableName = StringUtils.splitList(Request.QueryParamString("VariableName"), ",");
                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                String wDeviceName = StringUtils.parseString(Request.QueryParamString("DeviceName"));
                int wDataType = StringUtils.parseInt(Request.QueryParamString("DataType"));
                int wDataClass = StringUtils.parseInt(Request.QueryParamString("DataClass"));

                int wPositionID = StringUtils.parseInt(Request.QueryParamString("PositionID"));

                ServiceResult<List<DMSDeviceRealParameter>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceRealParameterList(wBMSEmployee, wName, wVariableName,
                wAreaID, wDeviceID, wDeviceNo, wAssetNo, wDeviceName, wDataType, wDataClass, wPositionID);
                List<DMSDeviceRealParameter> wServerRst = wServiceResult.getResult();

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst, null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServerRst, null);
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
        public ActionResult StructAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wName = StringUtils.parseString(Request.QueryParamString("Name"));
                List<String> wVariableName = StringUtils.splitList(Request.QueryParamString("VariableName"), ",");

                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                String wDeviceName = StringUtils.parseString(Request.QueryParamString("DeviceName"));
                int wDataType = StringUtils.parseInt(Request.QueryParamString("DataType"));
                int wDataClass = StringUtils.parseInt(Request.QueryParamString("DataClass"));
                int wPositionID = StringUtils.parseInt(Request.QueryParamString("PositionID"));


                ServiceResult<Dictionary<int, Dictionary<String, Object>>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceRealParameterStructList(wBMSEmployee, wName, wVariableName,
                 wAreaID, wDeviceID, wDeviceNo, wAssetNo, wDeviceName, wDataType, wDataClass, wPositionID);
                Dictionary<String, Dictionary<String, Object>> wServiceRst = null;
                if (wServiceResult != null && wServiceResult.Result != null && wServiceResult.Result.Count > 0)
                    wServiceRst = wServiceResult.Result.ToDictionary(p => p.Key.ToString(), p => p.Value);


                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {

                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceRst);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wServiceRst);
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
        public ActionResult PositionAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));

                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));

                ServiceResult<List<DMSDeviceRealParameter>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceRealParameterList(wBMSEmployee, "", null,
                         wAreaID, -1, "", "", "", -1, ((int)DMSDataClass.PositionData), -1);


                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                { 

                    Dictionary<String, List<DMSDeviceRealParameter>> wDMSDeviceRealParameterListDic = new Dictionary<string, List<DMSDeviceRealParameter>>();

                    foreach (DMSDeviceRealParameter wDMSDeviceRealParameter in wServiceResult.Result)
                    {
                        List<String> wAssetNos = StringUtils.splitList(wDMSDeviceRealParameter.ParameterDesc, "_", ",", " ", ";", "/", "\\");

                        foreach (String wAssetNo in wAssetNos)
                        {
                            if (StringUtils.isNotEmpty(wAssetNo) && int.TryParse(wAssetNo, out int wDeviceID))
                            {

                                if (!wDMSDeviceRealParameterListDic.ContainsKey(wAssetNo))
                                    wDMSDeviceRealParameterListDic.Add(wAssetNo, new List<DMSDeviceRealParameter>());

                                wDMSDeviceRealParameterListDic[wAssetNo].Add(wDMSDeviceRealParameter);
                            }
                        }
                    }
                    Dictionary<String, Object> wDictionary = new Dictionary<string, object>();



                    foreach (String wAssetNo in wDMSDeviceRealParameterListDic.Keys)
                    {
                        wDictionary.Add(wAssetNo, new
                        {
                            AssetNo = wAssetNo, 
                            TotalCount = wDMSDeviceRealParameterListDic[wAssetNo].Count,
                            PositionList = wDMSDeviceRealParameterListDic[wAssetNo].GroupBy(p => p.PositionName).ToDictionary(p => p.Key, p => p.ToList()),
                            PositionCount = wDMSDeviceRealParameterListDic[wAssetNo].GroupBy(p => p.PositionName)
                            .ToDictionary(p => p.Key, p => p.Count(q => StringUtils.isNotEmpty(q.ParameterValue)))
                        }); 

                    }
                     
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "",null, wDictionary);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString());
            }
            return Json(wResult);
        }



        [HttpGet]
        public ActionResult DeviceCurrentAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));


                ServiceResult<Dictionary<String, Object>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceCurrentStruct(wBMSEmployee,

                 wDeviceID, wDeviceNo, wAssetNo);

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



        [HttpGet]
        public ActionResult DeviceTestRead()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                var wSourceAddressList = StringUtils.parseString(Request.QueryParamString("SourceAddress")).Split("||").ToList();
                int wServerID = StringUtils.parseInt(Request.QueryParamString("ServerID"));

                int wIsRead = StringUtils.parseInt(Request.QueryParamString("IsRead"));
                String wWriteValue = StringUtils.parseString(Request.QueryParamString("WriteValue"));



                if (wSourceAddressList == null || wSourceAddressList.Count <= 0)
                {
                    return Json(GetResult(RetCode.SERVER_CODE_SUC, "靠谱点，标签名没输入！"));
                }    


                Communication.DataSourceEntity wDataSourceEntity = new Communication.DataSourceEntity();
                wDataSourceEntity.ServerId = wServerID;
                wDataSourceEntity.SourceAddress = wSourceAddressList[0];
                wDataSourceEntity.ID = 1000;

                String wResultString = "";
                if (wIsRead == 1)
                {
                    if (wSourceAddressList.Count > 1)
                    {
                        List<Communication.DataSourceEntity> wEntitys = new List<Communication.DataSourceEntity>();
                        wEntitys.Add(wDataSourceEntity);

                        for (int i = 1; i < wSourceAddressList.Count; i++)
                        {
                            wDataSourceEntity = new Communication.DataSourceEntity();
                            wDataSourceEntity.ServerId = wServerID;
                            wDataSourceEntity.SourceAddress = wSourceAddressList[i];
                            wDataSourceEntity.ID = 1000;
                            wEntitys.Add(wDataSourceEntity);
                        }


                        List<String> wValue = Communication.LineManager.getInstance(wLineID)
                        .GetBasicDevice(wAssetNo).ReadNodes(wEntitys, wServerID);

                        wResultString = StringUtils.Join("||", wValue);
                    }
                    else
                    {
                        wResultString = Communication.LineManager.getInstance(wLineID)
                       .GetBasicDevice(wAssetNo)
                       .ReadNodeBase(wDataSourceEntity);
                    }

                }
                else
                {
                    Communication.LineManager.getInstance(wLineID).GetBasicDevice(wAssetNo).WriteNode(wDataSourceEntity, wWriteValue);
                }
                wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wResultString);

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
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));



                ServiceResult<DMSDeviceRealParameter> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceRealParameter(wBMSEmployee, wID,
                    wDeviceNo);

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

        [HttpGet]
        public ActionResult DeviceAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                List<int> wIDList = StringUtils.parseIntList(Request.QueryParamString("DeviceIDList"), ",");



                ServiceResult<List<DMSDeviceRealParameter>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceRealParameterList(wBMSEmployee,
                 wIDList);
                List<DMSDeviceRealParameter> wServerRst = wServiceResult.getResult();

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst, null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServerRst, null);
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
        public ActionResult SyncRealParameter()
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

                List<DMSDeviceRealParameter> wDMSDeviceRealParameterList = CloneTool.CloneArray<DMSDeviceRealParameter>(wParam["data"]);
                ServiceResult<List<String>> wServerRst = ServiceInstance.mDMSService.DMS_SyncDeviceRealParameterList(wBMSEmployee, wDMSDeviceRealParameterList);
                // 直接更新数据库值 没有则插入
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
            return Json(wResult);

        }

    }
}
