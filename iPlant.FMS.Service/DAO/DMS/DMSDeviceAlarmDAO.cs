using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iPlant.Data.EF;

namespace iPlant.FMC.Service
{
    class DMSDeviceAlarmDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSDeviceAlarmDAO));

        private static DMSDeviceAlarmDAO Instance;

        private DMSDeviceAlarmDAO() : base()
        {

        }

        public static DMSDeviceAlarmDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSDeviceAlarmDAO();
            return Instance;
        }

        private List<DMSDeviceAlarm> DMS_SelectDeviceAlarmList(BMSEmployee wLoginUser, List<Int32> wDeviceIDList, String wDeviceNo, String wDeviceName,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID,int wPositionID, int wTeamID,
               int wEventType, DateTime wStartTime, DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceAlarm> wResult = new List<DMSDeviceAlarm>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                if (wDeviceIDList == null)
                    wDeviceIDList = new List<Int32>();
                wDeviceIDList.RemoveAll(p => p <= 0);
                if (wDeviceNo == null)
                    wDeviceNo = "";


                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if (wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if (wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return wResult;
                }
                wPagination.Sort = "UpdateDate";
                String wSQL = StringUtils.Format(
                    "SELECT p.*,t.ID AS DeviceIDL, t.Code as DeviceNo,t.Name as DeviceName,t.ModelID,t.AssetNo," +
                        " t.WorkShopID,t.FactoryID,t.LineID,t.AreaID,t.ImageIcon,p1.Name as AlarmName," +
                        " p1.VariableName as AlarmVariableName,p1.ParameterDesc as AlarmDesc," +
                        " t1.Code as  ModelNo,t1.Name as ModelName,t1.DeviceType, t2.Name as DeviceTypeName," +
                        "  t2.Code as DeviceTypeCode,t3.Name as WorkShopName,t3.Code as WorkShopCode,t7.Code as AreaNo," +
                        " t7.Name as PositionText,t9.Name as FactoryName,t9.Code as FactoryCode,    "
                                + " t4.Name as LineName,t4.Code as LineCode,p1.PositionID,t12.Name as PositionName "
                                + " FROM {0}.dms_device_hisalarmnew p"
                                + " inner join {0}.dms_device_ledger t on t.AssetNo=p.DeviceID "
                                + " inner join {0}.dms_device_parameter p1 on p1.Code=p.FaultID "
                                + " inner join {0}.dms_device_model t1 on t.ModelID=t1.ID "
                                + " left join {0}.dms_device_type t2 on t1.DeviceType=t2.ID "
                                + " left join {0}.bms_region t7 on t.AreaID=t7.ID "
                                + " left join {0}.fmc_workshop t3 on t.WorkShopID=t3.ID "
                                + " left join {0}.fmc_factory t9 on t.FactoryID=t9.ID "
                                + " left join {0}.dms_position t12 on p1.PositionID=t12.ID "
                                + " left join {0}.fmc_line t4 on t.LineID=t4.ID  WHERE  1=1  "
                                + " and ( @wID ='' or t.ID IN( {1} ) )  "
                        + " and ( @wCode ='' or t.Code  = @wCode)  "
                        + " and ( @wName ='' or t.Name   = @wName )  "
                        + " and ( @wAssetNo ='' or t.AssetNo   = @wAssetNo )  "
                        + " and ( @wDeviceType <= 0 or t1.DeviceType  = @wDeviceType)   "
                        + " and ( @wModelID <= 0 or t.ModelID  = @wModelID)   "
                        + " and ( @wEventType <= 0 or p.EventType  = @wEventType)   "
                        + " and ( @wAreaID <= 0 or t.AreaID  = @wAreaID)  "
                        + " and ( @wPositionID <= 0 or p1.PositionID  = @wPositionID)  "
                        + " and ( @wTeamID <= 0 or t.TeamID  = @wTeamID)   "
                        + " and ( @wFactoryID <= 0 or t.FactoryID  = @wFactoryID)  "
                        + " and ( @wWorkShopID <= 0 or t.WorkShopID  = @wWorkShopID)  "
                        + " and ( @wLineID <= 0 or t.LineID  = @wLineID)    "
                        + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wStartTime <= p.UpdateDate) "
                        + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= p.OccurTime)  "
                        , wInstance, wDeviceIDList.Count > 0 ? StringUtils.Join(",", wDeviceIDList) : "0");

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wID", StringUtils.Join(",", wDeviceIDList));
                wParamMap.Add("wName", wDeviceName);
                wParamMap.Add("wCode", wDeviceNo);
                wParamMap.Add("wAssetNo", wAssetNo);
                wParamMap.Add("wDeviceType", wDeviceType);
                wParamMap.Add("wModelID", wModelID);
                wParamMap.Add("wTeamID", wTeamID);
                wParamMap.Add("wFactoryID", wFactoryID);
                wParamMap.Add("wWorkShopID", wWorkShopID);
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wAreaID", wAreaID);
                wParamMap.Add("wPositionID", wPositionID);
                wParamMap.Add("wEventType", wEventType);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);


                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }

                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSDeviceAlarm wDeviceAlarm = new DMSDeviceAlarm();

                    wDeviceAlarm.ID = StringUtils.parseInt(wReader.ContainsKey("ID") ? wReader["ID"] : "");
                    wDeviceAlarm.DeviceID = StringUtils.parseInt(wReader["DeviceIDL"]);

                    wDeviceAlarm.PositionID = StringUtils.parseInt(wReader["PositionID"]);
                    wDeviceAlarm.PositionName = StringUtils.parseString(wReader["PositionName"]);
                    wDeviceAlarm.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wDeviceAlarm.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wDeviceAlarm.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wDeviceAlarm.ModelID = StringUtils.parseInt(wReader["ModelID"]);
                    wDeviceAlarm.ModelName = StringUtils.parseString(wReader["ModelName"]);
                    wDeviceAlarm.ModelNo = StringUtils.parseString(wReader["ModelNo"]);
                    wDeviceAlarm.DeviceType = StringUtils.parseInt(wReader["DeviceType"]);
                    wDeviceAlarm.DeviceTypeName = StringUtils.parseString(wReader["DeviceTypeName"]);
                    wDeviceAlarm.DeviceTypeCode = StringUtils.parseString(wReader["DeviceTypeCode"]);
                    wDeviceAlarm.WorkShopID = StringUtils.parseInt(wReader["WorkShopID"]);
                    wDeviceAlarm.WorkShopName = StringUtils.parseString(wReader["WorkShopName"]);
                    wDeviceAlarm.WorkShopCode = StringUtils.parseString(wReader["WorkShopCode"]);
                    wDeviceAlarm.FactoryID = StringUtils.parseInt(wReader["FactoryID"]);
                    wDeviceAlarm.FactoryName = StringUtils.parseString(wReader["FactoryName"]);
                    wDeviceAlarm.FactoryCode = StringUtils.parseString(wReader["FactoryCode"]);
                    wDeviceAlarm.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wDeviceAlarm.LineName = StringUtils.parseString(wReader["LineName"]);
                    wDeviceAlarm.LineCode = StringUtils.parseString(wReader["LineCode"]);
                    wDeviceAlarm.AreaID = StringUtils.parseInt(wReader["AreaID"]);
                    wDeviceAlarm.AreaNo = StringUtils.parseString(wReader["AreaNo"]);
                    wDeviceAlarm.PositionText = StringUtils.parseString(wReader["PositionText"]);
                    wDeviceAlarm.ImageIcon = StringUtils.parseString(wReader["ImageIcon"]);
                    wDeviceAlarm.AlarmCode = StringUtils.parseString(wReader["FaultID"]);
                    wDeviceAlarm.AlarmName = StringUtils.parseString(wReader["AlarmName"]);
                    wDeviceAlarm.AlarmVariableName = StringUtils.parseString(wReader["AlarmVariableName"]);
                    wDeviceAlarm.AlarmDesc = StringUtils.parseString(wReader["AlarmDesc"]);
                    wDeviceAlarm.StatusTime = StringUtils.parseDate(wReader["OccurTime"]);
                    wDeviceAlarm.StatusTimeEnd = StringUtils.parseDate(wReader["UpdateDate"]);
                    wDeviceAlarm.EventType = StringUtils.parseInt(wReader["EventType"]);
                    wResult.Add(wDeviceAlarm);
                }



            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



        public List<DMSDeviceAlarm> DMS_CurrentDeviceAlarmList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, String wAssetNo,
                int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wPositionID, int wTeamID,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceAlarm> wResult = new List<DMSDeviceAlarm>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;



                String wSQL = StringUtils.Format(
                        "SELECT p.*,t.ID AS DeviceIDL,t.Code as DeviceNo,t.Name as DeviceName,t.ModelID,t.AssetNo,t.WorkShopID," +
                        " t.FactoryID,t.LineID,t.AreaID,t.ImageIcon,p1.Name as AlarmName," +
                        " p1.VariableName as AlarmVariableName,p1. ParameterDesc as AlarmDesc," +
                        " t1.Code as  ModelNo,t1.Name as ModelName,t1.DeviceType, t2.Name as DeviceTypeName," +
                        "  t2.Code as DeviceTypeCode,t3.Name as WorkShopName,t3.Code as WorkShopCode,t7.Code as AreaNo," +
                        " t7.Name as PositionText,t9.Name as FactoryName,t9.Code as FactoryCode,    "
                                + " t4.Name as LineName,t4.Code as LineCode,p1.PositionID,t12.Name as PositionName  FROM {0}.dms_device_alarm p"
                                + " inner join {0}.dms_device_ledger t on t.AssetNo=p.DeviceID "
                                + " inner join {0}.dms_device_parameter p1 on p1.Code=p.FaultID "
                                + " inner join {0}.dms_device_model t1 on t.ModelID=t1.ID "
                                + " left join {0}.dms_device_type t2 on t1.DeviceType=t2.ID "
                                + " left join {0}.bms_region t7 on t.AreaID=t7.ID "
                                + " left join {0}.dms_position t12 on p1.PositionID=t12.ID "
                                + " left join {0}.fmc_workshop t3 on t.WorkShopID=t3.ID "
                                + " left join {0}.fmc_factory t9 on t.FactoryID=t9.ID "
                                + " left join {0}.fmc_line t4 on t.LineID=t4.ID  WHERE  1=1  "

                        + " and ( @wDeviceID <=0 or t.ID = @wDeviceID )  "
                        + " and ( @wDeviceNo ='' or t.Code = @wDeviceNo )  "
                        + " and ( @wAssetNo ='' or t.AssetNo   = @wAssetNo )  "
                        + " and ( @wDeviceType <= 0 or t1.DeviceType  = @wDeviceType)   "
                        + " and ( @wModelID <= 0 or t.ModelID  = @wModelID)   "
                        + " and ( @wAreaID <= 0 or t.AreaID  = @wAreaID)  "
                        + " and ( @wPositionID <= 0 or p1.PositionID  = @wPositionID)  "
                        + " and ( @wTeamID <= 0 or t.TeamID  = @wTeamID)   "
                        + " and ( @wFactoryID <= 0 or t.FactoryID  = @wFactoryID)  "
                        + " and ( @wWorkShopID <= 0 or t.WorkShopID  = @wWorkShopID)  "
                        + " and ( @wLineID <= 0 or t.LineID  = @wLineID)   "
                           , wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wDeviceNo", wDeviceNo);
                wParamMap.Add("wAssetNo", wAssetNo);
                wParamMap.Add("wDeviceID", wDeviceID);
                wParamMap.Add("wDeviceType", wDeviceType);
                wParamMap.Add("wModelID", wModelID);
                wParamMap.Add("wTeamID", wTeamID);
                wParamMap.Add("wFactoryID", wFactoryID);
                wParamMap.Add("wWorkShopID", wWorkShopID);
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wAreaID", wAreaID);
                wParamMap.Add("wPositionID", wPositionID);
                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }


                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSDeviceAlarm wDeviceAlarm = new DMSDeviceAlarm();
                    wDeviceAlarm.ID = StringUtils.parseInt(wReader.ContainsKey("ID") ? wReader["ID"] : "");
                    wDeviceAlarm.DeviceID = StringUtils.parseInt(wReader["DeviceIDL"]);
                    wDeviceAlarm.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wDeviceAlarm.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wDeviceAlarm.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wDeviceAlarm.ModelID = StringUtils.parseInt(wReader["ModelID"]);
                    wDeviceAlarm.ModelName = StringUtils.parseString(wReader["ModelName"]);
                    wDeviceAlarm.ModelNo = StringUtils.parseString(wReader["ModelNo"]);
                    wDeviceAlarm.DeviceType = StringUtils.parseInt(wReader["DeviceType"]);
                    wDeviceAlarm.DeviceTypeName = StringUtils.parseString(wReader["DeviceTypeName"]);
                    wDeviceAlarm.DeviceTypeCode = StringUtils.parseString(wReader["DeviceTypeCode"]);
                    wDeviceAlarm.WorkShopID = StringUtils.parseInt(wReader["WorkShopID"]);
                    wDeviceAlarm.WorkShopName = StringUtils.parseString(wReader["WorkShopName"]);
                    wDeviceAlarm.WorkShopCode = StringUtils.parseString(wReader["WorkShopCode"]);
                    wDeviceAlarm.FactoryID = StringUtils.parseInt(wReader["FactoryID"]);
                    wDeviceAlarm.FactoryName = StringUtils.parseString(wReader["FactoryName"]);
                    wDeviceAlarm.FactoryCode = StringUtils.parseString(wReader["FactoryCode"]);
                    wDeviceAlarm.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wDeviceAlarm.LineName = StringUtils.parseString(wReader["LineName"]);
                    wDeviceAlarm.LineCode = StringUtils.parseString(wReader["LineCode"]);
                    wDeviceAlarm.AreaID = StringUtils.parseInt(wReader["AreaID"]);
                    wDeviceAlarm.AreaNo = StringUtils.parseString(wReader["AreaNo"]);
                    wDeviceAlarm.PositionID = StringUtils.parseInt(wReader["PositionID"]);
                    wDeviceAlarm.PositionName = StringUtils.parseString(wReader["PositionName"]);
                    wDeviceAlarm.PositionText = StringUtils.parseString(wReader["PositionText"]);
                    wDeviceAlarm.ImageIcon = StringUtils.parseString(wReader["ImageIcon"]);
                    wDeviceAlarm.AlarmCode = StringUtils.parseString(wReader["FaultID"]);
                    wDeviceAlarm.AlarmName = StringUtils.parseString(wReader["AlarmName"]);
                    wDeviceAlarm.AlarmVariableName = StringUtils.parseString(wReader["AlarmVariableName"]);
                    wDeviceAlarm.AlarmDesc = StringUtils.parseString(wReader["AlarmDesc"]);
                    wDeviceAlarm.StatusTime = StringUtils.parseDate(wReader["OccurTime"]);
                    wDeviceAlarm.StatusTimeEnd = StringUtils.parseDate(wReader["UpdateDate"]);
                    wResult.Add(wDeviceAlarm);
                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public List<DMSDeviceAlarm> DMS_CurrentDeviceAlarmList(BMSEmployee wLoginUser, List<int> wDeviceIDList, List<String> wAssetNoList,
           OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceAlarm> wResult = new List<DMSDeviceAlarm>();
            try
            {

                if (wDeviceIDList == null)
                    wDeviceIDList = new List<int>();

                wDeviceIDList.RemoveAll(p => p <= 0);

                if (wAssetNoList == null)
                    wAssetNoList = new List<String>();

                wAssetNoList.RemoveAll(p => String.IsNullOrWhiteSpace(p));

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;



                String wSQL = StringUtils.Format(
                        "SELECT p.*,t.ID AS DeviceIDL,t.Code as DeviceNo,t.Name as DeviceName,t.ModelID,t.AssetNo,t.WorkShopID," +
                        " t.FactoryID,t.LineID,t.AreaID,t.ImageIcon,p1.Name as AlarmName," +
                        " p1.VariableName as AlarmVariableName,p1. ParameterDesc as AlarmDesc," +
                        " t1.Code as  ModelNo,t1.Name as ModelName,t1.DeviceType, t2.Name as DeviceTypeName," +
                        "  t2.Code as DeviceTypeCode,t3.Name as WorkShopName,t3.Code as WorkShopCode,t7.Code as AreaNo," +
                        " t7.Name as PositionText,t9.Name as FactoryName,t9.Code as FactoryCode,    "
                                + " t4.Name as LineName,t4.Code as LineCode,p1.PositionID,t12.Name as PositionName  FROM {0}.dms_device_alarm p"
                                + " inner join {0}.dms_device_ledger t on t.AssetNo=p.DeviceID "
                                + " inner join {0}.dms_device_parameter p1 on p1.Code=p.FaultID "
                                + " inner join {0}.dms_device_model t1 on t.ModelID=t1.ID "
                                + " left join {0}.dms_device_type t2 on t1.DeviceType=t2.ID "
                                + " left join {0}.bms_region t7 on t.AreaID=t7.ID "
                                + " left join {0}.fmc_workshop t3 on t.WorkShopID=t3.ID "
                                + " left join {0}.dms_position t12 on p1.PositionID=t12.ID "
                                + " left join {0}.fmc_factory t9 on t.FactoryID=t9.ID "
                                + " left join {0}.fmc_line t4 on t.LineID=t4.ID  WHERE  1=1  "

                        + " and ( @wAssetNo ='' or t.AssetNo  in  ('{1}'))  "
                                + " and ( @wDeviceID ='' or t.ID  in  ({2}))  group by t.ID   "
                           , wInstance, wAssetNoList.Count > 0 ? StringUtils.Join("','", wAssetNoList) : "0",
                        wDeviceIDList.Count > 0 ? StringUtils.Join(",", wDeviceIDList) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wDeviceID", StringUtils.Join(",", wDeviceIDList));
                wParamMap.Add("wAssetNo", StringUtils.Join("','", wAssetNoList));
                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }


                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSDeviceAlarm wDeviceAlarm = new DMSDeviceAlarm();
                    wDeviceAlarm.ID = StringUtils.parseInt(wReader.ContainsKey("ID") ? wReader["ID"] : "");
                    wDeviceAlarm.DeviceID = StringUtils.parseInt(wReader["DeviceIDL"]);
                    wDeviceAlarm.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wDeviceAlarm.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wDeviceAlarm.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wDeviceAlarm.ModelID = StringUtils.parseInt(wReader["ModelID"]);
                    wDeviceAlarm.ModelName = StringUtils.parseString(wReader["ModelName"]);
                    wDeviceAlarm.ModelNo = StringUtils.parseString(wReader["ModelNo"]);
                    wDeviceAlarm.DeviceType = StringUtils.parseInt(wReader["DeviceType"]);
                    wDeviceAlarm.DeviceTypeName = StringUtils.parseString(wReader["DeviceTypeName"]);
                    wDeviceAlarm.DeviceTypeCode = StringUtils.parseString(wReader["DeviceTypeCode"]);
                    wDeviceAlarm.WorkShopID = StringUtils.parseInt(wReader["WorkShopID"]);
                    wDeviceAlarm.WorkShopName = StringUtils.parseString(wReader["WorkShopName"]);
                    wDeviceAlarm.WorkShopCode = StringUtils.parseString(wReader["WorkShopCode"]);
                    wDeviceAlarm.FactoryID = StringUtils.parseInt(wReader["FactoryID"]);
                    wDeviceAlarm.FactoryName = StringUtils.parseString(wReader["FactoryName"]);
                    wDeviceAlarm.FactoryCode = StringUtils.parseString(wReader["FactoryCode"]);
                    wDeviceAlarm.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wDeviceAlarm.LineName = StringUtils.parseString(wReader["LineName"]);
                    wDeviceAlarm.LineCode = StringUtils.parseString(wReader["LineCode"]);
                    wDeviceAlarm.AreaID = StringUtils.parseInt(wReader["AreaID"]);
                    wDeviceAlarm.AreaNo = StringUtils.parseString(wReader["AreaNo"]);
                    wDeviceAlarm.PositionID = StringUtils.parseInt(wReader["PositionID"]);
                    wDeviceAlarm.PositionName = StringUtils.parseString(wReader["PositionName"]);
                    wDeviceAlarm.PositionText = StringUtils.parseString(wReader["PositionText"]);
                    wDeviceAlarm.ImageIcon = StringUtils.parseString(wReader["ImageIcon"]);
                    wDeviceAlarm.AlarmCode = StringUtils.parseString(wReader["FaultID"]);
                    wDeviceAlarm.AlarmName = StringUtils.parseString(wReader["AlarmName"]);
                    wDeviceAlarm.AlarmVariableName = StringUtils.parseString(wReader["AlarmVariableName"]);
                    wDeviceAlarm.AlarmDesc = StringUtils.parseString(wReader["AlarmDesc"]);
                    wDeviceAlarm.StatusTime = StringUtils.parseDate(wReader["OccurTime"]);
                    wDeviceAlarm.StatusTimeEnd = StringUtils.parseDate(wReader["UpdateDate"]);
                    wResult.Add(wDeviceAlarm);
                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }




        public List<DMSDeviceAlarm> DMS_SelectDeviceAlarmList(BMSEmployee wLoginUser, String wName,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wPositionID, int wTeamID,
             int wEventType, DateTime wStartTime, DateTime wEndTime, Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceAlarm> wResult = new List<DMSDeviceAlarm>();
            try
            {
                wResult = DMS_SelectDeviceAlarmList(wLoginUser, null, "", wName, wAssetNo, wDeviceType,
                    wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wPositionID, wTeamID, wEventType, wStartTime, wEndTime, wPagination,
                        wErrorCode);
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSDeviceAlarm> DMS_SelectDeviceAlarm(BMSEmployee wLoginUser, int wID, String wCode, String wAssetNo, int wEventType, DateTime wStartTime, DateTime wEndTime, Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceAlarm> wResult = new List<DMSDeviceAlarm>();
            try
            {
                if (wID > 0)
                {
                    List<Int32> wIDList = new List<Int32>();
                    wIDList.Add(wID);
                    wResult = this.DMS_SelectDeviceAlarmList(wLoginUser, wIDList, "", "",
                     "", -1, -1, -1, -1, -1, -1 ,- 1, -1, wEventType, wStartTime, wEndTime, wPagination, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wCode))
                {
                    wResult = this.DMS_SelectDeviceAlarmList(wLoginUser, null, wCode, "",
                 "", -1, -1, -1, -1, -1, -1, -1, -1, wEventType, wStartTime, wEndTime, wPagination, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wAssetNo))
                {
                    wResult = this.DMS_SelectDeviceAlarmList(wLoginUser, null, "", wAssetNo,
               "", -1, -1, -1, -1, -1, -1, -1, -1, wEventType, wStartTime, wEndTime, wPagination, wErrorCode);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSDeviceAlarm> DMS_SelectDeviceAlarmList(BMSEmployee wLoginUser, List<Int32> wIDList, int wEventType, DateTime wStartTime, DateTime wEndTime, Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceAlarm> wResult = new List<DMSDeviceAlarm>();
            try
            {
                if (wIDList == null || wIDList.Count < 1)
                    return wResult;
                DateTime wBaseTime = new DateTime(2000, 1, 1);
                List<Int32> wSelectList = new List<Int32>();
                for (int i = 0; i < wIDList.Count; i++)
                {
                    wSelectList.Add(wIDList[i]);
                    if (i % 25 == 0)
                    {
                        wResult.AddRange(this.DMS_SelectDeviceAlarmList(wLoginUser, wSelectList, "", "", "", -1, -1, -1, -1, -1,
                            -1, -1, -1, wEventType, wStartTime, wEndTime, wPagination, wErrorCode));

                        wSelectList.Clear();
                    }
                    if (i == wIDList.Count - 1)
                    {
                        if (wSelectList.Count > 0)
                            wResult.AddRange(this.DMS_SelectDeviceAlarmList(wLoginUser, wSelectList, "", "", "", -1, -1, -1, -1, -1, -1, -1, -1,
                                     wEventType, wStartTime, wEndTime, wPagination, wErrorCode));
                        break;
                    }
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



        public List<DMSDeviceAlarmStatistics> DMS_SelectDeviceAlarmStatisticsList(BMSEmployee wLoginUser, List<Int32> wDeviceIDList,
            APSShiftPeriod wShiftPeriod, DateTime wStartTime, DateTime wEndTime,
                OutResult<Int32> wErrorCode)
        {

            List<DMSDeviceAlarmStatistics> wResult = new List<DMSDeviceAlarmStatistics>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                String wSqlFormatDate = "'%Y-%m-%d'";

                switch (wShiftPeriod)
                {
                    case APSShiftPeriod.Day:
                        wSqlFormatDate = "'%Y-%m-%d'";
                        break;
                    case APSShiftPeriod.Week:
                        wSqlFormatDate = "'%Y-%m-%u'";
                        break;
                    case APSShiftPeriod.Month:
                        wSqlFormatDate = "'%Y-%m'";
                        break;
                    case APSShiftPeriod.Year:
                        wSqlFormatDate = "'%Y'";
                        break;
                    case APSShiftPeriod.Default:
                        wSqlFormatDate = "'%Y-%m-%d'";
                        break;
                    default:
                        break;

                }


                String wSQL = StringUtils.Format("select t.ID as DeviceID, t.AssetNo, date_format(t1.OccurTime,{1}) as AlarmTime, " +
                    " Count(t1.DeviceID) as AlarmCount,  sum((t1.UpdateDate - t1.OccurTime) / 1000) as AlarmDuration" +
                    " from {0}.dms_device_hisalarm t1  inner  join {0}.dms_device_ledger t on t.AssetNo = t1.DeviceID " +
                    " where ( @wDeviceIDList = '' or t.ID IN({2}))   " +
                    " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wStartTime <= t1.UpdateDate) " +
                    " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d') or @wEndTime >= t1.OccurTime)  " +
                    " group by t.ID, date_format(t1.OccurTime, {1})"
                           , wInstance, wSqlFormatDate, wDeviceIDList.Count > 0 ? StringUtils.Join(",", wDeviceIDList) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wDeviceIDList", StringUtils.Join(",", wDeviceIDList));
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSDeviceAlarmStatistics wDeviceAlarmStatistics = new DMSDeviceAlarmStatistics();
                    wDeviceAlarmStatistics.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wDeviceAlarmStatistics.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wDeviceAlarmStatistics.AlarmTime = StringUtils.parseDate(wReader["AlarmTime"]);
                    wDeviceAlarmStatistics.AlarmCount = StringUtils.parseInt(wReader["AlarmCount"]);
                    wDeviceAlarmStatistics.AlarmDuration = StringUtils.parseDouble(wReader["AlarmDuration"]);
                    wResult.Add(wDeviceAlarmStatistics);
                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;


        }




        public List<DMSDeviceAlarmFrequency> DMS_SelectDeviceAlarmFrequencyList(BMSEmployee wLoginUser, List<Int32> wDeviceIDList, DateTime wStartTime, DateTime wEndTime,
                OutResult<Int32> wErrorCode)
        {

            List<DMSDeviceAlarmFrequency> wResult = new List<DMSDeviceAlarmFrequency>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;



                String wSQL = StringUtils.Format(" select  t1.Name as AlarmName,t1.Code as AlarmCode, t1.ParameterDesc as AlarmDesc, " +
                     " count( case when t.EventType=1 then t.FaultID  else null end ) as AlarmCount, " +
                     " count( case when t.EventType=2 then t.FaultID  else null end ) as AlarmEndCount  from {0}.dms_device_hisalarm t  " +
                     " inner join {0}.dms_device_ledger p on p.AssetNo = t.DeviceID " +
                     " inner join {0}.dms_device_parameter t1 on t1.Code = t.FaultID   and p.ID = t1.DeviceID " +
                     " where ( @wDeviceIDList = '' or p.ID IN({1}))  " +
                     " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wStartTime <= t.UpdateDate) " +
                     " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d') or @wEndTime >= t.UpdateDate)  " +
                     " group by t1.Name "

            , wInstance, wDeviceIDList.Count > 0 ? StringUtils.Join(",", wDeviceIDList) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wDeviceIDList", StringUtils.Join(",", wDeviceIDList));
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                int wAlarmEndCount = 0;

                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSDeviceAlarmFrequency wDeviceAlarmFrequency = new DMSDeviceAlarmFrequency();
                    wDeviceAlarmFrequency.AlarmCode = StringUtils.parseString(wReader["AlarmCode"]);
                    wDeviceAlarmFrequency.AlarmName = StringUtils.parseString(wReader["AlarmName"]);
                    wDeviceAlarmFrequency.AlarmDesc = StringUtils.parseString(wReader["AlarmDesc"]);
                    wDeviceAlarmFrequency.AlarmCount = StringUtils.parseInt(wReader["AlarmCount"]);

                    wAlarmEndCount = StringUtils.parseInt(wReader["AlarmEndCount"]);
                    if (wAlarmEndCount > wDeviceAlarmFrequency.AlarmCount)
                        wDeviceAlarmFrequency.AlarmCount = wAlarmEndCount;
                    wResult.Add(wDeviceAlarmFrequency);
                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;


        }



        public List<String> DMS_CloseAlarmHistoryString(ICollection<DMSDeviceAlarm> wDMSDeviceAlarmList)
        {
            //添加EventType=2
            List<String> wResult = new List<string>();
            if (wDMSDeviceAlarmList == null || wDMSDeviceAlarmList.Count <= 0)
                return wResult;

            foreach (DMSDeviceAlarm wDMSDeviceAlarm in wDMSDeviceAlarmList)
            {
                if (wDMSDeviceAlarm == null || StringUtils.isEmpty(wDMSDeviceAlarm.AlarmCode) || StringUtils.isEmpty(wDMSDeviceAlarm.AssetNo))
                    continue;


                wResult.Add(StringUtils.Format(" Insert into {0}.dms_device_hisalarm (DeviceID,OccurTime,FaultID,UpdateDate,EventType) " +
                 "values ({1},'{2}','{3}',now(),2);", MESDBSource.DMS.getDBName(), wDMSDeviceAlarm.AssetNo,
                 wDMSDeviceAlarm.StatusTime.ToString("yyyy-MM-dd HH:mm:ss"), wDMSDeviceAlarm.AlarmCode));
            }
            return wResult;
        }

        public List<String> DMS_AddAlarmHistoryString(ICollection<DMSDeviceAlarm> wDMSDeviceAlarmList)
        {
            //添加EventType=2
            List<String> wResult = new List<string>();
            if (wDMSDeviceAlarmList == null || wDMSDeviceAlarmList.Count <= 0)
                return wResult;

            foreach (DMSDeviceAlarm wDMSDeviceAlarm in wDMSDeviceAlarmList)
            {
                if (wDMSDeviceAlarm == null || StringUtils.isEmpty(wDMSDeviceAlarm.AlarmCode) || StringUtils.isEmpty(wDMSDeviceAlarm.AssetNo))
                    continue;


                wResult.Add(StringUtils.Format(" Insert into {0}.dms_device_hisalarm (DeviceID,OccurTime,FaultID,UpdateDate,EventType) " +
                 "values ({1},'{2}','{3}','{4}',2);", MESDBSource.DMS.getDBName(), wDMSDeviceAlarm.AssetNo,
                 wDMSDeviceAlarm.StatusTime.ToString("yyyy-MM-dd HH:mm:ss"), wDMSDeviceAlarm.AlarmCode, wDMSDeviceAlarm.StatusTimeEnd.ToString("yyyy-MM-dd HH:mm:ss")));
            }
            return wResult;
        }



        public List<String> DMS_CloseAlarmHistoryString(DMSDeviceAlarm wDMSDeviceAlarm)
        {
            List<String> wSqlList = new List<string>();
            //添加EventType=2
            if (wDMSDeviceAlarm == null || StringUtils.isEmpty(wDMSDeviceAlarm.AlarmCode) || StringUtils.isEmpty(wDMSDeviceAlarm.AssetNo))
                return wSqlList;

           

            if (wDMSDeviceAlarm.StatusTime <= new DateTime(2010, 1, 1))
            {
                wSqlList.Add( StringUtils.Format(" Insert into {0}.dms_device_hisalarm (DeviceID,OccurTime,FaultID,UpdateDate,EventType) " +
                 " select {1},OccurTime,'{2}',now(),2 from dms_device_alarm where DeviceID={1} AND FaultID='{2}' ;", MESDBSource.DMS.getDBName(), wDMSDeviceAlarm.AssetNo,
                  wDMSDeviceAlarm.AlarmCode));
            }
            else
            {
                wSqlList.Add(StringUtils.Format("  Insert into {0}.dms_device_hisalarm (DeviceID,OccurTime,FaultID,UpdateDate,EventType) " +
               "values ({1},'{2}','{3}',now(),2);", MESDBSource.DMS.getDBName(), wDMSDeviceAlarm.AssetNo,
               wDMSDeviceAlarm.StatusTime.ToString("yyyy-MM-dd HH:mm:ss"), wDMSDeviceAlarm.AlarmCode));
            }

            wSqlList.Add(StringUtils.Format("delete from {0}.dms_device_hisalarm where DeviceID={1} AND FaultID='{2}' and EventType=1 ", MESDBSource.DMS.getDBName(), wDMSDeviceAlarm.AssetNo, wDMSDeviceAlarm.AlarmCode));
            return wSqlList;
        }

        public List<String> DMS_CloseAlarmCodeHistoryString(String wAssetNo)
        {
            List<String> wSqlList = new List<string>();
            //添加EventType=2
            if (StringUtils.isEmpty(wAssetNo))
                return wSqlList;


            wSqlList.Add(StringUtils.Format("delete from {0}.dms_device_hisalarm where DeviceID={1} AND  EventType=1 ", MESDBSource.DMS.getDBName(), wAssetNo));


            wSqlList.Add( StringUtils.Format(" Insert into {0}.dms_device_hisalarm (DeviceID,OccurTime,FaultID,UpdateDate,EventType) " +
             " select {1},OccurTime,FaultID,now(),2 from dms_device_alarm where DeviceID={1} AND IsCode=1 ;", MESDBSource.DMS.getDBName(), wAssetNo));

            return wSqlList;
        }

        public List<String> DMS_CloseAlarmAll(String wAssetNo)
        {
            List<String> wResult = new List<string>();
            //添加EventType=2
            if (StringUtils.isEmpty(wAssetNo))
                return wResult;

            wResult.Add( StringUtils.Format(" Insert into {0}.dms_device_hisalarm (DeviceID,OccurTime,FaultID,UpdateDate,EventType) " +
             " select {1},OccurTime,FaultID,now(),2 from dms_device_alarm where DeviceID={1}  ;", MESDBSource.DMS.getDBName(), wAssetNo));


            wResult.Add(StringUtils.Format(" delete From {0}.dms_device_alarm where DeviceID={1}  ;", MESDBSource.DMS.getDBName(), wAssetNo));

            return wResult;
        }



        public List<String> DMS_InsertAlarmHistoryString(ICollection<DMSDeviceAlarm> wDMSDeviceAlarmList)
        {
            //添加EventType=1
            List<String> wResult = new List<string>();
            if (wDMSDeviceAlarmList == null || wDMSDeviceAlarmList.Count <= 0)
                return wResult;

            foreach (DMSDeviceAlarm wDMSDeviceAlarm in wDMSDeviceAlarmList)
            {
                if (wDMSDeviceAlarm == null || StringUtils.isEmpty(wDMSDeviceAlarm.AlarmCode) || StringUtils.isEmpty(wDMSDeviceAlarm.AssetNo))
                    continue;

                wResult.Add(StringUtils.Format(" Insert into {0}.dms_device_hisalarm (DeviceID,OccurTime,FaultID,UpdateDate,EventType) " +
                     "values ({1},'{2}','{3}','{2}',1);", MESDBSource.DMS.getDBName(), wDMSDeviceAlarm.AssetNo,
                     wDMSDeviceAlarm.StatusTime.ToString("yyyy-MM-dd HH:mm:ss"), wDMSDeviceAlarm.AlarmCode));
            }
            return wResult;
        }

        public String DMS_InsertAlarmHistoryString(DMSDeviceAlarm wDMSDeviceAlarm)
        {
            if (wDMSDeviceAlarm == null || StringUtils.isEmpty(wDMSDeviceAlarm.AlarmCode) || StringUtils.isEmpty(wDMSDeviceAlarm.AssetNo))
                return "";

            return StringUtils.Format(" Insert into {0}.dms_device_hisalarm (DeviceID,OccurTime,FaultID,UpdateDate,EventType) " +
                 "values ({1},'{2}','{3}','{2}',1);", MESDBSource.DMS.getDBName(), wDMSDeviceAlarm.AssetNo,
                 wDMSDeviceAlarm.StatusTime.ToString("yyyy-MM-dd HH:mm:ss"), wDMSDeviceAlarm.AlarmCode);
        }
        public String DMS_DeleteAlarmString(List<String> wAssetNoList)
        {
            if (wAssetNoList == null || wAssetNoList.Count <= 0)
                return "";
            return StringUtils.Format("delete from {0}.dms_device_alarm where Device in ('{1}') ;", MESDBSource.DMS.getDBName(), StringUtils.Join("','", wAssetNoList));
        }

        public String DMS_DeleteAlarmString(String wAssetNo)
        {
            if (StringUtils.isEmpty(wAssetNo))
                return "";
            return StringUtils.Format("delete from {0}.dms_device_alarm where DeviceID ='{1}' ;",
                MESDBSource.DMS.getDBName(), wAssetNo);
        }
        public String DMS_DeleteAlarmString(String wAssetNo, String wAlarmCode)
        {
            if (StringUtils.isEmpty(wAssetNo) || StringUtils.isEmpty(wAlarmCode))
                return "";
            return StringUtils.Format("delete from {0}.dms_device_alarm where DeviceID ='{1}' and FaultID = '{2}';  ",
                MESDBSource.DMS.getDBName(), wAssetNo, wAlarmCode);
        }


        public int DMS_DeleteCurrentAlarm(String wAssetNo, String wAlarmCode)
        {
            int wRowChange = 0;
            if (StringUtils.isEmpty(wAssetNo) || StringUtils.isEmpty(wAlarmCode))
                return wRowChange;
            try
            {
                String wSQL = StringUtils.Format("delete from {0}.dms_device_alarm where DeviceID ='{1}' and FaultID = '{2}';  ",
                MESDBSource.DMS.getDBName(), wAssetNo, wAlarmCode);
                wRowChange = mDBPool.update(wSQL, null);
            }
            catch (Exception ex)
            {
                logger.Error("DMS_DeleteCurrentAlarm", ex);
            }
            return wRowChange;
        }


        public String DMS_DeleteAlarmCodeString(String wAssetNo)
        {
            if (StringUtils.isEmpty(wAssetNo))
                return "";
            return StringUtils.Format("delete from {0}.dms_device_alarm where DeviceID ='{1}' and IsCode = 1;  ",
                MESDBSource.DMS.getDBName(), wAssetNo);
        }

        public List<String> DMS_InsertCurrentAlarmString(List<DMSDeviceAlarm> wDMSDeviceAlarmList)
        {
            List<String> wResult = new List<string>();
            if (wDMSDeviceAlarmList == null || wDMSDeviceAlarmList.Count <= 0)
                return wResult;

            foreach (DMSDeviceAlarm wDMSDeviceAlarm in wDMSDeviceAlarmList)
            {
                if (wDMSDeviceAlarm == null || StringUtils.isEmpty(wDMSDeviceAlarm.AlarmCode) || StringUtils.isEmpty(wDMSDeviceAlarm.AssetNo))
                    continue;
                wResult.Add(StringUtils.Format(" Insert into {0}.dms_device_alarm (DeviceID,OccurTime,FaultID,UpdateDate) " +
                 "values ({1},'{2}','{3}','{2}');", MESDBSource.DMS.getDBName(), wDMSDeviceAlarm.AssetNo,
                 wDMSDeviceAlarm.StatusTime.ToString("yyyy-MM-dd HH:mm:ss"), wDMSDeviceAlarm.AlarmCode));
            }

            return wResult;
        }
        public String DMS_InsertCurrentAlarmString(DMSDeviceAlarm wDMSDeviceAlarm, int wIsCode)
        {
            if (wDMSDeviceAlarm == null || StringUtils.isEmpty(wDMSDeviceAlarm.AlarmCode) || StringUtils.isEmpty(wDMSDeviceAlarm.AssetNo))
                return "";

            return StringUtils.Format(" Insert into {0}.dms_device_alarm (DeviceID,OccurTime,FaultID,UpdateDate,IsCode) " +
                 "values ({1},'{2}','{3}','{2}',{4});", MESDBSource.DMS.getDBName(), wDMSDeviceAlarm.AssetNo,
                 wDMSDeviceAlarm.StatusTime.ToString("yyyy-MM-dd HH:mm:ss"), wDMSDeviceAlarm.AlarmCode, wIsCode);

        }


    }
}
