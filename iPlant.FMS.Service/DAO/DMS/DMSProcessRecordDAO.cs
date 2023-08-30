using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class DMSProcessRecordDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSProcessRecordDAO));

        private static DMSProcessRecordDAO Instance;

        private DMSProcessRecordDAO() : base()
        {

        }

        public static DMSProcessRecordDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSProcessRecordDAO();
            return Instance;
        }


        public List<DMSProcessRecord> DMS_CurrentProcessRecordList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, List<int> wDataClassList, int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<DMSProcessRecord> wResult = new List<DMSProcessRecord>();
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.*,o.OrderNo,t1.ID as DeviceID,t1.Code as DeviceNo," +
                    " t1.Name as DeviceName,d.ProductName,d.ProductNo, " +
                    " o.WorkPartPointCode, p1.Name as WorkPartPointName" +
                            "  FROM {0}.dms_device_processrecord t" +
                            " inner join {0}.dms_device_ledger t1 on t.AssetNo = t1.AssetNo " +
                            " inner join {0}.oms_order o on t.OrderID = o.ID " +
                            " left join {0}.fpc_product d on o.ProductID = d.ID  " +
                            " left join {0}.fpc_partpoint p1 on o.WorkPartPointCode=p1.Code " +
                            "where t.ID>0 AND o.Status in (3,4,6) "
                        + " and ( @wDeviceID <= 0 or t1.ID  = @wDeviceID)  "
                        + " and ( @wDeviceNo =''  or t1.Code  = @wDeviceNo) "
                        + " and ( @wActive < 0 or t.Active  = @wActive)", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wDeviceID", wDeviceID);
                wParamMap.Add("wDeviceNo", wDeviceNo);
                wParamMap.Add("wActive", wActive);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSProcessRecord wProcessRecord = new DMSProcessRecord();

                    wProcessRecord.ID = StringUtils.parseInt(wReader["ID"]);
                    wProcessRecord.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wProcessRecord.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wProcessRecord.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wProcessRecord.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wProcessRecord.OrderID = StringUtils.parseInt(wReader["OrderID"]);
                    wProcessRecord.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wProcessRecord.MetroNo = StringUtils.parseString(wReader["MetroNo"]);
                    wProcessRecord.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    wProcessRecord.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wProcessRecord.WorkpieceNo = StringUtils.parseString(wReader["WorkpieceNo"]);
                    wProcessRecord.MetroNo = StringUtils.parseString(wReader["MetroNo"]);
                    wProcessRecord.StartTime = StringUtils.parseDate(wReader["StartTime"]);
                    wProcessRecord.EndTime = StringUtils.parseDate(wReader["EndTime"]);
                    wProcessRecord.Active = StringUtils.parseInt(wReader["Active"]);
                    wProcessRecord.Status = StringUtils.parseInt(wReader["Status"]);
                    wProcessRecord.RecordType = StringUtils.parseInt(wReader["RecordType"]);
                    wProcessRecord.Remark = StringUtils.parseString(wReader["Remark"]);
                    wProcessRecord.WorkPartPointCode = StringUtils.parseString(wReader["WorkPartPointCode"]);
                    wProcessRecord.WorkPartPointName = StringUtils.parseString(wReader["WorkPartPointName"]);

                    wResult.Add(wProcessRecord);
                }

                this.DMS_SetProcessRecordItemList(wLoginUser, wResult, wErrorCode);

                if (wDataClassList != null)
                {
                    DMSDataClass wDMSDataClass = DMSDataClass.Default;
                    foreach (int wDataClass in wDataClassList)
                    {
                        if (!Enum.TryParse<DMSDataClass>(wDataClass + "", out wDMSDataClass))
                            continue;
                        this.DMS_SetProcessRecordParams(wLoginUser, wResult, wDMSDataClass, wErrorCode);
                    }
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
        //加工记录分表，按设备编号查询
        public List<DMSProcessRecord> DMS_SelectProcessRecordListNew(BMSEmployee wLoginUser, int wLineID, int wProductID,  int wOrderID,
            String wOrderNo, String wAssetNo, String wWorkPartPointCode, int wDeviceID, String wDeviceNo, String wWorkpieceNo, int wRecordType, List<int> wDataClassList,
            int wActive, int wStatus, DateTime wStartTime, DateTime wEndTime,string wDeviceName, int wTechnologyID,int wModelID, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<DMSProcessRecord> wResult = new List<DMSProcessRecord>();
            try
            {
                string wTableName = "";
                if (wRecordType == 1)
                    wTableName = "dms_device_processrecord_";
                else if (wRecordType == 5 || wRecordType == 6)
                    wTableName = "dms_device_toolrecord_";

                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if (wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if (wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return wResult;
                }

                if (wOrderNo == null)
                    wOrderNo = "";
                if (wDeviceNo == null)
                    wDeviceNo = "";

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();

                //String wModeCode = "";
                //if (wModelID > 0)
                //{
                //    DMSDeviceModel wDMSDeviceModel = DMSDeviceModelDAO.getInstance().DMS_SelectDeviceModel(wLoginUser, wModelID, "", wErrorCode);
                //    if (wDMSDeviceModel.ID == wModelID)
                //        wModeCode = wDMSDeviceModel.Code;
                //}
                String wDeviceCode = "";
                DMSDeviceLedger wDMSDeviceLedger = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedger(wLoginUser, wDeviceID, wDeviceNo, wAssetNo, wErrorCode);
                wDeviceCode = wDMSDeviceLedger.Code.ChangeToTableName();
                wTableName += wDeviceCode; 

                if (!this.IsExitTable(iPlant.Data.EF.MESDBSource.DMS.getDBName(), wTableName))
                {
                    return wResult;
                }
                String wSQL = StringUtils.Format("SELECT t.*,o.OrderNo,t1.LineID,o.ProductID," +
                " t1.ID as DeviceID,t1.Name as DeviceName,t1.ModelID,l.Name as LineName," +
                " t1.Code as DeviceNo,o.WorkPartPointCode" +
                // ", d.ProductName,d.ProductNo ,  p1.Name as WorkPartPointName,p1.Name as  WorkPartPointName " +
                " FROM {0}.{1} t" +
                        " inner join {0}.dms_device_ledger t1 on t.AssetNo = t1.AssetNo" +
                        " inner join {0}.fmc_line l on t1.LineID = l.ID  " +
                        " left join {0}.oms_order o on t.OrderID = o.ID" +
                    //     " left join {0}.fpc_product d on o.ProductID = d.ID  " +
                    //     " left join {0}.fpc_partpoint p1 on o.WorkPartPointCode=p1.Code " +
                        " where t.ID>0 "
                    + " and ( @wOrderID <= 0 or t.OrderID  = @wOrderID)  "
                    + " and ( @wProductID <= 0 or o.ProductID  = @wProductID)  "
                    + " and ( @wLineID <= 0 or t1.LineID  = @wLineID)  "
                    //   + " and ( @wProductNo =''  or d.ProductNo  like @wProductNo or d.ProductName  like @wProductNo) "
                    + " and ( @wOrderNo =''  or o.OrderNo like @wOrderNo) "
                    + " and ( @wWorkPartPointCode =''  or o.WorkPartPointCode = @wWorkPartPointCode) "
                    + " and ( @wAssetNo =''  or t.AssetNo = @wAssetNo) "
                    + " and ( @wDeviceID <= 0 or t1.ID  = @wDeviceID)  "                                                
                    + " and ( @wModelID <= 0 or t1.ModelID  = @wModelID)  "
                    + " and ( @wTechnologyID <= 0 or t.TechnologyID  = @wTechnologyID)  "
                    + " and ( @wDeviceName =''  or t1.Name = @wDeviceName) "
                    + " and ( @wDeviceNo =''  or t1.Code  = @wDeviceNo) "
                    + " and ( @wWorkpieceNo =''  or t.WorkpieceNo  = @wWorkpieceNo) "
                    //  + " and ( @wWorkPartPointName =''  or p1.Name  = @wWorkPartPointName) "
                    + " and ( @wStatus <= 0 or t.Status  = @wStatus)"
                    //+ " and ( @wRecordType <= 0 or t.RecordType  = @wRecordType)"
                    + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wStartTime <= t.EndTime) "
                    + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= t.StartTime)  "
                    + " and ( @wActive < 0 or t.Active  = @wActive) ", wInstance, wTableName);


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wProductID", wProductID);
                wParamMap.Add("wOrderID", wOrderID);
                wParamMap.Add("wOrderNo", StringUtils.isEmpty(wOrderNo) ? "" : "%" + wOrderNo + "%");
              //  wParamMap.Add("wProductNo", StringUtils.isEmpty(wProductNo) ? "" : "%" + wProductNo + "%");
                wParamMap.Add("wDeviceID", wDeviceID);
                wParamMap.Add("wTechnologyID", wTechnologyID);
                wParamMap.Add("wDeviceName", wDeviceName);
            //    wParamMap.Add("wWorkPartPointName", wWorkPartPointName);
                wParamMap.Add("wDeviceNo", wDeviceNo);
                wParamMap.Add("wModelID", wModelID);
                wParamMap.Add("wWorkpieceNo", wWorkpieceNo);
                wParamMap.Add("wActive", wActive);
                wParamMap.Add("wStatus", wStatus);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wRecordType", wRecordType);
                wParamMap.Add("wWorkPartPointCode", wWorkPartPointCode);
                wParamMap.Add("wAssetNo", wAssetNo);

              

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                    return wResult;
                List<FPCPartPoint> wFPCPartPointList=  FPCPartPointDAO.getInstance().FPC_GetPartPointList(wLoginUser,-1, -1, -1,-1,-1,1,Pagination.MaxSize,wErrorCode);

                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<string, FPCPartPoint> wFPCPartPointDic = wFPCPartPointList.GroupBy(p => p.Code).ToDictionary(p => p.Key, p => p.First());


                List<FPCProduct> wFPCProductList = FPCProductDAO.getInstance().FPC_GetProductAll(wLoginUser,"","",-1,-1,"",1, Pagination.MaxSize, wErrorCode);
                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<int, FPCProduct> wFPCProductDic = wFPCProductList.GroupBy(p => p.ID).ToDictionary(p => p.Key, p => p.First());

                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSProcessRecord wProcessRecord = new DMSProcessRecord();

                    wProcessRecord.ID = StringUtils.parseInt(wReader["ID"]);
                    wProcessRecord.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wProcessRecord.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wProcessRecord.LineName = StringUtils.parseString(wReader["LineName"]);
                    wProcessRecord.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wProcessRecord.ModelID = StringUtils.parseInt(wReader["ModelID"]);
                    wProcessRecord.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wProcessRecord.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wProcessRecord.OrderID = StringUtils.parseInt(wReader["OrderID"]);
                    wProcessRecord.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wProcessRecord.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    if (wFPCProductDic.ContainsKey(wProcessRecord.ProductID)) {
                        wProcessRecord.ProductName = wFPCProductDic[wProcessRecord.ProductID].ProductName;
                        wProcessRecord.ProductNo = wFPCProductDic[wProcessRecord.ProductID].ProductNo;
                    }
                      
                   // wProcessRecord.ProductName = StringUtils.parseString(wReader["ProductName"]);
                   //wProcessRecord.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wProcessRecord.MetroNo = StringUtils.parseString(wReader["MetroNo"]);
                    wProcessRecord.WorkpieceNo = StringUtils.parseString(wReader["WorkpieceNo"]);
                    wProcessRecord.StartTime = StringUtils.parseDate(wReader["StartTime"]);
                    wProcessRecord.EndTime = StringUtils.parseDate(wReader["EndTime"]);
                    wProcessRecord.Active = StringUtils.parseInt(wReader["Active"]);
                    wProcessRecord.Status = StringUtils.parseInt(wReader["Status"]);
                    //wProcessRecord.RecordType = StringUtils.parseInt(wReader["RecordType"]);
                    wProcessRecord.Remark = StringUtils.parseString(wReader["Remark"]);
                    wProcessRecord.WorkPartPointCode = StringUtils.parseString(wReader["WorkPartPointCode"]);
                    if (wFPCPartPointDic.ContainsKey(wProcessRecord.WorkPartPointCode))
                    {
                        wProcessRecord.WorkPartPointName = wFPCPartPointDic[wProcessRecord.WorkPartPointCode].Name; 
                    }
                    // wProcessRecord.WorkPartPointName = StringUtils.parseString(wReader["WorkPartPointName"]);
                    wProcessRecord.TechnologyID= StringUtils.parseInt(wReader["TechnologyID"]);
                    wProcessRecord.RecordType = StringUtils.parseInt(wReader["RecordType"]);
                    wResult.Add(wProcessRecord);
                }
                //this.DMS_SetProcessRecordItemList(wLoginUser, wResult, wErrorCode);
                if (wDataClassList != null)
                {

                    DMSDataClass wDMSDataClass = DMSDataClass.Default;
                    foreach (int wDataClass in wDataClassList)
                    {
                        if (!Enum.TryParse<DMSDataClass>(wDataClass + "", out wDMSDataClass))
                            continue;
                        if (StringUtils.isEmpty(wDeviceCode))
                            this.DMS_SetProcessRecordParams(wLoginUser, wResult, wDMSDataClass, wErrorCode);
                        else
                            this.DMS_SetProcessRecordParamsOld(wLoginUser, wResult, wDMSDataClass, wDeviceCode,wRecordType, wErrorCode);
                    }
                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSProcessRecord> DMS_SelectProcessRecordList(BMSEmployee wLoginUser, int wLineID, int wProductID, int wOrderID,
           String wOrderNo, String wAssetNo, String wWorkPartPointCode, int wDeviceID, String wDeviceNo, String wWorkpieceNo, int wRecordType, List<int> wDataClassList,
           int wActive, int wStatus, DateTime wStartTime, DateTime wEndTime, string wDeviceName, int wTechnologyID, int wModelID, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<DMSProcessRecord> wResult = new List<DMSProcessRecord>();
            try
            {

                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if (wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if (wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return wResult;
                }

                if (wOrderNo == null)
                    wOrderNo = "";
                if (wDeviceNo == null)
                    wDeviceNo = "";

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                String wSQL = StringUtils.Format("SELECT t.*,o.OrderNo,t1.LineID,o.ProductID," +
                " t1.ID as DeviceID,t1.Name as DeviceName,t1.ModelID,l.Name as LineName," +
                " t1.Code as DeviceNo,o.WorkPartPointCode" +
                // ", d.ProductName,d.ProductNo ,  p1.Name as WorkPartPointName,p1.Name as  WorkPartPointName " +
                " FROM {0}.dms_device_processrecord t" +
                        " inner join {0}.dms_device_ledger t1 on t.AssetNo = t1.AssetNo" +
                        " inner join {0}.fmc_line l on t1.LineID = l.ID  " +
                        " left join {0}.oms_order o on t.OrderID = o.ID" +
                        //     " left join {0}.fpc_product d on o.ProductID = d.ID  " +
                        //     " left join {0}.fpc_partpoint p1 on o.WorkPartPointCode=p1.Code " +
                        " where t.ID>0 "
                    + " and ( @wOrderID <= 0 or t.OrderID  = @wOrderID)  "
                    + " and ( @wProductID <= 0 or o.ProductID  = @wProductID)  "
                    + " and ( @wLineID <= 0 or t1.LineID  = @wLineID)  "
                    //   + " and ( @wProductNo =''  or d.ProductNo  like @wProductNo or d.ProductName  like @wProductNo) "
                    + " and ( @wOrderNo =''  or o.OrderNo like @wOrderNo) "
                    + " and ( @wWorkPartPointCode =''  or o.WorkPartPointCode = @wWorkPartPointCode) "
                    + " and ( @wAssetNo =''  or t.AssetNo = @wAssetNo) "
                    + " and ( @wDeviceID <= 0 or t1.ID  = @wDeviceID)  "
                    + " and ( @wModelID <= 0 or t1.ModelID  = @wModelID)  "
                    + " and ( @wTechnologyID <= 0 or t.TechnologyID  = @wTechnologyID)  "
                    + " and ( @wDeviceName =''  or t1.Name = @wDeviceName) "
                    + " and ( @wDeviceNo =''  or t1.Code  = @wDeviceNo) "
                    + " and ( @wWorkpieceNo =''  or t.WorkpieceNo  = @wWorkpieceNo) "
                    //  + " and ( @wWorkPartPointName =''  or p1.Name  = @wWorkPartPointName) "
                    + " and ( @wStatus <= 0 or t.Status  = @wStatus)"
                    //+ " and ( @wRecordType <= 0 or t.RecordType  = @wRecordType)"
                    + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wStartTime <= t.EndTime) "
                    + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= t.StartTime)  "
                    + " and ( @wActive < 0 or t.Active  = @wActive) ", wInstance);


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wProductID", wProductID);
                wParamMap.Add("wOrderID", wOrderID);
                wParamMap.Add("wOrderNo", StringUtils.isEmpty(wOrderNo) ? "" : "%" + wOrderNo + "%");
                //  wParamMap.Add("wProductNo", StringUtils.isEmpty(wProductNo) ? "" : "%" + wProductNo + "%");
                wParamMap.Add("wDeviceID", wDeviceID);
                wParamMap.Add("wTechnologyID", wTechnologyID);
                wParamMap.Add("wDeviceName", wDeviceName);
                //    wParamMap.Add("wWorkPartPointName", wWorkPartPointName);
                wParamMap.Add("wDeviceNo", wDeviceNo);
                wParamMap.Add("wModelID", wModelID);
                wParamMap.Add("wWorkpieceNo", wWorkpieceNo);
                wParamMap.Add("wActive", wActive);
                wParamMap.Add("wStatus", wStatus);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wRecordType", wRecordType);
                wParamMap.Add("wWorkPartPointCode", wWorkPartPointCode);
                wParamMap.Add("wAssetNo", wAssetNo);



                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                    return wResult;
                List<FPCPartPoint> wFPCPartPointList = FPCPartPointDAO.getInstance().FPC_GetPartPointList(wLoginUser, -1, -1, -1, -1, -1, 1, Pagination.MaxSize, wErrorCode);

                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<string, FPCPartPoint> wFPCPartPointDic = wFPCPartPointList.GroupBy(p => p.Code).ToDictionary(p => p.Key, p => p.First());


                List<FPCProduct> wFPCProductList = FPCProductDAO.getInstance().FPC_GetProductAll(wLoginUser, "", "", -1, -1, "", 1, Pagination.MaxSize, wErrorCode);
                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<int, FPCProduct> wFPCProductDic = wFPCProductList.GroupBy(p => p.ID).ToDictionary(p => p.Key, p => p.First());

                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSProcessRecord wProcessRecord = new DMSProcessRecord();

                    wProcessRecord.ID = StringUtils.parseInt(wReader["ID"]);
                    wProcessRecord.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wProcessRecord.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wProcessRecord.LineName = StringUtils.parseString(wReader["LineName"]);
                    wProcessRecord.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wProcessRecord.ModelID = StringUtils.parseInt(wReader["ModelID"]);
                    wProcessRecord.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wProcessRecord.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wProcessRecord.OrderID = StringUtils.parseInt(wReader["OrderID"]);
                    wProcessRecord.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wProcessRecord.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    if (wFPCProductDic.ContainsKey(wProcessRecord.ProductID))
                    {
                        wProcessRecord.ProductName = wFPCProductDic[wProcessRecord.ProductID].ProductName;
                        wProcessRecord.ProductNo = wFPCProductDic[wProcessRecord.ProductID].ProductNo;
                    }

                    // wProcessRecord.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    //wProcessRecord.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wProcessRecord.MetroNo = StringUtils.parseString(wReader["MetroNo"]);
                    wProcessRecord.WorkpieceNo = StringUtils.parseString(wReader["WorkpieceNo"]);
                    wProcessRecord.StartTime = StringUtils.parseDate(wReader["StartTime"]);
                    wProcessRecord.EndTime = StringUtils.parseDate(wReader["EndTime"]);
                    wProcessRecord.Active = StringUtils.parseInt(wReader["Active"]);
                    wProcessRecord.Status = StringUtils.parseInt(wReader["Status"]);
                    //wProcessRecord.RecordType = StringUtils.parseInt(wReader["RecordType"]);
                    wProcessRecord.Remark = StringUtils.parseString(wReader["Remark"]);
                    wProcessRecord.WorkPartPointCode = StringUtils.parseString(wReader["WorkPartPointCode"]);
                    if (wFPCPartPointDic.ContainsKey(wProcessRecord.WorkPartPointCode))
                    {
                        wProcessRecord.WorkPartPointName = wFPCPartPointDic[wProcessRecord.WorkPartPointCode].Name;
                    }
                    // wProcessRecord.WorkPartPointName = StringUtils.parseString(wReader["WorkPartPointName"]);
                    wProcessRecord.TechnologyID = StringUtils.parseInt(wReader["TechnologyID"]);
                    wProcessRecord.RecordType = StringUtils.parseInt(wReader["RecordType"]);
                    wResult.Add(wProcessRecord);
                }
                this.DMS_SetProcessRecordItemList(wLoginUser, wResult, wErrorCode);
                if (wDataClassList != null)
                {

                    DMSDataClass wDMSDataClass = DMSDataClass.Default;
                    foreach (int wDataClass in wDataClassList)
                    {
                        if (!Enum.TryParse<DMSDataClass>(wDataClass + "", out wDMSDataClass))
                            continue;
                        this.DMS_SetProcessRecordParams(wLoginUser, wResult, wDMSDataClass, wErrorCode);

                    }
                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSProcessRecord> DMS_SelectProcessRecordUploadList(BMSEmployee wLoginUser, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<DMSProcessRecord> wResult = new List<DMSProcessRecord>();
            try
            {


                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;



                String wSQL = StringUtils.Format("SELECT t.*,o.OrderNo,o.LineID,o.ProductID," +
                    " t1.ID as DeviceID,t1.Name as DeviceName,l.Name as LineName," +
                    " t1.Code as DeviceNo,d.ProductName,d.ProductNo  FROM {0}.dms_device_processrecord t" +
                             " left join {0}.oms_order o on t.OrderID = o.ID" +
                            " left join {0}.fpc_product d on o.ProductID = d.ID  " +
                            " left join {0}.fmc_line l on o.LineID = l.ID  " +
                            " inner join {0}.dms_device_ledger t1 on t.AssetNo = t1.AssetNo  " +
                            "  where t.UploadStatus=0 AND t.Active=1  ", wInstance);


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();


                wSQL = this.DMLChange(wSQL);


                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    this.DMS_UpdateProcessRecordUploadStatus(wLoginUser, wErrorCode);
                    return wResult;
                }
                List<Int32> wRecordIDList = new List<int>();
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSProcessRecord wProcessRecord = new DMSProcessRecord();

                    wProcessRecord.ID = StringUtils.parseInt(wReader["ID"]);
                    wProcessRecord.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wProcessRecord.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wProcessRecord.LineName = StringUtils.parseString(wReader["LineName"]);
                    wProcessRecord.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wProcessRecord.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wProcessRecord.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wProcessRecord.OrderID = StringUtils.parseInt(wReader["OrderID"]);
                    wProcessRecord.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wProcessRecord.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wProcessRecord.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    wProcessRecord.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wProcessRecord.MetroNo = StringUtils.parseString(wReader["MetroNo"]);
                    wProcessRecord.WorkpieceNo = StringUtils.parseString(wReader["WorkpieceNo"]);
                    wProcessRecord.StartTime = StringUtils.parseDate(wReader["StartTime"]);
                    wProcessRecord.EndTime = StringUtils.parseDate(wReader["EndTime"]);
                    wProcessRecord.Active = StringUtils.parseInt(wReader["Active"]);
                    wProcessRecord.Status = StringUtils.parseInt(wReader["Status"]);
                    wProcessRecord.RecordType = StringUtils.parseInt(wReader["RecordType"]);
                    wProcessRecord.Remark = StringUtils.parseString(wReader["Remark"]);

                    wResult.Add(wProcessRecord);

                    if (wProcessRecord.ID > 0 && !wRecordIDList.Contains(wProcessRecord.ID))
                        wRecordIDList.Add(wProcessRecord.ID);
                }
                if (wRecordIDList.Count > 0)
                {
                    this.DMS_SetProcessRecordItemList(wLoginUser, wResult, wErrorCode);
                    this.DMS_SetProcessRecordParams(wLoginUser, wResult, DMSDataClass.Params, wErrorCode);
                    this.DMS_SetProcessRecordParams(wLoginUser, wResult, DMSDataClass.WorkParams, wErrorCode);
                    this.DMS_SetProcessRecordParams(wLoginUser, wResult, DMSDataClass.QualityParams, wErrorCode);

                    this.DMS_UpdateProcessRecordUploadStatus(wLoginUser, wRecordIDList, 2, wErrorCode);
                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        private void DMS_UpdateProcessRecordUploadStatus(BMSEmployee wLoginUser, OutResult<Int32> wErrorCode)
        {

            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                String wSQL = StringUtils.Format(" update {0}.dms_device_processrecord t  set t.UploadStatus=1 where t.ID>0 AND t.UploadStatus=2; ", wInstance);


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                mDBPool.update(wSQL, wParamMap);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wRecordIDList"></param>
        /// <param name="wUploadStatus">1上传成功 2 上传失败 0未上传</param>
        /// <param name="wErrorCode"></param>
        public void DMS_UpdateProcessRecordUploadStatus(BMSEmployee wLoginUser, List<Int32> wRecordIDList, int wUploadStatus, OutResult<Int32> wErrorCode)
        {

            try
            {
                if (wRecordIDList == null || wRecordIDList.Count <= 0 || wUploadStatus <= 0)
                    return;

                wRecordIDList.RemoveAll(p => p <= 0);

                if (wRecordIDList.Count <= 0)
                    return;


                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                String wSQL = StringUtils.Format(" update {0}.dms_device_processrecord t  set t.UploadStatus=@wUploadStatus " +
                    "where  t.UploadStatus!=1 and t.ID in ({1}) ; ", wInstance, StringUtils.Join(",", wRecordIDList.Distinct()));


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                mDBPool.update(wSQL, wParamMap);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public DMSProcessRecord DMS_SelectProcessRecord(BMSEmployee wLoginUser, int wRecordID, OutResult<Int32> wErrorCode)
        {

            DMSProcessRecord wResult = new DMSProcessRecord();
            try
            {
                if (wRecordID <= 0)
                    return wResult;

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.*,o.OrderNo,o.LineID,o.ProductID," +
                          " t1.ID as DeviceID,t1.Name as DeviceName,l.Name as LineName," +
                          " t1.Code as DeviceNo,d.ProductName,d.ProductNo,o.WorkPartPointCode, " +
                          " p1.Name as WorkPartPointName  FROM {0}.dms_device_processrecord t" +
                                   " left join {0}.oms_order o on t.OrderID = o.ID" +
                                  " left join {0}.fpc_product d on o.ProductID = d.ID  " +
                                  " left join {0}.fmc_line l on o.LineID = l.ID  " +
                                  " inner join {0}.dms_device_ledger t1 on t.AssetNo = t1.AssetNo  " +
                                  " left join {0}.fpc_partpoint p1 on o.WorkPartPointCode=p1.Code " +
                                 " where t.ID=@wID ;", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wRecordID);
                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wResult.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wResult.LineName = StringUtils.parseString(wReader["LineName"]);
                    wResult.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wResult.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wResult.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wResult.OrderID = StringUtils.parseInt(wReader["OrderID"]);
                    wResult.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wResult.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wResult.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    wResult.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wResult.MetroNo = StringUtils.parseString(wReader["MetroNo"]);
                    wResult.WorkpieceNo = StringUtils.parseString(wReader["WorkpieceNo"]);
                    wResult.StartTime = StringUtils.parseDate(wReader["StartTime"]);
                    wResult.EndTime = StringUtils.parseDate(wReader["EndTime"]);
                    wResult.Active = StringUtils.parseInt(wReader["Active"]);
                    wResult.Status = StringUtils.parseInt(wReader["Status"]);
                    wResult.RecordType = StringUtils.parseInt(wReader["RecordType"]);
                    wResult.Remark = StringUtils.parseString(wReader["Remark"]);
                    wResult.WorkPartPointCode = StringUtils.parseString(wReader["WorkPartPointCode"]);
                    wResult.WorkPartPointName = StringUtils.parseString(wReader["WorkPartPointName"]);
                    wResult.ItemList = this.DMS_SelectProcessRecordItemList(wLoginUser, wResult.ID, wErrorCode);

                    wResult.ItemList.Sort((o1, o2) =>
                        (o1.AnalysisOrder <= 0 ? Int32.MaxValue : o1.AnalysisOrder)
                        - (o2.AnalysisOrder <= 0 ? Int32.MaxValue : o2.AnalysisOrder));
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;

        }


        public List<DMSProcessRecordItem> DMS_SelectProcessRecordItemList(BMSEmployee wLoginUser, int wRecordID, OutResult<Int32> wErrorCode)
        {

            List<DMSProcessRecordItem> wResult = new List<DMSProcessRecordItem>();
            try
            {
                if (wRecordID <= 0)
                    return wResult;



                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT p.* ,t2.DataType,t2.DataClass, t1.AssetNo,t1.ID as DeviceID,t1.Code as DeviceNo," +
                    "  t2.Name as ParameterName,t2.Code as ParameterCode,"
                        + " t2.ParameterDesc,t2.ID AS  ParameterID ,t2.AnalysisOrder FROM {0}.dms_device_recorditem p "
                        + " inner join {0}.dms_device_processrecord t on p.RecordID = t.ID  "
                        + " inner join {0}.dms_device_ledger t1 on t.AssetNo = t1.AssetNo  "
                        + " inner join {0}.dms_device_parameter t2 on t2.Code = p.ParameterNo and t2.DeviceID = t1.ID "
                        + " where t.ID=@wRecordID  ;", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wRecordID", wRecordID);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSProcessRecordItem wProcessRecordItem = new DMSProcessRecordItem();

                    wProcessRecordItem.ID = StringUtils.parseLong(wReader["ID"]);
                    wProcessRecordItem.RecordID = StringUtils.parseInt(wReader["RecordID"]);
                    wProcessRecordItem.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wProcessRecordItem.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wProcessRecordItem.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wProcessRecordItem.ParameterID = StringUtils.parseInt(wReader["ParameterID"]);
                    wProcessRecordItem.ParameterNo = StringUtils.parseString(wReader["ParameterCode"]);
                    wProcessRecordItem.ParameterName = StringUtils.parseString(wReader["ParameterName"]);
                    wProcessRecordItem.ParameterDesc = StringUtils.parseString(wReader["ParameterDesc"]);
                    wProcessRecordItem.ParameterValue = StringUtils.parseString(wReader["ParameterValue"]);
                    wProcessRecordItem.DataType = StringUtils.parseInt(wReader["DataType"]);
                    wProcessRecordItem.DataClass = StringUtils.parseInt(wReader["DataClass"]);
                    wProcessRecordItem.AnalysisOrder = StringUtils.parseInt(wReader["AnalysisOrder"]);
                    wProcessRecordItem.SampleTime = StringUtils.parseDate(wReader["SampleTime"]);

                    wResult.Add(wProcessRecordItem);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        private void DMS_SetProcessRecordItemList(BMSEmployee wLoginUser, List<DMSProcessRecord> wRecordList, OutResult<Int32> wErrorCode)
        {
            if (wRecordList == null || wRecordList.Count <= 0)
                return;
            List<int> wRecordIDList = wRecordList.Select(p => p.ID).ToList();

            Dictionary<int, List<DMSProcessRecordItem>> wDic = this.DMS_SelectProcessRecordItemList(wLoginUser, wRecordIDList, wErrorCode);

            foreach (DMSProcessRecord wDMSProcessRecord in wRecordList)
            {
                if (wDic.ContainsKey(wDMSProcessRecord.ID))
                    wDMSProcessRecord.ItemList = wDic[wDMSProcessRecord.ID];
                if (wDMSProcessRecord.ItemList == null)
                    wDMSProcessRecord.ItemList = new List<DMSProcessRecordItem>();

                wDMSProcessRecord.ItemList.Sort((o1, o2) =>
                (o1.AnalysisOrder <= 0 ? Int32.MaxValue : o1.AnalysisOrder)
                - (o2.AnalysisOrder <= 0 ? Int32.MaxValue : o2.AnalysisOrder));
            }
        }




        private void DMS_SetProcessRecordParams(BMSEmployee wLoginUser, List<DMSProcessRecord> wRecordList, DMSDataClass wDataClass, OutResult<Int32> wErrorCode)
        {

            List<String> wTableNames = SelectTableNames(iPlant.Data.EF.MESDBSource.DMS.getDBName(), wDataClass.GetMysqlTablePrefixString());

            foreach (String wTableName in wTableNames)
            {
                switch (wDataClass)
                {
                    case DMSDataClass.Default:
                        break;
                    case DMSDataClass.Status:
                        break;
                    case DMSDataClass.Alarm:
                        break;
                    case DMSDataClass.Params:
                        this.DMS_SetProcessRecordTechParams(wLoginUser, wRecordList, wTableName, wErrorCode);
                        break;
                    case DMSDataClass.WorkParams:
                        this.DMS_SetProcessRecordProductParams(wLoginUser, wRecordList, wTableName, wErrorCode);
                        break;
                    case DMSDataClass.PowerParams:
                        break;
                    case DMSDataClass.QualityParams:
                        this.DMS_SetProcessRecordCheckParams(wLoginUser, wRecordList, wTableName, wErrorCode);
                        break;
                    case DMSDataClass.ControlData:
                        break;
                    case DMSDataClass.TechnologyData:
                        this.DMS_SetProcessRecordTechParams(wLoginUser, wRecordList, wTableName, wErrorCode);
                        break;
                    case DMSDataClass.PositionData:
                        break;
                    default:
                        break;
                }
            } 

        }

        private void DMS_SetProcessRecordParamsOld(BMSEmployee wLoginUser, List<DMSProcessRecord> wRecordList, DMSDataClass wDataClass, String wDeviceCode,int wRecordType, OutResult<Int32> wErrorCode)
        {
            String wTableNameRecord = "";
            String wTableName = wDataClass.GetMysqlTablePrefixString() + "_" + wDeviceCode;
            if(wRecordType==1)
                 wTableNameRecord = wDataClass.GetMysqlTablePrefixString() + "_" + wDeviceCode;
            else if(wRecordType == 5||wRecordType==6)
                 wTableNameRecord = "dms_device_toolparams" + "_" + wDeviceCode;
            switch (wDataClass)
            {
                case DMSDataClass.Default:
                    break;
                case DMSDataClass.Status:
                    break;
                case DMSDataClass.Alarm:
                    break;
                case DMSDataClass.Params:
                    this.DMS_SetProcessRecordTechParams(wLoginUser, wRecordList, wTableName,  wErrorCode);
                    break;
                case DMSDataClass.WorkParams:
                    if (wRecordType == 6)
                        break;
                    this.DMS_SetProcessRecordProductParams(wLoginUser, wRecordList, wTableNameRecord, wErrorCode);
                    break;
                case DMSDataClass.PowerParams:
                    break;
                case DMSDataClass.QualityParams:
                    this.DMS_SetProcessRecordCheckParams(wLoginUser, wRecordList, wTableNameRecord, wErrorCode);
                    break;
                case DMSDataClass.ControlData:
                    break;
                case DMSDataClass.TechnologyData:
                    this.DMS_SetProcessRecordTechParams(wLoginUser, wRecordList, wTableName, wErrorCode);
                    break;
                case DMSDataClass.PositionData:
                    break;
                default:
                    break;
            }

        }


        private void DMS_SetProcessRecordCheckParams(BMSEmployee wLoginUser, List<DMSProcessRecord> wRecordList,String wTableName, OutResult<Int32> wErrorCode)
        {
            try
            {
                if (wRecordList == null || wRecordList.Count <= 0)
                    return;
                Dictionary<int, List<DMSProcessRecord>> wRecordIDList = wRecordList.GroupBy(p => p.ID).ToDictionary(p => p.Key, p => p.ToList());


                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();

                List<Dictionary<String, Object>> wQueryTableResult = mDBPool.queryForList(
                    StringUtils.Format("SELECT * FROM information_schema.TABLES where table_name='{1}' and TABLE_SCHEMA ='{0}';", wInstance, wTableName), null);
                if (wQueryTableResult.Count <= 0)
                    return;

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(
                    StringUtils.Format("select * From {0}.{1} where RecordID IN ({2})", wInstance, wTableName, StringUtils.Join(",", wRecordIDList.Keys)), null);

                int wRecordID = 0;
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    if (!wReader.ContainsKey("RecordID"))
                        continue;
                    wRecordID = StringUtils.parseInt(wReader["RecordID"]);
                    if (!wRecordIDList.ContainsKey(wRecordID))
                        continue;

                    wReader.Remove("RecordID");
                    if (!wReader.ContainsKey("ID"))
                        wReader.Remove("ID");
                    wRecordIDList[wRecordID].ForEach(p => p.CheckParams.AddRange(wReader));

                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }
        private void DMS_SetProcessRecordProductParams(BMSEmployee wLoginUser, List<DMSProcessRecord> wRecordList, String wTableName, OutResult<Int32> wErrorCode)
        {
            try
            {
                if (wRecordList == null || wRecordList.Count <= 0)
                    return;
                Dictionary<int, List<DMSProcessRecord>> wRecordIDList = wRecordList.GroupBy(p => p.ID).ToDictionary(p => p.Key, p => p.ToList());


                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                List<Dictionary<String, Object>> wQueryTableResult = mDBPool.queryForList(
                     StringUtils.Format("SELECT * FROM information_schema.TABLES where table_name='{1}' and TABLE_SCHEMA ='{0}';", wInstance, wTableName), null);
                if (wQueryTableResult.Count <= 0)
                    return;

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(StringUtils.Format("select * From {0}.{1} where RecordID IN ({2})", wInstance, wTableName,StringUtils.Join(",", wRecordIDList.Keys)), null);

                int wRecordID = 0;
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    if (!wReader.ContainsKey("RecordID"))
                        continue;
                    wRecordID = StringUtils.parseInt(wReader["RecordID"]);
                    if (!wRecordIDList.ContainsKey(wRecordID))
                        continue;

                    wReader.Remove("RecordID");
                    if (!wReader.ContainsKey("ID"))
                        wReader.Remove("ID");
                    wRecordIDList[wRecordID].ForEach(p => p.ProductParams.AddRange(wReader));

                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        //private void DMS_SetProcessRecordTechParams(BMSEmployee wLoginUser, List<DMSProcessRecord> wRecordList, OutResult<Int32> wErrorCode)
        //{
        //    try
        //    {
        //        if (wRecordList == null || wRecordList.Count <= 0)
        //            return;
        //        Dictionary<int, List<DMSProcessRecord>> wRecordIDList = wRecordList.GroupBy(p => p.TechnologyID).ToDictionary(p => p.Key, p => p.ToList());


        //        String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();

        //        List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(StringUtils.Format("select * From {0}.dms_technology where RecordID IN ({1})", wInstance, StringUtils.Join(",", wRecordIDList.Keys)), null);

        //        int wRecordID = 0;
        //        foreach (Dictionary<String, Object> wReader in wQueryResult)
        //        {
        //            if (!wReader.ContainsKey("ID"))
        //                continue;
        //            wRecordID = StringUtils.parseInt(wReader["ID"]);
        //            if (!wRecordIDList.ContainsKey(wRecordID))
        //                continue;

        //            wReader.Remove("RecordID");
        //            if (!wReader.ContainsKey("ID"))
        //                wReader.Remove("ID");
        //            wRecordIDList[wRecordID].ForEach(p => p.ProductParams = wReader);

        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        wErrorCode.set(MESException.DBSQL.Value);
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //}
        private void DMS_SetProcessRecordTechParams(BMSEmployee wLoginUser, List<DMSProcessRecord> wRecordList, String wTableName, OutResult<Int32> wErrorCode)
        {
            try
            {
                if (wRecordList == null || wRecordList.Count <= 0)
                    return;
                Dictionary<int, List<DMSProcessRecord>> wRecordIDList = wRecordList.GroupBy(p => p.TechnologyID).ToDictionary(p => p.Key, p => p.ToList());


                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                List<Dictionary<String, Object>> wQueryTableResult = mDBPool.queryForList(
                       StringUtils.Format("SELECT * FROM information_schema.TABLES where table_name='{1}' and TABLE_SCHEMA ='{0}';", wInstance, wTableName), null);
                if (wQueryTableResult.Count <= 0)
                    return;
                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(StringUtils.Format("select * From {0}.{1} where ID IN ({2})", wInstance, wTableName, StringUtils.Join(",", wRecordIDList.Keys)), null);

                int wRecordID = 0;
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    if (!wReader.ContainsKey("ID"))
                        continue;
                    wRecordID = StringUtils.parseInt(wReader["ID"]);
                    if (!wRecordIDList.ContainsKey(wRecordID))
                        continue;


                    wReader.Remove("ID");
                    wRecordIDList[wRecordID].ForEach(p => p.TechnologyParams.AddRange(wReader));

                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }



        private Dictionary<int, List<DMSProcessRecordItem>> DMS_SelectProcessRecordItemList(BMSEmployee wLoginUser, List<int> wRecordIDList, OutResult<Int32> wErrorCode)
        {

            Dictionary<int, List<DMSProcessRecordItem>> wResult = new Dictionary<int, List<DMSProcessRecordItem>>();
            try
            {
                if (wRecordIDList == null)
                    return wResult;

                wRecordIDList.RemoveAll(p => p <= 0);

                if (wRecordIDList.Count <= 0)
                    return wResult;

                wRecordIDList = wRecordIDList.Distinct().ToList();

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT P.* ,t2.DataType,t2.DataClass, t1.AssetNo,t1.ID as DeviceID,t1.Code as DeviceNo ,t2.Name as ParameterName,"
                        + " t2.ParameterDesc,t2.ID  AS  ParameterID ,t2.AnalysisOrder FROM {0}.dms_device_recorditem p "
                        + " inner join {0}.dms_device_processrecord t on p.RecordID = t.ID  "
                        + " inner join {0}.dms_device_ledger t1 on t.AssetNo = t1.AssetNo  "
                        + " inner join {0}.dms_device_parameter t2 on t2.Code = p.ParameterNo and t2.DeviceID = t1.ID "
                        + " where t.ID in ({1})  ;", wInstance, StringUtils.Join(",", wRecordIDList));
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();


                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSProcessRecordItem wProcessRecordItem = new DMSProcessRecordItem();

                    wProcessRecordItem.ID = StringUtils.parseLong(wReader["ID"]);
                    wProcessRecordItem.RecordID = StringUtils.parseInt(wReader["RecordID"]);
                    wProcessRecordItem.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wProcessRecordItem.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wProcessRecordItem.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wProcessRecordItem.ParameterID = StringUtils.parseInt(wReader["ParameterID"]);
                    wProcessRecordItem.ParameterNo = StringUtils.parseString(wReader["ParameterNo"]);
                    wProcessRecordItem.ParameterName = StringUtils.parseString(wReader["ParameterName"]);
                    wProcessRecordItem.ParameterDesc = StringUtils.parseString(wReader["ParameterDesc"]);
                    wProcessRecordItem.ParameterValue = StringUtils.parseString(wReader["ParameterValue"]);
                    wProcessRecordItem.DataType = StringUtils.parseInt(wReader["DataType"]);
                    wProcessRecordItem.DataClass = StringUtils.parseInt(wReader["DataClass"]);
                    wProcessRecordItem.AnalysisOrder = StringUtils.parseInt(wReader["AnalysisOrder"]);
                    wProcessRecordItem.SampleTime = StringUtils.parseDate(wReader["SampleTime"]);

                    if (!wResult.ContainsKey(wProcessRecordItem.RecordID))
                        wResult.Add(wProcessRecordItem.RecordID, new List<DMSProcessRecordItem>());
                    wResult[wProcessRecordItem.RecordID].Add(wProcessRecordItem);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public List<DMSProcessRecordItem> DMS_SelectProcessRecordItemList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, int wRecordID,
            int wParameterID, String wParameterNo, int wActive, int wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {

            List<DMSProcessRecordItem> wResult = new List<DMSProcessRecordItem>();
            try
            {
                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if (wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if (wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return wResult;
                }

                if (wDeviceID <= 0 || StringUtils.isEmpty(wDeviceNo))
                {
                    return wResult;
                }


                if (wParameterNo == null)
                    wParameterNo = "";
                if (wDeviceNo == null)
                    wDeviceNo = "";


                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT p.* ,t2.DataType,t2.DataClass,t1.AssetNo, t1.ID as DeviceID ,t1.Code as DeviceNo ,t2.Name as ParameterName,"
                        + " t2.ParameterDesc,t2.ID as  ParameterID ,t2.AnalysisOrder  FROM {0}.dms_device_recorditem p "
                        + " inner join {0}.dms_device_processrecord t on p.RecordID = t.ID  "
                        + " inner join {0}.dms_device_ledger t1 on t.AssetNo = t1.AssetNo  "
                        + " inner join {0}.dms_device_parameter t2 on t2.Code = p.ParameterNo and t2.DeviceID = t1.ID "
                        + " where 1=1 "
                        + " and ( @wRecordID <= 0 or t.ID  = @wRecordID)  "
                        + " and ( @wDeviceID <= 0 or t1.ID  = @wDeviceID)  "
                        + " and ( @wDeviceNo =''  or t1.Code  = @wDeviceNo) "
                        + " and ( @wParameterID <= 0 or t2.ID  = @wParameterID)  "
                        + " and ( @wParameterNo =''  or p.ParameterNo  = @wParameterNo) "
                        + " and ( @wStatus <= 0 or t.Status  = @wStatus)"
                        + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wStartTime <= t.EndTime) "
                        + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= t.StartTime)  "
                        + " and ( @wActive < 0 or t.Active  = @wActive) ", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wRecordID", wRecordID);
                wParamMap.Add("wDeviceID", wDeviceID);
                wParamMap.Add("wDeviceNo", wDeviceNo);
                wParamMap.Add("wParameterID", wParameterID);
                wParamMap.Add("wParameterNo", wParameterNo);
                wParamMap.Add("wStatus", wStatus);
                wParamMap.Add("wActive", wActive);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSProcessRecordItem wProcessRecordItem = new DMSProcessRecordItem();

                    wProcessRecordItem.ID = StringUtils.parseLong(wReader["ID"]);
                    wProcessRecordItem.RecordID = StringUtils.parseInt(wReader["RecordID"]);
                    wProcessRecordItem.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wProcessRecordItem.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wProcessRecordItem.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wProcessRecordItem.ParameterID = StringUtils.parseInt(wReader["ParameterID"]);
                    wProcessRecordItem.ParameterNo = StringUtils.parseString(wReader["ParameterNo"]);
                    wProcessRecordItem.ParameterName = StringUtils.parseString(wReader["ParameterName"]);
                    wProcessRecordItem.ParameterDesc = StringUtils.parseString(wReader["ParameterDesc"]);
                    wProcessRecordItem.ParameterValue = StringUtils.parseString(wReader["ParameterValue"]);
                    wProcessRecordItem.DataType = StringUtils.parseInt(wReader["DataType"]);
                    wProcessRecordItem.DataClass = StringUtils.parseInt(wReader["DataClass"]);
                    wProcessRecordItem.AnalysisOrder = StringUtils.parseInt(wReader["AnalysisOrder"]);
                    wProcessRecordItem.SampleTime = StringUtils.parseDate(wReader["SampleTime"]);

                    wResult.Add(wProcessRecordItem);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



        /// <summary>
        /// 某时间段内，设备过程数据没有订单的记录自动绑定此订单信息
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wAssetNo"></param>
        /// <param name="wOrderNo"></param>
        /// <param name="wStartTime"></param>
        /// <param name="wEndTime"></param>
        public void DMS_UpdateProcessRecordOrder(BMSEmployee wLoginUser, String wAssetNo, int wOrderID, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            try
            {
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();


                String wSQL = StringUtils.Format("update {0}.dms_device_processrecord set OrderID=@wOrderID " +
                  " where ID>0 AND AssetNo=@wAssetNo AND OrderNo=''  AND StartTime>= @wStartTime   AND   EndTime <= @wEndTime ; ",
                wInstance);

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wAssetNo", wAssetNo);
                wParamMap.Add("wOrderID", wOrderID);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                mDBPool.update(wSQL, wParamMap);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }


        /// <summary>
        /// 插入过程记录   
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wDMSProcessRecord"></param>
        /// <param name="wErrorCode"></param>
        public void DMS_InsertProcessRecord(BMSEmployee wLoginUser, DMSProcessRecord wDMSProcessRecord, OutResult<Int32> wErrorCode)
        {

            try
            {
                if (wDMSProcessRecord == null || StringUtils.isEmpty(wDMSProcessRecord.AssetNo))
                    return;
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();


                if (wDMSProcessRecord.Status == 0)
                    wDMSProcessRecord.Status = 1;

                String wSQL = StringUtils.Format("update {0}.dms_device_processrecord set Active=0,EditTime=now() " +
                    " where AssetNo=@wAssetNo  AND WorkpieceNo = @wWorkpieceNo AND Active = 1  ; ",
                  wInstance);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();




                wParamMap.Add("wAssetNo", wDMSProcessRecord.AssetNo);
               // wParamMap.Add("wOrderNo", wDMSProcessRecord.OrderNo);
                wParamMap.Add("wOrderID", wDMSProcessRecord.OrderID);
                wParamMap.Add("wMetroNo", wDMSProcessRecord.MetroNo);
                wParamMap.Add("wWorkpieceNo", wDMSProcessRecord.WorkpieceNo);
                wParamMap.Add("wStartTime", wDMSProcessRecord.StartTime);
                wParamMap.Add("wEndTime", wDMSProcessRecord.EndTime);
                wParamMap.Add("wStatus", wDMSProcessRecord.Status);
                wParamMap.Add("wRemark", wDMSProcessRecord.Remark);
                wParamMap.Add("wRecordType", wDMSProcessRecord.RecordType);

                int wRowChange = mDBPool.update(wSQL, wParamMap);

                wSQL = StringUtils.Format("Insert into {0}.dms_device_processrecord (AssetNo,OrderID,MetroNo,WorkpieceNo,StartTime,EndTime,Active,Status,Remark,EditTime,RecordType) values " +
                   " (@wAssetNo,@wOrderID,@wMetroNo,@wWorkpieceNo,@wStartTime,@wEndTime,1,@wStatus,@wRemark,now(),@wRecordType) ; ",
                 wInstance);


                DMSDeviceLedger wDMSDeviceLedger = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedger(wLoginUser, 0, "", wDMSProcessRecord.AssetNo, wErrorCode);
                if (wErrorCode.Result != 0)
                    return;
                if (wDMSDeviceLedger == null || wDMSDeviceLedger.ID < 0)
                {
                    wErrorCode.Result = MESException.Parameter.Value;
                    return;
                }
                //将工件状态改为使用，若工件状态为0才能更改
                QMSWorkpieceDAO.getInstance().QMS_UpdateWorkpieceStatus(wLoginUser, wDMSProcessRecord.WorkpieceNo, wDMSProcessRecord.OrderNo, ((int)OMSWorkpieceStatus.Start), wDMSProcessRecord.Remark, wErrorCode);

                if (wDMSDeviceLedger.ModelName.IndexOf("检测") < 0)
                {

                    //判断是否返修
                    if (wRowChange > 0)
                    {
                        wDMSProcessRecord.RecordType = ((int)DMSRecordTypes.Repair);
                        wParamMap["wRecordType"] = wDMSProcessRecord.RecordType;
                        //获取最后一次抽检结果
                        //修改Type 与Remark
                        DMSProcessRecord wLastSpotCheckRecord = this.DMS_SelectLastRecord(wLoginUser, wDMSProcessRecord.WorkpieceNo, ((int)DMSRecordTypes.SpotCheck), wErrorCode);
                        wDMSProcessRecord.Remark += wLastSpotCheckRecord.Remark;
                        wParamMap["wRemark"] = wDMSProcessRecord.Remark;

                    }

                }
                else
                {

                    wDMSProcessRecord.RecordType = ((int)DMSRecordTypes.Check);


                    if (wDMSDeviceLedger.ModelName.Contains("三坐标"))
                    {
                        //更新工件状态
                        QMSWorkpieceDAO.getInstance().QMS_UpdateWorkpieceResult(wLoginUser, wDMSProcessRecord.WorkpieceNo, "ThreeDimensionalResult", wDMSProcessRecord.Status, 1, wErrorCode);
                    }
                    else if (wDMSDeviceLedger.ModelName.Contains("抽检"))
                    {
                        wDMSProcessRecord.RecordType = ((int)DMSRecordTypes.SpotCheck);

                        //更新工件状态
                        QMSWorkpieceDAO.getInstance().QMS_UpdateWorkpieceResult(wLoginUser, wDMSProcessRecord.WorkpieceNo, "SpotCheckResult", wDMSProcessRecord.Status, 1, wErrorCode);
                    }
                    else
                    {
                        //更新工件状态
                        QMSWorkpieceDAO.getInstance().QMS_UpdateWorkpieceResult(wLoginUser, wDMSProcessRecord.WorkpieceNo, "CheckResult", wDMSProcessRecord.Status, 1, wErrorCode);
                    }
                    wParamMap["wRecordType"] = wDMSProcessRecord.RecordType;

                }


                wDMSProcessRecord.ID = ((int)mDBPool.insert(wSQL, wParamMap));

                if (wDMSProcessRecord.ID <= 0)
                {
                    wErrorCode.Result = MESException.Exception.Value;
                    return;
                }
                if (wDMSProcessRecord.ItemList != null && wDMSProcessRecord.ItemList.Count > 0)
                {
                    this.DMS_InsertProcessRecordItemList(wLoginUser, wDMSProcessRecord.ItemList, wDMSProcessRecord.ID, wErrorCode);
                    if (wErrorCode.Result != 0)
                        return;

                    QMSWorkpiece wQMSWorkpiece = QMSWorkpieceDAO.getInstance().QMS_SelectWorkpiece(wLoginUser, -1, wDMSProcessRecord.WorkpieceNo, wErrorCode);
                    if (wErrorCode.Result != 0)
                        return;

                    List<QMSCheckResult> wQMSCheckResultList = new List<QMSCheckResult>();
                    foreach (DMSProcessRecordItem item in wDMSProcessRecord.ItemList)
                    {
                        if (item == null || item.DataClass != ((int)DMSDataClass.QualityParams))
                            continue;
                        wQMSCheckResultList.Add(new QMSCheckResult(item, wQMSWorkpiece.ID));
                    }
                    //修改工件检测信息
                    QMSCheckResultDAO.getInstance().QMS_UpdateCheckResult(wLoginUser, wQMSCheckResultList, wErrorCode);


                }
                if (wDMSProcessRecord.RecordType == ((int)DMSRecordTypes.Repair))
                {
                    QMSWorkpieceDAO.getInstance().QMS_UpdateWorkpieceRepairCount(wLoginUser, wDMSProcessRecord.WorkpieceNo, wErrorCode);
                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        /// <summary>
        /// 获取记录类型对应的最后一次结果
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wWorkpieceNo"></param>
        /// <param name="wErrorCode"></param>
        /// <returns></returns>
        public DMSProcessRecord DMS_SelectLastRecord(BMSEmployee wLoginUser, String wWorkpieceNo, int wRecordType, OutResult<Int32> wErrorCode)
        {

            DMSProcessRecord wResult = new DMSProcessRecord();
            try
            {
                if (StringUtils.isEmpty(wWorkpieceNo))
                    return wResult;

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.*,o.OrderNo,t1.ID as DeviceID," +
                    " t1.Name as DeviceName,t1.Code as DeviceNo,o.WorkPartPointCode," +
                    "  p1.Name as WorkPartPointName  FROM {0}.dms_device_processrecord t" +
                            " inner join {0}.oms_order o on t.OrderID = o.ID" +
                            " inner join {0}.dms_device_ledger t1 on t.AssetNo = t1.AssetNo" +
                            " left join {0}.fpc_partpoint p1 on o.WorkPartPointCode=p1.Code " +
                            " where t.WorkpieceNo=@wWorkpieceNo and (@wRecordType<=0 or t.RecordType=@wRecordType) order by ID desc limit 1;", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wWorkpieceNo", wWorkpieceNo);
                wParamMap.Add("wRecordType", wRecordType);
                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wResult.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wResult.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wResult.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wResult.OrderID = StringUtils.parseInt(wReader["OrderID"]);
                    wResult.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wResult.MetroNo = StringUtils.parseString(wReader["MetroNo"]);
                    wResult.WorkpieceNo = StringUtils.parseString(wReader["WorkpieceNo"]);
                    wResult.MetroNo = StringUtils.parseString(wReader["MetroNo"]);
                    wResult.StartTime = StringUtils.parseDate(wReader["StartTime"]);
                    wResult.EndTime = StringUtils.parseDate(wReader["EndTime"]);
                    wResult.Active = StringUtils.parseInt(wReader["Active"]);
                    wResult.Status = StringUtils.parseInt(wReader["Status"]);
                    wResult.Remark = StringUtils.parseString(wReader["Remark"]);
                    wResult.WorkPartPointCode = StringUtils.parseString(wReader["WorkPartPointCode"]);
                    wResult.WorkPartPointName = StringUtils.parseString(wReader["WorkPartPointName"]);


                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public void DMS_InsertProcessRecordItemList(BMSEmployee wLoginUser, List<DMSProcessRecordItem> wDMSProcessRecordItemList, int wRecordID, OutResult<Int32> wErrorCode)
        {
            try
            {
                if (wRecordID <= 0 || wDMSProcessRecordItemList == null || wDMSProcessRecordItemList.Count <= 0)
                {
                    return;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                List<String> wValueStringList = new List<string>();

                String wValueTemp = "({0},'{1}','{2}','{3}')";

                foreach (DMSProcessRecordItem wDMSProcessRecordItem in wDMSProcessRecordItemList)
                {
                    if (wDMSProcessRecordItem == null || StringUtils.isEmpty(wDMSProcessRecordItem.ParameterNo))
                        continue;


                    if (wDMSProcessRecordItem.SampleTime.Year <= 2010)
                        wDMSProcessRecordItem.SampleTime = DateTime.Now;

                    if (wDMSProcessRecordItem.ParameterValue == null)
                        wDMSProcessRecordItem.ParameterValue = "";

                    wValueStringList.Add(StringUtils.Format(wValueTemp, wRecordID, wDMSProcessRecordItem.ParameterNo,
                        wDMSProcessRecordItem.ParameterValue, wDMSProcessRecordItem.SampleTime.ToString("yyyy-MM-dd HH:mm:ss")));
                }


                String wSQL = StringUtils.Format("insert into {0}.dms_device_recorditem (RecordID,ParameterNo,ParameterValue,SampleTime) Values ", wInstance)
                    + StringUtils.Join(",", wValueStringList);


                mDBPool.update(wSQL, new Dictionary<string, object>());

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }
    }
}
