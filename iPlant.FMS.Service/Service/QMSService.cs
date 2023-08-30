using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iPlant.Common.Tools;

namespace iPlant.FMC.Service
{
    public interface QMSService
    {

        ServiceResult<List<Dictionary<String, Object>>> QMS_GetWorkpieceCheckResultList(BMSEmployee wLoginUser, int wLineID, int wCommandID, int wOrderID,
            String wOrderNo, int wProductID, String wProductNo, String wWorkpieceNo, int wStatus,
            int wCheckResult, int wSpotCheckResult, int wPatrolCheckResult, int wThreeDimensionalResult,
                DateTime wStartTime, DateTime wEndTime, Pagination wPagination);

        ServiceResult<List<QMSWorkpiece>> QMS_GetWorkpieceList(BMSEmployee wLoginUser, int wLineID, int wCommandID, int wOrderID,
            String wOrderNo, int wProductID, String wProductNo, String wWorkpieceNo, int wStatus,
            int wCheckResult, int wSpotCheckResult, int wPatrolCheckResult, int wThreeDimensionalResult,
                DateTime wStartTime, DateTime wEndTime, Pagination wPagination);


        ServiceResult<QMSWorkpiece> QMS_GetWorkpiece(BMSEmployee wLoginUser, int wID, String wWorkpieceNo);

        ServiceResult<int> QMS_DeleteWorkpiece(BMSEmployee wLoginUser, List<QMSWorkpiece> wClearList);
        ServiceResult<List<QMSCheckResult>> QMS_GetCheckResultList(BMSEmployee wLoginUser, int wLineID, int wOrderID,
            String wOrderNo, int wProductID, String wProductNo, String wWorkpieceNo, int wStatus,
            int wCheckResult, int wSpotCheckResult, int wPatrolCheckResult, int wThreeDimensionalResult,
                DateTime wStartTime, DateTime wEndTime, Pagination wPagination);


        ServiceResult<Boolean> QMS_UpdateWorkpiece(BMSEmployee wLoginUser, QMSWorkpiece wQMSWorkpiece);


        ServiceResult<Boolean> QMS_UpdateWorkpieceStatus(BMSEmployee wLoginUser, String wWorkpieceNo, String wOrderNo, int wStatus, String wRemark);


        ServiceResult<Int32> QMS_UpdateCheckResult(BMSEmployee wLoginUser, List<QMSCheckResult> wQMSCheckResultList);

        ServiceResult<List<QMSWorkpiece>> QMS_CreateWorkpiece(BMSEmployee wLoginUser, int wOrderID, int wNum);

        /// <summary>
        /// 订单变更 清除未使用的工件号
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wLineID">所属产线</param>
        /// <param name="wChangeOrderNo">变更后的订单号</param>
        /// <returns></returns>
        ServiceResult<int> QMS_ClearWorkpieceNoByChangeOrderNo(BMSEmployee wLoginUser, int wLineID, String wChangeOrderNo);
         

        ServiceResult<List<QMSThreeDimensionalCheckResult>> QMS_GetThreeDimensionalCheckResultList(BMSEmployee wLoginUser, int wProductID, String wProductNoLike, String wParamNameLike,
            int wRecordID, String wWorkpieceNo, int wCheckResult, int wActive, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);

        ServiceResult<List<QMSThreeDimensionalSet>> QMS_GetThreeDimensionalSetAll(BMSEmployee wLoginUser, int wProductID,
            String wProductNoLike, String wCheckParameterLike,int wType, Pagination wPagination);

        ServiceResult<Int32> QMS_UpdateThreeDimensionalSet(BMSEmployee wLoginUser, QMSThreeDimensionalSet wwQMSThreeDimensionalSet);
        ServiceResult<Int32> QMS_DeleteThreeDimensionalSet(BMSEmployee wLoginUser, QMSThreeDimensionalSet wwQMSThreeDimensionalSet);

        ServiceResult<List<QMSOneTimePassRate>> QMS_GetOneTimePassRateList(BMSEmployee wLoginUser, int wLineID, List<int> wProductIDList,
                  int wStatType, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);

        ServiceResult<List<QMSOneTimePassRate>> QMS_GetOneTimePassRateForChartList(BMSEmployee wLoginUser, int wLineID, List<int> wProductIDList,
                  int wStatType, DateTime wStartTime, DateTime wEndTime);


        ServiceResult<int> QMS_UpdateOneTimePassRate(BMSEmployee wLoginUser, QMSOneTimePassRate wQMSOneTimePassRate);

        ServiceResult<Dictionary<String, double>> QMS_GetQualityRate(BMSEmployee wLoginUser, DateTime wStartTime, DateTime wEndTime);

        ServiceResult<Dictionary<String, double>> QMS_GetDoneQualityRate(BMSEmployee wLoginUser, DateTime wStartTime, DateTime wEndTime,Boolean wHasCheckItem);

         
    }
}
