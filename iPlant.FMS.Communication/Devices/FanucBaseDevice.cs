using System;
using System.Collections.Generic;
using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System.Linq;
using ShrisCommunicationCore;
using System.Threading.Tasks;
using iPlant.FMC.Service;
using Opc.Ua;
using Opc.Ua.Client;
using System.IO;

namespace iPlant.FMS.Communication
{

    public class FanucBasicDevice : BasicDevice
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FanucBasicDevice));
        public FanucBasicDevice(DeviceEntity deviceEntity, CommunicationServerManager wCommunicationServerManager, List<DataSourceEntity> wOPCDataSourceEntities)
            : base(deviceEntity, wCommunicationServerManager, wOPCDataSourceEntities)
        {

        }





        public override async Task DeviceAlarms(DataSourceEntity dataSource, object wValue)
        {
            if (wValue is Dictionary<String, String>)
            {
                Dictionary<String, String> wValueDic = (Dictionary<String, String>)wValue;

                Dictionary<String, DataSourceEntity> wDataSourceEntityDic = mDataSourceEntities.Where(i => i.DataCatalog == ((int)DMSDataClass.Alarm)).GroupBy(p => p.DataName).ToDictionary(p => p.Key, p => p.First());

                if (mMatchineStatusState)
                {

                    DMSDeviceParameter wDMSDeviceParameter;
                    DataSourceEntity wDataSourceEntity;
                    //判断配置中是否包含报警
                    foreach (var item in wValueDic.Keys)
                    {
                        if (wValueDic.ContainsKey(item))
                        {
                            continue;
                        }

                        wDMSDeviceParameter = DMSDeviceParameter.Create(StringUtils.isEmpty(wValueDic[item]) ? item : wValueDic[item],
                            item, DeviceEntity.ID, dataSource.ServerId, ((int)DMSDataTypes.String), (int)DMSDataClass.Alarm, DMSServerTypes.Fanuc.ToString(), "customer", "", 0);

                        ServiceInstance.mDMSService.DMS_UpdateDeviceParameter(BaseDAO.SysAdmin, wDMSDeviceParameter);
                        if (wDMSDeviceParameter.ID > 0)
                        {
                            wDataSourceEntity = new DataSourceEntity(wDMSDeviceParameter);
                            mDataSourceEntities.Add(wDataSourceEntity);
                            wDataSourceEntityDic.Add(item, wDataSourceEntity);
                        }
                    }
                }


                foreach (var item in wDataSourceEntityDic.Keys)
                {
                    if (!DeviceAlarmBuffer.ContainsKey(wDataSourceEntityDic[item].Code))
                        DeviceAlarmBuffer.Add(wDataSourceEntityDic[item].Code, false);

                    if (wValueDic.ContainsKey(item) && !DeviceAlarmBuffer[wDataSourceEntityDic[item].Code])
                    {
                        //1 
                        ServiceInstance.mDMSService.DMS_SyncDeviceAlarm(BaseDAO.SysAdmin, DeviceAssetNo, wDataSourceEntityDic[item].Code, 1, 0);
                        DeviceAlarmBuffer[wDataSourceEntityDic[item].Code] = true;
                    }
                    else if (!wValueDic.ContainsKey(item) && DeviceAlarmBuffer[wDataSourceEntityDic[item].Code])
                    {
                        //2
                        ServiceInstance.mDMSService.DMS_SyncDeviceAlarm(BaseDAO.SysAdmin, DeviceAssetNo, wDataSourceEntityDic[item].Code, 2, 0);
                        DeviceAlarmBuffer[wDataSourceEntityDic[item].Code] = false;
                    }

                }

            }
            else if (dataSource.DataTypeCode == ((int)DMSDataTypes.Bool))
            {
                //判断报警 
                await base.DeviceAlarms(dataSource, StringUtils.parseBoolean(wValue));
            }
            else
            {
                await this.DeviceCodeAlarms(dataSource, wValue);

            }


        }


        public override Task DeviceParameters(DataSourceEntity dataSource, object wValue)
        {
            if (wValue is Dictionary<String, String>)
            {
                Dictionary<String, String> wValueDic = (Dictionary<String, String>)wValue;

                Dictionary<String, DataSourceEntity> wDataSourceEntityDic = mDataSourceEntities.Where(i => i.DataCatalog == ((int)DMSDataClass.Params)).GroupBy(p => p.DataName).ToDictionary(p => p.Key, p => p.First());


                //根据数据生成配置
                //

                bool wIsSync = false;
                foreach (var item in wDataSourceEntityDic.Keys)
                {
                    wIsSync = false;
                    if (!DeviceParmasBuffer.ContainsKey(wDataSourceEntityDic[item].Code))
                    {
                        DeviceParmasBuffer[wDataSourceEntityDic[item].Code] = "";
                        wIsSync = true;
                    }
                    if (wValueDic.ContainsKey(item))
                    {
                        if (wValueDic[item] == null)
                        {
                            wValueDic[item] = "";
                        }

                        if (!wValueDic[item].Equals(DeviceParmasBuffer[wDataSourceEntityDic[item].Code], StringComparison.CurrentCultureIgnoreCase))
                        {
                            DeviceParmasBuffer[wDataSourceEntityDic[item].Code] = wValueDic[item];
                            wIsSync = true;
                        }

                    }
                    else
                    {
                        if (StringUtils.isNotEmpty(DeviceParmasBuffer[wDataSourceEntityDic[item].Code]))
                            wIsSync = true;
                        DeviceParmasBuffer[wDataSourceEntityDic[item].Code] = "";

                    }
                    if (wIsSync)
                    {

                        ServiceInstance.mDMSService.DMS_SyncDeviceRealParameter(BaseDAO.SysAdmin, DeviceAssetNo, wDataSourceEntityDic[item].Code, DeviceParmasBuffer[wDataSourceEntityDic[item].Code]);
                    }

                }

            }
            else
            {
                ServiceInstance.mDMSService.DMS_SyncDeviceRealParameter(BaseDAO.SysAdmin, DeviceAssetNo, dataSource.Code, StringUtils.parseString(wValue));

            }
            return Task.CompletedTask;

        }


        protected override void DataHandlerStatusDefault(DataSourceEntity dataSource, Object wValue)
        {
            if (dataSource == null)
                return;
            if (wValue == null)
                wValue = "";

            switch (dataSource.DataName)
            {
                //上料请求
                case "MaterialUpLoadRequest":
                    break;
                //订单请求
                case "OrderRequest":
                    break;
                //什么变量有触发效果
                default:
                    break;
            }

            switch (dataSource.DataCatalog)
            {
                case (int)DMSDataClass.Alarm:
                    if (DeviceEntity.AlarmEnable)
                    {
                        _ = this.DeviceAlarms(dataSource, wValue);
                    }
                    break;
                case (int)DMSDataClass.Status:
                    if (DeviceEntity.StatusEnable)
                    {
                        _ = this.DeviceStatus(dataSource, wValue);
                    }
                    break;
                case (int)DMSDataClass.Params:
                case (int)DMSDataClass.PowerParams:
                    if (DeviceEntity.ParmaterEnable)
                    {
                        _ = this.DeviceParameters(dataSource, wValue);
                    }
                    break;
                case (int)DMSDataClass.WorkParams:
                    if (DeviceEntity.WorkParmaterEnable)
                    {
                        if (wValue.ParseToInt() == 1)
                        {
                            _ = this.ProcessData();
                        }
                    }
                    break;
                case (int)DMSDataClass.TechnologyData:
                    if (DeviceEntity.NCEnable)
                    {
                        if (wValue.ParseToInt() == 1)
                        {
                            _ = this.TechnologyChange();
                        }
                    }

                    break;
                case (int)DMSDataClass.PositionData:

                    //await this.PositionData(dataSource, notification.Value.Value);

                    break;
                default:
                    break;
            }
        }



        public override Task DeviceStatus(DataSourceEntity dataSource, object wValue)
        {
            int wDeviceStatus = StringUtils.parseInt(wValue);

            if (FirstClose && DeviceStatusBuffer == wDeviceStatus)
                return Task.CompletedTask;

            FirstClose = true;
            DeviceStatusBuffer = (uint)wDeviceStatus;

            return Task.CompletedTask;
        }



        /// <summary>
        /// 生成过程数据并保存
        /// </summary>
        /// <returns></returns>
        public async Task ProcessData()
        {
            //如何单独获取大批变量的值
            Dictionary<int, List<DataSourceEntity>> wOPCDataSourceListDic = mDataSourceEntities.Where(i =>
            (i.DataCatalog == ((int)DMSDataClass.WorkParams) || i.DataCatalog == ((int)DMSDataClass.QualityParams)) && (i.DataAction == ((int)DMSDataActions.ReadOnly) || i.DataAction == ((int)DMSDataActions.ReadWrite))).GroupBy(p => p.ServerId).ToDictionary(p => p.Key, p => p.ToList());

            ServerClient wServerClient;

            List<DataValue> wDataValueList;

            Dictionary<String, DMSProcessRecordItem> wDMSProcessRecordItemList = new Dictionary<String, DMSProcessRecordItem>();
            DMSProcessRecordItem wDMSProcessRecordItem;
            foreach (int wServerId in wOPCDataSourceListDic.Keys)
            {
                wServerClient = this.GetServerClient(wServerId);

                if (wServerClient == null)
                    continue;

                if (wServerClient.ServerType == ((int)DMSServerTypes.OPC))
                {
                    wDataValueList = ((SimpleOpcUaClient)wServerClient).ReadNodes(wOPCDataSourceListDic[wServerId].Select(p => p.SourceAddress).ToList());
                }
                else
                {
                    wDataValueList = new List<DataValue>(wOPCDataSourceListDic[wServerId].Count);
                }
                if (wDataValueList == null || wDataValueList.Count <= 0)
                    continue;

                for (int i = 0; i < wOPCDataSourceListDic[wServerId].Count; i++)
                {
                    wDMSProcessRecordItem = new DMSProcessRecordItem();

                    wDMSProcessRecordItem.AssetNo = DeviceAssetNo;
                    wDMSProcessRecordItem.DeviceNo = DeviceEntity.Code;
                    wDMSProcessRecordItem.DeviceID = DeviceEntity.ID;
                    wDMSProcessRecordItem.DataClass = wOPCDataSourceListDic[wServerId][i].DataCatalog;
                    wDMSProcessRecordItem.DataType = wOPCDataSourceListDic[wServerId][i].DataTypeCode;
                    wDMSProcessRecordItem.ParameterDesc = wOPCDataSourceListDic[wServerId][i].Description;
                    wDMSProcessRecordItem.ParameterID = wOPCDataSourceListDic[wServerId][i].ID;
                    wDMSProcessRecordItem.ParameterName = wOPCDataSourceListDic[wServerId][i].Name;
                    wDMSProcessRecordItem.ParameterNo = wOPCDataSourceListDic[wServerId][i].Code;
                    wDMSProcessRecordItem.SampleTime = DateTime.Now;

                    if (wOPCDataSourceListDic[wServerId][i].DataName.Equals("NCNo"))
                    {
                        wDMSProcessRecordItem.ParameterValue = ((SimpleFanucClient)wServerClient).NCProgramNo + "";
                    }
                    else
                    {
                        switch (wServerClient.ServerType)
                        {
                            case ((int)DMSServerTypes.OPC):

                                wDMSProcessRecordItem.ParameterValue = wDataValueList[i].GetStringValue(wDMSProcessRecordItem.DataType);
                                break;
                            case ((int)DMSServerTypes.Fanuc):
                                wDMSProcessRecordItem.ParameterValue = ((SimpleFanucClient)wServerClient).ReadNodeInt(wOPCDataSourceListDic[wServerId][i].SourceAddress)
                                    .ToString();
                                break;
                            default:
                                wDMSProcessRecordItem.ParameterValue = "";
                                break;
                        }
                    }

                    if (wDMSProcessRecordItemList.ContainsKey(wOPCDataSourceListDic[wServerId][i].DataName))
                        wDMSProcessRecordItemList[wOPCDataSourceListDic[wServerId][i].DataName] = wDMSProcessRecordItem;
                    else
                        wDMSProcessRecordItemList.Add(wOPCDataSourceListDic[wServerId][i].DataName, wDMSProcessRecordItem);
                }
            }
            await Task.Run(() =>
            {
                ServiceInstance.mDMSService.DMS_SyncProcessRecord(BaseDAO.SysAdmin, DeviceAssetNo, WorkpieceNo, OrderNo, ProductNo, wDMSProcessRecordItemList);
            });

        }


        /// <summary>
        /// NC程序变更
        /// </summary>
        /// <returns></returns>
