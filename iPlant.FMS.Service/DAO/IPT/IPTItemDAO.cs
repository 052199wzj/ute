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
    class IPTItemDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(IPTItemDAO));

        private static IPTItemDAO Instance;

        private IPTItemDAO() : base()
        {

        }

        public static IPTItemDAO getInstance()
        {
            if (Instance == null)
                Instance = new IPTItemDAO();
            return Instance;
        }

        public List<IPTItem> IPT_SelectItemList(BMSEmployee wLoginUser, int wLineID, int wProductID, String wProductLike, int wIPTType, int wModeType,
            int wMainID, String wMainNameLike, String wGroupNameLike, String wItemNameLike, DateTime wStartTime, DateTime wEndTime,
              int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<IPTItem> wResult = new List<IPTItem>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wProductLike == null)
                    wProductLike = "";
                if (wMainNameLike == null)
                    wMainNameLike = "";

                String wSQL = StringUtils.Format(
                        " SELECT t.*,t1.Name as LineName,t2.Name as DeviceName,t2.Code as DeviceCode, t3.Name as PartPointName ,t3.Code as PartPointCode," +
                        " t4.Name as ModelName,t4.Code as ModelCode, t5.ProductName,t5.ProductNo, t6.Name as CreatorName,t7.Name as EditorName " +
                        "  FROM {0}.ipt_item t inner join {0}.fmc_line t1  on t.LineID=t1.ID "
                                + " left join {0}.dms_device_ledger t2 on t.MainID=t2.ID "
                                + " left join {0}.fpc_partpoint t3 on t.MainID=t3.ID "
                                + " left join {0}.dms_device_model t4 on t.MainID=t4.ID "
                                + " left join {0}.fpc_product t5 on t.ProductID=t5.ID "
                                + " left join {0}.mbs_user t6 on t.CreatorID=t6.ID "
                                + " left join {0}.mbs_user t7 on t.EditorID=t7.ID  "
                                + "  WHERE  1=1 and ( @wLineID <= 0 or t.LineID  = @wLineID)  "
                        + " and ( @wProductID <= 0 or t.ProductID  = @wProductID)  "
                        + " and ( @wIPTType <= 0 or t.IPTType  = @wIPTType)  "
                        + " and ( @wModeType <= 0 or t.ModeType  = @wModeType)  "
                        + " and ( @wMainID <= 0 or t.MainID  = @wMainID)  "
                        + " and ( @wProductLike ='' or t5.ProductName  LIKE  @wProductLike  or t5.ProductNo  LIKE  @wProductLike)  "
                        + " and ( @wGroupNameLike ='' or t.GroupName like @wGroupNameLike )  "
                        + " and ( @wItemNameLike ='' or t.ItemName like @wItemNameLike )  "
                        + " and ( @wMainNameLike ='' or t2.Name like @wMainNameLike or t2.Code like @wMainNameLike  or t3.Name like @wMainNameLike "
                        + "    or t3.Code like @wMainNameLike or t4.Name like @wMainNameLike or t4.Code like @wMainNameLike )  "
                        + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wStartTime <= t.EditTime) "
                        + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= t.CreateTime)  "
                        + " and ( @wActive < 0 or t.Active  = @wActive) ", wInstance);

                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wProductID", wProductID);
                wParamMap.Add("wIPTType", wIPTType);
                wParamMap.Add("wModeType", wModeType);
                wParamMap.Add("wMainID", wMainID);
                wParamMap.Add("wProductLike", StringUtils.isEmpty(wProductLike) ? "" : "%" + wProductLike + "%");
                wParamMap.Add("wGroupNameLike", StringUtils.isEmpty(wGroupNameLike) ? "" : "%" + wGroupNameLike + "%");
                wParamMap.Add("wMainNameLike", StringUtils.isEmpty(wMainNameLike) ? "" : "%" + wMainNameLike + "%");
                wParamMap.Add("wItemNameLike", StringUtils.isEmpty(wItemNameLike) ? "" : "%" + wItemNameLike + "%");
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wActive", wActive);


                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }

                // wReader\[\"(\w+)\"\]
                IPTItem wItem;
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wItem = new IPTItem();

                    wItem.ID = StringUtils.parseInt(wReader["ID"]);
                    wItem.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wItem.LineName = StringUtils.parseString(wReader["LineName"]);
                    wItem.MainID = StringUtils.parseInt(wReader["MainID"]);
                    wItem.IPTType = StringUtils.parseInt(wReader["IPTType"]);
                    wItem.ModeType = StringUtils.parseInt(wReader["ModeType"]);

                    wItem.GroupName = StringUtils.parseString(wReader["GroupName"]);
                    wItem.ItemName = StringUtils.parseString(wReader["ItemName"]);
                    wItem.Description = StringUtils.parseString(wReader["Description"]);
                    wItem.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wItem.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    wItem.ProductNo = StringUtils.parseString(wReader["ProductNo"]);

                    wItem.IntervalTime = StringUtils.parseInt(wReader["IntervalTime"]);
                    wItem.AlarmIntervalTime = StringUtils.parseInt(wReader["AlarmIntervalTime"]);
                     

                    wItem.CreatorID = StringUtils.parseInt(wReader["CreatorID"]);
                    wItem.CreatorName = StringUtils.parseString(wReader["CreatorName"]);
                    wItem.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wItem.EditorID = StringUtils.parseInt(wReader["EditorID"]);
                    wItem.EditorName = StringUtils.parseString(wReader["EditorName"]);
                    wItem.EditTime = StringUtils.parseDate(wReader["EditTime"]);
                    wItem.Active = StringUtils.parseInt(wReader["Active"]);


                    switch (wItem.IPTType)
                    {
                        case ((int)IPTTypes.Maintain):
                            wItem.MainName = StringUtils.parseString(wReader["ModelName"]);
                            wItem.MainCode = StringUtils.parseString(wReader["ModelCode"]);
                            break;
                        case ((int)IPTTypes.Patrol):
                            wItem.MainName = StringUtils.parseString(wReader["PartPointName"]);
                            wItem.MainCode = StringUtils.parseString(wReader["PartPointCode"]);
                            break;
                        case ((int)IPTTypes.PointCheck):
                            wItem.MainName = StringUtils.parseString(wReader["DeviceName"]);
                            wItem.MainCode = StringUtils.parseString(wReader["DeviceCode"]);
                            break;
                        default:
                            break;
                    }

                    wResult.Add(wItem);
                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



        private IPTItem IPT_CheckItem(BMSEmployee wLoginUser, IPTItem wIPTItem,
             OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            IPTItem wResult = new IPTItem();
            try
            {

                if (wIPTItem == null || StringUtils.isEmpty(wIPTItem.ItemName) || wIPTItem.LineID <= 0 || wIPTItem.MainID <= 0 || wIPTItem.IPTType <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return wResult;
                }

                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                String wSQL = "";

                switch (wIPTItem.IPTType)
                {
                    case ((int)IPTTypes.Maintain):
                       
                        if (wIPTItem.IntervalTime <= 0 || wIPTItem.AlarmIntervalTime < 0)
                        {
                            wErrorCode.set(MESException.Parameter.Value);
                            return wResult;
                        }
                        wSQL = StringUtils.Format(
                              "SELECT t.* FROM {0}.ipt_item t WHERE t.ID != @ID " +
                              " AND t.IPTType=@IPTType and t.MainID=@MainID and t.LineID=@LineID and t.GroupName=@GroupName  and t.ItemName=@ItemName   ;",
                              wInstance);
                        break;
                    case ((int)IPTTypes.Patrol):
                        if (StringUtils.isEmpty(wIPTItem.GroupName))
                        {
                            wErrorCode.set(MESException.Parameter.Value);
                            return wResult;
                        }
                        wSQL = StringUtils.Format(
                              "SELECT t.* FROM {0}.ipt_item t WHERE t.ID != @ID " +
                              " AND t.IPTType=@IPTType  and t.MainID=@MainID and t.LineID=@LineID and t.GroupName=@GroupName  and t.ItemName=@ItemName AND t.ProductID=@ProductID  ;",
                              wInstance);
                        break;
                    case ((int)IPTTypes.PointCheck):
                        if (wIPTItem.ModeType <= 0)
                        {
                            wErrorCode.set(MESException.Parameter.Value);
                            return wResult;
                        }
                        wSQL = StringUtils.Format(
                              "SELECT t.* FROM {0}.ipt_item t WHERE t.ID != @ID " +
                              " AND t.IPTType=@IPTType  and t.MainID=@MainID and t.LineID=@LineID  AND t.ModeType=@ModeType  ;",
                              wInstance);
                        break;
                    default:

                        wErrorCode.set(MESException.Parameter.Value);
                        return wResult;
                }


                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("ID", wIPTItem.ID);
                wParamMap.Add("IPTType", wIPTItem.IPTType);
                wParamMap.Add("MainID", wIPTItem.MainID);
                wParamMap.Add("LineID", wIPTItem.LineID);
                wParamMap.Add("GroupName", wIPTItem.GroupName);
                wParamMap.Add("ItemName", wIPTItem.ItemName);
                wParamMap.Add("ModeType", wIPTItem.ModeType);
                wParamMap.Add("ProductID", wIPTItem.ProductID);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {

                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.IPTType = StringUtils.parseInt(wReader["IPTType"]);
                    wResult.ModeType = StringUtils.parseInt(wReader["ModeType"]);
                    wResult.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wResult.MainID = StringUtils.parseInt(wReader["MainID"]);
                    wResult.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wResult.GroupName = StringUtils.parseString(wReader["GroupName"]);
                    wResult.ItemName = StringUtils.parseString(wReader["ItemName"]);

                    wResult.Active = StringUtils.parseInt(wReader["Active"]);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public void IPT_UpdateItem(BMSEmployee wLoginUser, IPTItem wItem,
                OutResult<Int32> wErrorCode)
        {

            try
            {
                if (wItem == null || StringUtils.isEmpty(wItem.ItemName) 
                    || wItem.LineID <= 0 || wItem.MainID <= 0 || wItem.IPTType <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }


                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                IPTItem wIPTItemDB = this.IPT_CheckItem(wLoginUser, wItem, wErrorCode);
                if (wIPTItemDB.ID > 0)
                {
                    wErrorCode.Result = MESException.Duplication.Value;
                    if (wItem.ID <= 0)
                    {
                        wItem.ID = wIPTItemDB.ID;
                    }
                    return;
                }


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("ModeType", wItem.ModeType);
                wParamMap.Add("GroupName", wItem.GroupName);
                wParamMap.Add("ItemName", wItem.ItemName);
                wParamMap.Add("Description", wItem.Description);
                wParamMap.Add("ProductID", wItem.ProductID);
                wParamMap.Add("IntervalTime", wItem.IntervalTime);
                wParamMap.Add("AlarmIntervalTime", wItem.AlarmIntervalTime); 

                wParamMap.Add("EditorID", wLoginUser.ID);
                wParamMap.Add("EditTime", DateTime.Now);


                if (wItem.ID <= 0)
                {
                    wParamMap.Add("LineID", wItem.LineID);
                    wParamMap.Add("MainID", wItem.MainID);
                    wParamMap.Add("IPTType", wItem.IPTType);


                    wParamMap.Add("CreatorID", wLoginUser.ID);
                    wParamMap.Add("CreateTime", DateTime.Now);
                    wItem.ID = this.Insert(StringUtils.Format("{0}.ipt_item", wInstance), wParamMap);

                }
                else
                {
                    wParamMap.Add("ID", wItem.ID);
                    this.Update(StringUtils.Format("{0}.ipt_item", wInstance), "ID", wParamMap);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }



        public void IPT_DeleteItem(BMSEmployee wLoginUser, IPTItem wItem,
                OutResult<Int32> wErrorCode)
        {
            try
            {

                if (wItem == null || wItem.ID <= 0 || StringUtils.isEmpty(wItem.ItemName) || wItem.LineID <= 0 || wItem.MainID <= 0 || wItem.IPTType <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }


                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
               

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("ID", wItem.ID);
                wParamMap.Add("Active", 0);

                this.Delete(StringUtils.Format("{0}.ipt_item", wInstance), wParamMap);


            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }


        public void IPT_ActiveItem(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive,
                OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return;

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
                String wSql = StringUtils.Format("UPDATE {0}.ipt_item SET EditTime=now(),EditorID={1}, Active ={2} WHERE ID IN({3}) ;",
                        wInstance, wLoginUser.ID, wActive, StringUtils.Join(",", wIDList));


                this.mDBPool.update(wSql, null);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }


    }
}
