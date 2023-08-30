using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class MSSMaterialOperationRecordDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(MSSMaterialOperationRecordDAO));
        private static MSSMaterialOperationRecordDAO Instance = null;

        private MSSMaterialOperationRecordDAO() : base()
        {

        }

        public static MSSMaterialOperationRecordDAO getInstance()
        {
            if (Instance == null)
                Instance = new MSSMaterialOperationRecordDAO();
            return Instance;
        }

        public List<MSSMaterialOperationRecord> GetMaterialStock(BMSEmployee wLoginUser, int wStockID, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<MSSMaterialOperationRecord> wResult = new List<MSSMaterialOperationRecord>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format("select t3.* from (select p.ID,p.StockID, t.LocationID ,p.MaterialBatch,t5.Code as LocationCode ,t5.Name as LocationName, " +
                                          " t.MaterialID,t1.MaterialNo,t1.MaterialName,t1.Groes, " +
                                          " sum(case when p.OperationType in (2,4) then -1*p.Num else p.Num END) as Num  " +
                                          "  from {0}.mss_material_operationrecord p " +
                                          " inner join {0}.mss_stock t on t.ID=p.StockID" +
                                          " inner join {0}.mss_material t1 on t.MaterialID=t1.ID" +
                                          " inner join {0}.mss_location t5 on t.LocationID=t5.ID  WHERE p.StockID=@StockID  group by StockID,MaterialBatch) t3  ", wInstance);

                wParamMap.Add("StockID", wStockID);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    MSSMaterialOperationRecord wMaterialOperationRecord = new MSSMaterialOperationRecord();

                    wMaterialOperationRecord.MaterialID = StringUtils.parseInt(wReader["MaterialID"]);
                    wMaterialOperationRecord.LocationID = StringUtils.parseInt(wReader["LocationID"]);
                    wMaterialOperationRecord.LocationName = StringUtils.parseString(wReader["LocationName"]);

                    wMaterialOperationRecord.LocationCode = StringUtils.parseString(wReader["LocationCode"]);
                    wMaterialOperationRecord.MaterialNo = StringUtils.parseString(wReader["MaterialNo"]);
                    wMaterialOperationRecord.MaterialName = StringUtils.parseString(wReader["MaterialName"]);
                    wMaterialOperationRecord.Groes = StringUtils.parseString(wReader["Groes"]);
                    wMaterialOperationRecord.MaterialBatch = StringUtils.parseString(wReader["MaterialBatch"]);
                    wMaterialOperationRecord.Num = StringUtils.parseInt(wReader["Num"]);
                    wResult.Add(wMaterialOperationRecord);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public void Add(BMSEmployee wLoginUser, MSSMaterialOperationRecord wMSSMaterialOperationRecord, OutResult<Int32> wErrorCode)
        {
            try
            {
                if (wMSSMaterialOperationRecord == null || wMSSMaterialOperationRecord.MaterialID <= 0 || wMSSMaterialOperationRecord.LocationID <= 0
                    || StringUtils.isEmpty(wMSSMaterialOperationRecord.MaterialBatch) || wMSSMaterialOperationRecord.OperationType <= 0 || wMSSMaterialOperationRecord.Num <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                wErrorCode.set(0);

                MSSStock wMSSStock = MSSStockDAO.getInstance().MSS_GetStock(wLoginUser, wMSSMaterialOperationRecord.MaterialID, wMSSMaterialOperationRecord.LocationID, wErrorCode);
                if (wMSSStock.ID <= 0)
                {
                    wMSSStock.MaterialID = wMSSMaterialOperationRecord.MaterialID;
                    wMSSStock.LocationID = wMSSMaterialOperationRecord.LocationID;
                    wMSSStock.MaterialNo = wMSSMaterialOperationRecord.MaterialNo;
                    wMSSStock.MaterialName = wMSSMaterialOperationRecord.MaterialName;
                    wMSSStock.LocationCode = wMSSMaterialOperationRecord.LocationCode;
                    wMSSStock.LocationName = wMSSMaterialOperationRecord.LocationName;
                    wMSSStock.Description = wMSSMaterialOperationRecord.Remark;
                    wMSSStock.StockNum = 0;
                }

                wMSSMaterialOperationRecord.PrevStockNum = wMSSStock.StockNum;
                wMSSMaterialOperationRecord.NextStockNum = wMSSStock.StockNum +
                    (((wMSSMaterialOperationRecord.OperationType == ((int)MSSOperateType.Loss) || wMSSMaterialOperationRecord.OperationType == ((int)MSSOperateType.OutStock)) ? -1 : 1) * wMSSMaterialOperationRecord.Num);
                wMSSStock.StockNum = wMSSMaterialOperationRecord.NextStockNum;

                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                MSSStockDAO.getInstance().UpdateStock(wLoginUser, wMSSStock, wErrorCode);

                if (wErrorCode.Result != 0)
                    return;

                if (wMSSStock.ID <= 0)
                {
                    wErrorCode.set(MESException.Logic.Value);
                    return;
                }

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("StockID", wMSSStock.ID);
                wParamMap.Add("Num", wMSSMaterialOperationRecord.Num);
                wParamMap.Add("PrevStockNum", wMSSMaterialOperationRecord.PrevStockNum);
                wParamMap.Add("NextStockNum", wMSSMaterialOperationRecord.NextStockNum);
                wParamMap.Add("Remark", wMSSMaterialOperationRecord.Remark);
                wParamMap.Add("MaterialBatch", wMSSMaterialOperationRecord.MaterialBatch);
                wParamMap.Add("OperationType", wMSSMaterialOperationRecord.OperationType);
                wParamMap.Add("CreatorID", wLoginUser.ID);
                wParamMap.Add("CreateTime", DateTime.Now);
                wMSSMaterialOperationRecord.ID = this.Insert(StringUtils.Format("{0}.mss_material_operationrecord", wInstance), wParamMap);


            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public List<MSSMaterialOperationRecord> GetMaterialOperationRecord(BMSEmployee wLoginUser, int wLocationID, String wLocationLike, String wMaterialLike,
            String wMaterialBatch, int wOperationType, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<MSSMaterialOperationRecord> wResult = new List<MSSMaterialOperationRecord>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;


                if (StringUtils.isNotEmpty(wLocationLike))
                {
                    wLocationLike = "%" + wLocationLike + "%";
                }
                if (StringUtils.isNotEmpty(wMaterialLike))
                {
                    wMaterialLike = "%" + wMaterialLike + "%";
                }
                if (StringUtils.isNotEmpty(wMaterialBatch))
                {
                    wMaterialBatch = "%" + wMaterialBatch + "%";
                }

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format("Select p.*, t.LocationID,t.MaterialID,t.StockNum, t5.Code as LocationCode ,t5.Name as LocationName," +
                    "  t1.MaterialNo,t1.MaterialName,t1.Groes,t2.Name as Creator  "
                                         + " from {0}.mss_material_operationrecord p "
                                        + " inner join {0}.mss_stock t on t.ID=p.StockID"
                                            + " inner join {0}.mss_material t1 on t.MaterialID=t1.ID "
                                              + " left join {0}.mbs_user t2 on p.CreatorID=t2.ID "
                                              + " inner join {0}.mss_location t5 on t.LocationID=t5.ID"
                                              + " where t1.Active=1 AND (@wLocationID<=0 OR t.LocationID=@wLocationID )"
                                              + " AND (@wOperationType<=0 OR p.OperationType=@wOperationType ) "
                                              + " and (  @wLocationLike ='' or  t5.Name like @wLocationLike or t5.Code like  @wLocationLike )"
                                              + " and (  @wMaterialLike ='' or  t1.MaterialNo like @wMaterialLike or t1.MaterialName like  @wMaterialLike )"
                                              + " and (  @wMaterialBatch ='' or  p.MaterialBatch like @wMaterialBatch)", wInstance);

                wParamMap.Add("wLocationID", wLocationID);
                wParamMap.Add("wOperationType", wOperationType);
                wParamMap.Add("wLocationLike", wLocationLike);
                wParamMap.Add("wMaterialLike", wMaterialLike);
                wParamMap.Add("wMaterialBatch", wMaterialBatch);

                 

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    MSSMaterialOperationRecord wMaterialOperationRecord = new MSSMaterialOperationRecord();

                    wMaterialOperationRecord.MaterialID = StringUtils.parseInt(wReader["MaterialID"]);
                    wMaterialOperationRecord.LocationID = StringUtils.parseInt(wReader["LocationID"]);
                    wMaterialOperationRecord.LocationName = StringUtils.parseString(wReader["LocationName"]);

                    wMaterialOperationRecord.LocationCode = StringUtils.parseString(wReader["LocationCode"]);
                    wMaterialOperationRecord.MaterialNo = StringUtils.parseString(wReader["MaterialNo"]);
                    wMaterialOperationRecord.MaterialName = StringUtils.parseString(wReader["MaterialName"]);
                    wMaterialOperationRecord.Groes = StringUtils.parseString(wReader["Groes"]);
                    wMaterialOperationRecord.MaterialBatch = StringUtils.parseString(wReader["MaterialBatch"]);
                    wMaterialOperationRecord.OperationType = StringUtils.parseInt(wReader["OperationType"]);
                    wMaterialOperationRecord.Num = StringUtils.parseDouble(wReader["Num"]);
                    wMaterialOperationRecord.PrevStockNum = StringUtils.parseDouble(wReader["PrevStockNum"]);
                    wMaterialOperationRecord.NextStockNum = StringUtils.parseDouble(wReader["NextStockNum"]);
                    wMaterialOperationRecord.Creator = StringUtils.parseString(wReader["Creator"]);
                    wMaterialOperationRecord.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wMaterialOperationRecord.Remark = StringUtils.parseString(wReader["Remark"]);
                    wResult.Add(wMaterialOperationRecord);
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
