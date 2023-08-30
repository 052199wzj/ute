using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class MSSStockDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(MSSStockDAO));
        private static MSSStockDAO Instance = null;

        private MSSStockDAO() : base()
        {

        }

        public static MSSStockDAO getInstance()
        {
            if (Instance == null)
                Instance = new MSSStockDAO();
            return Instance;
        }

        /// <summary>
        /// 根据时间 库存查询
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wMaterialNo"></param>
        /// <param name="wMaterialName"></param>
        /// <param name="wGroes"></param>
        /// <param name="wActive"></param>
        /// <param name="wPagination"></param>
        /// <param name="wErrorCode"></param>
        /// <returns></returns>
        private List<MSSStock> GetAll(BMSEmployee wLoginUser, int wStockID, int wMaterialID, int wLocationID, string wMaterialLike, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<MSSStock> wResult = new List<MSSStock>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;


                if (!string.IsNullOrWhiteSpace(wMaterialLike))
                {
                    wMaterialLike = "%" + wMaterialLike + "%";
                }

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format("select p.*,t.MaterialNo,t.MaterialName,t.Groes," +
                    " t1.Name as LocationName ,t1.Code as LocationCode ,t2.Name  as CreatorName," +
                    " t3.Name as EditorName from {0}.mss_stock p " +
                    " inner join {0}.mss_material t on p.MaterialID=t.ID " +
                    " inner join {0}.mss_location t1 on p.LocationID=t1.ID " +
                    " left join {0}.mbs_user t2 on t2.ID=p.CreatorID " +
                    " left join {0}.mbs_user t3 on t3.ID=p.EditorID  where 1=1 " +
                    " and (@wMaterialLike = '' or   t.MaterialNo like @wMaterialLike  or t.MaterialName like  @wMaterialLike  ) " +
                    " and (@wID<=0 or p.ID=@wID) " +
                     " and (@wLocationID<=0 or p.LocationID=@wLocationID) " +
                    " and (@wMaterialID<=0 or p.MaterialID=@wMaterialID)", wInstance);

                wParamMap.Add("wMaterialLike", wMaterialLike);
                wParamMap.Add("wMaterialID", wMaterialID);
                wParamMap.Add("wLocationID", wLocationID);
                wParamMap.Add("wID", wStockID);

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    MSSStock wMaterial = new MSSStock();

                    wMaterial.ID = StringUtils.parseInt(wReader["ID"]);
                    wMaterial.MaterialID = StringUtils.parseInt(wReader["MaterialID"]);
                    wMaterial.MaterialNo = StringUtils.parseString(wReader["MaterialNo"]);
                    wMaterial.MaterialName = StringUtils.parseString(wReader["MaterialName"]);
                    wMaterial.LocationID = StringUtils.parseInt(wReader["LocationID"]);
                    wMaterial.LocationName = StringUtils.parseString(wReader["LocationName"]);
                    wMaterial.LocationCode = StringUtils.parseString(wReader["LocationCode"]);
                    wMaterial.Groes = StringUtils.parseString(wReader["Groes"]);
                    wMaterial.Description = StringUtils.parseString(wReader["Description"]);
                    wMaterial.StockNum = StringUtils.parseDouble(wReader["StockNum"]);
                    wMaterial.CreatorID = StringUtils.parseInt(wReader["CreatorID"]);
                    wMaterial.CreatorName = StringUtils.parseString(wReader["CreatorName"]);
                    wMaterial.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wMaterial.EditorID = StringUtils.parseInt(wReader["EditorID"]);
                    wMaterial.EditorName = StringUtils.parseString(wReader["EditorName"]);
                    wMaterial.EditTime = StringUtils.parseDate(wReader["EditTime"]);
                    wResult.Add(wMaterial);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public List<MSSStock> GetAll(BMSEmployee wLoginUser, int wMaterialID, int wLocationID, string wMaterialLike, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            return GetAll(wLoginUser, 0, wMaterialID, wLocationID, wMaterialLike, wPagination, wErrorCode);
        }
        public void UpdateStock(BMSEmployee wLoginUser, MSSStock wMSSStock, OutResult<Int32> wErrorCode)
        {
            try
            {
                if (wMSSStock == null || wMSSStock.MaterialID<=0 || wMSSStock.LocationID <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                MSSStock wMSSStockDB = this.MSS_CheckStock(wLoginUser, wMSSStock, wErrorCode);
                if (wMSSStockDB.ID > 0)
                {
                    wErrorCode.Result = MESException.Duplication.Value;
                    if (wMSSStock.ID <= 0)
                    {
                        wMSSStock.ID = wMSSStockDB.ID;
                    }
                    return;
                }

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

               
                wParamMap.Add("StockNum", wMSSStock.StockNum);
                wParamMap.Add("EditorID", wLoginUser.ID);
                wParamMap.Add("EditTime", DateTime.Now);
                wParamMap.Add("Description", wMSSStock.Description);

                if (wMSSStock.ID <= 0)
                {
                    wParamMap.Add("MaterialID", wMSSStock.MaterialID);
                    wParamMap.Add("LocationID", wMSSStock.LocationID);
                    wParamMap.Add("CreatorID", wLoginUser.ID);
                    wParamMap.Add("CreateTime", DateTime.Now);
                    wMSSStock.ID = this.Insert(StringUtils.Format("{0}.mss_stock", wInstance), wParamMap);

                }
                else
                {
                    wParamMap.Add("ID", wMSSStock.ID);
                    this.Update(StringUtils.Format("{0}.mss_stock", wInstance), "ID", wParamMap);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        private MSSStock MSS_CheckStock(BMSEmployee wLoginUser, MSSStock wMSSStock,
                  OutResult<Int32> wErrorCode)
        {
            MSSStock wResult = new MSSStock();
            try
            {

                if (wMSSStock == null || wMSSStock.MaterialID <= 0 || wMSSStock.LocationID <= 0)
                {
                    return wResult;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                String wSQL = StringUtils.Format(
                        "SELECT t1.* FROM {0}.mss_stock t1 WHERE t1.ID != @ID " +
                        " AND t1.MaterialID =@MaterialID AND t1.LocationID =@LocationID   ;",
                        wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("ID", wMSSStock.ID);
                wParamMap.Add("LocationID", wMSSStock.LocationID);
                wParamMap.Add("MaterialID", wMSSStock.MaterialID);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {

                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.MaterialID = StringUtils.parseInt(wReader["MaterialID"]);
                    wResult.LocationID = StringUtils.parseInt(wReader["LocationID"]);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public MSSStock MSS_GetStock(BMSEmployee wLoginUser, int wStockID,
               OutResult<Int32> wErrorCode)
        {
            MSSStock wResult = new MSSStock();
            try
            {

                if (wStockID <= 0)
                {
                    return wResult;
                }

                wErrorCode.set(0);
                List<MSSStock> wList = GetAll(wLoginUser, wStockID, -1, -1, "", Pagination.Default, wErrorCode);
                if (wList.Count > 0)
                    wResult = wList[0];
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public MSSStock MSS_GetStock(BMSEmployee wLoginUser, int wMaterialID, int wLocationID,
             OutResult<Int32> wErrorCode)
        {
            MSSStock wResult = new MSSStock();
            try
            {

                if (wMaterialID <= 0 && wLocationID <= 0)
                {
                    return wResult;
                }

                wErrorCode.set(0);
                List<MSSStock> wList = GetAll(wLoginUser, -1, wMaterialID, wLocationID, "", Pagination.Default, wErrorCode);
                if (wList.Count > 0)
                    wResult = wList[0];
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



    }
}
