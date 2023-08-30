using iPlant.Common.Tools;
using iPlant.Data.EF;
using iPlant.Data.EF.Repository;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    public class BaseDAO : RepositoryFactory
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(BaseDAO));

        protected LockHelper mLockHelper = new LockHelper();
        public BaseDAO() : base(DefaultDbType)
        {
        }

        public BaseDAO(DBEnumType wSQLTypes) : base(wSQLTypes)
        {
        }


        public static String defaultPassword = "123456";

        public const String appSecret = "c5e330214fb33e2d80f14e3fc45ed214";

        public static BMSEmployee SysAdmin = new BMSEmployee()
        {
            ID = -100,
            Grad = (int)BMSGrads.System,
            Name = "SHRIS",
            LoginName = DesUtil.encrypt("SHRISMCIS", appSecret),
            Password = DesUtil.encrypt("shrismcis", appSecret)
        };

        public static Dictionary<String, BaseDAO> BaseDaoInstanceDic = new Dictionary<string, BaseDAO>();



        static BaseDAO()
        {

            String wDefaultString = StringUtils.parseString(GlobalConstant.GlobalConfiguration.GetValue("User.Default.Password"));
            if (StringUtils.isNotEmpty(wDefaultString) && wDefaultString.Length >= 8)
            {
                wDefaultString = DesUtil.decrypt(wDefaultString, appSecret);
                if (StringUtils.isNotEmpty(wDefaultString) && wDefaultString.Length >= 6)
                {
                    defaultPassword = wDefaultString;
                }
            }

            wDefaultString = StringUtils.parseString(GlobalConstant.GlobalConfiguration.GetValue("User.Admin.Name"));
            if (StringUtils.isNotEmpty(wDefaultString) && wDefaultString.Length >= 8)
            {
                wDefaultString = DesUtil.decrypt(wDefaultString, appSecret);
                if (StringUtils.isNotEmpty(wDefaultString) && wDefaultString.Length >= 6)
                {
                    wDefaultString = DesUtil.encrypt(wDefaultString, appSecret);
                    SysAdmin.LoginName = wDefaultString;
                }
            }
            wDefaultString = StringUtils.parseString(GlobalConstant.GlobalConfiguration.GetValue("User.Admin.Password"));
            if (StringUtils.isNotEmpty(wDefaultString) && wDefaultString.Length >= 8)
            {
                wDefaultString = DesUtil.decrypt(wDefaultString, appSecret);
                if (StringUtils.isNotEmpty(wDefaultString) && wDefaultString.Length >= 6)
                {
                    wDefaultString = DesUtil.encrypt(wDefaultString, appSecret);
                    SysAdmin.Password = wDefaultString;
                }
            }

        }


        protected void SetInstance(String wTypeName, BaseDAO wInstance)
        {
            BaseDaoInstanceDic[wTypeName] = wInstance;
        }

        public Boolean Execute(List<String> wSqlList)
        {
            Boolean wResult = false;
            if (wSqlList == null || wSqlList.Count <= 0)
                return wResult;

            wSqlList.RemoveAll(p => StringUtils.isEmpty(p));

            if (wSqlList.Count <= 0)
                return wResult;


            StringSQLTool.Instance.ExecuteSql(wSqlList, mDBPool);

            return true;
        }



        protected String DefaultDateBaseName
        {
            get
            {
                return MESDBSource.Default.getDBName();
            }
        }


        protected Object GetMapObject(Dictionary<String, Object> wMap, String wKey)
        {
            Object wResult = null;
            try
            {
                if (wMap == null || wMap.Count < 1 || StringUtils.isEmpty(wKey))
                    return wResult;

                if (wMap.ContainsKey(wKey))
                    wResult = wMap[wKey];

            }
            catch (Exception e)
            {

                logger.Error("GetMapObject", e);
            }
            return wResult;
        }


        /*
         * protected String GetDataBaseName(MESDBSource wDataBaseFiled) { return
         * wDataBaseFiled.getDBName(); }
         */


        protected String MysqlChangeToSqlServer(String wMySqlString)
        {
            String wResult = DMLTool.ChangeToSqlServer(wMySqlString, out bool wSuccess);
            if (wSuccess)
            {
                wMySqlString = wResult;
            }
            return wMySqlString;
        }

        protected String DMLChange(String wMySqlString, DBEnumType wSQLTypeFiled)
        {
            switch (wSQLTypeFiled)
            {
                case DBEnumType.MySQL:
                    wMySqlString = wMySqlString.Replace("\\\\", "\\\\\\\\");
                    break;
                case DBEnumType.SQLServer:
                    wMySqlString = this.MysqlChangeToSqlServer(wMySqlString);
                    break;
                case DBEnumType.Oracle:

                    break;
                case DBEnumType.Access:

                    break;
                default:
                    break;
            }
            return wMySqlString;
        }

        protected String DMLChange(String wMySqlString)
        {
            switch (SQLType)
            {
                case DBEnumType.MySQL:
                    wMySqlString = wMySqlString.Replace("\\\\", "\\\\\\\\");
                    break;
                case DBEnumType.SQLServer:
                    wMySqlString = this.MysqlChangeToSqlServer(wMySqlString);
                    break;
                case DBEnumType.Oracle:

                    break;
                case DBEnumType.Access:

                    break;
                default:
                    break;
            }
            return wMySqlString;
        }

        /**
         * SelectAll数据量查询数据
         * 
         * @param wSQL      查询sql语句 用:冒号定义参数
         * @param wParamMap sql参数集
         * @param clazz     返回数据类型 注意sql返回的数据需与实体类型相匹配
         * @return
         */
        protected List<T> QueryForList<T>(String wSQL, Dictionary<String, Object> wParamMap)
        {

            List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQL, wParamMap);

            return JsonTool.JsonToObject<List<T>>(JsonTool.ObjectToJson(wQueryResultList));

        }

        protected List<T> QueryForList<T>(String wSQL, Dictionary<String, Object> wParamMap, Pagination wPagination)
        {

            List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQL, wParamMap, wPagination);

            return JsonTool.JsonToObject<List<T>>(JsonTool.ObjectToJson(wQueryResultList));

        }



        protected List<String> QueryTableStruct(DBEnumType wDBEnumType, String wTableName, String wDBName)
        {
            List<String> wResult = new List<string>();
            switch (wDBEnumType)
            {
                case DBEnumType.Default:
                case DBEnumType.MySQL:
                    wResult = QueryMysqlTableStruct(wTableName, wDBName);
                    break;
                case DBEnumType.SQLServer:
                    wResult = QuerSqlServerTableStruct(wTableName, wDBName);
                    break;
                case DBEnumType.Oracle:
                    break;
                case DBEnumType.Access:
                    break;
                default:
                    break;
            }
            return wResult;

        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="wTableName"></param>
        /// <param name="wDBName"></param>
        /// <returns></returns>
        protected List<String> QueryMysqlTableStruct(String wTableName, String wDBName)
        {
            List<String> wResult = new List<string>();

            String wSQL = StringUtils.Format("select COLUMN_NAME AS Name from information_schema.COLUMNS where TABLE_SCHEMA = '{0}' and TABLE_NAME = '{1}'", wDBName, wTableName);

            List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQL, null);
            foreach (Dictionary<String, Object> wReader in wQueryResultList)
            {
                if (!wReader.ContainsKey("Name") || wResult.Contains(wReader["Name"]))
                    continue;
                wResult.Add(StringUtils.parseString(wReader["Name"]));
            }
            return wResult;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="wTableName"></param>
        /// <param name="wDBName"></param>
        /// <returns></returns>
        protected List<String> QuerSqlServerTableStruct(String wTableName, String wDBName)
        {
            List<String> wResult = new List<string>();
            String wSQL = StringUtils.Format(" Select Name from SysColumns Where id = Object_Id('{0}.dbo.{1}')", wDBName, wTableName);


            List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQL, null);
            foreach (Dictionary<String, Object> wReader in wQueryResultList)
            {
                if (!wReader.ContainsKey("Name") || wResult.Contains(wReader["Name"]))
                    continue;
                wResult.Add(StringUtils.parseString(wReader["Name"]));
            }

            return wResult;
        }


        /**
         * Select数据量查询数据
         * 
         * @param wSQL      查询sql语句 用:/@冒号定义参数
         * @param wParamMap sql参数集
         * @param clazz     返回数据类型 注意sql返回的数据需与实体类型相匹配 不准用简单类型
         * @return
         */
        protected T QueryForObject<T>(String wSQL, Dictionary<String, Object> wParamMap)
        {

            Dictionary<String, Object> wQueryResult = mDBPool.queryForMap(wSQL, wParamMap);

            return JsonTool.JsonToObject<T>(JsonTool.ObjectToJson(wQueryResult));

        }

        public void ExecuteSqlTransaction(List<String> wSqlList)
        {
            if (wSqlList == null || wSqlList.Count <= 0)
                return;
            lock (mLockHelper)
            {
                StringSQLTool.Instance.ExecuteSql(wSqlList, this.mDBPool, 600000);
            }

        }

        public void ExecuteSqlTransaction(String wSqlString)
        {

            String wSQL = this.DMLChange(wSqlString, SQLType);
            StringSQLTool.Instance.ExecuteSqlTransaction(wSQL, this.mDBPool);

        }

        public int GetMaxPrimaryKey(String wTableName, String wKey)
        {
            int wResult = 0;
            if (StringUtils.isEmpty(wTableName) || StringUtils.isEmpty(wKey))
                return wResult;

            String wSQL = StringUtils.Format("Select Max({0}) as ID from {1} ;", wKey, wTableName);
            List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQL, new Dictionary<string, object>());

            foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
            {
                wResult = StringUtils.parseInt(wSqlDataReader["ID"]);
            }
            return wResult;
        }

        private String GetCodePrefix(String wCodePrefix)
        {
            String wResult = wCodePrefix;
            try
            {

                Regex wRegex = new Regex("\\{(?<Column>[^\\}]+)\\}", RegexOptions.IgnoreCase);

                if (wRegex.IsMatch(wCodePrefix))
                {
                    wResult = wRegex.Replace(wCodePrefix, match =>
                    {
                        return DateTime.Now.ToString(match.Groups["Column"].Value);
                    });
                }
            }
            catch (Exception e)
            {
                logger.Error("GetCodePrefix", e);
            }
            return wResult;
        }


        protected String CreateMaxCode(String wTableName, String wPrefix, String wCodeKey, int wD, int _RigthNum = 0)
        {

            int wMaxNum = 0;
            if (wD <= 0 || wD >= 10)
            {
                wD = 7;
            }

            if (wPrefix == null)
            {
                wPrefix = "";
            }
            wPrefix = this.GetCodePrefix(wPrefix);


            if (StringUtils.isEmpty(wTableName) || StringUtils.isEmpty(wCodeKey))
            {
                return StringUtils.Format("{0}{1}", wPrefix, String.Format("{0:D" + wD + "}", wMaxNum + 1));
            }

            String wPrefixOld = wPrefix;
            if (_RigthNum > 0 && _RigthNum < wPrefix.Length)
            {
                wPrefix = wPrefix.Substring(0, wPrefix.Length - _RigthNum);
            }

            String wSQLText = StringUtils.Format("select Max( SUBSTRING( SUBSTRING_INDEX(t.{1},'{2}',-1),{3})  + 0 ) as ItemCount  " +
                                                 "  from {0} t where t.ID>0 AND t.{1} like @Name   ;", wTableName, wCodeKey,
                    wPrefix, 1 + _RigthNum);
            if (StringUtils.isEmpty(wPrefix))
            {

                wSQLText = StringUtils.Format("select Max(t.{1} + 0 ) as ItemCount  from {0} t  where t.ID>0 ;", wTableName,
                        wCodeKey);
            }
            Dictionary<String, Object> wParams = new Dictionary<String, Object>();
            wParams.Add("Name", wPrefix + "%");

            List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParams);

            foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
            {
                wMaxNum = StringUtils.parseInt(wSqlDataReader["ItemCount"]);
            }

            return StringUtils.Format("{0}{1}", wPrefixOld, String.Format("{0:D" + wD + "}", wMaxNum + 1));

        }

        public int Insert(String wTableName, Dictionary<String, Object> wData)
        {

            if (StringUtils.isEmpty(wTableName) || wData == null || wData.Count <= 0)
                return 0;

            List<String> wCloumns = new List<String>();

            List<String> wPData = new List<String>();

            foreach (String wCloumn in wData.Keys)
            {
                wCloumns.Add(wCloumn);
                wPData.Add("@" + wCloumn);
            }

            String wSQL = StringUtils.Format("insert into {0} ({1}) values ({2});", wTableName,
                    StringUtils.Join(",", wCloumns), StringUtils.Join(",", wPData));

            return (int)mDBPool.insert(wSQL, wData);

        }

        public void InsertDB(String wTableName, Dictionary<String, Object> wData)
        {

            if (StringUtils.isEmpty(wTableName) || wData == null || wData.Count <= 0)
                return;

            List<String> wCloumns = new List<String>();

            List<String> wPData = new List<String>();

            foreach (String wCloumn in wData.Keys)
            {
                wCloumns.Add(wCloumn);
                wPData.Add("@" + wCloumn);
            }

            String wSQL = StringUtils.Format("insert into {0} ({1}) values ({2});", wTableName,
                    StringUtils.Join(",", wCloumns), StringUtils.Join(",", wPData));

            mDBPool.insertDB(wSQL, wData);

        }

        public int Update(String wTableName, String wPrimaryKey, Dictionary<String, Object> wData, params String[] wOtherCondition)
        {

            if (StringUtils.isEmpty(wTableName) || StringUtils.isEmpty(wPrimaryKey) || wData == null || wData.Count <= 1
                    || !wData.ContainsKey(wPrimaryKey))
                return 0;

            List<String> wCloumns = new List<String>();

            foreach (String wCloumn in wData.Keys)
            {
                if (wPrimaryKey.Equals(wCloumn))
                    continue;
                wCloumns.Add(wCloumn + " = @" + wCloumn);
            }
            String wCondition = wPrimaryKey + " = @" + wPrimaryKey;

            String wSQL = StringUtils.Format("Update {0} set {1} where {2} {3} ;", wTableName, StringUtils.Join(",", wCloumns),
                    wCondition, (wOtherCondition == null || wOtherCondition.Count() <= 0) ? "" : StringUtils.Join(" ", wOtherCondition));

            return mDBPool.update(wSQL, wData);

        }

        public int Delete(String wTableName, Dictionary<String, Object> wData, params String[] wOtherCondition)
        {

            if (StringUtils.isEmpty(wTableName) || ((wData == null || wData.Count <= 0) && (wOtherCondition == null || wOtherCondition.Length <= 0)))
                return 0;

            List<String> wCloumns = new List<String>();
            if (wData != null)
            {
                foreach (String wCloumn in wData.Keys)
                {

                    wCloumns.Add(wCloumn + " = @" + wCloumn);
                }
            }

            String wSQL = StringUtils.Format("Delete from {0} where {1} {2};", wTableName,
                    StringUtils.Join(" and ", wCloumns), (wOtherCondition == null || wOtherCondition.Count() <= 0) ? "" : StringUtils.Join(" ", wOtherCondition));

            return mDBPool.update(wSQL, wData);

        }

        public String CreateNewName(String wOldName, List<String> wSourceList)
        {
            if (StringUtils.isEmpty(wOldName))
                wOldName = "NewName";

            if (wSourceList == null)
                wSourceList = new List<String>();
            foreach (String wString in wSourceList)
            {

                if (wOldName.Equals(wString, StringComparison.CurrentCultureIgnoreCase))
                {
                    if (wOldName.Length < 4)
                    {
                        wOldName += "-01";
                    }
                    else
                    {
                        string wSuff = wOldName.Substring(wOldName.LastIndexOf('-') + 1);
                        if (StringUtils.isNumeric(wSuff))
                        {
                            int wNum = StringUtils.parseInt(wSuff);
                            wOldName = wOldName.Substring(0, wOldName.LastIndexOf('-') + 1) + String.Format("{0:D2}", wNum + 1);
                        }
                        else
                        {
                            wOldName += "-01";
                        }
                    }
                    wOldName = this.CreateNewName(wOldName, wSourceList);
                    break;
                }
            }

            return wOldName;
        }


        public int GetPageCount(String wCondition, int wPageSize, Dictionary<String, Object> wParamMap)
        {
            String wSQLTextSize = "Select count(0) as ItemCount " + wCondition + ";";
            wSQLTextSize = this.DMLChange(wSQLTextSize);
            Dictionary<String, Object> wQueryResultDic = mDBPool.queryForMap(wSQLTextSize, wParamMap);
            int wSize = 0;
            if (wQueryResultDic != null && wQueryResultDic.ContainsKey("ItemCount"))
            {
                wSize = StringUtils.parseInt(wQueryResultDic["ItemCount"]);
            }
            if (wSize > 0)
                return wSize / wPageSize + (wSize % wPageSize > 0 ? 1 : 0);

            return 0;
        }

        public int GetDataCount(String wCondition, Dictionary<String, Object> wParamMap)
        {
            String wSQLTextSize = "Select count(0) as ItemCount " + wCondition + ";";
            wSQLTextSize = this.DMLChange(wSQLTextSize);
            Dictionary<String, Object> wQueryResultDic = mDBPool.queryForMap(wSQLTextSize, wParamMap);
            int wSize = 0;
            if (wQueryResultDic != null && wQueryResultDic.ContainsKey("ItemCount"))
            {
                wSize = StringUtils.parseInt(wQueryResultDic["ItemCount"]);
            }
            return wSize;
        }


        protected List<String> SelectTableNames(String wSCHEMA, String wTablePrefix)
        {
            List<String> wResult = new List<string>();
            String wSQL = StringUtils.Format("SELECT TABLE_NAME FROM information_schema.tables WHERE TABLE_SCHEMA='{0}' and TABLE_NAME LIKE '{1}%'", wSCHEMA, wTablePrefix);

            List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQL, new Dictionary<String, Object>());

            foreach (var wReader in wQueryResultList)
            {
                wResult.Add(StringUtils.parseString(wReader["TABLE_NAME"]));
            }
            wResult = wResult.Distinct().ToList(); 
            return wResult;
        }

        protected bool IsExitTable(String wSCHEMA, String wTableName)
        {
            bool wResult = false;
            String wSQL = StringUtils.Format("SELECT count(*) as ItemCount FROM information_schema.tables WHERE TABLE_SCHEMA='{0}' and TABLE_NAME = '{1}'", wSCHEMA, wTableName);

            List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQL, new Dictionary<String, Object>());

            foreach (var wReader in wQueryResultList)
            {
                wResult = StringUtils.parseInt(wReader["ItemCount"]) > 0;
            } 
            return wResult;
        }

    }
}
