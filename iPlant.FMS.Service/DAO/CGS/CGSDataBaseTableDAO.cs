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
    class CGSDataBaseTableDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(CGSDataBaseTableDAO));


        public CGSDataBaseTableDAO() : base()
        {

        }

        private static Dictionary<DBEnumType, CGSDataBaseTableDAO> InstanceMap = new Dictionary<DBEnumType, CGSDataBaseTableDAO>();

        public static CGSDataBaseTableDAO getInstance(DBEnumType wSQLTypes)
        {
            if (wSQLTypes == DBEnumType.Default)
                wSQLTypes = DBEnumType.MySQL;
            if (!InstanceMap.ContainsKey(wSQLTypes))
            {
                InstanceMap.Add(wSQLTypes, new CGSDataBaseTableDAO(wSQLTypes));
            }
            return InstanceMap[wSQLTypes];
        }
        public CGSDataBaseTableDAO(DBEnumType wSQLTypes) : base(wSQLTypes)
        {

        }


        public List<Dictionary<String, Object>> CGS_GetDataTableList(BMSEmployee wLoginUser, OutResult<Int32> wErrorCode)
        {
            List<Dictionary<String, Object>> wResult = new List<Dictionary<String, Object>>();
            wErrorCode.set(0);
            try
            {
                switch (this.SQLType)
                {
                    case DBEnumType.MySQL:
                        wResult = this.CGS_GetDataTableList_Mysql(wLoginUser, wErrorCode);
                        break;
                    case DBEnumType.SQLServer:
                        wResult = this.CGS_GetDataTableList_SqlServer(wLoginUser, wErrorCode);
                        break;

                    default:
                        break;
                }

            }
            catch (Exception e)
            {
                logger.Error("CGS_GetDataTableList", e);
                wErrorCode.set(MESException.DBSQL.Value);
            }

            return wResult;

        }

        private List<Dictionary<String, Object>> CGS_GetDataTableList_Mysql(BMSEmployee wLoginUser,
                OutResult<Int32> wErrorCode)
        {
            List<Dictionary<String, Object>> wResult = new List<Dictionary<String, Object>>();
            wErrorCode.set(0);
            try
            {

                String wSQL = "select TABLE_SCHEMA,TABLE_NAME,ENGINE,TABLE_ROWS,DATA_LENGTH,AUTO_INCREMENT,TABLE_COLLATION,TABLE_COMMENT,CREATE_TIME"
                        + " From information_schema.tables where TABLE_TYPE='BASE TABLE' AND ENGINE !='PERFORMANCE_SCHEMA' AND TABLE_SCHEMA!='mysql'";

                wResult = mDBPool.queryForList(wSQL, new Dictionary<String, Object>());

            }
            catch (Exception e)
            {
                // TODO: handle exception
                logger.Error("CGSDataBaseTableDAO CGS_GetDataTableList_Mysql", e);
                wErrorCode.set(MESException.DBSQL.Value);
            }

            return wResult;

        }

        private List<Dictionary<String, Object>> CGS_GetDataTableList_SqlServer(BMSEmployee wLoginUser,
                OutResult<Int32> wErrorCode)
        {
            List<Dictionary<String, Object>> wResult = new List<Dictionary<String, Object>>();
            wErrorCode.set(0);
            try
            {

                String wSQL = "SELECT NAME as DBName,CRDATE FROM MASTER.DBO.SYSDATABASES Where  [Name] Not IN('master','model','msdb','tempdb') ORDER BY NAME";

                List<Dictionary<String, Object>> wDBResult = mDBPool.queryForList(wSQL, new Dictionary<String, Object>());

                List<Dictionary<String, Object>> wTableDBResult = null;
                foreach (Dictionary<String, Object> map in wDBResult)
                {

                    wSQL = "exec [" + map["DBName"] + "].sys.sp_MSforeachtable \"exec sp_spaceused  '?'\" ";
                    wTableDBResult = mDBPool.queryForList(wSQL, null);


                    foreach (Dictionary<String, Object> map2 in wTableDBResult)
                    {
                        map2.Add("DBName", map["DBName"]);
                        map2.Add("CRDATE", map["CRDATE"]);
                    }
                    wResult.AddRange(wTableDBResult);
                }


            }
            catch (Exception e)
            {
                // TODO: handle exception
                logger.Error("CGSDataBaseTableDAO CGS_GetDataTableList_SqlServer", e);
                wErrorCode.set(MESException.DBSQL.Value);
            }

            return wResult;

        }

        public List<Dictionary<String, Object>> CGS_GetDataTableInfo(BMSEmployee wLoginUser, String wDBName, String wTableName,
                OutResult<Int32> wErrorCode)
        {
            List<Dictionary<String, Object>> wResult = new List<Dictionary<String, Object>>();
            wErrorCode.set(0);
            try
            {
                switch (this.SQLType)
                {
                    case DBEnumType.MySQL:
                        wResult = this.CGS_GetDataTableInfo_Mysql(wLoginUser, wDBName, wTableName, wErrorCode);
                        break;
                    case DBEnumType.SQLServer:
                        wResult = this.CGS_GetDataTableInfo_SqlServer(wLoginUser, wDBName, wTableName, wErrorCode);
                        break;

                    default:
                        break;
                }

            }
            catch (Exception e)
            {
                logger.Error("CGS_GetDataTableInfo", e);
                wErrorCode.set(MESException.DBSQL.Value);
            }

            return wResult;

        }

        private List<Dictionary<String, Object>> CGS_GetDataTableInfo_SqlServer(BMSEmployee wLoginUser, String wDBName,
                String wTableName, OutResult<Int32> wErrorCode)
        {
            List<Dictionary<String, Object>> wResult = new List<Dictionary<String, Object>>();
            wErrorCode.set(0);
            try
            {

                String wSQL = "select c1.TABLE_CATALOG AS TABLE_SCHEMA,c1.TABLE_NAME,c1.COLUMN_NAME,"
                        + "  c1.COLUMN_DEFAULT,c1.IS_NULLABLE,c1.DATA_TYPE, c1.CHARACTER_MAXIMUM_LENGTH,"
                        + "  c1.NUMERIC_PRECISION,c1.CHARACTER_SET_NAME, c1.COLLATION_NAME,ep.[value] as COLUMN_COMMENT,"
                        + "  ic.is_identity as COLUMN_KEY ,ic.INCREMENT_VALUE "
                        + "  from [ICCO].information_schema.columns  c1 "
                        + "  INNER JOIN  [ICCO].sys.tables AS t on t.[name]=c1.TABLE_NAME "
                        + "  INNER JOIN [ICCO].sys.columns AS c ON t.object_id = c.object_id and c.[name] =c1.COLUMN_NAME "
                        + "  LEFT JOIN [ICCO].sys.extended_properties AS ep ON ep.major_id = c.object_id AND ep.minor_id = c.column_id    and ep.[class]=1"
                        + "  LEFT JOIN [ICCO].sys.identity_columns AS ic ON ic.object_id = c.object_id AND c.column_id = ic.column_id "
                        + " where c1.TABLE_NAME =@TableName and c1.TABLE_CATALOG = @DBName ";
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Add("TableName", wTableName);
                wParms.Add("DBName", wDBName);

                wResult = mDBPool.queryForList(wSQL, wParms);
            }
            catch (Exception e)
            {
                logger.Error("CGSDataBaseTableDAO CGS_GetDataTableInfo_SqlServer", e);
                wErrorCode.set(MESException.DBSQL.Value);
            }

            return wResult;
        }

        private List<Dictionary<String, Object>> CGS_GetDataTableInfo_Mysql(BMSEmployee wLoginUser, String wDBName,
                String wTableName, OutResult<Int32> wErrorCode)
        {
            List<Dictionary<String, Object>> wResult = new List<Dictionary<String, Object>>();
            wErrorCode.set(0);
            try
            {

                String wSQL = " select TABLE_SCHEMA,TABLE_NAME,COLUMN_NAME,DATA_TYPE,COLUMN_TYPE,COLUMN_COMMENT,COLUMN_KEY ='PRI' AS COLUMN_KEY ,"
                        + " EXTRA = 'auto_increment' as INCREMENT_VALUE,COLUMN_DEFAULT,IS_NULLABLE,CHARACTER_MAXIMUM_LENGTH,NUMERIC_PRECISION "
                        + " From information_schema.columns where TABLE_NAME =@TableName and TABLE_SCHEMA= @DBName ";
                Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                wParms.Add("TableName", wTableName);
                wParms.Add("DBName", wDBName);
                wResult = mDBPool.queryForList(wSQL, wParms);
            }
            catch (Exception e)
            {
                logger.Error("CGSDataBaseTableDAO CGS_GetDataTableInfo_Mysql", e);
                wErrorCode.set(MESException.DBSQL.Value);
            }

            return wResult;
        }
    }
}
