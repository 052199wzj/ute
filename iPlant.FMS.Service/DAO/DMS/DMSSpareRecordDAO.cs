using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class DMSSpareRecordDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSSpareRecordDAO));
        private static DMSSpareRecordDAO Instance = null;

        private DMSSpareRecordDAO() : base()
        {

        }

        public static DMSSpareRecordDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSSpareRecordDAO();
            return Instance;
        }

        public List<DMSSpareRecord> DMS_GetSpareRecordList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID, String wModelNameLike,
            String wManufactorNameLike, String wSupplierNameLike, int wSpareID, String wSpareNoLike, int wRecordType, int wActive,
             DateTime wStartTime, DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<DMSSpareRecord> wResult = new List<DMSSpareRecord>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSQL = string.Format("Select p.*,  t.Code,t.Name,t.ModelName,t.ManufactorName,t.SupplierName," +
                    " t.WorkShopID,t.LineID,t.Active,t1.Name as WorkShopName,t2.Name as LineName," +
                            " t5.Name as EditorName  from {0}.dms_sparerecord p "
                                        + " inner join {0}.dms_spareledger t on t.ID=p.SpareID"
                                        + " Left join  {0}.fmc_workshop t1  on t.WorkShopID=t1.ID  "
                                        + " Left join  {0}.fmc_line t2  on t.LineID=t2.ID  "
                                        + " Left join  {0}.mbs_user t5  on p.EditorID=t5.ID  "
                                        + " where  1=1 and (@SpareID<=0 OR p.SpareID=@SpareID )"
                                        + " and ( @WorkShopID <=0 OR t.WorkShopID = @WorkShopID )"
                                        + " and ( @LineID <=0 OR t.LineID = @LineID )"
                                        + " AND ( @SpareNoLike='' OR t.Code LIKE @SpareNoLike OR t.Name LIKE @SpareNoLike) "
                                        + " AND ( @ModelNameLike='' OR t.ModelName LIKE @ModelNameLike) "
                                        + " AND ( @ManufactorNameLike='' OR t.ManufactorName LIKE @ManufactorNameLike) "
                                        + " AND ( @SupplierNameLike='' OR t.SupplierName LIKE @SupplierNameLike) "
                                        + " and ( @Active <0 OR t.Active = @Active )"
                                        + " and ( @StartTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @StartTime <= t.EditTime) "
                                        + " and ( @EndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @EndTime >= t.EditTime)  "
                                        + " and (  @RecordType <=0 or  p.RecordType = @RecordType)", wInstance);


                wParamMap.Add("SpareID", wSpareID);
                wParamMap.Add("SpareNoLike", StringUtils.isEmpty(wSpareNoLike) ? "" : "%" + wSpareNoLike + "%");
                wParamMap.Add("WorkShopID", wWorkShopID);
                wParamMap.Add("LineID", wLineID);
                wParamMap.Add("ModelNameLike", StringUtils.isEmpty(wModelNameLike) ? "" : "%" + wModelNameLike + "%");
                wParamMap.Add("ManufactorNameLike", StringUtils.isEmpty(wManufactorNameLike) ? "" : "%" + wManufactorNameLike + "%");
                wParamMap.Add("SupplierNameLike", StringUtils.isEmpty(wSupplierNameLike) ? "" : "%" + wSupplierNameLike + "%");
                wParamMap.Add("Active", wActive); 
                wParamMap.Add("RecordType", wRecordType);
                wParamMap.Add("StartTime", wStartTime);
                wParamMap.Add("EndTime", wEndTime);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSSpareRecord wSpareRecord = new DMSSpareRecord();


                    wSpareRecord.ID = StringUtils.parseInt(wReader["ID"]);
                    wSpareRecord.SpareID = StringUtils.parseInt(wReader["SpareID"]);
                    wSpareRecord.Name = StringUtils.parseString(wReader["Name"]);
                    wSpareRecord.Code = StringUtils.parseString(wReader["Code"]);

                    wSpareRecord.WorkShopID = StringUtils.parseInt(wReader["WorkShopID"]);
                    wSpareRecord.WorkShopName = StringUtils.parseString(wReader["WorkShopName"]);
                    wSpareRecord.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wSpareRecord.LineName = StringUtils.parseString(wReader["LineName"]);
                    wSpareRecord.ModelName = StringUtils.parseString(wReader["ModelName"]);

                    wSpareRecord.ManufactorName = StringUtils.parseString(wReader["ManufactorName"]);
                    wSpareRecord.SupplierName = StringUtils.parseString(wReader["SupplierName"]);

                    wSpareRecord.Remark = StringUtils.parseString(wReader["Remark"]);

                    wSpareRecord.RecordType = StringUtils.parseInt(wReader["RecordType"]);

                    wSpareRecord.RecordNum = StringUtils.parseDouble(wReader["RecordNum"]);

                    wSpareRecord.EditorID = StringUtils.parseInt(wReader["EditorID"]);
                    wSpareRecord.EditTime = StringUtils.parseDate(wReader["EditTime"]);
                    wSpareRecord.EditorName = StringUtils.parseString(wReader["EditorName"]);
                    wSpareRecord.Active = StringUtils.parseInt(wReader["Active"]);

                    wResult.Add(wSpareRecord);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public void DMS_UpdateSpareRecord(BMSEmployee wLoginUser, DMSSpareRecord wDMSSpareRecord, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {
                if (wDMSSpareRecord == null || wDMSSpareRecord.SpareID <= 0 || wDMSSpareRecord.RecordType <= 0 || wDMSSpareRecord.RecordNum == 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("SpareID", wDMSSpareRecord.SpareID);
                wParamMap.Add("RecordType", wDMSSpareRecord.RecordType);
                wParamMap.Add("RecordNum", wDMSSpareRecord.RecordNum);
                wParamMap.Add("Remark", wDMSSpareRecord.Remark);
                wParamMap.Add("EditTime", DateTime.Now);
                wParamMap.Add("EditorID", wLoginUser.ID);
                if (wDMSSpareRecord.ID <= 0)
                {
                    wDMSSpareRecord.ID = this.Insert(StringUtils.Format("{0}.dms_sparerecord", wInstance), wParamMap);
                }
                else
                {
                    wParamMap.Add("ID", wDMSSpareRecord.ID);
                    this.Update(StringUtils.Format("{0}.dms_sparerecord", wInstance), "ID", wParamMap);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public void DMS_DeleteSpareRecord(BMSEmployee wLoginUser, DMSSpareRecord wDMSSpareRecord, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {
                if (wDMSSpareRecord == null || wDMSSpareRecord.ID <= 0 || wDMSSpareRecord.SpareID <= 0 || wDMSSpareRecord.RecordType <= 0 || wDMSSpareRecord.RecordNum == 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("ID", wDMSSpareRecord.ID);
                this.Delete(StringUtils.Format("{0}.dms_sparerecord", wInstance), wParamMap);


            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

    }
}
