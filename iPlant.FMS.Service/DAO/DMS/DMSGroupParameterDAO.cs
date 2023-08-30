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
    class DMSGroupParameterDAO : BaseDAO
    { 
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSGroupParameterDAO));

        private static DMSGroupParameterDAO Instance;

        private DMSGroupParameterDAO() : base()
        {

        }

        public static DMSGroupParameterDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSGroupParameterDAO();
            return Instance;
        }

        private List<DMSGroupParameter> DMS_SelectGroupParameterList(BMSEmployee wLoginUser, List<Int32> wID,
               String wCode, String wName, String wVariableName, String wDeviceGroupCode, String wProtocol,
               String wOPCClass, int wDataType, int wDataClass, int wPositionID,
               int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<DMSGroupParameter> wResult = new List<DMSGroupParameter>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                if (wID == null)
                    wID = new List<Int32>();
                wID.RemoveAll(p => p <= 0);
                if (wCode == null)
                    wCode = "";

                String wSQL = StringUtils.Format(
                        "SELECT t.*,t2.ServerName,  t5.Name as CreatorName," +
                        " t6.Name as EditorName,t7.Name as PositionName FROM {0}.dms_group_parameter t"
                              
                                + " left join {0}.dms_device_server t2 on t.ServerId=t2.ID "
                                + " left join {0}.dms_position t7 on t.PositionID=t7.ID "
                                + " left join {0}.mbs_user t5 on t.CreatorID=t5.ID "
                                + " left join {0}.mbs_user t6 on t.EditorID=t6.ID    WHERE  1=1  "
                                + " and ( @wID ='' or t.ID IN( {1} ) )  "
                        + " and ( @wCode ='' or t.Code  = @wCode)  "
                        + " and ( @wName ='' or t.Name   = @wName )  "
                        + " and ( @wDeviceGroupCode ='' or t.DeviceGroupCode  = @wDeviceGroupCode) "
                        + " and ( @wPositionID <= 0 or t.PositionID  = @wPositionID) " 
                        + " and ( @wDataClass <= 0 or t.DataClass  = @wDataClass)   "
                        + " and ( @wDataType <= 0 or t.DataType  = @wDataType)   " 
                        + " and ( @wVariableName ='' or t.VariableName like @wVariableName )  "
                        + " and ( @wProtocol ='' or t.Protocol  like @wProtocol )  "
                        + " and ( @wOPCClass ='' or t.OPCClass  like @wOPCClass )  "
                        + " and ( @wActive < 0 or t.Active  = @wActive)   "
                        , wInstance, wID.Count > 0 ? StringUtils.Join(",", wID) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wID", StringUtils.Join(",", wID));
                wParamMap.Add("wName", wName);
                wParamMap.Add("wCode", wCode); 
                wParamMap.Add("wPositionID", wPositionID); 
                wParamMap.Add("wDeviceGroupCode", wDeviceGroupCode);
                wParamMap.Add("wVariableName", StringUtils.isNotEmpty(wVariableName) ? ("%" + wVariableName + "%") : "");
                wParamMap.Add("wProtocol", StringUtils.isNotEmpty(wProtocol) ? ("%" + wProtocol + "%") : "");
                wParamMap.Add("wOPCClass", StringUtils.isNotEmpty(wOPCClass) ? ("%" + wOPCClass + "%") : "");
                wParamMap.Add("wDataType", wDataType);
                wParamMap.Add("wDataClass", wDataClass);
                wParamMap.Add("wActive", wActive);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);



                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSGroupParameter wGroupParameter = new DMSGroupParameter();

                    wGroupParameter.ID = StringUtils.parseInt(wReader["ID"]);
                    wGroupParameter.Code = StringUtils.parseString(wReader["Code"]);
                    wGroupParameter.DeviceGroupCode = StringUtils.parseString(wReader["DeviceGroupCode"]);
                    wGroupParameter.Name = StringUtils.parseString(wReader["Name"]);
                    wGroupParameter.VariableName = StringUtils.parseString(wReader["VariableName"]); 
                    wGroupParameter.ServerId = StringUtils.parseInt(wReader["ServerId"]);
                    wGroupParameter.ServerName = StringUtils.parseString(wReader["ServerName"]);
                    wGroupParameter.PositionID = StringUtils.parseInt(wReader["PositionID"]);
                    wGroupParameter.PositionName = StringUtils.parseString(wReader["PositionName"]);


                    wGroupParameter.Protocol = StringUtils.parseString(wReader["Protocol"]);
                    wGroupParameter.OPCClass = StringUtils.parseString(wReader["OPCClass"]);
                    wGroupParameter.DataType = StringUtils.parseInt(wReader["DataType"]);

                    wGroupParameter.DataAction = StringUtils.parseInt(wReader["DataAction"]);
                    wGroupParameter.InternalTime = StringUtils.parseInt(wReader["InternalTime"]);

                    wGroupParameter.DataClass = StringUtils.parseInt(wReader["DataClass"]);

                    wGroupParameter.DataLength = StringUtils.parseInt(wReader["DataLength"]);
                    wGroupParameter.KeyChar = StringUtils.parseString(wReader["KeyChar"]);
                    wGroupParameter.AuxiliaryChar = StringUtils.parseString(wReader["AuxiliaryChar"]);
                    wGroupParameter.ParameterDesc = StringUtils.parseString(wReader["ParameterDesc"]);

                    wGroupParameter.ValueLeft = StringUtils.parseDouble(wReader["ValueLeft"]);

                    wGroupParameter.ValueRight = StringUtils.parseDouble(wReader["ValueRight"]);


                    wGroupParameter.CreatorID = StringUtils.parseInt(wReader["CreatorID"]);
                    wGroupParameter.CreatorName = StringUtils.parseString(wReader["CreatorName"]);
                    wGroupParameter.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wGroupParameter.EditorID = StringUtils.parseInt(wReader["EditorID"]);
                    wGroupParameter.EditorName = StringUtils.parseString(wReader["EditorName"]);
                    wGroupParameter.EditTime = StringUtils.parseDate(wReader["EditTime"]);
                    wGroupParameter.Active = StringUtils.parseInt(wReader["Active"]);
                    wGroupParameter.AnalysisOrder = StringUtils.parseInt(wReader["AnalysisOrder"]);
                    wGroupParameter.ActOrder = StringUtils.parseInt(wReader["ActOrder"]);
                    wGroupParameter.Reversed = StringUtils.parseInt(wReader["Reversed"]);
                    wResult.Add(wGroupParameter);
                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSGroupParameter> DMS_SelectGroupParameterList(BMSEmployee wLoginUser, String wName, String wVariableName,
            String wDeviceGroupCode, String wProtocol, String wOPCClass, int wDataType, int wDataClass, int wPositionID,
               int wActive, Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<DMSGroupParameter> wResult = new List<DMSGroupParameter>();
            try
            {
                wResult = DMS_SelectGroupParameterList(wLoginUser, null, "", wName, wVariableName, wDeviceGroupCode, wProtocol,
                    wOPCClass, wDataType, wDataClass, wPositionID, wActive, wPagination,
                        wErrorCode);
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public DMSGroupParameter DMS_SelectGroupParameter(BMSEmployee wLoginUser, int wID, String wCode,
                OutResult<Int32> wErrorCode)
        {
            DMSGroupParameter wResult = new DMSGroupParameter();
            try
            {
                List<DMSGroupParameter> wDMSGroupParameterList = null;
                if (wID > 0)
                {
                    List<Int32> wIDList = new List<Int32>();
                    wIDList.Add(wID);
                    wDMSGroupParameterList = this.DMS_SelectGroupParameterList(wLoginUser, wIDList, "", "", "", "", "",
                    "", -1, -1, -1, -1, Pagination.Default, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wCode))
                {
                    wDMSGroupParameterList = this.DMS_SelectGroupParameterList(wLoginUser, null, wCode, "", "", "", "",
                    "", -1, -1, -1, -1, Pagination.Default, wErrorCode);
                }

                else
                {
                    return wResult;
                }

                if (wDMSGroupParameterList.Count <= 0)
                    return wResult;

                wResult = wDMSGroupParameterList[0];
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSGroupParameter> DMS_SelectGroupParameterList(BMSEmployee wLoginUser, String wDeviceGroupCode, 
            int wDataClass, Pagination wPagination,
             OutResult<Int32> wErrorCode)
        {
            List<DMSGroupParameter> wResult = new List<DMSGroupParameter>();
            try
            {
                if (StringUtils.isNotEmpty(wDeviceGroupCode))

                    wResult = this.DMS_SelectGroupParameterList(wLoginUser, null, "", "", "", wDeviceGroupCode, "",
                        "", -1, wDataClass, -1, -1, wPagination, wErrorCode);

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSGroupParameter> DMS_SelectGroupParameterList(BMSEmployee wLoginUser, List<Int32> wIDList,
                OutResult<Int32> wErrorCode)
        {
            List<DMSGroupParameter> wResult = new List<DMSGroupParameter>();
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
                        wResult.AddRange(this.DMS_SelectGroupParameterList(wLoginUser, wSelectList, "", "", "","", "",
                    "", -1, -1, -1, -1, Pagination.MaxSize, wErrorCode));

                        wSelectList.Clear();
                    }
                    if (i == wIDList.Count - 1)
                    {
                        if (wSelectList.Count > 0)
                            wResult.AddRange(this.DMS_SelectGroupParameterList(wLoginUser, wSelectList, "", "", "", "", "",
                    "", -1, -1, -1, -1, Pagination.MaxSize, wErrorCode));
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

        private DMSGroupParameter DMS_CheckGroupParameter(BMSEmployee wLoginUser, DMSGroupParameter wDMSGroupParameter,
             OutResult<Int32> wErrorCode)
        {
            DMSGroupParameter wResult = new DMSGroupParameter();
            try
            {

                if (wDMSGroupParameter == null || StringUtils.isEmpty(wDMSGroupParameter.Name) || StringUtils.isEmpty(wDMSGroupParameter.VariableName)
                        || StringUtils.isEmpty(wDMSGroupParameter.DeviceGroupCode) || wDMSGroupParameter.DataType <= 0 || wDMSGroupParameter.DataClass <= 0)
                {
                    return wResult;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                String wSQL = StringUtils.Format(
                        "SELECT t1.* FROM {0}.dms_group_parameter t1 WHERE t1.ID != @ID " +
                        " AND (( t1.DeviceGroupCode=@DeviceGroupCode and t1.VariableName=@VariableName " +
                        " and (t1.Name=@Name or t1.DataClass =@DataClass) ) or t1.Code =@Code)  ;",
                        wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("DeviceGroupCode", wDMSGroupParameter.DeviceGroupCode);
                wParamMap.Add("Name", wDMSGroupParameter.Name);
                wParamMap.Add("VariableName", wDMSGroupParameter.VariableName);
                wParamMap.Add("DataClass", wDMSGroupParameter.DataClass);
                wParamMap.Add("ID", wDMSGroupParameter.ID);
                wParamMap.Add("Code", wDMSGroupParameter.Code);
                wParamMap.Add("AnalysisOrder", wDMSGroupParameter.AnalysisOrder);
                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {

                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.Code = StringUtils.parseString(wReader["Code"]);
                    wResult.Name = StringUtils.parseString(wReader["Name"]);
                    wResult.DeviceGroupCode = StringUtils.parseString(wReader["DeviceGroupCode"]);
                    wResult.VariableName = StringUtils.parseString(wReader["VariableName"]);
                    wResult.ParameterDesc = StringUtils.parseString(wReader["ParameterDesc"]);
                    wResult.AnalysisOrder = StringUtils.parseInt(wReader["AnalysisOrder"]);
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

        public void DMS_UpdateGroupParameter(BMSEmployee wLoginUser, DMSGroupParameter wGroupParameter,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {
                if (wGroupParameter == null || StringUtils.isEmpty(wGroupParameter.Name) || StringUtils.isEmpty(wGroupParameter.VariableName)
                      || StringUtils.isEmpty(wGroupParameter.DeviceGroupCode) || wGroupParameter.DataType <= 0 || wGroupParameter.DataClass <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                if (wGroupParameter.ID > 0 && StringUtils.isEmpty(wGroupParameter.Code))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                } 

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();

                DMSGroupParameter wDMSGroupParameterDB = this.DMS_CheckGroupParameter(wLoginUser, wGroupParameter, wErrorCode);
                if (wDMSGroupParameterDB.ID > 0)
                {

                    if (wGroupParameter.ID <= 0)
                    {
                        wGroupParameter.ID = wDMSGroupParameterDB.ID;
                    }
                    else
                    {
                        wErrorCode.Result = MESException.Duplication.Value;
                        return;
                    }
                }
                //生成唯一编码
                if (StringUtils.isEmpty(wGroupParameter.Code))
                {
                    wGroupParameter.Code = this.CreateMaxCode(StringUtils.Format("{0}.dms_group_parameter", wInstance), StringUtils.Format("{0}-{1}", wGroupParameter.DeviceGroupCode, wGroupParameter.DataClass), "Code", 4);
                }

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("Code", wGroupParameter.Code);
                wParamMap.Add("Name", wGroupParameter.Name);
                wParamMap.Add("VariableName", wGroupParameter.VariableName);
                wParamMap.Add("DeviceGroupCode", wGroupParameter.DeviceGroupCode);
                wParamMap.Add("ServerId", wGroupParameter.ServerId);
                wParamMap.Add("Protocol", wGroupParameter.Protocol);
                wParamMap.Add("OPCClass", wGroupParameter.OPCClass);
                wParamMap.Add("DataType", wGroupParameter.DataType);
                wParamMap.Add("DataAction", wGroupParameter.DataAction);
                wParamMap.Add("DataClass", wGroupParameter.DataClass);
                wParamMap.Add("DataLength", wGroupParameter.DataLength);
                wParamMap.Add("InternalTime", wGroupParameter.InternalTime);
                wParamMap.Add("KeyChar", wGroupParameter.KeyChar);
                wParamMap.Add("AuxiliaryChar", wGroupParameter.AuxiliaryChar);
                wParamMap.Add("ParameterDesc", wGroupParameter.ParameterDesc);
                wParamMap.Add("EditorID", wLoginUser.ID);
                wParamMap.Add("EditTime", DateTime.Now);
                wParamMap.Add("Active", wGroupParameter.Active);
                wParamMap.Add("AnalysisOrder", wGroupParameter.AnalysisOrder);
                wParamMap.Add("ActOrder", wGroupParameter.ActOrder);
                wParamMap.Add("Reversed", wGroupParameter.Reversed);
                wParamMap.Add("PositionID", wGroupParameter.PositionID);
                wParamMap.Add("ValueLeft", wGroupParameter.ValueLeft);
                wParamMap.Add("ValueRight", wGroupParameter.ValueRight);


                if (wGroupParameter.ID <= 0)
                {
                    wParamMap.Add("CreatorID", wLoginUser.ID);
                    wParamMap.Add("CreateTime", DateTime.Now);
                    wGroupParameter.ID = this.Insert(StringUtils.Format("{0}.dms_group_parameter", wInstance), wParamMap);

                }
                else
                {
                    wParamMap.Add("ID", wGroupParameter.ID);
                    this.Update(StringUtils.Format("{0}.dms_group_parameter", wInstance), "ID", wParamMap);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public void DMS_DeleteGroupParameter(BMSEmployee wLoginUser, DMSGroupParameter wGroupParameter,
                OutResult<Int32> wErrorCode)
        {
            try
            {

                if (wGroupParameter == null || StringUtils.isEmpty(wGroupParameter.Name) || StringUtils.isEmpty(wGroupParameter.VariableName)
                     || StringUtils.isEmpty(wGroupParameter.DeviceGroupCode) || wGroupParameter.DataType <= 0 || wGroupParameter.DataClass <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("ID", wGroupParameter.ID);
                wParamMap.Add("Active", 0);

                this.Delete(StringUtils.Format("{0}.dms_group_parameter", wInstance), wParamMap);


            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public void DMS_ActiveGroupParameter(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive,
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
                String wSql = StringUtils.Format("UPDATE {0}.dms_group_parameter SET Active ={1} WHERE ID IN({2}) ;",
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
