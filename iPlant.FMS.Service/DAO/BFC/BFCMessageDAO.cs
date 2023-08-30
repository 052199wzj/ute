using iPlant.Common.Tools;
using iPlant.Data.EF;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class BFCMessageDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(BFCMessageDAO));



        private static BFCMessageDAO Instance;

        public List<BFCMessage> BFC_GetMessageList(BMSEmployee wLoginUser, int wResponsorID, long wStationID,
                String wStationNo, int wType, List<int> wModuleID, List<Int32> wMessageIDList, List<int> wActive, int wSendStatus,
                int wShiftID, DateTime wStartTime, DateTime wEndTime, int wStepID, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<BFCMessage> wResult = new List<BFCMessage>();

            try
            {

                if (wStationNo == null)
                    wStationNo = "";

                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if (wStartTime < wBaseTime)
                    wStartTime = wBaseTime;
                if (wEndTime < wBaseTime)
                    wEndTime = wBaseTime;
                if (wStartTime > wEndTime)
                    return wResult;
                if (wMessageIDList == null)
                    wMessageIDList = new List<Int32>();
                if (wActive == null)
                    wActive = new List<Int32>();
                if (wModuleID == null)
                    wModuleID = new List<Int32>();
                wMessageIDList.RemoveAll(p => p <= 0);

                wActive.RemoveAll(p => p < 0);
                wModuleID.RemoveAll(p => p <= 0);

                String wSQL = StringUtils.Format("SELECT  t.* FROM {0}.bfc_message t WHERE 1=1 "
                        + " and ( @wCompanyID<= 0 or  t.CompanyID  =@wCompanyID)   "
                        + " and ( @wResponsorID<= 0 or  t.ResponsorID  =@wResponsorID)   "
                        + " and ( @wStationID<= 0 or  t.StationID  =@wStationID)   "
                        + " and ( @wStationNo is null or @wStationNo ='' or  t.StationNo  =  @wStationNo )  "
                        + " and ( @wType<= 0 or  t.Type  =@wType)   "
                        + " and ( @wModuleID ='' or  t.ModuleID IN ({3}))   "
                        + " and ( @wMessageID ='' or  t.MessageID  IN ({1}))   "
                        + " and ( @wActive ='' or  t.Active  IN ({2}) )   "
                        + " and ( @wSendStatus<= 0 or (@wSendStatus & t.SendStatus) = 0 )   "
                        + " and ( @wShiftID <= 0 or  t.ShiftID   = @wShiftID)   "
                        + " and ( @wStepID <= 0 or  t.StepID   = @wStepID)   "
                        + " and ( @wStartTime <=str_to_date('2010-01-01', '%Y-%m-%d')  or @wStartTime <=  t.EditTime )"
                        + " and ( @wEndTime <=str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >=  t.CreateTime ) ",
                        iPlant.Data.EF.MESDBSource.Basic.getDBName(),
                        wMessageIDList.Count > 0 ? StringUtils.Join(",", wMessageIDList) : "0",
                        wActive.Count > 0 ? StringUtils.Join(",", wActive) : "0",
                        wModuleID.Count > 0 ? StringUtils.Join(",", wModuleID) : "0");

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wCompanyID", wLoginUser.CompanyID);
                wParamMap.Add("wResponsorID", wResponsorID);
                wParamMap.Add("wStationNo", wStationNo);
                wParamMap.Add("wStationID", wStationID);
                wParamMap.Add("wStepID", wStepID);
                wParamMap.Add("wType", wType);
                wParamMap.Add("wModuleID", StringUtils.Join(",", wModuleID));
                wParamMap.Add("wMessageID", StringUtils.Join(",", wMessageIDList));
                wParamMap.Add("wActive", StringUtils.Join(",", wActive));
                wParamMap.Add("wShiftID", wShiftID);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wSendStatus", wSendStatus);
                wParamMap.Add("wEndTime", wEndTime);

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {

                    BFCMessage wBFCMessage = new BFCMessage();
                    wBFCMessage.ID = StringUtils.parseLong(wReader["ID"]);
                    wBFCMessage.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wBFCMessage.CompanyID = StringUtils.parseInt(wReader["CompanyID"]);
                    wBFCMessage.EditTime = StringUtils.parseDate(wReader["EditTime"]);
                    wBFCMessage.MessageID = StringUtils.parseLong(wReader["MessageID"]);
                    wBFCMessage.MessageText = StringUtils.parseString(wReader["MessageText"]);
                    wBFCMessage.StationID = StringUtils.parseLong(wReader["StationID"]);
                    wBFCMessage.StationNo = StringUtils.parseString(wReader["StationNo"]);
                    wBFCMessage.Title = StringUtils.parseString(wReader["Title"]);
                    wBFCMessage.Type = StringUtils.parseInt(wReader["Type"]);
                    wBFCMessage.Active = StringUtils.parseInt(wReader["Active"]);
                    wBFCMessage.ResponsorID = StringUtils.parseInt(wReader["ResponsorID"]);
                    wBFCMessage.ModuleID = StringUtils.parseInt(wReader["ModuleID"]);
                    wBFCMessage.StepID = StringUtils.parseInt(wReader["StepID"]);
                    wBFCMessage.SendStatus = StringUtils.parseInt(wReader["SendStatus"]);
                    wResult.Add(wBFCMessage);

                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error("BFC_GetMessageList", e);
            }
            return wResult;
        }



        public Dictionary<int, int> BFC_GetMessageCount(BMSEmployee wLoginUser, int wResponsorID, List<int> wModuleID, OutResult<Int32> wErrorCode)
        {
            Dictionary<int, int> wResult = new Dictionary<int, int>();
            try
            {
                wResult.Add(((int)BFCMessageType.Task), 0);
                wResult.Add(((int)BFCMessageType.Notify), 0);
                List<int> wTaskActive = StringUtils.parseListArgs((int)BFCMessageStatus.Default, (int)BFCMessageStatus.Sent, (int)BFCMessageStatus.Read);
                List<int> wNotifyActive = StringUtils.parseListArgs((int)BFCMessageStatus.Default, (int)BFCMessageStatus.Sent);

                String wSQL = StringUtils.Format("SELECT  count(CASE WHEN t.Type=@wTaskType and t.Active IN ({1}) THEN t.ID ELSE NULL END) as TaskCount,"
                      + " count(CASE WHEN t.Type=@wNotifyType and t.Active IN ({2}) THEN t.ID ELSE NULL END) as NotifyCount FROM {0}.bfc_message t WHERE 1=1 "
                      + " and ( @wResponsorID<= 0 or  t.ResponsorID  =@wResponsorID)   "
                      + " and ( @wModuleID ='' or  t.ModuleID IN ({3}))   ",
                      iPlant.Data.EF.MESDBSource.Basic.getDBName(),
                      StringUtils.Join(",", wTaskActive),
                       StringUtils.Join(",", wNotifyActive),
                      wModuleID.Count > 0 ? StringUtils.Join(",", wModuleID) : "0");

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wTaskType", ((int)BFCMessageType.Task));
                wParamMap.Add("wNotifyType", ((int)BFCMessageType.Notify));
                wParamMap.Add("wModuleID", StringUtils.Join(",", wModuleID));
                wParamMap.Add("wResponsorID", wResponsorID);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wResult[(int)BFCMessageType.Task] += StringUtils.parseInt(wReader["TaskCount"]);
                    wResult[(int)BFCMessageType.Notify] += StringUtils.parseInt(wReader["NotifyCount"]); 
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }

            return wResult;
        }


        public List<BFCMessage> BFC_GetMessageList(BMSEmployee wLoginUser, int wResponsorID, long wStationID,
                String wStationNo, long wType, List<int> wModuleID, int wMessageID, int wStepID, List<int> wActive, int wSendStatus,
                int wShiftID, DateTime wStartTime, DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<BFCMessage> wResult = new List<BFCMessage>();

            try
            {


                if (wStationNo == null)
                    wStationNo = "";

                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if (wStartTime < wBaseTime)
                    wStartTime = wBaseTime;
                if (wEndTime < wBaseTime)
                    wEndTime = wBaseTime;
                if (wStartTime > wEndTime)
                    return wResult;

                if (wActive == null)
                    wActive = new List<Int32>();
                if (wModuleID == null)
                    wModuleID = new List<Int32>();

                wActive.RemoveAll(p => p < 0);

                wModuleID.RemoveAll(p => p <= 0);

                String wSQL = StringUtils.Format("SELECT  * FROM {0}.bfc_message t WHERE 1=1 "
                        + " and ( @wCompanyID<= 0 or  t.CompanyID  =@wCompanyID)   "
                        + " and ( @wResponsorID<= 0 or  t.ResponsorID  =@wResponsorID)   "
                        + " and ( @wStationID<= 0 or  t.StationID  =@wStationID)   "
                        + " and ( @wStationNo is null or @wStationNo ='' or  t.StationNo  =  @wStationNo )  "
                        + " and ( @wType<= 0 or  t.Type  =@wType)   " + " and ( @wStepID<= 0 or  t.StepID  =@wStepID)   "
                        + " and ( @wModuleID ='' or  t.ModuleID  IN ({2}))   "
                        + " and ( @wMessageID<= 0 or  t.MessageID  =@wMessageID)   "
                        + " and ( @wActive ='' or  t.Active  IN ({1}) )   "
                        + " and ( @wSendStatus<= 0 or (@wSendStatus & t.SendStatus) = 0 )   "
                        + " and ( @wShiftID <= 0 or  t.ShiftID   = @wShiftID)   "
                        + " and ( @wStartTime <=str_to_date('2010-01-01', '%Y-%m-%d')  or @wStartTime <=  t.EditTime )"
                        + " and ( @wEndTime <=str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >=  t.CreateTime ) ",
                        iPlant.Data.EF.MESDBSource.Basic.getDBName(),
                        wActive.Count > 0 ? StringUtils.Join(",", wActive) : "0",
                        wModuleID.Count > 0 ? StringUtils.Join(",", wModuleID) : "0");

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wCompanyID", wLoginUser.CompanyID);
                wParamMap.Add("wResponsorID", wResponsorID);
                wParamMap.Add("wStationNo", wStationNo);
                wParamMap.Add("wStationID", wStationID);
                wParamMap.Add("wStepID", wStepID);
                wParamMap.Add("wType", wType);
                wParamMap.Add("wModuleID", StringUtils.Join(",", wModuleID));
                wParamMap.Add("wMessageID", wMessageID);
                wParamMap.Add("wSendStatus", wSendStatus);
                wParamMap.Add("wActive", StringUtils.Join(",", wActive));
                wParamMap.Add("wShiftID", wShiftID);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {

                    BFCMessage wBFCMessage = new BFCMessage();
                    wBFCMessage.ID = StringUtils.parseLong(wReader["ID"]);
                    wBFCMessage.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wBFCMessage.CompanyID = StringUtils.parseInt(wReader["CompanyID"]);
                    wBFCMessage.EditTime = StringUtils.parseDate(wReader["EditTime"]);
                    wBFCMessage.MessageID = StringUtils.parseLong(wReader["MessageID"]);
                    wBFCMessage.MessageText = StringUtils.parseString(wReader["MessageText"]);
                    wBFCMessage.StationID = StringUtils.parseLong(wReader["StationID"]);
                    wBFCMessage.StationNo = StringUtils.parseString(wReader["StationNo"]);
                    wBFCMessage.Title = StringUtils.parseString(wReader["Title"]);
                    wBFCMessage.Type = StringUtils.parseInt(wReader["Type"]);
                    wBFCMessage.Active = StringUtils.parseInt(wReader["Active"]);
                    wBFCMessage.ResponsorID = StringUtils.parseInt(wReader["ResponsorID"]);
                    wBFCMessage.ModuleID = StringUtils.parseInt(wReader["ModuleID"]);
                    wBFCMessage.StepID = StringUtils.parseInt(wReader["StepID"]);
                    wBFCMessage.SendStatus = StringUtils.parseInt(wReader["SendStatus"]);
                    wResult.Add(wBFCMessage);

                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<BFCMessage> BFC_GetMessageList(BMSEmployee wLoginUser, int wResponsorID, int wType, List<int> wModuleID,
                int wMessageID, int wStepID, List<int> wActive, int wSendStatus, int wShiftID, DateTime wStartTime,
                DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<BFCMessage> wResult = new List<BFCMessage>();
            try
            {
                wErrorCode.set(0);
                wResult = BFC_GetMessageList(wLoginUser, wResponsorID, 0, "", wType, wModuleID, wMessageID, wStepID,
                        wActive, wSendStatus, wShiftID, wStartTime, wEndTime, wPagination, wErrorCode);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<BFCMessage> BFC_GetMessageList(BMSEmployee wLoginUser, int wResponsorID, int wType, List<int> wModuleID,
                List<Int32> wMessageIDList, List<int> wActive, int wSendStatus, int wShiftID, DateTime wStartTime,
                DateTime wEndTime, int wStepID, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<BFCMessage> wResult = new List<BFCMessage>();
            try
            {
                wErrorCode.set(0);
                wResult = BFC_GetMessageList(wLoginUser, wResponsorID, 0, "", wType, wModuleID, wMessageIDList, wActive,
                        wSendStatus, wShiftID, wStartTime, wEndTime, wStepID, wPagination, wErrorCode);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        /**
         * 查询待办消息
         * 
         * @param wCompanyID
         * @param wResponsorID
         * @param wModuleID
         * @param wShiftID
         * @param wStartTime
         * @param wEndTime
         * @return
         */
        public List<BFCMessage> BFC_GetUndoMessageList(BMSEmployee wLoginUser, int wResponsorID, List<int> wModuleID,
                int wMessageID, int wShiftID, DateTime wStartTime, DateTime wEndTime, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<BFCMessage> wResult = new List<BFCMessage>();
            try
            {
                wErrorCode.set(0);
                wResult = BFC_GetMessageList(wLoginUser, wResponsorID, (int)BFCMessageType.Task, wModuleID,
                        wMessageID, -1, StringUtils.parseListArgs((int)BFCMessageStatus.Default, (int)BFCMessageStatus.Sent, (int)BFCMessageStatus.Read),
                        -1, wShiftID, wStartTime, wEndTime, wPagination,
                        wErrorCode);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<BFCMessage> BFC_GetMessageList(BMSEmployee wLoginUser, int wResponsorID, int wType, List<int> wModuleID ,int wMessageID,
                List<int> wActive, int wSendStatus, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<BFCMessage> wResult = new List<BFCMessage>();
            try
            {
                wErrorCode.set(0);
                DateTime wBaseTime = new DateTime(2000, 1, 1);
                wResult = BFC_GetMessageList(wLoginUser, wResponsorID, wType, wModuleID, wMessageID, -1, wActive, wSendStatus, 0,
                        wBaseTime, wBaseTime, wPagination, wErrorCode);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        /**
         * 查询待办任务数
         * 
         * @param wCompanyID
         * @param wResponsorID
         * @param wShiftID
         * @return
         */
        public Dictionary<Int32, Int32> BFC_GetUndoMessageCount(BMSEmployee wLoginUser, int wResponsorID, int wShiftID,
                OutResult<Int32> wErrorCode)
        {
            Dictionary<Int32, Int32> wResult = new Dictionary<Int32, Int32>();

            try
            {

                DateTime wBaseTime = new DateTime(2000, 1, 1);
                List<BFCMessage> wBFCMessageList = BFC_GetUndoMessageList(wLoginUser, wResponsorID, null, -1, wShiftID,
                        wBaseTime, wBaseTime, Pagination.MaxSize, wErrorCode);

                wResult = wBFCMessageList.GroupBy(p => p.ModuleID).ToDictionary(p => p.Key, p => p.ToList().Count);


            }
            catch (Exception e)
            {

                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public long BFC_UpdateMessage(BMSEmployee wLoginUser, BFCMessage wBFCMessage, OutResult<Int32> wErrorCode)
        {

            long wResult = 0;
            try
            {

                if (wBFCMessage == null)
                    return 0L;
                if (wBFCMessage.Title == null)
                    wBFCMessage.Title = "";
                if (wBFCMessage.MessageText == null)
                    wBFCMessage.MessageText = "";
                if (wBFCMessage.StationNo == null)
                    wBFCMessage.StationNo = "";

                String wSQL = "";
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                if (wBFCMessage.ID <= 0)
                {

                    wSQL = StringUtils.Format(
                            "  INSERT INTO  {0}.bfc_message ( ResponsorID, Type, "
                                    + "MessageText, Title, CreateTime, Active, EditTime, ModuleID, "
                                    + "MessageID, StationID, StationNo, CompanyID, ShiftID,StepID,SendStatus) VALUES "
                                    + "( @wResponsorID , @wType , @wMessageText , "
                                    + "@wTitle , now() , 0 ,  now() , @wModuleID , @wMessageID , "
                                    + "@wStationID , @wStationNo , @wCompanyID , @wShiftID,@wStepID,@wSendStatus );",
                            iPlant.Data.EF.MESDBSource.Basic.getDBName());
                    if (wBFCMessage.ShiftID <= 0)
                        wBFCMessage.ShiftID = MESServer.MES_QueryShiftID(0, 0, DateTime.Now, APSShiftPeriod.Day,
                                0);
                }
                else
                {
                    wSQL = StringUtils.Format(
                            "UPDATE {0}.bfc_message SET    EditTime = now() , Active = @wActive,SendStatus=@wSendStatus"
                                    + "  WHERE ID>0  and Active != @wActiveF   and  @wID =ID  ;",
                           iPlant.Data.EF.MESDBSource.Basic.getDBName());
                }

                wSQL = this.DMLChange(wSQL);
                wParamMap.Clear();

                if (wBFCMessage.SendStatus == 0b111 && wBFCMessage.Active < (int)BFCMessageStatus.Sent)
                {
                    wBFCMessage.Active = (int)BFCMessageStatus.Sent;
                }
                wParamMap.Add("wID", wBFCMessage.ID);
                wParamMap.Add("wResponsorID", wBFCMessage.ResponsorID);
                wParamMap.Add("wType", wBFCMessage.Type);
                wParamMap.Add("wMessageText", wBFCMessage.MessageText);
                wParamMap.Add("wTitle", wBFCMessage.Title);
                wParamMap.Add("wModuleID", wBFCMessage.ModuleID);
                wParamMap.Add("wMessageID", wBFCMessage.MessageID);
                wParamMap.Add("wStationID", wBFCMessage.StationID);
                wParamMap.Add("wStationNo", wBFCMessage.StationNo);
                wParamMap.Add("wCompanyID", wBFCMessage.CompanyID);
                wParamMap.Add("wShiftID", wBFCMessage.ShiftID);
                wParamMap.Add("wActive", wBFCMessage.Active);
                wParamMap.Add("wActiveF", (int)BFCMessageStatus.Finished);
                wParamMap.Add("wStepID", wBFCMessage.StepID);
                wParamMap.Add("wSendStatus", wBFCMessage.SendStatus);




                if (wBFCMessage.ID <= 0)
                {
                    wResult = (int)mDBPool.insert(wSQL, wParamMap);
                    wBFCMessage.ID = wResult;
                }
                else
                {
                    mDBPool.update(wSQL, wParamMap);
                    wResult = wBFCMessage.ID;
                }

                if (wBFCMessage.Active == 0 && (wBFCMessage.SendStatus & 0b001) < 0)
                {
                    BMSEmployee wBMSEmployee = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeByID(wLoginUser, wBFCMessage.ResponsorID, wErrorCode);
                    if (wBMSEmployee == null || wBMSEmployee.ID <= 0 || StringUtils.isEmpty(wBMSEmployee.LoginID))
                        return wResult;
                    // 推送到中台
                    this.BFC_SendMessageList(wLoginUser, wBFCMessage, new List<String> { wBMSEmployee.LoginID }, wErrorCode);

                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public void BFC_InsertMessage(BMSEmployee wLoginUser, BFCMessage wBFCMessage, Dictionary<int, String> wUserDic, OutResult<Int32> wErrorCode)
        {
            try
            {

                if (wBFCMessage == null || wUserDic == null || wUserDic.Count <= 0)
                    return;
                if (wBFCMessage.Title == null)
                    wBFCMessage.Title = "";
                if (wBFCMessage.MessageText == null)
                    wBFCMessage.MessageText = "";
                if (wBFCMessage.StationNo == null)
                    wBFCMessage.StationNo = "";


                if (wBFCMessage.ShiftID <= 0)
                    wBFCMessage.ShiftID = MESServer.MES_QueryShiftID(0, 0, DateTime.Now, APSShiftPeriod.Day,
                            0);

                if (wBFCMessage.SendStatus == 0b111 && wBFCMessage.Active < (int)BFCMessageStatus.Sent)
                {
                    wBFCMessage.Active = (int)BFCMessageStatus.Sent;
                }



                StringBuilder wSB = new StringBuilder(StringUtils.Format(
                            "  INSERT INTO  {0}.bfc_message ( ResponsorID, Type, "
                                    + "MessageText, Title, CreateTime, Active, EditTime, ModuleID, "
                                    + "MessageID, StationID, StationNo, CompanyID, ShiftID,StepID,SendStatus) VALUES ", MESDBSource.Basic.getDBName()));

                int wIndex = 0;
                foreach (int wUserID in wUserDic.Keys)
                {
                    if (wIndex == 0)
                    {
                        wSB.AppendFormat(" ({0},{1},'{2}','{3}',now(),0,now(),{4},{5},{6},'{7}',{8},{9},{10},{11}) ", wUserID,
                            wBFCMessage.Type, wBFCMessage.MessageText, wBFCMessage.Title, wBFCMessage.ModuleID, wBFCMessage.MessageID,
                            wBFCMessage.StationID, wBFCMessage.StationNo, wBFCMessage.CompanyID, wBFCMessage.ShiftID, wBFCMessage.StepID, wBFCMessage.SendStatus);
                    }
                    else
                    {
                        wSB.AppendFormat(",({0},{1},'{2}','{3}',now(),0,now(),{4},{5},{6},'{7}',{8},{9},{10},{11})", wUserID,
                            wBFCMessage.Type, wBFCMessage.MessageText, wBFCMessage.Title, wBFCMessage.ModuleID, wBFCMessage.MessageID,
                            wBFCMessage.StationID, wBFCMessage.StationNo, wBFCMessage.CompanyID, wBFCMessage.ShiftID, wBFCMessage.StepID, wBFCMessage.SendStatus);
                    }
                    wIndex++;
                }



                String wSQL = wSB.ToString();

                wSQL = this.DMLChange(wSQL);

                mDBPool.update(wSQL, null);

                if (wBFCMessage.Active == 0 && (wBFCMessage.SendStatus & 0b001) < 0)
                {
                    // 推送到中台
                    this.BFC_SendMessageList(wLoginUser, wBFCMessage, wUserDic.Values.ToList(), wErrorCode);

                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }

        }

        public void BFC_ReceiveMessage(BMSEmployee wLoginUser, int wResponsorID, List<long> wMsgIDList,
                List<Int32> wStepID, int wModuleID, OutResult<Int32> wErrorCode)
        {

            try
            {
                this.BFC_HandleMessage(wLoginUser, wResponsorID, wMsgIDList, wStepID, wModuleID,
                        (int)BFCMessageType.Default, (int)BFCMessageStatus.Read, wErrorCode);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        /**
         * 
         * @param wCompanyID
         * @param wResponsorID 处理人 可以为空
         * @param wMsgIDList
         * @param wModuleID
         * @param wType
         * @param wStatus
         */
        public void BFC_HandleMessage(BMSEmployee wLoginUser, int wResponsorID, List<long> wMsgIDList,
                List<Int32> wStepID, int wModuleID, int wType, int wStatus, OutResult<Int32> wErrorCode)
        {
            try
            {

                if (wMsgIDList == null || wMsgIDList.Count < 1)
                    return;
                if (wModuleID < 0)
                    return;
                if (wStatus <= 0)
                    return;

                if (wStepID == null)
                    wStepID = new List<Int32>();

                String wSQL = "";
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                // 判断是否存在
                wSQL = StringUtils.Format(
                        "UPDATE {0}.bfc_message SET  EditTime = now() , Active = @wActive  WHERE ID>0"
                                + "  AND   ( Active < @wActive or @wActive >= @wActiveF  ) and   Active != @wActiveF "
                                + " and  ModuleID =@wModuleID and CompanyID=@wCompanyID and ( @wType<=0 or Type=@wType)"
                                + "	and ( @wStepID =''  or  StepID IN ({1}) ) "
                                + " and ( @wResponsorID<=0 or ResponsorID=@wResponsorID) and  MessageID  IN( {2} )  ;",
                       iPlant.Data.EF.MESDBSource.Basic.getDBName(), wStepID.Count > 0 ? StringUtils.Join(",", wStepID) : "0",
                        StringUtils.Join(",", wMsgIDList));

                wSQL = this.DMLChange(wSQL);
                wParamMap.Add("wResponsorID", wResponsorID);
                wParamMap.Add("wModuleID", wModuleID);
                wParamMap.Add("wCompanyID", wLoginUser.CompanyID);
                wParamMap.Add("wActiveF", (int)BFCMessageStatus.Finished);
                wParamMap.Add("wActive", wStatus);
                wParamMap.Add("wType", wType);
                wParamMap.Add("wStepID", StringUtils.Join(",", wStepID));

                mDBPool.update(wSQL, wParamMap);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        /**
         * 
         * @param wCompanyID
         * @param wResponsorID 处理人 可以为空
         * @param wMsgIDList
         * @param wModuleID
         * @param wType
         * @param wStatus
         */
        public void BFC_ForwardMessage(BMSEmployee wLoginUser, int wResponsorID, List<Int32> wForwarderList,
                int wModuleID, int wMessageID, int wStepID, OutResult<Int32> wErrorCode)
        {

            try
            {

                if (wForwarderList == null || wForwarderList.Count < 1)
                    return;
                if (wModuleID < 0)
                    return;
                if (wStepID <= 0)
                    return;
                if (wMessageID <= 0)
                    return;
                if (wResponsorID <= 0)
                    return;

                BMSEmployee wResponsor = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeByID(wLoginUser, wResponsorID, wErrorCode);

                //获取此任务转发人在此步骤最后一条代办消息
                List<BFCMessage> wBFCMessageList = this.BFC_GetMessageList(wLoginUser, wResponsorID, -1, "",
                        (int)BFCMessageType.Task, StringUtils.parseListArgs(wModuleID), wMessageID, wStepID, null, -1, -1,
                        new DateTime(2000, 1, 1), new DateTime(2000, 1, 1), Pagination.Default, wErrorCode);

                if (wBFCMessageList.Count <= 0)
                    return;

                BFCMessage wBFCMessage = wBFCMessageList[wBFCMessageList.Count - 1];

                wBFCMessage.Active = (int)BFCMessageStatus.Finished;

                BFCMessage wBFCMessageF = null;
                foreach (Int32 wForwarder in wForwarderList)
                {
                    wBFCMessageF = CloneTool.Clone<BFCMessage>(wBFCMessage);
                    wBFCMessageF.ID = 0;
                    wBFCMessageF.Active = (int)BFCMessageStatus.Default;
                    wBFCMessageF.MessageText += StringUtils.Format("\n 转发人：{0}",
                            wResponsor.Name);
                    wBFCMessageF.ResponsorID = wForwarder;

                    this.BFC_UpdateMessage(wLoginUser, wBFCMessageF, wErrorCode);

                }

                this.BFC_UpdateMessage(wLoginUser, wBFCMessage, wErrorCode);


            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        /**
         * 
         * @param wCompanyID
         * @param wResponsorID 处理人 可以为空
         * @param wMsgIDList
         * @param wModuleID
         * @param wType
         * @param wStatus
         */
        public void BFC_HandleMessageByIDList(BMSEmployee wLoginUser, List<long> wMsgIDList, int wStatus, int wSendStatus,
                OutResult<Int32> wErrorCode)
        {

            try
            {

                if (wMsgIDList == null || wMsgIDList.Count < 1)
                    return;
                wMsgIDList.RemoveAll(p => p <= 0);

                if (wMsgIDList.Count < 1)
                    return;

                if (wStatus <= 0)
                    return;

                String wSQL = "";
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                if (wStatus == (int)BFCMessageStatus.Sent)
                {
                    wSQL = StringUtils.Format(
                            "UPDATE {0}.bfc_message SET  EditTime = now() , "
                                    + " SendStatus= @wSendStatus|SendStatus WHERE ID>0  and ID  IN( {1} )  ;",
                           iPlant.Data.EF.MESDBSource.Basic.getDBName(), StringUtils.Join(",", wMsgIDList));
                    wParamMap.Add("wSendStatus", wSendStatus);
                    mDBPool.update(wSQL, wParamMap);

                    wSQL = StringUtils.Format(
                            "UPDATE {0}.bfc_message SET  EditTime = now() , "
                                    + " Active= @wActive  WHERE ID>0 and Active=0 and SendStatus=@wSendStatus    ;",
                            iPlant.Data.EF.MESDBSource.Basic.getDBName(), StringUtils.Join(",", wMsgIDList));
                    wSendStatus = 0b111;

                    wParamMap.Clear();
                    wParamMap.Add("wSendStatus", wSendStatus);
                    wParamMap.Add("wActive", (int)BFCMessageStatus.Sent);
                }
                else
                {
                    // 判断是否存在
                    wSQL = StringUtils.Format(
                            "UPDATE {0}.bfc_message SET  EditTime = now() , Active = @wActive "
                                    + "  WHERE  ID>0 AND Active < @wActive and   Active != @wActiveF and ID  IN( {1} )  ;",
                            iPlant.Data.EF.MESDBSource.Basic.getDBName(), StringUtils.Join(",", wMsgIDList));
                    wParamMap.Add("wActive", wStatus);
                    wParamMap.Add("wActiveF", (int)BFCMessageStatus.Finished);
                }

                wSQL = this.DMLChange(wSQL);

                mDBPool.update(wSQL, wParamMap);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public void BFC_HandleTaskMessage(BMSEmployee wLoginUser, int wResponsorID, List<Int32> wMessageIDList,
                int wModuleID, int wStepID, int wStatus, int wAuto, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {

                if (wMessageIDList == null || wMessageIDList.Count < 1)
                    return;
                if (wModuleID < 0)
                    return;
                if (wStatus <= 0)
                    return;

                String wSQL = "";
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                // 判断是否存在
                if (wStatus == (int)BFCMessageStatus.Finished && wAuto > 0
                        && (wResponsorID > 0 || wResponsorID == BaseDAO.SysAdmin.ID))
                {

                    wSQL = StringUtils.Format(
                            "UPDATE {0}.bfc_message SET  EditTime = now() , Active = @wActiveC  WHERE ID>0 "
                                    + " and  ModuleID =@wModuleID  AND  StepID =@wStepID   and( @wType<=0 or Type=@wType) "
                                    + " and  ResponsorID !=@wResponsorID and CompanyID=@wCompanyID "
                                    + " and   MessageID IN ( {1} ) and   Active != @wActiveF  and Active IN ({2})  ;",
                            iPlant.Data.EF.MESDBSource.Basic.getDBName(), StringUtils.Join(",", wMessageIDList),
                            StringUtils.Join(",", (int)BFCMessageStatus.Default,
                                (int)BFCMessageStatus.Read, (int)BFCMessageStatus.Sent));

                    wParamMap.Add("wResponsorID", wResponsorID);
                    wParamMap.Add("wModuleID", wModuleID);
                    wParamMap.Add("wCompanyID", wLoginUser.CompanyID);
                    wParamMap.Add("wActiveC", (int)BFCMessageStatus.Close);
                    wParamMap.Add("wActiveF", (int)BFCMessageStatus.Finished);
                    wParamMap.Add("wType", (int)BFCMessageType.Task);
                    wParamMap.Add("wStepID", wStepID);
                    wSQL = this.DMLChange(wSQL);
                    mDBPool.update(wSQL, wParamMap);

                    wSQL = StringUtils.Format(
                            "UPDATE {0}.bfc_message SET  EditTime = now() , Active = @wActive  WHERE ID>0 "
                                    + " and  ModuleID =@wModuleID  AND  StepID =@wStepID and( @wType<=0 or Type=@wType) "
                                    + " and CompanyID=@wCompanyID and  ResponsorID =@wResponsorID "
                                    + " and  MessageID  IN( {1} ) and Active != @wActiveF  and Active IN ({2}) ;",
                            iPlant.Data.EF.MESDBSource.Basic.getDBName(), StringUtils.Join(",", wMessageIDList),
                            StringUtils.Join(",", (int)BFCMessageStatus.Default,
                               (int)BFCMessageStatus.Read, (int)BFCMessageStatus.Sent));

                }
                else
                {
                    wSQL = StringUtils.Format(
                            "UPDATE {0}.bfc_message SET  EditTime = now() , Active = @wActive  WHERE ID>0 "
                                    + " and ModuleID =@wModuleID  AND  StepID =@wStepID  and (@wType<=0 or Type=@wType) "
                                    + " and CompanyID=@wCompanyID and (@wResponsorID<=0 or ResponsorID=@wResponsorID) "
                                    + " and MessageID  IN( {1} )  and Active != @wActiveF  and Active IN ({2}) ;",
                           iPlant.Data.EF.MESDBSource.Basic.getDBName(), StringUtils.Join(",", wMessageIDList),
                            StringUtils.Join(",", (int)BFCMessageStatus.Default,
                                (int)BFCMessageStatus.Read, (int)BFCMessageStatus.Sent));

                }

                wSQL = this.DMLChange(wSQL);
                wParamMap.Clear();
                wParamMap.Add("wResponsorID", wResponsorID);
                wParamMap.Add("wStepID", wStepID);
                wParamMap.Add("wModuleID", wModuleID);
                wParamMap.Add("wCompanyID", wLoginUser.CompanyID);
                wParamMap.Add("wActive", wStatus);
                wParamMap.Add("wActiveF", (int)BFCMessageStatus.Finished);
                wParamMap.Add("wType", (int)BFCMessageType.Task);

                mDBPool.update(wSQL, wParamMap);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public void BFC_CloseTask(BMSEmployee wLoginUser, int wUserID, int wTaskID, int wModuleID,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {

                if (wModuleID < 0)
                    return;
                if (wTaskID <= 0)
                    return;

                String wSQL = "";
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                // 判断是否存在
                wSQL = StringUtils.Format("UPDATE {0}.bfc_message SET  EditTime = now() , Active = @wActive  WHERE ID>0 "
                        + " and  ModuleID =@wModuleID  and Type=@wType and MessageID=@wMessageID  and Active IN ({1})"
                        + " and CompanyID=@wCompanyID AND ResponsorID!=@wResponsorID ;", iPlant.Data.EF.MESDBSource.Basic.getDBName(),
                        StringUtils.Join(",", (int)BFCMessageStatus.Default,
                            (int)BFCMessageStatus.Read, (int)BFCMessageStatus.Sent));

                wSQL = this.DMLChange(wSQL);
                wParamMap.Add("wModuleID", wModuleID);
                wParamMap.Add("wCompanyID", wLoginUser.CompanyID);
                wParamMap.Add("wActive", (int)BFCMessageStatus.Close);
                wParamMap.Add("wMessageID", wTaskID);
                wParamMap.Add("wResponsorID", wUserID);
                wParamMap.Add("wType", (int)BFCMessageType.Task);

                mDBPool.update(wSQL, wParamMap);

                wSQL = StringUtils.Format("UPDATE {0}.bfc_message SET  EditTime = now() , Active = @wActive  WHERE ID>0 "
                        + " and  ModuleID =@wModuleID  and Type=@wType and MessageID=@wMessageID  and Active IN ({1})"
                        + " and CompanyID=@wCompanyID AND ResponsorID = @wResponsorID ;", iPlant.Data.EF.MESDBSource.Basic.getDBName(),
                        StringUtils.Join(",", (int)BFCMessageStatus.Default,
                            (int)BFCMessageStatus.Read, (int)BFCMessageStatus.Sent));
                wParamMap.Add("wActive", (int)BFCMessageStatus.Finished);

                mDBPool.update(wSQL, wParamMap);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public void BFC_SendMessageList(BMSEmployee wLoginUser, BFCMessage wBFCMessage, List<String> wUserLoginIDList, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {

                BMSEmployee wBMSEmployee = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeByID(wLoginUser, (int)wBFCMessage.ResponsorID, wErrorCode);

                if (wUserLoginIDList == null || wUserLoginIDList.Count <= 0)
                    return;

                if (ExternalMsgLocal > 0)
                {
                    logger.Debug(
                            StringUtils.Format("SendMessageToExternal Define ExternalMsgLocal :{0}", ExternalMsgLocal));
                    return;
                }

                if (wErrorCode.Result != 0 || wBMSEmployee == null || wBMSEmployee.ID <= 0)
                {
                    logger.Info(StringUtils.Format("SendMessageToExternal info : ResponsorID={0} not found !!!",
                            wBFCMessage.ResponsorID));
                    return;
                }
                Dictionary<String, Object> wCustom = new Dictionary<String, Object>();
                wCustom.Add("type", ExternalMsgType);
                wCustom.Add("insideAppName", ExternalMsgInsideAPPName);

                Dictionary<String, Object> wParams = new Dictionary<String, Object>();

                wParams.Add("appName", ExternalMsgAPPName);
                wParams.Add("custom", wCustom);
                wParams.Add("param", "");
                wParams.Add("userAccountList", StringUtils.Join("", wUserLoginIDList));
                wParams.Add("sender", "");
                wParams.Add("title", wBFCMessage.Title);
                wParams.Add("content", wBFCMessage.MessageText);

                String wResultString = RemoteInvokeUtils.getInstance().HttpInvokeString(ExternalMsgUrl, wParams,
                        HttpMethod.Post);

                logger.Info("SendMessageToExternal Result  : " + wResultString);




                Dictionary<String, Object> wResult = StringUtils.isEmpty(wResultString) ? new Dictionary<String, Object>()
                        : JsonTool.JsonToObject<Dictionary<String, Object>>(wResultString);

                if (wResult == null || !wResult.ContainsKey("status"))
                {
                    return;
                }

                if (StringUtils.parseInt(wResult["status"]) == 1)
                {

                    wBFCMessage.SendStatus = wBFCMessage.SendStatus | 0b1;
                    BFC_UpdateMessage(wLoginUser, wBFCMessage, wErrorCode);

                    return;
                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        private static int ExternalMsgLocal = StringUtils
                .parseInt(GlobalConstant.GlobalConfiguration.GetValue("Msg.External.Local"));

        private static String ExternalMsgUrl = GlobalConstant.GlobalConfiguration.GetValue("Msg.External.Url");

        private static String ExternalMsgAPPName = GlobalConstant.GlobalConfiguration.GetValue("Msg.External.AppName");


        private static String ExternalMsgInsideAPPName = GlobalConstant.GlobalConfiguration.GetValue("Msg.External.InsideAppName");


        private static String ExternalMsgType = GlobalConstant.GlobalConfiguration.GetValue("Msg.External.Type");

        private BFCMessageDAO() : base()
        {

        }

        public static BFCMessageDAO getInstance()
        {
            if (Instance == null)
                Instance = new BFCMessageDAO();
            return Instance;
        }

    }
}
