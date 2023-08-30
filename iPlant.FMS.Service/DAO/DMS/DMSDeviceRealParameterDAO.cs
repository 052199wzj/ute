using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iPlant.Data.EF;

namespace iPlant.FMC.Service
{
    class DMSDeviceRealParameterDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSDeviceRealParameterDAO));

        private static DMSDeviceRealParameterDAO Instance;

        private DMSDeviceRealParameterDAO() : base()
        {

        }

        public static DMSDeviceRealParameterDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSDeviceRealParameterDAO();
            return Instance;
        }

        private List<DMSDeviceRealParameter> DMS_SelectDeviceRealParameterList(BMSEmployee wLoginUser, List<Int32> wID, String wCode, String wParameterName, List<String> wVariableName,

                int wAreaID, int wDeviceID, String wDeviceNo, String wAssetNo, String wDeviceName, int wDataType, int wDataClass, int wPositionID,
                OutResult<Int32> wErrorCode)
        {

            List<DMSDeviceRealParameter> wResult = new List<DMSDeviceRealParameter>();
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
                if (wParameterName == null)
                    wParameterName = "";
                if (wVariableName == null)
                    wVariableName = new List<string>();

                wVariableName.RemoveAll(p => StringUtils.isEmpty(p));

                if (wDeviceNo == null)
                    wDeviceNo = "";
                if (wAssetNo == null)
                    wAssetNo = "";
                if (wDeviceName == null)
                    wDeviceName = "";

                String wSQL = StringUtils.Format(
                        "SELECT p.*,t.ID as ParameterID, t.Name as ParameterName,t.Code as ParameterCode,t.DeviceID,t1.AssetNo,"
                        + " t.VariableName,t.DataType,t.DataClass,t.KeyChar,t.AuxiliaryChar,t.ValueLeft,t.ValueRight,"
                        + " t.ParameterDesc,t1.Code as  DeviceNo,t1.Name as DeviceName,t.PositionID,t7.Name as PositionName "
                        + " FROM {0}.dms_device_parameter t "
                        + " inner join {0}.dms_device_ledger t1 on t.DeviceID=t1.ID  "
                        + " left join {0}.dms_device_parametervalue p on p.ParameterNo=t.Code and p.DeviceID=t1.AssetNo "
                        + " left join {0}.dms_position t7 on  t.PositionID=t7.ID  "
                        + "  WHERE  ( @wID ='' or t.ID IN( '{1}' ) )  "
                        + " and ( @wCode ='' or t.Code  = @wCode)  "
                        + " and ( @wName ='' or t.Name   like  @wName )  "
                        + " and ( @wDeviceID <= 0 or t.DeviceID  = @wDeviceID)   "
                        + " and ( @wPositionID <= 0 or t.PositionID  = @wPositionID)   "
                        + " and ( @wAreaID <= 0 or t1.AreaID  = @wAreaID)   "
                        + " and ( @wDeviceNo ='' or t1.Code  = @wDeviceNo)  "
                        + " and ( @wAssetNo ='' or t1.AssetNo  = @wAssetNo)  "
                        + " and ( @wDeviceName ='' or t1.Name   like concat( '%', @wDeviceName,'%')  )  "
                        + " and ( @wVariableName ='' or t.VariableName in ( '{2}' ) )  "
                        + " and ( @wDataType <= 0 or t.DataType  = @wDataType)   "
                        + " and ( @wDataClass <= 0 or t.DataClass  = @wDataClass)   "
                        + " and  t.Active  = 1   group by t.ID  ;"
                        , wInstance, StringUtils.Join("','", wID), StringUtils.Join("','", wVariableName));
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wID", StringUtils.Join(",", wID));
                wParamMap.Add("wName", StringUtils.isEmpty(wParameterName) ? wParameterName : "%" + wParameterName + "%");
                wParamMap.Add("wCode", wCode);
                wParamMap.Add("wDeviceID", wDeviceID);
                wParamMap.Add("wPositionID", wPositionID);
                wParamMap.Add("wAreaID", wAreaID);
                wParamMap.Add("wDeviceNo", wDeviceNo);
                wParamMap.Add("wAssetNo", wAssetNo);
                wParamMap.Add("wDeviceName", wDeviceName);
                wParamMap.Add("wVariableName", StringUtils.Join(",", wVariableName));
                wParamMap.Add("wDataType", wDataType);
                wParamMap.Add("wDataClass", wDataClass);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);



                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSDeviceRealParameter wDeviceRealParameter = new DMSDeviceRealParameter();

                    wDeviceRealParameter.ID = StringUtils.parseInt(wReader.ContainsKey("ID") ? wReader["ID"] : "");

                    wDeviceRealParameter.PositionID = StringUtils.parseInt(wReader["PositionID"]);
                    wDeviceRealParameter.PositionName = StringUtils.parseString(wReader["PositionName"]);
                    wDeviceRealParameter.ParameterID = StringUtils.parseInt(wReader["ParameterID"]);
                    wDeviceRealParameter.ParameterCode = StringUtils.parseString(wReader["ParameterCode"]);
                    wDeviceRealParameter.ParameterName = StringUtils.parseString(wReader["ParameterName"]);
                    wDeviceRealParameter.VariableName = StringUtils.parseString(wReader["VariableName"]);
                    wDeviceRealParameter.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wDeviceRealParameter.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wDeviceRealParameter.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wDeviceRealParameter.AssetNo = StringUtils.parseString(wReader["AssetNo"]);

                    wDeviceRealParameter.DataType = StringUtils.parseInt(wReader["DataType"]);

                    wDeviceRealParameter.DataTypeText = EnumTool.GetEnumDesc<DMSDataTypes>(wDeviceRealParameter.DataType);
                    wDeviceRealParameter.DataClass = StringUtils.parseInt(wReader["DataClass"]);
                    wDeviceRealParameter.DataClassText = EnumTool.GetEnumDesc<DMSDataClass>(wDeviceRealParameter.DataClass);

                    wDeviceRealParameter.KeyChar = StringUtils.parseString(wReader["KeyChar"]);
                    wDeviceRealParameter.AuxiliaryChar = StringUtils.parseString(wReader["AuxiliaryChar"]);
                    wDeviceRealParameter.ValueLeft = StringUtils.parseDouble(wReader["ValueLeft"]);

                    wDeviceRealParameter.ValueRight = StringUtils.parseDouble(wReader["ValueRight"]);
                    wDeviceRealParameter.ParameterDesc = StringUtils.parseString(wReader["ParameterDesc"]);

                    wDeviceRealParameter.ParameterValue = StringUtils.parseString(wReader["ParameterValue"]);
                    wDeviceRealParameter.UpdateTime = StringUtils.parseDate(wReader["UpdateDate"]);
                    wResult.Add(wDeviceRealParameter);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



        public List<DMSDeviceRealParameter> DMS_SelectDeviceRealParameterList(BMSEmployee wLoginUser, List<Int32> wDeviceIDList, List<String> wAssetNoList,
                OutResult<Int32> wErrorCode)
        {

            List<DMSDeviceRealParameter> wResult = new List<DMSDeviceRealParameter>();
            try
            {

                if (wDeviceIDList == null)
                    wDeviceIDList = new List<int>();

                wDeviceIDList.RemoveAll(p => p <= 0);

                if (wAssetNoList == null)
                    wAssetNoList = new List<String>();

                wAssetNoList.RemoveAll(p => String.IsNullOrWhiteSpace(p));

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;



                String wSQL = StringUtils.Format(
                        "SELECT !isnull(p.ParameterValue) as ID, p.*,t.ID as ParameterID, t.Name as ParameterName,t.Code as ParameterCode, t.DeviceID,t1.AssetNo,"
                        + " t.VariableName,t.DataType,t.DataClass,t.KeyChar,t.AuxiliaryChar,"
                        + " t.ParameterDesc,t1.Code as  DeviceNo,t1.Name as DeviceName"
                        + " FROM {0}.dms_device_parameter t "
                        + " inner join {0}.dms_device_ledger t1 on t.DeviceID=t1.ID  "
                        + " left join {0}.dms_device_parametervalue p  on p.ParameterNo=t.Code and p.DeviceID=t1.AssetNo "
                        + " WHERE 1=1  and  t.Active=1  "
                        + " and ( @wAssetNo ='' or t1.AssetNo  in  ('{1}'))  "
                        + " and ( @wDeviceID ='' or t1.ID  in  ({2}))  group by t.ID   "
                           , wInstance, wAssetNoList.Count > 0 ? StringUtils.Join("','", wAssetNoList) : "0",
                        wDeviceIDList.Count > 0 ? StringUtils.Join(",", wDeviceIDList) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wDeviceID", StringUtils.Join(",", wDeviceIDList));
                wParamMap.Add("wAssetNo", StringUtils.Join("','", wAssetNoList));

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);


                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSDeviceRealParameter wDeviceRealParameter = new DMSDeviceRealParameter();

                    wDeviceRealParameter.ID = StringUtils.parseInt(wReader.ContainsKey("ID") ? wReader["ID"] : "");

                    wDeviceRealParameter.ParameterID = StringUtils.parseInt(wReader["ParameterID"]);
                    wDeviceRealParameter.ParameterCode = StringUtils.parseString(wReader["ParameterCode"]);
                    wDeviceRealParameter.ParameterName = StringUtils.parseString(wReader["ParameterName"]);
                    wDeviceRealParameter.VariableName = StringUtils.parseString(wReader["VariableName"]);
                    wDeviceRealParameter.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wDeviceRealParameter.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wDeviceRealParameter.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wDeviceRealParameter.AssetNo = StringUtils.parseString(wReader["AssetNo"]);

                    wDeviceRealParameter.DataType = StringUtils.parseInt(wReader["DataType"]);
                    wDeviceRealParameter.IsChange = StringUtils.parseInt(wReader["IsChange"]);

                    wDeviceRealParameter.DataTypeText = EnumTool.GetEnumDesc<DMSDataTypes>(wDeviceRealParameter.DataType);
                    wDeviceRealParameter.DataClass = StringUtils.parseInt(wReader["DataClass"]);
                    wDeviceRealParameter.DataClassText = EnumTool.GetEnumDesc<DMSDataClass>(wDeviceRealParameter.DataClass);

                    wDeviceRealParameter.KeyChar = StringUtils.parseString(wReader["KeyChar"]);
                    wDeviceRealParameter.AuxiliaryChar = StringUtils.parseString(wReader["AuxiliaryChar"]);
                    wDeviceRealParameter.ParameterDesc = StringUtils.parseString(wReader["ParameterDesc"]);

                    wDeviceRealParameter.ParameterValue = StringUtils.parseString(wReader["ParameterValue"]);
                    wDeviceRealParameter.UpdateTime = StringUtils.parseDate(wReader["UpdateDate"]);
                    wResult.Add(wDeviceRealParameter);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public List<DMSDeviceRealParameter> DMS_SelectDeviceRealParameterList(BMSEmployee wLoginUser, String wParameterName, List<String> wVariableName,

                int wAreaID, int wDeviceID, String wDeviceNo, String wAssetNo, String wDeviceName, int wDataType, int wDataClass, int wPositionID,
                OutResult<Int32> wErrorCode)
        {
            return this.DMS_SelectDeviceRealParameterList(wLoginUser, null, "", wParameterName, wVariableName,

                wAreaID, wDeviceID, wDeviceNo, wAssetNo, wDeviceName, wDataType, wDataClass, wPositionID,
               wErrorCode);
        }

        public List<DMSDeviceRealParameter> DMS_SelectDeviceRealParameterList(BMSEmployee wLoginUser, String wVariableName,
                   int wDataClass, OutResult<Int32> wErrorCode)
        {
            return this.DMS_SelectDeviceRealParameterList(wLoginUser, null, "", "", StringUtils.parseListArgs(wVariableName),

                -1, -1, "", "", "", -1, wDataClass, -1,
               wErrorCode);
        }


        public DMSDeviceRealParameter DMS_SelectDeviceRealParameter(BMSEmployee wLoginUser, int wID, String wCode,
                OutResult<Int32> wErrorCode)
        {
            DMSDeviceRealParameter wResult = new DMSDeviceRealParameter();
            try
            {
                List<DMSDeviceRealParameter> wDMSDeviceRealParameterList = null;
                if (wID > 0)
                {
                    List<Int32> wIDList = new List<Int32>();
                    wIDList.Add(wID);
                    wDMSDeviceRealParameterList = this.DMS_SelectDeviceRealParameterList(wLoginUser, wIDList, "", "",
                     null, -1, -1, "", "", "", -1, -1, -1, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wCode))
                {
                    wDMSDeviceRealParameterList = this.DMS_SelectDeviceRealParameterList(wLoginUser, null, wCode, "",
                     null, -1, -1, "", "", "", -1, -1, -1, wErrorCode);
                }

                else
                {
                    return wResult;
                }
                if (wDMSDeviceRealParameterList != null && wDMSDeviceRealParameterList.Count > 0)
                    wResult = wDMSDeviceRealParameterList[0];

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSDeviceRealParameter> DMS_SelectDeviceRealParameterList(BMSEmployee wLoginUser, List<Int32> wIDList,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceRealParameter> wResult = new List<DMSDeviceRealParameter>();
            try
            {
                if (wIDList == null || wIDList.Count < 1)
                    return wResult;
                DateTime wBaseTime = new DateTime(2000, 1, 1);
                List<Int32> wSelectList = new List<Int32>();
                for (int i = 0; i < wIDList.Count; i++)
                {
                    wSelectList.Add(wIDList[i]);
                    if (i % 25 == 0)
                    {
                        wResult.AddRange(this.DMS_SelectDeviceRealParameterList(wLoginUser, wSelectList, "", "",
                     null, -1, -1, "", "", "", -1, -1, -1, wErrorCode));

                        wSelectList.Clear();
                    }
                    if (i == wIDList.Count - 1)
                    {
                        if (wSelectList.Count > 0)
                            wResult.AddRange(this.DMS_SelectDeviceRealParameterList(wLoginUser, wSelectList, "", "",
                    null, -1, -1, "", "", "", -1, -1, -1, wErrorCode));
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


        public String DMS_UpdateDeviceRealParameter(int wID, String wAssetNo, String wParameterCode, String wParameterValue)
        {

            if (StringUtils.isEmpty(wAssetNo) || StringUtils.isEmpty(wParameterCode))
                return "";
            if (wParameterValue == null)
                wParameterValue = "";

            if (wID > 0)
            {

                return StringUtils.Format(" Update  {0}.dms_device_parametervalue  set  UpdateDate =now() ,IsChange=1," +
                    " ChangeDate=now(),ParameterValue='{1}' " +
                    " where  DeviceID='{2}' and ParameterNo ='{3}' ", MESDBSource.DMS.getDBName(),
                     wParameterValue, wAssetNo, wParameterCode);

            }
            else
            {
                return StringUtils.Format(" Insert into {0}.dms_device_parametervalue (DeviceID,ParameterNo,ChangeDate,UpdateDate,ParameterValue) " +
               "values ({1},'{2}',now(),now(),'{3}');", MESDBSource.DMS.getDBName(), wAssetNo, wParameterCode,
               wParameterValue);

            }
        }


        public String DMS_UpdateDeviceRealParameter(DMSDeviceRealParameter wDMSDeviceRealParameter)
        {

            if (wDMSDeviceRealParameter == null || StringUtils.isEmpty(wDMSDeviceRealParameter.AssetNo) || StringUtils.isEmpty(wDMSDeviceRealParameter.ParameterCode))
                return "";

            if (wDMSDeviceRealParameter.ID > 0)
            {

                return StringUtils.Format(" Update  {0}.dms_device_parametervalue  set  UpdateDate =now() ," +
                    " ChangeDate=str_to_date('{1}','%Y-%m-%d %H:%i:%s'),ParameterValue='{2}' " +
                    " where  DeviceID='{3}' and ParameterNo ='{4}' ", MESDBSource.DMS.getDBName(), wDMSDeviceRealParameter.UpdateTime.ToString("yyyy-MM-dd HH:mm:ss"),
                     wDMSDeviceRealParameter.ParameterValue, wDMSDeviceRealParameter.AssetNo, wDMSDeviceRealParameter.ParameterCode);

            }
            else
            {
                return StringUtils.Format(" Insert into {0}.dms_device_parametervalue (DeviceID,ParameterNo,ChangeDate,UpdateDate,ParameterValue) " +
               "values ({1},'{2}','{3}',now(),'{4}');", MESDBSource.DMS.getDBName(), wDMSDeviceRealParameter.AssetNo, wDMSDeviceRealParameter.ParameterCode,
               wDMSDeviceRealParameter.UpdateTime.ToString("yyyy-MM-dd HH:mm:ss"), wDMSDeviceRealParameter.ParameterValue);

            }
        }


    }
}