#pragma warning disable CS1998 // 异步方法缺少 "await" 运算符，将以同步方式运行
        public override async Task ProgramNC()
        {

            //var wProgramResult = ServiceInstance.mDMSService.DMS_SelectCurrentProgramNC(BaseDAO.SysAdmin, -1, "", DeviceAssetNo, -1, ProductNo);
            //if (StringUtils.isNotEmpty(wProgramResult.FaultCode))
            //    return;
            //if (wProgramResult.Result == null || wProgramResult.Result.ID <= 0
            //    || StringUtils.isEmpty(wProgramResult.Result.FileSourcePath)
            //    || StringUtils.isEmpty(wProgramResult.Result.ProgramName)
            //    || StringUtils.isEmpty(wProgramResult.Result.DeviceFilePath))
            //    return;

            //String wText = File.ReadAllText(wProgramResult.Result.FileSourcePath);
            //String wProgramName = wProgramResult.Result.ProgramName;
            ////根据ProductNo 获取文件

            ////NC下发
            ////文件内容写入
            ////文件下发路径 //存储路径
            //String wUrl = wProgramResult.Result.DeviceFilePath;


            //本意不下发  主要发送产品型号


            //调用下发

        }

        /// <summary>
        /// Fanuc机床设置刀补信息  不启用
        /// </summary>
        /// <param name="wGroupNum"></param>
        /// <param name="wToolNum"></param>
        /// <param name="offX"></param>
        /// <param name="offZ"></param>
        /// <param name="offR"></param>
        /// <returns></returns>
