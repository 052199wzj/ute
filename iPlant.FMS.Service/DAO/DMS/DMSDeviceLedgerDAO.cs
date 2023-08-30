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
    class DMSDeviceLedgerDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSDeviceLedgerDAO));

        private static DMSDeviceLedgerDAO Instance;

        private DMSDeviceLedgerDAO() : base()
        {

        }

        public static DMSDeviceLedgerDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSDeviceLedgerDAO();
            return Instance;
        }

        private List<DMSDeviceLedger> DMS_SelectDeviceLedgerList(BMSEmployee wLoginUser, List<Int32> wID, String wCode, String wName,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, String wWorkPartPointCode, String wDeviceGroupCode, int wAreaID, int wTeamID,
               int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceLedger> wResult = new List<DMSDeviceLedger>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();


                if (wID == null)
                    wID = new List<Int32>();
                wID.RemoveAll(p => p <= 0);
                if (wCode == null)
                    wCode = "";

                String wSQL = StringUtils.Format(
                        "SELECT t.*,t1.Code as  ModelNo,t1.Name as ModelName,t1.DeviceType, t2.Name as DeviceTypeName," +
                        "  t2.Code as DeviceTypeCode,t3.Name as WorkShopName,t3.Code as WorkShopCode,t7.Code as AreaNo," +
                        " t7.Name as PositionText, t8.Name as TeamName, t8.Code as TeamNo,t9.Name as FactoryName,t9.Code as FactoryCode,    " +
                        " t4.Name as LineName,t4.Code as LineCode,t5.Name as CreatorName,t6.Name as EditorName,pp.Name as WorkPartPointName," +
                        " group_concat(t11.StationID) as StationIDList  FROM {0}.dms_device_ledger t"
                        + " inner join {0}.dms_device_model t1 on t.ModelID=t1.ID "
                        + " left join {0}.dms_device_type t2 on t1.DeviceType=t2.ID "
                        + " left join {0}.fpc_partpoint pp on t.WorkPartPointCode=pp.Code "
                        + " left join {0}.mbs_user t5 on t.CreatorID=t5.ID "
                        + " left join {0}.mbs_user t6 on t.EditorID=t6.ID "
                        + " left join {0}.bms_region t7 on t.AreaID=t7.ID "
                        + " left join {0}.bms_teammanage t8 on t.TeamID=t8.ID "
                        + " left join {0}.fmc_workshop t3 on t.WorkShopID=t3.ID "
                        + " left join {0}.fmc_factory t9 on t.FactoryID=t9.ID "
                        + " left join {0}.fmc_resource t11 on t11.ResourceID=t.ID and t11.Type=@wResourceType  AND t11.Active=1"
                        + " left join {0}.fmc_line t4 on t.LineID=t4.ID  WHERE  1=1  "
                        + " and ( @wID ='' or t.ID IN( {1} ) )  "
                        + " and ( @wCode ='' or t.Code  = @wCode)  "
                        + " and ( @wName ='' or t.Name like @wName )  "
                        + " and ( @wAssetNo ='' or t.AssetNo   = @wAssetNo )  "
                        + " and ( @wDeviceType <= 0 or t1.DeviceType  = @wDeviceType)   "
                        + " and ( @wModelID <= 0 or t.ModelID  = @wModelID)   "
                        + " and ( @wActive < 0 or t.Active  = @wActive)   "
                        + " and ( @wAreaID <= 0 or t.AreaID  = @wAreaID)  "
                        + " and ( @wTeamID <= 0 or t.TeamID  = @wTeamID)   "
                        + " and ( @wFactoryID <= 0 or t.FactoryID  = @wFactoryID)  "
                        + " and ( @wWorkShopID <= 0 or t.WorkShopID  = @wWorkShopID)  "
                        + " and ( @wLineID <= 0 or t.LineID  = @wLineID)"
                        + " and ( @wWorkPartPointCode ='' or t.WorkPartPointCode  = @wWorkPartPointCode)"
                        + " and ( @wDeviceGroupCode ='' or FIND_IN_SET(@wDeviceGroupCode,t.DeviceGroupCode)>0 )    group by t.ID  "
                        , wInstance, wID.Count > 0 ? StringUtils.Join(",", wID) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wID", StringUtils.Join(",", wID));
                wParamMap.Add("wName", StringUtils.isEmpty(wName) ? wName : "%" + wName + "%");
                wParamMap.Add("wCode", wCode);
                wParamMap.Add("wAssetNo", wAssetNo);
                wParamMap.Add("wDeviceType", wDeviceType);
                wParamMap.Add("wModelID", wModelID);
                wParamMap.Add("wActive", wActive);
                wParamMap.Add("wFactoryID", wFactoryID);
                wParamMap.Add("wWorkShopID", wWorkShopID);
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wWorkPartPointCode", wWorkPartPointCode);
                wParamMap.Add("wDeviceGroupCode", wDeviceGroupCode);
                wParamMap.Add("wAreaID", wAreaID);
                wParamMap.Add("wTeamID", wTeamID);
                wParamMap.Add("wResourceType", (int)FMCResourceType.Device);


                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                List<BMSEmployee> wBMSEmployeeList = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeAll(wLoginUser, -1, wErrorCode);
                Dictionary<int, String> wBMSEmployeeNameDic = wBMSEmployeeList.ToDictionary(p => p.ID, p => p.Name);
                Dictionary<int, String> wBMSEmployeeLoginIDDic = wBMSEmployeeList.ToDictionary(p => p.ID, p => p.LoginID);


                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSDeviceLedger wDeviceLedger = new DMSDeviceLedger();

                    wDeviceLedger.ID = StringUtils.parseInt(wReader["ID"]);
                    wDeviceLedger.Code = StringUtils.parseString(wReader["Code"]);
                    wDeviceLedger.Name = StringUtils.parseString(wReader["Name"]);
                    wDeviceLedger.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wDeviceLedger.ModelID = StringUtils.parseInt(wReader["ModelID"]);
                    wDeviceLedger.ModelName = StringUtils.parseString(wReader["ModelName"]);
                    wDeviceLedger.ModelNo = StringUtils.parseString(wReader["ModelNo"]);
                    wDeviceLedger.DeviceType = StringUtils.parseInt(wReader["DeviceType"]);
                    wDeviceLedger.DeviceTypeName = StringUtils.parseString(wReader["DeviceTypeName"]);
                    wDeviceLedger.DeviceTypeCode = StringUtils.parseString(wReader["DeviceTypeCode"]);
                    wDeviceLedger.ManufactorName = StringUtils.parseString(wReader["ManufactorName"]);
                    wDeviceLedger.ManufactorCode = StringUtils.parseString(wReader["ManufactorCode"]);
                    wDeviceLedger.ManufactorContactInfo = StringUtils.parseString(wReader["ManufactorContactInfo"]);
                    wDeviceLedger.SupplierName = StringUtils.parseString(wReader["SupplierName"]);
                    wDeviceLedger.SupplierCode = StringUtils.parseString(wReader["SupplierCode"]);
                    wDeviceLedger.SupplierContactInfo = StringUtils.parseString(wReader["SupplierContactInfo"]);
                    wDeviceLedger.AcceptanceDate = StringUtils.parseDate(wReader["AcceptanceDate"]);
                    wDeviceLedger.WarrantyPeriod = StringUtils.parseInt(wReader["WarrantyPeriod"]);
                    wDeviceLedger.WorkShopID = StringUtils.parseInt(wReader["WorkShopID"]);
                    wDeviceLedger.WorkShopName = StringUtils.parseString(wReader["WorkShopName"]);
                    wDeviceLedger.WorkShopCode = StringUtils.parseString(wReader["WorkShopCode"]);
                    wDeviceLedger.FactoryID = StringUtils.parseInt(wReader["FactoryID"]);
                    wDeviceLedger.FactoryName = StringUtils.parseString(wReader["FactoryName"]);
                    wDeviceLedger.FactoryCode = StringUtils.parseString(wReader["FactoryCode"]);
                    wDeviceLedger.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wDeviceLedger.LineName = StringUtils.parseString(wReader["LineName"]);
                    wDeviceLedger.LineCode = StringUtils.parseString(wReader["LineCode"]);
                    wDeviceLedger.AreaID = StringUtils.parseInt(wReader["AreaID"]);
                    wDeviceLedger.AreaNo = StringUtils.parseString(wReader["AreaNo"]);
                    wDeviceLedger.PositionText = StringUtils.parseString(wReader["PositionText"]);
                    wDeviceLedger.TeamID = StringUtils.parseInt(wReader["TeamID"]);
                    wDeviceLedger.TeamNo = StringUtils.parseString(wReader["TeamNo"]);
                    wDeviceLedger.TeamName = StringUtils.parseString(wReader["TeamName"]);
                    wDeviceLedger.Remark = StringUtils.parseString(wReader["Remark"]);
                    wDeviceLedger.DeviceIP = StringUtils.parseString(wReader["DeviceIP"]);


                    wDeviceLedger.WorkPartPointCode = StringUtils.parseString(wReader["WorkPartPointCode"]);
                    wDeviceLedger.WorkPartPointName = StringUtils.parseString(wReader["WorkPartPointName"]);
                    wDeviceLedger.DeviceGroupCode = StringUtils.parseString(wReader["DeviceGroupCode"]);


                    wDeviceLedger.StatusEnable = StringUtils.parseInt(wReader["StatusEnable"]);
                    wDeviceLedger.AlarmEnable = StringUtils.parseInt(wReader["AlarmEnable"]);
                    wDeviceLedger.ParmaterEnable = StringUtils.parseInt(wReader["ParmaterEnable"]);
                    wDeviceLedger.WorkParmaterEnable = StringUtils.parseInt(wReader["WorkParmaterEnable"]);

                    wDeviceLedger.ToolEnable = StringUtils.parseInt(wReader["ToolEnable"]);
                    wDeviceLedger.NCEnable = StringUtils.parseInt(wReader["NCEnable"]);
                    wDeviceLedger.FixturesEnable = StringUtils.parseInt(wReader["FixturesEnable"]);
                    wDeviceLedger.PartInterval = StringUtils.parseInt(wReader["PartInterval"]);

                    wDeviceLedger.CreatorID = StringUtils.parseInt(wReader["CreatorID"]);
                    wDeviceLedger.CreatorName = StringUtils.parseString(wReader["CreatorName"]);
                    wDeviceLedger.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wDeviceLedger.EditorID = StringUtils.parseInt(wReader["EditorID"]);
                    wDeviceLedger.EditorName = StringUtils.parseString(wReader["EditorName"]);
                    wDeviceLedger.EditTime = StringUtils.parseDate(wReader["EditTime"]);
                    wDeviceLedger.ImageIcon = StringUtils.parseString(wReader["ImageIcon"]);
                    wDeviceLedger.Active = StringUtils.parseInt(wReader["Active"]);
                    wDeviceLedger.StationIDList = StringUtils.parseIntList(wReader["StationIDList"], ",");
                    wDeviceLedger.MaintainerIDList = StringUtils.parseIntList(wReader["MaintainerIDList"], ",");
                    wDeviceLedger.MaintainerName = StringUtils.parseName(wDeviceLedger.MaintainerIDList, wBMSEmployeeNameDic);
                    wDeviceLedger.MaintainerCode = StringUtils.parseName(wDeviceLedger.MaintainerIDList, wBMSEmployeeLoginIDDic);
                    wDeviceLedger.MaintainDate = StringUtils.parseDate(wReader["MaintainDate"]);
                    wDeviceLedger.NextMaintainDate = StringUtils.parseDate(wReader["NextMaintainDate"]);
                    wResult.Add(wDeviceLedger);
                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSDeviceLedger> DMS_SelectDeviceLedgerList(BMSEmployee wLoginUser, String wName,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, String wWorkPartPointCode, String wDeviceGroupCode, int wAreaID, int wTeamID,
               int wActive, Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceLedger> wResult = new List<DMSDeviceLedger>();
            try
            {
                wResult = DMS_SelectDeviceLedgerList(wLoginUser, null, "", wName, wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wWorkPartPointCode, wDeviceGroupCode, wAreaID, wTeamID, wActive, wPagination,
                        wErrorCode);
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSDeviceLedger> DMS_SelectDeviceLedgerList(BMSEmployee wLoginUser, int wLineID,
             int wActive, Pagination wPagination,
              OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceLedger> wResult = new List<DMSDeviceLedger>();
            try
            {
                wResult = DMS_SelectDeviceLedgerList(wLoginUser, null, "", "", "", -1, -1, -1, -1, wLineID, "", "", -1, -1, wActive, wPagination,
                        wErrorCode);
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public DMSDeviceLedger DMS_SelectDeviceLedger(BMSEmployee wLoginUser, int wID, String wCode, String wAssetNo,
                OutResult<Int32> wErrorCode)
        {
            DMSDeviceLedger wResult = new DMSDeviceLedger();
            try
            {
                List<DMSDeviceLedger> wDMSDeviceLedgerList = null;
                if (wID > 0)
                {
                    List<Int32> wIDList = new List<Int32>();
                    wIDList.Add(wID);
                    wDMSDeviceLedgerList = this.DMS_SelectDeviceLedgerList(wLoginUser, wIDList, "", "",
                     "", -1, -1, -1, -1, -1, "", "", -1, -1, -1, Pagination.Default, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wCode))
                {
                    wDMSDeviceLedgerList = this.DMS_SelectDeviceLedgerList(wLoginUser, null, wCode, "",
                 "", -1, -1, -1, -1, -1, "", "", -1, -1, -1, Pagination.Default, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wAssetNo))
                {
                    wDMSDeviceLedgerList = this.DMS_SelectDeviceLedgerList(wLoginUser, null, "", "", wAssetNo,
                -1, -1, -1, -1, -1, "", "", -1, -1, -1, Pagination.Default, wErrorCode);
                }
                else
                {
                    return wResult;
                }

                if (wDMSDeviceLedgerList == null || wDMSDeviceLedgerList.Count <= 0)
                    return wResult;

                wResult = wDMSDeviceLedgerList[0];
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSDeviceLedger> DMS_SelectDeviceLedgerList(BMSEmployee wLoginUser, List<Int32> wIDList,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceLedger> wResult = new List<DMSDeviceLedger>();
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
                        wResult.AddRange(this.DMS_SelectDeviceLedgerList(wLoginUser, wSelectList, "", "", "", -1, -1, -1, -1, -1, "", "", -1, -1, -1, Pagination.Create(1, 100),
                                  wErrorCode));

                        wSelectList.Clear();
                    }
                    if (i == wIDList.Count - 1)
                    {
                        if (wSelectList.Count > 0)
                            wResult.AddRange(this.DMS_SelectDeviceLedgerList(wLoginUser, wSelectList, "", "", "", -1, -1, -1, -1, -1, "", "", -1, -1, -1, Pagination.Create(1, 100),
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


        public DMSDeviceLedger DMS_CheckDeviceLedger(BMSEmployee wLoginUser, DMSDeviceLedger wDMSDeviceLedger,
             OutResult<Int32> wErrorCode)
        {
            DMSDeviceLedger wResult = new DMSDeviceLedger();
            wErrorCode.set(0);
            try
            {

                if (wDMSDeviceLedger == null || StringUtils.isEmpty(wDMSDeviceLedger.Code)
                        || wDMSDeviceLedger.ModelID <= 0)
                {
                    return wResult;
                }


                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                String wSQL = StringUtils.Format(
                        "SELECT t1.* FROM {0}.dms_device_ledger t1 WHERE t1.ID != @ID and  t1.Code =@Code  ;",
                        wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
             
                wParamMap.Add("ID", wDMSDeviceLedger.ID);
                wParamMap.Add("Code", wDMSDeviceLedger.Code); 

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {

                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.Code = StringUtils.parseString(wReader["Code"]);
                    wResult.Name = StringUtils.parseString(wReader["Name"]);
                    wResult.ModelID = StringUtils.parseInt(wReader["ModelID"]);
                    wResult.Remark = StringUtils.parseString(wReader["Remark"]);

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



        public void DMS_UpdateDeviceLedgerSet(BMSEmployee wLoginUser, DMSDeviceLedger wDeviceLedger,
           OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {
                if (wDeviceLedger == null || wDeviceLedger.ID <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("StatusEnable", wDeviceLedger.StatusEnable);
                wParamMap.Add("AlarmEnable", wDeviceLedger.AlarmEnable);
                wParamMap.Add("ParmaterEnable", wDeviceLedger.ParmaterEnable);
                wParamMap.Add("WorkParmaterEnable", wDeviceLedger.WorkParmaterEnable);
                wParamMap.Add("ToolEnable", wDeviceLedger.ToolEnable);
                wParamMap.Add("NCEnable", wDeviceLedger.NCEnable);
                wParamMap.Add("FixturesEnable", wDeviceLedger.FixturesEnable);

                wParamMap.Add("ID", wDeviceLedger.ID);
                this.Update(StringUtils.Format("{0}.dms_device_ledger", wInstance), "ID", wParamMap);


            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }



        public void DMS_UpdateDeviceLedger(BMSEmployee wLoginUser, DMSDeviceLedger wDeviceLedger,
                OutResult<Int32> wErrorCode)
        {

            try
            {
                if (wDeviceLedger == null || StringUtils.isEmpty(wDeviceLedger.Name) || wDeviceLedger.ModelID <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                if (wDeviceLedger.ID > 0 && StringUtils.isEmpty(wDeviceLedger.Code))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();

                DMSDeviceLedger wDMSDeviceLedgerDB = this.DMS_CheckDeviceLedger(wLoginUser, wDeviceLedger, wErrorCode);
                if (wDMSDeviceLedgerDB.ID > 0)
                {
                    wErrorCode.Result = MESException.Duplication.Value;
                    if (wDeviceLedger.ID <= 0)
                    {
                        wDeviceLedger.ID = wDMSDeviceLedgerDB.ID;
                    }
                    return;
                }
                //生成唯一编码
                if (StringUtils.isEmpty(wDeviceLedger.Code))
                {
                    int wMaxID = this.GetMaxPrimaryKey(StringUtils.Format("{0}.dms_device_ledger", wInstance), "ID");
                    wDeviceLedger.Code = StringUtils.Format("DE-{0}", String.Format("{0:D6}", wMaxID + 1));
                }


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("Code", wDeviceLedger.Code);
                wParamMap.Add("Name", wDeviceLedger.Name);
                wParamMap.Add("AssetNo", wDeviceLedger.AssetNo);
                wParamMap.Add("ModelID", wDeviceLedger.ModelID);
                wParamMap.Add("ManufactorName", wDeviceLedger.ManufactorName);
                wParamMap.Add("ManufactorCode", wDeviceLedger.ManufactorCode);
                wParamMap.Add("ManufactorContactInfo", wDeviceLedger.ManufactorContactInfo);
                wParamMap.Add("SupplierName", wDeviceLedger.SupplierName);
                wParamMap.Add("SupplierCode", wDeviceLedger.SupplierCode);
                wParamMap.Add("SupplierContactInfo", wDeviceLedger.SupplierContactInfo);
                wParamMap.Add("AcceptanceDate", wDeviceLedger.AcceptanceDate);
                wParamMap.Add("WorkShopID", wDeviceLedger.WorkShopID);
                wParamMap.Add("LineID", wDeviceLedger.LineID);
                wParamMap.Add("WarrantyPeriod", wDeviceLedger.WarrantyPeriod);
                wParamMap.Add("PartInterval", wDeviceLedger.PartInterval);
                wParamMap.Add("AreaID", wDeviceLedger.AreaID);
                wParamMap.Add("TeamID", wDeviceLedger.TeamID);
                wParamMap.Add("Remark", wDeviceLedger.Remark);
                wParamMap.Add("DeviceIP", wDeviceLedger.DeviceIP);
                wParamMap.Add("MaintainerIDList", StringUtils.Join(",", wDeviceLedger.MaintainerIDList));
                wParamMap.Add("MaintainDate", wDeviceLedger.MaintainDate);
                wParamMap.Add("NextMaintainDate", wDeviceLedger.NextMaintainDate);
                wParamMap.Add("EditorID", wLoginUser.ID);
                wParamMap.Add("EditTime", DateTime.Now);
                wParamMap.Add("Active", wDeviceLedger.Active);
                wParamMap.Add("FactoryID", wDeviceLedger.FactoryID);
                wParamMap.Add("ImageIcon", wDeviceLedger.ImageIcon);
                wParamMap.Add("WorkPartPointCode", wDeviceLedger.WorkPartPointCode);
                wParamMap.Add("DeviceGroupCode", wDeviceLedger.DeviceGroupCode);

                if (wDeviceLedger.ID <= 0)
                {
                    wParamMap.Add("CreatorID", wLoginUser.ID);
                    wParamMap.Add("CreateTime", DateTime.Now);
                    wDeviceLedger.ID = this.Insert(StringUtils.Format("{0}.dms_device_ledger", wInstance), wParamMap);

                }
                else
                {
                    wParamMap.Add("ID", wDeviceLedger.ID);
                    this.Update(StringUtils.Format("{0}.dms_device_ledger", wInstance), "ID", wParamMap);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }



        public void DMS_DeleteDeviceLedger(BMSEmployee wLoginUser, DMSDeviceLedger wDeviceLedger,
                OutResult<Int32> wErrorCode)
        {
            try
            {

                if (wDeviceLedger == null || StringUtils.isEmpty(wDeviceLedger.Name) || wDeviceLedger.DeviceType <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("ID", wDeviceLedger.ID);
                wParamMap.Add("Active", 0);

                this.Delete(StringUtils.Format("{0}.dms_device_ledger", wInstance), wParamMap);


            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }


        public void DMS_ActiveDeviceLedger(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive,
                OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
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
                String wSql = StringUtils.Format("UPDATE {0}.dms_device_ledger SET Active ={1} WHERE ID IN({2}) ;",
                        wInstance, wActive, StringUtils.Join(",", wIDList));


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
