using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace iPlant.Common.Tools
{
    /// <summary>
    /// 高并发使用 常连接默认5个
    /// </summary>
    public class ServiceClientManager
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(ServiceClientManager));
        #region
        private ServiceClientManager()
        {
            ThreadFree = new Thread(Start);
            ThreadFree.Start();
        }

        private static ServiceClientManager _Instance;

        public static ServiceClientManager Instance
        {
            get
            {
                if (_Instance == null)
                    _Instance = new ServiceClientManager();


                return _Instance;
            }
        }
        #endregion

        /// <summary>
        /// 长连接数
        /// </summary>

        //int MinConn = 1;

        int MaxConn = 20;

        int SafeMinTime = 10;

        int SafeMaxTime = 120;

        bool IsStart = true;
        Thread ThreadFree = null;

        private void Start()
        {
            try
            {
                while (IsStart)
                {
                    try
                    {
                        Thread.Sleep(3600000);

                        foreach (String wType in ServiceClientList.Keys)
                        {
                            LockHelper wLockHelper = GetLockHelper(wType);
                            lock (wLockHelper)
                            {
                                if (ServiceClientList[wType].Count > 1)
                                {

                                    if (ServiceClientIndexList[wType] > 0)
                                    {
                                        for (int i = ServiceClientIndexList[wType] - 1; i > 0; i--)
                                        {
                                            if (ServiceClientList[wType][i].Time.AddSeconds(SafeMaxTime) < DateTime.Now)
                                                continue;
                                            ServiceClientList[wType][i].Close();
                                            ServiceClientList[wType].RemoveAt(i);

                                            i--;

                                            ServiceClientIndexList[wType]--;
                                        }

                                    }

                                    int wCount = ServiceClientList[wType].Count; ;
                                    for (int i = wCount - 1; i > ServiceClientIndexList[wType]; i--)
                                    {
                                        if (ServiceClientList[wType][i].Time.AddSeconds(SafeMaxTime) < DateTime.Now)
                                            continue;
                                        ServiceClientList[wType][i].Close();
                                        ServiceClientList[wType].RemoveAt(i);

                                        i--;
                                    }

                                }

                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.ToString());
                        logger.Error( System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                logger.Error( System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
        }
        public void End()
        {
            IsStart = false;
            try
            {
                if (ThreadFree != null)
#pragma warning disable SYSLIB0006 // 类型或成员已过时
                    ThreadFree.Abort();
#pragma warning restore SYSLIB0006 // 类型或成员已过时
            }
            catch (Exception)
            {
            }
        }

        private Dictionary<String, int> ServiceClientIndexList = new Dictionary<string, int>();

        private Dictionary<String, List<ServiceCommunication>> ServiceClientList = new Dictionary<string, List<ServiceCommunication>>();

        private Dictionary<String, LockHelper> ServiceClientLockHelperList = new Dictionary<string, LockHelper>();

        private LockHelper mLockHelper = new LockHelper();

        private LockHelper GetLockHelper(String wType)
        {
            lock (mLockHelper)
            {
                if (!ServiceClientList.ContainsKey(wType))
                {
                    ServiceClientLockHelperList[wType] = new LockHelper();
                    ServiceClientList[wType] = new List<ServiceCommunication>();
                }

                return ServiceClientLockHelperList[wType];
            }
        }

        public T GetClient<T>() where T : ICommunicationObject, new()
        {
            T wResult = default(T);
            String wType = typeof(T).FullName;

            LockHelper wLockHelper = GetLockHelper(wType);
            lock (wLockHelper)
            {
                if (ServiceClientList[wType] == null)
                    ServiceClientList[wType] = new List<ServiceCommunication>();

                if (ServiceClientList[wType].Count < 1)
                {
                    ServiceClientList[wType].Add(ServiceCommunication.GetInstance<T>());
                    ServiceClientIndexList[wType] = -1;
                }

                ServiceClientIndexList[wType]++;

                //如果下标大于等于数组容量 下标归零
                if (ServiceClientIndexList[wType] >= ServiceClientList[wType].Count)
                {
                    ServiceClientIndexList[wType] = 0;
                }
                int wIndex = ServiceClientIndexList[wType];
                //循环获取直到大于最小安全时间的连接 如果直到最后一个都不满足  在从头开始直到回到原下标停止
                bool wSafe = false;
                for (; ServiceClientIndexList[wType] < ServiceClientList[wType].Count; ServiceClientIndexList[wType]++)
                {
                    if (ServiceClientList[wType][ServiceClientIndexList[wType]].Time.AddSeconds(SafeMinTime) >= DateTime.Now)
                        continue;

                    wSafe = true;
                    break;
                }

                if (!wSafe && wIndex > 0)
                {
                    for (ServiceClientIndexList[wType] = 0; ServiceClientIndexList[wType] < wIndex; ServiceClientIndexList[wType]++)
                    {
                        if (ServiceClientList[wType][ServiceClientIndexList[wType]].Time.AddSeconds(SafeMinTime) >= DateTime.Now)
                            continue;

                        wSafe = true;
                        break;
                    }
                }

                //如果为找到安全连接  则自动增长容量
                if (!wSafe && ServiceClientList[wType].Count < MaxConn)
                {
                    ServiceClientList[wType].Insert(ServiceClientIndexList[wType], ServiceCommunication.GetInstance<T>());

                }
                else
                {
                    ServiceClientIndexList[wType] = wIndex;
                }

                wResult = (T)ServiceClientList[wType][ServiceClientIndexList[wType]].GetClient<T>();

            }

            return wResult;
        }

    }

    class ServiceCommunication
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(ServiceCommunication));
        public DateTime Time { get; set; }


        private ICommunicationObject _Client;


        public DateTime CreateTime { get; set; }

        private ServiceCommunication()
        {
            Time = new DateTime(2000, 1, 1);
            CreateTime = DateTime.Now;
        }

        public ICommunicationObject GetClient<T>() where T : ICommunicationObject, new()
        {
            Time = DateTime.Now;
            if (_Client == null)
            {
                CreateTime = DateTime.Now;
                _Client = new T();
                _Client.Open();
            }
            if (_Client.State != System.ServiceModel.CommunicationState.Opened)
            {
                Close<T>();
            }
            return _Client;

        }
        public static ServiceCommunication GetInstance<T>() where T : ICommunicationObject, new()
        {
            ServiceCommunication wServiceCommunication = new ServiceCommunication();
            try
            {
                wServiceCommunication._Client = new T();
                wServiceCommunication._Client.Open();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wServiceCommunication;
        }

        private void Close<T>() where T : ICommunicationObject, new()
        {
            try
            {
                try
                {
                    if (_Client != null)
                    {
                        _Client.Close();
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                    logger.Error( System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                }
                CreateTime = DateTime.Now;
                _Client = new T();
                _Client.Open();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                logger.Error( System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
        }

        public void Close() 
        {
            try
            {
                if (_Client != null)
                {
                    _Client.Close();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                logger.Error( System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
        }
    }
}
