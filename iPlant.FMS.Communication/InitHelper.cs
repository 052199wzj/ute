using iPlant.Common.Tools;
using iPlant.FMC.Service;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace iPlant.FMS.Communication
{
    public class InitHelper
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(InitHelper));
        private static LockHelper mLockHelper = new LockHelper();


        #region 单实例
        private static InitHelper _Instance;
        public static InitHelper Instance
        {
            get
            {
                return _Instance;
            }
        }
        static InitHelper()
        {
            _Instance = new InitHelper();
        }
        private InitHelper()
        {

        }
        #endregion


        private Boolean Inited = false;

        private CommunicationServerManager mCommunicationServerManager;


        private async Task Start()
        {
            try
            {
                //加载采集服务配置
                List<ServerDescriptionEntity> wServerDescriptionEntityList = this.LoadServerEntities();
                if (wServerDescriptionEntityList == null || wServerDescriptionEntityList.Count <= 0)
                    return;

                //初始化服务管理器
                mCommunicationServerManager = new CommunicationServerManager(wServerDescriptionEntityList);

                try
                {
                    //连接到相关opc服务器
                    await mCommunicationServerManager.ConnectToServers();

                }
                catch (Exception ex)
                {
                    logger.Error("ConnectToServers error {0}", ex);
                }


                List<DeviceEntity> wDeviceEntityList = this.LoadDeviceEntities();

                var wDeviceEntityListDic = wDeviceEntityList.FindAll(p => p.StatusEnable).GroupBy(p => p.LineID).ToDictionary(p => p.Key, p => p.ToList());

                LineManager wLineManager;
                foreach (int wLineID in wDeviceEntityListDic.Keys)
                {
                    wLineManager = LineManager.getInstance(wLineID, mCommunicationServerManager, wDeviceEntityListDic[wLineID]);
                    if (wLineManager != null)
                        wLineManager.Init();
                }
            }
            catch (Exception ex)
            {
                logger.Error("Start", ex);
            }

        }

        public void Init()
        {
             
            try
            {
                if (Inited)
                {
                    return;
                }
                else
                {
                    lock (mLockHelper)
                    {
                        if (Inited)
                        {
                            return;
                        }
                        Inited = true;
                    }
                }


                new System.Threading.Thread(async () =>
                {
                    this.InitDeviceTable();
                    await this.Start();
                }).Start();


            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }


        }




        private List<DeviceEntity> LoadDeviceEntities()
        {
            List<DeviceEntity> wResult = new List<DeviceEntity>();

            ServiceResult<List<DMSDeviceLedger>> wDeviceLedgerResult = ServiceInstance.mDMSService.DMS_GetDeviceLedgerList(BaseDAO.SysAdmin, -1, 1, Pagination.MaxSize);

            if (StringUtils.isNotEmpty(wDeviceLedgerResult.FaultCode))
            {

                logger.InfoFormat("Init LoadDeviceEntities Error:{0}", wDeviceLedgerResult.FaultCode);
                return wResult;
            }
            if (wDeviceLedgerResult.Result == null || wDeviceLedgerResult.Result.Count <= 0)
            {
                logger.Info("Init LoadDeviceEntities Error: Load device config count <= 0");
                return wResult;
            }
            foreach (DMSDeviceLedger wDMSDeviceServer in wDeviceLedgerResult.Result)
            {
                wResult.Add(new DeviceEntity(wDMSDeviceServer));
            }

            return wResult;
        }


        private void InitDeviceTable()
        {
            try
            {
                ServiceInstance.mDMSService.DMS_InitDeviceTable(BaseDAO.SysAdmin);
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
        }


        private List<ServerDescriptionEntity> LoadServerEntities()
        {
            List<ServerDescriptionEntity> wResult = new List<ServerDescriptionEntity>();

            ServiceResult<List<DMSDeviceServer>> wDeviceServerResult = ServiceInstance.mDMSService.DMS_GetDeviceServerList(BaseDAO.SysAdmin, -1, 1, Pagination.Create(1, 10000));

            if (StringUtils.isNotEmpty(wDeviceServerResult.FaultCode))
            {

                logger.InfoFormat("Init LoadServerDescriptionEntities Error:{0}", wDeviceServerResult.FaultCode);
                return wResult;
            }
            if (wDeviceServerResult.Result == null || wDeviceServerResult.Result.Count <= 0)
            {
                logger.Info("Init LoadServerDescriptionEntities Error: Load server config count <= 0");
                return wResult;
            }
            foreach (DMSDeviceServer wDMSDeviceServer in wDeviceServerResult.Result)
            {
                wResult.Add(new ServerDescriptionEntity(wDMSDeviceServer));
            }

            return wResult;
        }




    }
}
