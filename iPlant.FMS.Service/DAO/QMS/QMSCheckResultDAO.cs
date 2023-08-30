using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class QMSCheckResultDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(QMSCheckResultDAO));
        private static QMSCheckResultDAO Instance = null;

        private QMSCheckResultDAO() : base()
        {

        }

        public static QMSCheckResultDAO getInstance()
        {
            if (Instance == null)
                Instance = new QMSCheckResultDAO();
            return Instance;
        }



        public void QMS_UpdateCheckResult(BMSEmployee wLoginUser, List<QMSCheckResult> wQMSCheckResultList, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {
                if (wQMSCheckResultList == null || wQMSCheckResultList.Count <= 0)
                    return;
                wQMSCheckResultList.RemoveAll(p => p == null || p.WorkpieceID <= 0 || StringUtils.isEmpty(p.ParameterName));

                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                Dictionary<int, List<Int32>> wParameterNameDic = wQMSCheckResultList.GroupBy(p => p.WorkpieceID).ToDictionary(p => p.Key, p => p.Select(q => q.ParameterID).Distinct().ToList());


                List<String> wSQLList = new List<String>();

                foreach (int wWorkpieceID in wParameterNameDic.Keys)
                {
                    wSQLList.Add(StringUtils.Format("DELETE FROM {0}.qms_checkresult WHERE WorkpieceID={1} AND ParameterID IN ('{2}') ;", wInstance, wWorkpieceID, StringUtils.Join("','", wParameterNameDic[wWorkpieceID])));
                }

                String wSql = StringUtils.Format("insert  into   {0}.qms_checkresult  (WorkpieceID,ParameterID, ParameterValue,ParameterDescription,DataType) values ", wInstance);

                StringBuilder wInsertString = null;

                foreach (QMSCheckResult wQMSCheckResult in wQMSCheckResultList)
                {

                    if (wQMSCheckResult == null || wQMSCheckResult.WorkpieceID <= 0 || wQMSCheckResult.ParameterID<=0)
                        continue;

                    if (!wParameterNameDic.ContainsKey(wQMSCheckResult.WorkpieceID) || !wParameterNameDic[wQMSCheckResult.WorkpieceID].Contains(wQMSCheckResult.ParameterID))
                        continue;

                    if (wInsertString == null)
                        wInsertString = new StringBuilder(StringUtils.Format("({0},{1},'{2}','{3}',{4} )", wQMSCheckResult.WorkpieceID, wQMSCheckResult.ParameterID,
                         wQMSCheckResult.ParameterValue, wQMSCheckResult.ParameterDescription, wQMSCheckResult.DataType));
                    else
                        wInsertString.Append(StringUtils.Format(",({0},{1},'{2}','{3}',{4} )", wQMSCheckResult.WorkpieceID, wQMSCheckResult.ParameterID,
                             wQMSCheckResult.ParameterValue, wQMSCheckResult.ParameterDescription, wQMSCheckResult.DataType));


                }
                if (wInsertString != null)
                    wSQLList.Add(wSql + wInsertString.ToString());

                this.ExecuteSqlTransaction(wSQLList);


            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);


            }
        }

        public List<QMSCheckResult> QMS_SelectCheckResultList(BMSEmployee wLoginUser, int wLineID, int wOrderID,
            String wOrderNo, int wProductID, String wProductNo, String wWorkpieceNo, int wStatus,
            int wCheckResult, int wSpotCheckResult, int wPatrolCheckResult, int wThreeDimensionalResult,
                DateTime wStartTime, DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            return this.QMS_SelectCheckResultList(wLoginUser, wLineID, wOrderID,
             wOrderNo, wProductID, wProductNo, null, wWorkpieceNo, wStatus,
             wCheckResult, wSpotCheckResult, wPatrolCheckResult, wThreeDimensionalResult,
                 wStartTime, wEndTime, wPagination, wErrorCode);
        }


        public List<QMSCheckResult> QMS_SelectCheckResultList(BMSEmployee wLoginUser, List<int> wWorkpieceIDList, OutResult<Int32> wErrorCode)
        {
            if (wWorkpieceIDList == null || wWorkpieceIDList.Count <= 0)
                return new List<QMSCheckResult>();
            wWorkpieceIDList.RemoveAll(p => p <= 0);
            wWorkpieceIDList = wWorkpieceIDList.Distinct().ToList();
            if (wWorkpieceIDList.Count <= 0)
                return new List<QMSCheckResult>();

            return this.QMS_SelectCheckResultList(wLoginUser, -1, -1, "", -1, "", wWorkpieceIDList, "", -1,
            -1, -1, -1, -1, new DateTime(), new DateTime(), Pagination.MaxSize, wErrorCode);
        }

        private List<QMSCheckResult> QMS_SelectCheckResultList(BMSEmployee wLoginUser, int wLineID, int wOrderID,
            String wOrderNo, int wProductID, String wProductNo, List<int> wWorkpieceIDList, String wWorkpieceNo, int wStatus,
            int wCheckResult, int wSpotCheckResult, int wPatrolCheckResult, int wThreeDimensionalResult,
                DateTime wStartTime, DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<QMSCheckResult> wResult = new List<QMSCheckResult>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;


                if (wWorkpieceIDList == null)
                    wWorkpieceIDList = new List<int>();

                wWorkpieceIDList.RemoveAll(p => p <= 0);

                if (StringUtils.isNotEmpty(wOrderNo))
                {
                    wOrderNo = "%" + wOrderNo + "%";
                }
                if (StringUtils.isNotEmpty(wProductNo))
                {
                    wProductNo = "%" + wProductNo + "%";
                }
                if (StringUtils.isNotEmpty(wWorkpieceNo))
                {
                    wWorkpieceNo = "%" + wWorkpieceNo + "%";
                }

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format(" select t1.*,t.WorkpieceNo,t4.Name as ParameterName,t4.VariableName  FROM {0}.qms_checkresult t1  "
                                                   + "inner join {0}.qms_workpiece t on t.ID = t1.WorkpieceID "
                                                   + "inner join {0}.oms_order t2 on t2.ID = t.OrderID "
                                                   + "inner join {0}.fpc_product t3 on t3.ID = t2.ProductID "
                                                   + "left join {0}.dms_device_parameter t4 on t1.ParameterID = t4.ID "
                                                   + "where  (@wLineID<=0 or t2.LineID=@wLineID) "
                                                   + " and  (@wOrderID<=0 or t.OrderID=@wOrderID) "
                                                   + " and  (@wProductID<=0 or t2.ProductID=@wProductID) "
                                                   + " and  (@wStatus<0 or t.Status=@wStatus) "
                                                   + " and  (@wCheckResult<0 or t.CheckResult=@wCheckResult) "
                                                   + " and  (@wSpotCheckResult<0 or t.SpotCheckResult=@wSpotCheckResult) "
                                                   + " and  (@wPatrolCheckResult<0 or t.PatrolCheckResult=@wPatrolCheckResult) "
                                                   + " and  (@wThreeDimensionalResult<0 or t.ThreeDimensionalResult=@wThreeDimensionalResult) "
                                                   + " and  (@wOrderNo = '' or t2.OrderNo like @wOrderNo) "
                                                   + " and  (@wProductNo = '' or t3.ProductNo like @wProductNo) "
                                                   + " and  (@wWorkpieceNo = '' or t.WorkpieceNo like @wWorkpieceNo)"
                                                   + " and  (@wWorkpieceID = '' or t1.WorkpieceID IN ('{1}'))"
                                                   + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wStartTime <= t.EndTime) "
                                                   + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= t.StartTime)  ", wInstance,StringUtils.Join("','", wWorkpieceIDList));
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wOrderID", wOrderID);
                wParamMap.Add("wProductID", wProductID);
                wParamMap.Add("wStatus", wStatus);
                wParamMap.Add("wCheckResult", wCheckResult);
                wParamMap.Add("wSpotCheckResult", wSpotCheckResult);
                wParamMap.Add("wPatrolCheckResult", wPatrolCheckResult);
                wParamMap.Add("wThreeDimensionalResult", wThreeDimensionalResult);
                wParamMap.Add("wOrderNo", wOrderNo);
                wParamMap.Add("wProductNo", wProductNo);
                wParamMap.Add("wWorkpieceNo", wWorkpieceNo);
                wParamMap.Add("wWorkpieceID", StringUtils.Join("','", wWorkpieceIDList));
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    QMSCheckResult wQMSCheckResult = new QMSCheckResult();

                    wQMSCheckResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wQMSCheckResult.WorkpieceID = StringUtils.parseInt(wReader["WorkpieceID"]);
                    wQMSCheckResult.ParameterID = StringUtils.parseInt(wReader["ParameterID"]);
                    wQMSCheckResult.ParameterName = StringUtils.parseString(wReader["ParameterName"]);
                    wQMSCheckResult.VariableName = StringUtils.parseString(wReader["VariableName"]);
                    wQMSCheckResult.ParameterValue = StringUtils.parseString(wReader["ParameterValue"]);
                    wQMSCheckResult.ParameterDescription = StringUtils.parseString(wReader["ParameterDescription"]);
                    wQMSCheckResult.DataType = StringUtils.parseInt(wReader["DataType"]);
                    wResult.Add(wQMSCheckResult);
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
    }
}
