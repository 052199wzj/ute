using iPlant.Common.Tools;
using iPlant.Data.EF.Repository;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class FPCProductDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FPCProductDAO));
        private static FPCProductDAO Instance = null;

        private FPCProductDAO() : base()
        {

        }

        public static FPCProductDAO getInstance()
        {
            if (Instance == null)
                Instance = new FPCProductDAO();
            return Instance;
        }

        private List<FPCProduct> FPC_GetProductAll(BMSEmployee wLoginUser, List<Int32> wIDs, String wProductNo, String wProductLike,
            int wProductType, int wMaterialID, String wDrawingNo, int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<FPCProduct> wResult = new List<FPCProduct>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wIDs == null)
                    wIDs = new List<Int32>();
                wIDs.RemoveAll(p => p <= 0);
                if (wProductNo == null)
                    wProductNo = "";
                if (wProductLike == null)
                    wProductLike = "";
                if (wDrawingNo == null)
                    wDrawingNo = "";

                String wSQL = StringUtils.Format(
                        "SELECT t.*,t1.MaterialNo, t2.Name as CreatorName,t3.Name as EditorName  FROM {0}.fpc_product t"
                                + " left join {0}.mss_material t1 on t.MaterialID=t1.ID "
                                + " left join {0}.mbs_user t2 on t.CreatorID=t2.ID "
                                + " left join {0}.mbs_user t3 on t.EditorID=t3.ID WHERE  1=1  "
                                + " and ( @wID ='' or t.ID IN( {1} ) )  "
                        + " and ( @wProductNo ='' or t.ProductNo  = @wProductNo  )  "
                        + " and ( @wProductLike ='' or t.ProductNo  like @wProductLike or t.ProductName  like @wProductLike "
                        + "  or t.ProductCode  like @wProductLike or t1.MaterialNo  like @wProductLike or t.DrawingNo  like @wProductLike )  "
                        + " and ( @wProductType <= 0 or t.ProductType  = @wProductType)   "
                        + " and ( @wMaterialID <= 0 or t.MaterialID  = @wMaterialID)   "
                        + " and ( @wActive < 0 or t.Active  = @wActive)   "
                        + " and ( @wDrawingNo ='' or t.DrawingNo  = @wDrawingNo ) "
                        , wInstance, wIDs.Count > 0 ? StringUtils.Join(",", wIDs) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wID", StringUtils.Join(",", wIDs));
                wParamMap.Add("wProductLike", StringUtils.isEmpty(wProductLike) ? wProductLike : "%" + wProductLike + "%");
                wParamMap.Add("wProductNo", wProductNo);
                wParamMap.Add("wProductType", wProductType);
                wParamMap.Add("wDrawingNo", wDrawingNo);
                wParamMap.Add("wMaterialID", wMaterialID);
                wParamMap.Add("wActive", wActive);


                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                wResult = CloneTool.CloneArray<FPCProduct>(wQueryResult);

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<FPCProduct> FPC_GetProductAll(BMSEmployee wLoginUser, String wProductNo, String wProductLike,
            int wProductType, int wMaterialID, String wDrawingNo, int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<FPCProduct> wResult = new List<FPCProduct>();
            try
            { 
                wResult = this.FPC_GetProductAll(wLoginUser, null, wProductNo, wProductLike,
                        wProductType, wMaterialID, wDrawingNo, wActive, wPagination, wErrorCode); 
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public List<FPCProduct> FPC_GetProductAllByIDs(BMSEmployee wLoginUser, List<Int32> wIDList, OutResult<Int32> wErrorCode)
        {
            List<FPCProduct> wResult = new List<FPCProduct>();
            try
            {
                if (wIDList == null || wIDList.Count < 1)
                    return wResult;

                List<Int32> wSelectList = new List<Int32>();
                for (int i = 0; i < wIDList.Count; i++)
                {
                    wSelectList.Add(wIDList[i]);
                    if (i % 25 == 0)
                    {
                        wResult.AddRange(this.FPC_GetProductAll(wLoginUser, wSelectList, "", "", -1, -1, "", -1, null,
                                  wErrorCode));

                        wSelectList.Clear();
                    }
                    if (i == wIDList.Count - 1)
                    {
                        if (wSelectList.Count > 0)
                            wResult.AddRange(this.FPC_GetProductAll(wLoginUser, wSelectList, "", "", -1, -1, "", -1, null,
                                      wErrorCode));
                        break;
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


        public FPCProduct FPC_GetProduct(BMSEmployee wLoginUser, Int32 wID, String wProductNo, OutResult<Int32> wErrorCode)
        {
            FPCProduct wResult = new FPCProduct();
            try
            {
                List<FPCProduct> wFPCProductList = new List<FPCProduct>();
                if (wID > 0)
                {
                    List<Int32> wIDList = new List<Int32>();
                    wIDList.Add(wID);
                    wFPCProductList = this.FPC_GetProductAll(wLoginUser, wIDList, "", "",
                      -1, -1, "", -1,null, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wProductNo))
                {
                    wFPCProductList = this.FPC_GetProductAll(wLoginUser, null, wProductNo,   "",
                      -1, -1, "", -1, null, wErrorCode);
                } 
                else
                {
                    return wResult;
                }

                if (wFPCProductList.Count <= 0)
                    return wResult;

                wResult = wFPCProductList[0];

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public void FPC_UpdateProduct(BMSEmployee wLoginUser, FPCProduct wFPCProduct, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {

                if (wFPCProduct == null || StringUtils.isEmpty(wFPCProduct.ProductNo)|| StringUtils.isEmpty(wFPCProduct.ProductName) || wFPCProduct.ProductType <0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
 

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                FPCProduct wFPCProductDB = this.FPC_GetProduct(wLoginUser, 0, wFPCProduct.ProductNo, wErrorCode);
                if (wFPCProductDB.ID > 0&& wFPCProductDB.ID!= wFPCProduct.ID)
                {
                    wErrorCode.Result = MESException.Duplication.Value;
                    if (wFPCProduct.ID <= 0)
                    {
                        wFPCProduct.ID = wFPCProductDB.ID;
                    }
                    return;
                }
               
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("ProductNo", wFPCProduct.ProductNo);
                wParamMap.Add("ProductType", wFPCProduct.ProductType);
                wParamMap.Add("ProductCode", wFPCProduct.ProductCode);
                wParamMap.Add("ProductName", wFPCProduct.ProductName);
                wParamMap.Add("MaterialID", wFPCProduct.MaterialID); 
                wParamMap.Add("DrawingNo", wFPCProduct.DrawingNo);
                wParamMap.Add("DrawingNoFile", wFPCProduct.DrawingNoFile);
                wParamMap.Add("Length", wFPCProduct.Length);
                wParamMap.Add("LaborUnitPrice", wFPCProduct.LaborUnitPrice);
                wParamMap.Add("MaterialUnitPrice", wFPCProduct.MaterialUnitPrice);
                wParamMap.Add("EnergyUnitPrice", wFPCProduct.EnergyUnitPrice);
                wParamMap.Add("DeviceUnitPrice", wFPCProduct.DeviceUnitPrice);
                wParamMap.Add("Description", wFPCProduct.Description); 
                wParamMap.Add("EditorID", wLoginUser.ID);
                wParamMap.Add("EditTime", DateTime.Now);
                wParamMap.Add("Active", wFPCProduct.Active);

                if (wFPCProduct.ID <= 0)
                {
                    wParamMap.Add("CreatorID", wLoginUser.ID);
                    wParamMap.Add("CreateTime", DateTime.Now);
                    wFPCProduct.ID = this.Insert(StringUtils.Format("{0}.fpc_product", wInstance), wParamMap);

                }
                else
                {
                    wParamMap.Add("ID", wFPCProduct.ID);
                    this.Update(StringUtils.Format("{0}.fpc_product", wInstance), "ID", wParamMap);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }
        public void FPC_ActiveProduct(BMSEmployee wLoginUser, List<int> wIDList, int wActive, OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                

                if (wIDList == null || wIDList.Count <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                wIDList.RemoveAll(p => p <= 0);
                if (wIDList.Count <= 0)
                    return;

                if (wActive != 1)
                    wActive = 2;
                String wSql = StringUtils.Format("UPDATE {0}.fpc_product SET Active ={1} WHERE ID IN({2}) ;",
                        wInstance, wActive, StringUtils.Join(",", wIDList));


                this.mDBPool.update(wSql, null);


            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public void FPC_DeleteProduct(BMSEmployee wLoginUser, FPCProduct wFPCProduct, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {
                if (wFPCProduct == null || wFPCProduct.ID<=0||StringUtils.isEmpty(wFPCProduct.ProductNo) || wFPCProduct.ProductType <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                 
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName(); 
                 
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("ID", wFPCProduct.ID);
                wParamMap.Add("Active", 0);

                this.Delete(StringUtils.Format("{0}.fpc_product", wInstance), wParamMap);


            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

    }
}
