using Opc.Ua.Client;
using ShrisCommunicationCore; 
using System.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ShrisCommunicationCore
{
    public abstract class ServerClient : IDisposable
    {
        public ServerClient(ServerDescription serverDescription)
        {
            _serverDescription = serverDescription ?? throw new ArgumentNullException(nameof(serverDescription));
             
        }

        protected readonly ServerDescription _serverDescription;

        #region public properties

        protected Thread RunThread = null;

        protected Boolean ThreadRunState = true;
        public int ServerType
        {
            get { return _serverDescription.ServerType; }
        }

        /// <summary>
        /// reconnect period in (second)
        /// </summary>
        public int ReconnectPeriod { get; set; } = 3000;

        /// <summary>
        /// 是否已经连结过（代表是否已经连结果，并不代表当前连接OK）
        /// </summary>
        public bool IsConnected
        {
            get;
            protected set;
        }

        /// <summary>
        /// 服务器ID
        /// </summary>
        public Guid ServerId
        {
            get
            {
                return _serverDescription.ServerId;
            }
        }


        protected abstract void RunStart();

        /// <summary>
        /// 服务器名称
        /// </summary>
        public string ServerName
        {
            get
            {
                return _serverDescription.ServerName;
            }
        }

        #endregion
        public abstract Task Connect();

        // 系统所有循环读取的节点信息
        protected Dictionary<int, List<BaseMonitoredItem>> read_dic_subscriptions = new Dictionary<int, List<BaseMonitoredItem>>(); // 系统所有循环读取的节点信息


        protected ConnectLock mLock = new ConnectLock();

        protected List<int> _CatalogList = new List<int>();


        protected List<int> CatalogList
        {
            get
            {
                return new List<int>(_CatalogList);
            }
        }

        public abstract void Disconnect();

        public virtual void CreateSubscription(SubscriptionParam wSubscriptionParam, BaseMonitoredItemNotificationEventHandler eventHandler)

        {
            if (wSubscriptionParam == null)
                return;

            lock (mLock)
            {
                if (read_dic_subscriptions.Count > 0)
                {
                    throw new Exception("Subscription has existed.");
                }
                if (wSubscriptionParam.tags.Count != wSubscriptionParam.itemName.Count
                    || wSubscriptionParam.itemName.Count != wSubscriptionParam.catalogs.Count)
                {
                    throw new Exception("Node count not match");
                }

                ReconnectPeriod = wSubscriptionParam.publishInterval;

                try
                {
                    for (int i = 0; i < wSubscriptionParam.tags.Count; i++)
                    {
                        if (!read_dic_subscriptions.ContainsKey(wSubscriptionParam.catalogs[i]))
                            read_dic_subscriptions.Add(wSubscriptionParam.catalogs[i], new List<BaseMonitoredItem>());

                        read_dic_subscriptions[wSubscriptionParam.catalogs[i]].Add(new BaseMonitoredItem(wSubscriptionParam.itemName[i], 
                            wSubscriptionParam.tags[i], wSubscriptionParam.dataTypes[i], wSubscriptionParam.catalogs[i], eventHandler));

                    }

                    List<int> wCatalog = read_dic_subscriptions.Keys.ToList();

                    


                    foreach (var item in wCatalog)
                    {
                        if (!_CatalogList.Contains(item))
                            _CatalogList.Add(item);
                    }

                    if (RunThread == null)
                    {
                        ThreadRunState = true;
                        RunThread = new Thread(RunStart);
                        RunThread.Start();
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception("CreateSubscription Exception:", ex);
                }
            }

        }


        public abstract bool WriteNode(string tag, string value);

        public abstract bool WriteNode<T>(String wAddress, T value);


        protected Timer dic_subscriptionsTimer;


        #region Status Changed handler


        protected void DoConnectComplete(object state)
        {
            m_ConnectComplete?.Invoke(this, null);
        }


        protected EventHandler m_ReconnectComplete;
        /// <summary>
        /// Raised after a reconnect operation starts.
        /// </summary>
        public event EventHandler ReconnectComplete
        {
            add { m_ReconnectComplete += value; }
            remove { m_ReconnectComplete -= value; }
        }

        protected EventHandler<ServerStatusEventArgs> m_StatusChange;

        public event EventHandler<ServerStatusEventArgs> StatusChange
        {
            add { m_StatusChange += value; }
            remove { m_StatusChange -= value; }
        }


        protected EventHandler m_ConnectComplete;
        /// <summary>
        /// Raised before a reconnect operation starts.
        /// </summary>
        public event EventHandler ConnectComplete
        {
            add { m_ConnectComplete += value; }
            remove { m_ConnectComplete -= value; }
        }

        protected EventHandler m_DisConnectComplete;
        /// <summary>
        /// Raised before a reconnect operation starts.
        /// </summary>
        public event EventHandler DisConnectComplete
        {
            add { m_DisConnectComplete += value; }
            remove { m_DisConnectComplete -= value; }
        }

        protected EventHandler m_ReconnectStarting;
        /// <summary>
        /// Raised before a reconnect operation starts.
        /// </summary>
        public event EventHandler ReconnectStarting
        {
            add { m_ReconnectStarting += value; }
            remove { m_ReconnectStarting -= value; }
        }


        #endregion Status Changed handler


        protected EventHandler m_KeepAliveComplete;
        /// <summary>
        /// Raised when a good keep alive from the server arrives.
        /// </summary>
        public event EventHandler KeepAliveComplete
        {
            add { m_KeepAliveComplete += value; }
            remove { m_KeepAliveComplete -= value; }
        }

        public void Dispose()
        {
            Disconnect();
            ThreadRunState = false;

        }

    }
}
