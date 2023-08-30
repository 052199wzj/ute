using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    public interface BFCService
    {

        ServiceResult<List<BFCHomePageGroup>> BFC_GetHomePageGroupList(BMSEmployee wLoginUser, int wType, int wGrad);



        ServiceResult<Int32> BFC_UpdateHomePageGroup(BMSEmployee wLoginUser, BFCHomePageGroup wBFCHomePageGroup);

        ServiceResult<List<BFCHomePageModule>> BFC_GetHomePageModuleList(BMSEmployee wLoginUser, int wType, int wGrad);

        ServiceResult<BFCHomePageModule> BFC_GetHomePageModuleByID(BMSEmployee wLoginUser, int wID);

        ServiceResult<Int32> BFC_UpdateHomePageModule(BMSEmployee wLoginUser, BFCHomePageModule wBFCHomePageModule);





        ServiceResult<List<BFCMessage>> BFC_GetMessageList(BMSEmployee wLoginUser, int wResponsorID, int wType,
                 List<int> wModuleID, List<Int32> wMessageIDList, List<int> wActive, int wSendStatus, int wShiftID,
                DateTime wStartTime, DateTime wEndTime, int wStepID, Pagination wPagination);

        ServiceResult<int> BFC_GetMessageCount(BMSEmployee wLoginUser, int wResponsorID, int wType, List<int> wModuleID);

        ServiceResult<List<BFCMessage>> BFC_GetUndoMessageList(BMSEmployee wLoginUser, int wResponsorID, List<int> wModuleID,
                 int wMessageID, int wShiftID, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);

        ServiceResult<Int32> BFC_UpdateMessageList(BMSEmployee wLoginUser, List<BFCMessage> wBFCMessageList);

        ServiceResult<Int32> BFC_HandleMessageByIDList(BMSEmployee wLoginUser, List<long> wMsgIDList, int wStatus,
                int wSendStatus);

        ServiceResult<Int32> BFC_ReceiveMessage(BMSEmployee wLoginUser, int wResponsorID, List<long> wMsgIDList,
                List<Int32> wStepID, int wModuleID);

        ServiceResult<Int32> BFC_HandleMessage(BMSEmployee wLoginUser, int wResponsorID, List<long> wMsgIDList,
                List<Int32> wStepID, int wModuleID, int wType, int wStatus);

        ServiceResult<Int32> BFC_ForwardMessage(BMSEmployee wLoginUser, int wResponsorID, List<Int32> wForwarderList,
                int wModuleID, long wMessageID, int wStepID);

        ServiceResult<Int32> BFC_HandleTaskMessage(BMSEmployee wLoginUser, int wResponsorID, List<Int32> wTaskIDList,
                int wModuleID, int wStepID, int wStatus, int wAuto);

        /**
         * 直接发，不保存
         * 
         * @param wBFCMessageList
         * @return
         */
        ServiceResult<Int32> BFC_SendMessageList(BMSEmployee wLoginUser, List<BFCMessage> wBFCMessageList);

        /**
         * 获取模块代办消息数
         * 
         * @param wCompanyID
         * @param wResponsorID
         * @param wShiftID
         * @return
         */
        ServiceResult<Dictionary<Int32, Int32>> BFC_GetUndoMessagCount(BMSEmployee wLoginUser, int wResponsorID, int wShiftID);

        /**
         * 获取模块代办通知消息集合
         * 
         * @param wCompanyID
         * @param wResponsorID
         * @param wShiftID
         * @return
         */
        ServiceResult<List<BFCMessage>> BFC_GetNoticeList(BMSEmployee wLoginUser, int wResponsorID, List<int> wModuleID, int wStatus,
                int wUseTime, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wCount, Pagination wPagination);

        /**
         * 已办消息数
         * 
         * @param wCompanyID
         * @param wResponsorID
         * @param wStartTime
         * @param wEndTime
         * @return
         */
        ServiceResult<List<BFCMessage>> BFC_GetMessageDoneList(BMSEmployee wLoginUser, int wResponsorID, List<int> wModuleID,
                DateTime wStartTime, DateTime wEndTime, Pagination wPagination);

        // 查询表格配置集合
        ServiceResult<List<CGSTable>> CGS_SelectCGTableByName(BMSEmployee wLoginUser, int wUserID, String TableName,
                String ModleName);

        // 保存表格配置
        ServiceResult<Int32> CGS_SaveCGTable(BMSEmployee wLoginUser, List<CGSTable> wCGTable);

        // 删除表格配置
        ServiceResult<Int32> CGS_DeleteCGTable(BMSEmployee wLoginUser, List<CGSTable> wCGTable);

        ServiceResult<List<Dictionary<String, Object>>> CGS_GetDataTableList(BMSEmployee wLoginUser, int wSqlType);

        ServiceResult<List<Dictionary<String, Object>>> CGS_GetDataTableInfo(BMSEmployee wLoginUser, int wSqlType, String wDBName,
                String wTableName);

    }
}
