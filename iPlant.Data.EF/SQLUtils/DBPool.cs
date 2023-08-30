using iPlant.Common.Tools;
using iPlant.Data.EF.Extension;
using iPlant.Data.EF.Repository;
using Microsoft.Data.SqlClient;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Common;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.Data.EF
{
    public class DBPool
    {


        public DBPool(DBEnumType wSqlType, String wConnnectString)
        {
            SqlType = wSqlType;
            ConnnectString = wConnnectString;
        }
        public DBEnumType SqlType { get; private set; } = DBEnumType.MySQL;


        public String ConnnectString { get; private set; }


        public DbConnection GetConnection()
        {
            DbConnection wResult = null;

            switch (SqlType)
            {
                case DBEnumType.Default:
                    break;
                case DBEnumType.MySQL:
                    wResult = new MySqlConnection(ConnnectString);
                    break;
                case DBEnumType.SQLServer:
                    wResult = new SqlConnection(ConnnectString);
                    break;
                case DBEnumType.Oracle:
                    break;
                default:
                    break;
            }

            if (wResult == null)
            {
                wResult = new MySqlConnection(ConnnectString);
            }
            wResult.Open();
            return wResult;
        }


        public int MaxConnection
        {

            get
            {
                int wResult = 0;
                String wSQL = "";

                switch (SqlType)
                {
                    case DBEnumType.SQLServer:
                        wSQL = "SELECT [Value] FROM sys.configurations c WHERE c.name = 'user connections' ";
                        break;
                    case DBEnumType.MySQL:
                    case DBEnumType.Oracle:
                    case DBEnumType.Access:
                    default:
                        wSQL = "show variables like '%max_connection%' ";
                        break;
                }
                Dictionary<String, Object> wReader = this.queryForMap(wSQL, null);

                if (wReader.ContainsKey("Value"))
                {
                    wResult = StringUtils.parseInt(wReader["Value"]);
                }

                return wResult;
            }
        }

        public int CurrentConnection
        {

            get
            {
                int wResult = 0;
                String wSQL = "";

                switch (SqlType)
                {
                    case DBEnumType.SQLServer:
                        wSQL = " SELECT  COUNT(ec.session_id) AS [Value] FROM sys.dm_exec_sessions AS es INNER JOIN sys.dm_exec_connections AS ec ON es.session_id = ec.session_id ";
                        break;
                    case DBEnumType.MySQL:
                    case DBEnumType.Oracle:
                    case DBEnumType.Access:
                    default:
                        wSQL = "show status like 'Threads_connected%' ";
                        break;
                }
                Dictionary<String, Object> wReader = this.queryForMap(wSQL, null);

                if (wReader.ContainsKey("Value"))
                {
                    wResult = StringUtils.parseInt(wReader["Value"]);
                }

                return wResult;
            }
        }


        public List<Dictionary<String, Object>> queryForList(String wSQL, Dictionary<String, Object> wParamMap)
        {
            List<Dictionary<String, Object>> wResult = new List<Dictionary<string, object>>();
            using (DbConnection wConnection = this.GetConnection())
            {

                CommandTool wCommandTool = new CommandTool(wSQL, wConnection);
                wCommandTool.SetParams(wParamMap);
                using (DbDataReader wSqlDataReader = wCommandTool.ExecuteReader())
                {
                    Dictionary<String, Object> wData = null;
                    while (wSqlDataReader.Read())
                    {
                        wData = new Dictionary<String, Object>();

                        for (int i = 0; i < wSqlDataReader.FieldCount; i++)
                        {
                            if (!wData.ContainsKey(wSqlDataReader.GetName(i)))
                                wData.Add(wSqlDataReader.GetName(i), wSqlDataReader.GetValue(i));
                        }


                        wResult.Add(wData);
                    }
                }
            }

            return wResult;

        }


        private void PrevQueryForList(String wSQL, Dictionary<String, Object> wParamMap, Pagination pagination)
        {
            if (pagination.PageFuzzy == 1)
            {
                this.PrevFuzzyQueryForList(wSQL, wParamMap, pagination);
            }
            else
            { 
               this.PrevAccurateQueryForList(wSQL, wParamMap, pagination);
            }
        }

        private void PrevAccurateQueryForList(String wSQL, Dictionary<String, Object> wParamMap, Pagination pagination)
        {

            using (DbConnection wConnection = this.GetConnection())
            {

                CommandTool wCommandTool = new CommandTool("SELECT COUNT(0) as ItemCount FROM (" + wSQL + ") CountTable;", wConnection);
                wCommandTool.SetParams(wParamMap);
                wCommandTool.CommandTimeout = 0;

                using (DbDataReader wSqlDataReader = wCommandTool.ExecuteReader())
                {

                    while (wSqlDataReader.Read())
                    {

                        for (int i = 0; i < wSqlDataReader.FieldCount; i++)
                        {
                            if (wSqlDataReader.GetName(i).Equals("ItemCount"))
                                pagination.TotalCount = StringUtils.parseInt(wSqlDataReader.GetValue(i));
                        }

                        break;
                    }
                }
            }

        }
        private void PrevFuzzyQueryForList(String wSQL, Dictionary<String, Object> wParamMap, Pagination pagination)
        {

            using (DbConnection wConnection = this.GetConnection())
            {

                CommandTool wCommandTool = new CommandTool("explain " + wSQL , wConnection);
                wCommandTool.SetParams(wParamMap);

                int wCount = 0;
                using (DbDataReader wSqlDataReader = wCommandTool.ExecuteReader())
                {

                    while (wSqlDataReader.Read())
                    {

                        for (int i = 0; i < wSqlDataReader.FieldCount; i++)
                        {
                            if (wSqlDataReader.GetName(i).Equals("rows")) {

                                wCount = StringUtils.parseInt(wSqlDataReader.GetValue(i));

                                if (wCount > pagination.TotalCount)
                                    pagination.TotalCount = wCount;
                            }
                                 
                        }

                        break;
                    }
                }
            }

        }



        public List<Dictionary<String, Object>> queryForList(String wSQL, Dictionary<String, Object> wParamMap, Pagination pagination)
        {
            if (pagination == null)
                return queryForList(wSQL, wParamMap);

            List<Dictionary<String, Object>> wResult = new List<Dictionary<string, object>>();

            this.PrevQueryForList(wSQL, wParamMap, pagination);
            if (pagination.TotalCount <= 0)
                return new List<Dictionary<string, object>>();

            using (DbConnection wConnection = this.GetConnection())
            {
                StringBuilder sb = new StringBuilder();
                sb.Append(DatabasePageExtension.SqlPageSql(wSQL, SqlType, pagination.Sort, pagination.SortType, pagination.PageSize, pagination.PageIndex));

                CommandTool wCommandTool = new CommandTool(sb.ToString(), wConnection);
                
                wCommandTool.SetParams(wParamMap);
                wCommandTool.CommandTimeout = 0;

                using (DbDataReader wSqlDataReader = wCommandTool.ExecuteReader())
                {
                    Dictionary<String, Object> wData = null;
                    while (wSqlDataReader.Read())
                    {
                        wData = new Dictionary<String, Object>();

                        for (int i = 0; i < wSqlDataReader.FieldCount; i++)
                        {
                            if (!wData.ContainsKey(wSqlDataReader.GetName(i)))
                                wData.Add(wSqlDataReader.GetName(i), wSqlDataReader.GetValue(i));
                        }


                        wResult.Add(wData);
                    }
                }

                if (pagination.PageFuzzy==1&& wResult.Count < pagination.PageSize&& pagination.PageIndex< pagination.TotalPage) {

                    if (pagination.PageIndex < 1)
                        pagination.PageIndex = 1;

                    pagination.TotalCount = (pagination.PageIndex - 1) * pagination.PageSize + wResult.Count; 
                }
            }





            return wResult;

        }

 
        public List<T> queryForList<T>(String wSQL, Dictionary<String, Object> wParamMap, Pagination pagination)
        {
            List<Dictionary<String, Object>> wResult = queryForList(wSQL, wParamMap, pagination);

            return CloneTool.CloneArray<T>(wResult);
        }

        public List<T> queryForList<T>(String wSQL, Dictionary<String, Object> wParamMap)
        {
            List<Dictionary<String, Object>> wResult = queryForList(wSQL, wParamMap);

            return CloneTool.CloneArray<T>(wResult);
        }



        public Dictionary<String, Object> queryForMap(String wSQL, Dictionary<String, Object> wParamMap)
        {
            Dictionary<String, Object> wResult = new Dictionary<string, object>();
            using (DbConnection wConnection = this.GetConnection())
            {

                CommandTool wCommandTool = new CommandTool(wSQL, wConnection);
                wCommandTool.SetParams(wParamMap);

                using (DbDataReader wSqlDataReader = wCommandTool.ExecuteReader())
                {

                    while (wSqlDataReader.Read())
                    {

                        for (int i = 0; i < wSqlDataReader.FieldCount; i++)
                        {
                            wResult.Add(wSqlDataReader.GetName(i), wSqlDataReader.GetValue(i));
                        }

                        break;
                    }
                }
            }

            return wResult;

        }


        public long insert(String wSQL, Dictionary<String, Object> wParamMap)
        {
            long wResult = 0;

            wSQL = StringUtils.trim(wSQL);
            if (StringUtils.isEmpty(wSQL))
            {
                return wResult;
            }
            if (!wSQL.EndsWith(";"))
                wSQL += ";";


            using (DbConnection wConnection = this.GetConnection())
            {
                Boolean wQuery = false;
                switch (SqlType)
                {
                    case DBEnumType.Default:
                        break;
                    case DBEnumType.MySQL:
                        wSQL += "SELECT LAST_INSERT_ID() AS ID;";
                        wQuery = true;
                        break;
                    case DBEnumType.SQLServer:
                        wSQL += "SELECT @@IDENTITY AS ID;";
                        wQuery = true;
                        break;
                    case DBEnumType.Oracle:
                        break;
                    case DBEnumType.Access:
                        break;
                    default:
                        break;
                }
                CommandTool wCommandTool = new CommandTool(wSQL, wConnection);
                wCommandTool.SetParams(wParamMap);
                if (!wQuery)
                {
                    wCommandTool.ExecuteNonQuery();
                    return wResult;
                }
                using (DbDataReader wSqlDataReader = wCommandTool.ExecuteReader())
                {

                    while (wSqlDataReader.Read())
                    {

                        wResult = StringUtils.parseLong(wSqlDataReader["ID"]);

                        break;
                    }
                }
            }

            return wResult;
        }


        public int insertDB(String wSQL, Dictionary<String, Object> wParamMap)
        {
            int wRows = 0;
            wSQL = StringUtils.trim(wSQL);
            if (StringUtils.isEmpty(wSQL))
            {
                return wRows;
            }
            if (!wSQL.EndsWith(";"))
                wSQL += ";";


            using (DbConnection wConnection = this.GetConnection())
            {

                CommandTool wCommandTool = new CommandTool(wSQL, wConnection);
                wCommandTool.SetParams(wParamMap);

                wRows = wCommandTool.ExecuteNonQuery();
            }
            return wRows;
        }


        public int update(String wSQL, Dictionary<String, Object> wParamMap, int wCommandTimeout = 0)
        {
            int wRows = 0;
            wSQL = StringUtils.trim(wSQL);
            if (StringUtils.isEmpty(wSQL))
            {
                return wRows;
            }
            if (!wSQL.EndsWith(";"))
                wSQL += ";";


            using (DbConnection wConnection = this.GetConnection())
            {

                CommandTool wCommandTool = new CommandTool(wSQL, wConnection);
                wCommandTool.SetParams(wParamMap);
                if (wCommandTimeout > 0)
                {
                    wCommandTool.CommandTimeout = wCommandTimeout;
                }
                wRows = wCommandTool.ExecuteNonQuery();

            }
            return wRows;
        }

    }

}
