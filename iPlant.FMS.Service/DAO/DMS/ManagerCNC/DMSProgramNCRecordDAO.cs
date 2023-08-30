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
    class DMSProgramNCRecordDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSProgramNCRecordDAO));

        private static DMSProgramNCRecordDAO Instance;

        private DMSProgramNCRecordDAO() : base()
        {

        }

        public static DMSProgramNCRecordDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSProgramNCRecordDAO();
            return Instance;
        }

        public List<DMSProgramNCRecord> DMS_SelectProgramNCRecordList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wProductID, String wProductNo,
                int wEditorID,int wRecordType, DateTime wStartTime,DateTime wEndTime,  Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<DMSProgramNCRecord> wResult = new List<DMSProgramNCRecord>();
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
                        "SELECT q.*,p.DeviceID,p.ProductID,p.ProgramName,p.ProgramName_B, t.Name as DeviceName,t.Code as DeviceNo,t.WorkShopID,t.FactoryID,t.LineID," +
                        " t.AssetNo,t3.Name as WorkShopName,t3.Code as WorkShopCode,t7.Code as AreaNo," +
                        " t7.Name as PositionText,t9.Name as FactoryName,t9.Code as FactoryCode,    " +
                        " t4.Name as LineName,t4.Code as LineCode,t6.Name as EditorName,t5.ProductNo,t5.ProductName" +
                                "  FROM  {0}.dms_program_nc_record q " 
                                + " inner join {0}.dms_program_nc p  on q.ProgramID=p.ID "
                                + " inner join {0}.dms_device_ledger t on p.DeviceID=t.ID "
                                + " left join {0}.dms_device_model t1 on t.ModelID=t1.ID "
                                + " left join {0}.dms_device_type t2 on t1.DeviceType=t2.ID "
                                + " left join {0}.mbs_user t6 on q.EditorID=t6.ID "
                                + " left join {0}.bms_region t7 on t.AreaID=t7.ID "
                                + " left join {0}.fmc_workshop t3 on t.WorkShopID=t3.ID "
                                + " left join {0}.fmc_factory t9 on t.FactoryID=t9.ID "
                                + " inner join {0}.fpc_product t5 on p.ProductID=t5.ID "
                                + " left join {0}.fmc_line t4 on t.LineID=t4.ID  WHERE  1=1  "
                             + " and ( @wDeviceID <= 0 or p.DeviceID  = @wDeviceID)   "
                             + " and ( @wProductID <= 0 or p.ProductID  = @wProductID)   "
                             + " and ( @wEditorID <= 0 or q.EditorID  = @wEditorID)   "
                             + " and ( @wRecordType <= 0 or q.RecordType  = @wRecordType)   "
                            
                        + " and ( @wProductNo ='' or t5.ProductNo  = @wProductNo)  "
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
                wParamMap.Add("wEditorID", wEditorID);
                wParamMap.Add("wRecordType", wRecordType);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                 
                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }

                wResult = CloneTool.CloneArray<DMSProgramNCRecord>(wQueryResult);

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

         
       
        public void DMS_UpdateProgramNCRecord(BMSEmployee wLoginUser, DMSProgramNCRecord wProgramNCRecord,
                OutResult<Int32> wErrorCode)
        {

            try
            {
                if (wProgramNCRecord == null || StringUtils.isEmpty(wProgramNCRecord.VersionNo) 
                    || wProgramNCRecord.RecordType <= 0 || wProgramNCRecord.ProgramID <= 0)
                {
                    return;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();

              
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("ProgramID", wProgramNCRecord.ProgramID);
                wParamMap.Add("RecordType", wProgramNCRecord.RecordType);
                wParamMap.Add("VersionNo", wProgramNCRecord.VersionNo); 
                wParamMap.Add("FilePath", wProgramNCRecord.FilePath); 
                wParamMap.Add("FileSourcePath", wProgramNCRecord.FileSourcePath);
                wParamMap.Add("FilePath_B", wProgramNCRecord.FilePath_B);
                wParamMap.Add("FileSourcePath_B", wProgramNCRecord.FileSourcePath_B);
                wParamMap.Add("Remark", wProgramNCRecord.Remark);
                wParamMap.Add("EditorID", wProgramNCRecord.EditorID);
                wParamMap.Add("EditTime", DateTime.Now);

                if (wProgramNCRecord.ID <= 0)
                {
                    wProgramNCRecord.ID = this.Insert(StringUtils.Format("{0}.dms_program_nc_record", wInstance), wParamMap);
                }
                else
                {
                    wParamMap.Add("ID", wProgramNCRecord.ID);
                    this.Update(StringUtils.Format("{0}.dms_program_nc_record", wInstance), "ID", wParamMap);
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
