using iPlant.Common.Tools;
using iPlant.Data.EF;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{

    class CGSTableConfigDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(CGSTableConfigDAO));


        public CGSTableConfigDAO()
        {
            // TODO Auto-generated constructor stub
        }

        private static CGSTableConfigDAO Instance;

        public static CGSTableConfigDAO getInstance()
        {
            if (Instance == null)
                Instance = new CGSTableConfigDAO();
            return Instance;
        }

       

        public List<CGSTable> CGS_GetTableConfigList(BMSEmployee wLoginUser, int wUserID, String wTableName, String wModleName,
                OutResult<Int32> wErrorCode)
        {
            List<CGSTable> wResult = new List<CGSTable>();

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result != 0)
                {
                    return wResult;
                }

                String wSQL;
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                if (wTableName.Equals(""))
                {
                    wSQL = StringUtils.Format("select * from {0}.cgs_table where ModleName=@ModleName and UserID=@UserID",
                            wInstance);
                    wSQL = this.DMLChange(wSQL);
                    wParms.Add("ModleName", wModleName);
                    wParms.Add("UserID", wUserID);
                }
                else
                {

                    wSQL = StringUtils.Format(
                            "select * from {0}.cgs_table where TableName=@TableName and ModleName=@ModleName and UserID=@UserID",
                            wInstance);
                    wSQL = this.DMLChange(wSQL);

                    wParms.Add("TableName", wTableName);
                    wParms.Add("ModleName", wModleName);
                    wParms.Add("UserID", wUserID);
                }
                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParms);

                foreach (Dictionary<String, Object> wMap in wQueryResult)
                {
                    CGSTable wCGTable = new CGSTable();

                    CGSFieldConfigDAO wCGFieldConfigDAO = new CGSFieldConfigDAO();
                    wCGTable.ID = StringUtils.parseInt(wMap["ID"]);
                    wCGTable.Counts = StringUtils.parseInt(wMap["Counts"]);
                    wCGTable.TableName = StringUtils.parseString(wMap["TableName"]);
                    wCGTable.UserID = StringUtils.parseInt(wMap["UserID"]);
                    wCGTable.CompanyID = StringUtils.parseInt(wMap["CompanyID"]);
                    wCGTable.ModleName = StringUtils.parseString(wMap["ModleName"]);
                    wCGTable.List = wCGFieldConfigDAO.CGS_GetTableConfigList(wCGTable.ID, wCGTable.CompanyID, wErrorCode);

                    wResult.Add(wCGTable);
                }

            }
            catch (Exception e)
            {
                // TODO: handle exception
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wErrorCode.set(MESException.DBSQL.Value);
            }

            return wResult;

        }

        public void CGS_SaveTableConfigList(BMSEmployee wLoginUser, List<CGSTable> wCGTable, OutResult<Int32> wErrorCode)
        {

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result != 0)
                {
                    return;
                }

                String wSQL = "";
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                foreach (CGSTable cgTable in wCGTable)
                {
                    if (cgTable.ID == 0)
                    {
                        wSQL = StringUtils.Format("INSERT INTO {0}.cgs_table (CompanyID, UserID,"
                                + "TableName, Counts, ModleName) VALUES (@CompanyID, @UserID,"
                                + "@TableName, @Counts, @ModleName);", wInstance);
                        wSQL = this.DMLChange(wSQL);
                        wParms.Add("CompanyID", cgTable.CompanyID);
                        wParms.Add("Counts", cgTable.Counts);
                        wParms.Add("UserID", cgTable.UserID);
                        wParms.Add("ModleName", cgTable.ModleName);
                        wParms.Add("TableName", cgTable.TableName);

                        CGSFieldConfigDAO.getInstance().CGS_SaveTableConfigList(cgTable.List, cgTable.CompanyID,
                                wErrorCode);
                    }
                    else
                    {
                        wSQL = StringUtils.Format("UPDATE {0}.cgs_table  SET  CompanyID = @CompanyID,"
                                + "UserID = @UserID, TableName = @TableName, Counts = @Counts,"
                                + "ModleName = @ModleName  WHERE ID = @ID;", wInstance);
                        wSQL = this.DMLChange(wSQL);
                        wParms.Add("ID", cgTable.ID);
                        wParms.Add("CompanyID", cgTable.CompanyID);
                        wParms.Add("Counts", cgTable.Counts);
                        wParms.Add("UserID", cgTable.UserID);
                        wParms.Add("ModleName", cgTable.ModleName);
                        wParms.Add("TableName", cgTable.TableName);

                    }



                    if (cgTable.ID <= 0)
                    {
                        cgTable.ID = (int)mDBPool.insert(wSQL, wParms);

                    }
                    else
                    {
                        mDBPool.update(wSQL, wParms);

                    }

                    foreach (CGSField wCGSField in cgTable.List)
                    {
                        if (wCGSField.TableID == 0)
                            wCGSField.TableID = cgTable.ID;
                        else
                        {
                            continue;
                        }
                    }
                    CGSFieldConfigDAO.getInstance().CGS_SaveTableConfigList(cgTable.List, cgTable.CompanyID,
                            wErrorCode);
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wErrorCode.set(MESException.DBSQL.Value);
            }

        }

        public void CGS_DeleteTableConfigList(BMSEmployee wLoginUser, List<CGSTable> wCGTable, OutResult<Int32> wErrorCode)
        {
            try
            {

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result != 0)
                {
                    return;
                }

                String wSQL = "";
                foreach (CGSTable cgTable in wCGTable)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                    wSQL = StringUtils.Format("DELETE FROM {0}.cgs_table   WHERE ID=@ID;", wInstance);
                    wSQL = this.DMLChange(wSQL);
                    wParms.Add("ID", cgTable.ID);

                    CGSFieldConfigDAO.getInstance().CGS_DeleteTableConfigList(cgTable.List, cgTable.CompanyID,
                            wErrorCode);
                    mDBPool.update(wSQL, wParms);
                }

            }
            catch (Exception e)
            {
                // TODO: handle exception
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wErrorCode.set(MESException.DBSQL.Value);
            }

        }
    }
}
