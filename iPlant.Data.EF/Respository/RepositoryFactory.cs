
using iPlant.Common.Tools;
using iPlant.Data.EF;
using System;
using System.Collections.Generic;

namespace iPlant.Data.EF.Repository
{
    public class RepositoryFactory
    {

        private static LockHelper mLockHelper = new LockHelper();

        public static Dictionary<DBEnumType, DBPool> DBPoolDic = new Dictionary<DBEnumType, DBPool>();
        public static Dictionary<String, String> DBConnectionStringDic
        {
            get
            {

                return GlobalConstant.DBConnectionStringDic;
            }
        }


        public static int DBCommandTimeOut
        {
            get
            {

                return GlobalConstant.DBCommandTimeOut;
            }
        }

        public static int DBSlowSqlLogTime
        {
            get
            {

                return GlobalConstant.DBSlowSqlLogTime;
            }
        }


        public static DBEnumType DefaultDbType
        {
            get
            {
                DBEnumType wResult;
                switch (GlobalConstant.DefaultDbType.ToLower())
                {
                    case "mysql":
                        wResult = DBEnumType.MySQL;
                        break;
                    case "sqlserver":
                        wResult = DBEnumType.SQLServer;
                        break;
                    case "oracle":
                        wResult = DBEnumType.Oracle;
                        break;
                    case "access":
                        wResult = DBEnumType.Access;
                        break;
                    default:
                        wResult = DBEnumType.Default;
                        break;
                }

                return wResult;
            }
        }

        public static Repository GetRepository()
        {
            return GetRepository(DefaultDbType);
        }

        public static Repository GetRepository(DBEnumType wDBEnumType)
        {

            string dbType = EnumTool.GetEnumDesc(wDBEnumType);
            string dbConnectionString = DBConnectionStringDic[dbType];

            IDatabase database = new iPlantDatabase(wDBEnumType, dbConnectionString);

            return new Repository(database);
        }


        public static DBPool GetDBPool(DBEnumType wSQLType = DBEnumType.Default)
        {

            lock (mLockHelper)
            {
                if (wSQLType == DBEnumType.Default)
                    wSQLType = DefaultDbType;

                if (!DBPoolDic.ContainsKey(wSQLType))
                {
                    string dbType = EnumTool.GetEnumDesc(wSQLType);
                    string dbConnectionString = DBConnectionStringDic[dbType];
                    DBPoolDic.Add(wSQLType, new DBPool(wSQLType, dbConnectionString));
                }
                return DBPoolDic[wSQLType];
            }

        }

        public RepositoryFactory(DBEnumType wSQLType)
        {
            SQLType = wSQLType;

            mDBPool = GetDBPool(wSQLType);
        }

        public DBPool mDBPool { get; private set; }
        protected DBEnumType SQLType { get; private set; }

        public Repository BaseRepository()
        {

            string dbConnectionString = DBConnectionStringDic[EnumTool.GetEnumDesc(SQLType)];

            IDatabase database = new iPlantDatabase(SQLType, dbConnectionString);

            return new Repository(database);
        }

        public Repository mRepository
        {
            get
            {
                string dbConnectionString = DBConnectionStringDic[EnumTool.GetEnumDesc(SQLType)];

                IDatabase database = new iPlantDatabase(SQLType, dbConnectionString);

                return new Repository(database);
            }
        }

    }
}
