using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iPlant.Common.Tools;

namespace iPlant.FMC.Service
{
    public interface IPTService
    {
        ServiceResult<List<IPTItem>> IPT_SelectItemList(BMSEmployee wLoginUser, int wLineID, int wProductID, String wProductLike, int wIPTType, int wModeType,
            int wMainID, String wMainNameLike, String wGroupNameLike, String wItemNameLike, DateTime wStartTime, DateTime wEndTime,
              int wActive, Pagination wPagination);

        ServiceResult<int> IPT_UpdateItem(BMSEmployee wLoginUser, IPTItem wItem);

        ServiceResult<int> IPT_DeleteItem(BMSEmployee wLoginUser, IPTItem wItem);

        ServiceResult<int> IPT_ActiveItem(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive);


        ServiceResult<List<IPTRecordItem>> IPT_SelectRecordItemList(BMSEmployee wLoginUser, int wOrderID, int wItemID, int wLineID, int wProductID, int wModelID, String wProductLike, int wIPTType, int wModeType,
            int wMainID, String wMainNameLike, String wGroupNameLike, String wItemNameLike, int wCreatorID, int wEditorID, DateTime wStartTime, DateTime wEndTime,
              int wStatus, Pagination wPagination);

        ServiceResult<int> IPT_UpdateRecordItem(BMSEmployee wLoginUser, IPTRecordItem wItem);


        ServiceResult<List<IPTRecordItem>> IPT_PatrolRecordDetail(BMSEmployee wLoginUser, int wOrderID, int wLineID, int wProductID, DateTime wWorkTime);

        ServiceResult<int> IPT_DeleteRecordItem(BMSEmployee wLoginUser, IPTRecordItem wItem);


    }
}
