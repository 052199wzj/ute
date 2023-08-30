using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class DMSProgramNCDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSProgramNCDAO));

        private static DMSProgramNCDAO Instance;

        private DMSProgramNCDAO() : base()
        {

        }

        public static DMSProgramNCDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSProgramNCDAO();
            return Instance;
        }

        public List<DMSProgramNC> DMS_SelectProgramNCList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID,
                int wAreaID, int wProductID, String wProductNo,
                 Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<DMSProgramNC> wResult = new List<DMSProgramNC>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();

                if (wDeviceNo == null)
                    wDeviceNo = "";
                if (wAssetNo == null)
                    wAssetNo = "";
                if (wProductNo == null)
                    wProductNo = "";

                String wSQL = StringUtils.Format(
                        "SELECT p.*,t.Name as DeviceName,t.Code as DeviceNo,t.ModelID,t.WorkShopID,t.FactoryID,t.LineID," +
                        " t.AssetNo,t1.Code as  ModelNo,t1.Name as ModelName,t1.DeviceType, t2.Name as DeviceTypeName," +
                        "  t2.Code as DeviceTypeCode,t3.Name as WorkShopName,t3.Code as WorkShopCode,t7.Code as AreaNo," +
                        " t7.Name as PositionText,t9.Name as FactoryName,t9.Code as FactoryCode,    " +
                        " t4.Name as LineName,t4.Code as LineCode,t6.Name as EditorName,t5.ProductNo,t5.ProductName FROM {0}.dms_program_nc p " +
                                  " inner join {0}.dms_device_ledger t on p.DeviceID=t.ID "
                                + " left join {0}.dms_device_model t1 on t.ModelID=t1.ID "
                                + " left join {0}.dms_device_type t2 on t1.DeviceType=t2.ID "
                                + " left join {0}.mbs_user t6 on p.EditorID=t6.ID "
                                + " left join {0}.bms_region t7 on t.AreaID=t7.ID "
                                + " left join {0}.fmc_workshop t3 on t.WorkShopID=t3.ID "
                                + " left join {0}.fmc_factory t9 on t.FactoryID=t9.ID "
                                + " inner join {0}.fpc_product t5 on p.ProductID=t5.ID "
                                + " left join {0}.fmc_line t4 on t.LineID=t4.ID  WHERE  1=1  "
                             + " and ( @wDeviceID <= 0 or p.DeviceID  = @wDeviceID)   "
                             + " and ( @wProductID <= 0 or p.ProductID  = @wProductID)   "
                        + " and ( @wProductNo ='' or t5.ProductNo  = @wProductNo)  "
                        + " and ( @wDeviceNo ='' or t.Code  = @wDeviceNo)  "
                        + " and ( @wAssetNo ='' or t.AssetNo   = @wAssetNo )  "
                        + " and ( @wDeviceType <= 0 or t1.DeviceType  = @wDeviceType)   "
                        + " and ( @wModelID <= 0 or t.ModelID  = @wModelID)   "
                        + " and ( @wAreaID <= 0 or t.AreaID  = @wAreaID)  "
                        + " and ( @wFactoryID <= 0 or t.FactoryID  = @wFactoryID)  "
                        + " and ( @wWorkShopID <= 0 or t.WorkShopID  = @wWorkShopID)  "
                        + " and ( @wLineID <= 0 or t.LineID  = @wLineID) "
                        , wInstance);

                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wDeviceID", wDeviceID);
                wParamMap.Add("wProductID", wProductID);
                wParamMap.Add("wProductNo", wProductNo);
                wParamMap.Add("wDeviceNo", wDeviceNo);
                wParamMap.Add("wAssetNo", wAssetNo);
                wParamMap.Add("wDeviceType", wDeviceType);
                wParamMap.Add("wModelID", wModelID);
                wParamMap.Add("wAreaID", wAreaID);
                wParamMap.Add("wFactoryID", wFactoryID);
                wParamMap.Add("wWorkShopID", wWorkShopID);
                wParamMap.Add("wLineID", wLineID);


                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }

                wResult = CloneTool.CloneArray<DMSProgramNC>(wQueryResult);

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public DMSProgramNC DMS_SelectCurrentProgramNC(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, String wAssetNo, int wProductID, String wProductNo, OutResult<Int32> wErrorCode)
        {
            DMSProgramNC wResult = new DMSProgramNC();
            try
            {
                wErrorCode.set(0);

                if (wDeviceID <= 0 && StringUtils.isEmpty(wDeviceNo) && StringUtils.isEmpty(wAssetNo))
                {
                    return wResult;
                }

                if (wProductID <= 0 && StringUtils.isEmpty(wProductNo))
                {
                    return wResult;
                }
                List<DMSProgramNC> wDMSProgramNCList = this.DMS_SelectProgramNCList(wLoginUser, wDeviceID, wDeviceNo,
                 wAssetNo, -1, -1, -1, -1, -1, -1, wProductID, wProductNo, Pagination.Default, wErrorCode);

                if (wDMSProgramNCList.Count > 0)
                    wResult = wDMSProgramNCList[0];

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }




        private DMSProgramNC DMS_CheckProgramNC(BMSEmployee wLoginUser, DMSProgramNC wDMSProgramNC,
             OutResult<Int32> wErrorCode)
        {
            DMSProgramNC wResult = new DMSProgramNC();
            try
            {

                if (wDMSProgramNC == null || StringUtils.isEmpty(wDMSProgramNC.ProgramName)
                        || wDMSProgramNC.DeviceID <= 0 || wDMSProgramNC.ProductID <= 0)
                {
                    return wResult;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();


                String wSQL = StringUtils.Format(
                        "SELECT t1.* FROM {0}.dms_program_nc t1 WHERE t1.ID != @wID " +
                        " AND t1.DeviceID=@wDeviceID and t1.ProductID=@wProductID  ;",
                        wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wDeviceID", wDMSProgramNC.DeviceID);
                wParamMap.Add("wProductID", wDMSProgramNC.ProductID);
                wParamMap.Add("wID", wDMSProgramNC.ID); 

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {

                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wResult.ProgramName = StringUtils.parseString(wReader["ProgramName"]);
                    wResult.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wResult.Description = StringUtils.parseString(wReader["Description"]);

                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public void DMS_UpdateProgramNC(BMSEmployee wLoginUser, DMSProgramNC wProgramNC,  
                OutResult<Int32> wErrorCode)
        {

            try
            {
                if (wProgramNC == null || StringUtils.isEmpty(wProgramNC.ProgramName)
                    || wProgramNC.DeviceID <= 0 || wProgramNC.ProductID <= 0)
                {
                    return;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();

                DMSProgramNC wDMSProgramNCDB = this.DMS_CheckProgramNC(wLoginUser, wProgramNC, wErrorCode);
                if (wDMSProgramNCDB.ID > 0)
                {
                    if (wProgramNC.ID <= 0&& wProgramNC.DeviceID== wDMSProgramNCDB.DeviceID&& wProgramNC.ProductID== wDMSProgramNCDB.ProductID)
                    {
                        wProgramNC.ID = wDMSProgramNCDB.ID;
                    }
                    else
                    {
                        wErrorCode.Result = MESException.Duplication.Value;
                        return;
                    }
                  
                }

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();


                wParamMap.Add("VersionNo", wProgramNC.VersionNo);
                wParamMap.Add("Description", wProgramNC.Description);
                wParamMap.Add("EditorID", wProgramNC.EditorID);
                wParamMap.Add("EditTime", DateTime.Now);
                wParamMap.Add("ProgramName", wProgramNC.ProgramName);
                wParamMap.Add("FileSourcePath", wProgramNC.FileSourcePath);
                wParamMap.Add("FilePath", wProgramNC.FilePath);
                wParamMap.Add("ProgramName_B", wProgramNC.ProgramName_B);
                wParamMap.Add("FileSourcePath_B", wProgramNC.FileSourcePath_B);
                wParamMap.Add("FilePath_B", wProgramNC.FilePath_B);


                if (wProgramNC.ID <= 0)
                {
                    wParamMap.Add("DeviceID", wProgramNC.DeviceID);
                    wParamMap.Add("ProductID", wProgramNC.ProductID);
                     
                    wProgramNC.ID = this.Insert(StringUtils.Format("{0}.dms_program_nc", wInstance), wParamMap);
                }
                else
                {
                    wParamMap.Add("ID", wProgramNC.ID);
                    this.Update(StringUtils.Format("{0}.dms_program_nc", wInstance), "ID", wParamMap);
                }


            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }



    }
}
