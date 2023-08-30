using iPlant.Common.Tools;
using iPlant.Data.EF;
using iPlant.Data.EF.Repository;
using iPlant.FMS.Models;
using iPlant.FMC.Service;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    public class MESServer
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(MESServer));

        public static int Instance = 0; // 0:单机版,1000,网络版

        public static Boolean ERPEnable = false;

        public static DateTime ExpiredTime = DateTime.Now;
        static MESServer()
        {
            try
            {
                String wExpiredTimeString = StringUtils.parseString( GlobalConstant.GlobalConfiguration.GetValue("Role.Manager.ExpiredDate"));
                if (StringUtils.isNotEmpty(wExpiredTimeString))
                { 
                    wExpiredTimeString = DesUtil.Decrypt(wExpiredTimeString, BaseDAO.appSecret);
                    ExpiredTime = StringUtils.parseDate(wExpiredTimeString);
                }
                else { 
                    ExpiredTime = new DateTime(2099, 12, 31);
                }
                ExpiredTime = new DateTime(ExpiredTime.Year, ExpiredTime.Month, ExpiredTime.Day, 23, 59, 59);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                logger.Error("static",
                      ex);
            }


        }

        // public static List<MESEntry> EntryList = new List<MESEntry>();

        private static DBPool mDBPool { get { return RepositoryFactory.GetDBPool(); } }
         


        // 数据库实例&文件系统实例
        public static int DB_QueryMaxID(String wInstanceName, String wTableName)
        {
            int wMaxID = 1;
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）
            try
            {
                using (DbConnection wConnection = mDBPool.GetConnection())
                {
                    String wSQLText = StringUtils.Format("Select ifnull(max(ID),0) as ID from {0}.{1}", wInstanceName,
                         wTableName);
                    CommandTool wCommandTool = new CommandTool(wSQLText, wConnection);

                    using (DbDataReader wSqlDataReader = wCommandTool.ExecuteReader())
                    {
                        while (wSqlDataReader.Read())
                        {
                            int wID = StringUtils.parseInt(wSqlDataReader["ID"]);
                            wMaxID = wID + 1;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error("DB_QueryMaxID",
                        ex);
            }
            return wMaxID;
        }



        private static DateTime MES_QueryMondayByDate(DateTime wShiftTime)
        {
            DateTime wMonday = wShiftTime;
            try
            {
                int weeknow = Convert.ToInt32(wShiftTime.DayOfWeek);

                // 因为是以星期一为第一天，所以要判断weeknow等于0时，要向前推6天。
                weeknow = (weeknow == 0 ? (7 - 1) : (weeknow - 1));
                int daydiff = (-1) * weeknow;

                // 本周第一天
                wMonday = Convert.ToDateTime(wShiftTime.AddDays(daydiff));
            }
            catch (Exception ex)
            {
                logger.Error("MES_QueryMondayByDate", ex);
            }
            return wMonday;
        }

        public static int MES_QueryShiftID(int wWorkShopID, DateTime wShiftTime, OutResult<Int32> wShiftIndex)
        {
            int wResult = 0;

            try
            {
                wShiftIndex.Result = (int)FMCShiftLevel.Day;
                wShiftTime = StringUtils.FormatDateTime(wShiftTime, "yyyy-MM-dd HH-MM");

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult = StringUtils.parseInt(StringUtils.parseDate(wShiftTime, "yyyyMMdd"));

                if (wWorkShopID <= 0)
                {
                    return wResult;
                }

                FMCWorkDay wWorkDayDB = FMCShiftDAO.getInstance().FMC_QueryActiveWorkDay(BaseDAO.SysAdmin,
                         -1, wWorkShopID, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    return wResult;
                }
                if (wWorkDayDB == null || wWorkDayDB.ID <= 0 || wWorkDayDB.ShiftList == null
                        || wWorkDayDB.ShiftList.Count <= 0)
                {
                    return wResult;
                }

                wWorkDayDB.ShiftList.RemoveAll(p => p.Active != 1);

                if (wWorkDayDB.ShiftList.Count <= 0)
                {
                    return wResult;
                }


                wWorkDayDB.ShiftList.Sort((o1, o2) => o1.LevelID - o2.LevelID);

                DateTime wStartTime = wWorkDayDB.ShiftList[0].StartTime;
                DateTime wEndTime = wWorkDayDB.ShiftList[wWorkDayDB.ShiftList.Count - 1].EndTime;

                long wMin = 0;
                if (wEndTime.Day != wStartTime.Day)
                {
                    wMin = (wEndTime.Ticks
                            - StringUtils.FormatDateTime(wEndTime, "yyyy-MM-dd").Ticks) / 60000;

                }
                if (wMin > 0)
                {
                    wShiftTime = wShiftTime.AddMinutes(-((int)wMin + 1));

                    wShiftTime = StringUtils.FormatDateTime(wShiftTime, "HH-mm");
                    wResult = StringUtils.parseInt(wShiftTime.ToString("yyyyMMdd"));
                    foreach (FMCShift wFMCShift in wWorkDayDB.ShiftList)
                    {

                        wFMCShift.StartTime = StringUtils.FormatDateTime(wFMCShift.StartTime, "yyyy-MM-dd HH-MM");
                        wFMCShift.EndTime = StringUtils.FormatDateTime(wFMCShift.EndTime, "yyyy-MM-dd HH-MM");

                        wFMCShift.StartTime = wFMCShift.StartTime.AddMinutes(-(int)wMin);
                        wFMCShift.EndTime = wFMCShift.EndTime.AddMinutes(-((int)wMin + 1));

                        wFMCShift.StartTime = StringUtils.FormatDateTime(wFMCShift.StartTime, "HH-MM");
                        wFMCShift.EndTime = StringUtils.FormatDateTime(wFMCShift.EndTime, "HH-MM");

                        if (wShiftTime >= wFMCShift.StartTime
                                && wShiftTime <= wFMCShift.EndTime)
                        {
                            wShiftIndex.Result = wFMCShift.LevelID;
                        }

                    }

                }

            }
            catch (Exception ex)
            {
                logger.Error("MES_QueryShiftLevel", ex);
            }
            return wResult;

        }

        public static int MES_QueryShiftID(int wCompanyID, int wWorkShopID, DateTime wShiftTime,
                APSShiftPeriod wShiftPeriod, int wShifts)
        {
            int wShiftID = 0;
            try
            {

                switch (wShiftPeriod)
                {

                    case APSShiftPeriod.Day:
                        OutResult<Int32> wShiftIndex = new OutResult<Int32>((int)FMCShiftLevel.Day);
                        wShiftTime = wShiftTime.AddDays(wShifts);
                        // 根据时间获取ShiftID
                        wShiftID = MES_QueryShiftID(wWorkShopID, wShiftTime, wShiftIndex);
                        break;

                    case APSShiftPeriod.Week:

                        wShiftTime = MESServer.MES_QueryMondayByDate(wShiftTime);
                        wShiftTime = wShiftTime.AddDays(7 * wShifts);
                        int weeknow = Convert.ToInt32(wShiftTime.DayOfWeek);//今天星期几
                        int daydiff = (-1) * (weeknow + 1);//今日与上周末的天数差
                        int days = wShiftTime.AddDays(daydiff).DayOfYear;//上周末是本年第几天
                        int weeks = days / 7;
                        if (days % 7 != 0)
                        {
                            weeks++;
                        }
                        //此时，weeks为上周是本年的第几周


                        wShiftID = StringUtils.parseInt(wShiftTime.ToString("yyyyMM40"));
                        wShiftID = wShiftID + weeks + 1;
                        break;
                    case APSShiftPeriod.Month:
                        wShiftTime.AddMonths(wShifts);
                        wShiftID = StringUtils.parseInt(wShiftTime.ToString("yyyyMM"));
                        break;
                }
            }
            catch (Exception ex)
            {
                logger.Error("MES_QueryShiftID", ex);

            }
            return wShiftID;
        }

        public static DateTime MES_GetShiftTimeByShiftID(int wCompanyID, int wShiftID)
        {
            DateTime wShiftTime = DateTime.Now;
            try
            {
                int wYear = wShiftID / 1000000;
                int wMonth = (wShiftID / 10000) % 100;
                int wDay = (wShiftID / 100) % 100;
                wShiftTime = new DateTime(wYear, wMonth, wDay, 0, 0, 0);
            }
            catch (Exception ex)
            {
                logger.Error("MES_GetShiftTimeByShiftID", ex);
            }
            return wShiftTime;
        }
    }
}
