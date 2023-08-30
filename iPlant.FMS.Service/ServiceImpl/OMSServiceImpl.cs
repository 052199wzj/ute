using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{


    public class OMSServiceImpl : OMSService
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(OMSServiceImpl));
        private static OMSService _instance = null;

        private static LockHelper mLockHelper = new LockHelper();

        public OMSServiceImpl()
        {
            OutResult<int> wErrorCode = new OutResult<int>();
            //关闭所有工单
            //OMSOrderDAO.getInstance().OMS_CloseDeviceOrder(OMSOrderDAO.SysAdmin, "", wErrorCode);
            //获取MES工序任务数据 todo
            List<OMSOrder> wOMSOrderList = new List<OMSOrder>();

            //更新
            this.OMS_SyncOrderList(OMSOrderDAO.SysAdmin, wOMSOrderList);
        }
        public static OMSService getInstance()
        {
            if (_instance == null)
            {
                lock (mLockHelper)
                {
                    if (_instance == null)
                    { 
                        _instance = new OMSServiceImpl();
                        OMSOrderDAO.getInstance();
                    }
                }
            }
            return _instance;
        }

        public ServiceResult<int> OMS_AuditOrder(BMSEmployee wLoginUser, List<OMSOrder> wResultList)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);


                OMSOrderDAO.getInstance().OMS_AuditOrder(wLoginUser, wResultList, false, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.ToString();
            }
            return wResult;
        }


        public ServiceResult<int> OMS_OrderPriority(BMSEmployee wLoginUser, int wID, int wNum)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                OMSOrderDAO.getInstance().OMS_OrderPriority(wLoginUser, wID, wNum, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.ToString();
            }
            return wResult;
        }

        public ServiceResult<List<OMSOrder>> OMS_ConditionAll(BMSEmployee wLoginUser, int wProductID,
            int wWorkShopID, int wLine, String wAssetNo, String wWorkPartPointCode, int wCustomerID, string wWBSNo, DateTime wStartTime, DateTime wEndTime,
            int wStatus, Pagination wPagination)
        {
            ServiceResult<List<OMSOrder>> wResult = new ServiceResult<List<OMSOrder>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                wResult.Result = OMSOrderDAO.getInstance().OMS_ConditionAll(wLoginUser, wProductID, wWorkShopID, wLine, wAssetNo, wWorkPartPointCode,
                    wCustomerID, wWBSNo, wStartTime, wEndTime, wStatus, wPagination, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<int> OMS_DeleteCommandList(BMSEmployee wLoginUser, List<OMSCommand> wList)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                OMSCommandDAO.getInstance().OMS_DeleteCommandList(wLoginUser, wList, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.Message;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<int> OMS_DeleteOrderList(BMSEmployee wLoginUser, List<OMSOrder> wList)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                OMSOrderDAO.getInstance().OMS_DeleteOrderList(wLoginUser, wList, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.ToString();
            }
            return wResult;
        }

        public ServiceResult<OMSOrder> OMS_QueryOrderByNo(BMSEmployee wLoginUser, string wOrderNo)
        {
            ServiceResult<OMSOrder> wResult = new ServiceResult<OMSOrder>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = OMSOrderDAO.getInstance().OMS_QueryOrderByNo(wLoginUser, wOrderNo, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.Message;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<OMSOrder>> OMS_QueryOrderByStatus(BMSEmployee wLoginUser, int wWorkShopID, int wLineID, String wAssetNo, String wWorkPartPointCode, List<int> wStateIDList, Pagination wPagination)
        {
            ServiceResult<List<OMSOrder>> wResult = new ServiceResult<List<OMSOrder>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = OMSOrderDAO.getInstance().OMS_QueryOrderByStatus(wLoginUser, wWorkShopID, wLineID, wAssetNo, wWorkPartPointCode, wStateIDList, wPagination, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }


        public ServiceResult<List<OMSOrder>> OMS_SelectProductList(BMSEmployee wLoginUser, int wCommandID, int wFactoryID, int wWorkShopID,
               int wLineID, String wAssetNo, String wWorkPartPointCode, DateTime wRelStartTime,
               DateTime wRelEndTime, Pagination wPagination)
        {
            ServiceResult<List<OMSOrder>> wResult = new ServiceResult<List<OMSOrder>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = OMSOrderDAO.getInstance().OMS_SelectProductList(wLoginUser, wCommandID, wFactoryID, wWorkShopID, wLineID, wAssetNo, wWorkPartPointCode, wRelStartTime, wRelEndTime, wPagination, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<OMSOrder> OMS_QueryCurrentOrder(BMSEmployee wLoginUser, int wWorkShopID, int wLineID, String wAssetNo, String wWorkPartPointCode)
        {

            ServiceResult<OMSOrder> wResult = new ServiceResult<OMSOrder>();

            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                wResult.Result = OMSOrderDAO.getInstance().OMS_SelectCurrentOrder(wLoginUser, wWorkShopID, wLineID, wAssetNo, wWorkPartPointCode, wErrorCode);


                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<List<OMSOrder>> OMS_JudgeOrderImport(BMSEmployee wLoginUser, List<OMSOrder> wOMSOrderList, out List<OMSOrder> wBadOrderList)
        {

            ServiceResult<List<OMSOrder>> wResult = new ServiceResult<List<OMSOrder>>();
            wResult.Result = new List<OMSOrder>();
            wBadOrderList = new List<OMSOrder>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                foreach (OMSOrder wOMSOrder in wOMSOrderList)
                {

                    if (wOMSOrder == null || StringUtils.isEmpty(wOMSOrder.PartNo) || StringUtils.isEmpty(wOMSOrder.WBSNo)
                    || wOMSOrder.StationID <= 0 || StringUtils.isEmpty(wOMSOrder.OrderNo))
                    {
                        wOMSOrder.WBSNo = "订单数据数据不完整（工位、车号、订单号）";
                        wBadOrderList.Add(wOMSOrder);
                        continue;
                    }

                    OMSOrder wOMSOrderDB = OMSOrderDAO.getInstance().OMS_CheckOrder(wLoginUser, wOMSOrder, wErrorCode);
                    if (wOMSOrderDB != null && wOMSOrderDB.ID > 0)
                    {
                        wOMSOrder.WBSNo = "订单数据重复";
                        wBadOrderList.Add(wOMSOrder);
                        continue;
                    }


                    wResult.Result.Add(wOMSOrder);
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }



        public ServiceResult<OMSCommand> OMS_SelectCommandByCode(BMSEmployee wLoginUser, string wWBSNo)
        {
            ServiceResult<OMSCommand> wResult = new ServiceResult<OMSCommand>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = OMSCommandDAO.getInstance().OMS_SelectCommandByCode(wLoginUser, wWBSNo, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<OMSCommand> OMS_SelectCommandByID(BMSEmployee wLoginUser, int wID)
        {
            ServiceResult<OMSCommand> wResult = new ServiceResult<OMSCommand>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = OMSCommandDAO.getInstance().OMS_SelectCommandByID(wLoginUser, wID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<OMSCommand> OMS_SelectCommandByPartNo(BMSEmployee wLoginUser, string PartNo)
        {
            ServiceResult<OMSCommand> wResult = new ServiceResult<OMSCommand>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = OMSCommandDAO.getInstance().OMS_SelectCommandByPartNo(wLoginUser, PartNo, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<List<OMSCommand>> OMS_SelectCommandList(BMSEmployee wLoginUser,
            int wFactoryID, int wBusinessUnitID, int wWorkShopID, int wCustomerID, int wProductID,
            DateTime wStartTime, DateTime wEndTime)
        {
            ServiceResult<List<OMSCommand>> wResult = new ServiceResult<List<OMSCommand>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = OMSCommandDAO.getInstance().OMS_SelectCommandList(wLoginUser, wFactoryID, wBusinessUnitID,
                    wWorkShopID, wCustomerID, wProductID,
             wStartTime, wEndTime, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<List<OMSOrder>> OMS_SelectFinishListByTime(BMSEmployee wLoginUser, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<OMSOrder>> wResult = new ServiceResult<List<OMSOrder>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = OMSOrderDAO.getInstance().OMS_SelectFinishListByTime(wLoginUser, wStartTime, wEndTime, wPagination, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<List<OMSOrder>> OMS_SelectList(BMSEmployee wLoginUser, int wCommandID, int wFactoryID,
            int wWorkShopID, int wLineID, String wAssetNo, String wWorkPartPointCode, int wStationID, int wProductID, int wCustomerID, int wTeamID,
            string wPartNo, List<int> wStateIDList, String wOrderNoLike, DateTime wPreStartTime, DateTime wPreEndTime,
            DateTime wRelStartTime, DateTime wRelEndTime, Pagination wPagination)
        {
            ServiceResult<List<OMSOrder>> wResult = new ServiceResult<List<OMSOrder>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = OMSOrderDAO.getInstance().OMS_SelectList(wLoginUser, -1, wCommandID, "", wFactoryID, wWorkShopID, wLineID, wAssetNo, wWorkPartPointCode,
                    wStationID, wProductID, wCustomerID, wTeamID, wPartNo, wStateIDList, wOrderNoLike, wPreStartTime,
                    wPreEndTime, wRelStartTime, wRelEndTime, wPagination, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<List<OMSOrder>> OMS_SelectList(BMSEmployee wLoginUser, int wCommandID, String wCommandNo, String wFollowNo, String wOperatorNo, int wFactoryID,
          int wWorkShopID, int wLineID, String wAssetNo, String wWorkPartPointCode, int wStationID, int wProductID, int wCustomerID, int wTeamID,
          string wPartNo, List<int> wStateIDList, String wOrderNoLike, DateTime wPreStartTime, DateTime wPreEndTime,
          DateTime wRelStartTime, DateTime wRelEndTime, Pagination wPagination)
        {
            ServiceResult<List<OMSOrder>> wResult = new ServiceResult<List<OMSOrder>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = OMSOrderDAO.getInstance().OMS_SelectList(wLoginUser, -1, wCommandID, "", wCommandNo, wFollowNo, wOperatorNo, wFactoryID, wWorkShopID, wLineID, wAssetNo, wWorkPartPointCode,
                    wStationID, wProductID, wCustomerID, wTeamID, wPartNo, wStateIDList, wOrderNoLike, wPreStartTime,
                    wPreEndTime, wRelStartTime, wRelEndTime, wPagination, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }


        public ServiceResult<Dictionary<String, Dictionary<String, int>>> OMS_SelectOrderPositionList(BMSEmployee wLoginUser, int wLineID, List<String> wOrderNoList)
        {
            ServiceResult<Dictionary<String, Dictionary<String, int>>> wResult = new ServiceResult<Dictionary<String, Dictionary<String, int>>>();
            try
            {
                wResult.Result = new Dictionary<string, Dictionary<String, int>>();

                if (wLineID <= 0 || wOrderNoList == null || wOrderNoList.Count <= 0)
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

                Dictionary<String, DMSDeviceLedger> wDeviceDic = wDMSDeviceLedgerList.GroupBy(p => p.AssetNo).ToDictionary(p => p.Key, p => p.FirstOrDefault());


                foreach (String wOrderNo in wOrderNoList)
                {
                    if (StringUtils.isEmpty(wOrderNo))
                        continue;
                    if (!wResult.Result.ContainsKey(wOrderNo))
                        wResult.Result.Add(wOrderNo, new Dictionary<string, int>());
                    foreach (DMSDeviceLedger wDeviceLedger in wDMSDeviceLedgerList)
                    {
                        if (!wResult.Result[wOrderNo].ContainsKey(wDeviceLedger.Name))
                            wResult.Result[wOrderNo].Add(wDeviceLedger.Name, 0);
                    }

                }

                Dictionary<String, List<String>> wWorkpiecePosition = DMSServiceImpl.getInstance().DMS_GetPositionWorkpieceNo(wLoginUser, wLineID).Result; ;

                Dictionary<String, List<String>> wWorkpiecePositionDic = new Dictionary<string, List<string>>();
                foreach (String wAssetNo in wWorkpiecePosition.Keys)
                {
                    if (StringUtils.isEmpty(wAssetNo))
                        continue;
                    if (!wDeviceDic.ContainsKey(wAssetNo))
                        continue;
                    if (wDeviceDic[wAssetNo] == null || wDeviceDic[wAssetNo].ID <= 0)
                        continue;

                    foreach (String wWorkpieceNo in wWorkpiecePosition[wAssetNo])
                    {
                        if (StringUtils.isEmpty(wWorkpieceNo))
                            continue;
                        if (!wWorkpiecePositionDic.ContainsKey(wWorkpieceNo))
                            wWorkpiecePositionDic.Add(wWorkpieceNo, new List<String>());
                        if (wWorkpiecePositionDic[wWorkpieceNo].Contains(wDeviceDic[wAssetNo].Name))
                            continue;
                        wWorkpiecePositionDic[wWorkpieceNo].Add(wDeviceDic[wAssetNo].Name);
                    }
                }


                List<String> wWorkpieceNoList = new List<string>();
                if (wWorkpiecePosition == null || wWorkpiecePosition.Count <= 0)
                {
                    return wResult;
                }
                foreach (String wAssetNo in wWorkpiecePosition.Keys)
                {
                    wWorkpieceNoList.AddRange(wWorkpiecePosition[wAssetNo]);


                }
                wWorkpieceNoList = wWorkpieceNoList.Distinct().ToList();

                List<QMSWorkpiece> wQMSWorkpieceList = QMSWorkpieceDAO.getInstance().QMS_SelectWorkpieceAll(wLoginUser, wLineID, wWorkpieceNoList, wErrorCode);

                // wQMSWorkpieceList.GroupBy(p=>p.OrderNo).ToDictionary(p=>p.Key,p=>p.GroupBy(p=> wWorkpiecePosition.ContainsKey(  p.WorkpieceNo))

                foreach (QMSWorkpiece wQMSWorkpiece in wQMSWorkpieceList)
                {
                    if (!wWorkpiecePositionDic.ContainsKey(wQMSWorkpiece.WorkpieceNo))
                        continue;
                    if (!wResult.Result.ContainsKey(wQMSWorkpiece.OrderNo))
                        continue;

                    foreach (String wDeviceName in wWorkpiecePositionDic[wQMSWorkpiece.WorkpieceNo])
                    {
                        if (!wResult.Result[wQMSWorkpiece.OrderNo].ContainsKey(wDeviceName))
                            continue;
                        wResult.Result[wQMSWorkpiece.OrderNo][wDeviceName]++;
                    }
                }

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }




        public ServiceResult<Dictionary<String, int>> OMS_SelectStatusCount(BMSEmployee wLoginUser, int wCommandID, int wFactoryID, int wWorkShopID,
              int wLineID, String wAssetNo, String wWorkPartPointCode, int wStationID, int wProductID, int wCustomerID, int wTeamID, String wPartNo,
              List<Int32> wStateIDList, String wOrderNoLike, DateTime wPreStartTime, DateTime wPreEndTime, DateTime wRelStartTime,
              DateTime wRelEndTime)
        {
            ServiceResult<Dictionary<String, int>> wResult = new ServiceResult<Dictionary<String, int>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = OMSOrderDAO.getInstance().OMS_SelectStatusCount(wLoginUser, wCommandID, wFactoryID, wWorkShopID, wLineID, wAssetNo, wWorkPartPointCode,
                    wStationID, wProductID, wCustomerID, wTeamID, wPartNo, wStateIDList, wOrderNoLike, wPreStartTime,
                    wPreEndTime, wRelStartTime, wRelEndTime, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<List<OMSOrder>> OMS_SelectListByIDList(BMSEmployee wLoginUser, List<int> wIDList)
        {
            ServiceResult<List<OMSOrder>> wResult = new ServiceResult<List<OMSOrder>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = OMSOrderDAO.getInstance().OMS_SelectOrderListByIDList(wLoginUser, wIDList, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<List<OMSOrder>> OMS_SelectList_RF(BMSEmployee wLoginUser, int wCustomerID, int wWorkShopID,
            int wLineID, int wProductID, string wPartNo, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<OMSOrder>> wResult = new ServiceResult<List<OMSOrder>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = OMSOrderDAO.getInstance().OMS_SelectList_RF(wLoginUser, wCustomerID,
                    wWorkShopID, wLineID, wProductID, wPartNo, wStartTime, wEndTime, wPagination, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<OMSOrder> OMS_SelectOrderByID(BMSEmployee wLoginUser, int wID)
        {
            ServiceResult<OMSOrder> wResult = new ServiceResult<OMSOrder>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = OMSOrderDAO.getInstance().OMS_SelectOrderByID(wLoginUser, wID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<int> OMS_UpdateCommand(BMSEmployee wLoginUser, OMSCommand wOMSCommand)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                OMSCommandDAO.getInstance().OMS_UpdateCommand(wLoginUser, wOMSCommand, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<int> OMS_UpdateOrder(BMSEmployee wLoginUser, OMSOrder wOMSOrder)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                OMSOrderDAO.getInstance().OMS_UpdateOrder(wLoginUser, wOMSOrder, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }


        /// <summary>
        /// 订单同步
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wOrderList"></param>
        /// <returns></returns>
        public ServiceResult<List<String>> OMS_SyncOrderList(BMSEmployee wLoginUser, List<OMSOrder> wOrderList)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                wResult.Result = new List<string>();
                if (wOrderList == null || wOrderList.Count <= 0) { 
                    return wResult;
                }
                   

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<String> wOrderNoList = wOrderList.Select(p => p.OrderNo).ToList();

                List<FPCProduct> wFPCProductList = FPCProductDAO.getInstance().FPC_GetProductAll(wLoginUser, "", "", -1, -1, "", -1, Pagination.MaxSize, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }


                List<OMSOrder> wSourceList = OMSOrderDAO.getInstance().OMS_SelectOrderListByOrderNoList(wLoginUser, wOrderNoList, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }

                List<DMSDeviceLedger> wDeviceLedgerSourceList = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedgerList(wLoginUser, -1, -1, Pagination.Create(1, Int32.MaxValue), wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }

                List<FPCPartPoint> wPartPointSourceList = FPCPartPointDAO.getInstance().FPC_GetPartPointList(wLoginUser, -1, -1, -1, -1,
                    -1, 1, Pagination.Create(1, Int32.MaxValue), wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }

                List<FMCStation> wStationSourceList = FMCStationDAO.getInstance().FMC_QueryStationList(wLoginUser, "", -1, -1, -1, 1, Pagination.MaxSize, wErrorCode);
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

                List<BMSEmployee> wEmployeeSourceList = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeAll(wLoginUser, -1, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }

                Dictionary<string, FPCPartPoint> wPartPointDic = wPartPointSourceList.ToDictionary(p => p.Code+p.LineID, p => p);


                Dictionary<string, DMSDeviceLedger> wDeviceLedgerDic = wDeviceLedgerSourceList.ToDictionary(p => p.AssetNo, p => p);

                Dictionary<string, FMCStation> wStationSourceDic = wStationSourceList.ToDictionary(p => p.Code, p => p);

                Dictionary<string, Int32> wEmployeeIDSourveDic = wEmployeeSourceList.ToDictionary(p => p.LoginID, p => p.ID);

                Dictionary<string, BMSTeamManage> wTeamManageSourveDic = wTeamManageSourceList.ToDictionary(p => p.Code, p => p);

                Dictionary<string, OMSOrder> wSourceDic = wSourceList.ToDictionary(p => p.OrderNo, p => p);

                Dictionary<string, FPCProduct> wFPCProductDic = wFPCProductList.ToDictionary(p => p.ProductNo, p => p);

                int i = 0;
                foreach (OMSOrder wOrder in wOrderList)
                {
                    i++;
                    if (wOrder == null)
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}条数据不完整  !", i));
                        continue;
                    }

                    if (StringUtils.isEmpty(wOrder.OrderNo) || StringUtils.isEmpty(wOrder.ProductNo))
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}条数据不完整 OrderNo:{1} ProductNo:{2} !", i,
                               wOrder.OrderNo, wOrder.ProductNo));
                        continue;
                    }
                    //2023/6/27 新增插入新工序时，将工单的产线ID赋给工序表的产线ID
                    if (!wPartPointDic.ContainsKey(wOrder.WorkPartPointCode+wOrder.LineID))
                    {
                        wPartPointDic.Add(wOrder.WorkPartPointCode + wOrder.LineID, new FPCPartPoint() { Name = wOrder.WorkPartPointName, Code = wOrder.WorkPartPointCode,LineID=wOrder.LineID, Active = 1 });
                        //插入工序
                        FPCPartPointDAO.getInstance().FPC_UpdatePartPoint(wLoginUser, wPartPointDic[wOrder.WorkPartPointCode + wOrder.LineID], wErrorCode);
                    }
                    if (!wFPCProductDic.ContainsKey(wOrder.ProductNo))
                    {
                        wFPCProductDic.Add(wOrder.ProductNo, new FPCProduct() { ProductName = wOrder.ProductNo, ProductNo = wOrder.ProductNo, Active = 1 });
                        //插入产品型号
                        FPCProductDAO.getInstance().FPC_UpdateProduct(wLoginUser, wFPCProductDic[wOrder.ProductNo], wErrorCode);
                    }

                    wOrder.ProductID = wFPCProductDic[wOrder.ProductNo].ID;


                    //检查设备是否存在 不存在提示报错
                    if (wSourceDic.ContainsKey(wOrder.OrderNo))
                    {
                        if ((wSourceDic[wOrder.OrderNo].Status > (int)OMSOrderStatus.WeekPlantOrder) && (wSourceDic[wOrder.OrderNo].Status != (int)OMSOrderStatus.CloseOrder))
                        {
                            wResult.Result.Add(StringUtils.Format("OrderNo:{0} Update Error:Status has been changed, modification not allowed!",
                                                         wOrder.OrderNo));
                            continue;
                        }
                        wOrder.ID = wSourceDic[wOrder.OrderNo].ID;
                        wOrder.CommandID = wSourceDic[wOrder.OrderNo].CommandID;
                    }

                    if (wDeviceLedgerDic.ContainsKey(wOrder.AssetNo))
                    {
                        wOrder.DeviceName = wDeviceLedgerDic[wOrder.AssetNo].Name;
                        wOrder.DeviceNo = wDeviceLedgerDic[wOrder.AssetNo].Code;
                    }
                    else
                    {
                        wResult.Result.Add(StringUtils.Format("OrderNo:{0} AssetNo：{1}  Error:Device Not Found!",
                               wOrder.OrderNo, wOrder.AssetNo));
                        continue;
                    }


                    wOrder.WorkerIDList = StringUtils.parseIntList(wOrder.WorkerName, wEmployeeIDSourveDic);


                    if (wOrder.Status <= 0)
                        wOrder.Status = (int)OMSOrderStatus.WeekPlantOrder;

                    if (wOrder.FactoryID <= 0)
                        wOrder.FactoryID = 1;
                    //if (wOrder.CustomerID <= 0)
                    //    wOrder.CustomerID = 18;
                    if (wOrder.LineID <= 0)
                    {
                        wOrder.LineID = wDeviceLedgerDic[wOrder.AssetNo].LineID;
                    }

                    OMSOrderDAO.getInstance().OMS_UpdateOrder(wLoginUser, wOrder, wErrorCode);
                    if (wErrorCode.Result != 0)
                    {
                        wResult.Result.Add(StringUtils.Format("OrderNo:{0} Update Error:{1}",
                            wOrder.OrderNo, MESException.getEnumType(wErrorCode.get()).getLabel()));

                    }

                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.ToString();
            }
            return wResult;
        }

        /// <summary>
        /// 订单状态变更
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wOrderList"></param>
        /// <returns></returns>

        public ServiceResult<List<String>> OMS_SyncOrderChangeList(BMSEmployee wLoginUser, List<OMSOrder> wOrderList)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                wResult.Result = new List<string>();
                if (wOrderList == null || wOrderList.Count <= 0)
                    return wResult;
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                List<String> wOrderNoList = wOrderList.Select(p => p.OrderNo).ToList();
                List<OMSOrder> wSourceList = OMSOrderDAO.getInstance().OMS_SelectOrderListByOrderNoList(wLoginUser, wOrderNoList, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                Dictionary<string, OMSOrder> wSourceDic = wSourceList.ToDictionary(p => p.OrderNo, p => p);
                int i = 0;
                foreach (OMSOrder wOrder in wOrderList)
                {
                    i++;
                    if (wOrder == null)
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}条数据不完整  !", i));
                        continue;
                    }
                    if (StringUtils.isEmpty(wOrder.OrderNo))
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}条数据不完整 OrderNo:{1} !", i,
                               wOrder.OrderNo));
                        continue;
                    }
                    //检查设备是否存在 不存在提示报错
                    if (!wSourceDic.ContainsKey(wOrder.OrderNo))
                    {
                        wResult.Result.Add(StringUtils.Format("OrderNo:{0} Error:Order Not Found!!",
                                                     wOrder.OrderNo));
                        continue;
                    }
                    DateTime wBaseTime = new DateTime(2020, 1, 1);
                    if (wOrder.PlanFinishDate > wBaseTime)
                    {
                        wSourceDic[wOrder.OrderNo].PlanFinishDate = wOrder.PlanFinishDate;
                    }
                    if (wOrder.PlanReceiveDate > wBaseTime)
                    {
                        wSourceDic[wOrder.OrderNo].PlanReceiveDate = wOrder.PlanReceiveDate;
                    }
                    if (wOrder.RealFinishDate > wBaseTime)
                    {
                        wSourceDic[wOrder.OrderNo].RealFinishDate = wOrder.RealFinishDate;
                    }
                    if (wOrder.RealStartDate > wBaseTime)
                    {
                        wSourceDic[wOrder.OrderNo].RealStartDate = wOrder.RealStartDate;
                    }
                    if (wOrder.RealSendDate > wBaseTime)
                    {
                        wSourceDic[wOrder.OrderNo].RealSendDate = wOrder.RealSendDate;
                    }
                    Boolean wIsAllow = false;
                    switch ((OMSOrderStatus)wSourceDic[wOrder.OrderNo].Status)
                    {
                        case OMSOrderStatus.Default:
                            break;
                        case OMSOrderStatus.HasOrder:
                            break;
                        case OMSOrderStatus.PlantOrder:
                            break;
                        case OMSOrderStatus.WeekPlantOrder:
                            if (wOrder.Status >= (int)OMSOrderStatus.PlantOrder)
                                wIsAllow = true;
                            break;
                        case OMSOrderStatus.ProductOrder:
                            if (wOrder.Status >= (int)OMSOrderStatus.PlantOrder)
                                wIsAllow = true;
                            break;
                        case OMSOrderStatus.FinishOrder:
                            if (wOrder.Status == (int)OMSOrderStatus.SendOrder)
                                wIsAllow = true;
                            break;
                        case OMSOrderStatus.StopOrder:
                            if (wOrder.Status >= (int)OMSOrderStatus.ProductOrder)
                                wIsAllow = true;
                            break;
                        case OMSOrderStatus.StockOrder:
                            if (wOrder.Status == (int)OMSOrderStatus.SendOrder)
                                wIsAllow = true;
                            break;
                        case OMSOrderStatus.SendOrder:
                            if (wOrder.Status == (int)OMSOrderStatus.SendOrder)
                                wIsAllow = true;
                            break;
                        case OMSOrderStatus.CloseOrder:
                            if (wOrder.Status == (int)OMSOrderStatus.CloseOrder)
                                wIsAllow = true;
                            break;
                        case OMSOrderStatus.OverOrder:
                            break;
                        default:
                            break;
                    }
                    if (!wIsAllow)
                    {
                        wResult.Result.Add(StringUtils.Format("OrderNo:{0} OldStatus:{1} NewStatus:{2} Error:Status Not Allow Change !!",
                                                     wOrder.OrderNo, wSourceDic[wOrder.OrderNo].Status, wOrder.Status));
                        continue;
                    }
                    wSourceDic[wOrder.OrderNo].Status = wOrder.Status;
                    //判断是否完工,完工更新实际完工时间
                    if(wSourceDic[wOrder.OrderNo].Status==5)
                        wSourceDic[wOrder.OrderNo].RealFinishDate = wOrder.RealFinishDate;
                    OMSOrderDAO.getInstance().OMS_UpdateOrder(wLoginUser, wSourceDic[wOrder.OrderNo], wErrorCode);
                    if (wErrorCode.Result != 0)
                    {
                        wResult.Result.Add(StringUtils.Format("OrderNo:{0} Update Error:{1}",
                            wOrder.OrderNo, MESException.getEnumType(wErrorCode.get()).getLabel()));
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

        public ServiceResult<List<OMSChangeProduct>> OMS_SelectChangeProductList(BMSEmployee wLoginUser, string wCodeLike,
            int wOldOrderID, string wOldOrderNo, List<int> wChangeOrderIDs, string wChangeOrderNo, int wOldProductID,
            int wChangeProductID, int wEditorID, int wStatus, int wActive, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<OMSChangeProduct>> wResult = new ServiceResult<List<OMSChangeProduct>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = OMSChangeProductDAO.getInstance().OMS_SelectChangeProductList(wLoginUser, wCodeLike,
             wOldOrderID, wOldOrderNo, wChangeOrderIDs, wChangeOrderNo, wOldProductID,
             wChangeProductID, wEditorID, wStatus, wActive, wStartTime, wEndTime, wPagination, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<List<OMSChangeProduct>> OMS_SelectChangeProductList(BMSEmployee wLoginUser,
            int wLineID, List<int> wChangeOrderIDs, Pagination wPagination)
        {
            ServiceResult<List<OMSChangeProduct>> wResult = new ServiceResult<List<OMSChangeProduct>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = OMSChangeProductDAO.getInstance().OMS_SelectChangeProductList(wLoginUser, wLineID,
                    wChangeOrderIDs, "", wPagination, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<OMSChangeProduct> OMS_SelectChangeProductByOrder(BMSEmployee wLoginUser, int wLineID, String wOrderNo)
        {

            ServiceResult<OMSChangeProduct> wResult = new ServiceResult<OMSChangeProduct>();
            try
            {
                if (StringUtils.isEmpty(wOrderNo))
                    return wResult;

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                List<OMSChangeProduct> wOMSChangeProductList = OMSChangeProductDAO.getInstance().OMS_SelectChangeProductList(wLoginUser, wLineID,
                    null, wOrderNo, Pagination.Default, wErrorCode);
                if (wOMSChangeProductList != null && wOMSChangeProductList.Count > 0)
                {
                    wResult.Result = wOMSChangeProductList[0];
                }
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }


        public ServiceResult<OMSChangeProduct> OMS_SelectChangeProduct(BMSEmployee wLoginUser, int wID, string wCode)
        {
            ServiceResult<OMSChangeProduct> wResult = new ServiceResult<OMSChangeProduct>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = OMSChangeProductDAO.getInstance().OMS_SelectChangeProduct(wLoginUser, wID,
            wCode, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<int> OMS_UpdateChangeProduct(BMSEmployee wLoginUser, OMSChangeProduct wOMSChangeProduct)
        {
            ServiceResult<int> wResult = new ServiceResult<int>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                //如果状态改成已确认 需要判断子项数据以及物料数据
                if (wOMSChangeProduct.Status == 2)
                {
                    if (wOMSChangeProduct.ID <= 0)
                    {
                        wOMSChangeProduct.Status = 1;
                    }
                    else
                    {
                        if (wOMSChangeProduct.MaterialID <= 0)
                        {
                            wResult.FaultCode = MESException.Parameter.getLabel();
                            return wResult;
                        }

                        OMSChangeProduct wChangeProduct = OMSChangeProductDAO.getInstance().OMS_SelectChangeProduct(wLoginUser, wOMSChangeProduct.ID,
                                "", wErrorCode);

                        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

                        if (wChangeProduct == null || wChangeProduct.ID <= 0)
                        {
                            return wResult;
                        }

                        if (wChangeProduct.DeviceList != null && wChangeProduct.DeviceList.Count > 0)
                        {
                            foreach (OMSChangeProductDevice wOMSChangeProductDevice in wChangeProduct.DeviceList)
                            {
                                if (wOMSChangeProductDevice.NCEnable != 1 && wOMSChangeProductDevice.FixturesEnable != 1
                                    && wOMSChangeProductDevice.ToolEnable != 1 && wOMSChangeProductDevice.Status != 2)
                                {
                                    //自动提交
                                    wOMSChangeProductDevice.Status = 2;
                                    OMSChangeProductDeviceDAO.getInstance().OMS_UpdateChangeProductDevice(wLoginUser, wOMSChangeProductDevice, wErrorCode);
                                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

                                }
                                else if (wOMSChangeProductDevice.Status != 2)
                                {
                                    wResult.FaultCode += StringUtils.Format("设备（{0}）未确认换型完成！\n", wOMSChangeProductDevice.DeviceName);
                                }
                            }
                        }

                    }
                }
                if (StringUtils.isNotEmpty(wResult.FaultCode))
                {
                    return wResult;
                }

                OMSChangeProductDAO.getInstance().OMS_UpdateChangeProduct(wLoginUser, wOMSChangeProduct, wErrorCode);




                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<int> OMS_CreateChangeProduct(BMSEmployee wLoginUser, int wLineID, int wOldOrderID, int wChangeOrderID)
        {
            ServiceResult<int> wResult = new ServiceResult<int>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                OMSChangeProduct wOMSChangeProduct = new OMSChangeProduct();
                wOMSChangeProduct.LineID = wLineID;
                wOMSChangeProduct.OldOrderID = wOldOrderID;
                wOMSChangeProduct.ChangeOrderID = wChangeOrderID;
                wOMSChangeProduct.SetUserInfo(wLoginUser);

                List<DMSDeviceLedger> wDMSDeviceLedgerList = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedgerList(wLoginUser, wLineID, -1, Pagination.Create(1, int.MaxValue), wErrorCode);
                OMSChangeProductDevice wOMSChangeProductDevice;
                foreach (DMSDeviceLedger wDMSDeviceLedger in wDMSDeviceLedgerList)
                {
                    wOMSChangeProductDevice = new OMSChangeProductDevice(wDMSDeviceLedger);

                    wOMSChangeProduct.DeviceList.Add(wOMSChangeProductDevice);
                }

                OMSChangeProductDAO.getInstance().OMS_UpdateChangeProduct(wLoginUser, wOMSChangeProduct, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<int> OMS_DeleteChangeProduct(BMSEmployee wLoginUser, List<int> wIDList)
        {
            ServiceResult<int> wResult = new ServiceResult<int>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                OMSChangeProductDAO.getInstance().OMS_DeleteChangeProduct(wLoginUser, wIDList, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<List<OMSChangeProductDevice>> OMS_SelectChangeProductDeviceList(BMSEmployee wLoginUser, List<int> wMainIDList, List<int> wDeviceIDList, int wEditorID, int wStatus, DateTime wStartTime, DateTime wEndTime, Pagination wPagination)
        {
            ServiceResult<List<OMSChangeProductDevice>> wResult = new ServiceResult<List<OMSChangeProductDevice>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = OMSChangeProductDeviceDAO.getInstance().OMS_SelectChangeProductDeviceList(wLoginUser, wMainIDList,
            wDeviceIDList, wEditorID, wStatus, wStartTime, wEndTime, wPagination, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<OMSChangeProductDevice> OMS_SelectChangeProductDevice(BMSEmployee wLoginUser, int wID)
        {
            ServiceResult<OMSChangeProductDevice> wResult = new ServiceResult<OMSChangeProductDevice>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = OMSChangeProductDeviceDAO.getInstance().OMS_SelectChangeProductDevice(wLoginUser, wID,
              wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<int> OMS_UpdateChangeProductDevice(BMSEmployee wLoginUser, OMSChangeProductDevice wOMSChangeProductDevice)
        {
            ServiceResult<int> wResult = new ServiceResult<int>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);


                if (wOMSChangeProductDevice.Status == 2)
                {
                    if ((wOMSChangeProductDevice.NCEnable == 1) && (wOMSChangeProductDevice.NCConfirm != 1))
                    {
                        wResult.FaultCode += StringUtils.Format("设备（{0}）程序未确认", wOMSChangeProductDevice.DeviceName);
                    }
                    if ((wOMSChangeProductDevice.ToolEnable == 1) && (wOMSChangeProductDevice.ToolConfirm != 1))
                    {
                        wResult.FaultCode += StringUtils.Format("设备（{0}）刀具未确认", wOMSChangeProductDevice.DeviceName);
                    }
                    if ((wOMSChangeProductDevice.FixturesEnable == 1) && (wOMSChangeProductDevice.FixturesEnable != 1))
                    {
                        wResult.FaultCode += StringUtils.Format("设备（{0}）工装未确认", wOMSChangeProductDevice.DeviceName);
                    }
                }
                if (StringUtils.isNotEmpty(wResult.FaultCode))
                {
                    return wResult;
                }

                OMSChangeProductDeviceDAO.getInstance().OMS_UpdateChangeProductDevice(wLoginUser, wOMSChangeProductDevice, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<int> OMS_DeleteChangeProductDevice(BMSEmployee wLoginUser, List<int> wIDList)
        {
            ServiceResult<int> wResult = new ServiceResult<int>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                OMSChangeProductDeviceDAO.getInstance().OMS_DeleteChangeProductDevice(wLoginUser, wIDList, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public void UpdateWorkTime()
        {
            OMSOrderDAO.getInstance().UpdateWorkTime();
        }
    }
}
