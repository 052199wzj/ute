using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    public class IPTServiceImpl : IPTService, IDisposable
    {
        private Timer mTimer;

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(IPTServiceImpl));
        private static readonly IPTService _instance = new IPTServiceImpl();

        public static IPTService getInstance()
        {
            return _instance;
        }

        private IPTServiceImpl()
        {
            mTimer = new Timer(MaintainPlan, null, 120000, 9000000);
        }

        /// <summary>
        /// 设备维护配置 根据提前期生成维护计划
        /// </summary>
        /// <param name="state"></param>
        private void MaintainPlan(object state)
        {
            try
            {
                //判断当前时间是否属于0-1点之间
                //if (DateTime.Now.Hour != 0)
                //{
                //    return;
                //}

                OutResult<Int32> wErrorCode = new OutResult<int>(0);

                //获取所有设备对应每个维护类型的最后一次为维护记录  维修也是维护的一种 即ItemID 使用GroupBy
                //只需要获取每种维护类型对应每个设备的最后一次日期，若没有记录默认使用设备验收日期
                Dictionary<int, List<IPTItem>> wIPTItemListDic = IPTRecordItemDAO.getInstance()
                    .IPT_GetDeviceMaintainLastTime(BaseDAO.SysAdmin, wErrorCode);


                IPTRecordItem wIPTRecordItem;
                foreach (int wDeviceID in wIPTItemListDic.Keys)
                {
                    if (wIPTItemListDic[wDeviceID] == null || wIPTItemListDic[wDeviceID].Count <= 0)
                        continue;

                    foreach (IPTItem wIPTItem in wIPTItemListDic[wDeviceID])
                    {
                        //不参与周期计划维护
                        if (wIPTItem.IntervalTime <= 0)
                            continue;
                        if (wIPTItem.AlarmIntervalTime < 0)
                            wIPTItem.AlarmIntervalTime = 0;
                         
                        //当前时间减去（周期时间与预警时间） 大于之前维修时刻  判断为未到期
                        if (DateTime.Now.AddHours(wIPTItem.AlarmIntervalTime - wIPTItem.IntervalTime).CompareTo(wIPTItem.EditTime) <= 0)
                        {
                            continue;
                        }
                        wIPTRecordItem = new IPTRecordItem(wIPTItem);
                        wIPTRecordItem.MainID = wDeviceID;
                        wIPTRecordItem.ModeType = 5;
                        wIPTRecordItem.ItemName = wIPTRecordItem.ItemName + wIPTRecordItem.Description;
                        wIPTRecordItem.Description = "";
                        wIPTRecordItem.PlanTime = DateTime.Now.AddHours(wIPTItem.AlarmIntervalTime);
                        wIPTRecordItem.CreateTime = DateTime.Now;
                        wIPTRecordItem.CreatorID = BaseDAO.SysAdmin.ID;
                        wIPTRecordItem.EditTime = DateTime.Now;

                        wIPTRecordItem.Status = 1;

                        IPTRecordItemDAO.getInstance().IPT_UpdateRecordItem(BaseDAO.SysAdmin, wIPTRecordItem,wErrorCode);

                    }
                }


                //判断日期是否满足计划条件
                //满足则生成对应维护计划
                //不满足则跳过


            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
        }




        public ServiceResult<List<IPTItem>> IPT_SelectItemList(BMSEmployee wLoginUser, int wLineID, int wProductID, String wProductLike, int wIPTType, int wModeType,
                   int wMainID, String wMainNameLike, String wGroupNameLike, String wItemNameLike, DateTime wStartTime, DateTime wEndTime,
                     int wActive, Pagination wPagination)
        {
            ServiceResult<List<IPTItem>> wResult = new ServiceResult<List<IPTItem>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(IPTItemDAO.getInstance().IPT_SelectItemList(wLoginUser, wLineID, wProductID, wProductLike, wIPTType, wModeType,
                    wMainID, wMainNameLike, wGroupNameLike, wItemNameLike, wStartTime, wEndTime,
                      wActive, wPagination, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<int> IPT_UpdateItem(BMSEmployee wLoginUser, IPTItem wItem)
        {

            ServiceResult<int> wResult = new ServiceResult<int>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                IPTItemDAO.getInstance().IPT_UpdateItem(wLoginUser, wItem, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<int> IPT_DeleteItem(BMSEmployee wLoginUser, IPTItem wItem)
        {
            ServiceResult<int> wResult = new ServiceResult<int>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                IPTItemDAO.getInstance().IPT_DeleteItem(wLoginUser, wItem, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<int> IPT_ActiveItem(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive)
        {

            ServiceResult<int> wResult = new ServiceResult<int>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                IPTItemDAO.getInstance().IPT_ActiveItem(wLoginUser, wIDList, wActive, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<IPTRecordItem>> IPT_SelectRecordItemList(BMSEmployee wLoginUser, int wOrderID, int wItemID, int wLineID, int wProductID, int wModelID, String wProductLike, int wIPTType, int wModeType,
            int wMainID, String wMainNameLike, String wGroupNameLike, String wItemNameLike, int wCreatorID, int wEditorID, DateTime wStartTime, DateTime wEndTime,
              int wStatus, Pagination wPagination)
        {
            ServiceResult<List<IPTRecordItem>> wResult = new ServiceResult<List<IPTRecordItem>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(IPTRecordItemDAO.getInstance().IPT_SelectRecordItemList(wLoginUser, wOrderID, wItemID, wLineID, wProductID, wModelID, wProductLike, wIPTType, wModeType,
                    wMainID, wMainNameLike, wGroupNameLike, wItemNameLike, wCreatorID, wEditorID, wStartTime, wEndTime,
                      wStatus, wPagination, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<int> IPT_UpdateRecordItem(BMSEmployee wLoginUser, IPTRecordItem wItem)
        {
            ServiceResult<int> wResult = new ServiceResult<int>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                IPTRecordItemDAO.getInstance().IPT_UpdateRecordItem(wLoginUser, wItem, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;

        }

        public ServiceResult<List<IPTRecordItem>> IPT_PatrolRecordDetail(BMSEmployee wLoginUser, int wOrderID, int wLineID, int wProductID, DateTime wWorkTime)
        {

            ServiceResult<List<IPTRecordItem>> wResult = new ServiceResult<List<IPTRecordItem>>();
            try
            {

                wResult.Result = new List<IPTRecordItem>();
                DateTime wBaseTime = new DateTime(2000, 1, 1);

                if ((wOrderID <= 0 && (wLineID <= 0 || wProductID <= 0)) || wWorkTime <= wBaseTime)
                    return wResult;

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                IPTTypes wIPTType = IPTTypes.Patrol;

                DateTime wStartTime = wWorkTime.Date;
                DateTime wEndTime = wWorkTime.Date.AddDays(1);

                Pagination wPagination = Pagination.Create(1, 100000);

                wResult.Result.AddRange(IPTRecordItemDAO.getInstance().IPT_SelectRecordItemList(wLoginUser, wOrderID, -1, wLineID, wProductID, -1, "", ((int)wIPTType), -1,
                    -1, "", "", "", -1, -1, wStartTime, wEndTime,
                      -1, wPagination, wErrorCode));
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                if (wWorkTime > DateTime.Now || DateTime.Now > wEndTime)
                {
                    return wResult;
                }


                List<IPTItem> wIPTItemList = IPTItemDAO.getInstance().IPT_SelectItemList(wLoginUser, wLineID, wProductID, "", ((int)wIPTType), -1,
                    -1, "", "", "", wBaseTime, wBaseTime,
                      1, wPagination, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                if (wIPTItemList.Count <= 0)
                    return wResult;

                Dictionary<int, IPTRecordItem> wIPTRecordItemDic = wResult.Result.GroupBy(p => p.ItemID).ToDictionary(p => p.Key, p => p.First());

                foreach (IPTItem wIPTItem in wIPTItemList)
                {
                    if (wIPTRecordItemDic.ContainsKey(wIPTItem.ID))
                    {
                        //修改
                        wIPTRecordItemDic[wIPTItem.ID].GroupName = wIPTItem.GroupName;
                        wIPTRecordItemDic[wIPTItem.ID].ItemName = wIPTItem.ItemName;
                        wIPTRecordItemDic[wIPTItem.ID].Description = wIPTItem.Description;
                        wIPTRecordItemDic[wIPTItem.ID].MainID = wIPTItem.MainID;
                        wIPTRecordItemDic[wIPTItem.ID].MainName = wIPTItem.MainName;
                        wIPTRecordItemDic[wIPTItem.ID].MainCode = wIPTItem.MainCode;

                    }
                    else
                    {
                        wIPTRecordItemDic.Add(wIPTItem.ID, new IPTRecordItem(wIPTItem));
                        wResult.Result.Add(wIPTRecordItemDic[wIPTItem.ID]);
                    }

                }


            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;

        }



        public ServiceResult<int> IPT_DeleteRecordItem(BMSEmployee wLoginUser, IPTRecordItem wItem)
        {
            ServiceResult<int> wResult = new ServiceResult<int>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                IPTRecordItemDAO.getInstance().IPT_DeleteRecordItem(wLoginUser, wItem, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
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
    }
}
