using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    public interface OMSService
    {
        ServiceResult<Int32> OMS_UpdateCommand(BMSEmployee wLoginUser, OMSCommand wOMSCommand);

        ServiceResult<Int32> OMS_DeleteCommandList(BMSEmployee wLoginUser, List<OMSCommand> wList);
        ServiceResult<OMSCommand> OMS_SelectCommandByID(BMSEmployee wLoginUser, int wID);
        ServiceResult<OMSCommand> OMS_SelectCommandByCode(BMSEmployee wLoginUser, String wWBSNo);
        ServiceResult<OMSCommand> OMS_SelectCommandByPartNo(BMSEmployee wLoginUser, String wPartNo);

        ServiceResult<List<OMSCommand>> OMS_SelectCommandList(BMSEmployee wLoginUser, int wFactoryID,
               int wBusinessUnitID, int wWorkShopID, int wCustomerID, int wProductID, DateTime wStartTime, DateTime wEndTime);


        ServiceResult<Int32> OMS_UpdateOrder(BMSEmployee wLoginUser, OMSOrder wOMSOrder);

        ServiceResult<Int32> OMS_DeleteOrderList(BMSEmployee wLoginUser, List<OMSOrder> wList);

        ServiceResult<OMSOrder> OMS_SelectOrderByID(BMSEmployee wLoginUser, int wID);

        ServiceResult<OMSOrder> OMS_QueryOrderByNo(BMSEmployee wLoginUser, String wOrderNo);

        ServiceResult<Dictionary<String, Dictionary<String, int>>> OMS_SelectOrderPositionList(BMSEmployee wLoginUser, int wLineID, List<String> wOrderNoList);

        ServiceResult<List<OMSOrder>> OMS_SelectList(BMSEmployee wLoginUser, int wCommandID, int wFactoryID, int wWorkShopID,
                int wLineID, String wAssetNo, String wWorkPartPointCode, int wStationID, int wProductID, int wCustomerID, int wTeamID, String wPartNo,
                List<Int32> wStateIDList, String wOrderNoLike, DateTime wPreStartTime, DateTime wPreEndTime, DateTime wRelStartTime,
                DateTime wRelEndTime, Pagination wPagination);

        ServiceResult<List<OMSOrder>> OMS_SelectList(BMSEmployee wLoginUser, int wCommandID, String wCommandNo, String wFollowNo, String wOperatorNo, int wFactoryID,
         int wWorkShopID, int wLineID, String wAssetNo, String wWorkPartPointCode, int wStationID, int wProductID, int wCustomerID, int wTeamID,
         string wPartNo, List<int> wStateIDList, String wOrderNoLike, DateTime wPreStartTime, DateTime wPreEndTime,
         DateTime wRelStartTime, DateTime wRelEndTime, Pagination wPagination);

        ServiceResult<Dictionary<String, int>> OMS_SelectStatusCount(BMSEmployee wLoginUser, int wCommandID, int wFactoryID, int wWorkShopID,
              int wLineID, String wAssetNo, String wWorkPartPointCode, int wStationID, int wProductID, int wCustomerID, int wTeamID, String wPartNo,
              List<Int32> wStateIDList, String wOrderNoLike, DateTime wPreStartTime, DateTime wPreEndTime, DateTime wRelStartTime,
              DateTime wRelEndTime);


        ServiceResult<List<OMSOrder>> OMS_QueryOrderByStatus(BMSEmployee wLoginUser, int wWorkShopID, int wLineID, String wAssetNo, String wWorkPartPointCode, List<Int32> wStateIDList, Pagination wPagination);


        ServiceResult<List<OMSOrder>> OMS_SelectProductList(BMSEmployee wLoginUser, int wCommandID, int wFactoryID, int wWorkShopID,
               int wLineID, String wAssetNo, String wWorkPartPointCode, DateTime wRelStartTime,
               DateTime wRelEndTime, Pagination wPagination);

        ServiceResult<OMSOrder> OMS_QueryCurrentOrder(BMSEmployee wLoginUser, int wWorkShopID, int wLineID, String wAssetNo, String wWorkPartPointCode);



        ServiceResult<List<OMSOrder>> OMS_JudgeOrderImport(BMSEmployee wLoginUser, List<OMSOrder> wOMSOrderList, out List<OMSOrder> wBadOrderList);




        ServiceResult<List<OMSOrder>> OMS_SelectListByIDList(BMSEmployee wLoginUser, List<Int32> wIDList);


        ServiceResult<List<OMSOrder>> OMS_SelectFinishListByTime(BMSEmployee wLoginUser, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);

        ServiceResult<List<OMSOrder>> OMS_SelectList_RF(BMSEmployee wLoginUser, int wCustomerID, int wWorkShopID, int wLineID,
                int wProductID, String wPartNo, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);


        ServiceResult<List<OMSOrder>> OMS_ConditionAll(BMSEmployee wLoginUser, int wProductID, int wWorkShopID, int wLine, String wAssetNo, String wWorkPartPointCode,
               int wCustomerID, String wWBSNo, DateTime wStartTime, DateTime wEndTime, int wStatus, Pagination wPagination);


        ServiceResult<Int32> OMS_AuditOrder(BMSEmployee wLoginUser, List<OMSOrder> wResultList);


        ServiceResult<Int32> OMS_OrderPriority(BMSEmployee wLoginUser, int wID, int wNum);
        ServiceResult<List<String>> OMS_SyncOrderList(BMSEmployee wLoginUser, List<OMSOrder> wOrderList);

        ServiceResult<List<String>> OMS_SyncOrderChangeList(BMSEmployee wLoginUser, List<OMSOrder> wOrderList);



        ServiceResult<List<OMSChangeProduct>> OMS_SelectChangeProductList(BMSEmployee wLoginUser, string wCodeLike, int wOldOrderID, String wOldOrderNo,
              List<int> wChangeOrderIDs, String wChangeOrderNo, int wOldProductID, int wChangeProductID, int wEditorID,
                int wStatus, int wActive, DateTime wStartTime,
              DateTime wEndTime, Pagination wPagination);

        ServiceResult<List<OMSChangeProduct>> OMS_SelectChangeProductList(BMSEmployee wLoginUser,
           int wLineID, List<int> wChangeOrderIDs, Pagination wPagination);

        ServiceResult<OMSChangeProduct> OMS_SelectChangeProduct(BMSEmployee wLoginUser, int wID, string wCode);

        ServiceResult<OMSChangeProduct> OMS_SelectChangeProductByOrder(BMSEmployee wLoginUser,int wLineID, String wOrderNo);

        ServiceResult<Int32> OMS_UpdateChangeProduct(BMSEmployee wLoginUser, OMSChangeProduct wOMSChangeProduct);

        ServiceResult<int> OMS_CreateChangeProduct(BMSEmployee wLoginUser, int wLineID, int wOldOrderID, int wChangeOrderID);
        ServiceResult<Int32> OMS_DeleteChangeProduct(BMSEmployee wLoginUser, List<Int32> wIDList);

         
        ServiceResult<List<OMSChangeProductDevice>> OMS_SelectChangeProductDeviceList(BMSEmployee wLoginUser, List<int> wMainIDList,
            List<int> wDeviceIDList, int wEditorID, int wStatus, DateTime wStartTime,
            DateTime wEndTime, Pagination wPagination);

        ServiceResult<OMSChangeProductDevice> OMS_SelectChangeProductDevice(BMSEmployee wLoginUser, int wID);

        ServiceResult<Int32> OMS_UpdateChangeProductDevice(BMSEmployee wLoginUser, OMSChangeProductDevice wOMSChangeProductDevice);

        ServiceResult<Int32> OMS_DeleteChangeProductDevice(BMSEmployee wLoginUser, List<Int32> wIDList);

        public void UpdateWorkTime();


    }



}
