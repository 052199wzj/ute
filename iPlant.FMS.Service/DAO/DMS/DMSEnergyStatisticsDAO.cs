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
    class DMSEnergyStatisticsDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSEnergyStatisticsDAO));




        private static DMSEnergyStatisticsDAO Instance;

        private DMSEnergyStatisticsDAO() : base()
        {

        }

        public static DMSEnergyStatisticsDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSEnergyStatisticsDAO();
            return Instance;
        }

        // (public\s+[a-zA-z0-9_\<\>]+\s+[a-zA-z0-9_\<\>]+\()([^\)]*)\)

        private DMSEnergyStatistics DMS_CheckEnergyStatistics(BMSEmployee wLoginUser, DMSEnergyStatistics wDMSEnergyStatistics
                 , OutResult<Int32> wErrorCode)
        {
            DMSEnergyStatistics wResult = new DMSEnergyStatistics();
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();


                String wSQL = StringUtils.Format("SELECT t.*,t1.Code as DeviceNo,t1.Name as DeviceName,t1.AssetNo FROM {0}.dms_energy_stat t" +
                    " inner join {0}.dms_device_ledger  t1 on t.DeviceID=t1.ID " +
                    " WHERE  t.ID != @wID  AND   @wDeviceID = t.DeviceID  and t.StatStartDate <= @wStatStartDate and  t.StatEndDate > @wStatStartDate " +
                    " and t.EnergyType=@wEnergyType and t.StatType=@wStatType and t.Active=1;", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wDMSEnergyStatistics.ID);
                wParamMap.Add("wDeviceID", wDMSEnergyStatistics.DeviceID);
                wParamMap.Add("wStatStartDate", wDMSEnergyStatistics.StatStartDate);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wResult.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wResult.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wResult.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wResult.StatType = StringUtils.parseInt(wReader["StatType"]);
                    wResult.EnergyType = StringUtils.parseInt(wReader["EnergyType"]);
                    wResult.StatConsumption = StringUtils.parseDouble(wReader["StatConsumption"]);
                    wResult.UpdateTime = StringUtils.parseDate(wReader["UpdateTime"]);
                    wResult.StatStartDate = StringUtils.parseDate(wReader["StatStartDate"]);
                    wResult.StatEndDate = StringUtils.parseDate(wReader["StatEndDate"]);
                    wResult.Active = StringUtils.parseInt(wReader["Active"]);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSEnergyStatistics> DMS_SelectEnergyStatisticsList(BMSEmployee wLoginUser, List<int> wDeviceIDList,
            int wAreaID, int wStatType, int wEnergyType, DateTime wStartTime, DateTime wEndTime,
              int wActive, OutResult<Int32> wErrorCode)
        {
            List<DMSEnergyStatistics> wResult = new List<DMSEnergyStatistics>();
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.*,t1.Code as DeviceNo,t1.Name as DeviceName,t1.AssetNo FROM {0}.dms_energy_stat t" +
                    " inner join {0}.dms_device_ledger  t1 on t.DeviceID=t1.ID WHERE 1=1 "
                        + " and ( @wAreaID <= 0 or t1.AreaID  = @wAreaID) "
                        + " and ( @wStatType ='' or t.StatType  = @wStatType)  "
                        + " and ( @wEnergyType ='' or t.EnergyType  = @wEnergyType)  "
                        + " and t.StatStartDate >= @wStartTime and  t.StatStartDate < @wEndTime"
                        + " and ( @wActive < 0 or t.Active  = @wActive) "
                        + " and ( @wDeviceID ='' or t.DeviceID IN( {1} ) ) ; ", wInstance, wDeviceIDList.Count > 0 ? StringUtils.Join(",", wDeviceIDList) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wAreaID", wAreaID);
                wParamMap.Add("wStatType", wStatType);
                wParamMap.Add("wEnergyType", wEnergyType);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wDeviceID", StringUtils.Join(",", wDeviceIDList));
                wParamMap.Add("wActive", wActive);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSEnergyStatistics wDeviceModelW = new DMSEnergyStatistics();

                    wDeviceModelW.ID = StringUtils.parseInt(wReader["ID"]);
                    wDeviceModelW.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wDeviceModelW.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wDeviceModelW.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wDeviceModelW.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wDeviceModelW.StatType = StringUtils.parseInt(wReader["StatType"]);
                    wDeviceModelW.EnergyType = StringUtils.parseInt(wReader["EnergyType"]);
                    wDeviceModelW.StatConsumption = StringUtils.parseDouble(wReader["StatConsumption"]);
                    wDeviceModelW.UpdateTime = StringUtils.parseDate(wReader["UpdateTime"]);
                    wDeviceModelW.StatStartDate = StringUtils.parseDate(wReader["StatStartDate"]);
                    wDeviceModelW.StatEndDate = StringUtils.parseDate(wReader["StatEndDate"]);
                    wDeviceModelW.Active = StringUtils.parseInt(wReader["Active"]);

                    wResult.Add(wDeviceModelW);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public List<DMSEnergyStatistics> DMS_SelectEnergyStatisticsWeekList(BMSEmployee wLoginUser, List<int> wDeviceIDList,
            int wAreaID, int wEnergyType, DateTime wStartTime, DateTime wEndTime,
              OutResult<Int32> wErrorCode)
        {
            List<DMSEnergyStatistics> wResult = new List<DMSEnergyStatistics>();
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.DeviceID,t.EnergyType, str_to_date( DATE_FORMAT(t.StatStartDate,'%Y-%u-1'),'%Y-%u-%w') as WeekDate," +
                    " sum(t.StatConsumption) as SumConsumption  ,  t1.Code as DeviceNo,t1.Name as DeviceName,t1.AssetNo FROM {0}.dms_energy_stat t" +
                    " inner join {0}.dms_device_ledger  t1 on t.DeviceID=t1.ID WHERE t.StatType  = @wStatType and  t.Active=1  "
                        + " and ( @wAreaID <= 0 or t1.AreaID  = @wAreaID) " 
                        + " and ( @wEnergyType ='' or t.EnergyType  = @wEnergyType)  "
                        + " and str_to_date( DATE_FORMAT(t.StatStartDate,'%Y-%u-1'),'%Y-%u-%w')  >= @wStartTime "
                        + " and str_to_date( DATE_FORMAT(t.StatStartDate,'%Y-%u-1'),'%Y-%u-%w') < @wEndTime "
                        + " and ( @wDeviceID ='' or t.DeviceID IN( {1} ) ) " +
                        " group by t.DeviceID,t.EnergyType,WeekDate; ", wInstance, wDeviceIDList.Count > 0 ? StringUtils.Join(",", wDeviceIDList) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wAreaID", wAreaID);
                wParamMap.Add("wStatType",((int)DMSStatTypes.Day));
                wParamMap.Add("wEnergyType", wEnergyType);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wDeviceID", StringUtils.Join(",", wDeviceIDList)); 

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSEnergyStatistics wDeviceModelW = new DMSEnergyStatistics();

                   
                    wDeviceModelW.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wDeviceModelW.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wDeviceModelW.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wDeviceModelW.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wDeviceModelW.StatType = ((int)DMSStatTypes.Week);
                    wDeviceModelW.EnergyType = StringUtils.parseInt(wReader["EnergyType"]);
                    wDeviceModelW.StatConsumption = StringUtils.parseDouble(wReader["SumConsumption"]); 
                    wDeviceModelW.StatStartDate = StringUtils.parseDate(wReader["WeekDate"]);
                    wDeviceModelW.StatEndDate = wDeviceModelW.StatStartDate.AddDays(7).AddMilliseconds(-1);
                    wDeviceModelW.Active = 1;

                    wResult.Add(wDeviceModelW);
                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
        public List<DMSEnergyStatistics> DMS_SelectEnergyStatisticsMonthList(BMSEmployee wLoginUser, List<int> wDeviceIDList,
          int wAreaID, int wEnergyType, DateTime wStartTime, DateTime wEndTime,
            OutResult<Int32> wErrorCode)
        {
            List<DMSEnergyStatistics> wResult = new List<DMSEnergyStatistics>();
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.DeviceID,t.EnergyType, str_to_date( DATE_FORMAT(t.StatStartDate,'%Y-%m-1'),'%Y-%m-%d') as MonthDate," +
                    " sum(t.StatConsumption) as SumConsumption  ,  t1.Code as DeviceNo,t1.Name as DeviceName,t1.AssetNo FROM {0}.dms_energy_stat t" +
                    " inner join {0}.dms_device_ledger  t1 on t.DeviceID=t1.ID WHERE t.StatType  = @wStatType and  t.Active=1  "
                        + " and ( @wAreaID <= 0 or t1.AreaID  = @wAreaID) "
                        + " and ( @wEnergyType ='' or t.EnergyType  = @wEnergyType)  "
                        + " and  str_to_date( DATE_FORMAT(t.StatStartDate,'%Y-%m-1'),'%Y-%m-%d') >= @wStartTime "
                        + " and  str_to_date( DATE_FORMAT(t.StatStartDate,'%Y-%m-1'),'%Y-%m-%d') < @wEndTime "
                        + " and ( @wDeviceID ='' or t.DeviceID IN( {1} ) ) " +
                        " group by t.DeviceID,t.EnergyType,MonthDate; ", wInstance, wDeviceIDList.Count > 0 ? StringUtils.Join(",", wDeviceIDList) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wAreaID", wAreaID);
                wParamMap.Add("wStatType", ((int)DMSStatTypes.Day));
                wParamMap.Add("wEnergyType", wEnergyType);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wDeviceID", StringUtils.Join(",", wDeviceIDList));

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSEnergyStatistics wDeviceModelW = new DMSEnergyStatistics();

                    wDeviceModelW.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wDeviceModelW.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wDeviceModelW.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wDeviceModelW.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wDeviceModelW.StatType = ((int)DMSStatTypes.Week);
                    wDeviceModelW.EnergyType = StringUtils.parseInt(wReader["EnergyType"]);
                    wDeviceModelW.StatConsumption = StringUtils.parseDouble(wReader["SumConsumption"]);
                    wDeviceModelW.StatStartDate = StringUtils.parseDate(wReader["MonthDate"]);
                    wDeviceModelW.StatEndDate = wDeviceModelW.StatStartDate.AddMonths(1).AddMilliseconds(-1);
                    wDeviceModelW.Active = 1;

                    wResult.Add(wDeviceModelW);
                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;

        }
        public List<DMSEnergyStatistics> DMS_SelectEnergyStatisticsQuarterList(BMSEmployee wLoginUser, List<int> wDeviceIDList,
          int wAreaID, int wEnergyType, DateTime wStartTime, DateTime wEndTime,
            OutResult<Int32> wErrorCode)
        {
            List<DMSEnergyStatistics> wResult = new List<DMSEnergyStatistics>();
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.DeviceID,t.EnergyType, str_to_date( concat(  year(t.StatStartDate),'-',(quarter(t.StatStartDate) * 3)-2,'-1'),'%Y-%m-%d') as  QuarterDate ," +
                    " sum(t.StatConsumption) as SumConsumption  ,  t1.Code as DeviceNo,t1.Name as DeviceName,t1.AssetNo FROM {0}.dms_energy_stat t" +
                    " inner join {0}.dms_device_ledger  t1 on t.DeviceID=t1.ID WHERE t.StatType  = @wStatType and  t.Active=1  "
                        + " and ( @wAreaID <= 0 or t1.AreaID  = @wAreaID) "
                        + " and ( @wEnergyType ='' or t.EnergyType  = @wEnergyType)  "
                        + " and  str_to_date( concat(  year(t.StatStartDate),'-',(quarter(t.StatStartDate) * 3)-2,'-1'),'%Y-%m-%d') >=  @wStartTime "
                        + " and  str_to_date( concat(  year(t.StatStartDate),'-',(quarter(t.StatStartDate) * 3)-2,'-1'),'%Y-%m-%d') < @wEndTime "
                        + " and ( @wDeviceID ='' or t.DeviceID IN( {1} ) ) " +
                        " group by t.DeviceID,t.EnergyType,QuarterDate; ", wInstance, wDeviceIDList.Count > 0 ? StringUtils.Join(",", wDeviceIDList) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wAreaID", wAreaID);
                wParamMap.Add("wStatType", ((int)DMSStatTypes.Day));
                wParamMap.Add("wEnergyType", wEnergyType);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wDeviceID", StringUtils.Join(",", wDeviceIDList));

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSEnergyStatistics wDeviceModelW = new DMSEnergyStatistics();

                    wDeviceModelW.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wDeviceModelW.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wDeviceModelW.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wDeviceModelW.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wDeviceModelW.StatType = ((int)DMSStatTypes.Week);
                    wDeviceModelW.EnergyType = StringUtils.parseInt(wReader["EnergyType"]);
                    wDeviceModelW.StatConsumption = StringUtils.parseDouble(wReader["SumConsumption"]);
                    wDeviceModelW.StatStartDate = StringUtils.parseDate(wReader["QuarterDate"]);
                    wDeviceModelW.StatEndDate = wDeviceModelW.StatStartDate.AddMonths(1).AddMilliseconds(-1);
                    wDeviceModelW.Active = 1;

                    wResult.Add(wDeviceModelW);
                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;

        }
        public List<DMSEnergyStatistics> DMS_SelectEnergyStatisticsYearList(BMSEmployee wLoginUser, List<int> wDeviceIDList,
        int wAreaID, int wEnergyType, DateTime wStartTime, DateTime wEndTime,
          OutResult<Int32> wErrorCode)
        {

            List<DMSEnergyStatistics> wResult = new List<DMSEnergyStatistics>();
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.DeviceID,t.EnergyType, str_to_date( concat(  year(t.StatStartDate),'-01','-01'),'%Y-%m-%d') as  YearDate ," +
                    " sum(t.StatConsumption) as SumConsumption  ,  t1.Code as DeviceNo,t1.Name as DeviceName,t1.AssetNo FROM {0}.dms_energy_stat t" +
                    " inner join {0}.dms_device_ledger  t1 on t.DeviceID=t1.ID WHERE t.StatType  = @wStatType and  t.Active=1  "
                        + " and ( @wAreaID <= 0 or t1.AreaID  = @wAreaID) "
                        + " and ( @wEnergyType ='' or t.EnergyType  = @wEnergyType)  "
                        + " and  str_to_date( concat(  year(t.StatStartDate),'-01','-01'),'%Y-%m-%d') >=  @wStartTime " 
                        + " and  str_to_date( concat(  year(t.StatStartDate),'-01','-01'),'%Y-%m-%d') < @wEndTime "
                        + " and ( @wDeviceID ='' or t.DeviceID IN( {1} ) ) " +
                        " group by t.DeviceID,t.EnergyType,YearDate; ", wInstance, wDeviceIDList.Count > 0 ? StringUtils.Join(",", wDeviceIDList) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wAreaID", wAreaID);
                wParamMap.Add("wStatType", ((int)DMSStatTypes.Day));
                wParamMap.Add("wEnergyType", wEnergyType);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wDeviceID", StringUtils.Join(",", wDeviceIDList));

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSEnergyStatistics wDeviceModelW = new DMSEnergyStatistics();

                    wDeviceModelW.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wDeviceModelW.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wDeviceModelW.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wDeviceModelW.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wDeviceModelW.StatType = ((int)DMSStatTypes.Week);
                    wDeviceModelW.EnergyType = StringUtils.parseInt(wReader["EnergyType"]);
                    wDeviceModelW.StatConsumption = StringUtils.parseDouble(wReader["SumConsumption"]);
                    wDeviceModelW.StatStartDate = StringUtils.parseDate(wReader["YearDate"]);
                    wDeviceModelW.StatEndDate = wDeviceModelW.StatStartDate.AddMonths(1).AddMilliseconds(-1);
                    wDeviceModelW.Active = 1;

                    wResult.Add(wDeviceModelW);
                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSEnergyStatistics> DMS_SelectEnergyStatisticsList(BMSEmployee wLoginUser, List<int> wDeviceIDList,
            int wAreaID, int wStatType, int wEnergyType, DateTime wStartTime, DateTime wEndTime,
              OutResult<Int32> wErrorCode)
        {
            List<DMSEnergyStatistics> wResult = new List<DMSEnergyStatistics>();
            try
            {
                switch (wStatType)
                {
                    case ((int)DMSStatTypes.Week):
                        wResult = this.DMS_SelectEnergyStatisticsWeekList(wLoginUser, wDeviceIDList,
                            wAreaID, wEnergyType, wStartTime, wEndTime,
                             wErrorCode);
                        break;
                    case ((int)DMSStatTypes.Month):
                        wResult = this.DMS_SelectEnergyStatisticsMonthList(wLoginUser, wDeviceIDList,
                            wAreaID, wEnergyType, wStartTime, wEndTime,
                             wErrorCode);
                        break;
                    case ((int)DMSStatTypes.Quarter):
                        wResult = this.DMS_SelectEnergyStatisticsQuarterList(wLoginUser, wDeviceIDList,
                            wAreaID, wEnergyType, wStartTime, wEndTime,
                             wErrorCode);
                        break;
                    case ((int)DMSStatTypes.Year):
                        wResult = this.DMS_SelectEnergyStatisticsYearList(wLoginUser, wDeviceIDList,
                            wAreaID, wEnergyType, wStartTime, wEndTime,
                             wErrorCode);
                        break;
                    default:
                        wResult = this.DMS_SelectEnergyStatisticsList(wLoginUser, wDeviceIDList,
                           wAreaID, wStatType, wEnergyType, wStartTime, wEndTime,
                             1, wErrorCode);
                        break;
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
         
        public List<DMSEnergyStatistics> DMS_SelectEnergyStatisticsList(BMSEmployee wLoginUser, int wDeviceID,
            int wEnergyType, DateTime wStartTime, DateTime wEndTime, int wActive, OutResult<Int32> wErrorCode)
        {
            List<DMSEnergyStatistics> wResult = new List<DMSEnergyStatistics>();
            if (wDeviceID <= 0)
                return wResult;
            return this.DMS_SelectEnergyStatisticsList(wLoginUser, new List<int>() { wDeviceID }, -1, -1, wEnergyType, wStartTime, wEndTime,
                    wActive, wErrorCode);
        }


        public void DMS_UpdateEnergyStatistics(BMSEmployee wLoginUser, DMSEnergyStatistics wDMSEnergyStatistics, OutResult<Int32> wErrorCode)
        {
            lock (mLockHelper)
            {
                try
                {

                    if (wDMSEnergyStatistics == null || wDMSEnergyStatistics.DeviceID <= 0 || wDMSEnergyStatistics.StatType <= 0 || wDMSEnergyStatistics.EnergyType <= 0 || wDMSEnergyStatistics.StatConsumption < 0)
                    {
                        wErrorCode.set(MESException.Parameter.Value);
                        return;
                    }

                    DMSEnergyStatistics wDMSEnergyStatisticsDB = this.DMS_CheckEnergyStatistics(wLoginUser, wDMSEnergyStatistics, wErrorCode);
                    if (wDMSEnergyStatisticsDB.ID > 0)
                    {
                        if (wDMSEnergyStatistics.ID > 0)
                        {
                            wErrorCode.Result = MESException.Duplication.Value;
                            return;
                        }
                        else
                        {

                            wDMSEnergyStatistics.ID = wDMSEnergyStatisticsDB.ID;
                        }
                    }
                    wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();


                    Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                    wParamMap.Add("DeviceID", wDMSEnergyStatistics.DeviceID);
                    wParamMap.Add("StatType", wDMSEnergyStatistics.StatType);
                    wParamMap.Add("EnergyType", wDMSEnergyStatistics.EnergyType);
                    wParamMap.Add("StatConsumption", wDMSEnergyStatistics.StatConsumption);
                    wParamMap.Add("UpdateTime", DateTime.Now);
                    wParamMap.Add("StatStartDate", wDMSEnergyStatistics.StatStartDate);
                    wParamMap.Add("StatEndDate", wDMSEnergyStatistics.StatEndDate);
                    wParamMap.Add("Active", wDMSEnergyStatistics.Active);

                    if (wDMSEnergyStatistics.ID <= 0)
                    {

                        wDMSEnergyStatistics.ID = this.Insert(StringUtils.Format("{0}.dms_energy_stat", wInstance), wParamMap);

                    }
                    else
                    {
                        wParamMap.Add("ID", wDMSEnergyStatistics.ID);
                        this.Update(StringUtils.Format("{0}.dms_energy_stat", wInstance), "ID", wParamMap);
                    }
                }
                catch (Exception e)
                {
                    logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                    wErrorCode.set(MESException.DBSQL.Value);
                }
            }
        }



        public void DMS_ActiveEnergyStatistics(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive,
                OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                if (wIDList == null)
                    wIDList = new List<Int32>();

                wIDList.RemoveAll(p => p <= 0);
                if (wIDList.Count <= 0)
                    return;
                if (wActive != 1)
                    wActive = 2;
                String wSql = StringUtils.Format("UPDATE {0}.dms_energy_stat SET Active ={1} WHERE ID IN({2}) ;",
                        wInstance, wActive, StringUtils.Join(",", wIDList));

                this.ExecuteSqlTransaction(wSql);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public void DMS_DeleteEnergyStatistics(BMSEmployee wLoginUser, List<Int32> wIDList,
                OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                if (wIDList == null)
                    wIDList = new List<Int32>();
                wIDList.RemoveAll(p => p <= 0);
                if (wIDList.Count <= 0)
                    return;

                String wSql = StringUtils.Format("Delete from {0}.dms_energy_stat WHERE Active !=1  and ID IN({1}) ;",
                        wInstance, StringUtils.Join(",", wIDList));

                this.ExecuteSqlTransaction(wSql);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

    }
}
