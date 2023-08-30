using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{


    public class CFGServiceImpl : CFGService
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(CFGServiceImpl));
        private static CFGService _instance = new CFGServiceImpl();

        public static CFGService getInstance()
        {
            if (_instance == null)
                _instance = new CFGServiceImpl();

            return _instance;
        }


        public ServiceResult<Int32> CFG_AddHoliday(BMSEmployee wLoginUser, int WorkShopID,
                CFGCalendar wCalendarHoliday)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = CFGCalendarDAO.getInstance().CFG_AddHoliday( wLoginUser, WorkShopID,
                        wCalendarHoliday, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> CFG_AddHolidayList(BMSEmployee wLoginUser, int WorkShopID,
                List<CFGCalendar> wHolidayList)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = CFGCalendarDAO.getInstance().CFG_AddHolidayList( wLoginUser, WorkShopID,
                        wHolidayList, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> CFG_RemoveHoliday(BMSEmployee wLoginUser, int WorkShopID,
                CFGCalendar wCalendarHoliday)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = CFGCalendarDAO.getInstance().CFG_RemoveHoliday( wLoginUser, WorkShopID,
                        wCalendarHoliday, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> CFG_WorkingDays(BMSEmployee wLoginUser, int WorkShopID, DateTime wStartDate,
                DateTime wEndDate)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = CFGCalendarDAO.getInstance().CFG_WorkingDays( wLoginUser, WorkShopID, wStartDate,
                        wEndDate, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> CFG_WorkingHours(BMSEmployee wLoginUser, int WorkShopID, DateTime wStartTime,
                DateTime wEndTime)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = CFGCalendarDAO.getInstance().CFG_WorkingHours( wLoginUser, WorkShopID, wStartTime,
                        wEndTime, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<CFGCalendar>> CFG_QueryHoliday(BMSEmployee wLoginUser, int WorkShopID, int wYear)
        {
            // TODO Auto-generated method stub
            ServiceResult<List<CFGCalendar>> wResult = new ServiceResult<List<CFGCalendar>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = CFGCalendarDAO.getInstance().CFG_QueryHoliday( wLoginUser, WorkShopID, wYear,
                        wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> CFG_RemoveYearHoliday(BMSEmployee wLoginUser, int WorkShopID, int wYear)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = CFGCalendarDAO.getInstance().CFG_RemoveYearHoliday( wLoginUser, WorkShopID, wYear,
                        wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<DateTime> CFG_ForwardDay(BMSEmployee wLoginUser, int WorkShopID, DateTime wStartDate,
                int wForwardDays)
        {
            // TODO Auto-generated method stub
            ServiceResult<DateTime> wResult = new ServiceResult<DateTime>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = CFGCalendarDAO.getInstance().CFG_ForwardDay( wLoginUser, WorkShopID, wStartDate,
                        wForwardDays, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<DateTime> CFG_PeriousDay(BMSEmployee wLoginUser, int WorkShopID, DateTime wStartDate,
                int wPeriousDays)
        {
            // TODO Auto-generated method stub
            ServiceResult<DateTime> wResult = new ServiceResult<DateTime>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = CFGCalendarDAO.getInstance().CFG_PeriousDay( wLoginUser, WorkShopID, wStartDate,
                        wPeriousDays, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Boolean> CFG_IsHoliday(BMSEmployee wLoginUser, int WorkShopID, DateTime wDailyDate)
        {
            // TODO Auto-generated method stub
            ServiceResult<Boolean> wResult = new ServiceResult<Boolean>(false);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = CFGCalendarDAO.getInstance().CFG_IsHoliday(wLoginUser, WorkShopID, wDailyDate, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


    }
}
