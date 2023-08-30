using iPlant.Common.Tools;
using iPlant.FMS.Models;
using Opc.Ua;
using Opc.Ua.Client;
using ShrisCommunicationCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace iPlant.FMS.Communication
{
    /// <summary>
    /// 采集服务管理器
    /// </summary>
    public class CommunicationServerManager
    {

        private LockHelper ReconnLockHelper = new LockHelper();

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(CommunicationServerManager));

        /// <summary>
        /// 服务器列表
        /// </summary>
        private readonly List<ServerDescriptionEntity> mServerDescriptionEntities;

        /// <summary>
        /// key=serverName
        /// </summary>
        private Dictionary<int, ServerClient> mServerClients = new Dictionary<int, ServerClient>();


        public CommunicationServerManager(List<ServerDescriptionEntity> wServerDescriptionEntities)
        {
            mServerDescriptionEntities = wServerDescriptionEntities;

            CreateSimpleClients();
        }

        /// <summary>
        /// 创建传入的连接对象
        /// </summary>
        private void CreateSimpleClients()
        {
            DMSServerTypes wServerTypes;
            //创建 opc 客户端
            foreach (ServerDescriptionEntity wServerDescriptionEntity in mServerDescriptionEntities)
            {
                if (!Enum.TryParse(wServerDescriptionEntity.ServerType + "", out wServerTypes))
                    continue;
                switch (wServerTypes)
                {
                    case DMSServerTypes.Default:
                        break;
                    case DMSServerTypes.OPC:
                        this.CreateOPCServer(wServerDescriptionEntity);
                        break;
                    case DMSServerTypes.Tcp:
                        break;
                    case DMSServerTypes.Fanuc:
                        this.CreateFanucServer(wServerDescriptionEntity);
                        break;
                    case DMSServerTypes.Mitsubishi:
                        break;
                    default:
                        break;
                }

                wServerDescriptionEntity.IsConnected = false;
                wServerDescriptionEntity.StatusString = "Disconnected";
                wServerDescriptionEntity.UpdateTime = DateTime.Now;

            }


            //创建其它连接 to do 

        }

        private void CreateOPCServer(ServerDescriptionEntity wServerDescriptionEntity)
        {

            OpcUaServerDescription opcUaServerDescription = new OpcUaServerDescription();
            opcUaServerDescription.ServerId = new Guid(String.Format("20220101-0001-0001-0001-{0}", wServerDescriptionEntity.ID.ToString().PadLeft(12, '0')));
            opcUaServerDescription.ClientName = wServerDescriptionEntity.ClientName;
            opcUaServerDescription.ServerUrl = wServerDescriptionEntity.ServerUrl;
            opcUaServerDescription.Configured = wServerDescriptionEntity.Configured;
            opcUaServerDescription.IsFilePath = wServerDescriptionEntity.IsFilePath;
            opcUaServerDescription.ServerType = ((int)DMSServerTypes.OPC);
            opcUaServerDescription.ConfigurationSectionName = wServerDescriptionEntity.ConfigurationSectionName;
            opcUaServerDescription.IsAnonymous = wServerDescriptionEntity.IsAnonymous;
            opcUaServerDescription.UserName = wServerDescriptionEntity.UserName;
            opcUaServerDescription.Password = wServerDescriptionEntity.Password;
            opcUaServerDescription.SecerityPolic = wServerDescriptionEntity.SecerityPolic;
            opcUaServerDescription.IgnoreVaildServerNonce = wServerDescriptionEntity.IgnoreVaildServerNonce;
            opcUaServerDescription.ServerName = wServerDescriptionEntity.ServerName;

            SimpleOpcUaClient sim = null;
            try
            {
                logger.InfoFormat("Create OPC ServerClient:{0}", wServerDescriptionEntity.ServerName);
                sim = new SimpleOpcUaClient(opcUaServerDescription);

            }
            catch (Exception ex)
            {
                logger.Error("创建客户端失败：", ex);
                Exception ee = new Exception(ex.Message + "  创建客户端失败： " + opcUaServerDescription.ServerName + " || " + opcUaServerDescription.ServerId.ToString());
                throw ee;
            }
            try
            {
                mServerClients.Add(wServerDescriptionEntity.ID, sim);
            }
            catch (Exception ex)
            {
                logger.Error("添加客户端失败：", ex);
                Exception ee = new Exception(ex.Message + "  添加客户端失败 ");
                throw ee;
            }

        }

        private void CreateFanucServer(ServerDescriptionEntity wServerDescriptionEntity)
        {
            FanucServerDescription wFanucServerDescription = new FanucServerDescription();
            wFanucServerDescription.ServerId =
                new Guid(String.Format("20220101-0001-0001-0001-{0}", wServerDescriptionEntity.ID.ToString().PadLeft(12, '0')));
            //wFanucServerDescription.ClientName = wServerDescriptionEntity.ClientName;
            wFanucServerDescription.ServerUrl = wServerDescriptionEntity.ServerUrl;
            wFanucServerDescription.ServerType = ((int)DMSServerTypes.Fanuc);
            wFanucServerDescription.ServerName = wServerDescriptionEntity.ServerName;
            wFanucServerDescription.ServerPort = 8193;
            wFanucServerDescription.TimeOutSecond = 10;
            SimpleFanucClient sim = null;
            try
            {
                logger.InfoFormat("Create Fanuc ServerClient:{0}", wServerDescriptionEntity.ServerName);
                sim = new SimpleFanucClient(wFanucServerDescription);

            }
            catch (Exception ex)
            {
                logger.Error("创建客户端失败：", ex);
                Exception ee = new Exception(ex.Message + "  创建客户端失败： " + wFanucServerDescription.ServerName + " || " + wFanucServerDescription.ServerId.ToString());
                throw ee;
            }
            try
            {
                mServerClients.Add(wServerDescriptionEntity.ID, sim);
            }
            catch (Exception ex)
            {
                logger.Error("添加客户端失败：", ex);
                Exception ee = new Exception(ex.Message + "  添加客户端失败 ");
                throw ee;
            }

        }

        private List<ServerClient> SimpleClientErrorList = new List<ServerClient>();

        private ServerClient GetSimpleClientError()
        {


            if (SimpleClientErrorList == null || SimpleClientErrorList.Count <= 0)
                return null;


            ServerClient wServerClient = SimpleClientErrorList[0];

            SimpleClientErrorList.RemoveAt(0);

            return wServerClient;


        }



        private Dictionary<Guid, List<SubscriptionParam>> mSubscriptionParamDic = new Dictionary<Guid, List<SubscriptionParam>>();


        private Dictionary<Guid, Dictionary<String, MonitoredItemNotificationEventHandler>> mOPCEventHandlerDic = new Dictionary<Guid, Dictionary<String, MonitoredItemNotificationEventHandler>>();

        public void ReConnectToServers(object wState)
        {
            lock (ReconnLockHelper)
            {
                ServerClient wSimpleClientError = GetSimpleClientError();
                try
                {
                    if (wSimpleClientError == null)
                    {
                        if (mReConnectTimer != null)
                        {
                            mReConnectTimer.Dispose();
                            mReConnectTimer = null;
                        }

                        return;
                    }
                    if (wSimpleClientError.ServerType != (int)DMSServerTypes.OPC)
                    {
                        return;
                    }
                     
                    _ = wSimpleClientError.Connect();
                    if (!wSimpleClientError.IsConnected)
                    {
                        SimpleClientErrorList.Add(wSimpleClientError);
                        return;
                    }

                   

                    if (mSubscriptionParamDic.ContainsKey(wSimpleClientError.ServerId)
                      && mOPCEventHandlerDic.ContainsKey(wSimpleClientError.ServerId))
                    {
                        try
                        {

                            foreach (var item in mSubscriptionParamDic[wSimpleClientError.ServerId])
                            {
                                if (!mOPCEventHandlerDic[wSimpleClientError.ServerId].ContainsKey(item.subscriptionKey))
                                    continue;
                                ((SimpleOpcUaClient)wSimpleClientError).CreateSubscription(item, mOPCEventHandlerDic[wSimpleClientError.ServerId][item.subscriptionKey]);
                            }


                            mSubscriptionParamDic.Remove(wSimpleClientError.ServerId);
                            mOPCEventHandlerDic.Remove(wSimpleClientError.ServerId);
                        }
                        catch (Exception ex)
                        {
                            logger.Error(wSimpleClientError.ServerName + "  ReConnectToServers CreateSubscription error: " + ex.Message);
                        }

                    }
                }
                catch (Exception ex)
                {
                    logger.Error((wSimpleClientError == null ? "" : wSimpleClientError.ServerName) + "ReConnectToServers error: " + ex.Message);
                }
            }
        }

        public Timer mReConnectTimer;

        private bool mIsStarted = false;

        /// <summary>
        /// 创建OPC 客户端连接
        /// </summary>
        /// <returns></returns>
        public async Task ConnectToServers()
        {
            if (mIsStarted)
            {
                return;
            }
            //创建OPC 客户端
            if (mServerClients.Count > 0)
            {
                foreach (int wServerID in mServerClients.Keys)
                {
                   
                    try
                    {
                        mServerClients[wServerID].StatusChange += Value_StatusChange;
                        mServerClients[wServerID].ConnectComplete += CommunicationServerManager_ConnectComplete;
                        mServerClients[wServerID].ReconnectComplete += CommunicationServerManager_ConnectComplete;
                        await mServerClients[wServerID].Connect(); 
                    }
                    catch (Exception ex)
                    {
                        SimpleClientErrorList.Add(mServerClients[wServerID]);
                        logger.Error(mServerClients[wServerID].ServerName + " : " + ex.Message);
                    }
                }

                if (SimpleClientErrorList.Count > 0)
                    mReConnectTimer = new Timer(ReConnectToServers, null, 1000, 30000);
            }

        }

        private void CommunicationServerManager_ConnectComplete(object sender, EventArgs e)
        {
            try
            {
                var opcClient = sender as ServerClient;
                int wServerId = opcClient.ServerId.ParseToInt(); ;
                if (wServerId <= 0)
                    return;

                logger.InfoFormat("{0} ConnectComplete!!!", opcClient.ServerName); 
            }
            catch (Exception ex)
            {

                logger.Error("CommunicationServerManager_ConnectComplete", ex);
            }
           
        }

        private void Value_StatusChange(object sender, ServerStatusEventArgs e)
        {
            try
            {
                var opcClient = sender as ServerClient;
                int wServerId = opcClient.ServerId.ParseToInt(); ;
                if (wServerId <= 0)
                    return;

                var statusDto = mServerDescriptionEntities.Where(i => i.ID == wServerId).First();
                if (statusDto != null)
                {
                    statusDto.IsConnected = e.IsConnected;
                    statusDto.StatusString = e.Text;
                    statusDto.UpdateTime = e.Time;
                }
            }
            catch (Exception ex)
            { 
                logger.Error("Value_StatusChange", ex); 
            } 

        }


        /// <summary>
        /// 为传入的opcData 地址，选择对应的OPC 服务器，并在对应服务器上创建其DeviceId 的订阅
        /// </summary>
        /// <param name="opcDataSourceEntities">OPC 数据地址，必须在同一个服务器上</param>
        /// <param name="monitoredItemNotificationEventHandler">该组数据对应的回调方法</param>
        /// <returns></returns>
        public bool CreateOpcSubscription(IEnumerable<DataSourceEntity> opcDataSourceEntities, MonitoredItemNotificationEventHandler wHandler, string subscriptionName = "default")
        {


            Boolean wResult = true;

            var wOpcDataSourceEntitiesDic = opcDataSourceEntities.GroupBy(p => p.ServerId).ToDictionary(p => p.Key, p => p.ToList());

            ServerClient wServerClient = null;

            List<string> tags;
            List<string> itemNames;
            List<int> catalogs;
            List<int> dataTypes; 
            int publishTime = 100;
            SubscriptionParam wSubscriptionParam;
            foreach (int wServerId in wOpcDataSourceEntitiesDic.Keys)
            {


                bool r = mServerClients.TryGetValue(wServerId, out wServerClient);

                if (!r || wServerClient == null || wServerClient.ServerType != (int)DMSServerTypes.OPC)
                {
                    wResult = false;
                    continue;
                }
                tags = new List<string>();
                itemNames = new List<string>();
                catalogs = new List<int>();
                dataTypes = new List<int>();

                foreach (var dataSource in wOpcDataSourceEntitiesDic[wServerId])
                {
                    tags.Add(dataSource.SourceAddress);
                    itemNames.Add(dataSource.ID.ToString());
                    catalogs.Add(dataSource.DataCatalog);
                    dataTypes.Add(dataSource.DataTypeCode);
                    publishTime = dataSource.InternalTime;
                }
                if ("default".Equals(subscriptionName))
                {
                    subscriptionName = wOpcDataSourceEntitiesDic[wServerId][0].DeviceCode;
                }
                wSubscriptionParam = new SubscriptionParam(subscriptionName, publishTime, publishTime,
                                     tags, itemNames, dataTypes, catalogs);


                if (wServerClient.IsConnected)
                {
                    try
                    {

                        ((SimpleOpcUaClient)wServerClient).CreateSubscription(wSubscriptionParam, wHandler); 

                    }
                    catch (Exception ex)
                    {
                        wResult = false;
                        logger.Error(String.Format(" Server:{0} Device:{1}  error: ", wServerId, wOpcDataSourceEntitiesDic[wServerId][0].DeviceCode) + " {0}", ex);
                    }

                } 
                else
                {

                    if (!mSubscriptionParamDic.ContainsKey(wServerClient.ServerId))
                    {
                        mSubscriptionParamDic.Add(wServerClient.ServerId, new List<SubscriptionParam>());
                    }
                    mSubscriptionParamDic[wServerClient.ServerId].Add(wSubscriptionParam);

                  
                    if (!mOPCEventHandlerDic.ContainsKey(wServerClient.ServerId))
                    {
                        mOPCEventHandlerDic.Add(wServerClient.ServerId, new Dictionary<string, MonitoredItemNotificationEventHandler>());
                    }

                    if (!mOPCEventHandlerDic[wServerClient.ServerId].ContainsKey(wSubscriptionParam.subscriptionKey))
                    {
                        mOPCEventHandlerDic[wServerClient.ServerId].Add(wSubscriptionParam.subscriptionKey, wHandler);
                    }

                    wResult = false;
                    //如何重连Client后执行这个订阅


                }
            }
            return wResult;
        }


        /// <summary>
        /// 为传入的opcData 地址，选择对应的OPC 服务器，并在对应服务器上创建其DeviceId 的订阅
        /// </summary>
        /// <param name="opcDataSourceEntities">OPC 数据地址，必须在同一个服务器上</param>
        /// <param name="monitoredItemNotificationEventHandler">该组数据对应的回调方法</param>
        /// <returns></returns>
        public bool CreateReadSubscription(IEnumerable<DataSourceEntity> opcDataSourceEntities, BaseMonitoredItemNotificationEventHandler wEventHandler = null, string subscriptionName = "default")
        {


            Boolean wResult = true;

            var wOpcDataSourceEntitiesDic = opcDataSourceEntities.GroupBy(p => p.ServerId).ToDictionary(p => p.Key, p => p.ToList());

            ServerClient wServerClient = null;

            List<string> tags;
            List<string> itemNames;
            List<int> catalogs;
            List<int> dataTypes;
            int publishTime = 100;
            SubscriptionParam wSubscriptionParam;
            foreach (int wServerId in wOpcDataSourceEntitiesDic.Keys)
            {


                bool r = mServerClients.TryGetValue(wServerId, out wServerClient);

                if (!r || wServerClient == null)
                {
                    wResult = false;
                    continue;
                }
                tags = new List<string>();
                itemNames = new List<string>();
                catalogs = new List<int>();
                dataTypes = new List<int>();

                foreach (var dataSource in wOpcDataSourceEntitiesDic[wServerId])
                {
                    tags.Add(dataSource.SourceAddress);
                    itemNames.Add(dataSource.ID.ToString());
                    catalogs.Add(dataSource.DataCatalog);
                    dataTypes.Add(dataSource.DataTypeCode);
                    publishTime = dataSource.InternalTime;
                }
                if ("default".Equals(subscriptionName))
                {
                    subscriptionName = wOpcDataSourceEntitiesDic[wServerId][0].DeviceCode;
                }
                wSubscriptionParam = new SubscriptionParam(subscriptionName, publishTime, publishTime,
                                     tags, itemNames, dataTypes, catalogs);

                try
                {
                    wServerClient.CreateSubscription(wSubscriptionParam, wEventHandler);

                }
                catch (Exception ex)
                {
                    wResult = false;
                    logger.Error(String.Format(" Server:{0} Device:{1} Read Where Error: ", wServerId, wOpcDataSourceEntitiesDic[wServerId][0].DeviceCode) + " {0}", ex);
                }


            }
            return wResult;
        }


        /// <summary>
        /// 获取连接到对应opc server 的client 连接
        /// </summary>
        /// <param name="serverId"></param>
        /// <returns></returns>
        public ServerClient GetServerClient(Guid serverId)
        {

            int wServerID = serverId.ParseToInt(); ;
            if (wServerID <= 0)
                return null;

            if (mServerClients.ContainsKey(wServerID))
            {
                return mServerClients[wServerID];
            }
            else
            {
                return null;
            }

        }

        public ServerClient GetServerClient(int serverId)
        {
            if (mServerClients.ContainsKey(serverId))
            {
                return mServerClients[serverId];
            }
            else
            {
                return null;
            }
        }





    }
}
