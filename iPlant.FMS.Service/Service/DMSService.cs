using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    public interface DMSService
    {
        public void SetSqlMode();
        ServiceResult<Dictionary<String, List<String>>> DMS_GetPositionWorkpieceNo(BMSEmployee wLoginUser, int wLineID);


        ServiceResult<Dictionary<String, List<DMSDeviceLedger>>> DMS_GetWorkpieceNoPosition(BMSEmployee wLoginUser);

        ServiceResult<int> DMS_SetPositionWorkpieceNo(BMSEmployee wLoginUser, int wLineID, Dictionary<String, List<String>> wPositionWorkpieceNo);
        ServiceResult<List<DMSDeviceLedger>> DMS_GetDeviceLedgerList(BMSEmployee wLoginUser, String wName,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, String wWorkPartPointCode, String wDeviceGroupCode, int wAreaID, int wTeamID,
               int wActive, Pagination wPagination);


        ServiceResult<List<DMSDeviceLedger>> DMS_GetDeviceLedgerList(BMSEmployee wLoginUser, int wLineID,
            int wActive, Pagination wPagination);


        ServiceResult<List<DMSDeviceServer>> DMS_GetDeviceServerList(BMSEmployee wLoginUser, int wServerType, int wActice, Pagination wPagination);

        ServiceResult<Int32> DMS_UpdateDeviceServer(BMSEmployee wLoginUser, DMSDeviceServer wDMSDeviceServer);

        ServiceResult<DMSDeviceLedger> DMS_GetDeviceLedger(BMSEmployee wLoginUser, int wID, String wDeviceNo, String wAssetNo);

        ServiceResult<Int32> DMS_SaveDeviceLedger(BMSEmployee wLoginUser, DMSDeviceLedger wDMSDeviceLedger);

        ServiceResult<List<String>> DMS_UpdateDeviceLedgerList(BMSEmployee wLoginUser, List<DMSDeviceLedger> wDMSDeviceLedgerList);

        ServiceResult<Int32> DMS_UpdateDeviceLedgerSet(BMSEmployee wLoginUser, DMSDeviceLedger wDeviceLedger);

        ServiceResult<Int32> DMS_ActiveDeviceLedgerList(BMSEmployee wLoginUser, List<Int32> wIDList,
        int wActive);

        ServiceResult<List<String>> DMS_SyncDeviceLedgerList(BMSEmployee wLoginUser, List<DMSDeviceLedger> wDeviceLedgerList);

        ServiceResult<Int32> DMS_DeleteDeviceLedgerList(BMSEmployee wLoginUser, DMSDeviceLedger wDeviceLedger);
        ServiceResult<List<DMSDeviceModel>> DMS_GetDeviceModelList(BMSEmployee wLoginUser, String wName,
                int wDeviceType, String wDeviceTypeName, String wDeviceTypeCode, int wOperatorID, int wActive);

        ServiceResult<Int32> DMS_SaveDeviceModel(BMSEmployee wLoginUser, DMSDeviceModel wDMSDeviceModel);

        ServiceResult<Int32> DMS_ActiveDeviceModelList(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive);

        ServiceResult<Int32> DMS_DeleteDeviceModelList(BMSEmployee wLoginUser, DMSDeviceModel wDMSDeviceModel);
        ServiceResult<List<DMSDeviceType>> DMS_GetDeviceTypeList(BMSEmployee wLoginUser, String wName, int wActive);

        ServiceResult<Int32> DMS_SaveDeviceType(BMSEmployee wLoginUser, DMSDeviceType wDMSDeviceType);

        ServiceResult<Int32> DMS_ActiveDeviceTypeList(BMSEmployee wLoginUser, List<Int32> wIDList,
                int wActive);

        ServiceResult<Int32> DMS_DeleteDeviceTypeList(BMSEmployee wLoginUser, List<Int32> wIDList);




        ServiceResult<List<DMSPosition>> DMS_GetPositionList(BMSEmployee wLoginUser, int wLineID, String wName, int wActive, Pagination wPagination);


        ServiceResult<Int32> DMS_SavePosition(BMSEmployee wLoginUser, DMSPosition wDMSPosition);


        ServiceResult<Int32> DMS_ActivePositionList(BMSEmployee wLoginUser, List<Int32> wIDList,
                int wActive);


        ServiceResult<Int32> DMS_DeletePositionList(BMSEmployee wLoginUser, List<Int32> wIDList);



        ServiceResult<List<DMSGroupParameter>> DMS_QueryGroupParameterList(BMSEmployee wLoginUser, String wName, String wVariableName, String wDeviceGroupCode,
            String wProtocol, String wOPCClass, int wDataType, int wDataClass, int wPositionID,
              int wActive, Pagination wPagination);

        ServiceResult<DMSGroupParameter> DMS_QueryGroupParameter(BMSEmployee wLoginUser, int wID, String wCode);

        ServiceResult<Int32> DMS_UpdateGroupParameter(BMSEmployee wLoginUser, DMSGroupParameter wGroupParameter);

        ServiceResult<List<String>> DMS_UpdateGroupParameterList(BMSEmployee wLoginUser, List<DMSGroupParameter> wGroupParameterList);


        ServiceResult<List<String>> DMS_UpdateDeviceParameterList(BMSEmployee wLoginUser, String wDeviceGroupCode, List<DMSDeviceLedger> wDMSDeviceLedgerList);


        ServiceResult<Int32> DMS_DeleteGroupParameter(BMSEmployee wLoginUser, DMSGroupParameter wGroupParameter);
        ServiceResult<Int32> DMS_ActiveGroupParameter(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive);


        ServiceResult<List<DMSDeviceParameter>> DMS_QueryDeviceParameterList(BMSEmployee wLoginUser, String wName, String wVariableName,

               int wLineID, int wDeviceID, String wDeviceNo, String wAssetNo, String wDeviceName, String wProtocol, String wOPCClass, int wDataType, int wDataClass, int wPositionID,
               int wActive, Pagination wPagination);

        ServiceResult<DMSDeviceParameter> DMS_QueryDeviceParameter(BMSEmployee wLoginUser, int wID, String wCode);

        ServiceResult<Int32> DMS_UpdateDeviceParameter(BMSEmployee wLoginUser, DMSDeviceParameter wDeviceParameter);

        ServiceResult<List<String>> DMS_UpdateDeviceParameterList(BMSEmployee wLoginUser, List<DMSDeviceParameter> wDeviceParameterList);


        ServiceResult<Int32> DMS_DeleteDeviceParameter(BMSEmployee wLoginUser, DMSDeviceParameter wDeviceParameter);
        ServiceResult<Int32> DMS_ActiveDeviceParameter(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive);



        ServiceResult<Dictionary<int, Dictionary<String, int>>> DMS_SelectDeviceStatusTime(BMSEmployee wLoginUser, List<Int32> wID, String wCode, String wName,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID,
               DateTime wStartTime, DateTime wEndTime);

        ServiceResult<List<DMSDeviceStatus>> DMS_CurrentDeviceStatusList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, String wDeviceName,
               String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID, int wStatus,int wIsPlan, Pagination wPagination);


        ServiceResult<List<DMSDeviceAreaStatus>> DMS_CurrentDeviceStatusStatistics(BMSEmployee wLoginUser, String wName,
            String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID, int wStatus, Pagination wPagination);


        ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatusList(BMSEmployee wLoginUser, String wName,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID,
               int wActive, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);
        ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatus(BMSEmployee wLoginUser, int wID, String wCode,
            String wAssetNo, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);

        ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatusList(BMSEmployee wLoginUser, List<Int32> wIDList,
            DateTime wStartTime, DateTime wEndTime, Pagination wPagination);



        ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatusDetailList(BMSEmployee wLoginUser, String wName, int wDeviceID,
            String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID,
            List<int> wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);
        ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatusDetail(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
            String wAssetNo, List<int> wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);

        ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatusDetailList(BMSEmployee wLoginUser,
            List<Int32> wDeviceIDList, List<int> wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);



        ServiceResult<List<DMSDeviceAlarm>> DMS_CurrentDeviceAlarmList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, String wAssetNo,
                int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wPositionID, int wTeamID);


        ServiceResult<List<DMSDeviceAlarm>> DMS_SelectDeviceAlarmList(BMSEmployee wLoginUser, String wName,
              String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wPositionID, int wTeamID,
           int wEventType, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);

        ServiceResult<List<DMSDeviceAlarm>> DMS_SelectDeviceAlarm(BMSEmployee wLoginUser, int wID, String wCode, String wAssetNo,
            int wEventType, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);


        ServiceResult<List<DMSDeviceAlarm>> DMS_SelectDeviceAlarmList(BMSEmployee wLoginUser,
            List<Int32> wIDList, int wEventType, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);


        ServiceResult<List<DMSDeviceRealParameter>> DMS_SelectDeviceRealParameterList(BMSEmployee wLoginUser, String wName, List<String> wVariableName,

                int wAreaID, int wDeviceID, String wDeviceNo, String wAssetNo, String wDeviceName, int wDataType, int wDataClass, int wPositionID);

        ServiceResult<List<DMSDeviceRealParameter>> DMS_SelectDeviceRealParameterList(BMSEmployee wLoginUser, List<Int32> wIDList);

        ServiceResult<DMSDeviceRealParameter> DMS_SelectDeviceRealParameter(BMSEmployee wLoginUser, int wID, String wCode);

        ServiceResult<List<DMSDeviceAlarmStatistics>> DMS_SelectDeviceAlarmStatisticsList(BMSEmployee wLoginUser,
           int wDeviceID, String wDeviceNo, String wDeviceName, String wAssetNo, int wDeviceType, int wModelID, int wFactoryID,
           int wWorkShopID, int wLineID, int wAreaID, int wTeamID, int wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);
        ServiceResult<Dictionary<int, Dictionary<String, Object>>> DMS_SelectDeviceRealParameterStructList(BMSEmployee wLoginUser, String wName, List<String> wVariableName,

             int wAreaID, int wDeviceID, String wDeviceNo, String wAssetNo, String wDeviceName, int wDataType, int wDataClass, int wPositionID);

        ServiceResult<Dictionary<String, Object>> DMS_SelectDeviceCurrentStruct(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, String wAssetNo);


        ServiceResult<List<DMSDeviceStatusStatistics>> DMS_SelectDeviceStatusStatisticsList(BMSEmployee wLoginUser,
           int wDeviceID, String wDeviceNo, String wDeviceName, String wAssetNo, int wDeviceType, int wModelID, int wFactoryID,
           int wWorkShopID, int wLineID, int wAreaID, int wTeamID, int wStatus, Boolean wIsCombine, Boolean wHasMaintan, DateTime wStartTime, DateTime wEndTime, Pagination wPagination, int wHasAlarm);


        ServiceResult<List<DMSProcessRecord>> DMS_CurrentProcessRecordList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, List<int> wDataClassList, int wActive, Pagination wPagination);


        ServiceResult<List<DMSProcessRecord>> DMS_SelectProcessRecordList(BMSEmployee wLoginUser, int wLineID, int wProductID,  int wOrderID, String wOrderNo, String wAssetNo, String wWorkPartPointCode, int wDeviceID, String wDeviceNo, String wWorkpieceNo, int wRecordType,
            List<int> wDataClassList, int wActive, int wStatus, DateTime wStartTime, DateTime wEndTime, string wDeviceName,  int wTechnologyID, int wModelID, Pagination wPagination);

        ServiceResult<List<DMSProcessRecord>> DMS_SelectProcessRecordUploadList(BMSEmployee wLoginUser);

        ServiceResult<Int32> DMS_UpdateProcessRecordUploadStatus(BMSEmployee wLoginUser, List<Int32> wRecordIDList, int wUploadStatus);

        ServiceResult<DMSProcessRecord> DMS_SelectProcessRecord(BMSEmployee wLoginUser, int wID);
        /// <summary>
        /// 获取工件某个记录的最后一条
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wWorkpieceNo"></param>
        /// <param name="wRecordType"></param>
        /// <returns></returns>
        ServiceResult<DMSProcessRecord> DMS_SelectLastProcessRecord(BMSEmployee wLoginUser, String wWorkpieceNo, int wRecordType);
        ServiceResult<List<DMSProcessRecordItem>> DMS_SelectProcessRecordItemList(BMSEmployee wLoginUser, int wRecordID);
        ServiceResult<List<DMSProcessRecordItem>> DMS_SelectProcessRecordItemList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, int wRecordID,
           int wParameterID, String wParameterNo, int wActive, int wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);

        ServiceResult<List<DMSDeviceRepair>> DMS_SelectDeviceRepairList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
           int wAlarmType, int wAlarmLevel, int wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);


        ServiceResult<DMSDeviceRepair> DMS_SelectDeviceRepair(BMSEmployee wLoginUser, int wID, string wCode);

        ServiceResult<Int32> DMS_UpdateDeviceRepair(BMSEmployee wLoginUser, DMSDeviceRepair wDMSDeviceRepair);

        ServiceResult<Int32> DMS_DeleteDeviceRepair(BMSEmployee wLoginUser, List<Int32> wIDList);



        ServiceResult<Int32> DMS_SyncDeviceStatus(BMSEmployee wLoginUser, String wAssetNo, int wStatus);
        /// <summary>
        /// 同步设备当前状态  
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wDMSDeviceStatusList">当前状态列表</param>
        /// <returns>错误信息</returns>

        ServiceResult<List<String>> DMS_SyncDeviceStatusList(BMSEmployee wLoginUser, List<DMSDeviceStatus> wDMSDeviceStatusList);

        /// <summary>
        /// 填补历史状态 （备用）
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wDMSDeviceStatusList">历史状态列表</param>
        /// <returns>错误信息</returns>
        ServiceResult<List<String>> DMS_SyncDeviceStatusHistoryList(BMSEmployee wLoginUser, List<DMSDeviceStatus> wDMSDeviceStatusList);

        /// <summary>
        /// 关闭设备所有当前报警
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wAssetNo"></param>
        /// <returns></returns>
        ServiceResult<Int32> DMS_CloseDeviceAlarmAll(BMSEmployee wLoginUser, String wAssetNo);

        /// <summary>
        /// 同步设备报警
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wAssetNo"></param>
        /// <param name="wAlarmCode"></param>
        /// <param name="wEventType"></param>
        /// <param name="wIsCode"></param>
        /// <returns></returns>
        ServiceResult<Int32> DMS_SyncDeviceAlarm(BMSEmployee wLoginUser, String wAssetNo, String wAlarmCode, int wEventType, int wIsCode);


        /// <summary>
        /// 同步设备报警 ,并插入不存在的配置
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wAssetNo"></param>
        /// <param name="wAlarmCode"></param>
        /// <returns></returns>
        ServiceResult<DMSDeviceParameter> DMS_SyncDeviceAlarm(BMSEmployee wLoginUser, int wDeviceID, String wAssetNo, String wAlarmCode);


        /// <summary>
        /// 同步设备当前报警
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wDMSDeviceAlarmList">当前报警列表</param>
        /// <returns>错误信息</returns>
        ServiceResult<List<String>> DMS_SyncDeviceAlarmList(BMSEmployee wLoginUser, List<String> wAssetNoList, List<DMSDeviceAlarm> wDMSDeviceAlarmList);

        /// <summary>
        /// 同步设备历史报警（备用）
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wDMSDeviceAlarmList">历史报警列表</param>
        /// <returns>错误信息</returns>
        ServiceResult<List<String>> DMS_SyncDeviceAlarmHistoryList(BMSEmployee wLoginUser, List<DMSDeviceAlarm> wDMSDeviceAlarmList);



        ServiceResult<Int32> DMS_SyncDeviceRealParameter(BMSEmployee wLoginUser, String wAssetNo, String wParameterCode, String wParameterValue);
        /// <summary>
        /// 同步设备参数列表
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wDMSDeviceRealParameterList">设备参数列表</param>
        /// <returns>错误信息</returns>
        ServiceResult<List<String>> DMS_SyncDeviceRealParameterList(BMSEmployee wLoginUser, List<DMSDeviceRealParameter> wDMSDeviceRealParameterList);



        ServiceResult<int> DMS_SyncProcessRecord(BMSEmployee wLoginUser, String wAssetNo, String wWorkpieceNo, String wOrderNo, String wProductNo, Dictionary<String, DMSProcessRecordItem> wDMSProcessRecordItemDic);

        /// <summary>
        /// 同步设备加工过程数据
        /// </summary>
        /// <param name="wBMSEmployee"></param>
        /// <param name="wDMSProcessRecordList">加工过程数据列表</param>
        /// <returns>错误信息</returns>
        ServiceResult<List<String>> DMS_SyncProcessRecordList(BMSEmployee wBMSEmployee, List<DMSProcessRecord> wDMSProcessRecordList);



        ServiceResult<List<DMSDeviceStatistics>> DMS_SelectDeviceStatusDetailStatisticsTime(BMSEmployee wLoginUser, int wLineID, List<int> wDeviceIDList, String wAssetNo, int wStatType,
              DateTime wStartTime, DateTime wEndTime);


        ServiceResult<List<DMSEnergyStatistics>> DMS_SelectEnergyStatisticsList(BMSEmployee wLoginUser, List<int> wDeviceIDList,
            int wAreaID, int wStatType, int wEnergyType, DateTime wStartTime, DateTime wEndTime,
              int wActive);


        ServiceResult<List<DMSEnergyStatistics>> DMS_SelectEnergyStatisticsList(BMSEmployee wLoginUser, List<int> wDeviceIDList,
            int wAreaID, int wStatType, int wEnergyType, DateTime wStartTime, DateTime wEndTime);
        ServiceResult<Int32> DMS_UpdateEnergyStatistics(BMSEmployee wLoginUser, DMSEnergyStatistics wDMSEnergyStatistics);


        ServiceResult<Int32> DMS_ActiveEnergyStatistics(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive);


        ServiceResult<Int32> DMS_DeleteEnergyStatistics(BMSEmployee wLoginUser, List<Int32> wIDList);

        /// <summary>
        /// 获取指定设备某个产品型号的加工程序
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wDeviceID"></param>
        /// <param name="wDeviceNo"></param>
        /// <param name="wAssetNo"></param>
        /// <param name="wProductID"></param>
        /// <param name="wProductNo"></param>
        /// <returns></returns>
        ServiceResult<DMSProgramNC> DMS_SelectCurrentProgramNC(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, String wAssetNo, int wProductID, String wProductNo);

        ServiceResult<List<DMSProgramNC>> DMS_GetProgramNCList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID,
                int wWorkShopID, int wLineID, int wAreaID, int wProductID, String wProductNo, Pagination wPagination);


        ServiceResult<Int32> DMS_UpdateProgramNC(BMSEmployee wLoginUser, DMSProgramNC wProgramNC);

        ServiceResult<List<DMSProgramNCRecord>> DMS_GetProgramNCRecordList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wProductID, String wProductNo,
                int wEditorID, int wRecordType, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);

        ServiceResult<Int32> DMS_UpdateProgramNCRecord(BMSEmployee wLoginUser, DMSProgramNCRecord wProgramNCRecord);


        ServiceResult<List<DMSToolInfo>> DMS_GetToolInfoList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID,
                int wAreaID, int wToolHouseIndex, int wToolIndex, Pagination wPagination);

        ServiceResult<List<DMSToolOffset>> DMS_GetToolOffsetList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
               String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID,
               int wToolID, int wToolHouseIndex, int wToolIndex,
               int wEditorID, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);

        ServiceResult<Int32> DMS_UpdateToolInfo(BMSEmployee wLoginUser, DMSToolInfo wDMSToolInfo);

        ServiceResult<Int32> DMS_UpdateToolOffset(BMSEmployee wLoginUser, DMSToolOffset wDMSToolOffset);






        ServiceResult<List<DMSSpareLedger>> DMS_GetSpareLedgerList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID, String wModelNameLike,
            String wManufactorNameLike, String wSupplierNameLike, int wActive, Pagination wPagination);

        ServiceResult<DMSSpareLedger> DMS_GetSpareLedger(BMSEmployee wLoginUser, Int32 wID, String wCode);


        ServiceResult<Int32> DMS_UpdateSpareLedger(BMSEmployee wLoginUser, DMSSpareLedger wDMSSpareLedger);

        ServiceResult<Int32> DMS_ActiveSpareLedger(BMSEmployee wLoginUser, List<int> wIDList, int wActive);

        ServiceResult<Int32> DMS_DeleteSpareLedger(BMSEmployee wLoginUser, DMSSpareLedger wDMSSpareLedger);


        ServiceResult<Dictionary<String, List<String>>> DMS_GetSpareModelAll(BMSEmployee wLoginUser);

        ServiceResult<List<DMSSpareRecord>> DMS_GetSpareRecordList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID, String wModelNameLike,
            String wManufactorNameLike, String wSupplierNameLike, int wSpareID, String wSpareNoLike, int wRecordType, int wActive, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);

        ServiceResult<Int32> DMS_UpdateSpareRecord(BMSEmployee wLoginUser, DMSSpareRecord wDMSSpareRecord);

        ServiceResult<Int32> DMS_DeleteSpareRecord(BMSEmployee wLoginUser, DMSSpareRecord wDMSSpareRecord);

        ServiceResult<List<DMSFixtures>> DMS_GetDeviceFixturesList(BMSEmployee wLoginUser, int wLineID,
             int wProductID, Pagination wPagination);

        ServiceResult<List<DMSFixtures>> DMS_GetFixturesList(BMSEmployee wLoginUser, int wLineID,
            int wDeviceID, List<int> wProductID, String wAssetNo, String wProductNo, String wProductNoLike, Pagination wPagination);

        ServiceResult<Int32> DMS_UpdateFixtures(BMSEmployee wLoginUser, DMSFixtures wDMSFixtures);

        ServiceResult<int> DMS_DeleteFixturesList(BMSEmployee wLoginUser, List<int> wIDList);


        ServiceResult<Int32> DMS_InitDeviceTable(BMSEmployee wLoginUser);
    }
}
