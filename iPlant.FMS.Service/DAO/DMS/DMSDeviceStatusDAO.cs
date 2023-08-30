using iPlant.Common.Tools;
using iPlant.Data.EF;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class DMSDeviceStatusDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSDeviceStatusDAO));


        private static DMSDeviceStatusDAO Instance;




        public static List<Int32> mStatusList = new List<int>();

        static DMSDeviceStatusDAO()
        {
            for (int i = 0; i <= 30; i++)
            {
                mStatusList.Add(1 << i);
            }
        }


        private DMSDeviceStatusDAO() : base()
        {
        }


        public static DMSDeviceStatusDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSDeviceStatusDAO();
            return Instance;
        }

        public void SetSqlMode()
        {
            try
            {
                this.BaseRepository().ExecuteBySql(
                    "SET GLOBAL sql_mode='STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION'; " +
                    "set global event_scheduler=1;" +
                    "SET sql_safe_updates=0;" +
                    "UPDATE iplantute.dms_device_parameter t   INNER JOIN   iplantute.dms_device_server t1 ON t.DeviceID = t1.ServerName SET t.ServerId = t1.ID;" +
                    "update iplantute.dms_device_parameter  set ParseFuncID='1'  where ( DataClass=8  or  VariableName= '3014' )  and DeviceID in (SELECT ID FROM iplantute.dms_device_ledger where  ManufactorName='西门子' and SupplierName='无锡旋源'); " +
                    "update iplantute.dms_device_parameter  set ParseFuncID=1 where DeviceID in (SELECT ID FROM iplantute.dms_device_ledger where   ManufactorName='西门子' and SupplierName='温岭大森') and   DataClass=8 ;" +
                    "update iplantute.dms_device_parameter  set ParseFuncID=1 where DeviceID in (SELECT ID FROM iplantute.dms_device_ledger where   ManufactorName='西门子' and SupplierName='新昌日发')  and (VariableName= '2053' or VariableName= '2059' or VariableName= '2060' or VariableName= '2061' or VariableName= '2062' or VariableName= '2063'); "
                    );
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
        }
        private List<DMSDeviceStatus> DMS_SelectDeviceStatusList(BMSEmployee wLoginUser, List<Int32> wDeviceID, String wDeviceNo, String wName,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID,
               int wActive, DateTime wStartTime, DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceStatus> wResult = new List<DMSDeviceStatus>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                if (wDeviceID == null)
                    wDeviceID = new List<Int32>();
                wDeviceID.RemoveAll(p => p <= 0);
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
                    "SELECT p.*,t.ID AS DeviceIDL,t.Code as DeviceNo,t.Name as DeviceName,t.ImageIcon,t1.DeviceType,t.ModelID,t.AssetNo,t.Remark,"
                        + " t.WorkShopID,t.FactoryID,t.LineID,t.AreaID,t.TeamID, t8.Name as TeamName, t8.Code as TeamNo," +
                        " t1.Code as  ModelNo,t1.Name as ModelName, t2.Name as DeviceTypeName," +
                        "  t2.Code as DeviceTypeCode,t3.Name as WorkShopName,t3.Code as WorkShopCode,t7.Code as AreaNo," +
                        " t7.Name as PositionText,t9.Name as FactoryName,t9.Code as FactoryCode,    "
                                + " t4.Name as LineName,t4.Code as LineCode "
                                + "  FROM {0}.dms_device_hisstatus p"
                                + " inner join {0}.dms_device_ledger t on t.AssetNo=p.DeviceID "
                                + " inner join {0}.dms_device_model t1 on t.ModelID=t1.ID "
                                + " left join {0}.dms_device_type t2 on t1.DeviceType=t2.ID "
                                + " left join {0}.bms_region t7 on t.AreaID=t7.ID "
                                + " left join {0}.bms_teammanage t8 on t.TeamID=t8.ID "
                                + " left join {0}.fmc_workshop t3 on t.WorkShopID=t3.ID "
                                + " left join {0}.fmc_factory t9 on t.FactoryID=t9.ID "
                                + " left join {0}.fmc_line t4 on t.LineID=t4.ID  WHERE  1=1  "
                                + " and ( @wID ='' or t.ID IN( {1} ) )  "
                        + " and ( @wCode ='' or t.Code  = @wCode)  "
                        + " and ( @wName ='' or t.Name   like  @wName )  "
                        + " and ( @wAssetNo ='' or t.AssetNo   = @wAssetNo )  "
                        + " and ( @wDeviceType <= 0 or t1.DeviceType  = @wDeviceType)   "
                        + " and ( @wModelID <= 0 or t.ModelID  = @wModelID)   "
                        + " and ( @wActive < 0 or p.Active  = @wActive)   "
                        + " and ( @wAreaID <= 0 or t.AreaID  = @wAreaID)  "
                        + " and ( @wTeamID <= 0 or t.TeamID  = @wTeamID)   "
                        + " and ( @wFactoryID <= 0 or t.FactoryID  = @wFactoryID)  "
                        + " and ( @wWorkShopID <= 0 or t.WorkShopID  = @wWorkShopID)  "
                        + " and ( @wLineID <= 0 or t.LineID  = @wLineID)    "
                        + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wStartTime <= p.UpdateDate) "
                        + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= p.StartDate)  "
                        , wInstance, wDeviceID.Count > 0 ? StringUtils.Join(",", wDeviceID) : "0");

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wID", StringUtils.Join(",", wDeviceID));
                wParamMap.Add("wName", StringUtils.isEmpty(wName) ? wName : "%" + wName + "%");
                wParamMap.Add("wCode", wDeviceNo);
                wParamMap.Add("wAssetNo", wAssetNo);
                wParamMap.Add("wDeviceType", wDeviceType);
                wParamMap.Add("wModelID", wModelID);
                wParamMap.Add("wTeamID", wTeamID);
                wParamMap.Add("wActive", wActive);
                wParamMap.Add("wFactoryID", wFactoryID);
                wParamMap.Add("wWorkShopID", wWorkShopID);
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wAreaID", wAreaID);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);


                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }


                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSDeviceStatus wDeviceStatus = new DMSDeviceStatus();

                    wDeviceStatus.ID = StringUtils.parseInt(wReader.ContainsKey("ID") ? wReader["ID"] : "");
                    wDeviceStatus.DeviceID = StringUtils.parseInt(wReader["DeviceIDL"]);
                    wDeviceStatus.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wDeviceStatus.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wDeviceStatus.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wDeviceStatus.ModelID = StringUtils.parseInt(wReader["ModelID"]);
                    wDeviceStatus.ModelName = StringUtils.parseString(wReader["ModelName"]);
                    wDeviceStatus.ModelNo = StringUtils.parseString(wReader["ModelNo"]);
                    wDeviceStatus.DeviceType = StringUtils.parseInt(wReader["DeviceType"]);
                    wDeviceStatus.DeviceTypeName = StringUtils.parseString(wReader["DeviceTypeName"]);
                    wDeviceStatus.DeviceTypeCode = StringUtils.parseString(wReader["DeviceTypeCode"]);
                    wDeviceStatus.WorkShopID = StringUtils.parseInt(wReader["WorkShopID"]);
                    wDeviceStatus.WorkShopName = StringUtils.parseString(wReader["WorkShopName"]);
                    wDeviceStatus.WorkShopCode = StringUtils.parseString(wReader["WorkShopCode"]);
                    wDeviceStatus.FactoryID = StringUtils.parseInt(wReader["FactoryID"]);
                    wDeviceStatus.FactoryName = StringUtils.parseString(wReader["FactoryName"]);
                    wDeviceStatus.FactoryCode = StringUtils.parseString(wReader["FactoryCode"]);
                    wDeviceStatus.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wDeviceStatus.LineName = StringUtils.parseString(wReader["LineName"]);
                    wDeviceStatus.LineCode = StringUtils.parseString(wReader["LineCode"]);
                    wDeviceStatus.TeamID = StringUtils.parseInt(wReader["TeamID"]);
                    wDeviceStatus.TeamNo = StringUtils.parseString(wReader["TeamNo"]);
                    wDeviceStatus.TeamName = StringUtils.parseString(wReader["TeamName"]);
                    wDeviceStatus.AreaID = StringUtils.parseInt(wReader["AreaID"]);
                    wDeviceStatus.AreaNo = StringUtils.parseString(wReader["AreaNo"]);
                    wDeviceStatus.Remark = StringUtils.parseString(wReader["Remark"]);
                    wDeviceStatus.ImageIcon = StringUtils.parseString(wReader["ImageIcon"]);
                    wDeviceStatus.PositionText = StringUtils.parseString(wReader["PositionText"]);
                    wDeviceStatus.Status = StringUtils.parseInt(wReader["DeviceStatus"]);
                    wDeviceStatus.Duration = StringUtils.parseInt(wReader["Duration"]);
                    wDeviceStatus.StatusTime = StringUtils.parseDate(wReader["StartDate"]);
                    wDeviceStatus.StatusTimeEnd = StringUtils.parseDate(wReader["UpdateDate"]);


                    if (wDeviceStatus.StatusTimeEnd <= wDeviceStatus.StatusTime)
                    {
                        wDeviceStatus.StatusTimeEnd = wDeviceStatus.StatusTime.AddSeconds(wDeviceStatus.Duration);
                    }
                    wDeviceStatus.Active = StringUtils.parseInt(wReader["Active"]);
                    if (wDeviceStatus.Active == 1)
                    {
                        wDeviceStatus.StatusTimeEnd = DateTime.Now;
                        wDeviceStatus.Duration = ((int)(DateTime.Now - wDeviceStatus.StatusTime).TotalSeconds);
                    }
                    wResult.Add(wDeviceStatus);
                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        private List<DMSDeviceStatus> DMS_SelectDeviceStatusDetailList(BMSEmployee wLoginUser, List<Int32> wDeviceID, String wDeviceNo, String wName,
              String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID, List<int> wStatusList,
              DateTime wStartTime, DateTime wEndTime, int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceStatus> wResult = new List<DMSDeviceStatus>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();


                if (wDeviceID == null)
                    wDeviceID = new List<Int32>();
                wDeviceID.RemoveAll(p => p <= 0);
                if (wDeviceNo == null)
                    wDeviceNo = "";

                if (wStatusList == null)
                    wStatusList = new List<Int32>();
                wStatusList.RemoveAll(p => p < 0);


                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if (wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if (wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return wResult;
                }

                String wSQL = StringUtils.Format("SELECT p.*,t.ID AS DeviceIDL,t.Code as DeviceNo,t.Name as DeviceName,t.ImageIcon,t.ModelID,t.AssetNo,t.Remark,"
                       + " t.WorkShopID,t.FactoryID,t.LineID,t.AreaID,t.TeamID, t8.Name as TeamName, t8.Code as TeamNo," +
                       " t1.Code as  ModelNo,t1.Name as ModelName,t1.DeviceType, t2.Name as DeviceTypeName," +
                       "  t2.Code as DeviceTypeCode,t3.Name as WorkShopName,t3.Code as WorkShopCode,t7.Code as AreaNo," +
                       " t7.Name as PositionText,t9.Name as FactoryName,t9.Code as FactoryCode,    "
                               + " t4.Name as LineName,t4.Code as LineCode "

                                + "  FROM {0}.dms_device_detailstatus p"
                                + " inner join {0}.dms_device_ledger t on t.AssetNo=p.DeviceID "
                                + " inner join {0}.dms_device_model t1 on t.ModelID=t1.ID "
                                + " left join {0}.dms_device_type t2 on t1.DeviceType=t2.ID "
                                + " left join {0}.bms_region t7 on t.AreaID=t7.ID "
                                + " left join {0}.bms_teammanage t8 on t.TeamID=t8.ID "
                                + " left join {0}.fmc_workshop t3 on t.WorkShopID=t3.ID "
                                + " left join {0}.fmc_factory t9 on t.FactoryID=t9.ID "
                                + " left join {0}.fmc_line t4 on t.LineID=t4.ID  WHERE  1=1  "
                                + " and ( @wID ='' or t.ID IN( {1} ) )  "
                        + " and ( @wCode ='' or t.Code  = @wCode)  "
                        + " and ( @wName ='' or t.Name   like  @wName )  "
                        + " and ( @wAssetNo ='' or t.AssetNo   = @wAssetNo )  "
                        + " and ( @wDeviceType <= 0 or t1.DeviceType  = @wDeviceType)   "
                        + " and ( @wModelID <= 0 or t.ModelID  = @wModelID)   "
                        + " and ( @wAreaID <= 0 or t.AreaID  = @wAreaID)  "
                        + " and ( @wActive < 0 or p.Active  = @wActive)  "
                        + " and ( @wTeamID <= 0 or t.TeamID  = @wTeamID)   "
                        + " and ( @wStatus = '' or   p.DeviceStatus in ({2}) )   "
                        + " and ( @wFactoryID <= 0 or t.FactoryID  = @wFactoryID)  "
                        + " and ( @wWorkShopID <= 0 or t.WorkShopID  = @wWorkShopID)  "
                        + " and ( @wLineID <= 0 or t.LineID  = @wLineID)    "
                        + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wStartTime <= p.UpdateDate) "
                        + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= p.StartDate)   "
                        , wInstance, wDeviceID.Count > 0 ? StringUtils.Join(",", wDeviceID) : "0", wStatusList.Count > 0 ? StringUtils.Join(",", wStatusList) : "0");

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wID", StringUtils.Join(",", wDeviceID));
                wParamMap.Add("wName", StringUtils.isEmpty(wName) ? wName : "%" + wName + "%");
                wParamMap.Add("wCode", wDeviceNo);
                wParamMap.Add("wAssetNo", wAssetNo);
                wParamMap.Add("wDeviceType", wDeviceType);
                wParamMap.Add("wModelID", wModelID);
                wParamMap.Add("wTeamID", wTeamID);
                wParamMap.Add("wStatus", StringUtils.Join(",", wStatusList));
                wParamMap.Add("wFactoryID", wFactoryID);
                wParamMap.Add("wWorkShopID", wWorkShopID);
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wAreaID", wAreaID);
                wParamMap.Add("wActive", wActive);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);


                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }


                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSDeviceStatus wDeviceStatus = new DMSDeviceStatus();

                    wDeviceStatus.ID = StringUtils.parseInt(wReader.ContainsKey("ID") ? wReader["ID"] : "");
                    wDeviceStatus.DeviceID = StringUtils.parseInt(wReader["DeviceIDL"]);
                    wDeviceStatus.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wDeviceStatus.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wDeviceStatus.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wDeviceStatus.ModelID = StringUtils.parseInt(wReader["ModelID"]);
                    wDeviceStatus.ModelName = StringUtils.parseString(wReader["ModelName"]);
                    wDeviceStatus.ModelNo = StringUtils.parseString(wReader["ModelNo"]);
                    wDeviceStatus.DeviceType = StringUtils.parseInt(wReader["DeviceType"]);
                    wDeviceStatus.DeviceTypeName = StringUtils.parseString(wReader["DeviceTypeName"]);
                    wDeviceStatus.DeviceTypeCode = StringUtils.parseString(wReader["DeviceTypeCode"]);
                    wDeviceStatus.WorkShopID = StringUtils.parseInt(wReader["WorkShopID"]);
                    wDeviceStatus.WorkShopName = StringUtils.parseString(wReader["WorkShopName"]);
                    wDeviceStatus.WorkShopCode = StringUtils.parseString(wReader["WorkShopCode"]);
                    wDeviceStatus.FactoryID = StringUtils.parseInt(wReader["FactoryID"]);
                    wDeviceStatus.FactoryName = StringUtils.parseString(wReader["FactoryName"]);
                    wDeviceStatus.FactoryCode = StringUtils.parseString(wReader["FactoryCode"]);
                    wDeviceStatus.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wDeviceStatus.LineName = StringUtils.parseString(wReader["LineName"]);
                    wDeviceStatus.LineCode = StringUtils.parseString(wReader["LineCode"]);
                    wDeviceStatus.TeamID = StringUtils.parseInt(wReader["TeamID"]);
                    wDeviceStatus.TeamNo = StringUtils.parseString(wReader["TeamNo"]);
                    wDeviceStatus.TeamName = StringUtils.parseString(wReader["TeamName"]);
                    wDeviceStatus.AreaID = StringUtils.parseInt(wReader["AreaID"]);
                    wDeviceStatus.AreaNo = StringUtils.parseString(wReader["AreaNo"]);
                    wDeviceStatus.Remark = StringUtils.parseString(wReader["Remark"]);
                    wDeviceStatus.ImageIcon = StringUtils.parseString(wReader["ImageIcon"]);
                    wDeviceStatus.PositionText = StringUtils.parseString(wReader["PositionText"]);
                    wDeviceStatus.Status = StringUtils.parseInt(wReader["DeviceStatus"]);
                    wDeviceStatus.Duration = StringUtils.parseInt(wReader["Duration"]);
                    wDeviceStatus.StatusTime = StringUtils.parseDate(wReader["StartDate"]);
                    wDeviceStatus.StatusTimeEnd = StringUtils.parseDate(wReader["UpdateDate"]);


                    if (wDeviceStatus.StatusTimeEnd <= wDeviceStatus.StatusTime)
                    {
                        wDeviceStatus.StatusTimeEnd = wDeviceStatus.StatusTime.AddSeconds(wDeviceStatus.Duration);
                    }
                    wDeviceStatus.Active = StringUtils.parseInt(wReader["Active"]);
                    if (wDeviceStatus.Active == 1)
                    {
                        wDeviceStatus.StatusTimeEnd = DateTime.Now;
                        wDeviceStatus.Duration = ((int)(DateTime.Now - wDeviceStatus.StatusTime).TotalSeconds);
                    }
                    wResult.Add(wDeviceStatus);
                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }




        public List<DMSDeviceStatus> DMS_CurrentDeviceStatusList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, String wDeviceName,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID, int wStatus, int wIsPlan,Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceStatus> wResult = new List<DMSDeviceStatus>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;



                String wSQL = StringUtils.Format(
                        "SELECT t.ID AS DeviceIDL,t.DeviceIP,p.*,t.Code as DeviceNo,t.Name as DeviceName,t.ImageIcon, t.ModelID,t.AssetNo,t.IsPlan,t.Remark," +
                        " t.WorkShopID,t.FactoryID,t.LineID,t.AreaID,t.TeamID, t8.Name as TeamName, t8.Code as TeamNo," +
                        " t1.Code as  ModelNo,t1.Name as ModelName,t1.DeviceType, t2.Name as DeviceTypeName," +
                        "  t2.Code as DeviceTypeCode,t3.Name as WorkShopName,t3.Code as WorkShopCode,t7.Code as AreaNo," +
                        " t7.Name as PositionText,t9.Name as FactoryName,t9.Code as FactoryCode, count(a1.DeviceID) as AlarmCount,    "
                                + " t4.Name as LineName,t4.Code as LineCode  FROM {0}.dms_device_ledger t "
                                + " left join {0}.dms_device_status p on t.AssetNo=p.DeviceID "
                                + " inner join {0}.dms_device_model t1 on t.ModelID=t1.ID "
                                + " left join {0}.dms_device_type t2 on t1.DeviceType=t2.ID "
                                + " left join {0}.bms_region t7 on t.AreaID=t7.ID "
                                + " left join {0}.bms_teammanage t8 on t.TeamID=t8.ID "
                                + " left join {0}.fmc_workshop t3 on t.WorkShopID=t3.ID "
                                + " left join {0}.fmc_factory t9 on t.FactoryID=t9.ID "
                                + " left join {0}.dms_device_alarm a1 on t.AssetNo=a1.DeviceID "
                                + " left join {0}.fmc_line t4 on t.LineID=t4.ID  WHERE  1=1  "

                        + " and ( @wDeviceID <=0 or t.ID   = @wDeviceID )  "
                        + " and ( @wDeviceNo ='' or t.Code   = @wDeviceNo )  "
                        + " and ( @wDeviceName ='' or t.Name   like @wDeviceName )  "
                        + " and ( @wAssetNo ='' or t.AssetNo   = @wAssetNo )  "
                        + " and ( @wDeviceType <= 0 or t1.DeviceType  = @wDeviceType)   "
                        + " and ( @wModelID <= 0 or t.ModelID  = @wModelID)   "
                        + " and ( @wAreaID <= 0 or t.AreaID  = @wAreaID)  "
                        + " and ( @wStatus < 0 or ( @wStatus=0 and  p.DeviceStatus=0) or (@wStatus&p.DeviceStatus)>0) "
                        + " and ( @wTeamID <= 0 or t.TeamID  = @wTeamID)   "
                        + " and ( @wIsPlan < 0 or t.IsPlan  = @wIsPlan)   "
                        + " and ( @wFactoryID <= 0 or t.FactoryID  = @wFactoryID)  "
                        + " and ( @wWorkShopID <= 0 or t.WorkShopID  = @wWorkShopID)  "
                        + " and ( @wLineID <= 0 or t.LineID  = @wLineID) group by t.ID    "
                           , wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wDeviceID", wDeviceID);
                wParamMap.Add("wDeviceNo", wDeviceNo);
                wParamMap.Add("wDeviceName", StringUtils.isNotEmpty(wDeviceName) ? ("%" + wDeviceName + "%") : "");
                wParamMap.Add("wAssetNo", wAssetNo);
                wParamMap.Add("wDeviceType", wDeviceType);
                wParamMap.Add("wModelID", wModelID);
                wParamMap.Add("wTeamID", wTeamID);
                wParamMap.Add("wFactoryID", wFactoryID);
                wParamMap.Add("wWorkShopID", wWorkShopID);
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wAreaID", wAreaID);
                wParamMap.Add("wStatus", wStatus);
                wParamMap.Add("wIsPlan", wIsPlan);
                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }


                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSDeviceStatus wDeviceStatus = new DMSDeviceStatus();

                    wDeviceStatus.ID = StringUtils.parseInt(wReader.ContainsKey("ID") ? wReader["ID"] : "");
                    wDeviceStatus.DeviceID = StringUtils.parseInt(wReader["DeviceIDL"]);
                    wDeviceStatus.DeviceIP = StringUtils.parseString(wReader["DeviceIP"]);
                    wDeviceStatus.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wDeviceStatus.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wDeviceStatus.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wDeviceStatus.ModelID = StringUtils.parseInt(wReader["ModelID"]);
                    wDeviceStatus.ModelName = StringUtils.parseString(wReader["ModelName"]);
                    wDeviceStatus.ModelNo = StringUtils.parseString(wReader["ModelNo"]);
                    wDeviceStatus.DeviceType = StringUtils.parseInt(wReader["DeviceType"]);
                    wDeviceStatus.DeviceTypeName = StringUtils.parseString(wReader["DeviceTypeName"]);
                    wDeviceStatus.DeviceTypeCode = StringUtils.parseString(wReader["DeviceTypeCode"]);
                    wDeviceStatus.WorkShopID = StringUtils.parseInt(wReader["WorkShopID"]);
                    wDeviceStatus.WorkShopName = StringUtils.parseString(wReader["WorkShopName"]);
                    wDeviceStatus.WorkShopCode = StringUtils.parseString(wReader["WorkShopCode"]);
                    wDeviceStatus.FactoryID = StringUtils.parseInt(wReader["FactoryID"]);
                    wDeviceStatus.FactoryName = StringUtils.parseString(wReader["FactoryName"]);
                    wDeviceStatus.FactoryCode = StringUtils.parseString(wReader["FactoryCode"]);
                    wDeviceStatus.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wDeviceStatus.LineName = StringUtils.parseString(wReader["LineName"]);
                    wDeviceStatus.LineCode = StringUtils.parseString(wReader["LineCode"]);
                    wDeviceStatus.TeamID = StringUtils.parseInt(wReader["TeamID"]);
                    wDeviceStatus.TeamNo = StringUtils.parseString(wReader["TeamNo"]);
                    wDeviceStatus.TeamName = StringUtils.parseString(wReader["TeamName"]);
                    wDeviceStatus.AreaID = StringUtils.parseInt(wReader["AreaID"]);
                    wDeviceStatus.AreaNo = StringUtils.parseString(wReader["AreaNo"]);
                    wDeviceStatus.Remark = StringUtils.parseString(wReader["Remark"]);
                    wDeviceStatus.ImageIcon = StringUtils.parseString(wReader["ImageIcon"]);
                    wDeviceStatus.PositionText = StringUtils.parseString(wReader["PositionText"]);
                    wDeviceStatus.Status = StringUtils.parseInt(wReader["DeviceStatus"]);
                    wDeviceStatus.IsPlan = StringUtils.parseInt(wReader["IsPlan"]);
                    wDeviceStatus.StatusHistory = StringUtils.parseInt(wReader["DeviceStatusL"]);
                    wDeviceStatus.StatusTime = StringUtils.parseDate(wReader["ChangeDate"]);
                    wDeviceStatus.StatusTimeEnd = StringUtils.parseDate(wReader["UpdateDate"]);
                    wDeviceStatus.Duration = ((int)DateTime.Now.Subtract(wDeviceStatus.StatusTime).TotalSeconds);
                    wDeviceStatus.AlarmCount = StringUtils.parseInt(wReader["AlarmCount"]);

                    wResult.Add(wDeviceStatus);
                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public List<DMSDeviceStatus> DMS_CurrentDeviceStatusList(BMSEmployee wLoginUser, List<int> wDeviceIDList, List<String> wAssetNoList, OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceStatus> wResult = new List<DMSDeviceStatus>();
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
                        " SELECT  p.*,ifnull(p.DeviceStatus,-1)+1 as ID , t.ID as DeviceIDL,t.Code as DeviceNo,t.Name as DeviceName,t.ImageIcon,t.ModelID,t.AssetNo,t.Remark," +
                        " t.WorkShopID,t.FactoryID,t.LineID,t.AreaID,t.TeamID, t8.Name as TeamName, t8.Code as TeamNo," +
                        " t1.Code as  ModelNo,t1.Name as ModelName,t1.DeviceType, t2.Name as DeviceTypeName," +
                        "  t2.Code as DeviceTypeCode,t3.Name as WorkShopName,t3.Code as WorkShopCode,t7.Code as AreaNo," +
                        " t7.Name as PositionText,t9.Name as FactoryName,t9.Code as FactoryCode, count(a1.DeviceID) as AlarmCount,    "
                                + " t4.Name as LineName,t4.Code as LineCode  FROM {0}.dms_device_ledger t "
                                + " left join {0}.dms_device_status p on t.AssetNo=p.DeviceID "
                                + " inner join {0}.dms_device_model t1 on t.ModelID=t1.ID "
                                + " left join {0}.dms_device_type t2 on t1.DeviceType=t2.ID "
                                + " left join {0}.bms_region t7 on t.AreaID=t7.ID "
                                + " left join {0}.bms_teammanage t8 on t.TeamID=t8.ID "
                                + " left join {0}.fmc_workshop t3 on t.WorkShopID=t3.ID "
                                + " left join {0}.fmc_factory t9 on t.FactoryID=t9.ID "
                                + " left join {0}.dms_device_alarm a1 on t.AssetNo=a1.DeviceID "
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
                    DMSDeviceStatus wDeviceStatus = new DMSDeviceStatus();

                    wDeviceStatus.ID = StringUtils.parseInt(wReader.ContainsKey("ID") ? wReader["ID"] : "");
                    wDeviceStatus.DeviceID = StringUtils.parseInt(wReader["DeviceIDL"]);
                    wDeviceStatus.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wDeviceStatus.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wDeviceStatus.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wDeviceStatus.ModelID = StringUtils.parseInt(wReader["ModelID"]);
                    wDeviceStatus.ModelName = StringUtils.parseString(wReader["ModelName"]);
                    wDeviceStatus.ModelNo = StringUtils.parseString(wReader["ModelNo"]);
                    wDeviceStatus.DeviceType = StringUtils.parseInt(wReader["DeviceType"]);
                    wDeviceStatus.DeviceTypeName = StringUtils.parseString(wReader["DeviceTypeName"]);
                    wDeviceStatus.DeviceTypeCode = StringUtils.parseString(wReader["DeviceTypeCode"]);
                    wDeviceStatus.WorkShopID = StringUtils.parseInt(wReader["WorkShopID"]);
                    wDeviceStatus.WorkShopName = StringUtils.parseString(wReader["WorkShopName"]);
                    wDeviceStatus.WorkShopCode = StringUtils.parseString(wReader["WorkShopCode"]);
                    wDeviceStatus.FactoryID = StringUtils.parseInt(wReader["FactoryID"]);
                    wDeviceStatus.FactoryName = StringUtils.parseString(wReader["FactoryName"]);
                    wDeviceStatus.FactoryCode = StringUtils.parseString(wReader["FactoryCode"]);
                    wDeviceStatus.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wDeviceStatus.LineName = StringUtils.parseString(wReader["LineName"]);
                    wDeviceStatus.LineCode = StringUtils.parseString(wReader["LineCode"]);
                    wDeviceStatus.TeamID = StringUtils.parseInt(wReader["TeamID"]);
                    wDeviceStatus.TeamNo = StringUtils.parseString(wReader["TeamNo"]);
                    wDeviceStatus.TeamName = StringUtils.parseString(wReader["TeamName"]);
                    wDeviceStatus.AreaID = StringUtils.parseInt(wReader["AreaID"]);
                    wDeviceStatus.AreaNo = StringUtils.parseString(wReader["AreaNo"]);
                    wDeviceStatus.Remark = StringUtils.parseString(wReader["Remark"]);
                    wDeviceStatus.ImageIcon = StringUtils.parseString(wReader["ImageIcon"]);
                    wDeviceStatus.PositionText = StringUtils.parseString(wReader["PositionText"]);
                    wDeviceStatus.Status = StringUtils.parseInt(wReader["DeviceStatus"]);
                    wDeviceStatus.StatusHistory = StringUtils.parseInt(wReader["DeviceStatusL"]);
                    wDeviceStatus.StatusTime = StringUtils.parseDate(wReader["ChangeDate"]);
                    wDeviceStatus.StatusTimeEnd = StringUtils.parseDate(wReader["UpdateDate"]);
                    wDeviceStatus.Duration = ((int)DateTime.Now.Subtract(wDeviceStatus.StatusTime).TotalSeconds);
                    wDeviceStatus.AlarmCount = StringUtils.parseInt(wReader["AlarmCount"]);

                    wResult.Add(wDeviceStatus);
                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public DMSDeviceStatus DMS_CurrentDeviceStatus(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, String wAssetNo,
            OutResult<Int32> wErrorCode)
        {
            DMSDeviceStatus wResult = new DMSDeviceStatus();
            try
            {
                List<DMSDeviceStatus> wDeviceStatusList = null;
                if (wDeviceID > 0 || StringUtils.isNotEmpty(wDeviceNo) || StringUtils.isNotEmpty(wAssetNo))
                    wDeviceStatusList = this.DMS_CurrentDeviceStatusList(wLoginUser, wDeviceID, wDeviceNo, "",
                    wAssetNo, -1, -1, -1, -1, -1, -1, -1, -1,-1, Pagination.Default, wErrorCode);

                if (wDeviceStatusList != null && wDeviceStatusList.Count > 0)
                {
                    wResult = wDeviceStatusList[0];
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



        public Dictionary<int, Dictionary<String, int>> DMS_SelectDeviceStatusTime(BMSEmployee wLoginUser, List<Int32> wID, String wCode, String wName,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID,
              DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            Dictionary<int, Dictionary<String, int>> wResult = new Dictionary<int, Dictionary<String, int>>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                if (wID == null)
                    wID = new List<Int32>();
                wID.RemoveAll(p => p <= 0);
                if (wCode == null)
                    wCode = "";


                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if (wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if (wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return wResult;
                }
                StringBuilder wSB = new StringBuilder();
                String wColTemp = ", sum(case when p.DeviceStatus={0} then p.Duration else 0 end) as Status{0} ";
                foreach (int wStatus in mStatusList)
                {
                    wSB.Append(StringUtils.Format(wColTemp, wStatus));
                }


                String wSQL = StringUtils.Format(
                        " SELECT t.ID as DeviceIDL" + wSB.ToString()
                        + " FROM {0}.dms_device_ledger t inner join {0}.dms_device_model t1 on t.ModelID=t1.ID "
                        + " left join {0}.dms_device_hisstatus p on t.AssetNo=p.DeviceID WHERE  1=1  "
                        + " and ( @wID ='' or t.ID IN( {1} ) )  "
                        + " and ( @wCode ='' or t.Code  = @wCode)  "
                        + " and ( @wName ='' or t.Name   = @wName )  "
                        + " and ( @wAssetNo ='' or t.AssetNo   = @wAssetNo )  "
                        + " and ( @wDeviceType <= 0 or t1.DeviceType  = @wDeviceType)   "
                        + " and ( @wModelID <= 0 or t.ModelID  = @wModelID)   "
                        + " and ( @wAreaID <= 0 or t.AreaID  = @wAreaID)  "
                        + " and ( @wTeamID <= 0 or t.TeamID  = @wTeamID)   "
                        + " and ( @wFactoryID <= 0 or t.FactoryID  = @wFactoryID)  "
                        + " and ( @wWorkShopID <= 0 or t.WorkShopID  = @wWorkShopID)  "
                        + " and ( @wLineID <= 0 or t.LineID  = @wLineID)    "
                        + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d') or p.UpdateDate <= str_to_date('2010-01-01', '%Y-%m-%d') or @wStartTime <= p.UpdateDate) "
                        + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d') or p.StartDate <= str_to_date('2010-01-01', '%Y-%m-%d') or @wEndTime >= p.StartDate) group by t.ID  ;"
                        , wInstance, wID.Count > 0 ? StringUtils.Join(",", wID) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wID", StringUtils.Join(",", wID));
                wParamMap.Add("wName", wName);
                wParamMap.Add("wCode", wCode);
                wParamMap.Add("wAssetNo", wAssetNo);
                wParamMap.Add("wDeviceType", wDeviceType);
                wParamMap.Add("wModelID", wModelID);
                wParamMap.Add("wTeamID", wTeamID);
                wParamMap.Add("wFactoryID", wFactoryID);
                wParamMap.Add("wWorkShopID", wWorkShopID);
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wAreaID", wAreaID);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }

                int wDeviceID = 0;
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wDeviceID = StringUtils.parseInt(wReader["DeviceIDL"]);
                    if (!wResult.ContainsKey(wDeviceID))
                        wResult.Add(wDeviceID, new Dictionary<string, int>());

                    foreach (int wStatus in mStatusList)
                    {
                        wResult[wDeviceID].Add(wStatus + "", StringUtils.parseInt(wReader["Status" + wStatus]));
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


        public List<DMSDeviceStatus> DMS_SelectDeviceStatusList(BMSEmployee wLoginUser, String wName,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID,
               int wActive, DateTime wStartTime, DateTime wEndTime, Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceStatus> wResult = new List<DMSDeviceStatus>();
            try
            {
                wResult = DMS_SelectDeviceStatusList(wLoginUser, null, "", wName, wAssetNo, wDeviceType,
                    wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wTeamID, wActive, wStartTime, wEndTime, wPagination,
                        wErrorCode);
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSDeviceStatus> DMS_SelectDeviceStatus(BMSEmployee wLoginUser, int wID, String wCode,
            String wAssetNo, DateTime wStartTime, DateTime wEndTime, Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceStatus> wResult = new List<DMSDeviceStatus>();
            try
            {
                if (wID > 0)
                {
                    List<Int32> wIDList = new List<Int32>();
                    wIDList.Add(wID);
                    wResult=this.DMS_SelectDeviceStatusDetailList(wLoginUser, wIDList, "", "", "", -1, -1, -1, -1, -1, -1, -1, null,
                     wStartTime, wEndTime, -1, wPagination, wErrorCode);
                    wResult.AddRange (this.DMS_SelectDeviceStatusList(wLoginUser, wIDList, "", "",
                     "", -1, -1, -1, -1, -1, -1 - 1, -1, -1, wStartTime, wEndTime, wPagination, wErrorCode));
                }
                else if (StringUtils.isNotEmpty(wCode))
                {
                    wResult = this.DMS_SelectDeviceStatusList(wLoginUser, null, wCode, "",
                 "", -1, -1, -1, -1, -1, -1, -1, -1, wStartTime, wEndTime, wPagination, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wAssetNo))
                {
                    wResult = this.DMS_SelectDeviceStatusList(wLoginUser, null, "", wAssetNo,
               "", -1, -1, -1, -1, -1, -1, -1, -1, wStartTime, wEndTime, wPagination, wErrorCode);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSDeviceStatus> DMS_SelectDeviceStatusList(BMSEmployee wLoginUser, List<Int32> wIDList, DateTime wStartTime, DateTime wEndTime, Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceStatus> wResult = new List<DMSDeviceStatus>();
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
                        wResult.AddRange(this.DMS_SelectDeviceStatusList(wLoginUser, wSelectList, "", "", "", -1, -1, -1, -1, -1,
                            -1, -1, -1, wStartTime, wEndTime, wPagination, wErrorCode));

                        wSelectList.Clear();
                    }
                    if (i == wIDList.Count - 1)
                    {
                        if (wSelectList.Count > 0)
                            wResult.AddRange(this.DMS_SelectDeviceStatusList(wLoginUser, wSelectList, "", "", "", -1, -1, -1, -1, -1, -1, -1, -1,
                                      wStartTime, wEndTime, wPagination, wErrorCode));
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



        public Dictionary<int, Dictionary<String, int>> DMS_SelectDeviceStatusDetailTime(BMSEmployee wLoginUser, List<Int32> wID, String wCode, String wName,
           String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID,
         DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            Dictionary<int, Dictionary<String, int>> wResult = new Dictionary<int, Dictionary<String, int>>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                if (wID == null)
                    wID = new List<Int32>();
                wID.RemoveAll(p => p <= 0);
                if (wCode == null)
                    wCode = "";


                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if (wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if (wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return wResult;
                }
                StringBuilder wSB = new StringBuilder();
                String wColTemp = ", sum(case when p.DeviceStatus={0} then p.Duration else 0 end) as Status{0} ";
                foreach (int wStatus in mStatusList)
                {
                    wSB.Append(StringUtils.Format(wColTemp, wStatus));
                }


                String wSQL = StringUtils.Format(
                        " SELECT t.ID as DeviceIDL" + wSB.ToString()
                        + " FROM {0}.dms_device_ledger t inner join {0}.dms_device_model t1 on t.ModelID=t1.ID "
                        + " left join {0}.dms_device_detailstatus p on t.AssetNo=p.DeviceID WHERE  1=1  "
                        + " and ( @wID ='' or t.ID IN( {1} ) )  "
                        + " and ( @wCode ='' or t.Code  = @wCode)  "
                        + " and ( @wName ='' or t.Name   = @wName )  "
                        + " and ( @wAssetNo ='' or t.AssetNo   = @wAssetNo )  "
                        + " and ( @wDeviceType <= 0 or t1.DeviceType  = @wDeviceType)   "
                        + " and ( @wModelID <= 0 or t.ModelID  = @wModelID)   "
                        + " and ( @wAreaID <= 0 or t.AreaID  = @wAreaID)  "
                        + " and ( @wTeamID <= 0 or t.TeamID  = @wTeamID)   "
                        + " and ( @wFactoryID <= 0 or t.FactoryID  = @wFactoryID)  "
                        + " and ( @wWorkShopID <= 0 or t.WorkShopID  = @wWorkShopID)  "
                        + " and ( @wLineID <= 0 or t.LineID  = @wLineID)    "
                        + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d') or p.UpdateDate <= str_to_date('2010-01-01', '%Y-%m-%d') or @wStartTime <= p.UpdateDate) "
                        + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d') or p.StartDate <= str_to_date('2010-01-01', '%Y-%m-%d') or @wEndTime >= p.StartDate) group by t.ID  ;"
                        , wInstance, wID.Count > 0 ? StringUtils.Join(",", wID) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wID", StringUtils.Join(",", wID));
                wParamMap.Add("wName", wName);
                wParamMap.Add("wCode", wCode);
                wParamMap.Add("wAssetNo", wAssetNo);
                wParamMap.Add("wDeviceType", wDeviceType);
                wParamMap.Add("wModelID", wModelID);
                wParamMap.Add("wTeamID", wTeamID);
                wParamMap.Add("wFactoryID", wFactoryID);
                wParamMap.Add("wWorkShopID", wWorkShopID);
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wAreaID", wAreaID);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }

                int wDeviceID = 0;
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wDeviceID = StringUtils.parseInt(wReader["DeviceIDL"]);
                    if (!wResult.ContainsKey(wDeviceID))
                        wResult.Add(wDeviceID, new Dictionary<string, int>());

                    foreach (int wStatus in mStatusList)
                    {
                        wResult[wDeviceID].Add(wStatus + "", StringUtils.parseInt(wReader["Status" + wStatus]));
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



        public Dictionary<int, Dictionary<String, int>> DMS_SelectDeviceStatusHistoryTime(BMSEmployee wLoginUser, List<Int32> wID, String wCode, String wName,
           String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID,
         DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            Dictionary<int, Dictionary<String, int>> wResult = new Dictionary<int, Dictionary<String, int>>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                if (wID == null)
                    wID = new List<Int32>();
                wID.RemoveAll(p => p <= 0);
                if (wCode == null)
                    wCode = "";


                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if (wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if (wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return wResult;
                }


                String wSQL = StringUtils.Format(
                        " SELECT  t.ID AS DeviceID, t1.DeviceID as AssetNo,t1.DeviceStatus,  count(t1.DeviceID) as ItemCount," +
                        " sum(case when t1.Active=1 then  (unix_timestamp(now())-unix_timestamp(t1.StartDate))  else  t1.Duration end )  as Duration, t1.DeviceActStatus " +
                        " FROM iplantfms.dms_device_ledger t inner join iplantfms.dms_device_hisstatus t1 on t.AssetNo = t1.DeviceID   " +
                        " and ( @wID ='' or t.ID IN( {1} ) )  " +
                        " and ( @wCode ='' or t.Code  = @wCode)  " +
                        " and ( @wName ='' or t.Name   = @wName )  " +
                        " and ( @wAssetNo ='' or t.AssetNo   = @wAssetNo )  " +
                        " and ( @wDeviceType <= 0 or t1.DeviceType  = @wDeviceType)   " +
                        " and ( @wModelID <= 0 or t.ModelID  = @wModelID)   " +
                        " and ( @wAreaID <= 0 or t.AreaID  = @wAreaID)  " +
                        " and ( @wTeamID <= 0 or t.TeamID  = @wTeamID)   " +
                        " and ( @wFactoryID <= 0 or t.FactoryID  = @wFactoryID)  " +
                        " and ( @wWorkShopID <= 0 or t.WorkShopID  = @wWorkShopID)  " +
                        " and ( @wLineID <= 0 or t.LineID  = @wLineID)    " +
                        " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d') or t1.EndDate <= str_to_date('2010-01-01', '%Y-%m-%d') or @wStartTime <= t1.EndDate) " +
                        " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= t1.StartDate)   group by DeviceID,  DeviceActStatus  ; "
                        , wInstance, wID.Count > 0 ? StringUtils.Join(",", wID) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wID", StringUtils.Join(",", wID));
                wParamMap.Add("wName", wName);
                wParamMap.Add("wCode", wCode);
                wParamMap.Add("wAssetNo", wAssetNo);
                wParamMap.Add("wDeviceType", wDeviceType);
                wParamMap.Add("wModelID", wModelID);
                wParamMap.Add("wTeamID", wTeamID);
                wParamMap.Add("wFactoryID", wFactoryID);
                wParamMap.Add("wWorkShopID", wWorkShopID);
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wAreaID", wAreaID);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }

                int wDeviceID = 0;
                int wStatus = 0;
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wDeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wStatus = StringUtils.parseInt(wReader["DeviceActStatus"]);
                    if (!wResult.ContainsKey(wDeviceID))
                        wResult.Add(wDeviceID, new Dictionary<string, int>());


                    if (!wResult[wDeviceID].ContainsKey(wStatus + ""))
                    {
                        wResult[wDeviceID].Add(wStatus + "", StringUtils.parseInt(wReader["Duration"]));
                    }
                    else
                    {
                        wResult[wDeviceID][wStatus + ""] = StringUtils.parseInt(wReader["Duration"]);
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


        public List<DMSDeviceStatus> DMS_SelectDeviceStatusDetailList(BMSEmployee wLoginUser, String wName, int wDeviceID,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID,
                List<int> wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceStatus> wResult = new List<DMSDeviceStatus>();
            try
            {
                wResult = DMS_SelectDeviceStatusDetailList(wLoginUser, StringUtils.parseListArgs(wDeviceID), "", wName, wAssetNo, wDeviceType,
                    wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wTeamID, wStatus, wStartTime, wEndTime, -1, wPagination,
                        wErrorCode);
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSDeviceStatus> DMS_SelectDeviceStatusDetail(BMSEmployee wLoginUser, int wID, String wCode,
            String wAssetNo, List<int> wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceStatus> wResult = new List<DMSDeviceStatus>();
            try
            {
                if (wID > 0)
                {
                    List<Int32> wIDList = new List<Int32>();
                    wIDList.Add(wID);
                    wResult = this.DMS_SelectDeviceStatusDetailList(wLoginUser, wIDList, "", "",
                     "", -1, -1, -1, -1, -1, -1 - 1, -1, wStatus, wStartTime, wEndTime, -1, wPagination, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wCode))
                {
                    wResult = this.DMS_SelectDeviceStatusDetailList(wLoginUser, null, wCode, "",
                 "", -1, -1, -1, -1, -1, -1, -1, wStatus, wStartTime, wEndTime, -1, wPagination, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wAssetNo))
                {
                    wResult = this.DMS_SelectDeviceStatusDetailList(wLoginUser, null, "", wAssetNo,
               "", -1, -1, -1, -1, -1, -1, -1, wStatus, wStartTime, wEndTime, -1, wPagination, wErrorCode);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSDeviceStatus> DMS_SelectDeviceStatusDetailList(BMSEmployee wLoginUser, List<Int32> wIDList, List<int> wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceStatus> wResult = new List<DMSDeviceStatus>();
            try
            {
                if (wIDList == null || wIDList.Count < 1)
                    return wResult;
                DateTime wBaseTime = new DateTime(2000, 1, 1);
                List<Int32> wSelectList = new List<Int32>();
                for (int i = 0; i < wIDList.Count; i++)
                {
                    wSelectList.Add(wIDList[i]);
                    if (((i + 1) % 25) == 0)
                    {
                        wResult.AddRange(this.DMS_SelectDeviceStatusDetailList(wLoginUser, wSelectList, "", "", "", -1, -1, -1, -1, -1,
                            -1, -1, wStatus, wStartTime, wEndTime, -1, wPagination, wErrorCode));

                        wSelectList.Clear();
                    }
                    if (i == wIDList.Count - 1)
                    {
                        if (wSelectList.Count > 0)
                            wResult.AddRange(this.DMS_SelectDeviceStatusDetailList(wLoginUser, wSelectList, "", "", "", -1, -1, -1, -1, -1, -1, -1, wStatus,
                                      wStartTime, wEndTime, -1, wPagination, wErrorCode));
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

        public List<DMSDeviceStatus> DMS_SelectDeviceCurrentStatusDetailList(BMSEmployee wLoginUser, List<Int32> wIDList,
               OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceStatus> wResult = new List<DMSDeviceStatus>();
            try
            {
                if (wIDList == null || wIDList.Count < 1)
                    return wResult;
                DateTime wBaseTime = new DateTime(2000, 1, 1);
                List<Int32> wSelectList = new List<Int32>();

                OutResult<Int32> wPageCount = new OutResult<int>(1);
                for (int i = 0; i < wIDList.Count; i++)
                {
                    wSelectList.Add(wIDList[i]);
                    if (i % 25 == 0)
                    {
                        wResult.AddRange(this.DMS_SelectDeviceStatusDetailList(wLoginUser, wSelectList, "", "", "", -1, -1, -1, -1, -1,
                            -1, -1, null, new DateTime(), new DateTime(), 1, Pagination.Create(1, 100000), wErrorCode));

                        wSelectList.Clear();
                    }
                    if (i == wIDList.Count - 1)
                    {
                        if (wSelectList.Count > 0)
                            wResult.AddRange(this.DMS_SelectDeviceStatusDetailList(wLoginUser, wSelectList, "", "", "", -1, -1, -1, -1, -1, -1, -1, null,
                                      new DateTime(), new DateTime(), 1, Pagination.Create(1, 100000), wErrorCode));
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


        #region 历史状态表操作
        public List<String> DMS_UpdateActiveStatusString(String wAssetNo, DateTime wStatusTime, int wStatus)
        {
            List<String> wResult = new List<string>();
            wResult.Add(StringUtils.Format(" update {0}.dms_device_hisstatus set EndDate=str_to_date('{1}','%Y-%m-%d %H:%i:%s') ,UpdateDate=str_to_date('{1}','%Y-%m-%d %H:%i:%s') ," +
               "Active=0,Duration=unix_timestamp(str_to_date('{1}','%Y-%m-%d %H:%i:%s'))-unix_timestamp(StartDate) where DeviceID='{2}' AND DeviceStatus= {3} and Active=1;"
               ,
              MESDBSource.DMS.getDBName(), wStatusTime.ToString("yyyy-MM-dd HH:mm:ss"), wAssetNo, wStatus));
            wResult.Add(StringUtils.Format(
              " update {0}.dms_device_hisstatus set Active=0 where DeviceID='{1}' and Active=1;",
             MESDBSource.DMS.getDBName(), wAssetNo));
            return wResult;
        }


        public String DMS_KeepActiveStatusString(DMSDeviceStatus wDMSDeviceStatus)
        {
            if (wDMSDeviceStatus == null || StringUtils.isEmpty(wDMSDeviceStatus.AssetNo) || wDMSDeviceStatus.StatusTimeEnd.Year <= 2010)
                return "";
            return StringUtils.Format(" update {0}.dms_device_hisstatus set EndDate=str_to_date('{1}','%Y-%m-%d %H:%i:%s') ,UpdateDate=str_to_date('{1}','%Y-%m-%d %H:%i:%s')," +
               "Duration=unix_timestamp(str_to_date('{1}','%Y-%m-%d %H:%i:%s'))-unix_timestamp(StartDate) where DeviceID='{2}' AND DeviceStatus= {3} and Active=1;"
               ,
              MESDBSource.DMS.getDBName(), wDMSDeviceStatus.StatusTimeEnd.ToString("yyyy-MM-dd HH:mm:ss"), wDMSDeviceStatus.AssetNo, wDMSDeviceStatus.Status);
        }



        public String DMS_InsertActiveStatusString(DMSDeviceStatus wDMSDeviceStatus)
        {
            if (wDMSDeviceStatus == null || StringUtils.isEmpty(wDMSDeviceStatus.AssetNo) || wDMSDeviceStatus.StatusTime.Year <= 2010)
                return "";

            if (wDMSDeviceStatus.StatusTimeEnd < wDMSDeviceStatus.StatusTime)
                wDMSDeviceStatus.StatusTimeEnd = wDMSDeviceStatus.StatusTime;

            if (wDMSDeviceStatus.Duration <= 0)
            {
                wDMSDeviceStatus.Duration = ((int)wDMSDeviceStatus.StatusTimeEnd.Subtract(wDMSDeviceStatus.StatusTime).TotalSeconds);
            }

            return StringUtils.Format(" Insert into {0}.dms_device_hisstatus (DeviceID,DeviceStatus,StartDate,EndDate,Duration,UpdateDate,Active,DeviceActStatus) " +
                "values ({1},{2},'{3}','{4}',{5},'{4}',1,{6});",
              MESDBSource.DMS.getDBName(), wDMSDeviceStatus.AssetNo, wDMSDeviceStatus.Status, wDMSDeviceStatus.StatusTime.ToString("yyyy-MM-dd HH:mm:ss"),
              wDMSDeviceStatus.StatusTimeEnd.ToString("yyyy-MM-dd HH:mm:ss"), wDMSDeviceStatus.Duration, wDMSDeviceStatus.ActStatus);
        }

        #endregion
        public String DMS_UpdateCurrentStatusString(DMSDeviceStatus wDMSDeviceStatus)
        {
            if (wDMSDeviceStatus == null || StringUtils.isEmpty(wDMSDeviceStatus.AssetNo) || wDMSDeviceStatus.StatusTimeEnd.Year <= 2010)
                return "";

            if (wDMSDeviceStatus.ID > 0)
            {

                return StringUtils.Format(" Update  {0}.dms_device_status  set  UpdateDate =str_to_date('{1}','%Y-%m-%d %H:%i:%s') ," +
                    " ChangeDate=str_to_date('{2}','%Y-%m-%d %H:%i:%s'),DeviceStatus={3},DeviceStatusL={4}" +
                    " where  DeviceID='{5}' ", MESDBSource.DMS.getDBName(), wDMSDeviceStatus.StatusTimeEnd.ToString("yyyy-MM-dd HH:mm:ss"),
                    wDMSDeviceStatus.StatusTime.ToString("yyyy-MM-dd HH:mm:ss"), wDMSDeviceStatus.Status, wDMSDeviceStatus.StatusHistory, wDMSDeviceStatus.AssetNo);

            }
            else
            {
                return StringUtils.Format(" Insert into {0}.dms_device_status (DeviceID,DeviceStatus,ChangeDate,UpdateDate,DeviceStatusL) " +
               "values ({1},{2},'{3}','{4}',{5});", MESDBSource.DMS.getDBName(), wDMSDeviceStatus.AssetNo, wDMSDeviceStatus.Status,
               wDMSDeviceStatus.StatusTime.ToString("yyyy-MM-dd HH:mm:ss"), wDMSDeviceStatus.StatusTimeEnd.ToString("yyyy-MM-dd HH:mm:ss"),
                    wDMSDeviceStatus.StatusHistory);

            }
        }


        #region 历史详情表操作

        public List<String> DMS_CloseDetailStatusString(ICollection<DMSDeviceStatus> wDMSDeviceStatusList, DateTime wStatusTime)
        {
            List<String> wResult = new List<string>();
            if (wDMSDeviceStatusList == null || wDMSDeviceStatusList.Count <= 0 || wStatusTime.Year <= 2010)
                return wResult;

            foreach (DMSDeviceStatus wDMSDeviceStatus in wDMSDeviceStatusList)
            {
                if (wDMSDeviceStatus.ID > 0)
                {
                    wResult.Add(StringUtils.Format(" update {0}.dms_device_detailstatus set UpdateDate=str_to_date('{1}','%Y-%m-%d %H:%i:%s') ," +
               "Active=0,Duration=unix_timestamp(str_to_date('{1}','%Y-%m-%d %H:%i:%s'))-unix_timestamp(StartDate) where DeviceID='{2}' AND DeviceStatus= {3} and Active=1;",
                    MESDBSource.DMS.getDBName(), wStatusTime.ToString("yyyy-MM-dd HH:mm:ss"), wDMSDeviceStatus.AssetNo, wDMSDeviceStatus.Status));
                }
                else
                {
                    wResult.Add(StringUtils.Format(" INSERT INTO  {0}.dms_device_detailstatus (DeviceID,DeviceStatus,StartDate,UpdateDate,Duration,Active)   " +
                         "values ({1},{2},'{3}','{4}',{5},0);",
                    MESDBSource.DMS.getDBName(), wDMSDeviceStatus.AssetNo, wDMSDeviceStatus.Status, wDMSDeviceStatus.StatusTime.ToString("yyyy-MM-dd HH:mm:ss"),
                     wStatusTime.ToString("yyyy-MM-dd HH:mm:ss"), ((int)wStatusTime.Subtract(wDMSDeviceStatus.StatusTime).TotalSeconds)));
                }
            }
            return wResult;
        }



        public List<String> DMS_KeepDetailStatusString(ICollection<DMSDeviceStatus> wDMSDeviceStatusList, DateTime wStatusTime)
        {
            List<String> wResult = new List<string>();
            if (wDMSDeviceStatusList == null || wDMSDeviceStatusList.Count <= 0 || wStatusTime.Year <= 2010)
                return wResult;

            foreach (DMSDeviceStatus wDMSDeviceStatus in wDMSDeviceStatusList)
            {
                if (wDMSDeviceStatus.ID > 0)
                {
                    wResult.Add(StringUtils.Format(" update {0}.dms_device_detailstatus set UpdateDate=str_to_date('{1}','%Y-%m-%d %H:%i:%s') ," +
               " Duration=unix_timestamp(str_to_date('{1}','%Y-%m-%d %H:%i:%s'))-unix_timestamp(StartDate) where DeviceID='{2}' AND DeviceStatus= {3} and Active=1;",
                    MESDBSource.DMS.getDBName(), wStatusTime.ToString("yyyy-MM-dd HH:mm:ss"), wDMSDeviceStatus.AssetNo, wDMSDeviceStatus.Status));
                }
                else
                {

                    wResult.Add(StringUtils.Format(" INSERT INTO  {0}.dms_device_detailstatus (DeviceID,DeviceStatus,StartDate,UpdateDate,Duration,Active)   " +
                         "values ({1},{2},'{3}','{4}',{5},1);",
                    MESDBSource.DMS.getDBName(), wDMSDeviceStatus.AssetNo, wDMSDeviceStatus.Status, wDMSDeviceStatus.StatusTime.ToString("yyyy-MM-dd HH:mm:ss"),
                     wStatusTime.ToString("yyyy-MM-dd HH:mm:ss"), ((int)wStatusTime.Subtract(wDMSDeviceStatus.StatusTime).TotalSeconds)));
                }
            }
            return wResult;
        }





        #endregion
    }
}
