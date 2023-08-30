using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    public interface CFGService
    {

        ServiceResult<Int32> CFG_AddHoliday(BMSEmployee wLoginUser, int WorkShopID, CFGCalendar wCalendarHoliday);

        ServiceResult<Int32> CFG_AddHolidayList(BMSEmployee wLoginUser, int WorkShopID,
                List<CFGCalendar> wHolidayList);

        ServiceResult<Int32> CFG_RemoveHoliday(BMSEmployee wLoginUser, int WorkShopID,
                CFGCalendar wCalendarHoliday);

        ServiceResult<Int32> CFG_WorkingDays(BMSEmployee wLoginUser, int WorkShopID, DateTime wStartDate,
                DateTime wEndDate);

        ServiceResult<Int32> CFG_WorkingHours(BMSEmployee wLoginUser, int WorkShopID, DateTime wStartTime,
                DateTime wEndTime);

        ServiceResult<List<CFGCalendar>> CFG_QueryHoliday(BMSEmployee wLoginUser, int WorkShopID, int wYear);

        ServiceResult<Int32> CFG_RemoveYearHoliday(BMSEmployee wLoginUser, int WorkShopID, int wYear);

        ServiceResult<DateTime> CFG_ForwardDay(BMSEmployee wLoginUser, int WorkShopID, DateTime wStartDate, int wForwardDays);

        ServiceResult<DateTime> CFG_PeriousDay(BMSEmployee wLoginUser, int WorkShopID, DateTime wStartDate, int wPeriousDays);

        ServiceResult<Boolean> CFG_IsHoliday(BMSEmployee wLoginUser, int WorkShopID, DateTime wDailyDate);

    }
}
