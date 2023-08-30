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
    class DMSDeviceModelDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(BMSRoleDAO));

        private static DMSDeviceModelDAO Instance;

        private DMSDeviceModelDAO() : base()
        {

        }

        public static DMSDeviceModelDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSDeviceModelDAO();
            return Instance;
        }

        private List<DMSDeviceModel> DMS_SelectDeviceModelList(BMSEmployee wLoginUser, Int32 wID, String wName, String wCode,
                int wDeviceType, String wDeviceTypeName, String wDeviceTypeCode, int wOperatorID, int wActive, OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceModel> wResult = new List<DMSDeviceModel>();
            try
            {

                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;


                if (wCode == null)
                    wCode = "";
                if (wName == null)
                    wName = "";
                if (wDeviceTypeName == null)
                    wDeviceTypeName = "";
                if (wDeviceTypeCode == null)
                    wDeviceTypeCode = "";

                // \\\"\'\,(\w+)\,\'\\\"
                String wSQL = StringUtils.Format(
                        "SELECT t1.*, t2.Name as DeviceTypeName,t2.Code as DeviceTypeCode,t3.Name as OperatorName"
                                + " FROM {0}.dms_device_model t1 inner join {0}.dms_device_type t2 on t1.DeviceType=t2.ID "
                                + " left join {0}.mbs_user t3 on t1.OperatorID=t3.ID "
                                + " WHERE 1=1   and ( @wID <=0 or t1.ID = @wID )   "
                                + " and ( @wName ='' or t1.Name = @wName)    "
                                + " and ( @wCode ='' or t1.Code = @wCode)    "
                                + " and ( @wDeviceType <= 0 or t1.DeviceType  = @wDeviceType)  "
                                + " and ( @wDeviceTypeName ='' or t2.Name = @wDeviceTypeName)    "
                                + " and ( @wDeviceTypeCode ='' or t2.Code = @wDeviceTypeCode)    "
                                + " and ( @wActive < 0 or t1.Active  = @wActive)  ;",
                        wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wID", StringUtils.Join(",", wID));
                wParamMap.Add("wName", wName);
                wParamMap.Add("wCode", wCode);
                wParamMap.Add("wDeviceType", wDeviceType);
                wParamMap.Add("wDeviceTypeCode", wDeviceTypeCode);
                wParamMap.Add("wDeviceTypeName", wDeviceTypeName);
                wParamMap.Add("wActive", wActive);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {

                    DMSDeviceModel wDeviceModel = new DMSDeviceModel();

                    wDeviceModel.ID = StringUtils.parseInt(wReader["ID"]);
                    wDeviceModel.Code = StringUtils.parseString(wReader["Code"]);
                    wDeviceModel.Name = StringUtils.parseString(wReader["Name"]);
                    wDeviceModel.DeviceType = StringUtils.parseInt(wReader["DeviceType"]);
                    wDeviceModel.DeviceTypeName = StringUtils.parseString(wReader["DeviceTypeName"]);
                    wDeviceModel.DeviceTypeCode = StringUtils.parseString(wReader["DeviceTypeCode"]);
                    wDeviceModel.DeviceTypeCode = StringUtils.parseString(wReader["Remark"]);

                    wDeviceModel.OperatorID = StringUtils.parseInt(wReader["OperatorID"]);
                    wDeviceModel.OperateTime = StringUtils.parseDate(wReader["OperateTime"]);
                    wDeviceModel.OperatorName = StringUtils.parseString(wReader["OperatorName"]);
                    wDeviceModel.Remark = StringUtils.parseString(wReader["Remark"]);
                    wDeviceModel.Active = StringUtils.parseInt(wReader["Active"]);

                    wResult.Add(wDeviceModel);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
          
        public List<DMSDeviceModel> DMS_SelectDeviceModelList(BMSEmployee wLoginUser, String wName,
                int wDeviceType, String wDeviceTypeName, String wDeviceTypeCode, int wOperatorID, int wActive, OutResult<Int32> wErrorCode)
        {
            return this.DMS_SelectDeviceModelList(wLoginUser, -1, wName, "",
                 wDeviceType, wDeviceTypeName, wDeviceTypeCode, wOperatorID, wActive, wErrorCode);
        }
        public DMSDeviceModel DMS_CheckDeviceModel(BMSEmployee wLoginUser, DMSDeviceModel wDMSDeviceModel,
                OutResult<Int32> wErrorCode)
        {
            DMSDeviceModel wResult = new DMSDeviceModel();
            try
            {

                if (wDMSDeviceModel == null || StringUtils.isEmpty(wDMSDeviceModel.Name)
                        || wDMSDeviceModel.DeviceType <= 0)
                {
                    return wResult;
                }

                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                String wSQL = StringUtils.Format(
                        "SELECT t1.* FROM {0}.dms_device_model t1 WHERE t1.ID != @ID " +
                        " AND (( t1.DeviceType=@DeviceType and t1.Name=@Name ) or t1.Code =@Code)  ;",
                        wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("DeviceType", wDMSDeviceModel.DeviceType);
                wParamMap.Add("Name", wDMSDeviceModel.Name);
                wParamMap.Add("ID", wDMSDeviceModel.ID);
                wParamMap.Add("Code", wDMSDeviceModel.Code);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {

                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.Code = StringUtils.parseString(wReader["Code"]);
                    wResult.Name = StringUtils.parseString(wReader["Name"]);
                    wResult.DeviceType = StringUtils.parseInt(wReader["DeviceType"]);
                    wResult.DeviceTypeCode = StringUtils.parseString(wReader["Remark"]);

                    wResult.OperatorID = StringUtils.parseInt(wReader["OperatorID"]);
                    wResult.OperateTime = StringUtils.parseDate(wReader["OperateTime"]);
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



        public List<DMSDeviceModel> DMS_SelectDeviceModelList(BMSEmployee wLoginUser, String wName, String wCode, int wDeviceType,
            String wDeviceTypeName, String wDeviceTypeCode, int wOperatorID, int wActive,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceModel> wResult = new List<DMSDeviceModel>();
            try
            {
                wResult = this.DMS_SelectDeviceModelList(wLoginUser, 0, wName, wCode, wDeviceType, wDeviceTypeName, wDeviceTypeCode, wOperatorID, wActive, wErrorCode);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public DMSDeviceModel DMS_SelectDeviceModel(BMSEmployee wLoginUser, int wID, String wCode, OutResult<Int32> wErrorCode)
        {
            DMSDeviceModel wResult = new DMSDeviceModel();

            try
            {
                List<DMSDeviceModel> wDMSDeviceModelList = this.DMS_SelectDeviceModelList(wLoginUser,
                        wID, "", wCode, -1, "", "", -1, -1, wErrorCode);
                if (wDMSDeviceModelList.Count > 0)
                    wResult = wDMSDeviceModelList[0];
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public void DMS_UpdateDeviceModel(BMSEmployee wLoginUser, DMSDeviceModel wDeviceModel,
                OutResult<Int32> wErrorCode)
        {
            try
            {

                if (wDeviceModel == null || StringUtils.isEmpty(wDeviceModel.Name) || wDeviceModel.DeviceType <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                if (wDeviceModel.ID > 0 && StringUtils.isEmpty(wDeviceModel.Code))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                DMSDeviceModel wDMSDeviceModelDB = DMS_CheckDeviceModel(wLoginUser, wDeviceModel, wErrorCode);
                if (wDMSDeviceModelDB.ID > 0)
                {
                    wErrorCode.Result = MESException.Duplication.Value;
                    if (wDeviceModel.ID <= 0)
                    {
                        wDeviceModel.ID = wDMSDeviceModelDB.ID;
                    }
                    return;
                }

                //生成唯一编码
                if (StringUtils.isEmpty(wDeviceModel.Code))
                {  
                    int wMaxID = this.GetMaxPrimaryKey(StringUtils.Format("{0}.dms_device_model", wInstance), "ID");
                    wDeviceModel.Code = StringUtils.Format("DM-{0}", String.Format("{0:D6}", wMaxID + 1));
                }


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("Code", wDeviceModel.Code);
                wParamMap.Add("Name", wDeviceModel.Name);
                wParamMap.Add("DeviceType", wDeviceModel.DeviceType);
                wParamMap.Add("Remark", wDeviceModel.Remark);
                wParamMap.Add("OperatorID", wDeviceModel.OperatorID);
                wParamMap.Add("Active", wDeviceModel.Active);
                wParamMap.Add("OperateTime", DateTime.Now);


                if (wDeviceModel.ID <= 0)
                {
                    this.Insert(StringUtils.Format("{0}.dms_device_model", wInstance), wParamMap);
                }
                else
                {
                    wParamMap.Add("ID", wDeviceModel.ID);
                    this.Update(StringUtils.Format("{0}.dms_device_model", wInstance), "ID", wParamMap);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }



        public void DMS_DeleteDeviceModel(BMSEmployee wLoginUser, DMSDeviceModel wDeviceModel,
                OutResult<Int32> wErrorCode)
        {
            try
            {

                if (wDeviceModel == null || StringUtils.isEmpty(wDeviceModel.Name) || wDeviceModel.DeviceType <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("ID", wDeviceModel.ID);
                wParamMap.Add("Active", 0);

                this.Delete(StringUtils.Format("{0}.dms_device_model", wInstance), wParamMap);


            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }


        public void DMS_ActiveDeviceModel(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive,
                OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
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
                String wSql = StringUtils.Format("UPDATE {0}.dms_device_model SET Active ={1} WHERE ID IN({2}) ;",
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
