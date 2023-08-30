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
    class CGSFieldConfigDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(CGSFieldConfigDAO));

        private static CGSFieldConfigDAO _instance = null;

        public static CGSFieldConfigDAO getInstance()
        {
            if (_instance == null)
                _instance = new CGSFieldConfigDAO();

            return _instance;
        }


        public CGSFieldConfigDAO()
        {
            // TODO Auto-generated constructor stub
        }

       
        public List<CGSField> CGS_GetTableConfigList(int wTableID, int wCompanyID, OutResult<Int32> wErrorCode)
        {

            List<CGSField> wResult = new List<CGSField>();

            try
            {

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result != 0)
                {
                    return wResult;
                }

                String wSQL;
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                wSQL = StringUtils.Format("select * from {0}.cgs_field where TableID=@TableID", wInstance);
                wSQL = this.DMLChange(wSQL);

                wParms.Add("TableID", wTableID);
                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParms);

                foreach (Dictionary<String, Object> wMap in wQueryResult)
                {
                    CGSField wCG_Field = new CGSField();

                    wCG_Field.ID = StringUtils.parseInt(wMap["ID"]);
                    wCG_Field.FieldName = StringUtils.parseString(wMap["FieldName"]);
                    wCG_Field.FieldOrder = StringUtils.parseInt(wMap["FieldOrder"]);
                    wCG_Field.FieldText = StringUtils.parseString(wMap["FieldText"]);
                    wCG_Field.FieldWidth = StringUtils.parseInt(wMap["FieldWidth"]);
                    wCG_Field.IsVisiable = StringUtils.parseInt(wMap["IsVisiable"]);
                    wCG_Field.TableID = StringUtils.parseInt(wMap["TableID"]);

                    wResult.Add(wCG_Field);
                }

            }
            catch (Exception e)
            {
                logger.Error("CGS_GetTableConfigList", e);
                wErrorCode.set(MESException.DBSQL.Value);
            }

            return wResult;
        }

        public void CGS_SaveTableConfigList(List<CGSField> wCG_Field, int wCompanyID, OutResult<Int32> wErrorCode)
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

                foreach (CGSField cg_Field in wCG_Field)
                {
                    if (cg_Field.ID == 0)
                    {
                        wSQL = StringUtils.Format(
                                "INSERT INTO {0}.cgs_field (TableID, FieldName, FieldText,"
                                        + "IsVisiable, FieldOrder, FieldWidth) VALUES (@TableID,"
                                        + "@FieldName, @FieldText, @IsVisiable, @FieldOrder, @FieldWidth);",
                                wInstance);
                        wSQL = this.DMLChange(wSQL);
                        wParms.Add("TableID", cg_Field.TableID);
                        wParms.Add("FieldName", cg_Field.FieldName);
                        wParms.Add("FieldText", cg_Field.FieldText);
                        wParms.Add("IsVisiable", cg_Field.IsVisiable);
                        wParms.Add("FieldOrder", cg_Field.FieldOrder);
                        wParms.Add("FieldWidth", cg_Field.FieldWidth);
                    }
                    else
                    {
                        wSQL = StringUtils.Format(
                                "UPDATE {0}.cgs_field  SET  TableID = @TableID,"
                                        + "FieldName = @FieldName, FieldText = @FieldText, IsVisiable = @IsVisiable,"
                                        + "FieldOrder = @FieldOrder, FieldWidth = @FieldWidth  WHERE ID = @ID;",
                                wInstance);
                        wSQL = this.DMLChange(wSQL);
                        wParms.Add("ID", cg_Field.ID);
                        wParms.Add("TableID", cg_Field.TableID);
                        wParms.Add("FieldName", cg_Field.FieldName);
                        wParms.Add("FieldText", cg_Field.FieldText);
                        wParms.Add("IsVisiable", cg_Field.IsVisiable);
                        wParms.Add("FieldOrder", cg_Field.FieldOrder);
                        wParms.Add("FieldWidth", cg_Field.FieldWidth);
                    }
                    mDBPool.update(wSQL, wParms);
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wErrorCode.set(MESException.DBSQL.Value);
            }

        }

        public void CGS_DeleteTableConfigList(List<CGSField> wCG_Field, int wCompanyID, OutResult<Int32> wErrorCode)
        {

            try
            {

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result != 0)
                {
                    return;
                }
                String wSQL = "";

                foreach (CGSField cg_Field2 in wCG_Field)
                {

                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();

                    wSQL = StringUtils.Format("DELETE FROM {0}.cgs_field WHERE ID=@ID;", wInstance);
                    wSQL = this.DMLChange(wSQL);
                    wParms.Add("ID", cg_Field2.ID);

                    mDBPool.update(wSQL, wParms);
                }

            }
            catch (

          Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
                wErrorCode.set(MESException.DBSQL.Value);
            }

        }

    }
}
