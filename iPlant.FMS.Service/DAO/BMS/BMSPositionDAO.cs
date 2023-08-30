using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class BMSPositionDAO : BaseDAO
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(BMSPositionDAO));
        private static BMSPositionDAO Instance = null;

        private BMSPositionDAO() : base()
        {

        }

        public static BMSPositionDAO getInstance()
        {
            if (Instance == null)
                Instance = new BMSPositionDAO();
            return Instance;
        }

        private BMSPosition BMS_CheckPositionName(BMSEmployee wLoginUser, int wID, int wParentID, String wName,
                OutResult<Int32> wErrorCode)
        {
            BMSPosition wPosition = new BMSPosition();
            wErrorCode.set(0);
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";
                    if (wID > 0)
                    {
                        wSQLText = StringUtils.Format(
                                "Select * from {0}.bms_position where ID!=@ID and Name=@Name and ParentID=@ParentID;",
                                wInstance);

                    }
                    else
                    {
                        wSQLText = StringUtils.Format(
                                "Select * from {0}.bms_position where Name=@Name and ParentID=@ParentID;",
                                wInstance);

                    }
                    wParms.Add("ID", wID);
                    wParms.Add("Name", wName);
                    wParms.Add("ParentID", wParentID);
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wPosition.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wPosition.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wPosition.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                        wPosition.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wPosition.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wPosition.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
                        wPosition.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wPosition.ParentID = StringUtils.parseInt(wSqlDataReader["ParentID"]);
                        wPosition.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wPosition.DutyID = StringUtils.parseInt(wSqlDataReader["DutyID"]);

                        if (StringUtils.isEmpty(wPosition.Code))
                        {
                            wPosition.Code = StringUtils.Format("GW{0}", String.Format("{0:D7}", wPosition.ID));
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("BMS_CheckPositionName", ex);
            }
            return wPosition;
        }

        public int BMS_AddPosition(BMSEmployee wLoginUser, BMSPosition wPosition, OutResult<Int32> wErrorCode)
        {
            int wID = 0;
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result == 0)
                {
                    BMSPosition wPositionO = this.BMS_CheckPositionName(wLoginUser, 0, wPosition.ParentID, wPosition.Name,
                            wErrorCode);
                    if (wPosition.Name.Length < 1 || wPositionO.ID > 0)
                        wErrorCode.set(MESException.Logic.Value);
                }

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                    String wSQLText = "";

                    if (wPosition.ID <= 0)
                    {
                        wSQLText = StringUtils.Format("Insert Into {0}.bms_position", wInstance)
                                + "(Name,OperatorID,EditTime,Active,DepartmentID,DutyID,ParentID) "
                                + " Values(@Name,@OperatorID,@EditTime,@Active,@DepartmentID,@DutyID,@ParentID);";
                    }
                    else
                    {
                        wSQLText = StringUtils.Format("Insert Into {0}.bms_position", wInstance)
                                + "(ID,Name,OperatorID,EditTime,Active,DepartmentID,DutyID,ParentID) "
                                + " Values(@ID,@Name,@OperatorID,@EditTime,@Active,@DepartmentID,@DutyID,@ParentID);";
                    }

                    wParms.Clear();

                    wParms.Add("ID", wPosition.ID);
                    wParms.Add("Name", wPosition.Name);
                    wParms.Add("OperatorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wParms.Add("Active", wPosition.Active);
                    wParms.Add("DepartmentID", wPosition.DepartmentID);
                    wParms.Add("DutyID", wPosition.DutyID);
                    wParms.Add("ParentID", wPosition.ParentID);
                    wSQLText = this.DMLChange(wSQLText);
                    if (wPosition.ID <= 0)
                    {
                        wPosition.ID = (int)mDBPool.insert(wSQLText, wParms);

                    }
                    else
                    {
                        mDBPool.update(wSQLText, wParms);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error("BMS_AddPosition", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wID;
        }

        public int BMS_SavePosition(BMSEmployee wLoginUser, BMSPosition wPosition, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result == 0)
                {
                    BMSPosition wPositionO = this.BMS_CheckPositionName(wLoginUser, wPosition.ID, wPosition.ParentID,
                            wPosition.Name, wErrorCode);
                    if (wPosition.Name.Length < 1 || wPositionO.ID > 0)
                        wErrorCode.set(MESException.Logic.Value);
                }

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = StringUtils.Format("Update {0}.bms_position", wInstance)
                            + " Set Name=@Name,Code=@Code,OperatorID=@OperatorID,DepartmentID=@DepartmentID,"
                            + "EditTime=@EditTime,ParentID=@ParentID,DutyID=@DutyID where ID=@ID and Active=0;";
                    wParms.Clear();

                    wParms.Add("Name", wPosition.Name);
                    wParms.Add("OperatorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wParms.Add("ParentID", wPosition.ParentID);
                    wParms.Add("DepartmentID", wPosition.DepartmentID);
                    wParms.Add("DutyID", wPosition.DutyID);
                    wParms.Add("ID", wPosition.ID);
                    wParms.Add("Code", StringUtils.Format("GW{0}", String.Format("{0:D7}", wPosition.ID)));
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                logger.Error("BMS_SavePosition", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wErrorCode.Result;
        }

        public int BMS_ActivePositionByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                    String wSQLText = StringUtils.Format("Update {0}.bms_position", wInstance)
                            + " Set Code=@Code, OperatorID=@OperatorID,EditTime=@EditTime,Active=1 where ID=@ID";
                    wParms.Clear();

                    wParms.Add("OperatorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wParms.Add("ID", wID);

                    wParms.Add("Code", StringUtils.Format("GW{0}", String.Format("{0:D7}", wID)));
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                logger.Error("BMS_ActivePositionByID", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wErrorCode.Result;
        }

        public int BMS_DisablePositionByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                    String wSQLText = StringUtils.Format("Update {0}.bms_position", wInstance)
                            + " Set  Code=@Code,OperatorID=@OperatorID,EditTime=@EditTime,Active=2 where ID=@ID;";
                    wParms.Clear();

                    wParms.Add("OperatorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wParms.Add("ID", wID);
                    wParms.Add("Code", StringUtils.Format("GW{0}", String.Format("{0:D7}", wID)));
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                logger.Error("BMS_DisablePositionByID",
                        ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wErrorCode.Result;
        }

        public void BMS_DeletePositionByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return;
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Add("ID", wID);
                wParms.Add("Active", 0);
                this.Delete(StringUtils.Format(" {0}.bms_position ", wInstance), wParms);
            }
            catch (Exception ex)
            {
                logger.Error("BMS_DeletePositionByID", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
        }

        public List<BMSPosition> BMS_QueryPositionList(BMSEmployee wLoginUser,String wName,int wDepartmentID, int wActive,  Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            List<BMSPosition> wPositionList = new List<BMSPosition>();

            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                    String wSQLText = StringUtils.Format(
                            "Select t.*,t2.ParentID as PrevDepartmentID,t3.Name as Creator,t4.Name as Editor  from {0}.bms_position t " +
                             " left join {0}.bms_department t2 on t2.ID=t.DepartmentID " +
                            " left join {0}.mbs_user t3 on t3.ID=t.CreatorID " +
                            " left join {0}.mbs_user t4 on t4.ID=t.EditorID " +
                            "where t.ID>0 " +
                             " AND (@DepartmentID<=0 or  t.DepartmentID=@DepartmentID) " +
                             " AND (@Name = '' or  t.Name like  @Name) " +
                            " AND (@Active<0 or  t.Active=@Active)  ",
                            wInstance);
                    wParms.Clear();
                    wParms.Add("Active", wActive);
                    wParms.Add("DepartmentID", wDepartmentID);
                    wParms.Add("Name", StringUtils.isEmpty(wName) ? wName : "%" + wName + "%");
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms, wPagination);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        BMSPosition wPosition = new BMSPosition();
                        wPosition.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wPosition.Name = StringUtils.parseString(wSqlDataReader["Name"]);

                        wPosition.Code = StringUtils.parseString(wSqlDataReader["Code"]);

                        wPosition.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wPosition.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wPosition.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
                        wPosition.PrevDepartmentID = StringUtils.parseInt(wSqlDataReader["PrevDepartmentID"]);
                        wPosition.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wPosition.ParentID = StringUtils.parseInt(wSqlDataReader["ParentID"]);
                        wPosition.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wPosition.DutyID = StringUtils.parseInt(wSqlDataReader["DutyID"]);
                        wPosition.Creator = StringUtils.parseString(wSqlDataReader["Creator"]);
                        wPosition.Editor = StringUtils.parseString(wSqlDataReader["Editor"]);

                        if (StringUtils.isEmpty(wPosition.Code))
                        {
                            wPosition.Code = StringUtils.Format("GW{0}", String.Format("{0:D7}", wPosition.ID));
                        }
                        wPositionList.Add(wPosition);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error("BMS_QueryPositionList", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wPositionList;
        }

        public List<BMSPosition> BMS_QueryPositionList(BMSEmployee wLoginUser, int wActive, OutResult<Int32> wErrorCode) {

            return BMS_QueryPositionList(wLoginUser, "", -1, wActive, Pagination.MaxSize, wErrorCode);
        }

        public BMSPosition BMS_QueryPositionByID(BMSEmployee wLoginUser, int wID, String wCode,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            BMSPosition wPosition = new BMSPosition();

            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = StringUtils.Format(
                         "Select t.*,t2.ParentID as PrevDepartmentID,t3.Name as Creator,t4.Name as Editor  from {0}.bms_position t " +
                          " left join {0}.bms_department t2 on t2.ID=t.DepartmentID " +
                         " left join {0}.mbs_user t3 on t3.ID=t.CreatorID " +
                         " left join {0}.mbs_user t4 on t4.ID=t.EditorID " +
                           "where t.ID=@ID or ( @Code !='' and  t.Code=@Code);",
                            wInstance);
                    wParms.Clear();
                    wParms.Add("ID", wID);
                    wParms.Add("Code", wCode);
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wPosition.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wPosition.Name = StringUtils.parseString(wSqlDataReader["Name"]);

                        wPosition.Code = StringUtils.parseString(wSqlDataReader["Code"]);

                        wPosition.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wPosition.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wPosition.DepartmentID = StringUtils.parseInt(wSqlDataReader["DepartmentID"]);
                        wPosition.PrevDepartmentID = StringUtils.parseInt(wSqlDataReader["PrevDepartmentID"]);
                        wPosition.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wPosition.ParentID = StringUtils.parseInt(wSqlDataReader["ParentID"]);
                        wPosition.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wPosition.DutyID = StringUtils.parseInt(wSqlDataReader["DutyID"]);
                        wPosition.Creator = StringUtils.parseString(wSqlDataReader["Creator"]);
                        wPosition.Editor = StringUtils.parseString(wSqlDataReader["Editor"]);
                        if (StringUtils.isEmpty(wPosition.Code))
                        {
                            wPosition.Code = StringUtils.Format("GW{0}", String.Format("{0:D7}", wPosition.ID));
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                logger.Error("BMS_QueryPositionByID", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wPosition;
        }
    }
}
