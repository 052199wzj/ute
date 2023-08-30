using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.Common;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using iPlant.Common.Tools;
using MySql.Data.MySqlClient;
using Microsoft.Data.SqlClient;

namespace iPlant.Data.EF
{
    public static class DbContextExtension
    {
        /// <summary>
        /// 拼接删除SQL语句
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <returns></returns>
        public static string DeleteSql(string tableName)
        {
            StringBuilder strSql = new StringBuilder("UPDATE  " + tableName + " SET IsDelete = 1");
            return strSql.ToString();
        }

        /// <summary>
        /// 拼接删除SQL语句
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="propertyName">实体属性名称</param>
        /// <param name="propertyValue">字段值：数组1,2,3,4,5,6.....</param>
        /// <returns></returns>
        public static string DeleteSql(string tableName, string propertyName, object propertyValue)
        {
            StringBuilder strSql = new StringBuilder("UPDATE  " + tableName + " SET IsDelete = 1  WHERE " + propertyName + " = '" + propertyValue + "'");
            return strSql.ToString();
        }

        /// <summary>
        /// 拼接删除SQL语句
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="propertyName">实体属性名称</param>
        /// <param name="propertyValue">字段值：数组1,2,3,4,5,6.....</param>
        /// <returns></returns>
        public static string DeleteSql(string tableName, Dictionary<String, Object> wParams)
        {
            if (wParams == null || wParams.Count <= 0)
            {
                return DeleteSql(tableName);
            }
            StringBuilder strSql = new StringBuilder("UPDATE  " + tableName + " SET IsDelete = 1  WHERE IsDelete!=1 ");
            foreach (var item in wParams.Keys)
            {
                strSql.Append(" and " + item + " =  '" + wParams[item] + "' ");
            }
            return strSql.ToString();
        }


        /// <summary>
        /// 拼接批量删除SQL语句
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="propertyName">实体属性名称</param>
        /// <param name="propertyValue">字段值：数组1,2,3,4,5,6.....</param>
        /// <returns></returns>
        public static string DeleteSql(string tableName, string propertyName, object[] propertyValue)
        {
            StringBuilder strSql = new StringBuilder("UPDATE  " + tableName + " SET IsDelete =1 WHERE " + propertyName + " IN (");
            for (long i = 0; i < propertyValue.Length; i++)
            {
                if (i == 0)
                {
                    strSql.Append("'" + propertyValue[i] + "'");
                }
                else
                {
                    strSql.Append(",'" + propertyValue[i] + "'");
                }
            }
            strSql.Append(")");
            return strSql.ToString();
        }

        /// <summary>
        /// 获取实体映射对象
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dbcontext"></param>
        /// <returns></returns>
        public static IEntityType GetEntityType<T>(DbContext dbcontext) where T : class
        {
            return dbcontext.Model.FindEntityType(typeof(T));
        }

        /// <summary>
        /// 存储过程语句
        /// </summary>
        /// <param name="procName">存储过程名称</param>
        /// <param name="dbParameter">执行命令所需的sql语句对应参数</param>
        /// <returns></returns>
        public static string BuilderProc(string procName, params DbParameter[] dbParameter)
        {
            StringBuilder strSql = new StringBuilder("exec " + procName);
            if (dbParameter != null)
            {
                foreach (var item in dbParameter)
                {
                    strSql.Append(" " + item + ",");
                }
                strSql = strSql.Remove(strSql.Length - 1, 1);
            }
            return strSql.ToString();
        }

