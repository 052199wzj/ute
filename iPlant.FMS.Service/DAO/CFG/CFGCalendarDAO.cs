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
    class CFGCalendarDAO : BaseDAO
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(CFGCalendarDAO));


        private static CFGCalendarDAO Instance = null;

        private CFGCalendarDAO() : base()
        {

        }

        public static CFGCalendarDAO getInstance()
        {
            if (Instance == null)
                Instance = new CFGCalendarDAO();
            return Instance;
        }



        // 车间工作日历
        // wSqlDataReader\[(\"\w+\")\] wSqlDataReader.get($1)
        public int CFG_AddHoliday(BMSEmployee wLoginUser, int WorkShopID, CFGCalendar wCalendarHoliday,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            { 
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0
                        && wCalendarHoliday.HolidayDate.CompareTo(DateTime.Now.Date) > 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format(
                            "select count(*) as ID from {0}.cfg_factorycalendar where HolidayDate=@HolidayDate and WorkShopID=@WorkShopID",
                            wInstance);
                    wParms.Clear();
                    wParms.Add("HolidayDate", wCalendarHoliday.HolidayDate);
                    wParms.Add("WorkShopID", WorkShopID);

                    long wHoliday = 0;
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wHoliday = StringUtils.parseLong(wSqlDataReader["ID"]);
                    }

                    if (wHoliday < 1)
                    {
                        wSQLText = StringUtils.Format("Insert Into {0}.cfg_factorycalendar", wInstance)
                                + "(HolidayDate,Year,Active,OperatorID,OperationTime,OperatorName,WorkShopID) "
                                + " Values(@HolidayDate,@Year,@Active,@OperatorID,@OperationTime,@OperatorName,@WorkShopID)";
                        wParms.Clear();
                        wParms.Add("HolidayDate", wCalendarHoliday.HolidayDate);
                        wParms.Add("Year", wCalendarHoliday.HolidayDate.Year);
                        wParms.Add("Active", wCalendarHoliday.Active);
                        wParms.Add("OperatorID", wCalendarHoliday.OperatorID);
                        wParms.Add("OperationTime", DateTime.Now);
                        wParms.Add("OperatorName", wCalendarHoliday.OperatorName);
                        wParms.Add("WorkShopID", WorkShopID);
                        wSQLText = this.DMLChange(wSQLText);
                        mDBPool.update(wSQLText, wParms);
                    }
                    else
                    {
                        wSQLText = StringUtils.Format("update {0}.cfg_factorycalendar", wInstance)
                                + " set Active=@Active,OperatorID=@OperatorID,OperationTime=@OperationTime "
                                + " where HolidayDate=@HolidayDate and WorkShopID=@WorkShopID";
                        wParms.Clear();
                        wParms.Add("Active", wCalendarHoliday.Active);
                        wParms.Add("OperatorID", wCalendarHoliday.OperatorID);
                        wParms.Add("OperationTime", DateTime.Now);
                        wParms.Add("HolidayDate", wCalendarHoliday.HolidayDate);
                        wParms.Add("WorkShopID", WorkShopID);
                        wSQLText = this.DMLChange(wSQLText);
                        mDBPool.update(wSQLText, wParms);
                    }
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("CFG_AddHoliday", ex);

            }
            finally
            {

            }
            return wErrorCode.Result;
        }

        public int CFG_AddHolidayList(BMSEmployee wLoginUser, int WorkShopID, List<CFGCalendar> wHolidayList,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    foreach (CFGCalendar wCalendarHoliday in wHolidayList)
                    {
                        if (wCalendarHoliday.HolidayDate.CompareTo(DateTime.Now.Date) > 0)
                        {
                            this.CFG_AddHoliday(wLoginUser, WorkShopID, wCalendarHoliday, wErrorCode);
                            if (wErrorCode.Result != 0)
                                break;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("CFG_AddHolidayList", ex);

            }
            return wErrorCode.Result;
        }

        public int CFG_RemoveHoliday(BMSEmployee wLoginUser, int WorkShopID, CFGCalendar wCalendarHoliday,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0
                        && wCalendarHoliday.HolidayDate.CompareTo(DateTime.Now.Date) > 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("update {0}.cfg_factorycalendar", wInstance)
                            + " set Active=0,OperatorID=@OperatorID,OperationTime=@OperationTime "
                            + "where HolidayDate=@HolidayDate and WorkShopID=@WorkShopID";
                    wParms.Clear();
                    wParms.Add("OperatorID", wCalendarHoliday.OperatorID);
                    wParms.Add("OperationTime", DateTime.Now);
                    wParms.Add("HolidayDate", wCalendarHoliday.HolidayDate);
                    wParms.Add("WorkShopID", WorkShopID);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {

                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("CFG_RemoveHoliday ", ex);
            }
            finally
            {

            }
            return wErrorCode.Result;
        }

        public int CFG_WorkingDays(BMSEmployee wLoginUser, int WorkShopID, DateTime wStartDate, DateTime wEndDate,
                OutResult<Int32> wErrorCode)
        {
            int wResult = 0;
            return wResult;
        }

        public int CFG_WorkingHours(BMSEmployee wLoginUser, int WorkShopID, DateTime wStartTime, DateTime wEndTime,
                OutResult<Int32> wErrorCode)
        {
            int wResult = 0;
            return wResult;
        }

        public List<CFGCalendar> CFG_QueryHoliday(BMSEmployee wLoginUser, int WorkShopID, int wYear,
                OutResult<Int32> wErrorCode)
        {
            List<CFGCalendar> wCalendarList = new List<CFGCalendar>();
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format(
                            "select * from {0}.cfg_factorycalendar where Year=@Year and WorkShopID=@WorkShopID",
                            wInstance);
                    wParms.Clear();
                    wParms.Add("Year", wYear);
                    wParms.Add("WorkShopID", WorkShopID);
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        CFGCalendar wCalendarHoliday = new CFGCalendar();
                        wCalendarHoliday.HolidayDate = StringUtils.parseDate(wSqlDataReader["HolidayDate"]);
                        wCalendarHoliday.Year = StringUtils.parseInt(wSqlDataReader["Year"]);

                        wCalendarHoliday.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wCalendarHoliday.OperatorID = StringUtils.parseInt(wSqlDataReader["OperatorID"]);
                        wCalendarHoliday.OperationTime = StringUtils.parseDate(wSqlDataReader["OperationTime"]);
                        wCalendarHoliday.OperatorName = StringUtils.parseString(wSqlDataReader["OperatorName"]);
                        wCalendarHoliday.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
                        wCalendarList.Add(wCalendarHoliday);
                    }

                }
            }
            catch (Exception ex)
            {

                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("CFG_QueryHoliday ", ex);
            }
            return wCalendarList;
        }

        public int CFG_RemoveYearHoliday(BMSEmployee wLoginUser, int WorkShopID, int wYear,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0 && wYear >= DateTime.Now.Year)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("update {0}.cfg_factorycalendar", wInstance)
                            + " set Active=0,OperationTime=@OperationTime "
                            + " where HolidayDate>@HolidayDate and Year=@Year and WorkShopID=@WorkShopID";
                    wParms.Clear();
                    wParms.Add("HolidayDate", DateTime.Now);
                    wParms.Add("Year", wYear);
                    wParms.Add("OperationTime", DateTime.Now);
                    wParms.Add("WorkShopID", WorkShopID);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {

                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("CFG_RemoveYearHoliday ", ex);
            }
            return wErrorCode.Result;
        }

        public DateTime CFG_ForwardDay(BMSEmployee wLoginUser, int WorkShopID, DateTime wStartDate, int wForwardDays,
                OutResult<Int32> wErrorCode)
        {
            DateTime wForwardDutyDate = wStartDate;
            wErrorCode.set(0);
            try
            {
                int wMaxDays = 1000;
                int i = 0;
                int wDutyDays = 0;

                while (i < wMaxDays)
                {
                    DateTime wDutyDate = wStartDate;
                    i++;
                    wDutyDate = wDutyDate.AddDays(i);
                    if (!this.CFG_DateIsHoliday(wLoginUser, wDutyDate, wErrorCode))
                        wDutyDays++;

                    if (wDutyDays == wForwardDays)
                    {
                        wForwardDutyDate = wForwardDutyDate.AddDays(i);
                        break;
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error("CFG_ForwardDutyDate", ex);
            }
            return wForwardDutyDate;
        }

        public DateTime CFG_PeriousDay(BMSEmployee wLoginUser, int WorkShopID, DateTime wStartDate, int wPeriousDays,
                OutResult<Int32> wErrorCode)
        {
            DateTime wPeriousDutyDate = wStartDate;
            wErrorCode.set(0);
            try
            {
                int wMaxDays = 1000;
                int i = 0;
                int wDutyDays = 0;
                while (i < wMaxDays)
                {
                    DateTime wDutyDate = wStartDate;
                    i++;
                    wDutyDate = wDutyDate.AddDays(0 - i);
                    if (!this.CFG_DateIsHoliday(wLoginUser, wDutyDate, wErrorCode))
                        wDutyDays++;

                    if (wDutyDays == wPeriousDays)
                    {
                        wPeriousDutyDate = wPeriousDutyDate.AddDays(0 - i);
                        break;
                    }

                }
            }
            catch (Exception ex)
            {
                logger.Error("CFG_PeriousDay", ex);
            }
            return wPeriousDutyDate;
        }

        public Boolean CFG_IsHoliday(BMSEmployee wLoginUser, int WorkShopID, DateTime wDailyDate, OutResult<Int32> wErrorCode)
        {
            Boolean wIsHoliday = false;
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = "select count(*) as ID from cfg_factorycalendar where HolidayDate=@HolidayDate and Active=1 and ";
                    wParms.Clear();
                    wParms.Add("HolidayDate", wDailyDate);
                    long wHoliday = 0;
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wHoliday = StringUtils.parseLong(wSqlDataReader["ID"]);
                    }

                    if (wHoliday > 0)
                        wIsHoliday = true;
                }
            }
            catch (Exception ex)
            {

                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("CFG_IsHoliday", ex);
            }
            finally
            {

            }
            return wIsHoliday;
        }

        // 工厂日历静态函数

        public Boolean CFG_DateIsHoliday(BMSEmployee wLoginUser, DateTime wDailyDate, OutResult<Int32> wErrorCode)
        {
            Boolean wIsHoliday = false;
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format(
                            "select count(*) as ID from {0}.cfg_factorycalendar where HolidayDate=@HolidayDate and Active=1",
                            wInstance);
                    wParms.Clear();
                    wParms.Add("HolidayDate", wDailyDate);
                    long wHoliday = 0;
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wHoliday = StringUtils.parseLong(wSqlDataReader["ID"]);
                    }

                    if (wHoliday > 0)
                        wIsHoliday = true;
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("CFG_DateIsHoliday", ex);
            }
            return wIsHoliday;
        }

        public DateTime CFG_CalendarSkipIdleDate(BMSEmployee wLoginUser, DateTime wStartDate, int wDays,
                OutResult<Int32> wErrorCode)
        {
            DateTime wForwardDutyDate = wStartDate;
            wErrorCode.set(0);
            try
            {
                int wMaxDays = 1000;
                int i = 0;
                int wDutyDays = 0;
                while (i < wMaxDays)
                {
                    i++;
                    DateTime wCalendar = wStartDate;
                    wCalendar = wCalendar.AddDays(i);
                    if (!this.CFG_DateIsHoliday(wLoginUser, wCalendar, wErrorCode))
                        wDutyDays++;

                    if (wDutyDays == wDays)
                    {
                        wForwardDutyDate = wForwardDutyDate.AddDays(i);
                        break;
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error("CFG_CalendarSkipIdleDate", ex);
            }
            return wForwardDutyDate;
        }

        public List<CFGCalendar> CFG_QueryHolidayListByZoneTime(BMSEmployee wLoginUser, DateTime wStartTime, DateTime wEndTime,
                OutResult<Int32> wErrorCode)
        {
            List<CFGCalendar> wCalendarList = new List<CFGCalendar>();
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format(
                            "select * from {0}.cfg_factorycalendar where HolidayDate between @StartTime and @EndTime",
                            wInstance);
                    wParms.Clear();
                    wParms.Add("StartTime", wStartTime);
                    wParms.Add("EndTime", wEndTime);
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        CFGCalendar wCalendarHoliday = new CFGCalendar();
                        wCalendarHoliday.HolidayDate = StringUtils.parseDate(wSqlDataReader["HolidayDate"]);
                        wCalendarHoliday.Year = StringUtils.parseInt(wSqlDataReader["Year"]);

                        wCalendarHoliday.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wCalendarHoliday.OperatorID = StringUtils.parseInt(wSqlDataReader["OperatorID"]);
                        wCalendarHoliday.OperationTime = StringUtils.parseDate(wSqlDataReader["OperationTime"]);

                        wCalendarHoliday.OperatorName = StringUtils.parseString(wSqlDataReader["OperatorName"]);
                        wCalendarList.Add(wCalendarHoliday);
                    }

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("CFG_QueryHolidayListByZoneTime ",
                        ex);
            }
            return wCalendarList;
        }
    }
}
