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
    class DMSToolInfoDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSToolInfoDAO));

        private static DMSToolInfoDAO Instance;

        private DMSToolInfoDAO() : base()
        {

        }

        public static DMSToolInfoDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSToolInfoDAO();
            return Instance;
        }

        public List<DMSToolInfo> DMS_SelectToolInfoList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID,
                int wAreaID, int wToolHouseIndex, int wToolIndex, Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<DMSToolInfo> wResult = new List<DMSToolInfo>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();

                if (wDeviceNo == null)
                    wDeviceNo = "";
                if (wAssetNo == null)
                    wAssetNo = "";

                String wSQL = StringUtils.Format(
                        "SELECT p.*,t.Name as DeviceName,t.Code as DeviceNo,t.ModelID,t.WorkShopID,t.FactoryID,t.LineID," +
                        " t.AssetNo,t1.Code as  ModelNo,t1.Name as ModelName,t1.DeviceType, t2.Name as DeviceTypeName," +
                        "  t2.Code as DeviceTypeCode,t3.Name as WorkShopName,t3.Code as WorkShopCode,t7.Code as AreaNo," +
                        " t7.Name as PositionText,t9.Name as FactoryName,t9.Code as FactoryCode,    " +
                        " t4.Name as LineName,t4.Code as LineCode,t6.Name as EditorName FROM {0}.dms_tool_info p " +
                                  " inner join {0}.dms_device_ledger t on p.DeviceID=t.ID "
                                + " left join {0}.dms_device_model t1 on t.ModelID=t1.ID "
                                + " left join {0}.dms_device_type t2 on t1.DeviceType=t2.ID "
                                + " left join {0}.mbs_user t6 on p.EditorID=t6.ID "
                                + " left join {0}.bms_region t7 on t.AreaID=t7.ID "
                                + " left join {0}.fmc_workshop t3 on t.WorkShopID=t3.ID "
                                + " left join {0}.fmc_factory t9 on t.FactoryID=t9.ID "
                                + " left join {0}.fmc_line t4 on t.LineID=t4.ID  WHERE  1=1  "
                             + " and ( @wDeviceID <= 0 or p.DeviceID  = @wDeviceID)   "
                             + " and ( @wToolHouseIndex <= 0 or p.ToolHouseIndex  = @wToolHouseIndex)   "
                             + " and ( @wToolIndex <= 0 or p.ToolIndex  = @wToolIndex)   "
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
                wParamMap.Add("wDeviceNo", wDeviceNo);
                wParamMap.Add("wAssetNo", wAssetNo);
                wParamMap.Add("wDeviceType", wDeviceType);
                wParamMap.Add("wModelID", wModelID);
                wParamMap.Add("wAreaID", wAreaID);
                wParamMap.Add("wFactoryID", wFactoryID);
                wParamMap.Add("wWorkShopID", wWorkShopID);
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wToolHouseIndex", wToolHouseIndex);
                wParamMap.Add("wToolIndex", wToolIndex);


                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }

                wResult = CloneTool.CloneArray<DMSToolInfo>(wQueryResult);

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        private DMSToolInfo DMS_CheckToolInfo(BMSEmployee wLoginUser, DMSToolInfo wDMSToolInfo,
             OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            DMSToolInfo wResult = new DMSToolInfo();
            try
            {

                if (wDMSToolInfo == null || wDMSToolInfo.DeviceID <= 0
                    || wDMSToolInfo.ToolIndex <= 0 || wDMSToolInfo.ToolHouseIndex <= 0)
                {
                    return wResult;
                }


                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();


                String wSQL = StringUtils.Format(
                        "SELECT t1.* FROM {0}.dms_tool_info t1 WHERE t1.ID != @wID " +
                        " AND t1.DeviceID=@wDeviceID and t1.ToolIndex=@wToolIndex and t1.ToolHouseIndex=@wToolHouseIndex   ;",
                        wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wDeviceID", wDMSToolInfo.DeviceID);
                wParamMap.Add("wToolIndex", wDMSToolInfo.ToolIndex);
                wParamMap.Add("wID", wDMSToolInfo.ID);
                wParamMap.Add("wToolHouseIndex", wDMSToolInfo.ToolHouseIndex);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {

                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.ToolIndex = StringUtils.parseInt(wReader["ToolIndex"]);
                    wResult.ToolHouseIndex = StringUtils.parseInt(wReader["ToolHouseIndex"]);
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


        public void DMS_UpdateToolInfo(BMSEmployee wLoginUser, DMSToolInfo wToolInfo,
                OutResult<Int32> wErrorCode)
        {

            try
            {
                if (wToolInfo == null)
                {
                    return;
                }
                if (wToolInfo.DeviceID <= 0
                   || wToolInfo.ToolIndex <= 0 || wToolInfo.ToolHouseIndex < 0)
                {
                    logger.InfoFormat("DMS_UpdateToolInfo Params:{0}", JsonTool.ObjectToJson(wToolInfo));
                    return;
                }
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();

                DMSToolInfo wDMSToolInfoDB = this.DMS_CheckToolInfo(wLoginUser, wToolInfo, wErrorCode);
                if (wDMSToolInfoDB.ID > 0)
                {
                    if (wToolInfo.ID <= 0)
                    {
                        wToolInfo.ID = wDMSToolInfoDB.ID;
                    }
                    else
                    {
                        wErrorCode.Result = MESException.Duplication.Value;
                    }
                    return;
                }

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();




                wParamMap.Add("Description", wToolInfo.Description);
                wParamMap.Add("EditorID", wToolInfo.EditorID);
                wParamMap.Add("EditTime", DateTime.Now);

                if (wToolInfo.ID <= 0)
                {
                    wParamMap.Add("DeviceID", wToolInfo.DeviceID);
                    wParamMap.Add("ToolIndex", wToolInfo.ToolIndex);
                    wParamMap.Add("ToolHouseIndex", wToolInfo.ToolHouseIndex);
                    wToolInfo.ID = this.Insert(StringUtils.Format("{0}.dms_tool_info", wInstance), wParamMap);
                }
                else
                {
                    wParamMap.Add("ID", wToolInfo.ID);
                    this.Update(StringUtils.Format("{0}.dms_tool_info", wInstance), "ID", wParamMap);
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