        public static void SetEntityDefaultValue(DbContext dbcontext)
        {
            foreach (EntityEntry entry in dbcontext.ChangeTracker.Entries().Where(p => p.State == EntityState.Added))
            {
                #region 把null设置成对应属性类型的默认值
                Type type = entry.Entity.GetType();
                PropertyInfo[] props = ReflectionTool.Instance.GetPropertyInfos(type);
                foreach (PropertyInfo prop in props)
                {
                    object value = prop.GetValue(entry.Entity, null);
                    if (value == null)
                    {
                        string sType = string.Empty;
                        if (prop.PropertyType.GenericTypeArguments.Length > 0)
                        {
                            sType = prop.PropertyType.GenericTypeArguments[0].Name;
                        }
                        else
                        {
                            sType = prop.PropertyType.Name;
                        }
                        switch (sType)
                        {
                            case "Boolean":
                                prop.SetValue(entry.Entity, false);
                                break;
                            case "Char":
                                prop.SetValue(entry.Entity, 0);
                                break;
                            case "SByte":
                                prop.SetValue(entry.Entity, 0);
                                break;
                            case "Byte":
                                prop.SetValue(entry.Entity, 0);
                                break;
                            case "Int16":
                                prop.SetValue(entry.Entity, 0);
                                break;
                            case "UInt16":
                                prop.SetValue(entry.Entity, 0);
                                break;
                            case "Int32":
                                prop.SetValue(entry.Entity, 0);
                                break;
                            case "UInt32":
                                prop.SetValue(entry.Entity, 0);
                                break;
                            case "Int64":
                                prop.SetValue(entry.Entity, (Int64)0);
                                break;
                            case "UInt64":
                                prop.SetValue(entry.Entity, 0);
                                break;
                            case "Single":
                                prop.SetValue(entry.Entity, 0);
                                break;
                            case "Double":
                                prop.SetValue(entry.Entity, 0);
                                break;
                            case "Decimal":
                                prop.SetValue(entry.Entity, (decimal)0);
                                break;
                            case "DateTime":
                                prop.SetValue(entry.Entity, new DateTime(2000, 1, 1));
                                break;
                            case "String":
                                prop.SetValue(entry.Entity, string.Empty);
                                break;
                            default: break;
                        }
                    }
                    else if (value.ToString() == DateTime.MinValue.ToString())
                    {
                        // sql server datetime类型的的范围不到0001-01-01，所以转成1970-01-01
                        prop.SetValue(entry.Entity, new DateTime(2000, 1, 1));
                    }
                }
                #endregion
            }
        }



        public static DbParameter[] ChangeToDbParameterArray(this Dictionary<String, Object> wParams, DBEnumType wDBEnumType)
        {
            if (wParams == null || wParams.Count <= 0)
            {
                return new DbParameter[0];
            }

            List<DbParameter> wResult = new List<DbParameter>();

            DbParameter wDbParameter = null;

            foreach (var wKey in wParams.Keys)
            {
                wDbParameter = null;
                if (StringUtils.isEmpty(wKey))
                    continue;
                if (wParams[wKey] == null)
                    wParams[wKey] = "";

                switch (wDBEnumType)
                {
                    case DBEnumType.Default:
                        break;
                    case DBEnumType.MySQL:
                        wDbParameter = new MySqlParameter()
                        {
                            ParameterName = wKey,
                            Value = wParams[wKey]
                        };
                        break;
                    case DBEnumType.SQLServer:
                        wDbParameter = new SqlParameter()
                        {
                            ParameterName = wKey,
                            Value = wParams[wKey]
                        };
                        break;
                    case DBEnumType.Oracle:
                        break;
                    default:
                        break;
                }
                if (wDbParameter == null)
                {
                    continue;
                }
                wResult.Add(wDbParameter);
            }

            return wResult.ToArray();

        }


        public static Object[] ChangeToObjectArray<T>(this T[] wValue)
        {
            if (wValue == null || wValue.Length <= 0)
                return new Object[0];

            List<Object> wResult = new List<object>();

            foreach (T item in wValue)
            {
                wResult.Add(item);
            }
            return wResult.ToArray();
        }

        public static Object[] ChangeToObjectArray<T>(this List<T> wValue)
        {
            if (wValue == null || wValue.Count <= 0)
                return new Object[0];

            List<Object> wResult = new List<object>();

            foreach (T item in wValue)
            {
                wResult.Add(item);
            }
            return wResult.ToArray();
        }
        public static List<Object> ChangeToObjectList<T>(this T[] wValue)
        {
            List<Object> wResult = new List<object>();
            if (wValue == null || wValue.Length <= 0)
                return wResult;
            foreach (T item in wValue)
            {
                wResult.Add(item);
            }
            return wResult;
        }

        public static List<Object> ChangeToObjectList<T>(this List<T> wValue)
        {
            List<Object> wResult = new List<object>();
            if (wValue == null || wValue.Count <= 0)
                return wResult;
            foreach (T item in wValue)
            {
                wResult.Add(item);
            }
            return wResult;
        }
    }
}
