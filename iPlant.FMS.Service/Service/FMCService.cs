using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    public interface FMCService
    {
        // 车间

        ServiceResult<Int32> FMC_AddFactory(BMSEmployee wLoginUser, FMCFactory wFactory);

        ServiceResult<Int32> FMC_SaveFactory(BMSEmployee wLoginUser, FMCFactory wFactory);

        ServiceResult<Int32> FMC_DisableFactory(BMSEmployee wLoginUser, FMCFactory wFactory);

        ServiceResult<Int32> FMC_ActiveFactory(BMSEmployee wLoginUser, FMCFactory wFactory);
        ServiceResult<Int32> FMC_DeleteFactory(BMSEmployee wLoginUser, FMCFactory wFactory);
        ServiceResult<FMCFactory> FMC_QueryFactoryByID(BMSEmployee wLoginUser, int wID);

        ServiceResult<FMCFactory> FMC_QueryFactoryByCode(BMSEmployee wLoginUser, String wCode);

        ServiceResult<List<FMCFactory>> FMC_QueryFactoryList(BMSEmployee wLoginUser, String wName, int wCountryID,
            int wProvinceID,
                int wCityID, int wActive);


        // 车间

        ServiceResult<Int32> FMC_AddWorkShop(BMSEmployee wLoginUser, FMCWorkShop wWorkShop);

        ServiceResult<Int32> FMC_SaveWorkShop(BMSEmployee wLoginUser, FMCWorkShop wWorkShop);

        ServiceResult<Int32> FMC_DisableWorkShop(BMSEmployee wLoginUser, FMCWorkShop wWorkShop);

        ServiceResult<Int32> FMC_ActiveWorkShop(BMSEmployee wLoginUser, FMCWorkShop wWorkShop);
 
        ServiceResult<FMCWorkShop> FMC_QueryWorkShopByID(BMSEmployee wLoginUser, int wID);

        ServiceResult<FMCWorkShop> FMC_QueryWorkShopByCode(BMSEmployee wLoginUser, String wCode);

        ServiceResult<List<FMCWorkShop>> FMC_QueryWorkShopList(BMSEmployee wLoginUser, int wFactoryID,
                int wBusinessUnitID, int wActive);

        // 产线

        ServiceResult<Int32> FMC_AddLine(BMSEmployee wLoginUser, FMCLine wLine);

        ServiceResult<Int32> FMC_SaveLine(BMSEmployee wLoginUser, FMCLine wLine);

        ServiceResult<Int32> FMC_DisableLine(BMSEmployee wLoginUser, FMCLine wLine);

        ServiceResult<Int32> FMC_ActiveLine(BMSEmployee wLoginUser, FMCLine wLine);
         

        ServiceResult<FMCLine> FMC_QueryLineByID(BMSEmployee wLoginUser, int wID);

        ServiceResult<FMCLine> FMC_QueryLineByCode(BMSEmployee wLoginUser, String wCode);

        ServiceResult<List<FMCLine>> FMC_QueryLineList(BMSEmployee wLoginUser, int wBusinessUnitID, int wFactoryID,
                int wWorkShopID, int wActive);

        ServiceResult<Dictionary<Int32, FMCLine>> FMC_QueryLineDic();

        //// 产线工艺配置

        //ServiceResult<Int32> FMC_AddLineUnit(BMSEmployee wLoginUser, FMCLineUnit wLineUnit);

        //ServiceResult<Int32> FMC_CopyLineUnit(BMSEmployee wLoginUser, int wOldLineID, int wOldProductID,
        //        int wOldCustomerID, int wLineID, int wProductID, int wCustomerID);

        //ServiceResult<Int32> FMC_SaveLineUnit(BMSEmployee wLoginUser, FMCLineUnit wLineUnit);

        //ServiceResult<Int32> FMC_DeleteLineUnitByID(BMSEmployee wLoginUser, int wID);

        //ServiceResult<Int32> FMC_ActiveLineUnit(BMSEmployee wLoginUser, FMCLineUnit wLineUnit);

        //ServiceResult<Int32> FMC_DisableLineUnit(BMSEmployee wLoginUser, FMCLineUnit wLineUnit);

        //ServiceResult<List<FMCLineUnit>> FMC_QueryLineUnitListByLineID(BMSEmployee wLoginUser, int wProductID,
        //        int wCustomerID, int wLineID, int wID, boolean wIsList);

        //ServiceResult<List<FMCLineUnit>> FMC_QueryLineUnitListByPartID(BMSEmployee wLoginUser, int wProductID,
        //        int wCustomerID, int wLineID, int wPartID);

        //ServiceResult<List<FMCStation>> FMC_QueryStationListByPartID(BMSEmployee wLoginUser, int wProductID,
        //        int wCustomerID, int wLineID, int wPartID);

        //ServiceResult<List<FMCLineUnit>> FMC_QueryLineUnitListByStationID(BMSEmployee wLoginUser, int wProductID,
        //        int wCustomerID, int wLineID, int wStationID);

        // 制造资源

        ServiceResult<Int32> FMC_AddResource(BMSEmployee wLoginUser, FMCResource wResource);

        ServiceResult<Int32> FMC_SaveResource(BMSEmployee wLoginUser, FMCResource wResource);

        ServiceResult<Int32> FMC_DisableResource(BMSEmployee wLoginUser, FMCResource wResource);

        ServiceResult<Int32> FMC_ActiveResource(BMSEmployee wLoginUser, FMCResource wResource);


        ServiceResult<Int32> FMC_DeleteResource(BMSEmployee wLoginUser, FMCResource wResource);

        ServiceResult<FMCResource> FMC_QueryResourceByID(BMSEmployee wLoginUser, int wID);

        ServiceResult<List<FMCResource>> FMC_QueryResourceList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID,
                int wStationID, int wAreaID, int wResourceID, int wType, int wActive);

        //// 工区

        //ServiceResult<Int32> FMC_AddWorkArea(BMSEmployee wLoginUser, FMCWorkArea wWorkArea);

        //ServiceResult<Int32> FMC_SaveWorkArea(BMSEmployee wLoginUser, FMCWorkArea wWorkArea);

        //ServiceResult<Int32> FMC_DisableWorkArea(BMSEmployee wLoginUser, FMCWorkArea wWorkArea);

        //ServiceResult<Int32> FMC_ActiveWorkArea(BMSEmployee wLoginUser, FMCWorkArea wWorkArea);

        //ServiceResult<FMCWorkArea> FMC_QueryWorkArea(BMSEmployee wLoginUser, int wID, String wCode);

        //ServiceResult<List<FMCWorkArea>> FMC_QueryWorkAreaList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID,
        //        int wParentID, int wActive);

        // 工位

        ServiceResult<Int32> FMC_AddStation(BMSEmployee wLoginUser, FMCStation wStation);

        ServiceResult<Int32> FMC_SaveStation(BMSEmployee wLoginUser, FMCStation wStation);

        ServiceResult<Int32> FMC_DisableStation(BMSEmployee wLoginUser, FMCStation wStation);

        ServiceResult<Int32> FMC_ActiveStation(BMSEmployee wLoginUser, FMCStation wStation);

        ServiceResult<Int32> FMC_DeleteStation(BMSEmployee wLoginUser, FMCStation wStation);
        ServiceResult<FMCStation> FMC_QueryStation(BMSEmployee wLoginUser, int wID, String wCode);

        ServiceResult<List<String>> FMC_SyncStationList(BMSEmployee wLoginUser, List<FMCStation> wStationList);

        ServiceResult<List<FMCStation>> FMC_QueryStationList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID,
                int wWorkAreaID, int wActive, Pagination wPagination);

        // 班次模板管理

        ServiceResult<Int32> FMC_AddWorkDay(BMSEmployee wLoginUser, FMCWorkDay wShift);

        ServiceResult<Int32> FMC_SaveWorkDay(BMSEmployee wLoginUser, FMCWorkDay wShift);

        ServiceResult<Int32> FMC_DisableWorkDay(BMSEmployee wLoginUser, FMCWorkDay wShift);

        ServiceResult<Int32> FMC_ActiveWorkDay(BMSEmployee wLoginUser, FMCWorkDay wShift);

      

        ServiceResult<FMCWorkDay> FMC_QueryWorkDayByID(BMSEmployee wLoginUser, int wID);

        ServiceResult<FMCWorkDay> FMC_QueryActiveWorkDay(BMSEmployee wLoginUser, int wFactoryID, int wWorkShopID);

        ServiceResult<List<FMCWorkDay>> FMC_QueryWorkDayList(BMSEmployee wLoginUser, int wFactoryID, int wWorkShopID,
                int wActive);

        ServiceResult<List<FMCTimeZone>> FMC_QueryShiftTimeZoneList(BMSEmployee wLoginUser, int wShiftID);

        ServiceResult<Int32> FMC_SaveShiftTimeZoneList(BMSEmployee wLoginUser, List<FMCTimeZone> wTimeZoneList,
                int wShiftID);

        ServiceResult<List<FMCShift>> FMC_QueryShiftList(BMSEmployee wLoginUser, int wWorkDayID, int wActive);

        ServiceResult<Int32> FMC_SaveShiftList(BMSEmployee wLoginUser, List<FMCShift> wShiftList);

        ServiceResult<Int32> FMC_SaveShift(BMSEmployee wLoginUser, FMCShift wShift);

        ServiceResult<FMCShift> FMC_QueryShiftByID(BMSEmployee wLoginUser, int wWorkDayID);

        ServiceResult<Int32> FMC_DeleteShiftByID(BMSEmployee wLoginUser, int wID);
        // 工作日历设置

        //ServiceResult<List<FMCWorkspace>> FMC_GetFMCWorkspaceList(BMSEmployee wLoginUser, int wProductID, int wPartID,
        //        String wPartNo, int wPlaceType, int wActive);

        //ServiceResult<FMCWorkspace> FMC_GetFMCWorkspace(BMSEmployee wLoginUser, int wID, String wCode);

        //ServiceResult<Int32> FMC_SaveFMCWorkspace(BMSEmployee wLoginUser, FMCWorkspace wFMCWorkspace);

        //ServiceResult<Int32> FMC_BindFMCWorkspace(BMSEmployee wLoginUser, FMCWorkspace wFMCWorkspace);

        //ServiceResult<Int32> FMC_ActiveFMCWorkspace(BMSEmployee wLoginUser, int wActive,
        //        FMCWorkspace wFMCWorkspace);

        //ServiceResult<List<FMCWorkspaceRecord>> FMC_GetFMCWorkspaceRecordList(BMSEmployee wLoginUser, int wProductID,
        //        int wPartID, String wPartNo, int wPlaceID, int wPlaceType, int wLimit, DateTime wStartTime,
        //        DateTime wEndTime);

       ServiceResult<Int32> FMC_QueryShiftID(BMSEmployee wLoginUser, int wWorkShopID, DateTime wShiftTime,
                int wShifts, OutResult<Int32> wShiftIndex);

    }
}
