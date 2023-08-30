using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage;
using iPlant.Data.EF.Extension;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using iPlant.Common.Tools;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore.Diagnostics;
using iPlant.Data.EF.Repository;

namespace iPlant.Data.EF
{
    public class iPlantDatabase : IDatabase
    {
        #region 构造函数
        /// <summary>
        /// 构造方法
        /// </summary>
        public iPlantDatabase(DBEnumType wDbType, string connString)
        {
            _DbType = wDbType;
            _ConnectionString = connString;
            dbContext = new iPlantDbContext(wDbType, connString);



        }

        private DBEnumType _DbType = DBEnumType.Default;


        private string _ConnectionString = "";


        #endregion

        #region 属性
        /// <summary>
        /// 获取 当前使用的数据访问上下文对象
        /// </summary>
        public DbContext dbContext { get; }
        /// <summary>
        /// 事务对象
        /// </summary>
        public IDbContextTransaction dbContextTransaction { get; set; }

        public string ConnectionString { get { return _ConnectionString; } }

        public DBEnumType DbType { get { return _DbType; } }


        #endregion

        #region 事务提交
        /// <summary>
        /// 事务开始
        /// </summary>
        /// <returns></returns>
        public async Task<IDatabase> BeginTrans()
        {
            DbConnection dbConnection = dbContext.Database.GetDbConnection();
            if (dbConnection.State == ConnectionState.Closed)
            {
                await dbConnection.OpenAsync();
            }
            dbContextTransaction = await dbContext.Database.BeginTransactionAsync();
            return this;
        }
        /// <summary>
        /// 提交当前操作的结果
        /// </summary>
        public async Task<int> CommitTrans()
        {
            try
            {
                DbContextExtension.SetEntityDefaultValue(dbContext);

                int returnValue = await dbContext.SaveChangesAsync();
                if (dbContextTransaction != null)
                {
                    await dbContextTransaction.CommitAsync();
                    await this.Close();
                }
                else
                {
                    await this.Close();
                }
                return returnValue;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                if (dbContextTransaction == null)
                {
                    await this.Close();
                }
            }
        }
        /// <summary>
        /// 把当前操作回滚成未提交状态
        /// </summary>
        public async Task RollbackTrans()
        {
            await this.dbContextTransaction.RollbackAsync();
            await this.dbContextTransaction.DisposeAsync();
            await this.Close();
        }
        /// <summary>
        /// 关闭连接 内存回收
        /// </summary>
        public async Task Close()
        {
            await dbContext.DisposeAsync();
        }
        #endregion

        #region 执行 SQL 语句
        public async Task<int> ExecuteBySql(string strSql)
        {
            if (dbContextTransaction == null)
            {
                return await dbContext.Database.ExecuteSqlRawAsync(strSql);
            }
            else
            {
                await dbContext.Database.ExecuteSqlRawAsync(strSql);
                return dbContextTransaction == null ? await this.CommitTrans() : 0;
            }
        }
        public async Task<int> ExecuteBySql(string strSql, params DbParameter[] dbParameter)
        {
            if (dbContextTransaction == null)
            {
                return await dbContext.Database.ExecuteSqlRawAsync(strSql, dbParameter);
            }
            else
            {
                await dbContext.Database.ExecuteSqlRawAsync(strSql, dbParameter);
                return dbContextTransaction == null ? await this.CommitTrans() : 0;
            }
        }

        public async Task<int> ExecuteBySql(string strSql, Dictionary<String, Object> wParams)
        {
            if (wParams == null)
                wParams = new Dictionary<string, object>();
            DbParameter[] dbParameter = wParams.ChangeToDbParameterArray(_DbType);
            return await this.ExecuteBySql(strSql, dbParameter);
        }


