using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class QMSWorkpieceDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(QMSWorkpieceDAO));
        private static QMSWorkpieceDAO Instance = null;

        private QMSWorkpieceDAO() : base()
        {
        }

        public static QMSWorkpieceDAO getInstance()
        {
            if (Instance == null)
                Instance = new QMSWorkpieceDAO();
            return Instance;
        }

        /// <summary>
        /// 插入生成的工件
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wQMSWorkpieceList"></param>
        /// <param name="wErrorCode"></param>
        /// <returns></returns>
        public bool QMS_InsertWorkpiece(BMSEmployee wLoginUser, List<QMSWorkpiece> wQMSWorkpieceList, OutResult<Int32> wErrorCode)
        {

            try
            {
                if (wQMSWorkpieceList == null || wQMSWorkpieceList.Count <= 0)
                    return true;

                foreach (QMSWorkpiece wQMSWorkpiece in wQMSWorkpieceList)
                {

                    if (wQMSWorkpiece == null || StringUtils.isEmpty(wQMSWorkpiece.WorkpieceNo))
                        continue;

                    wErrorCode.set(0);
                    String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                    Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                    wParamMap.Add("OrderID", wQMSWorkpiece.OrderID);
                    wParamMap.Add("WorkpieceNo", wQMSWorkpiece.WorkpieceNo);
                    wParamMap.Add("StartTime", DateTime.Now);
                    wParamMap.Add("CheckResult", 1);

                    wQMSWorkpiece.ID = this.Insert(StringUtils.Format("{0}.qms_workpiece", wInstance), wParamMap);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                return false;
            }
            return true;
        }

        /// <summary>
        /// 删除下发失败的工件  或未加工的工件
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wQMSWorkpieceList"></param>
        /// <param name="wErrorCode"></param>
        /// <returns></returns>
        public bool QMS_DeleteWorkpiece(BMSEmployee wLoginUser, List<QMSWorkpiece> wQMSWorkpieceList, OutResult<Int32> wErrorCode)
        {
            try
            {
                if (wQMSWorkpieceList == null || wQMSWorkpieceList.Count <= 0)
                    return true;
                wErrorCode.set(0);

                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                List<int> wWorkpieceIDList = wQMSWorkpieceList.Select(p => p.ID).Distinct().ToList();

                List<String> wWorkpieceNoList = wQMSWorkpieceList.Select(p => p.WorkpieceNo).Distinct().ToList();

                wWorkpieceIDList.RemoveAll(p => p <= 0);


                wWorkpieceNoList.RemoveAll(p => StringUtils.isEmpty(p));

                if (wWorkpieceIDList.Count <= 0 && wWorkpieceNoList.Count <= 0)
                    return true;

                String wSQL = StringUtils.Format(" delete from {0}.qms_workpiece where ID>0 AND Status<=0 and (ID IN ({1})  OR WorkpieceNo IN ('{2}')  ) ",
                    wInstance, (wWorkpieceIDList.Count > 0) ? StringUtils.Join(",", wWorkpieceIDList) : "0", StringUtils.Join("','", wWorkpieceNoList));


                mDBPool.update(wSQL, wParamMap);


            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                return false;
            }
            return true;
        }

        /// <summary>
        /// 修改工件信息   不能修改订单 时间 工件状态
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wQMSWorkpiece"></param>
        /// <param name="wErrorCode"></param>
        /// <returns></returns>
        public bool QMS_UpdateWorkpiece(BMSEmployee wLoginUser, QMSWorkpiece wQMSWorkpiece, OutResult<Int32> wErrorCode)
        {

            try
            {
                if (wQMSWorkpiece == null || StringUtils.isEmpty(wQMSWorkpiece.WorkpieceNo))
                    return false;
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("SpotCheckResult", wQMSWorkpiece.SpotCheckResult);
                wParamMap.Add("PatrolCheckResult", wQMSWorkpiece.PatrolCheckResult);
                // wParamMap.Add("RepairCount", wQMSWorkpiece.RepairCount);
                wParamMap.Add("WorkpieceNo", wQMSWorkpiece.WorkpieceNo);
                wParamMap.Add("ThreeDimensionalResult", wQMSWorkpiece.ThreeDimensionalResult);
                wParamMap.Add("CheckResult", wQMSWorkpiece.CheckResult);

                wParamMap.Add("RepairResult", wQMSWorkpiece.RepairResult);
                wParamMap.Add("RepairRemark", wQMSWorkpiece.RepairRemark);
                 
                wParamMap.Add("Remark", wQMSWorkpiece.Remark);

                this.Update(StringUtils.Format("{0}.qms_workpiece", wInstance), "WorkpieceNo", wParamMap);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                return false;
            }
            return true;
        }



        /// <summary>
        /// 修改工件检查结果信息
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wWorkpieceNo"></param>
        /// <param name="wPropertyName"></param>
        /// <param name="wResult"></param>
        /// <param name="wErrorCode"></param>
        /// <returns></returns>
        public bool QMS_UpdateWorkpieceResult(BMSEmployee wLoginUser, String wWorkpieceNo, String wPropertyName, int wResult, int wUpdateCheckResult, OutResult<Int32> wErrorCode)
        {

            try
            {
                if (wResult <= 0 || wResult > 2 || StringUtils.isEmpty(wPropertyName) || StringUtils.isEmpty(wWorkpieceNo))
                    return false;
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                if (wResult == 0)
                    wResult = 1;


                wParamMap.Add("CheckResult", wResult);
                wParamMap.Add("WorkpieceNo", wWorkpieceNo);

                if (!wParamMap.ContainsKey(wPropertyName))
                {
                    wParamMap.Add(wPropertyName, wResult);
                }

                this.Update(StringUtils.Format("{0}.qms_workpiece ", wInstance), "WorkpieceNo", wParamMap);


                if (wUpdateCheckResult == 1)
                {
                    wParamMap.Clear();

                    wParamMap.Add("WorkpieceNo", wWorkpieceNo);
                    wParamMap.Add("BadResult", 2);
                    mDBPool.update(StringUtils.Format("update  {0}.qms_workpiece set CheckResult =  " +
                        "(case when (PatrolCheckResult=@BadResult or PatrolCheckResult=@BadResult or PatrolCheckResult=@BadResult)  THEN 2 ELSE 1 END) WHERE WorkpieceNo=@WorkpieceNo   ", wInstance), wParamMap);
                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                return false;
            }
            return true;
        }


        /// <summary>
        /// 修改工件检查结果信息
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wWorkpieceID"></param>
        /// <param name="wPropertyName"></param>
        /// <param name="wResult"></param>
        /// <param name="wErrorCode"></param>
        /// <returns></returns>
        public bool QMS_UpdateWorkpieceResult(BMSEmployee wLoginUser, int wWorkpieceID, String wPropertyName, int wResult, int wUpdateCheckResult, OutResult<Int32> wErrorCode)
        {

            try
            {
                if (wResult <= 0 || wResult > 2 || StringUtils.isEmpty(wPropertyName) || wWorkpieceID <= 0)
                    return false;
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();


                wParamMap.Add("CheckResult", wResult);
                wParamMap.Add("ID", wWorkpieceID);

                if (!wParamMap.ContainsKey(wPropertyName))
                {
                    wParamMap.Add(wPropertyName, wResult);
                }

                this.Update(StringUtils.Format("{0}.qms_workpiece", wInstance), "ID", wParamMap);



                if (wUpdateCheckResult == 1)
                {
                    wParamMap.Clear();

                    wParamMap.Add("ID", wWorkpieceID);
                    wParamMap.Add("BadResult", 2);
                    mDBPool.update(StringUtils.Format("update  {0}.qms_workpiece set CheckResult =  " +
                        "(case when (PatrolCheckResult=@BadResult or PatrolCheckResult=@BadResult or PatrolCheckResult=@BadResult)  THEN 2 ELSE 1 END) WHERE WorkpieceNo=@WorkpieceNo   ", wInstance), wParamMap);
                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                return false;
            }
            return true;
        }


        /// <summary>
        /// 修改工件检查结果信息
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wWorkpieceID"></param>
        /// <param name="wPropertyName"></param>
        /// <param name="wResult"></param>
        /// <param name="wErrorCode"></param>
        /// <returns></returns>
        public bool QMS_UpdateWorkpieceRepairCount(BMSEmployee wLoginUser, String wWorkpieceNo, OutResult<Int32> wErrorCode)
        {

            try
            {
                if (StringUtils.isEmpty(wWorkpieceNo))
                    return false;
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();


                wParamMap.Add("wWorkpieceNo", wWorkpieceNo);

                wParamMap.Add("wRecordType", ((int)DMSRecordTypes.Repair));


                mDBPool.update(StringUtils.Format("update {0}.qms_workpiece t, "
                + " ( SELECT count(0) as ItemCount FROM {0}.dms_device_processrecord "
                + " where RecordType =@wRecordType and WorkpieceNo = @wWorkpieceNo)  t1"
                + " set t.RepairCount = t1.ItemCount where t.ID > 0 AND t.WorkpieceNo = @wWorkpieceNo;", wInstance), wParamMap);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                return false;
            }
            return true;
        }




        /// <summary>
        /// 修改工件状态
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wWorkpieceNo"></param>
        /// <param name="wStatus"></param>
        /// <param name="wErrorCode"></param>
        /// <returns></returns>
        public bool QMS_UpdateWorkpieceStatus(BMSEmployee wLoginUser, String wWorkpieceNo, String wOrderNo, int wStatus, String wRemark, OutResult<Int32> wErrorCode)
        {

            try
            {
                if (StringUtils.isEmpty(wWorkpieceNo))
                    return false;
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                OMSWorkpieceStatus wOMSWorkpieceStatus;
                if (!Enum.TryParse<OMSWorkpieceStatus>(wStatus + "", out wOMSWorkpieceStatus))
                    return false;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("WorkpieceNo", wWorkpieceNo);
                wParamMap.Add("Status", wStatus);

                if (StringUtils.isNotEmpty(wRemark))
                {
                    wParamMap.Add("Remark", wRemark);
                }

                List<int> wAllowStatus = new List<int>() { (int)OMSWorkpieceStatus.Default };

                switch (wOMSWorkpieceStatus)
                {
                    case OMSWorkpieceStatus.Default:
                        break;
                    case OMSWorkpieceStatus.Start:
                        wParamMap.Add("StartTime", DateTime.Now);
                        wAllowStatus.Add(((int)OMSWorkpieceStatus.Scrap));
                        break;
                    case OMSWorkpieceStatus.Done:
                        wAllowStatus.Add(((int)OMSWorkpieceStatus.Start));
                        wAllowStatus.Add(((int)OMSWorkpieceStatus.Scrap));
                        wParamMap.Add("EndTime", DateTime.Now);
                        break;
                    case OMSWorkpieceStatus.Scrap:
                        wAllowStatus.Add(((int)OMSWorkpieceStatus.Start));
                        wAllowStatus.Add(((int)OMSWorkpieceStatus.Done));
                        wParamMap.Add("EndTime", DateTime.Now);
                        break;
                    default:
                        break;
                }


                int wRowChange = this.Update(StringUtils.Format(" {0}.qms_workpiece  ", wInstance), "WorkpieceNo", wParamMap, " and Status in (", StringUtils.Join(",", wAllowStatus), ") ");


                //工件状态变更前可由工件当前检验结果获取其是报废还是完成  或者完成信号就是完成 报废信号就是报废
                //设置订单完成数 报废数

                if (StringUtils.isEmpty(wOrderNo))
                {
                    var wWorkpiece = this.QMS_SelectWorkpiece(wLoginUser, -1, wWorkpieceNo, wErrorCode);
                    if (wWorkpiece == null || wWorkpiece.ID <= 0 || StringUtils.isEmpty(wWorkpiece.OrderNo))
                        return true;

                    wOrderNo = wWorkpiece.OrderNo;
                }

                if (wRowChange > 0 && wOMSWorkpieceStatus == OMSWorkpieceStatus.Start)
                {

                    OMSOrderDAO.getInstance().OMS_UpdateOrderFQTY(wLoginUser, wOrderNo, wWorkpieceNo, wErrorCode);

                }
                else
                {
                    OMSOrderDAO.getInstance().OMS_UpdateOrderFQTY(wLoginUser, wOrderNo, "", wErrorCode);
                }


            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                return false;
            }
            return true;
        }



        /// <summary>
        /// 根据订单创建工件 可以挪移到Impl中
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wOrderID"></param>
        /// <param name="wNum"></param>
        /// <param name="wErrorCode"></param>
        /// <returns></returns>
        public List<QMSWorkpiece> QMS_CreateWorkpiece(BMSEmployee wLoginUser, int wOrderID, int wNum, OutResult<Int32> wErrorCode)
        {
            List<QMSWorkpiece> wResult = new List<QMSWorkpiece>();
            lock (mLockHelper)
            {
                wErrorCode.set(0);
                try
                {
                    if (wOrderID <= 0 || wNum <= 0)
                        return wResult;


                    OMSOrder wOMSOrder = OMSOrderDAO.getInstance().OMS_SelectOrderByID(wLoginUser, wOrderID, wErrorCode);

                    if (wOMSOrder == null || wOMSOrder.ID <= 0 || wErrorCode.Result != 0 || StringUtils.isEmpty(wOMSOrder.OrderNo))
                    {
                        return wResult;
                    }
                    if (wOMSOrder.FeedFQTY > wOMSOrder.PlanFQTY && wOMSOrder.Status != ((int)OMSOrderStatus.PlantOrder) && wOMSOrder.Status != ((int)OMSOrderStatus.ProductOrder))
                    {
                        return wResult;
                    }

                    // String wNewCode = this.CreateMaxCode(StringUtils.Format(" {0}.qms_workpiece  ", iPlant.Data.EF.MESDBSource.Basic.getDBName()), wOMSOrder.OrderNo, "WorkpieceNo", 4);


                    String wNewCode = this.CreateMaxCode(StringUtils.Format(" {0}.qms_workpiece  ", iPlant.Data.EF.MESDBSource.Basic.getDBName()), wOMSOrder.OrderNo, "WorkpieceNo", 4, 1);


                    int wNumber = wNewCode.Substring(wOMSOrder.OrderNo.Length).ParseToInt();

                    QMSWorkpiece wQMSWorkpiece;
                    for (int i = 0; i < wNum; i++)
                    {
                        wQMSWorkpiece = new QMSWorkpiece();
                        wQMSWorkpiece.OrderID = wOMSOrder.ID;
                        wQMSWorkpiece.OrderNo = wOMSOrder.OrderNo;
                        wQMSWorkpiece.ProductID = wOMSOrder.ProductID;
                        wQMSWorkpiece.ProductNo = wOMSOrder.ProductNo;
                        wQMSWorkpiece.LineID = wOMSOrder.LineID;
                        wQMSWorkpiece.WorkpieceNo = StringUtils.Format("{0}{1}", wOMSOrder.OrderNo, String.Format("{0:D4}", wNumber));
                        wQMSWorkpiece.StartTime = DateTime.Now;
                        wQMSWorkpiece.Status = 0;
                        wQMSWorkpiece.Remark = "";
                        wResult.Add(wQMSWorkpiece);
                        wNumber++;
                    }

                }
                catch (Exception e)
                {
                    wErrorCode.set(MESException.DBSQL.Value);
                    logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                }
            }
            return wResult;
        }


        public List<QMSWorkpiece> QMS_SelectWorkpieceAll(BMSEmployee wLoginUser, int wLineID, int wCommandID, int wOrderID,
            String wOrderNo, int wProductID, String wProductNo, String wWorkpieceNo, int wStatus,
            int wCheckResult, int wSpotCheckResult, int wPatrolCheckResult, int wThreeDimensionalResult,
                DateTime wStartTime, DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<QMSWorkpiece> wResult = new List<QMSWorkpiece>();
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                if (StringUtils.isNotEmpty(wProductNo))
                {
                    wProductNo = "%" + wProductNo + "%";
                }
                if (StringUtils.isNotEmpty(wOrderNo) && !wOrderNo.Contains("%"))
                {
                    wOrderNo = "%" + wOrderNo + "%";
                }
                if (StringUtils.isNotEmpty(wWorkpieceNo) && !wWorkpieceNo.Contains("%"))
                {
                    wWorkpieceNo = "%" + wWorkpieceNo + "%";
                }


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format(" select t.*,t2.OrderNo,t2.LineID,t1.Name as LineName,t2.ProductID,t3.ProductNo,t3.ProductName FROM {0}.qms_workpiece t "
                                                   + " inner join {0}.oms_order t2 on t2.ID = t.OrderID "
                                                   + " left join {0}.fmc_line t1 on t1.ID = t2.LineID "
                                                   + " inner join {0}.fpc_product t3 on t3.ID = t2.ProductID "
                                                   + " where  (@wLineID<=0 or t2.LineID=@wLineID) "
                                                   + " and  (@wCommandID<=0 or t2.CommandID=@wCommandID) "
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
                                                   + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d') or  t.EndTime <= str_to_date('2010-01-01', '%Y-%m-%d') or @wStartTime <= t.EndTime ) "
                                                   + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= t.StartTime)  ", wInstance);
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wCommandID", wCommandID);
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
                    QMSWorkpiece wSpotCheckRecord = new QMSWorkpiece();

                    wSpotCheckRecord.ID = StringUtils.parseInt(wReader["ID"]);
                    wSpotCheckRecord.WorkpieceNo = StringUtils.parseString(wReader["WorkpieceNo"]);
                    wSpotCheckRecord.OrderID = StringUtils.parseInt(wReader["OrderID"]);
                    wSpotCheckRecord.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wSpotCheckRecord.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wSpotCheckRecord.LineName = StringUtils.parseString(wReader["LineName"]);
                    wSpotCheckRecord.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wSpotCheckRecord.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wSpotCheckRecord.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    wSpotCheckRecord.SpotCheckResult = StringUtils.parseInt(wReader["SpotCheckResult"]);
                    wSpotCheckRecord.PatrolCheckResult = StringUtils.parseInt(wReader["PatrolCheckResult"]);
                    wSpotCheckRecord.RepairCount = StringUtils.parseInt(wReader["RepairCount"]);
                    wSpotCheckRecord.RepairResult = StringUtils.parseInt(wReader["RepairResult"]);
                    wSpotCheckRecord.RepairRemark = StringUtils.parseString(wReader["RepairRemark"]);
                    wSpotCheckRecord.Status = StringUtils.parseInt(wReader["Status"]);
                    wSpotCheckRecord.Remark = StringUtils.parseString(wReader["Remark"]);
                    wSpotCheckRecord.ThreeDimensionalResult = StringUtils.parseInt(wReader["ThreeDimensionalResult"]);
                    wSpotCheckRecord.CheckResult = StringUtils.parseInt(wReader["CheckResult"]);
                    wSpotCheckRecord.StartTime = StringUtils.parseDate(wReader["StartTime"]);
                    wSpotCheckRecord.EndTime = StringUtils.parseDate(wReader["EndTime"]);
                    wResult.Add(wSpotCheckRecord);
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

         

        public List<QMSWorkpiece> QMS_SelectWorkpieceAll(BMSEmployee wLoginUser, int wLineID, List<String> wWorkpieceNoList, OutResult<Int32> wErrorCode)
        {
            List<QMSWorkpiece> wResult = new List<QMSWorkpiece>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format(" select t.*,t2.OrderNo,t2.LineID,t1.Name as LineName,t2.ProductID,t3.ProductNo,t3.ProductName FROM {0}.qms_workpiece t "
                                                   + " inner join {0}.oms_order t2 on t2.ID = t.OrderID "
                                                   + " left join {0}.fmc_line t1 on t1.ID = t2.LineID "
                                                   + " inner join {0}.fpc_product t3 on t3.ID = t2.ProductID "
                                                   + " where  (@wLineID<=0 or t2.LineID=@wLineID) "
                                                   + " and  t.WorkpieceNo IN ('{1}')", wInstance, StringUtils.Join("','", wWorkpieceNoList));
                wParamMap.Add("wLineID", wLineID);

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    QMSWorkpiece wSpotCheckRecord = new QMSWorkpiece();

                    wSpotCheckRecord.ID = StringUtils.parseInt(wReader["ID"]);
                    wSpotCheckRecord.WorkpieceNo = StringUtils.parseString(wReader["WorkpieceNo"]);
                    wSpotCheckRecord.OrderID = StringUtils.parseInt(wReader["OrderID"]);
                    wSpotCheckRecord.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wSpotCheckRecord.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wSpotCheckRecord.LineName = StringUtils.parseString(wReader["LineName"]);
                    wSpotCheckRecord.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wSpotCheckRecord.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wSpotCheckRecord.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    wSpotCheckRecord.SpotCheckResult = StringUtils.parseInt(wReader["SpotCheckResult"]);
                    wSpotCheckRecord.PatrolCheckResult = StringUtils.parseInt(wReader["PatrolCheckResult"]);
                    wSpotCheckRecord.RepairCount = StringUtils.parseInt(wReader["RepairCount"]);
                    wSpotCheckRecord.RepairResult = StringUtils.parseInt(wReader["RepairResult"]);
                    wSpotCheckRecord.RepairRemark = StringUtils.parseString(wReader["RepairRemark"]);
                    wSpotCheckRecord.Status = StringUtils.parseInt(wReader["Status"]);
                    wSpotCheckRecord.Remark = StringUtils.parseString(wReader["Remark"]);
                    wSpotCheckRecord.ThreeDimensionalResult = StringUtils.parseInt(wReader["ThreeDimensionalResult"]);
                    wSpotCheckRecord.CheckResult = StringUtils.parseInt(wReader["CheckResult"]);
                    wSpotCheckRecord.StartTime = StringUtils.parseDate(wReader["StartTime"]);
                    wSpotCheckRecord.EndTime = StringUtils.parseDate(wReader["EndTime"]);
                    wResult.Add(wSpotCheckRecord);
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



        public QMSWorkpiece QMS_SelectWorkpiece(BMSEmployee wLoginUser, int wID, String wWorkpieceNo, OutResult<Int32> wErrorCode)
        {
            QMSWorkpiece wResult = new QMSWorkpiece();
            try
            {

                wErrorCode.set(0);
                if (wID <= 0 && StringUtils.isEmpty(wWorkpieceNo))
                {
                    return wResult;
                }


                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format(" select t.*,t2.OrderNo,t2.LineID,t1.Name as LineName,t2.ProductID,t3.ProductNo,t3.ProductName FROM {0}.qms_workpiece t "
                                                   + " inner join {0}.oms_order t2 on t2.ID = t.OrderID "
                                                   + " left join {0}.fmc_line t1 on t1.ID = t2.LineID "
                                                   + " inner join {0}.fpc_product t3 on t3.ID = t2.ProductID "
                                        + " where t.ID= @wID OR t.WorkpieceNo = @wWorkpieceNo", wInstance);
                wParamMap.Add("wID", wID);
                wParamMap.Add("wWorkpieceNo", wWorkpieceNo);


                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.WorkpieceNo = StringUtils.parseString(wReader["WorkpieceNo"]);
                    wResult.OrderID = StringUtils.parseInt(wReader["OrderID"]);
                    wResult.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wResult.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wResult.LineName = StringUtils.parseString(wReader["LineName"]);
                    wResult.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wResult.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wResult.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    wResult.SpotCheckResult = StringUtils.parseInt(wReader["SpotCheckResult"]);
                    wResult.PatrolCheckResult = StringUtils.parseInt(wReader["PatrolCheckResult"]);
                    wResult.RepairCount = StringUtils.parseInt(wReader["RepairCount"]);
                    wResult.RepairResult = StringUtils.parseInt(wReader["RepairResult"]);
                    wResult.RepairRemark = StringUtils.parseString(wReader["RepairRemark"]);
                    wResult.Status = StringUtils.parseInt(wReader["Status"]);
                    wResult.Remark = StringUtils.parseString(wReader["Remark"]);
                    wResult.ThreeDimensionalResult = StringUtils.parseInt(wReader["ThreeDimensionalResult"]);
                    wResult.CheckResult = StringUtils.parseInt(wReader["CheckResult"]);
                    wResult.StartTime = StringUtils.parseDate(wReader["StartTime"]);
                    wResult.EndTime = StringUtils.parseDate(wReader["EndTime"]);
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
