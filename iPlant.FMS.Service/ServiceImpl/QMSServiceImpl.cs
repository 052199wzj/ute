using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    public class QMSServiceImpl : QMSService
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(QMSServiceImpl));

        private static LockHelper mLockHelper = new LockHelper();
        private static QMSService _instance = new QMSServiceImpl();

        public static QMSService getInstance()
        {
            if (_instance == null)
                _instance = new QMSServiceImpl();

            return _instance;
        }



        public ServiceResult<List<Dictionary<String, Object>>> QMS_GetWorkpieceCheckResultList(BMSEmployee wLoginUser, int wLineID, int wCommandID, int wOrderID,
            String wOrderNo, int wProductID, String wProductNo, String wWorkpieceNo, int wStatus,
            int wCheckResult, int wSpotCheckResult, int wPatrolCheckResult, int wThreeDimensionalResult,
                DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<Dictionary<String, Object>>> wResult = new ServiceResult<List<Dictionary<String, Object>>>();
            try
            {
                wResult.Result = new List<Dictionary<String, Object>>();
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);


                List<QMSWorkpiece> wQMSWorkpieceList = QMSWorkpieceDAO.getInstance().QMS_SelectWorkpieceAll(wLoginUser, wLineID, wCommandID, wOrderID,
             wOrderNo, wProductID, wProductNo, wWorkpieceNo, wStatus,
             wCheckResult, wSpotCheckResult, wPatrolCheckResult, wThreeDimensionalResult,
                 wStartTime, wEndTime, wPagination, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                if (wQMSWorkpieceList.Count <= 0)
                    return wResult;

                List<int> wWorkpieceIDList = wQMSWorkpieceList.Select(p => p.ID).Distinct().ToList();

                List<QMSCheckResult> wQMSCheckResultList = QMSCheckResultDAO.getInstance().QMS_SelectCheckResultList(wLoginUser, wWorkpieceIDList, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }

                wResult.Put("Header", wQMSCheckResultList.Select(p => p.ParameterName).Distinct().ToList());

                Dictionary<int, List<QMSCheckResult>> wQMSCheckResultListDic = wQMSCheckResultList.GroupBy(p => p.WorkpieceID).ToDictionary(p => p.Key, p => p.ToList());

                List<QMSCheckResult> wQMSCheckResultListTemp = null;
                foreach (QMSWorkpiece wQMSWorkpiece in wQMSWorkpieceList)
                {
                    wQMSCheckResultListTemp = null;
                    if (wQMSCheckResultListDic.ContainsKey(wQMSWorkpiece.ID))
                        wQMSCheckResultListTemp = wQMSCheckResultListDic[wQMSWorkpiece.ID];

                    wResult.Result.Add(new QMSWorkpieceCheckResult(wQMSWorkpiece, wQMSCheckResultListTemp));
                }

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<QMSWorkpiece>> QMS_CreateWorkpiece(BMSEmployee wLoginUser, int wOrderID, int wNum)
        {
            ServiceResult<List<QMSWorkpiece>> wResult = new ServiceResult<List<QMSWorkpiece>>();
            try
            {

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                lock (mLockHelper)
                {
                    wResult.Result = QMSWorkpieceDAO.getInstance().QMS_CreateWorkpiece(wLoginUser, wOrderID, wNum, wErrorCode);
                    if (wErrorCode.Result != 0)
                    {
                        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                        return wResult;
                    }
                    QMSWorkpieceDAO.getInstance().QMS_InsertWorkpiece(wLoginUser, wResult.Result, wErrorCode);
                    if (wErrorCode.Result != 0)
                    {
                        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                        QMSWorkpieceDAO.getInstance().QMS_DeleteWorkpiece(wLoginUser, wResult.Result, wErrorCode);
                        if (wErrorCode.Result != 0)
                            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                        return wResult;
                    }
                }
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<int> QMS_ClearWorkpieceNoByChangeOrderNo(BMSEmployee wLoginUser, int wLineID, String wChangeOrderNo)
        {
            ServiceResult<int> wResult = new ServiceResult<int>(0);
            try
            {
                //获取最新的工件号 判断是否与此订单相互关联或相同 若相同 则不变 若关联清除此产线前一个订单的未使用工件号

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<QMSWorkpiece> wQMSWorkpieceList = QMSWorkpieceDAO.getInstance().QMS_SelectWorkpieceAll(wLoginUser, wLineID, -1, -1,
                    "", -1, "", "", -1, -1, -1, -1, -1, new DateTime(2000, 1, 1), new DateTime(2000, 1, 1), Pagination.Create(1, 15), wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                if (wQMSWorkpieceList == null || wQMSWorkpieceList.Count <= 0)
                    return wResult;


                if (wQMSWorkpieceList[0] == null || StringUtils.isEmpty(wQMSWorkpieceList[0].WorkpieceNo))
                {
                    return wResult;
                }

                if (wQMSWorkpieceList[0].WorkpieceNo.StartsWith(wChangeOrderNo))
                    return wResult;

                List<QMSWorkpiece> wClearList = new List<QMSWorkpiece>();

                String wOldOrderNo = wQMSWorkpieceList[0].WorkpieceNo.Substring(0, wChangeOrderNo.Length);

                foreach (QMSWorkpiece wQMSWorkpiece in wQMSWorkpieceList)
                {
                    if (wQMSWorkpiece == null || wQMSWorkpiece.ID <= 0 || wQMSWorkpiece.Status != 0
                        || wQMSWorkpiece.CheckResult != 0 || wQMSWorkpiece.PatrolCheckResult != 0
                        || wQMSWorkpiece.SpotCheckResult != 0 || wQMSWorkpiece.ThreeDimensionalResult != 0 || wQMSWorkpiece.RepairCount != 0)
                        break;

                    if (!wQMSWorkpiece.WorkpieceNo.StartsWith(wOldOrderNo))
                        break;

                    wClearList.Add(wQMSWorkpiece);
                }

                QMSWorkpieceDAO.getInstance().QMS_DeleteWorkpiece(wLoginUser, wClearList, wErrorCode);

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<int> QMS_DeleteWorkpiece(BMSEmployee wLoginUser, List<QMSWorkpiece> wClearList)
        {
            ServiceResult<int> wResult = new ServiceResult<int>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                QMSWorkpieceDAO.getInstance().QMS_DeleteWorkpiece(wLoginUser, wClearList, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<QMSCheckResult>> QMS_GetCheckResultList(BMSEmployee wLoginUser, int wLineID, int wOrderID,
        String wOrderNo, int wProductID, String wProductNo, String wWorkpieceNo, int wStatus,
        int wCheckResult, int wSpotCheckResult, int wPatrolCheckResult, int wThreeDimensionalResult,
            DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<QMSCheckResult>> wResult = new ServiceResult<List<QMSCheckResult>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(QMSCheckResultDAO.getInstance().QMS_SelectCheckResultList(wLoginUser, wLineID, wOrderID,
             wOrderNo, wProductID, wProductNo, wWorkpieceNo, wStatus,
             wCheckResult, wSpotCheckResult, wPatrolCheckResult, wThreeDimensionalResult,
                 wStartTime, wEndTime, wPagination, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<QMSWorkpiece>> QMS_GetWorkpieceList(BMSEmployee wLoginUser, int wLineID, int wCommandID, int wOrderID,
            String wOrderNo, int wProductID, String wProductNo, String wWorkpieceNo, int wStatus,
            int wCheckResult, int wSpotCheckResult, int wPatrolCheckResult, int wThreeDimensionalResult,
                DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<QMSWorkpiece>> wResult = new ServiceResult<List<QMSWorkpiece>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = QMSWorkpieceDAO.getInstance().QMS_SelectWorkpieceAll(wLoginUser, wLineID, wCommandID, wOrderID,
             wOrderNo, wProductID, wProductNo, wWorkpieceNo, wStatus,
             wCheckResult, wSpotCheckResult, wPatrolCheckResult, wThreeDimensionalResult,
                 wStartTime, wEndTime, wPagination, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                if (wResult.Result == null || wResult.Result.Count <= 0)
                    return wResult;

                Dictionary<String, List<DMSDeviceLedger>> wWorkpiecePosition = DMSServiceImpl.getInstance().DMS_GetWorkpieceNoPosition(wLoginUser).Result; ;

                if (wWorkpiecePosition != null && wWorkpiecePosition.Count > 0)
                {

                    foreach (QMSWorkpiece wQMSWorkpiece in wResult.Result)
                    {
                        if (!wWorkpiecePosition.ContainsKey(wQMSWorkpiece.WorkpieceNo))
                            continue;

                        wQMSWorkpiece.StationName = StringUtils.Join(",", wWorkpiecePosition[wQMSWorkpiece.WorkpieceNo].Select(p => StringUtils.Format("{0}({1})", p.Name, p.Code)));
                    }
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<QMSWorkpiece> QMS_GetWorkpiece(BMSEmployee wLoginUser, int wID, String wWorkpieceNo)
        {
            ServiceResult<QMSWorkpiece> wResult = new ServiceResult<QMSWorkpiece>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(QMSWorkpieceDAO.getInstance().QMS_SelectWorkpiece(wLoginUser, wID, wWorkpieceNo, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



        public ServiceResult<Boolean> QMS_UpdateWorkpiece(BMSEmployee wLoginUser, QMSWorkpiece wQMSWorkpiece)
        {
            ServiceResult<Boolean> wResult = new ServiceResult<Boolean>(false);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(QMSWorkpieceDAO.getInstance().QMS_UpdateWorkpiece(wLoginUser, wQMSWorkpiece, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Boolean> QMS_UpdateWorkpieceStatus(BMSEmployee wLoginUser, String wWorkpieceNo, String wOrderNo, int wStatus, String wRemark)
        {
            ServiceResult<Boolean> wResult = new ServiceResult<Boolean>(false);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(QMSWorkpieceDAO.getInstance().QMS_UpdateWorkpieceStatus(wLoginUser, wWorkpieceNo, wOrderNo, wStatus, wRemark, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> QMS_UpdateCheckResult(BMSEmployee wLoginUser, List<QMSCheckResult> wQMSCheckResultList)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                QMSCheckResultDAO.getInstance().QMS_UpdateCheckResult(wLoginUser, wQMSCheckResultList, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<QMSThreeDimensionalCheckResult>> QMS_GetThreeDimensionalCheckResultList(BMSEmployee wLoginUser, int wProductID, String wProductNoLike, String wParamNameLike,
            int wRecordID, String wWorkpieceNo, int wCheckResult, int wActive, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<QMSThreeDimensionalCheckResult>> wResult = new ServiceResult<List<QMSThreeDimensionalCheckResult>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(QMSThreeDimensionalCheckResultDAO.getInstance().QMS_GetThreeDimensionalCheckResultAll(wLoginUser, wProductID, wProductNoLike, wParamNameLike,
             wRecordID, wWorkpieceNo, wCheckResult, wActive, wStartTime, wEndTime, wPagination, wErrorCode));

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



        public ServiceResult<List<QMSThreeDimensionalSet>> QMS_GetThreeDimensionalSetAll(BMSEmployee wLoginUser, int wProductID,
            String wProductNoLike, String wCheckParameterLike, int wType, Pagination wPagination)
        {
            ServiceResult<List<QMSThreeDimensionalSet>> wResult = new ServiceResult<List<QMSThreeDimensionalSet>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(QMSThreeDimensionalCheckResultDAO.getInstance().QMS_GetThreeDimensionalSetAll(wLoginUser, wProductID,
                    wProductNoLike, wCheckParameterLike, wType, wPagination, wErrorCode));

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<Int32> QMS_UpdateThreeDimensionalSet(BMSEmployee wLoginUser, QMSThreeDimensionalSet wwQMSThreeDimensionalSet)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                QMSThreeDimensionalCheckResultDAO.getInstance().QMS_UpdateThreeDimensionalSet(wLoginUser, wwQMSThreeDimensionalSet, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> QMS_DeleteThreeDimensionalSet(BMSEmployee wLoginUser, QMSThreeDimensionalSet wwQMSThreeDimensionalSet)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                QMSThreeDimensionalCheckResultDAO.getInstance().QMS_DeleteThreeDimensionalSet(wLoginUser, wwQMSThreeDimensionalSet, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



        public ServiceResult<List<QMSOneTimePassRate>> QMS_GetOneTimePassRateList(BMSEmployee wLoginUser, int wLineID, List<int> wProductIDList,
                  int wStatType, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<QMSOneTimePassRate>> wResult = new ServiceResult<List<QMSOneTimePassRate>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(QMSOneTimePassRateDAO.getInstance().QMS_GetOneTimePassAll(wLoginUser, wLineID, wProductIDList, wStatType,
                             wStartTime, wEndTime, wPagination, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<QMSOneTimePassRate>> QMS_GetOneTimePassRateForChartList(BMSEmployee wLoginUser, int wLineID, List<int> wProductIDList,
                  int wStatType, DateTime wStartTime, DateTime wEndTime)
        {
            ServiceResult<List<QMSOneTimePassRate>> wResult = new ServiceResult<List<QMSOneTimePassRate>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(QMSOneTimePassRateDAO.getInstance().GetAllForChart(wLoginUser, wLineID, wProductIDList, wStatType,
                             wStartTime, wEndTime, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<int> QMS_UpdateOneTimePassRate(BMSEmployee wLoginUser, QMSOneTimePassRate wQMSOneTimePassRate)
        {
            ServiceResult<int> wResult = new ServiceResult<int>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                QMSOneTimePassRateDAO.getInstance().QMS_UpdateOneTimePassRate(wLoginUser, wQMSOneTimePassRate, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;

        }

        public ServiceResult<Dictionary<String, double>> QMS_GetQualityRate(BMSEmployee wLoginUser, DateTime wStartTime, DateTime wEndTime)
        {
            ServiceResult<Dictionary<String, double>> wResult = new ServiceResult<Dictionary<String, double>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(QMSThreeDimensionalCheckResultDAO.getInstance().QMS_GetQualityRate(wLoginUser, wStartTime, wEndTime, wErrorCode));



                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;


        }


        public ServiceResult<Dictionary<String, double>> QMS_GetDoneQualityRate(BMSEmployee wLoginUser, DateTime wStartTime, DateTime wEndTime, Boolean wHasCheckItem)
        {
            ServiceResult<Dictionary<String, double>> wResult = new ServiceResult<Dictionary<String, double>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(QMSOneTimePassRateDAO.getInstance().QMS_GetDoneQualityRate(wLoginUser, wStartTime, wEndTime, wErrorCode));

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                if (wHasCheckItem)
                    wResult.Put("CheckItem", QMSThreeDimensionalCheckResultDAO.getInstance().QMS_GetQualityRate(wLoginUser, wStartTime, wEndTime, wErrorCode));

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