        public async Task<int> ExecuteByProc(string procName)
        {
            if (dbContextTransaction == null)
            {
                return await dbContext.Database.ExecuteSqlRawAsync(DbContextExtension.BuilderProc(procName));
            }
            else
            {
                await dbContext.Database.ExecuteSqlRawAsync(DbContextExtension.BuilderProc(procName));
                return dbContextTransaction == null ? await this.CommitTrans() : 0;
            }
        }
        public async Task<int> ExecuteByProc(string procName, params DbParameter[] dbParameter)
        {
            if (dbContextTransaction == null)
            {
                return await dbContext.Database.ExecuteSqlRawAsync(DbContextExtension.BuilderProc(procName, dbParameter), dbParameter);
            }
            else
            {
                await dbContext.Database.ExecuteSqlRawAsync(DbContextExtension.BuilderProc(procName, dbParameter), dbParameter);
                return dbContextTransaction == null ? await this.CommitTrans() : 0;
            }
        }
        public async Task<int> ExecuteByProc(string procName, Dictionary<String, Object> wParams)
        {
            if (wParams == null)
                wParams = new Dictionary<string, object>();
            DbParameter[] dbParameter = wParams.ChangeToDbParameterArray(_DbType);
            return await this.ExecuteByProc(procName, dbParameter);
        }



        #endregion

        #region 对象实体 添加、修改、删除
        public async Task<int> Insert<T>(T entity) where T : class
        {
            dbContext.Entry<T>(entity).State = EntityState.Added;
            return dbContextTransaction == null ? await this.CommitTrans() : 0;
        }
        public async Task<int> Insert<T>(IEnumerable<T> entities) where T : class
        {
            foreach (var entity in entities)
            {
                dbContext.Entry<T>(entity).State = EntityState.Added;
            }
            return dbContextTransaction == null ? await this.CommitTrans() : 0;
        }

        public async Task<int> Delete<T>() where T : class
        {
            IEntityType entityType = DbContextExtension.GetEntityType<T>(dbContext);
            if (entityType != null)
            {
                string tableName = entityType.GetTableName();
                return await this.ExecuteBySql(DbContextExtension.DeleteSql(tableName));
            }
            return -1;
        }
        public async Task<int> Delete<T>(T entity) where T : class
        {
            dbContext.Set<T>().Attach(entity);
            dbContext.Set<T>().Remove(entity);
            return dbContextTransaction == null ? await this.CommitTrans() : 0;
        }
        public async Task<int> Delete<T>(IEnumerable<T> entities) where T : class
        {
            foreach (var entity in entities)
            {
                dbContext.Set<T>().Attach(entity);
                dbContext.Set<T>().Remove(entity);
            }
            return dbContextTransaction == null ? await this.CommitTrans() : 0;
        }
        public async Task<int> Delete<T>(Expression<Func<T, bool>> condition) where T : class, new()
        {
            IEnumerable<T> entities = await dbContext.Set<T>().Where(condition).ToListAsync();
            return entities.Count() > 0 ? await Delete(entities) : 0;
        }
        public async Task<int> Delete<T>(Guid keyValue) where T : class
        {
            IEntityType entityType = DbContextExtension.GetEntityType<T>(dbContext);
            if (entityType != null)
            {
                string tableName = entityType.GetTableName();
                string keyField = "Id";
                return await this.ExecuteBySql(DbContextExtension.DeleteSql(tableName, keyField, keyValue));
            }
            return -1;
        }


        public async Task<int> Delete<T>(Int64 keyValue) where T : class
        {
            IEntityType entityType = DbContextExtension.GetEntityType<T>(dbContext);
            if (entityType != null)
            {
                string tableName = entityType.GetTableName();
                entityType.FindPrimaryKey().GetName();
                string keyField = "ID";
                return await this.ExecuteBySql(DbContextExtension.DeleteSql(tableName, keyField, keyValue));
            }
            return -1;
        }


        public async Task<int> Delete<T>(string propertyName, object propertyValue) where T : class
        {
            IEntityType entityType = DbContextExtension.GetEntityType<T>(dbContext);
            if (entityType != null)
            {
                string tableName = entityType.GetTableName();
                return await this.ExecuteBySql(DbContextExtension.DeleteSql(tableName, propertyName, propertyValue));
            }
            return -1;
        }

        public async Task<int> Delete<T>(Dictionary<String, Object> wParmas) where T : class
        {
            IEntityType entityType = DbContextExtension.GetEntityType<T>(dbContext);
            if (entityType != null)
            {
                string tableName = entityType.GetTableName();

                return await this.ExecuteBySql(DbContextExtension.DeleteSql(tableName, wParmas));
            }
            return -1;
        }

        public async Task<int> Delete<T>(Guid[] keyValue) where T : class
        {
            IEntityType entityType = DbContextExtension.GetEntityType<T>(dbContext);
            if (entityType != null)
            {
                string tableName = entityType.GetTableName();
                string keyField = "Id";



                return await this.ExecuteBySql(DbContextExtension.DeleteSql(tableName, keyField, keyValue.ChangeToObjectArray()));
            }
            return -1;
        }

