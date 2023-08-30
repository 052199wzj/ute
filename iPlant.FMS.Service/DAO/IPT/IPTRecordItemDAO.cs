using iPlant.Common.Tools;
using iPlant.Data.EF;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMC.Service
{
    class IPTRecordItemDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(IPTRecordItemDAO));

        private static IPTRecordItemDAO Instance;

        private IPTRecordItemDAO() : base()
        {

        }

        public static IPTRecordItemDAO getInstance()
        {
            if (Instance == null)
                Instance = new IPTRecordItemDAO();
            return Instance;
        }

        public List<IPTRecordItem> IPT_SelectRecordItemList(BMSEmployee wLoginUser, int wOrderID, int wItemID,
            int wLineID, int wProductID, int wModelID, String wProductLike, int wIPTType, int wModeType,
            int wMainID, String wMainNameLike, String wGroupNameLike, String wItemNameLike, int wCreatorID,
            int wEditorID, DateTime wStartTime, DateTime wEndTime,
              int wStatus, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<IPTRecordItem> wResult = new List<IPTRecordItem>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wProductLike == null)
                    wProductLike = "";
                if (wMainNameLike == null)
                    wMainNameLike = "";

                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if (wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if (wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return wResult;
                }

                String wSQL = StringUtils.Format(
                        " SELECT t.*,t1.Name as LineName,t2.Name as DeviceName,t2.Code as DeviceCode,t2.ModelID,t4.Name as ModelName," +
                        "  t3.Name as PartPointName ,t3.Code as PartPointCode,group_concat(t9.Name) as RepairmanNames," +
                        "  t5.ProductName,t5.ProductNo, t6.Name as CreatorName,t7.Name as EditorName,t8.OrderNo " +
                        "  FROM {0}.ipt_recorditem t inner join {0}.fmc_line t1  on t.LineID=t1.ID "
                                + " left join {0}.dms_device_ledger t2 on t.MainID=t2.ID "
                                + " left join {0}.dms_device_model t4 on t2.ModelID=t4.ID "
                                + " left join {0}.fpc_partpoint t3 on t.MainID=t3.ID "
                                + " left join {0}.fpc_product t5 on t.ProductID=t5.ID "
                                + " left join {0}.mbs_user t6 on t.CreatorID=t6.ID "
                                + " left join {0}.mbs_user t7 on t.EditorID=t7.ID  "
                                + " left join {0}.oms_order t8 on t.OrderID=t8.ID  "
                                + " left join {0}.mbs_user t9 on FIND_IN_SET( t9.ID,t.Repairmans)  "
                                + "  WHERE  1=1 and ( @wLineID <= 0 or t.LineID  = @wLineID)  "
                        + " and ( @wProductID <= 0 or t.ProductID  = @wProductID)  "
                        + " and ( @wIPTType <= 0 or t.IPTType  = @wIPTType)  "
                        + " and ( @wModeType <= 0 or t.ModeType  = @wModeType)  "
                        + " and ( @wMainID <= 0 or t.MainID  = @wMainID)  "
                        + " and ( @wOrderID <= 0 or t.OrderID  = @wOrderID)  "
                        + " and ( @wItemID <= 0 or t.ItemID  = @wItemID)  "
                        + " and ( @wModelID <= 0 or t2.ModelID  = @wModelID)  "
                        + " and ( @wCreatorID <= 0 or t.CreatorID  = @wCreatorID)  "
                        + " and ( @wEditorID <= 0 or t.EditorID  = @wEditorID)  "
                        + " and ( @wProductLike ='' or t5.ProductName  LIKE  @wProductLike  or t5.ProductNo  LIKE  @wProductLike)  "
                        + " and ( @wGroupNameLike ='' or t.GroupName like @wGroupNameLike )  "
                        + " and ( @wItemNameLike ='' or t.ItemName like @wItemNameLike )  "
                        + " and ( @wMainNameLike ='' or t2.Name like @wMainNameLike or t2.Code like @wMainNameLike  or t3.Name like @wMainNameLike "
                        + "    or t3.Code like @wMainNameLike  )  "
                        + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or   (t.IPTType=1 &&  @wStartTime <= t.CreateTime ) or   (t.IPTType != 1 &&  @wStartTime <= t.EditTime ) ) "
                        + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= t.CreateTime)  "
                        + " and ( @wStatus <= 0 or t.Status  = @wStatus) group by t.ID ", wInstance);

                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wOrderID", wOrderID);
                wParamMap.Add("wItemID", wItemID);
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wProductID", wProductID);
                wParamMap.Add("wIPTType", wIPTType);
                wParamMap.Add("wModeType", wModeType);
                wParamMap.Add("wMainID", wMainID);
                wParamMap.Add("wModelID", wModelID);
                wParamMap.Add("wProductLike", StringUtils.isEmpty(wProductLike) ? "" : "%" + wProductLike + "%");
                wParamMap.Add("wGroupNameLike", StringUtils.isEmpty(wGroupNameLike) ? "" : "%" + wGroupNameLike + "%");
                wParamMap.Add("wMainNameLike", StringUtils.isEmpty(wMainNameLike) ? "" : "%" + wMainNameLike + "%");
                wParamMap.Add("wItemNameLike", StringUtils.isEmpty(wItemNameLike) ? "" : "%" + wItemNameLike + "%");
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wStatus", wStatus);
                wParamMap.Add("wCreatorID", wCreatorID);
                wParamMap.Add("wEditorID", wEditorID);


                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                List<int> wRecordIDList = new List<int>();

                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    IPTRecordItem wItem = new IPTRecordItem();

                    wItem.ID = StringUtils.parseInt(wReader["ID"]);
                    wItem.OrderID = StringUtils.parseInt(wReader["OrderID"]);
                    wItem.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wItem.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wItem.LineName = StringUtils.parseString(wReader["LineName"]);
                    wItem.MainID = StringUtils.parseInt(wReader["MainID"]);
                    wItem.ItemID = StringUtils.parseInt(wReader["ItemID"]);
                    wItem.IPTType = StringUtils.parseInt(wReader["IPTType"]);
                    wItem.ModeType = StringUtils.parseInt(wReader["ModeType"]);

                    wItem.GroupName = StringUtils.parseString(wReader["GroupName"]);
                    wItem.ItemName = StringUtils.parseString(wReader["ItemName"]);
                    wItem.Description = StringUtils.parseString(wReader["Description"]);
                    wItem.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wItem.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    wItem.ProductNo = StringUtils.parseString(wReader["ProductNo"]);

                    wItem.PlanTime = StringUtils.parseDate(wReader["PlanTime"]);

                    wItem.CreatorID = StringUtils.parseInt(wReader["CreatorID"]);
                    wItem.CreatorName = StringUtils.parseString(wReader["CreatorName"]);
                    wItem.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wItem.EditorID = StringUtils.parseInt(wReader["EditorID"]);
                    wItem.EditorName = StringUtils.parseString(wReader["EditorName"]);
                    wItem.EditTime = StringUtils.parseDate(wReader["EditTime"]);
                    wItem.Status = StringUtils.parseInt(wReader["Status"]);

                    wItem.Repairmans = StringUtils.parseIntList(wReader["Repairmans"], ",");
                    wItem.RepairmanNames = StringUtils.parseString(wReader["RepairmanNames"]);

                    switch (wItem.IPTType)
                    {
                        case ((int)IPTTypes.Patrol):
                            wItem.MainName = StringUtils.parseString(wReader["PartPointName"]);
                            wItem.MainCode = StringUtils.parseString(wReader["PartPointCode"]);
                            break;

                        case ((int)IPTTypes.Maintain):
                        case ((int)IPTTypes.PointCheck):
                        case ((int)IPTTypes.Repair):
                        case ((int)IPTTypes.Exception):
                            wItem.MainName = StringUtils.parseString(wReader["DeviceName"]);
                            wItem.MainCode = StringUtils.parseString(wReader["DeviceCode"]);

                            wItem.GroupName = StringUtils.parseString(wReader["ModelName"]);
                            break;
                        default:
                            break;
                    }
                    wRecordIDList.Add(wItem.ID);
                    wResult.Add(wItem);
                }
                List<IPTRecordItemValue> wIPTRecordItemValueList = this.IPT_SelectItemValue(wLoginUser, wRecordIDList, wErrorCode);
                if (wIPTRecordItemValueList != null && wIPTRecordItemValueList.Count > 0)
                {
                    Dictionary<int, List<IPTRecordItemValue>> wIPTRecordItemValueListDic = wIPTRecordItemValueList.GroupBy(p => p.RecordID)
                        .ToDictionary(p => p.Key, p => p.OrderBy(q => q.ID).ToList());
                    foreach (IPTRecordItem wIPTRecordItem in wResult)
                    {
                        if (wIPTRecordItem == null || wIPTRecordItem.ID <= 0 || !wIPTRecordItemValueListDic.ContainsKey(wIPTRecordItem.ID))
                            continue;
                        wIPTRecordItem.ItemResult = wIPTRecordItemValueListDic[wIPTRecordItem.ID];
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


        private IPTRecordItem IPT_CheckRecordItem(BMSEmployee wLoginUser, IPTRecordItem wIPTRecordItem,
             OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            IPTRecordItem wResult = new IPTRecordItem();
            try
            {

                if (wIPTRecordItem == null || wIPTRecordItem.ItemResult == null || wIPTRecordItem.ItemResult.Count <= 0
                    || wIPTRecordItem.LineID <= 0 || wIPTRecordItem.MainID <= 0 || wIPTRecordItem.IPTType <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return wResult;
                }

                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                String wSQL = "";

                switch (wIPTRecordItem.IPTType)
                {

                    case ((int)IPTTypes.Patrol):
                        if (StringUtils.isEmpty(wIPTRecordItem.GroupName) || StringUtils.isEmpty(wIPTRecordItem.ItemName) || wIPTRecordItem.ProductID <= 0 || wIPTRecordItem.OrderID <= 0 || wIPTRecordItem.ItemID <= 0)
                        {
                            wErrorCode.set(MESException.Parameter.Value);
                            return wResult;
                        }
                        wSQL = StringUtils.Format(
                              "SELECT t.* FROM {0}.ipt_recorditem t WHERE t.ID != @ID " +
                              " AND t.IPTType=@IPTType  and t.MainID=@MainID and t.LineID=@LineID and t.OrderID=@OrderID" +
                              " AND ( t.ItemID=@ItemID  or ( t.GroupName=@GroupName and t.ItemName=@ItemName))" +
                              " AND t.ProductID=@ProductID and  str_to_date(DATE_FORMAT(t.CreateTime,'%Y-%m-%d'),'%Y-%m-%d') = str_to_date( DATE_FORMAT(now(),'%Y-%m-%d'),'%Y-%m-%d')  ;",
                              wInstance);
                        break;
                    case ((int)IPTTypes.PointCheck):
                        if (StringUtils.isEmpty(wIPTRecordItem.ItemName))
                        {
                            wErrorCode.set(MESException.Parameter.Value);
                            return wResult;
                        }
                        return wResult;
                    case ((int)IPTTypes.Maintain):
                        if (StringUtils.isEmpty(wIPTRecordItem.ItemName))
                        {
                            wErrorCode.set(MESException.Parameter.Value);
                            return wResult;
                        }
                        if (wIPTRecordItem.ID > 0)
                            return wResult;

                        wSQL = StringUtils.Format(
                              "SELECT t.* FROM {0}.ipt_recorditem t WHERE t.ID != @ID " +
                              " AND t.IPTType=@IPTType  and t.MainID=@MainID and t.LineID=@LineID " +
                              " AND ( t.ItemID=@ItemID  or ( t.GroupName=@GroupName and t.ItemName=@ItemName ))" +
                              " AND  t.Status=1 ;",
                              wInstance);
                        break;
                    case ((int)IPTTypes.Repair):
                        if (StringUtils.isEmpty(wIPTRecordItem.ItemName) || wIPTRecordItem.ModeType <= 0)
                        {
                            wErrorCode.set(MESException.Parameter.Value);
                            return wResult;
                        }
                        return wResult;
                    case ((int)IPTTypes.Exception):
                        wSQL = StringUtils.Format(
                             "SELECT t.* FROM {0}.ipt_recorditem t WHERE t.ID != @ID " +
                             " AND t.IPTType=@IPTType  and t.MainID=@MainID and t.LineID=@LineID " +
                             " AND  t.GroupName=@GroupName " +
                             " and ( t.ItemName = '' or  @ItemName='' or t.ItemName = @ItemName )" +
                             " and t.ModeType=@ModeType AND  t.Status=1  ;",
                             wInstance);
                        break;
                    default:

                        wErrorCode.set(MESException.Parameter.Value);
                        return wResult;
                }


                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("ID", wIPTRecordItem.ID);
                wParamMap.Add("OrderID", wIPTRecordItem.OrderID);
                wParamMap.Add("IPTType", wIPTRecordItem.IPTType);
                wParamMap.Add("MainID", wIPTRecordItem.MainID);
                wParamMap.Add("LineID", wIPTRecordItem.LineID);
                wParamMap.Add("ItemID", wIPTRecordItem.ItemID);
                wParamMap.Add("GroupName", wIPTRecordItem.GroupName);
                wParamMap.Add("ItemName", wIPTRecordItem.ItemName);
                wParamMap.Add("ModeType", wIPTRecordItem.ModeType);
                wParamMap.Add("ProductID", wIPTRecordItem.ProductID);
                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {

                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.OrderID = StringUtils.parseInt(wReader["OrderID"]);
                    wResult.IPTType = StringUtils.parseInt(wReader["IPTType"]);
                    wResult.ModeType = StringUtils.parseInt(wReader["ModeType"]);
                    wResult.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wResult.MainID = StringUtils.parseInt(wReader["MainID"]);
                    wResult.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wResult.GroupName = StringUtils.parseString(wReader["GroupName"]);
                    wResult.ItemName = StringUtils.parseString(wReader["ItemName"]);

                    wResult.Status = StringUtils.parseInt(wReader["Status"]);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public void IPT_UpdateRecordItem(BMSEmployee wLoginUser, IPTRecordItem wItem,
                OutResult<Int32> wErrorCode)
        {

            try
            {
                if (wItem == null || StringUtils.isEmpty(wItem.ItemName) || wItem.ItemResult == null || wItem.ItemResult.Count <= 0
                    || wItem.LineID <= 0 || wItem.MainID <= 0 || wItem.IPTType <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }


                DateTime wBaseTime = new DateTime(2010, 1, 1);

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                IPTRecordItem wIPTRecordItemDB = this.IPT_CheckRecordItem(wLoginUser, wItem, wErrorCode);
                if (wIPTRecordItemDB.ID > 0)
                {
                    wErrorCode.Result = MESException.Duplication.Value;
                    if (wItem.ID <= 0)
                    {
                        wItem.ID = wIPTRecordItemDB.ID;
                    }
                    return;
                }


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();



                if (wItem.CreatorID < 0)
                    wItem.CreatorID = wLoginUser.ID;

                if (wItem.EditorID < 0)
                    wItem.EditorID = wLoginUser.ID;



                if (wItem.CreateTime <= wBaseTime)
                    wItem.CreateTime = DateTime.Now;
                if (wItem.EditTime <= wBaseTime)
                    wItem.EditTime = DateTime.Now;

                if (wItem.PlanTime <= wBaseTime)
                    wItem.PlanTime = DateTime.Now;


                wParamMap.Add("ItemID", wItem.ItemID);
                wParamMap.Add("LineID", wItem.LineID);
                wParamMap.Add("OrderID", wItem.OrderID);
                wParamMap.Add("MainID", wItem.MainID);
                wParamMap.Add("IPTType", wItem.IPTType);
                wParamMap.Add("ModeType", wItem.ModeType);
                wParamMap.Add("GroupName", wItem.GroupName);
                wParamMap.Add("ItemName", wItem.ItemName);
                wParamMap.Add("Description", wItem.Description);
                wParamMap.Add("ProductID", wItem.ProductID);
                wParamMap.Add("PlanTime", wItem.PlanTime);

                wParamMap.Add("EditorID", wItem.EditorID);

                if (wItem.EditTime < wItem.CreateTime)
                    wItem.EditTime = wItem.CreateTime;

                if (wItem.IPTType == ((int)IPTTypes.Patrol))
                    wItem.EditTime = DateTime.Now;
                wParamMap.Add("EditTime", wItem.EditTime);

                wParamMap.Add("CreatorID", wItem.CreatorID);
                wParamMap.Add("CreateTime", wItem.CreateTime);

                wParamMap.Add("Repairmans", StringUtils.Join(",", wItem.Repairmans));
                wParamMap.Add("Status", wItem.Status);


                if (wItem.ID <= 0)
                {
                    wItem.ID = this.Insert(StringUtils.Format("{0}.ipt_recorditem", wInstance), wParamMap);
                }
                else
                {
                    wParamMap.Add("ID", wItem.ID);
                    this.Update(StringUtils.Format("{0}.ipt_recorditem", wInstance), "ID", wParamMap);
                }

                this.IPT_UpdateItemValue(wLoginUser, wItem.ItemResult, wItem.ID, wErrorCode);

                if (Enum.TryParse<IPTTypes>(wItem.IPTType + "", out IPTTypes wIPTTypes))
                {

                    BPMEventModule wEventModule = wIPTTypes.GetEventModule();


                    if (wItem.Status == 1)
                    {
                        int wFunctionID = wEventModule.GetFunctionID(); ;
                        //获取权限人员
                        List<BMSRoleItem> wList = BMSRoleDAO.getInstance().BMS_QueryUserListByFunctionID(wLoginUser, wFunctionID, wErrorCode);
                        Dictionary<int, String> wResponseList = new Dictionary<int, string>();

                        foreach (BMSRoleItem wBMSRoleItem in wList)
                        {
                            if (!wResponseList.ContainsKey(wBMSRoleItem.UserID))
                                wResponseList.Add(wBMSRoleItem.UserID, wBMSRoleItem.Remark);

                            wResponseList[wBMSRoleItem.UserID] = wBMSRoleItem.Remark;
                        }

                        //创建消息
                        BFCMessage wBFCMessage = new BFCMessage();


                        wBFCMessage.Active = 0;
                        wBFCMessage.CompanyID = 0;
                        wBFCMessage.CreateTime = DateTime.Now;
                        wBFCMessage.EditTime = DateTime.Now;
                        wBFCMessage.ID = 0;
                        wBFCMessage.MessageID = wItem.ID;
                        wBFCMessage.ModuleID = ((int)wEventModule);
                        wBFCMessage.ModuleName = EnumTool.GetEnumDesc<BPMEventModule>(wBFCMessage.ModuleID);
                        wBFCMessage.MessageText = StringUtils.Format("{0}模块任务，于{1}，在{2}设备上产生。",
                            wBFCMessage.ModuleName, wItem.CreateTime.ToString("yyyy-MM-dd"), wItem.MainCode);

                        wBFCMessage.ResponsorID = 0;//权限人员
                        wBFCMessage.SendStatus = 0;
                        wBFCMessage.ShiftID = StringUtils.parseInt(DateTime.Now.ToString("yyyyMMdd"));
                        wBFCMessage.StepID = 0;
                        wBFCMessage.StationID = wItem.MainID;
                        wBFCMessage.StationNo = wItem.MainCode;
                        wBFCMessage.Title = StringUtils.Format("{0} 设备：{1}", wBFCMessage.ModuleName, wItem.MainCode);
                        wBFCMessage.Type = ((int)BFCMessageType.Task);

                        BFCMessageDAO.getInstance().BFC_InsertMessage(wLoginUser, wBFCMessage, wResponseList, wErrorCode);

                    }
                    else if (wItem.Status == 2)
                    {
                        if (wItem.EditorID <= 0)
                            wItem.EditorID = wLoginUser.ID;
                        BFCMessageDAO.getInstance().BFC_HandleTaskMessage(wLoginUser, wItem.EditorID, new List<int> { wItem.ID }, ((int)wEventModule), 0, ((int)BFCMessageStatus.Finished), 1, wErrorCode);
                    }

                }


            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        /// <summary>
        /// 无用
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wOrderID"></param>
        /// <param name="wLineID"></param>
        /// <param name="wProductID"></param>
        /// <param name="wProductLike"></param>
        /// <param name="wIPTType"></param>
        /// <param name="wModeType"></param>
        /// <param name="wMainID"></param>
        /// <param name="wMainNameLike"></param>
        /// <param name="wGroupNameLike"></param>
        /// <param name="wCreatorID"></param>
        /// <param name="wEditorID"></param>
        /// <param name="wStartTime"></param>
        /// <param name="wEndTime"></param>
        /// <param name="wStatus"></param>
        /// <param name="wErrorCode"></param>
        /// <returns></returns>
        private List<IPTRecordItemValue> IPT_SelectItemValue(BMSEmployee wLoginUser, int wOrderID, int wItemID, int wLineID, int wProductID, String wProductLike, int wIPTType, int wModeType,
            int wMainID, String wMainNameLike, String wGroupNameLike, int wCreatorID, int wEditorID, DateTime wStartTime, DateTime wEndTime,
              int wStatus, OutResult<Int32> wErrorCode)
        {

            List<IPTRecordItemValue> wResult = new List<IPTRecordItemValue>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wProductLike == null)
                    wProductLike = "";
                if (wMainNameLike == null)
                    wMainNameLike = "";

                String wSQL = StringUtils.Format(
                        " SELECT p.*,t9.WorkpieceNo FROM {0}.ipt_recorditemvalue p inner join {0}.ipt_recorditem t on p.Record=t.ID"
                                + " inner join {0}.fmc_line t1  on t.LineID=t1.ID "
                                  + " inner join {0}.qms_workpiece t9 on t.WorkpieceID=t9.ID "
                                + " left join {0}.dms_device_ledger t2 on t.MainID=t2.ID "
                                + " left join {0}.fpc_partpoint t3 on t.MainID=t3.ID "
                                + " left join {0}.fpc_product t5 on t.ProductID=t5.ID "
                                + " left join {0}.oms_order t8 on t.OrderID=t8.ID  "
                                + "  WHERE  1=1 and ( @wLineID <= 0 or t.LineID  = @wLineID)  "
                        + " and ( @wProductID <= 0 or t.ProductID  = @wProductID)  "
                        + " and ( @wIPTType <= 0 or t.IPTType  = @wIPTType)  "
                        + " and ( @wModeType <= 0 or t.ModeType  = @wModeType) "
                        + " and ( @wMainID <= 0 or t.MainID  = @wMainID)  "
                        + " and ( @wOrderID <= 0 or t.OrderID  = @wOrderID)  "
                        + " and ( @wItemID <= 0 or t.ItemID  = @wItemID)  "
                        + " and ( @wCreatorID <= 0 or t.CreatorID  = @wCreatorID)  "
                        + " and ( @wEditorID <= 0 or t.EditorID  = @wEditorID)  "
                        + " and ( @wProductLike ='' or t5.ProductName  LIKE  @wProductLike  or t5.ProductNo  LIKE  @wProductLike)  "
                        + " and ( @wGroupNameLike ='' or t.GroupName like @wGroupNameLike )  "
                        + " and ( @wMainNameLike ='' or t2.Name like @wMainNameLike or t2.Code like @wMainNameLike  or t3.Name like @wMainNameLike "
                        + "    or t3.Code like @wMainNameLike )  "
                        + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wStartTime <= t.EditTime) "
                        + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= t.CreateTime)  "
                        + " and ( @wStatus <= 0 or t.Status  = @wStatus) ", wInstance);

                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wOrderID", wOrderID);
                wParamMap.Add("wItemID", wItemID);
                wParamMap.Add("wProductID", wProductID);
                wParamMap.Add("wIPTType", wIPTType);
                wParamMap.Add("wModeType", wModeType);
                wParamMap.Add("wMainID", wMainID);
                wParamMap.Add("wProductLike", StringUtils.isEmpty(wProductLike) ? "" : "%" + wProductLike + "%");
                wParamMap.Add("wGroupNameLike", StringUtils.isEmpty(wGroupNameLike) ? "" : "%" + wGroupNameLike + "%");
                wParamMap.Add("wMainNameLike", StringUtils.isEmpty(wMainNameLike) ? "" : "%" + wMainNameLike + "%");
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wStatus", wStatus);
                wParamMap.Add("wCreatorID", wCreatorID);
                wParamMap.Add("wEditorID", wEditorID);


                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }

                // wReader\[\"(\w+)\"\]
                IPTRecordItemValue wItem = null;
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wItem = new IPTRecordItemValue();

                    wItem.ID = StringUtils.parseInt(wReader["ID"]);
                    wItem.RecordID = StringUtils.parseInt(wReader["RecordID"]);
                    wItem.WorkpieceNo = StringUtils.parseString(wReader["WorkpieceNo"]);
                    wItem.WorkpieceID = StringUtils.parseInt(wReader["WorkpieceID"]);
                    wItem.Remark = StringUtils.parseString(wReader["Remark"]);
                    wItem.Result = StringUtils.parseInt(wReader["Result"]);

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


        private List<IPTRecordItemValue> IPT_SelectItemValue(BMSEmployee wLoginUser, List<Int32> wRecordIDList, OutResult<Int32> wErrorCode)
        {

            List<IPTRecordItemValue> wResult = new List<IPTRecordItemValue>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wRecordIDList == null || wRecordIDList.Count <= 0)
                    return wResult;

                wRecordIDList.RemoveAll(p => p <= 0);

                if (wRecordIDList.Count <= 0)
                    return wResult;

                String wSQL = StringUtils.Format(
                        " SELECT p.*,t9.WorkpieceNo FROM {0}.ipt_recorditemvalue p "
                         + "  left join {0}.qms_workpiece t9 on p.WorkpieceID=t9.ID "
                         + "  WHERE  p.RecordID IN ({1})  ", wInstance, StringUtils.Join(",", wRecordIDList));

                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }

                // wReader\[\"(\w+)\"\]
                IPTRecordItemValue wItem = null;
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wItem = new IPTRecordItemValue();

                    wItem.ID = StringUtils.parseInt(wReader["ID"]);
                    wItem.RecordID = StringUtils.parseInt(wReader["RecordID"]);
                    wItem.WorkpieceNo = StringUtils.parseString(wReader["WorkpieceNo"]);
                    wItem.WorkpieceID = StringUtils.parseInt(wReader["WorkpieceID"]);
                    wItem.Remark = StringUtils.parseString(wReader["Remark"]);
                    wItem.Result = StringUtils.parseInt(wReader["Result"]);

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


        private void IPT_UpdateItemValue(BMSEmployee wLoginUser, List<IPTRecordItemValue> wItemList, int wRecordID,
                OutResult<Int32> wErrorCode)
        {
            try
            {
                if (wItemList == null || wItemList.Count <= 0
                    || wRecordID <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }


                DateTime wBaseTime = new DateTime(2010, 1, 1);

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                //如果是巡检得一个个提交
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                int wRowChange = 0;
                foreach (IPTRecordItemValue wIPTRecordItemValue in wItemList)
                {
                    if (wIPTRecordItemValue == null)
                        continue;
                    wParamMap.Clear();
                    wParamMap.Add("RecordID", wRecordID);
                    wParamMap.Add("WorkpieceID", wIPTRecordItemValue.WorkpieceID);
                    wParamMap.Add("Remark", wIPTRecordItemValue.Remark);
                    wParamMap.Add("Result", wIPTRecordItemValue.Result);

                    if (wIPTRecordItemValue.ID <= 0)
                    {
                        wIPTRecordItemValue.ID = this.Insert(StringUtils.Format("{0}.ipt_recorditemvalue", wInstance), wParamMap);
                        wRowChange = 1;
                    }
                    else
                    {
                        wParamMap.Add("ID", wIPTRecordItemValue.ID);
                        wRowChange = this.Update(StringUtils.Format("{0}.ipt_recorditemvalue", wInstance), "ID", wParamMap);
                    }

                    if (wRowChange > 0 && wIPTRecordItemValue.WorkpieceID > 0)
                    {
                        //修改workpiece状态 
                        QMSWorkpieceDAO.getInstance().QMS_UpdateWorkpieceResult(wLoginUser, wIPTRecordItemValue.WorkpieceID, "PatrolCheckResult", wIPTRecordItemValue.Result,0, wErrorCode);
                        if (wErrorCode.Result != 0)
                            return;

                    }
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }


        }

        public void IPT_DeleteRecordItem(BMSEmployee wLoginUser, IPTRecordItem wIPTRecordItem, OutResult<Int32> wErrorCode)
        {

            try
            {
                if (wIPTRecordItem == null || wIPTRecordItem.ID <= 0 || wIPTRecordItem.IPTType == ((int)IPTTypes.Patrol))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                DateTime wBaseTime = new DateTime(2010, 1, 1);

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                //如果是巡检得一个个提交
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();


                wParamMap.Clear();
                wParamMap.Add("ID", wIPTRecordItem.ID);

                this.Delete(StringUtils.Format("{0}.ipt_recorditem", wInstance), wParamMap);

                wParamMap.Clear();
                wParamMap.Add("RecordID", wIPTRecordItem.ID);

                this.Delete(StringUtils.Format("{0}.ipt_recorditemvalue", wInstance), wParamMap, " and ID>0 ");

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }

        }



        public Dictionary<long, int> IPT_GetOperatorCount(BMSEmployee wLoginUser, int wLineID, int wStatType, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            Dictionary<long, int> wResult = new Dictionary<long, int>();
            try
            {

                String wGroupType = "";

                switch (wStatType)
                {
                    case ((int)DMSStatTypes.Week):
                        wGroupType = " str_to_date( DATE_FORMAT(t.CreateTime,'%Y-%u-1'),'%Y-%u-%w') ";

                        break;
                    case ((int)DMSStatTypes.Month):
                        wGroupType = " str_to_date( DATE_FORMAT(t.CreateTime,'%Y-%m-1'),'%Y-%m-%d') ";

                        break;
                    case ((int)DMSStatTypes.Quarter):
                        wGroupType = " str_to_date( concat(  year(t.CreateTime),'-',(quarter(t.CreateTime) * 3)-2,'-1'),'%Y-%m-%d') ";

                        break;
                    case ((int)DMSStatTypes.Year):
                        wGroupType = " str_to_date( concat(  year(t.CreateTime),'-01','-01'),'%Y-%m-%d')  ";

                        break;
                    default:
                        wGroupType = " str_to_date( DATE_FORMAT(t.CreateTime,'%Y-%m-%d'),'%Y-%m-%d') ";
                        break;
                }

                String wSQL = StringUtils.Format(
                      " SELECT count(distinct t.CreatorID) as CreatorTotal, {1} as StatTypeDate "
                      + " FROM {0}.ipt_recorditem t  WHERE  t.IPTType =@wIPTType and ( @wLineID <= 0 or t.LineID  = @wLineID)  "
                      + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wStartTime <= t.CreateTime) "
                      + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= t.CreateTime)  "
                      + "group by StatTypeDate  ;"
                      , MESDBSource.DMS.getDBName(), wGroupType);

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wIPTType", ((int)IPTTypes.Patrol));
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                DateTime wStatTypeDate;
                int wCreatorTotal = 0;
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wStatTypeDate = StringUtils.parseDate(wReader["StatTypeDate"]);
                    wCreatorTotal = StringUtils.parseInt(wReader["CreatorTotal"]);
                    if (!wResult.ContainsKey(wStatTypeDate.Ticks))
                        wResult.Add(wStatTypeDate.Ticks, 0);
                    wResult[wStatTypeDate.Ticks] = wCreatorTotal;

                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public Dictionary<int, List<IPTItem>> IPT_GetDeviceMaintainLastTime(BMSEmployee wLoginUser, OutResult<Int32> wErrorCode)
        {
            Dictionary<int, List<IPTItem>> wResult = new Dictionary<int, List<IPTItem>>();
            try
            {
                wErrorCode.set(0);

                String wSQL = StringUtils.Format(
                   " SELECT  t2.ID as DeviceID, count(CASE WHEN t1.Status=1 THEN t1.ID ELSE NULL END) AS HasTaskCount, "
                    + "  ifnull(Max(t1.EditTime),t2.AcceptanceDate) AS LastTime,t.*, "
                    + " t3.Name as LineName,t2.Name as DeviceName,t2.Code as DeviceCode, "
                    + " t4.Name as ModelName,t4.Code as ModelCode"
                    + "  FROM {0}.dms_device_ledger t2 "
                    + " inner join {0}.ipt_item t on t2.ModelID = t.MainID  and t.Active=1 and t.IPTType =  @wIPTType"
                    + " inner join {0}.fmc_line t3  on t.LineID=t3.ID "
                    + " inner join {0}.dms_device_model t4 on t2.ModelID=t4.ID "
                    + " left join {0}.ipt_recorditem t1 on t.ID = t1.ItemID  and t2.ID = t1.MainID"
                    + " where t2.Active=1 and t.Active=1 "
                    + " GROUP BY t2.ID, t.ID "
                   , MESDBSource.DMS.getDBName());

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wIPTType", ((int)IPTTypes.Maintain));

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }

                // wReader\[\"(\w+)\"\]
                IPTItem wItem;
                int wDeviceID = 0;
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    if (StringUtils.parseInt(wReader["HasTaskCount"]) > 0)
                        continue;

                    wItem = new IPTItem();

                    wDeviceID = StringUtils.parseInt(wReader["DeviceID"]);

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

                    wItem.IntervalTime = StringUtils.parseInt(wReader["IntervalTime"]);
                    wItem.AlarmIntervalTime = StringUtils.parseInt(wReader["AlarmIntervalTime"]);


                    wItem.CreatorID = StringUtils.parseInt(wReader["CreatorID"]);
                    wItem.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wItem.EditorID = StringUtils.parseInt(wReader["EditorID"]);
                    wItem.EditTime = StringUtils.parseDate(wReader["EditTime"]);
                    wItem.Active = StringUtils.parseInt(wReader["Active"]);
                    wItem.MainName = StringUtils.parseString(wReader["ModelName"]);
                    wItem.MainCode = StringUtils.parseString(wReader["ModelCode"]);


                    wItem.EditTime = StringUtils.parseDate(wReader["LastTime"]);

                    if (!wResult.ContainsKey(wDeviceID))
                        wResult.Add(wDeviceID, new List<IPTItem>());

                    wResult[wDeviceID].Add(wItem);
                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;

        }


        public List<IPTRecordItemStatistics> IPT_GetDeviceStatisticsList(BMSEmployee wLoginUser, List<int> wDeviceIDList, List<int> wTypeList,
            DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {

            List<IPTRecordItemStatistics> wResult = new List<IPTRecordItemStatistics>();
            try
            {
                if (wDeviceIDList == null || wDeviceIDList.Count <= 0)
                    return wResult;

                if (wTypeList == null)
                    wTypeList = new List<int>();

                if (wTypeList.Count <= 0) { 
                    wTypeList.Add(((int)IPTTypes.Maintain));
                    wTypeList.Add(((int)IPTTypes.Repair));
                }


                String wSQL = StringUtils.Format(
                      " SELECT t.MainID AS DeviceID,t1.AssetNo,t1.Name as DeviceName, count(t.ID) as AlarmCount,t.IPTType," +
                      "  sum( case when t.Status =@wFinishStatus then  ((t.EditTime - t.CreateTime) / 1000) " +
                      "  else ((now() - t.CreateTime) / 1000)  end  ) as AlarmDuration " +
                      "  FROM {0}.ipt_recorditem t  LEFT JOIN  {0}.dms_device_ledger t1 on t.MainID=t1.ID  WHERE t.ID>0 AND Status>0  " +
                      "  AND  t.MainID in ({1})   and   t.IPTType  in ({2})   "
                      + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d') or   t.EditTime <= str_to_date('2010-01-01', '%Y-%m-%d')    or @wStartTime <= t.EditTime) "
                      + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= t.CreateTime)  "
                      + "group by t.MainID,t.IPTType  ;"
                      , MESDBSource.DMS.getDBName(), StringUtils.Join(",", wDeviceIDList), StringUtils.Join(",", wTypeList));

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wFinishStatus", 2); 
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                IPTRecordItemStatistics wIPTRecordItemStatistics = null;
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wIPTRecordItemStatistics = new IPTRecordItemStatistics();
                    wIPTRecordItemStatistics.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wIPTRecordItemStatistics.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wIPTRecordItemStatistics.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wIPTRecordItemStatistics.IPTType = StringUtils.parseInt(wReader["IPTType"]);
                   // wIPTRecordItemStatistics.DeviceID = StringUtils.parseDate(wReader["AlarmTime"]);
                    wIPTRecordItemStatistics.AlarmDuration = StringUtils.parseDouble(wReader["AlarmDuration"]);
                    wIPTRecordItemStatistics.AlarmCount = StringUtils.parseInt(wReader["AlarmCount"]);
                    wResult.Add(wIPTRecordItemStatistics);

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
