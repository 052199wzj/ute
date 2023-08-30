using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{


    public class DMSServiceImpl : DMSService, IDisposable
    {

        private Timer mTimer;

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSServiceImpl));

        private static DMSService _instance;

        public static DMSService getInstance()
        {
            if (_instance == null)
                _instance = new DMSServiceImpl();

            return _instance;
        }

        private DMSServiceImpl()
        {
            mTimer = new Timer(PowerStat, null, 120000, 1800000);
        }

        /// <summary>
        /// 能源统计
        /// </summary>
        /// <param name="state"></param>
        private void PowerStat(object state)
        {
            try
            {
                //判断当前时间是否属于1-2点之间
                if (DateTime.Now.Hour != 1)
                {
                    return;
                }
                //统计所有设备昨天能源数据并保存
                OutResult<Int32> wErrorCode = new OutResult<int>(0);

                List<DMSDeviceRealParameter> wDMSDeviceRealParameterList = null;
                DateTime wStartTime = DateTime.Now.Date.AddDays(-1);
                DateTime wEndTime = DateTime.Now.Date;

                List<DMSEnergyParameter> wDMSEnergyParameterOldList = DMSEnergyParameterDAO.getInstance().DMS_SelectEnergyParameterList(BaseDAO.SysAdmin, wStartTime, wEndTime, wErrorCode);

                wStartTime = DateTime.Now.Date;
                wEndTime = DateTime.Now.Date.AddDays(1);

                // DMSDeviceParameterDAO.getInstance().DMS_SelectDeviceParameterList


                DMSEnergyStatistics wDMSEnergyStatistics = null;
                DMSEnergyParameter wDMSEnergyParameter = null;

                var wDMSEnergyParameterListDic = wDMSEnergyParameterOldList.GroupBy(p => p.EnergyType).ToDictionary(p => p.Key, p => p.GroupBy(q => q.DeviceID).ToDictionary(q => q.Key, q => q.ToList()));


                List<String> wSqlStringList = new List<string>();
                foreach (DMSEnergyTypes wDMSEnergyTypes in EnumTool.ToList<DMSEnergyTypes>())
                {


                    wDMSDeviceRealParameterList = DMSDeviceRealParameterDAO.getInstance()
                             .DMS_SelectDeviceRealParameterList(BaseDAO.SysAdmin, Enum.GetName(typeof(DMSEnergyTypes), wDMSEnergyTypes),
                             (int)DMSDataClass.PowerParams, wErrorCode);

                    foreach (DMSDeviceRealParameter wDMSDeviceRealParameter in wDMSDeviceRealParameterList)
                    {
                        //处理能源数据
                        wDMSEnergyParameter = new DMSEnergyParameter();
                        wDMSEnergyParameter.DeviceID = wDMSDeviceRealParameter.DeviceID;
                        wDMSEnergyParameter.EnergyType = ((int)wDMSEnergyTypes);
                        wDMSEnergyParameter.RealValue = StringUtils.parseDouble(wDMSDeviceRealParameter.ParameterValue);
                        wDMSEnergyParameter.UpdateTime = wDMSDeviceRealParameter.UpdateTime;
                        wSqlStringList.Add(DMSEnergyParameterDAO.getInstance().DMS_InsertEnergyParameter(wDMSEnergyParameter));


                        if (!wDMSEnergyParameterListDic.ContainsKey((int)wDMSEnergyTypes)
                            || !wDMSEnergyParameterListDic[(int)wDMSEnergyTypes].ContainsKey(wDMSDeviceRealParameter.DeviceID))
                        {
                            continue;
                        }
                        wDMSEnergyStatistics = new DMSEnergyStatistics();
                        wDMSEnergyStatistics.Active = 1;

                        wDMSEnergyStatistics.DeviceID = wDMSEnergyParameter.DeviceID;
                        wDMSEnergyStatistics.EnergyType = ((int)wDMSEnergyTypes);
                        wDMSEnergyStatistics.StatConsumption = wDMSEnergyParameter.RealValue - wDMSEnergyParameterListDic[(int)wDMSEnergyTypes][wDMSDeviceRealParameter.DeviceID][0].RealValue;

                        wDMSEnergyStatistics.StatStartDate = DateTime.Now.Date.AddDays(-1);
                        wDMSEnergyStatistics.StatEndDate = DateTime.Now.Date.AddMilliseconds(-1);
                        wDMSEnergyStatistics.StatType = ((int)DMSStatTypes.Day);
                        wDMSEnergyStatistics.UpdateTime = DateTime.Now;

                        DMSEnergyStatisticsDAO.getInstance().DMS_UpdateEnergyStatistics(BaseDAO.SysAdmin, wDMSEnergyStatistics, wErrorCode);
                    }
                }


            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
        }


        public void SetSqlMode()
        {
            DMSDeviceStatusDAO.getInstance().SetSqlMode();
        }


        public readonly Dictionary<int, Dictionary<String, List<String>>> PositionWorkpieceNo = new Dictionary<int, Dictionary<string, List<string>>>();


        public ServiceResult<Dictionary<String, List<DMSDeviceLedger>>> DMS_GetWorkpieceNoPosition(BMSEmployee wLoginUser)
        {
            ServiceResult<Dictionary<String, List<DMSDeviceLedger>>> wResult = new ServiceResult<Dictionary<String, List<DMSDeviceLedger>>>();
            try
            {

                wResult.Result = new Dictionary<string, List<DMSDeviceLedger>>();

                if (PositionWorkpieceNo == null || PositionWorkpieceNo.Count <= 0)
                    return wResult;


                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<DMSDeviceLedger> wDMSDeviceLedgerList = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedgerList(wLoginUser, -1, 1, Pagination.Create(1, int.MaxValue), wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                if (wDMSDeviceLedgerList == null || wDMSDeviceLedgerList.Count <= 0)
                {
                    return wResult;
                }

                var wDeviceDic = wDMSDeviceLedgerList.GroupBy(p => p.AssetNo).ToDictionary(p => p.Key, p => p.First());

                foreach (int wLineID in PositionWorkpieceNo.Keys)
                {
                    foreach (String wAssetNo in PositionWorkpieceNo[wLineID].Keys)
                    {
                        if (!wDeviceDic.ContainsKey(wAssetNo))
                            continue;
                        if (wDeviceDic[wAssetNo] == null || wDeviceDic[wAssetNo].ID <= 0)
                            continue;

                        foreach (String wWorkpieceNo in PositionWorkpieceNo[wLineID][wAssetNo])
                        {
                            if (StringUtils.isEmpty(wWorkpieceNo))
                                continue;
                            if (!wResult.Result.ContainsKey(wWorkpieceNo))
                                wResult.Result.Add(wWorkpieceNo, new List<DMSDeviceLedger>());
                            if (wResult.Result[wWorkpieceNo].Contains(wDeviceDic[wAssetNo]))
                                continue;
                            wResult.Result[wWorkpieceNo].Add(wDeviceDic[wAssetNo]);
                        }
                    }
                }


            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;


        }



        public ServiceResult<Dictionary<String, List<String>>> DMS_GetPositionWorkpieceNo(BMSEmployee wLoginUser, int wLineID)
        {

            ServiceResult<Dictionary<String, List<String>>> wResult = new ServiceResult<Dictionary<String, List<String>>>();
            try
            {
                wResult.Result = new Dictionary<string, List<string>>();
                if (wLineID <= 0 || !PositionWorkpieceNo.ContainsKey(wLineID))
                {
                    return wResult;
                }

                wResult.Result = PositionWorkpieceNo[wLineID];

            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;

        }
        public ServiceResult<int> DMS_SetPositionWorkpieceNo(BMSEmployee wLoginUser, int wLineID, Dictionary<String, List<String>> wPositionWorkpieceNo)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                if (wLineID <= 0 || wPositionWorkpieceNo == null || wPositionWorkpieceNo.Count <= 0)
                {
                    return wResult;
                }
                if (PositionWorkpieceNo.ContainsKey(wLineID))
                {
                    PositionWorkpieceNo[wLineID] = wPositionWorkpieceNo;
                }
                else
                {
                    PositionWorkpieceNo.Add(wLineID, wPositionWorkpieceNo);
                }
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;

        }


        public ServiceResult<List<DMSDeviceServer>> DMS_GetDeviceServerList(BMSEmployee wLoginUser, int wServerType, int wActice, Pagination wPagination)
        {
            ServiceResult<List<DMSDeviceServer>> wResult = new ServiceResult<List<DMSDeviceServer>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = DMSDeviceServerDAO.getInstance().DMS_SelectDeviceServerAll(wLoginUser, -1, wServerType, wActice, wPagination, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.Message;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_UpdateDeviceServer(BMSEmployee wLoginUser, DMSDeviceServer wDMSDeviceServer)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceServerDAO.getInstance().DMS_UpdateDeviceServer(wLoginUser, wDMSDeviceServer, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }




        public ServiceResult<List<DMSDeviceLedger>> DMS_GetDeviceLedgerList(BMSEmployee wLoginUser, String wName,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, String wWorkPartPointCode, String wDeviceGroupCode, int wAreaID, int wTeamID,
               int wActive, Pagination wPagination)
        {
            ServiceResult<List<DMSDeviceLedger>> wResult = new ServiceResult<List<DMSDeviceLedger>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                List<DMSDeviceLedger> wList = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedgerList(wLoginUser,
                        wName, wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wWorkPartPointCode, wDeviceGroupCode, wAreaID, wTeamID, wActive, wPagination, wErrorCode);
                wResult.setResult(wList);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.Message;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<List<DMSDeviceLedger>> DMS_GetDeviceLedgerList(BMSEmployee wLoginUser, int wLineID,
            int wActive, Pagination wPagination)
        {
            ServiceResult<List<DMSDeviceLedger>> wResult = new ServiceResult<List<DMSDeviceLedger>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                List<DMSDeviceLedger> wList = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedgerList(wLoginUser, wLineID, wActive, wPagination, wErrorCode);
                wResult.setResult(wList);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.Message;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<DMSDeviceLedger> DMS_GetDeviceLedger(BMSEmployee wLoginUser, int wID, String wDeviceNo, String wAssetNo)
        {
            ServiceResult<DMSDeviceLedger> wResult = new ServiceResult<DMSDeviceLedger>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceLedger wServerRst = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedger(wLoginUser, wID,
                        wDeviceNo, wAssetNo, wErrorCode);
                wResult.setResult(wServerRst);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.Message;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }



        public ServiceResult<Int32> DMS_SaveDeviceLedger(BMSEmployee wLoginUser, DMSDeviceLedger wDMSDeviceLedger)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceLedgerDAO.getInstance().DMS_UpdateDeviceLedger(wLoginUser, wDMSDeviceLedger, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<List<String>> DMS_UpdateDeviceLedgerList(BMSEmployee wLoginUser, List<DMSDeviceLedger> wDMSDeviceLedgerList)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = new List<string>();
                int i = 1;
                foreach (DMSDeviceLedger wDMSDeviceLedger in wDMSDeviceLedgerList)
                {
                    DMSDeviceLedgerDAO.getInstance().DMS_UpdateDeviceLedger(wLoginUser, wDMSDeviceLedger, wErrorCode);


                    if (wErrorCode.get() > 0)
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}行数据 Code:{1},AssetNo:{2} Import Error:{3} ", i,
                            wDMSDeviceLedger.Code, wDMSDeviceLedger.AssetNo, MESException.getEnumType(wErrorCode.get()).getLabel()));
                    }
                    if (wDMSDeviceLedger.ID > 0)
                    {
                        DMSDeviceLedgerDAO.getInstance().DMS_UpdateDeviceLedgerSet(wLoginUser, wDMSDeviceLedger, wErrorCode);
                        if (wErrorCode.get() > 0)
                        {
                            wResult.Result.Add(StringUtils.Format("第{0}行数据 Code:{1},AssetNo:{2} UpdateDeviceLedgerSet Error:{3} ", i,
                                wDMSDeviceLedger.Code, wDMSDeviceLedger.AssetNo, MESException.getEnumType(wErrorCode.get()).getLabel()));
                        }
                    }

                    i++;
                }

            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_UpdateDeviceLedgerSet(BMSEmployee wLoginUser, DMSDeviceLedger wDMSDeviceLedger)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceLedgerDAO.getInstance().DMS_UpdateDeviceLedgerSet(wLoginUser, wDMSDeviceLedger, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_ActiveDeviceLedgerList(BMSEmployee wLoginUser, List<Int32> wIDList,
        int wActive)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceLedgerDAO.getInstance().DMS_ActiveDeviceLedger(wLoginUser, wIDList, wActive, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }
        public ServiceResult<Int32> DMS_DeleteDeviceLedgerList(BMSEmployee wLoginUser, DMSDeviceLedger wDeviceLedger)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceLedgerDAO.getInstance().DMS_DeleteDeviceLedger(wLoginUser, wDeviceLedger, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }



        public ServiceResult<List<String>> DMS_SyncDeviceLedgerList(BMSEmployee wLoginUser, List<DMSDeviceLedger> wDeviceLedgerList)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                wResult.Result = new List<string>();
                if (wDeviceLedgerList == null || wDeviceLedgerList.Count <= 0)
                    return wResult;

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<DMSDeviceLedger> wSourveList = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedgerList(wLoginUser, -1, -1, Pagination.Create(1, Int32.MaxValue), wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }

                List<BMSRegion> wRegionSourceList = BMSRegionDAO.getInstance().BMS_SelectRegionList(wLoginUser, -1, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }

                List<DMSDeviceType> wDeviceTypeSourceList = DMSDeviceTypeDAO.getInstance().DMS_SelectDeviceTypeList(wLoginUser, "", -1, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }

                List<DMSDeviceModel> wDeviceModelSourceList = DMSDeviceModelDAO.getInstance().DMS_SelectDeviceModelList(wLoginUser, "",
                 -1, "", "", -1, -1, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }


                List<BMSTeamManage> wTeamManageSourceList = BMSTeamManageDAO.getInstance().BMS_GetTeamManageList(wLoginUser, "", -1, -1,
                 -1, -1, -1, Pagination.MaxSize, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                List<BMSEmployee> wEmployeeSourveList = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeAll(wLoginUser, -1, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }


                Dictionary<string, DMSDeviceType> wDeviceTypeDic = wDeviceTypeSourceList.ToDictionary(p => p.Code, p => p);

                Dictionary<string, DMSDeviceModel> wDeviceModelDic = wDeviceModelSourceList.ToDictionary(p => p.Code, p => p);

                Dictionary<string, BMSRegion> wRegionSourveDic = wRegionSourceList.ToDictionary(p => p.Code, p => p);

                Dictionary<string, Int32> wEmployeeIDSourveDic = wEmployeeSourveList.ToDictionary(p => p.LoginID, p => p.ID);

                Dictionary<string, BMSTeamManage> wTeamManageSourveDic = wTeamManageSourceList.ToDictionary(p => p.Code, p => p);

                Dictionary<string, DMSDeviceLedger> wSourveDic = wSourveList.ToDictionary(p => p.Code, p => p);


                DMSDeviceType wDMSDeviceType = null;
                DMSDeviceModel wDMSDeviceModel = null;
                int i = 0;
                foreach (DMSDeviceLedger wDeviceLedger in wDeviceLedgerList)
                {
                    i++;
                    if (wDeviceLedger == null)
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}条数据不完整  !", i));
                        continue;
                    }
                    if (StringUtils.isEmpty(wDeviceLedger.Code) || StringUtils.isEmpty(wDeviceLedger.Name))
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}条数据不完整 Code:{1} Name:{2} !", i,
                               wDeviceLedger.Code, wDeviceLedger.Name));
                        continue;
                    }

                    //检查设备是否存在 不存在提示报错
                    if (!wSourveDic.ContainsKey(wDeviceLedger.Code))
                    {
                        wResult.Result.Add(StringUtils.Format("Code:{0} Update Error:DeviceCode Not Found!",
                              wDeviceLedger.Code));
                        continue;
                    }

                    if (StringUtils.isEmpty(wDeviceLedger.DeviceTypeCode))
                    {
                        wResult.Result.Add(StringUtils.Format("Code:{0} DeviceTypeCode：{1}  Error:DeviceType is Empty!",
                             wDeviceLedger.Code, wDeviceLedger.DeviceTypeCode));
                        continue;
                    }
                    if (StringUtils.isEmpty(wDeviceLedger.ModelNo))
                    {
                        wResult.Result.Add(StringUtils.Format("Code:{0} ModelNo：{1}  Error:Model  is Empty!",
                             wDeviceLedger.Code, wDeviceLedger.ModelNo));
                        continue;
                    }

                    if (wTeamManageSourveDic.ContainsKey(wDeviceLedger.TeamNo))
                    {
                        wDeviceLedger.TeamID = wTeamManageSourveDic[wDeviceLedger.TeamNo].ID;
                    }
                    else
                    {
                        wResult.Result.Add(StringUtils.Format("Code:{0} TeamNo：{1}  Error:Team Not Found!",
                               wDeviceLedger.Code, wDeviceLedger.TeamNo));
                        continue;
                    }

                    if (wRegionSourveDic.ContainsKey(wDeviceLedger.AreaNo))
                    {
                        wDeviceLedger.AreaID = wRegionSourveDic[wDeviceLedger.AreaNo].ID;
                    }
                    else
                    {
                        wResult.Result.Add(StringUtils.Format("Code:{0} AreaNo：{1}  Error:Area Not Found!",
                               wDeviceLedger.Code, wDeviceLedger.AreaNo));
                        continue;
                    }
                    //检查设备类型是否存在 不存在创建
                    if (!wDeviceTypeDic.ContainsKey(wDeviceLedger.DeviceTypeCode))
                    {

                        wDMSDeviceType = new DMSDeviceType();
                        wDMSDeviceType.Code = wDeviceLedger.DeviceTypeCode;
                        wDMSDeviceType.Name = wDeviceLedger.DeviceTypeName;
                        wDMSDeviceType.Active = 1;
                        DMSDeviceTypeDAO.getInstance().DMS_UpdateDeviceType(wLoginUser, wDMSDeviceType, wErrorCode);
                        if (wDMSDeviceType.ID > 0)
                        {
                            wDeviceTypeDic.Add(wDMSDeviceType.Code, wDMSDeviceType);
                            wDeviceLedger.DeviceType = wDMSDeviceType.ID;
                        }
                        else
                        {
                            wResult.Result.Add(StringUtils.Format("Code:{0} DeviceTypeCode：{1}  Error:DeviceType Update Fail!",
                              wDeviceLedger.Code, wDeviceLedger.DeviceTypeCode));
                            continue;
                        }
                    }
                    else
                    {
                        wDeviceLedger.DeviceType = wDeviceTypeDic[wDeviceLedger.DeviceTypeCode].ID;
                    }

                    //检查设备型号是否存在 不存在创建
                    if (!wDeviceModelDic.ContainsKey(wDeviceLedger.ModelNo))
                    {
                        wDMSDeviceModel = new DMSDeviceModel();
                        wDMSDeviceModel.Code = wDeviceLedger.ModelNo;
                        wDMSDeviceModel.Name = wDeviceLedger.ModelName;
                        wDMSDeviceModel.DeviceType = wDeviceLedger.DeviceType;
                        wDMSDeviceModel.DeviceTypeName = wDeviceLedger.DeviceTypeName;
                        wDMSDeviceModel.DeviceTypeCode = wDeviceLedger.DeviceTypeCode;
                        wDMSDeviceModel.Active = 1;
                        DMSDeviceModelDAO.getInstance().DMS_UpdateDeviceModel(wLoginUser, wDMSDeviceModel, wErrorCode);
                        if (wDMSDeviceModel.ID > 0)
                        {
                            wDeviceModelDic.Add(wDMSDeviceModel.Code, wDMSDeviceModel);
                            wDeviceLedger.ModelID = wDMSDeviceModel.ID;
                        }
                        else
                        {
                            wResult.Result.Add(StringUtils.Format("Code:{0} ModelNo：{1}  Error:DeviceModel Update Fail!",
                              wDeviceLedger.Code, wDeviceLedger.ModelNo));
                            continue;
                        }
                    }
                    else
                    {
                        wDeviceLedger.ModelID = wDeviceModelDic[wDeviceLedger.ModelNo].ID;
                    }


                    wDeviceLedger.MaintainerIDList = StringUtils.parseIntList(wDeviceLedger.MaintainerCode, wEmployeeIDSourveDic);


                    wSourveDic[wDeviceLedger.Code].Name = wDeviceLedger.Name;
                    wSourveDic[wDeviceLedger.Code].ModelName = wDeviceLedger.ModelName;
                    wSourveDic[wDeviceLedger.Code].ModelNo = wDeviceLedger.ModelNo;
                    wSourveDic[wDeviceLedger.Code].ModelID = wDeviceLedger.ModelID;
                    wSourveDic[wDeviceLedger.Code].DeviceType = wDeviceLedger.DeviceType;
                    wSourveDic[wDeviceLedger.Code].DeviceTypeName = wDeviceLedger.DeviceTypeName;
                    wSourveDic[wDeviceLedger.Code].DeviceTypeCode = wDeviceLedger.DeviceTypeCode;
                    wSourveDic[wDeviceLedger.Code].ManufactorName = wDeviceLedger.ManufactorName;
                    wSourveDic[wDeviceLedger.Code].ManufactorCode = wDeviceLedger.ManufactorCode;
                    wSourveDic[wDeviceLedger.Code].SupplierName = wDeviceLedger.SupplierName;
                    wSourveDic[wDeviceLedger.Code].SupplierCode = wDeviceLedger.SupplierCode;
                    wSourveDic[wDeviceLedger.Code].SupplierContactInfo = wDeviceLedger.SupplierContactInfo;
                    wSourveDic[wDeviceLedger.Code].AcceptanceDate = wDeviceLedger.AcceptanceDate;
                    wSourveDic[wDeviceLedger.Code].WarrantyPeriod = wDeviceLedger.WarrantyPeriod;
                    wSourveDic[wDeviceLedger.Code].AreaID = wDeviceLedger.AreaID;
                    wSourveDic[wDeviceLedger.Code].AreaNo = wDeviceLedger.AreaNo;
                    wSourveDic[wDeviceLedger.Code].Remark = wDeviceLedger.Remark;
                    wSourveDic[wDeviceLedger.Code].TeamID = wDeviceLedger.TeamID;
                    wSourveDic[wDeviceLedger.Code].TeamNo = wDeviceLedger.TeamNo;
                    wSourveDic[wDeviceLedger.Code].TeamName = wDeviceLedger.TeamName;
                    wSourveDic[wDeviceLedger.Code].MaintainerIDList = wDeviceLedger.MaintainerIDList;
                    wSourveDic[wDeviceLedger.Code].MaintainerCode = wDeviceLedger.MaintainerCode;
                    wSourveDic[wDeviceLedger.Code].MaintainerName = wDeviceLedger.MaintainerName;
                    wSourveDic[wDeviceLedger.Code].MaintainDate = wDeviceLedger.MaintainDate;
                    wSourveDic[wDeviceLedger.Code].NextMaintainDate = wDeviceLedger.NextMaintainDate;
                    wSourveDic[wDeviceLedger.Code].Active = wDeviceLedger.Active;

                    DMSDeviceLedgerDAO.getInstance().DMS_UpdateDeviceLedger(wLoginUser, wSourveDic[wDeviceLedger.Code], wErrorCode);
                    if (wErrorCode.Result != 0)
                    {
                        wResult.Result.Add(StringUtils.Format("Code:{0} Update Error:{1}",
                            wDeviceLedger.Code, MESException.getEnumType(wErrorCode.get()).getLabel()));

                    }

                }

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();

                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<DMSDeviceModel>> DMS_GetDeviceModelList(BMSEmployee wLoginUser, String wName,
                int wDeviceType, String wDeviceTypeName, String wDeviceTypeCode, int wOperatorID, int wActive)
        {
            ServiceResult<List<DMSDeviceModel>> wResult = new ServiceResult<List<DMSDeviceModel>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                List<DMSDeviceModel> wServerRst = DMSDeviceModelDAO.getInstance().DMS_SelectDeviceModelList(wLoginUser,
                    wName, wDeviceType, wDeviceTypeName, wDeviceTypeCode, wOperatorID, wActive, wErrorCode);
                wResult.setResult(wServerRst);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_SaveDeviceModel(BMSEmployee wLoginUser, DMSDeviceModel wDMSDeviceModel)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceModelDAO.getInstance().DMS_UpdateDeviceModel(wLoginUser, wDMSDeviceModel, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_ActiveDeviceModelList(BMSEmployee wLoginUser, List<Int32> wIDList,
                int wActive)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceModelDAO.getInstance().DMS_ActiveDeviceModel(wLoginUser, wIDList, wActive, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<Int32> DMS_DeleteDeviceModelList(BMSEmployee wLoginUser, DMSDeviceModel wDMSDeviceModel)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceModelDAO.getInstance().DMS_DeleteDeviceModel(wLoginUser, wDMSDeviceModel, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<List<DMSDeviceType>> DMS_GetDeviceTypeList(BMSEmployee wLoginUser, String wName, int wActive)
        {
            ServiceResult<List<DMSDeviceType>> wResult = new ServiceResult<List<DMSDeviceType>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                List<DMSDeviceType> wServerRst = DMSDeviceTypeDAO.getInstance().DMS_SelectDeviceTypeList(wLoginUser, wName,
                      wActive, wErrorCode);
                wResult.setResult(wServerRst);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_SaveDeviceType(BMSEmployee wLoginUser, DMSDeviceType wDMSDeviceType)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceTypeDAO.getInstance().DMS_UpdateDeviceType(wLoginUser, wDMSDeviceType, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_ActiveDeviceTypeList(BMSEmployee wLoginUser, List<Int32> wIDList,
                int wActive)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceTypeDAO.getInstance().DMS_ActiveDeviceType(wLoginUser, wIDList, wActive, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_DeleteDeviceTypeList(BMSEmployee wLoginUser, List<Int32> wIDList)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceTypeDAO.getInstance().DMS_DeleteDeviceType(wLoginUser, wIDList, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }




        public ServiceResult<List<DMSPosition>> DMS_GetPositionList(BMSEmployee wLoginUser, int wLineID, String wName, int wActive, Pagination wPagination)
        {
            ServiceResult<List<DMSPosition>> wResult = new ServiceResult<List<DMSPosition>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                List<DMSPosition> wServerRst = DMSPositionDAO.getInstance().DMS_SelectPositionList(wLoginUser, wLineID, wName,
                      wActive, wPagination, wErrorCode);
                wResult.setResult(wServerRst);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_SavePosition(BMSEmployee wLoginUser, DMSPosition wDMSPosition)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSPositionDAO.getInstance().DMS_UpdatePosition(wLoginUser, wDMSPosition, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_ActivePositionList(BMSEmployee wLoginUser, List<Int32> wIDList,
                int wActive)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSPositionDAO.getInstance().DMS_ActivePosition(wLoginUser, wIDList, wActive, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_DeletePositionList(BMSEmployee wLoginUser, List<Int32> wIDList)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSPositionDAO.getInstance().DMS_DeletePosition(wLoginUser, wIDList, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }




        public ServiceResult<List<DMSGroupParameter>> DMS_QueryGroupParameterList(BMSEmployee wLoginUser, String wName, String wVariableName,

               String wDeviceGroupCode, String wProtocol, String wOPCClass, int wDataType, int wDataClass, int wPositionID,
               int wActive, Pagination wPagination)
        {
            ServiceResult<List<DMSGroupParameter>> wResult = new ServiceResult<List<DMSGroupParameter>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                List<DMSGroupParameter> wServerRst = DMSGroupParameterDAO.getInstance().DMS_SelectGroupParameterList(wLoginUser, wName, wVariableName,

                 wDeviceGroupCode, wProtocol, wOPCClass, wDataType, wDataClass, wPositionID,
                wActive, wPagination, wErrorCode);
                wResult.setResult(wServerRst);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<DMSGroupParameter> DMS_QueryGroupParameter(BMSEmployee wLoginUser, int wID, String wCode)
        {
            ServiceResult<DMSGroupParameter> wResult = new ServiceResult<DMSGroupParameter>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSGroupParameter wServerRst = DMSGroupParameterDAO.getInstance().DMS_SelectGroupParameter(wLoginUser, wID,
                        wCode, wErrorCode);
                wResult.setResult(wServerRst);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.Message;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<Int32> DMS_UpdateGroupParameter(BMSEmployee wLoginUser, DMSGroupParameter wGroupParameter)
        {

            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSGroupParameterDAO.getInstance().DMS_UpdateGroupParameter(wLoginUser, wGroupParameter, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<List<String>> DMS_UpdateGroupParameterList(BMSEmployee wLoginUser, List<DMSGroupParameter> wGroupParameterList)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = new List<string>();
                int i = 1;
                foreach (DMSGroupParameter wGroupParameter in wGroupParameterList)
                {
                    if (!wGroupParameter.Code.StartsWith(wGroupParameter.DeviceGroupCode+"-"))
                        wGroupParameter.Code = wGroupParameter.DeviceGroupCode +"-"+ wGroupParameter.Code;

                    DMSGroupParameterDAO.getInstance().DMS_UpdateGroupParameter(wLoginUser, wGroupParameter, wErrorCode);

                    if (wErrorCode.get() > 0)
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}行数据 Code:{1} Import Error:{2} ", i,
                            wGroupParameter.Code, MESException.getEnumType(wErrorCode.get()).getLabel()));
                    }

                    i++;
                }
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<Int32> DMS_DeleteGroupParameter(BMSEmployee wLoginUser, DMSGroupParameter wGroupParameter)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSGroupParameterDAO.getInstance().DMS_DeleteGroupParameter(wLoginUser, wGroupParameter, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }
        public ServiceResult<Int32> DMS_ActiveGroupParameter(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSGroupParameterDAO.getInstance().DMS_ActiveGroupParameter(wLoginUser, wIDList, wActive, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }



        public ServiceResult<List<String>> DMS_UpdateDeviceParameterList(BMSEmployee wLoginUser, String wDeviceGroupCode, List<DMSDeviceLedger> wDMSDeviceLedgerList)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<DMSGroupParameter> wDMSGroupParameterList = DMSGroupParameterDAO.getInstance().DMS_SelectGroupParameterList(wLoginUser, "", "",

                wDeviceGroupCode, "", "", -1, -1, -1, 1, Pagination.Create(1, int.MaxValue), wErrorCode);


                wResult.Result = new List<string>();

                DMSDeviceParameter wDMSDeviceParameter;
                foreach (DMSDeviceLedger wDMSDeviceLedger in wDMSDeviceLedgerList)
                {

                    foreach (DMSGroupParameter wDMSGroupParameter in wDMSGroupParameterList)
                    {
                        wDMSDeviceParameter = wDMSGroupParameter.CreateDeviceParameter(wDMSDeviceLedger.ID, wDMSDeviceLedger.AssetNo);


                        DMSDeviceParameterDAO.getInstance().DMS_UpdateDeviceParameter(wLoginUser, wDMSDeviceParameter, wErrorCode);

                        if (wErrorCode.get() > 0)
                        {
                            wResult.Result.Add(StringUtils.Format("组编号：{0}  设备采集编号：{1} 参数编号：{2} Import Error:{3} ", wDeviceGroupCode,
                                wDMSDeviceLedger.AssetNo, wDMSDeviceParameter.Code, MESException.getEnumType(wErrorCode.get()).getLabel()));
                        }

                    }
                }

                if (wResult.Result.Count > 0)
                {
                    wResult.FaultCode = "生成设备参数错误，具体请看错误详情！";
                }
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<List<DMSDeviceParameter>> DMS_QueryDeviceParameterList(BMSEmployee wLoginUser, String wName, String wVariableName,

               int wLineID, int wDeviceID, String wDeviceNo, String wAssetNo, String wDeviceName, String wProtocol, String wOPCClass, int wDataType, int wDataClass, int wPositionID,
               int wActive, Pagination wPagination)
        {
            ServiceResult<List<DMSDeviceParameter>> wResult = new ServiceResult<List<DMSDeviceParameter>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                List<DMSDeviceParameter> wServerRst = DMSDeviceParameterDAO.getInstance().DMS_SelectDeviceParameterList(wLoginUser, wName, wVariableName,

                  wLineID, wDeviceID, wDeviceNo, wAssetNo, wDeviceName, wProtocol, wOPCClass, wDataType, wDataClass, wPositionID,
                wActive,  wPagination, wErrorCode);
                wResult.setResult(wServerRst);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<DMSDeviceParameter> DMS_QueryDeviceParameter(BMSEmployee wLoginUser, int wID, String wCode)
        {
            ServiceResult<DMSDeviceParameter> wResult = new ServiceResult<DMSDeviceParameter>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceParameter wServerRst = DMSDeviceParameterDAO.getInstance().DMS_SelectDeviceParameter(wLoginUser, wID,
                        wCode, wErrorCode);
                wResult.setResult(wServerRst);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.Message;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<Int32> DMS_UpdateDeviceParameter(BMSEmployee wLoginUser, DMSDeviceParameter wDeviceParameter)
        {

            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceParameterDAO.getInstance().DMS_UpdateDeviceParameter(wLoginUser, wDeviceParameter, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<List<String>> DMS_UpdateDeviceParameterList(BMSEmployee wLoginUser, List<DMSDeviceParameter> wDeviceParameterList)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = new List<string>();
                int i = 1;
                foreach (DMSDeviceParameter wDeviceParameter in wDeviceParameterList)
                {
                    DMSDeviceParameterDAO.getInstance().DMS_UpdateDeviceParameter(wLoginUser, wDeviceParameter, wErrorCode);

                    if (wErrorCode.get() > 0)
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}行数据 Code:{1} Import Error:{2} ", i,
                            wDeviceParameter.Code, MESException.getEnumType(wErrorCode.get()).getLabel()));
                    }

                    i++;
                }
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<Int32> DMS_DeleteDeviceParameter(BMSEmployee wLoginUser, DMSDeviceParameter wDeviceParameter)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceParameterDAO.getInstance().DMS_DeleteDeviceParameter(wLoginUser, wDeviceParameter, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }
        public ServiceResult<Int32> DMS_ActiveDeviceParameter(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceParameterDAO.getInstance().DMS_ActiveDeviceParameter(wLoginUser, wIDList, wActive, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }







        public ServiceResult<Dictionary<int, Dictionary<String, int>>> DMS_SelectDeviceStatusTime(BMSEmployee wLoginUser, List<Int32> wID, String wCode, String wName,
               String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID,
              DateTime wStartTime, DateTime wEndTime)
        {
            ServiceResult<Dictionary<int, Dictionary<String, int>>> wResult = new ServiceResult<Dictionary<int, Dictionary<String, int>>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = DMSDeviceStatusDAO.getInstance().DMS_SelectDeviceStatusTime(wLoginUser, wID,
                    wCode, wName, wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wTeamID,
                wStartTime, wEndTime, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<List<DMSDeviceAreaStatus>> DMS_CurrentDeviceStatusStatistics(BMSEmployee wLoginUser, String wDeviceName,
            String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID, int wStatus, Pagination wPagination)
        {
            ServiceResult<List<DMSDeviceAreaStatus>> wResult = new ServiceResult<List<DMSDeviceAreaStatus>>();
            try
            {
                wResult.Result = new List<DMSDeviceAreaStatus>();
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);


                List<DMSDeviceStatus> wDeviceStatusList = DMSDeviceStatusDAO.getInstance().DMS_CurrentDeviceStatusList(wLoginUser, -1, "", wDeviceName,
                 wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wTeamID, wStatus, -1,wPagination, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                if (wDeviceStatusList == null || wDeviceStatusList.Count <= 0 || wErrorCode.Result != 0)
                {
                    return wResult;
                }

                Dictionary<int, List<DMSDeviceStatus>> wDeviceStatusListDic = wDeviceStatusList.GroupBy(p => p.AreaID).ToDictionary(p => p.Key, p => p.ToList());

                List<Int32> wStatusList = DMSDeviceStatusDAO.mStatusList;

                DMSDeviceAreaStatus wDeviceAreaStatus = null;
                foreach (int wArea in wDeviceStatusListDic.Keys)
                {
                    if (!wDeviceStatusListDic.ContainsKey(wArea) || wDeviceStatusListDic[wArea] == null || wDeviceStatusListDic[wArea].Count <= 0)
                        continue;
                    wDeviceAreaStatus = new DMSDeviceAreaStatus();
                    wDeviceAreaStatus.AreaID = wArea;
                    wDeviceAreaStatus.AreaName = wDeviceStatusListDic[wArea][0].PositionText;
                    wDeviceAreaStatus.AreaNo = wDeviceStatusListDic[wArea][0].AreaNo;
                    wDeviceAreaStatus.DeviceCount = wDeviceStatusListDic[wArea].Count;

                    foreach (Int32 wStatusTemp in wStatusList)
                    {
                        wDeviceAreaStatus.StatusCount.Add(wStatusTemp.ToString(), wDeviceStatusListDic[wArea].Count(p => (p.Status & wStatusTemp) > 0));
                    }
                    wResult.Result.Add(wDeviceAreaStatus);
                }
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;


        }

        public ServiceResult<List<DMSDeviceStatus>> DMS_CurrentDeviceStatusList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, String wDeviceName,
               String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID, int wStatus, int wIsPlan,Pagination wPagination)
        {
            ServiceResult<List<DMSDeviceStatus>> wResult = new ServiceResult<List<DMSDeviceStatus>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = DMSDeviceStatusDAO.getInstance().DMS_CurrentDeviceStatusList(wLoginUser, wDeviceID, wDeviceNo, wDeviceName,
                    wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wTeamID, wStatus, wIsPlan,wPagination, wErrorCode);

                if (wResult.Result != null)
                {
                    foreach (DMSDeviceStatus wDeviceStatus in wResult.Result)
                    {
                        if (!PositionWorkpieceNo.ContainsKey(wDeviceStatus.LineID) || !PositionWorkpieceNo[wDeviceStatus.LineID].ContainsKey(wDeviceStatus.AssetNo))
                            continue;

                        wDeviceStatus.WorkpieceNoList = PositionWorkpieceNo[wDeviceStatus.LineID][wDeviceStatus.AssetNo];
                    }
                }

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatusList(BMSEmployee wLoginUser, String wName,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID,
               int wActive, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<DMSDeviceStatus>> wResult = new ServiceResult<List<DMSDeviceStatus>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<DMSDeviceStatus> wServerRst = DMSDeviceStatusDAO.getInstance().DMS_SelectDeviceStatusList(wLoginUser, wName,
                    wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wTeamID, wActive,
                    wStartTime, wEndTime, wPagination, wErrorCode);
                wResult.setResult(wServerRst);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }
        public ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatus(BMSEmployee wLoginUser, int wID, String wCode,
            String wAssetNo, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<DMSDeviceStatus>> wResult = new ServiceResult<List<DMSDeviceStatus>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<DMSDeviceStatus> wServerRst = DMSDeviceStatusDAO.getInstance().DMS_SelectDeviceStatus(wLoginUser, wID, wCode,
                    wAssetNo, wStartTime, wEndTime, wPagination, wErrorCode);
                wResult.setResult(wServerRst);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatusList(BMSEmployee wLoginUser,
            List<Int32> wIDList, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {

            ServiceResult<List<DMSDeviceStatus>> wResult = new ServiceResult<List<DMSDeviceStatus>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<DMSDeviceStatus> wServerRst = DMSDeviceStatusDAO.getInstance().DMS_SelectDeviceStatusList(wLoginUser,
                    wIDList, wStartTime, wEndTime, wPagination, wErrorCode);
                wResult.setResult(wServerRst);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatusDetailList(BMSEmployee wLoginUser, String wName, int wDeviceID,
         String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID,
        List<int> wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<DMSDeviceStatus>> wResult = new ServiceResult<List<DMSDeviceStatus>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<DMSDeviceStatus> wServerRst = DMSDeviceStatusDAO.getInstance().DMS_SelectDeviceStatusDetailList(wLoginUser, wName, wDeviceID,
                    wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wTeamID,
                    wStatus, wStartTime, wEndTime, wPagination, wErrorCode);
                wResult.setResult(wServerRst);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }
        public ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatusDetail(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
           String wAssetNo, List<int> wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<DMSDeviceStatus>> wResult = new ServiceResult<List<DMSDeviceStatus>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                wResult.Result = DMSDeviceStatusDAO.getInstance().DMS_SelectDeviceStatusDetail(wLoginUser, wDeviceID, wDeviceNo,

                    wAssetNo, wStatus, wStartTime, wEndTime, wPagination, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatusDetailList(BMSEmployee wLoginUser,
            List<Int32> wDeviceIDList, List<int> wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {

            ServiceResult<List<DMSDeviceStatus>> wResult = new ServiceResult<List<DMSDeviceStatus>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<DMSDeviceStatus> wServerRst = DMSDeviceStatusDAO.getInstance().DMS_SelectDeviceStatusDetailList(wLoginUser,
                    wDeviceIDList, wStatus, wStartTime, wEndTime, wPagination, wErrorCode);
                wResult.setResult(wServerRst);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<List<DMSDeviceAlarm>> DMS_CurrentDeviceAlarmList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, String wAssetNo,
                int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wPositionID, int wTeamID)
        {


            ServiceResult<List<DMSDeviceAlarm>> wResult = new ServiceResult<List<DMSDeviceAlarm>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                List<DMSDeviceAlarm> wServerRst = DMSDeviceAlarmDAO.getInstance().DMS_CurrentDeviceAlarmList(wLoginUser, wDeviceID, wDeviceNo,
                    wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wPositionID, wTeamID, wErrorCode);
                wResult.setResult(wServerRst);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;


        }

        public ServiceResult<List<DMSDeviceAlarm>> DMS_SelectDeviceAlarmList(BMSEmployee wLoginUser, String wName,
              String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wPositionID, int wTeamID,
           int wEventType, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {

            ServiceResult<List<DMSDeviceAlarm>> wResult = new ServiceResult<List<DMSDeviceAlarm>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<DMSDeviceAlarm> wServerRst = DMSDeviceAlarmDAO.getInstance().DMS_SelectDeviceAlarmList(wLoginUser, wName,
                    wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wPositionID, wTeamID,
                    wEventType, wStartTime, wEndTime, wPagination, wErrorCode);
                wResult.setResult(wServerRst);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<List<DMSDeviceAlarm>> DMS_SelectDeviceAlarm(BMSEmployee wLoginUser, int wID, String wCode,
            String wAssetNo, int wEventType, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<DMSDeviceAlarm>> wResult = new ServiceResult<List<DMSDeviceAlarm>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<DMSDeviceAlarm> wServerRst = DMSDeviceAlarmDAO.getInstance().DMS_SelectDeviceAlarm(wLoginUser, wID,
                    wCode, wAssetNo, wEventType, wStartTime, wEndTime, wPagination, wErrorCode);
                wResult.setResult(wServerRst);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<List<DMSDeviceAlarm>> DMS_SelectDeviceAlarmList(BMSEmployee wLoginUser,
            List<Int32> wIDList, int wEventType, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {

            ServiceResult<List<DMSDeviceAlarm>> wResult = new ServiceResult<List<DMSDeviceAlarm>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<DMSDeviceAlarm> wServerRst = DMSDeviceAlarmDAO.getInstance().DMS_SelectDeviceAlarmList(wLoginUser, wIDList,
                     wEventType, wStartTime, wEndTime, wPagination, wErrorCode);
                wResult.setResult(wServerRst);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;

        }

        public ServiceResult<Dictionary<int, Dictionary<String, Object>>> DMS_SelectDeviceRealParameterStructList(BMSEmployee wLoginUser, String wName, List<String> wVariableName,

                int wAreaID, int wDeviceID, String wDeviceNo, String wAssetNo, String wDeviceName, int wDataType, int wDataClass, int wPositionID)
        {
            ServiceResult<Dictionary<int, Dictionary<String, Object>>> wResult = new ServiceResult<Dictionary<int, Dictionary<String, Object>>>();
            try
            {
                Dictionary<int, Dictionary<String, Object>> wDeviceDicList = new Dictionary<int, Dictionary<string, object>>();
                wResult.Result = wDeviceDicList;

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                List<DMSDeviceRealParameter> wServerRst = DMSDeviceRealParameterDAO.getInstance().DMS_SelectDeviceRealParameterList(wLoginUser,
                    wName, wVariableName, wAreaID, wDeviceID, wDeviceNo, wAssetNo, wDeviceName, wDataType, wDataClass, wPositionID, wErrorCode);


                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

                if (wErrorCode.Result != 0)
                {
                    return wResult;
                }
                foreach (DMSDeviceRealParameter wDeviceRealParameter in wServerRst)
                {
                    if (!wDeviceDicList.ContainsKey(wDeviceRealParameter.DeviceID))
                    {
                        wDeviceDicList.Add(wDeviceRealParameter.DeviceID, new Dictionary<String, Object>());
                    }

                    if (!wDeviceDicList[wDeviceRealParameter.DeviceID].ContainsKey(wDeviceRealParameter.VariableName))
                    {
                        wDeviceDicList[wDeviceRealParameter.DeviceID].Add(wDeviceRealParameter.VariableName, wDeviceRealParameter.ParameterValue);
                    }
                }

            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;

        }


        public ServiceResult<Dictionary<String, Object>> DMS_SelectDeviceCurrentStruct(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, String wAssetNo)
        {
            ServiceResult<Dictionary<String, Object>> wResult = new ServiceResult<Dictionary<String, Object>>();
            try
            {
                wResult.Result = new Dictionary<string, object>();

                if (wDeviceID <= 0 && StringUtils.isEmpty(wDeviceNo) && StringUtils.isEmpty(wAssetNo))
                {
                    return wResult;
                }

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);


                //获取对应设备状态
                DMSDeviceStatus wDeviceStatus = DMSDeviceStatusDAO.getInstance().DMS_CurrentDeviceStatus(wLoginUser, wDeviceID, wDeviceNo,
                    wAssetNo, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                List<DMSDeviceParameter> wDeviceParameterList = DMSDeviceParameterDAO.getInstance().DMS_SelectDeviceParameterList(wLoginUser, wDeviceID, wDeviceNo, wAssetNo, (int)DMSDataClass.Status, Pagination.MaxSize, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                foreach (DMSDeviceParameter wDeviceParameter in wDeviceParameterList)
                {
                    if (wDeviceParameter == null || StringUtils.isEmpty(wDeviceParameter.VariableName))
                        continue;
                    if (wDeviceParameter.AnalysisOrder <= 0)
                        wDeviceParameter.AnalysisOrder = 1;
                    if (wDeviceParameter.AnalysisOrder > 30)
                        wDeviceParameter.AnalysisOrder = 30;
                    if (!wResult.Result.ContainsKey(wDeviceParameter.VariableName))
                    {
                        wResult.Result.Add(wDeviceParameter.VariableName, (wDeviceStatus.Status & (1 << (wDeviceParameter.AnalysisOrder - 1))) > 0 ? 1 : 0);
                    }
                }


                //获取对应设备报警
                List<DMSDeviceAlarm> wDeviceAlarmList = DMSDeviceAlarmDAO.getInstance().DMS_CurrentDeviceAlarmList(wLoginUser, wDeviceID, wDeviceNo,
                    wAssetNo, -1, -1, -1, -1, -1, -1, -1, -1, wErrorCode);


                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                foreach (DMSDeviceAlarm wDMSDeviceAlarm in wDeviceAlarmList)
                {
                    if (!wResult.Result.ContainsKey(wDMSDeviceAlarm.AlarmVariableName))
                    {
                        wResult.Result.Add(wDMSDeviceAlarm.AlarmVariableName, 1);
                    }
                }

                List<DMSDeviceRealParameter> wDeviceRealParameterList = DMSDeviceRealParameterDAO.getInstance().DMS_SelectDeviceRealParameterList(wLoginUser,
                    "", null, -1, wDeviceID, wDeviceNo, wAssetNo, "", -1, -1, -1, wErrorCode);


                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                foreach (DMSDeviceRealParameter wDeviceRealParameter in wDeviceRealParameterList)
                {
                    if (!wResult.Result.ContainsKey(wDeviceRealParameter.VariableName))
                    {
                        wResult.Result.Add(wDeviceRealParameter.VariableName, wDeviceRealParameter.ParameterValue);
                    }
                }

            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;



        }

        public ServiceResult<List<DMSDeviceRealParameter>> DMS_SelectDeviceRealParameterList(BMSEmployee wLoginUser, String wName, List<String> wVariableName,

                int wAreaID, int wDeviceID, String wDeviceNo, String wAssetNo, String wDeviceName, int wDataType, int wDataClass, int wPositionID)
        {
            ServiceResult<List<DMSDeviceRealParameter>> wResult = new ServiceResult<List<DMSDeviceRealParameter>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                List<DMSDeviceRealParameter> wServerRst = DMSDeviceRealParameterDAO.getInstance().DMS_SelectDeviceRealParameterList(wLoginUser,
                    wName, wVariableName, wAreaID, wDeviceID, wDeviceNo, wAssetNo, wDeviceName, wDataType, wDataClass, wPositionID, wErrorCode);
                wResult.setResult(wServerRst);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<List<DMSDeviceRealParameter>> DMS_SelectDeviceRealParameterList(BMSEmployee wLoginUser, List<Int32> wIDList)
        {
            ServiceResult<List<DMSDeviceRealParameter>> wResult = new ServiceResult<List<DMSDeviceRealParameter>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                List<DMSDeviceRealParameter> wServerRst = DMSDeviceRealParameterDAO.getInstance().DMS_SelectDeviceRealParameterList(wLoginUser,
                    wIDList, wErrorCode);
                wResult.setResult(wServerRst);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<DMSDeviceRealParameter> DMS_SelectDeviceRealParameter(BMSEmployee wLoginUser, int wID, String wCode)
        {
            ServiceResult<DMSDeviceRealParameter> wResult = new ServiceResult<DMSDeviceRealParameter>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = DMSDeviceRealParameterDAO.getInstance().DMS_SelectDeviceRealParameter(wLoginUser,
                    wID, wCode, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<List<DMSDeviceAlarmStatistics>> DMS_SelectDeviceAlarmStatisticsList(BMSEmployee wLoginUser,
           int wDeviceID, String wDeviceNo, String wDeviceName, String wAssetNo, int wDeviceType, int wModelID, int wFactoryID,
           int wWorkShopID, int wLineID, int wAreaID, int wTeamID, int wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<DMSDeviceAlarmStatistics>> wResult = new ServiceResult<List<DMSDeviceAlarmStatistics>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                List<DMSDeviceStatus> wDMSDeviceStatusList = DMSDeviceStatusDAO.getInstance().DMS_CurrentDeviceStatusList(wLoginUser,
                 wDeviceID, wDeviceNo, wDeviceName, wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wTeamID, wStatus, -1, wPagination, wErrorCode);


                List<Int32> wDeviceIDList = wDMSDeviceStatusList.Select(p => p.DeviceID).Distinct().ToList();


                wResult.Result = DMSDeviceAlarmDAO.getInstance().DMS_SelectDeviceAlarmStatisticsList(wLoginUser, wDeviceIDList, APSShiftPeriod.Day, wStartTime, wEndTime, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                wResult.Put("Frequency", DMSDeviceAlarmDAO.getInstance().DMS_SelectDeviceAlarmFrequencyList(wLoginUser, wDeviceIDList, wStartTime, wEndTime, wErrorCode));

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<List<DMSDeviceStatusStatistics>> DMS_SelectDeviceStatusStatisticsList(BMSEmployee wLoginUser,
            int wDeviceID, String wDeviceNo, String wDeviceName, String wAssetNo, int wDeviceType, int wModelID, int wFactoryID,
            int wWorkShopID, int wLineID, int wAreaID, int wTeamID, int wStatus, Boolean wIsCombine, Boolean wHasMaintan, DateTime wStartTime, DateTime wEndTime, Pagination wPagination, int wHasAlarm)
        {
            ServiceResult<List<DMSDeviceStatusStatistics>> wResult = new ServiceResult<List<DMSDeviceStatusStatistics>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = DMSDeviceStatusStatisticsDAO.getInstance().DMS_SelectDeviceStatusStatisticsList(wLoginUser, wDeviceID,
                     wDeviceNo, wDeviceName,
                 wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wTeamID, wStatus, wIsCombine, wHasMaintan,
                 wStartTime, wEndTime, wPagination, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();



                if (wResult.Result == null || wResult.Result.Count <= 0)
                {
                    wResult.Put("Alarm", new List<DMSDeviceAlarmStatistics>());
                    wResult.Put("Frequency", new List<DMSDeviceAlarmFrequency>());
                    return wResult;
                }


                if (wHasAlarm > 0)
                {
                    List<Int32> wDeviceIDList = wResult.Result.Select(p => p.DeviceID).Distinct().ToList();
                    wResult.Put("Alarm", DMSDeviceAlarmDAO.getInstance().DMS_SelectDeviceAlarmStatisticsList(wLoginUser, wDeviceIDList, APSShiftPeriod.Day, wStartTime, wEndTime, wErrorCode));

                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    wResult.Put("Frequency", DMSDeviceAlarmDAO.getInstance().DMS_SelectDeviceAlarmFrequencyList(wLoginUser, wDeviceIDList, wStartTime, wEndTime, wErrorCode));

                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }


            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<List<DMSProcessRecord>> DMS_CurrentProcessRecordList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, List<int> wDataClassList, int wActive, Pagination wPagination)
        {
            ServiceResult<List<DMSProcessRecord>> wResult = new ServiceResult<List<DMSProcessRecord>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = DMSProcessRecordDAO.getInstance().DMS_CurrentProcessRecordList(wLoginUser,
                    wDeviceID, wDeviceNo, wDataClassList, wActive, wPagination, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<List<DMSProcessRecord>> DMS_SelectProcessRecordList(BMSEmployee wLoginUser, int wLineID, int wProductID, 
            int wOrderID, String wOrderNo, String wAssetNo, String wWorkPartPointCode, int wDeviceID, String wDeviceNo, String wWorkpieceNo, int wRecordType,
            List<int> wDataClassList, int wActive, int wStatus, DateTime wStartTime, DateTime wEndTime, string wDeviceName, int wTechnologyID,int wModelID, Pagination wPagination)
        {
            ServiceResult<List<DMSProcessRecord>> wResult = new ServiceResult<List<DMSProcessRecord>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                //if(WEB.GlobalContext.ProcessRecordType == 1)
                wResult.Result = DMSProcessRecordDAO.getInstance().DMS_SelectProcessRecordListNew(wLoginUser, wLineID, wProductID, wOrderID,
                wOrderNo, wAssetNo, wWorkPartPointCode, wDeviceID, wDeviceNo, wWorkpieceNo, wRecordType,
                wDataClassList, wActive, wStatus, wStartTime, wEndTime, wDeviceName, wTechnologyID, wModelID, wPagination, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }
        public ServiceResult<List<DMSProcessRecord>> DMS_SelectProcessRecordUploadList(BMSEmployee wLoginUser)
        {
            ServiceResult<List<DMSProcessRecord>> wResult = new ServiceResult<List<DMSProcessRecord>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = DMSProcessRecordDAO.getInstance().DMS_SelectProcessRecordUploadList(wLoginUser, Pagination.Create(1, 100), wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<Int32> DMS_UpdateProcessRecordUploadStatus(BMSEmployee wLoginUser, List<Int32> wRecordIDList, int wUploadStatus)
        {

            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSProcessRecordDAO.getInstance().DMS_UpdateProcessRecordUploadStatus(wLoginUser, wRecordIDList, wUploadStatus, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<DMSProcessRecord> DMS_SelectLastProcessRecord(BMSEmployee wLoginUser, String wWorkpieceNo, int wRecordType)
        {
            ServiceResult<DMSProcessRecord> wResult = new ServiceResult<DMSProcessRecord>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = DMSProcessRecordDAO.getInstance().DMS_SelectLastRecord(wLoginUser, wWorkpieceNo, wRecordType
                    , wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }



        public ServiceResult<DMSProcessRecord> DMS_SelectProcessRecord(BMSEmployee wLoginUser, int wID)
        {
            ServiceResult<DMSProcessRecord> wResult = new ServiceResult<DMSProcessRecord>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = DMSProcessRecordDAO.getInstance().DMS_SelectProcessRecord(wLoginUser,
                    wID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<List<DMSProcessRecordItem>> DMS_SelectProcessRecordItemList(BMSEmployee wLoginUser, int wRecordID)
        {

            ServiceResult<List<DMSProcessRecordItem>> wResult = new ServiceResult<List<DMSProcessRecordItem>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = DMSProcessRecordDAO.getInstance().DMS_SelectProcessRecordItemList(wLoginUser, wRecordID, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<List<DMSProcessRecordItem>> DMS_SelectProcessRecordItemList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, int wRecordID,
            int wParameterID, String wParameterNo, int wActive, int wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {

            ServiceResult<List<DMSProcessRecordItem>> wResult = new ServiceResult<List<DMSProcessRecordItem>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = DMSProcessRecordDAO.getInstance().DMS_SelectProcessRecordItemList(wLoginUser, wDeviceID, wDeviceNo, wRecordID,
             wParameterID, wParameterNo, wActive, wStatus, wStartTime, wEndTime, wPagination, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<List<DMSDeviceRepair>> DMS_SelectDeviceRepairList(BMSEmployee wLoginUser, int wDeviceID,
            String wDeviceNo, int wAlarmType, int wAlarmLevel, int wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<DMSDeviceRepair>> wResult = new ServiceResult<List<DMSDeviceRepair>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                wResult.Result = DMSDeviceRepairDAO.getInstance().DMS_SelectDeviceRepairList(wLoginUser, wDeviceID, wDeviceNo,
                    wAlarmType, wAlarmLevel, wStatus, wStartTime, wEndTime, wPagination, wErrorCode);


                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<DMSDeviceRepair> DMS_SelectDeviceRepair(BMSEmployee wLoginUser, int wID, string wCode)
        {

            ServiceResult<DMSDeviceRepair> wResult = new ServiceResult<DMSDeviceRepair>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = DMSDeviceRepairDAO.getInstance().DMS_SelectDeviceRepair(wLoginUser, wID, wCode, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<Int32> DMS_UpdateDeviceRepair(BMSEmployee wLoginUser, DMSDeviceRepair wDMSDeviceRepair)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceRepairDAO.getInstance().DMS_UpdateDeviceRepair(wLoginUser, wDMSDeviceRepair, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        public ServiceResult<Int32> DMS_DeleteDeviceRepair(BMSEmployee wLoginUser, List<Int32> wIDList)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSDeviceRepairDAO.getInstance().DMS_DeleteDeviceRepair(wLoginUser, wIDList, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }




        public ServiceResult<Int32> DMS_SyncDeviceStatus(BMSEmployee wLoginUser, String wAssetNo, int wStatus)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            List<String> wSqlStringList = new List<string>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                if (StringUtils.isEmpty(wAssetNo))
                    return wResult;
                DMSDeviceStatus wDMSDeviceStatus = DMSDeviceStatusDAO.getInstance().DMS_CurrentDeviceStatus(wLoginUser, -1, "", wAssetNo, wErrorCode);

                if (wDMSDeviceStatus.DeviceID <= 0)
                {
                    return wResult;
                }

                List<DMSDeviceStatus> wCurrentDeviceStatusDetailList = DMSDeviceStatusDAO.getInstance().DMS_SelectDeviceCurrentStatusDetailList(wLoginUser, new List<int>() { wDMSDeviceStatus.DeviceID }, wErrorCode);

                var wCurrentDeviceStatusDetailDic = wCurrentDeviceStatusDetailList.GroupBy(p => p.Status).ToDictionary(p => p.Key, p => p.OrderByDescending(q => q.StatusTime).First());

                bool wIsCurrent = false;



                List<int> wKeepStatus = null;

                List<int> wLiveStatus = null;

                List<int> wOverStatus = null;

                List<DMSDeviceStatus> wCloseDetailStatusList = new List<DMSDeviceStatus>();


                #region 对比数据库状态是否缺少某些详情状态 则补充到列表
                wKeepStatus = DMSDeviceStatusEnumTool.getInstance().CompareStatus(DMSDeviceStatusEnumTool.getInstance().ListToStatus(wCurrentDeviceStatusDetailDic.Keys),
                    wDMSDeviceStatus.Status, out wLiveStatus, out wOverStatus);
                //对比原本状态是否缺少某些状态 则补充到列表

                if (wLiveStatus.Count > 0)
                {
                    //补充
                    foreach (var item in wLiveStatus)
                    {
                        if (wCurrentDeviceStatusDetailDic.ContainsKey(item))
                            continue;
                        wCurrentDeviceStatusDetailDic.Add(item, wDMSDeviceStatus.Clone());

                        wCurrentDeviceStatusDetailDic[item].ID = 0;
                        wCurrentDeviceStatusDetailDic[item].Status = item;
                    }
                }
                if (wOverStatus.Count > 0)
                {
                    //关闭
                    wCloseDetailStatusList.Clear();
                    foreach (var item in wOverStatus)
                    {
                        if (wCurrentDeviceStatusDetailDic.ContainsKey(item))
                        {
                            wCurrentDeviceStatusDetailDic[item].StatusTimeEnd = DateTime.Now;
                            wCurrentDeviceStatusDetailDic[item].Duration = ((int)wCurrentDeviceStatusDetailDic[item].StatusTimeEnd
                                .Subtract(wCurrentDeviceStatusDetailDic[item].StatusTime).TotalSeconds);
                            wCloseDetailStatusList.Add(wCurrentDeviceStatusDetailDic[item]);
                            wCurrentDeviceStatusDetailDic.Remove(item);
                        }
                    }
                    //加入插入或更新列表
                    wSqlStringList.AddRange(DMSDeviceStatusDAO.getInstance().DMS_CloseDetailStatusString(wCloseDetailStatusList, wDMSDeviceStatus.StatusTimeEnd));

                }
                if (wKeepStatus.Count > 0)
                {
                    foreach (var item in wKeepStatus)
                    {
                        if (!wCurrentDeviceStatusDetailDic.ContainsKey(item))
                        {

                            wCurrentDeviceStatusDetailDic.Add(item, wDMSDeviceStatus.Clone());
                            wCurrentDeviceStatusDetailDic[item].ID = 0;
                            wCurrentDeviceStatusDetailDic[item].Status = item;
                            continue;
                        }
                        wCurrentDeviceStatusDetailDic[item].StatusTimeEnd = DateTime.Now;
                        wCurrentDeviceStatusDetailDic[item].Duration = ((int)wCurrentDeviceStatusDetailDic[item].StatusTimeEnd
                            .Subtract(wCurrentDeviceStatusDetailDic[item].StatusTime).TotalSeconds);
                    }
                }

                #endregion


                if (wStatus == wDMSDeviceStatus.Status)
                {
                    wDMSDeviceStatus.Duration = ((int)(DateTime.Now - wDMSDeviceStatus.StatusTime).TotalSeconds);
                    wDMSDeviceStatus.StatusTimeEnd = DateTime.Now;
                    wIsCurrent = true;


                }
                else
                {

                    wDMSDeviceStatus.Duration = ((int)(DateTime.Now - wDMSDeviceStatus.StatusTime).TotalSeconds);
                    wDMSDeviceStatus.StatusTimeEnd = DateTime.Now;

                    //历史记录更改 将Active=1 and DeviceID   的EndDate以及Duration和Active更新
                    wSqlStringList.AddRange(DMSDeviceStatusDAO.getInstance().DMS_UpdateActiveStatusString(wDMSDeviceStatus.AssetNo, wDMSDeviceStatus.StatusTimeEnd, wDMSDeviceStatus.Status));

                    //若Active=1没有则新增一条记录 若Active=1存在但状态不对 先将Active改为0 然后新增一条记录
                    //不管历史 跳过此不走 


                    #region 对当前状态变更 少了什么状态  多了什么状态 与详情状态对比，
                    wKeepStatus = DMSDeviceStatusEnumTool.getInstance().CompareStatus(DMSDeviceStatusEnumTool.getInstance().ListToStatus(wCurrentDeviceStatusDetailDic.Keys),
                        wStatus, out wLiveStatus, out wOverStatus);

                    //增加了哪些
                    //新增对应详情状态
                    if (wLiveStatus.Count > 0)
                    {
                        //补充
                        foreach (var item in wLiveStatus)
                        {
                            if (wCurrentDeviceStatusDetailDic.ContainsKey(item))
                                continue;
                            wCurrentDeviceStatusDetailDic.Add(item, wDMSDeviceStatus.Clone());
                            wCurrentDeviceStatusDetailDic[item].StatusTime = DateTime.Now;
                            wCurrentDeviceStatusDetailDic[item].StatusTimeEnd = DateTime.Now;
                            wCurrentDeviceStatusDetailDic[item].Duration = 0;
                            wCurrentDeviceStatusDetailDic[item].Status = item;
                            wCurrentDeviceStatusDetailDic[item].ID = 0;
                        }
                    }
                    //消失了哪些
                    //关闭对应详情状态
                    if (wOverStatus.Count > 0)
                    {
                        //关闭
                        wCloseDetailStatusList.Clear();
                        foreach (var item in wOverStatus)
                        {
                            if (wCurrentDeviceStatusDetailDic.ContainsKey(item))
                            {
                                wCurrentDeviceStatusDetailDic[item].StatusTimeEnd = DateTime.Now;
                                wCurrentDeviceStatusDetailDic[item].Duration = ((int)wCurrentDeviceStatusDetailDic[item].StatusTimeEnd
                                    .Subtract(wCurrentDeviceStatusDetailDic[item].StatusTime).TotalSeconds);
                                wCloseDetailStatusList.Add(wCurrentDeviceStatusDetailDic[item]);
                                wCurrentDeviceStatusDetailDic.Remove(item);
                            }
                        }
                        //加入插入或更新列表
                        wSqlStringList.AddRange(DMSDeviceStatusDAO.getInstance().DMS_CloseDetailStatusString(wCloseDetailStatusList, wDMSDeviceStatus.StatusTimeEnd));
                    }

                    if (wKeepStatus.Count > 0)
                    {
                        foreach (var item in wKeepStatus)
                        {
                            if (!wCurrentDeviceStatusDetailDic.ContainsKey(item))
                            {

                                wCurrentDeviceStatusDetailDic.Add(item, wDMSDeviceStatus.Clone());
                                wCurrentDeviceStatusDetailDic[item].ID = 0;
                                wCurrentDeviceStatusDetailDic[item].Status = item;
                                continue;
                            }
                            wCurrentDeviceStatusDetailDic[item].StatusTimeEnd = DateTime.Now;
                            wCurrentDeviceStatusDetailDic[item].Duration = ((int)wCurrentDeviceStatusDetailDic[item].StatusTimeEnd
                                .Subtract(wCurrentDeviceStatusDetailDic[item].StatusTime).TotalSeconds);
                        }
                    }

                    #endregion

                    //不消失一直存在的
                    //更新持续时间 

                    //修改当前状态 wDMSDeviceStatus  StatusTime 以及Status Duration StatusTimeEnd  
                    wDMSDeviceStatus.StatusHistory = wDMSDeviceStatus.Status;
                    wDMSDeviceStatus.Status = wStatus;
                    wDMSDeviceStatus.StatusTime = DateTime.Now;
                    wDMSDeviceStatus.StatusTimeEnd = DateTime.Now;
                    //然后重新插入一条这个当前状态数据
                    wSqlStringList.Add(DMSDeviceStatusDAO.getInstance().DMS_InsertActiveStatusString(wDMSDeviceStatus));

                    wIsCurrent = false;


                }
                if (wIsCurrent)
                {
                    //更新当前历史状态时长 
                    wSqlStringList.Add(DMSDeviceStatusDAO.getInstance().DMS_KeepActiveStatusString(wDMSDeviceStatus));

                }
                //更新当前历史详情状态时长  用最后一个时间来更新 
                wSqlStringList.AddRange(DMSDeviceStatusDAO.getInstance().DMS_KeepDetailStatusString(wCurrentDeviceStatusDetailDic.Values, wDMSDeviceStatus.StatusTimeEnd));

                //更新或插入当前设备状态
                wSqlStringList.Add(DMSDeviceStatusDAO.getInstance().DMS_UpdateCurrentStatusString(wDMSDeviceStatus));


                DMSDeviceStatusDAO.getInstance().ExecuteSqlTransaction(wSqlStringList);


            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);

                logger.Info(StringUtils.Join("\n", wSqlStringList));
            }
            return wResult;
        }

        public ServiceResult<List<String>> DMS_SyncDeviceStatusList(BMSEmployee wLoginUser, List<DMSDeviceStatus> wDMSDeviceStatusList)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                wResult.Result = new List<string>();
                if (wDMSDeviceStatusList == null || wDMSDeviceStatusList.Count <= 0)
                    return wResult;

                wDMSDeviceStatusList.Sort((o1, o2) => o1.StatusTime.CompareTo(o2.StatusTime));

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<String> wAssetNoList = wDMSDeviceStatusList.Select(p => p.AssetNo).Distinct().ToList();

                Dictionary<string, List<DMSDeviceStatus>> wDMSDeviceStatusListDic = wDMSDeviceStatusList.GroupBy(p => p.AssetNo).ToDictionary(p => p.Key, p => p.ToList());

                //数据库当前状态与数据当前状态对比
                //有变更则查询最后一条历史记录
                //与数据库当前状态对比 更新结束时间并添加变更历史记录 
                //数据库当前状态变更为当前状态
                List<DMSDeviceStatus> wCurrentDeviceStatusList = DMSDeviceStatusDAO.getInstance().DMS_CurrentDeviceStatusList(wLoginUser, null, wAssetNoList, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                List<Int32> wDeviceIDList = wCurrentDeviceStatusList.Select(p => p.DeviceID).Distinct().ToList();
                wDeviceIDList.RemoveAll(p => p <= 0);

                List<DMSDeviceStatus> wCurrentDeviceStatusDetailSourceList = DMSDeviceStatusDAO.getInstance().DMS_SelectDeviceCurrentStatusDetailList(wLoginUser, wDeviceIDList, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                Dictionary<String, List<DMSDeviceStatus>> wCurrentDeviceStatusDetailListDic = wCurrentDeviceStatusDetailSourceList.GroupBy(p => p.AssetNo).ToDictionary(p => p.Key, p => p.ToList());

                Dictionary<int, DMSDeviceStatus> wCurrentDeviceStatusDetailDic = null;

                bool wIsCurrent = false;

                List<int> wKeepStatus = null;

                List<int> wLiveStatus = null;

                List<int> wOverStatus = null;

                List<String> wSqlStringList = new List<string>();

                List<DMSDeviceStatus> wCloseDetailStatusList = new List<DMSDeviceStatus>();

                DateTime wMaxStatusTime = new DateTime();
                foreach (DMSDeviceStatus wDMSDeviceStatus in wCurrentDeviceStatusList)
                {
                    if (!wDMSDeviceStatusListDic.ContainsKey(wDMSDeviceStatus.AssetNo)) //无此设备
                    {
                        wResult.Result.Add(StringUtils.Format("AssetNo:{0} Not Found!", wDMSDeviceStatus.AssetNo));
                        continue;
                    }
                    wMaxStatusTime = wDMSDeviceStatusListDic[wDMSDeviceStatus.AssetNo].Max(p => p.StatusTime);

                    if (wMaxStatusTime.CompareTo(wDMSDeviceStatus.StatusTime) < 0)
                    {
                        wResult.Result.Add(StringUtils.Format("AssetNo:{0} MaxStatusTime:{1} CurrentStatusTime:{2} Data too old!",
                            wDMSDeviceStatus.AssetNo, wMaxStatusTime.ToString("yyyy-MM-dd HH:mm:ss"), wDMSDeviceStatus.StatusTime.ToString("yyyy-MM-dd HH:mm:ss")));
                        continue;
                    }
                    wDMSDeviceStatusListDic[wDMSDeviceStatus.AssetNo].RemoveAll(p => p.StatusTime <= wDMSDeviceStatus.StatusTime);

                    if (wDMSDeviceStatusListDic[wDMSDeviceStatus.AssetNo].Count <= 0)
                        continue;

                    if (!wCurrentDeviceStatusDetailListDic.ContainsKey(wDMSDeviceStatus.AssetNo))
                        wCurrentDeviceStatusDetailListDic.Add(wDMSDeviceStatus.AssetNo, new List<DMSDeviceStatus>());

                    wCurrentDeviceStatusDetailDic = wCurrentDeviceStatusDetailListDic[wDMSDeviceStatus.AssetNo].GroupBy(p => p.Status).ToDictionary(p => p.Key, p => p.OrderByDescending(q => q.StatusTime).First());
                    //所有记录全部插入


                    wIsCurrent = false;
                    //第一条对比当前状态一样则跳过
                    foreach (DMSDeviceStatus wDeviceStatus in wDMSDeviceStatusListDic[wDMSDeviceStatus.AssetNo])
                    {
                        if (wDeviceStatus.Status == wDMSDeviceStatus.Status)
                        {
                            wDMSDeviceStatus.Duration = ((int)(wDeviceStatus.StatusTime - wDMSDeviceStatus.StatusTime).TotalSeconds);
                            wDMSDeviceStatus.StatusTimeEnd = wDeviceStatus.StatusTime;
                            wIsCurrent = true;
                            continue;
                        }
                        wDMSDeviceStatus.Duration = ((int)(wDeviceStatus.StatusTime - wDMSDeviceStatus.StatusTime).TotalSeconds);
                        wDMSDeviceStatus.StatusTimeEnd = wDeviceStatus.StatusTime;

                        //历史记录更改 将Active=1 and DeviceID   的EndDate以及Duration和Active更新
                        wSqlStringList.AddRange(DMSDeviceStatusDAO.getInstance().DMS_UpdateActiveStatusString(wDMSDeviceStatus.AssetNo, wDMSDeviceStatus.StatusTimeEnd, wDMSDeviceStatus.Status));

                        //若Active=1没有则新增一条记录 若Active=1存在但状态不对 先将Active改为0 然后新增一条记录
                        //不管历史 跳过此不走 


                        #region 对比原本状态是否缺少某些状态 则补充到列表
                        wKeepStatus = DMSDeviceStatusEnumTool.getInstance().CompareStatus(DMSDeviceStatusEnumTool.getInstance().ListToStatus(wCurrentDeviceStatusDetailDic.Keys),
                            wDMSDeviceStatus.Status, out wLiveStatus, out wOverStatus);
                        //对比原本状态是否缺少某些状态 则补充到列表

                        if (wLiveStatus.Count > 0)
                        {
                            //补充
                            foreach (var item in wLiveStatus)
                            {
                                if (wCurrentDeviceStatusDetailDic.ContainsKey(item))
                                    continue;
                                wCurrentDeviceStatusDetailDic.Add(item, wDMSDeviceStatus.Clone());

                                wCurrentDeviceStatusDetailDic[item].ID = 0;
                                wCurrentDeviceStatusDetailDic[item].Status = item;
                            }
                        }
                        if (wOverStatus.Count > 0)
                        {
                            //关闭
                            wCloseDetailStatusList.Clear();
                            foreach (var item in wOverStatus)
                            {
                                if (wCurrentDeviceStatusDetailDic.ContainsKey(item))
                                {
                                    wCurrentDeviceStatusDetailDic[item].StatusTimeEnd = wDeviceStatus.StatusTime;
                                    wCurrentDeviceStatusDetailDic[item].Duration = ((int)wCurrentDeviceStatusDetailDic[item].StatusTimeEnd
                                        .Subtract(wCurrentDeviceStatusDetailDic[item].StatusTime).TotalSeconds);
                                    wCloseDetailStatusList.Add(wCurrentDeviceStatusDetailDic[item]);
                                    wCurrentDeviceStatusDetailDic.Remove(item);
                                }
                            }
                            //加入插入或更新列表
                            wSqlStringList.AddRange(DMSDeviceStatusDAO.getInstance().DMS_CloseDetailStatusString(wCloseDetailStatusList, wDMSDeviceStatus.StatusTimeEnd));

                        }

                        #endregion

                        #region 对当前状态变更 少了什么状态  多了什么状态 与详情状态对比，
                        wKeepStatus = DMSDeviceStatusEnumTool.getInstance().CompareStatus(DMSDeviceStatusEnumTool.getInstance().ListToStatus(wCurrentDeviceStatusDetailDic.Keys),
                            wDeviceStatus.Status, out wLiveStatus, out wOverStatus);

                        //增加了哪些
                        //新增对应详情状态
                        if (wLiveStatus.Count > 0)
                        {
                            //补充
                            foreach (var item in wLiveStatus)
                            {
                                if (wCurrentDeviceStatusDetailDic.ContainsKey(item))
                                    continue;
                                wCurrentDeviceStatusDetailDic.Add(item, wDMSDeviceStatus.Clone());
                                wCurrentDeviceStatusDetailDic[item].StatusTime = wDeviceStatus.StatusTime;
                                wCurrentDeviceStatusDetailDic[item].StatusTimeEnd = wDeviceStatus.StatusTime;
                                wCurrentDeviceStatusDetailDic[item].Duration = 0;
                                wCurrentDeviceStatusDetailDic[item].Status = item;
                                wCurrentDeviceStatusDetailDic[item].ID = 0;
                            }
                        }
                        //消失了哪些
                        //关闭对应详情状态
                        if (wOverStatus.Count > 0)
                        {
                            //关闭
                            wCloseDetailStatusList.Clear();
                            foreach (var item in wOverStatus)
                            {
                                if (wCurrentDeviceStatusDetailDic.ContainsKey(item))
                                {
                                    wCurrentDeviceStatusDetailDic[item].StatusTimeEnd = wDeviceStatus.StatusTime;
                                    wCurrentDeviceStatusDetailDic[item].Duration = ((int)wCurrentDeviceStatusDetailDic[item].StatusTimeEnd
                                        .Subtract(wCurrentDeviceStatusDetailDic[item].StatusTime).TotalSeconds);
                                    wCloseDetailStatusList.Add(wCurrentDeviceStatusDetailDic[item]);
                                    wCurrentDeviceStatusDetailDic.Remove(item);
                                }
                            }
                            //加入插入或更新列表
                            wSqlStringList.AddRange(DMSDeviceStatusDAO.getInstance().DMS_CloseDetailStatusString(wCloseDetailStatusList, wDMSDeviceStatus.StatusTimeEnd));

                        }

                        #endregion

                        //不消失一直存在的
                        //更新持续时间 

                        //修改当前状态 wDMSDeviceStatus  StatusTime 以及Status Duration StatusTimeEnd  
                        wDMSDeviceStatus.StatusHistory = wDMSDeviceStatus.Status;
                        wDMSDeviceStatus.Status = wDeviceStatus.Status;
                        wDMSDeviceStatus.StatusTime = wDeviceStatus.StatusTime;
                        wDMSDeviceStatus.StatusTimeEnd = wDeviceStatus.StatusTimeEnd;
                        //然后重新插入一条这个当前状态数据
                        wSqlStringList.Add(DMSDeviceStatusDAO.getInstance().DMS_InsertActiveStatusString(wDMSDeviceStatus));

                        wIsCurrent = false;
                    }
                    //如果历史状态未变更但时长变更最后需要更新一下历史设备状态时长 包括详情时长 用最后这个状态时间来减去开始时间
                    if (wIsCurrent)
                    {
                        //更新当前历史状态时长 
                        wSqlStringList.Add(DMSDeviceStatusDAO.getInstance().DMS_KeepActiveStatusString(wDMSDeviceStatus));

                    }
                    //更新当前历史详情状态时长  用最后一个时间来更新 
                    wSqlStringList.AddRange(DMSDeviceStatusDAO.getInstance().DMS_KeepDetailStatusString(wCurrentDeviceStatusDetailDic.Values, wDMSDeviceStatus.StatusTimeEnd));

                    //更新或插入当前设备状态
                    wSqlStringList.Add(DMSDeviceStatusDAO.getInstance().DMS_UpdateCurrentStatusString(wDMSDeviceStatus));

                }

                DMSDeviceStatusDAO.getInstance().ExecuteSqlTransaction(wSqlStringList);
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<String>> DMS_SyncDeviceStatusHistoryList(BMSEmployee wLoginUser, List<DMSDeviceStatus> wDMSDeviceStatusList)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                wResult.Result = new List<string>();
                if (wDMSDeviceStatusList == null || wDMSDeviceStatusList.Count <= 0)
                    return wResult;

                wDMSDeviceStatusList.Sort((o1, o2) => o1.StatusTime.CompareTo(o2.StatusTime));

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<String> wAssetNoList = wDMSDeviceStatusList.Select(p => p.AssetNo).Distinct().ToList();

                Dictionary<string, List<DMSDeviceStatus>> wDMSDeviceStatusListDic = wDMSDeviceStatusList.GroupBy(p => p.AssetNo).ToDictionary(p => p.Key, p => p.ToList());

                //数据库当前状态与数据当前状态对比
                //有变更则查询最后一条历史记录
                //与数据库当前状态对比 更新结束时间并添加变更历史记录 
                //数据库当前状态变更为当前状态
                List<DMSDeviceStatus> wCurrentDeviceStatusList = DMSDeviceStatusDAO.getInstance().DMS_CurrentDeviceStatusList(wLoginUser, null, wAssetNoList, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                List<Int32> wDeviceIDList = wCurrentDeviceStatusList.Select(p => p.DeviceID).Distinct().ToList();
                wDeviceIDList.RemoveAll(p => p <= 0);

                List<DMSDeviceStatus> wCurrentDeviceStatusDetailSourceList = DMSDeviceStatusDAO.getInstance().DMS_SelectDeviceCurrentStatusDetailList(wLoginUser, wDeviceIDList, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                Dictionary<String, List<DMSDeviceStatus>> wCurrentDeviceStatusDetailListDic = wCurrentDeviceStatusDetailSourceList.GroupBy(p => p.AssetNo).ToDictionary(p => p.Key, p => p.ToList());

                Dictionary<int, DMSDeviceStatus> wCurrentDeviceStatusDetailDic = null;

                bool wIsCurrent = false;

                List<int> wKeepStatus = null;

                List<int> wLiveStatus = null;

                List<int> wOverStatus = null;

                List<String> wSqlStringList = new List<string>();

                List<DMSDeviceStatus> wCloseDetailStatusList = new List<DMSDeviceStatus>();

                DateTime wMaxStatusTime = new DateTime();
                foreach (DMSDeviceStatus wDMSDeviceStatus in wCurrentDeviceStatusList)
                {
                    if (!wDMSDeviceStatusListDic.ContainsKey(wDMSDeviceStatus.AssetNo)) //无此设备
                    {
                        wResult.Result.Add(StringUtils.Format("AssetNo:{0} Not Found!", wDMSDeviceStatus.AssetNo));
                        continue;
                    }
                    wMaxStatusTime = wDMSDeviceStatusListDic[wDMSDeviceStatus.AssetNo].Max(p => p.StatusTime);

                    if (wMaxStatusTime.CompareTo(wDMSDeviceStatus.StatusTime) < 0)
                    {
                        wResult.Result.Add(StringUtils.Format("AssetNo:{0} MaxStatusTime:{1} CurrentStatusTime:{2} Data too old!",
                            wDMSDeviceStatus.AssetNo, wMaxStatusTime.ToString("yyyy-MM-dd HH:mm:ss"), wDMSDeviceStatus.StatusTime.ToString("yyyy-MM-dd HH:mm:ss")));
                        continue;
                    }
                    wDMSDeviceStatusListDic[wDMSDeviceStatus.AssetNo].RemoveAll(p => p.StatusTime <= wDMSDeviceStatus.StatusTime);

                    if (wDMSDeviceStatusListDic[wDMSDeviceStatus.AssetNo].Count <= 0)
                        continue;

                    if (!wCurrentDeviceStatusDetailListDic.ContainsKey(wDMSDeviceStatus.AssetNo))
                        wCurrentDeviceStatusDetailListDic.Add(wDMSDeviceStatus.AssetNo, new List<DMSDeviceStatus>());

                    wCurrentDeviceStatusDetailDic = wCurrentDeviceStatusDetailListDic[wDMSDeviceStatus.AssetNo].GroupBy(p => p.Status).ToDictionary(p => p.Key, p => p.OrderByDescending(q => q.StatusTime).First());
                    //所有记录全部插入


                    wIsCurrent = false;
                    //第一条对比当前状态一样则跳过
                    foreach (DMSDeviceStatus wDeviceStatus in wDMSDeviceStatusListDic[wDMSDeviceStatus.AssetNo])
                    {
                        if (wDeviceStatus.Status == wDMSDeviceStatus.Status)
                        {
                            wDMSDeviceStatus.Duration = ((int)(wDeviceStatus.StatusTime - wDMSDeviceStatus.StatusTime).TotalSeconds);
                            wDMSDeviceStatus.StatusTimeEnd = wDeviceStatus.StatusTime;
                            wIsCurrent = true;
                            continue;
                        }
                        wDMSDeviceStatus.Duration = ((int)(wDeviceStatus.StatusTime - wDMSDeviceStatus.StatusTime).TotalSeconds);
                        wDMSDeviceStatus.StatusTimeEnd = wDeviceStatus.StatusTime;

                        //历史记录更改 将Active=1 and DeviceID   的EndDate以及Duration和Active更新
                        wSqlStringList.AddRange(DMSDeviceStatusDAO.getInstance().DMS_UpdateActiveStatusString(wDMSDeviceStatus.AssetNo, wDMSDeviceStatus.StatusTimeEnd, wDMSDeviceStatus.Status));

                        //若Active=1没有则新增一条记录 若Active=1存在但状态不对 先将Active改为0 然后新增一条记录
                        //不管历史 跳过此不走 


                        #region 对比原本状态是否缺少某些状态 则补充到列表
                        wKeepStatus = DMSDeviceStatusEnumTool.getInstance().CompareStatus(DMSDeviceStatusEnumTool.getInstance().ListToStatus(wCurrentDeviceStatusDetailDic.Keys),
                            wDMSDeviceStatus.Status, out wLiveStatus, out wOverStatus);
                        //对比原本状态是否缺少某些状态 则补充到列表

                        if (wLiveStatus.Count > 0)
                        {
                            //补充
                            foreach (var item in wLiveStatus)
                            {
                                if (wCurrentDeviceStatusDetailDic.ContainsKey(item))
                                    continue;
                                wCurrentDeviceStatusDetailDic.Add(item, wDMSDeviceStatus.Clone());

                                wCurrentDeviceStatusDetailDic[item].Status = item;
                            }
                        }
                        if (wOverStatus.Count > 0)
                        {
                            //关闭
                            wCloseDetailStatusList.Clear();
                            foreach (var item in wOverStatus)
                            {
                                if (wCurrentDeviceStatusDetailDic.ContainsKey(item))
                                {
                                    wCurrentDeviceStatusDetailDic[item].StatusTimeEnd = wDeviceStatus.StatusTime;
                                    wCurrentDeviceStatusDetailDic[item].Duration = ((int)wCurrentDeviceStatusDetailDic[item].StatusTimeEnd
                                        .Subtract(wCurrentDeviceStatusDetailDic[item].StatusTime).TotalSeconds);
                                    wCloseDetailStatusList.Add(wCurrentDeviceStatusDetailDic[item]);
                                    wCurrentDeviceStatusDetailDic.Remove(item);
                                }
                            }
                            //加入插入或更新列表
                            wSqlStringList.AddRange(DMSDeviceStatusDAO.getInstance().DMS_CloseDetailStatusString(wCloseDetailStatusList, wDMSDeviceStatus.StatusTimeEnd));

                        }

                        #endregion

                        #region 对当前状态变更 少了什么状态  多了什么状态 与详情状态对比，
                        wKeepStatus = DMSDeviceStatusEnumTool.getInstance().CompareStatus(DMSDeviceStatusEnumTool.getInstance().ListToStatus(wCurrentDeviceStatusDetailDic.Keys),
                            wDeviceStatus.Status, out wLiveStatus, out wOverStatus);

                        //增加了哪些
                        //新增对应详情状态
                        if (wLiveStatus.Count > 0)
                        {
                            //补充
                            foreach (var item in wLiveStatus)
                            {
                                if (wCurrentDeviceStatusDetailDic.ContainsKey(item))
                                    continue;
                                wCurrentDeviceStatusDetailDic.Add(item, wDMSDeviceStatus.Clone());
                                wCurrentDeviceStatusDetailDic[item].StatusTime = wDeviceStatus.StatusTime;
                                wCurrentDeviceStatusDetailDic[item].StatusTimeEnd = wDeviceStatus.StatusTime;
                                wCurrentDeviceStatusDetailDic[item].Duration = 0;
                                wCurrentDeviceStatusDetailDic[item].Status = item;
                            }
                        }
                        //消失了哪些
                        //关闭对应详情状态
                        if (wOverStatus.Count > 0)
                        {
                            //关闭
                            wCloseDetailStatusList.Clear();
                            foreach (var item in wOverStatus)
                            {
                                if (wCurrentDeviceStatusDetailDic.ContainsKey(item))
                                {
                                    wCurrentDeviceStatusDetailDic[item].StatusTimeEnd = wDeviceStatus.StatusTime;
                                    wCurrentDeviceStatusDetailDic[item].Duration = ((int)wCurrentDeviceStatusDetailDic[item].StatusTimeEnd
                                        .Subtract(wCurrentDeviceStatusDetailDic[item].StatusTime).TotalSeconds);
                                    wCloseDetailStatusList.Add(wCurrentDeviceStatusDetailDic[item]);
                                    wCurrentDeviceStatusDetailDic.Remove(item);
                                }
                            }
                            //加入插入或更新列表
                            wSqlStringList.AddRange(DMSDeviceStatusDAO.getInstance().DMS_CloseDetailStatusString(wCloseDetailStatusList, wDMSDeviceStatus.StatusTimeEnd));

                        }

                        #endregion

                        //不消失一直存在的
                        //更新持续时间 

                        //修改当前状态 wDMSDeviceStatus  StatusTime 以及Status Duration StatusTimeEnd  
                        wDMSDeviceStatus.StatusHistory = wDMSDeviceStatus.Status;
                        wDMSDeviceStatus.Status = wDeviceStatus.Status;
                        wDMSDeviceStatus.StatusTime = wDeviceStatus.StatusTime;
                        wDMSDeviceStatus.StatusTimeEnd = wDeviceStatus.StatusTimeEnd;
                        //然后重新插入一条这个当前状态数据
                        wSqlStringList.Add(DMSDeviceStatusDAO.getInstance().DMS_InsertActiveStatusString(wDMSDeviceStatus));

                        wIsCurrent = false;
                    }
                    //如果历史状态未变更但时长变更最后需要更新一下历史设备状态时长 包括详情时长 用最后这个状态时间来减去开始时间
                    if (wIsCurrent)
                    {
                        //更新当前历史状态时长 
                        wSqlStringList.Add(DMSDeviceStatusDAO.getInstance().DMS_KeepActiveStatusString(wDMSDeviceStatus));

                    }
                    //更新当前历史详情状态时长  用最后一个时间来更新 
                    wSqlStringList.AddRange(DMSDeviceStatusDAO.getInstance().DMS_KeepDetailStatusString(wCurrentDeviceStatusDetailDic.Values, wDMSDeviceStatus.StatusTimeEnd));

                    //更新或插入当前设备状态
                    wSqlStringList.Add(DMSDeviceStatusDAO.getInstance().DMS_UpdateCurrentStatusString(wDMSDeviceStatus));

                }

                DMSDeviceStatusDAO.getInstance().ExecuteSqlTransaction(wSqlStringList);
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<Int32> DMS_CloseDeviceAlarmAll(BMSEmployee wLoginUser, String wAssetNo)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                List<String> wSqlStringList = DMSDeviceAlarmDAO.getInstance().DMS_CloseAlarmAll(wAssetNo);

                DMSDeviceAlarmDAO.getInstance().ExecuteSqlTransaction(wSqlStringList);
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }




        public ServiceResult<Int32> DMS_SyncDeviceAlarm(BMSEmployee wLoginUser, String wAssetNo, String wAlarmCode, int wEventType, int wIsCode)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                List<String> wSqlStringList = new List<string>();

                DMSDeviceAlarm wDMSDeviceAlarm = new DMSDeviceAlarm();

                wDMSDeviceAlarm.AssetNo = wAssetNo;
                wDMSDeviceAlarm.AlarmCode = wAlarmCode;
                wDMSDeviceAlarm.EventType = wEventType;

                if (wEventType == 1)
                {
                    wDMSDeviceAlarm.StatusTime = DateTime.Now;
                    if (wIsCode == 1)
                    {
                        wSqlStringList.AddRange(DMSDeviceAlarmDAO.getInstance().DMS_CloseAlarmCodeHistoryString(wAssetNo));
                        wSqlStringList.Add(DMSDeviceAlarmDAO.getInstance().DMS_DeleteAlarmCodeString(wAssetNo));

                    }
                    //删除当前报警
                    wSqlStringList.Add(DMSDeviceAlarmDAO.getInstance().DMS_DeleteAlarmString(wAssetNo, wAlarmCode));
                    //新增当前报警
                    wSqlStringList.Add(DMSDeviceAlarmDAO.getInstance().DMS_InsertCurrentAlarmString(wDMSDeviceAlarm, wIsCode));
                    //新增历史报警
                    wSqlStringList.Add(DMSDeviceAlarmDAO.getInstance().DMS_InsertAlarmHistoryString(wDMSDeviceAlarm));
                }
                else
                {
                    wDMSDeviceAlarm.StatusTimeEnd = DateTime.Now;
                    if (wIsCode == 1)
                    {
                        wSqlStringList.AddRange(DMSDeviceAlarmDAO.getInstance().DMS_CloseAlarmCodeHistoryString(wAssetNo));
                        wSqlStringList.Add(DMSDeviceAlarmDAO.getInstance().DMS_DeleteAlarmCodeString(wAssetNo));
                    }
                    else
                    {

                        wSqlStringList.AddRange(DMSDeviceAlarmDAO.getInstance().DMS_CloseAlarmHistoryString(wDMSDeviceAlarm));
                        //删除当前报警 
                        wSqlStringList.Add(DMSDeviceAlarmDAO.getInstance().DMS_DeleteAlarmString(wAssetNo, wAlarmCode));


                    }


                }

                DMSDeviceAlarmDAO.getInstance().ExecuteSqlTransaction(wSqlStringList);


            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<DMSDeviceParameter> DMS_SyncDeviceAlarm(BMSEmployee wLoginUser, int wDeviceID, String wAssetNo, String wAlarmCode)
        {
            ServiceResult<DMSDeviceParameter> wResult = new ServiceResult<DMSDeviceParameter>();
            try
            {
                if (StringUtils.isEmpty(wAlarmCode))
                    return wResult;

                OutResult<Int32> wErrorCode = new OutResult<int>(0);

                DMSDeviceParameter wDMSDeviceParameter = new DMSDeviceParameter();
                wDMSDeviceParameter.AssetNo = wAssetNo;
                wDMSDeviceParameter.DeviceID = wDeviceID;
                wDMSDeviceParameter.VariableName = StringUtils.Format("AlarmAuto_{0}", wAlarmCode);
                wDMSDeviceParameter.Name = StringUtils.Format("报警编号_{0}", wAlarmCode);
                wDMSDeviceParameter.DataType = ((int)DMSDataTypes.String);
                wDMSDeviceParameter.DataAction = ((int)DMSDataActions.Default);
                wDMSDeviceParameter.DataClass = ((int)DMSDataClass.Alarm);
                wDMSDeviceParameter.DataLength = wAlarmCode.Length;
                wDMSDeviceParameter.ParameterDesc = wAlarmCode;
                wDMSDeviceParameter.Active = 1;

                DMSDeviceParameterDAO.getInstance().DMS_UpdateDeviceParameter(wLoginUser, wDMSDeviceParameter, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                if (StringUtils.isNotEmpty(wResult.FaultCode))
                {
                    return wResult;
                }
                wResult.Result = wDMSDeviceParameter;


                List<String> wSqlStringList = new List<string>();

                DMSDeviceAlarm wDMSDeviceAlarm = new DMSDeviceAlarm();
                wDMSDeviceAlarm.StatusTime = DateTime.Now;
                wDMSDeviceAlarm.StatusTime = DateTime.Now;
                wDMSDeviceAlarm.AssetNo = wAssetNo;
                wDMSDeviceAlarm.AlarmCode = wDMSDeviceParameter.Code;
                wDMSDeviceAlarm.EventType = 1;
                //新增当前报警
                wSqlStringList.Add(DMSDeviceAlarmDAO.getInstance().DMS_InsertCurrentAlarmString(wDMSDeviceAlarm, 1));
                //新增历史报警
                wSqlStringList.Add(DMSDeviceAlarmDAO.getInstance().DMS_InsertAlarmHistoryString(wDMSDeviceAlarm));

                DMSDeviceAlarmDAO.getInstance().ExecuteSqlTransaction(wSqlStringList);

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<String>> DMS_SyncDeviceAlarmList(BMSEmployee wLoginUser, List<String> wAssetNoList,
            List<DMSDeviceAlarm> wDMSDeviceAlarmList)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                wResult.Result = new List<string>();
                if (wAssetNoList == null || wAssetNoList.Count <= 0)
                    return wResult;

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<DMSDeviceLedger> wDMSDeviceLedgerList = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedgerList(wLoginUser,
                     -1, -1, Pagination.Create(1, int.MaxValue), wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                wDMSDeviceLedgerList = wDMSDeviceLedgerList.OrderByDescending(p => p.Active).ThenByDescending(p => p.EditTime).ToList();

                Dictionary<string, DMSDeviceLedger> wDMSDeviceLedgerDic = wDMSDeviceLedgerList.GroupBy(p => p.AssetNo).ToDictionary(p => p.Key, p => p.First());


                if (wDMSDeviceAlarmList == null)
                    wDMSDeviceAlarmList = new List<DMSDeviceAlarm>();

                wDMSDeviceAlarmList.Sort((o1, o2) => o2.StatusTime.CompareTo(o1.StatusTime));

                Dictionary<string, Dictionary<string, DMSDeviceAlarm>> wDMSDeviceAlarmListDic = wDMSDeviceAlarmList.GroupBy(p => p.AssetNo)
                    .ToDictionary(p => p.Key, p => p.GroupBy(q => q.AlarmCode).ToDictionary(q => q.Key, q => q.First()));

                List<DMSDeviceAlarm> wDMSDeviceAlarmListSource = DMSDeviceAlarmDAO.getInstance().DMS_CurrentDeviceAlarmList(wLoginUser, null, wAssetNoList, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }

                wDMSDeviceAlarmListSource.Sort((o1, o2) => o2.StatusTime.CompareTo(o1.StatusTime));

                Dictionary<string, Dictionary<string, DMSDeviceAlarm>> wDMSDeviceAlarmListSourceDic = wDMSDeviceAlarmListSource.GroupBy(p => p.AssetNo)
                    .ToDictionary(p => p.Key, p => p.GroupBy(q => q.AlarmCode).ToDictionary(q => q.Key, q => q.First()));


                List<String> wSqlStringList = new List<string>();


                //对比报警将消失的报警插入历史报警eventtype=2

                foreach (String wAssetNo in wAssetNoList)
                {
                    if (!wDMSDeviceLedgerDic.ContainsKey(wAssetNo))
                    {
                        wResult.Result.Add(StringUtils.Format("AssetNo:{0} Not Found!",
                              wAssetNo));
                        continue;
                    }

                    if (!wDMSDeviceAlarmListDic.ContainsKey(wAssetNo))
                    {

                        if (!wDMSDeviceAlarmListSourceDic.ContainsKey(wAssetNo))
                            continue;
                        //删除当前报警
                        wSqlStringList.Add(DMSDeviceAlarmDAO.getInstance().DMS_DeleteAlarmString(wAssetNo));

                        //关闭历史报警
                        wSqlStringList.AddRange(DMSDeviceAlarmDAO.getInstance().DMS_CloseAlarmHistoryString(wDMSDeviceAlarmListSourceDic[wAssetNo].Values));

                        continue;
                    }
                    if (!wDMSDeviceAlarmListSourceDic.ContainsKey(wAssetNo))
                        wDMSDeviceAlarmListSourceDic.Add(wAssetNo, new Dictionary<string, DMSDeviceAlarm>());


                    foreach (String wAlarmCode in wDMSDeviceAlarmListDic[wAssetNo].Keys)
                    {
                        if (wDMSDeviceAlarmListSourceDic[wAssetNo].ContainsKey(wAlarmCode))
                            continue;
                        //新增当前报警
                        wSqlStringList.Add(DMSDeviceAlarmDAO.getInstance().DMS_InsertCurrentAlarmString(wDMSDeviceAlarmListDic[wAssetNo][wAlarmCode], 0));
                        //新增历史报警
                        wSqlStringList.Add(DMSDeviceAlarmDAO.getInstance().DMS_InsertAlarmHistoryString(wDMSDeviceAlarmListDic[wAssetNo][wAlarmCode]));
                    }

                    foreach (String wAlarmCode in wDMSDeviceAlarmListSourceDic[wAssetNo].Keys)
                    {
                        if (wDMSDeviceAlarmListDic[wAssetNo].ContainsKey(wAlarmCode))
                            continue;
                        // 关闭历史报警
                        wSqlStringList.AddRange(DMSDeviceAlarmDAO.getInstance().DMS_CloseAlarmHistoryString(wDMSDeviceAlarmListSourceDic[wAssetNo][wAlarmCode]));
                        //删除当前报警
                        wSqlStringList.Add(DMSDeviceAlarmDAO.getInstance().DMS_DeleteAlarmString(wAssetNo, wAlarmCode));

                    }
                }
                DMSDeviceStatusDAO.getInstance().ExecuteSqlTransaction(wSqlStringList);
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<String>> DMS_SyncDeviceAlarmHistoryList(BMSEmployee wLoginUser, List<DMSDeviceAlarm> wDMSDeviceAlarmList)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                wResult.Result = new List<string>();
                if (wDMSDeviceAlarmList == null || wDMSDeviceAlarmList.Count <= 0)
                    return wResult;

                DMSDeviceStatusDAO.getInstance().ExecuteSqlTransaction(DMSDeviceAlarmDAO.getInstance().DMS_AddAlarmHistoryString(wDMSDeviceAlarmList));
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_SyncDeviceRealParameter(BMSEmployee wLoginUser, String wAssetNo, String wParameterCode, String wParameterValue)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                if (StringUtils.isEmpty(wAssetNo) || StringUtils.isEmpty(wParameterCode))
                    return wResult;
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);



                DMSDeviceRealParameter wDMSDeviceRealParameter = DMSDeviceRealParameterDAO.getInstance().DMS_SelectDeviceRealParameter(wLoginUser, 0, wParameterCode, wErrorCode);
                if (wDMSDeviceRealParameter == null || wDMSDeviceRealParameter.ParameterID <= 0)
                    return wResult;

                wDMSDeviceRealParameter.ParameterValue = wParameterValue;

                wDMSDeviceRealParameter.UpdateTime = DateTime.Now;
                DMSDeviceStatusDAO.getInstance().ExecuteSqlTransaction(DMSDeviceRealParameterDAO.getInstance().DMS_UpdateDeviceRealParameter(wDMSDeviceRealParameter));
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<String>> DMS_SyncDeviceRealParameterList(BMSEmployee wLoginUser, List<DMSDeviceRealParameter> wDMSDeviceRealParameterList)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                wResult.Result = new List<string>();
                if (wDMSDeviceRealParameterList == null || wDMSDeviceRealParameterList.Count <= 0)
                    return wResult;
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);


                Dictionary<string, List<DMSDeviceRealParameter>> wDMSDeviceRealParameterListDic = wDMSDeviceRealParameterList.GroupBy(p => p.AssetNo).ToDictionary(p => p.Key, p => p.ToList());

                List<String> wAssetNoList = wDMSDeviceRealParameterListDic.Keys.ToList();

                List<DMSDeviceRealParameter> wDMSDeviceRealParameterSourceList = DMSDeviceRealParameterDAO.getInstance().DMS_SelectDeviceRealParameterList(wLoginUser, null, wAssetNoList, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;

                }
                Dictionary<string, Dictionary<string, DMSDeviceRealParameter>> wDMSDeviceRealParameterSourceListDic = wDMSDeviceRealParameterSourceList.GroupBy(p => p.AssetNo)
                    .ToDictionary(p => p.Key, p => p.GroupBy(q => q.ParameterCode).ToDictionary(q => q.Key, q => q.First()));

                List<String> wSqlStringList = new List<string>();

                List<DMSDeviceAlarm> wDMSDeviceAlarmList = new List<DMSDeviceAlarm>();
                DMSDeviceAlarm wDMSDeviceAlarm = null;

                foreach (string wAssetNo in wAssetNoList)
                {
                    if (!wDMSDeviceRealParameterSourceListDic.ContainsKey(wAssetNo))
                    {
                        wResult.Result.Add(StringUtils.Format("AssetNo:{0} Parameter List Not Found!", wAssetNo));
                        continue;
                    }

                    foreach (DMSDeviceRealParameter wDMSDeviceRealParameter in wDMSDeviceRealParameterListDic[wAssetNo])
                    {
                        if (!wDMSDeviceRealParameterSourceListDic[wAssetNo].ContainsKey(wDMSDeviceRealParameter.ParameterCode))
                        {
                            //添加或修改

                            wResult.Result.Add(StringUtils.Format("AssetNo:{0} ParameterCode:{1}  Not Found!", wAssetNo, wDMSDeviceRealParameter.ParameterCode));
                            continue;
                        }



                        if (wDMSDeviceRealParameter.UpdateTime.Year <= 2010)
                            wDMSDeviceRealParameter.UpdateTime = DateTime.Now;

                        if ((wDMSDeviceRealParameterSourceListDic[wAssetNo][wDMSDeviceRealParameter.ParameterCode].DataClass == (int)DMSDataClass.Alarm)
                            && (StringUtils.parseInt(wDMSDeviceRealParameter.ParameterValue) == 1))
                        {
                            //处理报警数据
                            wDMSDeviceAlarm = new DMSDeviceAlarm();
                            wDMSDeviceAlarm.AlarmCode = wDMSDeviceRealParameterSourceListDic[wAssetNo][wDMSDeviceRealParameter.ParameterCode].ParameterCode;
                            wDMSDeviceAlarm.AlarmDesc = wDMSDeviceRealParameterSourceListDic[wAssetNo][wDMSDeviceRealParameter.ParameterCode].ParameterDesc;
                            wDMSDeviceAlarm.AlarmName = wDMSDeviceRealParameterSourceListDic[wAssetNo][wDMSDeviceRealParameter.ParameterCode].ParameterName;
                            wDMSDeviceAlarm.AlarmVariableName = wDMSDeviceRealParameterSourceListDic[wAssetNo][wDMSDeviceRealParameter.ParameterCode].VariableName;
                            wDMSDeviceAlarm.DeviceID = wDMSDeviceRealParameterSourceListDic[wAssetNo][wDMSDeviceRealParameter.ParameterCode].DeviceID;
                            wDMSDeviceAlarm.AssetNo = wDMSDeviceRealParameterSourceListDic[wAssetNo][wDMSDeviceRealParameter.ParameterCode].AssetNo;
                            wDMSDeviceAlarm.DeviceName = wDMSDeviceRealParameterSourceListDic[wAssetNo][wDMSDeviceRealParameter.ParameterCode].DeviceName;
                            wDMSDeviceAlarm.StatusTime = wDMSDeviceRealParameter.UpdateTime;
                            wDMSDeviceAlarmList.Add(wDMSDeviceAlarm);
                        }

                        if (wDMSDeviceRealParameterSourceListDic[wAssetNo][wDMSDeviceRealParameter.ParameterCode].ParameterValue.Equals(wDMSDeviceRealParameter.ParameterValue))
                        {
                            continue;
                        }

                        wDMSDeviceRealParameterSourceListDic[wAssetNo][wDMSDeviceRealParameter.ParameterCode].ParameterValue = wDMSDeviceRealParameter.ParameterValue;
                        wDMSDeviceRealParameterSourceListDic[wAssetNo][wDMSDeviceRealParameter.ParameterCode].UpdateTime = wDMSDeviceRealParameter.UpdateTime;

                        wSqlStringList.Add(DMSDeviceRealParameterDAO.getInstance().DMS_UpdateDeviceRealParameter(
                            wDMSDeviceRealParameterSourceListDic[wAssetNo][wDMSDeviceRealParameter.ParameterCode]));


                    }
                }
                DMSDeviceStatusDAO.getInstance().ExecuteSqlTransaction(wSqlStringList);

                this.DMS_SyncDeviceAlarmList(wLoginUser, wAssetNoList, wDMSDeviceAlarmList);

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<int> DMS_SyncProcessRecord(BMSEmployee wLoginUser, String wAssetNo, String wWorkpieceNo, String wOrderNo, String wProductNo, Dictionary<String, DMSProcessRecordItem> wDMSProcessRecordItemDic)
        {
            ServiceResult<int> wResult = new ServiceResult<int>(0);
            try
            {
                if (StringUtils.isEmpty(wAssetNo) || wDMSProcessRecordItemDic == null || wDMSProcessRecordItemDic.Count <= 0)
                    return wResult;

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                // 获取设备 
                DMSDeviceLedger wDMSDeviceLedger = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedger(wLoginUser, -1, "", wAssetNo, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                if (wDMSDeviceLedger == null || wDMSDeviceLedger.ID <= 0)
                    return wResult;

                DMSProcessRecord wDMSProcessRecord = new DMSProcessRecord();
                wDMSProcessRecord.AssetNo = wDMSDeviceLedger.AssetNo;
                wDMSProcessRecord.DeviceID = wDMSDeviceLedger.ID;
                wDMSProcessRecord.DeviceName = wDMSDeviceLedger.Name;
                wDMSProcessRecord.DeviceNo = wDMSDeviceLedger.Code;
                wDMSProcessRecord.EndTime = wDMSProcessRecordItemDic.ContainsKey("EndTime") ? StringUtils.parseDate(wDMSProcessRecordItemDic["EndTime"].ParameterValue) : DateTime.Now;
                wDMSProcessRecord.StartTime = wDMSProcessRecordItemDic.ContainsKey("StartTime") ? StringUtils.parseDate(wDMSProcessRecordItemDic["StartTime"].ParameterValue) : DateTime.Now;
                wDMSProcessRecord.ProductNo = wDMSProcessRecordItemDic.ContainsKey("ProductNo") ? StringUtils.parseString(wDMSProcessRecordItemDic["ProductNo"].ParameterValue) : "";
                wDMSProcessRecord.OrderNo = wDMSProcessRecordItemDic.ContainsKey("OrderNo") ? StringUtils.parseString(wDMSProcessRecordItemDic["OrderNo"].ParameterValue) : "";
                wDMSProcessRecord.ProductName = wDMSProcessRecordItemDic.ContainsKey("ProductName") ? StringUtils.parseString(wDMSProcessRecordItemDic["ProductName"].ParameterValue) : "";
                wDMSProcessRecord.Remark = wDMSProcessRecordItemDic.ContainsKey("Remark") ? StringUtils.parseString(wDMSProcessRecordItemDic["Remark"].ParameterValue) : "";
                wDMSProcessRecord.Status = wDMSProcessRecordItemDic.ContainsKey("Status") ? StringUtils.parseInt(wDMSProcessRecordItemDic["Status"].ParameterValue) : 1;
                wDMSProcessRecord.StatusText = wDMSProcessRecordItemDic.ContainsKey("StatusText") ? StringUtils.parseString(wDMSProcessRecordItemDic["StatusText"].ParameterValue) : "";
                wDMSProcessRecord.WorkpieceNo = wDMSProcessRecordItemDic.ContainsKey("WorkpieceNo") ? StringUtils.parseString(wDMSProcessRecordItemDic["WorkpieceNo"].ParameterValue) : "";

                wDMSProcessRecord.WorkpieceNo = StringUtils.isEmpty(wDMSProcessRecord.WorkpieceNo) ? wWorkpieceNo : wDMSProcessRecord.WorkpieceNo;
                wDMSProcessRecord.OrderNo = StringUtils.isEmpty(wDMSProcessRecord.OrderNo) ? wOrderNo : wDMSProcessRecord.OrderNo;
                wDMSProcessRecord.ProductNo = StringUtils.isEmpty(wDMSProcessRecord.ProductNo) ? wProductNo : wDMSProcessRecord.ProductNo;

                wDMSProcessRecord.ItemList = wDMSProcessRecordItemDic.Values.ToList();

                if (StringUtils.isEmpty(wDMSProcessRecord.OrderNo) && StringUtils.isNotEmpty(wDMSProcessRecord.WorkpieceNo))
                {

                    QMSWorkpiece wQMSWorkpiece = QMSWorkpieceDAO.getInstance().QMS_SelectWorkpiece(wLoginUser, -1, wDMSProcessRecord.WorkpieceNo, wErrorCode);

                    if (wQMSWorkpiece != null && wQMSWorkpiece.ID > 0 && StringUtils.isNotEmpty(wQMSWorkpiece.OrderNo))
                    {
                        wDMSProcessRecord.OrderNo = wQMSWorkpiece.OrderNo;
                        wDMSProcessRecord.ProductNo = wQMSWorkpiece.ProductNo;
                    }

                }



                foreach (var item in wDMSProcessRecord.ItemList)
                {
                    item.DeviceID = wDMSProcessRecord.DeviceID;
                    item.DeviceNo = wDMSProcessRecord.DeviceNo;
                    item.AssetNo = wDMSProcessRecord.AssetNo;


                }

                #region  避免重复信号
                //获取此设备最新的一条记录
                List<DMSProcessRecord> wDMSProcessRecordList = DMSProcessRecordDAO.getInstance().DMS_CurrentProcessRecordList(wLoginUser, wDMSProcessRecord.DeviceID, wDMSProcessRecord.DeviceNo, null, 1, Pagination.Create(1, 1), wErrorCode);

                if (wDMSProcessRecordList != null && wDMSProcessRecordList.Count > 0 && wDMSProcessRecordList[0] != null
                     && wDMSProcessRecordList[0].ID > 0 && StringUtils.isNotEmpty(wDMSProcessRecordList[0].WorkpieceNo)
                     && wDMSProcessRecordList[0].WorkpieceNo.Equals(wDMSProcessRecord.WorkpieceNo))
                {

                    //若最新的数据开始时间或结束时间与此相同 则视为重复
                    double wTimeSub = (wDMSProcessRecordList[0].StartTime - wDMSProcessRecord.StartTime).TotalSeconds;
                    if (wTimeSub <= 2 && wTimeSub >= -2)
                    {
                        return wResult;
                    }
                    wTimeSub = (wDMSProcessRecordList[0].EndTime - wDMSProcessRecord.EndTime).TotalSeconds;
                    if (wTimeSub <= 2 && wTimeSub >= -2)
                    {
                        return wResult;
                    }
                }

                #endregion

                DMSProcessRecordDAO.getInstance().DMS_InsertProcessRecord(wLoginUser, wDMSProcessRecord, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

                }

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<String>> DMS_SyncProcessRecordList(BMSEmployee wLoginUser, List<DMSProcessRecord> wDMSProcessRecordList)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                wResult.Result = new List<string>();
                if (wDMSProcessRecordList == null || wDMSProcessRecordList.Count <= 0)
                    return wResult;

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                // 获取设备列表 
                List<DMSDeviceLedger> wDMSDeviceLedgerList = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedgerList(wLoginUser, -1, -1, Pagination.Create(1, int.MaxValue), wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                wDMSDeviceLedgerList = wDMSDeviceLedgerList.OrderByDescending(p => p.Active).ThenByDescending(p => p.EditTime).ToList();

                Dictionary<string, DMSDeviceLedger> wDMSDeviceLedgerDic = wDMSDeviceLedgerList.GroupBy(p => p.AssetNo).ToDictionary(p => p.Key, p => p.First());

                //根据订单号 获取订单对象
                List<String> wOrderNoList = wDMSProcessRecordList.Select(p => p.OrderNo).Distinct().ToList();

                wOrderNoList.RemoveAll(p => StringUtils.isEmpty(p));

                List<OMSOrder> wOrderList = OMSOrderDAO.getInstance().OMS_SelectOrderListByOrderNoList(wLoginUser, wOrderNoList, wErrorCode);

                List<String> wPartNoList = wOrderList.Select(p => p.PartNo).Distinct().ToList();

                wPartNoList.RemoveAll(p => StringUtils.isEmpty(p));
                //根据車号 获取订单对象
                List<String> wMetroNoList = wDMSProcessRecordList.Select(p => p.MetroNo).Distinct().ToList();
                wMetroNoList.RemoveAll(p => StringUtils.isEmpty(p) || wPartNoList.Contains(p));

                List<String> wAssetNoList = wDMSProcessRecordList.Select(p => p.AssetNo).Distinct().ToList();

                wAssetNoList.RemoveAll(p => StringUtils.isEmpty(p));

                wOrderList.AddRange(OMSOrderDAO.getInstance().OMS_SelectListByPartNoList(wLoginUser, wMetroNoList, wAssetNoList, wErrorCode));

                wOrderList = wOrderList.OrderByDescending(p => p.CreateTime).ToList();

                Dictionary<string, OMSOrder> wOMSOrderPartNoDic = wOrderList.GroupBy(p => p.PartNo).ToDictionary(p => p.Key, p => p.First());

                Dictionary<string, OMSOrder> wOMSOrderDic = wOrderList.GroupBy(p => p.OrderNo).ToDictionary(p => p.Key, p => p.First());

                Dictionary<string, List<DMSProcessRecord>> wDMSProcessRecordListDic = wDMSProcessRecordList.GroupBy(p => p.AssetNo).ToDictionary(p => p.Key, p => p.ToList());

                foreach (String wAssetNo in wDMSProcessRecordListDic.Keys)
                {
                    if (StringUtils.isEmpty(wAssetNo))
                        continue;
                    //直接插入数据库  插入前 写更新Active=0 历史记录
                    if (!wDMSDeviceLedgerDic.ContainsKey(wAssetNo))
                    {
                        wResult.Result.Add(StringUtils.Format("AssetNo:{0} Not Found!",
                            wAssetNo));
                        continue;
                    }
                    foreach (DMSProcessRecord wDMSProcessRecord in wDMSProcessRecordListDic[wAssetNo])
                    {
                        if (StringUtils.isEmpty(wDMSProcessRecord.OrderNo) && StringUtils.isNotEmpty(wDMSProcessRecord.MetroNo) && wOMSOrderPartNoDic.ContainsKey(wDMSProcessRecord.MetroNo))
                        {
                            wDMSProcessRecord.OrderNo = wOMSOrderPartNoDic[wDMSProcessRecord.MetroNo].OrderNo;
                        }
                        if (StringUtils.isEmpty(wDMSProcessRecord.MetroNo) && StringUtils.isNotEmpty(wDMSProcessRecord.OrderNo) && wOMSOrderDic.ContainsKey(wDMSProcessRecord.OrderNo))
                        {
                            wDMSProcessRecord.MetroNo = wOMSOrderPartNoDic[wDMSProcessRecord.MetroNo].PartNo;
                        }

                        DMSProcessRecordDAO.getInstance().DMS_InsertProcessRecord(wLoginUser, wDMSProcessRecord, wErrorCode);
                        if (wErrorCode.Result != 0)
                        {
                            wResult.Result.Add(StringUtils.Format("AssetNo:{0} OrderNo:{1} MetroNo:{2} WorkPieceNo:{3}  Update Error:{4}",
                           wAssetNo, wDMSProcessRecord.OrderNo, wDMSProcessRecord.MetroNo, wDMSProcessRecord.WorkpieceNo, MESException.getEnumType(wErrorCode.get()).getLabel()));
                        }

                    }
                }


            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<DMSDeviceStatistics>> DMS_SelectDeviceStatusDetailStatisticsTime(BMSEmployee wLoginUser, int wLineID, List<int> wDeviceIDList, String wAssetNo, int wStatType,
            DateTime wStartTime, DateTime wEndTime)
        {
            ServiceResult<List<DMSDeviceStatistics>> wResult = new ServiceResult<List<DMSDeviceStatistics>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                wResult.Result = DMSDeviceStatusStatisticsDAO.getInstance().DMS_SelectDeviceStatusDetailStatisticsTime(wLoginUser, wLineID, wDeviceIDList, wAssetNo,
                     wStatType, wStartTime, wEndTime, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<DMSEnergyStatistics>> DMS_SelectEnergyStatisticsList(BMSEmployee wLoginUser, List<int> wDeviceIDList,
            int wAreaID, int wStatType, int wEnergyType, DateTime wStartTime, DateTime wEndTime,
              int wActive)
        {
            ServiceResult<List<DMSEnergyStatistics>> wResult = new ServiceResult<List<DMSEnergyStatistics>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                wResult.Result = DMSEnergyStatisticsDAO.getInstance().DMS_SelectEnergyStatisticsList(wLoginUser, wDeviceIDList,
                    wAreaID, wStatType, wEnergyType, wStartTime, wEndTime, wActive, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<DMSEnergyStatistics>> DMS_SelectEnergyStatisticsList(BMSEmployee wLoginUser, List<int> wDeviceIDList,
            int wAreaID, int wStatType, int wEnergyType, DateTime wStartTime, DateTime wEndTime)
        {
            ServiceResult<List<DMSEnergyStatistics>> wResult = new ServiceResult<List<DMSEnergyStatistics>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                wResult.Result = DMSEnergyStatisticsDAO.getInstance().DMS_SelectEnergyStatisticsList(wLoginUser, wDeviceIDList,
                    wAreaID, wStatType, wEnergyType, wStartTime, wEndTime, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_UpdateEnergyStatistics(BMSEmployee wLoginUser, DMSEnergyStatistics wDMSEnergyStatistics)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                DMSEnergyStatisticsDAO.getInstance().DMS_UpdateEnergyStatistics(wLoginUser, wDMSEnergyStatistics, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_ActiveEnergyStatistics(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive)
        {

            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                DMSEnergyStatisticsDAO.getInstance().DMS_ActiveEnergyStatistics(wLoginUser, wIDList, wActive, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_DeleteEnergyStatistics(BMSEmployee wLoginUser, List<Int32> wIDList)
        {

            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                DMSEnergyStatisticsDAO.getInstance().DMS_DeleteEnergyStatistics(wLoginUser, wIDList, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }





        public ServiceResult<DMSProgramNC> DMS_SelectCurrentProgramNC(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, String wAssetNo, int wProductID, String wProductNo)
        {
            ServiceResult<DMSProgramNC> wResult = new ServiceResult<DMSProgramNC>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                wResult.Result = DMSProgramNCDAO.getInstance().DMS_SelectCurrentProgramNC(wLoginUser, wDeviceID, wDeviceNo,
                 wAssetNo, wProductID, wProductNo, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<DMSProgramNC>> DMS_GetProgramNCList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID,
                int wWorkShopID, int wLineID, int wAreaID, int wProductID, String wProductNo, Pagination wPagination)
        {
            ServiceResult<List<DMSProgramNC>> wResult = new ServiceResult<List<DMSProgramNC>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                wResult.Result = DMSProgramNCDAO.getInstance().DMS_SelectProgramNCList(wLoginUser, wDeviceID, wDeviceNo,
                 wAssetNo, wDeviceType, wModelID, wFactoryID,
                 wWorkShopID, wLineID, wAreaID, wProductID, wProductNo, wPagination, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_UpdateProgramNC(BMSEmployee wLoginUser, DMSProgramNC wProgramNC)
        {
            //判断上ProgramID<=0时 新增一条

            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);


                DMSProgramNCDAO.getInstance().DMS_UpdateProgramNC(wLoginUser, wProgramNC, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<DMSProgramNCRecord>> DMS_GetProgramNCRecordList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wProductID, String wProductNo,
                int wEditorID, int wRecordType, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<DMSProgramNCRecord>> wResult = new ServiceResult<List<DMSProgramNCRecord>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                wResult.Result = DMSProgramNCRecordDAO.getInstance().DMS_SelectProgramNCRecordList(wLoginUser, wDeviceID, wDeviceNo,
                 wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wProductID, wProductNo,
                 wEditorID, wRecordType, wStartTime, wEndTime, wPagination, wErrorCode);


                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }
                wResult.Put("PageCount", wPagination.TotalPage);
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<Int32> DMS_UpdateProgramNCRecord(BMSEmployee wLoginUser, DMSProgramNCRecord wProgramNCRecord)
        {
            //判断上ProgramID<=0时 新增一条

            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                DMSProgramNC wDMSProgramNC = null;
                if (wProgramNCRecord.ProgramID <= 0)
                {
                    wProgramNCRecord.RecordType = (int)DMSProgramRecordTypes.Upload;
                }

                if (wProgramNCRecord.RecordType == (int)DMSProgramRecordTypes.Upload
                    || wProgramNCRecord.RecordType == (int)DMSProgramRecordTypes.VersionChange)
                {
                    wDMSProgramNC = wProgramNCRecord.CreateSourceProgram();

                    DMSProgramNCDAO.getInstance().DMS_UpdateProgramNC(wLoginUser, wDMSProgramNC, wErrorCode);

                    if (wErrorCode.Result != 0)
                    {
                        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                        return wResult;
                    }

                    wProgramNCRecord.ProgramID = wDMSProgramNC.ID;
                }

                DMSProgramNCRecordDAO.getInstance().DMS_UpdateProgramNCRecord(wLoginUser, wProgramNCRecord, wErrorCode);


                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }

                if ((wProgramNCRecord.RecordType == (int)DMSProgramRecordTypes.Upload
                    || wProgramNCRecord.RecordType == (int)DMSProgramRecordTypes.VersionChange) && wDMSProgramNC != null && wDMSProgramNC.ID > 0)
                {


                    if (StringUtils.isNotEmpty(wDMSProgramNC.DeviceFilePath)
                       && StringUtils.isNotEmpty(wDMSProgramNC.FileSourcePath))
                    {

                        if (!File.Exists(wDMSProgramNC.DeviceFilePath))
                        {
                            String wDirName = Path.GetDirectoryName(wDMSProgramNC.DeviceFilePath);
                            if (StringUtils.isNotEmpty(wDirName) && !Directory.Exists(wDirName))
                            {
                                Directory.CreateDirectory(wDirName);
                            }
                        }
                        //文件写入指定路径
                        File.Copy(wDMSProgramNC.FileSourcePath, wDMSProgramNC.DeviceFilePath, true);
                    }
                    if (StringUtils.isNotEmpty(wDMSProgramNC.DeviceFilePath_B)
                       && StringUtils.isNotEmpty(wDMSProgramNC.FileSourcePath_B))
                    {

                        if (!File.Exists(wDMSProgramNC.DeviceFilePath_B))
                        {
                            String wDirName = Path.GetDirectoryName(wDMSProgramNC.DeviceFilePath_B);
                            if (StringUtils.isNotEmpty(wDirName) && !Directory.Exists(wDirName))
                            {
                                Directory.CreateDirectory(wDirName);
                            }
                        }
                        //文件写入指定路径
                        File.Copy(wDMSProgramNC.FileSourcePath, wDMSProgramNC.DeviceFilePath_B, true);
                    }
                }

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<DMSToolInfo>> DMS_GetToolInfoList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID,
                int wAreaID, int wToolHouseIndex, int wToolIndex, Pagination wPagination)
        {
            ServiceResult<List<DMSToolInfo>> wResult = new ServiceResult<List<DMSToolInfo>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                //调用底层获取刀具数据


                wResult.Result = DMSToolInfoDAO.getInstance().DMS_SelectToolInfoList(wLoginUser, wDeviceID, wDeviceNo,
                 wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID,
                 wAreaID, wToolHouseIndex, wToolIndex, wPagination, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }
                wResult.Put("PageCount", wPagination.TotalPage);
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<DMSToolOffset>> DMS_GetToolOffsetList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID,
                int wToolID, int wToolHouseIndex, int wToolIndex,
                int wEditorID, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<DMSToolOffset>> wResult = new ServiceResult<List<DMSToolOffset>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                wResult.Result = DMSToolOffsetDAO.getInstance().DMS_SelectToolOffsetList(wLoginUser, wDeviceID, wDeviceNo,
                 wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID,
                 wToolID, wToolHouseIndex, wToolIndex,
                 wEditorID, wStartTime, wEndTime, wPagination, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }
                wResult.Put("PageCount", wPagination.TotalPage);
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_UpdateToolInfo(BMSEmployee wLoginUser, DMSToolInfo wDMSToolInfo)
        {
            //判断上ProgramID<=0时 新增一条

            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);


                DMSToolInfoDAO.getInstance().DMS_UpdateToolInfo(wLoginUser, wDMSToolInfo, wErrorCode);


                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }


            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_UpdateToolOffset(BMSEmployee wLoginUser, DMSToolOffset wDMSToolOffset)
        {
            //判断上ProgramID<=0时 新增一条

            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                //调用底层设置刀补



                DMSToolOffsetDAO.getInstance().DMS_UpdateToolOffset(wLoginUser, wDMSToolOffset, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }




        public ServiceResult<List<DMSSpareLedger>> DMS_GetSpareLedgerList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID, String wModelNameLike,
            String wManufactorNameLike, String wSupplierNameLike, int wActive, Pagination wPagination)
        {
            ServiceResult<List<DMSSpareLedger>> wResult = new ServiceResult<List<DMSSpareLedger>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(DMSSpareLedgerDAO.getInstance().DMS_GetSpareLedgerList(wLoginUser, wWorkShopID, wLineID,
                    wModelNameLike, wManufactorNameLike, wSupplierNameLike, wActive, wPagination, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<DMSSpareLedger> DMS_GetSpareLedger(BMSEmployee wLoginUser, Int32 wID, String wCode)
        {
            ServiceResult<DMSSpareLedger> wResult = new ServiceResult<DMSSpareLedger>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(DMSSpareLedgerDAO.getInstance().DMS_GetSpareLedger(wLoginUser, wID, wCode, wErrorCode));

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<Int32> DMS_UpdateSpareLedger(BMSEmployee wLoginUser, DMSSpareLedger wDMSSpareLedger)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSSpareLedgerDAO.getInstance().DMS_UpdateSpareLedger(wLoginUser, wDMSSpareLedger, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> DMS_ActiveSpareLedger(BMSEmployee wLoginUser, List<int> wIDList, int wActive)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSSpareLedgerDAO.getInstance().DMS_ActiveSpareLedger(wLoginUser, wIDList, wActive, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
        public ServiceResult<Int32> DMS_DeleteSpareLedger(BMSEmployee wLoginUser, DMSSpareLedger wDMSSpareLedger)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSSpareLedgerDAO.getInstance().DMS_DeleteSpareLedger(wLoginUser, wDMSSpareLedger, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



        public ServiceResult<Dictionary<String, List<String>>> DMS_GetSpareModelAll(BMSEmployee wLoginUser)
        {
            ServiceResult<Dictionary<String, List<String>>> wResult = new ServiceResult<Dictionary<String, List<String>>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(DMSSpareLedgerDAO.getInstance().DMS_GetSpareModelAll(wLoginUser, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<DMSSpareRecord>> DMS_GetSpareRecordList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID, String wModelNameLike,
            String wManufactorNameLike, String wSupplierNameLike, int wSpareID, String wSpareNoLike, int wRecordType, int wActive, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<DMSSpareRecord>> wResult = new ServiceResult<List<DMSSpareRecord>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = DMSSpareRecordDAO.getInstance().DMS_GetSpareRecordList(wLoginUser, wWorkShopID, wLineID, wModelNameLike,
             wManufactorNameLike, wSupplierNameLike, wSpareID, wSpareNoLike, wRecordType, wActive, wStartTime, wEndTime, wPagination, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
        public ServiceResult<Int32> DMS_UpdateSpareRecord(BMSEmployee wLoginUser, DMSSpareRecord wDMSSpareRecord)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSSpareRecordDAO.getInstance().DMS_UpdateSpareRecord(wLoginUser, wDMSSpareRecord, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
        public ServiceResult<Int32> DMS_DeleteSpareRecord(BMSEmployee wLoginUser, DMSSpareRecord wDMSSpareRecord)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSSpareRecordDAO.getInstance().DMS_DeleteSpareRecord(wLoginUser, wDMSSpareRecord, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<DMSFixtures>> DMS_GetDeviceFixturesList(BMSEmployee wLoginUser, int wLineID,
             int wProductID, Pagination wPagination)
        {
            ServiceResult<List<DMSFixtures>> wResult = new ServiceResult<List<DMSFixtures>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = DMSFixturesDAO.getInstance().DMS_SelectDeviceFixturesList(wLoginUser, wLineID,
              wProductID, wPagination, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<DMSFixtures>> DMS_GetFixturesList(BMSEmployee wLoginUser, int wLineID,
            int wDeviceID, List<int> wProductID, String wAssetNo, String wProductNo, String wProductNoLike, Pagination wPagination)
        {
            ServiceResult<List<DMSFixtures>> wResult = new ServiceResult<List<DMSFixtures>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = DMSFixturesDAO.getInstance().DMS_SelectFixturesList(wLoginUser, wLineID,
             wDeviceID, wProductID, wAssetNo, wProductNo, wProductNoLike, wPagination, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
        public ServiceResult<Int32> DMS_UpdateFixtures(BMSEmployee wLoginUser, DMSFixtures wDMSFixtures)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSFixturesDAO.getInstance().DMS_UpdateFixtures(wLoginUser, wDMSFixtures, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<int> DMS_DeleteFixturesList(BMSEmployee wLoginUser, List<int> wIDList)
        {
            ServiceResult<int> wResult = new ServiceResult<int>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                DMSFixturesDAO.getInstance().DMS_DeleteFixtures(wLoginUser, wIDList, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }




        public void Dispose()
        {
            try
            {
                mTimer.Dispose();
                mTimer = null;
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }

        }


        public ServiceResult<int> DMS_InitDeviceTable(BMSEmployee wLoginUser)
        {
            ServiceResult<int> wResult = new ServiceResult<int>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<int>(0);

                List<DMSDeviceLedger> wDMSDeviceLegerList = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedgerList(wLoginUser,
                     -1, 1, Pagination.Create(1, int.MaxValue), wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    logger.InfoFormat("DMS_InitDeviceTable   获取设备台账列表失败! error:{0}", MESException.getEnumType(wErrorCode.get()).getLabel());
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                String wDeviceCode = "";
                foreach (DMSDeviceLedger wDMSDeviceLeger in wDMSDeviceLegerList)
                {
                    wDeviceCode=wDMSDeviceLeger.Code.ChangeToTableName();
                    DMSDeviceParameterDAO.getInstance().DMS_InitDeviceTable(wLoginUser, ((int)DMSDataClass.TechnologyData), wDMSDeviceLeger.ID, wDeviceCode, wErrorCode);

                    DMSDeviceParameterDAO.getInstance().DMS_InitDeviceTable(wLoginUser, ((int)DMSDataClass.WorkParams), wDMSDeviceLeger.ID, wDeviceCode, wErrorCode);
                    DMSDeviceParameterDAO.getInstance().DMS_InitDeviceTable(wLoginUser, ((int)DMSDataClass.WorkParams), wDMSDeviceLeger.ID, wDeviceCode, wDMSDeviceLeger.ModelID, wErrorCode);

                    DMSDeviceParameterDAO.getInstance().DMS_InitDeviceTable(wLoginUser, ((int)DMSDataClass.QualityParams), wDMSDeviceLeger.ID, wDeviceCode, wErrorCode);
                    DMSDeviceParameterDAO.getInstance().DMS_InitDeviceTable(wLoginUser, ((int)DMSDataClass.QualityParams), wDMSDeviceLeger.ID, wDeviceCode, wDMSDeviceLeger.ModelID, wErrorCode);

                    DMSDeviceParameterDAO.getInstance().DMS_InitDeviceTable(wLoginUser, wDMSDeviceLeger.ModelID, wDeviceCode, wErrorCode);

                }

            }
            catch (Exception ex)
            {
                wResult.FaultCode += ex.Message;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }
        //public ServiceResult<int> DMS_InitDeviceTable(BMSEmployee wLoginUser)
        //{
        //    ServiceResult<int> wResult = new ServiceResult<int>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<int>(0);

        //        List<DMSDeviceModel> wDMSDeviceModelList = DMSDeviceModelDAO.getInstance().DMS_SelectDeviceModelList(wLoginUser, "", -1, "", "", -1, 1, wErrorCode);
        //        if (wErrorCode.Result != 0)
        //        {
        //            logger.InfoFormat("DMS_InitDeviceTable   获取设备型号列表失败! error:{0}", MESException.getEnumType(wErrorCode.get()).getLabel());
        //            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
        //            return wResult;
        //        }

        //        foreach (DMSDeviceModel wDMSDeviceModel in wDMSDeviceModelList)
        //        {
        //            DMSDeviceParameterDAO.getInstance().DMS_InitDeviceTable(wLoginUser, ((int)DMSDataClass.TechnologyData), wDMSDeviceModel.ID, wDMSDeviceModel.Code, wErrorCode);

        //            DMSDeviceParameterDAO.getInstance().DMS_InitDeviceTable(wLoginUser, ((int)DMSDataClass.WorkParams), wDMSDeviceModel.ID, wDMSDeviceModel.Code, wErrorCode);

        //            DMSDeviceParameterDAO.getInstance().DMS_InitDeviceTable(wLoginUser, ((int)DMSDataClass.QualityParams), wDMSDeviceModel.ID, wDMSDeviceModel.Code, wErrorCode);

        //            DMSDeviceParameterDAO.getInstance().DMS_InitDeviceTable(wLoginUser, wDMSDeviceModel.ID, wDMSDeviceModel.Code, wErrorCode);

        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        wResult.FaultCode += ex.Message;
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
        //    }
        //    return wResult;
        //}
        //public ServiceResult<int> DMS_InitDeviceTable(BMSEmployee wLoginUser)
        //{
        //    ServiceResult<int> wResult = new ServiceResult<int>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<int>(0);
        //        DMSDeviceParameterDAO.getInstance().DMS_InitDeviceTable(wLoginUser, ((int)DMSDataClass.TechnologyData), "dms_technology", wErrorCode);

        //        DMSDeviceParameterDAO.getInstance().DMS_InitDeviceTable(wLoginUser, ((int)DMSDataClass.WorkParams), "dms_device_recordproduct", wErrorCode);

        //        DMSDeviceParameterDAO.getInstance().DMS_InitDeviceTable(wLoginUser, ((int)DMSDataClass.QualityParams), "dms_device_recordcheck", wErrorCode);

        //    }
        //    catch (Exception ex)
        //    {
        //        wResult.FaultCode += ex.Message;
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
        //    }
        //    return wResult;
        //}
    }
}