        public async Task<int> Delete<T>(Int32[] keyValue) where T : class
        {
            IEntityType entityType = DbContextExtension.GetEntityType<T>(dbContext);
            if (entityType != null)
            {
                string tableName = entityType.GetTableName();
                string keyField = "ID";
                return await this.ExecuteBySql(DbContextExtension.DeleteSql(tableName, keyField, keyValue.ChangeToObjectArray()));
            }
            return -1;
        }


        public async Task<int> Delete<T>(Int64[] keyValue) where T : class
        {
            IEntityType entityType = DbContextExtension.GetEntityType<T>(dbContext);
            if (entityType != null)
            {
                string tableName = entityType.GetTableName();
                string keyField = "ID";
                return await this.ExecuteBySql(DbContextExtension.DeleteSql(tableName, keyField, keyValue.ChangeToObjectArray()));
            }
            return -1;
        }


        public async Task<int> Update<T>(T entity) where T : class
        {
            IEntityType entityType = DbContextExtension.GetEntityType<T>(dbContext);

            dbContext.Set<T>().Attach(entity);
            Dictionary<string, object> props = DatabasesExtension.GetPropertyInfo<T>(entity);
            foreach (string item in props.Keys)
            {
                if (item == "Id" || item == "ID" || item == "id")
                {
                    continue;
                }
                object value = dbContext.Entry(entity).Property(item).CurrentValue;
                if (value != null)
                {
                    dbContext.Entry(entity).Property(item).IsModified = true;
                }
            }
            return dbContextTransaction == null ? await this.CommitTrans() : 0;
        }
        public async Task<int> Update<T>(IEnumerable<T> entities) where T : class
        {
            foreach (var entity in entities)
            {
                await this.Update(entity);
            }
            return dbContextTransaction == null ? await this.CommitTrans() : 0;
        }
        public async Task<int> UpdateAllField<T>(T entity) where T : class
        {
            dbContext.Set<T>().Attach(entity);
            dbContext.Entry(entity).State = EntityState.Modified;
            return dbContextTransaction == null ? await this.CommitTrans() : 0;
        }
        public async Task<int> Update<T>(Expression<Func<T, bool>> condition) where T : class, new()
        {
            IEnumerable<T> entities = await dbContext.Set<T>().Where(condition).ToListAsync();
            return entities.Count() > 0 ? await Update(entities) : 0;
        }

        public IQueryable<T> IQueryable<T>(Expression<Func<T, bool>> condition) where T : class, new()
        {
            return dbContext.Set<T>().Where(condition);
        }
        #endregion

