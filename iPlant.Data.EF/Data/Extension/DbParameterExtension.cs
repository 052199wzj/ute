using System;
using System.Data;
using System.Data.Common;
using Microsoft.Data.SqlClient;
using MySqlConnector;

namespace iPlant.Data.EF.Extension
{
    public static class DbParameterExtension
    {

        /// <summary>
        /// 转换对应的数据库参数
        /// </summary>
        /// <param name="dbParameter">参数</param>
        /// <returns></returns>
        public static DbParameter[] ToDbParameter(DbParameter[] dbParameter,DBEnumType wDbType)
        {
            int i = 0;
            int size = dbParameter.Length;
            DbParameter[] _dbParameter = null;
            switch (wDbType)
            {
                case DBEnumType.SQLServer:
                    _dbParameter = new SqlParameter[size];
                    while (i < size)
                    {
                        _dbParameter[i] = new SqlParameter(dbParameter[i].ParameterName, dbParameter[i].Value);
                        i++;
                    }
                    break;
                case DBEnumType.MySQL:
                    _dbParameter = new MySqlParameter[size];
                    while (i < size)
                    {
                        _dbParameter[i] = new MySqlParameter(dbParameter[i].ParameterName, dbParameter[i].Value);
                        i++;
                    }
                    break;
                default:
                    throw new Exception("数据库类型目前不支持！");
            }
            return _dbParameter;
        }
    }
}
