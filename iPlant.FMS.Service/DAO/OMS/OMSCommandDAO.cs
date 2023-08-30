using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class OMSCommandDAO : BaseDAO
    {

        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(OMSCommandDAO));
        private static OMSCommandDAO Instance = null;

        private OMSCommandDAO() : base()
        {

        }

        public static OMSCommandDAO getInstance()
        {
            if (Instance == null)
                Instance = new OMSCommandDAO();
            return Instance;
        }
        // 工厂&事业部&车间&产线&工位
        // 工厂
        private OMSCommand OMS_CheckCommand(BMSEmployee wLoginUser, OMSCommand wCommand,
                OutResult<Int32> wErrorCode)
        {
            OMSCommand wCommandDB = new OMSCommand();
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = StringUtils.Format("Select ID from {0}.oms_command ", wInstance)
                                + " where ID!=@ID and (WBSNo=@WBSNo or PartNo = @PartNo )";
                    wParms.Clear();
                    wParms.Add("ID", wCommand.ID);
                    wParms.Add("PartNo", wCommand.PartNo);
                    wParms.Add("WBSNo", wCommand.WBSNo);

                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wCommandDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);

                    }

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("OMS_CheckCommandByCode", ex);

            }
            return wCommandDB;
        }
        public void OMS_UpdateCommand(BMSEmployee wLoginUser, OMSCommand wOMSCommand, OutResult<Int32> wErrorCode)
        {
            try
            {


                if (wOMSCommand == null || StringUtils.isEmpty(wOMSCommand.PartNo) || StringUtils.isEmpty(wOMSCommand.WBSNo))
                {
                    wErrorCode.Result = MESException.Parameter.getValue();
                    return;
                }

                OMSCommand wOMSCommandDB = this.OMS_CheckCommand(wLoginUser, wOMSCommand, wErrorCode);
                if (wOMSCommandDB != null && wOMSCommandDB.ID > 0)
                {
                    wErrorCode.Result = MESException.Duplication.getValue();
                    return;
                }

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (wErrorCode.Result != 0)
                {
                    return;
                }


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();


                wParamMap.Add("WBSNo", wOMSCommand.WBSNo);
                wParamMap.Add("PartNo", wOMSCommand.PartNo);
                wParamMap.Add("ProductID", wOMSCommand.ProductID);
                wParamMap.Add("CustomerID", wOMSCommand.CustomerID);
                wParamMap.Add("ContactCode", wOMSCommand.ContactCode);
                wParamMap.Add("LinkManID", wOMSCommand.LinkManID);
                wParamMap.Add("EditorID", wLoginUser.ID);
                wParamMap.Add("EditTime", DateTime.Now);
                wParamMap.Add("FactoryID", wOMSCommand.FactoryID);
                wParamMap.Add("BusinessUnitID", wOMSCommand.BusinessUnitID);
                wParamMap.Add("WorkShopID", wOMSCommand.WorkShopID);

                if (wOMSCommand.ID <= 0)
                {

                    wParamMap.Add("CreatorID", wLoginUser.ID);
                    wParamMap.Add("CreateTime", DateTime.Now);
                    wOMSCommand.ID = (int)this.Insert(StringUtils.Format(
                            "{0}.oms_command", wInstance), wParamMap);
                }
                else
                {
                    wParamMap.Add("ID", wOMSCommand.ID);

                    this.Update(StringUtils.Format(
                          "{0}.oms_command", wInstance), "ID", wParamMap);
                }

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
        }

        public ServiceResult<Int32> OMS_DeleteCommandList(BMSEmployee wLoginUser, List<OMSCommand> wList,
                OutResult<Int32> wErrorCode)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (wErrorCode.Result != 0)
                {
                    return wResult;
                }

                if (wList == null || wList.Count <= 0)
                {
                    return wResult;
                }
                List<Int32> wIDList = new List<Int32>();
                foreach (OMSCommand wItem in wList)
                {
                    if (wItem == null || wItem.ID <= 0 || wItem.OrderCount > 0)
                        continue;
                    wIDList.Add(wItem.ID);
                }
                if (wIDList.Count <= 0)
                    return wResult;
                String wSql = StringUtils.Format("delete from {1}.oms_command WHERE ID IN({0}) ;",
                        StringUtils.Join(",", wIDList), wInstance);
                ExecuteSqlTransaction(wSql);
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public OMSCommand OMS_SelectCommandByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            OMSCommand wResult = new OMSCommand();
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (wErrorCode.Result != 0)
                {
                    return wResult;
                }
                DateTime wBaseTime = new DateTime(2000, 1, 1);
                List<OMSCommand> wList = OMS_SelectCommandList(wLoginUser, wID, "", "", -1, -1, -1, -1, -1, wBaseTime, wBaseTime, wErrorCode);
                if (wList == null || wList.Count != 1)
                    return wResult;
                wResult = wList[0];
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public OMSCommand OMS_SelectCommandByCode(BMSEmployee wLoginUser, String wWBSNo, OutResult<Int32> wErrorCode)
        {
            OMSCommand wResult = new OMSCommand();
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (wErrorCode.Result != 0)
                {
                    return wResult;
                }
                DateTime wBaseTime = new DateTime(2000, 1, 1);

                List<OMSCommand> wList = OMS_SelectCommandList(wLoginUser, -1, "", wWBSNo, -1, -1, -1, -1, -1, wBaseTime, wBaseTime, wErrorCode);
                if (wList == null || wList.Count != 1)
                    return wResult;
                wResult = wList[0];
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public OMSCommand OMS_SelectCommandByPartNo(BMSEmployee wLoginUser, String PartNo, OutResult<Int32> wErrorCode)
        {
            OMSCommand wResult = new OMSCommand();
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (wErrorCode.Result != 0)
                {
                    return wResult;
                }
                DateTime wBaseTime = new DateTime(2000, 1, 1);

                List<OMSCommand> wList = OMS_SelectCommandList(wLoginUser, -1, PartNo, "", -1, -1, -1, -1, -1, wBaseTime, wBaseTime, wErrorCode);
                if (wList == null || wList.Count != 1)
                    return wResult;
                wResult = wList[0];
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        private List<OMSCommand> OMS_SelectCommandList(BMSEmployee wLoginUser, int wID, String wPartNo, String wWBSNo, int wFactoryID,
                int wBusinessUnitID, int wWorkShopID, int wCustomerID, int wProductID, DateTime wStartTime, DateTime wEndTime,
                OutResult<Int32> wErrorCode)
        {
            List<OMSCommand> wResultList = new List<OMSCommand>();
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (wErrorCode.Result != 0)
                {
                    return wResultList;
                }

                DateTime wBaseTime = new DateTime(2000, 1, 1);

                if ( wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if ( wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return wResultList;
                }

                String wSQL = StringUtils.Format(
                        "SELECT t.*,Count(t1.ID) as OrderCount,t2.ProductNo,t3.CustomerName ,"
                                + " t3.CustomerCode ,t4.Name as  Factory,t5.Name as WorkShopName,"
                                + " t6.Name as Creator,t7.Name as Editor FROM {0}.oms_command t"
                                + " Left join {0}.oms_order t1 on t1.CommandID=t.ID "
                                + " Left join {0}.fpc_product t2 on t.ProductID=t2.ID "
                                + " Left join {0}.crm_customer t3 on t.CustomerID=t3.ID "
                                + " Left join {0}.fmc_factory t4 on t.FactoryID=t4.ID "
                                + " Left join {0}.fmc_workshop t5 on t.WorkShopID=t5.ID "
                                + " Left join {0}.mbs_user t6 on t.CreatorID=t6.ID "
                                + " Left join {0}.mbs_user t7 on t.EditorID=t7.ID WHERE  1=1  "
                                + " and ( @wID <= 0 or @wID = t.ID )  and ( @wWBSNo = '' or @wWBSNo = t.WBSNo ) "
                                + " and ( @wPartNo = '' or @wPartNo = t.PartNo )"
                                + " and ( @wFactoryID <= 0 or @wFactoryID = t.FactoryID )   "
                                + " and ( @wProductID <= 0 or @wProductID = t.ProductID )   "
                                + " and ( @wWorkShopID <= 0 or @wWorkShopID = t.WorkShopID ) "
                                + " and ( @wCustomerID <= 0 or @wCustomerID = t.CustomerID ) "
                                + " and ( @wBusinessUnitID <= 0 or @wBusinessUnitID = t.BusinessUnitID ) "
                                + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d') or @wStartTime <= t.EditTime) "
                                + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d') or @wEndTime >= t.CreateTime) group by t.ID;",
                        wInstance);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wID);
                wParamMap.Add("wWBSNo", wWBSNo);
                wParamMap.Add("wPartNo", wPartNo);
                wParamMap.Add("wFactoryID", wFactoryID);
                wParamMap.Add("wProductID", wProductID);
                wParamMap.Add("wCustomerID", wCustomerID);
                wParamMap.Add("wWorkShopID", wWorkShopID);
                wParamMap.Add("wBusinessUnitID", wBusinessUnitID);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                wSQL = DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = this.mDBPool.queryForList(wSQL, wParamMap);

                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    OMSCommand wItem = new OMSCommand();

                    wItem.ID = StringUtils.parseInt(wReader["ID"]);
                    wItem.CustomerID = StringUtils.parseInt(wReader["CustomerID"]);
                    wItem.CustomerName = StringUtils.parseString(wReader["CustomerName"]);
                    wItem.CustomerCode = StringUtils.parseString(wReader["CustomerCode"]);
                    wItem.ContactCode = StringUtils.parseString(wReader["ContactCode"]);
                    wItem.PartNo = StringUtils.parseString(wReader["PartNo"]);
                    wItem.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wItem.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wItem.LinkManID = StringUtils.parseInt(wReader["LinkManID"]);
                    wItem.WorkShopID = StringUtils.parseInt(wReader["WorkShopID"]);
                    wItem.WorkShopName = StringUtils.parseString(wReader["WorkShopName"]);
                    wItem.EditorID = StringUtils.parseInt(wReader["EditorID"]);
                    wItem.Editor = StringUtils.parseString(wReader["Editor"]);
                    wItem.EditTime = StringUtils.parseDate(wReader["EditTime"]);
                    wItem.CreatorID = StringUtils.parseInt(wReader["CreatorID"]);
                    wItem.Creator = StringUtils.parseString(wReader["Creator"]);
                    wItem.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wItem.FactoryID = StringUtils.parseInt(wReader["FactoryID"]);
                    wItem.Factory = StringUtils.parseString(wReader["Factory"]);
                    wItem.BusinessUnitID = StringUtils.parseInt(wReader["BusinessUnitID"]);
                    wItem.OrderCount = StringUtils.parseInt(wReader["OrderCount"]);
                    wItem.WBSNo = StringUtils.parseString(wReader["WBSNo"]);
                    wResultList.Add(wItem);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResultList;
        }

        public List<OMSCommand> OMS_SelectCommandList(BMSEmployee wLoginUser, int wFactoryID,
                int wBusinessUnitID, int wWorkShopID, int wCustomerID, int wProductID, DateTime wStartTime, DateTime wEndTime,
                OutResult<Int32> wErrorCode)
        {
            return OMS_SelectCommandList(wLoginUser, -1, "", "", wFactoryID,
                 wBusinessUnitID, wWorkShopID, wCustomerID, wProductID, wStartTime, wEndTime,
               wErrorCode);
        }

    }
}