        #region 对象实体 查询
        public async Task<T> FindEntity<T>(object keyValue) where T : class
        {
            return await dbContext.Set<T>().FindAsync(keyValue);
        }
        public async Task<T> FindEntity<T>(Expression<Func<T, bool>> condition) where T : class, new()
        {
            return await dbContext.Set<T>().Where(condition).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<T>> FindList<T>() where T : class, new()
        {
            return await dbContext.Set<T>().ToListAsync();
        }
        public async Task<IEnumerable<T>> FindList<T>(Func<T, object> orderby) where T : class, new()
        {
            var list = await dbContext.Set<T>().ToListAsync();
            list = list.OrderBy(orderby).ToList();
            return list;
        }
        public async Task<IEnumerable<T>> FindList<T>(Expression<Func<T, bool>> condition) where T : class, new()
        {
            return await dbContext.Set<T>().Where(condition).ToListAsync();
        }
        public async Task<IEnumerable<T>> FindList<T>(string strSql) where T : class
        {
            return await FindList<T>(strSql, new DbParameter[0]);
        }
        public async Task<IEnumerable<T>> FindList<T>(string strSql, DbParameter[] dbParameter) where T : class
        {
            using (var dbConnection = dbContext.Database.GetDbConnection())
            {
                var reader = await ExecuteReadeAsync(dbConnection, dbConnection.CreateCommand(), CommandType.Text, strSql, dbParameter);
                return DatabasesExtension.IDataReaderToList<T>(reader);
            }
        }

        public async Task<IEnumerable<T>> FindList<T>(string strSql, Dictionary<String, Object> wParams) where T : class
        {
            if (wParams == null)
                wParams = new Dictionary<string, object>();
            DbParameter[] dbParameter = wParams.ChangeToDbParameterArray(_DbType);

            return await this.FindList<T>(strSql, dbParameter);
        }


        public async Task<(int total, IEnumerable<T> list)> FindList<T>(string sort, bool isAsc, int pageSize, int pageIndex) where T : class, new()
        {
            var tempData = dbContext.Set<T>().AsQueryable();
            return await FindList<T>(tempData, sort, isAsc, pageSize, pageIndex);
        }
        public async Task<(int total, IEnumerable<T> list)> FindList<T>(Expression<Func<T, bool>> condition, string sort, bool isAsc, int pageSize, int pageIndex) where T : class, new()
        {
            var tempData = dbContext.Set<T>().Where(condition);
            return await FindList<T>(tempData, sort, isAsc, pageSize, pageIndex);
        }
        public async Task<(int total, IEnumerable<T>)> FindList<T>(string strSql, string sort, bool isAsc, int pageSize, int pageIndex) where T : class
        {
            return await FindList<T>(strSql, new DbParameter[0], sort, isAsc, pageSize, pageIndex);
        }
        public async Task<(int total, IEnumerable<T>)> FindList<T>(string strSql, DbParameter[] dbParameter, string sort, bool isAsc, int pageSize, int pageIndex) where T : class
        {
            using (var dbConnection = dbContext.Database.GetDbConnection())
            {
                StringBuilder sb = new StringBuilder();
                sb.Append(DatabasePageExtension.SqlPageSql(strSql, _DbType, sort, isAsc, pageSize, pageIndex));

                DbCommand dbCommand = dbConnection.CreateCommand();


                object tempTotal = await ExecuteScalarAsync(dbConnection, dbCommand, CommandType.Text, "SELECT COUNT(0) FROM (" + strSql + ") T", dbParameter);
                int total = tempTotal.ParseToInt();
                if (total > 0)
                {
                    var reader = await ExecuteReadeAsync(dbConnection, dbCommand, CommandType.Text, sb.ToString(), dbParameter);
                    return (total, DatabasesExtension.IDataReaderToList<T>(reader));
                }
                else
                {
                    return (total, new List<T>());
                }
            }
        }

        public async Task<(int total, IEnumerable<T>)> FindList<T>(string strSql, Dictionary<String, Object> wParams, string sort, bool isAsc, int pageSize, int pageIndex) where T : class
        {
            if (wParams == null)
                wParams = new Dictionary<string, object>();
            DbParameter[] dbParameter = wParams.ChangeToDbParameterArray(_DbType);

            return await this.FindList<T>(strSql, dbParameter, sort, isAsc, pageSize, pageIndex);
        }

        private async Task<(int total, IEnumerable<T> list)> FindList<T>(IQueryable<T> tempData, string sort, bool isAsc, int pageSize, int pageIndex)
        {
            tempData = DatabasesExtension.AppendSort<T>(tempData, sort, isAsc);
            var total = tempData.Count();
            if (total > 0)
            {
                tempData = tempData.Skip<T>(pageSize * (pageIndex - 1)).Take<T>(pageSize).AsQueryable();
                var list = await tempData.ToListAsync();
                return (total, list);
            }
            else
            {
                return (total, new List<T>());
            }
        }
        #endregion

        #region 数据源查询
        public async Task<DataTable> FindTable(string strSql)
        {
            return await FindTable(strSql, new DbParameter[0]);
        }
        public async Task<DataTable> FindTable(string strSql, DbParameter[] dbParameter)
        {
            using (var dbConnection = dbContext.Database.GetDbConnection())
            {
                var reader = await ExecuteReadeAsync(dbConnection, dbConnection.CreateCommand(), CommandType.Text, strSql, dbParameter);
                return DatabasesExtension.IDataReaderToDataTable(reader);
            }
        }


        public async Task<DataTable> FindTable(string strSql, Dictionary<String, Object> wParams)
        {
            if (wParams == null)
                wParams = new Dictionary<string, object>();
            DbParameter[] dbParameter = wParams.ChangeToDbParameterArray(_DbType);
            return await this.FindTable(strSql, dbParameter);

        }
        public async Task<(int total, DataTable)> FindTable(string strSql, string sort, bool isAsc, int pageSize, int pageIndex)
        {
            return await FindTable(strSql, new DbParameter[0], sort, isAsc, pageSize, pageIndex);
        }
        public async Task<(int total, DataTable)> FindTable(string strSql, DbParameter[] dbParameter, string sort, bool isAsc, int pageSize, int pageIndex)
        {
            using (var dbConnection = dbContext.Database.GetDbConnection())
            {
                StringBuilder sb = new StringBuilder();
                sb.Append(DatabasePageExtension.SqlPageSql(strSql, _DbType, sort, isAsc, pageSize, pageIndex));

                DbCommand dbCommand = dbConnection.CreateCommand();

                object tempTotal = await ExecuteScalarAsync(dbConnection, dbCommand, CommandType.Text, "SELECT COUNT(0) FROM (" + strSql + ") T", dbParameter);
                int total = tempTotal.ParseToInt();
                if (total > 0)
                {
                    var reader = await ExecuteReadeAsync(dbConnection, dbCommand, CommandType.Text, sb.ToString(), dbParameter);
                    DataTable resultTable = DatabasesExtension.IDataReaderToDataTable(reader);
                    return (total, resultTable);
                }
                else
                {
                    return (total, new DataTable());
                }
            }
        }


        public async Task<(int total, DataTable)> FindTable(string strSql, Dictionary<String, Object> wParams, string sort, bool isAsc, int pageSize, int pageIndex)
        {
            if (wParams == null)
                wParams = new Dictionary<string, object>();
            DbParameter[] dbParameter = wParams.ChangeToDbParameterArray(_DbType);

            return await this.FindTable(strSql, dbParameter, sort, isAsc, pageSize, pageIndex);
        }

        public async Task<object> FindObject(string strSql)
        {
            return await FindObject(strSql, new DbParameter[0]);
        }
        public async Task<object> FindObject(string strSql, DbParameter[] dbParameter)
        {
            using (var dbConnection = dbContext.Database.GetDbConnection())
            {
                return await ExecuteScalarAsync(dbConnection, dbConnection.CreateCommand(), CommandType.Text, strSql, dbParameter);
            }
        }

        public async Task<object> FindObject(string strSql, Dictionary<String, Object> wParams)
        {
            if (wParams == null)
                wParams = new Dictionary<string, object>();
            DbParameter[] dbParameter = wParams.ChangeToDbParameterArray(_DbType);

            return await FindObject(strSql, dbParameter);
        }


        public async Task<T> FindObject<T>(string strSql) where T : class
        {
            var list = await dbContext.SqlQuery<T>(strSql);
            return list.FirstOrDefault();
        }


        #endregion




        /// <summary>
        /// 执行SQL返回 DataReader
        /// </summary>
        /// <param name="cmdType">命令的类型</param>
        /// <param name="strSql">Sql语句</param>
        /// <param name="dbParameter">Sql参数</param>
        /// <returns></returns>
        public async Task<IDataReader> ExecuteReadeAsync(DbConnection dbConnection, DbCommand dbCommand, CommandType cmdType, string strSql, params DbParameter[] dbParameter)
        {

            try
            {
                if (dbContext == null)
                {
                    PrepareCommand(dbConnection, dbCommand, null, cmdType, strSql, dbParameter);
                    var reader = await dbCommand.ExecuteReaderAsync(CommandBehavior.CloseConnection);
                    return reader;
                }
                else
                {
                    // 兼容EF Core的DbCommandInterceptor
                    var dependencies = ((IDatabaseFacadeDependenciesAccessor)dbContext.Database).Dependencies;
                    var relationalDatabaseFacade = (IRelationalDatabaseFacadeDependencies)dependencies;
                    var connection = relationalDatabaseFacade.RelationalConnection;
                    var logger = relationalDatabaseFacade.CommandLogger;
                    var commandId = Guid.NewGuid();

                    PrepareCommand(dbConnection, dbCommand, null, cmdType, strSql, dbParameter);

                    var startTime = DateTimeOffset.UtcNow;
                    var stopwatch = Stopwatch.StartNew();

                    var interceptionResult = logger == null
                       ? default
                       : await logger.CommandReaderExecutingAsync(
                           connection,
                           dbCommand,
                           dbContext,
                           Guid.NewGuid(),
                           connection.ConnectionId,
                           startTime);

                    var reader = interceptionResult.HasResult
                        ? interceptionResult.Result
                        : await dbCommand.ExecuteReaderAsync(CommandBehavior.CloseConnection);

                    if (logger != null)
                    {
                        reader = await logger.CommandReaderExecutedAsync(
                            connection,
                            dbCommand,
                            dbContext,
                            commandId,
                            connection.ConnectionId,
                            reader,
                            startTime,
                            stopwatch.Elapsed);
                    }
                    return reader;
                }
            }
            catch (Exception)
            {
                Close(dbConnection, dbCommand);
                throw;
            }
        }

        /// <summary>
        /// 执行查询，并返回查询所返回的结果集
        /// </summary>
        /// <param name="cmdType">命令的类型</param>
        /// <param name="strSql">Sql语句</param>
        /// <param name="dbParameter">Sql参数</param>
        /// <returns></returns>
        public async Task<object> ExecuteScalarAsync(DbConnection dbConnection, DbCommand dbCommand, CommandType cmdType, string strSql, params DbParameter[] dbParameter)
        {

            try
            {
                if (dbContext == null)
                {
                    PrepareCommand(dbConnection, dbCommand, null, cmdType, strSql, dbParameter);
                    var obj = await dbCommand.ExecuteScalarAsync();
                    dbCommand.Parameters.Clear();
                    return obj;
                }
                else
                {
                    // 兼容EF Core的DbCommandInterceptor
                    var dependencies = ((IDatabaseFacadeDependenciesAccessor)dbContext.Database).Dependencies;
                    var relationalDatabaseFacade = (IRelationalDatabaseFacadeDependencies)dependencies;
                    var connection = relationalDatabaseFacade.RelationalConnection;
                    var logger = relationalDatabaseFacade.CommandLogger;
                    var commandId = Guid.NewGuid();

                    PrepareCommand(dbConnection, dbCommand, null, cmdType, strSql, dbParameter);

                    var startTime = DateTimeOffset.UtcNow;
                    var stopwatch = Stopwatch.StartNew();

                    var interceptionResult = logger == null
                       ? default
                       : await logger.CommandScalarExecutingAsync(
                           connection,
                           dbCommand,
                           dbContext,
                           Guid.NewGuid(),
                           connection.ConnectionId,
                           startTime);

                    var obj = interceptionResult.HasResult
                        ? interceptionResult.Result
                        : await dbCommand.ExecuteScalarAsync();

                    if (logger != null)
                    {
                        obj = await logger.CommandScalarExecutedAsync(
                            connection,
                            dbCommand,
                            dbContext,
                            commandId,
                            connection.ConnectionId,
                            obj,
                            startTime,
                            stopwatch.Elapsed);
                    }
                    return obj;
                }
            }
            catch (Exception)
            {
                Close(dbConnection, dbCommand);
                throw;
            }
        }

        /// <summary>
        /// 为即将执行准备一个命令
        /// </summary>
        /// <param name="conn">SqlConnection对象</param>
        /// <param name="cmd">SqlCommand对象</param>
        /// <param name="isOpenTrans">DbTransaction对象</param>
        /// <param name="cmdType">执行命令的类型（存储过程或T-SQL，等等）</param>
        /// <param name="strSql">存储过程名称或者T-SQL命令行, e.g. Select * from Products</param>
        /// <param name="dbParameter">执行命令所需的sql语句对应参数</param>
        private void PrepareCommand(DbConnection conn, IDbCommand cmd, DbTransaction isOpenTrans, CommandType cmdType, string strSql, params DbParameter[] dbParameter)
        {
            if (conn.State != ConnectionState.Open)
            {
                conn.Open();
            }
            cmd.Connection = conn;
            cmd.CommandText = strSql;
            cmd.CommandTimeout = RepositoryFactory.DBCommandTimeOut;
            if (isOpenTrans != null)
            {
                cmd.Transaction = isOpenTrans;
            }
            cmd.CommandType = cmdType;
            if (dbParameter != null)
            {
                cmd.Parameters.Clear();
                dbParameter = DbParameterExtension.ToDbParameter(dbParameter, this.DbType);
                foreach (var parameter in dbParameter)
                {
                    cmd.Parameters.Add(parameter);
                }
            }
        }


        public void Close(DbConnection dbConnection, DbCommand dbCommand)
        {
            if (dbConnection != null)
            {
                dbConnection.Close();
                dbConnection.Dispose();
            }
            if (dbCommand != null)
            {
                dbCommand.Dispose();
            }
        }


    }
}
