using iPlant.Common.Tools;
using iPlant.FMC.Service;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace iPlant.FMS.Communication
{
    public class LineManager
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(LineManager));

        private static Dictionary<int, LineManager> LineManagerDic = new Dictionary<int, LineManager>();

        public static List<LineManager> LineManagerList
        {
            get
            {

                return LineManagerDic.Values.ToList();
            }
        }
        public static LineManager getInstance(int wLineID, CommunicationServerManager wCommunicationServerManager)
        {

            if (wLineID <= 0 || wCommunicationServerManager == null)
                return null;

            if (!LineManagerDic.ContainsKey(wLineID))
            {
                //加载设备配置
                List<DeviceEntity> wDeviceEntityList = new List<DeviceEntity>();

                if (wDeviceEntityList == null || wDeviceEntityList.Count <= 0)
                    return null;

                LineManagerDic.Add(wLineID, new LineManager(wLineID, wCommunicationServerManager, wDeviceEntityList));
            }


            return LineManagerDic[wLineID];
        }

        public static LineManager getInstance(int wLineID)
        {

            if (wLineID <= 0)
                return null;

            if (!LineManagerDic.ContainsKey(wLineID))
            {
                return null;
            }

            return LineManagerDic[wLineID];
        }

        public static LineManager getInstance(int wLineID, CommunicationServerManager wCommunicationServerManager, List<DeviceEntity> wDeviceEntityList)
        {

            if (wLineID <= 0 || wCommunicationServerManager == null)
                return null;
            if (wDeviceEntityList == null || wDeviceEntityList.Count <= 0)
                return null;



            if (!LineManagerDic.ContainsKey(wLineID))
                LineManagerDic.Add(wLineID, new LineManager(wLineID, wCommunicationServerManager, wDeviceEntityList));


            return LineManagerDic[wLineID];
        }

        private LineManager() { }
        private LineManager(int wLineID, CommunicationServerManager wCommunicationServerManager, List<DeviceEntity> wDeviceEntityList)
        {
            LineID = wLineID;
            DeviceEntityList = wDeviceEntityList;
            mCommunicationServerManager = wCommunicationServerManager;
        }

        public readonly int LineID;

        private readonly List<DeviceEntity> DeviceEntityList;

        public Dictionary<String, BasicDevice> mBasicDeviceDic = new Dictionary<string, BasicDevice>();
        public CommunicationServerManager mCommunicationServerManager;


        public BasicDevice GetBasicDevice(String wAssetNo)
        {

            if (mBasicDeviceDic != null && mBasicDeviceDic.ContainsKey(wAssetNo))
                return mBasicDeviceDic[wAssetNo];

            return null;
        }

        public static BasicDevice GetBasicDevice(int wLineID, String wAssetNo)
        {
            LineManager wLineManager = LineManager.getInstance(wLineID);
            if (wLineManager == null)
            {
                return null;
            }
            return wLineManager.GetBasicDevice(wAssetNo);
        }


        public static BasicDevice GetBasicDevice(int wLineID, int wDeviceID, String wDeviceNo)
        {
            LineManager wLineManager = LineManager.getInstance(wLineID);
            if (wLineManager == null)
            {
                return null;
            }

            if (wDeviceID > 0)
            {
                foreach (var item in wLineManager.mBasicDeviceDic.Values)
                {
                    if (item != null && item.DeviceEntity != null && item.DeviceEntity.ID > 0 && item.DeviceEntity.ID == wDeviceID)
                    {
                        return item;
                    }
                }
            }
            else if (StringUtils.isNotEmpty(wDeviceNo))
            {
                foreach (var item in wLineManager.mBasicDeviceDic.Values)
                {
                    if (item != null && item.DeviceEntity != null && item.DeviceEntity.ID > 0
                        && wDeviceNo.Equals(item.DeviceEntity.Code))
                    {
                        return item;
                    }
                }
            }


            return null;
        }
        public static BasicDevice GetBasicDevice(int wLineID, String wAssetNo, int wDeviceID, String wDeviceNo)
        {
            if (StringUtils.isNotEmpty(wAssetNo))
            {

                return GetBasicDevice(wLineID, wAssetNo);
            }
            return GetBasicDevice(wLineID, wDeviceID, wDeviceNo);

        }
        public void Init()
        {
            //加载所有设备参数配置
            if (DeviceEntityList == null || DeviceEntityList.Count <= 0)
                return;

            DeviceEntityList.RemoveAll(p => !p.StatusEnable);

            if (DeviceEntityList.Count <= 0)
                return;

            List<int> wDeviceList = DeviceEntityList.Select(p => p.ID).Distinct().ToList();

            List<DataSourceEntity> wOPCDataSourceEntities = this.LoadDataSourceEntities();

            



            Dictionary<String, List<DataSourceEntity>> wOPCDataSourceEntityDic = wOPCDataSourceEntities.GroupBy(p => p.DeviceCode).ToDictionary(p => p.Key, p => p.ToList());

            //创建所有设备实例
            CreateDevices(DeviceEntityList, wOPCDataSourceEntityDic);
            // 

            //从设备参数配置中加载设备报警、设备状态、设备实时参数、设备能源参数、 
            //从设备参数配置中获取每个设备的作业参数 并对作业参数设定获取变量与写入变量
            //从设备参数配置中获取每个设备的订单参数 并对订单设定获取变量与写入变量  （可定义某个变量是全部写入） 机床的订单写入可以在上料完成信号后
            //
        }

        private List<DataSourceEntity> LoadDataSourceEntities()
        {
            List<DataSourceEntity> wResult = new List<DataSourceEntity>();

            ServiceResult<List<DMSDeviceParameter>> wDeviceParameterResult = ServiceInstance.mDMSService.DMS_QueryDeviceParameterList(BaseDAO.SysAdmin,
                "", "", LineID, -1, "", "", "", "", "", -1, -1, -1, 1, Pagination.MaxSize);

            if (StringUtils.isNotEmpty(wDeviceParameterResult.FaultCode))
            {
                logger.InfoFormat("Init LoadDataSourceEntities Error:{0}", wDeviceParameterResult.FaultCode);
                return wResult;
            }
            if (wDeviceParameterResult.Result == null || wDeviceParameterResult.Result.Count <= 0)
            {
                logger.Info("Init LoadDataSourceEntities Error: Load data source config count <= 0");
                return wResult;
            }
            foreach (DMSDeviceParameter wDMSDeviceParameter in wDeviceParameterResult.Result)
            {
                wResult.Add(new DataSourceEntity(wDMSDeviceParameter));
            }

            return wResult;
        }


        /// <summary>
        /// 创建产线中的所有设备，不单单是OPC设备
        /// </summary>
        /// <returns></returns>
        private void CreateDevices(List<DeviceEntity> wDeviceEntityList, Dictionary<String, List<DataSourceEntity>> wOPCDataSourceEntityDic)
        {

            List<DataSourceEntity> wAdressList = null;
            BasicDevice wDevice = null;
            foreach (DeviceEntity wDeviceEntity in wDeviceEntityList)
            {
                //获取该设备opc 数据地址
                List<DataSourceEntity> opcDataSourceEntities;
                wOPCDataSourceEntityDic.TryGetValue(wDeviceEntity.AssetNo, out opcDataSourceEntities);

                WorkpiecePosition.Add(wDeviceEntity.AssetNo, new List<string>());
                if (opcDataSourceEntities == null || opcDataSourceEntities.Count <= 0)
                {
                    logger.InfoFormat("Device:{0}({1}) Not Entity Config ", wDeviceEntity.Name, wDeviceEntity.AssetNo);
                    continue;
                }

                wAdressList = opcDataSourceEntities.FindAll(p => StringUtils.isNotEmpty(p.SourceAddress));

                if (wAdressList == null || wAdressList.Count <= 0)
                {
                    logger.InfoFormat("Device:{0}({1}) Entity Not Adress ", wDeviceEntity.Name, wDeviceEntity.AssetNo);
                    continue;
                }

                try
                {
                    switch (wDeviceEntity.DeviceType)
                    {
                        case ((int)DMSServerTypes.OPC):
                            wDevice = new OpcBasicDevice(wDeviceEntity, mCommunicationServerManager, opcDataSourceEntities);
                            wDevice.PropertyChanged += MonitorPropertyChanged;
                            wDevice.InitalDevice();
                            mBasicDeviceDic.Add(wDeviceEntity.AssetNo, wDevice);
                            break;
                        case ((int)DMSServerTypes.Fanuc):
                            wDevice = new FanucBasicDevice(wDeviceEntity, mCommunicationServerManager, opcDataSourceEntities);
                            wDevice.PropertyChanged += MonitorPropertyChanged;
                            wDevice.InitalDevice();
                            mBasicDeviceDic.Add(wDeviceEntity.AssetNo, wDevice);
                            break;
                        default:
                            wDevice = new OpcBasicDevice(wDeviceEntity, mCommunicationServerManager, opcDataSourceEntities);
                            wDevice.PropertyChanged += MonitorPropertyChanged;
                            wDevice.InitalDevice();
                            mBasicDeviceDic.Add(wDeviceEntity.AssetNo, wDevice);
                            break;
                    }
                }
                catch (Exception ex)
                {
                    logger.Error("CreateDevice " + wDeviceEntity.Name, ex);
                }
                finally
                {
                    logger.InfoFormat("CreateDevice {0}", wDeviceEntity.Name);
                }
            }
        }

        /// <summary>
        /// 位置信息 key 设备  values 工件号
        /// </summary>
        public Dictionary<String, List<String>> WorkpiecePosition = new Dictionary<string, List<string>>();


        /// <summary>
        /// 更新设备工件实时数据 
        /// </summary>
        /// <param name="wValue"></param>
        private void WorkpiecePositionData(Object wValue)
        {
            if (wValue == null || !(wValue is Dictionary<String, List<String>>))
                return;
            Dictionary<String, List<String>> wCurrentValue = (Dictionary<String, List<String>>)wValue;
            bool wIsChange = false;
            foreach (String wAssetNo in wCurrentValue.Keys)
            {
                if (!WorkpiecePosition.ContainsKey(wAssetNo))
                    continue;

                for (int i = 0; i < wCurrentValue[wAssetNo].Count; i++)
                {
                    if (WorkpiecePosition[wAssetNo].Count <= i)
                        WorkpiecePosition[wAssetNo].Add(null);

                    if (wCurrentValue[wAssetNo][i] != null)
                    {
                        WorkpiecePosition[wAssetNo][i] = wCurrentValue[wAssetNo][i];

                        //修改设备当前工件号
                        wIsChange = true;
                    }
                }

                if (!mBasicDeviceDic.ContainsKey(wAssetNo))
                    continue;
                if (wCurrentValue[wAssetNo].Count <= 0 || StringUtils.isEmpty(wCurrentValue[wAssetNo][0]))
                    continue;

                ///将每个设备最后一次的工件号记录给设备示例
                mBasicDeviceDic[wAssetNo].WorkpieceNo = wCurrentValue[wAssetNo][0];

            }
            if (wIsChange)
            {
                ServiceInstance.mDMSService.DMS_SetPositionWorkpieceNo(BaseDAO.SysAdmin, LineID, WorkpiecePosition);
            }

        }

        #region 各个设备抛出来的值处理
        public void MonitorPropertyChanged(object sender, DeviceValueChangedEventArgs e)
        {
            try
            {
                if (!(sender is BasicDevice))
                {
                    return;
                }
                if (e == null || StringUtils.isEmpty(e.PropertyName))
                    return;

                switch (e.PropertyName)
                {
                    case "WorkpiecePosition":

                        WorkpiecePositionData(e.CurrentValue);

                        break;
                    default:
                        break;
                }

            }
            catch (Exception ex)
            {

                logger.Error("MonitorPropertyChanged  error {0}", ex);
            }
        }
        #endregion



    }
}
