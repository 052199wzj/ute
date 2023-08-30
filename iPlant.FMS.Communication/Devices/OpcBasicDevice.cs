using iPlant.Common.Tools;
using iPlant.FMC.Service;
using iPlant.FMS.Models;
using Opc.Ua;
using Opc.Ua.Client;
using ShrisCommunicationCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace iPlant.FMS.Communication
{

    public class OpcBasicDevice : BasicDevice, IDisposable
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(OpcBasicDevice));
        public OpcBasicDevice(DeviceEntity deviceEntity, CommunicationServerManager wCommunicationServerManager, List<DataSourceEntity> wOPCDataSourceEntities)
            : base(deviceEntity, wCommunicationServerManager, wOPCDataSourceEntities)
        {


        }


        private Boolean mLineCallState = false;

        private Timer mOnlineTimer = null;
        private Boolean mOnlineState = false;

        private Thread mMatchineAlarmThread;


        private Dictionary<String, List<String>> WorkpiecePosition = new Dictionary<string, List<string>>();


        protected override void DataHandlerStatusDefault(DataSourceEntity dataSource, Object wValue)
        {
            if (dataSource == null)
                return;
            if (wValue == null)
                wValue = "";

            switch (dataSource.DataName)
            {

                //产线工件请求
                case "LoadRequest":
                    if (wValue.ParseToInt() == 1)
                    {
                        _ = this.WriteMaterialUpLoadInfo();
                    }
                    break;
                case "LoadWorkpieceResponse":
                    if (wValue.ParseToInt() == 0)
                    {
                        _ = this.WriteMaterialUpLoadInfo(true);
                    }
                    break;
                //在线
                case "Online":
                    if (mOnlineTimer == null)
                    {
                        mOnlineState = wValue.ParseToInt() == 1;
                        mOnlineTimer = new Timer((state) =>
                        {
                            mOnlineState = !mOnlineState;
                            this.WriteNode(dataSource, mOnlineState);
                        }, null, 1000, 1000);

                    }
                    //延时
                    System.Threading.Thread.Sleep(1000);

                    return;
                //产线下料请求
                case "DownLoadRequest":
                    if (wValue.ParseToInt() == 1)
                    {
                        _ = this.ReadMaterialDownLoadInfo();
                        return;
                    }
                    break;
                //废料AGV请求
                case "ScarpFull":
                    if (wValue.ParseToInt() == 1)
                    {
                        _ = this.WriteAgvResponse((int)WMSAgvTaskTypes.Scrap);
                    }
                    break;
                //成品AGV请求
                case "ProductFull":
                    if (wValue.ParseToInt() == 1)
                    {
                        _ = this.WriteAgvResponse((int)WMSAgvTaskTypes.Product);
                    }
                    break;
                //订单请求
                case "OrderRequest":
                    if (wValue.ParseToInt() == 1)
                    {
                        _ = this.WriteOrderInfo();
                    }
                    break;
                case "LineCall":
                    if (wValue.ParseToInt() == 1)
                    {
                        if (!mLineCallState)
                            _ = this.LineCall();
                    }
                    else
                    {
                        _ = this.LineCall(false);
                    }
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
                        this.DeviceParameters(dataSource, wValue);
                    }
                    break;

                //设备作业完成
                case (int)DMSDataClass.WorkParams:
                    if (DeviceEntity.WorkParmaterEnable)
                    {
                        if (wValue.ParseToInt() == 1)
                        {
                            this.ProcessData(true);
                        }
                    }
                    break;
                //设备工艺请求    
                case (int)DMSDataClass.TechnologyData:
                    if (DeviceEntity.NCEnable)
                    {
                        if (wValue.ParseToInt() == 1)
                        {
                            this.TechnologyChange();
                        }
                    }
                    break;
                case (int)DMSDataClass.PositionData:

                    this.PositionData(dataSource, wValue);

                    break;
                default:
                    break;
            }


        }

        /// <summary>
        /// 监听设备是否关机 以及设备是否有数控报警
        /// </summary>
        public override void MachineStatus()
        {
            try
            {
                if (mMatchineStatusState)
                    return;

                mMatchineStatusState = true;


                mMatchineAlarmThread = new Thread(() =>
                {
                    try
                    {
                        while (mMatchineStatusState)
                        {
                            try
                            {
                                Thread.Sleep(5000);

                                //同步设备状态

                                this.MachineAlarmCall();
                            }
                            catch (Exception ex)
                            {
                                logger.Error("MachineAlarm Thread MachineAlarmCall", ex);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        logger.Error("MachineAlarm Thread while", ex);
                    }

                });

                mMatchineAlarmThread.Start();
                //设备数控报警 
            }
            catch (Exception ex)
            {
                logger.Error("MachineAlarm", ex);
            }
        }

        /// <summary>
        ///   设备数控报警 todo
        /// </summary>
        private void MachineAlarmCall()
        {

            try
            {

                this.MachineAlarmCall_TurnOn();
                this.MachineAlarmCall_Change();

                DataSourceEntity wAlarmCodeEntity = mDataSourceEntities.FirstOrDefault(i => i.DataAction == ((int)DMSDataActions.ReadOnly) && i.DataCatalog == ((int)DMSDataClass.Alarm) && "MachineAlarmCode".Equals(i.DataName));

                if (wAlarmCodeEntity == null || wAlarmCodeEntity.ID <= 0 || wAlarmCodeEntity.ServerId <= 0)
                {
                    return;
                }

                SimpleOpcUaClient wSimpleOpcUaClient = this.GetServerClient<SimpleOpcUaClient>(wAlarmCodeEntity.ServerId);

                if (wSimpleOpcUaClient == null || !wSimpleOpcUaClient.IsConnected)
                {
                    return;
                }
                //待测试
                String wAlarmCountAddress = "ns=2;s=/Nck/State/numAlarms";

                DataValue wAlarmCount = wSimpleOpcUaClient.ReadNode(wAlarmCountAddress);

                if (wAlarmCount == null || wAlarmCount.Value == null)
                {
                    return;

                }
                int counts = wAlarmCount.Value.ParseToInt();
                if (counts <= 0)
                    return;
                List<string> tags = new List<string>();



                for (int i = 1; i <= counts; i++)
                {
                    //报警号
                    tags.Add(string.Format("ns=2;s=/Nck/LastAlarm/alarmNo[{0}]", i));
                    //报警信息地址未知
                    //tags.Add(string.Format("ns=2;s=/Nck/LastAlarm/alarmNo[{0}]", i));
                }
                List<DataValue> dataValues = wSimpleOpcUaClient.ReadNodes(tags);

                if (dataValues == null || dataValues.Count <= 0)
                {
                    return;
                }
                Dictionary<String, String> wDic = new Dictionary<string, string>();


                int wCount = dataValues.Count / counts;

                for (int i = 0; i < dataValues.Count; i += wCount)
                {
                    if (dataValues[i] == null || dataValues[i].Value == null)
                        continue;

                    if (wCount > 1 && i < dataValues.Count - 1 && dataValues[i + 1] != null && dataValues[i + 1].Value != null)
                    {
                        wDic.Add(dataValues[i].Value.ToString(), dataValues[i + 1].Value.ToString());
                    }
                    else
                    {
                        wDic.Add(dataValues[i].Value.ToString(), "");
                    }
                }


                if (wDic.Count > 0)
                {
                    _ = this.DeviceAlarms(wAlarmCodeEntity, wDic);
                }

            }
            catch (Exception ex)
            {
                logger.Error("MachineAlarmCall", ex);
            }

        }


        private void MachineAlarmCall_TurnOn()
        {
            try
            {
                //同步设备状态
                //

                DataSourceEntity wTurnOnEntity = mDataSourceEntities.FirstOrDefault(i => i.DataCatalog == ((int)DMSDataClass.Status) && "TurnOn".Equals(i.DataName));
                SimpleOpcUaClient wSimpleOpcUaClient = null;
                if (wTurnOnEntity != null && wTurnOnEntity.ID > 0 && wTurnOnEntity.ServerId > 0)
                {
                    wSimpleOpcUaClient = this.GetServerClient<SimpleOpcUaClient>(wTurnOnEntity.ServerId);

                    if (wSimpleOpcUaClient != null && !wSimpleOpcUaClient.IsConnected)
                    {
                        this.DeviceStatusClose();
                        //return;
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error("MachineAlarmCall_TurnOn", ex);
            }

        }

        private void MachineAlarmCall_Change()
        {
            try
            {
                DataSourceEntity wLineProductChange = mDataSourceEntities.FirstOrDefault(i => i.DataCatalog == ((int)DMSDataClass.WorkParams) && "LineProductChange".Equals(i.DataName));
                if (wLineProductChange == null || wLineProductChange.ID <= 0 || wLineProductChange.ServerId <= 0)
                    return;

                SimpleOpcUaClient wSimpleOpcUaClient = this.GetServerClient<SimpleOpcUaClient>(wLineProductChange.ServerId);

                if (wSimpleOpcUaClient == null || !wSimpleOpcUaClient.IsConnected)
                    return;

                if (wSimpleOpcUaClient.ReadNode(wLineProductChange.SourceAddress).Value.ParseToInt() != 1)
                    return;


                //判断当前订单的换型单是否已被确认
                //将订单信息读出并对比
                DataSourceEntity wOrderDataSourceEntity = mDataSourceEntities.FirstOrDefault(i => i.DataCatalog == ((int)DMSDataClass.WorkParams) && i.DataName.Equals("OrderNo", StringComparison.CurrentCultureIgnoreCase));
                if (wOrderDataSourceEntity == null)
                    return;

                String wOrderNo = this.ReadNodeBase(wOrderDataSourceEntity);

                if (StringUtils.isEmpty(wOrderNo))
                    return;


                ServiceResult<OMSChangeProduct> wOMSChangeProductServiceResult = ServiceInstance.mOMSService.OMS_SelectChangeProductByOrder(BaseDAO.SysAdmin, DeviceEntity.LineID, wOrderNo);
                if (wOMSChangeProductServiceResult == null || wOMSChangeProductServiceResult.Result == null || wOMSChangeProductServiceResult.Result.ID <= 0)
                    return;

                if (wOMSChangeProductServiceResult.Result.Status == 2)
                {
                    wSimpleOpcUaClient.WriteNode(wLineProductChange.SourceAddress, false);
                }
            }
            catch (Exception ex)
            {
                logger.Error("MachineAlarmCall_Change", ex);
            }

        }

        public override async Task DeviceAlarms(DataSourceEntity dataSource, object wValue)
        {

            if (wValue is Dictionary<String, String>)
            {
                Dictionary<String, String> wValueDic = (Dictionary<String, String>)wValue;

                Dictionary<String, DataSourceEntity> wDataSourceEntityDic = mDataSourceEntities.Where(i =>
                i.DataAction == ((int)DMSDataActions.Default) && i.DataCatalog == ((int)DMSDataClass.Alarm)).GroupBy(p => p.DataName).ToDictionary(p => p.Key, p => p.First());

                if (mMatchineStatusState)
                {
                    DMSDeviceParameter wDMSDeviceParameter;
                    DataSourceEntity wDataSourceEntity;
                    //判断配置中是否包含报警
                    foreach (var item in wValueDic.Keys)
                    {
                        if (wDataSourceEntityDic.ContainsKey(item))
                        {
                            continue;
                        }

                        wDMSDeviceParameter = DMSDeviceParameter.Create(StringUtils.isEmpty(wValueDic[item]) ? item : wValueDic[item],
                            item, DeviceEntity.ID, dataSource.ServerId, ((int)DMSDataTypes.String), (int)DMSDataClass.Alarm, DMSServerTypes.OPC.ToString(), "customer", "", 0);

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


        /// <summary>
        /// 生成过程数据并保存
        /// </summary>
        /// <returns></returns>
        public void ProcessData(bool wRes)
        {
            //如何单独获取大批变量的值
            Dictionary<int, List<DataSourceEntity>> wOPCDataSourceListDic = mDataSourceEntities.Where(i =>
            (i.DataCatalog == ((int)DMSDataClass.WorkParams) || i.DataCatalog == ((int)DMSDataClass.QualityParams))
            && (i.DataAction == ((int)DMSDataActions.ReadOnly) || i.DataAction == ((int)DMSDataActions.ReadWrite))).GroupBy(p => p.ServerId).ToDictionary(p => p.Key, p => p.ToList());

            SimpleOpcUaClient wServerClient;
            List<DataValue> wDataValueList;

            Dictionary<String, DMSProcessRecordItem> wDMSProcessRecordItemList = new Dictionary<String, DMSProcessRecordItem>();
            DMSProcessRecordItem wDMSProcessRecordItem;
            foreach (int wServerId in wOPCDataSourceListDic.Keys)
            {
                wServerClient = this.GetServerClient<SimpleOpcUaClient>(wServerId);

                if (wServerClient == null)
                    continue;

                wDataValueList = wServerClient.ReadNodes(wOPCDataSourceListDic[wServerId].Select(p => p.SourceAddress).ToList());
                if (wDataValueList == null)
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
                    wDMSProcessRecordItem.ParameterValue = wDataValueList[i].GetStringValue(wDMSProcessRecordItem.DataType);
                    if (wDMSProcessRecordItemList.ContainsKey(wOPCDataSourceListDic[wServerId][i].DataName))
                        wDMSProcessRecordItemList[wOPCDataSourceListDic[wServerId][i].DataName] = wDMSProcessRecordItem;
                    else
                        wDMSProcessRecordItemList.Add(wOPCDataSourceListDic[wServerId][i].DataName, wDMSProcessRecordItem);

                }
            }


            ServiceInstance.mDMSService.DMS_SyncProcessRecord(BaseDAO.SysAdmin, DeviceAssetNo, WorkpieceNo, OrderNo, ProductNo, wDMSProcessRecordItemList);

            if (wRes)
            {
                DataSourceEntity wFinishedResponseEntity = mDataSourceEntities.FirstOrDefault(i => i.DataName.Equals("FinishedResponse", StringComparison.CurrentCultureIgnoreCase));
                if (wFinishedResponseEntity != null)
                {
                    this.WriteNode(wFinishedResponseEntity, true);
                }
                else
                {
                    wFinishedResponseEntity = mDataSourceEntities.FirstOrDefault(i => i.DataName.Equals("Finished", StringComparison.CurrentCultureIgnoreCase));
                    this.WriteNode(wFinishedResponseEntity, false);
                }
                //响应
            }

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


            //调用下发

        }

#pragma warning disable CS1998 // 异步方法缺少 "await" 运算符，将以同步方式运行
        public void PositionData(DataSourceEntity dataSource, object wValue)
        {
            this.DeviceParameters(dataSource, wValue);

            if (dataSource.DescriptionValue.Count <= 0)
                return;

            String wWorkpieceNo = wValue == null ? "" : wValue.ToString();
            Boolean wIsChange = false;
            foreach (String wPosition in dataSource.DescriptionValue)
            {
                if (!int.TryParse(wPosition, out int wAssetNo))
                    continue;

                if (!WorkpiecePosition.ContainsKey(wPosition))
                {
                    WorkpiecePosition.Add(wPosition, new List<string>());
                }
                if (dataSource.DataIndex < 0)
                    dataSource.DataIndex = 0;
                while (dataSource.DataIndex >= WorkpiecePosition[wPosition].Count)
                {
                    WorkpiecePosition[wPosition].Add(null);
                }
                if (!wWorkpieceNo.Equals(WorkpiecePosition[wPosition][dataSource.DataIndex]))
                {
                    WorkpiecePosition[wPosition][dataSource.DataIndex] = wWorkpieceNo;
                    wIsChange = true;
                }
            }
            if (wIsChange)
            {
                OnPropertyChanged("WorkpiecePosition", WorkpiecePosition, WorkpiecePosition);
            }

        }

        public async Task WriteOrderInfo()
        {
            //订单请求已收到

            //获取当前生产订单
            // ServiceInstance.mOMSService.OMS_QueryOrderByStatus

            List<DataSourceEntity> wWorkPartDataSourceListDic = mDataSourceEntities.FindAll(i =>
              (i.DataCatalog == (int)DMSDataClass.WorkParams));

            //将订单信息读出并对比
            DataSourceEntity wOrderDataSourceEntity = wWorkPartDataSourceListDic.FirstOrDefault(i => i.DataName.Equals("OrderNo", StringComparison.CurrentCultureIgnoreCase));
            if (wOrderDataSourceEntity == null)
            {
                logger.Info("DataSource OrderNo Not Setup");
                return;
            }
            String wOrderNo = this.ReadNodeBase(wOrderDataSourceEntity);
            OMSOrder wOMSOrder = null;
            if (StringUtils.isNotEmpty(wOrderNo))
            {

                wOMSOrder = ServiceInstance.mOMSService.OMS_QueryOrderByNo(BaseDAO.SysAdmin, wOrderNo).Result;
                //订单上料未完成且订单处于执行中或待执行状态 不允许更换订单

                //订单不存在 或者订单上料完成 或者订单状态不为生成中和待执行 切换订单
                if (wOMSOrder == null || wOMSOrder.ID <= 0 || wOMSOrder.FeedFQTY >= wOMSOrder.PlanFQTY
                    || (wOMSOrder.Status != ((int)OMSOrderStatus.ProductOrder) && wOMSOrder.Status != ((int)OMSOrderStatus.WeekPlantOrder)))
                {
                    String wProductNo = wOMSOrder.ProductNo;
                    int wOldOrderID = wOMSOrder.ID;
                    wOMSOrder = ServiceInstance.mOMSService.OMS_QueryCurrentOrder(BaseDAO.SysAdmin, -1, DeviceEntity.LineID,"","").Result;
                    if (!wOMSOrder.ProductNo.Equals(wProductNo))
                    {
                        //生成换型确认单
                        ServiceInstance.mOMSService.OMS_CreateChangeProduct(BaseDAO.SysAdmin, wOMSOrder.LineID, wOldOrderID, wOMSOrder.ID);
                        //调用LineCall 写入报警
                        //await this.LineCall(true, "换型确认");
                        //换型报警 
                        //写入报警  
                        var wLineCallEntity = mDataSourceEntities.FirstOrDefault(i =>
                            (i.DataCatalog == (int)DMSDataClass.Params && "LineProductChange".Equals(i.DataName)));
                        if (wLineCallEntity != null && wLineCallEntity.ID > 0)
                        {
                            this.WriteNode(wLineCallEntity, true);
                        }
                    }
                }

            }
            else
            {
                wOMSOrder = ServiceInstance.mOMSService.OMS_QueryCurrentOrder(BaseDAO.SysAdmin, -1, DeviceEntity.LineID,"","").Result;
            }

            if (wOMSOrder != null && wOMSOrder.ID > 0 && StringUtils.isNotEmpty(wOMSOrder.OrderNo))
            {
                //产线换单
                await this.WriteOrderInfo(wOMSOrder);
                //获取所有设备对象 对所有设备发送订单


                //所有设备换单
                LineManager wLineManager = LineManager.getInstance(DeviceEntity.LineID);
                if (wLineManager != null && wLineManager.mBasicDeviceDic != null && wLineManager.mBasicDeviceDic.Count > 0)
                {
                    foreach (BasicDevice wBasicDevice in wLineManager.mBasicDeviceDic.Values)
                    {
                        if (wBasicDevice == null || wBasicDevice.DeviceEntity == null)
                            continue;
                        if (wBasicDevice.DeviceEntity.ID == this.DeviceEntity.ID)
                            continue;
                        await wBasicDevice.WriteOrderInfo(wOMSOrder);
                    }

                }

                ServiceInstance.mQMSService.QMS_ClearWorkpieceNoByChangeOrderNo(BaseDAO.SysAdmin, wOMSOrder.LineID, wOMSOrder.OrderNo);
            }
            else
            {
                logger.Info("Current Order Not Exists");
            }
        }


        //产线呼叫
        public async Task LineCall(Boolean wLineCallState = true, String wMsg = "")
        {
            mLineCallState = wLineCallState;
            try
            {
                if (StringUtils.isEmpty(wMsg))
                {

                    wMsg = "产线呼叫";
                }

                //查询产线呼叫是否存在 
                ServiceResult<List<IPTRecordItem>> wIPTRecordItemListServiceResult = ServiceInstance.mIPTService.IPT_SelectRecordItemList(BaseDAO.SysAdmin,
                    -1, -1, DeviceEntity.LineID, -1, -1, "", ((int)IPTTypes.Exception), -1,
                   -1, "", "", "", -1, -1, new DateTime(2000, 1, 1), new DateTime(2000, 1, 1),
                     1, Pagination.Default);

                if (wIPTRecordItemListServiceResult != null && StringUtils.isEmpty(wIPTRecordItemListServiceResult.FaultCode)
                    && wIPTRecordItemListServiceResult.Result != null && wIPTRecordItemListServiceResult.Result.Count > 0)
                {

                    if (!wLineCallState)
                    {

                        foreach (var item in wIPTRecordItemListServiceResult.Result)
                        {
                            item.EditTime = DateTime.Now;
                            item.Status = 2;
                            ServiceInstance.mIPTService.IPT_UpdateRecordItem(BaseDAO.SysAdmin, item);
                        }

                    }

                    return;
                }

                IPTRecordItem wIPTRecordItem = new IPTRecordItem();
                wIPTRecordItem.IPTType = ((int)IPTTypes.Exception);
                wIPTRecordItem.ModeType = 1;
                wIPTRecordItem.ItemName = wMsg;
                wIPTRecordItem.MainID = DeviceEntity.ID;
                wIPTRecordItem.LineID = DeviceEntity.LineID;
                wIPTRecordItem.ItemResult = new List<IPTRecordItemValue>();
                wIPTRecordItem.ItemResult.Add(new IPTRecordItemValue());
                wIPTRecordItem.Status = 1;
                wIPTRecordItem.CreateTime = DateTime.Now;
                ServiceInstance.mIPTService.IPT_UpdateRecordItem(BaseDAO.SysAdmin, wIPTRecordItem);

            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }


            //

            //不存在新增产线呼叫记录
            //

        }

        /// <summary>
        /// 产线上料
        /// </summary>
        /// <returns></returns>
#pragma warning disable CS1998 // 异步方法缺少 "await" 运算符，将以同步方式运行
        public async Task WriteMaterialUpLoadInfo(bool wIsHandle = false)
        {
            if (wIsHandle)
            {
                DataSourceEntity wLoadRequestEntity = mDataSourceEntities.FirstOrDefault(i => i.DataName.Equals("LoadRequest", StringComparison.CurrentCultureIgnoreCase));

                if (this.ReadNodeBase(wLoadRequestEntity).ParseToInt() != 1)
                    return;
            }

            DataSourceEntity wLoadWorkpieceResponseEntity = mDataSourceEntities.FirstOrDefault(i => i.DataName.Equals("LoadWorkpieceResponse", StringComparison.CurrentCultureIgnoreCase));


            DataSourceEntity wOrderNoEntity = mDataSourceEntities.FirstOrDefault(i => i.DataName.Equals("OrderNo", StringComparison.CurrentCultureIgnoreCase));
            if (wOrderNoEntity == null)
            {
                logger.Info(System.Reflection.MethodBase.GetCurrentMethod().Name + " OrderNo Entity   NOT Exists");
                //if (wLoadWorkpieceResponseEntity != null)
                //    this.WriteNode(wLoadWorkpieceResponseEntity, 1);
                return;
            }

            //获取工件号写入地址
            DataSourceEntity wLoadWorkpieceNoEntity = mDataSourceEntities.FirstOrDefault(i => i.DataName.Equals("LoadWorkpieceNo", StringComparison.CurrentCultureIgnoreCase));
            if (wLoadWorkpieceNoEntity == null)
            {
                logger.Info(System.Reflection.MethodBase.GetCurrentMethod().Name + " LoadWorkpieceNo Entity   NOT Exists");
                //if (wLoadWorkpieceResponseEntity != null)
                //    this.WriteNode(wLoadWorkpieceResponseEntity, 1);
                return;
            }

            int wNumber = 1;
            DataSourceEntity wWorkpieceNumberEntity = mDataSourceEntities.FirstOrDefault(i => i.DataName.Equals("WorkpieceNumber", StringComparison.CurrentCultureIgnoreCase));
            //获取写入数量
            if (wWorkpieceNumberEntity != null)
            {
                wNumber = StringUtils.parseInt(this.ReadNodeBase(wWorkpieceNumberEntity));
            }

            String wOrderNo = this.ReadNodeBase(wOrderNoEntity);

            OMSOrder wOMSOrder = ServiceInstance.mOMSService.OMS_QueryOrderByNo(BaseDAO.SysAdmin, wOrderNo).Result;

            if (wOMSOrder == null || wOMSOrder.ID <= 0)
            {
                logger.Info(System.Reflection.MethodBase.GetCurrentMethod().Name + " Order NOT Exists " + wOrderNo);
                this.WriteNode(wLoadWorkpieceNoEntity, "");//需要更换订单
                if (wLoadWorkpieceResponseEntity != null)
                    this.WriteNode(wLoadWorkpieceResponseEntity, 1);
                return;
            }

            //获取数量对应的工件号列表
            ServiceResult<List<QMSWorkpiece>> wServiceResult = ServiceInstance.mQMSService.QMS_CreateWorkpiece(BaseDAO.SysAdmin, wOMSOrder.ID, wNumber);
            if (StringUtils.isNotEmpty(wServiceResult.FaultCode) || wServiceResult.Result == null || wServiceResult.Result.Count != wNumber)
            {
                logger.Info(System.Reflection.MethodBase.GetCurrentMethod().Name + " CreateWorkpiece Error :" + wServiceResult.FaultCode);
                this.WriteNode(wLoadWorkpieceNoEntity, "");//需要更换订单
                if (wLoadWorkpieceResponseEntity != null)
                    this.WriteNode(wLoadWorkpieceResponseEntity, 1);
                return;
            }

            //写入工件号 
            foreach (QMSWorkpiece wQMSWorkpiece in wServiceResult.Result)
            {
                if (wQMSWorkpiece == null || wQMSWorkpiece.ID <= 0)
                    continue;

                this.WriteNode(wLoadWorkpieceNoEntity, wQMSWorkpiece.WorkpieceNo);

                if (wLoadWorkpieceResponseEntity != null)
                    this.WriteNode(wLoadWorkpieceResponseEntity, true);
            }

        }
        /// <summary>
        /// 产线下料
        /// </summary>
        /// <returns></returns>
#pragma warning disable CS1998 // 异步方法缺少 "await" 运算符，将以同步方式运行
        public async Task ReadMaterialDownLoadInfo()
        {
            DataSourceEntity wDownWorkpieceResponseEntity = mDataSourceEntities.FirstOrDefault(i => i.DataName.Equals("DownWorkpieceResponse", StringComparison.CurrentCultureIgnoreCase));

            //获取工件号读取地址列表
            DataSourceEntity wDownWorkpieceNoEntity = mDataSourceEntities.FirstOrDefault(i => i.DataName.Equals("DownWorkpieceNo", StringComparison.CurrentCultureIgnoreCase));

            if (wDownWorkpieceNoEntity == null)
            {
                logger.Info(System.Reflection.MethodBase.GetCurrentMethod().Name + " DownWorkpieceNo Entity   NOT Exists");
                return;
            }

            String wWorkpieceNo = this.ReadNodeBase(wDownWorkpieceNoEntity);

            if (StringUtils.isEmpty(wWorkpieceNo))
            {
                logger.Info(System.Reflection.MethodBase.GetCurrentMethod().Name + " WorkpieceNo is Empty");
                return;
            }

            this.ProcessData(false);

            //将工件号状态变更为完成
            ServiceResult<bool> wServiceResult = ServiceInstance.mQMSService.QMS_UpdateWorkpieceStatus(BaseDAO.SysAdmin, wWorkpieceNo, "", ((int)OMSWorkpieceStatus.Done), "完成下料");
            if (StringUtils.isNotEmpty(wServiceResult.FaultCode) || !wServiceResult.Result)
            {
                logger.Info(System.Reflection.MethodBase.GetCurrentMethod().Name + " UpdateWorkpieceStatus Error: " + wServiceResult.FaultCode);
                return;
            }


            //写入读取完成信号
            if (wDownWorkpieceResponseEntity != null)
                this.WriteNode(wDownWorkpieceResponseEntity, true);

        }

        /// <summary>
        /// AGV调度请求
        /// </summary>
        /// <param name="wIsDone"></param>
        /// <returns></returns>
#pragma warning disable CS1998 // 异步方法缺少 "await" 运算符，将以同步方式运行
        public async Task WriteAgvResponse(int wTaskType)
        {
            if (wTaskType <= 0)
                return;
            try
            {
                DataSourceEntity wDeliveryNumEntity = null;
                switch (wTaskType)
                {
                    case ((int)WMSAgvTaskTypes.Product):

                        wDeliveryNumEntity = mDataSourceEntities.FirstOrDefault(i => i.DataName.Equals("ProductNum", StringComparison.CurrentCultureIgnoreCase));

                        break;
                    case ((int)WMSAgvTaskTypes.Scrap):
                        wDeliveryNumEntity = mDataSourceEntities.FirstOrDefault(i => i.DataName.Equals("ScarpNum", StringComparison.CurrentCultureIgnoreCase));

                        break;
                    default:
                        return;
                }

                String wDeliveryNumTemp = this.ReadNodeBase(wDeliveryNumEntity);
                //获取调度数量 //调度数量《=0 return;
                if (int.TryParse(wDeliveryNumTemp, out int wDeliveryNum) && wDeliveryNum > 0)
                {
                    //创建AGV调度任务 
                    WMSAgvTask wWMSAgvTask = new WMSAgvTask();
                    //wWMSAgvTask.DeviceID = DeviceEntity.ID;
                    wWMSAgvTask.TaskType = wTaskType;
                    wWMSAgvTask.SourcePositionID = DeviceEntity.ID;
                    wWMSAgvTask.DeliveryNum = wDeliveryNum; //任务数量
                    wWMSAgvTask.Status = ((int)WMSAgvTaskStatus.WiatConfirm);
                    //保存调度任务 内部会检查是否重复
                    ServiceInstance.mWMSService.WMS_UpdateAgvTask(BaseDAO.SysAdmin, wWMSAgvTask);


                }

            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
        }
        public override async Task<bool> ToolOffset(int wGroupNum, int wToolNum, double? offX = null, double? offZ = null, double? offR = null)
        {
            try
            {
                if (!DeviceEntity.ToolEnable)
                    return false;

                DataSourceEntity wCurrentToolNoEntity = mDataSourceEntities.FirstOrDefault(i => i.DataName.Equals("CurrentToolNo", StringComparison.CurrentCultureIgnoreCase));
                if (wCurrentToolNoEntity == null || wCurrentToolNoEntity.ID <= 0)
                    return false;

                SimpleOpcUaClient wSimpleOpcUaClient = this.GetServerClient<SimpleOpcUaClient>(wCurrentToolNoEntity.ServerId);
                if (wSimpleOpcUaClient == null)
                {
                    return false;
                }
                if (wGroupNum <= 0)
                    wGroupNum = 1;
                if (offX != null)
                {
                    string toolXAddress = string.Format("ns=2;s=/Tool/Compensation/edgeData[u{0},c{1},12]", wGroupNum, wToolNum);
                    await wSimpleOpcUaClient.WriteNodeAsync(toolXAddress, offX / 2);
                }
                if (offZ != null)
                {
                    string toolZAddress = string.Format("ns=2;s=/Tool/Compensation/edgeData[u{0},c{1},13]", wGroupNum, wToolNum);
                    await wSimpleOpcUaClient.WriteNodeAsync(toolZAddress, offZ);
                }
                if (offR != null)
                {
                    string toolRAddress = string.Format("ns=2;s=/Tool/Compensation/edgeData[u{0},c{1},15]", wGroupNum, wToolNum);
                    await wSimpleOpcUaClient.WriteNodeAsync(toolRAddress, offR);
                }
                return true;
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                return false;
            }
        }

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



                SimpleOpcUaClient wSimpleOpcUaClient = this.GetServerClient<SimpleOpcUaClient>(wCurrentToolNoEntity.ServerId);
                if (wSimpleOpcUaClient == null)
                {
                    return wResult;
                }



                string toolCountAddress = string.Format("ns=2;s=/Tool/Catalogue/numTools[u{0}]", wGroupNum);
                DataValue toolCounts = wSimpleOpcUaClient.ReadNode(toolCountAddress);
                int counts = 0;
                if (toolCounts != null)
                {
                    if (toolCounts.Value != null)
                    {
                        counts = int.Parse(toolCounts.Value.ToString());
                    }
                }
                List<string> tags = new List<string>();

                for (int i = 1; i <= counts; i++)
                {
                    tags.Add(string.Format("ns=2;s=/Tool/Catalogue/toolIdent[u{0},{1}]", wGroupNum, i));      //刀具名称
                    tags.Add(string.Format("ns=2;s=/Tool/Catalogue/toolNo[u{0},{1}]", wGroupNum, i));         //刀具号
                    tags.Add(string.Format("ns=2;s=/Tool/Catalogue/toolInMag[u{0},{1}]", wGroupNum, i));      //
                    tags.Add(string.Format("ns=2;s=/Tool/Catalogue/toolInPlace[u{0},{1}]", wGroupNum, i));
                    tags.Add(string.Format("ns=2;s=/Tool/Supervision/data[u{0},c{1},4]", wGroupNum, i));       //刀具剩余寿命
                    tags.Add(string.Format("ns=2;s=/Tool/Compensation/edgeData[u{0},c{1},1]", wGroupNum, i));  //刀具类型
                    tags.Add(string.Format("ns=2;s=/Tool/Compensation/edgeData[u{0},c{1},3]", wGroupNum, i));  //刀具位置X
                    tags.Add(string.Format("ns=2;s=/Tool/Compensation/edgeData[u{0},c{1},4]", wGroupNum, i));  //刀具位置Z
                    tags.Add(string.Format("ns=2;s=/Tool/Compensation/edgeData[u{0},c{1},6]", wGroupNum, i));  //刀具位置R
                    tags.Add(string.Format("ns=2;s=/Tool/Compensation/edgeData[u{0},c{1},12]", wGroupNum, i)); //刀具刀补X
                    tags.Add(string.Format("ns=2;s=/Tool/Compensation/edgeData[u{0},c{1},13]", wGroupNum, i)); //刀具刀补Z
                    tags.Add(string.Format("ns=2;s=/Tool/Compensation/edgeData[u{0},c{1},15]", wGroupNum, i)); //刀具刀补R
                }

                int wTagCount = tags.Count / counts;
                 

                List<DataValue> dataValues = wSimpleOpcUaClient.ReadNodes(tags);
                 

                String wTemp = "";
                for (int i = 0; i < counts; i++)
                {
                    DMSToolInfoEntity toolListInfo = new DMSToolInfoEntity();
                    toolListInfo.DeviceID = DeviceEntity.ID;


                    if (dataValues[i * wTagCount + 1].Value != null)
                    {
                        toolListInfo.ToolIndex = int.Parse(dataValues[i * wTagCount + 1].Value.ToString()); 
                    }
                    else
                    {
                        continue;
                    }
                    if (dataValues[i * wTagCount + 2].Value != null)
                    {
                        toolListInfo.ToolHouseIndex = int.Parse(dataValues[i * wTagCount + 2].Value.ToString());
                         
                    }

                    if (dataValues[i * wTagCount + 4].Value != null)
                    {
                        toolListInfo.RemainLife = int.Parse(dataValues[i * wTagCount + 4].Value.ToString());
                    }

                    if (dataValues[i * wTagCount + 5].Value != null)
                    {
                        wTemp = dataValues[i * wTagCount + 5].Value.ToString();
                        if (int.TryParse(wTemp, out int wParseResult))
                        {
                            toolListInfo.ToolType = wParseResult;
                        }
                    }

                    if (dataValues[i * wTagCount + 6].Value != null)
                    {
                        wTemp = dataValues[i * wTagCount + 6].Value.ToString();

                        if (Double.TryParse(wTemp, out double wParseResult))
                        {
                            toolListInfo.ToolPositionX = wParseResult;
                        }
                    }

                    if (dataValues[i * wTagCount + 7].Value != null)
                    {
                        wTemp = dataValues[i * wTagCount + 7].Value.ToString();

                        if (Double.TryParse(wTemp, out double wParseResult))
                        {
                            toolListInfo.ToolPositionZ = wParseResult;
                        }
                    }

                    if (dataValues[i * wTagCount + 8].Value != null)
                    {
                        wTemp = dataValues[i * wTagCount + 8].Value.ToString();

                        if (Double.TryParse(wTemp, out double wParseResult))
                        {
                            toolListInfo.ToolPositionR = wParseResult;
                        }
                    }
                    if (dataValues[i * wTagCount + 9].Value != null)
                    {
                        wTemp = dataValues[i * wTagCount + 9].Value.ToString();
                        if (Double.TryParse(wTemp, out double wParseResult))
                        {
                            toolListInfo.ToolOffsetX = (wParseResult * 2);
                        }
                    }
                    if (dataValues[i * wTagCount + 10].Value != null)
                    {
                        wTemp = dataValues[i * wTagCount + 10].Value.ToString();
                        if (Double.TryParse(wTemp, out double wParseResult))
                        {
                            toolListInfo.ToolOffsetZ = wParseResult;
                        }
                    }
                    if (dataValues[i * wTagCount + 11].Value != null)
                    {
                        wTemp = dataValues[i * wTagCount + 11].Value.ToString();
                        if (Double.TryParse(wTemp, out double wParseResult))
                        {
                            toolListInfo.ToolOffsetR = wParseResult;
                        }

                    }


                    wResult.Add(toolListInfo);
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public void Dispose()
        {
            mMatchineStatusState = false;
        }
    }







}
