using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class DMSToolOffsetDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSToolOffsetDAO));

        private static DMSToolOffsetDAO Instance;

        private DMSToolOffsetDAO() : base()
        {

        }

        public static DMSToolOffsetDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSToolOffsetDAO();
            return Instance;
        }

        public List<DMSToolOffset> DMS_SelectToolOffsetList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID,
                int wToolID, int wToolHouseIndex, int wToolIndex,
                int wEditorID,  DateTime wStartTime,DateTime wEndTime,  Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<DMSToolOffset> wResult = new List<DMSToolOffset>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();

                if (wDeviceNo == null)
                    wDeviceNo = "";
                if (wAssetNo == null)
                    wAssetNo = ""; 

                String wSQL = StringUtils.Format(
                        "SELECT q.*,p.DeviceID,p.ToolIndex,p.ToolHouseIndex,p.Description,t.Name as DeviceName," +
                        " t.Code as DeviceNo,t.WorkShopID,t.FactoryID,t.LineID," +
                        " t.AssetNo,t3.Name as WorkShopName,t3.Code as WorkShopCode,t7.Code as AreaNo," +
                        " t7.Name as PositionText,t9.Name as FactoryName,t9.Code as FactoryCode,    " +
                        " t4.Name as LineName,t4.Code as LineCode,t6.Name as EditorName " +
                                "  FROM  {0}.dms_tool_offset q " 
                                + " inner join {0}.dms_tool_info p  on q.ToolID=p.ID "
                                + " inner join {0}.dms_device_ledger t on p.DeviceID=t.ID "
                                + " left join {0}.dms_device_model t1 on t.ModelID=t1.ID "
                                + " left join {0}.dms_device_type t2 on t1.DeviceType=t2.ID "
                                + " left join {0}.mbs_user t6 on q.EditorID=t6.ID "
                                + " left join {0}.bms_region t7 on t.AreaID=t7.ID "
                                + " left join {0}.fmc_workshop t3 on t.WorkShopID=t3.ID "
                                + " left join {0}.fmc_factory t9 on t.FactoryID=t9.ID " 
                                + " left join {0}.fmc_line t4 on t.LineID=t4.ID  WHERE  1=1  "
                             + " and ( @wDeviceID <= 0 or p.DeviceID  = @wDeviceID)   " 
                             + " and ( @wEditorID <= 0 or q.EditorID  = @wEditorID)   "

                             + " and ( @wToolHouseIndex <= 0 or p.ToolHouseIndex  = @wToolHouseIndex)   "
                             + " and ( @wToolIndex <= 0 or p.ToolIndex  = @wToolIndex)   "
                             + " and ( @wToolID <= 0 or q.ToolID  = @wToolID)   "

                        + " and ( @wDeviceNo ='' or t.Code  = @wDeviceNo)  "
                        + " and ( @wAssetNo ='' or t.AssetNo   = @wAssetNo )  "
                        + " and ( @wDeviceType <= 0 or t1.DeviceType  = @wDeviceType)   "
                        + " and ( @wModelID <= 0 or t.ModelID  = @wModelID)   "
                        + " and ( @wAreaID <= 0 or t.AreaID  = @wAreaID)  "
                        + " and ( @wFactoryID <= 0 or t.FactoryID  = @wFactoryID)  "
                        + " and ( @wWorkShopID <= 0 or t.WorkShopID  = @wWorkShopID)  "
                        + " and ( @wLineID <= 0 or t.LineID  = @wLineID) "
                        + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wStartTime <= q.EditTime) "
                        + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= q.EditTime)  "
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
                wParamMap.Add("wEditorID", wEditorID);
                wParamMap.Add("wToolID", wToolID);
                wParamMap.Add("wToolHouseIndex", wToolHouseIndex);
                wParamMap.Add("wToolIndex", wToolIndex);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);



                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }

                wResult = CloneTool.CloneArray<DMSToolOffset>(wQueryResult);

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

         
       
        public void DMS_UpdateToolOffset(BMSEmployee wLoginUser, DMSToolOffset wToolOffset,
                OutResult<Int32> wErrorCode)
        {

            try
            {
                if (wToolOffset == null   || wToolOffset.ToolID <= 0 )
                {
                    return;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();

              
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("ToolID", wToolOffset.ToolID);
                wParamMap.Add("ToolOffsetR", wToolOffset.ToolOffsetR);
                wParamMap.Add("ToolOffsetX", wToolOffset.ToolOffsetX);
                wParamMap.Add("ToolOffsetZ", wToolOffset.ToolOffsetZ);
                wParamMap.Add("Remark", wToolOffset.Remark);
                wParamMap.Add("EditorID", wToolOffset.EditorID);
                wParamMap.Add("EditTime", DateTime.Now);

                if (wToolOffset.ID <= 0)
                {
                    wToolOffset.ID = this.Insert(StringUtils.Format("{0}.dms_tool_offset", wInstance), wParamMap);
                }
                else
                {
                    wParamMap.Add("ID", wToolOffset.ID);
                    this.Update(StringUtils.Format("{0}.dms_tool_offset", wInstance), "ID", wParamMap);
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
