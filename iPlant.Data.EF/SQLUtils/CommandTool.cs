using iPlant.Common.Tools;
using log4net;
using Microsoft.Data.SqlClient;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.Data.EF
{
    public class CommandTool
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(CommandTool));

        #region  Property Define
        private DbCommand DbCommand = null;

        private String mCommandText = "";

        public String CommandText
        {
            get
            {
                if (DbCommand == null)
                    return mCommandText;
                else
                    return DbCommand.CommandText;
            }
            set
            {
                mCommandText = value;

                if (DbCommand != null)
                {
                    switch (SqlType)
                    {
                        case DBEnumType.Default:
                            break;
                        case DBEnumType.MySQL:
                            break;
                        case DBEnumType.SQLServer:
                            mCommandText = DMLTool.ChangeToSqlServer(mCommandText);
                            break;
                        case DBEnumType.Oracle:
                            break;
                        default:
                            break;
                    }

                    DbCommand.CommandText = mCommandText;
                }



            }
        }

        private CommandType mCommandType = CommandType.Text;

        public CommandType CommandType
        {
            get
            {
                if (DbCommand == null)
                    return mCommandType;

                return DbCommand.CommandType;
            }
            set
            {
                mCommandType = value;
                if (DbCommand != null)
                    DbCommand.CommandType = mCommandType;
            }
        }

        public DbConnection Connection
        {
            get
            {
                if (DbCommand == null)
                    return null;
                return DbCommand.Connection;
            }
            set
            {
                if (value is MySqlConnection)
                {
                    SqlType = DBEnumType.MySQL;
                }
                else if (value is SqlConnection)
                {
                    SqlType = DBEnumType.SQLServer;
                }
                else if (value is MySqlConnection)
                {
                    SqlType = DBEnumType.Oracle;
                }
                else
                {
                    SqlType = DBEnumType.MySQL;
                }

                switch (SqlType)
                {
                    case DBEnumType.Default:
                        break;
                    case DBEnumType.MySQL:
                        DbCommand = new MySqlCommand(mCommandText, (MySqlConnection)value);
                        
                        break;
                    case DBEnumType.SQLServer:
                        mCommandText = DMLTool.ChangeToSqlServer(mCommandText);
                        DbCommand = new SqlCommand(mCommandText, (SqlConnection)value);
                        break;
                    case DBEnumType.Oracle:
                        break;
                    default:
                        break;
                }
            }
        }

        public int CommandTimeout
        {
            set
            {
                DbCommand.CommandTimeout = value;
            }
            get
            {
                return DbCommand.CommandTimeout;
            }
        }

        private DBEnumType SqlType = DBEnumType.Default;
        #endregion

        #region 构造函数
        public CommandTool() { }

        public CommandTool(String wCommandText, DbConnection wConnection)
        {
            Connection = wConnection;
            CommandText = wCommandText;

        }
        #endregion

        public void Clear()
        {
            if (DbCommand == null)
                return;
            DbCommand.Parameters.Clear();
        }

        public long LastInsertID
        {

            get
            {
                long wResult = 0;
                switch (SqlType)
                {
                    case DBEnumType.Default:
                        break;
                    case DBEnumType.MySQL:
                        wResult = ((MySqlCommand)DbCommand).LastInsertedId;
                        break;
                    case DBEnumType.SQLServer:


                        break;
                    case DBEnumType.Oracle:
                        break;
                    default:
                        break;
                }
                return wResult;
            }
        }

        public void AddWithValue(String wParamName, Object wValue)
        {
            if (DbCommand == null)
                return;
            wValue = ChangeParamValue(wValue);
            switch (SqlType)
            {
                case DBEnumType.Default:
                    break;
                case DBEnumType.MySQL:
                    ((MySqlCommand)DbCommand).Parameters.AddWithValue(wParamName, wValue);
                    break;
                case DBEnumType.SQLServer:
                    ((SqlCommand)DbCommand).Parameters.AddWithValue(wParamName, wValue);

                    break;
                case DBEnumType.Oracle:
                    break;
                default:
                    break;
            }
        }


        public void SetParams(Dictionary<String, Object> wParams)
        {
            if (wParams == null || wParams.Count <= 0)
                return;
            this.Clear();
            foreach (String wKey in wParams.Keys)
            {
                if (StringUtils.isEmpty(wKey))
                    continue;
                if (wParams[wKey] == null)
                    wParams[wKey] = "";

                this.AddWithValue(wKey, wParams[wKey]);
            }
        }
        public Object ChangeParamValue(Object wParamValue)
        {
            if (wParamValue is DateTime)
            {
                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if (wParamValue == null || (DateTime)wParamValue < wBaseTime)
                {
                    wParamValue = wBaseTime;
                }
            }
            if (wParamValue == null)
            {
                return DBNull.Value;
            }
            return wParamValue;
        }
        public DbParameter Add(String wParamName, int wDbType)
        {
            DbParameter wDbParameter = null;

            if (DbCommand == null)
                return wDbParameter;


            switch (SqlType)
            {
                case DBEnumType.Default:
                    break;
                case DBEnumType.MySQL:
                    wDbParameter = ((MySqlCommand)DbCommand).Parameters.Add(wParamName, (MySqlDbType)wDbType);
                    break;
                case DBEnumType.SQLServer:
                    wDbParameter = ((SqlCommand)DbCommand).Parameters.Add(wParamName, (SqlDbType)wDbType);
                    break;
                case DBEnumType.Oracle:
                    break;
                default:
                    break;
            }
            return wDbParameter;
        }


        public void Add(String wParamName, int wDbType, int wNum, ParameterDirection wDirection)
        {
            if (DbCommand == null)
                return;

            switch (SqlType)
            {
                case DBEnumType.Default:
                    break;
                case DBEnumType.MySQL:
                    ((MySqlCommand)DbCommand).Parameters.Add(wParamName, (MySqlDbType)wDbType, wNum);
                    ((MySqlCommand)DbCommand).Parameters[wParamName].Direction = wDirection;
                    break;
                case DBEnumType.SQLServer:
                    ((SqlCommand)DbCommand).Parameters.Add(wParamName, (SqlDbType)wDbType, wNum);
                    ((SqlCommand)DbCommand).Parameters[wParamName].Direction = wDirection;
                    break;
                case DBEnumType.Oracle:
                    break;
                default:
                    break;
            }
        }

        public void AddOutResult(String wParamName)
        {
            if (DbCommand == null)
                return;

            switch (SqlType)
            {
                case DBEnumType.Default:
                    break;
                case DBEnumType.MySQL:
                    ((MySqlCommand)DbCommand).Parameters.Add(wParamName, MySqlDbType.VarChar, 96);
                    ((MySqlCommand)DbCommand).Parameters[wParamName].Direction = ParameterDirection.Output;
                    break;
                case DBEnumType.SQLServer:
                    ((SqlCommand)DbCommand).Parameters.Add(wParamName, SqlDbType.NVarChar, 96);
                    ((SqlCommand)DbCommand).Parameters[wParamName].Direction = ParameterDirection.Output;
                    break;
                case DBEnumType.Oracle:
                    break;
                default:
                    break;
            }
        }

        public Object GetParam(String wParamName)
        {
            Object wValue = null;

            if (DbCommand == null)
                return wValue;

            switch (SqlType)
            {
                case DBEnumType.Default:
                    break;
                case DBEnumType.MySQL:
                    wValue = ((MySqlCommand)DbCommand).Parameters[wParamName].Value;
                    break;
                case DBEnumType.SQLServer:
                    wValue = ((SqlCommand)DbCommand).Parameters[wParamName].Value;
                    break;
                case DBEnumType.Oracle:
                    break;
                default:
                    break;
            }
            return wValue;
        }

        public DbDataReader ExecuteReader()
        {
            DbDataReader wValue = null;
            if (DbCommand == null)
                return wValue;

            switch (SqlType)
            {
                case DBEnumType.Default:
                    break;
                case DBEnumType.MySQL:
                    wValue = ((MySqlCommand)DbCommand).ExecuteReader();
                    break;
                case DBEnumType.SQLServer:
                    wValue = ((SqlCommand)DbCommand).ExecuteReader();
                    break;
                case DBEnumType.Oracle:
                    break;
                default:
                    break;
            }
            return wValue;
        }

        public int ExecuteNonQuery()
        {
            int wValue = 0;

            if (DbCommand == null)
                return wValue;

            switch (SqlType)
            {
                case DBEnumType.Default:
                    break;
                case DBEnumType.MySQL:
                    wValue = ((MySqlCommand)DbCommand).ExecuteNonQuery();
                    break;
                case DBEnumType.SQLServer:
                    wValue = ((SqlCommand)DbCommand).ExecuteNonQuery();
                    break;
                case DBEnumType.Oracle:
                    break;
                default:
                    break;
            }
            return wValue;
        }
    }
}
