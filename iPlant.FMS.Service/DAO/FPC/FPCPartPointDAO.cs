using iPlant.Common.Tools;
using iPlant.Data.EF.Repository;
using iPlant.FMS.Models;
using iPlant.Data.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class FPCPartPointDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FPCPartPointDAO));

        private static FPCPartPointDAO Instance = null;

        private FPCPartPointDAO() : base()
        {
        }

        public static FPCPartPointDAO getInstance()
        {
            if (Instance == null)
                Instance = new FPCPartPointDAO();
            return Instance;
        }

        // 标准工步
        private FPCPartPoint FPC_CheckPartPointByCode(BMSEmployee wLoginUser, FPCPartPoint wPartPoint,
                OutResult<Int32> wErrorCode)
        {
            FPCPartPoint wPartPointDB = new FPCPartPoint();
            wErrorCode.set(0);

            try
            {
                String wInstance = MESDBSource.Basic.getDBName();


                if (wErrorCode.Result == 0)
                {
                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = StringUtils.Format("Select * from {0}.fpc_partpoint ", wInstance)
                            + " where ID!=@ID and  ((Name=@Name and WorkShopID=@WorkShopID"
                            + " and LineID=@LineID AND PartID=@PartID) or Code=@Code )  ";
                    wParms.Clear();
                    wParms.Add("ID", wPartPoint.ID);
                    wParms.Add("Code", wPartPoint.Code);
                    wParms.Add("Name", wPartPoint.Name);
                    wParms.Add("WorkShopID", wPartPoint.WorkShopID);
                    wParms.Add("LineID", wPartPoint.LineID);
                    wParms.Add("PartID", wPartPoint.PartID);

                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wPartPointDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wPartPointDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wPartPointDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                        wPartPointDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
                        wPartPointDB.PartID = StringUtils.parseInt(wSqlDataReader["PartID"]);
                        wPartPointDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
                        wPartPointDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wPartPointDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wPartPointDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wPartPointDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wPartPointDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                    }

                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wPartPointDB;
        }

        public void FPC_UpdatePartPoint(BMSEmployee wLoginUser, FPCPartPoint wPartPoint, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {

                if (wPartPoint == null || StringUtils.isEmpty(wPartPoint.Code) || StringUtils.isEmpty(wPartPoint.Name))
                {
                    wErrorCode.Result = MESException.Parameter.getValue();
                    return;
                }

                String wInstance = MESDBSource.Basic.getDBName();



                FPCPartPoint wPartPointDB = this.FPC_CheckPartPointByCode(wLoginUser, wPartPoint, wErrorCode);
                if (wPartPointDB.ID > 0)
                {
                    if (wPartPoint.ID > 0)
                    {
                        wErrorCode.set(MESException.Duplication.getValue()); 
                        return;
                    }

                    wPartPoint.ID = wPartPointDB.ID;
                }

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                wParms.Add("Name", wPartPoint.Name);
                wParms.Add("Code", wPartPoint.Code);
                wParms.Add("Active", wPartPoint.Active);

                wParms.Add("WorkShopID", wPartPoint.WorkShopID);
                wParms.Add("LineID", wPartPoint.LineID);
                wParms.Add("PartID", wPartPoint.PartID);

                wParms.Add("OperateContent", wPartPoint.OperateContent);
                wParms.Add("StepType", wPartPoint.StepType);

                wParms.Add("QTType", wPartPoint.QTType);

                wParms.Add("ERPID", wPartPoint.ERPID); ;
                wParms.Add("Description", wPartPoint.Description);

                wParms.Add("EditorID", wLoginUser.ID);
                wParms.Add("EditTime", DateTime.Now);

                if (wPartPoint.ID <= 0 || wPartPoint.LineID!= wPartPointDB.LineID)
                {
                    wParms.Add("CreatorID", wLoginUser.ID);
                    wParms.Add("CreateTime", DateTime.Now);
                    wPartPoint.ID = this.Insert(StringUtils.Format("{0}.fpc_partpoint", wInstance), wParms);

                }
                else
                {
                    wParms.Add("ID", wPartPoint.ID);
                    this.Update(StringUtils.Format("{0}.fpc_partpoint", wInstance), "ID", wParms);
                }

                //FMCLineUnitDAO.getInstance().FMC_SyncLineUnit(wLoginUser, wPartPoint, wErrorCode);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }


        public void FPC_ActivePartPoint(BMSEmployee wLoginUser, List<int> wPartPointIDList, int wActive,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                if (wPartPointIDList == null || wPartPointIDList.Count <= 0)
                    return;


                if (wActive != 1)
                    wActive = 2;

                String wInstance = MESDBSource.Basic.getDBName();
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                String wSQLText = "";

                wSQLText = StringUtils.Format("update {0}.fpc_partpoint set EditorID=@EditorID,EditTime=now(),Active=@Active" +
                    " where ID IN ({1}) ", wInstance, StringUtils.Join(",", wPartPointIDList));
                wParms.Clear();

                wParms.Add("Active", wActive);
                wParms.Add("EditorID", wLoginUser.ID);
                wSQLText = this.DMLChange(wSQLText);

                //FMCLineUnitDAO.getInstance().FMC_SyncLineUnit(wLoginUser, wPartPoint, wErrorCode);

                mDBPool.update(wSQLText, wParms);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public void FPC_DeletePartPoint(BMSEmployee wLoginUser, FPCPartPoint wPartPoint,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                if (wPartPoint == null || wPartPoint.ID <= 0 || StringUtils.isEmpty(wPartPoint.Code) || StringUtils.isEmpty(wPartPoint.Name))
                {
                    wErrorCode.Result = MESException.Parameter.getValue();
                    return;
                }
                String wInstance = MESDBSource.Basic.getDBName();

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                wParms.Add("ID", wPartPoint.ID);
                wParms.Add("Active", 0);
                this.Delete(StringUtils.Format("{0}.fpc_partpoint", wInstance), wParms);

                //FMCLineUnitDAO.getInstance().FMC_DeleteLineUnitByUnitID(wLoginUser, wPartPoint.LineID, 0, 0,
                //        wPartPoint.ID, wPartPoint.PartID, ((int)APSUnitLevel.Step), wErrorCode);


            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }


        public FPCPartPoint FPC_GetPartPoint(BMSEmployee wLoginUser, int wID, String wCode,
                OutResult<Int32> wErrorCode)
        {
            FPCPartPoint wPartPointDB = new FPCPartPoint();
            wErrorCode.set(0);

            try
            {

                if (wCode == null)
                    wCode = "";
                if (StringUtils.isEmpty(wCode) && wID <= 0)
                {
                    wErrorCode.set(MESException.Parameter.getValue());
                    return wPartPointDB;
                }

                List<FPCPartPoint> wPartPointList = this.FPC_QueryPartPointList(wLoginUser, wID, wCode, -1, -1, -1, -1,
                       -1, -1, Pagination.Default, wErrorCode);
                if (wPartPointList == null || wPartPointList.Count <= 0)
                    return wPartPointDB;

                wPartPointDB = wPartPointList[0];
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wPartPointDB;
        }

        public List<FPCPartPoint> FPC_GetPartPointList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID, int wPartID, int wStepType,
                int wQTType, int wActive, Pagination wPagination,
                OutResult<Int32> wErrorCode)
        {
            List<FPCPartPoint> wPartPointList = new List<FPCPartPoint>();
            wErrorCode.set(0);

            try
            {
                wPartPointList = this.FPC_QueryPartPointList(wLoginUser, -1, "", wWorkShopID, wLineID, wPartID, wStepType, wQTType, wActive, wPagination, wErrorCode);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wPartPointList;
        }

        private List<FPCPartPoint> FPC_QueryPartPointList(BMSEmployee wLoginUser, int wID, String wCode, int wWorkShopID, int wLineID, int wPartID, int wStepType,
                int wQTType, int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<FPCPartPoint> wPartPointList = new List<FPCPartPoint>();
            wErrorCode.set(0);

            try
            {
                String wInstance = MESDBSource.Basic.getDBName();

                if (wCode == null)
                    wCode = "";


                // Step0:查询
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                String wSQLText = "";
                wSQLText = StringUtils.Format(
                        "Select t.*,t1.Name as WorkShopName,t2.Name as LineName,t3.Name as PartName," +
                            " t4.Name as CreatorName,t5.Name as EditorName  from {0}.fpc_partpoint t "
                                + " Left join  {0}.fmc_workshop t1  on t.WorkShopID=t1.ID  "
                                + " Left join  {0}.fmc_line t2  on t.LineID=t2.ID  "
                                + " Left join  {0}.fpc_part t3  on t.PartID=t3.ID  "
                                + " Left join  {0}.mbs_user t4  on t.CreatorID=t4.ID  "
                                + " Left join  {0}.mbs_user t5  on t.EditorID=t5.ID  "
                                + " where t.ID > 0  AND ( @ID <=0 OR t.ID = @ID )"
                                + " and ( @WorkShopID <=0 OR t.WorkShopID = @WorkShopID )"
                                + " and ( @LineID <=0 OR t.LineID = @LineID )"
                                + " and ( @PartID <=0 OR t.PartID = @PartID )"
                                + " and ( @QTType <=0 OR t.QTType = @QTType )"
                                + " and ( @StepType <= 0 OR t.StepType = @StepType )"
                                + " and ( @Active <0 OR t.Active = @Active )"
                                + " AND ( @Code='' OR t.Code=@Code)",
                         wInstance);
                wParms.Clear();
                wSQLText = this.DMLChange(wSQLText);

                wParms.Add("ID", wID);
                wParms.Add("Code", wCode);
                wParms.Add("WorkShopID", wWorkShopID);
                wParms.Add("LineID", wLineID);
                wParms.Add("PartID", wPartID);
                wParms.Add("StepType", wStepType);
                wParms.Add("QTType", wQTType);
                wParms.Add("Active", wActive);
                wSQLText = this.DMLChange(wSQLText);

                List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms, wPagination);

                foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                {
                    FPCPartPoint wPartPointDB = new FPCPartPoint();
                    wPartPointDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    wPartPointDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                    wPartPointDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);

                    wPartPointDB.WorkShopID = StringUtils.parseInt(wSqlDataReader["WorkShopID"]);
                    wPartPointDB.WorkShopName = StringUtils.parseString(wSqlDataReader["WorkShopName"]);
                    wPartPointDB.LineID = StringUtils.parseInt(wSqlDataReader["LineID"]);
                    wPartPointDB.LineName = StringUtils.parseString(wSqlDataReader["LineName"]);
                    wPartPointDB.PartID = StringUtils.parseInt(wSqlDataReader["PartID"]);
                    wPartPointDB.PartName = StringUtils.parseString(wSqlDataReader["PartName"]);

                    wPartPointDB.OperateContent = StringUtils.parseString(wSqlDataReader["OperateContent"]);

                    wPartPointDB.StepType = StringUtils.parseInt(wSqlDataReader["StepType"]);
                    wPartPointDB.QTType = StringUtils.parseInt(wSqlDataReader["QTType"]);
                    wPartPointDB.ERPID = StringUtils.parseInt(wSqlDataReader["ERPID"]);

                    wPartPointDB.Description = StringUtils.parseString(wSqlDataReader["Description"]);

                    wPartPointDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                    wPartPointDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                    wPartPointDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                    wPartPointDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                    wPartPointDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);

                    wPartPointList.Add(wPartPointDB);
                }


            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wPartPointList;
        }



    }
}