#pragma warning disable CS1998 // 异步方法缺少 "await" 运算符，将以同步方式运行
        public override async Task<bool> ToolOffset(int wGroupNum, int wToolNum, double? offX = null, double? offZ = null, double? offR = null)
        {
            try
            {
                if (!DeviceEntity.ToolEnable)
                    return false;

                DataSourceEntity wCurrentToolNoEntity = mDataSourceEntities.FirstOrDefault(i => i.DataName.Equals("CurrentToolNo", StringComparison.CurrentCultureIgnoreCase));
                if (wCurrentToolNoEntity == null || wCurrentToolNoEntity.ID <= 0)
                    return false;

                SimpleFanucClient wSimpleFanucClient = this.GetServerClient<SimpleFanucClient>(wCurrentToolNoEntity.ServerId);
                if (wSimpleFanucClient == null)
                {
                    return false;
                }
                if (wGroupNum <= 0)
                    wGroupNum = 1;
                if (offX != null)
                {
                    //string toolXAddress = string.Format("ns=2;s=/Tool/Compensation/edgeData[u{0},c{1},12]", wGroupNum, wToolNum);
                    // wSimpleFanucClient.WriteNode(toolXAddress, offX);
                }
                if (offZ != null)
                {
                    //string toolZAddress = string.Format("ns=2;s=/Tool/Compensation/edgeData[u{0},c{1},13]", wGroupNum, wToolNum);
                    // wSimpleFanucClient.WriteNode(toolZAddress, offZ);
                }
                if (offR != null)
                {
                    //string toolRAddress = string.Format("ns=2;s=/Tool/Compensation/edgeData[u{0},c{1},15]", wGroupNum, wToolNum);
                    // wSimpleFanucClient.WriteNode(toolRAddress, offR);
                }
                return true;
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                return false;
            }
        }

        /// <summary>
        /// Fanuc机床获取刀具信息
        /// </summary>
        /// <param name="wGroupNum"></param>
        /// <returns></returns>
        public override List<DMSToolInfoEntity> GetToolInfo(short wGroupNum = 1)
        {
            List<DMSToolInfoEntity> wResult = new List<DMSToolInfoEntity>();
            try
            {
                if (!DeviceEntity.ToolEnable)
                    return wResult;
                 
                DataSourceEntity wCurrentToolNoEntity = mDataSourceEntities.FirstOrDefault(i => i.DataName.Equals("CurrentToolNo", StringComparison.CurrentCultureIgnoreCase));
                if (wCurrentToolNoEntity == null || wCurrentToolNoEntity.ID <= 0)
                    return wResult;
                 
                SimpleFanucClient wSimpleFanucClient = this.GetServerClient<SimpleFanucClient>(wCurrentToolNoEntity.ServerId);
                if (wSimpleFanucClient == null)
                {
                    return wResult;
                }
                 
                List<Fanuc.ODBTG> wODBTGList = wSimpleFanucClient.GetToolLife(out List<String> wErrorList, (short)wGroupNum);

                if (wErrorList != null && wErrorList.Count > 0) {
                    foreach (var item in wErrorList)
                    {
                        logger.ErrorFormat("GetToolLife GroupNum：{0} error:", item);
                    } 
                }

                if (wODBTGList == null || wODBTGList.Count <= 0) { 
                    return wResult;
                }

                

                List<int> wToolIndexList = new List<int>();
                foreach (Fanuc.ODBTG wIODBTR in wODBTGList)
                { 
                    if (wIODBTR.grp_num <= 0 || wIODBTR.data == null)
                        continue;
                     

                    wToolIndexList.Clear();

                    AddToolInfoEntity(wIODBTR, wResult, wToolIndexList, wIODBTR.data.data1);
                    AddToolInfoEntity(wIODBTR, wResult, wToolIndexList, wIODBTR.data.data2);
                    AddToolInfoEntity(wIODBTR, wResult, wToolIndexList, wIODBTR.data.data3);
                    AddToolInfoEntity(wIODBTR, wResult, wToolIndexList, wIODBTR.data.data4);
                    AddToolInfoEntity(wIODBTR, wResult, wToolIndexList, wIODBTR.data.data5);
                    AddToolInfoEntity(wIODBTR, wResult, wToolIndexList, wIODBTR.data.data6);
                    AddToolInfoEntity(wIODBTR, wResult, wToolIndexList, wIODBTR.data.data7);
                    AddToolInfoEntity(wIODBTR, wResult, wToolIndexList, wIODBTR.data.data8);
                    AddToolInfoEntity(wIODBTR, wResult, wToolIndexList, wIODBTR.data.data9);
                    AddToolInfoEntity(wIODBTR, wResult, wToolIndexList, wIODBTR.data.data10);
                    AddToolInfoEntity(wIODBTR, wResult, wToolIndexList, wIODBTR.data.data11);
                    AddToolInfoEntity(wIODBTR, wResult, wToolIndexList, wIODBTR.data.data12);
                }


            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

 

        private void AddToolInfoEntity(Fanuc.ODBTG wIODBTR, List<DMSToolInfoEntity> wResult, List<int> wToolIndexList, Fanuc.ODBTG_data wODBTG_data)
        {
            if (wODBTG_data != null && wODBTG_data.tool_num > 0 && !wToolIndexList.Contains(wODBTG_data.tool_num))
            {

                wToolIndexList.Add(wODBTG_data.tool_num);

                DMSToolInfoEntity wDMSToolInfoEntity = new DMSToolInfoEntity();

                wDMSToolInfoEntity.DeviceID = DeviceEntity.ID; 
                wDMSToolInfoEntity.ToolIndex = wODBTG_data.tool_num;
                wDMSToolInfoEntity.ToolHouseIndex = wIODBTR.grp_num;
                wDMSToolInfoEntity.RemainLife = wIODBTR.count;
                wDMSToolInfoEntity.TargetLife = wIODBTR.life;
                wDMSToolInfoEntity.ToolOffsetX = wODBTG_data.length_num;
                wDMSToolInfoEntity.ToolOffsetR = wODBTG_data.radius_num;
                wDMSToolInfoEntity.Status = wODBTG_data.tinfo;
                wResult.Add(wDMSToolInfoEntity);

            }
        }


    }
}
