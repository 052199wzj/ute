using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class QMSOneTimePassRateDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(QMSOneTimePassRateDAO));
        private static QMSOneTimePassRateDAO Instance = null;

        private QMSOneTimePassRateDAO() : base()
        {

        }

        public static QMSOneTimePassRateDAO getInstance()
        {
            if (Instance == null)
                Instance = new QMSOneTimePassRateDAO();
            return Instance;
        }


        /// <summary>
        /// 查询产品的一次性合格率    按产品分类 也可以合并查询
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wLineID"></param>
        /// <param name="wOrderID"></param>
        /// <param name="wProductID"></param>
        /// <param name="wStatType"></param>
        /// <param name="wStartTime"></param>
        /// <param name="wEndTime"></param>
        /// <param name="wPagination"></param>
        /// <param name="wErrorCode"></param>
        /// <returns></returns>

        public List<QMSOneTimePassRate> QMS_GetOneTimePassAll(BMSEmployee wLoginUser, int wLineID, List<int> wProductIDList,
                  int wStatType, DateTime wStartTime, DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
            try
            {
                switch (wStatType)
                {
                    case ((int)DMSStatTypes.Day):
                        wResult = this.GetOneTimePassRateDayList(wLoginUser, wLineID, wProductIDList,
                             wStartTime, wEndTime, wPagination,
                             wErrorCode);
                        break;
                    case ((int)DMSStatTypes.Week):
                        wResult = this.GetOneTimePassRateWeekList(wLoginUser, wLineID, wProductIDList,
                             wStartTime, wEndTime, wPagination,
                             wErrorCode);
                        break;
                    case ((int)DMSStatTypes.Month):
                        wResult = this.GetOneTimePassRateMonthList(wLoginUser, wLineID, wProductIDList,
                             wStartTime, wEndTime, wPagination,
                             wErrorCode);
                        break;
                    case ((int)DMSStatTypes.Quarter):
                        wResult = this.GetOneTimePassRateQuarterList(wLoginUser, wLineID, wProductIDList,
                             wStartTime, wEndTime, wPagination,
                             wErrorCode);
                        break;
                    case ((int)DMSStatTypes.Year):
                        wResult = this.GetOneTimePassRateYearList(wLoginUser, wLineID, wProductIDList,
                             wStartTime, wEndTime, wPagination,
                             wErrorCode);
                        break;

                    default:
                        wResult = this.GetOneTimePassRateDayList(wLoginUser, wLineID, wProductIDList,
                             wStartTime, wEndTime, wPagination,
                             wErrorCode);
                        break;
                }



            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<QMSOneTimePassRate> GetOneTimePassRateDayList(BMSEmployee wLoginUser, int wLineID, List<int> wProductIDList, DateTime wStartTime, DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                wPagination.Sort = "StatDate";

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format("select t2.ProductID,t2.LineID,Count(t.ID) as FeedingNum,"
                                                   + " Count(t.CheckResult=2 or null) as NGNum,Count(t.Status>1 or null) as Num ,"
                                                   + " Count((t.Status=@wDoneStatus and t.CheckResult=1 and t.RepairCount<=0) or null) as  OneTimePassNum,"
                                                   + " Count(t.Status=@wScarpStatus or null) as  ScrapNum,"
                                + " Count(t.Status=@wDoneStatus or null) as  DoneNum,"
                                + " Count((t.Status=@wDoneStatus and t.CheckResult=1) or null) as  DoneGoodNum, "
                                                   + " str_to_date( DATE_FORMAT(t.StartTime,'%Y-%m-%d'),'%Y-%m-%d') as StatDate,"
                                                   + " t3.ProductNo,t3.ProductName"
                                                   + " FROM {0}.qms_workpiece t "
                                                   + " inner join {0}.oms_order t2 on t2.ID = t.OrderID "
                                                   + " inner join {0}.fpc_product t3 on t3.ID = t2.ProductID "
                                                   + " where  t.Status>0 and (@wLineID<=0 or t2.LineID=@wLineID)"
                                                   + " and str_to_date(  DATE_FORMAT(t.StartTime,'%Y-%m-%d'),'%Y-%m-%d')  >= @wStartTime "
                                                   + " and str_to_date(  DATE_FORMAT(t.StartTime,'%Y-%m-%d'),'%Y-%m-%d') < @wEndTime "
                                                   + " and ( @wProductID ='' or t2.ProductID IN( {1} ) ) "
                                                   + " group by t2.LineID,t2.ProductID,StatDate ", wInstance, wProductIDList.Count > 0 ? StringUtils.Join(",", wProductIDList) : "0");


                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wScarpStatus", ((int)OMSWorkpieceStatus.Scrap));
                wParamMap.Add("wDoneStatus", ((int)OMSWorkpieceStatus.Done));
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wProductID", StringUtils.Join(",", wProductIDList));

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    QMSOneTimePassRate wQMSOneTimePassRate = new QMSOneTimePassRate();
                    wQMSOneTimePassRate.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wQMSOneTimePassRate.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wQMSOneTimePassRate.ProductName = StringUtils.parseString(wReader["ProductName"]);

                    wQMSOneTimePassRate.StatDate = StringUtils.parseDate(wReader["StatDate"]);
                    wQMSOneTimePassRate.OneTimePassNum = StringUtils.parseDouble(wReader["OneTimePassNum"]);
                    wQMSOneTimePassRate.ScrapNum = StringUtils.parseDouble(wReader["ScrapNum"]);
                    wQMSOneTimePassRate.FeedingNum = StringUtils.parseDouble(wReader["FeedingNum"]);
                    wQMSOneTimePassRate.Num = StringUtils.parseDouble(wReader["Num"]);
                    wQMSOneTimePassRate.NGNum = StringUtils.parseDouble(wReader["NGNum"]);
                    wQMSOneTimePassRate.DoneNum = StringUtils.parseDouble(wReader["DoneNum"]);
                    wQMSOneTimePassRate.DoneGoodNum = StringUtils.parseDouble(wReader["DoneGoodNum"]);

                    wResult.Add(wQMSOneTimePassRate);
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        /// <summary>
        /// 按订单统计/按产品统计
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wLineID"></param>
        /// <param name="wOrderID"></param>
        /// <param name="wProductID"></param>
        /// <param name="wStartTime"></param>
        /// <param name="wEndTime"></param>
        /// <param name="wPagination"></param>
        /// <param name="wErrorCode"></param>
        /// <returns></returns>
        public List<QMSOneTimePassRate> GetOneTimePassRateWeekList(BMSEmployee wLoginUser, int wLineID, List<int> wProductIDList, DateTime wStartTime, DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                wPagination.Sort = "StatDate";

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format("select t2.ProductID,t2.LineID,Count(t.ID) as FeedingNum,"
                                                   + " Count(t.CheckResult=2 or null) as NGNum,Count(t.Status>1 or null) as Num ,"
                                                   + " Count((t.Status=@wDoneStatus and t.CheckResult=1 and t.RepairCount<=0) or null) as  OneTimePassNum,"
                                                   + " Count(t.Status=@wScarpStatus or null) as  ScrapNum,"
                                + " Count(t.Status=@wDoneStatus or null) as  DoneNum,"
                                + " Count((t.Status=@wDoneStatus and t.CheckResult=1) or null) as  DoneGoodNum, "
                                                   + " str_to_date( DATE_FORMAT(t.StartTime,'%Y-%u-1'),'%Y-%u-%w') as StatDate,"
                                                   + " t3.ProductNo,t3.ProductName"
                                                   + " FROM {0}.qms_workpiece t "
                                                   + " inner join {0}.oms_order t2 on t2.ID = t.OrderID "
                                                   + " inner join {0}.fpc_product t3 on t3.ID = t2.ProductID "
                                                   + " where  t.Status>0 and (@wLineID<=0 or t2.LineID=@wLineID)"
                                                   + " and str_to_date( DATE_FORMAT(t.StartTime,'%Y-%u-1'),'%Y-%u-%w')  >= @wStartTime "
                                                   + " and str_to_date( DATE_FORMAT(t.StartTime,'%Y-%u-1'),'%Y-%u-%w') < @wEndTime "
                                                   + " and ( @wProductID ='' or t2.ProductID IN( {1} ) ) "
                                                   + " group by t2.LineID,t2.ProductID,StatDate ", wInstance, wProductIDList.Count > 0 ? StringUtils.Join(",", wProductIDList) : "0");


                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wDoneStatus", ((int)OMSWorkpieceStatus.Done));
                wParamMap.Add("wScarpStatus", ((int)OMSWorkpieceStatus.Scrap));
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wProductID", StringUtils.Join(",", wProductIDList));

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    QMSOneTimePassRate wQMSOneTimePassRate = new QMSOneTimePassRate();
                    wQMSOneTimePassRate.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wQMSOneTimePassRate.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wQMSOneTimePassRate.ProductName = StringUtils.parseString(wReader["ProductName"]);

                    wQMSOneTimePassRate.StatDate = StringUtils.parseDate(wReader["StatDate"]);
                    wQMSOneTimePassRate.OneTimePassNum = StringUtils.parseDouble(wReader["OneTimePassNum"]);
                    wQMSOneTimePassRate.ScrapNum = StringUtils.parseDouble(wReader["ScrapNum"]);
                    wQMSOneTimePassRate.FeedingNum = StringUtils.parseDouble(wReader["FeedingNum"]);
                    wQMSOneTimePassRate.Num = StringUtils.parseDouble(wReader["Num"]);
                    wQMSOneTimePassRate.NGNum = StringUtils.parseDouble(wReader["NGNum"]);
                    wQMSOneTimePassRate.DoneNum = StringUtils.parseDouble(wReader["DoneNum"]);
                    wQMSOneTimePassRate.DoneGoodNum = StringUtils.parseDouble(wReader["DoneGoodNum"]);

                    wResult.Add(wQMSOneTimePassRate);
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<QMSOneTimePassRate> GetOneTimePassRateMonthList(BMSEmployee wLoginUser, int wLineID, List<int> wProductIDList, DateTime wStartTime, DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                wPagination.Sort = "StatDate";

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format("select t2.ProductID,t2.LineID,Count(t.ID) as FeedingNum,"
                                                   + " Count(t.CheckResult=2 or null) as NGNum,Count(t.Status>1 or null) as Num ,"
                                                   + " Count((t.Status=@wDoneStatus and t.CheckResult=1 and t.RepairCount<=0) or null) as  OneTimePassNum,"
                                                   + " Count(t.Status=@wScarpStatus or null) as  ScrapNum,"
                                + " Count(t.Status=@wDoneStatus or null) as  DoneNum,"
                                + " Count((t.Status=@wDoneStatus and t.CheckResult=1) or null) as  DoneGoodNum, "
                                                   + " str_to_date( DATE_FORMAT(t.StartTime,'%Y-%m-1'),'%Y-%m-%d') as StatDate,"
                                                   + " t3.ProductNo,t3.ProductName"
                                                   + " FROM {0}.qms_workpiece t "
                                                   + " inner join {0}.oms_order t2 on t2.ID = t.OrderID "
                                                   + " inner join {0}.fpc_product t3 on t3.ID = t2.ProductID "
                                                   + " where  t.Status>0 and (@wLineID<=0 or t2.LineID=@wLineID)"
                                                   + " and str_to_date( DATE_FORMAT(t.StartTime,'%Y-%m-1'),'%Y-%m-%d')  >= @wStartTime "
                                                   + " and str_to_date( DATE_FORMAT(t.StartTime,'%Y-%m-1'),'%Y-%m-%d') < @wEndTime "
                                                   + " and ( @wProductID ='' or t2.ProductID IN( {1} ) ) "
                                                   + " group by t2.LineID,t2.ProductID,StatDate ", wInstance, wProductIDList.Count > 0 ? StringUtils.Join(",", wProductIDList) : "0");


                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wDoneStatus", ((int)OMSWorkpieceStatus.Done));
                wParamMap.Add("wScarpStatus", ((int)OMSWorkpieceStatus.Scrap));
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wProductID", StringUtils.Join(",", wProductIDList));

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    QMSOneTimePassRate wQMSOneTimePassRate = new QMSOneTimePassRate();
                    wQMSOneTimePassRate.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wQMSOneTimePassRate.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wQMSOneTimePassRate.ProductName = StringUtils.parseString(wReader["ProductName"]);

                    wQMSOneTimePassRate.StatDate = StringUtils.parseDate(wReader["StatDate"]);
                    wQMSOneTimePassRate.OneTimePassNum = StringUtils.parseDouble(wReader["OneTimePassNum"]);
                    wQMSOneTimePassRate.ScrapNum = StringUtils.parseDouble(wReader["ScrapNum"]);
                    wQMSOneTimePassRate.FeedingNum = StringUtils.parseDouble(wReader["FeedingNum"]);
                    wQMSOneTimePassRate.Num = StringUtils.parseDouble(wReader["Num"]);
                    wQMSOneTimePassRate.NGNum = StringUtils.parseDouble(wReader["NGNum"]);
                    wQMSOneTimePassRate.DoneNum = StringUtils.parseDouble(wReader["DoneNum"]);
                    wQMSOneTimePassRate.DoneGoodNum = StringUtils.parseDouble(wReader["DoneGoodNum"]);

                    wResult.Add(wQMSOneTimePassRate);
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public List<QMSOneTimePassRate> GetOneTimePassRateQuarterList(BMSEmployee wLoginUser, int wLineID, List<int> wProductIDList, DateTime wStartTime, DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                wPagination.Sort = "StatDate";

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format("select t2.ProductID,t2.LineID,Count(t.ID) as FeedingNum,"
                                                   + " Count(t.CheckResult=2 or null) as NGNum,Count(t.Status>1 or null) as Num ,"
                                                   + " Count((t.Status=@wDoneStatus and t.CheckResult=1 and t.RepairCount<=0) or null) as  OneTimePassNum,"
                                                   + " Count(t.Status=@wScarpStatus or null) as  ScrapNum,"
                                + " Count(t.Status=@wDoneStatus or null) as  DoneNum,"
                                + " Count((t.Status=@wDoneStatus and t.CheckResult=1) or null) as  DoneGoodNum, "
                                                   + " str_to_date( concat(  year(t.StartTime),'-',(quarter(t.StartTime) * 3)-2,'-1'),'%Y-%m-%d') as StatDate,"
                                                   + " t3.ProductNo,t3.ProductName"
                                                   + " FROM {0}.qms_workpiece t "
                                                   + " inner join {0}.oms_order t2 on t2.ID = t.OrderID "
                                                   + " inner join {0}.fpc_product t3 on t3.ID = t2.ProductID "
                                                   + " where  t.Status>0 and (@wLineID<=0 or t2.LineID=@wLineID)"
                                                   + " and str_to_date( concat(  year(t.StartTime),'-',(quarter(t.StartTime) * 3)-2,'-1'),'%Y-%m-%d')  >= @wStartTime "
                                                   + " and str_to_date( concat(  year(t.StartTime),'-',(quarter(t.StartTime) * 3)-2,'-1'),'%Y-%m-%d') < @wEndTime "
                                                   + " and ( @wProductID ='' or t2.ProductID IN( {1} ) ) "
                                                   + " group by t2.LineID,t2.ProductID,StatDate ", wInstance, wProductIDList.Count > 0 ? StringUtils.Join(",", wProductIDList) : "0");


                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wDoneStatus", ((int)OMSWorkpieceStatus.Done));
                wParamMap.Add("wScarpStatus", ((int)OMSWorkpieceStatus.Scrap));
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wProductID", StringUtils.Join(",", wProductIDList));

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    QMSOneTimePassRate wQMSOneTimePassRate = new QMSOneTimePassRate();
                    wQMSOneTimePassRate.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wQMSOneTimePassRate.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wQMSOneTimePassRate.ProductName = StringUtils.parseString(wReader["ProductName"]);

                    wQMSOneTimePassRate.StatDate = StringUtils.parseDate(wReader["StatDate"]);
                    wQMSOneTimePassRate.OneTimePassNum = StringUtils.parseDouble(wReader["OneTimePassNum"]);
                    wQMSOneTimePassRate.ScrapNum = StringUtils.parseDouble(wReader["ScrapNum"]);
                    wQMSOneTimePassRate.FeedingNum = StringUtils.parseDouble(wReader["FeedingNum"]);
                    wQMSOneTimePassRate.Num = StringUtils.parseDouble(wReader["Num"]);
                    wQMSOneTimePassRate.NGNum = StringUtils.parseDouble(wReader["NGNum"]);
                    wQMSOneTimePassRate.DoneNum = StringUtils.parseDouble(wReader["DoneNum"]);
                    wQMSOneTimePassRate.DoneGoodNum = StringUtils.parseDouble(wReader["DoneGoodNum"]);

                    wResult.Add(wQMSOneTimePassRate);
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<QMSOneTimePassRate> GetOneTimePassRateYearList(BMSEmployee wLoginUser, int wLineID, List<int> wProductIDList, DateTime wStartTime, DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                wPagination.Sort = "StatDate";

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format("select t2.ProductID,t2.LineID,Count(t.ID) as FeedingNum,"
                                                   + " Count(t.CheckResult=2 or null) as NGNum,Count(t.Status>1 or null) as Num ,"
                                                   + " Count((t.Status=@wDoneStatus and t.CheckResult=1 and t.RepairCount<=0) or null) as  OneTimePassNum,"
                                                   + " Count(t.Status=@wScarpStatus or null) as  ScrapNum,"
                                + " Count(t.Status=@wDoneStatus or null) as  DoneNum,"
                                + " Count((t.Status=@wDoneStatus and t.CheckResult=1) or null) as  DoneGoodNum, "
                                                   + " str_to_date( concat(  year(t.StartTime),'-01','-01'),'%Y-%m-%d') as StatDate,"
                                                   + " t3.ProductNo,t3.ProductName"
                                                   + " FROM {0}.qms_workpiece t "
                                                   + " inner join {0}.oms_order t2 on t2.ID = t.OrderID "
                                                   + " inner join {0}.fpc_product t3 on t3.ID = t2.ProductID "
                                                   + " where  t.Status>0 and (@wLineID<=0 or t2.LineID=@wLineID)"
                                                   + " and str_to_date( concat(  year(t.StartTime),'-01','-01'),'%Y-%m-%d')  >= @wStartTime "
                                                   + " and str_to_date( concat(  year(t.StartTime),'-01','-01'),'%Y-%m-%d') < @wEndTime "
                                                   + " and ( @wProductID ='' or t2.ProductID IN( {1} ) ) "
                                                   + " group by t2.LineID,t2.ProductID,StatDate ", wInstance, wProductIDList.Count > 0 ? StringUtils.Join(",", wProductIDList) : "0");


                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wDoneStatus", ((int)OMSWorkpieceStatus.Done));
                wParamMap.Add("wScarpStatus", ((int)OMSWorkpieceStatus.Scrap));
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wProductID", StringUtils.Join(",", wProductIDList));

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    QMSOneTimePassRate wQMSOneTimePassRate = new QMSOneTimePassRate();
                    wQMSOneTimePassRate.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wQMSOneTimePassRate.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wQMSOneTimePassRate.ProductName = StringUtils.parseString(wReader["ProductName"]);

                    wQMSOneTimePassRate.StatDate = StringUtils.parseDate(wReader["StatDate"]);
                    wQMSOneTimePassRate.OneTimePassNum = StringUtils.parseDouble(wReader["OneTimePassNum"]);
                    wQMSOneTimePassRate.ScrapNum = StringUtils.parseDouble(wReader["ScrapNum"]);
                    wQMSOneTimePassRate.FeedingNum = StringUtils.parseDouble(wReader["FeedingNum"]);
                    wQMSOneTimePassRate.Num = StringUtils.parseDouble(wReader["Num"]);
                    wQMSOneTimePassRate.NGNum = StringUtils.parseDouble(wReader["NGNum"]);
                    wQMSOneTimePassRate.DoneNum = StringUtils.parseDouble(wReader["DoneNum"]);
                    wQMSOneTimePassRate.DoneGoodNum = StringUtils.parseDouble(wReader["DoneGoodNum"]);

                    wResult.Add(wQMSOneTimePassRate);
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public List<QMSOneTimePassRate> GetAllForChart(BMSEmployee wLoginUser, int wLineID, List<int> wProductIDList, int wStatType, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
            try
            {
                if (wProductIDList == null)
                    wProductIDList = new List<int>();


                switch (wStatType)
                {
                    case ((int)DMSStatTypes.Day):
                        wResult = this.GetOneTimePassRateForChartDayList(wLoginUser, wLineID, wProductIDList,
                             wStartTime, wEndTime,
                             wErrorCode);
                        break;
                    case ((int)DMSStatTypes.Week):
                        wResult = this.GetOneTimePassRateForChartWeekList(wLoginUser, wLineID, wProductIDList,
                             wStartTime, wEndTime,
                             wErrorCode);
                        break;
                    case ((int)DMSStatTypes.Month):
                        wResult = this.GetOneTimePassRateForChartMonthList(wLoginUser, wLineID, wProductIDList,
                             wStartTime, wEndTime,
                             wErrorCode);
                        break;
                    case ((int)DMSStatTypes.Quarter):
                        wResult = this.GetOneTimePassRateForChartQuarterList(wLoginUser, wLineID, wProductIDList,
                             wStartTime, wEndTime,
                             wErrorCode);
                        break;
                    case ((int)DMSStatTypes.Year):
                        wResult = this.GetOneTimePassRateForChartYearList(wLoginUser, wLineID, wProductIDList,
                             wStartTime, wEndTime,
                             wErrorCode);
                        break;

                    default:
                        wResult = this.GetOneTimePassRateForChartDayList(wLoginUser, wLineID, wProductIDList,
                             wStartTime, wEndTime,
                             wErrorCode);
                        break;
                }

                List<QMSOneTimePassRate> wCombine = this.GetOneTimePassRateForChartList(wLoginUser, wStatType,
                             wStartTime, wEndTime,
                             wErrorCode);
                if (wCombine == null || wCombine.Count <= 0)
                    return wResult;

                Boolean wIsOwm = false;
                foreach (QMSOneTimePassRate wQMSOneTimePassRate in wCombine)
                {
                    wIsOwm = false;
                    foreach (QMSOneTimePassRate wOneTimePassRate in wResult)
                    {
                        if (wQMSOneTimePassRate.StatDate == wOneTimePassRate.StatDate && wQMSOneTimePassRate.StatType == wOneTimePassRate.StatType) {

                            wOneTimePassRate.ID = wQMSOneTimePassRate.ID;
                            wOneTimePassRate.Capacity = wQMSOneTimePassRate.Capacity;
                            wIsOwm = true;
                        }
                            
                    }

                    if (wIsOwm)
                        continue;

                    wResult.Add(wQMSOneTimePassRate);
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<QMSOneTimePassRate> GetOneTimePassRateForChartDayList(BMSEmployee wLoginUser, int wLineID, List<int> wProductIDList, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format("select t2.ProductID,t2.LineID,Count(t.ID) as FeedingNum,"
                            + " Count(t.CheckResult=2 or null) as NGNum,Count(t.Status>1 or null) as Num ,"
                            + " Count((t.Status=@wDoneStatus and t.CheckResult=1 and t.RepairCount<=0) or null) as  OneTimePassNum,"
                            + " Count(t.Status=@wScarpStatus or null) as  ScrapNum,"
                                + " Count(t.Status=@wDoneStatus or null) as  DoneNum,"
                                + " Count((t.Status=@wDoneStatus and t.CheckResult=1) or null) as  DoneGoodNum, "
                            + " str_to_date( DATE_FORMAT(t.StartTime,'%Y-%m-%d'),'%Y-%m-%d') as StatDate,"
                             + " t3.ProductNo,t3.ProductName"
                            + " FROM {0}.qms_workpiece t "
                            + " inner join {0}.oms_order t2 on t2.ID = t.OrderID "
                            + " inner join {0}.fpc_product t3 on t3.ID = t2.ProductID "
                            + " where  t.Status>0 and (@wLineID<=0 or t2.LineID=@wLineID)"
                            + " and str_to_date( DATE_FORMAT(t.StartTime,'%Y-%m-%d'),'%Y-%m-%d')  >= @wStartTime "
                            + " and str_to_date( DATE_FORMAT(t.StartTime,'%Y-%m-%d'),'%Y-%m-%d') < @wEndTime "
                            + " and ( @wProductID ='' or t2.ProductID IN( {1} ) ) "
                            + " group by StatDate ", wInstance, wProductIDList.Count > 0 ? StringUtils.Join(",", wProductIDList) : "0");


                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wDoneStatus", ((int)OMSWorkpieceStatus.Done));
                wParamMap.Add("wScarpStatus", ((int)OMSWorkpieceStatus.Scrap));
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wStatType", ((int)DMSStatTypes.Day));
                wParamMap.Add("wProductID", StringUtils.Join(",", wProductIDList));

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    QMSOneTimePassRate wQMSOneTimePassRate = new QMSOneTimePassRate();


                    wQMSOneTimePassRate.StatType = ((int)DMSStatTypes.Day); 

                    wQMSOneTimePassRate.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wQMSOneTimePassRate.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wQMSOneTimePassRate.ProductName = StringUtils.parseString(wReader["ProductName"]);

                    wQMSOneTimePassRate.StatDate = StringUtils.parseDate(wReader["StatDate"]);
                    wQMSOneTimePassRate.OneTimePassNum = StringUtils.parseDouble(wReader["OneTimePassNum"]);
                    wQMSOneTimePassRate.ScrapNum = StringUtils.parseDouble(wReader["ScrapNum"]);
                    wQMSOneTimePassRate.FeedingNum = StringUtils.parseDouble(wReader["FeedingNum"]);
                    wQMSOneTimePassRate.Num = StringUtils.parseDouble(wReader["Num"]);
                    wQMSOneTimePassRate.NGNum = StringUtils.parseDouble(wReader["NGNum"]);
                    wQMSOneTimePassRate.DoneNum = StringUtils.parseDouble(wReader["DoneNum"]);
                    wQMSOneTimePassRate.DoneGoodNum = StringUtils.parseDouble(wReader["DoneGoodNum"]);

                    wResult.Add(wQMSOneTimePassRate);
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<QMSOneTimePassRate> GetOneTimePassRateForChartWeekList(BMSEmployee wLoginUser, int wLineID, List<int> wProductIDList, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format("select t2.ProductID,t2.LineID,Count(t.ID) as FeedingNum,"
                                                   + " Count(t.CheckResult=2 or null) as NGNum,Count(t.Status>1 or null) as Num ,"
                                                   + " Count((t.Status=@wDoneStatus and t.CheckResult=1 and t.RepairCount<=0) or null) as  OneTimePassNum,"
                                                   + " Count(t.Status=@wScarpStatus or null) as  ScrapNum,"
                                + " Count(t.Status=@wDoneStatus or null) as  DoneNum,"
                                + " Count((t.Status=@wDoneStatus and t.CheckResult=1) or null) as  DoneGoodNum, "
                                                   + " str_to_date( DATE_FORMAT(t.StartTime,'%Y-%u-1'),'%Y-%u-%w') as StatDate,"
                                                   + " t3.ProductNo,t3.ProductName"
                                                   + " FROM {0}.qms_workpiece t "
                                                   + " inner join {0}.oms_order t2 on t2.ID = t.OrderID "
                                                   + " inner join {0}.fpc_product t3 on t3.ID = t2.ProductID " 
                                                   + " where  t.Status>0 and (@wLineID<=0 or t2.LineID=@wLineID)"
                                                   + " and str_to_date( DATE_FORMAT(t.StartTime,'%Y-%u-1'),'%Y-%u-%w')  >= @wStartTime "
                                                   + " and str_to_date( DATE_FORMAT(t.StartTime,'%Y-%u-1'),'%Y-%u-%w') < @wEndTime "
                                                   + " and ( @wProductID ='' or t2.ProductID IN( {1} ) ) "
                                                   + " group by StatDate ", wInstance, wProductIDList.Count > 0 ? StringUtils.Join(",", wProductIDList) : "0");


                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wStatType", ((int)DMSStatTypes.Week));
                wParamMap.Add("wDoneStatus", ((int)OMSWorkpieceStatus.Done));
                wParamMap.Add("wScarpStatus", ((int)OMSWorkpieceStatus.Scrap));
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wProductID", StringUtils.Join(",", wProductIDList));

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    QMSOneTimePassRate wQMSOneTimePassRate = new QMSOneTimePassRate();

                    wQMSOneTimePassRate.StatType = ((int)DMSStatTypes.Week); 

                    wQMSOneTimePassRate.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wQMSOneTimePassRate.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wQMSOneTimePassRate.ProductName = StringUtils.parseString(wReader["ProductName"]);

                    wQMSOneTimePassRate.StatDate = StringUtils.parseDate(wReader["StatDate"]);
                    wQMSOneTimePassRate.OneTimePassNum = StringUtils.parseDouble(wReader["OneTimePassNum"]);
                    wQMSOneTimePassRate.ScrapNum = StringUtils.parseDouble(wReader["ScrapNum"]);
                    wQMSOneTimePassRate.FeedingNum = StringUtils.parseDouble(wReader["FeedingNum"]);
                    wQMSOneTimePassRate.Num = StringUtils.parseDouble(wReader["Num"]);
                    wQMSOneTimePassRate.NGNum = StringUtils.parseDouble(wReader["NGNum"]);
                    wQMSOneTimePassRate.DoneNum = StringUtils.parseDouble(wReader["DoneNum"]);
                    wQMSOneTimePassRate.DoneGoodNum = StringUtils.parseDouble(wReader["DoneGoodNum"]);

                    wResult.Add(wQMSOneTimePassRate);
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<QMSOneTimePassRate> GetOneTimePassRateForChartMonthList(BMSEmployee wLoginUser, int wLineID, List<int> wProductIDList, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format("select t2.ProductID,t2.LineID,Count(t.ID) as FeedingNum,"
                                                   + " Count(t.CheckResult=2 or null) as NGNum,Count(t.Status>1 or null) as Num ,"
                                                   + " Count((t.Status=@wDoneStatus and t.CheckResult=1 and t.RepairCount<=0) or null) as  OneTimePassNum,"
                                                   + " Count(t.Status=@wScarpStatus or null) as  ScrapNum,"
                                + " Count(t.Status=@wDoneStatus or null) as  DoneNum,"
                                + " Count((t.Status=@wDoneStatus and t.CheckResult=1) or null) as  DoneGoodNum, "
                                                   + " str_to_date( DATE_FORMAT(t.StartTime,'%Y-%m-1'),'%Y-%m-%d') as StatDate,"
                                                   + " t3.ProductNo,t3.ProductName "
                                                   + " FROM {0}.qms_workpiece t "
                                                   + " inner join {0}.oms_order t2 on t2.ID = t.OrderID "
                                                   + " inner join {0}.fpc_product t3 on t3.ID = t2.ProductID " 
                                                   + " where  t.Status>0 and (@wLineID<=0 or t2.LineID=@wLineID)"
                                                   + " and str_to_date(  DATE_FORMAT(t.StartTime,'%Y-%m-1'),'%Y-%m-%d')  >= @wStartTime "
                                                   + " and str_to_date(  DATE_FORMAT(t.StartTime,'%Y-%m-1'),'%Y-%m-%d') < @wEndTime "
                                                   + " and ( @wProductID ='' or t2.ProductID IN( {1} ) ) "
                                                   + " group by StatDate ", wInstance, wProductIDList.Count > 0 ? StringUtils.Join(",", wProductIDList) : "0");


                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wDoneStatus", ((int)OMSWorkpieceStatus.Done));
                wParamMap.Add("wScarpStatus", ((int)OMSWorkpieceStatus.Scrap));
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wStatType", ((int)DMSStatTypes.Month));
                wParamMap.Add("wProductID", StringUtils.Join(",", wProductIDList));

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    QMSOneTimePassRate wQMSOneTimePassRate = new QMSOneTimePassRate();

                    wQMSOneTimePassRate.StatType = ((int)DMSStatTypes.Month); 
                    wQMSOneTimePassRate.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wQMSOneTimePassRate.ProductName = StringUtils.parseString(wReader["ProductName"]);

                    wQMSOneTimePassRate.StatDate = StringUtils.parseDate(wReader["StatDate"]);
                    wQMSOneTimePassRate.OneTimePassNum = StringUtils.parseDouble(wReader["OneTimePassNum"]);
                    wQMSOneTimePassRate.ScrapNum = StringUtils.parseDouble(wReader["ScrapNum"]);
                    wQMSOneTimePassRate.FeedingNum = StringUtils.parseDouble(wReader["FeedingNum"]);
                    wQMSOneTimePassRate.Num = StringUtils.parseDouble(wReader["Num"]);
                    wQMSOneTimePassRate.NGNum = StringUtils.parseDouble(wReader["NGNum"]);
                    wQMSOneTimePassRate.DoneNum = StringUtils.parseDouble(wReader["DoneNum"]);
                    wQMSOneTimePassRate.DoneGoodNum = StringUtils.parseDouble(wReader["DoneGoodNum"]);

                    wResult.Add(wQMSOneTimePassRate);
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<QMSOneTimePassRate> GetOneTimePassRateForChartQuarterList(BMSEmployee wLoginUser, int wLineID, List<int> wProductIDList, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format("select t2.ProductID,t2.LineID,Count(t.ID) as FeedingNum,"
                                                   + " Count(t.CheckResult=2 or null) as NGNum,Count(t.Status>1 or null) as Num ,"
                                                   + " Count((t.Status=@wDoneStatus and t.CheckResult=1 and t.RepairCount<=0) or null) as  OneTimePassNum,"
                                                   + " Count(t.Status=@wScarpStatus or null) as  ScrapNum,"
                                + " Count(t.Status=@wDoneStatus or null) as  DoneNum,"
                                + " Count((t.Status=@wDoneStatus and t.CheckResult=1) or null) as  DoneGoodNum, "
                                                   + " str_to_date( concat(  year(t.StartTime),'-',(quarter(t.StartTime) * 3)-2,'-1'),'%Y-%m-%d') as StatDate,"
                                                   + " t3.ProductNo,t3.ProductName "
                                                   + " FROM {0}.qms_workpiece t "
                                                   + " inner join {0}.oms_order t2 on t2.ID = t.OrderID "
                                                   + " inner join {0}.fpc_product t3 on t3.ID = t2.ProductID " 
                                                   + " where  t.Status>0 and (@wLineID<=0 or t2.LineID=@wLineID)"
                                                   + " and str_to_date( concat(  year(t.StartTime),'-',(quarter(t.StartTime) * 3)-2,'-1'),'%Y-%m-%d')  >= @wStartTime "
                                                   + " and str_to_date( concat(  year(t.StartTime),'-',(quarter(t.StartTime) * 3)-2,'-1'),'%Y-%m-%d') < @wEndTime "
                                                   + " and ( @wProductID ='' or t2.ProductID IN( {1} ) ) "
                                                   + " group by StatDate ", wInstance, wProductIDList.Count > 0 ? StringUtils.Join(",", wProductIDList) : "0");


                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wDoneStatus", ((int)OMSWorkpieceStatus.Done));
                wParamMap.Add("wScarpStatus", ((int)OMSWorkpieceStatus.Scrap));
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wStatType", ((int)DMSStatTypes.Quarter));
                wParamMap.Add("wProductID", StringUtils.Join(",", wProductIDList));

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    QMSOneTimePassRate wQMSOneTimePassRate = new QMSOneTimePassRate();

                    wQMSOneTimePassRate.StatType = ((int)DMSStatTypes.Quarter); 

                    wQMSOneTimePassRate.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wQMSOneTimePassRate.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wQMSOneTimePassRate.ProductName = StringUtils.parseString(wReader["ProductName"]);

                    wQMSOneTimePassRate.StatDate = StringUtils.parseDate(wReader["StatDate"]);
                    wQMSOneTimePassRate.OneTimePassNum = StringUtils.parseDouble(wReader["OneTimePassNum"]);
                    wQMSOneTimePassRate.ScrapNum = StringUtils.parseDouble(wReader["ScrapNum"]);
                    wQMSOneTimePassRate.FeedingNum = StringUtils.parseDouble(wReader["FeedingNum"]);
                    wQMSOneTimePassRate.Num = StringUtils.parseDouble(wReader["Num"]);
                    wQMSOneTimePassRate.NGNum = StringUtils.parseDouble(wReader["NGNum"]);
                    wQMSOneTimePassRate.DoneNum = StringUtils.parseDouble(wReader["DoneNum"]);
                    wQMSOneTimePassRate.DoneGoodNum = StringUtils.parseDouble(wReader["DoneGoodNum"]);

                    wResult.Add(wQMSOneTimePassRate);
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }





        public List<QMSOneTimePassRate> GetOneTimePassRateForChartYearList(BMSEmployee wLoginUser, int wLineID, List<int> wProductIDList, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format("select t2.ProductID,t2.LineID,Count(t.ID) as FeedingNum,"
                                                   + " Count(t.CheckResult=2 or null) as NGNum,Count(t.Status>1 or null) as Num ,"
                                                   + " Count((t.Status=@wDoneStatus and t.CheckResult=1 and t.RepairCount<=0) or null) as  OneTimePassNum,"
                                                   + " Count(t.Status=@wScarpStatus or null) as  ScrapNum,"
                                + " Count(t.Status=@wDoneStatus or null) as  DoneNum,"
                                + " Count((t.Status=@wDoneStatus and t.CheckResult=1) or null) as  DoneGoodNum, "
                                                   + " str_to_date( concat(  year(t.StartTime),'-01','-01'),'%Y-%m-%d') as StatDate,"
                                                   + " t3.ProductNo,t3.ProductName "
                                                   + " FROM {0}.qms_workpiece t "
                                                   + " inner join {0}.oms_order t2 on t2.ID = t.OrderID "
                                                   + " inner join {0}.fpc_product t3 on t3.ID = t2.ProductID " 
                                                   + " and str_to_date( concat(  year(t.StartTime),'-01','-01'),'%Y-%m-%d')  >= @wStartTime "
                                                   + " and str_to_date( concat(  year(t.StartTime),'-01','-01'),'%Y-%m-%d') < @wEndTime "
                                                   + " and ( @wProductID ='' or t2.ProductID IN( {1} ) ) "
                                                   + " group by StatDate ", wInstance, wProductIDList.Count > 0 ? StringUtils.Join(",", wProductIDList) : "0");


                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wStatType", ((int)DMSStatTypes.Year));
                wParamMap.Add("wDoneStatus", ((int)OMSWorkpieceStatus.Done));
                wParamMap.Add("wScarpStatus", ((int)OMSWorkpieceStatus.Scrap));
                wParamMap.Add("wProductID", StringUtils.Join(",", wProductIDList));

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    QMSOneTimePassRate wQMSOneTimePassRate = new QMSOneTimePassRate();

                    wQMSOneTimePassRate.StatType = ((int)DMSStatTypes.Year);
                     

                    wQMSOneTimePassRate.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wQMSOneTimePassRate.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wQMSOneTimePassRate.ProductName = StringUtils.parseString(wReader["ProductName"]);

                    wQMSOneTimePassRate.StatDate = StringUtils.parseDate(wReader["StatDate"]);
                    wQMSOneTimePassRate.OneTimePassNum = StringUtils.parseDouble(wReader["OneTimePassNum"]);
                    wQMSOneTimePassRate.ScrapNum = StringUtils.parseDouble(wReader["ScrapNum"]);
                    wQMSOneTimePassRate.FeedingNum = StringUtils.parseDouble(wReader["FeedingNum"]);
                    wQMSOneTimePassRate.Num = StringUtils.parseDouble(wReader["Num"]);
                    wQMSOneTimePassRate.NGNum = StringUtils.parseDouble(wReader["NGNum"]);
                    wQMSOneTimePassRate.DoneNum = StringUtils.parseDouble(wReader["DoneNum"]);
                    wQMSOneTimePassRate.DoneGoodNum = StringUtils.parseDouble(wReader["DoneGoodNum"]);

                    wResult.Add(wQMSOneTimePassRate);
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



        public List<QMSOneTimePassRate> GetOneTimePassRateForChartList(BMSEmployee wLoginUser, int wStatType, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format("select t.* from qms_capacity t where t.ID>0 "
                                                   + " and (@wStatType<=0 OR t.StatType=@wStatType) " +
                                                   " AND t.StatDate>= @wStartTime and t.StatDate < @wEndTime ", wInstance);


                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wStatType", wStatType);

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                QMSOneTimePassRate wQMSOneTimePassRate = null;
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wQMSOneTimePassRate = new QMSOneTimePassRate();

                    wQMSOneTimePassRate.ID = StringUtils.parseInt(wReader["ID"]);
                    wQMSOneTimePassRate.Capacity = StringUtils.parseDouble(wReader["Capacity"]);
                    wQMSOneTimePassRate.StatDate = StringUtils.parseDate(wReader["StatDate"]);
                    wQMSOneTimePassRate.StatType = StringUtils.parseInt(wReader["StatType"]);

                    wResult.Add(wQMSOneTimePassRate);
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }




        public Dictionary<String, double> QMS_GetDoneQualityRate(BMSEmployee wLoginUser, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {

            Dictionary<String, double> wResult = new Dictionary<string, double>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format("select Count(t.ID) as FeedingNum,"
                                + " Count(t.CheckResult=2 or null) as NGNum,Count(t.Status>1 or null) as Num ,"
                                + " Count((t.Status=@wDoneStatus and t.CheckResult=1 and t.RepairCount<=0) or null) as  OneTimePassNum,"
                                + " Count(t.Status=@wDoneStatus or null) as  DoneNum,"
                                + " Count((t.Status=@wDoneStatus and t.CheckResult=1) or null) as  DoneGoodNum "
                                + " FROM {0}.qms_workpiece t "
                                + " where t.ID>0 AND t.Status>0 "
                                + " and t.StartTime>= @wStartTime and t.StartTime < @wEndTime ", wInstance);


                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wDoneStatus", ((int)OMSWorkpieceStatus.Done));

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    foreach (var item in wReader.Keys)
                    {
                        wResult[item] = StringUtils.parseDouble(wReader[item]);
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


        private QMSOneTimePassRate QMS_CheckOneTimePassRate(BMSEmployee wLoginUser, QMSOneTimePassRate wQMSOneTimePassRate, OutResult<Int32> wErrorCode)
        {
            QMSOneTimePassRate wResult = new QMSOneTimePassRate();
            try
            {

                if (wQMSOneTimePassRate == null || wQMSOneTimePassRate.StatType <= 0 || wQMSOneTimePassRate.StatDate < new DateTime(2010, 1, 1))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return wResult;
                }

                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("StatDate", wQMSOneTimePassRate.StatDate);
                wParamMap.Add("StatType", wQMSOneTimePassRate.StatType);
                wParamMap.Add("ID", wQMSOneTimePassRate.ID);


                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(StringUtils.Format("select * from  {0}.qms_capacity  " +
                    " where ID!=@ID AND StatDate=@StatDate and StatType=@StatType", wInstance), wParamMap);

                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.Capacity = StringUtils.parseDouble(wReader["Capacity"]);
                    wResult.StatDate = StringUtils.parseDate(wReader["StatDate"]);
                    wResult.StatType = StringUtils.parseInt(wReader["StatType"]);
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wResult;
        }

        /// <summary>
        /// 修改设定产能
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wQMSOneTimePassRate"></param>
        /// <param name="wErrorCode"></param>
        public void QMS_UpdateOneTimePassRate(BMSEmployee wLoginUser, QMSOneTimePassRate wQMSOneTimePassRate, OutResult<Int32> wErrorCode)
        {

            wErrorCode.set(0);
            try
            {

                if (wQMSOneTimePassRate == null || wQMSOneTimePassRate.StatType <= 0 || wQMSOneTimePassRate.StatDate < new DateTime(2010, 1, 1))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }


                QMSOneTimePassRate wQMSOneTimePassRateDB = this.QMS_CheckOneTimePassRate(wLoginUser, wQMSOneTimePassRate, wErrorCode);

                if (wErrorCode.Result != 0)
                    return;


                if (wQMSOneTimePassRateDB.ID > 0)
                {
                    if (wQMSOneTimePassRate.ID > 0)
                    {
                        wErrorCode.set(MESException.Duplication.Value);
                        return;
                    }
                    wQMSOneTimePassRate.ID = wQMSOneTimePassRateDB.ID;
                }

                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("StatDate", wQMSOneTimePassRate.StatDate);
                wParamMap.Add("StatType", wQMSOneTimePassRate.StatType);
                wParamMap.Add("Capacity", wQMSOneTimePassRate.Capacity);

                if (wQMSOneTimePassRate.ID <= 0)
                {
                    wQMSOneTimePassRate.ID = this.Insert(StringUtils.Format("{0}.qms_capacity", wInstance), wParamMap);

                }
                else
                {
                    wParamMap.Add("ID", wQMSOneTimePassRate.ID);
                    this.Update(StringUtils.Format("{0}.qms_capacity", wInstance), "ID", wParamMap);
                }
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wErrorCode.set(MESException.DBSQL.Value);
            }

        }

         
    }
}
