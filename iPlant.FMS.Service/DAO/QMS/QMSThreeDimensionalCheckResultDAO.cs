using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class QMSThreeDimensionalCheckResultDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(QMSThreeDimensionalCheckResultDAO));
        private static QMSThreeDimensionalCheckResultDAO Instance = null;

        private QMSThreeDimensionalCheckResultDAO() : base()
        {

        }

        public static QMSThreeDimensionalCheckResultDAO getInstance()
        {
            if (Instance == null)
                Instance = new QMSThreeDimensionalCheckResultDAO();
            return Instance;
        }

        /// <summary>
        /// 获取质量检测结果  无需判断
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wProductID"></param>
        /// <param name="wProductNoLike"></param>
        /// <param name="wParamNameLike"></param>
        /// <param name="wRecordID"></param>
        /// <param name="wWorkpieceNo"></param>
        /// <param name="wCheckResult"></param>
        /// <param name="wActive"></param>
        /// <param name="wStartTime"></param>
        /// <param name="wEndTime"></param>
        /// <param name="wPagination"></param>
        /// <param name="wErrorCode"></param>
        /// <returns></returns>
        public List<QMSThreeDimensionalCheckResult> QMS_GetThreeDimensionalCheckResultAll(BMSEmployee wLoginUser, int wProductID, String wProductNoLike, String wParamNameLike,
            int wRecordID, String wWorkpieceNo, int wCheckResult, int wActive, DateTime wStartTime, DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<QMSThreeDimensionalCheckResult> wResult = new List<QMSThreeDimensionalCheckResult>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                if (StringUtils.isNotEmpty(wProductNoLike))
                {
                    wProductNoLike = "%" + wProductNoLike + "%";
                }
                if (StringUtils.isNotEmpty(wParamNameLike))
                {
                    wParamNameLike = "%" + wParamNameLike + "%";
                }

                String wSQL = StringUtils.Format("SELECT p.ID,p.RecordID,p.ParameterValue as ActualValue,p.SampleTime as EditTime ,"
                  + " t.WorkpieceNo,t.Status as Result,t.Active,t3.CheckParameter,t3.TheoreticalValue,t3.LowerTolerance,t3.UpperTolerance,"
                  + " t4.ProductName,t4.ProductNo,t5.ProductID FROM {0}.dms_device_recorditem p "
                  + " inner join {0}.dms_device_processrecord t on p.RecordID = t.ID and t.RecordType=@wRecordType  "
                  + " inner join {0}.dms_device_ledger t1 on t.AssetNo = t1.AssetNo  "
                  + " inner join {0}.oms_order t5 on t.OrderID = t5.ID  "
                  + " inner join {0}.dms_device_parameter t2 on t2.Code = p.ParameterNo and t2.DeviceID = t1.ID and t2.DataClass =@wDataClass  and t2.Active=1 "
                  + " inner join {0}.fpc_product t4 on t5.ProductID = t4.ID  "
                  + " inner join {0}.qms_threedimensional t3 on t2.ID = t3.ParameterID AND t5.ProductID = t3.ProductID  "
                  + " where 1=1 "
                  + " and ( @wRecordID <= 0 or p.RecordID  = @wRecordID)  "
                  + " and ( @wProductID <= 0 or t5.ProductID  = @wProductID)  "
                  + " and ( @wWorkpieceNo =''  or t.WorkpieceNo  = @wWorkpieceNo) "
                  + " and ( @wProductNoLike =''  or t4.ProductNo  like @wProductNoLike  or t4.ProductName  like @wProductNoLike) "
                  + " and ( @wParamNameLike =''  or t3.CheckParameter   like @wParamNameLike ) "
                  + " and ( @wCheckResult <= 0 or t.Status  = @wCheckResult)"
                  + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wStartTime <= p.SampleTime) "
                  + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= p.SampleTime)  "
                  + " and ( @wActive < 0 or t.Active  = @wActive) ", wInstance);


                wParamMap.Add("wRecordType", ((int)DMSRecordTypes.Check));
                wParamMap.Add("wDataClass", ((int)DMSDataClass.QualityParams));

                wParamMap.Add("wRecordID", wRecordID);
                wParamMap.Add("wProductID", wProductID);
                wParamMap.Add("wWorkpieceNo", wWorkpieceNo);
                wParamMap.Add("wCheckResult", wCheckResult);
                wParamMap.Add("wParamNameLike", wParamNameLike);
                wParamMap.Add("wProductNoLike", wProductNoLike);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wActive", wActive);


                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    QMSThreeDimensionalCheckResult wThreeDimensionalCheckResult = new QMSThreeDimensionalCheckResult();

                    wThreeDimensionalCheckResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wThreeDimensionalCheckResult.RecordID = StringUtils.parseInt(wReader["RecordID"]);
                    wThreeDimensionalCheckResult.WorkpieceNo = StringUtils.parseString(wReader["WorkpieceNo"]);
                    wThreeDimensionalCheckResult.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wThreeDimensionalCheckResult.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wThreeDimensionalCheckResult.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    wThreeDimensionalCheckResult.CheckParameter = StringUtils.parseString(wReader["CheckParameter"]);
                    wThreeDimensionalCheckResult.TheoreticalValue = StringUtils.parseDouble(wReader["TheoreticalValue"]);
                    wThreeDimensionalCheckResult.LowerTolerance = StringUtils.parseDouble(wReader["LowerTolerance"]);
                    wThreeDimensionalCheckResult.UpperTolerance = StringUtils.parseDouble(wReader["UpperTolerance"]);
                    wThreeDimensionalCheckResult.ActualValue = StringUtils.parseDouble(wReader["ActualValue"]);
                    wThreeDimensionalCheckResult.EditTime = StringUtils.parseDate(wReader["EditTime"]);
                    wThreeDimensionalCheckResult.Result = StringUtils.parseInt(wReader["Result"]);
                    wThreeDimensionalCheckResult.Active = StringUtils.parseInt(wReader["Active"]);
                    wResult.Add(wThreeDimensionalCheckResult);
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
        /// 获取单个检验项点的合格率
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wStartTime"></param>
        /// <param name="wEndTime"></param>
        /// <param name="wErrorCode"></param>
        /// <returns></returns>
        public Dictionary<String, double> QMS_GetQualityRate(BMSEmployee wLoginUser, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            Dictionary<String, double> wResult = new Dictionary<String, double>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();


                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if (wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if (wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return wResult;
                }

                List<int> wRecordType = StringUtils.parseListArgs(((int)DMSRecordTypes.Check), ((int)DMSRecordTypes.SpotCheck));

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();


                String wSQL = StringUtils.Format("SELECT t2.ID,t2.Name,COUNT(p.ID) as Num , "
                 + " COUNT(case when(t3.TheoreticalValue = null OR p.ParameterValue = null) then null "
                 + " when((p.ParameterValue - t3.TheoreticalValue) > t3.UpperTolerance or(p.ParameterValue - t3.TheoreticalValue) < t3.LowerTolerance) then p.ID ELSE NULL END) as NGNum "
                 + " FROM iplantfms.dms_device_parameter t2 "
                 + " left join iplantfms.dms_device_recorditem p on  p.ID>0 AND  t2.Code = p.ParameterNo  "
                 + " AND ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')    or @wStartTime <= p.SampleTime) "
                 + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')    or @wEndTime >= p.SampleTime)  "
                 + " left join iplantfms.dms_device_processrecord t on p.RecordID = t.ID and t.RecordType in ({1}) and t.Active = 1 "
                 + " left join iplantfms.oms_order t5 on t.OrderID = t5.ID and t5.ID>0 "
                 + " left join iplantfms.fpc_product t4 on t5.ProductID = t4.ID "
                 + " left join iplantfms.qms_threedimensional t3 on t3.ID>0 AND t2.ID = t3.ParameterID AND t5.ProductID = t3.ProductID "
                 + " where t2.ID > 0 and t2.Active = 1  and t2.DataClass = @wDataClass GROUP BY t2.ID "
               , wInstance, StringUtils.Join(",", wRecordType));


                wParamMap.Add("wDataClass", ((int)DMSDataClass.QualityParams));

                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);


                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                double wNGNum = 0;

                double Num = 0;
                String wName = "";

                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wName = StringUtils.parseString(wReader["Name"]);
                    wNGNum = StringUtils.parseDouble(wReader["NGNum"]);
                    Num = StringUtils.parseDouble(wReader["Num"]);

                    if (Num <= 0 || wNGNum > Num)
                    {
                        if (!wResult.ContainsKey(wName))
                        {
                            wResult.Add(wName, 0);
                        }
                        else
                        {
                            wResult[wName] = 0;
                        }
                        continue;
                    }

                    if (wNGNum <= 0)
                    {
                        if (!wResult.ContainsKey(wName))
                        {
                            wResult.Add(wName, 1);
                        }
                        else
                        {
                            wResult[wName] = 1;
                        }
                        continue;
                    }

                    //不合格率计算


                    if (!wResult.ContainsKey(wName))
                    {
                        wResult.Add(wName, (Num - wNGNum) / Num);
                    }
                    else
                    {
                        wResult[wName] = (Num - wNGNum) / Num;
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



        public List<QMSThreeDimensionalSet> QMS_GetThreeDimensionalSetAll(BMSEmployee wLoginUser, int wProductID,
            String wProductNoLike, String wCheckParameterLike, int wType, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<QMSThreeDimensionalSet> wResult = new List<QMSThreeDimensionalSet>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format(" select t3.ID as ParameterID_1,t3.Name as ParameterName,t.*,t1.ProductName,t1.ProductNo,t2.Name as EditorName "
                     + " FROM {0}.dms_device_parameter t3  "
                     + " left join {0}.qms_threedimensional t  on t3.ID = t.ParameterID and (@wProductID<=0 OR t.ProductID=@wProductID )"
                     + " left join {0}.fpc_product t1 on t.ProductID=t1.ID and (@wProductID<=0 OR t1.ID=@wProductID )"  
                     + " left join {0}.mbs_user t2 on t.EditorID=t2.ID "
                     + " where t3.DataClass=@wDataClass and t3.Active=1  "
                     + " and(@wType <= 0 OR t.Type = @wType)"
                     + " and  (@wProductNoLike = '' OR t1.ProductNo like @wProductNoLike  OR t1.ProductName like @wProductNoLike) "
                     + " and  (@wCheckParameterLike = '' OR t.CheckParameter like @wCheckParameterLike )  "
                     + " group by t3.ID,t.ProductID", wInstance);


                wParamMap.Add("wDataClass", ((int)DMSDataClass.QualityParams));
                wParamMap.Add("wType", wType);
                wParamMap.Add("wProductID", wProductID);
                wParamMap.Add("wProductNoLike", StringUtils.isEmpty(wProductNoLike) ? "" : "%" + wProductNoLike + "%");
                wParamMap.Add("wCheckParameterLike", StringUtils.isEmpty(wCheckParameterLike) ? "" : "%" + wCheckParameterLike + "%");


                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    QMSThreeDimensionalSet wThreeDimensionalSet = new QMSThreeDimensionalSet();

                    wThreeDimensionalSet.ID = StringUtils.parseInt(wReader["ID"]);
                    wThreeDimensionalSet.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wThreeDimensionalSet.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wThreeDimensionalSet.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    wThreeDimensionalSet.Type = StringUtils.parseInt(wReader["Type"]);
                    wThreeDimensionalSet.ParameterID = StringUtils.parseInt(wReader["ParameterID_1"]);
                    wThreeDimensionalSet.CheckParameter = StringUtils.parseString(wReader["ParameterName"]);
                    wThreeDimensionalSet.TheoreticalValue = StringUtils.parseDouble(wReader["TheoreticalValue"]);
                    wThreeDimensionalSet.LowerTolerance = StringUtils.parseDouble(wReader["LowerTolerance"]);
                    wThreeDimensionalSet.UpperTolerance = StringUtils.parseDouble(wReader["UpperTolerance"]);
                    wThreeDimensionalSet.EditorID = StringUtils.parseInt(wReader["EditorID"]);
                    wThreeDimensionalSet.EditorName = StringUtils.parseString(wReader["EditorName"]);
                    wThreeDimensionalSet.EditTime = StringUtils.parseDate(wReader["EditTime"]);
                    wResult.Add(wThreeDimensionalSet);
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public QMSThreeDimensionalSet QMS_GetThreeDimensionalSet(BMSEmployee wLoginUser, int wProductID,
            String wCheckParameter, OutResult<Int32> wErrorCode)
        {
            QMSThreeDimensionalSet wResult = new QMSThreeDimensionalSet();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wProductID <= 0 || StringUtils.isEmpty(wCheckParameter))
                    return wResult;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format(" select t.* FROM {0}.qms_threedimensional t "
                                                + "   where t.ProductID = @wProductID and t.CheckParameter=@wCheckParameter ", wInstance);

                wParamMap.Add("wProductID", wProductID);
                wParamMap.Add("wCheckParameter", wCheckParameter);
                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wResult.CheckParameter = StringUtils.parseString(wReader["CheckParameter"]);
                    wResult.TheoreticalValue = StringUtils.parseDouble(wReader["TheoreticalValue"]);
                    wResult.LowerTolerance = StringUtils.parseDouble(wReader["LowerTolerance"]);
                    wResult.UpperTolerance = StringUtils.parseDouble(wReader["UpperTolerance"]);
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



        public void QMS_UpdateThreeDimensionalSet(BMSEmployee wLoginUser, QMSThreeDimensionalSet wQMSThreeDimensionalSet, OutResult<Int32> wErrorCode)
        {
            try
            {

                if (wQMSThreeDimensionalSet == null || wQMSThreeDimensionalSet.ProductID <= 0 || StringUtils.isEmpty(wQMSThreeDimensionalSet.CheckParameter))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                if (wQMSThreeDimensionalSet.UpperTolerance < wQMSThreeDimensionalSet.LowerTolerance)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                QMSThreeDimensionalSet wQMSThreeDimensionalSetDB = this.QMS_GetThreeDimensionalSet(wLoginUser, wQMSThreeDimensionalSet.ProductID, wQMSThreeDimensionalSet.CheckParameter, wErrorCode);
                if (wQMSThreeDimensionalSetDB.ID > 0 && wQMSThreeDimensionalSetDB.ID != wQMSThreeDimensionalSet.ID)
                {

                    if (wQMSThreeDimensionalSet.ID <= 0)
                    {
                        wQMSThreeDimensionalSet.ID = wQMSThreeDimensionalSetDB.ID;
                    }
                    else
                    {
                        wErrorCode.Result = MESException.Duplication.Value;
                        return;
                    }
                }
                if (wQMSThreeDimensionalSet.Type <= 0)
                    wQMSThreeDimensionalSet.Type = ((int)QMSParameterTypes.ThreeDimensional); //默认三坐标配置

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("ProductID", wQMSThreeDimensionalSet.ProductID);
                wParamMap.Add("Type", wQMSThreeDimensionalSet.Type);
                wParamMap.Add("ParameterID", wQMSThreeDimensionalSet.ParameterID);
                wParamMap.Add("CheckParameter", wQMSThreeDimensionalSet.CheckParameter);
                wParamMap.Add("TheoreticalValue", wQMSThreeDimensionalSet.TheoreticalValue);
                wParamMap.Add("LowerTolerance", wQMSThreeDimensionalSet.LowerTolerance);
                wParamMap.Add("UpperTolerance", wQMSThreeDimensionalSet.UpperTolerance);
                wParamMap.Add("EditorID", wQMSThreeDimensionalSet.EditorID);
                wParamMap.Add("EditTime", DateTime.Now);

                if (wQMSThreeDimensionalSet.ID <= 0)
                {
                    wQMSThreeDimensionalSet.ID = this.Insert(StringUtils.Format("{0}.qms_threedimensional", wInstance), wParamMap);

                }
                else
                {
                    wParamMap.Add("ID", wQMSThreeDimensionalSet.ID);
                    this.Update(StringUtils.Format("{0}.qms_threedimensional", wInstance), "ID", wParamMap);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public void QMS_DeleteThreeDimensionalSet(BMSEmployee wLoginUser, QMSThreeDimensionalSet wQMSThreeDimensionalSet, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {
                if (wQMSThreeDimensionalSet == null || wQMSThreeDimensionalSet.ProductID <= 0 || StringUtils.isEmpty(wQMSThreeDimensionalSet.CheckParameter))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("ID", wQMSThreeDimensionalSet.ID);

                this.Delete(StringUtils.Format("{0}.qms_threedimensional", wInstance), wParamMap);


            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }


    }
}
