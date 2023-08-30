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
    class BMSDepartmentDAO : BaseDAO
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(BMSDepartmentDAO));

        private static BMSDepartmentDAO Instance = null;

        private BMSDepartmentDAO() : base()
        {


        }

        public static BMSDepartmentDAO getInstance()
        {
            if (Instance == null)
                Instance = new BMSDepartmentDAO();
            return Instance;
        }



        private BMSDepartment BMS_CheckDepartmentName(BMSEmployee wLoginUser, BMSDepartment wBMSDepartment,
                OutResult<Int32> wErrorCode)
        {
            BMSDepartment wDepartment = new BMSDepartment();
            wErrorCode.set(0);
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = StringUtils.Format(
                                "Select * from {0}.bms_department where ID!=@ID and ((Name=@Name and ParentID=@ParentID ) OR Code=@Code );",
                                wInstance);


                    wParms.Add("ID", wBMSDepartment.ID);
                    wParms.Add("Name", wBMSDepartment.Name);
                    wParms.Add("ParentID", wBMSDepartment.ParentID);
                    wParms.Add("Code", wBMSDepartment.Code);
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wDepartment.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wDepartment.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wDepartment.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                        wDepartment.Remark = StringUtils.parseString(wSqlDataReader["Remark"]);
                        wDepartment.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wDepartment.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wDepartment.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wDepartment.ParentID = StringUtils.parseInt(wSqlDataReader["ParentID"]);
                        wDepartment.Type = StringUtils.parseInt(wSqlDataReader["Type"]);
                        wDepartment.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wDepartment.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        if (StringUtils.isEmpty(wDepartment.Code))
                        {
                            wDepartment.Code = StringUtils.Format("BM{0}", String.Format("{0:D6}", wDepartment.ID));
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("BMS_CheckDepartmentName",
                       ex);
            }
            return wDepartment;
        }

        public void BMS_AddDepartment(BMSEmployee wLoginUser, BMSDepartment wDepartment, OutResult<Int32> wErrorCode)
        {
            lock (mLockHelper)
            {
                try
                {
                    wErrorCode.set(0);
                    if (wDepartment == null || StringUtils.isEmpty(wDepartment.Name))
                    {
                        wErrorCode.set(MESException.Parameter.Value);
                        return;
                    }
                    wErrorCode.set(0);
                    String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                    BMSDepartment wDepartmentO = this.BMS_CheckDepartmentName(wLoginUser, wDepartment,
                             wErrorCode);
                    if (wDepartmentO.ID > 0)
                    {
                        wErrorCode.set(MESException.Logic.Value);
                        return;
                    }

                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                    String wSQLText = "";

                    if (wDepartment.ID <= 0)
                    {
                        wSQLText = StringUtils.Format("Insert Into {0}.bms_department", wInstance)
                                + "(Name,Code,CreatorID,CreateTime,EditorID,EditTime,Active,ParentID,Type,Remark,ManagerIDList) "
                                + " Values(@Name,@Code,@CreatorID,@CreateTime,@EditorID,@EditTime,@Active,@ParentID,@Type,@Remark,@ManagerIDList);";
                    }
                    else
                    {
                        wSQLText = StringUtils.Format("Insert Into {0}.bms_department", wInstance)
                                + "(ID,Name,Code,CreatorID,CreateTime,EditorID,EditTime,Active,ParentID,Type,Remark,ManagerIDList) "
                                + " Values(@ID,@Name,@Code,@CreatorID,@CreateTime,@EditorID,@EditTime,@Active,@ParentID,@Type,@Remark,@ManagerIDList);";
                    }

                    if (StringUtils.isEmpty(wDepartment.Code))
                    {
                        int wMaxID = this.GetMaxPrimaryKey(StringUtils.Format("{0}.bms_department", wInstance), "ID");
                        wDepartment.Code = StringUtils.Format("BM{0}", String.Format("{0:D6}", wMaxID + 1));
                    }

                    wParms.Clear();
                    wParms.Add("ID", wDepartment.ID);
                    wParms.Add("Name", wDepartment.Name);
                    wParms.Add("Code", wDepartment.Code);
                    wParms.Add("CreatorID", wLoginUser.ID);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("CreateTime", DateTime.Now);
                    wParms.Add("EditTime", DateTime.Now);
                    wParms.Add("Active", wDepartment.Active);
                    wParms.Add("ParentID", wDepartment.ParentID);
                    wParms.Add("Type", wDepartment.Type);
                    wParms.Add("Remark", wDepartment.Remark);
                    wParms.Add("ManagerIDList", StringUtils.Join(",", wDepartment.ManagerIDList));
                    wSQLText = this.DMLChange(wSQLText);

                    if (wDepartment.ID <= 0)
                    {
                        wDepartment.ID = (int)mDBPool.insert(wSQLText, wParms);
                    }
                    else
                    {
                        mDBPool.update(wSQLText, wParms);
                    }

                }
                catch (Exception ex)
                {
                    logger.Error("BMS_AddDepartment", ex);
                    wErrorCode.set(MESException.DBSQL.Value);
                }
            }
        }

        public void BMS_SaveDepartment(BMSEmployee wLoginUser, BMSDepartment wDepartment, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {
                if (wDepartment == null || StringUtils.isEmpty(wDepartment.Name))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                BMSDepartment wDepartmentO = this.BMS_CheckDepartmentName(wLoginUser, wDepartment, wErrorCode);
                if (wDepartmentO.ID > 0)
                {
                    wErrorCode.set(MESException.Logic.Value);
                    return;
                }

                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                String wSQLText = StringUtils.Format("Update {0}.bms_department", wInstance)
                        + " Set   Name=@Name,EditorID=@EditorID,Remark=@Remark,ManagerIDList=@ManagerIDList,"
                        + "EditTime=@EditTime,ParentID=@ParentID,Type=@Type where ID=@ID  ;";
                wParms.Clear();

                wParms.Add("Name", wDepartment.Name);
                wParms.Add("EditorID", wLoginUser.ID);
                wParms.Add("EditTime", DateTime.Now);
                wParms.Add("ParentID", wDepartment.ParentID);
                wParms.Add("Type", wDepartment.Type);
                wParms.Add("Remark", wDepartment.Remark);
                wParms.Add("ManagerIDList", StringUtils.Join(",", wDepartment.ManagerIDList));
                wParms.Add("ID", wDepartment.ID);
                wSQLText = this.DMLChange(wSQLText);
                mDBPool.update(wSQLText, wParms);

            }
            catch (Exception ex)
            {
                logger.Error("BMS_SaveDepartment", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
        }

        public void BMS_DeleteDepartmentByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return;
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Add("ID", wID);
                wParms.Add("Active", 0);
                this.Delete(StringUtils.Format(" {0}.bms_department ", wInstance), wParms);
            }
            catch (Exception ex)
            {
                logger.Error("BMS_DeletePositionByID", ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
        }

        public int BMS_ActiveDepartmentByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                    String wSQLText = StringUtils.Format("Update {0}.bms_department", wInstance)
                            + " Set  EditorID=@EditorID,EditTime=@EditTime,Active=1 where ID=@ID";
                    wParms.Clear();

                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wParms.Add("ID", wID);


                    // wParms.Add("Code", StringUtils.Format("BM{0}", String.format("%06d", wID)));
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                logger.Error("BMS_ActiveDepartmentByID",
                       ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wErrorCode.Result;
        }

        public int BMS_DisableDepartmentByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                    String wSQLText = StringUtils.Format("Update {0}.bms_department", wInstance)
                            + " Set EditorID=@EditorID,EditTime=@EditTime,Active=2 where ID=@ID";
                    wParms.Clear();

                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wParms.Add("ID", wID);
                    // wParms.Add("Code", StringUtils.Format("BM{0}", String.format("%06d",wID)));
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                logger.Error("BMS_DisableDepartmentByID",
                       ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wErrorCode.Result;
        }

        public List<BMSDepartment> BMS_QueryDepartmentList(BMSEmployee wLoginUser, int wActive, OutResult<Int32> wErrorCode)
        {

            return this.BMS_QueryDepartmentList(wLoginUser, "", -1, wActive, wErrorCode);
        }
        public List<BMSDepartment> BMS_QueryDepartmentList(BMSEmployee wLoginUser, String wName, int wParentID, int wActive,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            List<BMSDepartment> wDepartmentList = new List<BMSDepartment>();

            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                    String wSQLText = StringUtils.Format(
                            "Select t.*,t3.Name as Creator,t4.Name as Editor,t2.Name as ParentName," +
                            " t2.Code as ParentCode,count(t5.ID) as EmployeeCount from {0}.bms_department t" +
                            " left join {0}.mbs_user t3 on t3.ID=t.CreatorID " +
                            " left join {0}.mbs_user t4 on t4.ID=t.EditorID " +
                            " left join {0}.bms_department t2 on t2.ID=t.ParentID " +
                            " left join {0}.mbs_user t5 on t5.DepartmentID=t.ID " +
                            " where t.ID>0 AND (@ParentID<=0 or  t.ParentID=@ParentID) " +
                            " AND (@Name = '' or  t.Name =  @Name) " +
                            " AND (@Active<0 or  t.Active=@Active) group by t.ID; ",
                            wInstance);
                    wParms.Clear();
                    wParms.Add("Active", wActive);
                    wParms.Add("ParentID", wParentID);
                    wParms.Add("Name", wName);
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);

                    if (wQueryResultList.Count <= 0)
                    {
                        return wDepartmentList;
                    }
                    Dictionary<int, String> wBMSEmployeeNameDic = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeList(wLoginUser, "", -1, -1, -1, -1, -1, 1, Pagination.MaxSize, wErrorCode).ToDictionary(p => p.ID, p => p.Name);


                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        BMSDepartment wDepartment = new BMSDepartment();
                        wDepartment.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wDepartment.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wDepartment.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                        wDepartment.Remark = StringUtils.parseString(wSqlDataReader["Remark"]);
                        wDepartment.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wDepartment.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wDepartment.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wDepartment.EmployeeCount = StringUtils.parseInt(wSqlDataReader["EmployeeCount"]);
                        wDepartment.ParentID = StringUtils.parseInt(wSqlDataReader["ParentID"]);
                        wDepartment.ParentName = StringUtils.parseString(wSqlDataReader["ParentName"]);
                        wDepartment.ParentCode = StringUtils.parseString(wSqlDataReader["ParentCode"]);
                        wDepartment.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wDepartment.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wDepartment.Type = StringUtils.parseInt(wSqlDataReader["Type"]);

                        wDepartment.ManagerIDList = StringUtils.parseIntList(wSqlDataReader["ManagerIDList"], ",");
                        wDepartment.ManagerName = StringUtils.parseName(wDepartment.ManagerIDList, wBMSEmployeeNameDic);
                        wDepartment.Creator = StringUtils.parseString(wSqlDataReader["Creator"]);
                        wDepartment.Editor = StringUtils.parseString(wSqlDataReader["Editor"]);

                        wDepartmentList.Add(wDepartment);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error("BMS_QueryDepartmentList",
                       ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wDepartmentList;
        }

        public List<BMSDepartment> BMS_QueryDepartmentListByLikeName(BMSEmployee wLoginUser, String wName, int wParentID, int wActive, Pagination wPagination,
              OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            List<BMSDepartment> wDepartmentList = new List<BMSDepartment>();

            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                    String wSQLText = StringUtils.Format(
                            "Select t.*,t3.Name as Creator,t4.Name as Editor,t2.Name as ParentName," +
                            " t2.Code as ParentCode,count(t5.ID) as EmployeeCount from {0}.bms_department t" +
                            " left join {0}.mbs_user t3 on t3.ID=t.CreatorID " +
                            " left join {0}.mbs_user t4 on t4.ID=t.EditorID " +
                            " left join {0}.bms_department t2 on t2.ID=t.ParentID " +
                            " left join {0}.mbs_user t5 on t5.DepartmentID=t.ID " +
                            " where t.ID>0" +
                            " AND (@ParentID<=0 or  t.ParentID=@ParentID) " +
                            " AND (@Name = '' or  t.Name like  @Name) " +
                            " AND (@Active< 0 or  t.Active=@Active) group by t.ID  ",
                            wInstance);
                    wParms.Clear();
                    wParms.Add("Active", wActive);
                    wParms.Add("ParentID", wParentID);
                    wParms.Add("Name", StringUtils.isEmpty(wName) ? wName : "%" + wName + "%");
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms, wPagination);

                    if (wQueryResultList.Count <= 0)
                    {
                        return wDepartmentList;
                    }
                    Dictionary<int, String> wBMSEmployeeNameDic = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeAll(wLoginUser, -1, wErrorCode).ToDictionary(p => p.ID, p => p.Name);


                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        BMSDepartment wDepartment = new BMSDepartment();
                        wDepartment.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wDepartment.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wDepartment.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                        wDepartment.Remark = StringUtils.parseString(wSqlDataReader["Remark"]);
                        wDepartment.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wDepartment.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wDepartment.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wDepartment.EmployeeCount = StringUtils.parseInt(wSqlDataReader["EmployeeCount"]);
                        wDepartment.ParentID = StringUtils.parseInt(wSqlDataReader["ParentID"]);
                        wDepartment.ParentName = StringUtils.parseString(wSqlDataReader["ParentName"]);
                        wDepartment.ParentCode = StringUtils.parseString(wSqlDataReader["ParentCode"]);
                        wDepartment.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wDepartment.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wDepartment.Type = StringUtils.parseInt(wSqlDataReader["Type"]);

                        wDepartment.ManagerIDList = StringUtils.parseIntList(wSqlDataReader["ManagerIDList"], ",");
                        wDepartment.ManagerName = StringUtils.parseName(wDepartment.ManagerIDList, wBMSEmployeeNameDic);
                        wDepartment.Creator = StringUtils.parseString(wSqlDataReader["Creator"]);
                        wDepartment.Editor = StringUtils.parseString(wSqlDataReader["Editor"]);

                        wDepartmentList.Add(wDepartment);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error("BMS_QueryDepartmentList",
                       ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wDepartmentList;
        }

        public BMSDepartment BMS_QueryDepartmentByID(BMSEmployee wLoginUser, int wID, String wCode,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            BMSDepartment wDepartment = new BMSDepartment();

            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                    String wSQLText = StringUtils.Format(
                             "Select t.*,t3.Name as Creator,t4.Name as Editor from {0}.bms_department" +
                            " left join {0}.mbs_user t3 on t3.ID=t.CreatorID " +
                            " left join {0}.mbs_user t4 on t4.ID=t.EditorID " +
                            "where t.ID=@ID or ( @Code !='' and  t.Code=@Code);",
                            wInstance);
                    wParms.Clear();
                    wParms.Add("ID", wID);
                    wParms.Add("Code", wCode);
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    if (wQueryResultList.Count <= 0)
                    {
                        return wDepartment;
                    }
                    Dictionary<int, String> wBMSEmployeeNameDic = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeAll(wLoginUser, -1, wErrorCode).ToDictionary(p => p.ID, p => p.Name);

                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wDepartment.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wDepartment.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wDepartment.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                        wDepartment.EditorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wDepartment.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wDepartment.Active = StringUtils.parseInt(wSqlDataReader["Active"]);
                        wDepartment.ParentID = StringUtils.parseInt(wSqlDataReader["ParentID"]);
                        wDepartment.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wDepartment.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wDepartment.Type = StringUtils.parseInt(wSqlDataReader["Type"]);


                        wDepartment.ManagerIDList = StringUtils.parseIntList(wSqlDataReader["ManagerIDList"], ",");
                        wDepartment.ManagerName = StringUtils.parseName(wDepartment.ManagerIDList, wBMSEmployeeNameDic);
                        wDepartment.Creator = StringUtils.parseString(wSqlDataReader["Creator"]);
                        wDepartment.Editor = StringUtils.parseString(wSqlDataReader["Editor"]);
                        if (StringUtils.isEmpty(wDepartment.Code))
                        {
                            wDepartment.Code = StringUtils.Format("BM{0}", String.Format("{0:D6}", wDepartment.ID));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error("BMS_QueryDepartmentByID",
                       ex);
                wErrorCode.set(MESException.DBSQL.Value);
            }
            return wDepartment;
        }
    }
}
